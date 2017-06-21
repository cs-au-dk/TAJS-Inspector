import {AfterViewInit, Component, HostListener, ViewChild} from '@angular/core';
import {CodeService} from '../code.service';
import {ActivatedRoute} from '@angular/router';
import {Landmark} from '../landmark';
import {FileEditorComponent} from '../file-editor/file-editor.component';
import {LineValuesComponent} from '../line-values/line-values.component';
import * as CodeMirror from 'codemirror';
import {FileJumpComponent} from '../file-jump/file-jump.component';
import {CallHierarchyComponent} from '../call-hierarchy/call-hierarchy.component';
import {SettingsService} from '../settings.service';

@Component({
  selector: 'app-file-viewer',
  templateUrl: 'file-view.component.html',
  styleUrls: [
    'file-view.component.css'
  ]
})
export class FileViewComponent implements AfterViewInit {
  @ViewChild(FileEditorComponent) editor: FileEditorComponent;
  @ViewChild(LineValuesComponent) lineValues: LineValuesComponent;
  @ViewChild(FileJumpComponent) fileJump: FileJumpComponent;
  @ViewChild(CallHierarchyComponent) callHierarchy: CallHierarchyComponent;

  files: FileDescription[];
  selectedFile: FileDescription = <FileDescription>{id: '', name: '', content: ''};
  filterQuery: string;
  currentPosition: CodeMirror.Position;
  _this = this;
  isVisibleCallHierarchy = false;

  constructor(private codeService: CodeService,
              private settingsService: SettingsService,
              private route: ActivatedRoute) {
  }

  ngAfterViewInit() {
    this.codeService.getFiles().then((files: FileDescription[]) => {
      this.files = files;
      this.route.params.subscribe(params => {
        const param = params['fileID'];
        const file = param ? this.files.find(f => f.id === param) : null;
        this.selectFile(file ? file : this.files[0]);
      });
    });
  }

  selectFile(file: FileDescription) {
    this.selectedFile = file;
  }

  jumpTo(destination: Landmark, remember = false) {
    if (destination.fileID !== this.selectedFile.id) {
      this.selectFile(this.files.find(f => f.id === destination.fileID));
    }
    if (remember) {
      this.fileJump.addToHistory(destination);
    }
    this.editor.jumpTo(destination.line);
  }

  refresh() {
    this.editor.refresh();
  }

  drill(position: CodeMirror.Position) {
    if (this.isVisibleLineValues) {

    } this.lineValues.drillAt(this.selectedFile.id, position.line + 1);
    this.currentPosition = position;
  }

  showCallHierarchy() {
    this.isVisibleCallHierarchy = true;
    this.callHierarchy.drillAt(this.selectedFile.id, this.currentPosition);
  }

  resolve(line: number) {
    return this.editor.cm.instance.getDoc().getLine(line - 1);
  }

  get isVisibleLineValues(): boolean {
    return this.settingsService.getVisibilityLineValueToolbar();
  }

  set isVisibleLineValues(visible: boolean) {
    this.settingsService.setVisibilityLineValueToolbar(visible);
  }

  @HostListener('window:keydown', ['$event'])
  windowKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey && event.keyCode === 77) { // CTRL + M
      this.showCallHierarchy();
    }
  }

}
