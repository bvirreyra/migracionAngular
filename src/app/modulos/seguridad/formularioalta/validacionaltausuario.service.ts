import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Globals } from "../../../global";

import { DatosUsuario } from "./datosusuario";
import { FormularioAlta } from "./formularioalta";

@Injectable()
export class ValidacionAltaService {
  public url: string;
  public mat: string;
  public ci: string;
  public fn: string;

  constructor(private _http: HttpClient, private globals: Globals) {
    //this.url='http://localhost:8383/';
    this.url = globals.rutaSrvBackEnd;
    //this.url='http://192.168.1.153:8383/';
  }

  getValidaUsuario(validacion: FormularioAlta) {
    var mat = validacion.MAT;
    var ci = validacion.DOC_ID;
    var fn = validacion.FECHA_NACIMIENTO;

    return this._http.get(
      this.url + "validausuario/" + mat + "/" + ci + "/" + fn
    );
  }
  getAltaUsuario(alta: DatosUsuario) {
    let USU_ID = alta.USU_ID;
    let USU_APAT = alta.USU_APAT;
    let USU_AMAT = alta.USU_AMAT;
    let USU_NOM = alta.USU_NOM;
    let USU_PERFIL = 0;
    let USU_GRUPO = "ASEGURADOS";
    let MEDI_COD = null;
    let ESP_COD = null;
    let ESP_NOM = null;
    let IDESTADO = 31;
    let MATRICULA = alta.MATRICULA;
    let CORREO = alta.CORREO;
    let PASSWORD = alta.PASSWORD;
    let ACCION = alta.ACCION;

    return this._http.get(
      this.url +
        "altausuario/" +
        USU_ID +
        "/" +
        USU_APAT +
        "/" +
        USU_AMAT +
        "/" +
        USU_NOM +
        "/" +
        USU_PERFIL +
        "/" +
        USU_GRUPO +
        "/" +
        MEDI_COD +
        "/" +
        ESP_COD +
        "/" +
        ESP_NOM +
        "/" +
        IDESTADO +
        "/" +
        MATRICULA +
        "/" +
        CORREO +
        "/" +
        PASSWORD +
        "/" +
        ACCION
    );
  }
  emailcuentausuario(user: string, pass: string, email: string) {
    return this._http.get(
      this.url + "email/" + user + "/" + pass + "/" + email
    );
  }
}
