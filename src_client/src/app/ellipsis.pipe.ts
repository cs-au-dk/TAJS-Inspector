import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'ellipsis'
})
export class EllipsisPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === null) {
      return value;
    }
    if (args === undefined) {
      return value;
    }
    return (value.length > args) ? value.substring(0, args) + '...' : value;
  }
}

