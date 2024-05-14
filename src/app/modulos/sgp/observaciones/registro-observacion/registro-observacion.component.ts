import { DatePipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Globals } from "../../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { AutenticacionService } from "../../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../../seguridad/mensajes/mensajes.component";
import { SgpService } from "../../sgp.service";
import { ObservacionesService } from "../observaciones.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-registro-observacion",
  templateUrl: "./registro-observacion.component.html",
  styleUrls: ["./registro-observacion.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
    ObservacionesService,
  ],
})
export class RegistroObservacionComponent implements OnInit {
  @Input("inputDts") inputDts: string;
  @Input("filtro") filtro: string;
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

  /************************************
   * VARIABLES DEL COMPONENTE
   ***********************************/
  public id_proyecto: any;
  public nro_version: any;
  public nombre_proyecto: any;
  public departamento: any;
  public municipio: any;
  public fid_sgp: any;

  public id_observacion: any;
  public m_unidad: any;
  public m_situacionActual: any;
  public m_tareasPendientes: any;
  public m_observacionDirigida: any;
  public m_fechaInicio: any;
  public m_fechaFin: any;
  public m_estadoCumplimiento: any;

  public dts_listaObservacion: any;
  public dts_listaObservacionPivote: any;

  public pnl_listaObservacion = false;
  public pnl_formularioRegistro = false;

  public btn_guardar = false;
  public btn_editar = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _seguimiento: SgpService,
    private _observaciones: ObservacionesService,

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
    console.log("datosPadre", this.inputDts);
    this.id_proyecto = this.inputDts["_id_proyecto"];
    this.nro_version = this.inputDts["_nro_version"];
    this.obtenerConexion();
    this.nombre_proyecto = this.inputDts["_nombreproyecto"];
    this.departamento = this.inputDts["_departamento"];
    this.municipio = this.inputDts["_municipio"];

    this.fid_sgp = this.inputDts["_id_sgp"];
    this.paneles("OBSERVACIONES");
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
    this.s_usu_area = this.dtsDatosConexion.s_usu_area;
  }
  paneles(string, dts?) {
    if (string == "OBSERVACIONES") {
      this.listaObservacion(this.inputDts["_id_proyecto"]);
      this.serearCampos();
    }
    if (string == "OBSERVACION_EMPRESA") {
      this.dts_listaObservacion = this.dts_listaObservacionPivote.filter(
        (item) => item.dirigido === "EMPRESA"
      );
      this.pnl_listaObservacion = true;
      this.pnl_formularioRegistro = false;
    }
    if (string == "OBSERVACION_MAE") {
      this.dts_listaObservacion = this.dts_listaObservacionPivote.filter(
        (item) => item.dirigido === "MAE"
      );
      this.pnl_listaObservacion = true;
      this.pnl_formularioRegistro = false;
    }
    if (string == "NUEVA_OBSERVACION") {
      this.serearCampos();
      this.m_estadoCumplimiento = "EN PROCESO";
      this.m_unidad = this.s_usu_area;
      this.pnl_listaObservacion = false;
      this.pnl_formularioRegistro = true;
      this.m_observacionDirigida = this.filtro;
      this.m_estadoCumplimiento = "EN PROCESO";
      this.btn_guardar = true;
      this.btn_editar = false;
    }
    if (string == "REGISTRA_OBSERVACION") {
      this.pnl_listaObservacion = true;
      this.pnl_formularioRegistro = false;
      this.InsertaObservacion();
    }
    if (string == "EDITA_OBSERVACION") {
      //this.m_estadoCumplimiento='EN PROCESO';
      this.m_unidad = this.s_usu_area;
      this.pnl_listaObservacion = false;
      this.pnl_formularioRegistro = true;
      this.m_observacionDirigida = this.filtro;
      this.m_estadoCumplimiento = "EN PROCESO";
      this.btn_guardar = false;
      this.btn_editar = true;
      console.log("datos a editar", dts);

      this.id_observacion = dts.id;
      this.id_proyecto = dts.fid_proyecto;
      this.fid_sgp = dts.fid_sgp;
      this.m_unidad = dts.unidad;
      this.m_situacionActual = dts.situacion_actual;
      this.m_tareasPendientes = dts.pendientes;
      this.m_estadoCumplimiento = dts.estado_observacion;
      this.m_observacionDirigida = dts.dirigido;
      this.m_fechaInicio = this._fun.transformDateOf_yyyymmdd(dts.fecha_inicio);
      this.m_fechaFin = this._fun.transformDateOf_yyyymmdd(dts.fecha_fin);
      this.s_usu_id = dts.usuario_registro;
    }
    if (string == "REGISTRA_EDICION_OBSERVACION") {
      this.pnl_listaObservacion = true;
      this.pnl_formularioRegistro = false;
      this.EditaObservacion();
    }
    if (string == "CAMBIO_ESTADO_OBSERVACION") {
      this.id_observacion = dts.id;
      this.id_proyecto = dts.fid_proyecto;
      this.s_usu_id = dts.usuario_registro;

      this.pnl_listaObservacion = true;
      this.pnl_formularioRegistro = false;
      setTimeout(() => {
        this.CambioEstdoObservacion();
      }, 20);
    }
  }
  serearCampos() {
    this.m_situacionActual = "";
    this.m_tareasPendientes = "";
    this.m_fechaInicio = "";
    this.m_fechaFin = "";
  }
  listaObservacion(idproyecto) {
    this.cargando = true;
    console.log("idproyecto", idproyecto, this.filtro);
    this._observaciones.listaObservacion(idproyecto).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_listaObservacionPivote = this._fun.RemplazaNullArray(result);
          if (this.filtro == "EMPRESA") {
            this.paneles("OBSERVACION_EMPRESA");
            this.pnl_listaObservacion = true;
            this.conf_tablaObservacion();
          }
          if (this.filtro == "MAE") {
            this.paneles("OBSERVACION_MAE");
            this.pnl_listaObservacion = true;
            this.conf_tablaObservacion();
          }

          this.paneles;
          console.log("entra", this.dts_listaObservacionPivote);
        } else {
          this.prop_msg = "Alerta: No existe observacion";
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
  conf_tablaObservacion() {
    this._fun.limpiatabla(".dt-observaciones");
    setTimeout(() => {
      let confiTable = this._fun.CONFIGURACION_TABLA_V6(
        [50, 100, 150, 200],
        false,
        20
      );
      var table = $(".dt-observaciones").DataTable(confiTable);
      //this._fun.selectTable(table, [1, 2, 3, 4, 5,7]);
      //this._fun.inputTable(table, [6,10]);
      this.cargando = false;
    }, 5);
  }
  InsertaObservacion() {
    var datos = {
      fid_proyecto: this.id_proyecto,
      fid_sgp: this.fid_sgp,
      unidad: this.m_unidad,
      situacion_actual: this.m_situacionActual,
      pendientes: this.m_tareasPendientes,
      observaciones: "",
      estado_observacion: this.m_estadoCumplimiento,
      dirigido: this.m_observacionDirigida,
      fecha_inicio: this.m_fechaInicio,
      fecha_fin: this.m_fechaFin,
      usuario_registro: this.s_usu_id,
    };

    this._observaciones.insertaObservacion(datos).subscribe(
      (result: any) => {
        
        console.log("dts", result);
        if (Array.isArray(result) && result.length > 0) {
          this.paneles("OBSERVACIONES");
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
        }
      }
    );
  }
  EditaObservacion() {
    var datos = {
      id_observacion: this.id_observacion,
      fid_proyecto: this.id_proyecto,
      fid_sgp: this.fid_sgp,
      unidad: this.m_unidad,
      situacion_actual: this.m_situacionActual,
      pendientes: this.m_tareasPendientes,
      observaciones: "",
      estado_observacion: this.m_estadoCumplimiento,
      dirigido: this.m_observacionDirigida,
      fecha_inicio: this.m_fechaInicio,
      fecha_fin: this.m_fechaFin,
      usuario_registro: this.s_usu_id,
    };

    this._observaciones.editaObservacion(datos).subscribe(
      (result: any) => {
        
        console.log("dts", result);
        if (Array.isArray(result) && result.length > 0) {
          this.paneles("OBSERVACIONES");
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
        }
      }
    );
  }
  CambioEstdoObservacion() {
    var datos = {
      id_observacion: this.id_observacion,
      fid_proyecto: this.id_proyecto,
      usuario_registro: this.s_usu_id,
    };

    this._observaciones.cambioestadoObservacion(datos).subscribe(
      (result: any) => {
        
        console.log("dts", result);
        if (Array.isArray(result) && result.length > 0) {
          this.paneles("OBSERVACIONES");
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
        }
      }
    );
  }
}
