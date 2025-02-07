export class OpenAIService {
  private endpoint: string;
  private key: string;
  private deploymentId: string;

  constructor() {
    this.endpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
    this.key = import.meta.env.VITE_AZURE_OPENAI_APIKEY;
    this.deploymentId = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT_ID;

    if (!this.endpoint || !this.key || !this.deploymentId) {
      throw new Error('Azure OpenAI configuration is missing');
    }

    this.endpoint = this.endpoint.replace(/\/$/, '');
  }

  async generateInsight(transcriptionText: string, prompt: string): Promise<string> {
    if (!transcriptionText || !prompt) {
      throw new Error('Transcription text and prompt are required');
    }

    try {
      const url = `${this.endpoint}/openai/deployments/${this.deploymentId}/chat/completions?api-version=2024-02-15-preview`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.key,
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `Sei un assistente AI esperto nell'analisi di trascrizioni e nella generazione di insight strutturati.
                       Fornisci sempre risposte ben strutturate e dettagliate in lingua italiana.
                       
                       IMPORTANTE: Formatta SEMPRE la risposta usando la sintassi Markdown seguendo queste regole:
                       
                       1. Usa i titoli appropriati:
                          - # per il titolo principale
                          - ## per le sezioni principali
                          - ### per le sottosezioni
                       
                       2. Enfatizza i punti importanti:
                          - **testo in grassetto** per concetti chiave
                          - *testo in corsivo* per enfasi secondaria
                       
                       3. Per le liste usa:
                          - Elenchi puntati con - per liste non ordinate
                          - 1. 2. 3. per liste numerate/ordinate
                       
                       4. Per citazioni dirette usa:
                          > testo citato
                       
                       5. Usa la spaziatura appropriata:
                          - Lascia una riga vuota tra paragrafi
                          - Lascia una riga vuota prima e dopo titoli
                          - Lascia una riga vuota prima e dopo liste
                       
                       6. Per evidenziare informazioni importanti usa:
                          \`\`\`
                          blocchi di testo in evidenza
                          \`\`\`
                       
                       Assicurati che la formattazione sia consistente e migliori la leggibilità del contenuto.`
            },
            {
              role: 'user',
              content: `Analizza la seguente trascrizione e genera un insight basato sul prompt fornito.
                       
                       Trascrizione:
                       ${transcriptionText}
                       
                       Prompt:
                       ${prompt}`
            }
          ],
          temperature: 0.7,
          max_tokens: 4000,
          top_p: 0.95,
          frequency_penalty: 0,
          presence_penalty: 0,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `OpenAI API error (${response.status}): ${
            errorData?.error?.message || response.statusText
          }`
        );
      }

      const data = await response.json();
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from OpenAI API');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating insight:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Impossibile generare l'insight: ${errorMessage}`);
    }
  }
}