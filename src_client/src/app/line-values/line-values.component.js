"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var angular_tree_component_1 = require("angular-tree-component");
var landmark_1 = require("../landmark");
var actionMapping = { g: mouse }, _a = (void 0).dblClick,  = _a === void 0 ? function (tree, node, $event) {
    if (node.hasChildren)
        angular_tree_component_1.TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
} : _a;
;
var StructuralNodeType;
(function (StructuralNodeType) {
    StructuralNodeType[StructuralNodeType["Identifier"] = 0] = "Identifier";
    StructuralNodeType[StructuralNodeType["DescribedObject"] = 1] = "DescribedObject";
    StructuralNodeType[StructuralNodeType["Jump"] = 2] = "Jump";
    StructuralNodeType[StructuralNodeType["Property"] = 3] = "Property";
})(StructuralNodeType || (StructuralNodeType = {}));
var SemanticNodeType;
(function (SemanticNodeType) {
    SemanticNodeType[SemanticNodeType["Allocation"] = 0] = "Allocation";
    SemanticNodeType[SemanticNodeType["Call"] = 1] = "Call";
    SemanticNodeType[SemanticNodeType["AsyncListener"] = 2] = "AsyncListener";
    SemanticNodeType[SemanticNodeType["Property"] = 3] = "Property";
})(SemanticNodeType || (SemanticNodeType = {}));
var LineValuesComponent = (function () {
    function LineValuesComponent(codeService, toastyService) {
        var _this = this;
        this.codeService = codeService;
        this.toastyService = toastyService;
        this.jump = new core_1.EventEmitter();
        this.nodes = [];
        this.visibleNodes = [];
        this.nodeType = StructuralNodeType;
        this.treeOptions = {
            actionMapping: actionMapping,
            getChildren: function (n) { return _this.getChildren(n); },
            idField: 'uuid',
            useVirtualScroll: true,
            nodeHeight: 23
        };
    }
    LineValuesComponent.prototype.drillAt = function (fileID, line, context) {
        var _this = this;
        if (!fileID || !line)
            return;
        this.currentFile = fileID;
        this.currentLine = line;
        var promises = [];
        promises.push(this.codeService.getContexts(fileID, line).then(function (c) { return _this.contexts = c; }));
        promises.push(this.getLineValuesAsTree(fileID, line).then(function (n) { return _this.nodes = n; }));
        Promise.all(promises).then(function () {
            if (_this.contexts.length === 0)
                return;
            _this.selectContext((context) ? (_this.contexts.find(function (c) { return c.id === context.id; })) : _this.contexts[0]);
        });
    };
    LineValuesComponent.prototype.selectContext = function (context) {
        this.selectedContext = context;
        if (context.id === null) {
            this.visibleNodes = this.nodes.filter(function (n) { return !n.location.hasOwnProperty('context'); });
        }
        else {
            this.visibleNodes = this.nodes
                .filter(function (n) { return n.location.hasOwnProperty('context') && n.location['context'].id === context.id; });
        }
    };
    LineValuesComponent.prototype.jumpTo = function (file, line, context) {
        this.jump.emit(new landmark_1.Landmark(this.currentFile, this.currentLine, "lineValue (origin), " + this.selectedContext.rendering));
        this.jump.emit(new landmark_1.Landmark(file, line, "lineValue (destination), " + context.rendering));
        this.drillAt(file, line, context);
    };
    LineValuesComponent.prototype.goRelatedLocation = function (forward) {
        var _this = this;
        if (!this.visibleNodes)
            return;
        // LineValue w/largest columnStart on line and in this context
        var value = this.visibleNodes.reduce(function (acc, value, index, arr) {
            return (acc === undefined || value.location.range.columnStart > acc.location.range.columnStart) ? value : acc;
        });
        this.codeService.getRelatedLocation(value.location.id, forward, "LINE", true)
            .then(function (loc) {
            if (loc.length < 1) {
                _this.toastyService.info("No " + ((forward) ? 'forwards' : 'backwards') + " related location for line " + _this.currentLine);
                return;
            }
            _this.jumpTo(loc[0].fileID, loc[0].range.lineStart, _this.selectedContext);
        });
    };
    LineValuesComponent.prototype.getChildren = function (node) {
        var _this = this;
        var objectID = node.parent.data.id;
        var res;
        switch (node.data.nodeTypeChildren) {
            case SemanticNodeType.Allocation:
                res = this.codeService.getAllocationLocations(objectID)
                    .then(function (ls) { return ls.map(function (l) { return Object.assign(l, { nodeType: StructuralNodeType.Jump }); }); });
                break;
            case SemanticNodeType.Call:
                res = this.codeService.getCallLocations(objectID)
                    .then(function (ls) { return ls.map(function (l) { return Object.assign({ nodeType: StructuralNodeType.Jump }, l); }); });
                break;
            case SemanticNodeType.AsyncListener:
                res = this.codeService.getEventHandlerRegistrationLocations(objectID)
                    .then(function (ls) { return ls.map(function (l) { return Object.assign({ nodeType: StructuralNodeType.Jump }, l); }); });
                break;
            case SemanticNodeType.Property:
                var location_1 = node.parent.parent.data.location;
                res = (location_1 && location_1.id)
                    ? this.codeService.getObjectProperties(objectID, location_1.id).then(function (props) { return _this.getSubtreeForProperties(props); })
                    : Promise.resolve([]);
                break;
            default:
                this.toastyService.error("TREE CHILDREN ERROR: Unimplemented subtree type");
                res = Promise.resolve([]);
        }
        return res.then(function (r) {
            if (r.length === 0) {
                node.data.children = [];
                node.data.hasChildren = false;
                _this.toastyService.info("The requested subtree is empty for " + objectID);
                _this.tree.treeModel.update();
            }
            return r;
        });
    };
    LineValuesComponent.prototype.jumpToAllocation = function (objectID, callingNode, valueNo) {
        var _this = this;
        this.codeService.getAllocationLocations(objectID)
            .then(function (ls) {
            if (ls.length === 1) {
                var loc = ls[0];
                _this.jumpTo(loc.fileID, loc.range.lineStart, loc.context);
            }
            else {
                angular_tree_component_1.TREE_ACTIONS.TOGGLE_EXPANDED(_this.tree.treeModel, callingNode, {});
                angular_tree_component_1.TREE_ACTIONS.TOGGLE_EXPANDED(_this.tree.treeModel, callingNode.children[valueNo], {});
                angular_tree_component_1.TREE_ACTIONS.TOGGLE_EXPANDED(_this.tree.treeModel, callingNode.children[valueNo].children[1], {});
                if (ls.length > 1) {
                    _this.toastyService.info("More than one allocation location for " + objectID);
                }
            }
        });
    };
    LineValuesComponent.prototype.getLineValuesAsTree = function (fileID, line) {
        var _this = this;
        return this.codeService.getLineValues(fileID, line)
            .then(function (values) { return values.map(function (v) { return Object.assign(v, {
            nodeType: StructuralNodeType.Identifier,
            location: v.location,
            children: v.value.values.map(function (value) { return _this.getSubtreeForValue(value); })
        }); }); });
    };
    LineValuesComponent.prototype.getSubtreeForValue = function (singleValue) {
        if (!singleValue.hasOwnProperty('id')) {
            var primitive = singleValue;
            return { name: primitive.rendering };
        }
        var obj = singleValue;
        return Object.assign(obj, {
            nodeType: StructuralNodeType.DescribedObject,
            children: [
                {
                    name: 'properties',
                    nodeTypeChildren: SemanticNodeType.Property,
                    hasChildren: true,
                },
                {
                    name: 'allocation locations',
                    nodeTypeChildren: SemanticNodeType.Allocation,
                    hasChildren: true
                },
                {
                    name: 'call locations',
                    nodeTypeChildren: SemanticNodeType.Call,
                    hasChildren: (obj.kind === 'FUNCTION')
                },
                {
                    name: 'async listener registrations',
                    nodeTypeChildren: SemanticNodeType.AsyncListener,
                    hasChildren: (obj.kind === 'FUNCTION')
                }
            ]
        });
    };
    LineValuesComponent.prototype.getSubtreeForProperties = function (describedProps) {
        var _this = this;
        return [
            {
                name: 'prototype',
                childrenSummary: this.getValueSummary(describedProps.prototype.values),
                children: describedProps.prototype.values.map(function (v) { return _this.getSubtreeForValue(v); })
            },
            {
                name: 'internal',
                childrenSummary: this.getValueSummary(describedProps.internal.values),
                children: describedProps.internal.values.map(function (v) { return _this.getSubtreeForValue(v); })
            },
            {
                name: 'array',
                childrenSummary: this.getValueSummary(describedProps.array.values),
                children: describedProps.array.values.map(function (v) { return _this.getSubtreeForValue(v); })
            },
            {
                name: 'nonArray',
                childrenSummary: this.getValueSummary(describedProps.nonArray.values),
                children: describedProps.nonArray.values.map(function (v) { return _this.getSubtreeForValue(v); })
            },
            {
                name: 'properties',
                isExpanded: true,
                children: Object.keys(describedProps.properties).map(function (prop) { return ({
                    name: prop,
                    nodeType: StructuralNodeType.Property,
                    childrenSummary: _this.getValueSummary(describedProps.properties[prop].values),
                    children: describedProps.properties[prop].values.map(function (v) { return _this.getSubtreeForValue(v); })
                }); })
            }
        ];
    };
    LineValuesComponent.prototype.getValueSummary = function (values) {
        return values.map(function (v) { return v['rendering']; }).join(',');
    };
    __decorate([
        core_1.Output()
    ], LineValuesComponent.prototype, "jump", void 0);
    __decorate([
        core_1.ViewChild(angular_tree_component_1.TreeComponent)
    ], LineValuesComponent.prototype, "tree", void 0);
    LineValuesComponent = __decorate([
        core_1.Component({
            selector: 'app-line-values',
            templateUrl: 'line-values.component.html',
            styleUrls: ['line-values.component.css']
        })
    ], LineValuesComponent);
    return LineValuesComponent;
}());
exports.LineValuesComponent = LineValuesComponent;
