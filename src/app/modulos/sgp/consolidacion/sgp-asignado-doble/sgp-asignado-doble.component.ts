import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
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
  selector: "app-sgp-asignado-doble",
  templateUrl: "./sgp-asignado-doble.component.html",
  styleUrls: ["./sgp-asignado-doble.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
  ],
})
export class SgpAsignadoDobleComponent implements OnInit {
  public cargando = false;
  /*VARIABLES PARA MASCARAS */
  public mask_numerodecimal: any;
  public mask_fecha: any;
  public mask_numero: any;
  public mask_gestion: any;
  public mask_cite: any;
  public x: any;

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

  /*************************************
   * VARIABLES PROPIAS DEL COMPONENTE
   ************************************/
  public m_titulo: any;
  public dts_listaproyectos: any;
  public d_table: any;

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
    //this.paneles('VER_LISTAPROYECTOS')
    this.listaproyectosparavalidacion();
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
    if (string == "VER_LISTAPROYECTOS") {
      this.m_titulo = "Asignacion de codigo SGP duplicados";
      this.listaproyectosparavalidacion();
    }
  }
  listaproyectosparavalidacion() {
    this.cargando = true;
    this.dts_listaproyectos = [];
    this._seguimiento.listaProyectosParaConsolidarV4().subscribe(
      (result: any) => {
        console.log("dts1", result);
        if (Array.isArray(result) && result.length > 0) {
          this.dts_listaproyectos = this._fun.RemplazaNullArray(result);
          console.log("dts2", this.dts_listaproyectos);
          this._fun.limpiatabla(".dt-listaproyectos");
          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V4(
              [50, 100, 150, 200],
              false,
              20,
              10,
              "asc"
            );
            //let confiTable = this._fun.CONFIGURACION_TABLA_V3([50, 100, 150, 200], false, 20);
            //var table = $('.dt-listaproyectos').DataTable(confiTable);
            this.d_table = $(".dt-listaproyectos").DataTable(confiTable);
            var table = this.d_table;
            this._fun.selectTable(table, [1, 2, 3, 4, 15]);
            this._fun.inputTable(table, [5, 6, 7, 8, 9, 10, 11]);
            this.cargando = false;
          }, 5);
        } else {
          this.prop_msg = "Alerta: No existen responsables registrados";
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

  pre_edita() {
    var data = this.d_table.$("input, select").serializeArray();
    console.log();
    for (var i = 0; i < data.length; i++) {
      if (data[i].value != "") {
        this.actualiza_registro(data[i].name, data[i].value);
      }
    }
  }
  actualiza_registro(id_seg, id_sgp) {
    this._seguimiento.editaConsolidacion(id_seg, id_sgp).subscribe(
      (result: any) => {
        
        if ((result.estado = "Correcto")) {
        } else {
          this.prop_msg = "Alerta: No se pudo actualizar";
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
  inactiva(id_proy) {
    this._seguimiento.inactivaConsolidacion(id_proy).subscribe(
      (result: any) => {
        
        if ((result.estado = "Correcto")) {
          console.log(id_proy);
        } else {
          this.prop_msg = "Alerta: No se pudo actualizar";
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
