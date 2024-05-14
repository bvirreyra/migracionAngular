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
  selector: "app-contactos",
  templateUrl: "./contactos.component.html",
  styleUrls: ["./contactos.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
    AccesosRolComponent,
  ],
})
export class ContactosComponent implements OnInit {
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
  public dts_listacontactos: any;
  public dts_listaempresaversion: any;
  public nombre_proyecto: any;
  public dts_listaTipoContacto: any;
  public id_tipoContacto: any;
  public habilitaAdicion = false;
  public nro_version = 0;
  public pnl_listacontactos = false;
  public contactos: {
    idcontacto: any;
    fidproyecto: any;
    idsgp: any;
    nroversion: any;
    tipocontacto: any;
    descripcion: any;
    email: any;
    telefonos: any;
    usrregistro: any;
    estado: any;
    operacion: any;
    tipo: any;
  };

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
    this.contactos = {
      idcontacto: 0,
      fidproyecto: 0,
      idsgp: 0,
      nroversion: 0,
      tipocontacto: "",
      descripcion: "",
      email: "",
      telefonos: "",
      usrregistro: 0,
      estado: 1,
      operacion: "",
      tipo: "",
    };
  }

  ngOnInit() {
    this.nro_version = this.inputDts["_nro_version"];
    this.listaEmpresaContactos(this.inputDts["_id_proyecto"]);
    this.nombre_proyecto = this.inputDts["_nombreproyecto"];
    console.log(this.inputDts);
    this.obtenerConexion()
      .then(() => {
        return this._accesos.accesosRestriccionesxRolV2(this.s_usu_id);
      })
      .then((data) => {
        this.camposHabilitados = data;
        this.listaTipoContacto(16);
        console.log("Adm Roles===>", this.camposHabilitados);
        this.paneles("LISTA_CONTACTOS");
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
    if (string == "LISTA_CONTACTOS") {
      $("#pnl_listacontactos").show();
      $("#pnl_nuevocontactos").hide();
      this.lista_contactos(this.inputDts["_id_proyecto"]);
    }
    if (string == "NUEVO_CONTACTO") {
      $("#modalContactos").modal("show");
      $("#btnRegistrar").show();
      $("#btnModificar").hide();
      this.limpiarContactos();
    }
  }

  listaTipoContacto(idtipoclasificador) {
    this._seguimiento.listaClasificador(idtipoclasificador).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          let resultado = this._fun.RemplazaNullArray(result);
          // resultado = resultado.filter((el) => {
          //   return el.descripciondetalleclasificador != "EMPRESA";
          // });
          this.dts_listaTipoContacto = resultado;
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

  listaEmpresaContactos(idproyecto) {
    this.cargando = true;
    this._seguimiento.listaEmpresaContactos(idproyecto).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_listaempresaversion = this._fun.RemplazaNullArray(result);
          console.log("version proyecto", this.nro_version);
          let valida = this.dts_listaempresaversion.filter(
            (item) => item.nro_version == this.nro_version
          );
          // if (valida.length <= 0) {
          //   this.habilitaAdicion = false;
          // } else {
          //   this.habilitaAdicion = true;
          // }
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
  lista_contactos(id_proy) {
    this.pnl_listacontactos = true;
    this.cargando = true;
    this.dts_listacontactos = [];
    this._seguimiento.listaContactosSgp(id_proy).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_listacontactos = this._fun.RemplazaNullArray(result);
          console.log("listacontactos", this.dts_listacontactos);
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
  filtradocontactos(listado, version) {
    var a = listado.filter((item) => item.nro_version == version);
    return a;
  }

  limpiarContactos() {
    this.contactos = {
      idcontacto: 0,
      fidproyecto: 0,
      idsgp: 0,
      nroversion: 0,
      tipocontacto: "",
      descripcion: "",
      email: "",
      telefonos: "",
      usrregistro: 0,
      estado: 1,
      operacion: "",
      tipo: "",
    };
  }

  obtieneTipoContacto() {
    console.log(this.id_tipoContacto);
    var datos = this.dts_listaTipoContacto;

    var filtro = datos.filter((element) => {
      return element.id_detalle == this.id_tipoContacto;
    });

    this.contactos.tipocontacto = filtro[0]["descripciondetalleclasificador"];
    console.log(this.contactos);
  }

  obtieneIdContacto(tipocontacto) {
    console.log(tipocontacto);
    var datos = this.dts_listaTipoContacto;

    var filtro = datos.filter((element) => {
      return element.descripciondetalleclasificador == tipocontacto;
    });

    this.id_tipoContacto = filtro[0]["id_detalle"];
  }

  abrirEdicion(registro) {
    this.contactos.idcontacto = registro.id_contacto;
    this.contactos.fidproyecto = registro.fid_proyecto;
    this.contactos.idsgp = 0;
    this.contactos.nroversion = 0;
    this.contactos.usrregistro = this.s_usu_id;
    this.contactos.operacion = "U";
    this.contactos.tipo = "NN";
    this.contactos.tipocontacto = registro.tipo_contacto;
    this.contactos.descripcion = registro.descripcion;
    this.contactos.email = registro.email;
    this.contactos.telefonos = registro.telefonos;
    this.obtieneIdContacto(registro.tipo_contacto);
    $("#btnRegistrar").hide();
    $("#btnModificar").show();
    $("#modalContactos").modal("show");
  }

  abrirEdicionEmpresa(registro) {
    this.contactos.idcontacto = registro.id_contacto;
    this.contactos.fidproyecto = registro.fid_proyecto;
    this.contactos.idsgp = 0;
    this.contactos.nroversion = 0;
    this.contactos.usrregistro = this.s_usu_id;
    this.contactos.operacion = "U";
    this.contactos.tipo = "NN";
    this.contactos.tipocontacto = registro.tipo_contacto;
    this.contactos.descripcion = registro.descripcion;
    this.contactos.email = registro.email;
    this.contactos.telefonos = registro.telefonos;
    $("#btnRegistrar").hide();
    $("#btnModificar").show();
    $("#modalEmpresa").modal("show");
  }

  abrirEliminacion(registro) {
    this.contactos.idcontacto = registro.id_contacto;
    this.contactos.fidproyecto = registro.fid_proyecto;
    this.contactos.idsgp = 0;
    this.contactos.nroversion = 0;
    this.contactos.usrregistro = this.s_usu_id;
    this.contactos.operacion = "D";
    this.contactos.tipo = "LOGICO";
    this.contactos.tipocontacto = registro.tipo_contacto;
    this.contactos.descripcion = registro.descripcion;
    this.contactos.email = registro.email;
    this.contactos.telefonos = registro.telefonos;
    this.obtieneIdContacto(registro.tipo_contacto);
    $("#modalEliminacion").modal("show");
  }

  insertaContactos() {
    this.cargando = true;

    this.dts_listacontactos = [];
    this.contactos.fidproyecto = this.inputDts["_id_proyecto"];
    this.contactos.idsgp = this.inputDts["_id_sgp"];
    this.contactos.nroversion = this.inputDts["_nro_version"];
    this.contactos.usrregistro = this.s_usu_id;
    this.contactos.operacion = "I";
    this.contactos.tipo = "NN";

    this._seguimiento.insertaContactos(this.contactos).subscribe(
      (result: any) => {
        
        this.prop_tipomsg = result.estado.includes("Correcto")
          ? "modal_success"
          : "modal_warning";
        this.prop_msg = result.estado.includes("Correcto")
          ? "Se realizo correctamente el registro"
          : "No se pudo realizar el registro";
        this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
        this.listaEmpresaContactos(this.inputDts["_id_proyecto"]);
        this.lista_contactos(this.inputDts["_id_proyecto"]);
        this.cargando = false;
        $("#modalContactos").modal("hide");
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
        $("#modalContactos").modal("hide");
        this.cargando = false;
      }
    );
  }

  actualizaContactos() {
    this.cargando = true;

    this.dts_listacontactos = [];

    this._seguimiento.actualizaContactos(this.contactos).subscribe(
      (result: any) => {
        
        console.log(result);
        this.prop_tipomsg = result.estado.includes("Correcto")
          ? "modal_success"
          : "modal_warning";
        this.prop_msg = result.estado.includes("Correcto")
          ? "Se actualizo correctamente el registro"
          : "No se pudo actualizar el registro";
        this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
        this.listaEmpresaContactos(this.inputDts["_id_proyecto"]);
        this.lista_contactos(this.inputDts["_id_proyecto"]);
        $("#modalContactos").modal("hide");
        $("#modalEmpresa").modal("hide");
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
        $("#modalContactos").modal("hide");
        $("#modalEmpresa").modal("hide");
        this.cargando = false;
      }
    );
  }

  eliminaContactos() {
    this.cargando = true;
    this.dts_listacontactos = [];
    this._seguimiento.eliminaContactos(this.contactos).subscribe(
      (result: any) => {
        
        this.prop_tipomsg = result.estado.includes("Correcto")
          ? "modal_success"
          : "modal_warning";
        this.prop_msg = result.estado.includes("Correcto")
          ? "Se realizo correctamente la eliminiacion"
          : "No se pudo realizar la eliminacino";
        this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
        this.listaEmpresaContactos(this.inputDts["_id_proyecto"]);
        this.lista_contactos(this.inputDts["_id_proyecto"]);
        this.cargando = false;
        $("#modalEliminacion").modal("hide");
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
        $("#modalEliminacion").modal("hide");
      }
    );
  }
}
