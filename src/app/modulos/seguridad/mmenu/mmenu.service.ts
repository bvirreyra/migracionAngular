import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Globals } from "../../../global";

var varsession = "";
@Injectable()
export class MMenuService {
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
  //menu
  getListarMenu(m_descripcion: string, m_ruta: string) {
    return this._http.get(
      this.url + "muestra_menu/" + m_descripcion + "/" + m_ruta
    );
  }

  getActualizaMenu(
    e_idmenu: string,
    e_descripcion: string,
    e_idmenusuperior: string,
    e_orden: string,
    e_nivel: string,
    e_icono: string,
    e_ruta: string,
    e_estado: string
  ) {
    return this._http.get(
      this.url +
        "actualiza_menu/" +
        e_idmenu +
        "/" +
        e_descripcion +
        "/" +
        e_idmenusuperior +
        "/" +
        e_orden +
        "/" +
        e_nivel +
        "/" +
        e_icono +
        "/" +
        e_ruta +
        "/" +
        e_estado
    );
  }

  getInsertaNuevoMenu(
    e_idmenu: string,
    e_descripcion: string,
    e_idmenusuperior: string,
    e_orden: string,
    e_nivel: string,
    e_icono: string,
    e_ruta: string,
    e_estado: string
  ) {
    return this._http.get(
      this.url +
        "inserta_menu/" +
        e_idmenu +
        "/" +
        e_descripcion +
        "/" +
        e_idmenusuperior +
        "/" +
        e_orden +
        "/" +
        e_nivel +
        "/" +
        e_icono +
        "/" +
        e_ruta +
        "/" +
        e_estado
    );
  }

  getEliminaRegistroMenu(id_menu: string) {
    return this._http.get(this.url + "elimina_registro_menu/" + id_menu);
  }
}
