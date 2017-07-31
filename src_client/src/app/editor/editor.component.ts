import {AfterViewInit, Component, ViewChild, ViewEncapsulation} from '@angular/core';
import * as CodeMirror from 'codemirror';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/display/fullscreen';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/search/jump-to-line';
import 'codemirror/addon/search/match-highlighter';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/selection/active-line';
import 'codemirror/mode/javascript/javascript';
import {CodeMirrorComponent} from '../code-mirror/code-mirror.component';
import {CodeService} from '../code.service';
import {Dictionary} from '../dictionary';
import {ElementBuilder} from '../element-builder';
import {Landmark} from '../landmark';
import {SettingsService} from '../settings.service';
import {UIStateStore} from '../ui-state.service';
import {Utility} from '../utility';

@Component({
  selector: 'app-file-editor',
  templateUrl: './editor.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    '../../../node_modules/codemirror/lib/codemirror.css',
    '../../../node_modules/codemirror/theme/xq-light.css',
    '../../../node_modules/codemirror/addon/dialog/dialog.css',
    '../../../node_modules/codemirror/addon/fold/foldgutter.css',
    '../../../node_modules/codemirror/addon/display/fullscreen.css',
    './editor.component.css'
  ]
})
export class EditorComponent implements AfterViewInit {
  @ViewChild('cm') cm: CodeMirrorComponent;
  selected: FileID;
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
              private settingsService: SettingsService,
              private uiStateStore: UIStateStore) {

  }

  ngAfterViewInit() {
    this.uiStateStore.cursorPosition.subscribe(position => this.cm.instance.getDoc().setCursor(position));
    this.uiStateStore.file.subscribe(file => {
      this.cm.writeValue(file.content);
      this.updateGutter(file);
      this.selected = file.id;
    });
    this.codeService.getAvailableGutters()
      .then((gutters: Gutter<any>[]) => this.generateGutterCSSClasses(gutters));
    this.cm.instance.on('gutterClick', (cm, line, gutter) => {
      if (gutter === 'CodeMirror-foldgutter') {
        return;
      }

      const info = cm.lineInfo(line);
      const landmark = new Landmark(this.selected, line + 1, info.text);
      if (!info.gutterMarkers || !info.gutterMarkers.landmarks) {
        this.uiStateStore.addBookmark(landmark);
        cm.setGutterMarker(line, 'landmarks', ElementBuilder.landmark());
      } else {
        this.uiStateStore.removeBookmark(landmark);
        cm.setGutterMarker(line, 'landmarks', null);
      }
    });

    this.cm.instance.on('cursorActivity', (cm: CodeMirror.Editor) => this.uiStateStore.changeCursorPosition(cm.getDoc().getCursor()));
  }

  updateGutter(file: FileDescription) {
    const promises = [];
    let gutters: Gutter<any>[];
    let sortedLineData: Dictionary<[{ fileID: string, line: number, value: number }]>;
    promises.push(this.codeService.getGutters(file.id).then((l: Gutter<any>[]) => gutters = l));
    promises.push(this.codeService.getSortedLineData().then((m: Dictionary<any>) => sortedLineData = m));

    Promise.all(promises).then(() => {
      if (!gutters || !sortedLineData) {
        return;
      }
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
          case 'BOOLEAN':
            this.insertGutterMakers(gutter.data.data, id, (line, value) => {
              const elem = <HTMLElement> document.createElement('span');
              elem.className = 'colored-gutter center';
              elem.innerHTML = '&nbsp;';
              elem.title = gutter.description;
              elem.style.backgroundColor = (value) ? '#07FF00' : '#FF0000';
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
      this.uiStateStore
        .getBookmarks(file)
        .forEach(b => this.cm.instance.setGutterMarker(b.line - 1, 'landmarks', ElementBuilder.landmark()));
    });
  }

  refresh() {
    this.cm.instance.refresh();
  }

  private markIssue(messages: LineMessage[]) {
    for (const m of messages) {
      const lineStart = m.sourceRange.lineStart - 1;
      const chStart = m.sourceRange.columnStart;
      const certainty = (m.certainty) ? m.certainty.value : '';
      const className = `issue ${m.level} ${certainty}`;

      const token = this.cm.instance.getTokenAt({line: lineStart, ch: chStart});
      this.cm.instance.getDoc().markText(
        {line: lineStart, ch: chStart - 1}, // start draw
        {line: lineStart, ch: chStart + token.string.length - 1}, // end draw
        {className: className, title: `${certainty}:  ${m.message} (${m.source})`}
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
    switch (kind) {
      case 'STRING':
        return 30;
      case 'NUMBER':
        return 4;
      case 'BOOLEAN':
        return 1;
    }
  }
}
