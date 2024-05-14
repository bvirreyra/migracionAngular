import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Inputmask from "inputmask";
import * as moment from "moment";
import { Globals } from "../../../../../global";

/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import alasql from "alasql";
import swal2 from "sweetalert2";
import { AutenticacionService } from "../../../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../../../seguridad/mensajes/mensajes.component";
import { AccesosRolComponent } from "../../../accesos-rol/accesos-rol.component";
import { SgpService } from "../../../sgp.service";
import { MonitoreoCompromisoService } from "./monitoreo-compromiso.service";
declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important
declare var $: any;
declare let L;
moment.locale("es");

@Component({
  selector: "app-monitoreo-compromiso",
  templateUrl: "./monitoreo-compromiso.component.html",
  styleUrls: ["./monitoreo-compromiso.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
    //AccesosRolComponent, FormularioResumenService
  ],
})
export class MonitoreoCompromisoComponent implements OnInit {
  @Input("dts_registro") dts_registro: any;
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

  /***********************************
   * VARIABLES DEL COMPONENTE
   ***********************************/

  public datos_monitoreo: {
    operacion: string;
    id_monitoreo: number;
    fid_compromiso: number;
    etapa: string;
    sub_etapa: string;
    tipo_financiamiento: string;
    tarea: string;
    fecha_inicio: string;
    fecha_fin: string;
    estado_monitoreo: string;
    usuario_registro: string;
    id_estado: number;
  };
  public btnRegistra = false;
  public btnEdita = false;

  public pnlBandeja: boolean = false;
  public pnlFormulario: boolean = false;

  public camposHabilitados: {};

  public id_compromiso: any;
  public sTipoFinanciamiento = false;

  public dts_monitoreo: any;
  public dts_etapasevaluacion: any;
  public dts_etapas: any;
  public dts_subetapas: any;
  public dts_tf: any;
  public grafica = false;
  public flagTf = false;
  public m_tipofinanciamiento: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _monitoreo: MonitoreoCompromisoService,

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

    this.datos_monitoreo = {
      operacion: "",
      id_monitoreo: 0,
      fid_compromiso: 0,
      tipo_financiamiento: "",
      etapa: "",
      sub_etapa: "",
      tarea: "",
      fecha_inicio: "",
      fecha_fin: "",
      estado_monitoreo: "",
      usuario_registro: "",
      id_estado: 0,
    };
  }

  ngOnInit() {
    console.log("REGISTRO", this.dts_registro);
    this.id_compromiso = this.dts_registro.id_compromiso;
    this.mask_numerodecimal = new Inputmask("9{1,9}.9{1,2}");
    this.mask_gestion = new Inputmask("9999");

    this.listaEtapasEvaluacion();
    this.obtenerConexion();
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
    this.s_usu_area = this.dtsDatosConexion.s_usu_area;
  }
  enviarRespuestaPadre(opcion) {
    this.pnlBandeja = false;
    this.pnlFormulario = false;
    this.limpiaDatos();
    this.respuestaPadre.emit(opcion);
  }
  listaMonitoreoCompromiso() {
    this.dts_monitoreo = [];

    this._monitoreo.listaMonitoreoCompromiso(this.id_compromiso).subscribe(
      (result: any) => {
        console.log("resultado", result);
        if (Array.isArray(result) && result.length > 0) {
          this.dts_monitoreo = result;
          let tf = alasql(
            `SELECT tipo_financiamiento FROM  ? where tipo_financiamiento is not null and id_estado=1 `,
            [this.dts_monitoreo]
          )[0].tipo_financiamiento;
          console.log("TIPO_F===>", tf);
          this.m_tipofinanciamiento = tf;
          this.datos_monitoreo.tipo_financiamiento =
            tf != undefined ? tf : null;
          this.sTipoFinanciamiento = tf != undefined ? true : false;
          console.log("tf==>", this.sTipoFinanciamiento);
          this.buscaEtapas();
          this.grafica = true;
          $("#btnNuevo").show();
        } else {
          if (
            this.camposHabilitados["_solicitud_administrador"] == false ||
            this.camposHabilitados["_administrador_plataforma"] == false
          ) {
            this.flagTf = true;
            $("#btnNuevo").show();
          } else {
            this.flagTf = false;
            $("#btnNuevo").hide();
          }

          this.sTipoFinanciamiento = false;
          this.grafica = false;
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
    if (string == "VISTA_MONITOREO") {
      this.limpiaDatos();
      this.pnlFormulario = false;
      this.pnlBandeja = true;
      this.btnRegistra = false;
      this.btnEdita = false;
    }
    if (string == "LISTA_MONITOREO") {
      console.log("ACCION", string);
      this.pnlFormulario = false;
      this.pnlBandeja = true;
      this.btnRegistra = false;
      this.btnEdita = false;
      this.listaMonitoreoCompromiso();
      setTimeout(() => {
        this.limpiaDatos();
      }, 60);
    }
    if (string == "NUEVO_MONITOREO") {
      console.log("ACCION", string);
      this.pnlFormulario = true;
      this.pnlBandeja = false;
      this.datos_monitoreo.operacion = "I";
      this.datos_monitoreo.fid_compromiso = this.dts_registro.id_compromiso;
      this.datos_monitoreo.usuario_registro = this.s_usu_id;
      this.datos_monitoreo.id_estado = 1;
      this.btnRegistra = true;
      this.btnEdita = false;
      console.log(this.datos_monitoreo);
    }
    if (string == "EDITA_MONITOREO") {
      console.log("ACCION", string);
      this.pnlFormulario = true;
      this.pnlBandeja = false;
      this.btnRegistra = false;
      this.btnEdita = true;
      this.datos_monitoreo.operacion = "U";
      this.datos_monitoreo.id_monitoreo = dts.id_monitoreo;
      this.datos_monitoreo.fid_compromiso = dts.fid_compromiso;
      this.datos_monitoreo.tipo_financiamiento = dts.tipo_financiamiento;
      this.datos_monitoreo.etapa = dts.etapa;
      this.datos_monitoreo.sub_etapa = dts.sub_etapa;
      this.datos_monitoreo.tarea = dts.tarea;
      this.datos_monitoreo.fecha_inicio = moment(dts.fecha_inicio)
        .format("YYYY-MM-DD")
        .toString();
      this.datos_monitoreo.fecha_fin = moment(dts.fecha_fin)
        .format("YYYY-MM-DD")
        .toString();
      this.datos_monitoreo.estado_monitoreo = dts.estado_monitoreo;
      this.datos_monitoreo.usuario_registro = this.s_usu_id;
      this.datos_monitoreo.id_estado = 1;
      console.log(this.datos_monitoreo);
      this.buscaEtapas();
      this.buscarSubEtapa();
    }
    if (string == "ELIMINA_MONITOREO") {
      console.log("ACCION", string);
      this.pnlFormulario = false;
      this.pnlBandeja = true;
      this.datos_monitoreo.operacion = "D";
      this.datos_monitoreo.id_monitoreo = dts.id_monitoreo;
      this.datos_monitoreo.fecha_inicio = moment()
        .format("YYY-MM-DD")
        .toString();
      this.datos_monitoreo.fecha_fin = moment().format("YYY-MM-DD").toString();
      this.datos_monitoreo.usuario_registro = this.s_usu_id;
      this.datos_monitoreo.id_estado = 0;
      console.log(this.datos_monitoreo);
      setTimeout(() => {
        this.EliminaMonitoreo();
      }, 50);
    }
  }
  listaEtapasEvaluacion() {
    this.dts_etapasevaluacion = [];

    this._monitoreo.listaEtapasEvaluacion(this.id_compromiso).subscribe(
      (result: any) => {
        

        if (Array.isArray(result) && result.length > 0) {
          this.dts_etapasevaluacion = result;
          console.log("resultado==>", this.dts_etapasevaluacion);
          this.dts_tf = alasql(
            `SELECT tipo_financiamiento FROM  ? where tipo_financiamiento is not null GROUP BY tipo_financiamiento `,
            [this.dts_etapasevaluacion]
          );

          console.log("LISTA ETAPAS", this.dts_etapasevaluacion);
          console.log("resultado TF", this.dts_tf);
          this.paneles("LISTA_MONITOREO");
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
  buscaEtapas() {
    if (this.camposHabilitados["_administrador_plataforma"] == false) {
      this.dts_etapas = alasql(
        `SELECT id_etapa,etapa FROM  ? where tipo_financiamiento=? `,
        [this.dts_etapasevaluacion, this.datos_monitoreo.tipo_financiamiento]
      );
    } else {
      if (this.camposHabilitados["_proyectista_administrador"] == false) {
        this.dts_etapas = alasql(
          `SELECT id_etapa,etapa FROM  ? where tipo_financiamiento=? AND unidad=? and etapa=?`,
          [
            this.dts_etapasevaluacion,
            this.datos_monitoreo.tipo_financiamiento,
            this.s_usu_area,
            "EVALUACIÓN TÉCNICA",
          ]
        );
      } else {
        this.dts_etapas = alasql(
          `SELECT id_etapa,etapa FROM  ? where tipo_financiamiento=? AND unidad=? AND etapa!=?`,
          [
            this.dts_etapasevaluacion,
            this.datos_monitoreo.tipo_financiamiento,
            this.s_usu_area,
            "EVALUACIÓN TÉCNICA",
          ]
        );
      }
    }

    console.log("etapas===>", this.dts_etapas);
  }
  buscarSubEtapa() {
    this.dts_subetapas = [];
    let dato = this.dts_etapasevaluacion.filter(
      (item) =>
        item.etapa == this.datos_monitoreo.etapa &&
        item.tipo_financiamiento == this.datos_monitoreo.tipo_financiamiento &&
        item.unidad == this.s_usu_area
    )[0].id_etapa;
    console.log("subetapa=>", dato);
    this.dts_subetapas = alasql(
      `SELECT etapa,orden FROM  ? where id_padre=? `,
      [this.dts_etapasevaluacion, dato]
    );
    console.log("LISTA SUBETAPAS", this.dts_subetapas);
  }
  limpiaDatos() {
    this.datos_monitoreo.operacion = "";
    this.datos_monitoreo.id_monitoreo = 0;
    this.datos_monitoreo.fid_compromiso = 0;
    //this.datos_monitoreo.tipo_financiamiento = "";
    this.datos_monitoreo.etapa = "";
    this.datos_monitoreo.sub_etapa = "";
    this.datos_monitoreo.tarea = "";
    this.datos_monitoreo.fecha_inicio = "";
    this.datos_monitoreo.fecha_fin = "";
    this.datos_monitoreo.estado_monitoreo = "";
    this.datos_monitoreo.usuario_registro = "";
    this.datos_monitoreo.id_estado = 1;
  }
  EditaMonitoreo() {
    console.log("DATOS FORMULARIO", this.datos_monitoreo);
    this.datos_monitoreo.fecha_fin =
      this.datos_monitoreo.fecha_fin == ""
        ? null
        : moment(this.datos_monitoreo.fecha_fin)
            .format("YYYY-MM-DD")
            .toString();

    if (
      this.datos_monitoreo.fecha_fin == null ||
      this.datos_monitoreo.fecha_fin == "" ||
      this.datos_monitoreo.fecha_fin == "Fecha inválida"
    ) {
      if (this.datos_monitoreo.estado_monitoreo == "EN EJECUCION") {
        this.crudContrato(this.datos_monitoreo);
      } else {
        this.prop_tipomsg = "modal_warning";
        this.prop_msg = "DEBE REGISTRAR LA FECHA FIN";
        this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
      }
    } else {
      if (this.datos_monitoreo.fecha_fin < this.datos_monitoreo.fecha_inicio) {
        this.prop_tipomsg = "modal_warning";
        this.prop_msg = "FECHA FIN NO PUEDE SER MENOR A LA FECHA INICIO";
        this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
        return;
      }
      if (this.datos_monitoreo.estado_monitoreo == "CUMPLIDO") {
        this.crudContrato(this.datos_monitoreo);
      } else {
        this.prop_tipomsg = "modal_warning";
        this.prop_msg = "EL ESTADO DE MONITOREO DEBE MODIFICARSE A CUMPLIDO";
        this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
      }
    }
    //this.crudContrato(this.datos_monitoreo);
  }
  InsertaMonitoreo() {
    console.log("DATOS FORMULARIO", this.datos_monitoreo);
    console.log("ESTADO FLAG TF", this.flagTf);

    this.datos_monitoreo.fecha_fin =
      this.datos_monitoreo.fecha_fin == ""
        ? null
        : moment(this.datos_monitoreo.fecha_fin)
            .format("YYYY-MM-DD")
            .toString();

    if (
      this.datos_monitoreo.fecha_fin == null ||
      this.datos_monitoreo.fecha_fin == "" ||
      this.datos_monitoreo.fecha_fin == "Fecha inválida"
    ) {
      if (this.flagTf == true) {
        console.log("ENTRA AL FLAG TF");
        this.datos_monitoreo.fecha_inicio =
          this.datos_monitoreo.fecha_inicio == ""
            ? null
            : moment(this.datos_monitoreo.fecha_inicio)
                .format("YYYY-MM-DD")
                .toString();
        this.datos_monitoreo.estado_monitoreo = "EN EJECUCION";
        this.datos_monitoreo.etapa = "EVALUACIÓN PREVIA";
        this.datos_monitoreo.sub_etapa = "COMPLEMENTACIÓN DEL PROYECTO";
      }

      setTimeout(() => {
        if (this.datos_monitoreo.estado_monitoreo == "EN EJECUCION") {
          this.crudContrato(this.datos_monitoreo);
        } else {
          this.prop_tipomsg = "modal_warning";
          this.prop_msg = "DEBE REGISTRAR LA FECHA FIN";
          this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
        }
      }, 20);
    } else {
      console.log("POR FALSE  FLAG TF");
      if (this.datos_monitoreo.fecha_fin < this.datos_monitoreo.fecha_inicio) {
        this.prop_tipomsg = "modal_warning";
        this.prop_msg = "FECHA FIN NO PUEDE SER MENOR A LA FECHA INICIO";
        this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
        return;
      }
      if (this.datos_monitoreo.estado_monitoreo == "CUMPLIDO") {
        this.crudContrato(this.datos_monitoreo);
      } else {
        this.prop_tipomsg = "modal_warning";
        this.prop_msg = "EL ESTADO DE MONITOREO DEBE MODIFICARSE A CUMPLIDO";
        this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
      }
    }
  }
  EliminaMonitoreo() {
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
        console.log("DATOS FORMULARIO", this.datos_monitoreo);
        this.crudContrato(this.datos_monitoreo);
      }
    });
  }
  crudContrato(dts) {
    console.log("INGRESA AL GRUD DATOS===>", dts);
    this._monitoreo.crudMonitoreo(dts).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          console.log("entra==>", result);
          this.prop_msg = result[0].message;
          this.prop_tipomsg = result[0].msg_estado;
          this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
          this.paneles("LISTA_MONITOREO");
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
        this.cargando = false;
      }
    );
  }
  CambiaTf() {
    this.datos_monitoreo.operacion = "CAMBIA_TF";
    this.datos_monitoreo.fid_compromiso = this.id_compromiso;
    this.datos_monitoreo.usuario_registro = this.s_usu_id;
    this.datos_monitoreo.fecha_fin =
      this.datos_monitoreo.fecha_fin == ""
        ? null
        : moment(this.datos_monitoreo.fecha_fin)
            .format("YYYY-MM-DD")
            .toString();
    this.datos_monitoreo.fecha_inicio =
      this.datos_monitoreo.fecha_inicio == ""
        ? null
        : moment(this.datos_monitoreo.fecha_inicio)
            .format("YYYY-MM-DD")
            .toString();

    if (this.m_tipofinanciamiento == "CIFE") {
      this.datos_monitoreo.tipo_financiamiento = "CIF";
    }
    if (this.m_tipofinanciamiento == "CIF") {
      this.datos_monitoreo.tipo_financiamiento = "CIFE";
    }

    swal2({
      title: "Advertencia!!!",
      text: `Realmente desea cambiar el Tipo de Financiamiento?`,
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d9534f",
      cancelButtonColor: "#f0ad4e",
      customClass: "swal2-popup",
      confirmButtonText: "Confirmar!",
    }).then((result) => {
      if (result.value) {
        console.log("DATOS FORMULARIO", this.datos_monitoreo);
        this.crudContrato(this.datos_monitoreo);
      }
    });
  }
}
