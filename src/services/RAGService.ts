export class RAGService {
  private searchEndpoint: string;
  private searchKey: string;
  private openAIEndpoint: string;
  private openAIKey: string;
  private openAIDeploymentId: string;
  private indexName = 'transcriptions';
  private initialized = false;
  private initializationPromise: Promise<void> | null = null;

  constructor() {
    // Get configuration from environment variables
    this.searchEndpoint = import.meta.env.VITE_AZURE_AISEARCH_ENDPOINT;
    this.searchKey = import.meta.env.VITE_AZURE_AISEARCH_KEY;
    this.openAIEndpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
    this.openAIKey = import.meta.env.VITE_AZURE_OPENAI_APIKEY;
    this.openAIDeploymentId = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT_ID;

    // Validate configuration
    if (!this.searchEndpoint || !this.searchKey) {
      throw new Error('Azure AI Search configuration is missing. Please check your environment variables.');
    }

    if (!this.openAIEndpoint || !this.openAIKey || !this.openAIDeploymentId) {
      throw new Error('Azure OpenAI configuration is missing. Please check your environment variables.');
    }

    // Remove trailing slashes
    this.searchEndpoint = this.searchEndpoint.replace(/\/$/, '');
    this.openAIEndpoint = this.openAIEndpoint.replace(/\/$/, '');
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = (async () => {
      try {
        // Check if index exists
        const indexResponse = await fetch(
          `${this.searchEndpoint}/indexes/${this.indexName}?api-version=2023-11-01`,
          {
            method: 'GET',
            headers: {
              'api-key': this.searchKey,
              'Content-Type': 'application/json'
            }
          }
        );

        // If index doesn't exist, create it
        if (indexResponse.status === 404) {
          const indexDefinition = {
            name: this.indexName,
            fields: [
              {
                name: "id",
                type: "Edm.String",
                key: true,
                searchable: false
              },
              {
                name: "content",
                type: "Edm.String",
                searchable: true,
                filterable: false,
                sortable: false,
                facetable: false,
                analyzer: "it.lucene"
              },
              {
                name: "transcriptionId",
                type: "Edm.String",
                searchable: false,
                filterable: true,
                sortable: false,
                facetable: true
              },
              {
                name: "fileName",
                type: "Edm.String",
                searchable: true,
                filterable: true,
                sortable: true,
                facetable: true
              },
              {
                name: "timestamp",
                type: "Edm.DateTimeOffset",
                searchable: false,
                filterable: true,
                sortable: true,
                facetable: false
              }
            ],
            semantic: {
              configurations: [
                {
                  name: "default",
                  prioritizedFields: {
                    titleField: {
                      fieldName: "fileName"
                    },
                    contentFields: [
                      {
                        fieldName: "content"
                      }
                    ]
                  }
                }
              ]
            },
            corsOptions: {
              allowedOrigins: ["*"],
              maxAgeInSeconds: 300
            }
          };

          const createResponse = await fetch(
            `${this.searchEndpoint}/indexes?api-version=2023-11-01`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'api-key': this.searchKey
              },
              body: JSON.stringify(indexDefinition)
            }
          );

          if (!createResponse.ok) {
            const errorData = await createResponse.json();
            throw new Error(`Failed to create search index: ${errorData.error?.message || createResponse.statusText}`);
          }

          // Wait for index to be ready
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else if (!indexResponse.ok) {
          const errorData = await indexResponse.json();
          throw new Error(`Failed to check search index: ${errorData.error?.message || indexResponse.statusText}`);
        }

        this.initialized = true;
      } catch (error) {
        this.initialized = false;
        this.initializationPromise = null;
        throw error;
      }
    })();

    return this.initializationPromise;
  }

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) {
      return;
    }

    let retries = 3;
    let lastError: Error | null = null;

    while (retries > 0) {
      try {
        await this.initialize();
        return;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        retries--;
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    throw lastError || new Error('Failed to initialize after retries');
  }

  async indexTranscription(transcriptionId: string, fileName: string, content: string): Promise<void> {
    await this.ensureInitialized();

    try {
      // Split content into chunks
      const chunks = this.splitTextIntoChunks(content);

      // Prepare documents for indexing
      const documents = chunks.map((chunk, index) => ({
        id: `${transcriptionId}-${index}`,
        content: chunk,
        transcriptionId: transcriptionId,
        fileName: fileName,
        timestamp: new Date().toISOString()
      }));

      // Index documents in batches
      const batchSize = 1000;
      for (let i = 0; i < documents.length; i += batchSize) {
        const batch = documents.slice(i, i + batchSize);
        const response = await fetch(
          `${this.searchEndpoint}/indexes/${this.indexName}/docs/index?api-version=2023-11-01`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'api-key': this.searchKey
            },
            body: JSON.stringify({ value: batch })
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to index documents: ${errorData.error?.message || response.statusText}`);
        }
      }
    } catch (error) {
      throw new Error(`Failed to index transcription: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private splitTextIntoChunks(text: string, maxChunkSize: number = 1000): string[] {
    const chunks: string[] = [];
    const sentences = text.split(/(?<=[.!?])\s+/);
    let currentChunk = '';

    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > maxChunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }
      currentChunk += (currentChunk ? ' ' : '') + sentence;
    }

    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }

  private extractCitations(text: string): string[] {
    const matches = text.match(/\[([^\]]+)\]/g);
    if (!matches) return [];
    return matches.map(match => match.slice(1, -1));
  }

  async getAnswer(question: string, history: Message[]): Promise<RAGResponse> {
    await this.ensureInitialized();

    try {
      // Search for relevant content
      const searchResponse = await fetch(
        `${this.searchEndpoint}/indexes/${this.indexName}/docs/search?api-version=2023-11-01`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': this.searchKey
          },
          body: JSON.stringify({
            search: question,
            select: ['content', 'fileName'],
            queryType: 'semantic',
            semanticConfiguration: 'default',
            queryLanguage: 'it-IT',
            captions: 'extractive',
            answers: 'extractive',
            top: 5
          })
        }
      );

      if (!searchResponse.ok) {
        const errorData = await searchResponse.json();
        throw new Error(`Search API error: ${errorData.error?.message || searchResponse.statusText}`);
      }

      const searchData = await searchResponse.json();
      const results = searchData.value || [];

      if (results.length === 0) {
        return {
          message: {
            role: 'assistant',
            content: 'Mi dispiace, non ho trovato informazioni pertinenti nelle trascrizioni per rispondere alla tua domanda.'
          },
          citations: [],
          context: {
            data_points: []
          }
        };
      }

      // Prepare messages for OpenAI
      const messages = [
        {
          role: 'system',
          content: `Sei un assistente AI esperto nell'analisi di trascrizioni audio. 
                   Rispondi alle domande basandoti solo sul contenuto delle trascrizioni fornite.
                   Cita sempre le fonti usando il formato [nome_file].
                   Se non trovi informazioni pertinenti nelle trascrizioni, dillo chiaramente.
                   Usa un tono professionale e formale.`
        },
        ...history,
        {
          role: 'user',
          content: `Domanda: ${question}\n\nContesto dalle trascrizioni:\n${
            results.map((r: any) => `[${r.fileName}]: ${r.content}`).join('\n\n')
          }`
        }
      ];

      // Get completion from Azure OpenAI
      const openAIResponse = await fetch(
        `${this.openAIEndpoint}/openai/deployments/${this.openAIDeploymentId}/chat/completions?api-version=2024-02-15-preview`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': this.openAIKey
          },
          body: JSON.stringify({
            messages,
            temperature: 0.7,
            max_tokens: 800,
            top_p: 0.95,
            frequency_penalty: 0,
            presence_penalty: 0
          })
        }
      );

      if (!openAIResponse.ok) {
        const errorData = await openAIResponse.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || openAIResponse.statusText}`);
      }

      const data = await openAIResponse.json();
      const answer = data.choices[0].message.content;

      // Extract citations using the dedicated method
      const citations = this.extractCitations(answer);

      return {
        message: {
          role: 'assistant',
          content: answer
        },
        citations: citations,
        context: {
          data_points: results.map((r: any) => `[${r.fileName}]: ${r.content}`)
        }
      };
    } catch (error) {
      throw new Error(`Failed to get answer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
  context?: {
    thoughts?: any[];
    data_points?: string[];
  };
}

interface RAGResponse {
  message: {
    role: 'assistant';
    content: string;
  };
  citations: string[];
  context: {
    thoughts?: any[];
    data_points?: string[];
  };
}