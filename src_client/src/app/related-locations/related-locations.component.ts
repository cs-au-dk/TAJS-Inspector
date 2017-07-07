import {Component, HostListener, Input, ViewChild} from '@angular/core';
import {IActionMapping, TREE_ACTIONS, TreeComponent} from 'angular-tree-component';
import * as CodeMirror from 'codemirror';
import {ToastyService} from 'ng2-toasty';
import {CodeService} from '../code.service';
import {Landmark} from '../landmark';
import {UIStateStore} from '../ui-state.service';

const actionMapping: IActionMapping = {
  mouse: {
    dblClick: (tree, node, $event) => {
      if (node.hasChildren) {
        TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
      }
    }
  }
};
@Component({
  selector: 'app-related-locations',
  templateUrl: './related-locations.component.html',
  styleUrls: ['./related-locations.component.css']
})
export class RelatedLocationsComponent {
  @ViewChild(TreeComponent) tree: TreeComponent;
  @Input() resolver: { resolve: ((number) => string) };
  currentFile: FileID;
  currentPosition: CodeMirror.Position;
  private _forwards = true;
  private _intraprocedural = true;
  private _kind: RelatedLocationKind = 'LINE';
  nodes: any[] = [];
  treeOptions = {
    actionMapping,
    getChildren: (n) => this.getRelatedLocations(n.data.id)
      .then(nodes => nodes.map(node => Object.assign(node, {hasChildren: true}))),
    idField: 'uuid',
    useVirtualScroll: true,
    nodeHeight: 23
  };

  set forwards(forwards: boolean) {
    this._forwards = forwards;
    this.drill();
  }

  get forwards() {
    return this._forwards;
  }

  set intraprocedural(intraprocedural: boolean) {
    this._intraprocedural = intraprocedural;
    this.drill();
  }

  get intraprocedural(): boolean {
    return this._intraprocedural;
  }

  set kind(kind: RelatedLocationKind) {
    this._kind = kind;
    this.drill();
  }

  get kind() {
    return this._kind;
  }

  constructor(private codeService: CodeService, private uiStateStore: UIStateStore, private toastyService: ToastyService) {
  }

  drill(): void {
    this.currentFile = this.uiStateStore.getCurrentFile().id;
    this.currentPosition = this.uiStateStore.getCurrentPosition();
    const context = this.uiStateStore.getCurrentContext();
    this.codeService.getPositionalLocationID(this.currentFile, this.currentPosition.line + 1, this.currentPosition.ch)
      .then((opt: Optional<DescribedLocation>) => {
        if (!opt.value) {
          this.toastyService.info('No location available at line');
          this.nodes = [];
          return;
        }
        this.getRelatedLocations(opt.value.id, context && context.id).then(nodes =>
          this.nodes = [{
            fileID: this.currentFile,
            range: {lineStart: this.currentPosition.line + 1, columnStart: this.currentPosition.ch},
            context: context,
            children: nodes.map(n => Object.assign(n, {hasChildren: true}))
          }]);
      });
    this.refresh();
  }

  getRelatedLocations(location: LocationID, context?: ContextID) {
    return this.codeService.getRelatedLocations(location, this.forwards, this.kind, this.intraprocedural, context)
  }

  refresh() {
    if (this.tree) {
      this.tree.viewportComponent.setViewport();
    }
  }

  jumpTo(file: FileID, line: number, context: DescribedContext) {
    this.uiStateStore.changeFileAndPosition(file, {line: line - 1, ch: 0});
    this.uiStateStore.changeContext(context);
    this.uiStateStore.addToJumpHistory(new Landmark(this.currentFile, this.currentPosition.line
      , `related location, ${ (this.forwards) ? 'forwards' : 'backwards'} (origin)`));
    this.uiStateStore.addToJumpHistory(new Landmark(file, line
      , `related location, ${ (this.forwards) ? 'forwards' : 'backwards'} (destination)`));
  }

  @HostListener('window:keydown', ['$event'])
  windowKeyDown(event: KeyboardEvent) {
    if (event.altKey && event.keyCode === 77) { // ALT + M
      this.drill();
    }
  }

}
