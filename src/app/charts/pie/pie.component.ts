import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { elementContainerEnd } from '@angular/core/src/render3';
import { forEach } from '@angular/router/src/utils/collection';
import {
  ChartComponent,
  ApexChart,
  ApexTitleSubtitle,
  ApexNonAxisChartSeries,
  ApexTheme,
  ApexLegend,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  labels:string[];
  theme:ApexTheme;
  legend:ApexLegend;
  colors: string[];
};

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css']
})
export class PieComponent implements OnInit,OnChanges {

  @ViewChild("chart") chart: ChartComponent;
  @Input() titulo: string;
  @Input() series: [];
  @Input() labels: [];
  @Input() id: number;
  @Input() radio: number;
  @Output() messageEvent = new EventEmitter<string>();
  public chartOptions: Partial<ChartOptions>;


  constructor() { }

  ngOnInit() {
    console.log('init chart pie');
  }

  ngOnChanges(){
    console.log('changes pie',this.titulo,this.series,this.labels);
    const mostrar=(obj:any)=>{
      this.sendMessage(obj);
    }
    this.chartOptions={
      chart: {
        height: this.radio ? this.radio : 250,
        type: "pie",
        events: {
          dataPointSelection: function(event, chartContext, config){
            mostrar({d:config.dataPointIndex,s:config.seriesIndex})
          }
        }
      },
      title: {
        text: this.titulo || 'Sin Datos',
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
      series: this.series || [0],
      labels: this.labels || ['Sin Datos'],
      // theme: {
      //   mode: 'light', 
      //   // palette: 'palette6',
      // },
      colors: ['#2980b9', '#3dad97', '#c7a005', '#b64dfc', '#f37712', '#c0392b',' #45f241',' #f1948a','#D7263D','#fbc02d'],
      legend: {
        show: true,
        showForSingleSeries: true,
        showForNullSeries: true,
        showForZeroSeries: true,
        position: 'right',
        horizontalAlign: 'right',
        width:270,
      }
    };
    setTimeout(() => {
      let elems:any;
      elems = document.getElementsByClassName('apexcharts-legend-series');
      for (let index = 0; index < elems.length; index++) {
            elems[index].style.textAlign = "right";
          }
    }, 1000);

  }
  sendMessage(respuesta:any) {
    this.messageEvent.emit(respuesta);
  }
}
