import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Inputmask from "inputmask";
import * as moment from "moment";
import { Globals } from "../../../../global";

/*servicios*/
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { AutenticacionService } from "../../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../../seguridad/mensajes/mensajes.component";
import { AccesosRolComponent } from "../../accesos-rol/accesos-rol.component";
import { SgpService } from "../../sgp.service";
import { ProgramacionService } from "./programacion.service";

import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";

import swal2 from "sweetalert2";
declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important
declare var $: any;
declare let L;
moment.locale("es");

@Component({
  selector: "app-programacion",
  templateUrl: "./programacion.component.html",
  styleUrls: ["./programacion.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
    ProgramacionService,
  ],
})
export class ProgramacionComponent implements OnInit {
  @Input("inputDts") dts_registro: any;
  @Input("unidad") unidad: string;
  @Output() respuestaPadre = new EventEmitter<string>();

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
  public dts_EstructuraFinanciamiento: any;
  public camposHabilitados: {};

  /***********************************
   * VARIABLES DEL COMPONENTE
   ***********************************/
  public datos_programacion: {
    operacion: string;
    id_programacion: number;
    fid_proyecto: number;
    periodo: string;
    estructura_financiamiento: string;
    detalle: string;
    nro_planilla: number;
    monto_programado: number;
    avance_fisico: number;
    ubicacion: string;
    usuario_registro: string;
    id_estado: number;
    unidad: string;
  };

  public pnlBandeja = false;
  public pnlFormulario = false;
  public pnlResumenFinanciero = false;

  public btnRegistra = false;
  public btnEdita = false;

  public dts_programacion: any;
  public dts_UbicacionProgramacion: any;

  public m_idproyecto: any;
  public m_periodo_programacion: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _programacion: ProgramacionService,

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

    this.datos_programacion = {
      operacion: "",
      id_programacion: 0,
      fid_proyecto: 0,
      periodo: "",
      estructura_financiamiento: "",
      detalle: "",
      nro_planilla: 0,
      monto_programado: 0,
      avance_fisico: 0,
      ubicacion: "",
      usuario_registro: "",
      id_estado: 0,
      unidad: "",
    };
  }

  ngOnInit() {
    this.m_idproyecto = this.dts_registro._id_proyecto;
    console.log("REGISTRO", this.unidad, this.dts_registro);
    //this.id_compromiso = this.dts_registro.id_compromiso;
    this.mask_numerodecimal = new Inputmask("9{1,9}.9{1,2}");
    this.mask_gestion = new Inputmask("9999");
    this.obtenerConexion();
    this.paneles("LISTA_PROGRAMACION");
    this.listaEstructuraProgramacion();

    this.pnlBandeja = true;
  }
  cargarmascaras() {
    var monto_programado = document.getElementById("monto_programado");
    this.mask_numerodecimal.mask(monto_programado);
    if (this.unidad == "TECNICA") {
      var avance_fisico = document.getElementById("avance_fisico");
      this.mask_numerodecimal.mask(avance_fisico);
    }
  }
  obtenerConexion() {
    this.dtsDatosConexion = JSON.parse(localStorage.getItem("dts_con"));
    this.dts_roles_usuario = JSON.parse(localStorage.getItem("dts_rol"));
    this.camposHabilitados = JSON.parse(localStorage.getItem("dts_permisos"));
    this.s_idrol = this.dtsDatosConexion.s_idrol;
    this.s_user = this.dtsDatosConexion.s_user;
    this.s_nomuser = this.dtsDatosConexion.s_nomuser;
    this.s_usu_id = this.dtsDatosConexion.s_usu_id;
    this.s_usu_id_sipta = this.dtsDatosConexion.s_usu_id_sipta;
    this.s_usu_id_sispre = this.dtsDatosConexion.s_usu_id_sispre;
    this.s_ci_user = this.dtsDatosConexion.s_ci_user;
  }
  enviarRespuestaPadre(opcion) {
    this.respuestaPadre.emit(opcion);
  }
  listaProgramacion() {
    this.dts_programacion = [];

    this._programacion.listaProgramacion(this.m_idproyecto).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_programacion = result.filter((f) => f.unidad == this.unidad);
          this.prepararTabla();
          console.log("resultado", this.dts_programacion);
        }
      },
      (error) => {
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
  paneles(string, dts?) {
    if (string == "LISTA_PROGRAMACION") {
      console.log("ACCION", string);
      this.pnlFormulario = false;
      this.pnlBandeja = true;
      this.btnRegistra = false;
      this.btnEdita = false;
      this.listaProgramacion();
      this.limpiaDatos();
    }
    if (string == "VISTA_PROGRAMACION") {
      console.log("ACCION", string);
      this.limpiaDatos();
      this.pnlFormulario = false;
      this.pnlBandeja = true;
      this.btnRegistra = false;
      this.btnEdita = false;
    }
    if (string == "NUEVA_PROGRAMACION") {
      this.limpiaDatos();
      this.pnlFormulario = true;
      this.pnlBandeja = false;
      this.btnRegistra = true;
      this.btnEdita = false;
      this.datos_programacion.operacion = "I";
      this.datos_programacion.id_programacion = null;
      this.datos_programacion.fid_proyecto = this.m_idproyecto;
      this.datos_programacion.usuario_registro = this.s_usu_id;
      this.datos_programacion.id_estado = 1;
      setTimeout(() => {
        this.cargarmascaras();
      }, 20);
    }
    if (string == "EDITA_PROGRAMACION") {
      console.log("ACCION", string);
      this.pnlFormulario = true;
      this.pnlBandeja = false;
      this.btnRegistra = false;
      this.btnEdita = true;
      this.datos_programacion.operacion = "U";
      this.datos_programacion.id_programacion = dts.id_programacion;
      this.datos_programacion.fid_proyecto = dts.fid_proyecto;
      this.datos_programacion.periodo = moment(dts.periodo)
        .format("YYYY-MM")
        .toString();
      this.datos_programacion.estructura_financiamiento =
        dts.estructura_financiamiento;
      this.datos_programacion.detalle = dts.detalle;
      this.datos_programacion.nro_planilla = dts.nro_planilla;
      this.datos_programacion.monto_programado = dts.monto_programado;
      this.datos_programacion.avance_fisico = dts.avance_fisico;
      this.datos_programacion.ubicacion = dts.ubicacion;
      this.datos_programacion.usuario_registro = this.s_usu_id;
      this.datos_programacion.id_estado = 1;
      this.datos_programacion.unidad = dts.unidad;
      setTimeout(() => {
        this.cargarmascaras();
      }, 20);

      //this.datos_monitoreo.fecha_inicio = moment(dts.fecha_inicio).format("YYYY-MM-DD").toString();
    }
    if (string == "ELIMINA_PROGRAMACION") {
      console.log("ACCION", string);
      this.pnlFormulario = false;
      this.pnlBandeja = true;
      this.datos_programacion.operacion = "D";
      this.datos_programacion.id_programacion = dts.id_programacion;
      this.datos_programacion.periodo = moment(dts.periodo)
        .format("YYYY-MM-DD")
        .toString();
      this.datos_programacion.usuario_registro = this.s_usu_id;
      setTimeout(() => {
        this.EliminaProgramacion();
      }, 50);
    }
  }
  limpiaDatos() {
    (this.datos_programacion.operacion = ""),
      (this.datos_programacion.id_programacion = 0),
      (this.datos_programacion.fid_proyecto = 0),
      (this.datos_programacion.periodo = ""),
      (this.datos_programacion.estructura_financiamiento = ""),
      (this.datos_programacion.detalle = ""),
      (this.datos_programacion.nro_planilla = 0),
      (this.datos_programacion.monto_programado = 0),
      (this.datos_programacion.avance_fisico = 0),
      (this.datos_programacion.ubicacion = ""),
      (this.datos_programacion.usuario_registro = ""),
      (this.datos_programacion.id_estado = 0);
  }
  crudProgramacion(dts) {
    this.cargando = true;
    this._programacion.mantenimientoProgramacion(dts).subscribe(
      (result: any) => {
        console.log(result);
        this.prop_tipomsg = result.estado.includes("Correcto")
          ? "modal_success"
          : "modal_warning";
        this.prop_msg = result.estado.includes("Correcto")
          ? "La operacion se realizo de forma correcta"
          : "No se pudo realizar la operacion ";

        this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
        this.paneles("LISTA_PROGRAMACION");
        this.cargando = false;
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
        this.cargando = false;
      }
    );
  }
  EliminaProgramacion() {
    swal2({
      title: "Advertencia!!!",
      text: `Realmente desea eliminar el registro?`,
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d9534f",
      cancelButtonColor: "#f0ad4e",
      customClass: "swal2-popup",
      confirmButtonText: "Confirmar!",
    }).then((result) => {
      if (result.value) {
        console.log("DATOS FORMULARIO", this.datos_programacion);
        this.crudProgramacion(this.datos_programacion);
      }
    });
  }
  InsertaProgramacion() {
    console.log("INSERTA PROGRAMACION", this.datos_programacion);
    this.datos_programacion.periodo = moment(this.datos_programacion.periodo)
      .format("YYYY-MM-DD")
      .toString();
    this.datos_programacion.monto_programado = this._fun.valorNumericoDecimal(
      this.datos_programacion.monto_programado
    );
    this.datos_programacion.avance_fisico = this._fun.valorNumericoDecimal(
      this.datos_programacion.avance_fisico
    );
    this.datos_programacion.unidad = this.unidad;
    this.crudProgramacion(this.datos_programacion);
  }
  EditaProgramacion() {
    console.log("EDITA PROGRAMACION", this.datos_programacion);
    this.datos_programacion.periodo = moment(this.datos_programacion.periodo)
      .format("YYYY-MM-DD")
      .toString();
    this.datos_programacion.monto_programado = this._fun.valorNumericoDecimal(
      this.datos_programacion.monto_programado
    );
    this.datos_programacion.avance_fisico = this._fun.valorNumericoDecimal(
      this.datos_programacion.avance_fisico
    );
    this.crudProgramacion(this.datos_programacion);
  }
  prepararTabla() {
    this._fun.limpiatabla(".dt-monitoreo-compromiso");
    setTimeout(() => {
      let confiTable = this._fun.CONFIGURACION_TABLA_V7(
        [3, 6, 12, 24, 48, 36, 50, 100, 200],
        false,
        3,
        true,
        [2, "desc"]
      );
      if (!$.fn.dataTable.isDataTable(".dt-monitoreo-compromiso")) {
        var table = $(".dt-monitoreo-compromiso").DataTable(confiTable);
        this._fun.inputTable(table, [2, 3, 4, 5, 6]);
        this._fun.selectTable(table, [7]);
      }
      // const obj = document.getElementById('tablaDetalle');
      // obj.scrollIntoView({block: "start", behavior: "smooth"});
    }, 100);
  }
  resumenFinanciero() {
    this.pnlResumenFinanciero = !this.pnlResumenFinanciero;
  }
  reporteProgramacion() {
    this.cargando = true;
    let nombreReporte = `reporteProgramacion.xlsx`;

    this.m_periodo_programacion = moment(this.m_periodo_programacion)
      .format("YYYY-MM-DD")
      .toString();
    console.log("PERIODO DE LA PROGRAMACION", this.m_periodo_programacion);
    const miDTS = { periodo: this.m_periodo_programacion, unidad: this.unidad };
    this._programacion.reporteProgramacion(miDTS).subscribe(
      (result: any) => {
        //
        console.log(result);
        const url = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", nombreReporte);
        link.click();
        this.cargando = false;
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
  listaEstructuraProgramacion() {
    this.cargando = true;
    this._programacion.listaEstructuraProgramacion().subscribe(
      (result: any) => {
        console.log("LISTA ESTRUCTURA PROGRAMACION", result);
        this.dts_EstructuraFinanciamiento =
          this.unidad == "TECNICA"
            ? result.filter(
                (f) => f.descripciondetalleclasificador != "ANTICIPO 20%"
              )
            : result;
        this.listaUbicacionProgramacion();
        this.cargando = false;
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
        this.cargando = false;
      }
    );
  }
  listaUbicacionProgramacion() {
    this.cargando = true;
    this._programacion.listaUbicacionProgramacion().subscribe(
      (result: any) => {
        console.log("LISTA UBICACION PROGRAMACION", result);
        this.dts_UbicacionProgramacion =
          this.unidad == "TECNICA"
            ? result.filter((f) =>
                [1, 2, 3, 4, 5].includes(Number(f.codigodetalleclasificador))
              )
            : result.filter((f) =>
                [3, 6].includes(Number(f.codigodetalleclasificador))
              );
        this.cargando = false;
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
        this.cargando = false;
      }
    );
  }
}
