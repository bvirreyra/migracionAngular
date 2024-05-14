import { Injectable } from "@angular/core";
//import { Http } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Globals } from "../../global";

var varsession = "";
@Injectable()
export class SeguimientoProyectosService {
  public url: string;
  userName: string;
  loggeIn: boolean;

  constructor(private _http: HttpClient, private globals: Globals) {
    this.url = globals.rutaSrvBackEnd;
  }

  listaProyectosSeguimiento(dts) {
    return this._http.get(this.url + "10_listaProyectosSeguimiento", {
      params: dts,
    });
  }
  registraCertificacionPresupuestaria(dts) {
    return this._http.get(this.url + "10_registraCertificacionPresupuestaria", {
      params: dts,
    });
  }
  obtenerConfCorreo(id_config_correo) {
    return this._http.get(
      this.url + "10_obtieneConfCorreo/" + id_config_correo
    );
  }
  /************************************
   * MONITOREO PROGRAMACION
   ***********************************/
  listaProyectosMonitoreoProgramacion(dts) {
    return this._http.get(this.url + "19_listaProyectosProgramacion", {
      params: dts,
    });
  }
  /*******hr poryectos */
  bandejaProyectoHR = (dts) =>
    this._http.get(this.url + "19_bandejaProyectoHR", { params: dts });
  proveidoDiasUnidad = (dts) =>
    this._http.get(this.url + "19_proveidoDiasUnidad", { params: dts });
  proveidoMax = (dts) =>
    this._http.get(this.url + "19_proveidoMax", { params: dts });
  /************************************
   * Líquido Pagable
   ***********************************/
  proyectosLiquidoPagable = (dts: any) =>
    this._http.get(this.url + "19_proyectosLiquidoPagable", { params: dts });
  liquidoPagableAnterior = (dts: any) =>
    this._http.get(this.url + "19_liquidoPagableAnterior", { params: dts });
  montosProgramados = (dts: any) =>
    this._http.get(this.url + "19_montosProgramados", { params: dts });
  reportes = (dts: any) =>
    this._http.get(this.url + "19_reportes", {
      params: dts,
      responseType: "arraybuffer",
    });
  reportesDTS = (dts: any) =>
    this._http.post(this.url + "19_reportDTS", dts, {
      responseType: "arraybuffer",
    });
}
