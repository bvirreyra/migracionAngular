import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Globals } from "../../../../../global";

@Injectable({
  providedIn: "root",
})
export class FormularioResumenService {
  public url: string;
  userName: string;
  loggeIn: boolean;

  constructor(private _http: HttpClient, private globals: Globals) {
    this.url = globals.rutaSrvBackEnd;
  }
  crudPriorizacion(datos) {
    console.log("Priorizacion===>", datos);
    return this._http.get(this.url + "15_crudPriorizacion", { params: datos });
  }
  datosResumenCompromiso(id_compromiso) {
    return this._http.get(
      this.url + "15_datosResumenCompromiso/" + id_compromiso
    );
  }
  crudResumenCompromiso(datos) {
    console.log("DATOS ENVIADOS AL API", datos);
    return this._http.get(this.url + "15_crudResumenCompromiso", {
      params: datos,
    });
  }
  rptResumenTecnico(data) {
    return this._http.get(this.url + "15_reporteResumenTecnico/", {
      responseType: 'arraybuffer',
      params: data,
    });
  }
}
