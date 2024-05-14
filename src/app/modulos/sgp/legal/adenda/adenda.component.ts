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
  selector: "app-adenda",
  templateUrl: "./adenda.component.html",
  styleUrls: ["./adenda.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
    AccesosRolComponent,
  ],
})
export class AdendaComponent implements OnInit {
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
  public m_codigoproyecto: any;

  public pnl_listaproyecto = false;
  public pnl_supervision = false;
  public pnl_ampliacionplazo = false;

  public pnl_tecnica = false;
  public pnl_financiero = false;
  public pnl_legal = false;
  public pnl_galeria = false;
  public pnl_listaderecho = false;
  public pnl_formulario = false;

  public btn_Registra = false;
  public btn_Actualiza = false;

  /************************************
   * VARIABLES DEL COMPONENTE
   ***********************************/
  public dts_lista: any;
  public dts_datosiniciales: any;
  public dts_listaempresaversion: any;
  public nombre_proyecto: any;
  public id_sgp: any;
  public dts_estadoDerechoPropietario: any;
  public id_estadoDerechoPropietario: any;
  public dts_listaimagenes: any;
  public datos_adenda: {
    id_adenda: any;
    fid_proyecto: any;
    fid_sgp: any;
    nro_adenda: any;
    fechadesuscripcion: any;
    nombrearchivo: any;
    descripcion: any;
    monto_adenda: any;
    monto_contraparte_beneficiario: any;
    monto_contraparte_gobernacion: any;
    monto_contraparte_municipio: any;
    usrregistro: any;
    idestado: any;
    operacion: any;
    tipo: any;
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

  public camposHabilitados: {};
  public pnl_principal = false;

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
    this.datos_adenda = {
      id_adenda: 0,
      fid_proyecto: 0,
      fid_sgp: 0,
      nro_adenda: "",
      fechadesuscripcion: "",
      nombrearchivo: "",
      descripcion: "",
      monto_adenda: 0,
      monto_contraparte_beneficiario: 0,
      monto_contraparte_gobernacion: 0,
      monto_contraparte_municipio: 0,
      usrregistro: 0,
      idestado: 1,
      operacion: "",
      tipo: "",
      repositorio: "",
    };

    this.dts_listaimagenes = [];
  }

  ngOnInit() {
    this.mask_numerodecimal = new Inputmask("9{1,9}.9{1,2}");
    this.mask_fecha = new Inputmask("9{1,2}/9{1,2}/9{1,4}");
    this.mask_numero = new Inputmask("9{1,9}");
    this.mask_gestion = new Inputmask("9999");

    this.nombre_proyecto = this.inputDts["_nombreproyecto"];
    this.id_sgp = this.inputDts["_id_sgp"];

    console.log(this.inputDts);
    this.obtenerConexion()
      .then(() => {
        return this._accesos.accesosRestriccionesxRolV2(this.s_usu_id);
      })
      .then((data) => {
        this.camposHabilitados = data;
        console.log("Adm Roles===>", this.camposHabilitados);
        return this.lista_adenda(this.inputDts["_id_proyecto"]);
      })
      .then((dts) => {
        this.dts_lista = dts;
        console.log("lista adendas", this.dts_lista);
        this.pnl_principal = true;
      });
  }
  /*******************************************************************************/
  /*MASCARAS
  /*******************************************************************************/
  cargarmascaras() {
    var monto_adenda = document.getElementById("monto_adenda");
    this.mask_numerodecimal.mask(monto_adenda);
    var monto_contraparte_beneficiario = document.getElementById(
      "monto_contraparte_beneficiario"
    );
    this.mask_numerodecimal.mask(monto_contraparte_beneficiario);
    var monto_contraparte_gobernacion = document.getElementById(
      "monto_contraparte_gobernacion"
    );
    this.mask_numerodecimal.mask(monto_contraparte_gobernacion);
    var monto_contraparte_municipal = document.getElementById(
      "monto_contraparte_municipal"
    );
    this.mask_numerodecimal.mask(monto_contraparte_municipal);
    var fechadesuscripcion = document.getElementById("fechadesuscripcion");
    this.mask_fecha.mask(fechadesuscripcion);
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
  paneles(string, dts?) {
    if (string == "NUEVO_REGISTRO") {
      this.pnl_formulario = true;
      this.btn_Registra = true;
      this.btn_Actualiza = false;
      this.inputAccion = "SUBIR_ARCHIVO";
      setTimeout(() => {
        $("#modalFormulario").modal("show");
        this.cargarmascaras();
        this.datos_iniciales(this.inputDts["_id_proyecto"]);
      }, 10);
    }
    if (string == "ACTUALIZAR_REGISTRO") {
      console.log("INGRESA AL FORMULARIO DE ACTUALIZACION");
      this.pnl_formulario = true;
      this.btn_Registra = false;
      this.btn_Actualiza = true;
      this.inputAccion = "ACTUALIZAR";
      this.datos_adenda.id_adenda = dts.id_adenda;
      this.datos_adenda.fid_proyecto = dts.fid_proyecto;
      this.datos_adenda.fid_sgp = dts.fid_sgp;
      this.datos_adenda.nro_adenda = dts.numero_adenda;
      //this.datos_adenda.fechadesuscripcion=this._fun.transformDateOf_yyyymmdd(dts.fecha_suscripcion);
      this.datos_adenda.fechadesuscripcion = moment(
        dts.fecha_suscripcion
      ).format("DD/MM/YYYY");
      //this.datos_adenda.fechadesuscripcion=dts.fecha_suscripcion;
      this.datos_adenda.nombrearchivo = dts.nombre_archivo;
      this.datos_adenda.descripcion = dts.descripcion;
      this.datos_adenda.monto_adenda = dts.monto_contrato;
      this.datos_adenda.monto_contraparte_beneficiario =
        dts.monto_contraparte_beneficiario;
      this.datos_adenda.monto_contraparte_gobernacion =
        dts.monto_contraparte_gobernacion;
      this.datos_adenda.monto_contraparte_municipio =
        dts.monto_contraparte_municipal;
      this.datos_adenda.usrregistro = dts.usuario_registro;
      this.datos_adenda.idestado = 1;
      this.datos_adenda.operacion = "U";
      this.datos_adenda.tipo = "";
      this.datos_adenda.repositorio = "";

      setTimeout(() => {
        $("#modalFormulario").modal("show");
        setTimeout(() => {
          this.cargarmascaras();
        }, 10);
      }, 10);
    }
    if (string == "CERRAR_FORMULARIO") {
      $("#modalFormulario").modal("hide");
      setTimeout(() => {
        this.pnl_formulario = false;
      }, 10);
    }
    // if (string == "NUEVO_CONTACTO") {
    //   $("#modalContactos").modal("show");
    //   $("#btnRegistrar").show();
    //   $("#btnModificar").hide();
    // }
  }

  lista_adenda(id_proy) {
    return new Promise((resolve, reject) => {
      this.cargando = true;
      this.dts_lista = [];
      this._seguimiento.listaAdendas(id_proy).subscribe(
        (result: any) => {
          var lista_adenda;
          if (Array.isArray(result) && result.length > 0) {
            lista_adenda = this._fun.RemplazaNullArray(result);
            resolve(lista_adenda);
          } else {
            this.prop_msg = "Alerta: No existen adendas registradas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_info", this.prop_msg);
            lista_adenda = [];
            resolve(lista_adenda);
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
  datos_iniciales(id_proy) {
    this.cargando = true;

    this._seguimiento.listaDatosIniciales(id_proy).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_datosiniciales = this._fun.RemplazaNullArray(result);
          console.log("lista datos iniciales", this.dts_datosiniciales);
          this.datos_adenda.monto_adenda =
            this.dts_datosiniciales[0].v_monto_convenio;
          this.datos_adenda.monto_contraparte_beneficiario =
            this.dts_datosiniciales[0].v_monto_contraparte_beneficiario;
          this.datos_adenda.monto_contraparte_gobernacion =
            this.dts_datosiniciales[0].v_monto_contraparte_gobernacion;
          this.datos_adenda.monto_contraparte_municipio =
            this.dts_datosiniciales[0].v_monto_contraparte_municipio;
          this.inicia_datos();
        } else {
          this.prop_msg =
            "Alerta: No existen datos iniciales del convenio - adenda";
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
  refrescaListaAdenda($event) {
    console.log("evento hijo: ", $event);
    this.dts_listaimagenes = [];
    if ($event.ACCION == "ELIMINA") {
      //this.eliminaGaleriaImagen($event.ID_REGISTRO,$event.NOM_FILE);
    }
    if ($event.ACCION == "EDITA") {
      this.editaAdenda($event);
      $("#modalFormulario").modal("hide");
      this.pnl_formulario = false;
    }
    if ($event.ACCION == "INSERTA") {
      this.insertarAdenda($event);
      $("#modalFormulario").modal("hide");
      this.pnl_formulario = false;
    }
  }
  insertarAdenda(dts) {
    this.cargando = true;
    this.dts_lista = [];
    this.datos_adenda.nombrearchivo = dts.NOM_FILE;
    this.datos_adenda.fid_proyecto = this.inputDts["_id_proyecto"];
    this.datos_adenda.fid_sgp = this.inputDts["_id_sgp"];
    this.datos_adenda.usrregistro = this.s_usu_id;
    this.datos_adenda.operacion = "I";
    this.datos_adenda.tipo = "NN";
    this.datos_adenda.monto_adenda = this._fun.valorNumericoDecimal(
      this.datos_adenda.monto_adenda
    );
    this.datos_adenda.monto_contraparte_beneficiario =
      this._fun.valorNumericoDecimal(
        this.datos_adenda.monto_contraparte_beneficiario
      );
    this.datos_adenda.monto_contraparte_gobernacion =
      this._fun.valorNumericoDecimal(
        this.datos_adenda.monto_contraparte_gobernacion
      );
    this.datos_adenda.monto_contraparte_municipio =
      this._fun.valorNumericoDecimal(
        this.datos_adenda.monto_contraparte_municipio
      );

    this._seguimiento.insertaAdenda(this.datos_adenda).subscribe(
      (result: any) => {
        
        this.prop_tipomsg = result.estado.includes("Correcto")
          ? "modal_success"
          : "modal_warning";
        this.prop_msg = result.estado.includes("Correcto")
          ? "Se realizo correctamente el registro"
          : "No se pudo realizar el registro";
        this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
        this.cargando = false;
        this.lista_adenda(this.inputDts["_id_proyecto"]).then((dts) => {
          this.dts_lista = dts;
        });
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
  editaAdenda(dts) {
    this.cargando = true;
    this.dts_lista = [];
    if (dts.NOM_FILE == "") {
      this.datos_adenda.nombrearchivo = this.datos_adenda.nombrearchivo;
    } else {
      this.datos_adenda.nombrearchivo = dts.NOM_FILE;
    }
    console.log("ingresaEditaAdenda", this.datos_adenda);
    this.datos_adenda.fid_proyecto = this.inputDts["_id_proyecto"];
    this.datos_adenda.fid_sgp = this.inputDts["_id_sgp"];
    this.datos_adenda.usrregistro = this.s_usu_id;
    this.datos_adenda.operacion = "U";
    this.datos_adenda.tipo = "NN";

    //parseFloat(this.m_monto).toFixed(2)

    this.datos_adenda.monto_adenda = this._fun.valorNumericoDecimal(
      this.datos_adenda.monto_adenda
    );
    this.datos_adenda.monto_contraparte_beneficiario =
      this._fun.valorNumericoDecimal(
        this.datos_adenda.monto_contraparte_beneficiario
      );
    this.datos_adenda.monto_contraparte_gobernacion =
      this._fun.valorNumericoDecimal(
        this.datos_adenda.monto_contraparte_gobernacion
      );
    this.datos_adenda.monto_contraparte_municipio =
      this._fun.valorNumericoDecimal(
        this.datos_adenda.monto_contraparte_municipio
      );

    this._seguimiento.actualizaAdenda(this.datos_adenda).subscribe(
      (result: any) => {
        
        this.prop_tipomsg = result.estado.includes("Correcto")
          ? "modal_success"
          : "modal_warning";
        this.prop_msg = result.estado.includes("Correcto")
          ? "Se realizo correctamente el registro"
          : "No se pudo realizar el registro";
        this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
        this.cargando = false;
        this.lista_adenda(this.inputDts["_id_proyecto"]).then((dts) => {
          this.dts_lista = dts;
        });
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
  inicia_datos() {
    this.datos_adenda.nro_adenda = "";
    this.datos_adenda.fechadesuscripcion = "";
    this.datos_adenda.nombrearchivo = "";
    this.datos_adenda.descripcion = "";
  }
}
