import { style } from "@angular/animations";
import { Component, ViewChild,Input,Output,OnInit,OnChanges,EventEmitter } from "@angular/core";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import * as moment from "moment";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexXAxis,
  ApexFill,
  ApexDataLabels,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexAnnotations,
  ApexResponsive
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  fill: ApexFill;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  plotOptions: ApexPlotOptions;
  title:ApexTitleSubtitle;
  tooltip:ApexTooltip;
  annotations:ApexAnnotations;
  responsive:ApexResponsive[];
};

@Component({
  selector: 'app-range-bar',
  templateUrl: './range-bar.component.html',
  styleUrls: ['./range-bar.component.css']
})
export class RangeBarComponent implements OnInit,OnChanges {
  @ViewChild("chart") chart: ChartComponent;
  @Input() series: any[];
  @Input() titulos: {central:string,vertical:string,horizontal:string};
  @Input() alto:number = 250;
  @Input() topes:[] = [];
  @Input() xmin:number;
  @Input() titleXTop:boolean=false;
  @Input() feriados :any[]=[];
  @Output() messageEvent = new EventEmitter<any>();
  public chartOptions: Partial<ChartOptions>;

  public indice:any;

  constructor(
    private _fun: FuncionesComponent,
    ) {}

  ngOnInit() {
      
  }

  ngOnChanges(){
    console.log('la serie rev',this.series,this.titulos,this.xmin,this.topes);
    try {
      const mostrar=(obj)=>{
        // console.log('mostrando',obj);
        // this.chartOptions.xaxis.title.text = 'actualizando jejejej';
        // ApexCharts.exec('critical','updateOptions',{xaxis:{type: "datetime",title:{text:'pruebita'}}}, false, true)
        // this.chart.updateOptions({
        //   title: {
        //     text: 'new title'
        //   }
        // })
        this.sendMessage(obj);
      }

      const obtenerFechaSF = (val,f=this.feriados)=>{
        return this._fun.incrementaFechaSF('DIAS_HABILES',new Date(val[0]),new Date(val[1]),0,f);
      }
      
      this.chartOptions = {
        series: this.series,
        chart: {
          // id:'critical',
          height: 500,
          type: "rangeBar",
          toolbar:{
            offsetY:25
          },
          events: {
            dataPointSelection: function(event, chartContext, config){
              // console.log('probando index',config.dataPointIndex,config.w.config,config.w.globals,chartContext,config);
              // localStorage.setItem('index-bar-range',config.dataPointIndex) //no es necesario almacenar en LS
              // config.w.config.xaxis.title.text = 'Acá podriamos cargar la tarea de la data: ' + config.dataPointIndex//si funciona en produccion
              mostrar({d:config.dataPointIndex,s:config.seriesIndex})
            }
          }
        },
        plotOptions: {
          bar: {
            horizontal: true,
            distributed: true,
            dataLabels: {
              hideOverflowingLabels: false
            }
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function(val, opts) {
            // console.log('optsRangeBar',opts.w.globals);
            var label = opts.w.globals.labels[opts.dataPointIndex];
            if(opts.w.globals.initialSeries.length > 1) label = opts.w.globals.initialSeries[opts.seriesIndex].data[opts.dataPointIndex].x;
            var a = moment(val[0]);
            var b = moment(val[1]);
            var diff = b.diff(a, "days");
            if(opts.seriesIndex==0 && opts.w.globals.initialSeries.length > 1) return (diff);
            if(opts.seriesIndex>0 || opts.w.globals.initialSeries.length == 1){
              diff = Number(obtenerFechaSF(val))
              return (label + ": " + diff + (diff > 1 ? " días hábiles" : " día hábil"));
            }
          },
          style: {
            colors: ["#0e1214", "#292626"],
          }
        },
        title: {
          text: this.titulos.central || 'titulo central',
          align: 'center',
          margin: 2,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize:  '14px',
            fontWeight:  'bold',
            fontFamily:  undefined,
            color:  '#337ab7'
          },
        },
        xaxis: {
          type: "datetime",
          title:{
            text:this.titulos.horizontal,
            offsetY: this.titleXTop ? -305: 0,
          },
          labels:{
            formatter: function(value, timestamp, opts) {
              return moment(value).format('DD/MMM')
            }
          },
          min: this.xmin
        },
        yaxis: {
          show: false
        },
        grid: {
          row: {
            colors: ["#d3e4f2", "#fff"],
            opacity: 1
          }
        },
        tooltip: {
          theme: 'dark',
          custom: function({series, seriesIndex, dataPointIndex, w}) {
            var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
            // let etapa = w.globals.initialSeries[seriesIndex+1] ? w.globals.initialSeries[seriesIndex+1].data[dataPointIndex] : '';
            return (('<label style="text-align:right;padding:5px;border-top:4px solid black; list-style: none; color: #dceaf7">' +
            '<b>' + data.x +': </b> <i>' + moment( data.y[0]).format('DD/MMM') +
            ' al ' + moment( data.y[1]).format('DD/MMM') +'<i></label>').replace(/\./g,''));
          }
        },
        annotations: {
          xaxis: this.topes
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                height:300,
                toolbar:{
                  show:false,
                }
              },
              dataLabels: {
                style: {
                  fontSize: '12px',
                }
              },
              plotOptions: {
                
              },
              tooltip: {
                style:{
                  fontSize : '11px'
                }
              },
              title: {
                margin: 1,
                style: {
                  fontSize:  '12px',
                  fontWeight:  'bold',
                },
              },
              xaxis: {
                type: "datetime",
                tickAmount:5,
                title:{
                  text:this.titulos.horizontal
                },
                labels:{
                  formatter: function(value, timestamp, opts) {
                    return moment(value).format('DD/MMM')
                  }
                },
                min: this.xmin
              },   
              annotations: {
                xaxis: this.topes
              },  
            }
          }
        ]
      };
    } catch (error) {
      console.log(error);
    }
  }

  sendMessage(respuesta:any) {
    this.messageEvent.emit(respuesta);
  }
}
