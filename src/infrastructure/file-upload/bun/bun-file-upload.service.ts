import { write } from "bun";
import { unlink } from "node:fs/promises";
import { IFileUpload } from "../file-upload.interface";

export class BunFileUpload implements IFileUpload {
  async upload(path: string, file: File): Promise<string> {
    const splitFileName = file.name.split(".");

    const newFileName = this.generateUniqueFilename(
      splitFileName[0],
      splitFileName[1]
    );
    const filePath = path + newFileName;

    await write(filePath, file);

    return filePath;
  }

  async remove(path: string): Promise<void> {
    await unlink(path);
  }

  private generateUniqueFilename(base: string, extension: string): string {
    const randomString = Math.random().toString(36).substring(2, 15);
    const filename = `${base}-${randomString}.${extension}`;

    return filename;
  }

  private static instance: BunFileUpload;
  public static getInstance(): BunFileUpload {
    if (!BunFileUpload.instance) {
      BunFileUpload.instance = new BunFileUpload();
    }

    return BunFileUpload.instance;
  }
}
