export enum StructuralNodeType {Identifier, DescribedObject, Jump, Property}
export enum SemanticNodeType {Allocation, Call, AsyncListener, Property}

export class TreeBuilder {

  static getSubtreeForValue(singleValue: SingleValue): any {
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

  static getSubtreeForProperties(describedProps: DescribedProperties): any[] {
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

  private static getValueSummary(values: SingleValue[]): string {
    return values.map(v => v['rendering']).join(',');
  }
}
