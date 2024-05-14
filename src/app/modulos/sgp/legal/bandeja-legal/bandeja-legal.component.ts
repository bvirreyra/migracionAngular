import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Globals } from "../../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { AutenticacionService } from "../../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../../seguridad/mensajes/mensajes.component";
import { AccesosRolComponent } from "../../accesos-rol/accesos-rol.component";
import { SgpService } from "../../sgp.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-bandeja-legal",
  templateUrl: "./bandeja-legal.component.html",
  styleUrls: ["./bandeja-legal.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
    AccesosRolComponent,
  ],
})
export class BandejaLegalComponent {
  @Input("inputDts") inputDtsBandeja: any;

  @Output() panel_proy = new EventEmitter<string>();
  @Output() enviaPadre = new EventEmitter<string>();
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

  public pnl_datosgenerales = false;
  public pnl_derecho_propietareio = false;
  public pnl_ratificacion_plazo = false;
  public pnl_supervision = false;
  public pnl_ampliacionplazo = false;
  public pnl_galeriaimagenes = false;
  public pnl_contactos = false;
  public pnl_ficha_tecnica = false;
  public pnl_cierre_administrativo = false;
  public pnl_subirArchivoModal = false;

  public pnl_tecnica = false;
  public pnl_financiero = false;
  public pnl_legal = false;
  public pnl_convenio = false;
  public pnl_resolucion_convenio = false;
  public pnl_adenda = false;
  public inputDts: any;
  public respuesta: any = {
    ID_PROYECTO: "",
    ESTADO: "",
    ACCION: "",
  };

  public camposHabilitados: {};

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _seguimiento: SgpService,

    private globals: Globals,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent,
    private _accesos: AccesosRolComponent,
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
  }

  ngOnInit() {
    this.obtieneDatosProyecto(this.inputDtsBandeja["_id_proyecto"]).then(
      (dts) => {
        this.inputDts = dts;
        console.log(this.inputDts);
        this.obtenerConexion()
          .then(() => {
            return this._accesos.accesosRestriccionesxRolV2(this.s_usu_id);
          })
          .then((data) => {
            this.camposHabilitados = data;
            console.log("Adm Roles===>", this.camposHabilitados);
            console.log("DATOS DEL PROYECTO..", this.inputDts);
            this.paneles("DATOS_GENERALES_INICIAL");
          });
      }
    );
  }

  obtenerConexion() {
    return new Promise((resolve, reject) => {
      this.dtsDatosConexion = JSON.parse(localStorage.getItem("dts_con"));
      this.dts_roles_usuario = JSON.parse(localStorage.getItem("dts_rol"));
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
  paneles(string) {
    if (string == "VER_PANELPROYECTOS") {
      this.panel_proy.emit(string);
      this.respuesta.ID_PROYECTO = this.inputDtsBandeja["_id_proyecto"];
      this.respuesta.ACCION = "REGISTRADO";
      this.metodoenviaPadre(this.respuesta);
    }
    if (string == "DATOS_GENERALES_INICIAL") {
      this.pnl_derecho_propietareio = false;
      this.pnl_ratificacion_plazo = false;
      this.pnl_datosgenerales = true;
      this.pnl_convenio = false;
      this.pnl_resolucion_convenio = false;
      this.pnl_adenda = false;
    }
    if (string == "DATOS_GENERALES") {
      this.pnl_derecho_propietareio = false;
      this.pnl_ratificacion_plazo = false;
      //this.pnl_datosgenerales = true;
      $("#pnl_datosgenerales").show();
      this.pnl_convenio = false;
      this.pnl_resolucion_convenio = false;
      this.pnl_adenda = false;
    }
    if (string == "CONVENIO") {
      this.pnl_derecho_propietareio = false;
      this.pnl_ratificacion_plazo = false;
      //this.pnl_datosgenerales = false;
      $("#pnl_datosgenerales").hide();
      this.pnl_convenio = true;
      this.pnl_resolucion_convenio = false;
      this.pnl_adenda = false;
    }
    if (string == "RESOLUCION_CONVENIO") {
      this.pnl_derecho_propietareio = false;
      this.pnl_ratificacion_plazo = false;
      //this.pnl_datosgenerales = false;
      $("#pnl_datosgenerales").hide();
      this.pnl_convenio = false;
      this.pnl_resolucion_convenio = true;
      this.pnl_adenda = false;
    }
    if (string == "ADENDA") {
      this.pnl_derecho_propietareio = false;
      this.pnl_ratificacion_plazo = false;
      //this.pnl_datosgenerales = false;
      $("#pnl_datosgenerales").hide();
      this.pnl_convenio = false;
      this.pnl_resolucion_convenio = false;
      this.pnl_adenda = true;
    }
    if (string == "DERECHO_PROPIETARIO") {
      this.pnl_derecho_propietareio = true;
      this.pnl_ratificacion_plazo = false;
      //this.pnl_datosgenerales = false;
      $("#pnl_datosgenerales").hide();
      this.pnl_convenio = false;
      this.pnl_resolucion_convenio = false;
      this.pnl_adenda = false;
    }
    if (string == "RATIFICACION CONVENIO") {
      this.pnl_derecho_propietareio = false;
      //this.pnl_datosgenerales = false;
      $("#pnl_datosgenerales").hide();
      this.pnl_ratificacion_plazo = true;
      this.pnl_convenio = false;
      this.pnl_resolucion_convenio = false;
      this.pnl_adenda = false;
    }
  }
  obtieneDatosProyecto(id_proyecto) {
    return new Promise((resolve, reject) => {
      //this.cargando = true;
      this._seguimiento.listaProyectosConsolidadosId(id_proyecto).subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            var dts = this._fun.RemplazaNullArray(result[0]);
            //console.log('DATOS PROYECTOS',this.inputDts);
            resolve(dts);
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
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  metodoenviaPadre(dts) {
    this.enviaPadre.emit(dts);
  }
}
