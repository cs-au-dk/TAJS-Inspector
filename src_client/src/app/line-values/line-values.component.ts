import {Component, ViewChild} from '@angular/core';
import {IActionMapping, TREE_ACTIONS, TreeComponent, TreeNode} from 'angular-tree-component';
import * as CodeMirror from 'codemirror';
import {ToastyService} from 'ng2-toasty';
import {CodeService, CONTEXT_ALL} from '../code.service';
import {Landmark} from '../landmark';
import {SemanticNodeType, StructuralNodeType, TreeBuilder} from '../tree-builder';
import {UIStateStore} from '../ui-state.service';
import {Utility} from '../utility';

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
  selector: 'app-line-values',
  templateUrl: 'line-values.component.html',
  styleUrls: ['line-values.component.css']
})
export class LineValuesComponent {
  @ViewChild(TreeComponent) tree: TreeComponent;
  contexts: DescribedContext[];
  filteredContexts: DescribedContext[];
  lineValueNodes: any[] = [];
  filteredLineValueNodes: any[] = [];
  nodeType = StructuralNodeType;
  currentFile: FileID;
  currentPosition: CodeMirror.Position;
  contextFilterQuery: string;
  private _context: DescribedContext;

  lineValueKinds: { value: LineValueKind, name: string, checked: boolean }[] = [
    {value: 'VARIABLE', name: 'Variable', checked: true},
    {value: 'REGISTER', name: 'Register', checked: true},
    {value: 'FIXED_PROPERTY', name: 'Fixed property', checked: true},
    {value: 'DYNAMIC_PROPERTY', name: 'Dynamic property', checked: true},
    {value: 'UNKNOWN', name: 'Unknown', checked: true}
  ];

  treeOptions = {
    actionMapping,
    getChildren: (n) => this.getChildren(n),
    idField: 'uuid',
    useVirtualScroll: true,
    nodeHeight: 23
  };

  constructor(private codeService: CodeService,
              private uiStateStore: UIStateStore,
              private toastyService: ToastyService) {
    this.uiStateStore.file.subscribe((file: FileDescription) => this.currentFile = file.id);
    this.uiStateStore.context.subscribe((context: DescribedContext) => this.selectedContext = context);
    this.uiStateStore.cursorPosition.subscribe((position: CodeMirror.Position) => {
      this.drillAt(position);
      this.currentPosition = position;
    });
  }

  set selectedContext(context: DescribedContext) {
    this._context = context;
    this.uiStateStore.changeContext(context);
    this.filterValues();
  }

  get selectedContext(): DescribedContext {
    return this._context;
  }

  drillAt(position: CodeMirror.Position, context?: DescribedContext) {
    if (!this.currentFile) {
      return;
    }
    const promises = [];
    promises.push(this.codeService.getContexts(this.currentFile, position.line + 1)
      .then(cs => this.contexts = this.filteredContexts = cs));
    promises.push(this.getLineValuesAsTree(this.currentFile, position.line + 1).then(n => this.lineValueNodes = n));
    Promise.all(promises).then(() => {
      if (this.contexts.length !== 0) {
        this.selectedContext = (context) ? (this.contexts.find(c => c.id === context.id)) : this.contexts[0];
      }
    });
    this.refresh();
  }

  jumpTo(file: FileID, line: number, context: DescribedContext) {
    this.uiStateStore.addToJumpHistory(new Landmark(this.currentFile, this.currentPosition.line
      , `lineValue (origin), ${this.selectedContext.rendering}`));
    this.uiStateStore.addToJumpHistory(new Landmark(file, line, `lineValue (destination), ${context.rendering}`));
    this.uiStateStore.changeFileAndPosition(file, {line: line - 1, ch: 0});
    this.selectedContext = context;
  }

  filterContextsSemantically(expression: string): void {
    if (expression.length === 0) {
      this.filteredContexts = this.contexts;
      return;
    }
    this.codeService.getPositionalLocationID(this.currentFile, this.currentPosition.line + 1, this.currentPosition.ch)
      .then((opt: Optional<DescribedLocation>) => {
        if (!opt.value) {
          this.toastyService.info('No location available at line');
          return;
        }
        this.codeService.getFilteredContexts(opt.value.id, expression)
          .then((cts: DescribedContext[]) => this.filteredContexts = cts)
          .catch(err => {
            this.filteredContexts = this.contexts;
            this.toastyService.warning('API failed on filtering query. Recovering contexts.');
            console.log(err);
          });
      });

  }

  filterValues() {
    if (!this.selectedContext) {
      return;
    }

    // Filter by fileID context
    if (this.selectedContext === CONTEXT_ALL) {
      this.filteredLineValueNodes = this.lineValueNodes.filter(n => !n.location.hasOwnProperty('context'));
    } else {
      this.filteredLineValueNodes = this.lineValueNodes
        .filter(n => n.location.hasOwnProperty('context') && n.location['context'].id === this.selectedContext.id);
    }
    // Filter by fileID kinds
    const selectedKinds = this.lineValueKinds.filter(k => k.checked).map(k => k.value);
    this.filteredLineValueNodes = this.filteredLineValueNodes.filter(v => (selectedKinds.indexOf(v.kind) > -1));
  }

  getChildren(node: TreeNode): Promise<TreeNode[]> {
    const objectID = node.parent.data.id;
    let res: Promise<any[]>;
    switch (node.data.nodeTypeChildren) {
      case SemanticNodeType.Allocation:
        res = this.codeService.getAllocationLocations(objectID)
          .then((ls: any[]) => ls.map(l => Object.assign(l, {nodeType: StructuralNodeType.Jump})));
        break;
      case SemanticNodeType.Call:
        res = this.codeService.getCallLocations(objectID)
          .then((ls: any[]) => ls.map(l => Object.assign(l, {nodeType: StructuralNodeType.Jump})));
        break;
      case SemanticNodeType.AsyncListener:
        res = this.codeService.getEventHandlerRegistrationLocations(objectID)
          .then((ls: any[]) => ls.map(l => Object.assign(l, {nodeType: StructuralNodeType.Jump})));
        break;
      case SemanticNodeType.Property:
        const location = node.parent.parent.data.location;
        res = (location && location.id)
          ? this.codeService.getObjectProperties(objectID, location.id)
            .then((props: DescribedProperties) => TreeBuilder.getSubtreeForProperties(props))
          : Promise.resolve([]);
        break;
      default:
        this.toastyService.error('TREE CHILDREN ERROR: Unimplemented subtree type');
        res = Promise.resolve([]);
    }

    return res.then((r: any[]) => {
      if (r.length === 0) {
        node.data.children = [];
        node.data.hasChildren = false;
        this.toastyService.info(`The requested subtree is empty for ${objectID}`);
        this.tree.treeModel.update();
      }
      return r;
    });
  }

  jumpToAllocation(objectID: ObjectID, callingNode: TreeNode, valueNo: number): void {
    this.codeService.getAllocationLocations(objectID)
      .then((ls: ContextSensitiveDescribedLocation[]) => {
        if (ls.length === 1) {
          const loc = ls[0];
          this.jumpTo(loc.fileID, loc.range.lineStart, loc.context);
        } else {
          TREE_ACTIONS.TOGGLE_EXPANDED(this.tree.treeModel, callingNode, {});
          TREE_ACTIONS.TOGGLE_EXPANDED(this.tree.treeModel, callingNode.children[valueNo], {});
          TREE_ACTIONS.TOGGLE_EXPANDED(this.tree.treeModel, callingNode.children[valueNo].children[1], {});
          if (ls.length > 1) {
            this.toastyService.info(`More than one allocation location for ${objectID}`);
          }
        }
      });
  }

  private refresh() {
    if (this.tree) {
      this.tree.viewportComponent.setViewport();
    }
  }

  private getLineValuesAsTree(fileID: FileID, line: number): Promise<any[]> {
    return this.codeService.getLineValues(fileID, line)
      .then((values: LineValue[]) => Utility.sortLineValues(values))
      .then((values: LineValue[]) => values.map((v: LineValue) => Object.assign(v, {
        nodeType: StructuralNodeType.Identifier,
        location: v.location,
        children: v.value.values.map(value => TreeBuilder.getSubtreeForValue(value))
      })));
  }
}
