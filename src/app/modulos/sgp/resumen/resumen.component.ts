import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Globals } from "../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";
import { SgpService } from "../sgp.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-resumen",
  templateUrl: "./resumen.component.html",
  styleUrls: ["./resumen.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
  ],
})
export class ResumenComponent implements OnInit {
  @Input("inputDts") inputDtsBandeja: string;

  @Output() panel_proy = new EventEmitter<string>();

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

  /**********************************************
   * VARIABLES DEL COMPONENTE
   *******************************************/
  public nombre_proyecto: any;
  //PANELES
  public pnl_datosgenerales = false;
  public pnl_mae = false;
  public pnl_modulositems = false;
  public pnl_formularios = false;
  public pnl_contrato = false;
  public pnl_garantias = false;
  public pnl_equipotecnico = false;
  public pnl_derechopropietario = false;
  public pnl_cierreadminitrativo = false;

  public id_sgp: any;
  public id_seguimiento: any;
  public inputDts: any;
  public vw_seguimiento = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _seguimiento: SgpService,

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
  }

  ngOnInit() {
    if (this.inputDtsBandeja != undefined) {
      this.id_sgp = this.inputDtsBandeja["_id_sgp"];
      this.nombre_proyecto = this.inputDtsBandeja["_nombreproyecto"];
      this.obtieneDatosProyecto(this.inputDtsBandeja["_id_proyecto"]).then(
        (dts) => {
          this.inputDts = dts;
          console.log("DATOS DEL PROYECTO..", this.inputDts);
          //this.nro_version = this.inputDts["_nro_version"];
          this.paneles("DATOS_GENERALES_INICIAL");
          this.obtenerConexion();
        }
      );

      //this.paneles('DATOS_GENERALES_INICIAL');
      //this.obtenerConexion();

      if (this.inputDtsBandeja["_id_seguimiento"] != 0) {
        this.vw_seguimiento = true;
      } else {
        this.vw_seguimiento = false;
      }
    }
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
  paneles(string) {
    if (string == "VER_PANELPROYECTOS") {
      this.panel_proy.emit(string);
    }
    if (string == "DATOS_GENERALES_INICIAL") {
      this.pnl_datosgenerales = true;
      this.pnl_mae = false;
      this.pnl_modulositems = false;
      this.pnl_formularios = false;
      this.pnl_contrato = false;
      this.pnl_garantias = false;
      this.pnl_equipotecnico = false;
      this.pnl_derechopropietario = false;
      this.pnl_cierreadminitrativo = false;
    }
    if (string == "DATOS_GENERALES") {
      //this.pnl_datosgenerales=true;
      $("#pnl_datosgenerales").show();
      this.pnl_mae = false;
      this.pnl_modulositems = false;
      this.pnl_formularios = false;
      this.pnl_contrato = false;
      this.pnl_garantias = false;
      this.pnl_equipotecnico = false;
      this.pnl_derechopropietario = false;
      this.pnl_cierreadminitrativo = false;
    }
    if (string == "MAE") {
      //this.pnl_datosgenerales=false;
      $("#pnl_datosgenerales").hide();
      this.pnl_mae = true;
      this.pnl_modulositems = false;
      this.pnl_formularios = false;
      this.pnl_contrato = false;
      this.pnl_garantias = false;
      this.pnl_equipotecnico = false;
      this.pnl_derechopropietario = false;
      this.pnl_cierreadminitrativo = false;
    }
    if (string == "MODULOS_ITEMS") {
      //this.pnl_datosgenerales=false;
      $("#pnl_datosgenerales").hide();
      this.pnl_mae = false;
      this.pnl_modulositems = true;
      this.pnl_formularios = false;
      this.pnl_contrato = false;
      this.pnl_garantias = false;
      this.pnl_equipotecnico = false;
      this.pnl_derechopropietario = false;
      this.pnl_cierreadminitrativo = false;
    }
    if (string == "FORMULARIOS") {
      //this.pnl_datosgenerales=false;
      $("#pnl_datosgenerales").hide();
      this.pnl_mae = false;
      this.pnl_modulositems = false;
      this.pnl_formularios = true;
      this.pnl_contrato = false;
      this.pnl_garantias = false;
      this.pnl_equipotecnico = false;
      this.pnl_derechopropietario = false;
      this.pnl_cierreadminitrativo = false;
    }
    if (string == "CONTRATO") {
      //this.pnl_datosgenerales=false;
      $("#pnl_datosgenerales").hide();
      this.pnl_mae = false;
      this.pnl_modulositems = false;
      this.pnl_formularios = false;
      this.pnl_contrato = true;
      this.pnl_garantias = false;
      this.pnl_equipotecnico = false;
      this.pnl_derechopropietario = false;
      this.pnl_cierreadminitrativo = false;
    }
    if (string == "GARANTIAS") {
      //this.pnl_datosgenerales=false;
      $("#pnl_datosgenerales").hide();
      this.pnl_mae = false;
      this.pnl_modulositems = false;
      this.pnl_formularios = false;
      this.pnl_contrato = false;
      this.pnl_garantias = true;
      this.pnl_equipotecnico = false;
      this.pnl_derechopropietario = false;
      this.pnl_cierreadminitrativo = false;
    }
    if (string == "EQUIPO_TECNICO") {
      //this.pnl_datosgenerales=false;
      $("#pnl_datosgenerales").hide();
      this.pnl_mae = false;
      this.pnl_modulositems = false;
      this.pnl_formularios = false;
      this.pnl_contrato = false;
      this.pnl_garantias = false;
      this.pnl_equipotecnico = true;
      this.pnl_derechopropietario = false;
      this.pnl_cierreadminitrativo = false;
    }
    if (string == "DERECHO_PROPIETARIO") {
      //this.pnl_datosgenerales=false;
      $("#pnl_datosgenerales").hide();
      this.pnl_mae = false;
      this.pnl_modulositems = false;
      this.pnl_formularios = false;
      this.pnl_contrato = false;
      this.pnl_garantias = false;
      this.pnl_equipotecnico = false;
      this.pnl_derechopropietario = true;
      this.pnl_cierreadminitrativo = false;
    }
    if (string == "CIERRE_ADMINITRATIVO") {
      //this.pnl_datosgenerales=false;
      $("#pnl_datosgenerales").hide();
      this.pnl_mae = false;
      this.pnl_modulositems = false;
      this.pnl_formularios = false;
      this.pnl_contrato = false;
      this.pnl_garantias = false;
      this.pnl_equipotecnico = false;
      this.pnl_derechopropietario = false;
      this.pnl_cierreadminitrativo = true;
    }
  }
}
