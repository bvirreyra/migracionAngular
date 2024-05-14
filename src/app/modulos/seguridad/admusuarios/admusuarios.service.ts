import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Globals } from "../../../global";

var varsession = "";
@Injectable()
export class AdmusuariosService {
  public url: string;
  public urlFonadal: string;
  public urlSgp: string;
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
  //usuarios
  getListarUsuarios(nombres: string, apaterno: string, amaterno: string) {
    return this._http.get(
      this.url + "muestra_usuarios/" + nombres + "/" + apaterno + "/" + amaterno
    );
  }
  getActualizaUsuario(
    e_nombres: string,
    e_apaterno: string,
    e_amaterno: string,
    m_ci: string,
    e_complemento: string,
    e_expedido: string,
    m_fn: string,
    m_email: string,
    m_celular: string,
    m_direcciondom: string,
    m_unidad: string,
    m_cargo: string,
    e_nusuario: string,
    e_pass: string,
    e_estado: string,
    m_usu_id: string,
    m_responsablepreinversion: string,
    m_pinpbx: string,
    m_nrointerno: string
  ) {
    console.log("ENTRA AQUI");
    console.log(
      "actualiza_usuario/" +
        e_nombres +
        "/" +
        e_apaterno +
        "/" +
        e_amaterno +
        "/" +
        m_ci +
        "/" +
        e_complemento +
        "/" +
        e_expedido +
        "/" +
        m_fn +
        "/" +
        m_email +
        "/" +
        m_celular +
        "/" +
        m_direcciondom +
        "/" +
        m_unidad +
        "/" +
        m_cargo +
        "/" +
        e_nusuario +
        "/" +
        e_pass +
        "/" +
        e_estado +
        "/" +
        m_usu_id +
        "/" +
        m_responsablepreinversion +
        "/" +
        m_pinpbx +
        "/" +
        m_nrointerno
    );
    return this._http.get(
      this.url +
        "actualiza_usuario/" +
        e_nombres +
        "/" +
        e_apaterno +
        "/" +
        e_amaterno +
        "/" +
        m_ci +
        "/" +
        e_complemento +
        "/" +
        e_expedido +
        "/" +
        m_fn +
        "/" +
        m_email +
        "/" +
        m_celular +
        "/" +
        m_direcciondom +
        "/" +
        m_unidad +
        "/" +
        m_cargo +
        "/" +
        e_nusuario +
        "/" +
        e_pass +
        "/" +
        e_estado +
        "/" +
        m_usu_id +
        "/" +
        m_responsablepreinversion +
        "/" +
        m_pinpbx +
        "/" +
        m_nrointerno
    );
  }
  getInsertaNuevoUsuario(
    e_nombres: string,
    e_apaterno: string,
    e_amaterno: string,
    m_ci: string,
    e_complemento: string,
    e_expedido: string,
    m_fn: string,
    m_email: string,
    m_celular: string,
    m_direcciondom: string,
    m_unidad: string,
    m_cargo: string,
    e_nusuario: string,
    e_pass: string,
    e_estado: string,
    s_usu_id: string,
    m_responsablepreinversion: string,
    m_pinpbx: string,
    m_nrointerno: string
  ) {
    return this._http.get(
      this.url +
        "inserta_usuario/" +
        e_nombres +
        "/" +
        e_apaterno +
        "/" +
        e_amaterno +
        "/" +
        m_ci +
        "/" +
        e_complemento +
        "/" +
        e_expedido +
        "/" +
        m_fn +
        "/" +
        m_email +
        "/" +
        m_celular +
        "/" +
        m_direcciondom +
        "/" +
        m_unidad +
        "/" +
        m_cargo +
        "/" +
        e_nusuario +
        "/" +
        e_pass +
        "/" +
        e_estado +
        "/" +
        s_usu_id +
        "/" +
        m_responsablepreinversion +
        "/" +
        m_pinpbx +
        "/" +
        m_nrointerno
    );
  }
  InsertaNuevoUsuarioSipta(
    m_usu_id: string,
    m_idcargo: string,
    m_ci: string,
    m_direcciondom: string,
    m_celular: string,
    m_email: string,
    e_nusuario: string,
    e_pass: string,
    m_nombrecompleto: string,
    e_estado: string
  ) {
    const data={op:'I',m_usu_id,m_idcargo,m_ci,m_direcciondom,m_celular
      ,m_email,e_nusuario,e_pass,m_nombrecompleto,e_estado}
    return this._http.get(this.url +"crudUsuario_sipta/",{params:data});
  }
  InsertaNuevoUsuarioSgp(
    m_usu_id: string,
    e_nusuario: string,
    m_email: string,
    e_pass: string,
    e_estado: string,
    m_nombrecompleto: string,
    m_responsablepreinversion: string
  ) {
    return this._http.get(
      this.url +
        "dbprod_insertausuario/" +
        m_usu_id +
        "/" +
        e_nusuario +
        "/" +
        m_email +
        "/" +
        e_pass +
        "/" +
        e_estado +
        "/" +
        m_nombrecompleto +
        "/" +
        m_responsablepreinversion
    );
  }
  ActualizaUsuarioSgp(
    m_usu_id: string,
    e_nusuario: string,
    m_email: string,
    e_pass: string,
    e_estado: string,
    m_nombrecompleto: string,
    m_responsablepreinversion: string
  ) {
    return this._http.get(
      this.url +
        "dbprod_updateusuario/" +
        m_usu_id +
        "/" +
        e_nusuario +
        "/" +
        m_email +
        "/" +
        e_pass +
        "/" +
        e_estado +
        "/" +
        m_nombrecompleto +
        "/" +
        m_responsablepreinversion
    );
  }
  ActualizaUsuarioSipta(
    m_usu_id: string,
    m_idcargo: string,
    m_ci: string,
    m_direcciondom: string,
    m_celular: string,
    m_email: string,
    e_nusuario: string,
    e_pass: string,
    m_nombrecompleto: string,
    e_estado: string
  ) {
    const data = {op:'U',m_usu_id,m_idcargo,m_ci,m_direcciondom,m_celular
      ,m_email,e_nusuario,e_pass,m_nombrecompleto,e_estado}
    return this._http.get(this.url +"crudUsuario_sipta/",{params:data});
  }

  getEliminaRegistroUsuarios(usu_id: string) {
    return this._http.get(this.url + "elimina_registro_usuario/" + usu_id);
  }

  //Obtiene al usuario para mostrar datos en geofuncionarios
  getUsuarioGeopersonal(idUsuario: any) {
    return this._http.get(this.url + "obtieneUsuario/" + idUsuario);
  }
  getActualizaGeosuario(
    id_usuario: any,
    celular: string,
    direccion: string,
    latitud: string,
    longitud: string
  ) {
    return this._http.get(
      this.url +
        "actualiza_geousuario/" +
        id_usuario +
        "/" +
        celular +
        "/" +
        direccion +
        "/" +
        latitud +
        "/" +
        longitud
    );
  }
  // Obtiene la ubicacion geográfica de los usuarios
  listaGeoUbicaciones() {
    return this._http.get(this.url + "listaGeoUbicacionUsuarios/");
  }
  // Genera pin PBX aleatoriamente
  generaPinPBX() {
    return this._http.get(this.url + "generaPinPBX/");
  }
  verificaPinPBX(m_pinpbx: any, id_usuario: any) {
    return this._http.get(
      this.url + "verificaPinPBX/" + m_pinpbx + "/" + id_usuario
    );
  }
  verificaUsuarioSiga(usr: any) {
    return this._http.get(this.url + "verificaUsuarioSiga/" + usr);
  }
  verificaUsuarioSgp(usr: any) {
    return this._http.get(this.url + "verificaUsuarioSgp/" + usr);
  }
  verificaUsuarioFonadal(usr: any) {
    const data={usr}
    return this._http.get(this.url + "verificaUsuarioFonadal/",{params:data});
  }
}
