import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Globals } from "../../../global";

var varsession = "";
@Injectable()
export class RolesService {
  public url: string;
  public urlFonadal: string;
  userName: string;
  loggeIn: boolean;

  constructor(private _http: HttpClient, private globals: Globals) {
    //this.url='http://localhost:8383/';
    this.url = globals.rutaSrvBackEnd;
    this.urlFonadal = globals.rutaSrvBackEndFonadal;

    //this.url='http://192.168.1.153:8383/';
    this.userName = "";
    this.loggeIn = false;
  }

  //roles
  getListarRoles(nombre: string, descripcion: string) {
    return this._http.get(
      this.url + "muestra_roles/" + nombre + "/" + descripcion
    );
  }
  getActualizaRol(
    e_idrol: string,
    e_nombre: string,
    e_descripcion: string,
    e_idmodulo: string,
    e_estado: string
  ) {
    return this._http.get(
      this.url +
        "actualiza_rol/" +
        e_idrol +
        "/" +
        e_nombre +
        "/" +
        e_descripcion +
        "/" +
        e_idmodulo +
        "/" +
        e_estado
    );
  }
  getInsertaNuevoRol(
    e_nombre: string,
    e_descripcion: string,
    e_idmodulo: string,
    e_estado: string
  ) {
    return this._http.get(
      this.url +
        "inserta_rol/" +
        e_nombre +
        "/" +
        e_descripcion +
        "/" +
        e_idmodulo +
        "/" +
        e_estado
    );
  }

  getEliminaRegistroActual(id: string) {
    return this._http.get(this.url + "elimina_registro_roles/" + id);
  }

  getBuscarModulos() {
    return this._http.get(this.url + "buscar_modulos/");
  }
}
