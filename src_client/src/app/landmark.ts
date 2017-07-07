export class Landmark {
  file: FileID;
  line: number;
  description: string;

  constructor(file: FileID, line: number, description: string) {
    this.file = file;
    this.line = line;
    this.description = description;
  }
}
