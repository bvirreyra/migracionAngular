import { DatePipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Globals } from "../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";
import { ArchivocentralService } from "../archivocentral.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-detalle-archivo",
  templateUrl: "./detalle-archivo.component.html",
  styleUrls: ["./detalle-archivo.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    ArchivocentralService,
  ],
})
export class DetalleArchivoComponent implements OnInit {
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

  //VARIABLES DEL COMPONENTE
  public m_idcabecera: any;
  public m_codigo: any;
  public m_gestioncabecera: any;
  public m_indicecontenedor: any;

  public v_idcabecera: any;
  public v_codigo: any;
  public pnl_Formulario = false;
  //dts
  public dts_listadetalle: any;
  public dts_listacontenedor: any;
  public habilitaguardado = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _archivocentral: ArchivocentralService,

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
    this.obtenerConexion();
    this.m_idcabecera = decodeURIComponent(this.getUrlVars()["idcabecera"]);
    this.m_codigo = decodeURIComponent(
      this.getUrlVars()["codigo"].replace("%20", " ")
    );
    this.m_gestioncabecera = decodeURIComponent(this.getUrlVars()["gestion"]);
    this.v_idcabecera = "1";
    this.v_codigo = "2";
    console.log(this.m_idcabecera, this.m_codigo, this.m_gestioncabecera);
    this.paneles("LISTA_DETALLE");
  }
  /*obteniendo los datos de la url*/
  getUrlVars() {
    var vars = [],
      hash;
    var hashes = window.location.href
      .slice(window.location.href.indexOf("?") + 1)
      .split("&");
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split("=");
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  }
  obtenerConexion() {
    this.dtsDatosConexion = JSON.parse(localStorage.getItem("dts_con"));
    this.dts_roles_usuario = JSON.parse(localStorage.getItem("dts_rol"));
    this.s_idrol = this.dtsDatosConexion.s_idrol;
    this.s_user = this.dtsDatosConexion.s_idrol;
    this.s_nomuser = this.dtsDatosConexion.s_nomuser;
    this.s_usu_id = this.dtsDatosConexion.s_usu_id;
    this.s_usu_id_sipta = this.dtsDatosConexion.s_usu_id_sipta;
    this.s_usu_id_sispre = this.dtsDatosConexion.s_usu_id_sispre;
    this.s_ci_user = this.dtsDatosConexion.s_ci_user;
  }
  paneles(string) {
    if (string == "LISTA_DETALLE") {
      this.ListaDetalleCabecera();
      this.ListaContenedor();
      console.log(this.m_idcabecera);
    }
    if (string == "AGRUPAR") {
      this.PreAgrupar();
    }
  }
  ListaDetalleCabecera() {
    this.cargando = true;
    this.dts_listadetalle = [];
    this._archivocentral.listaDetalleCabecara(this.m_idcabecera).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_listadetalle = this._fun.RemplazaNullArray(result);
          console.log(this.dts_listadetalle);
        } else {
          this.prop_msg = "Alerta: No existen registros";
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
          this._msg.formateoMensaje("modal_info", this.prop_msg);
          this.cargando = false;
        }
      }
    );
  }
  ListaContenedor() {
    this.cargando = true;
    this.dts_listacontenedor = [];
    this._archivocentral.listaContenedor(this.m_idcabecera).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_listacontenedor = this._fun.RemplazaNullArray(result);
          console.log(this.dts_listacontenedor);
        } else {
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
          this.cargando = false;
        }
      }
    );
  }
  PreAgrupar() {
    this.cargando = true;
    console.log("entra");
    var nro = this.dts_listadetalle.length;
    this.obtieneIndice(this.m_codigo, this.m_gestioncabecera).then((dts) => {
      this.m_indicecontenedor = dts;
      for (var i = 0; i < nro; i++) {
        var name = "#chk_" + i;
        if ($(name).is(":checked")) {
          var valor = $(name).val();
          this.InsertaAgrupacion(valor, this.m_indicecontenedor);
        }
      }
      this.ListaDetalleCabecera();
      this.ListaContenedor();
      this.cargando = false;
    });
  }
  InsertaAgrupacion(valor, agrupador) {
    this.cargando = true;
    this.habilitaguardado = true;
    this.dts_listadetalle = [];
    console.log(agrupador);
    this._archivocentral
      .insertaAgrupacion(this.m_idcabecera, agrupador, valor, this.s_usu_id)
      .subscribe(
        (result: any) => {
          
          this.habilitaguardado = false;
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
          this.habilitaguardado = false;
        }
      );
  }
  obtieneIndice(valor, gestion) {
    return new Promise((resolve, reject) => {
      this._archivocentral.obtieneIndice(valor, gestion).subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            result = this._fun.RemplazaNullArray(result);
            resolve(result[0]["vcorrelativo"]);
          } else {
            this.prop_msg = "Alerta: No existen registros";
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
    });
  }

  preActualizarAgrupacion(codigo, agrupador_old, index) {
    var name = "#select_" + index;
    console.log(codigo, agrupador_old);
    var agrupador_new = $(name).val();
    console.log(agrupador_new);
    if (
      agrupador_new == null ||
      agrupador_new == "null" ||
      agrupador_new == undefined
    ) {
      this.prop_msg = "Debe seleccionar un contenedor";
      this._msg.formateoMensaje("modal_info", this.prop_msg);
      return;
    }
    console.log("obtiene", codigo, agrupador_old, agrupador_new);
    this.ActualizaAgrupacion(codigo, agrupador_old, agrupador_new);
  }
  ActualizaAgrupacion(codigo, agrupador_old, agrupador_new) {
    this.cargando = true;
    this.habilitaguardado = true;
    this.dts_listadetalle = [];
    this._archivocentral
      .actualizaAgrupacion(
        this.m_idcabecera,
        agrupador_old,
        agrupador_new,
        codigo,
        this.s_usu_id
      )
      .subscribe(
        (result: any) => {
          
          console.log(result);

          if (result["estado"] == "CORRECTO") {
            this.ListaDetalleCabecera();
            this.ListaContenedor();
          } else {
            this.prop_msg = "Alerta: No existen registros";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
          this.cargando = false;
          this.habilitaguardado = false;
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
          this.habilitaguardado = false;
        }
      );
  }
  EliminaAgrupacion(codigo) {
    this.cargando = true;
    this.habilitaguardado = true;
    this.dts_listadetalle = [];
    this._archivocentral
      .eliminaAgrupacion(this.m_idcabecera, codigo, this.s_usu_id)
      .subscribe(
        (result: any) => {
          
          console.log(result);

          if (result["estado"] == "CORRECTO") {
            this.ListaDetalleCabecera();
            this.ListaContenedor();
          } else {
            this.prop_msg = "Alerta: No existen registros";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
          this.habilitaguardado = false;
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
          this.habilitaguardado = false;
        }
      );
  }

  volver() {
    var ruta = "12_archivocentral";
    var conexion = this.s_idcon;
    var modulo = this.s_idmod;
    this._router.navigate([
      ruta + "/" + conexion + "/" + modulo + "/12_bandejaarchivocentral",
    ]);
  }

  abrirFormulario(idcabeceraV, codigoV, contenedorV) {
    var ruta = "12_archivocentral";
    var conexion = this.s_idcon;
    var modulo = this.s_idmod;

    console.log(codigoV, this.m_codigo);
    this._router.navigate(
      [ruta + "/" + conexion + "/" + modulo + "/12_formulariomodificacion"],
      {
        queryParams: {
          idcabecera: idcabeceraV,
          codigo: codigoV,
          contenedor: contenedorV,
          cabeceraCaja: this.m_idcabecera,
          codigoCaja: this.m_codigo,
          gestionCaja: this.m_gestioncabecera,
        },
      }
    );
  }
}
