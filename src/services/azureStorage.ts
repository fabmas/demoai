import { BlobServiceClient } from '@azure/storage-blob';

export class AzureStorageService {
  private blobServiceClient: BlobServiceClient;
  private containerName: string;

  constructor() {
    const sasUrl = this.buildSasUrl();
    this.blobServiceClient = new BlobServiceClient(sasUrl);
    this.containerName = import.meta.env.VITE_AZURE_STORAGE_CONTAINER_NAME;
    
    if (!this.containerName) {
      throw new Error('Azure Storage container name is missing');
    }
  }

  private buildSasUrl(): string {
    const accountName = import.meta.env.VITE_AZURE_STORAGE_ACCOUNT_NAME;
    const sasToken = import.meta.env.VITE_AZURE_SAS_TOKEN;
    
    if (!accountName || !sasToken) {
      throw new Error('Azure Storage configuration is missing');
    }

    return `https://${accountName}.blob.core.windows.net/?${sasToken}`;
  }

  async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<string> {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const blobName = `${Date.now()}-${file.name}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      
      const options = {
        blobHTTPHeaders: {
          blobContentType: file.type || 'application/octet-stream'
        },
        onProgress: (ev: { loadedBytes: number }) => {
          if (onProgress) {
            const percentComplete = Math.round((ev.loadedBytes / file.size) * 100);
            onProgress(percentComplete);
          }
        }
      };

      await blockBlobClient.uploadData(file, options);
      return blockBlobClient.url;
    } catch (error) {
      console.error('Error uploading file:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }
}
