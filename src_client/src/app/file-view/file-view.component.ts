import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CodeService} from '../code.service';
import {EditorComponent} from '../editor/editor.component';
import {UIStateStore} from '../ui-state.service';
import {SettingsService} from '../settings.service';

@Component({
  selector: 'app-file-viewer',
  templateUrl: 'file-view.component.html',
  styleUrls: [
    'file-view.component.css'
  ]
})
export class FileViewComponent implements AfterViewInit {
  @ViewChild(EditorComponent) editor: EditorComponent;
  storagePrefix: string;
  files: FileDescription[];
  currentFile: FileID;
  filterQuery: string;
  _this = this;

  constructor(private codeService: CodeService,
              private settingsService: SettingsService,
              private route: ActivatedRoute,
              public uiStateStore: UIStateStore) {
    this.storagePrefix = settingsService.STORAGE_KEY_PREFIX;
    this.uiStateStore.file.subscribe(file => this.currentFile = file.id);
  }

  ngAfterViewInit() {
    this.codeService.getFiles().then((files: FileDescription[]) => {
      this.files = files;
      this.route.params.subscribe(params => {
        const param = params['id'];
        const file = param ? this.files.find(f => f.id === param) : null;
        this.uiStateStore.changeFile(file ? file : this.files[0]);
      });
    });
  }

  refresh() {
    this.editor.refresh();
  }

  resolve(line: number) {
    return this.editor.cm.instance.getDoc().getLine(line - 1);
  }

}
