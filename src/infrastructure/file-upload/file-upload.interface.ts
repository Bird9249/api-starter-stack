export interface IFileUpload {
  upload(path: string, file: File): Promise<string>;

  remove(path: string): Promise<void>;
}
