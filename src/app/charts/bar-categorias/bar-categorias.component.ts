import { Component, EventEmitter, Input, OnInit, Output, ViewChild,OnChanges, SimpleChanges } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexTitleSubtitle,
  ApexResponsive,
} from "ng-apexcharts";
import { type } from "os";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  colors:string[];
  title:ApexTitleSubtitle;
  responsive:ApexResponsive[];
};
@Component({
  selector: 'app-bar-categorias',
  templateUrl: './bar-categorias.component.html',
  styleUrls: ['./bar-categorias.component.css']
})
export class BarCategoriasComponent implements OnInit,OnChanges {
  @ViewChild("chart") chart: ChartComponent;
  @Input() series: any[]=[];
  @Input() periodos: string[]=[];
  @Input() nombresPeriodos: string[]=[];
  @Input() titulos: {central:string,vertical:string,horizontal:string,tooltip:string,datalabel:string}
  = {central:'Compromisos por departamento',vertical:'Compromisos',horizontal:'Departamentos',tooltip:'Compromisos',datalabel:''};
  @Input() alto:number = 250;
  @Input() colores:string[]=[];
  @Input() horizontal:boolean=false;
  @Output() messageEvent = new EventEmitter<string>();
  public chartOptions: Partial<ChartOptions>;

  constructor() {
  }
  ngOnChanges(){
    const mostrar=(obj:any)=>{
      this.sendMessage(obj);
    }
    const tooltip = this.titulos.tooltip || '';
    const dataLabel = this.titulos.datalabel || '';
    const nombres = this.nombresPeriodos;

    this.chartOptions = {
      series: this.series,
      chart: {
        type: "bar",
        height: this.alto,
        width:'100%',
        stacked:this.horizontal,
        events: {
          dataPointSelection: function(event, chartContext, config){
            // console.log('probando index',config.dataPointIndex,event,chartContext,config.w.globals,config);
            // config.w.config.xaxis.title.text = 'Acá podriamos cargar la tarea de la data: ' + config.dataPointIndex//si funciona en produccion
            mostrar({d:config.dataPointIndex,s:config.seriesIndex})
          }
        }
      },
      plotOptions: {
        bar: {
          horizontal: this.horizontal || false,
          columnWidth: "55%",
          dataLabels:{
            position:'top',
          }
          // endingShape: "rounded"
        }
      },
      title: {
        text: this.titulos.central,//this.titulo,
        align: 'center',
        margin: 10,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize:  '16px',
          fontWeight:  'bold',
          fontFamily:  undefined,
          color:  '#263238'
        },
      },
      dataLabels: {
        enabled: true,
        formatter(val, opts):string {
            return `${val} ${dataLabel}`
        },
        textAnchor:'middle',
        offsetX:this.horizontal ? -50:0,
        offsetY:this.horizontal ? 0:-30,
        style:{
          colors:[this.colores[10] || '#4c4c4c'],
          fontSize:'16px',
        },
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        title:{
          text:this.titulos.horizontal
        },
        categories: this.periodos,
      },
      yaxis: {
        title: {
          text: this.titulos.vertical
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        theme:'dark',
        y: {
          formatter: function(val,opts) {
            return `${val} ${tooltip}` ;
          }
        },
        x: {
          formatter: function(val,opts) {
            let tip = ''
            nombres.length>0
            ? tip = `${nombres[opts.dataPointIndex]}`
            : tip = `${val}` ;
            return tip
          }
        }
      },
      colors:this.colores,
      responsive:[{
        breakpoint: 480,
        options:{
          chart: {
            width:'90%',
            toolbar:{
              show:false,
            }
          },
          dataLabels: {
            offsetX:0,
            formatter(val, opts):string {
              return `${val}`
            },
            style:{
              colors:[this.colores[10] ||'#4c4c4c'],
              fontSize:'12px',
            }
          }
        }
      }]
    };
  }
  ngOnInit(){

  }
  sendMessage(respuesta:any) {
    this.messageEvent.emit(respuesta);
  }

}
