import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Globals } from "../../../global";

var varsession = "";
@Injectable()
export class RolUsuarioService {
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
  //rol usuarios
  getListarRolUsuario(m_idrol: string, m_idusuario: string) {
    return this._http.get(
      this.url + "muestra_rolusuario/" + m_idrol + "/" + m_idusuario
    );
  }

  getActualizaRolUsuario(
    e_id: string,
    e_idrol: string,
    e_idusuario: string,
    e_estado: string
  ) {
    return this._http.get(
      this.url +
        "actualiza_rolusuario/" +
        e_id +
        "/" +
        e_idrol +
        "/" +
        e_idusuario +
        "/" +
        e_estado
    );
  }

  getInsertaNuevoRolUsuario(
    e_idrol: string,
    e_idususario: string,
    e_estado: string,
    e_fecha: string
  ) {
    return this._http.get(
      this.url +
        "inserta_rolusuario/" +
        e_idrol +
        "/" +
        e_idususario +
        "/" +
        e_estado +
        "/" +
        e_fecha
    );
  }
  getInsertaRolUsuarioInicial(e_idususario: string) {
    return this._http.get(
      this.url + "inserta_rolusuarioinicial/" + e_idususario
    );
  }

  getEliminaRegistroRolUsuario(id: string) {
    return this._http.get(this.url + "elimina_registro_rolusuario/" + id);
  }

  getBuscarRoles() {
    return this._http.get(this.url + "buscar_roles/");
  }

  getBuscarUsuarios() {
    return this._http.get(this.url + "buscar_usuarios/");
  }

  getActualizaEstado(m_idusuario: string, m_idestado: string) {
    return this._http.get(
      this.url + "actualiza_estado_roles/" + m_idusuario + "/" + m_idestado
    );
  }
  descargarFormularioFAS09() {
    return this._http.get(this.url + "1_descargar_formulariofas09/", {
      responseType: 'arraybuffer',
      //params: data,
    });
  }
}
