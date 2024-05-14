import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Globals } from "../../../../../global";

@Injectable({
  providedIn: "root",
})
export class MonitoreoCompromisoService {
  public url: string;
  userName: string;
  loggeIn: boolean;

  constructor(private _http: HttpClient, private globals: Globals) {
    this.url = globals.rutaSrvBackEnd;
  }
  crudMonitoreo(datos) {
    return this._http.get(this.url + "15_crudMonitoreo", { params: datos });
  }
  listaMonitoreoCompromiso(id_compromiso) {
    return this._http.get(
      this.url + "15_listamonitoreocompromiso/" + id_compromiso
    );
  }
  listaEtapasEvaluacion(id_compromiso) {
    return this._http.get(
      this.url + "15_listaetapasevaluacion/" + id_compromiso
    );
  }
  periodoPresidencial() {
    return this._http.get(this.url + "15_periodopresidencial");
  }
}
