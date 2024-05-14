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
import { AccesosRolComponent } from "../../accesos-rol/accesos-rol.component";
import { SgpService } from "../../sgp.service";

import swal2 from "sweetalert2";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-resumen-financiero",
  templateUrl: "./resumen-financiero.component.html",
  styleUrls: ["./resumen-financiero.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
    AccesosRolComponent,
  ],
})
export class ResumenFinancieroComponent implements OnInit, OnChanges {
  @Input("inputDts") inputDtsBandeja: any;
  @Output() panel_proy = new EventEmitter<string>();
  @Output() enviaPadre = new EventEmitter<string>();

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

  // public pnl_listaproyecto=false;
  // public pnl_tecnica=false;
  // public pnl_financiero=false;
  // public pnl_legal=false;
  public cargando: boolean = true;

  public pnl_desembolsos: boolean = false;
  public pnl_detalles: boolean = false;
  public pnl_anticipos: boolean = false;
  public chartBarras: boolean = false;
  public pnl_planillas: boolean = false;
  public pnl_descuentos: boolean = false;
  public pnl_ampliaciones: boolean = false;
  public pnl_conjunto: boolean = false;

  public dts_desembolsos: any;
  public dts_detalles: any;
  public dts_descuentos: any;
  public dts_anticipos: any;
  public dts_planillas: any;
  public dts_descuentosGridView: any;

  public dts_planillas2: any;
  public dts_campos: any;

  public nombreProyecto: string;
  public idDelProyecto: number;
  public idDelSGP: number;
  public idDelPlanilla: number;

  public totalDesembolsos: number;
  public totalAnticipos: number;
  public totalDescuentos: number;
  public totalPlanillas: number;
  public totalCancelado: number;
  public maxPlanilla: number = 0;
  public conPlanilla: boolean = false;
  public planillaDescuentos: number;

  public montoContratoTotal: number = 0;
  public montoContractual: number = 0;
  public saldoDesembolsar: number = 0;
  public saldoDesembolsar2: number = 0;
  public saldoDesembolsarSgp: number = 0;
  public totalAcumuladoSgp: number = 0;
  public avandeFisico: number = 0;

  public dts_ampliaciones: any;
  public dts_empresas: any;

  public montoUPRE: number;
  public montoContraparte: number = 0;
  public montoTotalProyecto: number;
  public totalMultas: number;
  public listaDesembolsos: [10, 20, 30];
  public listaPeriodos: ["2016", "2017", "2018"];
  public series: [];
  public titulos: { central: string; vertical: string; horizontal: string };

  public seriesDetalle: [];
  public labelsDetalle: [];

  public tipoConvenio: number;
  public dts_proyectosEducacion: any;
  public pnl_educacion: boolean = false;
  public totalProyectoEdu: number;
  public elCodPrograma: number;
  public elPrograma: string;
  public planillaEditar: any;
  public descuentoEditar: any;
  public idDescuentoEliminar: number;
  public anticipoEditar: any;
  public totalAnticipoPlanilla: any;
  public idAnticipoEliminar: number;

  public pnl_datosgenerales = false;
  public pnl_tableroDatos = false;
  public pnl_auditoria = false;
  public inputDts: any;

  public camposHabilitados: {};
  total: any;
  total_monto_planilla: any;
  total_descuentos: any;
  total_desc139: any;
  total_desc140: any;
  total_desc141: any;
  total_desc142: any;
  total_desc143: any;
  total_liquido_apagar: any;
  total_anticipo: any;

  public respuesta: any = {
    ID_PROYECTO: "",
    ESTADO: "",
    ACCION: "",
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
  }

  ngOnInit() {
    // this.obtieneDatosProyecto(this.inputDtsBandeja["_id_proyecto"])
    //   .then((dts) => {
    //     this.inputDts = dts;
    //     console.log('DATOS DEL PROYECTO..', this.inputDts)
    //     this.tipoConvenio = this.inputDts._tipo_convenio;
    //     this.paneles('TABLERO_DATOS');
    //     if (this.tipoConvenio == 20) {
    //       this.elCodPrograma = this.inputDts._cod_programa;
    //       this.elPrograma = this.inputDts._programa;
    //       console.log('progs', this.elPrograma, this.elCodPrograma);
    //       this.listarProyectosEducacion();
    //     }
    //   })
  }

  ngOnChanges() {
    this.obtieneDatosProyecto(this.inputDtsBandeja["_id_proyecto"]).then(
      (dts) => {
        this.inputDts = dts;
        console.log("datosGenerales===>", this.inputDts);
        this.montoContractual = dts["v_monto_modificacion"];
        this.montoContratoTotal = dts["v_monto_convenio"];
        this.montoUPRE = dts["v_monto_upre"];
        this.montoContraparte = dts["v_monto_contraparte"];
        this.totalDesembolsos = dts["v_monto_desembolsado"];
        this.totalAnticipos = dts["v_anticipo"];
        this.totalPlanillas = dts["v_monto_desembolsado"];
        this.totalCancelado = dts["v_monto_cierre"];
        this.totalAcumuladoSgp = dts["v_monto_liquidopagado"];
        this.totalDescuentos = dts["v_totaldescuento"];
        this.totalMultas = dts["v_totalmultas"];
        this.saldoDesembolsarSgp = dts["v_monto_saldo"];
        this.avandeFisico = dts["v_avance_fisico"];
        this.chartBarras = true;
        this.obtenerConexion()
          .then(() => {
            return this._accesos.accesosRestriccionesxRolV2(this.s_usu_id);
          })
          .then((data) => {
            this.camposHabilitados = data;
            console.log("Adm Roles===>", this.camposHabilitados);
          });

        this.tipoConvenio = this.inputDts._tipo_convenio;
        this.paneles("TABLERO_DATOS");
        if (this.tipoConvenio == 20) {
          this.elCodPrograma = this.inputDts._cod_programa;
          this.elPrograma = this.inputDts._programa;
          console.log("progs", this.elPrograma, this.elCodPrograma);
          this.listarProyectosEducacion();
        }
        this.nombreProyecto = this.inputDts._nombreproyecto;
        this.idDelProyecto = this.inputDts._id_proyecto;
        this.idDelSGP = this.inputDts._id_sgp;
        return this.cargarCards();
      }
    );
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
    if (string == "DATOS_GENERALES_INICIAL") {
      this.pnl_datosgenerales = true;
      if (this.pnl_datosgenerales) {
        $("#pnl_datosgenerales").show();
      } else {
        this.pnl_datosgenerales = true;
      }
      this.pnl_tableroDatos = false;
    }
    if (string == "DATOS_GENERALES") {
      //this.pnl_datosgenerales = true
      $("#pnl_datosgenerales").show();
      this.pnl_tableroDatos = false;
    }
    if (string == "TABLERO_DATOS") {
      //this.pnl_datosgenerales = false
      $("#pnl_datosgenerales").hide();
      this.pnl_tableroDatos = true;
    }
    if (string == "AUDITORIA") {
      //this.pnl_datosgenerales = false
      $("#pnl_datosgenerales").hide();
      this.pnl_tableroDatos = false;
      this.pnl_datosgenerales = false;
      this.pnl_auditoria = true;
    }
  }
  sendMessage(valor_pnl) {
    console.log("sacando el mensaje", valor_pnl);
    this.panel_proy.emit(valor_pnl);
    this.respuesta.ID_PROYECTO = this.inputDtsBandeja["_id_proyecto"];
    this.respuesta.ACCION = "REGISTRADO";
    this.metodoenviaPadre(this.respuesta);
  }

  detallar(valor: string, planilla?: number) {
    this.idDelPlanilla = 0;
    if (valor == "desembolsos") {
      if (this.pnl_desembolsos) {
        this.pnl_desembolsos = false;
        this.pnl_detalles = false;
        //his.chartBarras = false;
      } else {
        this.listarDesembolsos();
        this.pnl_desembolsos = true;
      }
    }
    if (valor == "detalles") {
      if (this.pnl_detalles) {
        planilla ? this.listarDetalle(planilla) : (this.pnl_detalles = false);
      } else {
        this.listarDetalle(planilla);
        this.pnl_detalles = true;

        //this.chartBarras = false;
      }
    }
    if (valor == "anticipos") {
      if (this.pnl_anticipos) {
        this.pnl_anticipos = false;
      } else {
        this.listarAnticipos();
        this.pnl_anticipos = true;
      }
    }
    if (valor == "planillas") {
      this.pnl_planillas = !this.pnl_planillas;
      if (this.pnl_planillas) this.cargarCards();

      //this.chartBarras = false;
    }
    if (valor == "descuentos") {
      console.log("id de planilla a mostrar", planilla);
      planilla ? (this.conPlanilla = true) : (this.conPlanilla = false);

      this.idDelPlanilla = planilla != undefined ? planilla : 0;
      this.pnl_descuentos = !this.pnl_descuentos;
      if (this.idDelPlanilla != 0) {
        this.dts_descuentosGridView = this.dts_descuentos.filter(
          (elemento) => elemento.fid_planilla == planilla
        );
      } else {
        this.dts_descuentosGridView = this.dts_descuentos;
      }
    }
    if (valor == "contractual") {
      this.listarEmpresaAmpliacion();
      this.pnl_ampliaciones = !this.pnl_ampliaciones;
    }
    if (valor == "educacion") {
      this.pnl_educacion = !this.pnl_educacion;
      this.listarProyectosEducacion();
    }
  }

  cargarDatosCharts(tipo: string) {
    if (tipo == "planillas") {
      this.listaPeriodos = this.dts_planillas.map((el) => el.nro_planilla);
      const montosPlanilla = this.dts_planillas.map((el) => el.monto_planilla);
      const serie1 = { name: "Monto", data: montosPlanilla };
      const montosDescuento = this.dts_planillas.map(
        (el) => el.total_descuento
      );
      const serie2 = { name: "Descuento", data: montosDescuento };
      const truco = [] as any;
      truco.push(serie1);
      truco.push(serie2);
      this.series = truco;
      const probando = {
        central: "Historial Planillas",
        vertical: "Montos",
        horizontal: "Planillas",
      };
      this.titulos = probando;
      console.log("las series", this.series, this.titulos, probando);
    }
    if (tipo == "desembolsos") {
      this.listaDesembolsos = this.dts_desembolsos.map(
        (el) => el.monto_desembolso
      );
      this.listaPeriodos = this.dts_desembolsos.map((el) => el.gestion);
      const serie1 = { name: "Desembolsos", data: this.listaDesembolsos };
      const truco = [] as any;
      truco.push(serie1);
      this.series = truco;
      const probando = {
        central: "Historial Desembolsos",
        vertical: "Montos",
        horizontal: "Gestiones",
      };
      this.titulos = probando;
      console.log("las series", this.series, this.titulos, probando);

      //this.chartBarras = true;
    }
    if (tipo == "detalles") {
      const agrupado = this.agrupar(
        this.dts_detalles,
        "estructura_financiamiento",
        "monto_desembolso"
      );
      this.seriesDetalle = agrupado.map((el) => el.monto_desembolso);
      this.labelsDetalle = agrupado.map((el) => el.estructura_financiamiento);
      console.log("datos pie", this.seriesDetalle, this.labelsDetalle);

      //this.chartBarras = true;
    }
  }

  agrupar(data: any, campo: string, valor: string) {
    const res = alasql(
      `SELECT ${campo}, SUM(CAST([${valor}] AS INT)) AS [monto_desembolso] 
                  FROM ? GROUP BY ${campo}`,
      [data]
    );
    console.log("este es el group", res);
    return res;
  }

  cargarCards() {
    return new Promise((resolve, reject) => {
      $("#modalNuevaPlanilla").modal("hide");
      $("#modalNuevoDescuento").modal("hide");
      $("#modalNuevoAnticipo").modal("hide");
      //cargando desembolsos
      this.dts_desembolsos = [];
      this.dts_anticipos = [];
      this.dts_planillas = [];
      this.dts_descuentos = [];
      this.idDescuentoEliminar = null;
      this.descuentoEditar = false;
      this.idAnticipoEliminar = null;
      this.anticipoEditar = false;
      this.planillaEditar = false;
      this.cargaDesembolsos()
        .then((dts) => {
          this.dts_desembolsos = dts;
          return this.cargaAnticipo();
        })
        .then((dts) => {
          this.dts_anticipos = dts;
          console.log("aaaaaaaaaanticio", this.dts_anticipos);
          return this.cargaPlanillas();
        })
        .then((dts) => {
          this.dts_planillas = dts;
          console.log("PLANILA", this.dts_planillas);
          return this.cargaDescuentos();
        })
        .then((dts) => {
          this.dts_descuentos = dts;
          this.planillas2();
        });

      resolve("CORRECTO");
    });
  }
  cargaDesembolsos() {
    return new Promise((resolve, reject) => {
      this._seguimiento.financieraDesembolsos(this.idDelProyecto).subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            var dts = this._fun.RemplazaNullArray(result);
            resolve(dts);
          } else {
            //this.totalDesembolsos = 0;
            this.prop_msg = "Alerta: No existen desmbolsos para el proyecto";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
            resolve([]);
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
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  cargaAnticipo() {
    return new Promise((resolve, reject) => {
      this._seguimiento.financieraAnticipo(this.idDelProyecto).subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            var dts = this._fun.RemplazaNullArray(result);

            resolve(dts);
          } else {
            resolve([]);
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
  cargaPlanillas() {
    return new Promise((resolve, reject) => {
      this.dts_planillas = [];
      this._seguimiento.financieraPlanillas(this.idDelProyecto).subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            var dts = this._fun.RemplazaNullArray(result);
            console.log("planillassss", dts);
            resolve(dts);
            this.maxPlanilla = this.dts_planillas.reduce(
              (ac, el) =>
                ac > Number(el.nro_planilla) ? ac : Number(el.nro_planilla),
              0
            );

            //para el chart
            // this.cargarDatosCharts('planillas');
          } else {
            this.prop_msg =
              "Alerta: No existen planillas registradas para el proyecto";
            this.prop_tipomsg = "warning";
            this._msg.formateoMensaje("modal_warning", this.prop_msg);
            resolve([]);
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
  cargaDescuentos() {
    return new Promise((resolve, reject) => {
      //cargando descuentos
      this._seguimiento.financieraDescuentos(this.idDelProyecto).subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            var dts = this._fun.RemplazaNullArray(result);
            resolve(dts);
          } else {
            resolve([]);
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

  planillas2() {
    if (!this.dts_planillas /*|| !this.dts_descuentos*/) {
      console.log("sin planillas o descuentos");
      return true;
    }

    const arregloA = this.dts_planillas;
    const arregloB = this.dts_descuentos;
    const arregloC = this.dts_anticipos;
    const conjunto = [];
    let cont = 1;

    //con campo incremento +1
    // arregloA.forEach(el => {
    //   cont = 1;
    //   arregloB.map(el2 =>{
    //     // if (el.id_planilla == element.fid_planilla) el['descuento_'+element.id_descuento] = element.monto_descuento;
    //     if (el.id_planilla == el2.fid_planilla){
    //       el['descuento'+cont] = el2.monto_descuento;
    //       cont+=1;
    //     }
    //   })
    //   if(!conjunto.includes(el)) conjunto.push(el);
    // });

    //ahora por tipod escuento
    arregloA.forEach((el) => {
      arregloB.map((el2) => {
        if (el.id_planilla == el2.fid_planilla) {
          el["desc" + el2.tipo_descuento] = el2.monto_descuento;
        }
      });
      // arregloC.map(el3 => {
      //   if(el.fid_proyecto == el3.fid_proyecto) el['anticipo']=el3.anticipo
      // });
      setTimeout(() => {
        if (!conjunto.includes(el)) conjunto.push(el);
      }, 10);
    });
    this.pnl_conjunto = true;
    console.log("el conjunto", conjunto);
    this.dts_planillas2 = conjunto;
    console.log("nuevatabla", this.dts_planillas2);

    setTimeout(() => {
      this.total_monto_planilla = this.dts_planillas2.reduce((acc, obj) => {
        console.log("acc", this._fun.valorNumericoDecimal(acc));
        console.log("sig", this._fun.valorNumericoDecimal(obj.monto_planilla));
        return acc + Number(this._fun.valorNumericoDecimal(obj.monto_planilla));
      }, 0);
      this.total_descuentos = this.dts_planillas2.reduce(
        (acc, obj) =>
          acc + Number(this._fun.valorNumericoDecimal(obj.total_descuento)),
        0
      );
      this.total_desc139 = this.dts_planillas2.reduce(
        (acc, obj) => acc + Number(this._fun.valorNumericoDecimal(obj.desc139)),
        0
      );
      this.total_desc140 = this.dts_planillas2.reduce(
        (acc, obj) => acc + Number(this._fun.valorNumericoDecimal(obj.desc140)),
        0
      );
      this.total_desc141 = this.dts_planillas2.reduce(
        (acc, obj) => acc + Number(this._fun.valorNumericoDecimal(obj.desc141)),
        0
      );
      this.total_desc142 = this.dts_planillas2.reduce(
        (acc, obj) => acc + Number(this._fun.valorNumericoDecimal(obj.desc142)),
        0
      );
      this.total_desc143 = this.dts_planillas2.reduce(
        (acc, obj) => acc + Number(this._fun.valorNumericoDecimal(obj.desc143)),
        0
      );
      this.total_liquido_apagar = this.dts_planillas2.reduce(
        (acc, obj) =>
          acc + Number(this._fun.valorNumericoDecimal(obj.liquido_apagar)),
        0
      );
      if (this.dts_anticipos.length > 0) {
        this.total_monto_planilla =
          Number(this._fun.valorNumericoDecimal(this.total_monto_planilla)) +
          Number(
            this._fun.valorNumericoDecimal(this.dts_anticipos[0].anticipo)
          );
        this.total_liquido_apagar =
          Number(this._fun.valorNumericoDecimal(this.total_liquido_apagar)) +
          Number(
            this._fun.valorNumericoDecimal(this.dts_anticipos[0].anticipo)
          );
      } else {
        this.total_monto_planilla = Number(
          this._fun.valorNumericoDecimal(this.total_monto_planilla)
        );
        this.total_liquido_apagar = Number(
          this._fun.valorNumericoDecimal(this.total_liquido_apagar)
        );
      }
    }, 200);

    //this.maxPlanilla = this.dts_planillas.reduce((ac, el) => ac > Number(el.nro_planilla) ? ac : Number(el.nro_planilla), 0);

    //this.dts_campos = Object.keys(conjunto[0]);
    //console.log('los campos',this.dts_campos);
  }

  listarDesembolsos() {
    this.cargando = true;
    this._seguimiento.financieraDesembolsos(this.idDelProyecto).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_desembolsos = this._fun.RemplazaNullArray(result);
          this.cargarDatosCharts("desembolsos");
        } else {
          this.prop_msg = "Alerta: No existen desembolsos para el proyecto";
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
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      }
    );
  }

  listarDetalle(gestion) {
    this.cargando = true;
    this._seguimiento
      .financieraDesembolsosDetalle(this.idDelProyecto)
      .subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            this.dts_detalles = this._fun
              .RemplazaNullArray(result)
              .filter((el) => el.gestion == gestion);
            //this.chartBarras = false;
            this.cargarDatosCharts("detalles");
            // setTimeout(() => {
            //   let confiTable = this._fun.CONFIGURACION_TABLA_V4(
            //     [50, 100, 150, 200],
            //     false,
            //     10
            //   );
            //   var table = $(".dt-detalle").DataTable(confiTable);
            //   // this._fun.inputTable(table, [2, 3]);
            //   this.cargando = false;
            // }, 5);
            // this.cargarInfo();
          } else {
            this.prop_msg =
              "Alerta: No existen detalles desembolsos para el proyecto";
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
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        }
      );
  }

  listarAnticipos() {
    this.cargando = true;
    console.log("cargando anticipos");

    this._seguimiento.financieraAnticipo(this.idDelProyecto).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_anticipos = this._fun.RemplazaNullArray(result);
          this.pnl_anticipos = true;
          console.log("ANTICIPOSSSSSS", this.dts_anticipos);
        } else {
          this.prop_msg = "Alerta: No existen anticipos para el proyecto";
          this.prop_tipomsg = "warning";
          this._msg.formateoMensaje("modal_warning", this.prop_msg);
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
        }
      }
    );
  }

  encuentraMontoTotal() {
    return new Promise((resolve, reject) => {
      this._seguimiento.montoTotalProyecto(this.idDelProyecto).subscribe(
        (result: any) => {
          
          this.chartBarras = true;
          resolve(result[0]);
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
            this.chartBarras = false;
            reject(this.prop_msg);
          }
        }
      );
    });
  }

  listarEmpresaAmpliacion() {
    this.cargando = true;
    this._seguimiento.listaEmpresaAmpliacion(this.idDelProyecto).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_empresas = this._fun
            .RemplazaNullArray(result)
            .sort((a, b) => b.nro_version - a.nro_version);
          console.log("las empresas", this.dts_empresas);
          this.listarAmpliacion();
        } else {
          this.prop_msg = "Alerta: No existen empresas registradas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_info", this.prop_msg);
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
        }
        this.cargando = false;
      }
    );
  }

  listarAmpliacion() {
    this.cargando = true;
    this.dts_ampliaciones = [];
    this._seguimiento.listaAmpliacionPlazoSgp(this.idDelProyecto).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_ampliaciones = this._fun
            .RemplazaNullArray(result)
            .filter((element) => element.monto > 0);
          console.log("las ampliaciones", this.dts_ampliaciones);
        } else {
          this.prop_msg = "Alerta: No existen registros de ampliaciones";
          this.prop_tipomsg = "info";
          this._msg.formateoMensaje("modal_info", this.prop_msg);
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
        }
        this.cargando = false;
      }
    );
  }

  listarProyectosEducacion() {
    this.cargando = true;
    this.dts_ampliaciones = [];
    //listaProyectosConsolidadosxRegion("('01','02','03','04','05','06','07','08','09')")
    this._seguimiento.listaProyectosConsolidados().subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_proyectosEducacion = this._fun
            .RemplazaNullArray(result)
            .filter((element) => element._cod_programa == this.elCodPrograma);
          console.log("los proyectos Educacion", this.dts_proyectosEducacion);
          this.totalProyectoEdu = this.dts_proyectosEducacion.length;
          this._fun.limpiatabla(".dt-educacion");
          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V3(
              [50, 100, 150, 200],
              false,
              10
            );
            var table = $(".dt-educacion").DataTable(confiTable);
            this._fun.selectTable(table, [1, 2, 3, 4, 8, 12]);
            this._fun.inputTable(table, [5, 7]);
            this.cargando = false;
          }, 50);
        } else {
          this.prop_msg = "Alerta: No existen proyectos";
          this.prop_tipomsg = "info";
          this._msg.formateoMensaje("modal_warning", this.prop_msg);
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
        }
        this.cargando = false;
      }
    );
  }

  filtrarVersion(dts: any, version: number) {
    return dts.filter((elemento) => elemento.nro_version == version);
  }

  recibeMensaje($event) {
    console.log("recive mensaje en bandeja financiero", $event);
    $event == "REGISTRADO" ? this.cargarCards() : this.detallar($event);
    this.refrescaDatosProyecto();
    this.detallar("descuentos");
  }

  generarReporte() {
    this.cargando = true;
    console.log("generando reporte");
    // window.open("http://localhost:8283/10_reportePrueba/");//ok
    const d = [
      {
        movieName: "Matrix",
        actors: [
          {
            firstname: "Keanu",
            lastname: "Reeves",
          },
          {
            firstname: "Laurence",
            lastname: "Fishburne",
          },
          {
            firstname: "Carrie-Anne",
            lastname: "Moss",
          },
        ],
      },
      {
        movieName: "Back To The Future",
        actors: [
          {
            firstname: "Michael",
            lastname: "J. Fox",
          },
          {
            firstname: "Christopher",
            lastname: "Lloyd",
          },
        ],
      },
      {
        movieName: "ZOHAN BONK desde Angular",
        actors: [
          {
            firstname: "Eddy",
            lastname: "Bower",
          },
          {
            firstname: "Cris",
            lastname: "Bonk",
          },
        ],
      },
    ];
    this._seguimiento.reportePrueba(d).subscribe(
      (result: any) => {
        // 
        console.log(result);
        const url = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "reportePrueba.pdf");
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
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

  crudPlanilla(planilla?, idPlanilla?) {
    planilla
      ? (this.planillaEditar = planilla)
      : (this.planillaEditar = undefined);
    if (idPlanilla) {
      swal2({
        title: "Advertencia!!!",
        text: `Realmente desea eliminar la planilla?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d9534f",
        cancelButtonColor: "#f0ad4e",
        customClass: "swal2-popup",
        confirmButtonText: "Confirmar!",
      }).then((result) => {
        if (result.value) {
          const laPlanilla = {
            operacion: "D",
            idPlanilla: idPlanilla.id_planilla,
            idProyecto: idPlanilla.fid_proyecto,
            idSGP: idPlanilla.id_sgp,
            numeroPlanilla: 0,
            fechaInicio: new Date(),
            fechaFin: new Date(),
            montoPlanilla: 0,
            detallePlanilla: null,
            totalDescuentos: 0,
            liquidoPagar: 0,
            preventivo: null,
            fechaPago: new Date(),
            estadoPlanilla: 0,
            estructuraFinanciamiento: idPlanilla.estructura_financiamiento,
            usuarioRegistro: this.s_usu_id,
          };
          this._seguimiento.financieraCRUDPlanilla(laPlanilla).subscribe(
            (result: any) => {
              
              console.log("el result", result);
              if (Array.isArray(result) && result.length > 0) {
                console.log("planilla eliminada: " + idPlanilla);
                this.cargarCards();
                this.refrescaDatosProyecto();
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
        } else {
          this.cargando = false;
        }
      });
    } else {
      $("#modalNuevaPlanilla").modal("show");
    }
  }

  crudDescuento(descuento?, idDescuento?) {
    descuento
      ? (this.descuentoEditar = descuento)
      : (this.descuentoEditar = undefined);
    idDescuento
      ? (this.idDescuentoEliminar = idDescuento)
      : (this.idDescuentoEliminar = undefined);
    $("#modalNuevoDescuento").modal("show");
  }

  crudAnticipo(anticipo?, idAnticipo?) {
    anticipo
      ? (this.anticipoEditar = anticipo)
      : (this.anticipoEditar = undefined);
    idAnticipo
      ? (this.idAnticipoEliminar = idAnticipo)
      : (this.idAnticipoEliminar = undefined);
    $("#modalNuevoAnticipo").modal("show");
  }
  obtieneDatosProyecto(id_proyecto) {
    return new Promise((resolve, reject) => {
      //this.cargando = true;
      this._seguimiento.listaProyectosConsolidadosId(id_proyecto).subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            var dts = this._fun.RemplazaNullArray(result[0]);
            //console.log('DATOS PROYECTOS',this.inputDts);
            resolve(dts);
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
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  refrescaDatosProyecto() {
    this.obtieneDatosProyecto(this.inputDtsBandeja["_id_proyecto"]).then(
      (dts) => {
        this.inputDts = dts;
        this.montoContractual = dts["v_monto_modificacion"];
        this.montoContratoTotal = dts["v_monto_convenio"];
        this.montoUPRE = dts["v_monto_upre"];
        this.montoContraparte = dts["v_monto_contraparte"];
        this.totalDesembolsos = dts["v_monto_desembolsado"];
        this.totalAnticipos = dts["v_anticipo"];
        this.totalPlanillas = dts["v_monto_desembolsado"];
        this.totalCancelado = dts["v_monto_cierre"];
        this.totalAcumuladoSgp = dts["v_monto_liquidopagado"];
        this.totalDescuentos = dts["v_totaldescuento"];
        this.totalMultas = dts["v_totalmultas"];
        this.saldoDesembolsarSgp = dts["v_monto_saldo"];
        this.avandeFisico = dts["v_avance_fisico"];
        return this.cargarCards();
      }
    );
  }

  metodoenviaPadre(dts) {
    this.enviaPadre.emit(dts);
  }
}
