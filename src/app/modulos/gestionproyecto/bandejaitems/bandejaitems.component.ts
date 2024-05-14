import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Globals } from "../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { ToastrService } from "ngx-toastr";
import { SeguimientoService } from "../../seguimiento/seguimiento.service";

import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-bandejaitems",
  templateUrl: "./bandejaitems.component.html",
  styleUrls: ["./bandejaitems.component.css"],
})
export class BandejaitemsComponent implements OnInit {
  @Input("dts_registro") dts_registro: any;
  @Output() respuestaPadre = new EventEmitter<string>();

  public cargando = false;
  /*VARIABLES PARA MASCARAS */
  public mask_numerodecimal: any;
  public mask_fecha: any;
  public mask_numero: any;
  public mask_gestion: any;

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

  /*paneles*/

  public pnlFormularioRegistrar = false;
  public pnlGridView = false;
  public pnl_formulario2 = false;

  /*variables del componente*/
  public dts_seguimiento: any;
  public dts_boletas: any;
  public dts_items: any;
  public dts_unidadmedida: any;

  public dts_estiloBotones: any = {
    styleBotonSubir: "success",
    styleBotonDescargar: "info",
    styleBotonActualizar: "warning",
    styleBotonEliminar: "danger",
    styleBotonMarcar: "success",
  };
  public confEspecificacionesTecnicas: {};
  public confPlanos: {};
  //public dts_estiloBotones: any = "PRUEBA";

  public m_idproyecto: any;
  public m_nombreproyecto: any;
  public m_idseguimiento: any;
  public m_tipodocumento: any;
  public m_codigoproyecto_seguimiento: any;
  public m_id_boleta: any;
  public inputAccion: any;
  public inputArchivo: any;

  public pnl_items = false;
  public pnlPlanos = false;
  public pnlEspecificacionesTecnicas = false;

  public dts_planos: any;

  public dts_especificacionestecnicas: any;
  public dts_archivoadjuntoproyecto: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _seguimiento: SeguimientoService,
    private toastr: ToastrService,

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
    this.confPlanos = {
      inputTipoImagen: "sin",
      inputSrc: "",
      inputNombre: "",
      inputAccion: "SUBIR_ARCHIVO",
    };
    this.confEspecificacionesTecnicas = {
      inputTipoImagen: "sin",
      inputSrc: "",
      inputNombre: "",
      inputAccion: "SUBIR_ARCHIVO",
    };
    this.obtenerConexion();
    this._fun.limpiatabla(".dt-items");
    console.log("REGISTROS ENVIADOS DEL COMPONENTE PADRE", this.dts_registro);
    this.m_idproyecto = this.dts_registro.id_proyecto;
    this.m_idseguimiento = this.dts_registro.id_seguimiento;
    this.m_codigoproyecto_seguimiento = this.dts_registro.codigo;
    this.m_nombreproyecto = this.dts_registro.nombreproyecto;
    this.listaitems(this.m_idseguimiento);
    this.inputAccion = "SUBIR_ARCHIVO";
    this.unidadmedida();

    console.log("ESTILO BOTONES PADRE==>", this.dts_estiloBotones);
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

  paneles(string, dts?) {
    if (string == "VER_ITEMS") {
      this.listaitems(this.m_idseguimiento);
    }
    if (string == "CIERRA_BANDEJA_ITEMS") {
      this.RespuestaPadre(string);
    }
    if (string == "ELIMINAR_ITEMS") {
      this.eliminaItems();
    }
    if (string == "TERMINAR_PROCESO") {
      this.terminarProceso(dts);
    }
    if (string == "VER_LISTAPROYECTOS") {
      this.RespuestaPadre(string);
    }
  }
  unidadmedida() {
    this._seguimiento.unidadmedida().subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_unidadmedida = this._fun.RemplazaNullArray(result);
          console.log("unidad_de_medidas", this.dts_unidadmedida);
          this.litaAdjuntosProyecto();
        } else {
          this.prop_msg = "Alerta: No existen unidades de medida";
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
  listaitems(id_seguimiento) {
    this._seguimiento.listaItems(id_seguimiento).subscribe(
      (result: any) => {
        console.log("items", result);
        if (Array.isArray(result) && result.length > 0) {
          this.dts_items = this._fun.RemplazaNullArray(result);
          this.pnl_items = true;
        } else {
          this.pnl_items = false;
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
  litaAdjuntosProyecto() {
    this._seguimiento
      .listaAdjuntosProyecto(this.m_idproyecto, this.m_idseguimiento)
      .subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            this.dts_archivoadjuntoproyecto =
              this._fun.RemplazaNullArray(result);
            this.dts_planos = this.dts_archivoadjuntoproyecto.filter(
              (atributo) => atributo.tipo_documento == "planos_proyecto"
            );
            this.dts_especificacionestecnicas =
              this.dts_archivoadjuntoproyecto.filter(
                (atributo) =>
                  atributo.tipo_documento == "especificaciones_tecnicas"
              );

            /************************************
             *configuracion para el componente upload
             ************************************/
            if (this.dts_planos.length > 0) {
              this.confPlanos = {
                inputTipoImagen: "documento",
                inputSrc: "",
                inputNombre: this.dts_planos[0].nombre_archivo,
                inputAccion: "POST_SUBIR_ARCHIVO",
              };
            } else {
              this.confPlanos = {
                inputTipoImagen: "sin",
                inputSrc: "",
                inputNombre: "",
                inputAccion: "SUBIR_ARCHIVO",
              };
            }

            if (this.dts_especificacionestecnicas.length > 0) {
              this.confEspecificacionesTecnicas = {
                inputTipoImagen: "documento",
                inputSrc: "",
                inputNombre:
                  this.dts_especificacionestecnicas[0].nombre_archivo,
                inputAccion: "POST_SUBIR_ARCHIVO",
              };
            } else {
              this.confEspecificacionesTecnicas = {
                inputTipoImagen: "sin",
                inputSrc: "",
                inputNombre: "",
                inputAccion: "SUBIR_ARCHIVO",
              };
            }
          }
          console.log(
            "CONFIGURACION====>",
            this.confPlanos,
            this.confEspecificacionesTecnicas
          );
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
  pre_editaitems(id_item) {
    var item_nombreitem = "#nombre_item" + id_item;
    var item_detalleunidadmedida = "#detalle_unidadmedida" + id_item;
    var item_codigounidadmedida = "#codigo_unidadmedida" + id_item;
    var item_cantidad = "#item_cantidad" + id_item;
    var item_preciounitario = "#item_preciounitario" + id_item;
    //var item_estado = "#item_estado" + id_item;
    var nombre_item = $(item_nombreitem).val();
    var detalle_unidadmedida = $(item_detalleunidadmedida).val();
    var codigo_unidadmedida = $(item_codigounidadmedida).val();
    var cantidad = $(item_cantidad).val();
    var preciounitario = $(item_preciounitario).val();
    //var estado = $(item_estado).val();
    console.log(
      nombre_item,
      detalle_unidadmedida,
      codigo_unidadmedida,
      cantidad,
      preciounitario
    );
    const registro = {
      nid_item: id_item,
      nnombre_item: nombre_item,
      ndetalle_unidadmedida: detalle_unidadmedida,
      //ncodigo_unidadmedida:codigo_unidadmedida,
      ncantidad: cantidad,
      npreciounitario: preciounitario,
    };
    this.editaitems(registro);
  }
  eliminaItems() {
    window.scrollTo(0, 0);
    this.cargando = true;
    const reg = {
      operacion: "D",
      fila: null,
      id_proyecto: this.m_idseguimiento,
    };

    this._seguimiento.eliminaItems_gestion(reg).subscribe(
      (result: any) => {
        console.log("ELIMINAR ITEMS===>", result);
        if (result[0].msg_estado == "CORRECTO") {
          this.prop_msg = result[0].message;
          this.prop_tipomsg = "success";
          this._msg.formateoMensaje("modal_success", this.prop_msg);
          this.paneles("VER_ITEMS");
        } else {
          this.prop_msg = "Alerta: No existen responsables registrados";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
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
  editaitems(dts) {
    this._seguimiento.editaitems_gestion(dts).subscribe(
      (result: any) => {
        if (result.estado == "CORRECTO") {
          alert("Se edito de forma correcta");
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
  RespuestaPadre(dts) {
    console.log("entra aqui");
    this.respuestaPadre.emit(dts);
  }
  importarItems(dts) {
    this.cargando = true;
    this._seguimiento.importaitems(dts).subscribe(
      (result: any) => {
        //console.log("=======>", result);
        // console.log("=======>", result._body);
        if (result == "IMPORTACION_CORRECTA") {
          this.toastr.success(
            result,
            "El proceso de importacion se realizo con Exito",
            {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            }
          );
          this.paneles("VER_ITEMS");
          this.cargando = false;
        } else {
          this.toastr.warning(
            result,
            "El proceso de importacion no se realizo con Exito",
            {
              positionClass: "toast-top-right",
              timeOut: 15000,
              progressBar: true,
            }
          );
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
      }
    );
  }
  seleccion_unidadmedida(id_item) {
    var id_detalleunidadmedida = "#detalle_unidadmedida" + id_item;
    var valor_detalleunidadmedida = $(id_detalleunidadmedida).val();
    console.log("EVENTO CHANGE=====>", valor_detalleunidadmedida);
    var codigo_unidadmedida = this.dts_unidadmedida.filter(
      (unidad) => unidad.descripcion == valor_detalleunidadmedida
    )[0].codigo;
    console.log("codigo de la unidad", codigo_unidadmedida);
    var id_codigounidadmedida = "#codigo_unidadmedida" + id_item;
    $(id_codigounidadmedida).val(codigo_unidadmedida);
  }
  manejoArchivos(dts) {
    console.log("MANEJOARCHIVO===>", dts);
    let registro = {};
    if (
      dts.TIPO_DOCUMENTO == "planos_proyecto" ||
      dts.TIPO_DOCUMENTO == "especificaciones_tecnicas"
    ) {
      if (dts.ACCION == "INSERTA") {
        registro = {
          operacion: "I",
          id_archivo: null,
          fid_proyecto: this.m_idproyecto,
          fid_seguimiento: this.m_idseguimiento,
          tipo_documento: dts.TIPO_DOCUMENTO,
          nombre_archivo: dts.NOM_FILE,
          usuario_registro: this.s_usu_id,
          id_estado: 1,
        };
      }
      if (dts.ACCION == "EDITA") {
        registro = {
          operacion: "U",
          id_archivo: null,
          fid_proyecto: this.m_idproyecto,
          fid_seguimiento: this.m_idseguimiento,
          tipo_documento: dts.TIPO_DOCUMENTO,
          nombre_archivo: dts.NOM_FILE,
          usuario_registro: this.s_usu_id,
          id_estado: 1,
        };
        console.log("EDITAR====>", registro);
      }
      if (dts.ACCION == "ELIMINA") {
        registro = {
          operacion: "D",
          id_archivo: null,
          fid_proyecto: this.m_idproyecto,
          fid_seguimiento: this.m_idseguimiento,
          tipo_documento: dts.TIPO_DOCUMENTO,
          nombre_archivo: dts.NOM_FILE,
          usuario_registro: this.s_usu_id,
          id_estado: 1,
        };
        console.log("ELMINA====>", registro);
      }
      this.cargando = true;
      this._seguimiento.crudRegistroArchivoAdjunto(registro).subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            console.log("TIPO_DOCUMENTO====>", result);
            //this.dts_archivoadjuntoproyecto =this._fun.RemplazaNullArray(result);
            this.cargando = false;
          } else {
            this.cargando = false;
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
        }
      );
    }
    console.log("DATOS DEL ARCHIVO SUBIDO", dts);
  }
  terminarProceso(dts) {
    this.cargando = true;
    console.log("datos para terminar", dts);
    const reg = {
      operacion: "TERMINADO",
      fid_proyecto: dts.id_proyecto,
      usuario_registro: this.s_usu_id,
      carnet_identidad: this.s_ci_user,
    };
    this._seguimiento.terminaProcesoGestion(reg).subscribe(
      (result: any) => {
        console.log("msg devuelto", result);
        if (result[0].message == "CORRECTO") {
          this.prop_msg = "Exito: Se procedio a terminar el Proceso";
          this.prop_tipomsg = "success";
          this._msg.formateoMensaje("modal_success", this.prop_msg);
          this.paneles("VER_LISTAPROYECTOS");
          this.cargando = false;
        } else {
          //this.prop_msg ="Alerta: No se pudo realizar el cambio de estado del proceso";
          this.prop_msg = result[0].message;
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
        }
        this.cargando = false;
      }
    );
  }
}
