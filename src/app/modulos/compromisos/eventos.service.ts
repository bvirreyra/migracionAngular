import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Globals } from "../../global";

var varsession = "";
@Injectable()
export class EventosService {
  public url: string;
  userName: string;
  loggeIn: boolean;

  constructor(private _http: HttpClient, private globals: Globals) {
    this.url = globals.rutaSrvBackEnd;
  }

  listaUbicacionesEventos() {
    return this._http.get(this.url + "5_listaubicacioneventos/");
  }

  getActualizaCompromiso(
    e_id_evento: string,
    e_fcodigo_departamento: string,
    e_fcodigo_municipio: string,
    e_nombre_evento: string,
    e_fecha_evento: string,
    e_detalle_compromiso: string,
    e_fid_tipo: string,
    e_monto: string,
    e_observaciones: string,
    e_fusuario_registro: string,
    e_estado: string
  ) {
    return this._http.get(
      this.url +
        "5_actualizareventos/" +
        e_id_evento +
        "/" +
        e_fcodigo_departamento +
        "/" +
        e_fcodigo_municipio +
        "/" +
        e_nombre_evento +
        "/" +
        e_fecha_evento +
        "/" +
        e_detalle_compromiso +
        "/" +
        e_fid_tipo +
        "/" +
        e_monto +
        "/" +
        e_observaciones +
        "/" +
        e_fusuario_registro +
        "/" +
        e_estado
    );
  }

  getListarFormularioCompromiso(s_nombre_evento: string) {
    return this._http.get(this.url + "5_listaeventos/" + s_nombre_evento);
  }

  getInsertaNuevoCompromiso(
    e_fcodigo_departamento: string,
    e_fcodigo_municipio: string,
    e_nombre_evento: string,
    e_fecha_evento: string,
    e_detalle_compromiso: string,
    e_fid_tipo: string,
    e_monto: string,
    e_observaciones: string,
    e_fusuario_registro: string,
    e_estado: string
  ) {
    return this._http.get(
      this.url +
        "5_insertareventos/" +
        e_fcodigo_departamento +
        "/" +
        e_fcodigo_municipio +
        "/" +
        e_nombre_evento +
        "/" +
        e_fecha_evento +
        "/" +
        e_detalle_compromiso +
        "/" +
        e_fid_tipo +
        "/" +
        e_monto +
        "/" +
        e_observaciones +
        "/" +
        e_fusuario_registro +
        "/" +
        e_estado
    );
  }

  getEliminaCompromiso(e_id_evento: string, e_fusuario_registro: string) {
    return this._http.get(
      this.url + "5_borrareventos/" + e_id_evento + "/" + e_fusuario_registro
    );
  }

  //-------------
  getBuscarDepartamento() {
    return this._http.get(this.url + "5_listadepartamento/");
  }

  getBuscarTipo() {
    return this._http.get(this.url + "5_listatipo/");
  }

  getBuscarMunicipio(cod_dep: string) {
    return this._http.get(this.url + "5_listamunicipio/" + cod_dep);
  }
}
