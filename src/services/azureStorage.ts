import { BlobServiceClient } from '@azure/storage-blob';

export class AzureStorageService {
  private blobServiceClient: BlobServiceClient;
  private containerName: string;
  private accountName: string;
  private sasToken: string;

  constructor() {
    this.accountName = import.meta.env.VITE_AZURE_STORAGE_ACCOUNT_NAME;
    this.sasToken = import.meta.env.VITE_AZURE_SAS_TOKEN;
    this.containerName = import.meta.env.VITE_AZURE_STORAGE_CONTAINER_NAME;
    
    if (!this.accountName || !this.sasToken || !this.containerName) {
      throw new Error('Azure Storage configuration is missing');
    }

    const sasUrl = this.buildSasUrl();
    this.blobServiceClient = new BlobServiceClient(sasUrl);
  }

  private buildSasUrl(): string {
    return `https://${this.accountName}.blob.core.windows.net/?${this.sasToken}`;
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

  async downloadBlob(blobName: string): Promise<Blob> {
    try {
      // Construct the direct blob URL with SAS token
      const blobUrl = `https://${this.accountName}.blob.core.windows.net/${this.containerName}/${blobName}?${this.sasToken}`;
      
      // Fetch the blob directly using the URL
      const response = await fetch(blobUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error downloading blob:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }
}