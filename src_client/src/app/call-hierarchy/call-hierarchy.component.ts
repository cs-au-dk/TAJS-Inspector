import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {CodeService} from '../code.service';
import {IActionMapping, TREE_ACTIONS, TreeComponent, TreeNode} from 'angular-tree-component';
import {Landmark} from '../landmark';
import * as CodeMirror from 'codemirror';

const actionMapping: IActionMapping = {
  mouse: {
    dblClick: (tree, node, $event) => {
      if (node.hasChildren) {
        TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
      }
    }
  }
};

enum StructuralNodeType {ENCLOSING_FUNCTION, CALL_LOCATIONS}

@Component({
  selector: 'app-call-hierarchy',
  templateUrl: './call-hierarchy.component.html',
  styleUrls: ['./call-hierarchy.component.css']
})
export class CallHierarchyComponent {
  @ViewChild(TreeComponent) tree: TreeComponent;
  @Output() jump: EventEmitter<Landmark> = new EventEmitter();

  // TODO: COME UP WITH BETTER WAY - SHOULD BE EXTRACTED TO CODESERVICE?
  @Input() resolver: { resolve: ((number) => string) };

  nodeType = StructuralNodeType;
  nodes: any[] = [];
  currentFile: FileID;
  currentPosition: CodeMirror.Position;

  treeOptions = {
    actionMapping,
    getChildren: (n) => this.getChildren(n),
    idField: 'uuid',
    useVirtualScroll: true,
    nodeHeight: 23
  };

  constructor(private codeService: CodeService) {
  }

  drillAt(fileID: FileID, position: CodeMirror.Position): void {
    this.currentFile = fileID;
    this.currentPosition = position;

    this.codeService.getPositionalLocationID(fileID, position.line + 1, position.ch)
      .then((opt: Optional<DescribedLocation>) => {
        if (!opt.value) {
          this.nodes = [];
          return;
        }
        this.enclosingFunction(opt.value.id).then((nodes: any[]) => this.nodes = nodes);
      });
    this.refresh();
  }

  getChildren(node: TreeNode): Promise<TreeNode[]> {
    const objectID = node.data.objectID;
    const locationID = node.data.id;

    if (node.data.nodeType === StructuralNodeType.CALL_LOCATIONS) {
      return this.enclosingFunction(locationID);
    } else if (node.data.nodeType === StructuralNodeType.ENCLOSING_FUNCTION) {
      return this.callLocations(objectID);
    }
  }

  private enclosingFunction(locationID: LocationID): Promise<any[]> {
    return this.codeService.getEnclosingFunction(locationID)
      .then((ids: ObjectID[]) => Promise.all(ids
        .map((o: ObjectID) => this.codeService.getAllocationLocations(o)
          .then((ls: ContextSensitiveDescribedLocation[]) => ls
            .map(l => Object.assign({
              rendering: this.resolver.resolve(l.range.lineStart),
              nodeType: StructuralNodeType.ENCLOSING_FUNCTION,
              objectID: o,
              hasChildren: true
            }, l)))))
        .then(xs => [].concat.apply([], xs)))
  }

  private callLocations(objectID: ObjectID): Promise<any[]> {
    return this.codeService.getCallLocations(objectID)
      .then((locs: ContextSensitiveDescribedLocation[]) => locs.map(l => Object.assign({
        rendering: this.resolver.resolve(l.range.lineStart),
        nodeType: StructuralNodeType.CALL_LOCATIONS,
        hasChildren: true
      }, l)));
  }

  refresh() {
    if (this.tree) {
      this.tree.viewportComponent.setViewport();
    }
  }

  jumpTo(file: FileID, line: number, context: DescribedContext) {
    this.jump.emit(new Landmark(this.currentFile, this.currentPosition.line, `call hierarchy (origin)`));
    this.jump.emit(new Landmark(file, line, `call hierarchy (destination)`));
  }

}
