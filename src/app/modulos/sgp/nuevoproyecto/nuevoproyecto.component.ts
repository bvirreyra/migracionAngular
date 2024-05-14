import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Inputmask from "inputmask";
import { Globals } from "../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import alasql from "alasql";
import { NgSelect2Module } from "ng-select2";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";
import { AccesosRolComponent } from "../accesos-rol/accesos-rol.component";
import { SgpService } from "../sgp.service";

import swal2 from "sweetalert2";
import { ToastrService } from "ngx-toastr";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-nuevoproyecto",
  templateUrl: "./nuevoproyecto.component.html",
  styleUrls: ["./nuevoproyecto.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
    NgSelect2Module,
    AccesosRolComponent,
  ],
})
export class NuevoproyectoComponent implements OnInit {
  // @ViewChild(BandejaTecnicaComponent) bandejaTecnica: BandejaTecnicaComponent;
  // @ViewChild(BandejaTecnicaComponent) bandejaFinanciero: BandejaTecnicaComponent;
  // @ViewChild(BandejaTecnicaComponent) bandejaLegal: BandejaTecnicaComponent;

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

  /*paneles*/

  public pnl_listaproyecto = false;
  public pnl_tecnica = false;
  public pnl_financiero = false;
  public pnl_legal = false;
  public pnl_alerta = false;
  public pnl_resumen = false;
  public pnl_nuevoproyecto = false;
  public pnl_datos_generales = false;
  public pnl_regiones = false;
  public btn_regiones = false;

  public dts_registro: any;

  public pnlFormularioRegistrar = false;
  public pnlGridView = false;
  public pnl_formulario2 = false;

  public pnl_reportes: boolean = false;
  public pnl_observacionproyecto = false;

  /*variables del componente*/

  public dts_seguimiento: any;
  public dts_estadoproyectos: any;
  public dts_estadosupervision: any;
  public dts_supervision: any;
  public dts_equipotecnico: any;
  public inputDts: any;
  public switch: any;

  public m_id_proyecto: any;
  public m_id_supervision: any;
  public m_nrosupervision: any;
  public m_estado_proyecto: any;
  public m_estado_proyecto_anterior: any;
  public m_descripcion_estado_proyecto: any;
  public m_descripcion_estado_proyecto_anterior: any;

  public m_estado_supervision: any;
  public m_estado_supervision_anterior: any;
  public m_descripcion_estado_supervision: any;
  public m_descripcion_estado_supervision_anterior: any;

  public m_fechainicio_planilla: any;
  public m_fechafin_planilla: any;

  public m_nombreproyecto: any;
  public m_descripcionproyecto: any;
  public m_tipoproyecto: any;
  public m_tipoconvenio: any;
  public m_tipoclasificador: any;

  public m_entidadbeneficiaria: any;
  public m_detallebeneficiario: any;
  public m_departamento: any;
  public m_departamento2: any;
  public m_provincia: any;
  public m_municipio: any;
  public m_nroconvenio: any;
  public m_fechaconvenio: any;
  public m_plazoconvenio: any;
  public m_montofinanciadoupre: any;
  public m_montocontrapartebeneficiario: any;
  public m_montocontrapartegobernacion: any;
  public m_montocontrapartemunicipio: any;
  public m_montototalconvenio: any;

  public m_idProyecto: any;
  public i_Codigo: any;
  public i_TipoDocumentoConvenio: any;
  public i_TipoDocumentoResolucion: any;
  public i_Vista: any;
  public i_NombreFileConvenio: any;
  public i_NombreFileResolucion: any;

  public dts_ListaDepartamento: any;
  public dts_ListaMunicipio: any;
  public dts_TipoProyecto: any;
  public dts_TipoConvenio: any;
  public dts_EntidadBeneficiaria: any;
  public dts_proyectoscontinuidad: any;
  public dts_compromisosPresidenciales: any;

  public m_semaforo_convenio = false;
  public m_semaforo_resolucion = false;

  public m_accesoDepartamento: any; //departamentos que tiene acceso

  public btn_nuevoProyecto = false; //departamentos que tiene acceso
  public btn_refrescar = false;
  public btn_refrescar_tarjetas = false;

  public dts_tecnicos: any;
  public tecnico: any;
  public elProyecto: any;
  public comboSeleccion: any;
  public dts_historial: any;
  public historial: boolean = false;
  public dts_registroTabla: any = {};

  public filaEditar: any = {};

  public dts_departamentos: any;
  public dts_provincias: any;
  public dts_municipios: any;
  public dep: string;
  public prov: string;
  public mun: string;
  public dts_inicial: any[] = [];
  public botonContinuidad: string = "Filtra Proyectos de Continuidad";

  // filtroGestion:string='';
  public campo: string;
  public valor: string;
  public dts_estados: any;
  public totalInicial: number = 0;
  public totalFiltrado: number = 0;
  public queryOrden: string = "";
  public queryFiltro: string = "";
  public listaFiltro: any[] = [];
  public pagina: number = 0;
  public estado: any;

  public filtraArea: any;
  public camposHabilitados: {};

  public m_proyectosolicitud: any = "";
  dts_permisos: any;
  vistaFinanciera: any;

  dtsCodigosETAS:any[]=[];

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
    private base64: ImgBase64Globals,
    private toastr: ToastrService,
  ) {
    this._route.parent.params.subscribe((parametros) => {
      this.s_idcon = parametros["idcon"];
      this.s_idmod = parametros["idmod"];
    });
    this.url = globals.rutaSrvFronEnd;
    this.s_imgLogo = base64.logocabecera;
    this.url_reporte = globals.rutaSrvReportes;
    this.dts_seguimiento = [];
  }

  ngOnInit() {
    sessionStorage.clear();
    this.i_Vista = "false";
    this.i_TipoDocumentoConvenio = "convenio";
    this.i_NombreFileConvenio = "[C] Convenio.pdf";
    this.i_TipoDocumentoResolucion = "resolucion_ministerial";
    this.i_NombreFileResolucion = "[RM] Resolución ministerial.pdf";

    function falloCallback(error) {
      console.log("Falló con " + error);
    }
    this.mask_numerodecimal = new Inputmask("9{1,9}.9{1,2}");
    this.mask_fecha = new Inputmask("9{1,2}-9{1,2}-9{1,4}");
    this.mask_numero = new Inputmask("9{1,9}");
    this.mask_gestion = new Inputmask("9999");
    //this.mask_cite = new Inputmask("[aaaa-a{2,4}-9{3}-9{4}]|[aaaa-a{2,4}-a{2}-9{3}-9{4}]");
    this.mask_cite = new Inputmask("[aaaa-a{2,4}-[9{3}-9{4}]|[a{2}-9{3}-9{4}]");

    this.listarCodigosETAS();
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
        return this._accesos.accesosRestriccionesxRolV2(this.s_usu_id);
      })
      .then((data) => {
        this.camposHabilitados = data;
        this.vistaFinanciera = data["_financiera"];
        console.log("Adm Roles===>", this.camposHabilitados);
        console.log("roles", this.dts_roles_usuario);
        this.paneles("VER_LISTAPROYECTOS");
        //this.paneles("VER_TARJETAS_REGIONES");
        this.GuardarLocalStorage();
        return this.listaProyectosContinuidad();
      })
      .then((data) => {
        this.dts_proyectoscontinuidad = data;
        console.log("proyectos de continuidad", this.dts_proyectoscontinuidad);
      })
      .catch(falloCallback);
  }

  /*******************************************************************************/
  /*MASCARAS
  /*******************************************************************************/
  cargarmascaras() {
    var convenio = document.getElementById("m_nroconvenio");
    this.mask_cite.mask(convenio);

    var fecha_convenio = document.getElementById("m_fechaconvenio");
    this.mask_fecha.mask(fecha_convenio);

    var monto_financiadoupre = document.getElementById("m_montofinanciadoupre");
    this.mask_numerodecimal.mask(monto_financiadoupre);
    var m_montocontraparteb = document.getElementById(
      "m_montocontrapartebeneficiario"
    );
    this.mask_numerodecimal.mask(m_montocontraparteb);
    var m_montocontraparteg = document.getElementById(
      "m_montocontrapartegobernacion"
    );
    this.mask_numerodecimal.mask(m_montocontraparteg);
    var m_montocontrapartem = document.getElementById(
      "m_montocontrapartemunicipio"
    );
    this.mask_numerodecimal.mask(m_montocontrapartem);
    // var m_montototalconvenio = document.getElementById("m_montototalconvenio");
    // this.mask_numerodecimal.mask(m_montototalconvenio);
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
  manejoRoles() {
    this.m_accesoDepartamento = "";
    this.obtenerAccesoxDpto(
      this.dts_roles_usuario.length,
      this.dts_roles_usuario
    ).then((dts) => {
      this.m_accesoDepartamento = dts;
      console.log("depa", this.m_accesoDepartamento);
      if (this.m_accesoDepartamento != "") {
        if (
          this.m_accesoDepartamento ==
          "('01','02','03','04','05','06','07','08','09')"
        ) {
          this.paneles("VER_TARJETAS_REGIONES");
        } else {
          this.listaProyectosxRegion();
          this.btn_refrescar_tarjetas = false;
          this.btn_refrescar = true;
        }
        //this.accesosRestriccionesxRol(this.dts_roles_usuario);
      } else {
        this.accesosRestriccionesxRol(this.dts_roles_usuario);
        this.btn_refrescar_tarjetas = false;
        this.btn_refrescar = true;
      }
    });
  }
  accesoPorTarjetaRegion(region) {
    this.btn_refrescar_tarjetas = true;
    this.btn_refrescar = false;
    if (region == "OCCIDENTE") {
      this.m_accesoDepartamento = `('02','04','05')`;
    }
    if (region == "CENTRO") {
      this.m_accesoDepartamento = `('01','03','06')`;
    }
    if (region == "ORIENTE") {
      this.m_accesoDepartamento = `('07','08','09')`;
    }
    if (region == "NACIONAL") {
      this.m_accesoDepartamento = `('01','02','03','04','05','06','07','08','09')`;
    }

    this.pnl_regiones = false;
    $("#pnl_listaproyecto").show();
    this.listaProyectosxRegion();
  }

  obtenerAccesoxDpto(lineas, datos) {
    return new Promise((resolve, reject) => {
      var accesoDepartamento = "";
      console.log("roles asignados", datos);
      for (var i = 0; i < lineas; i++) {
        var rol = datos[i].idrol;
        var detalle_rol = datos[i].detalle_rol;
        if (
          rol == 26 || //Tecnico Legal Seguimiento
          rol == 30 || //Monitoreo Tecnica
          rol == 31 || //Monitoreo Legal
          rol == 32 || //Monitoreo Financiera
          rol == 33 || //Responsable Region Oriente
          rol == 34 || //Responsable  Region Centro
          rol == 35 || //Responsable Region Occidente
          rol == 36 || //Encargado Departamento Beni
          rol == 37 || //Encargado Departamento Tarija
          rol == 38 || //Encargado Departamento Oruro
          rol == 39 || //Tecnico Financiero Oriente
          rol == 40 || //Tecnico Financiero Centro
          rol == 41 || //Tecnico Financiero Occidente
          rol == 52 || //Encargado Departamento La Paz
          rol == 53 || //Encargado Departamento Cochabamba
          rol == 54 || //Encargado Departamento Potosí
          rol == 55 || //Encargado Departamento Santa Cruz
          rol == 56 || //Encargado Departamento Chuquisaca
          rol == 57 || //Encargado Departamento Pando
          rol == 63 || //Encargado Financiero
          rol == 64 || //Responsable de Cierre de Proyectos
          rol == 65 || //Administrador Seguimiento
          rol == 66 || //Tecnico Ambientalista
          rol == 67 || //Monitoreo Tecnica Occidente
          rol == 68 || //Monitoreo Tecnica Oriente
          rol == 69 //Monitoreo Tecnica Centro
        ) {
          if (accesoDepartamento == "") {
            accesoDepartamento = detalle_rol;
          } else {
            accesoDepartamento = accesoDepartamento + "," + detalle_rol;
          }
        }
        if (rol == 74) {
          console.log("ENTRA AQUI==>USUARIO REGITRA NUEVO PROYECTO");
          //this.m_accesoDepartamento = `('01','02','03','04','05','06','07','08','09')`;
          this.btn_refrescar_tarjetas = false;
          this.btn_refrescar = true;
          this.btn_nuevoProyecto = true;
          //this.listaProyectosxRegion();
        }
      }
      if (accesoDepartamento != "") {
        accesoDepartamento = "(" + accesoDepartamento + ")";
      }

      resolve(accesoDepartamento);
    });
  }
  accesosRestriccionesxRol(dts) {
    var lineas = dts.length;
    var datos = dts;
    for (var i = 0; i < lineas; i++) {
      var rol = datos[i].idrol;
      var detalle_rol = datos[i].detalle_rol;

      if (
        rol == 58 ||
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
        console.log("ENTRA AQUI==TECNICO");

        this.listaProyectosAsignados();
        //this.btn_nuevoProyecto = false;
      }
      if (rol == 71) {
        console.log("ENTRA AQUI==>MONITOREO EDUCACION");
        this.filtraArea = "EDUCACION";
        this.m_accesoDepartamento = `('01','02','03','04','05','06','07','08','09')`;
        this.btn_refrescar_tarjetas = false;
        this.btn_refrescar = true;
        this.listaProyectosxRegion();
      }
    }
  }

  FechaLiteral(f) {
    return this._fun.FechaLiteral(f);
  }
  paneles(string, dts?) {
    window.scrollTo(0, 0);
    this.dts_registro = dts;
    if (string == "VER_TARJETAS_REGIONES") {
      this.pnl_regiones = true;
      //$("#pnl_listaproyecto").show();
      $("#pnl_listaproyecto").hide();
      this.pnl_tecnica = false;
      this.pnl_financiero = false;
      this.pnl_legal = false;
      this.pnl_alerta = false;
      this.btn_regiones = true;
      this.pnl_observacionproyecto = false;
      this.pnl_nuevoproyecto = false;
    }
    if (string == "VER_LISTAPROYECTOS") {
      $("#pnl_listaproyecto").show();
      this.pnl_tecnica = false;
      this.pnl_financiero = false;
      this.pnl_legal = false;
      this.pnl_alerta = false;
      this.pnl_observacionproyecto = false;
      this.manejoRoles();
      this.pnl_nuevoproyecto = false;
      //this.listaProyectos();
    }
    if (string == "VER_PANELPROYECTOS") {
      $("#pnl_listaproyecto").show();
      this.pnl_resumen = false;
      this.pnl_tecnica = false;
      this.pnl_financiero = false;
      this.pnl_legal = false;
      this.pnl_alerta = false;
      this.pnl_observacionproyecto = false;
      this.pnl_nuevoproyecto = false;
      //this.listaProyectos()
    }
    if (string == "VER_RESUMEN") {
      $("#pnl_listaproyecto").hide();

      if (dts != undefined) {
        this.pnl_resumen = true;
        this.inputDts = dts;
      }
      this.pnl_tecnica = false;
      this.pnl_financiero = false;
      this.pnl_legal = false;
      this.pnl_alerta = false;
      this.pnl_observacionproyecto = false;
      this.pnl_nuevoproyecto = false;
    }
    if (string == "VER_TECNICA") {
      $("#pnl_listaproyecto").hide();

      if (dts != undefined) {
        this.pnl_tecnica = true;
        this.inputDts = dts;
      }
      this.pnl_financiero = false;
      this.pnl_legal = false;
      this.pnl_resumen = false;
      this.pnl_alerta = false;
      this.pnl_observacionproyecto = false;
      this.dts_registroTabla = dts;
      this.pnl_nuevoproyecto = false;
    }
    if (string == "VER_FINANCIERO") {
      $("#pnl_listaproyecto").hide();
      this.pnl_tecnica = false;
      if (dts != undefined) {
        this.pnl_financiero = true;
        this.inputDts = dts;
        console.log("el dts q se pasa", this.inputDts);
        $("#pnl_financiero").show();
      }
      this.pnl_tecnica = false;
      this.pnl_legal = false;
      this.pnl_resumen = false;
      this.pnl_alerta = false;
      this.pnl_observacionproyecto = false;
      this.dts_registroTabla = dts;
      this.pnl_nuevoproyecto = false;
    }
    if (string == "VER_LEGAL") {
      $("#pnl_listaproyecto").hide();
      this.pnl_tecnica = false;
      this.pnl_financiero = false;
      this.inputDts = dts;
      if (dts != undefined) {
        this.pnl_legal = true;
      }
      this.pnl_tecnica = false;
      this.pnl_financiero = false;
      this.pnl_resumen = false;
      this.pnl_alerta = false;
      this.pnl_observacionproyecto = false;
      this.dts_registroTabla = dts;
      this.pnl_nuevoproyecto = false;
    }
    if (string == "VER_ALERTAS") {
      $("#pnl_listaproyecto").hide();
      this.pnl_tecnica = false;
      this.pnl_financiero = false;
      this.inputDts = dts;
      if (dts != undefined) {
        this.pnl_alerta = true;
      }
      this.pnl_tecnica = false;
      this.pnl_financiero = false;
      this.pnl_resumen = false;
      this.pnl_legal = false;
      this.pnl_observacionproyecto = false;
      this.pnl_nuevoproyecto = false;
    }
    if (string == "REGISTRAR_OBSERVACION") {
      $("#pnl_listaproyecto").hide();
      this.pnl_tecnica = false;
      this.pnl_financiero = false;
      this.pnl_resumen = false;
      this.pnl_legal = false;
      this.pnl_observacionproyecto = true;
      console.log("RegistraObs===>", this.pnl_observacionproyecto);
      setTimeout(() => {
        $("#modalObservacionProyecto").modal("show");
      }, 20);
      this.dts_registroTabla = dts;
      this.inputDts = dts;
      this.pnl_nuevoproyecto = false;
    }
    if (string == "CIERRA_MODAL_OBSERVACION_PROYECTO") {
      this.paneles("VER_PANELPROYECTOS");
      $("#modalObservacionProyecto").modal("hide");
    }
    if (string == "VER_FORMULARIO_INSERT") {
      this.limpiaFormularioNuevo();
      $("#pnl_listaproyecto").hide();
      this.pnl_tecnica = false;
      this.pnl_financiero = false;
      this.pnl_legal = false;
      this.pnl_resumen = false;
      this.pnl_datos_generales = false;
      this.pnl_alerta = false;
      this.pnl_observacionproyecto = false;
      this.pnl_nuevoproyecto = true;
      this.buscarDepartamento();
      this.listaTipoProyecto();
      this.listaEntidadContratante();
      this.listaEntidadBeneficiaria();
      setTimeout(() => {
        this.cargarmascaras();
      }, 50);
      this.listaCompromisosPresidenciales();

      //this.listaProyectos();
    }
    if (string == "ASIGNACION") {
      this.elProyecto = dts;
      this.listarTecnicos();
      this.historialUsuarios();
      $("#modalAsignacion").modal("show");
      this.dts_registroTabla = dts;
      this.pnl_nuevoproyecto = false;
    }
  }
  switchReportes() {
    this.pnl_reportes = !this.pnl_reportes;
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

  filtraProyectosContinuidad() {
    this.cargando = true;
    $("#anterior").prop("disabled", true);
    let b = document.getElementById("conti");
    b.classList.toggle("btn-warning");
    if (this.botonContinuidad !== "Anular Filtro Proyectos Continuidad") {
      this.botonContinuidad = "Anular Filtro Proyectos Continuidad";
      this.dts_seguimiento = [];
      this.dts_seguimiento = alasql(
        `SELECT dts1.*
       FROM ? dts1
               JOIN ? dts2 ON dts1._id_sgp = dts2.id_sgp
               `,
        [this.dts_inicial, this.dts_proyectoscontinuidad]
      );

      this.cargando = false;
      this.dts_inicial = [];
      this.dts_seguimiento.forEach((e) => {
        const obj = Object.assign({}, e);
        this.dts_inicial.push(obj);
      });
      if (this.dep) this.cambioDep();
      if (this.prov) this.cambioProv();
      this.totalInicial = this.dts_seguimiento.length;
      // this.cargando = false;
    } else {
      this.botonContinuidad = "Filtra Proyectos de Continuidad";
      //this.manejoRoles();
      this.accesoPorTarjetaRegion(this.m_accesoDepartamento);
      this.cargando = false;
    }
  }
  listaProyectosContinuidad() {
    return new Promise((resolve, reject) => {
      this._seguimiento.listaProyectosContinuidad().subscribe(
        (result: any) => {
          console.log("Ingresa a lista proy continuidad1", result);
          if (Array.isArray(result) && result.length > 0) {
            //this.dts_proyectoscontinuidad = this._fun.RemplazaNullArray(result);
            console.log("Ingresa a lista proy continuidad");
            resolve(result);
          } else {
            this.prop_msg = "Alerta: No existen registros";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
            this.cargando = false;
            reject(this.prop_msg);
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
          reject(this.prop_msg);
        }
      );
    });
  }

  listarCodigosETAS() {
    this._seguimiento.listarCodigosETAS({opcion:'T'}).subscribe(
      (result: any) => {
        console.log("codigos ETAS", result);
        this.dtsCodigosETAS = result;
      },
      (error) => {
        this._msg.formateoMensaje("modal_danger", error.message || error);
      }
    );
  }

  listaProyectosxRegion() {
    console.log("id usuario", this.s_usu_id);
    let b = document.getElementById("conti");
    b.classList.remove("btn-warning");
    $("#anterior").prop("disabled", true);
    this.botonContinuidad = "Filtra Proyectos de Continuidad";
    console.time("listarpoyectos");
    console.log("CODIGO REGION", this.m_accesoDepartamento);
    this.cargando = true;
    this._seguimiento
      .listaProyectosConsolidadosxRegion(
        this.m_accesoDepartamento,
        this.s_usu_id
      )
      .subscribe(
        (result: any) => {
          console.timeEnd("listarpoyectos");
          console.time("armando");
          if (Array.isArray(result) && result.length > 0) {
            this.dts_seguimiento = this._fun.RemplazaNullArray(result);
            if (
              typeof this.filtraArea === "undefined" ||
              this.filtraArea === null
            ) {
            } else {
              this.dts_seguimiento = this.dts_seguimiento.filter(
                (dato) => dato._descripcion_area == this.filtraArea
              );
            }

            // console.log('LISTA PROYECTOS',this.dts_seguimiento);
            this.totalInicial = this.dts_seguimiento.length;
            this.dts_inicial = [];
            this.dts_seguimiento.forEach((e) => {
              const obj = Object.assign({}, e);
              this.dts_inicial.push(obj);
            });
            this.dts_departamentos = alasql(
              `select distinct _departamento from ?`,
              [this.dts_seguimiento]
            );
            this.dts_departamentos.unshift({ _departamento: "" });
            this.dts_provincias = alasql(`select distinct _provincia from ?`, [
              this.dts_seguimiento,
            ]);
            this.dts_provincias.unshift({ _departamento: "" });
            this.dts_municipios = alasql(
              `select distinct _municipio from ? order by _municipio`,
              [this.dts_seguimiento]
            );
            this.dts_municipios.unshift({ _departamento: "" });
            this.dts_estados = alasql(
              `select distinct _des_estado_proyecto from ?`,
              [this.dts_seguimiento]
            );
            this.dts_estados.unshift({ _des_estado_proyecto: "" });
            this.cargando = false;
            if (this.dep) this.cambioDep();
            if (this.prov) this.cambioProv();
          } else {
            this.prop_msg = "Alerta: No existen registros";
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
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        }
      );
  }
  listaProyectosAsignados() {
    this.cargando = true;
    this._seguimiento
      .listaProyectosConsolidadosAsignados(this.s_usu_id)
      .subscribe(
        (result: any) => {
          console.timeEnd("listarpoyectos");
          console.time("armando");
          if (Array.isArray(result) && result.length > 0) {
            this.dts_seguimiento = this._fun.RemplazaNullArray(result);
            console.log("Proy Asignado==>", this.dts_seguimiento);
            this.totalInicial = this.dts_seguimiento.length;
            this.dts_inicial = [];
            this.dts_seguimiento.forEach((e) => {
              const obj = Object.assign({}, e);
              this.dts_inicial.push(obj);
            });
            console.log("Proye Asignado2", this.dts_inicial);
            this.dts_departamentos = alasql(
              `select distinct _departamento from ?`,
              [this.dts_seguimiento]
            );
            this.dts_departamentos.unshift({ _departamento: "" });
            this.dts_provincias = alasql(`select distinct _provincia from ?`, [
              this.dts_seguimiento,
            ]);
            this.dts_provincias.unshift({ _departamento: "" });
            this.dts_municipios = alasql(
              `select distinct _municipio from ? order by _municipio`,
              [this.dts_seguimiento]
            );
            this.dts_municipios.unshift({ _departamento: "" });
            this.dts_estados = alasql(
              `select distinct _des_estado_proyecto from ?`,
              [this.dts_seguimiento]
            );
            this.dts_estados.unshift({ _des_estado_proyecto: "" });

            this.cargando = false;
            if (this.dep) this.cambioDep();
            if (this.prov) this.cambioProv();
          } else {
            this.prop_msg = "Alerta: No existen resgistros";
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
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        }
      );
  }
  configuracionFiltrosTabla(table) {
    // this._fun.selectTable(table, [2, 3, 11]);
    // this._fun.inputTable(table, [1, 2, 4, 5, 6, 7, 8, 9,12,13]);

    this._fun.selectTable(table, [5, 11]);
    this._fun.inputTable(table, [1, 2, 6, 7, 8, 9, 12, 13]);
  }
  changeTecnico() {
    console.log("cambiando tecnico", this.tecnico);
  }

  listarTecnicos() {
    this._seguimiento.usuariosHabilitados().subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_tecnicos = this._fun
            .RemplazaNullArray(result)
            .filter((el) => el._responsablepreinversion == 1);
          console.log(this.dts_tecnicos);
          this.armaDatosCombo(this.dts_tecnicos);
        } else {
          this.prop_msg = "Alerta: No existen técnicos disponibles";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la petición listarTecnicos");
        }
      }
    );
  }

  historialUsuarios() {
    this._seguimiento
      .financieraProyectoUsuario(this.elProyecto._id_proyecto)
      .subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            this.dts_historial = this._fun
              .RemplazaNullArray(result)
              .sort((a, b) => a.id_proyectousuario - b.id_proyectousuario);
            console.log(this.dts_historial);
            this.historial = true;
          } else {
            this.historial = false;
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            console.log(this.errorMessage);
            alert("Error en la petición historialTecnicos");
          }
        }
      );
  }

  registrarAsignacion() {
    this.cargando = true;
    this._seguimiento
      .financieraProyectoUsuario(this.elProyecto._id_proyecto)
      .subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            const proyectoU = this._fun
              .RemplazaNullArray(result)
              .filter((el) => el.id_estado == 1);
            console.log("el proyU", proyectoU);
            this.cargando = false;
            swal2({
              title: "Advertencia de Reasignación",
              text: `El proyecto ya tiene técnico asignado: ${proyectoU[0].nombre}
                   Desea reemplazarlo?`,
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3c8dbc",
              cancelButtonColor: "#f0ad4e",
              customClass: "swal2-popup",
              confirmButtonText: "Confirmar!",
            }).then((result) => {
              if (result.value) {
                this.asignar("U");
              } else {
                $("#modalAsignacion").modal("hide");
                this.cargando = false;
              }
            });
          } else {
            this.asignar("I");
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            console.log(this.errorMessage);
            alert("Error en la petición registrarAsignacion");
          }
        }
      );
  }

  asignar(tipo: string) {
    const elProyectoUsuario = {
      operacion: tipo,
      idProyectoUsuario: 0,
      idProyecto: this.elProyecto._id_proyecto,
      idUsuario: this.tecnico,
      idRol: 58,
      usuarioRegistro: this.s_usu_id_sispre,
    };
    this._seguimiento
      .financieraCRUDProyectoUsuario(elProyectoUsuario)
      .subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            console.log("el resul", result);
            if (result[0].message && !result[0].message.startsWith("ERROR")) {
              this.prop_msg = "Proyecto asigando con éxito!!!";
              this.prop_tipomsg = "success";
              this._msg.formateoMensaje("modal_success", this.prop_msg);
            } else {
              this.prop_msg = "Alerta: " + result[0].message;
              this.prop_tipomsg = "danger";
              this._msg.formateoMensaje("modal_danger", this.prop_msg);
            }
            this.obtieneRegistroEditado(elProyectoUsuario.idProyecto);
          } else {
            this.prop_msg = "Alerta: No se realizó la asignación";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
          $("#modalAsignacion").modal("hide");
          this.cargando = false;
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            console.log(this.errorMessage);
            alert("Error en la petición asignar");
          }
          this.cargando = false;
        }
      );
  }

  armaDatosCombo(dts) {
    var combo = new Array(dts.length);
    dts.forEach((element) => {
      let registro = {
        id: element._usu_id,
        text: `${element._usu_app} ${element._usu_apm} ${element._usu_nom}`,
      };
      combo.push(registro);
    });
    this.comboSeleccion = combo;
    this.comboSeleccion = this.comboSeleccion.filter(function (el) {
      return el != null;
    });
    return this.comboSeleccion;
  }

  generarReporte(tipo: string) {
    this.cargando = true;
    let nombreReporte: string = "";
    console.log("generando reporte");
    // window.open("http://localhost:8283/10_reportePrueba/");//ok
    if (tipo == "01") nombreReporte = "derechoPropietario.xlsx";
    if (tipo == "02") nombreReporte = "ratificacionConvenio.xlsx";
    if (tipo == "03") nombreReporte = "avanceFisico.xlsx";
    const miDTS = { tipoReporte: tipo };

    this._seguimiento.reportesJuridica(miDTS).subscribe(
      (result: any) => {
        //
        // console.log(result);
        // const file = new Blob([result.blob()], {
        //   type: "application/vnd.ms.excel",
        // });
        //const file = new Blob([result])
        const fileURL = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", nombreReporte);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(fileURL);
        this.cargando = false;
        this.pnl_reportes = false;
      },
      (error) => {
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
  reportesTecnica(tipo: string) {
    this.cargando = true;
    let nombreReporte: string = "";
    console.log("generando reporte");
    // window.open("http://localhost:8283/10_reportePrueba/");//ok
    if (tipo == "01") nombreReporte = "proyectosAmbiental.xlsx";
    const miDTS = { tipoReporte: tipo };

    this._seguimiento.reportesTecnica(miDTS).subscribe(
      (result: any) => {
        // console.log(result);
        // const file = new Blob([result.blob()], {
        //   type: "application/vnd.ms.excel",
        // });
        //const file = new Blob([result])
        const fileURL = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", nombreReporte);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(fileURL);
        this.cargando = false;
        this.pnl_reportes = false;
      },
      (error) => {
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
  reportesFinanciera(tipo: string) {
    this.cargando = true;
    let nombreReporte: string = "";
    console.log("generando reporte");
    if (tipo == "01") nombreReporte = "proyectosAuditoria.xlsx";
    const miDTS = { tipoReporte: tipo };

    this._seguimiento.reportesFinanciera(miDTS).subscribe(
      (result: any) => {
        // console.log(result);
        // const file = new Blob([result.blob()], {
        //   type: "application/vnd.ms.excel",
        // });
        const fileURL = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", nombreReporte);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(fileURL);
        this.cargando = false;
        this.pnl_reportes = false;
      },
      (error) => {
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
  refrescaPadre(dts) {
    console.log("REFRESCA PADRE", dts);
    if (dts.ACCION == "REGISTRADO") {
      this.paneles("CIERRA_MODAL_OBSERVACION_PROYECTO");
      this.obtieneRegistroEditado(dts.ID_PROYECTO);
    }
  }
  obtieneRegistroEditado(id_proyecto) {
    this._seguimiento.listaProyectosConsolidadosId(id_proyecto).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          console.log("regObtenido", result[0]);
          this.dts_registroTabla._des_estado_proyecto =
            result[0]._des_estado_proyecto;
          this.dts_registroTabla._datos_responsable =
            result[0]._datos_responsable;
          this.dts_registroTabla.v_avance_fisico = result[0].v_avance_fisico;
          this.dts_registroTabla.v_avance_financiero =
            result[0].v_avance_financiero;
          this.dts_registroTabla._nro_convenio = result[0]._nro_convenio;
          this.dts_registroTabla._fecha_convenio = result[0]._fecha_convenio;
        } else {
          this.prop_msg = "Alerta: No existen técnicos disponibles";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la petición listarTecnicos");
        }
      }
    );
  }

  cambioDep() {
    this.cargando = true;
    // console.log(this.dep,this.cargando,this.dts_seguimiento,this.dts_inicial);
    this.dts_seguimiento = [];
    this.dts_inicial.forEach((e) => {
      const obj = Object.assign({}, e);
      this.dts_seguimiento.push(obj);
    });
    // this.dts_seguimiento = this.dep===''? this.dts_seguimiento : this.dts_seguimiento.filter(f=>f._departamento === this.dep);
    if (this.dep)
      this.dts_seguimiento = this.dts_seguimiento.filter(
        (f) => f._departamento === this.dep
      );
    const provincias = this.dts_seguimiento.filter(
      (f) => f._departamento === this.dep
    );
    console.log("desfiltro", provincias);

    this.dts_provincias = alasql(`select distinct _provincia from ?`, [
      provincias,
    ]);
    this.dts_provincias.unshift({ _provincia: "" });

    const municipios = this.dts_seguimiento.filter(
      (f) => f._departamento === this.dep
    );
    this.dts_municipios = alasql(
      `select distinct _municipio from ? order by _municipio`,
      [municipios]
    );
    this.dts_municipios.unshift({ _municipio: "" });
    this.filtrar2("_departamento", this.dep || "");
    this.cargando = false;
  }

  cambioProv() {
    this.cargando = true;
    // console.log(this.dep,this.prov,this.dts_seguimiento,this.dts_inicial);
    this.dts_seguimiento = [];
    this.dts_inicial.forEach((e) => {
      const obj = Object.assign({}, e);
      this.dts_seguimiento.push(obj);
    });
    this.dts_seguimiento =
      this.prov === ""
        ? this.dts_seguimiento
        : this.dts_seguimiento.filter((f) => f._provincia === this.prov);
    if (this.dep && !this.prov)
      this.dts_seguimiento = this.dts_seguimiento.filter(
        (f) => f._departamento == this.dep
      );

    const municipios = this.dts_seguimiento.filter(
      (f) => f._provincia === this.prov
    );
    this.dts_municipios = alasql(
      `select distinct _municipio from ? order by _municipio`,
      [municipios]
    );
    this.dts_municipios.unshift({ _municipio: "" });
    this.filtrar2("_provincia", this.prov || "");
    this.cargando = false;
  }
  cambioMun() {
    this.cargando = true;
    this.dts_seguimiento = [];
    this.dts_inicial.forEach((e) => {
      const obj = Object.assign({}, e);
      this.dts_seguimiento.push(obj);
    });
    this.dts_seguimiento =
      this.mun === ""
        ? this.dts_seguimiento
        : this.dts_seguimiento.filter((f) => f._municipio === this.mun);
    if (this.dep && !this.mun)
      this.dts_seguimiento = this.dts_seguimiento.filter(
        (f) => f._departamento == this.dep
      );
    if (this.prov && !this.mun)
      this.dts_seguimiento = this.dts_seguimiento.filter(
        (f) => f._provincia == this.prov
      );
    this.filtrar2("_municipio", this.mun || "");
    this.cargando = false;
  }

  filtrar(col, valor) {
    // console.time('filtrando')
    console.log(col, valor);
    // const valor = document.getElementById('filtroGestion').innerHTML;
    // console.log(valor);
    this.totalFiltrado = this.dts_seguimiento.filter((it) =>
      it[col].toString().toUpperCase().includes(valor.toUpperCase())
    ).length;
    // this.dts_seguimiento = this.dts_inicial;
    // // this.dts_seguimiento = this.dts_seguimiento.filter(f=>f['_gestion'].toString().indexOf(valor)>-1);
    // this.dts_seguimiento = alasql(`select * from ? where ${col} like '%${this.filtroGestion}%'`,[this.dts_seguimiento])
    this.campo = col;
    this.valor = valor; // || this.filtroGestion;
    // console.timeEnd('filtrando')
  }
  filtrar2(campo, valor) {
    //if(this.listaFiltro.length==0) this.listaFiltro.push({campo,valor})
    if (!this.queryFiltro) this.queryFiltro = "select * from ? where";
    if (
      this.listaFiltro.filter((f) => f.campo === campo).length == 0 &&
      valor
    ) {
      this.listaFiltro.push({ campo, valor });
      this.queryFiltro = this.queryFiltro.concat(
        ` and ${campo}::text like '%${valor}%'`
      );
      console.log("if", this.listaFiltro);
    } else {
      this.queryFiltro = "select * from ? where ";
      console.log("else", this.listaFiltro);
      this.listaFiltro.map((e) => {
        if (e.campo === campo) {
          e.valor = valor;
        }
        if (e.campo === "_provincia" && campo === "_departamento") {
          this.prov = "";
          e.valor = "";
        }
        if (
          e.campo === "_municipio" &&
          (campo === "_departamento" || campo === "_provincia")
        ) {
          this.mun = "";
          e.valor = "";
        }
        if (e.valor)
          this.queryFiltro = this.queryFiltro.concat(
            ` and ${e.campo}::text like '%${e.valor}%'`
          );
        return e;
      });
    }

    this.queryFiltro = this.queryFiltro
      .replace("  ", " ")
      .replace("where and", "where ");
    if (this.queryFiltro === "select * from ? where ")
      this.queryFiltro = "select * from ?";
    console.log("dos", this.queryFiltro, this.listaFiltro);
    this.dts_seguimiento = alasql(this.queryFiltro, [this.dts_inicial]);

    this.pagina = 0;
    $("#anterior").prop("disabled", true);
    if (this.dts_seguimiento.length <= 10)
      $("#siguiente").prop("disabled", true);
    if (this.dts_seguimiento.length > 10)
      $("#siguiente").prop("disabled", false);
    //reorganizando los combos municipio y provincia
    if (this.dep) {
      const filtrado = this.dts_inicial.filter(
        (f) => f._departamento === this.dep
      );

      this.dts_provincias = alasql(`select distinct _provincia from ?`, [
        filtrado,
      ]);
      this.dts_provincias.unshift({ _provincia: "" });

      this.dts_municipios = alasql(
        `select distinct _municipio from ? order by _municipio`,
        [filtrado]
      );
      this.dts_municipios.unshift({ _municipio: "" });
    }
    if (this.prov) {
      let filtrado = this.dts_inicial.filter((f) => f._provincia === this.prov);
      if (this.dep)
        filtrado = filtrado.filter((f) => f._departamento === this.dep);
      this.dts_municipios = alasql(
        `select distinct _municipio from ? order by _municipio`,
        [filtrado]
      );
      this.dts_municipios.unshift({ _municipio: "" });
    }
  }

  ordenar(campo) {
    let cambiarOrden = "";
    if (!this.queryOrden || !this.queryOrden.includes(campo))
      this.queryOrden = "select * from ? order by ";
    if (this.queryOrden.includes(`${campo} asc`))
      cambiarOrden = this.queryOrden.replace(`${campo} asc`, `${campo} desc`);
    if (this.queryOrden.includes(`${campo} desc`))
      cambiarOrden = this.queryOrden.replace(`${campo} desc`, `${campo} asc`);
    !this.queryOrden.includes(campo)
      ? (this.queryOrden = this.queryOrden.concat(`, ${campo} asc`))
      : (this.queryOrden = cambiarOrden);
    // this.queryOrden = this.queryOrden.slice(0,-1);
    this.queryOrden = this.queryOrden.replace("order by ,", "order by ");
    console.log("ordenar", campo, this.queryOrden);
    // this.dts_seguimiento.sort((a,b)=>a[campo] - b[campo]);
    this.dts_seguimiento = alasql(this.queryOrden, [this.dts_seguimiento]);
  }

  paginar(valor: number) {
    // console.log('paginando',this.pagina,valor,Math.trunc(this.dts_seguimiento.length/10));
    // $('#anterior').prop('disabled', true)
    this.pagina += valor;
    console.log("entra a paginar", valor, this.pagina);
    this.pagina <= 0
      ? $("#anterior").prop("disabled", true)
      : $("#anterior").prop("disabled", false);
    this.pagina >= Math.trunc(this.dts_seguimiento.length / 10)
      ? $("#siguiente").prop("disabled", true)
      : $("#siguiente").prop("disabled", false);
  }
  /**********************************************************
   * REGISTRO PROYECTO NUEVO
   ***********************************************************/
  buscarDepartamento() {
    this._seguimiento.getBuscarDepartamento().subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_ListaDepartamento = this._fun.RemplazaNullArray(result);
        } else {
          this.prop_msg = "Alerta: No existen registros de la busqueda";
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
    console.log("depa", cod_dep);
    cod_dep = cod_dep.split(" ");
    console.log("depa", cod_dep);
    var dts = this.dts_ListaDepartamento.filter(
      (item) => item.codigo_departamento == cod_dep[1]
    );
    this.m_departamento2 = dts[0].fid_sgp;

    this._seguimiento.getBuscarMunicipio(cod_dep[1]).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_ListaMunicipio = this._fun.RemplazaNullArray(result);
          console.log("MUNICIPIO", this.dts_ListaMunicipio);
        } else {
          this.prop_msg = "Alerta: No existen registros de la busqueda";
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
  listaTipoProyecto() {
    var nmbParametrica = "TIPO_PROYECTO";
    this._seguimiento.listaTipoProyecto(nmbParametrica).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_TipoProyecto = this._fun.RemplazaNullArray(result);
        } else {
          this.prop_msg = "Alerta: No existen registros de la busqueda";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la petición BUSQUEDA1");
        }
      }
    );
  }
  listaEntidadBeneficiaria() {
    this._seguimiento.listaEntidadBeneficiaria().subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_EntidadBeneficiaria = this._fun.RemplazaNullArray(result);
        } else {
          this.prop_msg = "Alerta: No existen registros de la busqueda";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la petición BUSQUEDA2");
        }
      }
    );
  }
  listaEntidadContratante() {
    this._seguimiento.listaEntidadContratante().subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_TipoProyecto = this._fun.RemplazaNullArray(result);
          //this.dts_ListaEntidadContratanteBk =this._fun.RemplazaNullArray(result);
          // this.cargando = false;

          //return result;
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos ";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      }
    );
  }
  inserta_seguimiento_seg() {
    this.cargando = true;
    this._seguimiento
      .inserta_seguimiento_seg(
        this._fun.textoNormal(this.m_nombreproyecto),
        this._fun.textoNormal(this.m_descripcionproyecto),
        this._fun.textoNormal(this.m_tipoproyecto),
        this._fun.textoNormal(this.m_entidadbeneficiaria),
        this._fun.textoNormal(this.m_detallebeneficiario),
        this._fun.textoNormal(this.m_departamento),
        this._fun.textoNormal(this.m_municipio),
        this._fun.textoNormal(this.m_nroconvenio),
        this._fun.textoNormal(
          this._fun.transformDate_yyyymmdd(this.m_fechaconvenio)
        ),
        this.m_plazoconvenio,
        this._fun.valorNumericoDecimal(this.m_montofinanciadoupre),
        this._fun.valorNumericoDecimal(this.m_montocontrapartebeneficiario),
        this._fun.valorNumericoDecimal(this.m_montocontrapartegobernacion),
        this._fun.valorNumericoDecimal(this.m_montocontrapartemunicipio),
        this._fun.textoNormal(this.s_ci_user),
        this._fun.textoNormal(this.s_usu_id),
        this.m_proyectosolicitud
      )
      .subscribe(
        (result: any) => {
          console.log("ACCION===>", result);
          if (Array.isArray(result) && result.length > 0) {
            console.log("RESULTADO DEL REGISTRO DEL NUEVO PROYECTO", result);
            this.m_idProyecto = result[0].vid_proy;
            this.prop_tipomsg = result[0]._accion.includes("CORRECTO")
              ? "modal_success"
              : "modal_warning";
            this.prop_msg = result[0]._accion.includes("CORRECTO")
              ? result[0]._mensaje
              : "No se pudo actualizar el registro";
            this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
            this.cargando = false;
            this.limpiaFormularioNuevo();
            this.paneles("VER_LISTAPROYECTOS");
          } else {
            this.prop_msg = "Alerta: No existen registros de la busqueda";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
            this.cargando = false;
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            console.log(this.errorMessage);
            this.prop_msg = "this.errorMessage";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
            this.cargando = false;
          }
        }
      );
  }
  limpiaFormularioNuevo() {
    this.m_nombreproyecto = "";
    this.m_descripcionproyecto = "";
    this.m_tipoproyecto = "";
    this.m_entidadbeneficiaria = "";
    this.m_detallebeneficiario = "";
    this.m_departamento = "";
    this.m_municipio = "";
    this.m_nroconvenio = "";
    this.m_fechaconvenio = "";
    this.m_plazoconvenio = "";
    this.m_montofinanciadoupre = "";
    this.m_montocontrapartebeneficiario = "";
    this.m_montocontrapartegobernacion = "";
    this.m_montocontrapartemunicipio = "";
    this.m_proyectosolicitud = "";
  }
  /************************************************************
   * INTEGRACION SOLICITUD
   ************************************************************/
  listaCompromisosPresidenciales() {
    this._seguimiento.listaCompromisosPresidenciales().subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_compromisosPresidenciales =
            this.armaComboCompromisoPresidencial(
              this._fun.RemplazaNullArray(result)
            );
          console.log(
            "LISTA COMPROMISOS PRESIDENCIALES",
            this.dts_compromisosPresidenciales
          );
        } else {
          this.prop_msg = "Alerta: No existen registros de la busqueda";
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
  armaComboCompromisoPresidencial(dts) {
    var combo = new Array(dts.length);
    var comboSeleccion;
    dts.forEach((element) => {
      let registro = {
        id: element.id_compromiso,
        text: `${element.id_compromiso} ${element.nombreproyecto}`,
      };
      combo.push(registro);
    });
    comboSeleccion = combo;
    comboSeleccion = comboSeleccion.filter(function (el) {
      return el != null;
    });
    return comboSeleccion;
  }
  handleInputCodigoEta(event: any) {
    const value = event.target.value;
    //const pattern = /^\d+(\.\d{0,2})?$/;
    const pattern = /^([0-9]{0,9})(\/[0-9]{0,4})?$/;
    if (!pattern.test(value)) {
      event.target.value = value.slice(0, -1);
    }
  }
  preEditaCodigoEta(id_proyecto) {
    var id_codeta = "#codigoeta" + id_proyecto;
    var codigoeta = $(id_codeta).val();

    this.editaCodigoEta(id_proyecto, codigoeta);
  }
  editaCodigoEta(id_proyecto, codigoeta) {
    console.log("EDITA CODIGO ETA", id_proyecto, codigoeta);
    var dts = {
      id_proyecto: id_proyecto,
      codigoeta: codigoeta,
    };
    this._seguimiento.editaCodigoEta(dts).subscribe(
      (result: any) => {
        if (result.estado == 'CORRECTO') {
          console.log("ACTUALIZO CODIGO ETA", result);
          this.toastr.success("Código ETA actualizado!", "Control Proyecto", {
            positionClass: "toast-top-right",
            timeOut: 5000,
            progressBar: true,
          });
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
}
