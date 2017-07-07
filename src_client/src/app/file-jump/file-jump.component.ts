import {Component, HostListener, OnInit} from '@angular/core';
import {isUndefined} from 'util';
import {CodeService} from '../code.service';
import {Dictionary} from '../dictionary';
import {Landmark} from '../landmark';
import {SettingsService} from '../settings.service';
import {UIStateStore} from '../ui-state.service';
import {Utility} from '../utility';

enum JUMP_DIRECTION {
  UP, DOWN
}
@Component({
  selector: 'app-jump',
  templateUrl: 'file-jump.component.html',
  styleUrls: ['file-jump.component.css']
})
export class FileJumpComponent implements OnInit {
  JUMP_DIRECTION = JUMP_DIRECTION;
  sortedLines: Dictionary<[{ fileID: string, line: number, value: number }]>;
  jumpGutter: string;
  jumpIndex = 0;
  visibleGutters: string[];
  selectedGutter;
  historyBackLevel = 0;

  constructor(private codeService: CodeService,
              private settingsService: SettingsService,
              public uiStateStore: UIStateStore) {
  }

  ngOnInit() {
    const storedGutters = this.settingsService.getVisibleGutters();
    this.codeService.getAvailableGutters()
      .then(availableGutters => this.visibleGutters = availableGutters
        .map(g => g.name)
        .filter(g => storedGutters.indexOf(g) !== -1));
    this.codeService.getSortedLineData().then((s: Dictionary<any>) => this.sortedLines = s);

    // 'Hack' together with host listener on window:popstate for overriding browser back
    history.pushState(null, document.title, location.href);
  }

  setJumpGutter(gutter: string) {
    // Highlight name column
    if (this.jumpGutter !== undefined) {
      const prev = document.getElementsByClassName(Utility.getGutterID(this.jumpGutter));
      (<HTMLElement>prev[0]).style.backgroundColor = '';
    }
    const next = document.getElementsByClassName(Utility.getGutterID(gutter));
    (<HTMLElement>next[0]).style.backgroundColor = '#E8F2FF';

    this.jumpGutter = gutter;
    this.jumpIndex = 0;
    this.doJump();
  }

  doJumpDirection(direction: JUMP_DIRECTION) {
    if (isUndefined(this.jumpGutter)) {
      return;
    }
    if (direction === JUMP_DIRECTION.DOWN) {
      this.jumpIndex++;
    } else if (direction === JUMP_DIRECTION.UP) {
      this.jumpIndex = Math.max(this.jumpIndex - 1, 0);
    }
    this.doJump();
  }

  doJump(landmark?: Landmark) {
    const destination = (landmark) ? landmark : new Landmark(
      <FileID>this.sortedLines[this.jumpGutter][this.jumpIndex].fileID
      , this.sortedLines[this.jumpGutter][this.jumpIndex].line
      , `${this.jumpGutter} (${this.jumpIndex})`);
    this.uiStateStore.changeFileAndPosition(destination.file, {line: destination.line - 1, ch: 0});
    if (!landmark) {
      this.uiStateStore.addToJumpHistory(destination);
    }
  }

  goHistoryBack() {
    const jumpHistory = this.uiStateStore.getCurrentJumpHistory();
    if (jumpHistory[this.historyBackLevel]) {
      this.doJump(jumpHistory[this.historyBackLevel]);
      this.historyBackLevel++;
    }
  }

  goHistoryForwards() {
    const jumpHistory = this.uiStateStore.getCurrentJumpHistory();
    if (jumpHistory[this.historyBackLevel - 1]) {
      this.historyBackLevel--;
      this.doJump(jumpHistory[this.historyBackLevel - 1]);
    }
  }

  @HostListener('window:popstate', ['$event'])
  windowPopState(event: PopStateEvent) {
    history.pushState(null, document.title, location.href);
    this.goHistoryBack();
  }

  @HostListener('window:keydown', ['$event'])
  windowKeyDown(event: KeyboardEvent) {
    if (!event.ctrlKey) {
      return;
    }
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
