export class Landmark {
  fileID: FileID;
  line: number;
  description: string;

  constructor(fileID: FileID, line: number, description: string) {
    this.fileID = fileID;
    this.line = line;
    this.description = description;
  }
}
