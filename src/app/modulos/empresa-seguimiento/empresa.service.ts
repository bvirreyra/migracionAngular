import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Globals } from "../../global";

var varsession = "";

@Injectable()
export class EmpresaService {
  public url: string;
  userName: string;
  loggeIn: boolean;

  constructor(private _http: HttpClient, private globals: Globals) {
    this.url = globals.rutaSrvBackEnd;
  }
  listaDatosEmpresa(nit) {
    return this._http.get(this.url + "10_listaDatosEmpresa/" + nit);
  }
  listaProyectosEmpresa(nit) {
    return this._http.get(this.url + "10_listaProyectosEmpresa/" + nit);
  }
}
