import { Injectable } from "@angular/core";

@Injectable()
export class FuncionesService {
  constructor() {}
  /*devuelve null si la variable esta vacia*/
  isnull(cadena: string) {
    if (cadena == "") {
      cadena = null;
    }

    return cadena;
  }
}
