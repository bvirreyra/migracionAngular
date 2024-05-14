import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Globals } from "../../../global";

var varsession = "";
@Injectable()
export class MMenuRolService {
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

  /*juan*/
  //menu
  getListarMenuRol(m_idrol: string, m_idmenu: string) {
    return this._http.get(
      this.url + "muestra_menurol/" + m_idrol + "/" + m_idmenu
    );
  }

  getActualizaMenuRol(
    e_id: string,
    e_idrol: string,
    e_idmenu: string,
    e_estado: string
  ) {
    return this._http.get(
      this.url +
        "actualiza_menurol/" +
        e_id +
        "/" +
        e_idrol +
        "/" +
        e_idmenu +
        "/" +
        e_estado
    );
  }

  getInsertaNuevoMenuRol(e_idrol: string, e_idmenu: string, e_estado: string) {
    return this._http.get(
      this.url + "inserta_menurol/" + e_idrol + "/" + e_idmenu + "/" + e_estado
    );
  }

  getEliminaRegistroMenuRol(id: string) {
    return this._http.get(this.url + "elimina_registro_menurol/" + id);
  }

  getBuscarRoles() {
    return this._http.get(this.url + "buscar_roles/");
  }

  getBuscarMenu() {
    return this._http.get(this.url + "buscar_menu/");
  }
}
