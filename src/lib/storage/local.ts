import fs from "node:fs/promises";
import path from "node:path";
import { createId } from "@paralleldrive/cuid2";
import type { StorageProvider, StorageResult } from "./types";

export class LocalStorageProvider implements StorageProvider {
  private baseDir: string;

  constructor(baseDir?: string) {
    this.baseDir = baseDir || process.env.UPLOAD_DIR || "./uploads";
  }

  async upload(
    file: Buffer,
    filename: string,
    _mimeType: string
  ): Promise<StorageResult> {
    const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `${createId()}-${sanitized}`;
    const filePath = path.join(this.baseDir, key);

    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, file);

    return {
      key,
      url: `/api/uploads/${key}`,
      size: file.length,
    };
  }

  async delete(key: string): Promise<void> {
    const filePath = path.join(this.baseDir, key);
    await fs.unlink(filePath).catch(() => {});
  }

  getUrl(key: string): string {
    return `/api/uploads/${key}`;
  }

  async exists(key: string): Promise<boolean> {
    const filePath = path.join(this.baseDir, key);
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}
