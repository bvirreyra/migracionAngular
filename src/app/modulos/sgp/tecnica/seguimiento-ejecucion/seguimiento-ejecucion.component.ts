import { DatePipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Inputmask from "inputmask";
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
  selector: "app-seguimiento-ejecucion",
  templateUrl: "./seguimiento-ejecucion.component.html",
  styleUrls: ["./seguimiento-ejecucion.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
  ],
})
export class SeguimientoEjecucionComponent implements OnInit {
  @Input("inputDts") inputDts: string;
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

  public pnl_listaproyecto = false;
  public pnl_supervision = false;
  public pnl_ampliacionplazo = false;

  public pnl_tecnica = false;
  public pnl_financiero = false;
  public pnl_legal = false;
  public habilita_formulario = false;
  public habilita_porcentaje = true;
  /************************************
   * VARIABLES DEL COMPONENTE
   ***********************************/
  public dts_listasupervision: any;
  public dts_listaempresaversion: any;
  public nombre_proyecto: any;
  public ultimoPorcentaje = 0;
  public habilitaAdicion = false;
  public nro_version = 0;
  public porcentaje_fisico = false;
  public porcentaje_financiero = false;
  public habilitaGuardar = false;
  public habilitaModificar = false;
  /****************DATOS FORMULARIO SEGUIMIENTO***************/
  public dts_estadoProyecto: any;
  public dts_estadoCumplimiento: any;
  public dts_seguimientoEjecucion: any;
  public dts_unidades = [
    "UNIDAD ADMINISTRATIVA FINANCIERA",
    "UNIDAD JURIDICA",
    "UNIDAD TECNICA",
  ];
  public seguimiento: {
    idseguimientoejecucion: any;
    idproyecto: any;
    idsgp: any;
    nroversion: any;
    avancefisico: any;
    avancefinanciero: any;
    estadoproyecto: any;
    unidad: any;
    situacionactual: any;
    tareaspendientes: any;
    responsable: any;
    fechafin: any;
    estadocumplimiento: any;
    usrregistro: any;
    idestado: any;
    operacion: any;
    tipo: any;
    fechainicio: any;
    nombreproyecto: any;
    departamento: any;
    provincia: any;
    municipio: any;
  };
  /***********************************************************/

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
    // this.paneles("LISTA_SUPERVISION");
    console.log(this.inputDts);
    this.nro_version = this.inputDts["_nro_version"];
    this.obtenerConexion();
    /**METODOS DE SEGUIMIENTO**/
    this.seguimiento = {
      idseguimientoejecucion: 0,
      idproyecto: 0,
      idsgp: 0,
      nroversion: 0,
      avancefisico: 0,
      avancefinanciero: 0,
      estadoproyecto: "",
      unidad: "",
      situacionactual: "",
      tareaspendientes: "",
      responsable: "",
      fechafin: "",
      estadocumplimiento: "",
      usrregistro: 0,
      idestado: 0,
      operacion: "I",
      tipo: "NN",
      fechainicio: "",
      nombreproyecto: "",
      departamento: "",
      provincia: "",
      municipio: "",
    };
    this.listaEstadoProyecto(22);
    this.listaEstadoCumplimiento(23);
    this.lista_seguimiento(this.inputDts["_id_proyecto"]);
    this.mask_numero = new Inputmask("9{1,3}");
    // this.mask_cite = new Inputmask("9{1,3}");
    this.cargarmascaras();
    /**FIN METODOS DE SEGUIMIENTO**/
  }
  cargarmascaras() {
    // var fisico = document.getElementById("avancefisico");
    // this.mask_numero.mask(fisico);
    // var financiero = document.getElementById("avancefinanciero");
    // this.mask_numero.mask(financiero);
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
  paneles(string) {
    if (string == "LISTA_SUPERVISION") {
      $("#pnl_listasupervisiones").show();
      $("#pnl_nuevasupervision").hide();
    }
    if (string == "NUEVA_SUPERVISION") {
      $("#modalSupervision").modal("show");
    }
  }
  /*******************************************************************************/
  /*FORMULARIO SEGUIMIENTO
  /*******************************************************************************/
  listaEstadoProyecto(idtipoclasificador) {
    this._seguimiento.listaClasificador(idtipoclasificador).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_estadoProyecto = result;
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
  listaEstadoCumplimiento(idtipoclasificador) {
    this._seguimiento.listaClasificador(idtipoclasificador).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_estadoCumplimiento = result;
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

  limpiar() {
    this.seguimiento = {
      idseguimientoejecucion: 0,
      idproyecto: 0,
      idsgp: 0,
      nroversion: 0,
      avancefisico: 0,
      avancefinanciero: 0,
      estadoproyecto: "",
      unidad: "",
      situacionactual: "",
      tareaspendientes: "",
      responsable: "",
      fechafin: "",
      estadocumplimiento: "",
      usrregistro: 0,
      idestado: 0,
      operacion: "I",
      tipo: "NN",
      fechainicio: "",
      nombreproyecto: "",
      departamento: "",
      provincia: "",
      municipio: "",
    };
  }

  lista_seguimiento(id_proy) {
    this.cargando = true;
    this.dts_seguimientoEjecucion = [];
    this.limpiar();
    if (this.dts_unidades.indexOf(this.s_usu_area) < 0) {
      this.prop_msg = "Alerta: usted no cuenta un área habilitada";
      this._msg.formateoMensaje("modal_info", this.prop_msg);
      this.habilita_formulario = false;
      return;
    }
    this._seguimiento.listaSeguimientoEjecucionSgp(id_proy).subscribe(
      (result: any) => {
        
        this.habilita_formulario = true;
        if (Array.isArray(result) && result.length > 0) {
          this.dts_seguimientoEjecucion = this._fun.RemplazaNullArray(result);
          let filtrado = this.dts_seguimientoEjecucion.filter((elemento) => {
            return elemento.unidad == this.s_usu_area;
          });
          if (filtrado.length <= 0) {
            filtrado = this.dts_seguimientoEjecucion.filter((elemento) => {
              return elemento.unidad == "NUEVO";
            });
          }

          if (filtrado.unidad == "UNIDAD JURIDICA") {
            this.habilita_porcentaje = false;
          }

          for (let index = 0; index < filtrado.length; index++) {
            let id_seguimiento = filtrado[index]["id_seguimientoejecucion"];

            this.seguimiento.idseguimientoejecucion =
              filtrado[index]["id_seguimientoejecucion"];
            this.seguimiento.idproyecto = filtrado[index]["id_proyecto"];
            this.seguimiento.idsgp = filtrado[index]["id_sgp"];
            this.seguimiento.nroversion = filtrado[index]["nroversion"];
            this.seguimiento.avancefisico = filtrado[index]["avance_fisico"];
            this.seguimiento.avancefinanciero =
              filtrado[index]["porcentaje_avance"];
            this.seguimiento.estadoproyecto =
              filtrado[index]["estado_proyecto"];
            this.seguimiento.unidad = this.s_usu_area;
            this.seguimiento.situacionactual =
              filtrado[index]["situacion_actual"];
            this.seguimiento.tareaspendientes =
              filtrado[index]["tareas_pendientes"];
            this.seguimiento.responsable = filtrado[index]["responsable"];
            this.seguimiento.fechafin = filtrado[index]["fecha_fin"].substr(
              0,
              10
            );
            this.seguimiento.estadocumplimiento =
              filtrado[index]["estado_cumplimiento"];
            (this.seguimiento.usrregistro = this.s_usu_id),
              (this.seguimiento.idestado = filtrado[index]["id_estado"]);
            (this.seguimiento.operacion = id_seguimiento == 0 ? "I" : "U"),
              (this.seguimiento.tipo = "NN"),
              (this.seguimiento.fechainicio = filtrado[index][
                "fecha_inicio"
              ].substr(0, 10)),
              (this.seguimiento.nombreproyecto =
                filtrado[index]["nombreproyecto"]);
            this.seguimiento.departamento = filtrado[index]["departamento"];
            this.seguimiento.provincia = filtrado[index]["provincia"];
            this.seguimiento.municipio = filtrado[index]["municipio"];
            console.log(this.seguimiento);
            if (this.seguimiento.idseguimientoejecucion > 0) {
              console.log("ENTRO AQUIIIIIIII 1");
              this.habilitaGuardar = false;
              this.habilitaModificar = true;
            } else {
              console.log("ENTRO AQUIIIIIIII 2");
              this.habilitaGuardar = true;
              this.habilitaModificar = false;
            }
          }
        } else {
          this.prop_msg = "Alerta: No existe ficha técnica registrada";
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
          this.habilitaGuardar = false;
          this.habilitaModificar = false;
        }
      }
    );
  }

  insertaSeguimientoEjecucion() {
    this.cargando = true;

    if (this.seguimiento.avancefisico > 100) {
      this.prop_msg =
        "Alerta: El porcentaje de avance físico no puede ser mayor al 100%";
      this._msg.formateoMensaje("modal_info", this.prop_msg);
      return;
    }
    if (this.seguimiento.avancefinanciero > 100) {
      this.prop_msg =
        "Alerta: El porcentaje de avance financiero no puede ser mayor al 100%";
      this._msg.formateoMensaje("modal_info", this.prop_msg);
      return;
    }

    this._seguimiento.insertaSeguimientoEjecucion(this.seguimiento).subscribe(
      (result: any) => {
        
        this.prop_tipomsg = result.estado.includes("Correcto")
          ? "modal_success"
          : "modal_warning";
        this.prop_msg = result.estado.includes("Correcto")
          ? "Se realizo correctamente el registro"
          : "No se pudo realizar el registro";
        this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
        this.lista_seguimiento(this.inputDts["_id_proyecto"]);
        this.cargando = false;
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
          this.lista_seguimiento(this.inputDts["_id_proyecto"]);
        }
        this.cargando = false;
      }
    );
  }

  actualizaSeguimientoEjecucion() {
    this.cargando = true;

    if (this.seguimiento.avancefisico > 100) {
      this.prop_msg =
        "Alerta: El porcentaje de avance físico no puede ser mayor al 100%";
      this._msg.formateoMensaje("modal_info", this.prop_msg);
      return;
    }
    if (this.seguimiento.avancefinanciero > 100) {
      this.prop_msg =
        "Alerta: El porcentaje de avance financiero no puede ser mayor al 100%";
      this._msg.formateoMensaje("modal_info", this.prop_msg);
      return;
    }

    this.dts_listasupervision = [];

    this._seguimiento.actualizaSeguimientoEjecucion(this.seguimiento).subscribe(
      (result: any) => {
        
        console.log(result);
        this.prop_tipomsg = result.estado.includes("Correcto")
          ? "modal_success"
          : "modal_warning";
        this.prop_msg = result.estado.includes("Correcto")
          ? "Se actualizo correctamente el registro"
          : "No se pudo actualizar el registro";
        this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
        this.lista_seguimiento(this.inputDts["_id_proyecto"]);
        this.cargando = false;
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
          this.lista_seguimiento(this.inputDts["_id_proyecto"]);
        }
        this.cargando = false;
      }
    );
  }
  modificacion() {
    console.log(this.seguimiento);
  }
  /*******************************************************************************/
  /*FIN FORMULARIO SEGUIMIENTO
  /*******************************************************************************/
}
