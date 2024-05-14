import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { SgpService } from "src/app/modulos/sgp/sgp.service";
import { ChartsService } from "../charts.service";
import * as moment from "moment";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { AlmacenesRoutingModule } from "src/app/routing/almacen-routing.module";

@Component({
  selector: "app-workflow",
  templateUrl: "./workflow.component.html",
  styleUrls: ["./workflow.component.css"],
})
export class WorkflowComponent implements OnInit, OnChanges {
  @Input() idCompromiso: number;
  // @Input() idFlujo: number;
  @Input() presidencial: boolean = false;

  dtsTareas: any[] = [];
  dtsMonitoreos: any[] = [];

  dtsFeriados: any[] = [];

  dtsSeries: any[] = [];
  dtsPeriodos: any[] = [];
  colores: string[] = [
    "#449DD1",
    "#f18553",
    "#67c072",
    "#4b7cc5",
    "#f03bb9",
    "#246cfc",
    "#546E7A",
    "#00b312",
    "#a35948",
    "#2b908f",
    "#faee7f",
    "#449DD1",
    "#f18553",
    "#67c072",
    "#4b7cc5",
  ];
  titulos: {
    central: string;
    vertical: string;
    horizontal: string;
    tooltip: string;
    datalabel: string;
  };
  dtsSeriesIdeal:any[]=[];
  topes:any[]=[];
  xmin:number;

  dtsSeriesLinea: any[] = [];
  dtsPeriodosLinea: any[] = [];
  dtsPeriodosNombre: any[] = [];
  titulosLinea: {
    central: string;
    vertical: string;
    horizontal: string;
    tooltip: string;
  };

  titulosIdeal: {
    central: string;
    vertical: string;
    horizontal: string;
    tooltip: string;
    datalabel: string;
  };

  dtsGrupos: any[] = [];
  // mostrarSubs:boolean=false;
  coloresSub: string[] = ["#449DD1", "#f18553", "#67c072", "#2e5a9b"];

  tipoFiltro: string = "";
  // dtsTiposFiltros:string[]=['SIN FILTROS','ETAPAS CON DESFACE','ETAPAS A TIEMPO']

  dtsSeriesPie: any[] = [];
  labelsPie: string[] = [];
  tituloPie: string = "";
  dtsSeriesPie2: any[] = [];
  labelsPie2: string[] = [];
  tituloPie2: string = "";

  elCompromiso:any;
  detalle:string;
  totalRetraso:number;
  etapActual:string

  constructor(
    private _charts: ChartsService,
    private toastr: ToastrService,
    private _sgp: SgpService,
    private _fun: FuncionesComponent
  ) {}

  ngOnInit() {}
  ngOnChanges() {
    this.cargarFeriados();
    this.obtenerCompromisos({opcion:'id_compromiso',id:this.idCompromiso});
    // this.obtenerTareas({ opcion: "fid_flujo", id: this.idFlujo });
    setTimeout(() => {
      this.obtenerMonitoreo({
        opcion: "fid_compromiso",
        id: this.idCompromiso,
        tipo: 'CONJUNTO',
      });
    }, 200);
  }

  obtenerCompromisos(opcion: any) {
    this._charts.compromisos(opcion).subscribe(
      (result: any) => {
        console.log("el compromiso", result);
        this.elCompromiso = result[0];
        this.obtenerTareas({ opcion: "fid_flujo", id: this.elCompromiso.fid_flujo });
      },
      (error) =>
        this.toastr.error(error.toString(), "Error desde el servidor", {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        })
    );
  }
  obtenerTareas(opcion: any) {
    this._charts.listaTareas(opcion).subscribe(
      (result: any) => {
        console.log("todas las etapas ", result);
        this.dtsTareas = result;
        this.armarSeriesIdeal();
      },
      (error) =>
        this.toastr.error(error.toString(), "Error desde el servidor", {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        })
    );
  }
  obtenerMonitoreo(opcion: any) {
    this._charts.listaMonitoreos(opcion).subscribe(
      (result: any) => {
        console.log("monitoreos", result);
        if (opcion.opcion == "DESFASADOS") this.armarSeriesPie(result);
        if (opcion.opcion == "PROYECTOS") this.armarSeriesPie2(result);
        if (opcion.id) {
          if(!this.presidencial) this.dtsMonitoreos = result;
          if(this.presidencial) this.dtsMonitoreos = result.filter(f=>f.visible == 1);
          setTimeout(() => {
            this.armarSeries();
            this.armarSeriesLinea();
            if(this.presidencial) this.armarSubSeries('ideal');
          }, 170);
        }
      },
      (error) =>
        this.toastr.error(error.toString(), "Error desde el servidor", {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        })
    );
  }

  cargarFeriados() {
    this._sgp.feriados().subscribe(
      (result: any) => {
        this.dtsFeriados = result;
      },
      (error) => console.log("Error al obtnere feriados, ", error.toString())
    );
  }

  armarSeries() {
    console.log(this.dtsTareas, this.dtsMonitoreos);
    let tProceso = 0,
      tReal = 0,
      tTotal = 0;
    this.dtsMonitoreos.forEach((m) => {
      tProceso += m.dias_ideal;
      tReal += m.dias_ejecucion;
    });
    tTotal = this.dtsTareas.reduce((ac, el) => ac + el.dias, 0);
    this.dtsSeries = [
      {
        name: "Tiempo Ideal Programado",
        data: [tProceso, 0],
      },
      {
        name: "Tiempo Real",
        data: [0, tReal],
      },
      // {
      //   name: "Tiempo Total Etapas",
      //   data: [0, 0,tTotal]
      // },
    ];
    this.dtsPeriodos = ["TIEMPO IDEAL", "TIEMPO REAL"];
    this.titulos = {
      central: "RELACION TIEMPO EJECUCION / IDEAL",
      horizontal: "DIAS",
      vertical: "PROCESOS",
      tooltip: "días",
      datalabel: "días",
    };
  }
  
  armarSeriesIdeal(){
    console.log('las tareas',this.dtsTareas.filter(f=>f.visible==1 || ['INICIO','FIN'].includes(f.tipo)));
    let lasTareas = this.dtsTareas.filter(f=>f.visible==1 || ['INICIO','FIN'].includes(f.tipo));
    // lasTareas = lasTareas.sort((a,b)=>Number(a.orden)-Number(b.orden))
    let ideal:any[]=[];

    this.xmin = new Date(this.elCompromiso.fecha_aprobacion).getTime();
    let f1:number,f2:number;
    console.log(lasTareas);
    
    lasTareas.forEach((t,i)=>{
      f1 = this.xmin;
      if (i > 0) f1 = f2 + (1000 + 60 + 60 + 24);
      let ffSF = this._fun.incrementaFechaSF(
        "FECHA_FIN",
        new Date(f1),
        new Date(),
        t.dias,
        this.dtsFeriados
      );
      f2 = new Date(ffSF).getTime();
      ideal.push({
        x: t.nombre_tarea,
        y: [f1, f2],
        fillColor: this.colores[i],
        etapa: t.nombre_tarea,
      })
    })

    this.topes = ideal.map((e, i) => {
      // const t = moment(e.fecha_inicio).add(Number(e.tiempo_ejecucion) -1,'days').format('yyyy-MM-DD');
      const modelo = {
        x: e.y[1], //new Date(t).getTime(),
        strokeDashArray: 0,
        borderColor: e.fillColor,
        label: {
          offsetY: -10, //28,//10
          style: {
            color: "#2c2c2c", //'#fcebeb',
            background: e.fillColor,
          },
          orientation: "vertical",
          // text: `Etapa ${i+1}: ${moment(t).format('DD/MMM')}`
          text: `${moment(e.y[1]).format("DD/MMM")}`,
        },
      };
      return modelo;
    });
    this.dtsSeriesIdeal = [{data:ideal}]
    this.titulosIdeal = {
      central: "CRONOGRAMA DE AVANCE IDEAL - POR ETAPAS",
      horizontal: "DIAS",
      vertical: "Etapas",
      tooltip: "días",
      datalabel: "días",
    };
    const options: Intl.DateTimeFormatOptions =  { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setTimeout(() => {
      this.detalle = `del ${new Intl.DateTimeFormat("es-ES", options).format(new Date(this.xmin))} al ${ new Intl.DateTimeFormat("es-ES", options).format(new Date(ideal[ideal.length -1].y[1]))}`
      // this.totalRetraso = ((new Date().getTime() - new Date(ideal[ideal.length -1].y[1]).getTime()) / (1000*60*60*24));
      this.totalRetraso = Number(this._fun.incrementaFechaSF('DIAS_HABILES',new Date(ideal[ideal.length -1].y[1]),new Date(),0,this.dtsFeriados));
      const final = this.elCompromiso.tipo_flujo == 'FIN' ? this.dtsMonitoreos[this.dtsMonitoreos.length-1].fecha_fin: null;
      // if(final) this.totalRetraso = ((new Date(final).getTime() - new Date(ideal[ideal.length -1].y[1]).getTime()) / (1000*60*60*24));
      if(final) this.totalRetraso = Number(this._fun.incrementaFechaSF('DIAS_HABILES',new Date(ideal[ideal.length -1].y[1]),new Date(final),0,this.dtsFeriados));
      // this.etapActual = this.dtsMonitoreos[this.dtsMonitoreos.length-1].nombre_tarea;
      this.etapActual = this.elCompromiso.nombre_tarea;
      setTimeout(() => {
        const obj = document.getElementById('alerta');
        const tipoAlerta = this.totalRetraso <45 ? 'alerta-leve': this.totalRetraso < 90 ? 'alerta-media':'alerta-maxima';
        obj.classList.add(tipoAlerta)  
      }, 300);
    }, 200);
  }

  armarSeriesLinea() {
    console.log("series linea", this.dtsTareas, this.dtsMonitoreos);
    let pivotIdeal = [],
      pivotReal = [],
      pivotEtapas = [],
      pivotNombres = [];
    this.dtsMonitoreos.forEach((m) => {
      pivotReal.push(m.dias_ejecucion);
      pivotIdeal.push(m.dias_ideal);
      pivotEtapas.push("E" + m.orden);
      pivotNombres.push(m.nombre_tarea);
    });
    this.dtsSeriesLinea = [
      {
        name: "Tiempo Ideal Programado",
        data: pivotIdeal,
      },
      {
        name: "Tiempo Real Ejecución",
        data: pivotReal,
      },
    ];
    this.dtsPeriodosLinea = pivotEtapas;
    this.dtsPeriodosNombre = pivotNombres;
    this.titulosLinea = {
      central: "COMPARATIVA TIEMPOS POR ETAPA",
      horizontal: "ETAPAS",
      vertical: "DIAS",
      tooltip: "días",
    };
    setTimeout(() => {
      const obj = <HTMLDivElement> document.querySelector('#baseCharts')
      obj.style.display = 'inline-block !important'
    }, 200);
    
  }

  recibeMensaje($event, tipo: string) {
    console.log("recibiendo mensaje de chart", $event, tipo);
    if(this.presidencial) return false;
    if ($event.d == 0 && $event.s == 0) this.armarSubSeries("ideal");
    if ($event.d == 1 && $event.s == 1) {
      this.obtenerMonitoreo({ opcion: "DESFASADOS" });
      setTimeout(() => {
        this.obtenerMonitoreo({ opcion: "PROYECTOS" });
      }, 500);
    }
  }

  armarSubSeries(tipo: string) {
    console.log("armando sub", tipo);
    this.dtsGrupos = [];
    let ini = 1,
      fin = 5,
      g = 1;
    let data = this.dtsMonitoreos;
    if (tipo == "ED")
      data = this.dtsMonitoreos.filter((f) => f.dias_ideal < f.dias_ejecucion);
    if (tipo == "ET")
      data = this.dtsMonitoreos.filter((f) => f.dias_ideal >= f.dias_ejecucion);
    // data.map((e,)=>{

    // })
    while (ini <= this.dtsMonitoreos.length) {
      const tareas = data.filter((f) => f.fila >= ini && f.fila <= fin);
      let etapas = [],
        pivot = [],
        pivot2 = [],
        pivotNombres = [];
      tareas.forEach((t) => {
        etapas.push("E" + t.orden); //(t.nombre_tarea);//('E'+t.orden);
        pivot.push(t.dias_ideal);
        pivot2.push(t.dias_ejecucion);
        pivotNombres.push(t.nombre_tarea);
      });
      this.dtsGrupos.push({
        series: [
          {
            name: "PROGRAMADO",
            data: pivot,
          },
          {
            name: "EJECUCION",
            data: pivot2,
          },
        ],
        periodos: etapas,
        periodosNombres: pivotNombres,
        titulos: {
          central: `COMPARATIVA ETAPAS: ${ini}º al ${fin}º`,
          horizontal: "ETAPAS",
          vertical: "Días",
          tooltip: "día(s)",
          datalabel: "",
        },
        numero: g,
      });
      ini += 5;
      fin += 5;
      g++;
      if (fin > this.dtsMonitoreos.length) fin = this.dtsMonitoreos.length;
    }
    console.log(this.dtsGrupos);
  }

  filtrarSubSeries() {
    this.armarSubSeries(this.tipoFiltro);
  }

  armarSeriesPie(data: any) {
    console.log("pie", data);
    let otros = 0;
    let pivotSeries = [],
      pivotLabels = [];
    data.forEach((t, i) => {
      if (i < 5) {
        pivotSeries.push(Number(t.diferencia));
        pivotLabels.push(t.nombre_tarea);
      } else {
        otros += Number(t.diferencia);
      }
    });
    pivotSeries.push(otros);
    pivotLabels.push("OTROS");
    this.dtsSeriesPie = pivotSeries;
    this.labelsPie = pivotLabels;
    this.tituloPie = "ETAPAS CON MAYOR DESFASE";
  }

  armarSeriesPie2(data: any) {
    console.log("pie2", data);
    let pivotSeries = [],
      pivotLabels = [];
    data.forEach((p, i) => {
      pivotSeries.push(Number(p.diferencia));
      pivotLabels.push(p.nombreproyecto);
    });
    this.dtsSeriesPie2 = pivotSeries;
    this.labelsPie2 = pivotLabels;
    this.tituloPie2 = "PROYECTOS CON MAYOR DESFASE";
  }
}
