import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { Globals } from "../../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import alasql from "alasql";
import { AutenticacionService } from "../../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../../seguridad/mensajes/mensajes.component";
import { SgpService } from "../../sgp.service";
import { MonitoreoCompromisoService } from "../proyecto-compromiso/monitoreo-compromiso/monitoreo-compromiso.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-bandeja-continuidad",
  templateUrl: "./bandeja-continuidad.component.html",
  styleUrls: ["./bandeja-continuidad.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
  ],
})
export class BandejaContinuidadComponent implements OnInit {
  public cargando: boolean = true;
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

  public pnl_listaproyecto = true;
  public pnl_proyectos = false;
  public pnl_proyectos_si = false;
  public pnl_proyectos_no = false;
  public inputDts: any;
  public valor: any;

  public dts_departamento: any;
  public dts_municipio: any;
  public dts_municipio_back: any;
  public filtroDpto = "TODOS";
  public filtroMunicipio = "";

  public dts_listaProyectos: any;
  public dts_listaProyectosInicial: any;
  public visibleParam = false;
  public visibleTarjeta = true;
  public pnl_parametros = false;
  public pnl_detalle = false;
  public pnl_gridview = false;

  public pnl_detalleGeneral = false;
  public pnl_tarjetaProyectosConcluidos = false;
  public pnl_tarjetaProyectosEntregados = false;
  public pnl_tarjetaProyectosAvanceFisico100 = false;
  public pnl_tarjetaProyectosListosParaEntrega = false;
  public pnl_tarjetaProyectosObservadosV2 = false;
  public pnl_tarjetaProyectosObservadosV1 = false;
  public pnl_tarjetaProyectosAvanceFisicoMayor80 = false;
  public pnl_tarjetaProyectosAvanceFisicoMenor80 = false;

  public dtsConcluidos: any;
  public dtsEntregados: any;
  public dtsFisico100: any;
  public dtsFisicoObservado: any;
  public dtsMayor80: any;
  public dtsMenor80: any;
  public dtsListos: any;
  public dtsObservados: any;
  public dts_EjecucionPeriodoVigente: any;
  public dtsDetalle: any;
  public panelDetalle: string;
  public tituloGrilla: string;
  public dtsDetalleGeneral: any;
  public grillaGeneral: boolean = false;
  public dtsConDepartamento: any;

  public pnl_proyectos_paraentrega = false;
  public pnl_proyectos_observacion_tecnica = false;
  public pnl_proyectos_ejecucion = false;
  public filtros = [];
  public pnl_proyectos_ejecucion_anteriores = false;

  public pnl_proyectos_entregados = false;
  public pnl_grillaDinamica = false;
  public pnl_proyectos_general = false;
  public pnl_tarjetas_general = false;
  public pnl_detalle_general = false;
  public pnl_dashboard = false;
  public dtsInternoMenor80: any;
  public dtsInternoConcluidos: any;
  public dtsInternoMayor80: any;
  public totalFisico100: number = 0;
  public dts_proyectos2025: any;
  public dts_proyectos2025Ini: any;
  public tituloDetalle: string = "PROYECTOS PARA ENTREGA";

  public dts_periodopresidencial: any;
  public m_periodopresidencial: any;
  public finicio: any;
  public ffin: any;

  public pnl_Empresas: any;

  public titulosBarDep: {
    central: string;
    vertical: string;
    horizontal: string;
  };
  public seriesBarDep: any[] = [];
  public dtsDatos: any;
  public dtsSector: any;
  public nroProyectosEjecucion: any;

  public periodosBarDep: any[] = [];
  public alto: any;
  coloresDeptos: string[] = [
    "#449DD1",
    "#749629",
    "#EA3546",
    "#662E9B",
    "#cc028f",
    "#0251f0",
    "#546E7A",
    "#00b312",
    "#a35948",
    "#2b908f",
  ];

  public camposHabilitados: {};
  dts_permisos: any;
  public componente: boolean = false;
  dts_listaProyectos_en_ejecucion: any;
  dts_detallePeriodoActual: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _seguimiento: SgpService,
    private _monitoreo: MonitoreoCompromisoService,

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
    this.dts_departamento = [];
    this.dts_municipio = [];
    this.dts_municipio_back = [];
    this.visibleTarjeta = true;
  }

  ngOnInit() {
    // this.grillaGeneral=!this.grillaGeneral;
    this.finicio = "";
    this.ffin = "";

    this.visibleTarjeta = true;

    sessionStorage.clear();
    function falloCallback(error) {
      console.log("Falló con " + error);
    }

    this.DatosConexion()
      .then((dts1) => {
        this.dtsDatosConexion = dts1;
        this.periodoPresidencial();
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
        return this.obtenerConexion();
      })
      .then((dts) => {
        this.camposHabilitados = dts;
        this.componente = true;
        console.log("CAMPOS HABILITADOS===>", this.camposHabilitados);
        console.log("CAMPOS HABILITADOS===>", this.dts_permisos);
      })
      .then((dts) => {
        return this.RolesAsignados(this.s_usu_id);
      })
      .then((dts) => {
        this.dts_roles_usuario = dts;
        console.log("roles", this.dts_roles_usuario);
        return this.GuardarLocalStorage();
      })
      .then((dts) => {
        return this.listarProyectos();
      })
      .then((dts) => {
        this.dts_listaProyectos = dts;
        this.dts_listaProyectosInicial = dts;
        this.inputDts = dts;
        this.armarDts();
        this.cargarDepartamentos();
      })
      .then((dts) => {
        this.listarProyectos2025(0);
        this.manejoRoles();
      });
  }

  /*******************************************************************************/
  /*DATOS INICIALES
  /*******************************************************************************/
  DatosConexion() {
    return new Promise((resolve, reject) => {
      console.log(this.s_idcon, this.s_idmod);
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
                if (
                  !localStorage.getItem("token") &&
                  (document.location.href.includes("r1RMRVY4exbY7fX5Bd15") ||
                    document.location.href.includes("ZCMO7uADNqUtudpAaNNf") ||
                    document.location.href.includes("kNUoEv18Hmetjpk5Gbf7"))
                ) {
                  localStorage.setItem(
                    "token",
                    `r1RMRVY4exbY7fX5Bd15.ZCMO7uADNqUtudpAaNNf.kNUoEv18Hmetjpk5Gbf7`
                  );
                }
                console.log("la url actuaaaaaaal", document.location.href);
                console.log("la conex", localStorage.getItem("dts_con"));
                console.log("el token", localStorage.getItem("token"));

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
  obtenerConexion() {
    return new Promise((resolve, reject) => {
      this.dtsDatosConexion = JSON.parse(localStorage.getItem("dts_con"));
      this.dts_roles_usuario = JSON.parse(localStorage.getItem("dts_rol"));
      this.dts_permisos = JSON.parse(localStorage.getItem("dts_permisos"));
      this.s_idrol = this.dtsDatosConexion.s_idrol;
      this.s_user = this.dtsDatosConexion.s_idrol;
      this.s_nomuser = this.dtsDatosConexion.s_nomuser;
      this.s_usu_id = this.dtsDatosConexion.s_usu_id;
      this.s_usu_id_sipta = this.dtsDatosConexion.s_usu_id_sipta;
      this.s_usu_id_sispre = this.dtsDatosConexion.s_usu_id_sispre;
      this.s_ci_user = this.dtsDatosConexion.s_ci_user;
      resolve(this.dts_permisos);
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
      s_fechaServidor: this.dtsFechaSrv,
    };
    let dts_rol = this.dts_roles_usuario;

    localStorage.setItem("dts_con", JSON.stringify(dts_con));
    localStorage.setItem("dts_rol", JSON.stringify(dts_rol));
  }
  manejoRoles() {
    return new Promise((resolve, reject) => {
      var lineas = this.dts_roles_usuario.length;
      var datos = this.dts_roles_usuario;
      for (var i = 0; i < lineas; i++) {
        var rol = datos[i].idrol;
        if (rol == 45) {
          // rol 45 Consulta Proyectos
          //this.pnl_detalleGeneral = true;
          this.pnl_tarjetaProyectosConcluidos = true;
          this.pnl_tarjetaProyectosEntregados = true;
          this.pnl_tarjetaProyectosAvanceFisico100 = true;
          this.pnl_tarjetaProyectosListosParaEntrega = false;
          this.pnl_tarjetaProyectosObservadosV2 = false;
          this.pnl_tarjetaProyectosObservadosV1 = true;
          this.pnl_tarjetaProyectosAvanceFisicoMayor80 = true;
          this.pnl_tarjetaProyectosAvanceFisicoMenor80 = true;
        }
        if (rol == 116) {
          this.pnl_tarjetaProyectosConcluidos = true;
          this.pnl_tarjetaProyectosEntregados = true;
          this.pnl_tarjetaProyectosAvanceFisico100 = true;
          this.pnl_tarjetaProyectosListosParaEntrega = false;
          this.pnl_tarjetaProyectosObservadosV2 = false;
          this.pnl_tarjetaProyectosObservadosV1 = true;
          this.pnl_tarjetaProyectosAvanceFisicoMayor80 = true;
          this.pnl_tarjetaProyectosAvanceFisicoMenor80 = true;
        }
        if (rol == 51) {
          // rol 51 Consulta Proyectos Upre
          //this.pnl_detalleGeneral = true;
          this.pnl_tarjetaProyectosConcluidos = true;
          this.pnl_tarjetaProyectosEntregados = true;
          this.pnl_tarjetaProyectosAvanceFisico100 = false;
          this.pnl_tarjetaProyectosListosParaEntrega = true;
          this.pnl_tarjetaProyectosObservadosV2 = true;
          this.pnl_tarjetaProyectosObservadosV1 = false;
          this.pnl_tarjetaProyectosAvanceFisicoMayor80 = false;
          this.pnl_tarjetaProyectosAvanceFisicoMenor80 = false;
        }
      }
      resolve(1);
    });
  }

  listarProyectos() {
    return new Promise((resolve, reject) => {
      this.cargando = true;
      this._seguimiento.listaProyectoContinuidad().subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            resolve(this._fun.RemplazaNullArray(result));
            this.cargando = false;
          } else {
            this.prop_msg = "Alerta: No existen proyectos";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
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
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  habilitaPaneles(dts) {
    if (dts == "PROYECTO_PARA_ENTREGA") {
      this.pnl_proyectos_paraentrega = !this.pnl_proyectos_paraentrega;
      this.pnl_proyectos_observacion_tecnica = false;
      this.pnl_proyectos_ejecucion_anteriores = false;
      this.pnl_proyectos_ejecucion = false;
      this.pnl_proyectos_entregados = false;
      this.pnl_detalleGeneral = false;
      this.pnl_grillaDinamica = false;
      this.pnl_proyectos_general = false;
      this.pnl_dashboard = false;
      this.pnl_Empresas = false;
      this.iniciadatosPeriodosAnteriores2();
      this.paneles("PANEL_INICIO");
    }
    if (dts == "PROYECTO_CON_OBSERVACION") {
      this.pnl_proyectos_paraentrega = false;
      this.pnl_proyectos_observacion_tecnica =
        !this.pnl_proyectos_observacion_tecnica;
      this.pnl_proyectos_ejecucion_anteriores = false;
      this.pnl_proyectos_ejecucion = false;
      this.pnl_proyectos_entregados = false;
      this.pnl_detalleGeneral = false;
      this.pnl_grillaDinamica = false;
      this.pnl_proyectos_general = false;
      this.pnl_dashboard = false;
      this.pnl_Empresas = false;
      this.iniciadatosPeriodosAnteriores2();
      this.paneles("PANEL_INICIO");
    }
    if (dts == "PROYECTO_EN_EJECUCION_ANTERIORES") {
      this.pnl_proyectos_paraentrega = false;
      this.pnl_proyectos_observacion_tecnica = false;
      this.pnl_proyectos_ejecucion = false;
      this.pnl_proyectos_ejecucion_anteriores =
        !this.pnl_proyectos_ejecucion_anteriores;
      this.pnl_proyectos_entregados = false;
      this.pnl_detalleGeneral = false;
      this.pnl_grillaDinamica = false;
      this.pnl_proyectos_general = false;
      this.pnl_dashboard = false;
      this.pnl_Empresas = false;
      this.iniciadatosPeriodosAnteriores();
      this.paneles("PANEL_INICIO");
    }
    if (dts == "PROYECTO_EN_EJECUCION") {
      this.pnl_proyectos_paraentrega = false;
      this.pnl_proyectos_observacion_tecnica = false;
      this.pnl_proyectos_ejecucion_anteriores = false;
      this.pnl_proyectos_ejecucion = !this.pnl_proyectos_ejecucion;
      this.pnl_proyectos_entregados = false;
      this.pnl_detalleGeneral = false;
      this.pnl_grillaDinamica = false;
      this.pnl_proyectos_general = false;
      this.pnl_dashboard = false;
      this.pnl_Empresas = false;
      this.filtros = [
        "filtro_departamento",
        "filtro_municipio",
        "filtro_area",
        "filtro_tf",
      ];
      //this.filtros=["filtro_departamento"]
      if (this.pnl_proyectos_ejecucion) {
        this.iniciadatosPeriodoPresidencial().then((resultado) => {
          this.inputDts = resultado;
          this.parametrosGrafica(dts, "barras");
        });
      }
      this.paneles("PANEL_INICIO");
    }
    if (dts == "PROYECTO_ENTREGADO") {
      this.pnl_proyectos_paraentrega = false;
      this.pnl_proyectos_observacion_tecnica = false;
      this.pnl_proyectos_ejecucion_anteriores = false;
      this.pnl_proyectos_ejecucion = false;
      this.pnl_proyectos_entregados = !this.pnl_proyectos_entregados;
      this.pnl_detalleGeneral = false;
      this.pnl_grillaDinamica = false;
      this.pnl_proyectos_general = false;
      this.pnl_dashboard = false;
      this.pnl_Empresas = false;
      this.iniciadatosPeriodosAnteriores2();
      this.paneles("PANEL_INICIO");
    }
    if (dts == "BUSCA_GENERAL_PROYECTO") {
      this.pnl_proyectos_paraentrega = false;
      this.pnl_proyectos_observacion_tecnica = false;
      this.pnl_proyectos_ejecucion_anteriores = false;
      this.pnl_proyectos_ejecucion = false;
      this.pnl_proyectos_entregados = false;
      this.pnl_grillaDinamica = false;
      this.pnl_detalleGeneral = !this.pnl_detalleGeneral;
      this.pnl_proyectos_general = false;
      this.pnl_dashboard = false;
      this.pnl_Empresas = false;
      this.iniciadatosPeriodosAnteriores2();
      this.paneles("PANEL_INICIO");
      this.cargarDepartamentos();
    }
    if (dts == "PROYECTOS_CONTINUIDAD") {
      this.pnl_proyectos_paraentrega = false;
      this.pnl_proyectos_observacion_tecnica = false;
      this.pnl_proyectos_ejecucion_anteriores = false;
      this.pnl_proyectos_ejecucion = false;
      this.pnl_proyectos_entregados = false;
      this.pnl_detalleGeneral = false;
      this.pnl_proyectos_general = false;
      this.pnl_grillaDinamica = !this.pnl_grillaDinamica;
      this.pnl_dashboard = false;
      this.iniciadatosPeriodoPresidencial().then((dts) => {
        this.inputDts = dts;
      });
      this.paneles("PANEL_INICIO");
      this.pnl_Empresas = false;
    }
    if (dts == "PROYECTO_ENTREGA_GENERAL") {
      this.pnl_proyectos_paraentrega = false;
      this.pnl_proyectos_observacion_tecnica = false;
      this.pnl_proyectos_ejecucion_anteriores = false;
      this.pnl_proyectos_ejecucion = false;
      this.pnl_proyectos_entregados = false;
      this.pnl_detalleGeneral = false;
      this.pnl_grillaDinamica = false;
      this.pnl_proyectos_general = !this.pnl_proyectos_general;
      this.pnl_tarjetas_general = true;
      this.pnl_detalle_general = false;

      this.dtsFisico100 = this.dts_listaProyectos.filter(
        (f) => f.rango_fisico == "100%" && f.entrega_protocolar == "NO"
      );
      this.dtsInternoConcluidos = this.dtsFisico100.filter(
        (f) => f.avance_financiero == 100 && f.rango_fisico == "100%"
      );
      this.dtsInternoMayor80 = this.dtsFisico100.filter(
        (f) =>
          f.avance_financiero >= 80 &&
          f.avance_financiero <= 99 &&
          f.rango_fisico == "100%"
      );
      this.dtsInternoMenor80 = this.dtsFisico100.filter(
        (f) => f.avance_financiero < 80 && f.rango_fisico == "100%"
      );
      this.totalFisico100 = this.dtsFisico100.length;
      this.dts_proyectos2025 = this.dts_proyectos2025Ini;
      this.cargarDepartamentos();
      this.iniciadatosPeriodosAnteriores();
      // this.paneles('PROYECTO_ENTREGA_GENERAL');
      this.pnl_dashboard = false;
      this.pnl_Empresas = false;
    }
    if (dts == "MONITOREO_COMPROMISOS") {
      console.log("las fechas", this.finicio, this.ffin);
      if (!this.finicio) this.finicio = "20060122"; //moment().format('yyyyMMDD');
      if (!this.ffin) this.ffin = moment().format("yyyyMMDD");
      this.pnl_proyectos_paraentrega = false;
      this.pnl_proyectos_observacion_tecnica = false;
      this.pnl_proyectos_ejecucion_anteriores = false;
      this.pnl_proyectos_ejecucion = false;
      this.pnl_proyectos_entregados = false;
      this.pnl_detalleGeneral = false;
      this.pnl_proyectos_general = false;
      this.pnl_grillaDinamica = false;
      this.pnl_dashboard = !this.pnl_dashboard;
      this.pnl_Empresas = false;
      this.iniciadatosPeriodoPresidencial().then((dts) => {
        this.inputDts = dts;
      });
      // this.paneles('PANEL_INICIO');
    }
    if (dts == "LISTA_EMPRESAS") {
      this.pnl_proyectos_paraentrega = false;
      this.pnl_proyectos_observacion_tecnica = false;
      this.pnl_proyectos_ejecucion_anteriores = false;
      this.pnl_proyectos_ejecucion = false;
      this.pnl_proyectos_entregados = false;
      this.pnl_detalleGeneral = false;
      this.pnl_proyectos_general = false;
      this.pnl_grillaDinamica = false;
      this.pnl_dashboard = false;
      this.pnl_Empresas = !this.pnl_Empresas;
    }
  }

  armarDts() {
    //CONCLUIDOS
    this.cargando = true;
    this.dtsConcluidos = this.dts_listaProyectos.filter(
      (elemento) => elemento.rango_fisico == "100%"
    );
    //ENTREGADOS
    this.dtsEntregados = this.dts_listaProyectos.filter(
      (elemento) =>
        elemento.rango_fisico == "100%" && elemento.entrega_protocolar == "SI"
    );
    console.log("ENTREGADOS", this.dtsEntregados);
    //FISICO 100%
    this.dtsFisico100 = this.dts_listaProyectos.filter(
      (elemento) =>
        elemento.rango_fisico == "100%" && elemento.entrega_protocolar == "NO"
    );
    //100% OBSERVADOS
    this.dtsFisicoObservado = this.dts_listaProyectos.filter(
      (elemento) =>
        elemento.rango_fisico == "100%" &&
        elemento.entrega_protocolar == "EN USO"
    );
    //MAYOR 80
    this.dtsMayor80 = this.dts_listaProyectos.filter(
      (elemento) => elemento.rango_fisico == "80 - 99%"
    );
    //MENOR 80
    this.dtsMenor80 = this.dts_listaProyectos.filter(
      (elemento) => elemento.rango_fisico == "MENOR A 80%"
    );
    //LISTOS
    this.dtsListos = this.dts_listaProyectos.filter(
      (elemento) =>
        elemento.avance_fisico == 100 && elemento.listo_p_entrega == 1
    );
    //CON OBSERVACION
    this.dtsObservados = this.dts_listaProyectos.filter(
      (elemento) => elemento.avance_fisico == 100 && elemento.observacion
    );
    //PROYECTOS PERIODO VIGENTE
    this.dts_EjecucionPeriodoVigente = this.dts_listaProyectos;
    console.log(
      "proyectos ejecucion periodo vigente===>1",
      this.dts_EjecucionPeriodoVigente
    );
    //PROYECTOS EN EJECUCION
    this.dts_listaProyectos_en_ejecucion = alasql(
      `SELECT * FROM  ? where fecha_inicio is not null and fecha_inicio !=''`,
      [this.dts_listaProyectos]
    );
    console.log(
      "proyectos en ejecucion===>",
      this.dts_listaProyectos_en_ejecucion
    );

    this.cargando = false;
  }

  paneles(valor, nuevo_dts?) {
    if (valor.startsWith("PARAMETROS")) {
      this.pnl_listaproyecto = false;
      this.pnl_proyectos = false;
      this.pnl_proyectos_si = false;
      this.pnl_proyectos_no = false;
      this.pnl_parametros = true;
      this.pnl_detalle = false;
      this.panelDetalle = valor;
    }
    if (valor == "PANEL_INICIO") {
      this.pnl_listaproyecto = true;
      this.pnl_proyectos = false;
      this.pnl_proyectos_si = false;
      this.pnl_proyectos_no = false;
      this.pnl_parametros = false;
      this.pnl_detalle = false;
    }
    if (
      valor == "PROYECTOS CON CONVENIO" ||
      valor == "PROYECTOS EN EJECUCION"
    ) {
      //this.pnl_listaproyecto = true;
      $("#pnl_listaproyecto").show();
      this.pnl_proyectos = false;
      this.pnl_proyectos_si = false;
      this.pnl_proyectos_no = false;
      this.pnl_parametros = false;
      this.pnl_detalle = false;
      //this.dts_EjecucionPeriodoVigente=this.dts_listaProyectos;
    }
    if (valor == "GRILLA-VIGENTES") {
      //this.pnl_listaproyecto = false;
      $("#pnl_listaproyecto").hide();
      this.pnl_proyectos = false;
      this.pnl_proyectos_si = false;
      this.pnl_proyectos_no = false;
      this.pnl_parametros = false;
      this.pnl_detalle = true;
      this.tituloGrilla = "PROYECTOS CON CONVENIO";
      this.dts_detallePeriodoActual = this.dts_EjecucionPeriodoVigente;
    }
    if (valor == "GRILLA-EJECUCION") {
      //this.pnl_listaproyecto = false;
      $("#pnl_listaproyecto").hide();
      this.pnl_proyectos = false;
      this.pnl_proyectos_si = false;
      this.pnl_proyectos_no = false;
      this.pnl_parametros = false;
      this.pnl_detalle = true;
      this.dts_detallePeriodoActual = this.dts_listaProyectos_en_ejecucion;
      this.tituloGrilla = "PROYECTOS EN EJECUCION";
    }
    if (
      valor.startsWith("GRILLA") &&
      valor != "GRILLA-VIGENTES" &&
      valor != "GRILLA-EJECUCION"
    ) {
      this.pnl_listaproyecto = false;
      this.pnl_proyectos = false;
      this.pnl_proyectos_si = false;
      this.pnl_proyectos_no = false;
      this.pnl_parametros = false;
      this.pnl_detalle = true;
      if (valor.endsWith("OBSERVADOS")) {
        this.dtsDetalle = this.dtsFisicoObservado;
        //this.pnl_parametros = true;
        this.panelDetalle = valor;
        this.tituloGrilla = "PROYECTOS CON AVANCE FISICO 100% OBSERVADOS";
      }
      if (valor.endsWith("MAYOR80")) {
        this.dtsDetalle = this.dtsMayor80;
        this.panelDetalle = valor;
        this.tituloGrilla = "PROYECTOS CON AVANCE FISICO MAYOR A 80%";
      }
      if (valor.endsWith("MENOR80")) {
        this.dtsDetalle = this.dtsMenor80;
        this.panelDetalle = valor;
        this.tituloGrilla = "PROYECTOS CON AVANCE FISICO MENOR A 80%";
      }
      if (valor.endsWith("ENTREGADOS")) {
        this.dtsDetalle = this.dtsEntregados;
        this.panelDetalle = valor;
        //console.log('====>',this.dtsDetalle,this.panelDetalle);
        this.tituloGrilla = "PROYECTOS CON ENTREGA PROTOCOLAR";
      }
    }
  }

  recibeMensaje(opcion) {
    console.log(
      "recibiendo mensaje en bandeja opcion panel",
      opcion,
      typeof opcion
    );
    if (typeof opcion == "object") return false;
    this.paneles(opcion);
    // if($event =='GRILLA-DETALLEINI') {
    //   this.dtsDetalle = this.dtsInternoConcluidos;
    //   this.tituloDetalle += ' - detalle Concluidos';
    //   this.pnl_detalle_general = true;
    //   this.pnl_tarjetas_general = false;
    // }
    if (opcion === "PARAMETROS" && this.pnl_proyectos_general) {
      this.pnl_detalle_general = false;
      this.pnl_tarjetas_general = true;
    }
    if (opcion.startsWith("PARA-ENTREGA")) {
      this.pnl_detalle_general = true;
      this.pnl_tarjetas_general = false;
    }
    if (opcion === "PARA-ENTREGA-100") {
      this.dtsDetalle = this.dtsInternoConcluidos;
      this.tituloDetalle += " - detalle Concluidos";
    }
    if (opcion === "PARA-ENTREGA-MAYOR") {
      this.dtsDetalle = this.dtsInternoMayor80;
      this.tituloDetalle += " - detalle mayor al 80%";
    }
    if (opcion === "PARA-ENTREGA-MENOR") {
      this.dtsDetalle = this.dtsInternoMenor80;
      this.tituloDetalle += " - detalle menor al 80%";
    }
    if (opcion === "SOLICITADOS") {
      this.pnl_proyectos_general = false;
      this.pnl_grillaDinamica = true;
    }
  }
  recibeDataMensaje(dts) {
    console.log("recibe hijo", dts);
    if (dts.OPCION == "EJECUCION_PERIODO_PRESIDENCIAL") {
      this.dts_EjecucionPeriodoVigente = dts.DTS;

      console.log(
        "proyectos ejecucion periodo vigente===>2",
        this.dts_EjecucionPeriodoVigente
      );
      //PROYECTOS EN EJECUCION
      this.dts_listaProyectos_en_ejecucion = alasql(
        `SELECT * FROM  ? where fecha_inicio is not null and fecha_inicio !=''`,
        [dts.DTS]
      );
    }
  }

  cargarDepartamentos() {
    this.dts_departamento = [];
    this.dtsDetalleGeneral = [];
    this.filtroDpto = "";
    this.filtroMunicipio = "";
    setTimeout(() => {
      // //this.grillaGeneral = !this.grillaGeneral;
      // const arr = this.inputDts.map((el) => el.departamento).sort();
      // const a = arr.filter((item, index) => arr.indexOf(item) === index);
      // const b = a.map(function (valor) {
      //   var obj = { departamento: valor };
      //   return obj;
      // });
      // this.dts_departamento = b;
      this.dts_departamento = alasql(
        "select distinct departamento from ? order by departamento",
        [this.inputDts]
      );
      // this.dtsFisico100 = this.dts_listaProyectos.filter(f => f.rango_fisico == "100%" && f.entrega_protocolar == "NO");
      console.log("los depas", this.dts_departamento, this.dtsFisico100);
      if (this.pnl_proyectos_general)
        this.dts_departamento = alasql(
          "select distinct departamento from ? order by departamento",
          [this.dtsFisico100]
        );
    }, 20);
  }

  cargaComboMunicipio() {
    console.log("Dpto", this.filtroDpto);
    this.dts_municipio_back = this.inputDts;
    this.dts_municipio = this.dts_municipio_back.filter((elemento) => {
      return elemento.departamento == this.filtroDpto;
    });
    if (this.pnl_proyectos_general)
      this.dts_municipio = this.dts_municipio.filter(
        (f) => f.rango_fisico == "100%" && f.entrega_protocolar == "NO"
      );
    //por filtrar en front
    const arr = this.dts_municipio.map((el) => el.municipio).sort();
    const a = arr.filter((item, index) => arr.indexOf(item) === index);
    const b = a.map(function (valor) {
      var obj = { municipio: valor };
      return obj;
    });
    this.dts_municipio = b;
    if (this.dts_municipio.length > 0) {
      this.dts_municipio.push({
        departamento: this.filtroDpto,
        municipio: "TODOS",
      });
      this.filtroMunicipio = "TODOS";
    } else {
      this.filtroMunicipio = "";
    }

    this.filtroMunicipio = "TODOS";
    this.filtrarMunicipio();
  }

  filtrarDepartamento() {
    // this.dtsConDepartamento = [];
    this.dtsDetalleGeneral = this.inputDts;
    this.dtsDetalleGeneral = this.dtsDetalleGeneral.filter(
      (elemento) => elemento.departamento == this.filtroDpto
    );
    // this.dtsConDepartamento = this.dtsDetalleGeneral;
    setTimeout(() => {
      this.pnl_gridview = true;
    }, 50);

    this.cargaComboMunicipio();
  }

  filtrarMunicipio() {
    this.pnl_gridview = false;

    console.log("dpto", this.filtroDpto, "municipio", this.filtroMunicipio);
    this.dtsDetalleGeneral = this.inputDts; //this.dtsConDepartamento;
    this.dtsFisico100 = this.dts_listaProyectos.filter(
      (f) => f.rango_fisico == "100%" && f.entrega_protocolar == "NO"
    );
    this.dtsInternoConcluidos = this.dtsFisico100.filter(
      (f) => f.avance_financiero == 100 && f.rango_fisico == "100%"
    );
    this.dtsInternoMayor80 = this.dtsFisico100.filter(
      (f) =>
        f.avance_financiero >= 80 &&
        f.avance_financiero <= 99 &&
        f.rango_fisico == "100%"
    );
    this.dtsInternoMenor80 = this.dtsFisico100.filter(
      (f) => f.avance_financiero < 80 && f.rango_fisico == "100%"
    );
    // this.dts_proyectos2025 = this.dts_proyectos2025Ini;
    if (this.filtroMunicipio != "TODOS") {
      this.dtsDetalleGeneral = this.dtsDetalleGeneral.filter(
        (elemento) =>
          elemento.departamento == this.filtroDpto &&
          elemento.municipio == this.filtroMunicipio
      );
      this.dtsFisico100 = this.dtsFisico100.filter(
        (f) =>
          f.departamento == this.filtroDpto &&
          f.municipio == this.filtroMunicipio
      );
      this.dtsInternoConcluidos = this.dtsFisico100.filter(
        (f) => f.avance_financiero == 100 && f.rango_fisico == "100%"
      );
      this.dtsInternoMayor80 = this.dtsFisico100.filter(
        (f) =>
          f.avance_financiero >= 80 &&
          f.avance_financiero <= 99 &&
          f.rango_fisico == "100%"
      );
      this.dtsInternoMenor80 = this.dtsFisico100.filter(
        (f) => f.avance_financiero < 80 && f.rango_fisico == "100%"
      );
      this.dts_proyectos2025 = this.dts_proyectos2025Ini.filter(
        (f) =>
          f.departamento.toUpperCase() == this.filtroDpto &&
          f.municipio.toUpperCase() == this.filtroMunicipio
      );
      setTimeout(() => {
        this.pnl_gridview = true;
      }, 50);
    } else {
      this.dtsDetalleGeneral = this.dtsDetalleGeneral.filter(
        (elemento) => elemento.departamento == this.filtroDpto
      );
      this.dtsFisico100 = this.dtsFisico100.filter(
        (f) => f.departamento == this.filtroDpto
      );
      this.dtsInternoConcluidos = this.dtsFisico100.filter(
        (f) => f.avance_financiero == 100 && f.rango_fisico == "100%"
      );
      this.dtsInternoMayor80 = this.dtsFisico100.filter(
        (f) =>
          f.avance_financiero >= 80 &&
          f.avance_financiero <= 99 &&
          f.rango_fisico == "100%"
      );
      this.dtsInternoMenor80 = this.dtsFisico100.filter(
        (f) => f.avance_financiero < 80 && f.rango_fisico == "100%"
      );
      this.dts_proyectos2025 = this.dts_proyectos2025Ini.filter(
        (f) => f.departamento.toUpperCase() == this.filtroDpto
      );
      setTimeout(() => {
        this.pnl_gridview = true;
      }, 50);
    }
    console.log(this.dtsDetalleGeneral);
  }

  listarProyectos2025(idCompromiso) {
    console.log("cargando proyectos");
    this.cargando = true;
    this._seguimiento.listaProyectos2025({ idCompromiso }).subscribe(
      (result: any) => {
        console.log("result list", result);
        if (!result[0].message) {
          this.dts_proyectos2025 = result;
          this.dts_proyectos2025Ini = result;
          // this.proyectosSolicitados = this.dts_inicial.filter(f=>f.id_compromiso!=null).length;
          // this.municipiosVacios = this.dts_inicial.filter(f=>f.id_compromiso==null).length;
          this.cargando = false;
        } else {
          console.log("no se cargaron insumos");
          this.cargando = false;
        }
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
  periodoPresidencial() {
    console.log("cargando periodo presidencial");
    this.cargando = true;
    this._monitoreo.periodoPresidencial().subscribe(
      (result: any) => {
        console.log("result list", result);
        if (Array.isArray(result) && result.length > 0) {
          this.dts_periodopresidencial = result;
          console.log("PERIODO PRESIDENCIAL", this.dts_periodopresidencial);
        } else {
          console.log("no se cargaron insumos");
          this.cargando = false;
        }
      },
      (error) => {
        this.cargando = false;
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
  filtraPeriodoPresidencial() {
    console.log("OPCION SELECCIONADA", this.m_periodopresidencial);
    this.pnl_proyectos_paraentrega = false;
    this.pnl_proyectos_observacion_tecnica = false;
    this.pnl_proyectos_ejecucion_anteriores = false;
    this.pnl_proyectos_ejecucion = false;
    this.pnl_proyectos_entregados = false;
    this.pnl_detalleGeneral = false;
    this.pnl_proyectos_general = false;

    if (this.m_periodopresidencial == "TODOS") {
      this.dts_listaProyectos = this.dts_listaProyectosInicial;
      this.inputDts = this.dts_listaProyectosInicial;

      this.finicio = "";
      this.ffin = "";

      this.armarDts();
    } else {
      let periodo = this.dts_periodopresidencial.filter(
        (item) => item.id_periodo == this.m_periodopresidencial
      );
      console.log("PERIODO SELECCIONADO", periodo);

      this.dts_listaProyectos = alasql(
        `SELECT * FROM  ? where fecha_convenio BETWEEN ? and ?`,
        [
          this.dts_listaProyectosInicial,
          periodo[0].fecha_inicio,
          periodo[0].fecha_fin,
        ]
      );
      this.finicio = periodo[0].fecha_inicio;
      this.ffin = periodo[0].fecha_fin;
      this.inputDts = this.dts_listaProyectos;
      console.log("PROYECTOS LUIS", this.dts_listaProyectos);
      this.armarDts();
    }
  }
  iniciadatosPeriodoPresidencial() {
    return new Promise((resolve, reject) => {
      this.cargando = true;
      let periodo = this.dts_periodopresidencial.filter(
        (item) => item.id_periodo == 4
      );
      console.log("PERIODO SELECCIONADO", periodo);

      this.dts_listaProyectos = alasql(
        `SELECT * FROM  ? where fecha_convenio BETWEEN ? and ?`,
        [
          this.dts_listaProyectosInicial,
          periodo[0].fecha_inicio,
          periodo[0].fecha_fin,
        ]
      );

      this.finicio = periodo[0].fecha_inicio;
      this.ffin = periodo[0].fecha_fin;
      //this.inputDts=this.dts_listaProyectos;
      console.log("PROYECTOS LUIS", this.dts_listaProyectos);

      this.armarDts();
      this.cargando = false;
      resolve(this.dts_listaProyectos);
    });
  }
  iniciadatosPeriodosAnteriores() {
    this.cargando = true;
    // let periodo = this.dts_periodopresidencial.filter(
    //   (item) =>
    //     item.id_periodo < 4
    // );

    let periodo = alasql(
      `select min(fecha_inicio) as fecha_inicio, max(fecha_fin) fecha_fin from ? where id_periodo < 4`,
      [this.dts_periodopresidencial]
    );

    this.dts_listaProyectos = alasql(
      `SELECT * FROM  ? where fecha_convenio BETWEEN ? and ?`,
      [
        this.dts_listaProyectosInicial,
        periodo[0].fecha_inicio,
        periodo[0].fecha_fin,
      ]
    );
    this.finicio = periodo[0].fecha_inicio;
    this.ffin = periodo[0].fecha_fin;
    this.inputDts = this.dts_listaProyectos;
    console.log("PROYECTOS ANTERIORES", this.dts_listaProyectos);
    this.armarDts();
    this.cargando = false;
  }
  iniciadatosPeriodosAnteriores2() {
    this.cargando = true;
    // let periodo = this.dts_periodopresidencial.filter(
    //   (item) =>
    //     item.id_periodo < 4
    // );

    let periodo = alasql(
      `select min(fecha_inicio) as fecha_inicio, max(fecha_fin) fecha_fin from ? where id_periodo <= 4`,
      [this.dts_periodopresidencial]
    );

    this.dts_listaProyectos = alasql(
      `SELECT * FROM  ? where fecha_convenio BETWEEN ? and ?`,
      [
        this.dts_listaProyectosInicial,
        periodo[0].fecha_inicio,
        periodo[0].fecha_fin,
      ]
    );
    this.finicio = periodo[0].fecha_inicio;
    this.ffin = periodo[0].fecha_fin;
    this.inputDts = this.dts_listaProyectos;
    console.log("PROYECTOS ANTERIORES", this.dts_listaProyectos);
    this.armarDts();
    this.cargando = false;
  }
  parametrosGrafica(opcion, tipo) {
    if (opcion == "PROYECTO_EN_EJECUCION") {
      if (tipo == "barras") {
        this.titulosBarDep = {
          central: `Proyectos en Ejecucion (${this.inputDts.length})`,
          vertical: "Proyectos",
          horizontal: "Departamentos",
        };
        this.dtsDatos = alasql(
          "select departamento, count(*) cantidad ,sum(cast(monto_convenio as decimal)) monto_convenio,sum(cast(monto_upre as decimal)) monto_upre,sum(cast(monto_contraparte as decimal)) monto_contraparte from ? group by departamento order by departamento",
          [this.inputDts]
        );
        this.nroProyectosEjecucion = this.dtsDatos.length;
        console.log("NRO PROYECTOS EN EJECUCION", this.nroProyectosEjecucion);
        this.dtsSector = alasql(
          "select area, count(*) cantidad ,sum(cast(monto_convenio as decimal)) monto_convenio,sum(cast(monto_upre as decimal)) monto_upre,sum(cast(monto_contraparte as decimal)) monto_contraparte from ? group by area order by area",
          [this.inputDts]
        );
        let modDep = [];
        this.dtsDatos.forEach((e) => {
          modDep.push({
            name: e.departamento,
            data: [e.cantidad],
            monto: e.monto,
          });
        });

        this.seriesBarDep = modDep;

        this.periodosBarDep = [
          "Proyectos entre " +
            moment(this.finicio).format("DD/MM/yyyy") +
            " al " +
            moment(this.ffin).format("DD/MM/yyyy"),
        ];
        this.alto = 350;

        setTimeout(() => {
          modDep.forEach((d, i) => {
            const obj = document.getElementById(`dep${i + 1}`);
            obj.style.backgroundColor = this.coloresDeptos[i];
            obj.style.color = "whitesmoke";
          });
        }, 60);
        setTimeout(() => {
          let confiTable = this._fun.CONFIGURACION_TABLA_V8(
            [10, 20, 50],
            false,
            null,
            true,
            [1, "desc"],
            false
          );
          var table = $(".dt-reporte").DataTable(confiTable);

          this._fun.totalTable(table, [1, 3, 4, 5]);
        }, 100);
        setTimeout(() => {
          let confiTable = this._fun.CONFIGURACION_TABLA_V8(
            [10, 20, 50],
            false,
            null,
            true,
            [1, "desc"],
            false
          );
          var table = $(".dt-sector").DataTable(confiTable);
          this._fun.totalTable(table, [1, 3, 4, 5]);
        }, 100);
      }
    }
  }
}
