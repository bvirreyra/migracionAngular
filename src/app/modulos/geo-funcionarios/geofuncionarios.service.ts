import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Globals } from "../../global";

var varsession = "";

@Injectable({
  providedIn: "root",
})
export class GeofuncionariosService {
  public url: string;
  userName: string;
  loggeIn: boolean;

  constructor(private _http: HttpClient, private globals: Globals) {
    this.url = globals.rutaSrvBackEnd;
  }

  // listaGeoUbicaciones() {
  //   return this._http.get(this.url + '8_listaGeoUbicaciones/');
  // }
  // insertaGeoFuncionario(unidad,nomb,app,apm,ci,complemento,exp,celular,direccion,latitud,longitud) {
  //   return this._http.get(this.url + '8_insertaGeoFuncionario/' + unidad + '/'+ nomb + '/' +app + '/'+apm + '/'+ ci+ '/'+complemento + '/'+exp + '/'+celular + '/'+direccion + '/'+latitud + '/'+longitud );
  // }
}
