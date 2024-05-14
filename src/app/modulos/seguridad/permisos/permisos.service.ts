import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Globals } from "../../../global";

import { DatosRolUsuario } from "./datosrolusuario";

@Injectable()
export class PermisosService {
  public url: string;
  public mat: string;
  public ci: string;
  public fn: string;

  constructor(private _http: HttpClient, private globals: Globals) {
    //this.url='http://localhost:8383/';
    this.url = globals.rutaSrvBackEnd;
    //this.url='http://192.168.1.153:8383/';
  }

  /*CRUD ROL USUARIO*/
  getAltaPermiso(alta: DatosRolUsuario) {
    //        console.log(alta);
    let IDROL = alta.IDROL;
    let IDUSUARIO = alta.IDUSUARIO;
    let FECHAEXPIRACION = alta.FECHAEXPIRACION;
    let IDESTADO = 31;
    let operacion = "I";

    return this._http.get(
      this.url +
        "mseg_insertaper/" +
        operacion +
        "/" +
        IDROL +
        "/" +
        IDUSUARIO +
        "/" +
        FECHAEXPIRACION +
        "/" +
        IDESTADO
    );
  }

  ListaUsuarios() {
    return this._http.get(this.url + "mseg_listausuarios");
  }

  ListaRolModulo(idusuario: string) {
    let IDUSUARIO = idusuario;

    return this._http.get(this.url + "mseg_listarolmodulo" + "/" + IDUSUARIO);
  }

  buscapermisosxparametros(idusuario: string) {
    let operacion = "C";
    let IDUSUARIO = idusuario;

    return this._http.get(
      this.url + "buscapermisosxparametros/" + operacion + "/" + IDUSUARIO
    );
  }

  getModificaPermiso(alta: DatosRolUsuario) {
    //console.log(alta);
    let operacion = "U";
    let IDROL = alta.IDROL;
    let IDUSUARIO = alta.IDUSUARIO;
    //let FECHAVIGENCIA = alta.FECHAVIGENCIA;
    let FECHAEXPIRACION = alta.FECHAEXPIRACION;

    return this._http.get(
      this.url +
        "mseg_actualizaper/" +
        operacion +
        "/" +
        IDROL +
        "/" +
        IDUSUARIO +
        "/" +
        FECHAEXPIRACION
    );
  }

  getModificaEstadoPermiso(alta: DatosRolUsuario) {
    let IDROL = alta.IDROL;
    let IDUSUARIO = alta.IDUSUARIO;
    let IDESTADO = alta.IDESTADO;
    let operacion = "D";

    return this._http.get(
      this.url +
        "mseg_estadoper/" +
        operacion +
        "/" +
        IDROL +
        "/" +
        IDUSUARIO +
        "/" +
        IDESTADO
    );
  }
}
