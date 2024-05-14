import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as moment from "moment";
import { Globals } from "../../global";

var varsession = "";
@Injectable({ providedIn: "root" })
export class SiptaService {
  public url: string;
  public urlFonadal: string;
  userName: string;
  loggeIn: boolean;

  constructor(private _http: HttpClient, private globals: Globals) {
    //this.url='http://localhost:8383/';
    this.url = globals.rutaSrvBackEnd;
    // this.url = 'http://localhost:8283/';//globals.rutaSrvBackEndFonadal;// bonk

    //this.url='http://192.168.1.153:8383/';
    this.userName = "";
    this.loggeIn = false;
  }

  getMuetraHojadeRuta(gestion: string, nrohojaderuta: string) {
    const data = {
      gestion: gestion,
      numeroHR: nrohojaderuta,
      referencia: "",
      remitente: "",
      tipoDocumento: "",
      cite: "",
    };
    return this._http.get(this.url + "3_muestraHojaderuta/", { params: data });
  }
  BuscaReferencia(
    gestion: string,
    referencia: string,
    remitente: string,
    m_busTipoDoc: string,
    m_buscaCite: string
  ) {
    const data2 = {
      gestion: gestion,
      numeroHR: "0",
      referencia: referencia,
      remitente: remitente,
      tipoDocumento: m_busTipoDoc,
      cite: m_buscaCite,
    };
    return this._http.get(this.url + "3_muestraHojaderuta/", { params: data2 });
  }
  getListaProveido(idCorrespondencia: string) {
    return this._http.get(this.url + "3_listaProveido/" + idCorrespondencia);
  }
  getActualizarCabecera(
    idcorrespondencia: string,
    remitente: string,
    destinatario: string,
    referencia: string,
    anexos: string,
    fecha: string,
    desrespuesta: string,
    fecharespuesta: string,
    estado: string,
    cite: string,
    hora: string,
    tipo: string,
    estadorespuesta: string,
    estadosituacion: string,
    existeproveido: string,
    remitenteexterno: string
  ) {
    const data = {
      operacion: "U",
      idCorrespondencia: idcorrespondencia,
      fidPadreCorrespondencia: null,
      numero: null,
      tipo: tipo,
      ruta: cite,
      referencia: referencia,
      estado: estado,
      fecha: fecha + " " + (hora.length == 5 ? hora + ":00" : hora), //fecha.replace(/-/gi, ``) + " " + hora,
      fechaRespuesta: fecharespuesta,
      fidUsuarioDe: remitente || null,
      fidUsuarioPara: destinatario || null,
      fidUsuarioExternopara: null,
      fidUsuarioExternode: remitenteexterno,
      estadoRespuesta: estadorespuesta,
      estadoSituacion: estadosituacion,
      estadoBandejaPersonal: null,
      observacion: null,
      descripcion: desrespuesta,
      anexosResumen: anexos,
      existeProveido: existeproveido,
      tipoDocumento: null,
      dias: null,
      fechaRecibido: null,
      item: null,
    };
    // return this._http.get(this.url + 'actualiza_cabecera/A/'+idcorrespondencia+'/'+remitente+'/'+destinatario+'/'+referencia+'/'+anexos+'/'+fecha+'/'+desrespuesta+'/'+fecharespuesta+'/'+estado+'/'+cite+'/'+hora+'/'+tipo+'/'+estadorespuesta+'/'+estadosituacion+'/'+existeproveido) ;
    return this._http.get(this.url + "3_crudCorrespondencia", { params: data });
  }
  getListaUsuarios(usuario: string) {
    // return this._http.get(this.url + 'lista_usuario/'+usuario) ;
    return this._http.get(this.url + `3_listadosVarios/usuarios/${usuario}/0`);
    //PENDIENTE hasat definir nueva tablas Usuario en seguimiento_produccion
  }
  getEliminaProveido(preProveido: any) {
    // return this._http.get(this.url + 'elimina_proveido/D/'+idproveido+'/'+idpadre+'/'+idcorrespondencia) ;
    console.log("eliminar proveido", preProveido);

    const proveido = {
      operacion: "D",
      idProveido: preProveido.id_proveido,
      fidPadre: preProveido.fid_padre,
      fidCorrespondencia: preProveido.fid_correspondencia,
      fidUsuarioDe: preProveido.fid_usuario_de || null,
      fidUsuarioPara: preProveido.fid_usuario_para || null,
      contenido: preProveido.contenido,
      fecha: preProveido.fecha, //.replace(/-/gi,``)+ ' '+ preProveido.hora,
      fechaRespuesta: preProveido.fecha_respuesta, //.replace(/-/gi,``)+ ' '+ preProveido.hora_respuesta,
      fechaRecibido: preProveido.fecha_recibido, //.replace(/-/gi,``)+ ' '+ preProveido.hora_recibido,
      estadoRespuesta: preProveido.estado_respuesta,
      estadoSituacion: preProveido.estado_situacion,
      estadoRecibido: preProveido.estado_recibido,
      indiceProveido: preProveido.indice_proveido,
      item: null,
      tiempo: null,
    };
    return this._http.get(this.url + "3_crudProveido", { params: proveido });
  }
  getActualizaProveido(
    idproveido: string,
    idpadre: string,
    idcorrespondencia: string,
    m_prov_idemisor: string,
    m_prov_idreceptor: string,
    m_prov_contenido: string,
    m_prov_fecha: string,
    m_prov_hora: string,
    m_prov_estadosituacion: string,
    m_prov_fecharecibido: string,
    m_prov_horarecibido: string,
    m_prov_estadorecibido: string,
    m_prov_fecharespuesta: string,
    m_prov_horarespuesta: string,
    m_prov_estadorespuesta
  ) {
    console.log("mandando fecha y hora", m_prov_fecha, m_prov_hora);
    const proveido = {
      operacion: "U",
      idProveido: idproveido,
      fidPadre: idpadre,
      fidCorrespondencia: idcorrespondencia,
      fidUsuarioDe: m_prov_idemisor || null,
      fidUsuarioPara: m_prov_idreceptor || null,
      contenido: m_prov_contenido,
      fecha: m_prov_fecha.replace(/-/gi, ``) + " " + m_prov_hora,
      fechaRespuesta:
        m_prov_fecharespuesta.replace(/-/gi, ``) + " " + m_prov_horarespuesta,
      fechaRecibido:
        m_prov_fecharecibido.replace(/-/gi, ``) + " " + m_prov_horarecibido,
      estadoRespuesta: m_prov_estadorespuesta,
      estadoSituacion: m_prov_estadosituacion,
      estadoRecibido: m_prov_estadorecibido,
      indiceProveido: null,
      item: null,
      tiempo: null,
    };
    console.log("mandando el proveido", proveido);

    // return this._http.get(this.url + 'actualiza_proveido/A/'+idproveido+'/'+idpadre+'/'+idcorrespondencia+'/'+m_prov_idemisor+'/'+m_prov_idreceptor+'/'+m_prov_contenido+'/'+m_prov_fecha+'/'+m_prov_hora+'/'+m_prov_estadosituacion+'/'+m_prov_fecharecibido+'/'+m_prov_horarecibido+'/'+m_prov_estadorecibido+'/'+m_prov_fecharespuesta+'/'+m_prov_horarespuesta+'/'+m_prov_estadorespuesta+'/') ;
    return this._http.get(this.url + "3_crudProveido/", { params: proveido });
  }
  ////////////////////////////////institucion///////////////////////////////////
  getListaInstitucion() {
    // return this._http.get(this.url + 'mantenimiento_institucion/C') ;
    return this._http.get(this.url + `3_listadosVarios/instituciones/0/0`);
  }
  getInsertarInstitucion(nombre: string) {
    return this._http.get(this.url + "mantenimiento_institucion/I/" + nombre);
  }
  getEditarInstitucion(id: string, nombre: string, estado: string) {
    return this._http.get(
      this.url +
        "mantenimiento_institucion/U/" +
        nombre +
        "/" +
        estado +
        "/" +
        id
    );
  }
  getEnvioEstado(id: string, estado: string) {
    return this._http.get(
      this.url + "mantenimiento_institucion/UE/0/" + estado + "/" + id
    );
  }
  ////////////////////////////////cargo/////////////////////////////////////
  getListacargo() {
    return this._http.get(this.url + "mantenimiento_cargo/C");
  }
  getListacargo_filtro(institucion: string) {
    //console.log(id_institucion);
    // return this._http.get(this.url + 'mantenimiento_cargo/P/0/'+id_institucion) ;
    return this._http.get(
      this.url + `3_listadosVarios/cargos/${institucion}/0`
    );
  }
  getInsertarcargo(id_institucion: string, m_nombrecargo: string) {
    return this._http.get(
      this.url +
        "mantenimiento_cargo/I/0/" +
        id_institucion +
        "/" +
        m_nombrecargo
    );
  }
  getEditarcargo(
    m_idcargo: string,
    id_institucion: string,
    m_nombrecargo: string
  ) {
    return this._http.get(
      this.url +
        "mantenimiento_cargo/U/" +
        m_idcargo +
        "/" +
        id_institucion +
        "/" +
        m_nombrecargo +
        "/0"
    );
  }
  getEnvioestadocargo(
    m_idcargo: string,
    id_institucion: string,
    m_estadocargo: string
  ) {
    return this._http.get(
      this.url +
        "mantenimiento_cargo/UE/" +
        m_idcargo +
        "/" +
        id_institucion +
        "/null/" +
        m_estadocargo
    );
  }
  /////////////////////////////////////////////////////////////////////////////
  ///////////////////////////TABLA DE CONFIGURACION//////////////////////////
  getListaConfiguracion() {
    // return this._http.get(this.url + 'mantenimientoconfiguracion/C') ;
    return this._http.get(this.url + `3_listadosVarios/maeActual/0/0`);
  }
  /////////////////////////////////tabla_correspondencia_insertar////////////////
  getInsertarCorrespondencia(
    m_tipo: string,
    m_cite: string,
    m_referencia: string,
    m_idusuariode: string,
    m_idusuariopara: string,
    m_observacion: string,
    m_idusuarioexternode: string,
    m_tipodocumentohc: string,
    m_limitardias: string,
    m_item: string
  ) {
    const data = {
      operacion: "I",
      idCorrespondencia: "0",
      fidPadreCorrespondencia: null,
      numero: null,
      tipo: m_tipo,
      ruta: m_cite,
      referencia: m_referencia,
      estado: "EnProceso",
      fecha: moment().format("YYYY-MM-DD HH:mm:ss"), //.toString(), //con formato moment,
      fechaRespuesta: null,
      fidUsuarioDe: m_idusuariode,
      fidUsuarioPara: m_idusuariopara,
      fidUsuarioExternopara: "0",
      fidUsuarioExternode: m_idusuarioexternode,
      estadoRespuesta: "NoAplica",
      estadoSituacion: "Recibido",
      estadoBandejaPersonal: "NoAplica",
      observacion: m_observacion,
      descripcion: null,
      anexosResumen: null,
      existeProveido: "No",
      tipoDocumento: m_tipodocumentohc,
      dias: m_limitardias,
      fechaRecibido: null,
      item: m_item,
    };
    //   return this._http.get(this.url + 'mantenimiento_correspondencia/I/null/0/0/null/null/'+m_tipo+'/'+m_cite+'/'+m_referencia+'/Directa/EnProceso/null/null/null/null/'+m_idusuariode+'/'+m_idusuariopara+'/0/0/'+m_idusuarioexternode+'/NoAplica/Recibido/NoAplica/NoAplica/NoAplica/'+m_observacion+'/null/anexosResumen/No/'+m_tipodocumentohc+'/'+m_limitardias+'/'+m_item) ;
    return this._http.get(this.url + "3_crudCorrespondencia", { params: data });
  }
  ////////////////////////////////tabla_correspondencia_listar/////////////////////////////////////
  getListaCorrespondencia(idUsuario: string) {
    //  return this._http.get(this.url + 'mantenimiento_listacorrespondencia/BANDEJA/'+usuario_sipta) ;
    return this._http.get(this.url + "3_listaCorrespondencia/" + idUsuario);
  }
  getListaCorrespondenciaEnviada(usuario_sipta: string, gestion: string) {
    const consulta = {
      idUsuario: usuario_sipta,
      grupo: "CORRESPONDENCIA_ENVIADA",
      gestion: gestion,
    };
    //  return this._http.get(this.url + 'mantenimiento_listacorrespondenciaenviada/CORRESPONDENCIA_ENVIADA/'+usuario_sipta+'/'+gestion) ;
    return this._http.get(this.url + "3_listaCorrespondenciaEnviada", {
      params: consulta,
    });
  }
  getListaProveidosEnviados(usuario_sipta: string, gestion: string) {
    const consulta = {
      idUsuario: usuario_sipta,
      grupo: "PROVEIDOS_ENVIADOS",
      gestion: gestion,
    };
    return this._http.get(this.url + "3_listaCorrespondenciaEnviada", {
      params: consulta,
    });
  }
  getListaCorrespondenciaTerminada(usuario_sipta: string, gestion: string) {
    const consulta = {
      idUsuario: usuario_sipta,
      grupo: "TERMINADOS",
      gestion: gestion,
    };
    return this._http.get(this.url + "3_listaCorrespondenciaEnviada", {
      params: consulta,
    });
  }
  /*************************************************
    TERMINAR HOJA DE RUTA
    *************************************************/
  terminarCorrespondencia(m_idcorrespondencia: string, m_descripcion: string) {
    const data = {
      operacion: "terminarHojaRuta",
      id1: m_idcorrespondencia,
      id2: "0",
      detalle1: m_descripcion,
      detalle2: "",
    };
    // return this._http.get(this.url + 'terminarCorrespondencia/'+m_idcorrespondencia+'/'+m_descripcion) ;
    return this._http.get(this.url + "3_procesarActividades", { params: data });
  }
  ////////////////////////////////tabla_correspondencia_Editar/////////////////////////////////////
  getEditarCorrespondencia(
    m_idcorrespondencia: string,
    m_estadorespuesta: string,
    m_estadosituacion: string
  ) {
    const data = {
      operacion: "editarCorrespondencia",
      id1: m_idcorrespondencia,
      id2: "0",
      detalle1: m_estadorespuesta,
      detalle2: m_estadosituacion,
    };
    //  return this._http.get(this.url + 'mantenimiento_correspondencia/U/'+m_idcorrespondencia+'0/0/0/0/null/null/null/null/null/0/0/0/0/0/0/0/0/0/'+m_estadorespuesta+'/'+m_estadosituacion+'/null/null/null/null/null/null/null') ;
    return this._http.get(this.url + "3_procesarActividades", { params: data });
  }
  ////////////////////////////////////////INSERTA EN LA TABLA DE REMITENTE O USUARIO EXTERNO/////////////////////////////////
  getInsertaRemitente(
    m_institucion: string,
    m_nombre_cargo: string,
    m_nombre: string,
    m_idusuariode: string
  ) {
    const data = {
      operacion: "I",
      idUsuarioExterno: "0",
      institucion: m_institucion,
      cargo: m_nombre_cargo,
      nombre: m_nombre,
      usuario_registro: m_idusuariode,
    };
    //  return this._http.get(this.url + 'mantenimiento_usuarioexterno/I/null/'+m_institucion+'/'+m_nombre_cargo+'/'+m_nombre+'/'+m_idusuariode) ;
    return this._http.get(this.url + "3_crudUsuarioExterno", { params: data });
    //esta no se esta usando
  }
  ////////////////////////////////Documentos/////////////////////////////////////
  getListaDocumentos() {
    // return this._http.get(this.url + 'mantenimiento_documento/C') ;
    return this._http.get(this.url + "10_listaClasificador/36");
  }
  ////////////////////////////////listar_anexo/////////////////////////////////////
  getListaAnexo(m_idcorrespondencia: string) {
    //   return this._http.get(this.url + 'listaAnexo/F/null/'+m_idcorrespondencia) ;
    return this._http.get(this.url + "3_listaAnexo/F/" + m_idcorrespondencia);
  }
  ////////////////////////////////listar_anexo_documento/////////////////////////////////////
  getListaAnexoDescripcion(m_idcorrespondencia: string) {
    // return this._http.get(this.url + 'mantenimiento_descripcionAnexos/P/0/'+m_idcorrespondencia) ;
    return this._http.get(this.url + "3_listaAnexo/P/" + m_idcorrespondencia);
  }
  //////////////////////////////////Insertar Anexo///////////////////////////////////////
  getInsertaAnexo(
    m_idcorrespondencia: string,
    m_documento: string,
    m_descripcion: string,
    s_usu_id: string
  ) {
    const data = {
      operacion: "I",
      idAnexo: "0",
      fidCorrespondencia: m_idcorrespondencia,
      documento: m_documento,
      descripcion: m_descripcion,
      usuario_registro: s_usu_id,
    };
    return this._http.get(this.url + "3_crudAnexo", { params: data });
    // return this._http.get(this.url + 'mantenimiento_Anexo/I/null/'+m_idcorrespondencia+'/'+m_documento+'/'+m_descripcion+'/'+s_usu_id) ;
  }
  ////////////////////////////////////////editar anexo/////////////////////////////////////////////////

  getEditarAnexo(
    m_idanexo: string,
    m_idcorrespondencia: string,
    m_documento: string,
    m_descripcion: string,
    s_usu_id: string
  ) {
    const data = {
      operacion: "U",
      idAnexo: m_idanexo,
      fidCorrespondencia: m_idcorrespondencia,
      documento: m_documento,
      descripcion: m_descripcion,
      usuario_registro: s_usu_id,
    };
    return this._http.get(this.url + "3_crudAnexo", { params: data });
    // return this._http.get(this.url + 'editaAnexo/U/'+m_idanexo+'/'+m_idcorrespondencia+'/'+m_documento+'/'+m_descripcion+'/'+s_usu_id) ;
  }
  //////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////eliminar anexo/////////////////////////////////////////////////

  getEliminarAnexo(
    m_idanexo: string,
    m_idcorrespondencia: string,
    s_usu_id: string
  ) {
    const data = {
      operacion: "D",
      idAnexo: m_idanexo,
      fidCorrespondencia: m_idcorrespondencia,
      documento: "",
      descripcion: "",
      usuario_registro: s_usu_id,
    };
    return this._http.get(this.url + "3_crudAnexo", { params: data });
    //   return this._http.get(this.url + 'mantenimiento_Anexo/D/'+m_idanexo+'/'+m_idcorrespondencia) ;
  }
  //////////////////////////////////////inicio_formulario_correspondencia_interna///////
  ///////////////////////////////////////////////lista usuarios//////////////////////////////////////
  getListaUsuario() {
    //   return this._http.get(this.url + 'mantenimiento_usuario/P') ;
    return this._http.get(this.url + "3_listaUsuario/P");
    //PENDIENTE si se tranaja en seguridad o en seguimiento con la funcion t_usuarios()
  }
  /////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////lista usuarios//////////////////////////////////////
  getListaUsuarioExternoMantenimiento(idatoabuscar) {
    const data = {
      datoabuscar: idatoabuscar,
    };

    return this._http.get(this.url + "3_listaUsuarioExternoMantenimiento", {
      params: data,
    });
  }
  /////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////lista unidad Organizacional//////////////////////////////////////
  getListacite(m_idUsuario: string) {
    //   return this._http.get(this.url + 'mantenimiento_cite/P/'+m_idUsuario) ;
    return this._http.get(this.url + "3_obtenerCite/P/" + m_idUsuario);
  }
  /////////////////////////////////////////////////////////////////////////////////
  getInsertarUsuariocc(m_idcorrespondencia: string, m_idusuario: string) {
    return this._http.get(
      this.url +
        "mantenimiento_usuariocc/I/null/" +
        m_idcorrespondencia +
        "/" +
        m_idusuario
    );
    //NO USAR
  }
  ////////////////////////////////item/////////////////////////////////////
  getListaItem() {
    // return this._http.get(this.url + 'mantenimiento_item/C') ;
    return this._http.get(this.url + "10_listaClasificador/37");
  }
  ////////////////////////////////Proveido/////////////////////////////////////
  getInsertaProveido(
    m_idpadre: string,
    m_idcorrespondencia: string,
    m_idusuariode: string,
    m_idusuariopara: string,
    m_contenido: string,
    m_indiceproveido: string,
    m_item: string,
    m_tiempo: string
  ) {
    const data = {
      operacion: "I",
      idProveido: "0",
      fidPadre: m_idpadre,
      fidCorrespondencia: m_idcorrespondencia,
      fidUsuarioDe: m_idusuariode,
      fidUsuarioPara: m_idusuariopara,
      contenido: m_contenido,
      fecha: null,
      fechaRespuesta: null,
      fechaRecibido: null,
      estadoRespuesta: null,
      estadoSituacion: null,
      estadoRecibido: null,
      indiceProveido: m_indiceproveido,
      item: m_item,
      tiempo: m_tiempo,
    };
    // return this._http.get(this.url + 'insertar_proveido/I/'+m_idpadre+'/'+m_idcorrespondencia+'/'+m_idusuariode+'/'+m_idusuariopara+'/'+m_contenido+'/'+m_indiceproveido+'/'+m_item+'/'+m_tiempo) ;
    return this._http.get(this.url + "3_crudProveido", { params: data });
  }
  ////////////////////////////////item_correspondencia_insertar/////////////////////////////////////
  getInsertarItemCorrespondencia(
    id_proveido: string,
    m_item: string,
    m_tiempo: string,
    m_usuario: string
  ) {
    const data = {
      operacion: "I",
      idItemCorrespondencia: "0",
      fidProveido: id_proveido,
      fidItem: m_item,
      tiempo: m_tiempo,
      usuario_registro: m_usuario,
    };
    return this._http.get(this.url + "3_crudItemCorrespondencia", {
      params: data,
    });
    //   return this._http.get(this.url + 'mantenimiento_itemcorrespondencia/I/0/'+id_proveido+'/'+m_item+'/'+m_tiempo+'/null') ;
  }
  ////////////////////////////////item_correspondencia_consulta/////////////////////////////////////
  getListarItemCorrespondencia(id_proveido: string) {
    //   return this._http.get(this.url + 'mantenimiento_itemcorrespondencia/P/0/'+id_proveido) ;
    return this._http.get(
      this.url + `3_listadosVarios/itemCorrespondencia/${id_proveido}/0`
    );
  }

  ////////////////////////////////tabla_proveido_listar/////////////////////////////////////
  getListaProveidoCorrespondencia(m_idcorrespondencia: string) {
    // return this._http.get(this.url + 'mantenimiento_proveido/P/0/0/'+m_idcorrespondencia+'/0/0/0/0/0/0/0/0/0/0/0/0/0') ;
    return this._http.get(
      this.url +
        `3_listadosVarios/proveidoCorrespondencia/${m_idcorrespondencia}/0`
    );
  }
  ////////////////////////////////tabla_proveido_filtro_ultimo/////////////////////////////////////
  getListaProveidoUltimo(m_idcorrespondencia: string) {
    //    return this._http.get(this.url + 'listaultimo_proveido/R/'+m_idcorrespondencia) ;
    return this._http.get(
      this.url + `3_listadosVarios/ultimoProveido/${m_idcorrespondencia}/0`
    );
  }
  /*************************************************************
      LISTA UNIDAD ORGANIZACIONAL
      ************************************************************/
  ListaUnidadOrganizacional() {
    //    return this._http.get(this.url + 'lista_unidadorganizacional') ;
    return this._http.get(
      this.url + "3_listadosVarios/unidadOrganizacional/0/0"
    );
  }
  BusquedaLikeUnidadOrganizacional(
    unidadorganizacional: string,
    idpadre: string
  ) {
    //    return this._http.get(this.url + 'busquedalike_unidadorganizacional/'+unidadorganizacional+'/'+idpadre) ;
    return this._http.get(
      this.url +
        `3_listadosVarios/unidadLike/${idpadre}/${unidadorganizacional}`
    );
  }
  listaUsuarioExterno(m_institucion: string, m_cargo: string) {
    // return this._http.get(this.url + 'listausuarioexterno/'+m_institucion+'/'+m_cargo) ;
    return this._http.get(
      this.url + `3_listadosVarios/usuarioExterno/${m_institucion}/${m_cargo}`
    );
  }
  listaTipodocumentohr() {
    // return this._http.get(this.url + 'listatipodocumentohr') ;
    return this._http.get(this.url + `3_listadosVarios/tipoDocumento/0/0`);
  }
  ////////////////////////////////tabla_editar_proveido__contenido/////////////////////////////////////
  getEditarProveido(m_idproveido: string, m_contenido: string) {
    //    return this._http.get(this.url + 'mantenimiento_proveido/UC/'+m_idproveido+'/0/0/0/0/'+m_contenido+'/0/0/0/0/0/0/0/0/0/0') ;
    const data = {
      operacion: "editarContenido",
      id1: m_idproveido,
      id2: "0",
      detalle1: m_contenido,
      detalle2: "0",
    };
    const resultado = this._http.get(this.url + "3_procesarActividades", {
      params: data,
    }); //evaluar la respuesta y si es positiva realizar la consulta
    console.log({ resultado });
    return this._http.get(
      this.url + `3_listadosVarios/proveidos/${m_idproveido}/0`
    );
  }
  ////////////////////////////////tabla_editar_proveido__contenido/////////////////////////////////////
  getEditarItemCorrespondencia(
    m_idproveido: string,
    m_codItem: string,
    m_tiempo: string,
    m_usuario: string
  ) {
    //    return this._http.get(this.url + 'mantenimiento_itemcorrespondencia/U/0/'+m_idproveido+'/'+m_codItem+'/'+m_tiempo+'/0') ;
    const data = {
      operacion: "U",
      idItemCorrespondencia: "0",
      fidProveido: m_idproveido,
      fidItem: m_codItem,
      tiempo: m_tiempo,
      usuario_registro: m_usuario,
    };
    const resultado = this._http.get(this.url + "3_crudItemCorrespondencia", {
      params: data,
    }); //evaluar resultado para retornar el error o el siguiente endPoint
    console.log({ resultado });
    return this._http.get(
      this.url + `3_listadosVarios/itemCorrespondencia/${m_idproveido}/0`
    );
  }
  ////////////////////////////////modificar_datos_correspondencia_proveido/////////////////////////////////////
  correspondenciaRecibida(m_idcorrespondencia: string, m_idProveido: string) {
    //    return this._http.get(this.url + 'correspondencia_recibida/U/'+m_idcorrespondencia+'/'+m_idProveido);
    const data = {
      operacion: "editarCorrespondencia",
      id1: m_idcorrespondencia,
      id2: m_idProveido,
      detalle1: "",
      detalle2: "",
    };
    return this._http.get(this.url + "3_procesarActividades", { params: data });
  }
  cambioEstadoCorrespondencia(
    m_idcorrespondencia: string,
    m_idproveido: string,
    m_cabeceraproveido: string,
    m_estado: string
  ) {
    //return this._http.get(this.url + 'cambioEstadoCorrespondencia/'+m_idcorrespondencia+'/'+m_idproveido+'/'+m_cabeceraproveido+'/'+m_estado);
    const data = {
      operacion: "cambiarEstadoCorrespondencia",
      id1: m_idcorrespondencia,
      id2: m_idproveido,
      detalle1: m_cabeceraproveido,
      detalle2: m_estado,
    };
    return this._http.get(this.url + "3_procesarActividades", { params: data });
  }
  ///////////////////////////////////////////////listar usuario externo con filtro institucion y cargo///////////////////////////////////////////////////////
  getListarUsuarioExterno(m_nombreinstitucion: string, m_nombrecargo: string) {
    //   console.log(m_nombreinstitucion);          console.log(m_nombrecargo);
    //   return this._http.get(this.url + 'mantenimiento_usuarioexterno/P/0/'+m_nombreinstitucion+'/'+m_nombrecargo+'/null/0');
    return this._http.get(
      this.url +
        `3_listadosVarios/usuarioExterno/${m_nombreinstitucion}/${m_nombrecargo}`
    );
  }
  ////////////////////////////////modificar_datos_correspondencia_proveido/////////////////////////////////////
  getListaUsuarioExterno(m_nombreinstitucion: string) {
    // return this._http.get(this.url + 'mantenimiento_usuarioexterno/CI/0/'+m_nombreinstitucion+'/null/null/0');
    return this._http.get(
      this.url + `3_listadosVarios/usuarioExterno/${m_nombreinstitucion}/0`
    );
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////insertar_usuario_externo/////////////////////////////////////
  getInsertarUsuarioExterno(
    m_nombreinstitucion: string,
    m_nombrecargo: string,
    m_nombreusuario: string,
    m_idusuario: string,
    m_idestado: string
  ) {
    // return this._http.get(this.url + 'mantenimiento_usuarioexterno/I/0/'+m_nombreinstitucion+'/'+m_nombrecargo+'/'+m_nombreusuario+'/'+m_idusuario+'/'+m_idestado);
    const data = {
      operacion: "I",
      idUsuarioExterno: "0",
      institucion: m_nombreinstitucion,
      cargo: m_nombrecargo,
      nombre: m_nombreusuario,
      usuario_registro: m_idusuario,
    };
    return this._http.get(this.url + "3_crudUsuarioExterno", { params: data });
  }
  ////////////////////////////////MODIFICAR USUARIO EXTERNO///////////////////////////////////
  getEditarUsuario(
    m_idusuarioexterno: string,
    m_nombreinstitucion: string,
    m_nombrecargo: string,
    m_nombreusuario: string,
    m_idusuario: string
  ) {
    // return this._http.get(this.url + 'mantenimiento_usuarioexterno/U/'+m_idusuarioexterno+'/'+m_nombreinstitucion+'/'+m_nombrecargo+'/'+m_nombreusuario+'/0/0');
    const data = {
      operacion: "U",
      idUsuarioExterno: m_idusuarioexterno,
      institucion: m_nombreinstitucion,
      cargo: m_nombrecargo,
      nombre: m_nombreusuario,
      usuario_registro: m_idusuario,
    };
    return this._http.get(this.url + "3_crudUsuarioExterno", { params: data });
  }
  ////////////////////////////////////////eliminar  USUARIO EXTERNO/////////////////////////////////////////////////
  getEliminarUsuario(m_idusuarioexterno: string, m_idusuario: string) {
    // return this._http.get(this.url + 'mantenimiento_usuarioexterno/D/'+m_idusuarioexterno+'/null/null/null/0/0') ;
    const data = {
      operacion: "D",
      idUsuarioExterno: m_idusuarioexterno,
      institucion: "",
      cargo: "",
      nombre: "",
      usuario_registro: m_idusuario,
    };
    return this._http.get(this.url + "3_crudUsuarioExterno", { params: data });
  }
  getCrudUnidad(unidad: any) {
    return this._http.get(this.url + "3_crudUnidad", { params: unidad });
  }
  //////////////////////////////////////inicio_formulario_correspondencia_interna///////
  ////////////////////////////////institucion///////////////////////////////////
  getListaunidad() {
    // return this._http.get(this.url + 'mantenimiento_UnidadOrganizacional/C') ;
    return this._http.get(
      this.url + "3_listadosVarios/unidadOrganizacional/0/0"
    );
  }

  /****************************** Registro automático ******************************/
  getRegAutomatico(institucion: string, id_usuariocreador: string) {
    // return this._http.get(this.url + 'mantenimiento_usuarioexternosd/'+id_institucion+'/'+id_usuariocreador) ;
    const data = {
      operacion: "I",
      idUsuarioExterno: "0",
      institucion: institucion,
      cargo: "SD",
      nombre: "SD",
      usuario_registro: id_usuariocreador,
    };
    return this._http.get(this.url + "3_crudUsuarioExterno", { params: data });
  }
  /****************************** Lista Usuario Gestión ******************************/
  getListaUsuarioGestion() {
    // return this._http.get(this.url + 'lista_usuario_gestion') ;
    return this._http.get(this.url + "3_listadosVarios/usuarioGestion/0/0");
  }
  /****************************** Operaciones ADM Gestión ******************************/
  getListaAdmGestion(operacion: string) {
    return this._http.get(this.url + "listaAdmGestion/" + operacion);
    //YA NO SE USARA
  }
  getEliminarAdmGestion(
    operacion: string,
    IdConfiguracion: string,
    Gestion: string
  ) {
    return this._http.get(
      this.url +
        "eliminaAdmGestion/" +
        operacion +
        "/" +
        IdConfiguracion +
        "/" +
        Gestion
    );
    //YA NO SE USARA
  }
  getRegistroAdmGestion(
    operacion: string,
    IdConfiguracion: string,
    Gestion: string,
    HojaRuta: string,
    direccion: string,
    IdUsuario: string,
    FechaInicio: string,
    FechaFin: string,
    Estado: string,
    TiempoReserva: string
  ) {
    return this._http.get(
      this.url +
        "registroAdmGestion/" +
        operacion +
        "/" +
        IdConfiguracion +
        "/" +
        Gestion +
        "/" +
        HojaRuta +
        "/" +
        direccion +
        "/" +
        IdUsuario +
        "/" +
        FechaInicio +
        "/" +
        FechaFin +
        "/" +
        Estado +
        "/" +
        TiempoReserva
    );
    //YA NO SE USARA
  }

  /*****************para checklist revision flujo **********/
  crudRevision(dts) {
    return this._http.get(this.url + "3_flujoCRUDRevision", { params: dts });
  }
  crudAnexo(dts) {
    return this._http.get(this.url + "3_flujoCRUDAnexo", { params: dts });
  }
  revision(dts) {
    return this._http.get(this.url + "3_revision", { params: dts });
  }
  anexo(fidRevision) {
    return this._http.get(this.url + "3_anexo/" + fidRevision);
  }
  anexosProyecto(fidProyecto) {
    return this._http.get(this.url + "3_anexosProyecto/" + fidProyecto);
  }
  // relacionProyectoHR(dts) {
  //     return this._http.get(this.url + '3_relacionProyectoHR/',{params: dts,});
  // }
  /********************************************
   * FLUJO RELACION PROYECTO HOJA DE RUTA
   *******************************************/
  insertaProyectoHr(dts) {
    return this._http.get(this.url + "3_insertaProyectoHr", { params: dts });
  }
  buscarFlujoHR(dts) {
    return this._http.get(this.url + "3_relacionProyectoHR", { params: dts });
  }
  /**************REPORTES*************** */
  reportesCorrespondencia(dts) {
    return this._http.get(this.url + dts.url, {
      responseType: "arraybuffer",
      params: dts,
    });
  }

  /****************************
   * ***********SIGEC
   *****************************/
  crudCorrelativo(correlativo) {
    return this._http.get(this.url + "3_crudCorrelativo", {
      params: correlativo,
    });
  }
  crudTipoCite(tipoCite) {
    return this._http.get(this.url + "3_crudTipoCite", { params: tipoCite });
  }
  crudDocumento(documento) {
    return this._http.get(this.url + "3_crudDocumento", { params: documento });
  }
  crudUsuarioTipo(usuarioTipo) {
    return this._http.get(this.url + "3_crudUsuarioTipo", {
      params: usuarioTipo,
    });
  }
  listaCorrelativos(opcion: string) {
    return this._http.get(this.url + "3_listaCorrelativos/" + opcion);
  }
  listaTipoCites(opcion: string) {
    return this._http.get(this.url + "3_listaTiposCites/" + opcion);
  }
  listaDocumentos(opcion: string, gestion: number) {
    return this._http.get(this.url + `3_listaDocumentos/${opcion}/${gestion}`);
  }
  listaProcesos(opcion: string) {
    return this._http.get(this.url + "3_listaProcesos/" + opcion);
  }
  listaUsuariosTipos(opcion: string) {
    return this._http.get(this.url + "3_listaUsuariosTipos/" + opcion);
  }
  listaUsuarios() {
    return this._http.get(this.url + "3_listadosVarios/usuariosActivos/0/det");
  }
  listaOficinas() {
    return this._http.get(this.url + "3_listadosVarios/oficinas/0/det");
  }
  listaClasificadores(id) {
    return this._http.get(
      this.url + `3_listadosVarios/clasificadores/${id}/det`
    );
  }
  crudOficina(oficina) {
    return this._http.get(this.url + "3_crudOficina", { params: oficina });
  }
  updateUsuarioOficina(oficina) {
    return this._http.get(this.url + "3_updateUsuarioOficina", {
      params: oficina,
    });
  }
  /*******hr poryectos */
  hrProyectos = (dts) => this._http.get(this.url + '3_hrProyectos',{params: dts,});
}
