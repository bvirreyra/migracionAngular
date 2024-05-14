import { DatePipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Inputmask from "inputmask";
import { Globals } from "../../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import * as moment from "moment";
import { AutenticacionService } from "../../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../../seguridad/mensajes/mensajes.component";
import { AccesosRolComponent } from "../../accesos-rol/accesos-rol.component";
import { SgpService } from "../../sgp.service";
moment.locale("es");

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important
@Component({
  selector: "app-resolucion-convenio",
  templateUrl: "./resolucion-convenio.component.html",
  styleUrls: ["./resolucion-convenio.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
    AccesosRolComponent,
  ],
})
export class ResolucionConvenioComponent implements OnInit {
  @Input("inputDts") inputDts: any;
  public cargando = false;
  /*VARIABLES PARA MASCARAS */
  public mask_numerodecimal: any;
  public mask_fecha: any;
  public mask_numero: any;
  public mask_gestion: any;
  public mask_resolucionconvenio: any;

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
  public m_codigoproyecto: any;

  public pnl_listaproyecto = false;
  public pnl_supervision = false;
  public pnl_ampliacionplazo = false;

  public pnl_tecnica = false;
  public pnl_financiero = false;
  public pnl_legal = false;
  public pnl_galeria = false;
  public pnl_listaderecho = false;

  public btn_RegistraConvenio = false;
  public btn_ActualizaConvenio = false;

  /************************************
   * VARIABLES DEL COMPONENTE
   ***********************************/
  public dts_listaResolucionConvenio: any;
  public dts_listaempresaversion: any;
  public nombre_proyecto: any;
  public id_sgp: any;
  public id_seguimiento: any;
  public dts_estadoDerechoPropietario: any;
  public id_estadoDerechoPropietario: any;
  public dts_listaimagenes: any;
  public datos_resolucionconvenio: {
    id_resolucionconvenio: any;
    fid_proyecto: any;
    nro_resolucionconvenio: any;
    fecha_resolucion: any;
    fecha_notificacion: any;
    tipo_resolucion: any;
    observacion: any;
    nombrearchivo: any;
    usrregistro: any;
    idestado: any;
    operacion: any;
    repositorio: any;
  };
  public inputArchivo = null;
  public inputAccion: any;
  public archivoModel: any = {
    TIPO_DOCUMENTO: "",
    CODIGO: "",
    FILE: null,
    NOM_FILE: "",
  };
  public file_empty: File;
  public pnl_descarga = false;
  public pnl_descarga_seguimiento = false;
  public pnl_formulario = false;

  public btn_Registra = false;
  public btn_Actualiza = false;
  public m_tipoclasificador: any;
  public dts_ListaTipoResolucionConvenio: any;

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
    this.datos_resolucionconvenio = {
      id_resolucionconvenio: 0,
      fid_proyecto: 0,
      nro_resolucionconvenio: "",
      fecha_resolucion: "",
      fecha_notificacion: "",
      tipo_resolucion: "",
      observacion: "",
      nombrearchivo: "",
      usrregistro: 0,
      idestado: 0,
      operacion: "",
      repositorio: "resolucion_convenio",
    };

    this.dts_listaimagenes = [];
  }

  ngOnInit() {
    this.mask_numerodecimal = new Inputmask("9{1,9}.9{1,2}");
    this.mask_fecha = new Inputmask("9{1,2}-9{1,2}-9{1,4}");
    this.mask_numero = new Inputmask("9{1,9}");
    this.mask_gestion = new Inputmask("9999");
    this.mask_resolucionconvenio = new Inputmask(
      "[aaaa/aaa/aa/[9{4}/9{4}]]|[aaa/aa/[9{4}/9{4}]]"
    );
    //this.mask_cite = new Inputmask("[aaaa-a{2,4}-[9{3}-9{4}]|[a{2}-9{3}-9{4}]");
    this.nombre_proyecto = this.inputDts["_nombreproyecto"];
    this.id_sgp = this.inputDts["_id_sgp"];
    console.log("dts", this.inputDts);

    this.obtenerConexion()
      .then(() => {
        return this._accesos.accesosRestriccionesxRolV2(this.s_usu_id);
      })
      .then((data) => {
        this.camposHabilitados = data;
        console.log("Adm Roles===>", this.camposHabilitados);
        return this.lista_resolucionconvenio(this.inputDts["_id_proyecto"]);
      })
      .then((dts) => {
        this.dts_listaResolucionConvenio = dts;
        if (
          this.dts_listaResolucionConvenio.length > 0 &&
          this.dts_listaResolucionConvenio[0].id_convenio != ""
        ) {
          this.paneles("ACTUALIZAR_REGISTRO");
        } else {
          this.paneles("NUEVO_REGISTRO");
        }
        return this.listaTipoResolucionConvenio();
      })
      .then((dts) => {
        this.dts_ListaTipoResolucionConvenio = dts;
        console.log("tipo_convenio", this.dts_ListaTipoResolucionConvenio);
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
    if (string == "NUEVO_REGISTRO") {
      this.pnl_descarga = false;
      this.pnl_formulario = true;
      this.btn_Registra = true;
      this.btn_Actualiza = false;
      this.inputAccion = "SUBIR_ARCHIVO";
      setTimeout(() => {
        this.cargarmascaras();
        this.inicia_datos();
      }, 10);
    }
    if (string == "ACTUALIZAR_REGISTRO") {
      this.pnl_descarga = true;
      console.log("INGRESA AL FORMULARIO DE ACTUALIZACION");
      this.pnl_formulario = true;
      this.btn_Registra = false;
      this.btn_Actualiza = true;
      this.inputAccion = "ACTUALIZAR";
      this.datos_resolucionconvenio.id_resolucionconvenio =
        this.dts_listaResolucionConvenio[0].id_resolucionconvenio;
      this.datos_resolucionconvenio.nro_resolucionconvenio =
        this.dts_listaResolucionConvenio[0].nro_resolucionconvenio;
      this.datos_resolucionconvenio.fecha_resolucion =
        this._fun.formatoFechaMoment(
          this.dts_listaResolucionConvenio[0].fecha_resolucion
        );
      this.datos_resolucionconvenio.fecha_notificacion =
        this._fun.formatoFechaMoment(
          this.dts_listaResolucionConvenio[0].fecha_notificacion
        );
      this.datos_resolucionconvenio.tipo_resolucion =
        this.dts_listaResolucionConvenio[0].tipo_resolucion;
      this.datos_resolucionconvenio.observacion =
        this.dts_listaResolucionConvenio[0].observacion;
      this.datos_resolucionconvenio.nombrearchivo =
        this.dts_listaResolucionConvenio[0].nombrearchivo;
      this.datos_resolucionconvenio.usrregistro =
        this.dts_listaResolucionConvenio[0].usrregistro;
      this.datos_resolucionconvenio.idestado = 1;
      this.datos_resolucionconvenio.operacion = "U";
      this.datos_resolucionconvenio.repositorio = "resolucion_convenio";

      setTimeout(() => {
        this.cargarmascaras();
      }, 5);
    }
    if (string == "CERRAR_FORMULARIO") {
      $("#modalFormulario").modal("hide");
      setTimeout(() => {
        this.pnl_formulario = false;
      }, 10);
    }
  }
  /*******************************************************************************/
  /*MASCARAS
  /*******************************************************************************/
  cargarmascaras() {
    var resolucionconvenio = document.getElementById("nro_resolucionconvenio");
    this.mask_resolucionconvenio.mask(resolucionconvenio);
    var fecha_resolucion = document.getElementById("fecha_resolucion");
    this.mask_fecha.mask(fecha_resolucion);
    var fecha_notificacion = document.getElementById("fecha_notificacion");
    this.mask_fecha.mask(fecha_notificacion);

    // var monto_convenio = document.getElementById("monto_convenio");
    // this.mask_numerodecimal.mask(monto_convenio);
    // var monto_contraparte_beneficiario = document.getElementById("monto_contraparte_beneficiario");
    // this.mask_numerodecimal.mask(monto_contraparte_beneficiario);
    // var monto_contraparte_gobernacion = document.getElementById("monto_contraparte_gobernacion");
    // this.mask_numerodecimal.mask(monto_contraparte_gobernacion);
    // var monto_contraparte_municipal = document.getElementById("monto_contraparte_municipal");
    // this.mask_numerodecimal.mask(monto_contraparte_municipal);
    // var fechadesuscripcion = document.getElementById("fechadesuscripcion");
    // this.mask_fecha.mask(fechadesuscripcion);
  }

  lista_resolucionconvenio(id_proy) {
    return new Promise((resolve, reject) => {
      this.cargando = true;
      this.dts_listaResolucionConvenio = [];
      this._seguimiento.listaResolucionConvenio(id_proy).subscribe(
        (result: any) => {
          var lista_convenio;
          if (Array.isArray(result) && result.length > 0) {
            lista_convenio = this._fun.RemplazaNullArray(result);
            resolve(lista_convenio);
          } else {
            this.prop_msg = "Alerta: No existen convenio registrado";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_info", this.prop_msg);
            lista_convenio = [];
            resolve(lista_convenio);
            //this.habilitaPanel(this.dts_listaResolucionConvenio);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  inicia_datos() {
    this.datos_resolucionconvenio = {
      id_resolucionconvenio: 0,
      fid_proyecto: 0,
      nro_resolucionconvenio: "",
      fecha_resolucion: "",
      fecha_notificacion: "",
      tipo_resolucion: "",
      observacion: "",
      nombrearchivo: "",
      usrregistro: 0,
      idestado: 0,
      operacion: "",
      repositorio: "resolucion_convenio",
    };
    // this.datos_resolucionconvenio.nro_convenio='';
    // this.datos_resolucionconvenio.fechadesuscripcion='';
    // this.datos_resolucionconvenio.nombrearchivo='';
    // this.datos_resolucionconvenio.repositorio=this.dts_listaResolucionConvenio[0].repositorio;
    // this.datos_resolucionconvenio.codigo =this.dts_listaResolucionConvenio[0].codigo;
    // this.datos_resolucionconvenio.tipo_convenio='';
  }
  insertarResolucionConvenio(dts) {
    this.cargando = true;
    this.dts_listaResolucionConvenio = [];

    this.datos_resolucionconvenio.nombrearchivo = dts.NOM_FILE;
    this.datos_resolucionconvenio.fid_proyecto = this.inputDts["_id_proyecto"];
    this.datos_resolucionconvenio.usrregistro = this.s_usu_id;
    this.datos_resolucionconvenio.operacion = "I";
    this.datos_resolucionconvenio.idestado = 1;

    this._seguimiento
      .insertaResolucionConvenio(this.datos_resolucionconvenio)
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
          this.lista_resolucionconvenio(this.inputDts["_id_proyecto"]).then(
            (dts) => {
              this.dts_listaResolucionConvenio = dts;
              this.pnl_descarga = true;
            }
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
          this.cargando = false;
        }
      );
  }

  actualizaResolucionConvenio(dts) {
    this.cargando = true;
    this.dts_listaResolucionConvenio = [];
    if (dts.NOM_FILE == "") {
      this.datos_resolucionconvenio.nombrearchivo =
        this.datos_resolucionconvenio.nombrearchivo;
    } else {
      this.datos_resolucionconvenio.nombrearchivo = dts.NOM_FILE;
    }
    this.datos_resolucionconvenio.fid_proyecto = this.inputDts["_id_proyecto"];
    this.datos_resolucionconvenio.usrregistro = this.s_usu_id;
    this.datos_resolucionconvenio.operacion = "U";

    this.dts_listaResolucionConvenio = [];
    console.log(
      "datos de resolucion de conveniossss",
      this.datos_resolucionconvenio
    );
    this._seguimiento
      .actualizaResolucionConvenio(this.datos_resolucionconvenio)
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
          this.lista_resolucionconvenio(this.inputDts["_id_proyecto"]).then(
            (dts) => {
              this.dts_listaResolucionConvenio = dts;
            }
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
          this.cargando = false;
        }
      );
  }

  refrescaPadre($event) {
    console.log("evento hijo: ", $event);
    this.dts_listaimagenes = [];
    if ($event.ACCION == "ELIMINA") {
      //this.eliminaGaleriaImagen($event.ID_REGISTRO,$event.NOM_FILE);
    }
    if ($event.ACCION == "EDITA") {
      this.actualizaResolucionConvenio($event);
    }
    if ($event.ACCION == "INSERTA") {
      this.insertarResolucionConvenio($event);
    }
  }
  listaTipoResolucionConvenio() {
    //this.cargando = true;
    this.m_tipoclasificador = "TIPO RESOLUCION DE CONVENIO";
    console.log("TIPO CLASIFICADOR", this.m_tipoclasificador);
    return new Promise((resolve, reject) => {
      this._seguimiento
        .listaTipoResolucionConvenio(this.m_tipoclasificador)
        .subscribe(
          (result: any) => {
            
            if (Array.isArray(result) && result.length > 0) {
              var listaTipoResolucionConvenio =
                this._fun.RemplazaNullArray(result);
              //this.cargando = false;

              resolve(listaTipoResolucionConvenio);
            }
          },
          (error) => {
            this.errorMessage = <any>error;
            if (this.errorMessage != null) {
              console.log(this.errorMessage);
              this.prop_msg =
                "Error: No se pudo ejecutar la petición en la base de datos ";
              this._msg.formateoMensaje("modal_danger", this.prop_msg);
              reject(this.prop_msg);
            }
          }
        );
    });
  }
}
