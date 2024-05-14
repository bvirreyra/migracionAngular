import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Globals } from "../../../global";

var varsession = "";

@Injectable()
export class ObservacionesService {
  public url: string;
  userName: string;
  loggeIn: boolean;

  constructor(private _http: HttpClient, private globals: Globals) {
    this.url = globals.rutaSrvBackEnd;
  }
  listaObservacion(id_proyecto) {
    return this._http.get(
      this.url + "10_listaObservacionEmpresa/" + id_proyecto
    );
  }
  insertaObservacion(dts) {
    return this._http.get(this.url + "10_insertaObservacion", { params: dts });
  }
  editaObservacion(dts) {
    return this._http.get(this.url + "10_editaObservacion", { params: dts });
  }
  cambioestadoObservacion(dts) {
    return this._http.get(this.url + "10_cambioestadoObservacion", {
      params: dts,
    });
  }
}
