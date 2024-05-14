import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Globals } from "../../../../global";

@Injectable({
  providedIn: "root",
})
export class ProgramacionService {
  public url: string;
  userName: string;
  loggeIn: boolean;

  constructor(private _http: HttpClient, private globals: Globals) {
    this.url = globals.rutaSrvBackEnd;
  }
  mantenimientoProgramacion(datos) {
    return this._http.get(this.url + "10_mantenimientoProgramacion", {
      params: datos,
    });
  }
  listaProgramacion(id_proyecto) {
    return this._http.get(this.url + "10_listaProgramacion/" + id_proyecto);
  }
  reporteProgramacion(periodo) {
    return this._http.get(this.url + "10_reporteProgramacion/", {
      responseType: 'arraybuffer',
      params: periodo,
    });
  }
  listaEstructuraProgramacion() {
    return this._http.get(this.url + "10_listaEstructuraProgramacion");
  }
  listaUbicacionProgramacion() {
    return this._http.get(this.url + "10_listaUbicacionProgramacion");
  }
}
