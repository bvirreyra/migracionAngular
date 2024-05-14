import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Globals } from "../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";
import { ArchivocentralService } from "../archivocentral.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important
@Component({
  selector: "app-formulario-modificacion",
  templateUrl: "./formulario-modificacion.component.html",
  styleUrls: ["./formulario-modificacion.component.css"],
})
export class FormularioModificacionComponent implements OnInit {
  public cargando: boolean = false;
  /*VARIABLES PARA MASCARAS */
  public mask_numerodecimal: any;
  public mask_fecha: any;
  public mask_numero: any;
  public mask_gestion: any;
  public mask_cite: any;

  //variables para el compononete de mensajes
  public prop_msg: string;
  public prop_tipomsg: string;

  //variables de session y iniciales
  public s_idcon: string;
  public s_idmod: string;
  public s_idrol: number;
  public s_user: string;
  public s_nomuser: string;
  public s_usu_id: string;
  public dts_roles_usuario: any;
  public s_usu_id_sipta: any;
  public s_usu_id_sispre: any;
  public s_ci_user: any;

  public url: string;
  public urlApi: string;
  public url_reporte: string;
  public errorMessage: string;
  public fechasrv: string;

  public dtsDatosConexion: any;
  public dtsFechaSrv: any;
  public dtsFechaLiteral: any;
  public dtsHoraSrv: any;
  public dtsAnio: any;
  public s_imgLogo: any;

  public m_gestion: any;
  public m_mes_actual: any;
  //VARIABLES DEL COMPONENTE

  public pnl_bandejacabecera = true;
  public pnl_bandejaproyectos = false;
  public idcabeceraBusqueda = "";
  public codigoBusqueda = "";
  public contenedorNuevo = "";

  //DTS
  public dts_cabecera: any;

  //VARIABLES DEL FORMULARIO
  public dts_contenedor: any;
  public proyectoDatos: {
    fisico: boolean;
    digital: boolean;
    viabilidad: boolean;
    contratacion: boolean;
  };
  public estudio = 0;
  public arrayPlanillas: boolean[] = [false]; // EJECUCION
  public arrayPlanillasSup: boolean[] = [false]; // SUPERVISION
  public arrayPlanillasFis: boolean[] = [false]; // FISCALIZACION
  public ejecucionCierre: {
    cierre: boolean;
    garantia: boolean;
    conciliacion: boolean;
    resolucion: boolean;
  };
  public licenciaAmbiental: {
    original: boolean;
    legalizada: boolean;
    simple: boolean;
  };
  public arrayContrato: boolean[] = [false];
  public arrayOrdenCambio: boolean[] = [false];
  public arrayOrdenTrabajo: boolean[] = [false];
  public informeProyecto = false;
  public informeProyectoSup = false;
  public informeProyectoFis = false;
  public cierreCife: {
    tecnico: boolean;
    financiero: boolean;
    legal: boolean;
    institucional: boolean;
  };
  public cierreCif: {
    tecnico: boolean;
    financiero: boolean;
    legal: boolean;
    institucional: boolean;
    ficha: boolean;
  };
  public actasCierre: {
    provisional: boolean;
    definitiva: boolean;
  };
  public auditoria: {
    auditoria: boolean;
    compromiso: boolean;
    seguimiento: boolean;
  };
  public pnl_formulario = false;
  public pnl_formulario2 = false;
  public pnl_formulario3 = false;
  public contenedor: any;
  public codigoArchivo = "";
  public codigoRegion = "";
  public codigoContenedor = "";
  public idSgp = null;
  public codDpto = "";
  public codProv = "";
  public codMun = "";
  public municipioDescripcion = "";
  public nombreProyecto = "";
  public gestion = 0;
  public habilitaContenedor = false;
  public habilitaFormulario = false;
  public observacion = "";
  public habilitaAgrupador = true;
  public contenedorAgrupador = "";
  public dts_detalle: any;
  public cabeceraCaja: any;
  public codigoCaja: any;
  public gestionCaja: any;
  public detalleArchivo: {
    idDetalle: any;
    fidCabecera: any;
    contenedor: any;
    codigoContenedor: any;
    grupoContenido: any;
    tipoContenido: any;
    nroContenido: any;
    detalleContenido: any;
    usrRegistro: any;
    idEstado: any;
    operacion: any;
  };
  //VARIABLES PARA MANEJO DE OBJETOS
  public cabecera: {
    idCabecera: any;
    fidProyecto: any;
    fidSgp: any;
    codDepartamento: any;
    codProvincia: any;
    codMunicipio: any;
    detalleContenido: any;
    tipoArchivo: any;
    region: any;
    gestion: any;
    usrRegistro: any;
    idEstado: any;
    operacion: any;
  };
  public id_cabecera: any;
  public codigo_contenedor: any;
  public mensaje = "ARCHIVO TECNICO";

  //CORRECCIONES MODULO
  public totalDetalleArchivo: any[] = [];
  public elIdCabecera: number;
  public elIdObservacion: number;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _archivocentral: ArchivocentralService,

    private globals: Globals,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent,
    private datePipe: DatePipe,
    private base64: ImgBase64Globals
  ) {
    this._route.parent.params.subscribe((parametros) => {
      this.s_idcon = parametros["idcon"];
      this.s_idmod = parametros["idmod"];
    });
    this.url = globals.rutaSrvFronEnd;
    this.s_imgLogo = base64.logocabecera;
    this.url_reporte = globals.rutaSrvReportes;
    this.detalleArchivo = {
      idDetalle: 0,
      fidCabecera: 0,
      contenedor: "",
      codigoContenedor: "",
      grupoContenido: "",
      tipoContenido: "",
      nroContenido: 0,
      detalleContenido: "",
      usrRegistro: 0,
      idEstado: 1,
      operacion: "I",
    };
    this.cabecera = {
      idCabecera: 0,
      fidProyecto: 0,
      fidSgp: null,
      codDepartamento: null,
      codProvincia: null,
      codMunicipio: null,
      detalleContenido: null,
      tipoArchivo: null,
      region: null,
      gestion: null,
      usrRegistro: null,
      idEstado: 1,
      operacion: "I",
    };
    this.proyectoDatos = {
      fisico: false,
      digital: false,
      viabilidad: false,
      contratacion: false,
    };
    this.ejecucionCierre = {
      cierre: false,
      garantia: false,
      conciliacion: false,
      resolucion: false,
    };
    this.cierreCife = {
      tecnico: false,
      financiero: false,
      legal: false,
      institucional: false,
    };
    this.cierreCif = {
      tecnico: false,
      financiero: false,
      legal: false,
      institucional: false,
      ficha: false,
    };
    this.actasCierre = {
      provisional: false,
      definitiva: false,
    };
    this.auditoria = {
      auditoria: false,
      compromiso: false,
      seguimiento: false,
    };
    this.licenciaAmbiental = {
      original: false,
      legalizada: false,
      simple: false,
    };
    //EJECUCION
    for (let index = 0; index < 50; index++) {
      this.arrayPlanillas.push(false);
    }
    //SUPERVISION
    for (let index = 0; index < 30; index++) {
      this.arrayPlanillasSup.push(false);
    }
    //FISCALIZACION
    for (let index = 0; index < 30; index++) {
      this.arrayPlanillasFis.push(false);
    }
    //MODIFICACIONES
    for (let index = 0; index < 35; index++) {
      this.arrayContrato.push(false);
    }
    //ORDEN CAMBIO
    for (let index = 0; index < 35; index++) {
      this.arrayOrdenCambio.push(false);
    }
    //ORDEN TRABAJO
    for (let index = 0; index < 35; index++) {
      this.arrayOrdenTrabajo.push(false);
    }
  }
  ngOnInit() {
    this.idcabeceraBusqueda = decodeURIComponent(
      this.getUrlVars()["idcabecera"]
    );
    this.codigoBusqueda = decodeURIComponent(this.getUrlVars()["codigo"]);
    this.contenedorAgrupador = decodeURIComponent(
      this.getUrlVars()["contenedor"]
    );

    this.cabeceraCaja = decodeURIComponent(this.getUrlVars()["cabeceraCaja"]);
    this.codigoCaja = decodeURIComponent(this.getUrlVars()["codigoCaja"]);
    this.gestionCaja = decodeURIComponent(this.getUrlVars()["gestionCaja"]);
    sessionStorage.clear();
    function falloCallback(error) {
      console.log("Falló con " + error);
    }

    this.DatosConexion()
      .then((dts1) => {
        this.dtsDatosConexion = dts1;
        return this.FechaServidor();
      })
      .then((dts2) => {
        this.dtsFechaSrv = dts2[0]["fechasrv"];
        this.dtsHoraSrv = this.transformHora(this.dtsFechaSrv);
        this.m_gestion = this.dtsFechaSrv.substr(0, 4);
        this.m_mes_actual = this.dtsFechaSrv.substr(5, 2);
        return this.FechaLiteral(dts2[0]["fechasrv"]);
      })
      .then((dts3) => {
        this.dtsFechaLiteral = dts3;
        this.combocontenedor();
      })
      .then((dts) => {
        return this.RolesAsignados(this.s_usu_id);
      })
      .then((dts) => {
        this.dts_roles_usuario = dts;
        console.log("roles", this.dts_roles_usuario);
        this.GuardarLocalStorage();
      })
      .then((dts) => {
        return this.obtieneDetalle();
      })
      .then((dts) => {
        this.dts_detalle = dts;
        const reg = this.dts_detalle.filter(
          (el) => el.grupo_contenido == "OBSERVACION"
        )[0];
        if (reg) this.elIdObservacion = reg.id_detalle;
        this.llenaDatos(dts);
      })
      .catch(falloCallback);
  }
  /*obteniendo los datos de la url*/
  getUrlVars() {
    var vars = [],
      hash;
    var hashes = window.location.href
      .slice(window.location.href.indexOf("?") + 1)
      .split("&");
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split("=");
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  }
  /*******************************************************************************/
  /*DATOS INICIALES
  /*******************************************************************************/
  DatosConexion() {
    return new Promise((resolve, reject) => {
      this._autenticacion
        .getdatosconexion(this.s_idcon, this.s_idmod)
        .subscribe(
          (result: any) => {
            
            if (Array.isArray(result) && result.length > 0) {
              if (result[0]["_idrol"] != "") {
                this.s_idrol = result[0]["_idrol"];
                this.s_user = result[0]["_usu_user"];
                this.s_nomuser = result[0]["_usu_nom_com"];
                this.s_usu_id = result[0]["_usu_id"];
                this.s_usu_id_sipta = result[0]["_usu_id_sipta"];
                this.s_usu_id_sispre = result[0]["_usu_id_sispre"];
                this.s_ci_user = result[0]["_usu_ci"];
                resolve(result);
                return result;
              }
            } else {
              this.prop_msg =
                "Error: La conexion no es valida, contáctese con el área de sistemas";
              this.prop_tipomsg = "danger";
              this._msg.formateoMensaje("modal_danger", this.prop_msg);
              reject(this.prop_msg);
            }
          },
          (error) => {
            this.errorMessage = <any>error;
            if (this.errorMessage != null) {
              console.log(this.errorMessage);
              this.prop_msg =
                "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
              this.prop_tipomsg = "danger";
              this._msg.formateoMensaje("modal_danger", this.prop_msg);
            }
            reject(this.prop_msg);
          }
        );
    });
  }
  RolesAsignados(usu_id) {
    return new Promise((resolve, reject) => {
      this._autenticacion.rolesasignados(usu_id).subscribe(
        (result: any) => {
          

          if (Array.isArray(result) && result.length > 0) {
            resolve(result);
          } else {
            this.prop_msg =
              "Error: La conexion no es valida, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
            reject(this.prop_msg);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            console.log(this.errorMessage);
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
          reject(this.prop_msg);
        }
      );
    });
  }
  FechaServidor() {
    return new Promise((resolve, reject) => {
      this._autenticacion.getfechaservidor().subscribe(
        (result: any) => {
          
          if (result[0]["fechasrv"] != "") {
            resolve(result);
            return result;
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos ";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  transformHora(date) {
    return this.datePipe.transform(date, "HH:mm:ss");
    //whatever format you need.
  }
  transformAnio(date) {
    return this.datePipe.transform(date, "YYYY");
    //whatever format you need.
  }
  HoraServidor() {
    return new Promise((resolve, reject) => {
      this._autenticacion.gethoraservidor().subscribe(
        (result: any) => {
          
          if (result[0]["HORA"] != "") {
            var hora = this.transformHora(result[0]["HORA"]);
            resolve(hora);
            return hora;
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos ";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  manejoRoles() {
    var lineas = this.dts_roles_usuario.length;
    var datos = this.dts_roles_usuario;
    let dpto = "";
  }

  FechaLiteral(f) {
    return this._fun.FechaLiteral(f);
  }
  GuardarLocalStorage() {
    let dts_con = {
      s_idrol: this.s_idrol,
      s_user: this.s_user,
      s_nomuser: this.s_nomuser,
      s_usu_id: this.s_usu_id_sispre,
      s_usu_id_sipta: this.s_usu_id_sipta,
      s_usu_id_sispre: this.s_usu_id_sispre,
      s_ci_user: this.s_ci_user,
    };
    let dts_rol = this.dts_roles_usuario;

    localStorage.setItem("dts_con", JSON.stringify(dts_con));
    localStorage.setItem("dts_rol", JSON.stringify(dts_rol));
  }

  paneles() {
    var ruta = "12_archivocentral";
    var conexion = this.s_idcon;
    var modulo = this.s_idmod;
    this._router.navigate(
      [ruta + "/" + conexion + "/" + modulo + "/12_detallecabeceraarchivo"],
      {
        queryParams: {
          idcabecera: this.cabeceraCaja,
          codigo: this.codigoCaja,
          gestion: this.gestionCaja,
        },
      }
    );
  }

  datosContenedor() {
    this.codigoContenedor = "";
    this.detalleArchivo = {
      idDetalle: 0,
      fidCabecera: this.idcabeceraBusqueda,
      contenedor: this.contenedorAgrupador,
      codigoContenedor: decodeURIComponent(this.codigoBusqueda),
      grupoContenido: "",
      tipoContenido: "",
      nroContenido: 0,
      detalleContenido: "",
      usrRegistro: 0,
      idEstado: 1,
      operacion: "I",
    };
    if (
      this.contenedor.descripciondetalleclasificador != this.contenedorAgrupador
    ) {
      this.codigoContenedor = this.contenedor.codigodetalleclasificador;
      this.detalleArchivo.contenedor =
        this.contenedor.descripciondetalleclasificador;
      this.contenedorNuevo = this.contenedor.descripciondetalleclasificador;
      var codigo =
        this.codigoArchivo +
        "-" +
        this.codigoRegion +
        "-" +
        this.codigoContenedor +
        "-" +
        this.municipioDescripcion;
      this.obtieneCorrelativo(codigo, this.gestion);
    }
    this.habilitaContenedor = true;
    this.habilitaFormulario = false;
  }

  combocontenedor() {
    this._archivocentral.listaClasificador(13, undefined).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          // var datos = this._fun.RemplazaNullArray(result);
          // var filtro = datos.filter((element) => {
          //   return element.id_detalle != 57;
          // });
          // this.dts_contenedor = filtro;
          this.dts_contenedor = result;
        } else {
          this.prop_msg = "Alerta: No existen registros de cabecera";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
          this.cargando = false;
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_info", this.prop_msg);
        }
      }
    );
  }
  actualizaDatosDetalle(grupo, tipo, valor, posicion = null) {
    console.log("actualizando", grupo, tipo, valor, posicion);
    if (
      this.totalDetalleArchivo.filter(
        (el) =>
          el.grupoContenido == grupo &&
          el.tipoContenido == tipo &&
          el.nroContenido == posicion
      )[0]
    ) {
      this.totalDetalleArchivo = this.totalDetalleArchivo.filter(
        (el) =>
          !(
            el.grupoContenido == grupo &&
            el.tipoContenido == tipo &&
            el.nroContenido == posicion
          )
      );
      return true;
    }
    const elRegistro = {
      idDetalle: 0,
      fidCabecera: this.idcabeceraBusqueda,
      contenedor: this.contenedorAgrupador,
      codigoContenedor: decodeURIComponent(this.codigoBusqueda),
      detalleContenido: "",
      idEstado: 1,
      grupoContenido: grupo,
      tipoContenido: tipo,
      nroContenido: posicion,
      usrRegistro: this.s_usu_id,
      operacion: valor ? "I" : "D",
    };
    if (grupo == "ESTUDIO SOCIO ECONOMICO") {
      const anula = Object.assign({}, elRegistro);
      anula.operacion = "D";
      anula.tipoContenido = tipo == "NO" ? "SI" : "NO";
      this.totalDetalleArchivo.push(anula);
    }
    this.totalDetalleArchivo.push(elRegistro);
    console.log(this.totalDetalleArchivo);
  }

  registrarTotalDetalle() {
    console.log(this.cabecera.idCabecera);
    if (!this.totalDetalleArchivo) return true;
    const regObservacion = {
      idDetalle: this.elIdObservacion || 0,
      fidCabecera: this.idcabeceraBusqueda,
      contenedor: this.contenedorAgrupador,
      codigoContenedor: decodeURIComponent(this.codigoBusqueda),
      detalleContenido: this.observacion,
      idEstado: 1,
      grupoContenido: "OBSERVACION",
      tipoContenido: "DETALLE CONTENIDO",
      nroContenido: null,
      usrRegistro: this.s_usu_id,
      operacion: this.elIdObservacion ? "U" : "I",
    };
    this.totalDetalleArchivo.push(regObservacion);
    setTimeout(() => {
      this.totalDetalleArchivo.forEach((element) => {
        element.fidCabecera = this.idcabeceraBusqueda;
        this.insertarDetalle(element);
      });
      this.habilitaFormulario = true;
    }, 200);
  }

  insertarDetalle(detalle) {
    console.log(detalle);
    this.cargando = true;
    // if (detalle.grupoContenido == "OBSERVACION") {
    //   detalle.detalleContenido = this.observacion;
    //   detalle.operacion = "U";
    // }
    this._archivocentral.insertaDetalle(detalle).subscribe(
      (result: any) => {
        

        if (detalle.grupoContenido == "OBSERVACION") {
          this.habilitaAgrupador = true;
          this.habilitaFormulario = true;
          this.paneles();
        }
        this.cargando = false;
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          // console.log(this.errorMessage);
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos ";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_warning", this.prop_msg);
        }
      }
    );
  }

  elminarDetalle(detalle) {
    this._archivocentral.eliminaDetalle(detalle).subscribe(
      (result: any) => {
        
        this.prop_msg = result[0]["_mensaje"];
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          // console.log(this.errorMessage);
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos ";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_warning", this.prop_msg);
        }
      }
    );
  }

  obtieneDetalle() {
    return new Promise((resolve, reject) => {
      this._archivocentral
        .obtieneDetalleContenedor(this.idcabeceraBusqueda, this.codigoBusqueda)
        .subscribe(
          (result: any) => {
            resolve(result);
          },
          (error) => {
            this.errorMessage = <any>error;
            if (this.errorMessage != null) {
              // console.log(this.errorMessage);
              this.prop_msg =
                "Error: No se pudo ejecutar la petición en la base de datos ";
              this.prop_tipomsg = "danger";
              this._msg.formateoMensaje("modal_warning", this.prop_msg);
            }
          }
        );
    });
  }

  obtieneCorrelativo(valor, gestion) {
    this._archivocentral.obtieneIndice(valor, gestion).subscribe(
      (result: any) => {
        
        console.log(result);
        this.detalleArchivo.codigoContenedor = result[0]["vcorrelativo"];
        // console.log(this.detalleArchivo.codigoContenedor);
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          // console.log(this.errorMessage);
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos ";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_warning", this.prop_msg);
        }
      }
    );
  }
  indexTracker(index: number, value: any) {
    return index;
  }
  llenaDatos(dts) {
    console.log('entra bonk',dts);
    
    dts.forEach((element) => {
      console.log('iteracion',element);
      
      this.nombreProyecto = element.nombre_proyecto_compromiso; //Proyecto
      this.municipioDescripcion = element.mundesc; //MUNICIPIO
      this.detalleArchivo = element.fid_cabecera;
      this.cabecera.idCabecera = element.fid_cabecera;
      this.codigoArchivo = element.tipoarchivo;
      this.codigoRegion = element.tiporegion;
      this.gestion = element.gestion;
      if (
        (element.grupo_contenido ==
          "PROYECTO" && element.tipo_contenido == "PROYECTO EN FISICO")
      ) {
        this.proyectoDatos.fisico = true;
      }
      if (
        (element.grupo_contenido ==
          "PROYECTO" && element.tipo_contenido == "PROYECTO DIGITAL")
      ) {
        this.proyectoDatos.digital = true;
      }
      if (
        (element.grupo_contenido ==
          "PROYECTO" && element.tipo_contenido == "VIABILIDAD")
      ) {
        this.proyectoDatos.viabilidad = true;
      }
      if (
        (element.grupo_contenido ==
          "PROYECTO" && element.tipo_contenido == "PROCESO DE CONTRATACION")
      ) {
        this.proyectoDatos.contratacion = true;
      }
      if (
        (element.grupo_contenido ==
          "ESTUDIO SOCIO ECONOMICO" && element.tipo_contenido == "SI")
      ) {
        this.estudio = 1;
      }
      if (
        (element.grupo_contenido ==
          "ESTUDIO SOCIO ECONOMICO" && element.tipo_contenido == "NO")
      ) {
        this.estudio = 2;
      }
      if (
        (element.grupo_contenido ==
          "LICENCIA AMBIENTAL" && element.tipo_contenido == "ORIGINAL")
      ) {
        this.licenciaAmbiental.original = true;
      }
      if (
        (element.grupo_contenido ==
          "LICENCIA AMBIENTAL" && element.tipo_contenido == "COPIA LEGALIZADA")
      ) {
        this.licenciaAmbiental.legalizada = true;
      }
      if (
        (element.grupo_contenido ==
          "LICENCIA AMBIENTAL" && element.tipo_contenido == "COPIA SIMPLE")
      ) {
        this.licenciaAmbiental.simple = true;
      }
      if (
        (element.grupo_contenido ==
          "EJECUCION" && element.tipo_contenido == "PLANILLA")
      ) {
        console.log('entro bonk',element);
        this.arrayPlanillas[element.nro_contenido - 1] = true;
      }
      if (
        (element.grupo_contenido ==
          "EJECUCION" && element.tipo_contenido == "PLANILLA DE CIERRE")
      ) {
        this.ejecucionCierre.cierre = true;
      }
      if (
        (element.grupo_contenido ==
          "EJECUCION" && element.tipo_contenido == "LIBERACION DE GARANTIA")
      ) {
        this.ejecucionCierre.garantia = true;
      }
      if (
        (element.grupo_contenido ==
          "EJECUCION" && element.tipo_contenido == "PLANILLA DE CONCILIACION")
      ) {
        this.ejecucionCierre.conciliacion = true;
      }
      if (
        (element.grupo_contenido ==
          "EJECUCION" && element.tipo_contenido == "RESOLUCION DE CONTRATO")
      ) {
        this.ejecucionCierre.resolucion = true;
      }
      if (
        (element.grupo_contenido ==
          "SUPERVISION" && element.tipo_contenido == "PLANILLA")
      ) {
        this.arrayPlanillasSup[element.nro_contenido - 1] = true;
      }
      if (
        (element.grupo_contenido ==
          "FISCALIZACION" && element.tipo_contenido == "PLANILLA")
      ) {
        this.arrayPlanillasFis[element.nro_contenido - 1] = true;
      }
      if (
        (element.grupo_contenido ==
          "MODIFICACION" && element.tipo_contenido == "CONTRATO MODIFICATORIO")
      ) {
        this.arrayContrato[element.nro_contenido - 1] = true;
      }
      if (
        (element.grupo_contenido ==
          "MODIFICACION" && element.tipo_contenido == "ORDEN DE CAMBIO")
      ) {
        this.arrayOrdenCambio[element.nro_contenido - 1] = true;
      }
      if (
        (element.grupo_contenido ==
          "MODIFICACION" && element.tipo_contenido == "ORDEN DE TRABAJO")
      ) {
        this.arrayOrdenTrabajo[element.nro_contenido - 1] = true;
      }
      if (
        (element.grupo_contenido ==
          "CIERRE CIFE" && element.tipo_contenido == "INFORME DE PROYECTO")
      ) {
        this.informeProyecto = true;
      }
      if (
        (element.grupo_contenido ==
          "CIERRE CIFE" && element.tipo_contenido == "INFORME DE SUPERVISION")
      ) {
        this.informeProyectoSup = true;
      }
      if (
        (element.grupo_contenido ==
          "CIERRE CIFE" && element.tipo_contenido == "INFORME DE FISCALIZACION")
      ) {
        this.informeProyectoFis = true;
      }
      if (
        (element.grupo_contenido ==
          "CIERRE CIFE" && element.tipo_contenido == "CIERRE TECNICO")
      ) {
        this.cierreCife.tecnico = true;
      }
      if (
        (element.grupo_contenido ==
          "CIERRE CIFE" && element.tipo_contenido == "CIERRE FINANCIERO")
      ) {
        this.cierreCife.financiero = true;
      }
      if (
        (element.grupo_contenido ==
          "CIERRE CIFE" && element.tipo_contenido == "CIERRE LEGAL")
      ) {
        this.cierreCife.legal = true;
      }
      if (
        (element.grupo_contenido ==
          "CIERRE CIFE" && element.tipo_contenido == "CIERRE INSTITUCIONAL")
      ) {
        this.cierreCife.institucional = true;
      }
      if (
        (element.grupo_contenido ==
          "CIERRE CIF" && element.tipo_contenido == "INFORME CIERRE TECNICO")
      ) {
        this.cierreCif.tecnico = true;
      }
      if (
        (element.grupo_contenido ==
          "CIERRE CIF" && element.tipo_contenido == "INFORME CIERRE FINANCIERO")
      ) {
        this.cierreCif.financiero = true;
      }
      if (
        (element.grupo_contenido ==
          "CIERRE CIF" && element.tipo_contenido == "INFORME CIERRE LEGAL")
      ) {
        this.cierreCif.legal = true;
      }
      if (
        (element.grupo_contenido ==
          "CIERRE CIF" &&
          element.tipo_contenido == "INFORME CIERRE INSTITUCIONAL")
      ) {
        this.cierreCif.institucional = true;
      }
      if (
        (element.grupo_contenido ==
          "CIERRE CIF" && element.tipo_contenido == "FICHA DE CIERRE TECNICO")
      ) {
        this.cierreCif.ficha = true;
      }
      if (
        (element.grupo_contenido ==
          "ACTAS DE CIERRE" && element.tipo_contenido == "ACTA PROVISIONAL")
      ) {
        this.actasCierre.provisional = true;
      }
      if (
        (element.grupo_contenido ==
          "ACTAS DE CIERRE" && element.tipo_contenido == "ACTA DEFINITIVA")
      ) {
        this.actasCierre.definitiva = true;
      }
      if (
        (element.grupo_contenido ==
          "AUDITORIA" && element.tipo_contenido == "INFORME AUDITORIA")
      ) {
        this.auditoria.auditoria = true;
      }
      if (
        (element.grupo_contenido ==
          "AUDITORIA" && element.tipo_contenido == "NOTA COMPROMISO")
      ) {
        this.auditoria.compromiso = true;
      }
      if (
        (element.grupo_contenido ==
          "AUDITORIA" && element.tipo_contenido == "NOTA SEGUIMIENTO")
      ) {
        this.auditoria.seguimiento = true;
      }
      if (
        (element.grupo_contenido ==
          "OBSERVACION" && element.tipo_contenido == "DETALLE CONTENIDO")
      ) {
        this.observacion = element.detalle_contenido;
      }
    });
    setTimeout(() => {
      console.log('bonk',this.arrayPlanillas,this.arrayPlanillasSup,this.arrayPlanillasFis);
      
    }, 500);
  }
}
