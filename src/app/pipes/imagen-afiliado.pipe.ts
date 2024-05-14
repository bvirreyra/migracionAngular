import { Pipe, PipeTransform } from '@angular/core';
import { Globals } from '../global';

@Pipe({
  name: 'imagen'
})
export class ImagenAfiliadoPipe implements PipeTransform {
  private URL_SERVICIOS: string;
  constructor(
    private globals: Globals,
    
  ) {

    this.URL_SERVICIOS = globals.rutaSrvBackEnd;

  }

  transform(img: string, tipo: string): any {

    
    let url = this.URL_SERVICIOS + '1_recuperaimagen_sgp/' + tipo;

    if (!img) {
      console.log('No existe imagen.');
      return url + '/no_imagen.png';
    }

    url += '/' + img;

    return url;
  }

}
