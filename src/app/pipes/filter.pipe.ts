import { Pipe, PipeTransform, EventEmitter } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  filtrou = new EventEmitter();

  transform(items: any[], searchText: string, key: string): any[] {
    if (!items) { return []; }
    if (!searchText) {return items; }

    return items.filter( item => {
      if (key && key !== '') { return item[key].toString().toLowerCase().toString().includes(searchText.toLowerCase()); }
      const f = this.found(item, searchText.toLowerCase());
      if (f === true) { this.filtrou.emit(true); }
      return f;
     }
    );

  }

  found(item: any, search: string) {
    return Object.keys(item).filter( key => item[key].toString().includes(search)).length > 0;
  }

}
