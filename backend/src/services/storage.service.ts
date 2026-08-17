export interface UploadResult {
  url: string;
  storageKey: string;
}

export interface IStorageService {
  /**
   * Upload a video buffer or file stream to the storage provider
   */
  uploadVideo(fileBuffer: Buffer, fileName: string, mimetype: string): Promise<UploadResult>;
  
  /**
   * Generate a temporary signed URL for secure viewing
   */
  getSignedUrl(storageKey: string): Promise<string>;
  
  /**
   * Delete a video from storage
   */
  deleteVideo(storageKey: string): Promise<boolean>;
}

/**
 * Mock Storage Provider Implementation
 * To be replaced with Cloudinary/S3 provider in production
 */
class MockStorageService implements IStorageService {
  async uploadVideo(fileBuffer: Buffer, fileName: string, mimetype: string): Promise<UploadResult> {
    console.log(`[MockStorage] Uploading ${fileName} (${fileBuffer.length} bytes)`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockKey = `vid_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    return {
      url: `https://mock-storage.example.com/${mockKey}.mp4`,
      storageKey: mockKey
    };
  }

  async getSignedUrl(storageKey: string): Promise<string> {
    console.log(`[MockStorage] Generating signed URL for ${storageKey}`);
    return `https://mock-storage.example.com/signed/${storageKey}?expires=${Date.now() + 3600000}`;
  }

  async deleteVideo(storageKey: string): Promise<boolean> {
    console.log(`[MockStorage] Deleting video ${storageKey}`);
    return true;
  }
}

// Factory to select the correct implementation based on ENV
const getStorageProvider = (): IStorageService => {
  const provider = process.env.STORAGE_PROVIDER || 'mock';
  
  if (provider === 'cloudinary') {
    throw new Error('Cloudinary provider not yet implemented');
  }
  
  return new MockStorageService();
};

export const StorageService = getStorageProvider();
