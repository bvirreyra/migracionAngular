import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Globals } from "../../../global";

var varsession = "";
@Injectable()
export class MModuloService {
  public url: string;
  public urlFonadal: string;
  userName: string;
  loggeIn: boolean;

  constructor(private _http: HttpClient, private globals: Globals) {
    //this.url='http://localhost:8383/';
    this.url = globals.rutaSrvBackEnd;
    this.urlFonadal = globals.rutaSrvBackEndFonadal;

    //this.url='http://192.168.1.153:8383/';
    this.userName = "";
    this.loggeIn = false;
  }

  /*juan*/
  //modulo
  getListarModulo(m_nombre: string, m_descripcion: string) {
    return this._http.get(
      this.url + "muestra_modulo/" + m_nombre + "/" + m_descripcion
    );
  }

  getActualizaModulo(
    e_idmodulo: string,
    e_nombre: string,
    e_descripcion: string,
    e_icono: string,
    e_ruta: string,
    e_estado: string
  ) {
    return this._http.get(
      this.url +
        "actualiza_modulo/" +
        e_idmodulo +
        "/" +
        e_nombre +
        "/" +
        e_descripcion +
        "/" +
        e_icono +
        "/" +
        e_ruta +
        "/" +
        e_estado
    );
  }

  getInsertaNuevoModulo(
    e_nombre: string,
    e_descripcion: string,
    e_icono: string,
    e_ruta: string,
    e_estado: string
  ) {
    return this._http.get(
      this.url +
        "inserta_modulo/" +
        e_nombre +
        "/" +
        e_descripcion +
        "/" +
        e_icono +
        "/" +
        e_ruta +
        "/" +
        e_estado
    );
  }

  getEliminaRegistroActual(id: string) {
    return this._http.get(this.url + "elimina_registro/" + id);
  }
}
