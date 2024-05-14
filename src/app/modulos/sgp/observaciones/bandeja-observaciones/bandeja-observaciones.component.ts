import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Globals } from "../../../../global";

/*servicios*/
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { AutenticacionService } from "../../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../../seguridad/mensajes/mensajes.component";
import { ObservacionesService } from "../observaciones.service";

import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important
declare var $: any;
declare let L;

@Component({
  selector: "app-bandeja-observaciones",
  templateUrl: "./bandeja-observaciones.component.html",
  styleUrls: ["./bandeja-observaciones.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    ObservacionesService,
  ],
})
export class BandejaObservacionesComponent implements OnInit {
  @Input("inputDts") inputDts: any;

  @Output() panel_proy = new EventEmitter<string>();
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

  public pnl_derecho_propietareio = false;
  public pnl_ratificacion_plazo = false;

  public pnl_galeriaimagenes = false;
  public pnl_contactos = false;
  public pnl_ficha_tecnica = false;
  public pnl_cierre_administrativo = false;
  public pnl_subirArchivoModal = false;

  public pnl_tecnica = false;
  public pnl_financiero = false;
  public pnl_legal = false;
  public pnl_observacionEmpresa = false;
  public pnl_observacionMae = false;

  public id_sgp: any;
  public nro_version: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
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
    console.log(this.inputDts);
    this.obtenerConexion();

    this.id_sgp = this.inputDts["_id_sgp"];
    console.log("BandejaAlertas", this.inputDts["_id_sgp"]);
    this.nro_version = this.inputDts["_nro_version"];
    if (this.inputDts != undefined) {
      this.paneles("OBSERVACION_EMPRESA");

      this.cargarbandeja();
    }
  }

  cargarbandeja() {
    this.obtenerConexion();
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
  paneles(string) {
    if (string == "VER_PANELPROYECTOS") {
      this.panel_proy.emit(string);
    }
    if (string == "OBSERVACION_EMPRESA") {
      this.pnl_observacionEmpresa = true;
      this.pnl_observacionMae = false;
    }
    if (string == "OBSERVACION_MAE") {
      this.pnl_observacionEmpresa = false;
      this.pnl_observacionMae = true;
    }
  }
}
