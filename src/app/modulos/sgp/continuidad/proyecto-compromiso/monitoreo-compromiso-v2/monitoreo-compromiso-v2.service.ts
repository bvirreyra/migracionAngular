import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Globals } from "../../../../../global";

@Injectable({
  providedIn: "root",
})
export class MonitoreoCompromisoV2Service {
  public url: string;
  userName: string;
  loggeIn: boolean;

  constructor(private _http: HttpClient, private globals: Globals) {
    this.url = globals.rutaSrvBackEnd;
  }
  listaBandejaMonitoreo(id_rol) {
    return this._http.get(this.url + "17_listaBandejaMonitoreo/" + id_rol);
  }
  listaEstadosMonitoreo(id_flujo) {
    return this._http.get(this.url + "17_listaEstadosMonitoreo/" + id_flujo);
  }
  obtieneTransicion(dts) {
    return this._http.get(this.url + "17_obtieneTransicion", { params: dts });
  }
  crudMonitoreoV2(dts) {
    return this._http.get(this.url + "17_crudMonitoreoV2", { params: dts });
  }
  actualizaObservacion(dts) {
    return this._http.get(this.url + "17_monitoreoObservacion", {
      params: dts,
    });
  }
  actualizaContacto(dts) {
    return this._http.get(this.url + "17_monitoreoContacto", {
      params: dts,
    });
  }
  registrosMonitoreoV2(id_compromiso, id_flujo) {
    return this._http.get(
      this.url + "17_registrosMonitoreoV2/" + id_compromiso + "/" + id_flujo
    );
  }
  registrosObservaciones(id_compromiso) {
    return this._http.get(
      this.url + "17_registrosObservaciones/" + id_compromiso
    );
  }
  insertaEstructuraFinanciamiento(dts) {
    return this._http.get(this.url + "17_insertaEstructuraFinanciamiento", {
      params: dts,
    });
  }
  cambiaEstadosMonitoreo(id_compromiso, estructura_financiera, estado) {
    return this._http.get(
      this.url +
        "17_cambiaEstadosMonitoreo/" +
        id_compromiso +
        "/" +
        estructura_financiera +
        "/" +
        estado
    );
  }
}
