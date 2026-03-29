import type { StorageProvider, StorageResult } from "./types";

export class S3StorageProvider implements StorageProvider {
  async upload(): Promise<StorageResult> {
    throw new Error("S3 storage not implemented yet");
  }

  async delete(): Promise<void> {
    throw new Error("S3 storage not implemented yet");
  }

  getUrl(): string {
    throw new Error("S3 storage not implemented yet");
  }

  async exists(): Promise<boolean> {
    throw new Error("S3 storage not implemented yet");
  }
}
