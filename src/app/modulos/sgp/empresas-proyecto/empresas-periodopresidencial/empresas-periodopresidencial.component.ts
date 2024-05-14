import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { ActivatedRoute } from "@angular/router";
import { Globals } from "../../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { MensajesComponent } from "@mensajes/mensajes.component";
import alasql from "alasql";
import { NgSelect2Module } from "ng-select2";
import { SeguimientoService } from "../../../seguimiento/seguimiento.service";
import { AutenticacionService } from "../../../seguridad/autenticacion.service";
import { SgpService } from "../../../sgp/sgp.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important
@Component({
  selector: "app-empresas-periodopresidencial",
  templateUrl: "./empresas-periodopresidencial.component.html",
  styleUrls: ["./empresas-periodopresidencial.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SeguimientoService,
    SgpService,
    NgSelect2Module,
  ],
})
export class EmpresasPeriodopresidencialComponent implements OnInit {
  @Input("periodo_finicio") periodo_finicio: any;
  @Input("periodo_ffin") periodo_ffin: any;
  @Input("periodo_titulo") periodo_titulo: any;
  @Input("dts_registros") dts_registros: any;
  @Input("dts_detalle") dts_detalle: any;
  @Output("enviarPadreEmpresas") enviarPadreEmpresas =
    new EventEmitter<string>();
  @Output("enviarPadreProyectos") enviarPadreProyectos =
    new EventEmitter<string>();

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
  public dts_permisos: any;
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

  public camposHabilitados: {};

  /***********************************
   * VARIABLES DEL COMPONENTE
   ***********************************/
  public total: any;
  dts_listaEmpresas: any;
  pnl_detalle: boolean;
  dts_listaEmpresasxProyecto: any;
  constructor(
    private _route: ActivatedRoute,
    private _sgp: SgpService,
    //private _accesos: AccesosRolComponent,
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
    console.log(this.periodo_finicio);
    console.log(this.periodo_ffin);
    console.log(this.periodo_titulo);
    console.log(this.dts_registros);
    console.log(this.dts_detalle);
    this.total = alasql(
      `select sum(monto_contrato::decimal) monto_contrato,count(*) cantidad 
      from ?  where  cast(fecha_convenio as date) between cast(? as date) and cast(? as date)`,
      [this.dts_detalle, this.periodo_finicio, this.periodo_ffin]
    );

    this.dts_listaEmpresas = alasql(
      `select nit,max(razon_social) razon_social,max(ciudad) ciudad, count(*) nro_proyectos ,sum(monto_contrato::decimal) monto_contrato
    from ? where    cast(fecha_convenio as date) between cast(? as date) and cast(? as date)
    group by nit`,
      [this.dts_detalle, this.periodo_finicio, this.periodo_ffin]
    );
    this.dts_listaEmpresasxProyecto = alasql(
      `select *
    from ? where  cast(fecha_convenio as date) between cast(? as date) and cast(? as date)
    `,
      [this.dts_detalle, this.periodo_finicio, this.periodo_ffin]
    );
    console.log("total por fechas", this.total);
    console.log("listaEmpresasxproyecto", this.dts_listaEmpresas);
  }
  detallar() {
    console.log("entra detalles");
    this.enviarDatosPadreEmpresas(this.dts_listaEmpresas);
    this.enviarDatosPadreProyectos(this.dts_listaEmpresasxProyecto);
  }
  enviarDatosPadreEmpresas(empresas: any) {
    this.enviarPadreEmpresas.emit(empresas);
  }
  enviarDatosPadreProyectos(proyectos: any) {
    this.enviarPadreProyectos.emit(proyectos);
  }
}
