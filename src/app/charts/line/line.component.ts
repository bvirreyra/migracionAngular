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
  ApexMarkers,
  ApexGrid,
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
  markers:ApexMarkers;
  grid:ApexGrid;
};
@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.css']
})
export class LineComponent implements OnInit,OnChanges {

  @ViewChild("chart") chart: ChartComponent;
  @Input() series: any[]=[];
  @Input() periodos: string[]=[];
  @Input() nombresPeriodos: string[]=[];
  @Input() titulos: {central:string,vertical:string,horizontal:string,tooltip:string}
  = {central:'Compromisos por departamento',vertical:'Compromisos',horizontal:'Departamentos',tooltip:'Compromisos'};
  @Input() alto:number = 250;
  @Input() colores:string[]=[];
  @Input() data:any;
  @Output() messageEvent = new EventEmitter<string>();
  public chartOptions: Partial<ChartOptions>;

  constructor() {
  }
  ngOnInit(){
  }
  ngOnChanges(){
    const mostrar=(obj:any)=>{
      this.sendMessage(obj);
    }
    console.log('entrando linea',this.data);
    
    const tooltip = this.titulos.tooltip || '';
    const nombres = this.nombresPeriodos;

    const pivot = this.data;
    this.chartOptions = {
      series: this.series,
      chart: {
        type: "line",
        height: this.alto,
        width:'100%',
        zoom:{
          enabled:true
        },
        events: {
          dataPointSelection: function(event, chartContext, config){
            // console.log('probando index',config.dataPointIndex,event,chartContext,config.w.globals,config);
            // config.w.config.xaxis.title.text = 'Acá podriamos cargar la tarea de la data: ' + config.dataPointIndex//si funciona en produccion
            mostrar({d:config.dataPointIndex,s:config.seriesIndex})
          }
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
        enabled: false
      },
      legend: {
        tooltipHoverFormatter: function(val, opts) {
          // return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ' días' //+ nombres[opts.dataPointIndex]
          console.log('rev tool',pivot[opts.dataPointIndex]);
          
          return (
            `<ul>
              <li>${pivot[opts.dataPointIndex].de}</li>
              <li>${pivot[opts.dataPointIndex].para}</li>
            </ul>`
          )
        }
      },
      stroke: {
        width: [5, 7],
        curve: 'straight',
        dashArray: [0, 0]
      },
      markers: {
        size: 1,
        hover: {
          sizeOffset: 6
        }
      },
      xaxis: {
        title:{
          text:this.titulos.horizontal
        },
        categories: this.periodos,
        tooltip:{
          enabled:false,
        }
      },
      yaxis: {
        title: {
          text: this.titulos.vertical
        },
        min:0
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        theme:'dark',
        custom: function({series, seriesIndex, dataPointIndex, w}) {
          return `<div style="color: white">
                    <div style="background-color: #fc8535;color:white;padding: 1rem 0.5rem;text-align: center;font-weight: 700">
                    REF: ${pivot[dataPointIndex].ref}
                    </div>
                    <ul style="list-style: none;padding: 1rem;">
                      <li>👨🏻‍💼 <strong style="color:#fc8535">De: </strong>  ${pivot[dataPointIndex].de}</li>
                      <li>👨🏻‍💼 <strong style="color:#fc8535">Para: </strong>  ${pivot[dataPointIndex].para}</li>
                      <li>⭕ <strong style="color:#fc8535">Fecha: </strong>  ${pivot[dataPointIndex].f1}</li>
                      <li>✔️ <strong style="color:#fc8535">Fecha respuesta: </strong>  ${pivot[dataPointIndex].f2}</li>
                      <li>⌛ <strong style="color:#fc8535">Tiempo Proceso: </strong>  ${series[seriesIndex][dataPointIndex]} días</li>
                      <li>📝 <strong style="color:#fc8535">Observación: </strong>  ${pivot[dataPointIndex].obs}</li>
                    </ul>
                  </div>`
        },
        y: {
          formatter: function(val,opts) {
            return `${val} ${tooltip}` ;
          },         
        },
      },
      grid: {
        borderColor: '#9c9c9c',
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
        }
      }]
    };
    //para evaluar si va tooltip personalizado o standard
    if(!pivot) delete this.chartOptions.tooltip.custom
  }
  sendMessage(respuesta:any) {
    this.messageEvent.emit(respuesta);
  }

}
