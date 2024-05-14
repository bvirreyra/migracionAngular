import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Globals } from "../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { MensajesComponent } from "@mensajes/mensajes.component";
import { NgSelect2Module } from "ng-select2";
import { SeguimientoProyectosService } from "../seguimiento-proyectos/seguimiento-proyectos.service";
import { AutenticacionService } from "../seguridad/autenticacion.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important
@Component({
  selector: "app-seguimiento-proyectos",
  templateUrl: "./seguimiento-proyectos.component.html",
  styleUrls: ["./seguimiento-proyectos.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SeguimientoProyectosService,
    NgSelect2Module,
  ],
})
export class SeguimientoProyectosComponent implements OnInit {
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
  public dts_permisos: any;
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

  public camposHabilitados: {};

  /***********************************
   * VARIABLES DEL COMPONENTE
   ***********************************/
  dts_listaproyectos: any;
  pnl_certificacionpresupuestaria: boolean;
  dts: any;
  inputDts: any;
  pnl_gridview: boolean;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private globals: Globals,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent,
    private datePipe: DatePipe,
    private base64: ImgBase64Globals,
    private _seguimiento: SeguimientoProyectosService
  ) {
    this._route.parent.params.subscribe((parametros) => {
      this.s_idcon = parametros["idcon"];
      this.s_idmod = parametros["idmod"];
    });
    this.url = globals.rutaSrvFronEnd;
    this.s_imgLogo = base64.logocabecera;
    this.url_reporte = globals.rutaSrvReportes;
  }

  ngOnInit() {
    /*************************************************************
     * OBTENIENDO PARAMETROS URL DINAMICO DESDE LA TABLA MENU
     ************************************************************/
    var parametros_url = JSON.parse(
      decodeURIComponent(this.getUrlVars()["parametros_url"])
    );

    this.listaProyectosSeguimiento(parametros_url).then((dts) => {
      this.dts_listaproyectos = dts;
      //this.prepararTabla();
      this.paneles("VER_PANELPROYECTOS");
    });
  }
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

      resolve(1);
    });
  }
  listaProyectosSeguimiento(dts) {
    return new Promise((resolve, reject) => {
      this.cargando = true;
      this._seguimiento.listaProyectosSeguimiento(dts).subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            var datos = this._fun.RemplazaNullArray(result);
            resolve(datos);
            this.cargando = false;
          } else {
            this.prop_msg = "Alerta: No existen registros";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
            this.cargando = false;
          }

          this.cargando = false;
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
            reject(this.prop_msg);
            this.cargando = false;
          }
        }
      );
    });
  }
  prepararTabla() {
    this._fun.limpiatabla(".dt-seguimiento");
    setTimeout(() => {
      let confiTable = this._fun.CONFIGURACION_TABLA_V7(
        [50, 100, 150, 200],
        false,
        10,
        true,
        [[0, "desc"]],
        true,
        [{ visible: false, targets: 0 }]
      );
      if (!$.fn.dataTable.isDataTable(".dt-seguimiento")) {
        var table = $(".dt-seguimiento").DataTable(confiTable);
        this._fun.inputTable(table, [3, 4, 7, 8]);
        this._fun.selectTable(table, [1, 2, 5, 9, 10, 11]);
      }
      // const obj = document.getElementById('tablaDetalle');
      // obj.scrollIntoView({block: "start", behavior: "smooth"});
    }, 100);
  }
  paneles(string, dts?) {
    if (string == "VER_PANELPROYECTOS") {
      this.pnl_gridview = true;
      this.pnl_certificacionpresupuestaria = false;
      this.prepararTabla();
    }
    if (string == "ACTUALIZAR_BANDEJA_PROYECTOS") {
      var parametros_url = JSON.parse(
        decodeURIComponent(this.getUrlVars()["parametros_url"])
      );

      this.listaProyectosSeguimiento(parametros_url).then((dts) => {
        this.dts_listaproyectos = dts;
        //this.prepararTabla();
        this.paneles("VER_PANELPROYECTOS");
      });
    }
    if (string == "CERTIFICACION_PRESUPUESTARIA") {
      this.pnl_certificacionpresupuestaria = true;
      this.pnl_gridview = false;
      this.inputDts = dts;
    }

    // if (string == "VER_PANELPROYECTOS") {
    //   this.panel_proy.emit(string);
    //   this.respuesta.ID_PROYECTO = this.inputDtsBandeja["_id_proyecto"];
    //   this.respuesta.ACCION = "REGISTRADO";
    //   this.metodoenviaPadre(this.respuesta);
    // }
    // if (string == "DATOS_GENERALES_INICIAL") {
    //   this.pnl_derecho_propietareio = false;
    //   this.pnl_ratificacion_plazo = false;
    //   this.pnl_datosgenerales = true;
    //   this.pnl_convenio = false;
    //   this.pnl_resolucion_convenio = false;
    //   this.pnl_adenda = false;
    // }
    // if (string == "DATOS_GENERALES") {
    //   this.pnl_derecho_propietareio = false;
    //   this.pnl_ratificacion_plazo = false;
    //   //this.pnl_datosgenerales = true;
    //   $("#pnl_datosgenerales").show();
    //   this.pnl_convenio = false;
    //   this.pnl_resolucion_convenio = false;
    //   this.pnl_adenda = false;
    // }
    // if (string == "CONVENIO") {
    //   this.pnl_derecho_propietareio = false;
    //   this.pnl_ratificacion_plazo = false;
    //   //this.pnl_datosgenerales = false;
    //   $("#pnl_datosgenerales").hide();
    //   this.pnl_convenio = true;
    //   this.pnl_resolucion_convenio = false;
    //   this.pnl_adenda = false;
    // }
    // if (string == "RESOLUCION_CONVENIO") {
    //   this.pnl_derecho_propietareio = false;
    //   this.pnl_ratificacion_plazo = false;
    //   //this.pnl_datosgenerales = false;
    //   $("#pnl_datosgenerales").hide();
    //   this.pnl_convenio = false;
    //   this.pnl_resolucion_convenio = true;
    //   this.pnl_adenda = false;
    // }
    // if (string == "ADENDA") {
    //   this.pnl_derecho_propietareio = false;
    //   this.pnl_ratificacion_plazo = false;
    //   //this.pnl_datosgenerales = false;
    //   $("#pnl_datosgenerales").hide();
    //   this.pnl_convenio = false;
    //   this.pnl_resolucion_convenio = false;
    //   this.pnl_adenda = true;
    // }
    // if (string == "DERECHO_PROPIETARIO") {
    //   this.pnl_derecho_propietareio = true;
    //   this.pnl_ratificacion_plazo = false;
    //   //this.pnl_datosgenerales = false;
    //   $("#pnl_datosgenerales").hide();
    //   this.pnl_convenio = false;
    //   this.pnl_resolucion_convenio = false;
    //   this.pnl_adenda = false;
    // }
    // if (string == "RATIFICACION CONVENIO") {
    //   this.pnl_derecho_propietareio = false;
    //   //this.pnl_datosgenerales = false;
    //   $("#pnl_datosgenerales").hide();
    //   this.pnl_ratificacion_plazo = true;
    //   this.pnl_convenio = false;
    //   this.pnl_resolucion_convenio = false;
    //   this.pnl_adenda = false;
    // }
  }
}
