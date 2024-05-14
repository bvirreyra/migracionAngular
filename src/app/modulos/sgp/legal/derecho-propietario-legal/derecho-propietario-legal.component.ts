import { DatePipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
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
  selector: "app-derecho-propietario-legal",
  templateUrl: "./derecho-propietario-legal.component.html",
  styleUrls: ["./derecho-propietario-legal.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
    AccesosRolComponent,
  ],
})
export class DerechoPropietarioLegalComponent implements OnInit {
  @Input("inputDts") inputDts: any;
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

  public m_gestion: any;
  public m_mes_actual: any;

  public pnl_listaproyecto = false;
  public pnl_supervision = false;
  public pnl_ampliacionplazo = false;

  public pnl_tecnica = false;
  public pnl_financiero = false;
  public pnl_legal = false;
  public pnl_galeria = false;
  public pnl_listaderecho = false;

  /************************************
   * VARIABLES DEL COMPONENTE
   ***********************************/
  public dts_listaderechopropietario: any;
  public dts_listaempresaversion: any;
  public nombre_proyecto: any;
  public dts_estadoDerechoPropietario: any;
  public id_estadoDerechoPropietario: any;
  public dts_listaimagenes: any;
  public derecho_propietario: {
    idderechop: any;
    fidproyecto: any;
    idsgp: any;
    estadoderecho: any;
    descripcion: any;
    nrofolio: any;
    fechadeclaracion: any;
    nombrearchivo: any;
    usrregistro: any;
    idestado: any;
    operacion: any;
    tipo: any;
  };
  public inputArchivo = null;
  public archivoModel: any = {
    TIPO_DOCUMENTO: "",
    CODIGO: "",
    FILE: null,
    NOM_FILE: "",
  };
  public file_empty: File;
  public pnl_descarga = false;
  public pnl_formulario = false;

  public btn_Actualiza = false;
  public btn_Registra = true;

  public id_sgp: any;

  public camposHabilitados: {};

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
    this.derecho_propietario = {
      idderechop: 0,
      fidproyecto: 0,
      idsgp: 0,
      estadoderecho: "",
      descripcion: "",
      nrofolio: "",
      fechadeclaracion: "",
      nombrearchivo: "",
      usrregistro: 0,
      idestado: 1,
      operacion: "",
      tipo: "",
    };
    this.dts_listaimagenes = [];
  }

  ngOnInit() {
    console.log(this.inputDts);
    this.obtenerConexion()
      .then(() => {
        return this._accesos.accesosRestriccionesxRolV2(this.s_usu_id);
      })
      .then((data) => {
        this.camposHabilitados = data;
        console.log("Adm Roles===>", this.camposHabilitados);
        this.listaEstadoDerecho(18);
        this.nombre_proyecto = this.inputDts["_nombreproyecto"];
        this.id_sgp = this.inputDts["_id_sgp"];
        this.lista_derecho_propietario(this.inputDts["_id_proyecto"]);
      });
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
  paneles(string) {
    if (string == "REGISTRA_FORMULARIO") {
      this.pnl_formulario = true;
      this.pnl_descarga = false;
      this.btn_Actualiza = false;
      this.btn_Registra = true;
    }
    if (string == "EDITA_FORMULARIO") {
      this.pnl_formulario = true;
      this.pnl_descarga = true;
      this.btn_Actualiza = true;
      this.btn_Registra = false;
    }
    if (string == "TERMINA_PROCESO") {
      this.pnl_formulario = false;
      this.pnl_descarga = false;
      this.btn_Actualiza = false;
      this.btn_Registra = false;
    }
  }

  obtieneEstadoDerecho() {
    console.log(this.id_estadoDerechoPropietario);
    var datos = this.dts_estadoDerechoPropietario;

    var filtro = datos.filter((element) => {
      return element.id_detalle == this.id_estadoDerechoPropietario;
    });

    this.derecho_propietario.estadoderecho =
      filtro[0]["descripciondetalleclasificador"];
    console.log(this.derecho_propietario);
  }

  obtieneIdEstadoDerecho(estadoFicha) {
    console.log(estadoFicha);
    var datos = this.dts_estadoDerechoPropietario;

    var filtro = datos.filter((element) => {
      return element.descripciondetalleclasificador == estadoFicha;
    });

    this.id_estadoDerechoPropietario = filtro[0]["id_detalle"];
  }
  listaEstadoDerecho(idtipoclasificador) {
    this._seguimiento.listaClasificador(idtipoclasificador).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_estadoDerechoPropietario = result;
          console.log(result);
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

  insertaDerechoPropietario() {
    this.cargando = true;

    this.dts_listaderechopropietario = [];
    this.derecho_propietario.fidproyecto = this.inputDts["_id_proyecto"];
    this.derecho_propietario.idsgp = this.inputDts["_id_sgp"];
    this.derecho_propietario.usrregistro = this.s_usu_id;
    this.derecho_propietario.operacion = "I";
    this.derecho_propietario.tipo = "NN";

    this._seguimiento
      .insertaDerechoPropietario(this.derecho_propietario)
      .subscribe(
        (result: any) => {
          
          this.prop_tipomsg = result.estado.includes("Correcto")
            ? "modal_success"
            : "modal_warning";
          this.prop_msg = result.estado.includes("Correcto")
            ? "Se realizo correctamente el registro"
            : "No se pudo realizar el registro";
          this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
          this.cargando = false;
          this.lista_derecho_propietario(this.inputDts["_id_proyecto"]);
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

  actualizaDerechoPropietario() {
    this.cargando = true;
    this.dts_listaderechopropietario = [];
    this.derecho_propietario.fidproyecto = this.inputDts["_id_proyecto"];
    this.derecho_propietario.idsgp = this.inputDts["_id_sgp"];
    this.derecho_propietario.usrregistro = this.s_usu_id;
    this.derecho_propietario.operacion = "U";
    this.derecho_propietario.tipo = "NN";
    this.paneles("TERMINA_PROCESO");
    this._seguimiento
      .actualizaDerechoPropietario(this.derecho_propietario)
      .subscribe(
        (result: any) => {
          
          console.log(result);
          this.prop_tipomsg = result.estado.includes("Correcto")
            ? "modal_success"
            : "modal_warning";
          this.prop_msg = result.estado.includes("Correcto")
            ? "Se actualizo correctamente el registro"
            : "No se pudo actualizar el registro";
          this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
          this.cargando = false;
          this.lista_derecho_propietario(this.inputDts["_id_proyecto"]);
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

  subirArchivoInsertarDerecho() {
    console.log("ARHCIVO VACIO==>", this.inputArchivo);
    if (this.inputArchivo === null) {
      this.insertaDerechoPropietario();
      return;
    }
    this.archivoModel.TIPO_DOCUMENTO = "derecho_propietario";
    this.archivoModel.CODIGO = this.inputDts["_id_sgp"];

    if (
      this.archivoModel.TIPO_DOCUMENTO === null ||
      this.archivoModel.TIPO_DOCUMENTO === undefined ||
      this.archivoModel.TIPO_DOCUMENTO === ""
    ) {
      // this._msg.formateoMensaje(
      //   "modal_warning",
      //   "Seleccione el tipo de documento a subir"
      // );
      //return;
      this.insertaDerechoPropietario();
    } else {
      this.archivoModel.FILE =
        this.inputArchivo === null ? this.file_empty : this.inputArchivo;
      console.log(this.archivoModel);
      this._autenticacion.subirArchivo(this.archivoModel).subscribe(
        (result: any) => {
          let respuestaSubida = result;
          console.log("resulSubida", respuestaSubida);
          if (respuestaSubida.ok) {
            this.derecho_propietario.nombrearchivo =
              respuestaSubida.nombre_archivo;
            this.insertaDerechoPropietario();
          } else {
            this._msg.formateoMensaje(
              "modal_warning",
              respuestaSubida.message,
              10
            );
          }
        },
        (error) => {
          let respuesta = error;
          this._msg.formateoMensaje("modal_danger", respuesta.error, 10);
        }
      );
    }
  }
  actualizarArchivo() {
    if (this.inputArchivo === null) {
      this.actualizaDerechoPropietario();
      return;
    }
    if (
      this.archivoModel.TIPO_DOCUMENTO === null ||
      this.archivoModel.TIPO_DOCUMENTO === undefined ||
      this.archivoModel.TIPO_DOCUMENTO === ""
    ) {
      // this._msg.formateoMensaje(
      //   "modal_warning",
      //   "Seleccione el tipo de documento a subir"
      // );
      console.log("ENTRA AQUI");
      this.actualizaDerechoPropietario();
      //return;
    } else {
      this.archivoModel.FILE =
        this.inputArchivo === null ? this.file_empty : this.inputArchivo;
      console.log(this.archivoModel);
      this._autenticacion.reemplazarArchivo(this.archivoModel).subscribe(
        (result: any) => {
          let respuestaSubida = result;
          console.log("resulSubida", respuestaSubida);
          if (respuestaSubida.ok) {
            this.derecho_propietario.nombrearchivo =
              respuestaSubida.nombre_archivo;
            setTimeout(() => {
              this.actualizaDerechoPropietario();
            }, 10);
          } else {
            this._msg.formateoMensaje(
              "modal_warning",
              respuestaSubida.message,
              10
            );
          }
        },
        (error) => {
          let respuesta = error;
          this._msg.formateoMensaje("modal_danger", respuesta.error, 10);
        }
      );
    }
  }

  handleFileInput(files: FileList) {
    console.log("ARCHIVO VACIO===>", files);
    this.inputArchivo = files.item(0);
    let extensionesValidas = ["pdf"];
    let nombreArchivo = this.inputArchivo.name;
    //let extension_archivo = nombreArchivo.substr(nombreArchivo.indexOf(".") + 1);
    let extension_archivo = this._fun.nombre_extension(this.inputArchivo.name);

    console.log(extension_archivo);
    if (extensionesValidas.indexOf(extension_archivo) < 0) {
      this.prop_msg = "El formato del archivo seleccionado no es válido";
      this.prop_tipomsg = "modal_info";
      this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
      $("#inputArchivo").val("");
    } else {
      this.derecho_propietario.nombrearchivo = this.inputArchivo.name;
      this.archivoModel.TIPO_DOCUMENTO = "derecho_propietario";
      this.archivoModel.CODIGO = this.inputDts["_id_sgp"];
      //this.archivoModel.NOM_FILE=this.dts_listaderechopropietario.nombre_archivo;
      this.archivoModel.NOM_FILE = this.inputArchivo.name;
    }
  }
  lista_derecho_propietario(id_proy) {
    this.cargando = true;
    this.dts_listaderechopropietario = [];
    this._seguimiento.listaDerechoPropietarioSgp(id_proy).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_listaderechopropietario = this._fun.RemplazaNullArray(
            result[0]
          );
          console.log(this.dts_listaderechopropietario);
          this.derecho_propietario.idderechop =
            this.dts_listaderechopropietario.id_derechop;
          this.derecho_propietario.estadoderecho =
            this.dts_listaderechopropietario.estado_derechopropietario;
          this.derecho_propietario.descripcion =
            this.dts_listaderechopropietario.descripcion;
          this.derecho_propietario.nrofolio =
            this.dts_listaderechopropietario.nro_folio;
          this.derecho_propietario.fechadeclaracion =
            this._fun.transformDateOf_yyyymmdd(
              this.dts_listaderechopropietario.fecha_declaracion
            );
          this.derecho_propietario.nombrearchivo =
            this.dts_listaderechopropietario.nombre_archivo;

          this.paneles("EDITA_FORMULARIO");
          //this.habilitaPanel(this.dts_listaderechopropietario);
        } else {
          this.prop_msg = "Alerta: No existen derecho propietario registrado";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_info", this.prop_msg);
          //this.habilitaPanel(this.dts_listaderechopropietario);
          this.paneles("REGISTRA_FORMULARIO");
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
