import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { Globals } from "../../global";

var varsession = "";
@Injectable()
export class FinancieraService {
  public url: string;
  userName: string;
  loggeIn: boolean;

  constructor(
    private _http: HttpClient,
    private globals: Globals,
    private _fun: FuncionesComponent
  ) {
    this.url = globals.rutaSrvBackEnd;
  }

  getListaResp_SeguimientoFisicoFinanciero(id_seg: string) {
    return this._http.get(
      this.url + "lista_responsablefisicofinanciero/" + id_seg
    );
  }
  getEliminaResponsalbe(id_resp: string, id_seg: string) {
    return this._http.get(
      this.url + "elimina_responsablefisicofinanciero/" + id_resp + "/" + id_seg
    );
  }
  getInsertaResponsalbe(
    nomb_responsable: string,
    cargo_responsable: string,
    id_seg: string
  ) {
    return this._http.get(
      this.url +
        "inserta_responsablefisicofinanciero/" +
        nomb_responsable +
        "/" +
        cargo_responsable +
        "/" +
        id_seg
    );
  }
  getInsertaSeguimiento(
    nombre_proyecto: string,
    codigo_sisin: string,
    departamento: string,
    provincia: string,
    municipio: string,
    usuario: string
  ) {
    return this._http.get(
      this.url +
        "inserta_seguimiento/" +
        this._fun.textoUpper(nombre_proyecto) +
        "/" +
        this._fun.textoUpper(codigo_sisin) +
        "/" +
        departamento +
        "/" +
        provincia +
        "/" +
        municipio +
        "/" +
        usuario
    );
  }
  getConsultaSeguimiento() {
    return this._http.get(this.url + "consulta_seguimiento/");
  }
  getActualizaSeguimiento(
    id_seg: any,
    nombre_proyecto: any,
    codigo_sisin: string,
    departamento: string,
    provincia: string,
    municipio: string,
    usuario_registro: any,
    idrol: any
  ) {
    //console.log('variables',id_seg,nombre_proyecto,codigo_sisin,usuario_registro,idrol)
    return this._http.get(
      this.url +
        "actualizar_seguimiento/" +
        id_seg +
        "/" +
        this._fun.textoUpper(nombre_proyecto) +
        "/" +
        this._fun.textoUpper(codigo_sisin) +
        "/" +
        departamento +
        "/" +
        provincia +
        "/" +
        municipio +
        "/" +
        usuario_registro +
        "/" +
        idrol
    );
  }
  getActualizaSeguimientoDetalle(
    id_seg_detalle: any,
    id_seg: any,
    estado_situacion: any,
    acciones_tomar: any,
    plazo_solucion: any,
    nomb_responsable: any,
    cargo_responsable: any,
    porcentaje_avance: any,
    importe_mes: any,
    c31: string,
    detallec31: any,
    usuario_registro: any,
    idrol: any
  ) {
    return this._http.get(
      this.url +
        "actualizar_seguimiento_detalle/" +
        id_seg_detalle +
        "/" +
        id_seg +
        "/" +
        this._fun.textoUpper(estado_situacion) +
        "/" +
        this._fun.textoUpper(acciones_tomar) +
        "/" +
        plazo_solucion +
        "/" +
        this._fun.textoUpper(nomb_responsable) +
        "/" +
        this._fun.textoUpper(cargo_responsable) +
        "/" +
        porcentaje_avance +
        "/" +
        importe_mes +
        "/" +
        c31 +
        "/" +
        this._fun.textoUpper(detallec31) +
        "/" +
        usuario_registro +
        "/" +
        idrol
    );
  }
  getInsertaSeguimientoDetalle(
    id_seg: any,
    estado_situacion: any,
    acciones_tomar: any,
    plazo_solucion: any,
    nomb_responsable: any,
    cargo_responsable: any,
    porcentaje_avance: any,
    importe_mes: any,
    c31: string,
    detallec31: any,
    usuario_registro: any,
    idrol: any
  ) {
    //console.log('datos',id_seg,estado_situacion,acciones_tomar,plazo_solucion,nomb_responsable,cargo_responsable,porcentaje_avance,importe_mes,c31,detallec31,usuario_registro,idrol);
    return this._http.get(
      this.url +
        "inserta_seguimiento_detalle/" +
        id_seg +
        "/" +
        this._fun.textoUpper(estado_situacion) +
        "/" +
        this._fun.textoUpper(acciones_tomar) +
        "/" +
        plazo_solucion +
        "/" +
        this._fun.textoUpper(nomb_responsable) +
        "/" +
        this._fun.textoUpper(cargo_responsable) +
        "/" +
        porcentaje_avance +
        "/" +
        importe_mes +
        "/" +
        c31 +
        "/" +
        this._fun.textoUpper(detallec31) +
        "/" +
        usuario_registro +
        "/" +
        idrol
    );
  }
  getListaSeguimientoDetalle(id_seg: any) {
    return this._http.get(this.url + "lista_seguimiento_detalle/" + id_seg);
  }

  getConsultaSeguimientoParametro(id_seg: any) {
    return this._http.get(this.url + "consulta_seguimientoparametro/" + id_seg);
  }
  getEliminaSeguimiento(id_seg: any, usuario: any) {
    return this._http.get(
      this.url + "elimina_seguimiento/" + id_seg + "/" + usuario
    );
  }
  getEliminaSeguimientoDetalle(id_seg, id_seg_detalle: any) {
    return this._http.get(
      this.url + "elimina_seguimiento_detalle/" + id_seg + "/" + id_seg_detalle
    );
  }
  //ASIGNACION DE PRESUPUESTO
  get_bandejafichatecnica() {
    return this._http.get(this.url + "dbprod_bandejafichatecnica/");
  }
  get_listapresupuestoasignado(id_proy: any) {
    return this._http.get(
      this.url + "dbprod_listapresupuestoasignado/" + id_proy
    );
  }
  get_insertapresupuestoasignado(
    id_proy: any,
    gestion: any,
    presupuesto: any,
    usuario: any
  ) {
    return this._http.get(
      this.url +
        "dbprod_insertapresupuestoasignado/" +
        id_proy +
        "/" +
        gestion +
        "/" +
        presupuesto +
        "/" +
        usuario
    );
  }
  get_editapresupuestoasignado(
    id_presupuesto: any,
    id_proy: any,
    gestion: any,
    presupuesto: any,
    usuario: any
  ) {
    return this._http.get(
      this.url +
        "dbprod_editapresupuestoasignado/" +
        id_presupuesto +
        "/" +
        id_proy +
        "/" +
        gestion +
        "/" +
        presupuesto +
        "/" +
        usuario
    );
  }
  get_eliminapresupuestoasignado(
    id_presupuesto: any,
    id_proy: any,
    usuario: any
  ) {
    return this._http.get(
      this.url +
        "dbprod_eliminapresupuestoasignado/" +
        id_presupuesto +
        "/" +
        id_proy +
        "/" +
        usuario
    );
  }
  get_listadepartamentos() {
    return this._http.get(this.url + "dbprod_departamento/");
  }
  get_listamunicipios() {
    return this._http.get(this.url + "dbprod_municipio/");
  }
  /******************************************************************************************
    PROYECTOS VENEZUELA
    *******************************************************************************************/
  consultaDonacion() {
    return this._http.get(this.url + "4_lista_proyectosdonacionvenezuela/");
  }
  consultaModalidadFinanciamiento() {
    return this._http.get(this.url + "4_lista_modalidadfinanciamiento/");
  }
  insertaDonacion(
    m_gestion_proy: any,
    m_nombreproyecto: any,
    m_departamento: any,
    m_provincia: any,
    m_municipio: any,
    m_empresa: any,
    m_representante: any,
    m_cirepresentante: any,
    m_modalidadfinanciamiento: any,
    m_firmacontrato: any,
    m_montofinanciarsus: any,
    m_tipocambio: any,
    m_montofinanciarbs: any,
    s_user: any
  ) {
    return this._http.get(
      this.url +
        "4_inserta_donacion/" +
        m_gestion_proy +
        "/" +
        m_nombreproyecto +
        "/" +
        m_departamento +
        "/" +
        m_provincia +
        "/" +
        m_municipio +
        "/" +
        m_empresa +
        "/" +
        m_representante +
        "/" +
        m_cirepresentante +
        "/" +
        m_modalidadfinanciamiento +
        "/" +
        m_firmacontrato +
        "/" +
        m_montofinanciarsus +
        "/" +
        m_tipocambio +
        "/" +
        m_montofinanciarbs +
        "/" +
        s_user
    );
  }
  actualizaDonacion(
    m_id_donacion: any,
    m_gestion_proy: any,
    m_nombreproyecto: any,
    m_departamento: any,
    m_provincia: any,
    m_municipio: any,
    m_empresa: any,
    m_representante: any,
    m_cirepresentante: any,
    m_modalidadfinanciamiento: any,
    m_firmacontrato: any,
    m_montofinanciarsus: any,
    m_tipocambio: any,
    m_montofinanciarbs: any,
    s_user: any
  ) {
    return this._http.get(
      this.url +
        "4_actualiza_donacion/" +
        m_id_donacion +
        "/" +
        m_gestion_proy +
        "/" +
        m_nombreproyecto +
        "/" +
        m_departamento +
        "/" +
        m_provincia +
        "/" +
        m_municipio +
        "/" +
        m_empresa +
        "/" +
        m_representante +
        "/" +
        m_cirepresentante +
        "/" +
        m_modalidadfinanciamiento +
        "/" +
        m_firmacontrato +
        "/" +
        m_montofinanciarsus +
        "/" +
        m_tipocambio +
        "/" +
        m_montofinanciarbs +
        "/" +
        s_user
    );
  }
  elimina_donacion(m_id_donacion: any, s_user: any) {
    return this._http.get(
      this.url + "4_elimina_donacion/" + m_id_donacion + "/" + s_user
    );
  }
  lista_donacion_detalle(m_id_donacion: any) {
    return this._http.get(
      this.url + "4_lista_donacion_detalle/" + m_id_donacion
    );
  }
  inserta_donacion_detalle(
    m_id_donacion: any,
    m_tipopago: any,
    m_nropago: any,
    m_montodesembolso: any,
    m_respaldo: any,
    m_modalidadpago: any,
    m_nrocuenta: any,
    s_user: any,
    m_obs: any
  ) {
    return this._http.get(
      this.url +
        "4_inserta_donacion_detalle/" +
        m_id_donacion +
        "/" +
        m_tipopago +
        "/" +
        m_nropago +
        "/" +
        m_montodesembolso +
        "/" +
        m_respaldo +
        "/" +
        m_modalidadpago +
        "/" +
        m_nrocuenta +
        "/" +
        s_user +
        "/" +
        m_obs
    );
  }
  actualiza_donacion_detalle(
    m_id_desembolso: any,
    m_id_donacion: any,
    m_tipopago: any,
    m_nropago: any,
    m_montodesembolso: any,
    m_respaldo: any,
    m_modalidadpago: any,
    m_nrocuenta: any,
    s_user: any,
    m_obs: any
  ) {
    return this._http.get(
      this.url +
        "4_actualiza_donacion_detalle/" +
        m_id_desembolso +
        "/" +
        m_id_donacion +
        "/" +
        m_tipopago +
        "/" +
        m_nropago +
        "/" +
        m_montodesembolso +
        "/" +
        m_respaldo +
        "/" +
        m_modalidadpago +
        "/" +
        m_nrocuenta +
        "/" +
        s_user +
        "/" +
        m_obs
    );
  }
  elimina_desembolso_detalle(m_id_desembolso: any) {
    return this._http.get(
      this.url + "4_elimina_donacion_detalle/" + m_id_desembolso
    );
  }

  /********BUZON**********************/
  listarBuzon = (dts:any) => this._http.get(this.url + '4_listarBuzon',{params: dts,});
  listarCargos = (dts:any) => this._http.get(this.url + '4_listarCargos',{params: dts,});
  crudBuzon = (dts:any) => this._http.get(this.url + '4_crudBuzon',{params: dts,});
  reportes = (dts:any) => this._http.get(this.url + '4_reportesFinanciera/',{responseType:'arraybuffer',params: dts});
}
