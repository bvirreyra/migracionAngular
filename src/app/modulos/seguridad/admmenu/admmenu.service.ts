import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Globals } from "../../../global";

import { DatosMenu } from "./datosmenu";

@Injectable()
export class AdmMenuService {
  public url: string;
  public mat: string;
  public ci: string;
  public fn: string;

  constructor(private _http: HttpClient, private globals: Globals) {
    //this.url='http://localhost:8383/';
    this.url = globals.rutaSrvBackEnd;
    //this.url='http://192.168.1.153:8383/';
  }

  /*CRUD MENU*/
  getAltaMenu(alta: DatosMenu) {
    //        console.log(alta);
    let DESCRIPCION = alta.DESCRIPCION;
    let IDMENUSUPERIOR = alta.IDMENUSUPERIOR;
    let ORDEN = alta.ORDEN;
    let NIVEL = alta.NIVEL;
    let ICONO = alta.ICONO;
    let RUTA = alta.RUTA;
    let IDESTADO = 31;
    let operacion = "I";
    let IDMODULO = "-";

    return this._http.get(
      this.url +
        "mseg_insertamenu/" +
        operacion +
        "/" +
        DESCRIPCION +
        "/" +
        IDMENUSUPERIOR +
        "/" +
        ORDEN +
        "/" +
        NIVEL +
        "/" +
        ICONO +
        "/" +
        RUTA +
        "/" +
        IDESTADO +
        "/" +
        IDMODULO
    );
  }

  ListaMenuRaiz() {
    return this._http.get(this.url + "mseg_listamenusraiz");
  }

  ListaSubMenu(idmenu: string) {
    return this._http.get(this.url + "mseg_listasubmenu/" + idmenu);
  }

  ListaMenus() {
    return this._http.get(this.url + "mseg_listamenus");
  }

  buscamenuxparametros(idmenu: string) {
    let operacion = "C";
    let IDMENU = idmenu;

    return this._http.get(
      this.url + "buscamenuxparametro/" + operacion + "/" + IDMENU
    );
  }

  getModificaMenu(alta: DatosMenu) {
    //console.log(alta);
    let operacion = "U";
    let IDMENU = alta.IDMENU;
    let DESCRIPCION = alta.DESCRIPCION;
    let IDMENUSUPERIOR = alta.IDMENUSUPERIOR;
    let ORDEN = alta.ORDEN;
    let NIVEL = alta.NIVEL;
    let ICONO = alta.ICONO;
    let RUTA = alta.RUTA;
    let IDMODULO = "-";

    return this._http.get(
      this.url +
        "mseg_actualizamenu/" +
        operacion +
        "/" +
        IDMENU +
        "/" +
        DESCRIPCION +
        "/" +
        IDMENUSUPERIOR +
        "/" +
        ORDEN +
        "/" +
        NIVEL +
        "/" +
        ICONO +
        "/" +
        RUTA
    );
  }

  getModificaEstadoMenu(alta: DatosMenu) {
    //console.log('estaDO USUARTIO');

    //console.log(alta);
    let IDMENU = alta.IDMENU;
    let IDESTADO = alta.IDESTADO;
    let operacion = "D";

    return this._http.get(
      this.url + "mseg_estadomenu/" + operacion + "/" + IDMENU + "/" + IDESTADO
    );
  }
}
