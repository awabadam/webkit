import sharp from "sharp";

export interface ProcessedImage {
  buffer: Buffer;
  width: number;
  height: number;
  size: number;
  format: string;
}

export async function processImage(
  buffer: Buffer,
  options?: { maxWidth?: number; quality?: number }
): Promise<ProcessedImage> {
  const maxWidth = options?.maxWidth ?? 1920;
  const quality = options?.quality ?? 80;

  const processed = await sharp(buffer)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .jpeg({ quality, mozjpeg: true })
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: processed.data,
    width: processed.info.width,
    height: processed.info.height,
    size: processed.info.size,
    format: "jpeg",
  };
}
