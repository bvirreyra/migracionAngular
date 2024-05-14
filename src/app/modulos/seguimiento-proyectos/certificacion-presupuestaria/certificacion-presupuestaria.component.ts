import { DatePipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Globals } from "../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { MensajesComponent } from "@mensajes/mensajes.component";
import * as moment from "moment";
import { NgSelect2Module } from "ng-select2";
import { HerraminetasService } from "../../../herramientas/herraminetas.service";
import { SeguimientoProyectosService } from "../../seguimiento-proyectos/seguimiento-proyectos.service";
import { SeguimientoService } from "../../seguimiento/seguimiento.service";
import { AutenticacionService } from "../../seguridad/autenticacion.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-certificacion-presupuestaria",
  templateUrl: "./certificacion-presupuestaria.component.html",
  styleUrls: ["./certificacion-presupuestaria.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SeguimientoProyectosService,
    NgSelect2Module,
    HerraminetasService,
  ],
})
export class CertificacionPresupuestariaComponent implements OnInit {
  @Input("inputDts") inputDts: any;
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
  public confCP: {};

  inputNombre: string;
  inputAccion: string;
  public m_fechainscripcionpresupuestaria: any = "";
  toastr: any;
  dts_mae: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private globals: Globals,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent,
    private datePipe: DatePipe,
    private base64: ImgBase64Globals,
    private _seguimiento: SeguimientoProyectosService,
    private _seg: SeguimientoService,
    private _herramientas: HerraminetasService
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
    this.confCP = {
      inputTipoDocumento: "certificacion_presupuestaria",
      inputCodigoProyecto: this.inputDts.codigo_carpeta,
      inputVista: false,
      inputTipoImagen: "sin",
      inputSrc: "",
      inputNombre: "",
      inputAccion: "SUBIR_ARCHIVO",
    };
    console.log("datosDts", this.inputDts);
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
  refrescaBandeja(dts) {
    console.log("evento hijo: ", dts);
    let registro_archivo = {};
    let registro_cp = {
      operacion: "CERTIFICACION_PRESUPUESTARIA",
      fecha_inscripcion: moment(this.m_fechainscripcionpresupuestaria)
        .format("YYYY-MM-DD")
        .toString(),
      id_seguimiento: this.inputDts.id_proyecto,
      nombre_documento: dts.NOM_FILE,
      ci_usuario: this.s_ci_user,
    };
    this.confCP = {
      inputTipoDocumento: "certificacion_presupuestaria",
      inputCodigoProyecto: this.inputDts.codigo_carpeta,
      inputVista: false,
      inputTipoImagen: "documento",
      inputSrc: "",
      inputNombre: dts.NOM_FILE,
      inputAccion: dts.ACCION_POST,
    };
    if (dts.ACCION == "INSERTA") {
      registro_archivo = {
        operacion: "I",
        id_archivo: null,
        fid_proyecto: this.inputDts.id_proyecto_siga,
        fid_seguimiento: this.inputDts.id_proyecto,
        tipo_documento: dts.TIPO_DOCUMENTO,
        nombre_archivo: dts.NOM_FILE,
        usuario_registro: this.s_usu_id,
        id_estado: 1,
      };
      console.log("INSERTA====>", registro_archivo);
    }
    if (dts.ACCION == "EDITA") {
      registro_archivo = {
        operacion: "U",
        id_archivo: null,
        fid_proyecto: this.inputDts.id_proyecto_siga,
        fid_seguimiento: this.inputDts.id_proyecto,
        tipo_documento: dts.TIPO_DOCUMENTO,
        nombre_archivo: dts.NOM_FILE,
        usuario_registro: this.s_usu_id,
        id_estado: 1,
      };
      console.log("EDITAR====>", registro_archivo);
    }
    if (dts.ACCION == "ELIMINA") {
      registro_archivo = {
        operacion: "D",
        id_archivo: null,
        fid_proyecto: this.inputDts.id_proyecto_siga,
        fid_seguimiento: this.inputDts.id_proyecto,
        tipo_documento: dts.TIPO_DOCUMENTO,
        nombre_archivo: dts.NOM_FILE,
        usuario_registro: this.s_usu_id,
        id_estado: 1,
      };
      this.confCP = {
        inputTipoDocumento: "certificacion_presupuestaria",
        inputCodigoProyecto: this.inputDts.codigo_carpeta,
        inputVista: false,
        inputTipoImagen: "sin",
        inputSrc: "",
        inputNombre: "",
        inputAccion: "SUBIR_ARCHIVO",
      };
      console.log("ELMINA====>", registro_archivo);
    }

    this.crudRegistroArchivoAdjunto(registro_archivo)
      .then((dts) => {
        console.log("respuesta si se subio el archivo", dts);
        if (dts == 1) {
          return this.registraCertificacionPresupuestaria(registro_cp);
        }
      })
      .then((dts) => {
        if (dts["msg_estado"] == "modal_success") {
          this.dts_mae = dts;
          console.log("respuseta del password de la mae===>", this.dts_mae);
          console.log("usuario mae===>", this.dts_mae["usuario_mae"]);
          console.log("password mae===>", this.dts_mae["password_mae"]);
          console.log(
            "codigo de acceso===>",
            this.dts_mae["codigo_acceso_proyecto"]
          );
          if (this.inputDts.tipo == "CIF") {
            return this.obtenerConfCorreo(6);
          }
        }
      })
      .then((dts) => {
        if (dts != undefined) {
          console.log("datos conf correo", dts);
          let conf_correo = {
            servidor: dts["servidor"],
            puerto: dts["puerto"],
            usuario: dts["usuario"],
            clave: dts["clave"],
            cuenta_origen: dts["cuenta_origen"],
            para: this.dts_mae["correo_mae"],
            asunto: dts["asunto"],
            mensaje: dts["mensaje"]
              .replace("$USUARIO_MAE", this.dts_mae["usuario_mae"])
              .replace("$CODIGO_ACCESO", this.dts_mae["codigo_acceso_proyecto"])
              .replace("$PASS_MAE", this.dts_mae["password_mae"])
              .replace("$NOMBRE_PROYECTO", this.inputDts["nombre"]),
          };
          console.log("configuracion parametros correo==>", conf_correo);
          this.enviaCorreoMae(conf_correo);
        }
      });
  }
  obtenerConfCorreo(id_config_correo) {
    return new Promise((resolve, reject) => {
      this.cargando = true;
      this._seguimiento.obtenerConfCorreo(id_config_correo).subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            resolve(result[0]);
            this.prop_msg = result[0].message;
            this.prop_tipomsg = result[0].msg_estado;
            this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
            this.cargando = false;
          } else {
            this.cargando = false;
            reject(0);
          }
        },
        (error) => {
          this.cargando = false;
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg = "Error: No se pudo ejecutar el envio del correo";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        }
      );
    });
  }
  crudRegistroArchivoAdjunto(registro) {
    return new Promise((resolve, reject) => {
      console.log("ingresa a crud====>");
      this.cargando = true;
      this._seg.crudRegistroArchivoAdjunto(registro).subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            console.log("TIPO_DOCUMENTO====>", result);
            this.cargando = false;
            resolve(1);
          } else {
            this.cargando = false;
            reject(0);
          }
        },
        (error) => {
          this.cargando = false;
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
          reject(0);
        }
      );
    });
  }
  registraCertificacionPresupuestaria(dts) {
    return new Promise((resolve, reject) => {
      this.cargando = true;
      this._seguimiento.registraCertificacionPresupuestaria(dts).subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            resolve(result[0]);
            this.prop_msg = result[0].message;
            this.prop_tipomsg = result[0].msg_estado;
            this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
            this.cargando = false;
          } else {
            this.cargando = false;
            reject(0);
          }
        },
        (error) => {
          this.cargando = false;
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la fecha de la certificacion presupuestaria, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        }
      );
    });
  }
  enviaCorreoMae(config) {
    console.log("verificando servicio correo", config);
    this.cargando = true;
    this._herramientas.verificaEstadoCorreo(config).subscribe(
      (result: any) => {
        console.log("el result1", result);
        console.log("el result2", result["message"]);
        if (result["message"] == "Correo enviado satisfactoriamente!") {
          this.prop_msg = result["message"];
          this.prop_tipomsg = "modal_succes";
          this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
          this.cargando = false;
        } else {
          this.prop_msg =
            "No se obtuvo resultado del servicio de correo electronico";
          this.prop_tipomsg = "modal_danger";
          this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
          this.cargando = false;
        }
        this.cargando = false;
      },
      (error) => {
        this.prop_msg =
          "No se obtuvo resultado del servicio de correo electronico 2";
        this.prop_tipomsg = "modal_danger";
        this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
        this.cargando = false;
      }
    );
  }
}
