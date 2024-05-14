import { Injectable } from "@angular/core";
// import { Http } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import { Globals } from "../../global";

var varsession = "";

@Injectable({
  providedIn: "root",
})
export class RrhhService {
  public url: string;
  public url_sqlserver: string;
  userName: string;
  loggeIn: boolean;

  constructor(private _http: HttpClient, private globals: Globals) {
    this.url = globals.rutaSrvBackEnd;
    this.url_sqlserver = globals.rutaSrvBackEndFonadal;
  }
  /*BLOQUE DE CONSULTAS SQL SERVER*/
  listaAsistencia(id_siga, fec_inicio, fec_fin) {
    const data = {id_siga, fec_inicio, fec_fin}
    return this._http.get(this.url + "11_lista_asistenciaV2/",{params:data});
  }

  verificaMinutosUsuario(datos) {
    return this._http.get(this.url + "11_verificaSaldoPermisos", {params: datos,});
  }

  listaSanciones() {
    return this._http.get(this.url + "11_sancion_atrasos/");
  }

  listaUsuarioSQL() {
    return this._http.get(this.url + "11_listar_usuarios/");
  }

  listarFeriados() {
    return this._http.get(this.url + "11_listarFeriados/");
  }

  listaMarcadoSinDepurar(id_siga, fec_inicio, fec_fin) {
    const data = {id_siga, fec_inicio, fec_fin}
    return this._http.post(this.url +"11_asistencia_sin_depurar/",data,{responseType:'json' as 'json'});
  }
  marcacionesUsuarioBiometrico(iusubio) {
    const data = {iusubio}
    return this._http.get(this.url + "11_marcaciones/",{params:data});
  }
  listaPermisosUsuario(id_usuario) {
    const data = {id_usuario}
    return this._http.get(this.url + "11_permisos/",{params:data});
  }

  listaTipoPermiso() {
    return this._http.get(this.url + "11_tipo_permiso");
  }

  insertaGrupousuario(datos) {
    return this._http.get(this.url + "11_inserta_grupo_usuario", {params: datos,});
  }

  actualizarMarcacion(datos) {
    return this._http.get(this.url + "11_actualiza_asistencia", {params: datos,});
  }

  insertaHorario(datos) {
    return this._http.get(this.url + "11_insertar_horario", {params: datos,});
  }

  abmFeriados(datos) {
    return this._http.get(this.url + "11_abm_feriado", {params: datos,});
  }

  abmGrupoFuncionario(datos) {
    return this._http.get(this.url + "11_abm_grupoFuncinario", {params: datos,});
  }

  insertaPermiso(datos) {
    return this._http.get(this.url + "11_inserta_permiso", {params: datos,});
  }
  insertaHorarioExcepcion(datos) {
    return this._http.get(this.url + "11_inserta_horario_excepcion", {params: datos,});
  }

  listaTipoHorario() {
    return this._http.get(this.url + "11_tipo_horario");
  }

  listaDetalleGrupoFuncionario(idTipoHorario) {
    const data = {idTipoHorario}
    return this._http.get(this.url + "11_grupo_funcionario_detalle",{params:data});
  }

  listaHorarioExcepcion() {
    return this._http.get(this.url + "11_horario_excepcion");
  }

  listaGrupoFuncionario() {
    return this._http.get(this.url + "11_grupo_funcionario");
  }

  /*BLOQUE DE CONSULTAS PGSQL*/
  listaUsuarioSispre(id_siga) {
    return this._http.get(this.url + "lista_usuariosisuprebiometrico/" + id_siga);
  }

  listaUsuariosDatosPendientes(nombres, apaterno, amaterno) {
    return this._http.get(
      this.url +
        "lista_usuarios_datos/" +
        nombres +
        "/" +
        apaterno +
        "/" +
        amaterno
    );
  }
  insertaActualizaDatos(iusuid, icua, icuenta, idescripcion, ifecha, iusuario) {
    return this._http.get(
      this.url +
        "inserta_datosUsuario/" +
        iusuid +
        "/" +
        icua +
        "/" +
        icuenta +
        "/" +
        idescripcion +
        "/" +
        ifecha +
        "/" +
        iusuario
    );
  }
  insertaActualizaBiometrico(iusuid, iusubio, iusuario) {
    return this._http.get(
      this.url + "inserta_biometrico/" + iusuid + "/" + iusubio + "/" + iusuario
    );
  }

  listarOmisiones = (data) =>
    this._http.get(this.url + "11_listarOmisiones", { params: data });

  /****************************************************
   * CONTENEDOR DE DOCUMENTOS
   ****************************************************/
  listaContenedor() {
    return this._http.get(this.url + "13_listadocumentos");
  }
  listaTipoDocumento() {
    return this._http.get(this.url + "13_tipodocumentos");
  }
  insertaDatosDocumento(
    tipo_documento,
    cite,
    fecha_documento,
    descripcion,
    ruta,
    id_usr
  ) {
    return this._http.get(
      this.url +
        "13_insertaDatosDocumento/" +
        tipo_documento +
        "/" +
        cite +
        "/" +
        fecha_documento +
        "/" +
        descripcion +
        "/" +
        ruta +
        "/" +
        id_usr
    );
  }
  eliminaDocumento(id) {
    return this._http.get(this.url + "13_eliminaDocumento/" + id);
  }
  reportes(dts:any) {
    return this._http.get(this.url + '11_reportesRRHH/',{responseType:'arraybuffer',params: dts});
  }
}
