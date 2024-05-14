import { Injectable } from "@angular/core";
//import { Http } from "@angular/http";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Globals } from "../../global";

var varsession = "";
@Injectable()
export class SeguimientoService {
  public url: string;
  userName: string;
  loggeIn: boolean;

  constructor(private _http: HttpClient, private globals: Globals) {
    this.url = globals.rutaSrvBackEnd;
  }

  listaProyectos() {
    return this._http.get(this.url + "6_listaProyectos/");
  }
  listaProyectosxIdSeguimiento(id_seguimiento) {
    return this._http.get(
      this.url + "6_listaProyectoxIdSeguimiento/" + id_seguimiento
    );
  }
  listaEstadosProyecto() {
    return this._http.get(this.url + "6_listaEstadosProyecto/");
  }
  listaEstadoSupervision() {
    return this._http.get(this.url + "6_listaEstadoSupervision/");
  }
  actualizaEstadosProyecto(id_proyecto, estado_proyecto) {
    return this._http.get(
      this.url +
        "6_actualizaEstadosProyecto/" +
        id_proyecto +
        "/" +
        estado_proyecto
    );
  }
  listaSupervision(id_proyecto) {
    return this._http.get(this.url + "6_listaSupervision/" + id_proyecto);
  }
  actualizaEstadosSupervision(id_supervision, estado_supervision) {
    return this._http.get(
      this.url +
        "6_actualizaEstadosSupervision/" +
        id_supervision +
        "/" +
        estado_supervision
    );
  }
  /*Reset de Contraseña del Usuario*/
  listaequipotecnico(id_proyecto) {
    return this._http.get(this.url + "6_listaequipotecnico/" + id_proyecto);
  }
  reseteocontrasena(id_usuario) {
    return this._http.get(this.url + "6_resetpassword/" + id_usuario);
  }
  reponercontrasena(id_usuario, pass) {
    return this._http.get(
      this.url + "6_reponerpassword/" + id_usuario + "/" + pass
    );
  }
  listaBoletas(id_proyecto) {
    return this._http.get(this.url + "6_listaboletas/" + id_proyecto);
  }
  eliminaboleta(id_boleta, id_proyecto) {
    return this._http.get(
      this.url + "6_eliminaboleta/" + id_boleta + "/" + id_proyecto
    );
  }
  listaItems(id_proyecto) {
    return this._http.get(this.url + "6_listaitems/" + id_proyecto);
  }

  unidadmedida() {
    return this._http.get(this.url + "6_unidadmedida/");
  }
  editaitems(id_item, unidadmedida, cantidad, preciounitario, estado) {
    return this._http.get(
      this.url +
        "6_editaitems/" +
        id_item +
        "/" +
        unidadmedida +
        "/" +
        cantidad +
        "/" +
        preciounitario +
        "/" +
        estado
    );
  }
  editaitems_gestion(dts) {
    return this._http.get(this.url + "18_editaitems_gestion", { params: dts });
  }
  eliminaItems_gestion(dts) {
    return this._http.get(this.url + "18_eliminaitems_gestion", {
      params: dts,
    });
  }
  // insertaitems(dts) {
  //   return this._http.get(this.url + "18_importaritems", { params: dts });
  // }
  importaitems(dts) {
    return this._http.post(this.url + "18_importaritems/", dts, {
      responseType: 'text' as 'text',
    });
    // .subscribe((data) => {
    //   console.log("DATOS POST====>", data);
    // });
  }
  /*************************************************
    ELIMINA PLANILLA
    **************************************************/
  eliminarPlanilla(id_supervision) {
    return this._http.get(this.url + "6_eliminarSupervision/" + id_supervision);
  }
  /************************************** */
  //UBICACION GEOGRAFICA
  listaDepartamentos() {
    return this._http.get(this.url + "6_listaDepartamento/");
  }
  listaProvincias() {
    return this._http.get(this.url + "6_listaProvincia/");
  }
  listaMunicipios() {
    return this._http.get(this.url + "6_listaMunicipio/");
  }
  /******************************************
   * MODULO DE GESTION DE PROYECTOS
   *****************************************/

  listaProyectosGestion() {
    return this._http.get(this.url + "18_listaProyectosGestion/");
  }
  asignacionGestionProyectoUsuario(
    id_proyecto,
    id_tecnico,
    id_usuarioregistro
  ) {
    return this._http.get(
      this.url +
        "18_asignacionGestionProyectoUsuario/" +
        id_proyecto +
        "/" +
        id_tecnico +
        "/" +
        id_usuarioregistro
    );
  }
  historialUsuarioAsignadoGestionProyectos(id_proyecto) {
    return this._http.get(
      this.url + "18_historialUsuarioAsignadoGestionProyectos/" + id_proyecto
    );
  }
  listaAdjuntosProyecto(id_proyecto, id_seguimiento) {
    return this._http.get(
      this.url +
        "18_listaAdjuntosProyecto/" +
        id_proyecto +
        "/" +
        id_seguimiento
    );
  }
  crudRegistroArchivoAdjunto(dts) {
    return this._http.get(this.url + "18_crudArchivoAdjuntoProyecto", {
      params: dts,
    });
  }
  terminaProcesoGestion(dts) {
    return this._http.get(this.url + "18_terminaprocesogestion", {
      params: dts,
    });
  }
}
