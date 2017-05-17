import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from "@angular/core";
import {Landmark} from "../landmark";
import {CodeService} from "../code.service";

@Component({
  selector: 'app-file-message-search',
  templateUrl: './file-message-search.component.html',
  styleUrls: ['./file-message-search.component.css']
})
export class FileMessageSearchComponent implements OnChanges, OnInit {
  @Input() selectedFile: FileDescription;
  @Output() jump: EventEmitter<Landmark> = new EventEmitter();

  private messageGutter: Gutter<LineMessage[]>;
  private queryIndex: number;
  private initialized: boolean;
  query: string;
  linesMatchingQuery: number[] = [];

  constructor(private codeService: CodeService) {
  }

  ngOnInit(): void {
    this.initialized = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.initialized || !this.selectedFile) return;

    this.codeService.getGutters(this.selectedFile.id)
      .then((gutters: Gutter<any>[]) => this.messageGutter = gutters.find(g => g.name === 'Messages'));
  }

  search(query: string): void {
    if (query === "") return;

    if (query === this.query) {
      this.queryIndex++;
      if (!this.linesMatchingQuery[this.queryIndex]) this.queryIndex = 0;
    } else {
      this.queryIndex = 0;
      this.query = query;
      this.linesMatchingQuery = [];
      let isRE = query.match(/^\/(.*)\/([a-z]*)$/);
      let queryRE;
      if (isRE) queryRE = new RegExp(isRE[1], isRE[2].indexOf("i") == -1 ? "" : "i");

      Object.keys(this.messageGutter.data.data).forEach(line => {
        let messages = this.messageGutter.data.data[line];
        let doesMatch = messages
          .find(msg => (isRE) ? queryRE.test(msg.message) : this.stringMatchLowercase(query, msg.message));
        if (doesMatch) this.linesMatchingQuery.push(parseInt(line));
      });
    }
    if (this.linesMatchingQuery.length < 1) return;
    this.jump.emit(new Landmark(this.selectedFile.id, this.linesMatchingQuery[this.queryIndex], `search '${this.query}' (${this.queryIndex})`));
  }

  private stringMatchLowercase(query: string, text: string): boolean {
    return text.toLocaleLowerCase().includes(query.toLocaleLowerCase());
  }
}
