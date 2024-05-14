import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Globals } from "../../../global";

import { DatosMenuRol } from "./datosmenurol";

@Injectable()
export class MenuRolService {
  public url: string;
  public mat: string;
  public ci: string;
  public fn: string;

  constructor(private _http: HttpClient, private globals: Globals) {
    //this.url='http://localhost:8383/';
    this.url = globals.rutaSrvBackEnd;
    //this.url='http://192.168.1.153:8383/';
  }

  /*CRUD ROL*/
  getAltaMenuRol(alta: DatosMenuRol) {
    // console.log(alta);
    let IDROL = alta.IDROL;
    let IDMENU = alta.IDMENU;
    let IDESTADO = 31;
    let operacion = "I";

    return this._http.get(
      this.url +
        "mseg_insertamenurol/" +
        operacion +
        "/" +
        IDROL +
        "/" +
        IDMENU +
        "/" +
        IDESTADO
    );
  }

  ListaMenus() {
    return this._http.get(this.url + "mseg_listamodulos");
  }

  ListaMenuRols() {
    return this._http.get(this.url + "mseg_listamenurols");
  }

  buscamenurolxparametro(idmenu: string) {
    let operacion = "C";
    let IDMENU = idmenu;

    return this._http.get(
      this.url + "buscamenurolxparametro/" + operacion + "/" + IDMENU
    );
  }

  getModificaEstadoMenuRol(alta: DatosMenuRol) {
    let IDROL = alta.IDROL;
    let IDMENU = alta.IDMENU;
    let IDESTADO = alta.IDESTADO;
    let operacion = "D";

    return this._http.get(
      this.url +
        "mseg_estadomenurol/" +
        operacion +
        "/" +
        IDROL +
        "/" +
        IDMENU +
        "/" +
        IDESTADO
    );
  }
}
