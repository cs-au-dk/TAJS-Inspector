import {Component} from '@angular/core';
import {CodeService} from '../code.service';
import {UIStateStore} from '../ui-state.service';

@Component({
  selector: 'app-file-message-search',
  templateUrl: './file-message-search.component.html',
  styleUrls: ['./file-message-search.component.css']
})
export class FileMessageSearchComponent {
  private messageGutter: Gutter<LineMessage[]>;
  private queryIndex: number;
  query: string;
  linesMatchingQuery: number[] = [];

  constructor(private codeService: CodeService, private uiStateStore: UIStateStore) {
    this.uiStateStore.file.subscribe(file => {
      this.queryIndex = 0;
      this.query = '';
      this.codeService.getGutters(file.id).then((gutters: Gutter<any>[]) => {
        if (gutters) {
          this.messageGutter = gutters.find(g => g.name === 'Messages')
        }
      })
    });
  }

  search(query: string): void {
    if (query === '') {
      return;
    }

    if (query === this.query) {
      this.queryIndex++;
      if (!this.linesMatchingQuery[this.queryIndex]) {
        this.queryIndex = 0;
      }
    } else {
      this.queryIndex = 0;
      this.query = query;
      this.linesMatchingQuery = [];
      const isRE = query.match(/^\/(.*)\/([a-z]*)$/);
      let queryRE;
      if (isRE) {
        queryRE = new RegExp(isRE[1], isRE[2].indexOf('i') === -1 ? '' : 'i');
      }

      Object.keys(this.messageGutter.data.data).forEach(line => {
        const messages = this.messageGutter.data.data[line];
        const doesMatch = messages
          .find(msg => (isRE) ? queryRE.test(msg.message) : this.stringMatchLowercase(query, msg.message));
        if (doesMatch) {
          this.linesMatchingQuery.push(parseInt(line, 10));
        }
      });
    }
    if (this.linesMatchingQuery.length < 1) {
      return;
    }
    const match = this.linesMatchingQuery[this.queryIndex];
    this.uiStateStore.changeCursorPosition({line: match - 1, ch: 0});
    // this.jump.emit(new Landmark(this.selectedFile.file, this.linesMatchingQuery[this.queryIndex]
    //   , `search '${this.query}' (${this.queryIndex})`));
  }

  private stringMatchLowercase(query: string, text: string): boolean {
    return text.toLocaleLowerCase().includes(query.toLocaleLowerCase());
  }
}
