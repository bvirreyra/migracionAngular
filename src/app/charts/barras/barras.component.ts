import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexLegend,
  ApexYAxis,
  ApexDataLabels,
  ApexTheme,
  ApexTooltip,
  ApexStroke,
  ApexPlotOptions,
  ApexResponsive
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  theme: ApexTheme;
  tooltip:ApexTooltip;
  stroke:ApexStroke;
  plotOptions:ApexPlotOptions;
  responsive:ApexResponsive[];
  colors:string[];
  montos:number[];
};

@Component({
  selector: 'app-barras',
  templateUrl: './barras.component.html',
  styleUrls: ['./barras.component.css']
})
export class BarrasComponent implements OnInit,OnChanges {
  @ViewChild("chart") chart: ChartComponent;
  @Input() titulo: string;
  // @Input() nombreSeries: string;
  // @Input() data: [];
  @Input() series: any[] =[];
  @Input() periodos: [];
  @Input() titulos: {central:string,vertical:string,horizontal:string};
  @Input() alto:number = 350;
  @Input() colores:string[]=[];
  @Input() multicolumna:boolean=false;
  @Output() messageEvent = new EventEmitter<string>();
  public chartOptions: Partial<ChartOptions>;

  constructor() {
  }

  ngOnInit() {
    console.log('cargando chart');
  }

  ngOnChanges(){
    console.log('on changes barras',this.series,this.periodos,this.titulos);

    let colorLabels = ['#03366d']
    if(this.series.length>1)   colorLabels = ['#FFFAF0'];

    const mostrar=(obj:any)=>{
      this.sendMessage(obj);
    }

    if(!this.series || !this.periodos || !this.titulos) return true;

    const multi = this.multicolumna;

    this.chartOptions = {
      series: this.series,
      chart: {
        height: this.alto,
        width:'100%',
        type: "bar",
        animations: {
          enabled: true,
          easing: 'easein',
          speed: 600,
          animateGradually: {
              enabled: true,
              delay: 150
          },
          dynamicAnimation: {
              enabled: true,
              speed: 350
          }
        },
        events: {
          dataPointSelection: function(event, chartContext, config){
            // console.log('probando index',config.dataPointIndex,event,chartContext,config.w.globals,config);
            // config.w.config.xaxis.title.text = 'Acá podriamos cargar la tarea de la data: ' + config.dataPointIndex//si funciona en produccion
            mostrar({d:config.dataPointIndex,s:config.seriesIndex})
          }
        },
        zoom: {
          enabled: true
        }
      },
      title: {
        text: this.titulos.central,//this.titulo,
        align: 'center',
        margin: 10,
        offsetY: 20,
        floating: false,
        style: {
          fontSize:  '16px',
          fontWeight:  'bold',
          fontFamily:  undefined,
          color:  '#263238'
        },
      },
      xaxis: {
        title:{
          text: this.titulos.horizontal,//'Gestiones',
          offsetY:-4,
        },
        // type:'category',
        categories: this.periodos || ["Jan", "Feb",  "Mar",  "Apr"],
        tickPlacement: 'between',
        labels:{
          style:{
            fontSize: multi ? '12px' :'16px',
            fontWeight: multi ? 400 : 600,
          }
        }
      },
      yaxis: {
        show: true,
        title:{
          text: this.titulos.vertical,//'Montos',
          rotate: -90,
        },
      },
      legend: {
        show: true,
        showForSingleSeries: true,
        showForNullSeries: true,
        showForZeroSeries: true,
        position: 'bottom',
        horizontalAlign: 'center', 
        floating: false,
        fontSize: '14px',
        fontFamily: 'Helvetica, Arial',
        fontWeight: 400,
        formatter: undefined,
        inverseOrder: false,
        width: undefined,
        height: undefined,
        tooltipHoverFormatter: undefined,
        customLegendItems: [],
        offsetX: 0,
        offsetY: 0,
        labels: {
            colors: undefined,
            useSeriesColors: false
        },
        itemMargin: {
            horizontal: 5,
            vertical: 0
        },
        onItemClick: {
            toggleDataSeries: true
        },
        onItemHover: {
            highlightDataSeries: true
        },
      },
      dataLabels: {
        enabled: multi ? false : true,
        // formatter: function (val, { seriesIndex, dataPointIndex, w }) {
        //   console.log('datalabels',w.globals);
          
        //   let fmt = Intl.NumberFormat('es-ES',{maximumFractionDigits:1});
        //     // return w.config.series[seriesIndex].name + ': '+ fmt.format(Number(val))
        //     let pre = Number(w.globals.initialSeries[seriesIndex].monto)/1000000;
        //     const millones = fmt.format(pre)
        //     return `${val} - ${millones}`
        // },
        textAnchor: multi ? 'start' : 'middle',
        distributed: false,
        offsetX: 0,
        offsetY: multi ? -50 : 0,
        style: {
            fontSize: multi ? '12px': '20px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 'bold',
            colors: colorLabels,
        },
      },
      theme: {
        mode: 'light', 
        // palette: 'palette6', 
      },
      colors: this.colores.length>1 ? this.colores : ['#449DD1','#749629','#EA3546','#662E9B','#cc028f','#0251f0','#546E7A','#37f04a','#a35948','#2b908f'],
      tooltip:{
        onDatasetHover: {
          highlightDataSeries: true,
        },
        // custom: function({series, seriesIndex, dataPointIndex, w}) {
        //   console.log(series[seriesIndex][dataPointIndex],w);
        //   let fmt = Intl.NumberFormat('es-ES',{maximumFractionDigits:1});
        //   let pre = Number(w.globals.initialSeries[seriesIndex].monto)/1000000;
        //   const millones = fmt.format(pre)
          
        //   return '<div class="arrow_box">' +
        //     '<span>' + w.globals.initialSeries[seriesIndex].name + '</span>' +
        //     '<span> ' + w.globals.initialSeries[seriesIndex].data[0] +' - '+ millones  +'M</span>' +
        //     '</div>'
        // },
        theme: 'dark',
        style: {
          fontSize: '14px',
        },
        y:{
          formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
            if(multi){
              return value.toLocaleString('es-ES', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }) +' Bs.' 
            }else{
              return value.toString();
            }
          },
        },
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          distributed:false
          // endingShape: "rounded"
        }
      },
      montos:this.series.map(e=>e.monto),
      responsive:[{
        breakpoint:480,
        options:{
          chart: {
            height: 300,
            width:'90%',
            toolbar:{
              show:false,
            }
          },
          tooltip:{
            style:{
              fontSize:'10px'
            }
          },
          dataLabels: {
            style:{
              fontSize:'10px',
            }
          }
        }
      }]
    };
  }

  sendMessage(respuesta:any) {
    this.messageEvent.emit(respuesta);
  }

}
