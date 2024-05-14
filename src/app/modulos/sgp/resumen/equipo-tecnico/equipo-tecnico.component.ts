import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Globals } from "../../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { AutenticacionService } from "../../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../../seguridad/mensajes/mensajes.component";
import { SgpService } from "../../sgp.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-equipo-tecnico",
  templateUrl: "./equipo-tecnico.component.html",
  styleUrls: ["./equipo-tecnico.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
  ],
})
export class EquipoTecnicoComponent implements OnInit {
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
  public s_idProyectoSeguimiento: any;
  //PANELES
  public pnl_equipotecnico = false;
  public pnl_equiposgp = false;
  public nro_version: 0;

  //DTS
  public dts_EquipoTecnico: any;
  public dts_listacontactos: any;
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
    this.obtenerConexion();
    this.nro_version = this.inputDts["_nro_version"];
    if (this.inputDts["_id_seguimiento"] != "") {
      this.s_idProyectoSeguimiento = this.inputDts["_id_seguimiento"];
      // this.paneles("VER_EQUIPOTECNICO");
    }
    this.lista_contactos(this.inputDts["_id_proyecto"]);
    this.equipotecnico(this.s_idProyectoSeguimiento);

    console.log("hijo", this.inputDts);
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
  paneles(string, dts?) {
    if (string == "VER_EQUIPOTECNICO") {
    }
  }
  equipotecnico(id_proyecto) {
    this.cargando = true;
    this._seguimiento.listaequipotecnico(id_proyecto).subscribe(
      (result: any) => {
        console.log("lista equipo tecnico", result);
        if (Array.isArray(result) && result.length > 0) {
          this.dts_EquipoTecnico = this._fun.RemplazaNullArray(result);
          this._fun.limpiatabla(".dt-EquipoTecnico");
          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V3(
              [20, 40, 60, 100],
              false
            );
            var table = $(".dt-EquipoTecnico").DataTable(confiTable);
            this.cargando = false;
          }, 10);
        } else {
          // this.prop_msg = "Alerta: No existen responsables registrados2";
          // this.prop_tipomsg = "danger";
          // this._msg.formateoMensaje("modal_danger", this.prop_msg);
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
  lista_contactos(id_proy) {
    this.cargando = true;
    this.dts_listacontactos = [];
    this._seguimiento.listaContactosSgp(id_proy).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          let resultado = this._fun.RemplazaNullArray(result);
          console.log("contactos", resultado);
          console.log("version", this.nro_version);
          resultado = resultado.filter(
            (item) => item.nro_version == this.nro_version
          );
          console.log("resultado", resultado);
          this.dts_listacontactos = resultado;
          console.log(this.dts_listacontactos);
        } else {
          this.prop_msg = "Alerta: No existen supervisiones registradas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_info", this.prop_msg);
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
  filtradocontactos(listado, version) {
    console.log(listado, version);
    var a = listado.filter((item) => item.nro_version == version);
    return a;
  }
}
