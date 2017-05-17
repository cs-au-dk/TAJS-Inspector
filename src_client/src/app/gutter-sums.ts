import {Dictionary} from './dictionary';
export interface GutterSums {
  fileID: FileID,
  name: string,
  sums: Dictionary<number>
}
