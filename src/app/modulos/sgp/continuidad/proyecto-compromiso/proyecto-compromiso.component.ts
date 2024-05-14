import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Inputmask from "inputmask";
import { Globals } from "../../../../global";

/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import alasql from "alasql";
import { AutenticacionService } from "../../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../../seguridad/mensajes/mensajes.component";
import { AccesosRolComponent } from "../../accesos-rol/accesos-rol.component";
import { SgpService } from "../../sgp.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important
declare var $: any;
declare let L;

@Component({
  selector: "app-proyecto-compromiso",
  templateUrl: "./proyecto-compromiso.component.html",
  styleUrls: ["./proyecto-compromiso.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
    AccesosRolComponent,
  ],
})
export class ProyectoCompromisoComponent implements OnInit {
  public cargando = false;
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
  public s_usu_area: any;

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

  public pnl_listaproyecto = false;
  public pnl_georeferenciacion = false;
  public pnl_supervision = false;
  public pnl_ampliacionplazo = false;
  public dts_listaimagenes: any;

  //VARIABLES DEL COMPONENTE
  public dts_compromisos: any;
  public dts_compromisosPivote: any;
  public dts_compromisosdetalle: any;
  public pnl_cabecera = false;
  public pnl_cabeceradetalle = false;
  public pnl_formularioregistro = false;
  public pnl_formulariodetalle = false;

  public dts_ListaDepartamento = false;
  public dts_ListaMunicipio = false;
  public dts_ListaArea: any;
  public dts_listaEstadoCompromiso: any;
  public m_departamento: any;
  public m_municipio: any;
  public m_fuente: any;
  //public m_gestion:any;
  public m_area: any;
  public m_nombreproyecto: any;
  public m_montoBs: any;
  public m_montoSus: any;
  public m_estadoSolicitud: any;
  public m_contacto: any;
  public m_observacion: any;
  public m_idcompromiso: any;

  public m_remitente: any;
  public m_nrohojaderuta: any;
  public m_fechaingreso: any;
  public m_notadirigida: any;
  public m_beneficiario: any;
  public m_documentoIngreso: any;
  public m_adjuntos: any;
  public m_filtraEstadoCompromiso: any;
  public m_id: any;

  public btnRegistraCabecera = false;
  public btnEditaCabecera = false;
  public btnRegistraDetalle = false;
  public btnEditaDetalle = false;
  public pnlModalEliminaCabecera = false;
  public dtsEliminarCabecera = false;
  public pnlModalEliminaDetalle = false;
  public dtsEliminarDetalle = false;

  public vw_btnEditar = false;
  public vw_btnEliminar = false;
  public vw_btnNuevo = false;
  public dts_roles: any;
  public camposHabilitados: {};
  public dts_region: any;
  public dts_documentoPresentado: any;
  public m_accesoDepartamento: any;

  /******PARA CHECK LIST ****/
  public dts_lista: any;
  public dts_radius: any;
  public presentados: string[] = [];

  /***para grid manual***/
  public queryFiltro: string;
  public queryOrden: string;
  public pagina: number = 0;
  public dts_inicial: any[] = [];
  public dts_departamentos: any;
  public dts_municipios: any;
  public municipioSel: string;
  public departamentoSel: string;
  public listaFiltro: any[] = [];
  public dts_estados: any;
  public estadoSel: string;
  public multicriterioSel: string;
  public criticoSel: string;
  public dts_areas: any;
  public areaSel: string;
  public dts_provincias: any;
  public provinciaSel: string;

  public pnl_modalPriorizacion = false;
  public pnl_modalFormularioResumen = false;
  public pnl_monitoreo = false;

  public id_compromiso: any;
  public dts_registro: any;

  public dts_listaEstadoCompromisoPivote: any;
  public m_beneficiarioC: string;
  public m_estado_cabecera: string;
  dts_multicriterio: any;
  dts_critico: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,

    private _seguimiento: SgpService,
    private _accesos: AccesosRolComponent,

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
    this.dts_listaimagenes = [];

    $(".dt-compromisos").on("click", ".deleteMe", function () {
      var dataString = $(this).attr("data");

      alert(dataString);
    });
  }

  ngOnInit() {
    this.mask_numerodecimal = new Inputmask("9{1,20}.9{1,2}");
    this.mask_gestion = new Inputmask("9999");
    sessionStorage.clear();
    //this.obtenerConexion();

    this.listaArea();
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
      })
      .then((dts) => {
        return this.RolesAsignados(this.s_usu_id);
      })
      .then((dts) => {
        this.dts_roles_usuario = dts;
        this._accesos.accesosRestriccionesxRolV2(this.s_usu_id).then((data) => {
          this.camposHabilitados = data;
          console.log("Adm Roles===>", this.camposHabilitados);
          this.manejoRoles();
          this.GuardarLocalStorage();
          this.listaEstadoCompromiso();
        });
      })
      .catch(falloCallback);
  }

  obtenerConexion() {
    this.dtsDatosConexion = JSON.parse(localStorage.getItem("dts_con"));
    this.dts_roles_usuario = JSON.parse(localStorage.getItem("dts_rol"));
    this.s_idrol = this.dtsDatosConexion.s_idrol;
    this.s_user = this.dtsDatosConexion.s_idrol;
    this.s_nomuser = this.dtsDatosConexion.s_nomuser;
    this.s_usu_id = this.dtsDatosConexion.s_usu_id;
    this.s_usu_id_sipta = this.dtsDatosConexion.s_usu_id_sipta;
    this.s_usu_id_sispre = this.dtsDatosConexion.s_usu_id_sispre;
    this.s_ci_user = this.dtsDatosConexion.s_ci_user;
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
                this.s_usu_area = result[0]["_usu_area"];
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
  FechaLiteral(f) {
    return this._fun.FechaLiteral(f);
  }
  GuardarLocalStorage() {
    let dts_con = {
      s_idrol: this.s_idrol,
      s_user: this.s_user,
      s_nomuser: this.s_nomuser,
      s_usu_id: this.s_usu_id,
      s_usu_id_sipta: this.s_usu_id_sipta,
      s_usu_id_sispre: this.s_usu_id_sispre,
      s_ci_user: this.s_ci_user,
      s_usu_area: this.s_usu_area,
    };
    let dts_rol = this.dts_roles_usuario;

    localStorage.setItem("dts_con", JSON.stringify(dts_con));
    localStorage.setItem("dts_rol", JSON.stringify(dts_rol));
  }
  obtenerAccesoxDpto(lineas, datos) {
    return new Promise((resolve, reject) => {
      var accesoDepartamento = "";
      console.log("roles asignados", datos);
      for (var i = 0; i < lineas; i++) {
        var rol = datos[i].idrol;
        var detalle_rol = datos[i].detalle_rol;
        if (
          rol == 26 ||
          rol == 30 ||
          rol == 31 ||
          rol == 32 ||
          rol == 33 ||
          rol == 34 ||
          rol == 35 ||
          rol == 36 ||
          rol == 37 ||
          rol == 38 ||
          rol == 39 ||
          rol == 40 ||
          rol == 41 ||
          rol == 52 ||
          rol == 53 ||
          rol == 54 ||
          rol == 55 ||
          rol == 56 ||
          rol == 57 ||
          rol == 63 ||
          rol == 64 ||
          rol == 65 ||
          rol == 66 ||
          rol == 67 ||
          rol == 68 ||
          rol == 69 ||
          rol == 77 ||
          rol == 78 ||
          rol == 79 ||
          rol == 80 ||
          rol == 81 ||
          rol == 82 ||
          rol == 83 ||
          rol == 84 ||
          rol == 85
        ) {
          if (accesoDepartamento == "") {
            accesoDepartamento = detalle_rol;
          } else {
            accesoDepartamento = accesoDepartamento + "," + detalle_rol;
          }
        }
      }
      if (accesoDepartamento != "") {
        accesoDepartamento = "(" + accesoDepartamento + ")";
      }

      resolve(accesoDepartamento);
    });
  }
  manejoRoles() {
    this.m_accesoDepartamento = "";
    this.obtenerAccesoxDpto(
      this.dts_roles_usuario.length,
      this.dts_roles_usuario
    ).then((dts) => {
      this.m_accesoDepartamento = dts;
      console.log("depa", this.m_accesoDepartamento);
      this.dts_region = this.m_accesoDepartamento;
      console.log("REGIONES====>>", this.dts_region);
      console.log("ROLLLLLL", this.dts_roles_usuario);
      console.log("accesoDepa", this.m_accesoDepartamento);
    });

    // if(this.dts_roles_usuario.length>0 ){
    // this.dts_region = alasql(`SELECT detalle_rol
    // FROM ? where idmodulo=10` , [ this.dts_roles_usuario]);
    //}

    var lineas = this.dts_roles_usuario.length;
    var datos = this.dts_roles_usuario;
    for (var i = 0; i < lineas; i++) {
      var rol = datos[i].idrol;
      if (rol == 61) {
        // rol 61 adminitrador Solicitud de Proyectos
        this.vw_btnEditar = true;
        this.vw_btnEliminar = true;
        this.vw_btnNuevo = true;
      }
      if (rol == 62) {
        // rol 62 Usuario Solicitud de Proyectos
        this.vw_btnEditar = true;
        this.vw_btnEliminar = false;
        this.vw_btnNuevo = false;
      }
    }
  }
  paneles(string, dts?) {
    console.log("ENTRA PANELES ==>", string);
    if (string == "VER_CABECERA") {
      this.lista_compromisos();
      this.pnl_cabecera = true;
      $("#pnl_cabecera").show();
      this.pnl_cabeceradetalle = false;
      this.pnl_formularioregistro = false;
      this.pnl_formulariodetalle = false;
    }
    if (string == "VOLVER_CABECERA") {
      if (this.pnl_cabecera == false) {
        this.paneles("VER_CABECERA");
      } else {
        this.pnl_cabecera = true;
        $("#pnl_cabecera").show();
        this.pnl_cabeceradetalle = false;
        this.pnl_formularioregistro = false;
        this.pnl_formulariodetalle = false;
        this.pnl_monitoreo = false;
      }
      console.log("com2", this.dts_compromisos);
    }
    if (string == "VER_DETALLE") {
      console.log("datos_detalle", dts);
      console.log("com", this.dts_compromisos);
      // this.listaArea();
      this.m_area = dts.area;
      this.m_nombreproyecto = dts.nombreproyecto;
      this.lista_compromisos_detalle(dts.id_compromiso);
      this.m_idcompromiso = dts.id_compromiso;
      this.m_estado_cabecera = dts.estado_compromiso;
      //this.pnl_cabecera = false;
      $("#pnl_cabecera").hide();
      this.pnl_cabeceradetalle = true;
      this.pnl_formularioregistro = false;
      this.pnl_formulariodetalle = false;
    }
    if (string == "VOLVER_DETALLE") {
      this.lista_compromisos_detalle(this.m_idcompromiso);
      $("#pnl_cabecera").hide();
      //this.pnl_cabecera = false;
      this.pnl_cabeceradetalle = true;
      this.pnl_formularioregistro = false;
      this.pnl_formulariodetalle = false;
    }
    if (string == "NUEVO_REGISTRO") {
      this.buscarDepartamento();

      this.pnl_cabecera = false;
      this.pnl_cabeceradetalle = false;
      this.pnl_formularioregistro = true;
      this.pnl_formulariodetalle = false;
      setTimeout(() => {
        this.cargarmascaras();
      }, 300);
      // this.listaArea();
      this.btnRegistraCabecera = true;
      this.btnEditaCabecera = false;
      this.btnRegistraDetalle = false;
      this.btnEditaDetalle = false;

      this.m_fuente = "";
      this.m_gestion = "";
      this.m_area = "";
      this.m_nombreproyecto = "";
      this.m_montoBs = "";
      this.m_montoSus = "";
      this.m_estadoSolicitud = "";
      this.m_observacion = "";
      this.m_contacto = "";
      //if(this.camposHabilitados['_solicitud_administrador']==true){
      this.dts_listaEstadoCompromiso =
        this.dts_listaEstadoCompromisoPivote.filter(
          (item) =>
            item.descripciondetalleclasificador != "COMPROMISO PRESIDENCIAL" &&
            item.descripciondetalleclasificador != "COMPROMISO DESESTIMADO"
        );
      //}
    }
    if (string == "EDITA_REGISTRO") {
      console.time("editar");
      this.lista_compromisos_detalle(dts.id_compromiso);
      this.dts_listaEstadoCompromiso = this.dts_listaEstadoCompromisoPivote;
      this.buscarDepartamento();
      // // this.listaArea();
      this.buscarMunicipio(dts.cod_departamento);
      // this.cargarmascaras();

      //this.pnl_cabecera = false;
      console.log(
        "editando cabecera",
        dts.area,
        this.m_area,
        this.m_departamento,
        dts
      );

      setTimeout(() => {
        this.cargarmascaras();
      }, 300);
      // setTimeout(() => {
      this.m_area = dts.area;
      this.m_departamento = dts.cod_departamento;
      this.m_municipio = dts.cod_municipio;
      this.m_idcompromiso = dts.id_compromiso;
      this.m_fuente = dts.fuente;
      this.m_gestion = dts.gestion;
      this.m_nombreproyecto = dts.nombreproyecto;
      this.m_montoBs = dts.monto_bs;
      this.m_montoSus = dts.monto_sus;
      this.m_estadoSolicitud = dts.estado_compromiso;
      this.m_observacion = dts.observacion;
      this.m_contacto = dts.contacto;
      this.m_beneficiarioC = dts.beneficiario;
      console.log(
        "editando cabecera",
        dts.area,
        this.m_area,
        this.m_departamento,
        dts.beneficiario,
        this.dts_ListaArea.filter((f) => f.descripcion == this.m_area)
      );
      // }, 50);

      this.btnRegistraCabecera = false;
      this.btnEditaCabecera = true;
      this.btnRegistraDetalle = false;
      this.btnEditaDetalle = false;

      if (this.m_estadoSolicitud != "COMPROMISO PRESIDENCIAL") {
        //if(this.camposHabilitados['_solicitud_administrador']==true){
        this.dts_listaEstadoCompromiso =
          this.dts_listaEstadoCompromisoPivote.filter(
            (item) =>
              item.descripciondetalleclasificador !=
                "COMPROMISO PRESIDENCIAL" &&
              item.descripciondetalleclasificador != "COMPROMISO DESESTIMADO"
          );
        //}
      }

      $("#pnl_cabecera").hide();
      this.pnl_cabeceradetalle = false;
      this.pnl_formularioregistro = true;
      this.pnl_formulariodetalle = false;

      console.timeEnd("editar");
    }
    if (string == "NUEVO_DETALLE") {
      //this.pnl_cabecera = false;
      $("#pnl_cabecera").hide();
      this.pnl_cabeceradetalle = false;
      this.pnl_formularioregistro = false;
      this.pnl_formulariodetalle = true;
      this.btnRegistraCabecera = false;
      this.btnEditaCabecera = false;
      this.btnRegistraDetalle = true;
      this.btnEditaDetalle = false;

      this.m_remitente = "";
      this.m_nrohojaderuta = "";
      this.m_fechaingreso = "";
      this.m_notadirigida = "";
      this.m_beneficiario = "";
      this.m_documentoIngreso = "";
      this.m_adjuntos = "";

      this.presentados = [];
      this.cargarLista();
      this.cargaTipoDocumentoPresentado();
    }
    if (string == "EDITA_DETALLE") {
      //this.pnl_cabecera = false;
      $("#pnl_cabecera").hide();
      this.pnl_cabeceradetalle = false;
      this.pnl_formularioregistro = false;
      this.pnl_formulariodetalle = true;

      this.m_id = dts.id;
      this.m_idcompromiso = dts.fid_compromiso;
      this.m_remitente = dts.remitente;
      this.m_nrohojaderuta = dts.nro_hojaruta;
      this.m_fechaingreso = dts.fecha_ingreso;
      this.m_notadirigida = dts.nota_dirigida;
      this.m_beneficiario = dts.beneficiario;
      this.m_documentoIngreso = dts.documento_ingreso;
      this.m_adjuntos = dts.adjuntos;

      this.btnRegistraCabecera = false;
      this.btnEditaCabecera = false;
      this.btnRegistraDetalle = false;
      this.btnEditaDetalle = true;

      this.presentados = [];
      console.log("al editar detalle", dts);

      if (dts.presentado)
        this.presentados = this.presentados.concat(dts.presentado.split(","));
      this.cargarLista();
      this.cargaTipoDocumentoPresentado();
    }
    if (string == "ELIMINA_CABECERA") {
      this.pnlModalEliminaCabecera = true;
      this.dtsEliminarCabecera = dts;
    }
    if (string == "ELIMINA_DETALLE") {
      console.log("entra", dts);
      this.pnlModalEliminaDetalle = true;
      this.dtsEliminarDetalle = dts.id;
      console.log("aaa", this.dtsEliminarDetalle);
    }
    if (string == "PRIORIZAR") {
      this.pnl_modalPriorizacion = !this.pnl_modalPriorizacion;
      this.id_compromiso = dts;
      setTimeout(() => {
        $("#modalPriorizar").modal("show");
      }, 60);
    }
    if (string == "CIERRA_MODAL_PRIORIZACION") {
      console.log("ENTRA AQUI=====>");

      //this.id_compromiso=dts;
      setTimeout(() => {
        $("#modalPriorizar").modal("hide");
        this.pnl_modalPriorizacion = !this.pnl_modalPriorizacion;
      }, 60);
    }
    if (string == "CIERRA_MODAL_FORMULARIO_RESUMEN") {
      console.log("ENTRA AQUI=====>");

      //this.id_compromiso=dts;
      setTimeout(() => {
        $("#modalFormularioResumen").modal("hide");
        this.pnl_modalFormularioResumen = !this.pnl_modalFormularioResumen;
      }, 60);
    }
    if (string == "FORMULARIO_RESUMEN") {
      this.pnl_modalFormularioResumen = !this.pnl_modalFormularioResumen;
      this.dts_registro = dts;
      setTimeout(() => {
        $("#modalFormularioResumen").modal("show");
      }, 60);
    }
    if (string == "REGISTRO_MONITOREO") {
      this.pnl_monitoreo = !this.pnl_monitoreo;
      $("#pnl_cabecera").hide();
      console.log(this.pnl_monitoreo);
      this.dts_registro = dts;
    }
  }
  lista_compromisos() {
    this.dts_compromisos = [];
    this.dts_compromisosPivote = "";
    console.log("LISTA COMPROMISOS", this.dts_compromisosPivote);

    this._seguimiento.listaCompromisos().subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          //this.dts_compromisos = result;
          this.dts_compromisosPivote = result;
          console.log("LISTA COMPROMISOS", this.dts_compromisosPivote);
          console.log("ACCESO DEPARTAMENTO", this.m_accesoDepartamento);

          this.dts_compromisos = alasql(
            `SELECT * 
                  FROM ? where cod_departamento in ${this.m_accesoDepartamento}`,
            [this.dts_compromisosPivote]
          );

          console.log("iniiiii", this.dts_compromisos);

          this.dts_inicial = this.dts_compromisos;

          this.dts_departamentos = alasql(
            `select distinct departamento from ? order by 1`,
            [this.dts_inicial]
          );
          this.dts_provincias = alasql(
            `select distinct provincia from ? order by 1`,
            [this.dts_inicial]
          );
          this.dts_municipios = alasql(
            `select distinct municipio from ? order by 1`,
            [this.dts_inicial]
          );
          this.dts_estados = alasql(
            `select distinct estado_compromiso from ? order by 1`,
            [this.dts_inicial]
          );
          this.dts_multicriterio = alasql(
            `select distinct multicriterio from ? order by 1`,
            [this.dts_inicial]
          );
          this.dts_critico = alasql(
            `select distinct critico from ? order by 1`,
            [this.dts_inicial]
          );
          this.dts_areas = alasql(`select distinct area from ? order by 1`, [
            this.dts_inicial,
          ]);

          // this.conf_tablacompromisos();
          //limpiando textos y combos de filtros grilla
          const cajas = document.querySelectorAll("td input[type=text]");
          cajas.forEach((el: HTMLFormElement) => {
            el.value = "";
          });
          this.departamentoSel = undefined;
          this.provinciaSel = undefined;
          this.municipioSel = undefined;
          this.areaSel = undefined;
          this.estadoSel = undefined;
          this.multicriterioSel = undefined;
          this.criticoSel = undefined;
          this.queryFiltro = "";
          this.listaFiltro = [];
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
  filtraListaCompromiso(dato) {
    this.dts_compromisos = this.dts_compromisosPivote.filter(
      (item) => item.estado_compromiso === dato
    );
    console.log(
      "dtsFiltrado",
      this.dts_compromisos,
      this.m_filtraEstadoCompromiso,
      dato
    );
  }
  conf_tablacompromisos() {
    this._fun.limpiatabla(".dt-compromisos");
    setTimeout(() => {
      let confiTable = this._fun.CONFIGURACION_TABLA_V5(
        [50, 100, 150, 200],
        false,
        20,
        [
          [1, "desc"],
          [3, "desc"],
          [4, "asc"],
          [5, "asc"],
          [6, "asc"],
        ]
      );
      var table = $(".dt-compromisos").DataTable(confiTable);
      this._fun.selectTable(table, [2, 4, 5, 8]);
      this._fun.inputTable(table, [1, 3, 6, 7, 10, 11, 12, 13, 14]);
      this.cargando = false;
    }, 5);
  }
  lista_compromisos_detalle(id_compromiso) {
    this.dts_compromisosdetalle = [];
    console.log("idcompromiso", id_compromiso);
    this._seguimiento.listaCompromisosDetalle(id_compromiso).subscribe(
      (result: any) => {
        console.log("resultado", result);
        if (Array.isArray(result) && result.length > 0) {
          this.dts_compromisosdetalle = result;
          this._fun.limpiatabla(".dt-compromisos_detalle");
          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V5(
              [50, 100, 150, 200],
              false,
              20,
              [[3, "desc"]]
            );
            var table = $(".dt-compromisos_detalle").DataTable(confiTable);
            this._fun.inputTable(table, [1, 2, 3, 4, 5, 6, 7]);
            this.cargando = false;
          }, 5);
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
  listaEstadoCompromiso() {
    this._seguimiento.listaEstadoCompromiso().subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_listaEstadoCompromisoPivote = result;
          this.dts_listaEstadoCompromiso = this.dts_listaEstadoCompromisoPivote;
          this.paneles("VER_CABECERA");

          console.log("listaEstadoCompromiso", this.dts_listaEstadoCompromiso);
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

  cargarmascaras() {
    var montoBs = document.getElementById("m_montoBs");
    this.mask_numerodecimal.mask(montoBs);
    var m_montoSus = document.getElementById("m_montoSus");
    this.mask_numerodecimal.mask(m_montoSus);
    var m_gestion = document.getElementById("m_gestion");
    this.mask_gestion.mask(m_gestion);
  }
  buscarDepartamento() {
    this._seguimiento.getBuscarDepartamento().subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_ListaDepartamento = this._fun.RemplazaNullArray(result);

          this.dts_ListaDepartamento = alasql(
            `SELECT * 
          FROM ? where codigo_departamento in ${this.m_accesoDepartamento}`,
            [this.dts_ListaDepartamento]
          );
        } else {
          this.prop_msg = "Alerta: No existen registros de la busqueda 1";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la petición BUSQUEDA");
        }
      }
    );
  }
  buscarMunicipio(cod_dep: any) {
    console.log("departamento", cod_dep);

    this._seguimiento.getBuscarMunicipio(cod_dep).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_ListaMunicipio = this._fun.RemplazaNullArray(result);
        } else {
          this.prop_msg = "Alerta: No existen registros de la busqueda 2";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la petición BUSQUEDA");
        }
      }
    );
  }
  listaArea() {
    this._seguimiento.listaArea().subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_ListaArea = this._fun.RemplazaNullArray(result);
        } else {
          this.prop_msg = "Alerta: No existen registros de la busqueda 3";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la petición BUSQUEDA");
        }
      }
    );
  }
  InsertaCabecera() {
    var datos = {
      cod_departamento: this.m_departamento,
      cod_provincia: this.m_municipio.substr(0, 4),
      cod_municipio: this.m_municipio,
      fuente: this.m_fuente,
      gestion: this.m_gestion,
      area: this.m_area,
      proyecto: this.m_nombreproyecto.toUpperCase(),
      montoBs: parseFloat(this.m_montoBs).toFixed(2),
      montoSus: parseFloat(this.m_montoSus).toFixed(2),
      estadoSolicitud: this.m_estadoSolicitud,
      observacion: this.m_observacion.toUpperCase(),
      usr_registro: this.s_usu_id,
      contacto: (this.m_contacto || "").toUpperCase(),
      beneficiario: (this.m_beneficiarioC || "").toUpperCase(),
    };

    this._seguimiento.insertaCabeceraCompromiso(datos).subscribe(
      (result: any) => {
        console.log("dts", result);
        if (Array.isArray(result) && result.length > 0) {
          this.paneles("NUEVO_DETALLE");
          this.m_idcompromiso = result[0]["_idcompromiso"];
          console.log(this.m_idcompromiso);
        } else {
          this.prop_msg = "Alerta: No existen registros";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      }
    );
  }
  InsertaDetalle() {
    let confirmados = [];
    let checks = document.querySelectorAll("input:checked").forEach((v) => {
      confirmados.push(v.getAttribute("id"));
    });
    console.log(confirmados);
    var datos = {
      fid_compromiso: this.m_idcompromiso,
      remitente: (this.m_remitente || "").toUpperCase(),
      hojaderuta: (this.m_nrohojaderuta || "").toUpperCase(),
      fecha_ingreso: this.m_fechaingreso,
      nota_dirigida: (this.m_notadirigida || "").toUpperCase(),
      beneficiario: (this.m_beneficiario || "").toUpperCase(),
      documento: (this.m_documentoIngreso || "").toUpperCase(),
      adjuntos: (this.m_adjuntos || "").toUpperCase(),
      usr_registro: this.s_usu_id,
      presentado: confirmados,
    };

    this._seguimiento.insertaDetalleCompromiso(datos).subscribe(
      (result: any) => {
        console.log("dts_detalle", result);
        if (Array.isArray(result) && result.length > 0) {
          this.paneles("VOLVER_DETALLE");
        } else {
          this.prop_msg = "Alerta: No existen registros";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      }
    );
  }
  eliminaCompromiso(id_compromiso) {
    this._seguimiento.eliminaCompromiso(id_compromiso).subscribe(
      (result: any) => {
        console.log("dts_detalle", result);
        if (Array.isArray(result) && result.length > 0) {
          this.paneles("VER_CABECERA");
          this.pnlModalEliminaCabecera = false;
          $("#modalEliminaCabecera").modal("hide");
        } else {
          this.prop_msg = "Alerta: No existen registros";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      }
    );
  }
  EditaCabecera() {
    var datos = {
      id_compromiso: this.m_idcompromiso,
      cod_departamento: this.m_departamento,
      cod_provincia: this.m_municipio.substr(0, 4),
      cod_municipio: this.m_municipio,
      fuente: this.m_fuente,
      gestion: this.m_gestion,
      area: this.m_area,
      proyecto: this.m_nombreproyecto.toUpperCase(),
      montoBs: this._fun.valorNumericoDecimal(this.m_montoBs),
      montoSus: this._fun.valorNumericoDecimal(this.m_montoSus),
      estadoSolicitud: this.m_estadoSolicitud,
      observacion: this.m_observacion.toUpperCase(),
      usr_registro: this.s_usu_id,
      contacto: (this.m_contacto || "").toUpperCase(),
      beneficiario: (this.m_beneficiarioC || "").toUpperCase(),
    };

    this._seguimiento.editaCabeceraCompromiso(datos).subscribe(
      (result: any) => {
        console.log("dts_edita", result);
        if (Array.isArray(result) && result.length > 0) {
          this.paneles("VER_CABECERA");
        } else {
          this.prop_msg = "Alerta: No existen registros";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      }
    );
  }
  eliminaDetalle(id) {
    this._seguimiento.eliminaDetalle(id).subscribe(
      (result: any) => {
        console.log("dts_detalle", result);
        if (Array.isArray(result) && result.length > 0) {
          this.paneles("VOLVER_DETALLE");
          this.pnlModalEliminaDetalle = false;
          $("#modalEliminaDetalle").modal("hide");
        } else {
          this.prop_msg = "Alerta: No existen registros";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      }
    );
  }
  EditaDetalle() {
    let confirmados = [];
    let checks = document.querySelectorAll("input:checked").forEach((v) => {
      confirmados.push(v.getAttribute("id"));
    });
    console.log({ confirmados });
    var datos = {
      id: this.m_id,
      fid_compromiso: this.m_idcompromiso,
      remitente: (this.m_remitente || "").toUpperCase(),
      hojaderuta: (this.m_nrohojaderuta || "").toUpperCase(),
      fecha_ingreso: this.m_fechaingreso,
      nota_dirigida: (this.m_notadirigida || "").toUpperCase(),
      beneficiario: (this.m_beneficiario || "").toUpperCase(),
      documento: (this.m_documentoIngreso || "").toUpperCase(),
      adjuntos: (this.m_adjuntos || "").toUpperCase(),
      usr_registro: this.s_usu_id,
      presentado: confirmados,
    };

    this._seguimiento.editaDetalleCompromiso(datos).subscribe(
      (result: any) => {
        console.log("dts_edita", result);
        if (Array.isArray(result) && result.length > 0) {
          this.paneles("VOLVER_DETALLE");
        } else {
          this.prop_msg = "Alerta: No existen registros";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      }
    );
  }
  setMontoSus() {
    let a: number;

    this.m_montoBs == "" ? "0" : this.m_montoBs;

    a = parseFloat(this.m_montoBs) / 6.96;
    this.m_montoSus = a.toFixed(2);
  }

  /*****para check list */
  cargarLista() {
    this.dts_lista = null;
    this.cargando = true;
    this._seguimiento.listaClasificador(35).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_lista = this._fun.RemplazaNullArray(result);
          console.log(
            "checks",
            this.dts_lista,
            this.m_area,
            this.dts_ListaArea
          );
          const idArea = this.dts_ListaArea.filter(
            (f) => f.descripcion === this.m_area
          )[0].id;
          this.dts_lista = this.dts_lista.filter((f) =>
            f.agrupa_clasificador.includes(`-${idArea}-`)
          );
          this.dts_lista.sort(
            (a, b) =>
              Number(a.codigodetalleclasificador) -
              Number(b.codigodetalleclasificador)
          );

          this.dts_radius = result.filter((f) =>
            f.agrupa_clasificador.startsWith("-00")
          );
          this.dts_radius.sort(
            (a, b) =>
              Number(a.codigodetalleclasificador) -
              Number(b.codigodetalleclasificador)
          );
          console.log("radius", this.dts_radius);

          // this.dts_radius.push({id_detalle:0,descripciondetalleclasificador : 'Ninguno'});
          // this.dts_lista2 = this.dts_lista;
          // this.dts_lista.forEach(e => {
          //   $('#c'+e.id_detalle).prop("checked", false);
          // });
          setTimeout(() => {
            if (this.presentados)
              this.presentados.forEach((element) => {
                $("#" + element).prop("checked", true);
              });
          }, 200);
        } else {
          this._msg.formateoMensaje(
            "modal_danger",
            "Alerta: No existen clasificadores para documentos presentados",
            10
          );
        }
        this.cargando = false;
      },
      (error) => {
        this.cargando = false;
        this.errorMessage = <any>error;
        if (this.errorMessage != null)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage,
            10
          );
      }
    );
  }

  reportes(tipo: string, id: number) {
    this.cargando = true;
    console.log("generando reporte");
    const miDTS = { tipoReporte: tipo, idCompromiso: id };
    let nombreReporte = "";
    tipo = "01"
      ? (nombreReporte = `Compromiso${id}.pdf`)
      : (nombreReporte = `CompromisoProyecto${id}.pdf`);

    this._seguimiento.reportesSolicitud(miDTS).subscribe(
      (result: any) => {
        //
        console.log(result);
        const url = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", nombreReporte);
        //document.body.appendChild(link);
        link.click();

        // document.body.removeChild(link);
        // URL.revokeObjectURL(url);
        this.cargando = false;
      },
      (error) => {
        this.cargando = false;
        this.errorMessage = <any>error;
        if (this.errorMessage != null)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage,
            10
          );
      }
    );
  }
  reportegeneral(tipo: string) {
    this.cargando = true;
    const miDTS = { tipoReporte: tipo };
    let nombreReporte = "";
    if ((tipo = "03")) {
      nombreReporte = `SolicitudProyectos.xlsx`;
    }

    this._seguimiento.reportesSolicitudGeneral(miDTS).subscribe(
      (result: any) => {
        //
        console.log(result);
        const url = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", nombreReporte);
        //document.body.appendChild(link);
        link.click();

        // document.body.removeChild(link);
        // URL.revokeObjectURL(url);
        this.cargando = false;
      },
      (error) => {
        this.cargando = false;
        this.errorMessage = <any>error;
        if (this.errorMessage != null)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage,
            10
          );
      }
    );
  }
  cargaTipoDocumentoPresentado() {
    this.cargando = true;
    this._seguimiento.listaClasificador(40).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_documentoPresentado = this._fun.RemplazaNullArray(result);
        } else {
          this._msg.formateoMensaje(
            "modal_danger",
            "Alerta: No existen documentos",
            10
          );
        }
        this.cargando = false;
      },
      (error) => {
        this.cargando = false;
        this.errorMessage = <any>error;
        if (this.errorMessage != null)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage,
            10
          );
        this.cargando = false;
      }
    );
  }

  filtrar2(campo, valor) {
    if (valor === null) return true;

    if (!this.queryFiltro) this.queryFiltro = "select * from ? where";

    this.queryFiltro = "select * from ? where ";
    if (this.listaFiltro.filter((f) => f.campo === campo).length === 0)
      this.listaFiltro.push({ campo, valor });
    // if(this.listaFiltro.filter(f=>f.campo === campo).length===0 && valor2==-1) this.listaFiltro.push({ campo, valor:`,${valor}`,tipo,valor2 })
    console.log("filtrando", this.listaFiltro);
    this.listaFiltro.map((e) => {
      if (e.campo === campo) {
        e.valor = valor;
      }
      // if (e.campo === campo && valor2==-1) {
      //   e.valor = e.valor +`,${valor}`;
      // }
      // if (e.campo === campo && valor2==-1 && valor=='') {
      //   e.valor = '';
      //   if(campo === 'mae') this.pm = [];
      //   if(campo === 'area') this.area = [];
      //   if(campo === 'estado_compromiso') this.tipoSolicitud = [];
      //   if(campo === 'estado_aprobado') this.tipoAprobado = [];
      // }
      if (
        e.campo === "municipio" &&
        (campo === "departamento" || campo === "provincia")
      ) {
        this.municipioSel = "";
        e.valor = "";
      }
      if (e.campo === "provincia" && campo === "departamento") {
        this.provinciaSel = "";
        e.valor = "";
      }

      if (e.valor)
        this.queryFiltro = this.queryFiltro.concat(
          ` and ${e.campo}::text like '%${e.valor}%'`
        );
      // if ((e.valor!=0 || e.valor2!=100) && e.tipo == 2) this.queryFiltro = this.queryFiltro.concat(` and ${e.campo} between ${e.valor} and ${e.valor2}`);
      // if (e.valor && e.tipo == 1 && e.valor2 == -1) this.queryFiltro = this.queryFiltro.concat(` and ${e.campo}::text in(${e.valor})`);
      // if (e.valor && e.tipo == 1 && e.valor2 == 3) this.queryFiltro = this.queryFiltro.concat(` and ${e.campo}::text ='${e.valor}'`);
      return e;
    });

    console.log("antes de nada", this.queryFiltro);

    this.queryFiltro = this.queryFiltro
      .replace(/,/g, `','`)
      .replace(/\(/g, `('`)
      .replace(/\)/g, `')`);
    this.queryFiltro = this.queryFiltro
      .replace("  ", " ")
      .replace("where and", "where ");
    if (this.queryFiltro === "select * from ? where ")
      this.queryFiltro = "select * from ?";
    console.log("dos", this.queryFiltro, this.listaFiltro, campo, valor);
    this.dts_compromisos = alasql(this.queryFiltro, [this.dts_inicial]);

    this.pagina = 0;
    $("#anterior").prop("disabled", true);
    if (this.dts_compromisos.length <= 20)
      $("#siguiente").prop("disabled", true);
    if (this.dts_compromisos.length > 20)
      $("#siguiente").prop("disabled", false);
    //reorganizando los combos municipio y provincia
    // if (this.departamentoSel) {
    //   const filtrado = this.dts_inicial.filter(f => f.departamento === this.departamentoSel);
    //   this.dts_municipios = alasql(`select distinct municipio from ? order by municipio`, [filtrado]);
    //   this.dts_municipios.unshift({ municipio: '' });
    // }

    //recargando los filtros dts
    if (campo !== "departamento" || !valor)
      this.dts_departamentos = alasql(
        `select distinct departamento from ? order by 1`,
        [this.dts_compromisos]
      );
    if (campo !== "provincia" || !valor)
      this.dts_provincias = alasql(
        `select distinct provincia from ? order by 1`,
        [this.dts_compromisos]
      );
    if (campo !== "municipio" || !valor)
      this.dts_municipios = alasql(
        `select distinct municipio from ? order by 1`,
        [this.dts_compromisos]
      );
    if (campo !== "estado_compromiso" || !valor)
      this.dts_estados = alasql(
        `select distinct estado_compromiso from ? order by 1`,
        [this.dts_compromisos]
      );
    if (campo !== "multicriterio_upre" || !valor)
      this.dts_multicriterio = alasql(
        `select distinct multicriterio from ? order by 1`,
        [this.dts_compromisos]
      );
    if (campo !== "critico" || !valor)
      this.dts_critico = alasql(`select distinct critico from ? order by 1`, [
        this.dts_compromisos,
      ]);
    if (campo !== "area" || !valor)
      this.dts_areas = alasql(`select distinct area from ? order by 1`, [
        this.dts_compromisos,
      ]);
    // this.dts_estados.unshift({ estado_compromiso: '' });
    // if (campo!='inversion_upre_convenio' && campo!='nro_proyectos' && campo != 'mae' && campo != 'area' && campo != 'estado_compromiso') this.cargaValoresFiltros();
    //  valor==''? this.cargaValoresFiltros('todos') : this.cargaValoresFiltros(campo);

    // if(!this.pm.includes(this.partidoSel)) this.pm.push(this.partidoSel);
    // if(!this.area.includes(this.areaSel)) this.area.push(this.areaSel);
    // if(!this.tipoSolicitud.includes(this.solicitudSel)) this.tipoSolicitud.push(this.solicitudSel);
    // if(!this.tipoAprobado.includes(this.estado_aprobadoSel)) this.tipoAprobado.push(this.estado_aprobadoSel);
    // if(!this.pm.includes(this.maeSel)) this.pm.push(this.maeSel);
    this.pagina = 0;
    $("#anterior").prop("disabled", true);
  }

  ordenar(campo) {
    let cambiarOrden = "";
    if (!this.queryOrden) this.queryOrden = "select * from ? order by ";
    if (this.queryOrden.includes(`${campo} asc`))
      cambiarOrden = this.queryOrden.replace(`${campo} asc`, `${campo} desc`);
    if (this.queryOrden.includes(`${campo} desc`))
      cambiarOrden = this.queryOrden.replace(`${campo} desc`, `${campo} asc`);
    if (!this.queryOrden.includes(`${campo}`))
      this.queryOrden = `select * from ? order by ${campo} asc`;

    if (cambiarOrden) this.queryOrden = cambiarOrden;

    this.queryOrden = this.queryOrden
      .replace("order by   ,", "order by ")
      .replace("order by  ,", "order by ")
      .replace("order by ,", "order by ");
    console.log(
      "ordenar",
      campo,
      this.queryOrden,
      this.queryOrden.includes(`${campo} asc`),
      !this.queryOrden.includes(`${campo}`)
    );
    // this.dts_seguimiento.sort((a,b)=>a[campo] - b[campo]);
    this.dts_compromisos = alasql(this.queryOrden, [this.dts_compromisos]);
    this.paginar(0);
  }

  paginar(valor: number) {
    this.pagina += valor;
    console.log("entra a paginar", valor, this.pagina);
    this.pagina <= 0
      ? $("#anterior").prop("disabled", true)
      : $("#anterior").prop("disabled", false);
    this.pagina >= Math.trunc(this.dts_compromisos.length / 20)
      ? $("#siguiente").prop("disabled", true)
      : $("#siguiente").prop("disabled", false);
  }
}
