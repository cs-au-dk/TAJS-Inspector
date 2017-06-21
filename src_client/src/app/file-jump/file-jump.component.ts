import {Component, EventEmitter, HostListener, Input, OnInit, Output} from "@angular/core";
import {isUndefined} from "util";
import {Landmark} from "../landmark";
import {CodeService} from "../code.service";
import {Dictionary} from "../dictionary";
import {BookmarkService} from "../bookmark.service";
import {SettingsService} from "../settings.service";
import {Utility} from "../utility";

enum JUMP_DIRECTION {
  UP, DOWN
}
@Component({
  selector: 'app-jump',
  templateUrl: 'file-jump.component.html',
  styleUrls: ['file-jump.component.css']
})
export class FileJumpComponent implements OnInit {
  @Input() selectedFile: FileDescription;
  @Output() jump: EventEmitter<Landmark> = new EventEmitter();
  JUMP_DIRECTION = JUMP_DIRECTION;

  sortedLines: Dictionary<[{ fileID: string, line: number, value: number }]>;
  bookmarks: Landmark[] = [];
  jumpGutter: string;
  jumpIndex: number = 0;
  jumpHistory: Landmark[] = [];
  visibleGutters: string[];
  selectedGutter;

  historyBackLevel: number = 0;

  constructor(private codeService: CodeService,
              private boookmarkService: BookmarkService,
              private settingsService: SettingsService) {
  }

  ngOnInit() {
    // 'Hack' together with host listener on window:popstate for overriding browser back
    history.pushState(null, document.title, location.href);

    let storedGutters = this.settingsService.getVisibleGutters();
    this.codeService.getAvailableGutters()
      .then(availableGutters => this.visibleGutters = availableGutters
        .map(g => g.name)
        .filter(g => storedGutters.indexOf(g) !== -1));
    this.codeService.getSortedLineData().then((s: Dictionary<any>) => this.sortedLines = s);
    this.boookmarkService.subscribe(b => this.bookmarks = b);
  }

  setJumpGutter(gutter: string) {
    // Highlight name column
    if (this.jumpGutter != undefined) {
      let prev = document.getElementsByClassName(Utility.getGutterID(this.jumpGutter));
      (<HTMLElement>prev[0]).style.backgroundColor = '';
    }
    let next = document.getElementsByClassName(Utility.getGutterID(gutter));
    (<HTMLElement>next[0]).style.backgroundColor = '#E8F2FF';

    this.jumpGutter = gutter;
    this.jumpIndex = 0;
    this.doJump();
  }

  doJumpDirection(direction: JUMP_DIRECTION) {
    if (isUndefined(this.jumpGutter)) return;
    if (direction === JUMP_DIRECTION.DOWN) this.jumpIndex++;
    if (direction === JUMP_DIRECTION.UP) this.jumpIndex = Math.max(this.jumpIndex - 1, 0);

    this.doJump();
  }

  doJump(landmark?: Landmark) {
    if (!this.jumpGutter) return;

    let destination = (landmark) ? landmark : new Landmark(
      this.sortedLines[this.jumpGutter][this.jumpIndex].fileID
      , this.sortedLines[this.jumpGutter][this.jumpIndex].line
      , `${this.jumpGutter} (${this.jumpIndex})`);

    this.jump.emit(destination);
    if (!landmark) this.addToHistory(destination);
  }

  addToHistory(landmark: Landmark) {
    let l = this.jumpHistory[0];
    if (l && l.fileID === landmark.fileID && l.line === landmark.line && l.description === landmark.description) {
      return;
    }

    this.jumpHistory.unshift(landmark)
  }

  @HostListener('window:popstate', ['$event'])
  windowPopState(event: PopStateEvent) {
    history.pushState(null, document.title, location.href);

    if (this.jumpHistory[this.historyBackLevel]) {
      this.doJump(this.jumpHistory[this.historyBackLevel]);
      this.historyBackLevel++;
    }
  }

  @HostListener('window:click')
  windowClick() {
    this.historyBackLevel = 0;
  }

  @HostListener('window:keydown', ['$event'])
  windowKeyDown(event: KeyboardEvent) {
    if (!event.ctrlKey) return;

    switch (event.keyCode) {
      case 38: // ctrl + arrow-up
        this.doJumpDirection(JUMP_DIRECTION.UP);
        break;
      case 40: // ctrl + arrow-down
        this.doJumpDirection(JUMP_DIRECTION.DOWN);
        break;
      default:
        break;
    }
  }
}
