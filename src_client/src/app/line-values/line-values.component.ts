import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {CodeService, CONTEXT_ALL} from '../code.service';
import {IActionMapping, TREE_ACTIONS, TreeComponent, TreeNode} from 'angular-tree-component';
import {Landmark} from '../landmark';
import {ToastyService} from 'ng2-toasty';
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

enum StructuralNodeType {Identifier, DescribedObject, Jump, Property}
enum SemanticNodeType {Allocation, Call, AsyncListener, Property}

@Component({
  selector: 'app-line-values',
  templateUrl: 'line-values.component.html',
  styleUrls: ['line-values.component.css']
})
export class LineValuesComponent {
  @Output() jump: EventEmitter<Landmark> = new EventEmitter();
  @ViewChild(TreeComponent) tree: TreeComponent;
  contexts: DescribedContext[];
  filteredContexts: DescribedContext[];
  nodes: any[] = [];
  filteredNodes: any[] = [];
  nodeType = StructuralNodeType;
  currentFile: FileID;
  currentLine: number;
  filterQuery: string;
  private selectedContextValue: DescribedContext;

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
              private toastyService: ToastyService) {
  }

  drillAt(fileID: FileID, line: number, context?: DescribedContext) {
    if (!fileID || !line) {
      return;
    }
    this.currentFile = fileID;
    this.currentLine = line;

    const promises = [];
    promises.push(this.codeService.getContexts(fileID, line).then((c: DescribedContext[]) => this.contexts = this.filteredContexts = c));
    promises.push(this.getLineValuesAsTree(fileID, line).then((n: any[]) => this.nodes = n));

    Promise.all(promises).then(() => {
      if (this.contexts.length === 0) {
        return;
      }
      this.selectedContext = (context) ? (this.contexts.find(c => c.id === context.id)) : this.contexts[0];
    });

    this.refresh();
  }

  set selectedContext(context: DescribedContext) {
    this.selectedContextValue = context;
    this.filterValues();
  }

  get selectedContext(): DescribedContext {
    return this.selectedContextValue;
  }

  jumpTo(file: FileID, line: number, context: DescribedContext) {
    this.jump.emit(new Landmark(this.currentFile, this.currentLine, `lineValue (origin), ${this.selectedContext.rendering}`));
    this.jump.emit(new Landmark(file, line, `lineValue (destination), ${context.rendering}`));
    this.drillAt(file, line, context);
  }

  goRelatedLocation(forward: boolean): void {
    if (!this.filteredNodes) {
      return;
    }

    const value: LineValue = this.getLastLineValueOnLine();
    if (!value) {
      return;
    }

    this.codeService.getRelatedLocation(value.location.id, forward, 'LINE', true)
      .then((loc: DescribedLocation[]) => {
        if (loc.length < 1) {
          this.toastyService.info(`No ${ (forward) ? 'forwards' : 'backwards'} related location for line ${this.currentLine}`);
          return;
        }
        // TODO: Choose which location to go to!
        const location = loc[0];
        const context: DescribedContext = location['context'] || CONTEXT_ALL;
        this.jumpTo(location.fileID, location.range.lineStart, context);
      });
  }

  getLastLineValueOnLine(): LineValue {
    if (this.filteredNodes.length === 0) {
      return null;
    }
    // LineValue w/largest columnStart on line and in the selected context
    return this.filteredNodes.reduce((acc: LineValue, value: LineValue) =>
      (acc === undefined || value.location.range.columnStart > acc.location.range.columnStart) ? value : acc)
  }

  filterContextsSemantically(expression: string): void {
    if (expression.length === 0) {
      this.filteredContexts = this.contexts;
      return;
    }

    const value: LineValue = this.getLastLineValueOnLine();
    if (!value) {
      return;
    }

    this.codeService.getFilteredContexts(value.location.id, expression)
      .then((cts: DescribedContext[]) => this.filteredContexts = cts)
      .catch(err => {
        this.filteredContexts = this.contexts;
        this.toastyService.warning('API failed on filtering query. Recovering contexts.');
        console.log(err);
      });
  }

  filterValues() {
    // Filter by selected context
    if (this.selectedContext === CONTEXT_ALL) {
      this.filteredNodes = this.nodes.filter(n => !n.location.hasOwnProperty('context'));
    } else {
      this.filteredNodes = this.nodes
        .filter(n => n.location.hasOwnProperty('context') && n.location['context'].id === this.selectedContext.id);
    }

    // Filter by selected kinds
    const selectedKinds = this.lineValueKinds.filter(k => k.checked).map(k => k.value);
    this.filteredNodes = this.filteredNodes.filter(v => (selectedKinds.indexOf(v.kind) > -1));
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
            .then((props: DescribedProperties) => this.getSubtreeForProperties(props))
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

  refresh() {
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
        children: v.value.values.map(value => this.getSubtreeForValue(value))
      })));
  }

  private getSubtreeForValue(singleValue: SingleValue): any {
    if (!singleValue.hasOwnProperty('id')) {
      const primitive = <DescribedPrimitive> singleValue;
      return {rendering: primitive.rendering};
    }

    const obj: DescribedObject = <DescribedObject> singleValue;
    return Object.assign(obj, {
      nodeType: StructuralNodeType.DescribedObject,
      children: [
        {
          rendering: 'properties',
          nodeTypeChildren: SemanticNodeType.Property,
          hasChildren: true,
        },
        {
          rendering: 'allocation locations',
          nodeTypeChildren: SemanticNodeType.Allocation,
          hasChildren: true
        },
        {
          rendering: 'call locations',
          nodeTypeChildren: SemanticNodeType.Call,
          hasChildren: (obj.kind === 'FUNCTION')
        },
        {
          rendering: 'async listener registrations',
          nodeTypeChildren: SemanticNodeType.AsyncListener,
          hasChildren: (obj.kind === 'FUNCTION')
        }
      ]
    });
  }

  private getSubtreeForProperties(describedProps: DescribedProperties): any[] {
    return [
      {
        rendering: 'prototype',
        childrenSummary: this.getValueSummary(describedProps.prototype.values),
        children: describedProps.prototype.values.map(v => this.getSubtreeForValue(v))
      },
      {
        rendering: 'internal',
        childrenSummary: this.getValueSummary(describedProps.internal.values),
        children: describedProps.internal.values.map(v => this.getSubtreeForValue(v))
      },
      {
        rendering: 'array',
        childrenSummary: this.getValueSummary(describedProps.array.values),
        children: describedProps.array.values.map(v => this.getSubtreeForValue(v))
      },
      {
        rendering: 'nonArray',
        childrenSummary: this.getValueSummary(describedProps.nonArray.values),
        children: describedProps.nonArray.values.map(v => this.getSubtreeForValue(v))
      },
      {
        rendering: 'properties',
        isExpanded: true,
        children: Object.keys(describedProps.properties).map(prop => ({
          rendering: prop,
          nodeType: StructuralNodeType.Property,
          childrenSummary: this.getValueSummary(describedProps.properties[prop].values),
          children: describedProps.properties[prop].values.map(v => this.getSubtreeForValue(v))
        }))
      }
    ]
  }

  private getValueSummary(values: SingleValue[]): string {
    return values.map(v => v['rendering']).join(',');
  }
}
