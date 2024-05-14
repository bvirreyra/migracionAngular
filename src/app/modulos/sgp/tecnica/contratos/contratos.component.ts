import { DatePipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Inputmask from "inputmask";
import * as moment from "moment";
import { Globals } from "../../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
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
  selector: "app-contratos",
  templateUrl: "./contratos.component.html",
  styleUrls: ["./contratos.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
    AccesosRolComponent,
  ],
})
export class ContratosComponent implements OnInit {
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

  /************************************
   * VARIABLES DEL COMPONENTE
   ***********************************/
  public dts_listacontratos: any;
  public nombre_proyecto: any;
  public id_sgp: any;

  public inputArchivo = null;
  public file_empty: File;
  public archivoModel: any = {
    TIPO_DOCUMENTO: "",
    CODIGO: "",
    FILE: null,
    NOM_FILE: "",
  };

  public btnRegistrar = false;
  public btnActualizar = false;

  public pnl_listacontratos = false;
  public pnl_formulariocontrato = false;

  public dts_datosEmpresa: any;
  public nombre_empresa: any;
  public inputAccion: any;
  public vistaRazonSocial = false;
  public estadoBoton = true;

  public camposHabilitados: {};

  public contrato: {
    operacion: any;
    id_contrato: any;
    fid_proyecto: any;
    nit: any;
    razon_social: any;
    fecha_contrato: any;
    tipo: any;
    plazo: any;
    monto: any;
    monto_upre: any;
    monto_contraparte_beneficiario: any;
    monto_contraparte_municipio: any;
    monto_contraparte_gobernacion: any;
    detalle: any;
    usuario_registro: any;
    id_estado: any;
    archivo_adjunto: any;
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

    this.contrato = {
      operacion: "",
      id_contrato: 0,
      fid_proyecto: 0,
      nit: "",
      razon_social: "",
      fecha_contrato: "",
      tipo: "",
      plazo: 0,
      monto: 0,
      monto_upre: 0,
      monto_contraparte_beneficiario: 0,
      monto_contraparte_municipio: 0,
      monto_contraparte_gobernacion: 0,
      detalle: "",
      usuario_registro: 0,
      id_estado: 0,
      archivo_adjunto: "",
    };
  }

  ngOnInit() {
    console.log("Input Padre", this.inputDts);
    this.mask_numerodecimal = new Inputmask("9{1,20}.9{1,2}");
    this.mask_fecha = new Inputmask("9{1,2}/9{1,2}/9{1,4}");
    this.mask_numero = new Inputmask("9{1,9}");
    this.mask_gestion = new Inputmask("9999");

    this.nombre_proyecto = this.inputDts["_nombreproyecto"];
    this.id_sgp = this.inputDts["_id_sgp"];
    this.obtenerConexion()
      .then(() => {
        return this._accesos.accesosRestriccionesxRolV2(this.s_usu_id);
      })
      .then((data) => {
        this.camposHabilitados = data;
        console.log("Adm Roles===>", this.camposHabilitados);
        return this.FechaServidor();
      })
      .then((dts) => {
        this.dtsFechaSrv = dts[0]["fechasrv"];
        console.log(this.dtsFechaSrv);
        this.paneles("LISTA_CONTRATO");
        //this.cargarmascaras();
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
  FechaServidor() {
    return new Promise((resolve, reject) => {
      this._autenticacion.getfechaservidor().subscribe(
        (result: any) => {
          if (result[0]["fechasrv"] != "") {
            resolve(result);
            return result;
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos ";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  paneles(string, dts?) {
    if (string == "LISTA_CONTRATO") {
      this.pnl_listacontratos = true;
      this.lista_contratos(this.inputDts["_id_proyecto"]);
    }
    if (string == "NUEVO_CONTRATO") {
      this.pnl_formulariocontrato = true;
      this.inputAccion = "SUBIR_ARCHIVO";
      this.limpiarContrato();
      setTimeout(() => {
        $("#modalFormulario").modal("show");
        this.cargarmascaras();
        this.contrato.tipo = "CONTRATO";
      }, 50);
    }
    if (string == "EDITA_CONTRATO") {
      this.pnl_formulariocontrato = true;
      this.inputAccion = "ACTUALIZAR";
      this.abrirEdicion(dts);
      setTimeout(() => {
        $("#modalFormulario").modal("show");
        this.cargarmascaras();
        this.contrato.tipo = "CONTRATO";
      }, 50);
    }
    if (string == "CONCILIA_CONTRATO") {
      this.pnl_formulariocontrato = true;
      this.inputAccion = "SUBIR_ARCHIVO";
      this.abrirEdicion(dts);
      setTimeout(() => {
        $("#modalFormulario").modal("show");
        this.cargarmascaras();
        this.contrato.tipo = "CONCILIACION";
      }, 50);
    }
    if (string == "ELIMINA_CONTRATO") {
      this.eliminaContrato(dts);
    }
  }
  cargarmascaras() {
    var plazo = document.getElementById("plazo");
    this.mask_numero.mask(plazo);

    var monto = document.getElementById("monto");
    this.mask_numerodecimal.mask(monto);

    var monto_contraparte_beneficiario = document.getElementById(
      "monto_contraparte_beneficiario"
    );
    this.mask_numerodecimal.mask(monto_contraparte_beneficiario);

    var monto_contraparte_gobernacion = document.getElementById(
      "monto_contraparte_gobernacion"
    );
    this.mask_numerodecimal.mask(monto_contraparte_gobernacion);

    var monto_contraparte_municipio = document.getElementById(
      "monto_contraparte_municipio"
    );
    this.mask_numerodecimal.mask(monto_contraparte_municipio);
  }
  limpiarContrato() {
    this.contrato = {
      operacion: "",
      id_contrato: 0,
      fid_proyecto: 0,
      nit: "",
      razon_social: "",
      fecha_contrato: "",
      tipo: "",
      plazo: 0,
      monto: 0,
      monto_upre: 0,
      monto_contraparte_beneficiario: 0,
      monto_contraparte_municipio: 0,
      monto_contraparte_gobernacion: 0,
      detalle: "",
      usuario_registro: 0,
      id_estado: 0,
      archivo_adjunto: "",
    };
  }
  lista_contratos(id_proy) {
    this.pnl_listacontratos = true;
    this.cargando = true;
    this.dts_listacontratos = [];
    this._seguimiento.listaContratos(id_proy).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_listacontratos = this._fun.RemplazaNullArray(result);
          console.log("lista_contratos", this.dts_listacontratos);
        } else {
          this.prop_msg = "Alerta: No existen registros de empresa";
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
  datosEmpresa() {
    this.cargando = true;
    this.dts_datosEmpresa = [];
    this._seguimiento.datosEmpresa(this.contrato.nit).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_datosEmpresa = this._fun.RemplazaNullArray(result);
          this.contrato.razon_social = this.dts_datosEmpresa[0].nombre;
          $("#pnlDatosContrato").show();

          console.log("datos empresa", this.dts_datosEmpresa);
        } else {
          this.prop_msg = "Alerta: La empresa no se encuentra registrada";
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
  abrirEdicion(registro) {
    this.contrato.operacion = "U";
    this.contrato.id_contrato = registro.id_contrato;
    this.contrato.fid_proyecto = registro.fid_proyecto;
    this.contrato.nit = registro.nit;
    this.contrato.razon_social = registro.razon_social;
    this.contrato.fecha_contrato =
      registro.fecha_contrato == ""
        ? ""
        : moment(registro.fecha_contrato).format("YYYY-MM-DD").toString();
    this.contrato.plazo = registro.plazo;
    this.contrato.tipo = registro.tipo;
    this.contrato.monto = registro.monto;
    this.contrato.monto_upre = registro.monto_upre;
    this.contrato.monto_contraparte_beneficiario =
      registro.monto_contraparte_beneficiario;
    this.contrato.monto_contraparte_municipio =
      registro.monto_contraparte_municipio;
    this.contrato.monto_contraparte_gobernacion =
      registro.monto_contraparte_gobernacion;
    this.contrato.detalle = registro.detalle;
    this.contrato.usuario_registro = this.s_usu_id;
    this.contrato.id_estado = registro.id_estado;
    this.contrato.archivo_adjunto = registro.archivo_adjunto;
    console.log("registro a editar", this.contrato);
  }
  refrescaLista($event) {
    console.log("evento hijo: ", $event);

    if ($event.ACCION == "ELIMINA") {
      //this.eliminaGaleriaImagen($event.ID_REGISTRO,$event.NOM_FILE);
    }
    if ($event.ACCION == "EDITA") {
      this.actualizaContrato($event);
    }
    if ($event.ACCION == "INSERTA") {
      this.insertaContrato($event);
    }
  }
  insertaContrato(dts) {
    console.log("INSERTA IMAGEN==>", dts);
    this.cargando = true;
    this.dts_listacontratos = [];
    this.contrato.operacion = "I";
    this.contrato.fid_proyecto = this.inputDts["_id_proyecto"];
    this.contrato.fecha_contrato = moment(this.contrato.fecha_contrato)
      .format("YYYY-MM-DD")
      .toString();
    this.contrato.usuario_registro = this.s_usu_id;
    if (dts.NOM_FILE == "") {
      this.contrato.archivo_adjunto = this.contrato.archivo_adjunto;
    } else {
      this.contrato.archivo_adjunto = dts.PATH_COMPLETO;
    }
    console.log("DATOS A INSERTAR", this.contrato);
    this.crudContrato(this.contrato);
  }
  actualizaContrato(dts) {
    this.cargando = true;
    this.dts_listacontratos = [];
    this.contrato.fecha_contrato = moment(this.contrato.fecha_contrato)
      .format("YYYY-MM-DD")
      .toString();
    if (dts.NOM_FILE == "") {
      this.contrato.archivo_adjunto = this.contrato.archivo_adjunto;
    } else {
      let ruta = dts.RUTA;
      let nombre_archivo = dts.NOM_FILE;
      //let path_completo = `${ruta}/${nombre_archivo}`;
      this.contrato.archivo_adjunto = dts.PATH_COMPLETO;
    }
    console.log("DATOS A ACTUALIZAR", this.contrato);
    this.crudContrato(this.contrato);
  }
  eliminaContrato(dts) {
    this.cargando = true;
    this.dts_listacontratos = [];
    this.contrato.operacion = "D";
    this.contrato.fid_proyecto = this.inputDts["_id_proyecto"];
    this.contrato.usuario_registro = this.s_usu_id;
    this.contrato.tipo = dts.tipo;
    this.contrato.id_contrato = dts.id_contrato;
    this.contrato.fecha_contrato = moment().format("YYYY-MM-DD").toString();

    console.log("DATOS A ELIMINAR", this.contrato);
    this.crudContrato(this.contrato);
  }
  crudContrato(dts) {
    this._seguimiento.mantenimientoContrato(dts).subscribe(
      (result: any) => {
        
        console.log(result);
        this.prop_tipomsg = result.estado.includes("Correcto")
          ? "modal_success"
          : "modal_warning";
        this.prop_msg = result.estado.includes("Correcto")
          ? "La operacion se realizo de forma correcta"
          : "No se pudo realizar la operacion ";

        this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
        this.lista_contratos(this.inputDts["_id_proyecto"]);
        this.cerrarFormulario();

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

  cerrarFormulario() {
    this.pnl_formulariocontrato = false;
    $("#modalFormulario").modal("hide");
  }
  validacionFormulario() {
    if (this.contrato.detalle == "" || this.contrato.fecha_contrato == "") {
      this.estadoBoton = true;
      console.log("EstadoBoton", this.estadoBoton);
    } else {
      this.estadoBoton = false;
      console.log("EstadoBoton", this.estadoBoton);
    }
  }
}
