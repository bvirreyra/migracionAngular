import { DatePipe } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Globals } from "../../../global";

/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";

declare var moment: any;
declare var jQuery: any;
declare var $: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-upload-file",
  templateUrl: "./upload-file.component.html",
  styleUrls: ["./upload-file.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
  ],
})
export class UploadFileComponent implements OnInit, OnChanges {
  /**********************************************
   * VARIABLES DE ENTRADA Y SALIDA
   *********************************************/
  @Input("inputId") i_idregistro_file: string;
  @Input("inputTipoDocumento") i_tipodocumento_file: string;
  @Input("inputCodigoProy") i_codigoproy_file: string;
  @Input("inputVista") i_semaforo: string;
  @Input("inputTipoImagen") i_tipoimagen: string;
  @Input("inputSrc") i_src: string;
  @Input("inputNombre") i_nombre_file: string;
  @Input("inputAccion") i_accion: string;
  @Input("inputMarcado") i_marcado: number;
  @Input("inputEstadoBoton") i_estadoboton: boolean;
  @Input("inputBotonGuardar") i_btnGuardar: string;
  @Input("inputBotonDescargar") i_btnDescargar: string;
  @Input("inputBotonActualiar") i_btnActualizar: string;
  @Input("inputBotonEliminar") i_btnEliminar: string;
  @Input("inputEstiloBotones") idts_estiloBotones: any;
  @Output() enviaPadre = new EventEmitter<string>();

  message: string = "Hola Mundo!";

  /*VARIABLES PARA MASCARAS */
  public mask_numerodecimal: any;
  public mask_fecha: any;
  public mask_numero: any;
  public mask_gestion: any;
  public mask_miles: any;

  //variables para el compononete de mensajes
  public prop_msg: string;
  public prop_tipomsg: string;

  //variables de session y iniciales
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

  public accion: any;
  public m_nombre_file: any;
  public m_tipodocumento_file: any;
  public m_codigoproy_file: any;
  public inputArchivo: File;
  public file_empty: File;
  public archivoModel: any = {
    TIPO_DOCUMENTO: "",
    CODIGO: "",
    FILE: null,
    NOM_FILE: "",
  };

  public respuesta: any = {
    TIPO_DOCUMENTO: "",
    MENSAJE: "",
    NOM_FILE: "",
    RUTA: "",
    ID_REGISTRO: "",
    ACCION: "",
    PATH_COMPLETO: "",
  };

  public btn_subirarchivo = false;
  public btn_actualizararchivo = false;
  public btn_convertirbase64 = false;

  public accion_visualizar = true;
  public accion_visualizar_small = true;
  public accion_seleccionar = true;
  public accion_des_seleccionar = false;
  public accion_actualizar = false;
  public accion_visualizar_eliminar = true;

  /*****************************
   * ESTILO DE BOTONES
   *****************************/
  public m_styleBotonSubir: any;
  public m_styleBotonDescargar: any;
  public m_styleBotonActualizar: any;
  public m_styleBotonEliminar: any;
  public m_styleBotonMarcar: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
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
    // this.i_estadoboton=false;
  }
  ngOnChanges() {
    this.obtenerConexion();
    this.i_btnGuardar =
      this.i_btnGuardar == null ? "Guardar" : this.i_btnGuardar;
    this.i_btnEliminar =
      this.i_btnEliminar == null ? "Eliminar" : this.i_btnEliminar;
    this.i_btnActualizar =
      this.i_btnActualizar == null ? "Actualizar" : this.i_btnActualizar;
    this.i_btnDescargar =
      this.i_btnDescargar == null ? "Descargar" : this.i_btnDescargar;

    this.paneles(this.i_accion);
    if (this.i_marcado == 1) {
      this.accion_seleccionar = false;
      this.accion_des_seleccionar = true;
    }

    if (this.i_semaforo === "false") {
      this.m_nombre_file = this.i_nombre_file;
      this.m_tipodocumento_file = this.i_tipodocumento_file;
      this.m_codigoproy_file = this.i_codigoproy_file;
    } else {
      this.i_semaforo = "true";
    }

    if (this.idts_estiloBotones == undefined) {
      this.m_styleBotonActualizar = "warning";
      this.m_styleBotonDescargar = "info";
      this.m_styleBotonSubir = "success";
      this.m_styleBotonEliminar = "danger";
      this.m_styleBotonMarcar = "success";
    } else {
      this.m_styleBotonActualizar =
        this.idts_estiloBotones.styleBotonActualizar == undefined
          ? "warning"
          : this.idts_estiloBotones.styleBotonActualizar;
      this.m_styleBotonDescargar =
        this.idts_estiloBotones.styleBotonDescargar == undefined
          ? "info"
          : this.idts_estiloBotones.styleBotonDescargar;
      this.m_styleBotonSubir =
        this.idts_estiloBotones.styleBotonSubir == undefined
          ? "success"
          : this.idts_estiloBotones.styleBotonSubir;
      this.m_styleBotonEliminar =
        this.idts_estiloBotones.styleBotonEliminar == undefined
          ? "danger"
          : this.idts_estiloBotones.styleBotonEliminar;
      this.m_styleBotonMarcar =
        this.idts_estiloBotones.styleBotonMarcar == undefined
          ? "success"
          : this.idts_estiloBotones.styleBotonMarcar;
    }

    setTimeout(() => {
      console.log("inputId", this.i_idregistro_file);
      console.log("inputTipoDocumento", this.i_tipodocumento_file);
      console.log("inputCodigoProy", this.i_codigoproy_file);
      console.log("inputVista", this.i_semaforo);
      console.log("inputTipoImagen", this.i_tipoimagen);
      console.log("inputSrc", this.i_src);
      console.log("inputNombre", this.i_nombre_file);
      console.log("inputAccion", this.i_accion);
      console.log("inputMarcado", this.i_marcado);
      console.log("inputEstadoBoton", this.i_estadoboton);
      console.log("OnInit_handleFileInput", this.inputArchivo);
      console.log("idts_estiloBotones", this.idts_estiloBotones);
      console.log("Actualizar", this.m_styleBotonActualizar);
      console.log("Descargar", this.m_styleBotonDescargar);
      console.log("Subir", this.m_styleBotonSubir);
      console.log("Eliminar", this.m_styleBotonEliminar);
      console.log("Marcar", this.m_styleBotonMarcar);
    }, 100);
  }
  obtenerConexion() {
    console.log("ENTRE A OBTENER CONEXION======>");
    this.dtsDatosConexion = JSON.parse(localStorage.getItem("dts_con"));
    this.dts_roles_usuario = JSON.parse(localStorage.getItem("dts_rol"));
    this.s_idrol = this.dtsDatosConexion.s_idrol;
    this.s_user = this.dtsDatosConexion.s_user;
    this.s_nomuser = this.dtsDatosConexion.s_nomuser;
    this.s_usu_id = this.dtsDatosConexion.s_usu_id;
    this.s_usu_id_sipta = this.dtsDatosConexion.s_usu_id_sipta;
    this.s_usu_id_sispre = this.dtsDatosConexion.s_usu_id_sispre;
    this.s_ci_user = this.dtsDatosConexion.s_ci_user;
  }
  paneles(string) {
    console.log("accion", string);
    if (string == "BASE64") {
      this.btn_subirarchivo = false;
      this.btn_convertirbase64 = true;
      this.btn_actualizararchivo = false;
      this.accion_visualizar = false;
      this.accion_seleccionar = false;
      this.accion_actualizar = false;
      console.log("btn", this.btn_subirarchivo);
      this.accion_visualizar_eliminar = false;
    }
    if (string == "SUBIR_ARCHIVO") {
      // $('#btnUpdateArchivo').hide();
      // $('#btnDescargarArchivo').hide();
      // $('#btnSubirArchivo').show();
      this.btn_subirarchivo = true;
      this.btn_convertirbase64 = false;
      this.btn_actualizararchivo = false;
      this.accion_visualizar = false;
      this.accion_seleccionar = false;
      this.accion_actualizar = false;
      console.log("btn", this.btn_subirarchivo);
      this.accion_visualizar_eliminar = false;
      this.i_tipoimagen = "sin";
    }

    if (string == "POST_SUBIR_ARCHIVO") {
      // $('#btnUpdateArchivo').show();
      // $('#btnDescargarArchivo').show();
      // $('#btnSubirArchivo').hide();
      this.btn_subirarchivo = false;
      this.btn_convertirbase64 = false;
      this.btn_actualizararchivo = true;
      this.accion_visualizar = false;
      this.accion_seleccionar = false;

      this.accion_actualizar = false;
      this.accion_visualizar_eliminar = false;
    }
    if (string == "VISUALIZAR") {
      this.btn_subirarchivo = false;
      this.btn_convertirbase64 = false;
      this.btn_actualizararchivo = false;
      this.accion_visualizar = true;
      this.accion_seleccionar = false;

      this.accion_actualizar = false;
      this.accion_visualizar_eliminar = false;
    }

    if (string == "VISUALIZAR_ELIMINAR") {
      this.btn_subirarchivo = false;
      this.btn_convertirbase64 = false;
      this.btn_actualizararchivo = false;
      this.accion_visualizar = false;
      this.accion_visualizar_eliminar = true;
      this.accion_seleccionar = false;
      this.accion_actualizar = false;
    }
    if (string == "ACTUALIZAR") {
      this.btn_subirarchivo = false;
      this.btn_convertirbase64 = false;
      this.btn_actualizararchivo = false;
      this.accion_visualizar = false;
      this.accion_seleccionar = false;

      this.accion_actualizar = true;
      this.accion_visualizar_eliminar = false;
    }
    if (string == "SELECCIONAR") {
      this.btn_subirarchivo = false;
      this.btn_convertirbase64 = false;
      this.btn_actualizararchivo = false;
      this.accion_visualizar = false;
      this.accion_seleccionar = true;

      this.accion_visualizar_eliminar = false;
      this.accion_actualizar = false;
    }
    if (string == "VISUALIZAR_ELIMINAR_SELECCIONAR") {
      this.btn_subirarchivo = false;
      this.btn_convertirbase64 = false;
      this.btn_actualizararchivo = false;
      this.accion_visualizar = false;
      this.accion_visualizar_eliminar = true;
      this.accion_seleccionar = true;

      this.accion_actualizar = false;
    }
    if (string == "VISUALIZAR_ACTUALIZAR") {
      this.btn_subirarchivo = false;
      this.btn_convertirbase64 = false;
      this.btn_actualizararchivo = false;

      this.accion_visualizar = true;
      this.accion_visualizar_eliminar = false;
      this.accion_seleccionar = false;
      this.accion_actualizar = true;
    }
  }
  subirArchivo() {
    this.archivoModel.TIPO_DOCUMENTO = this.m_tipodocumento_file;
    this.archivoModel.CODIGO = this.m_codigoproy_file;
    this.archivoModel.FILE =
      this.inputArchivo === null ? this.file_empty : this.inputArchivo;

    if (
      this.archivoModel.TIPO_DOCUMENTO === null ||
      this.archivoModel.TIPO_DOCUMENTO === undefined ||
      this.archivoModel.TIPO_DOCUMENTO === "" ||
      this.archivoModel.FILE == null
    ) {
      this._msg.formateoMensaje(
        "modal_warning",
        "Seleccione el tipo de documento a subir"
      );
      return;
    }
    this.archivoModel.FILE =
      this.inputArchivo === null ? this.file_empty : this.inputArchivo;
    console.log("======> ARCHIVO A SUBIR ", this.archivoModel);
    this._autenticacion.subirArchivo(this.archivoModel).subscribe(
      (result: any) => {
        let respuestaSubida = result;
        console.log("resulSubida", respuestaSubida);
        if (respuestaSubida.ok) {
          this.m_nombre_file = respuestaSubida.nombre_archivo;
          if (this.i_tipoimagen == "imagen") {
            this.i_src = this.m_nombre_file;
          } else {
            this.i_src = "";
          }

          this.respuesta.TIPO_DOCUMENTO = this.i_tipodocumento_file;
          this.respuesta.NOM_FILE = this.m_nombre_file;
          this.respuesta.MENSAJE = "CORRECTO";
          this.respuesta.ID_REGISTRO = this.i_idregistro_file;
          this.respuesta.ACCION = "INSERTA";
          this.respuesta.RUTA = respuestaSubida.ruta;
          this.respuesta.PATH_COMPLETO = respuestaSubida.path_completo;
          this.respuesta.ACCION_POST = respuestaSubida.accion_post;

          this.setModelArchivo();
          //this.paneles('POST_SUBIR_ARCHIVO');
          if (this.respuesta.ACCION_POST != undefined) {
            this.paneles(this.respuesta.ACCION_POST);
          } else {
            this.paneles("ACTUALIZAR");
          }
          this._msg.formateoMensaje(
            "modal_success",
            respuestaSubida.message,
            10
          );
          this.metodoenviaPadre(this.respuesta);
        } else {
          this._msg.formateoMensaje(
            "modal_warning",
            respuestaSubida.message,
            10
          );
        }
      },
      (error) => {
        this._msg.formateoMensaje("modal_danger", error);
      }
    );
  }

  handleFileInput(files: FileList) {
    this.inputArchivo = files.item(0);
    console.log("handleFileInput", this.inputArchivo);
  }
  setModelArchivo() {
    this.archivoModel = {
      TIPO_DOCUMENTO: "",
      CODIGO: "",
      FILE: null,
      NOM_FILE: "",
    };
    this.inputArchivo = this.file_empty;
  }
  reemplazarArchivo() {
    this.archivoModel.NOM_FILE = this.m_nombre_file;
    this.archivoModel.TIPO_DOCUMENTO = this.m_tipodocumento_file;
    this.archivoModel.CODIGO = this.m_codigoproy_file;
    console.log("archivo", this.archivoModel.FILE);
    this.archivoModel.FILE =
      this.inputArchivo === null ? this.file_empty : this.inputArchivo;
    if (
      this.archivoModel.TIPO_DOCUMENTO === null ||
      this.archivoModel.TIPO_DOCUMENTO === undefined ||
      this.archivoModel.TIPO_DOCUMENTO === "" ||
      this.archivoModel.FILE == null
    ) {
      this._msg.formateoMensaje(
        "modal_info",
        "Se esta actualizando sin archivo adjunto"
      );

      this.respuesta.NOM_FILE = "";
      this.respuesta.MENSAJE = "CORRECTO";
      this.respuesta.ID_REGISTRO = this.i_idregistro_file;
      this.respuesta.ACCION = "EDITA";
      this.setModelArchivo();
      this.metodoenviaPadre(this.respuesta);

      return;
    }
    this.archivoModel.FILE =
      this.inputArchivo === null ? this.file_empty : this.inputArchivo;
    console.log("REEMPLAZAR ARCHIVO=====>", this.archivoModel);
    this._autenticacion.reemplazarArchivo(this.archivoModel).subscribe(
      (result: any) => {
        let respuestaSubida = result;
        console.log("RESPUESTA SUBIDA===>", respuestaSubida);
        if (respuestaSubida.ok && respuestaSubida.modificado) {
          this.m_nombre_file = respuestaSubida.nombre_archivo;
          if (this.i_tipoimagen == "imagen") {
            this.i_src = this.m_nombre_file;
          } else {
            this.i_src = "";
          }
          this.respuesta.TIPO_DOCUMENTO = this.i_tipodocumento_file;
          this.respuesta.NOM_FILE = this.m_nombre_file;
          this.respuesta.RUTA = respuestaSubida.ruta;
          this.respuesta.PATH_COMPLETO = respuestaSubida.path_completo;
          this.respuesta.MENSAJE = "CORRECTO";
          this.respuesta.ID_REGISTRO = this.i_idregistro_file;
          this.respuesta.ACCION = "EDITA";
          this.respuesta.ACCION_POST = respuestaSubida.accion_post;
          this.setModelArchivo();
          this._msg.formateoMensaje(
            "modal_success",
            respuestaSubida.message,
            10
          );
          this.metodoenviaPadre(this.respuesta);
        } else {
          this._msg.formateoMensaje(
            "modal_warning",
            respuestaSubida.message,
            10
          );
        }
      },
      (error) => {
        this._msg.formateoMensaje("modal_danger", error);
      }
    );
  }
  obtenerArchivo() {
    this.archivoModel.NOM_FILE = this.m_nombre_file;
    this.archivoModel.TIPO_DOCUMENTO = this.m_tipodocumento_file;
    this.archivoModel.CODIGO = this.m_codigoproy_file;
    console.log("doc_file", this.archivoModel);
    this._autenticacion.obtenerArchivo(this.archivoModel).subscribe(
      (result: any) => {
        const url = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${this.archivoModel.NOM_FILE}`);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // let respuestaDescarga = result;
        // console.log(respuestaDescarga);
        // if (respuestaDescarga.ok) {
        //   window.open(respuestaDescarga.url);
        // }
      },
      (error) => {
        this._msg.formateoMensaje("modal_danger", error);
      }
    );
  }

  // seleccionarArchivo(){

  //   this.metodoenviaPadre(this.i_src)
  // }
  seleccionarArchivo() {
    this.respuesta.NOM_FILE = this.m_nombre_file;
    this.respuesta.MENSAJE = "CORRECTO";
    this.respuesta.ID_REGISTRO = this.i_idregistro_file;
    this.respuesta.ACCION = "SELECCIONADO";
    console.log("imagenSELECCIONADA", this.respuesta);
    this.metodoenviaPadre(this.respuesta);
  }
  des_seleccionarArchivo() {
    this.respuesta.NOM_FILE = this.m_nombre_file;
    this.respuesta.MENSAJE = "CORRECTO";
    this.respuesta.ID_REGISTRO = this.i_idregistro_file;
    this.respuesta.ACCION = "DES_SELECCIONADO";
    this.metodoenviaPadre(this.respuesta);
  }

  eliminarArchivo() {
    this.archivoModel.NOM_FILE = this.m_nombre_file;
    this.archivoModel.TIPO_DOCUMENTO = this.m_tipodocumento_file;
    this.archivoModel.CODIGO = this.m_codigoproy_file;

    this.archivoModel.FILE =
      this.inputArchivo === null ? this.file_empty : this.inputArchivo;
    if (
      this.archivoModel.TIPO_DOCUMENTO === null ||
      this.archivoModel.TIPO_DOCUMENTO === undefined ||
      this.archivoModel.TIPO_DOCUMENTO === ""
    ) {
      this._msg.formateoMensaje(
        "modal_warning",
        "Seleccione el tipo de documento a subir"
      );
      return;
    }
    this.archivoModel.FILE =
      this.inputArchivo === null ? this.file_empty : this.inputArchivo;
    this._autenticacion.eliminarArchivo(this.archivoModel).subscribe(
      (result: any) => {
        let respuestaSubida = result;
        if (respuestaSubida.ok && respuestaSubida.modificado) {
          this.m_nombre_file = respuestaSubida.nombre_archivo;
          this.i_src = this.m_nombre_file;
          this.paneles("SUBIR_ARCHIVO");
          this.respuesta.NOM_FILE = this.m_nombre_file;
          this.respuesta.MENSAJE = "CORRECTO";
          this.respuesta.ID_REGISTRO = this.i_idregistro_file;
          this.respuesta.ACCION = "ELIMINA";
          this.respuesta.TIPO_DOCUMENTO = this.i_tipodocumento_file;
          this.setModelArchivo();
          this._msg.formateoMensaje(
            "modal_success",
            respuestaSubida.message,
            10
          );
          this.metodoenviaPadre(this.respuesta);
        } else {
          this._msg.formateoMensaje(
            "modal_warning",
            respuestaSubida.message,
            10
          );
        }
      },
      (error) => {
        this._msg.formateoMensaje("modal_danger", error);
      }
    );
  }

  metodoenviaPadre(dts?) {
    //this.enviaPadre.emit('ok',dts);
    console.log("dato a eliminar", dts);
    this.enviaPadre.emit(dts);
  }
  convertirBase64() {
    //Este objeto FileReader te permite leer archivos
    var reader = new FileReader();

    //Esta función se ejecuta cuando el reader.readAsDataURL termina
    reader.onloadend = () => {
      // Use a regex to remove data url part
      const base64String = reader.result;
      // .replace("data:", "")
      // .replace(/^.+,/, "");

      const dts = {
        id_proyecto: this.i_codigoproy_file,
        tipo: "importaItems",
        base64: base64String,
        usuario_registro: this.s_ci_user,
      };
      this.metodoenviaPadre(dts);
    };

    //Aqui comienza a leer el archivo para posteriormente ejecutar la función onloadend
    reader.readAsDataURL(this.inputArchivo);
  }
}
