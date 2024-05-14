import { Component, ViewChild,OnInit,OnChanges, Input,Output,EventEmitter } from "@angular/core";
import {  ChartComponent } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexPlotOptions,
  ApexGrid,
  ApexLegend,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexTooltip,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  plotOptions: ApexPlotOptions;
  grid: ApexGrid;
  legend:ApexLegend;
  labels:string[];
  colors:string[];
  title:ApexTitleSubtitle;
  dataLabels:ApexDataLabels;
  fill:any;
  tooltip:ApexTooltip;
};

@Component({
  selector: 'app-semi-donut',
  templateUrl: './semi-donut.component.html',
  styleUrls: ['./semi-donut.component.css']
})
export class SemiDonutComponent implements OnInit,OnChanges {
  @ViewChild("chart") chart: ChartComponent;
  @Input() series:number[]=[];
  @Input() labels:string[]=[];
  @Input() colors:string[]=[];
  @Input() titulos:{central:string}
  @Input() maxEtapa:number=0;
  @Output() messageEvent = new EventEmitter<any>();
  public chartOptions: Partial<ChartOptions>;

  constructor() { 
  }

  ngOnInit() {
  }

  ngOnChanges(){
    console.log('ingresando',this.series,this.labels,this.colors,this.titulos,this.maxEtapa);
    const mostrar=(obj)=>{
      this.sendMessage(obj);
    }
    const fillers = [];
    this.series.forEach((e,i) => {
      if(i>this.maxEtapa) fillers[i] = 'horizontalLines'
      if(i<=this.maxEtapa) fillers[i] = undefined
    });
    
    this.chartOptions = {
      series: this.series,
      labels: this.labels,
      chart: {
        width: '100%',
        type: "donut",
        events: {
          dataPointSelection: function(event, chartContext, config){
            mostrar({d:config.dataPointIndex,s:config.seriesIndex})
          }
        }
      },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 90,
          offsetY: 10,
          customScale:1,
          dataLabels: {
            minAngleToShowLabel: 1
        }, 
          donut:{
            labels:{
              show:true,
              total:{
                show:true,
                label:'TIEMPO IDEAL (Días)',
                fontSize: '22px',
                color: '##76d7c4'
              }
            }
          }
        },
      },
      grid: {
        padding: {
          bottom: -100
        }
      },
      legend: {
        position: 'top'
      },
      colors: this.colors,
      title: {
        text: this.titulos.central,
        align: 'center',
        margin: 2,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize:  '18px',
          fontWeight:  'bold',
          fontFamily:  undefined,
          color:  '#337ab7'
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function(val, opts) {
          // console.log('opts semiDonut',val,opts);
          var label = opts.w.globals.series[opts.seriesIndex];
          // let pendiente = '';
          // if(opts.seriesIndex>1) pendiente = ' Pendiente';
          return (label + (Number(label) > 1 ? " días" : " día"));
        },
        style: {
          colors: ["#292929"],
          fontSize: '17px',
        }
      },
      fill:{
        colors:this.colors,
        type:'pattern',
        pattern:{
          enabled:true,
          style:fillers,//[,,'slantedLines','slantedLines','slantedLines'],
          strokeWidth: 1,
        }
      },
      tooltip: {
        custom: function({series, seriesIndex, dataPointIndex, w}) {
          // console.log('donuts labels', series[seriesIndex],w.globals.seriesNames[seriesIndex],w.globals);
          return `<div style="background-color: ${w.globals.colors[seriesIndex].replace('"','')}; color: #4c4c4c; font-weight: 800; padding:5px">
            ${w.globals.seriesNames[seriesIndex]}: ${series[seriesIndex]} días  </div>`
        },
        style:{
          fontSize : '16px'
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            dataLabels: {
              style: {
                fontSize: '12px',
              }
            },
            plotOptions: {
              customScale:1.3,
              pie: {
                donut:{
                  labels:{
                    total:{
                      fontSize: '12px',
                    }
                  }
                }
              },
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
          }
        }
      ]
    };
  }
  sendMessage(respuesta:any) {
    this.messageEvent.emit(respuesta);
  }

}
