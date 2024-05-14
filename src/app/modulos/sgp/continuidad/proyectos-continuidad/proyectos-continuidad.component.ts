import { DatePipe } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Globals } from "../../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import alasql from "alasql";
import { AutenticacionService } from "../../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../../seguridad/mensajes/mensajes.component";
import { SgpService } from "../../sgp.service";
import { ContinuidadService } from "../continuidad.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important
@Component({
  selector: "app-proyectos-continuidad",
  templateUrl: "./proyectos-continuidad.component.html",
  styleUrls: ["./proyectos-continuidad.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
    ContinuidadService,
  ],
})
export class ProyectosContinuidadComponent implements OnInit, OnChanges {
  @Input("inputDts") inputDts: any;
  @Input("valor") valor: string;
  @Output() messageEvent = new EventEmitter<string>();
  public cargando = true;
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
  public pnl_proyectos = true;
  public pnl_cabecera = false;
  public registroFila: any;

  public titulo: string;
  public panel: string;
  public retornar: boolean = true;
  public dts_departamentos: any;
  public dts_municipios: any;
  public dep: string;
  public mun: string;
  public dts_inicial: any[] = [];

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _seguimiento: SgpService,
    private _continuidad: ContinuidadService,

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
    console.log("Desde padre_1", this.inputDts);
    console.log("Desde padre_2", this.valor);
    this.listaProyectos();
    if (
      this.valor == "PROYECTOS CON CONVENIO" ||
      this.valor == "PROYECTOS EN EJECUCION"
    ) {
      this.panel = this.valor;
    } else {
      this.valor.includes("detalle")
        ? (this.panel = "PARAMETROS")
        : (this.panel = "PANEL_INICIO");
      this.valor == "GENERAL"
        ? (this.retornar = false)
        : (this.retornar = true);
    }

    this.inputDts.forEach((e) => {
      const obj = Object.assign({}, e);
      this.dts_inicial.push(obj);
    });

    // console.log(this.inputDts,this.dts_inicial);
  }

  ngOnChanges() {
    console.log("cargando cambios continuidad");
    console.log(this.inputDts);
    this.listaProyectos();
    this.dts_departamentos = alasql(
      `select distinct departamento from ? order by departamento`,
      [this.inputDts]
    );
    this.dts_departamentos.unshift({ departamento: "" });

    // this.dts_municipios = alasql(`select distinct municipio from ?`,[this.inputDts]);
    // this.dts_municipios.unshift({departamento:''});
  }

  cambioDep() {
    console.log(this.dep);
    this.inputDts = [];
    this.dts_inicial.forEach((e) => {
      const obj = Object.assign({}, e);
      this.inputDts.push(obj);
    });
    this.inputDts =
      this.dep === ""
        ? this.inputDts
        : this.inputDts.filter((f) => f.departamento === this.dep);
    // const municipios = this.inputDts.filter(f=>f.departamento === this.dep);
    // this.dts_municipios = alasql(`select distinct municipio from ?`,[municipios]);
    // this.dts_municipios.unshift({municipio:''});
    this.listaProyectos();
  }

  // filtrarMunicipio(){
  //   console.log(this.mun);
  //   this.inputDts = this.mun === '' ? this.dts_inicial.filter(f=>f.departamento === this.dep) : this.inputDts.filter(f=>f.municipio === this.mun);
  // }

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

  listaProyectos() {
    this._fun.limpiatabla(".dt-proyectos");
    setTimeout(() => {
      let confiTable = this._fun.CONFIGURACION_TABLA_V6(
        [50, 100, 150, 200],
        false,
        20,
        null,
        false
      );
      if ($.fn.dataTable.isDataTable(".dt-proyectos")) {
        // No hace Nada xq ya tiene la Configuracion establecida
      } else {
        // table = $('.dt-proyectos').DataTable(confiTable);
        var table = $(".dt-proyectos").DataTable(confiTable);
        this._fun.selectTable(table, [3, 4, 5, 8, 9, 11]);
        this._fun.inputTable(table, [1, 6, 7, 10]);
        this.cargando = false;
      }
      // var table = $(".dt-proyectos").DataTable(confiTable);
      // setTimeout(() => {
      //   if ($.fn.dataTable.isDataTable('.dt-proyectos')) {
      //     // No hace Nada xq ya tiene la Configuracion establecida
      //   }
      //   else {
      //     // table = $('.dt-proyectos').DataTable(confiTable);
      //     var table = $(".dt-proyectos").DataTable(confiTable);
      //     this._fun.selectTable(table, [2, 3, 4, 7]);
      //     this._fun.inputTable(table, [1, 5, 6]);
      //     this.cargando = false;
      //   }
      // }, 5);
      // this._fun.selectTable(table, [2, 3, 4, 7]);
      // this._fun.inputTable(table, [1, 5, 6]);
      // this.cargando = false;
    }, 5);
  }

  paneles(valor) {
    if (valor == "PANELPROYECTOS") {
      this.pnl_proyectos = true;
      this.pnl_cabecera = false;
    }
  }
  detalleProyecto(registro) {
    console.log(registro);
    this.registroFila = registro;
    this.pnl_proyectos = false;
    this.pnl_cabecera = true;
  }
  sendMessage(valor_pnl) {
    this.messageEvent.emit(valor_pnl);
  }

  recibeMensaje($event) {
    this.paneles($event);
    this.listaProyectos();
  }
  DescargarExcel() {
    //      const table = $('.dt-proyectos').DataTable();
    //  console.log('DATOS DE LA TABLA JQUERY====>',{data: table.data()});
    //  console.log('DATOS DE LA TABLA JQUERY2====>',{data: table.rows().data()});
    const table = $(".dt-proyectos").DataTable(),
      table_filtered = table.rows({ filter: "applied" });
    console.log("DATOS FILTRADOS===>", table_filtered.data());

    const itemObject = [];
    table_filtered.data().each(function (d, i) {
      // console.log('datos====>',d[1]);
      var itemArray: any = {};
      itemArray.nombreproyecto = d[1];
      itemArray.departamento = d[2];
      itemArray.municipio = d[3];
      itemArray.area = d[4];
      itemArray.tipofinanciamiento = d[5];
      itemArray.montoupre = d[6].replaceAll(".", "");
      itemArray.montosaldo = d[7].replaceAll(".", "");
      itemArray.avancefisico = d[8];
      itemArray.avancefinanciero = d[9];
      itemArray.empresa = d[10].replace("-&gt;", "");
      itemArray.entregaprotocolar = d[11];

      itemObject.push(itemArray);
    });
    console.log("datos====>", itemObject);
    this._continuidad.descargaExcel(
      itemObject,
      "PARA_ENTREGA",
      "REPORTE LISTADO PERSONALIZADO"
    );
  }
}
