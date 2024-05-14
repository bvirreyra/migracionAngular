import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Inputmask from "inputmask";
import { Globals } from "../../../global";
/*servicios*/
import { AccesosRolComponent } from "@accesoroles/accesos-rol.component";
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { MensajesComponent } from "@mensajes/mensajes.component";
import { NgSelect2Module } from "ng-select2";
import swal2 from "sweetalert2";
import { SeguimientoService } from "../../seguimiento/seguimiento.service";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { SgpService } from "../../sgp/sgp.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-bandejagestionproyectos",
  templateUrl: "./bandejagestionproyectos.component.html",
  styleUrls: ["./bandejagestionproyectos.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SeguimientoService,
    SgpService,
    NgSelect2Module,
    //AccesosRolComponent,
  ],
})
export class BandejagestionproyectosComponent implements OnInit {
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

  public dts_proyectosgestion: any;
  public dts_tecnicos: any;
  public DatosProyecto: any;
  public dts_historialasignacion: any;
  public historial: any;

  public m_nombreproyecto: any;
  public m_idtecnico: any;
  public m_nombretecnico: any;
  public comboSeleccion: any;
  public pnl_modalItems = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _seguimiento: SeguimientoService,
    //private _formularioresumen: FormularioResumenService,

    private _sgp: SgpService,
    private _accesos: AccesosRolComponent,

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
    this.dts_proyectosgestion = [];
    sessionStorage.clear();
    this.obtenerConexion().then(() => {
      this.mask_numerodecimal = new Inputmask("9{1,9}.9{1,2}");
      this.mask_gestion = new Inputmask("9999");
      this.paneles("VER_LISTAPROYECTOS");
      this.listarTecnicos();
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

      resolve(1);
    });
  }

  listaProyectosGestion() {
    this.cargando = true;
    this._seguimiento.listaProyectosGestion().subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          const lista = this._fun.RemplazaNullArray(result);
          console.log("LISTA DE PROYECTOS", lista);
          console.log(
            "usuario",
            this.dts_permisos["_usuario_gestionproyectos"]
          );
          console.log(
            "administrador",
            this.dts_permisos["_administrador_gestionproyectos"]
          );

          if (this.dts_permisos["_usuario_gestionproyectos"] == false) {
            this.dts_proyectosgestion = lista.filter(
              (atributo) => atributo.fid_usuario == this.s_usu_id
            );
          }
          if (this.dts_permisos["_administrador_gestionproyectos"] == false) {
            this.dts_proyectosgestion = lista;
          }
          if (
            this.dts_permisos["_usuarioseguimiento_gestionproyectos"] == false
          ) {
            this.dts_proyectosgestion = lista;
          }

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
  paneles(string, dts?) {
    window.scrollTo(0, 0);

    if (string == "VER_LISTAPROYECTOS") {
      sessionStorage.clear();
      this.obtenerConexion();
      $("#pnl_listaproyecto").show();
      $("#modalAsignacion").modal("hide");
      $("#modalItems").modal("hide");
      this.pnl_modalItems = false;
      this.listaProyectosGestion();
    }
    if (string == "VOLVER_LISTAPROYECTOS") {
      $("#pnl_listaproyecto").show();
      $("#modalAsignacion").modal("hide");
      $("#modalItems").modal("hide");
      this.pnl_modalItems = false;
    }
    if (string == "ASIGNACION") {
      this.m_idtecnico = "";
      this._fun.limpiatabla(".dt-historial");
      this.m_nombreproyecto = dts.nombreproyecto;
      $("#modalAsignacion").modal("show");
      $("#pnl_listaproyecto").hide();
      $("#modalItems").modal("hide");
      this.pnl_modalItems = false;
      console.log("DATOS DEL PROYECTO", dts);
      this.DatosProyecto = dts;
      this.historialUsuarios(this.DatosProyecto.id_proyecto);

      //this.dts_registroTabla = dts;
      //this.pnl_nuevoproyecto = false;
    }
    if (string == "BANDEJA_ITEMS") {
      this.pnl_modalItems = true;
      this.DatosProyecto = dts;
      setTimeout(() => {
        $("#pnl_listaproyecto").hide();
        $("#modalItems").modal("show");
      }, 50);
    }
    if (string == "CIERRA_BANDEJA_ITEMS") {
      this.pnl_modalItems = false;
      $("#pnl_listaproyecto").show();
      $("#modalItems").modal("hide");
    }
    if (string == "IMPORTAR") {
      //this._fun.limpiatabla(".dt-historial");
      $("#modalImportar").modal("show");
    }
  }
  cerrarAsignacion() {
    this.paneles("VOLVER_LISTAPROYECTOS");
  }
  listarTecnicos() {
    this._sgp.usuariosHabilitados().subscribe(
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
  historialUsuarios(id_proyecto) {
    this._seguimiento
      .historialUsuarioAsignadoGestionProyectos(id_proyecto)
      .subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            console.log("historial", result);
            this.dts_historialasignacion = result;
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
  registrarAsignacion() {
    swal2({
      title: "Advertencia",
      text: `Esta seguro de asignar el usuario ${this.m_nombretecnico} al proyecto ${this.DatosProyecto.nombreproyecto}`,
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3c8dbc",
      cancelButtonColor: "#f0ad4e",
      customClass: "swal2-popup",
      confirmButtonText: "Confirmar!",
    }).then((result) => {
      if (result.value) {
        console.log("ENTRA AQUI PARA LA ASIGNACION");
        this.cargando = true;
        this._seguimiento
          .asignacionGestionProyectoUsuario(
            this.DatosProyecto.id_proyecto,
            this.m_idtecnico,
            this.s_usu_id
          )
          .subscribe(
            (result: any) => {
              console.log("ASIGNADO======>", result);
              this.cargando = false;
              if (Array.isArray(result) && result.length > 0) {
                this.prop_msg = result[0].message;
                this.prop_tipomsg = "success";
                this._msg.formateoMensaje("modal_success", this.prop_msg);
                this.paneles("VER_LISTAPROYECTOS");
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
    });
  }

  changeTecnico() {
    console.log("cambiando tecnico", this.comboSeleccion);
    console.log("cambiando tecnico2", this.m_idtecnico);
    if (this.m_idtecnico != null) {
      this.m_nombretecnico = this.comboSeleccion.filter(
        (el) => el.id == this.m_idtecnico
      )[0].text;
      console.log("nombre tecnico", this.m_nombretecnico);
    }
  }
  ActualizarListado() {
    this.paneles("VER_LISTAPROYECTOS");
  }
}
