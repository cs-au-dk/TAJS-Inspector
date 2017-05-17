import {Injectable} from '@angular/core';
import {Landmark} from './landmark';

@Injectable()
export class BookmarkService {
  bookmarks: Landmark[] = [];
  subscribers: ((landmarks: Landmark[]) => void)[] = [];

  constructor() {
  }

  addBookmark(landmark: Landmark): void {
    this.bookmarks.push(landmark);
    this.notify();
  }

  removeBookmark(landmark: Landmark): void {
    this.bookmarks = this.bookmarks.filter(b => b.fileID !== landmark.fileID || b.line !== landmark.line);
    this.notify();
  }

  getBookmarks(file: FileDescription): Landmark[] {
    return this.bookmarks.filter(b => b.fileID === file.id);
  }

  subscribe(fn: (landmarks: Landmark[]) => void): void {
    this.subscribers.push(fn);
  }

  private notify() {
    this.subscribers.forEach(s => s(this.bookmarks));
  }
}
