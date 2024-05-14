import { Component, Input, OnChanges, OnInit, ViewChild } from "@angular/core";
import {
  ApexChart,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexStroke,
  ApexTitleSubtitle,
  ChartComponent,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  colors: string[];
  plotOptions: ApexPlotOptions;
  stroke: ApexStroke;
  labels: string[];
};

@Component({
  selector: "app-radial",
  templateUrl: "./radial.component.html",
  styleUrls: ["./radial.component.css"],
})
export class RadialComponent implements OnInit, OnChanges {
  @ViewChild("chart") chart: ChartComponent;
  @Input() titulo: string;
  @Input() nombreSeries: string;
  @Input() actual: number;
  @Input() total: number;
  @Input() id: number;
  @Input() label: string;
  public chartOptions: Partial<ChartOptions>;

  public label_chart: any;

  constructor() {}

  ngOnInit() {
    console.log("cargando chart radial");
    console.log(this.actual, this.total);

    // const avance = this.actual && this.total ? Math.round10(this.actual*100/this.total,2):99;
    const avance =
      this.actual && this.total
        ? this.redondea((this.actual * 100) / this.total, 2)
        : 0;
    this.label_chart =
      this.label == "" || this.label == undefined ? "Desembolsos" : this.label;
    console.log((this.actual * 100) / this.total);
    console.log(avance);

    this.chartOptions = {
      chart: {
        height: 250,
        type: "radialBar",
      },
      title: {
        text: this.titulo,
        align: "center",
        margin: 10,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize: "16px",
          fontWeight: "bold",
          fontFamily: undefined,
          color: "#263238",
        },
      },
      series: [avance],
      colors: ["#008FFB"],
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: "70%",
            background: "#03366d",
          },
          track: {
            dropShadow: {
              enabled: true,
              top: 2,
              left: 0,
              blur: 4,
              opacity: 0.15,
            },
          },
          dataLabels: {
            name: {
              offsetY: -10,
              color: "#fff",
              fontSize: "18px",
            },
            value: {
              color: "#fff",
              fontSize: "35px",
              show: true,
            },
          },
        },
      },
      stroke: {
        lineCap: "round",
      },
      labels: [this.label_chart],
    };

    // var options = {
    //   chart: {
    //     height: 250,
    //     type: "radialBar",
    //   },
    //   title: {
    //     text: this.titulo,
    //     align: 'center',
    //     margin: 10,
    //     offsetX: 0,
    //     offsetY: 0,
    //     floating: false,
    //     style: {
    //       fontSize:  '16px',
    //       fontWeight:  'bold',
    //       fontFamily:  undefined,
    //       color:  '#263238'
    //     },
    //   },

    //   series: [avance],
    //   colors: ["#008FFB"],
    //   plotOptions: {
    //     radialBar: {
    //       hollow: {
    //         margin: 0,
    //         size: "70%",
    //         background: "#03366d"
    //       },
    //       track: {
    //         dropShadow: {
    //           enabled: true,
    //           top: 2,
    //           left: 0,
    //           blur: 4,
    //           opacity: 0.15
    //         }
    //       },
    //       dataLabels: {
    //         name: {
    //           offsetY: -10,
    //           color: "#fff",
    //           fontSize: "18px"
    //         },
    //         value: {
    //           color: "#fff",
    //           fontSize: "35px",
    //           show: true
    //         }
    //       }
    //     }
    //   },
    //   // fill: {
    //   //   colors:['#1A73E8'],
    //   //   type: "solid",
    //   //   // gradient: {
    //   //   //   shade: "dark",
    //   //   //   type: "vertical",
    //   //   //   gradientToColors: ["#87D4F9"],
    //   //   //   stops: [0, 100]
    //   //   // }
    //   // },
    //   stroke: {
    //     lineCap: "round"
    //   },
    //   labels: ["Desembolsos"]
    // };

    // var chart = new ApexCharts(document.querySelector("#chart"), options);

    // chart.render();

    //o de esta manera pero mandando una prop [id] con la cual cambiar el id del div
    // const d = document.querySelector("#chart")
    // d.id='mio';
    // const n = document.getElementById("mio");
    // console.log(n);
  }

  ngOnChanges() {
    // const avance = this.actual && this.total ? Math.round10(this.actual*100/this.total,2):99;
    const avance =
      this.actual && this.total
        ? this.redondea((this.actual * 100) / this.total, 2)
        : 99;
    this.label_chart =
      this.label == "" || this.label == undefined ? "Desembolsos" : this.label;

    this.chartOptions = {
      chart: {
        height: 250,
        type: "radialBar",
      },
      title: {
        text: this.titulo,
        align: "center",
        margin: 10,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize: "16px",
          fontWeight: "bold",
          fontFamily: undefined,
          color: "#263238",
        },
      },
      series: [avance],
      colors: ["#008FFB"],
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: "70%",
            background: "#03366d",
          },
          track: {
            dropShadow: {
              enabled: true,
              top: 2,
              left: 0,
              blur: 4,
              opacity: 0.15,
            },
          },
          dataLabels: {
            name: {
              offsetY: -10,
              color: "#fff",
              fontSize: "18px",
            },
            value: {
              color: "#fff",
              fontSize: "35px",
              show: true,
            },
          },
        },
      },
      stroke: {
        lineCap: "round",
      },
      labels: [this.label_chart],
    };
  }

  redondea(num, precision) {
    precision = Math.pow(10, precision);
    return Math.ceil(num * precision) / precision;
  }
}
