import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Inputmask from "inputmask";
import { Globals } from "../../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { MensajesComponent } from "@mensajes/mensajes.component";
import * as moment from "moment";
import { NgSelect2Module } from "ng-select2";
import { AutenticacionService } from "../../../seguridad/autenticacion.service";
import { SeguimientoProyectosService } from "../../seguimiento-proyectos.service";
declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-bandeja-programacionfinanciera",
  templateUrl: "./bandeja-programacionfinanciera.component.html",
  styleUrls: ["./bandeja-programacionfinanciera.component.css"],
  providers: [
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SeguimientoProyectosService,
    NgSelect2Module,
    AutenticacionService,
  ],
})
export class BandejaProgramacionfinancieraComponent implements OnInit {
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
  dts_proyectos: any[];
  dts_tecnicos: any;
  comboSeleccion: any[];

  /**********************************
   * VARIABLES DEL COMPONENTE
   *********************************/
  public m_periodoProgramacion: any;

  public pnl_dasPlanillas: any = false;
  public pnl_listaproyecto: any = true;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _seguimiento: SeguimientoProyectosService,
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
  }

  ngOnInit() {
    this.m_periodoProgramacion = "";
    this.dts_proyectos = [];
    sessionStorage.clear();
    this.obtenerConexion()
      .then(() => {
        this.mask_numerodecimal = new Inputmask("9{1,9}.9{1,2}");
        this.mask_gestion = new Inputmask("9999");
        this.paneles("VER_LISTAPROYECTOS");
        return this.FechaServidor();
      })
      .then((dts) => {
        this.dtsFechaSrv = dts[0]["fechasrv"];
        this.paneles("VER_LISTAPROYECTOS");
      });
  }
  obtenerConexion() {
    return new Promise(async (resolve, reject) => {
      this.dtsDatosConexion = await JSON.parse(localStorage.getItem("dts_con"));
      this.dts_roles_usuario = await JSON.parse(localStorage.getItem("dts_rol"));
      this.dts_permisos = await JSON.parse(localStorage.getItem("dts_permisos"));
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

  paneles(string, dts?) {
    window.scrollTo(0, 0);

    if (string == "VER_LISTAPROYECTOS") {
      this.pnl_listaproyecto = true;
      this.pnl_dasPlanillas = false;
      if (this.m_periodoProgramacion.length < 1) {
        this.m_periodoProgramacion = moment(this.dtsFechaSrv).format(
          "YYYY-MM-01"
        );
      } else {
        this.m_periodoProgramacion = moment(this.m_periodoProgramacion).format(
          "YYYY-MM-01"
        );
      }

      this.listaProyectos();
    }
    if (string == "DASHBOARD_PAGOPLANILLAS") {
      console.log(string);
      this.pnl_dasPlanillas = true;
      this.pnl_listaproyecto = false;
    }
  }
  listaProyectos() {
    this.cargando = true;
    var dts = {
      periodo: this.m_periodoProgramacion,
    };
    console.log("dts_lista=>", dts);
    this._seguimiento.listaProyectosMonitoreoProgramacion(dts).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          const lista = this._fun.RemplazaNullArray(result);
          console.log("LISTA DE PROYECTOS", lista);
          this.dts_proyectos = lista;
          // console.log(
          //   "usuario",
          //   this.dts_permisos["_usuario_gestionproyectos"]
          // );
          // console.log(
          //   "administrador",
          //   this.dts_permisos["_administrador_gestionproyectos"]
          // );

          // if (this.dts_permisos["_usuario_gestionproyectos"] == false) {
          //   this.dts_proyectos = lista.filter(
          //     (atributo) => atributo.fid_usuario == this.s_usu_id
          //   );
          // }
          // if (this.dts_permisos["_administrador_gestionproyectos"] == false) {
          //   this.dts_proyectos = lista;
          // }
          // if (
          //   this.dts_permisos["_usuarioseguimiento_gestionproyectos"] == false
          // ) {
          //   this.dts_proyectos = lista;
          // }

          this.prepararTabla();
          this.cargando = false;
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
          this.cargando = false;
        }
      }
    );
  }
  prepararTabla() {
    this._fun.limpiatabla(".dt-seguimiento");
    setTimeout(() => {
      let confiTable = this._fun.CONFIGURACION_TABLA_V7(
        [10, 50, 100, 150, 200],
        false,
        10,
        true,
        [
          [2, "desc"],
          [3, "asc"],
          [4, "asc"],
          [5, "asc"],
        ]
      );
      if (!$.fn.dataTable.isDataTable(".dt-seguimiento")) {
        var table = $(".dt-seguimiento").DataTable(confiTable);
        this._fun.inputTable(table, [1, 7, 8, 9, 10, 11]);
        this._fun.selectTable(table, [2, 3, 4, 5, 6]);
      }
      // const obj = document.getElementById('tablaDetalle');
      // obj.scrollIntoView({block: "start", behavior: "smooth"});
    }, 100);
  }
  ActualizarListado() {
    this.paneles("VER_LISTAPROYECTOS");
  }
}
