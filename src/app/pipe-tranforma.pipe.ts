import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipeTranforma'
})
export class PipeTranformaPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
