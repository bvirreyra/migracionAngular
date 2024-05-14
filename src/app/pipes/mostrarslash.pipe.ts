import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'showSlash'})
export class mostrarSlashPipe implements PipeTransform {
    transform(value: string): string {
        return(value.replace('*','/'));
    }
}