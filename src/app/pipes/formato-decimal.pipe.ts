import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatoDecimal'
})
export class FormatoDecimalPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value!=null ){
    let dato=value.split('.');
    let entero=dato[0];
    let decimal=dato[1];
    entero=entero.replace(/,/g, '.');    
    return entero+','+decimal;
    }
    else {
      return 0;
    }
  }

}
