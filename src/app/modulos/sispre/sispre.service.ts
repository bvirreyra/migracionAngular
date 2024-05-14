import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Globals } from "../../global";

var varsession = "";

@Injectable()
export class SispreService {
  public url: string;
  public urlFonadal: string;
  public urlSgp: string;
  userName: string;
  loggeIn: boolean;

  constructor(private _http: HttpClient, private globals: Globals) {
    this.url = globals.rutaSrvBackEnd;
    this.urlFonadal = globals.rutaSrvBackEndFonadal;
    this.userName = "";
    this.loggeIn = false;
  }

  /******************************** CITES ********************************/
  busquedaUsuariosSispre() {
    return this._http.get(this.url + "busquedaUsuariosSispre");
  }
  listaCites() {
    return this._http.get(this.url + "listaCites");
  }
  listaCitesGeneral(operacion: string, idUsuario: string) {
    return this._http.get(
      this.url + "listaCitesGeneral/" + operacion + "/" + idUsuario
    );
  }
  listaCitesEspecifico(
    operacion: string,
    idUsuario: string,
    idCite: string,
    gestion: string
  ) {
    return this._http.get(
      this.url +
        "listaCitesEspecifico/" +
        operacion +
        "/" +
        idUsuario +
        "/" +
        idCite +
        "/" +
        gestion
    );
  }
  insertaCite(
    operacion: string,
    idUsuario: string,
    idCite: string,
    asuntoReferencia: string
  ) {
    return this._http.get(
      this.url +
        "insertaCite/" +
        operacion +
        "/" +
        idUsuario +
        "/" +
        idCite +
        "/" +
        asuntoReferencia
    );
  }
  actualizaCite(
    operacion: string,
    idDetalle: string,
    asuntoReferencia: string
  ) {
    return this._http.get(
      this.url +
        "actualizaCite/" +
        operacion +
        "/" +
        idDetalle +
        "/" +
        asuntoReferencia
    );
  }
  anulaConfirmaCite(
    operacion: string,
    idDetalle: string,
    descripcion: string,
    idEstado: string
  ) {
    return this._http.get(
      this.url +
        "anulaConfirmaCite/" +
        operacion +
        "/" +
        idDetalle +
        "/" +
        descripcion +
        "/" +
        idEstado
    );
  }
  modificacionCite(
    operacion: string,
    idUsuario: string,
    idCite: string,
    idDetalle: string,
    asuntoReferencia: string,
    descripcion: string,
    idEstado: string,
    fecha: string
  ) {
    return this._http.get(
      this.url +
        "modificacionCite/" +
        operacion +
        "/" +
        idUsuario +
        "/" +
        idCite +
        "/" +
        idDetalle +
        "/" +
        asuntoReferencia +
        "/" +
        descripcion +
        "/" +
        idEstado +
        "/" +
        fecha
    );
  }
  busquedaCite(
    operacion: string,
    idCite: string,
    numeroCite: string,
    asuntoReferencia: string,
    idEstado: string,
    gestion: string
  ) {
    return this._http.get(
      this.url +
        "busquedaCite/" +
        operacion +
        "/" +
        idCite +
        "/" +
        numeroCite +
        "/" +
        asuntoReferencia +
        "/" +
        idEstado +
        "/" +
        gestion
    );
  }
}
