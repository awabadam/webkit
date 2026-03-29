export interface StorageProvider {
  upload(
    file: Buffer,
    filename: string,
    mimeType: string
  ): Promise<StorageResult>;
  delete(key: string): Promise<void>;
  getUrl(key: string): string;
  exists(key: string): Promise<boolean>;
}

export interface StorageResult {
  key: string;
  url: string;
  size: number;
}
