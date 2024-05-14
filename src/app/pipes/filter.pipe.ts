import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtra',
  pure: false
})
export class FilterPipe implements PipeTransform {
  

  

  // transform(items: Array<any>, conditions: { [field: string]: any }): Array<any> {
  //   return items.filter(item => {
  //     for (let field in conditions) {
  //       if (item[field] !== conditions[field]) {
  //         return false;
  //       }
  //     }
  //     return true;
  //   });  
  // }
  // transform(items: any[], searchText: string): any[] {
  //   if (!items) return [];
  //   if (!searchText) return items;
  //   searchText = searchText.toLowerCase();
  //   return items.filter(it => {
  //     return it.toLowerCase().includes(searchText);
  //   });
  // }
  // transform(items: any[], filter: any): any {
  //   if (!items || !filter) {
  //     return items;
  //   }
  //   return items.filter(item => item.name.indexOf(filter.name) !== -1);
  // }
   transform(items: any[], field: string, value: string): any[] {
    // console.log('items',items);
    // console.log('field',field);
    // console.log('value',value);
     if (!items) return [];
     return items.filter(it => it[field] == value);
   }
  
  /*transform(items:Array<any>, field: string, value: string): any  {
    console.log(items,field,value);
  
  let x=items.filter(item => {             
    console.log(items[field] !== field[value])
        if (items[field] !== field[value]) {
          return false;        
      }
      return true;
    });
    //console.log('aqui',x);
    return x;

  }
  */
  // transform(items: any[], term): any {
  //   return term ? items.filter(item => item.title.indexOf(term) !== -1)
  //     : items;
  // }

  /*
  transform(items: any[], term): any {    
    return term ? items.filter(item => item.title.indexOf(term) !== -1)
        : items;
  }
  */
}
