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
import { AccesosRolComponent } from "../../accesos-rol/accesos-rol.component";
import { SgpService } from "../../sgp.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-supervision",
  templateUrl: "./supervision.component.html",
  styleUrls: ["./supervision.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
  ],
})
export class SupervisionComponent implements OnInit {
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
  public dts_listasupervision: any;
  //public dts_listaempresaversion: any;
  public nombre_proyecto: any;
  public ultimoPorcentaje = 0;
  public habilitaAdicion = true;
  public nro_version = 0;
  public pnl_listasupervisiones = false;

  public supervision: {
    idsupervision: any;
    idsgp: any;
    nroversion: any;
    fidproyecto: any;
    avancefisico: any;
    informe: any;
    usrregistro: any;
    idestado: any;
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
    this.supervision = {
      idsupervision: 0,
      fidproyecto: 0,
      idsgp: 0,
      nroversion: 0,
      avancefisico: 0,
      informe: "",
      usrregistro: 0,
      idestado: 1,
      operacion: "",
      tipo: "",
    };
  }

  ngOnInit() {
    this.mask_numerodecimal = new Inputmask("9{1,9}.9{1,2}");
    this.mask_fecha = new Inputmask("9{1,2}/9{1,2}/9{1,4}");
    this.mask_numero = new Inputmask("9{1,9}");
    this.mask_gestion = new Inputmask("9999");

    this.nro_version = this.inputDts["_nro_version"];
    this.nombre_proyecto = this.inputDts["_nombreproyecto"];

    this.obtenerConexion()
      .then(() => {
        return this._accesos.accesosRestriccionesxRolV2(this.s_usu_id);
      })
      .then((data) => {
        this.camposHabilitados = data;
        console.log("Adm Roles===>", this.camposHabilitados);
        this.paneles("LISTA_SUPERVISION");
        this.cargarmascaras();
        this.habilitaAccion(this.ultimoPorcentaje);
      });
  }

  cargarmascaras() {
    var porcentaje = document.getElementById("porcentajeEntrada");
    this.mask_numerodecimal.mask(porcentaje);
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
    if (string == "LISTA_SUPERVISION") {
      $("#pnl_listasupervisiones").show();
      $("#pnl_nuevasupervision").hide();
      this.lista_supervisiones(this.inputDts["_id_proyecto"]);
    }
    if (string == "NUEVA_SUPERVISION") {
      $("#modalSupervision").modal("show");
      $("#btnRegistrar").show();
      $("#btnModificar").hide();
      this.limpiarSupervision();
    }
  }

  // listaEmpresaSupervision(idproyecto) {
  //   console.log('ENTRA LISTA EMPRESA')
  //   this.cargando = true;
  //   this._seguimiento.listaEmpresaSupervision(idproyecto).subscribe(
  //     (result: any) => {
  //       if (Array.isArray(result) && result.length > 0) {
  //         this.dts_listaempresaversion = this._fun.RemplazaNullArray(result);
  //         console.log('LISTA EMPRESA VERSION',this.dts_listaempresaversion);
  //         console.log("PORCENTAJE EMPRESA", this.ultimoPorcentaje);
  //         let valida = this.dts_listaempresaversion.filter(
  //           (item) => item.nro_version == this.nro_version
  //         );
  //         if (valida.length <= 0) {
  //           this.habilitaAdicion = false;
  //         } else {
  //           this.habilitaAccion(this.ultimoPorcentaje);
  //         }
  //       } else {
  //         this.prop_msg = "Alerta: No existen supervisiones registradas";
  //         this.prop_tipomsg = "danger";
  //         this._msg.formateoMensaje("modal_info", this.prop_msg);
  //       }
  //     },
  //     (error) => {
  //       this.errorMessage = <any>error;
  //       if (this.errorMessage != null) {
  //         this.prop_msg =
  //           "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
  //         this.prop_tipomsg = "danger";
  //         this._msg.formateoMensaje("modal_danger", this.prop_msg);
  //       }
  //     }
  //   );
  // }
  lista_supervisiones(id_proy) {
    console.log("INGRESA A LISTA SUPERVISIONES");
    this.pnl_listasupervisiones = true;
    this.cargando = true;
    this.dts_listasupervision = [];
    this._seguimiento.listaSupervisionSgp(id_proy).subscribe(
      (result: any) => {
        
        console.log("lista supervisiones v0", result);
        if (Array.isArray(result) && result.length > 0) {
          this.ultimoPorcentaje = result[0]["avance_fisico"];
          this.habilitaAccion(this.ultimoPorcentaje);
          this.dts_listasupervision = this._fun.RemplazaNullArray(result);
          console.log("lista de supervisiones", this.dts_listasupervision);
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

  filtradosupervisiones(listado, version) {
    var a = listado.filter((item) => item.nro_version == version);
    return a;
  }

  limpiarSupervision() {
    this.supervision = {
      idsupervision: 0,
      fidproyecto: 0,
      idsgp: 0,
      nroversion: 0,
      avancefisico: 0,
      informe: "",
      usrregistro: 0,
      idestado: 1,
      operacion: "",
      tipo: "",
    };
  }

  abrirEdicion(registro) {
    this.supervision.idsupervision = registro.id_supervision;
    this.supervision.fidproyecto = registro.fid_proyecto;
    this.supervision.idsgp = 0;
    this.supervision.nroversion = 0;
    this.supervision.usrregistro = this.s_usu_id;
    this.supervision.operacion = "U";
    this.supervision.tipo = "NN";
    this.supervision.avancefisico = registro.avance_fisico;
    this.supervision.informe = registro.detalle;
    $("#btnRegistrar").hide();
    $("#btnModificar").show();
    $("#modalSupervision").modal("show");
  }

  abrirEliminacion(registro) {
    this.supervision.idsupervision = registro.id_supervision;
    this.supervision.fidproyecto = registro.fid_proyecto;
    this.supervision.idsgp = 0;
    this.supervision.nroversion = 0;
    this.supervision.usrregistro = this.s_usu_id;
    this.supervision.operacion = "D";
    this.supervision.tipo = "LOGICO";
    this.supervision.idestado = 0;
    this.supervision.avancefisico = registro.avance_fisico;
    this.supervision.informe = registro.detalle;
    $("#modalEliminacion").modal("show");
  }

  insertarValidaPorcentaje() {
    this.supervision.avancefisico = this._fun.valorNumericoDecimal(
      this.supervision.avancefisico
    );
    console.log("aaa", this.ultimoPorcentaje, this.supervision.avancefisico);
    if (
      this._fun.valorNumericoDecimal(this.ultimoPorcentaje) >
      this._fun.valorNumericoDecimal(this.supervision.avancefisico)
    ) {
      $("#modalConfirmacion").modal("show");
      $("#btnModConfirmar").hide();
      $("#btnRegConfirmar").show();
      return;
    } else {
      this.insertaSupervision();
    }
  }

  actualizarValidaPorcentaje() {
    this.supervision.avancefisico = this._fun.valorNumericoDecimal(
      this.supervision.avancefisico
    );

    console.log(
      "ooo",
      this.ultimoPorcentaje,
      this.ultimoPorcentaje | 0,
      this.supervision.avancefisico + ".00"
    );
    if (
      this.ultimoPorcentaje >
      this._fun.valorNumericoDecimal(this.supervision.avancefisico)
    ) {
      $("#modalConfirmacion").modal("show");
      $("#btnModConfirmar").show();
      $("#btnRegConfirmar").hide();
      return;
    } else {
      this.actualizaSupervision();
    }
  }

  insertaSupervision() {
    this.cargando = true;

    if (this.supervision.informe == "" || this.supervision.avancefisico < 0) {
      this.prop_msg = "Alerta: Ambos datos son requeridos";
      this._msg.formateoMensaje("modal_info", this.prop_msg);
      return;
    }
    if (this.supervision.avancefisico > 100) {
      this.prop_msg = "Alerta: El porcentaje no puede ser mayor al 100%";
      this._msg.formateoMensaje("modal_info", this.prop_msg);
      return;
    }

    this.dts_listasupervision = [];
    this.supervision.fidproyecto = this.inputDts["_id_proyecto"];
    this.supervision.idsgp = this.inputDts["_id_sgp"];
    this.supervision.nroversion = this.inputDts["_nro_version"];
    this.supervision.usrregistro = this.s_usu_id;
    this.supervision.operacion = "I";
    this.supervision.tipo = "NN";

    this._seguimiento.insertaSupervision(this.supervision).subscribe(
      (result: any) => {
        
        this.prop_tipomsg = result.estado.includes("Correcto")
          ? "modal_success"
          : "modal_warning";
        this.prop_msg = result.estado.includes("Correcto")
          ? "Se realizo correctamente el registro"
          : "No se pudo realizar el registro";
        this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
        this.lista_supervisiones(this.inputDts["_id_proyecto"]);
        //this.listaEmpresaSupervision(this.inputDts["_id_proyecto"]);
        this.cargando = false;
        $("#modalSupervision").modal("hide");
        $("#modalConfirmacion").modal("hide");
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
        $("#modalSupervision").modal("hide");
        $("#modalConfirmacion").modal("hide");
        this.cargando = false;
      }
    );
  }

  actualizaSupervision() {
    this.cargando = true;

    if (this.supervision.informe == "" || this.supervision.avancefisico <= 0) {
      this.prop_msg = "Alerta: Ambos datos son requeridos";
      this._msg.formateoMensaje("modal_info", this.prop_msg);
      return;
    }
    if (this.supervision.avancefisico > 100) {
      this.prop_msg = "Alerta: El porcentaje no puede ser mayor al 100%";
      this._msg.formateoMensaje("modal_info", this.prop_msg);
      return;
    }
    this.dts_listasupervision = [];

    this._seguimiento.actualizaSupervision(this.supervision).subscribe(
      (result: any) => {
        
        console.log(result);
        this.prop_tipomsg = result.estado.includes("Correcto")
          ? "modal_success"
          : "modal_warning";
        this.prop_msg = result.estado.includes("Correcto")
          ? "Se actualizo correctamente el registro"
          : "No se pudo actualizar el registro";
        this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
        this.lista_supervisiones(this.inputDts["_id_proyecto"]);
        //this.listaEmpresaSupervision(this.inputDts["_id_proyecto"]);
        $("#modalSupervision").modal("hide");
        $("#modalConfirmacion").modal("hide");
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
        $("#modalSupervision").modal("hide");
        this.cargando = false;
      }
    );
  }

  eliminaSupervision() {
    this.cargando = true;
    this.dts_listasupervision = [];
    this._seguimiento.eliminaSupervision(this.supervision).subscribe(
      (result: any) => {
        
        this.prop_tipomsg = result.estado.includes("Correcto")
          ? "modal_success"
          : "modal_warning";
        this.prop_msg = result.estado.includes("Correcto")
          ? "Se realizo correctamente la eliminiacion"
          : "No se pudo realizar la eliminacino";
        this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
        this.lista_supervisiones(this.inputDts["_id_proyecto"]);
        //this.listaEmpresaSupervision(this.inputDts["_id_proyecto"]);

        this.cargando = false;
        $("#modalEliminacion").modal("hide");
        $("#modalConfirmacion").modal("hide");
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
  habilitaAccion(porcentaje) {
    console.log("valor ingreso", porcentaje);
    if ((porcentaje | 0) < 100) {
      this.habilitaAdicion = true;
    } else {
      this.habilitaAdicion = true;
    }
  }
}
