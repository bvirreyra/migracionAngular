import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Globals } from "../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { MensajesComponent } from "@mensajes/mensajes.component";
import alasql from "alasql";
import { NgSelect2Module } from "ng-select2";
import { SeguimientoService } from "../../seguimiento/seguimiento.service";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { SgpService } from "../../sgp/sgp.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important
@Component({
  selector: "app-empresas-proyecto",
  templateUrl: "./empresas-proyecto.component.html",
  styleUrls: ["./empresas-proyecto.component.css"],
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
export class EmpresasProyectoComponent implements OnInit {
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
  public dts_listaEmpresasProyectos: any;
  dts_listaEmpresas: any;
  dts_listaProyectosxEmpresa: any;
  m_nit: any;
  dts_listaEmpresasCife: any;
  dts_listaEmpresasCif: any;
  total_contratos: any;
  total_contratoscife: any;
  total_contratoscif: any;

  public pnl_detalle: boolean = false;
  public pnl_listaproyectos: boolean = false;
  public pnlTarjetas: boolean = false;
  public pnlTarjetaPeriodoPresidencial: boolean = false;
  public dts_detalle: any;
  public dts_listaProyectos: any;
  public titulo: any;
  public dts_periodospresidenciales: any;
  public dts_periodospresidencialesagrupados: any;
  dts_detalle_hijo: any;
  dts_listaProyectosFiltrado: any;

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
    this.obtenerConexion().then(() => {
      this.listaEmpresaProyectos()
        .then((dts) => {
          this.dts_listaEmpresasProyectos = dts;
          this.dts_listaEmpresas = alasql(
            `select  
          nit,razon_social,ciudad, count(*) nro_proyectos,sum(monto_contrato::decimal) monto_contrato
          from ? 
          group by nit,razon_social,ciudad 
          order by ciudad,razon_social`,
            [this.dts_listaEmpresasProyectos]
          );
          this.total_contratos = alasql(
            "select sum(monto_contrato::decimal) monto_contrato,count(*) cantidad from ?",
            [this.dts_listaEmpresasProyectos]
          );
          console.log("totalcontratos", this.total_contratos);

          this.dts_listaEmpresasCife = alasql(
            `select nit,max(razon_social) razon_social,max(ciudad) ciudad, count(*) nro_proyectos ,sum(monto_contrato::decimal) monto_contrato
          from ? where tipo_ejecucion='CIFE'  
          group by nit`,
            [this.dts_listaEmpresasProyectos]
          );
          this.total_contratoscife = alasql(
            `select sum(monto_contrato::decimal) monto_contrato,count(*) cantidad from ? where  tipo_ejecucion ='CIFE'`,
            [this.dts_listaEmpresasProyectos]
          );
          this.dts_listaEmpresasCif = alasql(
            `select nit,max(razon_social) razon_social,max(ciudad) ciudad, count(*) nro_proyectos ,sum(monto_contrato::decimal) monto_contrato
          from ? where tipo_ejecucion='CIF'  
          group by nit`,
            [this.dts_listaEmpresasProyectos]
          );
          this.total_contratoscif = alasql(
            `select sum(monto_contrato::decimal) monto_contrato,count(*) cantidad from ? where  tipo_ejecucion ='CIF'`,
            [this.dts_listaEmpresasProyectos]
          );
          this.prepararTabla();
          this.pnlTarjetas = true;
          console.log("Empresas==>", this.dts_listaEmpresas);
          return this.periodosPresidenciales();
        })
        .then((dts) => {
          this.dts_periodospresidenciales = dts;
          this.dts_periodospresidencialesagrupados = alasql(
            `select nombre_completo ,min(fecha_inicio ) as fecha_inicio,
            max(fecha_fin ) as fecha_fin
          from ? where id_estado =1 group by nombre_completo`,
            [dts]
          );
          console.log(
            "periodopresidencialagrupado",
            this.dts_periodospresidencialesagrupados
          );
        });
    });
  }
  obtenerConexion() {
    return new Promise((resolve, reject) => {
      this.dtsDatosConexion = JSON.parse(localStorage.getItem("dts_con"));
      this.dts_roles_usuario = JSON.parse(localStorage.getItem("dts_rol"));
      this.dts_permisos = JSON.parse(localStorage.getItem("dts_permisos"));
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
  listaEmpresaProyectos() {
    return new Promise((resolve, reject) => {
      this.cargando = true;
      this._sgp.listaEmpresasProyectos().subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            const lista = this._fun.RemplazaNullArray(result);
            console.log(lista);
            resolve(lista);
            this.cargando = false;
          } else {
            this.prop_msg = "Alerta: No existen registros";
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
            this.cargando = false;
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  prepararTabla() {
    this._fun.limpiatabla(".dt-empresas");
    setTimeout(() => {
      let confiTable = this._fun.CONFIGURACION_TABLA_V7(
        [20, 50, 100, 150, 200],
        false,
        20,
        true,
        [
          [3, "desc"],
          [1, "asc"],
        ],
        false
      );
      if (!$.fn.dataTable.isDataTable(".dt-empresas")) {
        var table = $(".dt-empresas").DataTable(confiTable);
        this._fun.inputTable(table, [0, 1]);
        this._fun.selectTable(table, [2, 3]);
      }
      // const obj = document.getElementById('tablaDetalle');
      // obj.scrollIntoView({block: "start", behavior: "smooth"});
    }, 100);
  }
  detallar(tipo, nit?) {
    if (tipo == "TOTAL_CONTRATOS") {
      $("#pnlTarjetas").hide();
      this.pnlTarjetaPeriodoPresidencial = !this.pnlTarjetaPeriodoPresidencial;
      this.dts_detalle = [];
      this.titulo = "Lista de Empresas";
      this.pnl_listaproyectos = false;
      this.dts_detalle = alasql(
        `select *
      from ?         `,
        [this.dts_listaEmpresasProyectos]
      );
    }
    if (tipo == "CONTRATOS_CIFE") {
      $("#pnlTarjetas").hide();
      this.pnlTarjetaPeriodoPresidencial = !this.pnlTarjetaPeriodoPresidencial;
      this.dts_detalle = [];

      this.titulo = "Lista de Empresas";
      this.pnl_listaproyectos = false;
      this.dts_detalle = alasql(
        `select *
      from ? where tipo_ejecucion='CIFE'        `,
        [this.dts_listaEmpresasProyectos]
      );
    }

    if (tipo == "CONTRATOS_CIF") {
      $("#pnlTarjetas").hide();
      this.pnlTarjetaPeriodoPresidencial = !this.pnlTarjetaPeriodoPresidencial;
      this.dts_detalle = [];
      this.titulo = "Lista de Empresas";
      //this.pnl_detalle = !this.pnl_detalle;
      this.pnl_listaproyectos = false;
      this.dts_detalle = alasql(
        `select *
      from ? where tipo_ejecucion='CIF'        `,
        [this.dts_listaEmpresasProyectos]
      );
    }
    if (tipo == "MOSTRAR_DETALLE") {
      setTimeout(() => {
        const obj = document.getElementById("pnlDetalle");
        obj.scrollIntoView({ block: "start", behavior: "smooth" });
      }, 300);
      this.pnl_detalle = true;

      this.titulo = "Lista de Empresas";

      this.prepararTabla();
    }
    if (tipo == "LISTA_PROYECTOS") {
      if (this.pnl_listaproyectos == false) {
        this.pnl_listaproyectos = true;
        $("#pnlDetalle").hide();
      }

      this.dts_listaProyectosFiltrado = alasql(
        `select *
        from ? where nit=? order by monto_contrato desc`,
        [this.dts_listaProyectos, nit]
      );
      this.prepararTablaListaProyectos();
    }
  }
  retornar() {
    this.pnl_listaproyectos = false;
    $("#pnlDetalle").show();
  }
  retornar_tarjetas() {
    this.pnlTarjetaPeriodoPresidencial = false;
    this.pnl_listaproyectos = false;
    this.pnl_detalle = false;
    $("#pnlTarjetas").show();
  }
  prepararTablaListaProyectos() {
    this._fun.limpiatabla(".dt-listaproyectos");
    setTimeout(() => {
      let confiTable = this._fun.CONFIGURACION_TABLA_V7(
        [20, 50, 100, 150, 200],
        false,
        20,
        null,
        [[6, "desc"]],
        false
      );
      if (!$.fn.dataTable.isDataTable(".dt-listaproyectos")) {
        var table = $(".dt-listaproyectos").DataTable(confiTable);
        this._fun.inputTable(table, [0, 3, 4, 5]);
        this._fun.selectTable(table, [1, 2]);
      }
      // const obj = document.getElementById('tablaDetalle');
      // obj.scrollIntoView({block: "start", behavior: "smooth"});
    }, 100);
  }
  periodosPresidenciales() {
    return new Promise((resolve, reject) => {
      console.log("cargando periodo presidencial");
      this.cargando = true;
      this._sgp.periodoPresidencial().subscribe(
        (result: any) => {
          console.log("result list", result);
          if (Array.isArray(result) && result.length > 0) {
            this.cargando = false;
            resolve(result);
          } else {
            console.log("no se obtuvo resultados");
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
            this._msg.formateoMensaje("modal_info", this.prop_msg);
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  recibeHijoEmpresas(dts: any) {
    this.detallar("MOSTRAR_DETALLE");
    this.pnl_detalle = true;
    $("#pnlDetalle").show();
    this.pnl_listaproyectos = false;
    console.log("recibe dts del hijo", dts);
    this.dts_detalle_hijo = dts;
  }
  recibeHijoProyectos(dts: any) {
    this.dts_listaProyectos = [];
    console.log("recibe dts del hijo proyectos", dts);
    this.dts_listaProyectos = dts;
  }
}
