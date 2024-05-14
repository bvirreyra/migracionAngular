import { Component,OnInit,OnChanges,Input, ViewChild, SimpleChanges } from "@angular/core";

import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexFill,
  ChartComponent,
  ApexTitleSubtitle,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  title:ApexTitleSubtitle;
};
@Component({
  selector: 'app-radial-critic',
  templateUrl: './radial-critic.component.html',
  styleUrls: ['./radial-critic.component.css']
})
export class RadialCriticComponent implements OnInit,OnChanges {
  @ViewChild("chart") chart: ChartComponent;
  @Input() series : any;
  @Input() titulos: {central:string,vertical:string,horizontal:string};
  @Input() alto:number = 250;
  public chartOptions: Partial<ChartOptions>;



  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    try {
      console.log('datos critic',this.series);
      const miColor = this.series.porcentaje<30 ? '#23d404':
      this.series.porcentaje<60 ? '#e8be02': this.series.porcentaje<80 ? '#f74e00' : '#bf0404'
      
      this.chartOptions = {
        series: [this.series.porcentaje],
        chart: {
          type: "radialBar",
          offsetY: 0
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
        plotOptions: {
          radialBar: {
            startAngle: -90,
            endAngle: 90,
            track: {
              startAngle:-90,
              endAngle:-70,
              background: "#e7e7e7",
              strokeWidth: "97%",
              margin: 5, // margin is in pixels
              dropShadow: {
                enabled: true,
                top: 2,
                left: 0,
                opacity: 0.31,
                blur: 2
              }
            },
            dataLabels: {
              total:{
                show: false,
                label: `Total días transcurridos ${this.series.dias}  de  ${this.series.total}`
              },
              name: {
                show: true
              },
              value: {
                offsetY: -50,
                fontSize: "22px"
              }
            }
          }
        },
        fill: {
          colors: [miColor],//['#23d404'],
          type: "solid",
          gradient: {
            shade: "dark",
            // type:"horizontal",
            shadeIntensity: 0.9,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            gradientToColors:['#bf0808'],
            // stops: [0, 50, 53, 91],
          }
        },
        labels: [`Total días transcurridos ${this.series.dias}  de  ${this.series.total}`]
      };
    } catch (error) {
      console.log(error);
    }
  }

}
