import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Inputmask from "inputmask";
import { Globals } from "../../../../../global";

/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { AutenticacionService } from "../../../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../../../seguridad/mensajes/mensajes.component";
import { AccesosRolComponent } from "../../../accesos-rol/accesos-rol.component";
import { SgpService } from "../../../sgp.service";
import { FormularioResumenService } from "./formulario-resumen.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important
declare var $: any;
declare let L;

@Component({
  selector: "app-formulario-resumen",
  templateUrl: "./formulario-resumen.component.html",
  styleUrls: ["./formulario-resumen.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
    AccesosRolComponent,
    FormularioResumenService,
  ],
})
export class FormularioResumenComponent implements OnInit {
  @Input("dts_registro") dts_registro: any;
  @Output() respuestaPadre = new EventEmitter<string>();

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

  /***********************************
   * VARIABLES DEL COMPONENTE
   ***********************************/
  public dts_resumen: any;
  public datos_resumen: {
    operacion: string;
    id_resumen: number;
    fid_compromiso: number;
    nro_beneficiarios: number;
    descripcion_beneficiarios: string;
    nro_beneficiarios_indirectos: number;
    descripcion_beneficiarios_indirectos: string;
    costo_proyecto: string;
    superficie_terreno: string;
    superficie_construida: string;
    costo_metro_cuadrado_sus: string;
    costo_por_beneficiario: string;
    alcance: string;
    compromiso_presidencial: string;
    situacion_actual: string;
    estado_actual: string;
    usuario_registro: string;
    fecha_registro: Date;
    usuario_modifica: string;
    fecha_modifica: Date;
    id_estado: number;
  };
  public btnRegistraResumen = false;
  public btnEditaResumen = false;
  public pnlFormulario = false;
  public btnReporteResumen = false;
  public tipoReporte: string;

  public camposHabilitados: {};

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _formularioresumen: FormularioResumenService,

    private _sgp: SgpService,
    private _accesos: AccesosRolComponent,

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

    this.datos_resumen = {
      operacion: "",
      id_resumen: null,
      fid_compromiso: null,
      nro_beneficiarios: null,
      descripcion_beneficiarios: null,
      nro_beneficiarios_indirectos: null,
      descripcion_beneficiarios_indirectos: null,
      costo_proyecto: null,
      superficie_terreno: null,
      superficie_construida: null,
      costo_metro_cuadrado_sus: null,
      costo_por_beneficiario: null,
      alcance: null,
      compromiso_presidencial: null,
      situacion_actual: null,
      estado_actual: null,
      usuario_registro: null,
      fecha_registro: null,
      usuario_modifica: null,
      fecha_modifica: null,
      id_estado: null,
    };
  }

  ngOnInit() {
    this.mask_numerodecimal = new Inputmask("9{1,9}.9{1,2}");
    this.mask_gestion = new Inputmask("9999");
    this.obtenerConexion();
    this._accesos.accesosRestriccionesxRolV2(this.s_usu_id).then((data) => {
      this.camposHabilitados = data;
      console.log("Adm Roles===>", this.camposHabilitados);
      this.datosResumenCompromiso(this.dts_registro.id_compromiso);
    });
    console.log("datos registro" + JSON.stringify(this.dts_registro));
  }
  obtenerConexion() {
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
  async accesosRestriccionesxRolV2(id) {
    let promise = new Promise((resolve, reject) => {
      this._autenticacion.administracion_roles(id).subscribe(
        (result: any) => {
          this.camposHabilitados = result[0].roles_asignados[0];
          console.log("adm3", this.camposHabilitados);
          resolve(this.camposHabilitados);
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_info", this.prop_msg);
          }
        }
      );
    });
    return await promise;
  }
  datosResumenCompromiso(id_compromiso) {
    this.pnlFormulario = true;
    this._formularioresumen.datosResumenCompromiso(id_compromiso).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.btnReporteResumen = true;
          this.dts_resumen = result[0];
          this.datos_resumen.operacion = "U";
          this.datos_resumen.id_resumen = this.dts_resumen.id_resumen;
          this.datos_resumen.fid_compromiso = this.dts_resumen.fid_compromiso;
          this.datos_resumen.nro_beneficiarios =
            this.dts_resumen.nro_beneficiarios;
          this.datos_resumen.descripcion_beneficiarios =
            this.dts_resumen.descripcion_beneficiarios;
          this.datos_resumen.nro_beneficiarios_indirectos =
            this.dts_resumen.nro_beneficiarios_indirectos;
          this.datos_resumen.descripcion_beneficiarios_indirectos =
            this.dts_resumen.descripcion_beneficiarios_indirectos;
          this.datos_resumen.costo_proyecto = this._fun
            .valorNumericoDecimal(this.dts_resumen.costo_proyecto)
            .toFixed(2);
          this.datos_resumen.superficie_terreno = this._fun
            .valorNumericoDecimal(this.dts_resumen.superficie_terreno)
            .toFixed(2);
          this.datos_resumen.superficie_construida = this._fun
            .valorNumericoDecimal(this.dts_resumen.superficie_construida)
            .toFixed(2);
          this.datos_resumen.costo_metro_cuadrado_sus = this._fun
            .valorNumericoDecimal(this.dts_resumen.costo_metro_cuadrado_sus)
            .toFixed(2);
          this.datos_resumen.costo_por_beneficiario = this._fun
            .valorNumericoDecimal(this.dts_resumen.costo_por_beneficiario)
            .toFixed(2);
          this.datos_resumen.alcance = this.dts_resumen.alcance;
          this.datos_resumen.compromiso_presidencial =
            this.dts_resumen.compromiso_presidencial;
          this.datos_resumen.situacion_actual =
            this.dts_resumen.situacion_actual;
          this.datos_resumen.estado_actual = this.dts_resumen.estado_actual;
          this.datos_resumen.usuario_registro =
            this.dts_resumen.usuario_registro;
          this.datos_resumen.fecha_registro = this.dts_resumen.fecha_registro;
          this.datos_resumen.usuario_modifica = this.s_usu_id;
          this.datos_resumen.fecha_modifica = this.dts_resumen.fecha_modifica;
          this.datos_resumen.id_estado = this.dts_resumen.id_estado;
          this.pnlFormulario = true;
          if (this.datos_resumen.estado_actual == "PROYECTISTA") {
            this.tipoReporte = "CONSOLIDADO";
          } else {
            this.tipoReporte = "PRELIMINAR";
          }
          if (
            this.datos_resumen.estado_actual == "PROYECTISTA" &&
            this.camposHabilitados["_proyectista_administrador"] == false
          ) {
            this.btnEditaResumen = true;
          } else {
            if (
              this.datos_resumen.estado_actual == "TERRITORIALISTA" &&
              (this.camposHabilitados["_proyectista_administrador"] == false ||
                this.camposHabilitados["_tecnica"] == false ||
                this.camposHabilitados["_proyectista_usuario"] == false)
            ) {
              this.btnEditaResumen = true;
            } else {
              this.btnEditaResumen = false;
            }
          }

          setTimeout(() => {
            this.cargarmascaras();
          }, 50);
        } else {
          this.btnReporteResumen = false;
          this.tipoReporte = "PRELIMINAR";
          this.datos_resumen.operacion = "I";
          this.datos_resumen.usuario_registro = this.s_usu_id;
          this.datos_resumen.fid_compromiso = this.dts_registro.id_compromiso;
          this.datos_resumen.estado_actual = "TERRITORIALISTA";
          this.datos_resumen.costo_proyecto = this.dts_registro.monto_bs;
          this.pnlFormulario = true;

          if (
            this.camposHabilitados["_proyectista_administrador"] == false ||
            this.camposHabilitados["_tecnica"] == false ||
            this.camposHabilitados["_solicitud_administrador"] == false
          ) {
            this.btnRegistraResumen = true;
          }
          setTimeout(() => {
            this.cargarmascaras();
          }, 50);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la petición BUSQUEDA5");
        }
      }
    );
  }
  enviarRespuestaPadre(dts) {
    console.log("entra aqui");
    this.respuestaPadre.emit(dts);
  }
  InsertaResumen() {
    this.datos_resumen.costo_proyecto = this._fun
      .valorNumericoDecimal(this.datos_resumen.costo_proyecto)
      .toFixed(2);
    this.datos_resumen.superficie_terreno = this._fun
      .valorNumericoDecimal(this.datos_resumen.superficie_terreno)
      .toFixed(2);
    this.datos_resumen.superficie_construida = this._fun
      .valorNumericoDecimal(this.datos_resumen.superficie_construida)
      .toFixed(2);
    this.datos_resumen.costo_metro_cuadrado_sus = this._fun
      .valorNumericoDecimal(this.datos_resumen.costo_metro_cuadrado_sus)
      .toFixed(2);
    this.datos_resumen.costo_por_beneficiario = this._fun
      .valorNumericoDecimal(this.datos_resumen.costo_por_beneficiario)
      .toFixed(2);
    this._formularioresumen.crudResumenCompromiso(this.datos_resumen).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.prop_msg = result[0].message;
          this.prop_tipomsg = result[0].msg_estado;
          this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);

          this.enviarRespuestaPadre("CIERRA_MODAL_FORMULARIO_RESUMEN");
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la petición BUSQUEDA5");
        }
      }
    );
  }
  EditaResumen() {
    this.datos_resumen.costo_proyecto = this._fun
      .valorNumericoDecimal(this.datos_resumen.costo_proyecto)
      .toFixed(2);
    this.datos_resumen.superficie_terreno = this._fun
      .valorNumericoDecimal(this.datos_resumen.superficie_terreno)
      .toFixed(2);
    this.datos_resumen.superficie_construida = this._fun
      .valorNumericoDecimal(this.datos_resumen.superficie_construida)
      .toFixed(2);
    this.datos_resumen.costo_metro_cuadrado_sus = this._fun
      .valorNumericoDecimal(this.datos_resumen.costo_metro_cuadrado_sus)
      .toFixed(2);
    this.datos_resumen.costo_por_beneficiario = this._fun
      .valorNumericoDecimal(this.datos_resumen.costo_por_beneficiario)
      .toFixed(2);
    this._formularioresumen.crudResumenCompromiso(this.datos_resumen).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.prop_msg = result[0].message;
          this.prop_tipomsg = "modal_success";
          this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);

          this.enviarRespuestaPadre("CIERRA_MODAL_FORMULARIO_RESUMEN");
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la petición BUSQUEDA5");
        }
      }
    );
  }
  cargarmascaras() {
    var superficie_construida = document.getElementById(
      "superficie_construida"
    );
    this.mask_numerodecimal.mask(superficie_construida);
    var superficie_terreno = document.getElementById("superficie_terreno");
    this.mask_numerodecimal.mask(superficie_terreno);
    var costo_proyecto = document.getElementById("costo_proyecto");
    this.mask_numerodecimal.mask(costo_proyecto);
    var costo_por_beneficiario = document.getElementById(
      "costo_por_beneficiario"
    );
    this.mask_numerodecimal.mask(costo_por_beneficiario);
    var costo_metro_cuadrado = document.getElementById("costo_metro_cuadrado");
    this.mask_numerodecimal.mask(costo_metro_cuadrado);
  }
  rptResumenTecnico(tipo: string, id: number) {
    this.cargando = true;
    console.log("generando reporte", tipo, id);
    const miDTS = { tipoReporte: tipo, idCompromiso: id };
    let nombreReporte = "";
    tipo = "PRELIMINAR"
      ? (nombreReporte = `ResumenTecnicoPreliminar${id}.pdf`)
      : (nombreReporte = `ResumenTecnico${id}.pdf`);

    this._formularioresumen.rptResumenTecnico(miDTS).subscribe(
      (result: any) => {
        const url = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", nombreReporte);
        link.click();
        this.cargando = false;
      },
      (error) => {
        this.cargando = false;
        this.errorMessage = <any>error;
        if (this.errorMessage != null)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage,
            10
          );
      }
    );
  }
  calculos() {
    console.log("CALCULANDO");
    this.datos_resumen.costo_proyecto == ""
      ? "0"
      : this.datos_resumen.costo_proyecto;
    this.datos_resumen.superficie_construida == ""
      ? "0"
      : this.datos_resumen.superficie_construida;
    this.datos_resumen.nro_beneficiarios == 0
      ? 0
      : this.datos_resumen.nro_beneficiarios;
    if (
      this.datos_resumen.costo_proyecto == "0" ||
      this.datos_resumen.superficie_construida == "0" ||
      this.datos_resumen.nro_beneficiarios == 0
    ) {
      this.datos_resumen.costo_metro_cuadrado_sus = "0";
      this.datos_resumen.costo_por_beneficiario = "0";
    } else {
      this.datos_resumen.costo_metro_cuadrado_sus = (
        this._fun.valorNumericoDecimal(this.datos_resumen.costo_proyecto) /
        this._fun.valorNumericoDecimal(this.datos_resumen.superficie_construida)
      ).toFixed(2);
      this.datos_resumen.costo_por_beneficiario = (
        this._fun.valorNumericoDecimal(this.datos_resumen.costo_proyecto) /
        this._fun.valorNumericoDecimal(this.datos_resumen.nro_beneficiarios)
      ).toFixed(2);
    }
  }
}
