import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Globals } from "../../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { SeguimientoService } from "../../../seguimiento/seguimiento.service";
import { AutenticacionService } from "../../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../../seguridad/mensajes/mensajes.component";
import { SgpService } from "../../sgp.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-cierre-administrativo",
  templateUrl: "./cierre-administrativo.component.html",
  styleUrls: ["./cierre-administrativo.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
    SeguimientoService,
  ],
})
export class CierreAdministrativoComponent implements OnInit {
  @Input("inputDts") inputDts: string;
  @Output() outputAccion = new EventEmitter<string>();

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
  public m_idproyecto: any;
  public m_idseguimiento: any;
  public m_idsgp: any;
  public m_estadocierre: any;
  public m_descripcion: any;
  public m_nombre_archivo: any;
  //DTS
  public dts_cierreadministrativo: any;
  //PANELES
  public pnl_cierre_administrativo = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _sgp: SgpService,
    private _seguimiento: SeguimientoService,

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
    console.log("hijo", this.inputDts);
    this.m_idproyecto = this.inputDts["_id_proyecto"];
    this.m_idseguimiento = this.inputDts["_id_seguimiento"];
    this.m_idsgp = this.inputDts["_id_sgp"];
    this.obtenerConexion();
    this.listaCierreAdministrativo(this.inputDts["_id_proyecto"]);
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
  listaCierreAdministrativo(m_idproyecto) {
    this._sgp.listaCierreAdministrativo(m_idproyecto).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_cierreadministrativo = result;
          this.m_nombre_archivo =
            this.dts_cierreadministrativo[0]["nombre_archivo"];
          this.m_estadocierre =
            this.dts_cierreadministrativo[0]["estado_cierre"];
          this.m_descripcion = this.dts_cierreadministrativo[0]["descripcion"];

          if (this.m_nombre_archivo != "") {
            this.pnl_cierre_administrativo = true;
          }
          console.log(this.dts_cierreadministrativo);
        } else {
          this.prop_msg = "Alerta: No tiene documento cierre administrativo";
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
}
