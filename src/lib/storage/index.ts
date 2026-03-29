import type { StorageProvider } from "./types";
import { LocalStorageProvider } from "./local";
import { S3StorageProvider } from "./s3";

function createProvider(): StorageProvider {
  const provider = process.env.STORAGE_PROVIDER || "local";

  switch (provider) {
    case "s3":
      return new S3StorageProvider();
    case "local":
    default:
      return new LocalStorageProvider();
  }
}

export const storage = createProvider();
export type { StorageProvider, StorageResult } from "./types";
