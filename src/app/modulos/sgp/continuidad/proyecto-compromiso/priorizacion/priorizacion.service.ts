import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Globals } from "../../../../../global";

var varsession = "";
@Injectable({
  providedIn: "root",
})
export class PriorizacionService {
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
  listaPriorizacionProyecto(datos) {
    console.log("Priorizacion===>", datos);
    return this._http.get(this.url + "15_listaPriorizacionProyecto", {
      params: datos,
    });
  }
}
