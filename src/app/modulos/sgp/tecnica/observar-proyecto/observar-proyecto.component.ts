import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Globals } from "../../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { AutenticacionService } from "../../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../../seguridad/mensajes/mensajes.component";
import { AccesosRolComponent } from "../../accesos-rol/accesos-rol.component";
import { SgpService } from "../../sgp.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important
@Component({
  selector: "app-observar-proyecto",
  templateUrl: "./observar-proyecto.component.html",
  styleUrls: ["./observar-proyecto.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
    AccesosRolComponent,
  ],
})
export class ObservarProyectoComponent implements OnInit {
  @Input("inputDts") inputDts: any;
  @Output() enviaPadre = new EventEmitter<string>();
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
  public camposHabilitados: {};
  /*VARIABLES DEL COMPONENTE */
  public m_observacionProyecto: any;
  public dts_ListaEstadoProyecto: any;
  public dts_ListaObsrvacionProyecto: any;
  public pnl_formulario = false;

  public dts_formulario: {
    id_proyecto: number;
    id_estado: number;
    observacion: string;
    id_usuario: string;
  };
  public respuesta: any = {
    ID_PROYECTO: "",
    ESTADO: "",
    ACCION: "",
  };

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _seguimiento: SgpService,

    private globals: Globals,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent,
    private _accesos: AccesosRolComponent,
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
    this.dts_formulario = {
      id_proyecto: 0,
      id_estado: 0,
      observacion: "",
      id_usuario: "",
    };
  }

  ngOnInit() {
    this.obtenerConexion()
      .then(() => {
        return this._accesos.accesosRestriccionesxRolV2(this.s_usu_id);
      })
      .then((data) => {
        this.camposHabilitados = data;

        console.log("Adm Roles===>", this.camposHabilitados);
        this.PreRegistrarObservacion();
        this.ListaEstadoProyecto();
      });
  }
  cambiosFormulario() {
    console.log("descuento on change", this.dts_formulario);
    if (
      this.dts_formulario.id_estado == 288 &&
      this.dts_formulario.observacion != ""
    ) {
      $("#m_estado_proyecto").prop("disabled", true);
      $("#btn_registro_observacion").prop("disabled", false);
    }
    if (
      this.dts_formulario.id_estado == 288 &&
      this.dts_formulario.observacion.length == 0
    ) {
      $("#m_estado_proyecto").prop("disabled", false);
      $("#m_observacionProyecto").prop("disabled", false);
      $("#btn_registro_observacion").prop("disabled", true);
    }
    if (this.dts_formulario.id_estado != 288) {
      $("#m_estado_proyecto").prop("disabled", false);
      this.dts_formulario.observacion = "";
      $("#m_observacionProyecto").prop("disabled", true);
      $("#btn_registro_observacion").prop("disabled", false);
    }
  }
  obtenerConexion() {
    return new Promise((resolve, reject) => {
      this.dtsDatosConexion = JSON.parse(localStorage.getItem("dts_con"));
      this.dts_roles_usuario = JSON.parse(localStorage.getItem("dts_rol"));
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

  PreRegistrarObservacion() {
    console.log("registro", this.inputDts);
    console.log("idProy", this.inputDts._id_proyecto);
    console.log("ID USUARIO===>", this.s_usu_id);

    if (this.dts_ListaObsrvacionProyecto == undefined) {
      console.log("OBSERVACION");
    }
    this.pnl_formulario = true;
    if (this.inputDts._estado_proyecto == "288") {
      //PROYECTO CONCLUIDO CON OBSERVACION
      this.obtieneObservacion(this.inputDts._id_proyecto).then((dts) => {
        this.dts_ListaObsrvacionProyecto = dts;
        console.log("ListaObservaciones", this.dts_ListaObsrvacionProyecto);

        this.dts_formulario.id_proyecto = this.inputDts._id_proyecto;
        this.dts_formulario.id_estado = this.inputDts._estado_proyecto;
        if (this.dts_ListaObsrvacionProyecto != undefined) {
          this.dts_formulario.observacion =
            this.dts_ListaObsrvacionProyecto.observacion;
        } else {
          this.dts_formulario.observacion = "";
        }
        this.dts_formulario.id_usuario = this.s_usu_id;
        this.cambiosFormulario();
      });
    } else {
      this.dts_formulario.id_proyecto = this.inputDts._id_proyecto;
      this.dts_formulario.id_estado = this.inputDts._estado_proyecto;
      this.dts_formulario.id_usuario = this.s_usu_id;
      this.dts_formulario.observacion = "";
      this.cambiosFormulario();
    }
  }
  RegistrarObservacion() {
    this._seguimiento.regitraProyectoObservado(this.dts_formulario).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          if (result[0].message && !result[0].message.startsWith("ERROR")) {
            this.prop_msg = result[0].message;
            this.prop_tipomsg = "success";
            this._msg.formateoMensaje("modal_success", this.prop_msg);
            var dts = this.dts_ListaEstadoProyecto.filter(
              (item) => item.id_detalle == this.dts_formulario.id_estado
            );
            this.respuesta.ID_PROYECTO = this.dts_formulario.id_proyecto;
            this.respuesta.ESTADO = dts[0].descripciondetalleclasificador;
            this.respuesta.ACCION = "REGISTRADO";
            this.metodoenviaPadre(this.respuesta);
          } else {
            this.prop_msg = "Alerta: " + result[0].message;
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        } else {
          this.prop_msg = "Alerta: Error al registrar la planilla";
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

  ListaEstadoProyecto() {
    this._seguimiento.listaClasificador(9).subscribe(
      (result: any) => {
        this.dts_ListaEstadoProyecto = result;
        console.log("Estados===>", this.dts_ListaEstadoProyecto);
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la petición BUSQUEDA5");
        }
      }
    );
  }
  obtieneObservacion(id_proyecto) {
    return new Promise((resolve, reject) => {
      this._seguimiento.obtieneProyectoObservado(id_proyecto).subscribe(
        (result: any) => {
          resolve(result[0]);
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            console.log(this.errorMessage);
            alert("Error en la petición BUSQUEDA5");
          }
          reject("Error en la petición BUSQUEDA5");
        }
      );
    });
  }
  metodoenviaPadre(dts?) {
    console.log("dato a eliminar", dts);
    this.enviaPadre.emit(dts);
  }
}
