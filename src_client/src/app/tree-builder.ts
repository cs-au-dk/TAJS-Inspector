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
          hasChildren: obj.invokable
        },
        {
          rendering: 'async listener registrations',
          nodeTypeChildren: SemanticNodeType.AsyncListener,
          hasChildren: obj.invokable
        }
      ]
    });
  }

  static getSubtreeForProperties(describedProps: DescribedProperties): any[] {
    const metaProperties = Object.keys(describedProps.metaProperties).map(key => ({
      rendering: key,
      childrenSummary: this.getValueSummary(describedProps.metaProperties[key].values),
      children: describedProps.metaProperties[key].values.map(v => this.getSubtreeForValue(v))
    }));
    const properties = {
      rendering: 'properties',
      isExpanded: true,
      children: Object.keys(describedProps.properties).map(prop => ({
        rendering: prop,
        nodeType: StructuralNodeType.Property,
        childrenSummary: this.getValueSummary(describedProps.properties[prop].values),
        children: describedProps.properties[prop].values.map(v => this.getSubtreeForValue(v))
      }))
    };
    return [...metaProperties, properties];
  }

  private static getValueSummary(values: SingleValue[]): string {
    return values.map(v => v['rendering']).join(',');
  }
}
