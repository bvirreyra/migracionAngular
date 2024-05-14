import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Globals } from "../../global";

var varsession = "";

@Injectable()
export class SgpService {
  public url: string;
  userName: string;
  loggeIn: boolean;

  constructor(private _http: HttpClient, private globals: Globals) {
    this.url = globals.rutaSrvBackEnd;
  }
  listaProyectos() {
    return this._http.get(this.url + "6_listaProyectos/");
  }
  listaequipotecnico(id_proyecto) {
    return this._http.get(this.url + "6_listaequipotecnico/" + id_proyecto);
  }
  listaSupervision(id_proyecto) {
    return this._http.get(this.url + "6_listaSupervision/" + id_proyecto);
  }
  getBuscarDepartamento() {
    return this._http.get(this.url + "5_listadepartamento/");
  }
  getBuscarDepartamento_detalle() {
    return this._http.get(this.url + "5_listadepartamento_detalle/");
  }

  getBuscarTipo() {
    return this._http.get(this.url + "5_listatipo/");
  }

  getBuscarMunicipio(cod_dep: string) {
    return this._http.get(this.url + "5_listamunicipio/" + cod_dep);
  }
  getBuscarMunicipio_detalle(cod_dep: string) {
    return this._http.get(this.url + "5_listamunicipio_detalle/" + cod_dep);
  }
  listaEntidadContratante() {
    return this._http.get(this.url + "6_listaEntidadContratante/");
  }
  listaTipoFinancimaento() {
    return this._http.get(this.url + "6_listaTipoFinanciamiento/");
  }
  listaArea() {
    return this._http.get(this.url + "6_listaArea/");
  }
  listaClasificacion() {
    return this._http.get(this.url + "6_listaClasificacion/");
  }
  listaSubArea() {
    return this._http.get(this.url + "6_listaSubArea/");
  }
  listaTipoConvenio(tipo: string) {
    return this._http.get(this.url + "1_listaParametricaSeguridad/" + tipo);
  }
  listaTipoResolucionConvenio(tipo: string) {
    return this._http.get(this.url + "1_listaParametricaSeguridad/" + tipo);
  }
  insertaProyectoCabecera(datos) {
    return this._http.get(this.url + "6_insertaProyectoCabecera", {
      params: datos,
    });
  }
  actualizaProyectoCabecera(datos) {
    return this._http.get(this.url + "6_actualizaProyectoCabecera", {
      params: datos,
    });
  }
  insertaSeguimientoProyecto(datos) {
    return this._http.get(this.url + "6_insertaSeguimientoProyecto", {
      params: datos,
    });
  }
  listaTipoProyecto(tipo: string) {
    return this._http.get(this.url + "6_listaParametrica/" + tipo);
  }
  listaEntidadBeneficiaria() {
    return this._http.get(this.url + "6_listaEntidadBeneficiaria/");
  }

  inserta_seguimiento_sgp(
    nombreproyecto: string,
    descripcion: string,
    tipo_proyecto: string,
    entidadbeneficiaria: string,
    detalleentidadbeneficiaria: string,
    departamento: string,
    municipio: string,
    nroconvenio: string,
    fecha_financiamiento: string,
    plazo_ejecucion_convenio: string,
    monto_financiamiento_upre: string,
    monto_contraparte_beneficiario: string,
    monto_contraparte_gobernacion: string,
    monto_contraparte_municipal: string,
    iduser: string
  ) {
    return this._http.get(
      this.url +
        "6_insertaseguimiento_sgp/" +
        nombreproyecto +
        "/" +
        descripcion +
        "/" +
        tipo_proyecto +
        "/" +
        entidadbeneficiaria +
        "/" +
        detalleentidadbeneficiaria +
        "/" +
        departamento +
        "/" +
        municipio +
        "/" +
        nroconvenio +
        "/" +
        fecha_financiamiento +
        "/" +
        plazo_ejecucion_convenio +
        "/" +
        monto_financiamiento_upre +
        "/" +
        monto_contraparte_beneficiario +
        "/" +
        monto_contraparte_gobernacion +
        "/" +
        monto_contraparte_municipal +
        "/" +
        iduser
    );
  }
  inserta_seguimiento_seg(
    nombreproyecto: string,
    descripcionproyecto: string,
    tipo_proyecto: string,
    entidadbeneficiaria: string,
    detallebeneficiario: string,
    departamento: string,
    municipio: string,
    nroconvenio: string,
    fechaconvenio: string,
    plazoconvenio: string,
    monto_financiamiento_upre: any,
    monto_contraparte_beneficiario: any,
    monto_contraparte_gobernacion: any,
    monto_contraparte_municipio: any,
    ci_user: string,
    iduser: string,
    id_proyectosolicitud: number
  ) {
    return this._http.get(
      this.url +
        "6_insertaseguimiento_seg/" +
        nombreproyecto +
        "/" +
        descripcionproyecto +
        "/" +
        tipo_proyecto +
        "/" +
        entidadbeneficiaria +
        "/" +
        detallebeneficiario +
        "/" +
        departamento +
        "/" +
        municipio +
        "/" +
        nroconvenio +
        "/" +
        fechaconvenio +
        "/" +
        plazoconvenio +
        "/" +
        monto_financiamiento_upre +
        "/" +
        monto_contraparte_beneficiario +
        "/" +
        monto_contraparte_gobernacion +
        "/" +
        monto_contraparte_municipio +
        "/" +
        ci_user +
        "/" +
        iduser +
        "/" +
        id_proyectosolicitud
    );
  }
  /********************************************************************************
   * SEGUIMIENTO DE PROYECTOS SGP SEG BOL CAMBIA
   *******************************************************************************/
  listaProyectosConsolidados() {
    return this._http.get(this.url + "6_listaProyectosConsolidados/");
  }
  listaProyectosConsolidadosId(id_proyecto) {
    return this._http.get(
      this.url + "6_listaProyectosConsolidadosId/" + id_proyecto
    );
  }
  listaProyectosConsolidadosxRegion(dpto, usu_id) {
    return this._http.get(
      this.url + "6_listaProyectosConsolidadosxRegion/" + dpto + "/" + usu_id
    );
  }
  listaProyectosContinuidad() {
    return this._http.get(this.url + "6_listaProyectosContinuidad/");
  }
  listaProyectosFlujo() {
    return this._http.get(this.url + "6_listaProyectosFlujo/");
  }
  listaProyectosConsolidadosAsignados(usu_id) {
    return this._http.get(
      this.url + "6_listaProyectosConsolidadosAsignados/" + usu_id
    );
  }
  listaProyectosParaConsolidarV1() {
    return this._http.get(this.url + "10_listaProyectosParaConsolidarV1/");
  }
  listaProyectosParaConsolidarV2() {
    return this._http.get(this.url + "10_listaProyectosParaConsolidarV2/");
  }
  listaProyectosParaConsolidarV3() {
    return this._http.get(this.url + "10_listaProyectosParaConsolidarV3/");
  }
  listaProyectosParaConsolidarV4() {
    return this._http.get(this.url + "10_listaProyectosParaConsolidarV4/");
  }
  editaConsolidacion(id_seg, id_sgp) {
    return this._http.get(
      this.url + "10_editaConsolidacion/" + id_seg + "/" + id_sgp
    );
  }
  inactivaConsolidacion(id_proy) {
    return this._http.get(this.url + "10_inactivaConsolidacion/" + id_proy);
  }
  obtienePorcentajeAvance(datos) {
    return this._http.get(this.url + "10_obtienePocentajeAvance/" + datos);
  }
  listaSupervisionSgp(id_proy) {
    return this._http.get(this.url + "10_listaSupervisionSgp/" + id_proy);
  }
  listaEmpresaSupervision(id_proy) {
    return this._http.get(this.url + "10_listaEmpresaSupervision/" + id_proy);
  }
  listaEmpresaAmpliacion(id_proy) {
    return this._http.get(this.url + "10_listaEmpresaAmpliacion/" + id_proy);
  }
  listaEmpresaImagenes(id_proy) {
    return this._http.get(this.url + "10_listaEmpresaImagenes/" + id_proy);
  }
  listaEmpresaContactos(id_proy) {
    return this._http.get(this.url + "10_listaEmpresaContactos/" + id_proy);
  }
  listaAmpliacionPlazoSgp(id_proy) {
    return this._http.get(this.url + "10_listaAmpliacionPlazoSgp/" + id_proy);
  }
  listaContactosSgp(id_proy) {
    return this._http.get(this.url + "10_listaContactosSgp/" + id_proy);
  }
  listaFichaTecnica(id_proy) {
    return this._http.get(this.url + "10_listaFichaTecnicaSgp/" + id_proy);
  }
  listaDerechoPropietarioSgp(id_proy) {
    return this._http.get(
      this.url + "10_listaDerechoPropietarioSgp/" + id_proy
    );
  }
  listaRatificacionSgp(id_proy) {
    return this._http.get(this.url + "10_listaRatificacionSgp/" + id_proy);
  }
  listaCierreAdministrativoSgp(id_proy) {
    return this._http.get(
      this.url + "10_listaCierreAdministrativoSgp/" + id_proy
    );
  }

  listaSeguimientoEjecucionSgp(id_proy) {
    return this._http.get(
      this.url + "10_listaSeguimientoEjecucionSgp/" + id_proy
    );
  }

  listaClasificador(id_proy) {
    return this._http.get(this.url + "10_listaClasificador/" + id_proy);
  }
  insertaSupervision(datos) {
    return this._http.get(this.url + "10_insertaSupervision", {
      params: datos,
    });
  }
  actualizaSupervision(datos) {
    return this._http.get(this.url + "10_actualizaSupervision", {
      params: datos,
    });
  }
  eliminaSupervision(datos) {
    return this._http.get(this.url + "10_eliminaSupervision", {
      params: datos,
    });
  }
  insertaAmpliacion(datos) {
    return this._http.get(this.url + "10_insertaAmpliacion", { params: datos });
  }
  actualizaAmpliacion(datos) {
    return this._http.get(this.url + "10_actualizaAmpliacion", {
      params: datos,
    });
  }
  eliminaAmpliacion(datos) {
    return this._http.get(this.url + "10_eliminaAmpliacion", { params: datos });
  }
  insertaContactos(datos) {
    return this._http.get(this.url + "10_insertaContactos", { params: datos });
  }
  actualizaContactos(datos) {
    return this._http.get(this.url + "10_actualizaContactos", {
      params: datos,
    });
  }
  eliminaContactos(datos) {
    return this._http.get(this.url + "10_eliminaContactos", { params: datos });
  }
  insertaFichaTecnica(datos) {
    return this._http.get(this.url + "10_insertaFichaTecnica", {
      params: datos,
    });
  }
  actualizaFichaTecnica(datos) {
    return this._http.get(this.url + "10_actualizaFichaTecnica", {
      params: datos,
    });
  }
  eliminaFichaTecnica(datos) {
    return this._http.get(this.url + "10_eliminaFichaTecnica", {
      params: datos,
    });
  }
  insertaCierreAdministrativo(datos) {
    return this._http.get(this.url + "10_insertaCierreAdministrativo", {
      params: datos,
    });
  }
  actualizaCierreAdministrativo(datos) {
    return this._http.get(this.url + "10_actualizaCierreAdministrativo", {
      params: datos,
    });
  }
  eliminaCierreAdministrativo(datos) {
    return this._http.get(this.url + "10_eliminaCierreAdministrativo", {
      params: datos,
    });
  }
  insertaDerechoPropietario(datos) {
    return this._http.get(this.url + "10_insertaDerechoPropietario", {
      params: datos,
    });
  }
  actualizaDerechoPropietario(datos) {
    return this._http.get(this.url + "10_actualizaDerechoPropietario", {
      params: datos,
    });
  }
  eliminaDerechoPropietario(datos) {
    return this._http.get(this.url + "10_eliminaDerechoPropietario", {
      params: datos,
    });
  }
  insertaConvenio(datos) {
    return this._http.get(this.url + "10_insertaConvenio", { params: datos });
  }
  actualizaConvenio(datos) {
    return this._http.get(this.url + "10_actualizaConvenio", { params: datos });
  }
  eliminaConvenio(datos) {
    return this._http.get(this.url + "10_eliminaConvenio", { params: datos });
  }
  insertaResolucionConvenio(datos) {
    return this._http.get(this.url + "10_insertaResolucionConvenio", {
      params: datos,
    });
  }
  actualizaResolucionConvenio(datos) {
    return this._http.get(this.url + "10_actualizaResolucionConvenio", {
      params: datos,
    });
  }
  eliminaResolucionConvenio(datos) {
    return this._http.get(this.url + "10_eliminaResolucionConvenio", {
      params: datos,
    });
  }
  insertaAdenda(datos) {
    return this._http.get(this.url + "10_insertaAdenda", { params: datos });
  }
  actualizaAdenda(datos) {
    return this._http.get(this.url + "10_actualizaAdenda", { params: datos });
  }
  eliminaAdenda(datos) {
    return this._http.get(this.url + "10_eliminaAdenda", { params: datos });
  }
  insertaRatificacionConvenio(datos) {
    return this._http.get(this.url + "10_insertaRatificacionConvenio", {
      params: datos,
    });
  }
  actualizaRatificacionConvenio(datos) {
    return this._http.get(this.url + "10_actualizaRatificacionConvenio", {
      params: datos,
    });
  }
  eliminaRatificacionConvenio(datos) {
    return this._http.get(this.url + "10_eliminaRatificacionConvenio", {
      params: datos,
    });
  }
  insertaSeguimientoEjecucion(datos) {
    return this._http.get(this.url + "10_insertaSeguimientoEjecucion", {
      params: datos,
    });
  }
  actualizaSeguimientoEjecucion(datos) {
    return this._http.get(this.url + "10_actualizaSeguimientoEjecucion", {
      params: datos,
    });
  }
  eliminaSeguimientoEjecucion(datos) {
    return this._http.get(this.url + "10_eliminaSeguimientoEjecucion", {
      params: datos,
    });
  }
  insertaSupervisionImagen(datos) {
    return this._http.get(this.url + "10_insertaSupervisionImagen", {
      params: datos,
    });
  }
  actualizaSupervisionImagen(datos) {
    return this._http.get(this.url + "10_actualizaSupervisionImagen", {
      params: datos,
    });
  }
  seleccionaSupervisionImagen(datos) {
    return this._http.get(this.url + "10_seleccionaSupervisionImagen", {
      params: datos,
    });
  }
  eliminaSupervisionImagen(datos) {
    return this._http.get(this.url + "10_eliminaSupervisionImagen", {
      params: datos,
    });
  }
  /**************************************************************************
   * DATOS GENERALES - LISTA CONVENIOS SGP
   *************************************************************************/
  listaConvenioxIdSgp(id_proyecto) {
    return this._http.get(this.url + "10_listaConvenioxIdSgp/" + id_proyecto);
  }
  /**************************************************************************
   * LISTA RESOLUCION DE CONVENIO
   *************************************************************************/
  listaResolucionConvenio(id_proyecto) {
    return this._http.get(
      this.url + "10_listaResolucionConvenio/" + id_proyecto
    );
  }
  /**************************************************************************
   * LEGAL - DERECHO PROPIETARIO
   *************************************************************************/
  listaDerechoPropietario(id_proyecto) {
    return this._http.get(
      this.url + "10_listaDerechoPropietario/" + id_proyecto
    );
  }
  /**************************************************************************
   * LEGAL - RATIFICACION DE CONVENIO
   *************************************************************************/
  listaRatificacionConvenio(id_proyecto) {
    return this._http.get(
      this.url + "10_listaRatificacionConvenio/" + id_proyecto
    );
  }
  /**************************************************************************
   * CIERRE - CIERRE ADMINSITRATIVO
   *************************************************************************/
  listaCierreAdministrativo(id_proyecto) {
    return this._http.get(
      this.url + "10_listaCierreAdministrativo/" + id_proyecto
    );
  }
  /**************************************************************************
   * PROYECTOS CONTINUIDAD
   *************************************************************************/
  listaProyectoContinuidad() {
    return this._http.get(this.url + "10_listaProyectoContinuidad");
  }
  listaDepartamentoContinuidad() {
    return this._http.get(this.url + "10_listaDepartamentoContinuidad");
  }
  listaMunicipioContinuidad() {
    return this._http.get(this.url + "10_listaMunicipioContinuidad");
  }
  listaProyectoCabeceraXIdSgp(id_sgp) {
    return this._http.get(
      this.url + "10_listaProyectoCabeceraXIdSgp/" + id_sgp
    );
  }
  desglose(tipo, finicio, ffin) {
    return this._http.get(
      this.url + "10_desglose/" + tipo + "/" + finicio + "/" + ffin
    );
  }
  /**************************************************************************
   * PROYECTOS COMPROMISOS
   *************************************************************************/
  listaCompromisos() {
    return this._http.get(this.url + "10_listaCompromisos");
  }
  listaCompromisosDetalle(id_compromiso) {
    return this._http.get(
      this.url + "10_listaCompromisosDetalle/" + id_compromiso
    );
  }
  insertaCabeceraCompromiso(dts) {
    return this._http.get(this.url + "10_insertaCabeceraCompromiso", {
      params: dts,
    });
  }
  insertaDetalleCompromiso(dts) {
    return this._http.get(this.url + "10_insertaDetalleCompromiso", {
      params: dts,
    });
  }
  listaEstadoCompromiso() {
    return this._http.get(this.url + "10_listaEstadoCompromiso");
  }
  eliminaCompromiso(id_compromiso) {
    return this._http.get(this.url + "10_eliminaCompromiso/" + id_compromiso);
  }
  editaCabeceraCompromiso(dts) {
    return this._http.get(this.url + "10_editaCabeceraCompromiso", {
      params: dts,
    });
  }
  eliminaDetalle(id) {
    return this._http.get(this.url + "10_eliminaDetalleCompromiso/" + id);
  }
  editaDetalleCompromiso(dts) {
    return this._http.get(this.url + "10_editaDetalleCompromiso", {
      params: dts,
    });
  }
  reportesSolicitud(data) {
    return this._http.get(this.url + "10_reportesSolicitud/", {
      responseType: "arraybuffer",
      params: data,
    });
  }
  reportesSolicitudGeneral(data) {
    return this._http.get(this.url + "10_reportesSolicitudGeneral/", {
      responseType: "arraybuffer",
      params: data,
    });
  }
  /**************************************************************************
   * PROYECTOS FINANCIERA
   *************************************************************************/
  financieraGrupoDesembolsos(tipo) {
    return this._http.get(this.url + "10_desembolsosGrupo/" + tipo);
  }
  financieraAnticipo(idProyecto) {
    return this._http.get(this.url + "10_anticipo/" + idProyecto);
  }
  financieraDesembolsos(idProyecto) {
    return this._http.get(this.url + "10_desembolsos/" + idProyecto);
  }
  financieraDesembolsosDetalle(idProyecto) {
    return this._http.get(this.url + "10_desembolsosDetalle/" + idProyecto);
  }
  financieraPlanillas(idProyecto) {
    return this._http.get(this.url + "10_planillas/" + idProyecto);
  }
  financieraDescuentos(idProyecto) {
    return this._http.get(this.url + "10_descuentos/" + idProyecto);
  }
  financieraCRUDDesembolsos(dts) {
    return this._http.get(this.url + "10_crudDesembolso", { params: dts });
  }
  financieraCRUDPlanilla(dts) {
    return this._http.get(this.url + "10_crudPlanilla", { params: dts });
  }
  financieraCRUDDescuentos(dts) {
    return this._http.get(this.url + "10_crudDescuentos", { params: dts });
  }
  financieraCRUDAnticipo(dts) {
    return this._http.get(this.url + "10_crudAnticipo", { params: dts });
  }
  montoTotalProyecto(idProyecto) {
    return this._http.get(this.url + "10_montoTotalProyecto/" + idProyecto);
  }
  financieraDescripcion(idProyecto) {
    //return this._http.get(this.url + '10_financieraDescripcion/'+idProyecto);
    return this._http.get(this.url + "10_montoTotalProyecto/" + idProyecto);
  }
  listaReportesGenerales() {
    return this._http.get(this.url + "10_listaReportesGenerales");
  }
  generarReportesGenerales(dts) {
    return this._http.get(this.url + "10_generaReportesGenerales/", {
      responseType: "arraybuffer",
      params: dts,
    });
  }

  reportePrueba(dts) {
    return this._http.get(this.url + "10_reportePrueba/", {
      responseType: "arraybuffer",
      params: dts,
    });
  }
  reportes(dts) {
    return this._http.get(this.url + "10_reportes/", {
      responseType: "arraybuffer",
      params: dts,
    });
  }
  reportesJuridica(dts) {
    return this._http.get(this.url + "10_reportesJuridica/", {
      responseType: "arraybuffer",
      params: dts,
    });
  }
  reportesTecnica(dts) {
    return this._http.get(this.url + "10_reportesTecnica/", {
      responseType: "arraybuffer",
      params: dts,
    });
  }
  reportesFinanciera(dts) {
    return this._http.get(this.url + "10_reportesFinanciera/", {
      responseType: "arraybuffer",
      params: dts,
    });
  }
  reportesFinancieraRef(dts) {
    return this._http.get(this.url + "10_reportesFinancieraRef/", {
      responseType: "arraybuffer",
      params: dts,
    });
  }

  financieraCRUDProyectoUsuario(dts) {
    return this._http.get(this.url + "10_crudProyectoUsuario", { params: dts });
  }
  financieraProyectoUsuario(idProyecto) {
    return this._http.get(
      this.url + "10_financieraProyectoUsuario/" + idProyecto
    );
  }
  usuariosHabilitados() {
    return this._http.get(this.url + "10_usuariosHabilitados");
  }
  educacionPrograma() {
    return this._http.get(this.url + "10_educacionPrograma");
  }
  /**************************************************************************
   * ADENDAS
   *************************************************************************/
  listaAdendas(id_proy) {
    return this._http.get(this.url + "10_listaAdendas/" + id_proy);
  }
  listaDatosIniciales(id_proy) {
    return this._http.get(
      this.url + "10_listaDatosInicialesConvenioAdenda/" + id_proy
    );
  }
  /*************AMBIENTAL Y AUDITORIA *******************************/
  crudAmbiental(dts) {
    return this._http.get(this.url + "10_crudAmbiental", { params: dts });
  }
  ambiental(idProyecto) {
    return this._http.get(this.url + "10_ambiental/" + idProyecto);
  }
  listarClasificadorTotal() {
    return this._http.get(this.url + "10_clasificadorTotal/");
  }
  crudAuditoria(dts) {
    return this._http.get(this.url + "14_crudAuditoria", { params: dts });
  }
  auditoria(idProyecto) {
    return this._http.get(this.url + "14_auditoria/" + idProyecto);
  }
  /*************************************************************
   * OBSERVACION Y CAMBIO DE ESTADO AL PROYECTO -PROYECTO CONCLUIDO CON OBSERVACION
   **************************************************************/
  regitraProyectoObservado(dts) {
    return this._http.get(this.url + "10_registraProyectoObservado", {
      params: dts,
    });
  }
  obtieneProyectoObservado(idProyecto) {
    return this._http.get(
      this.url + "10_obtieneProyectoObservado/" + idProyecto
    );
  }

  /********************************************
   * Reporte FichaTecnica ExcelJS
   *******************************************/
  reportesExcelJS(dts) {
    return this._http.get(this.url + "10_editarExcel", {
      responseType: "arraybuffer",
      params: dts,
    });
  }
  /*********************************************
   Proyectos continuidad 2025 movil
   *******************************************/
  listaProyectos2025(dts) {
    return this._http.get(this.url + "15_listaProyectos", { params: dts });
  }

  crudProyectoAprobado(dts) {
    return this._http.get(this.url + "15_crudProyectoAprobado", {
      params: dts,
    });
  }

  reportesCompromisos2025(dts) {
    return this._http.post(this.url + "15_reportesCompromisos2025/", dts, {
      responseType: "arraybuffer",
    });
  }

  reportesCompromisosQuery(data) {
    return this._http.get(this.url + "15_reportesCompromisosQuery/", {
      responseType: "arraybuffer",
      params: data,
    });
  }

  datosFinanciamiento(gestion: string) {
    return this._http.get(this.url + "15_financiamientoCompromisos/" + gestion);
  }

  resumenTecnico(idCompromiso: number) {
    return this._http.get(this.url + "15_resumenTecnico/" + idCompromiso);
  }

  monitoreoEtapas = (idCompromiso: number) =>
    this._http.get(this.url + "15_monitoreoEtapas/" + idCompromiso);
  compromisosPeriodo = (dts: any) =>
    this._http.get(this.url + "15_compromisosPeriodo/", { params: dts });
  etapasTipo = (dts: any) =>
    this._http.get(this.url + "15_etapasTipo/", { params: dts });
  feriados = () => this._http.get(this.url + "10_listaFeriados");
  compromisosPresidencia = (dts: any) =>
    this._http.get(this.url + "15_compromisosPresidencia/", { params: dts });
  /**************************************************
   * CONTRATOS
   **************************************************/
  listaContratos(id_proy) {
    return this._http.get(this.url + "10_listaContratos/" + id_proy);
  }
  datosEmpresa(nit) {
    return this._http.get(this.url + "10_datosEmpresa/" + nit);
  }
  mantenimientoContrato(datos) {
    return this._http.get(this.url + "10_mantenimientoContrato", {
      params: datos,
    });
  }
  /*****************************************************************
   * INTEGRACION SOLICITUD SEGUIMIENTO
   *****************************************************************/
  listaCompromisosPresidenciales() {
    return this._http.get(this.url + "10_listaCompromisosPresidenciales/");
  }
  listaEstructuraFinanciamiento(id_proyecto_siga) {
    return this._http.get(
      this.url + "10_listaEstructuraFinanciamiento/" + id_proyecto_siga
    );
  }
  listaTipoEstructuraFinanciamiento() {
    return this._http.get(this.url + "10_listaTipoEstructuraFinanciamiento/");
  }
  crudEstructuraFinanciamiento(dts) {
    return this._http.get(this.url + "10_crudEstructuraFinanciamiento", {
      params: dts,
    });
  }
  listaCompromisosPresidencialesVinculacion() {
    return this._http.get(
      this.url + "10_listaCompromisosPresidencialesVinculacion/"
    );
  }
  vinculaHrCompromiso(dts) {
    return this._http.get(this.url + "10_vindulaHrCompromiso", {
      params: dts,
    });
  }
  /*****************************************************************
   * CODIGO ETA CABECERA PROYECTOS
   *****************************************************************/
  editaCodigoEta(dts) {
    return this._http.get(this.url + "10_editaCodigoEta", {
      params: dts,
    });
  }
  listarCodigosETAS = (dts: any) =>
    this._http.get(this.url + "10_listaCodigoETAS", { params: dts });
  /*****************************************************************
   * LISTA EMPRESAS Y PROYECTOS
   *****************************************************************/
  listaEmpresasProyectos() {
    return this._http.get(this.url + "10_listaEmpresasProyectos");
  }
  periodoPresidencial() {
    return this._http.get(this.url + "15_periodoPresidencial");
  }
}
