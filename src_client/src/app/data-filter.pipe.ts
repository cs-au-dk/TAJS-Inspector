import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'dataFilter'
})
export class DataFilterPipe implements PipeTransform {

  transform(array: any[], query: string, field: string): any {
    if (query) {
      return array.filter(item => (item[field].indexOf(query) > -1))
    }
    return array;
  }

}
