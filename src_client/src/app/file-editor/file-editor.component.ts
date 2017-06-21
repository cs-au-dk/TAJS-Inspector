import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/search/match-highlighter';
import 'codemirror/addon/search/jump-to-line';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/display/fullscreen';
import {CodeMirrorComponent} from '../code-mirror/code-mirror.component';
import {Landmark} from '../landmark';
import {CodeService} from '../code.service';
import {ElementBuilder} from '../element-builder';
import {BookmarkService} from '../bookmark.service';
import {SettingsService} from '../settings.service';
import {Dictionary} from '../dictionary';
import {Utility} from '../utility';
import * as CodeMirror from 'codemirror';

@Component({
  selector: 'app-file-editor',
  templateUrl: './file-editor.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    '../../../node_modules/codemirror/lib/codemirror.css',
    '../../../node_modules/codemirror/theme/xq-light.css',
    '../../../node_modules/codemirror/addon/dialog/dialog.css',
    '../../../node_modules/codemirror/addon/fold/foldgutter.css',
    '../../../node_modules/codemirror/addon/display/fullscreen.css',
    './file-editor.component.css'
  ]
})
export class FileEditorComponent implements AfterViewInit, OnInit {
  @ViewChild('cm') cm: CodeMirrorComponent;
  @Input() selectedFile: FileDescription = <FileDescription>{id: '', name: '', content: ''};
  @Output() editorClick: EventEmitter<CodeMirror.Position> = new EventEmitter();
  codeMirrorConfig = {
    lineNumbers: true,
    mode: 'javascript',
    theme: 'xq-light',
    styleActiveLine: true,
    matchBrackets: true,
    highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true},
    foldGutter: true,
    extraKeys: {
      'Alt-F': 'findPersistent',
      'Ctrl-D': cm => cm.foldCode(cm.getCursor()),
      'F11': cm => cm.setOption('fullScreen', !cm.getOption('fullScreen')),
      'Esc': cm => {
        if (cm.getOption('fullScreen')) {
          cm.setOption('fullScreen', false)
        }
      }
    },
    readOnly: true,
    lineWrapping: true,
    viewportMargin: 0,
    gutters: ['CodeMirror-linenumbers', 'message-notices', 'landmarks', 'CodeMirror-foldgutter']
  };

  constructor(private codeService: CodeService,
              private bookmarkService: BookmarkService,
              private settingsService: SettingsService) {
  }

  ngOnInit(): void {
    this.codeService.getAvailableGutters().then((gutters: Gutter<any>[]) => this.generateGutterCSSClasses(gutters));
  }

  ngAfterViewInit() {
    this.cm.instance.on('gutterClick', (cm, line, gutter) => {
      if (gutter === 'CodeMirror-foldgutter') {
        return;
      }

      const info = cm.lineInfo(line);
      const landmark = new Landmark(this.selectedFile.id, line + 1, info.text);
      if (!info.gutterMarkers || !info.gutterMarkers.landmarks) {
        this.bookmarkService.addBookmark(landmark);
        cm.setGutterMarker(line, 'landmarks', ElementBuilder.landmark());
      } else {
        this.bookmarkService.removeBookmark(landmark);
        cm.setGutterMarker(line, 'landmarks', null);
      }
    });

    this.cm.instance.on('cursorActivity', (cm: CodeMirror.Doc) => this.editorClick.emit(cm.getCursor()));
  }

  updateGutter() {
    const promises = [];
    let gutters: Gutter<any>[];
    let sortedLineData: Dictionary<[{ fileID: string, line: number, value: number }]>;
    promises.push(this.codeService.getGutters(this.selectedFile.id).then((l: Gutter<any>[]) => gutters = l));
    promises.push(this.codeService.getSortedLineData().then((m: Dictionary<any>) => sortedLineData = m));

    Promise.all(promises).then(() => {
      const visibleGutters = this.settingsService.getVisibleGutters();
      this.cm.instance.setOption('gutters', visibleGutters.map(g => Utility.getGutterID(g)).concat(this.codeMirrorConfig.gutters));

      // Gutters
      for (const gutter of gutters) {
        if (!visibleGutters.some(g => g === gutter.name)) {
          continue;
        }
        const id = Utility.getGutterID(gutter.name);
        const max = sortedLineData[gutter.name][0].value;

        switch (gutter.kind) {
          case 'NUMBER':
            this.insertGutterMakers(gutter.data.data, id, (line, value) =>
              ElementBuilder.numberGutter(value, gutter.description, max));
            break;
          case 'STRING':
            this.insertGutterMakers(gutter.data.data, id, (line, value) => {
              const elem = <HTMLElement>document.createElement('span');
              elem.className = 'overflow-ellipsis';
              elem.innerHTML = value.map(msg => msg.message).join(', ');
              elem.title = value.map(msg => msg.message).join('\n');
              return elem;
            });
            break;
          default:
            break;
        }
      }

      // Message highlight
      const messages = gutters.find(g => g.name === 'Messages');
      if (messages) {
        this.insertGutterMakers(messages.data.data, 'message-notices', (line, value) => {
          this.markIssue(value);
          return ElementBuilder.message(messages.description);
        });
      }

      // Bookmarks
      this.bookmarkService
        .getBookmarks(this.selectedFile)
        .forEach(b => this.cm.instance.setGutterMarker(b.line - 1, 'landmarks', ElementBuilder.landmark()));
    });
  }

  jumpTo(line: number): void {
    this.cm.instance.setCursor(line - 1);
  }

  refresh() {
    this.cm.instance.refresh();
  }

  private markIssue(messages: LineMessage[]) {
    for (const m of messages) {
      const lineStart = m.sourceRange.lineStart - 1;
      const chStart = m.sourceRange.columnStart;
      const className = `issue ${m.severity} ${m.status}`;

      const token = this.cm.instance.getTokenAt({line: lineStart, ch: chStart});
      this.cm.instance.markText(
        {line: lineStart, ch: chStart - 1}, // start draw
        {line: lineStart, ch: chStart + token.string.length - 1}, // end draw
        {className: className, title: `${m.status}:  ${m.message}`}
      );
    }
  }

  private generateGutterCSSClasses(gutters: Gutter<any>[]): void {
    const style = document.createElement('style');
    gutters.forEach(gutter => {
      style.innerHTML += `.${Utility.getGutterID(gutter.name)} { width: ${this.getGutterWidth(gutter.kind)}em; }`
    });
    document.getElementsByTagName('head')[0].appendChild(style);
  }

  private insertGutterMakers(lineMap: any, gutterClass: string, nodeGenerator: (lineNo, value) => HTMLElement) {
    this.cm.instance.clearGutter(gutterClass);
    Object.keys(lineMap).forEach(lineNo => {
      const elem = nodeGenerator(lineNo, lineMap[lineNo]);
      this.cm.instance.setGutterMarker((+lineNo) - 1, gutterClass, elem);
    })
  }

  private getGutterWidth(kind: GutterKind): number {
    if (kind === 'STRING') {
      return 30;
    }
    if (kind === 'NUMBER') {
      return 4;
    }
  }

  @HostListener('window:keydown', ['$event'])
  windowKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey && event.keyCode === 70) { // CTRL + F
      event.preventDefault();
      this.cm.instance.execCommand('find');
    }
  }


}
