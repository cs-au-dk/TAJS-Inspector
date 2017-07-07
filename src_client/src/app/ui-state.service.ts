import {Injectable} from '@angular/core';
import * as CodeMirror from 'codemirror';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {CodeService} from './code.service';
import {Landmark} from './landmark';

@Injectable()
export class UIStateStore {
  private _file: BehaviorSubject<FileDescription> = new BehaviorSubject({id: '', name: '', content: ''});
  private _cursorPosition: BehaviorSubject<CodeMirror.Position> = new BehaviorSubject({ch: 0, line: 0});
  private _context: BehaviorSubject<DescribedContext> = new BehaviorSubject(<DescribedContext>{});
  private _jumpHistory: BehaviorSubject<Landmark[]> = new BehaviorSubject([]);
  private _bookmarks: BehaviorSubject<Landmark[]> = new BehaviorSubject([]);

  public readonly file: Observable<FileDescription> = this._file.asObservable();
  public readonly cursorPosition: Observable<CodeMirror.Position> = this._cursorPosition.asObservable();
  public readonly context: Observable<DescribedContext> = this._context.asObservable();
  public readonly jumpHistory: Observable<Landmark[]> = this._jumpHistory.asObservable();
  public readonly bookmarks: Observable<Landmark[]> = this._bookmarks.asObservable();

  constructor(private codeService: CodeService) {
  }

  changeFile(file: FileDescription): void {
    if (file.id === this._file.getValue().id) {
      return;
    }
    this._file.next(file);
  }

  changeCursorPosition(position: CodeMirror.Position): void {
    if (position === this._cursorPosition.getValue()) {
      return;
    }
    this._cursorPosition.next(position);
  }

  changeFileAndPosition(fileID: FileID, position: CodeMirror.Position): Observable<void> {
    return Observable.fromPromise(this.codeService
      .getFile(fileID)
      .then(f => {
        this.changeFile(f);
        this.changeCursorPosition(position);
      }))
  }

  changeContext(context: DescribedContext): void {
    if (context === this._context.getValue()) {
      return;
    }
    this._context.next(context);
  }

  addToJumpHistory(landmark: Landmark): void {
    this._jumpHistory.getValue().unshift(landmark);
    this._jumpHistory.next(this._jumpHistory.getValue());
  }

  emptyJumpHistory(): void {
    this._jumpHistory.next([]);
  }

  addBookmark(landmark: Landmark): void {
    this._bookmarks.getValue().push(landmark);
    this._bookmarks.next(this._bookmarks.getValue());
  }

  removeBookmark(landmark: Landmark): void {
    this._bookmarks.next(this._bookmarks.getValue()
      .filter(b => b.file !== landmark.file || b.line !== landmark.line));
  }

  getBookmarks(file: FileDescription): Landmark[] {
    return this._bookmarks.getValue().filter(b => b.file === file.id);
  }

  getCurrentFile(): FileDescription {
    return this._file.getValue();
  }

  getCurrentPosition(): CodeMirror.Position {
    return this._cursorPosition.getValue();
  }

  getCurrentContext(): DescribedContext {
    return this._context.getValue();
  }

  getCurrentJumpHistory(): Landmark[] {
    return this._jumpHistory.getValue();
  }
}
