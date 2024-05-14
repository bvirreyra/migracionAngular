import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import alasql from "alasql";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { SgpService } from "../sgp.service";

@Component({
  selector: "app-monitoreo-etapas",
  templateUrl: "./monitoreo-etapas.component.html",
  styleUrls: ["./monitoreo-etapas.component.css"],
})
export class MonitoreoEtapasComponent implements OnInit, OnChanges {
  // @Input() data: [];
  @Input() data: any;

  dtsEtapas: any[] = [];
  allEtapas: any[] = [];

  armadoSeries: any[] = [];
  topes: any[] = [];
  topesIdeal: any[] = [];

  titulos: { central: string; vertical: string; horizontal: string };
  titulosRadial: { central: string; vertical: string; horizontal: string };

  seriesRadial: { dias: number; porcentaje: number; total: number };

  lasTareas: any[] = [];
  elDetalle: string = "";
  subEtapa: boolean = false;

  armadoSeriesSub: any[] = [];
  titulosSub: { central: string; vertical: string; horizontal: string };
  xmin: number;
  desfase: string = "";

  seriesSD: number[] = [3, 5, 4, 2, 8];
  labelsSD: string[] = ["E1", "E2", "E3", "E4", "E5"];
  colorsSD: string[] = ["", "", "", "", ""];
  titulosSD: { central: string } = { central: "" };

  maxEtapa: number = 0;
  seriesIdeal: any[] = [];
  titulosIdeal: { central: string; vertical: string; horizontal: string };
  xminSub: number;

  lasTareasDonut: any[] = [];
  elDetalleDonut: string = "";

  sinData: boolean = false;

  dtsFeriados: any[] = [];

  constructor(
    private _sgp: SgpService,
    private toastr: ToastrService,
    private _fun: FuncionesComponent
  ) {}
  ngOnChanges() {
    console.log("change etapas", this.data);
    this.cargarFeridos();
    this.obtenerMonitoreoEtapas();
    this.titulos = {
      central: this.data.nombreproyecto,
      horizontal: "tit horizontal",
      vertical: "tit vertical",
    };
    this.titulosRadial = {
      central: this.data.nombreproyecto,
      horizontal: "tit horizontal",
      vertical: "tit vertical",
    };
    this.seriesRadial = { dias: 79, porcentaje: 82, total: 10 };
    this.titulosIdeal = {
      central: this.data.nombreproyecto,
      horizontal: "Cronograma Ideal",
      vertical: "Etapas",
    };
  }

  ngOnInit() {}

  cargarFeridos() {
    //obtner Fechas desde DB y usar incrementaFechaSF sin async
    this._sgp.feriados().subscribe(
      (result: any) => {
        this.dtsFeriados = result;
      },
      (error) => console.log("Error al obtnere feriados, ", error.toString())
    );
  }

  obtenerMonitoreoEtapas() {
    this._sgp.monitoreoEtapas(this.data.id_compromiso).subscribe(
      (result: any) => {
        
        console.log("monitoreo", result);
        this.dtsEtapas = result.map((e) => {
          e.fecha_fin == null
            ? (e.fecha_fin = new Date().toISOString())
            : e.fecha_fin;
          return e;
        });
        this.maxEtapa = this.dtsEtapas.reduce(
          (a, b) => (a.orden > b.orden ? a.orden : b.orden),
          0
        );
        if (this.maxEtapa > 0) {
          this.obtenerEtapasTipo(result[0].tipo_financiamiento);
        } else {
          this.sinData = true;
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

  obtenerEtapasTipo(tipo: string) {
    this._sgp
      .etapasTipo({ tipo, idCompromiso: this.data.id_compromiso })
      .subscribe(
        (result: any) => {
          
          console.log("todas las etapas " + tipo, result);
          this.allEtapas = result;
          this.armarSeries(this.dtsEtapas);
        },
        (error) =>
          this.toastr.error(error.toString(), "Error desde el servidor", {
            positionClass: "toast-top-right",
            timeOut: 8000,
            progressBar: true,
          })
      );
  }

  armarSeries(dts: any[]) {
    // dts.map(e=>e.fecha_fin == null ? e.fecha_fin = new Date().toISOString():e.fecha_fin);
    console.log("sin nulls", dts);

    const agrupado = alasql(
      "select etapa,color,tiempo_ejecucion,min(fecha_inicio)fecha_inicio, max(fecha_fin)fecha_fin from ? group by etapa,color,tiempo_ejecucion",
      [dts]
    );
    // console.log('el agrupado',agrupado);
    this.titulosSD.central = `TIEMPO IDEAL PARA PROYECTOS ${
      this.allEtapas[0].tipo_financiamiento
    } - ${this.allEtapas[0].area || ""}`;

    const previa = agrupado.map((e) => {
      const modelo = {
        x: e.etapa,
        y: [
          new Date(e.fecha_inicio).getTime(),
          new Date(e.fecha_fin || new Date()).getTime(),
        ],
        fillColor: e.color,
      };
      if (modelo.y[0] == modelo.y[1]) modelo.y[1] += 1000 * 60 * 60 * 24; //para evitar 0 dias en el chart
      return modelo;
    });
    const minFechaInicio = new Date(
      alasql("select min(fecha_inicio)min from ?", [dts])[0].min
    ).getTime();
    this.xmin = minFechaInicio;
    let fi: number, ff: number;
    const ideal = this.allEtapas.map((e, i) => {
      fi = minFechaInicio;
      if (i > 0) fi = ff + (1000 + 60 + 60 + 24);
      let ffSF = this._fun.incrementaFechaSF(
        "FECHA_FIN",
        new Date(fi),
        new Date(),
        e.tiempo_ejecucion,
        this.dtsFeriados
      );
      ff = new Date(ffSF).getTime();
      console.log("id", new Date(fi), new Date(ff), ffSF, e.tiempo_ejecucion);

      return {
        x: e.etapa, //'ideal',
        y: [fi, ff],
        fillColor: e.color,
        etapa: e.etapa,
      };
    });
    this.seriesIdeal = [{ data: ideal }];
    const etapaActiva = this.dtsEtapas.reduce(
      (a, b) => (a.orden > b.orden ? a.orden : b.orden),
      0
    );
    this.labelsSD = this.allEtapas.map((e) => e.etapa);
    this.seriesSD = this.allEtapas.map((e) => e.tiempo_ejecucion);
    this.colorsSD = this.allEtapas.map((e) => e.color);
    // console.log('idelaes',ideal,minFechaInicio,this.seriesIdeal);
    setTimeout(() => {
      // this.armadoSeries = [{name:'ideal',data:ideal},{name:'real',data:previa}];
      this.armadoSeries = [{ data: previa }];
    }, 200);
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
    // console.log('casi armados',previa, this.armadoSeries,this.topes);

    //Para el radial
    const agrupado2 = alasql(
      "select min(fecha_inicio)mint, max(fecha_fin)maxt from ?",
      [dts]
    )[0];
    let final = agrupado2.maxt || new Date();
    let tiempoTotal = 0;
    dts.forEach((e) => {
      tiempoTotal += e.tiempo_ejecucion;
      if (!e.fecha_fin) final = new Date();
    });
    // const totalDias = ((new Date(final).getTime() - new Date(agrupado2.mint).getTime())/(1000*60*60*24)).toFixed(0);
    // let totalDias = 0;
    // this._fun.incrementaFechaAsync('DIAS_HABILES',new Date(agrupado2.mint),new Date(final),3).then(r => totalDias = Number(r));
    const totalDias = this._fun.incrementaFechaSF(
      "DIAS_HABILES",
      new Date(agrupado2.mint),
      new Date(final),
      3,
      this.dtsFeriados
    );
    const porcentajeTranscurrido =
      (Number(totalDias) / Number(dts[0].topedias)) * 100;
    // console.log('rev tiempos',totalDias,tiempoTotal,agrupado2,dts[0].topedias,Number(dts[0].topedias)-Number(totalDias));

    this.seriesRadial = {
      dias: Number(totalDias),
      porcentaje: Number(porcentajeTranscurrido.toFixed(2)),
      total: Number(dts[0].topedias),
    };

    this.titulos.horizontal =
      "Días transcurridos " + totalDias + " días hábiles.";
    this.titulosIdeal.horizontal =
      "Cronograma Ideal " + dts[0].topedias + " días";
    if (Number(dts[0].topedias) - Number(totalDias) < 0)
      this.desfase = `ALERTA!!! ${
        Number(totalDias) - Number(dts[0].topedias)
      } DÍAS DE DESFASE.`;
  }

  recibeMensaje($event, tipo: string) {
    console.log("recibiendo mensaje de chart", $event, tipo);
    // console.log('el data index',this.armadoSeries[$event.s].data[$event.d]);
    if (tipo == "rangeBarEtapas") {
      this.elDetalle = `${
        this.armadoSeries[$event.s].data[$event.d].x
      } del ${moment(this.armadoSeries[$event.s].data[$event.d].y[0]).format(
        "DD/MM/yyyy"
      )} al ${moment(this.armadoSeries[$event.s].data[$event.d].y[1]).format(
        "DD/MM/yyyy"
      )}
      Fecha Tope: ${moment(this.topes[$event.d].x)
        .add(1, "days")
        .format("DD/MM/yyyy")}`;
      // this.laTarea = this.dtsEtapas.filter(f=>f.etapa == this.armadoSeries[$event.s].data[$event.d].x && new Date(f.fecha_inicio).getTime() == this.armadoSeries[$event.s].data[$event.d].y[0])[0].tarea;
      this.lasTareas = this.dtsEtapas.filter(
        (f) => f.etapa == this.armadoSeries[$event.s].data[$event.d].x
      );
      //para el chart subEtapa
      this.armarSeriesSub(
        this.dtsEtapas.filter(
          (f) => f.etapa == this.armadoSeries[$event.s].data[$event.d].x
        )
      );
    }
    if (tipo == "semiDonut") {
      try {
        this.elDetalleDonut = `${
          this.armadoSeries[$event.s].data[$event.d].x
        } del ${moment(this.armadoSeries[$event.s].data[$event.d].y[0]).format(
          "DD/MM/yyyy"
        )} al ${moment(this.armadoSeries[$event.s].data[$event.d].y[1]).format(
          "DD/MM/yyyy"
        )}
        Fecha Tope: ${moment(this.topes[$event.d].x)
          .add(1, "days")
          .format("DD/MM/yyyy")}`;
        this.lasTareasDonut = this.dtsEtapas.filter(
          (f) => f.etapa == this.armadoSeries[$event.s].data[$event.d].x
        );
        // console.log(this.elDetalleDonut,this.lasTareasDonut);
      } catch (error) {
        this.elDetalleDonut = `⚠️ ETAPA: ${
          this.allEtapas[$event.d].etapa
        } aún no fue iniciada.`;
        this.lasTareasDonut = null;
        // console.log('etapa',this.allEtapas);
      }
    }
  }

  armarSeriesSub(dts: any) {
    let min = 0,
      max = 0;
    const previa = dts.map((e) => {
      if (e.fecha_inicio == e.fecha_fin)
        e.fecha_fin = moment(e.fecha_fin).add(1, "days");
      if (new Date(e.fecha_inicio).getTime() < min || min == 0)
        min = new Date(e.fecha_inicio).getTime();
      if (new Date(e.fecha_fin).getTime() > max)
        max = new Date(e.fecha_fin).getTime();
      if (!e.fecha_fin) max = new Date().getTime();
      const modelo = {
        x: e.sub_etapa,
        y: [
          new Date(e.fecha_inicio).getTime(),
          new Date(e.fecha_fin || new Date()).getTime(),
        ],
        goals: [
          {
            name: "Expected",
            value: 20,
            strokeColor: "#775DD0",
          },
        ],
        fillColor: e.color,
      };
      return modelo;
    });
    this.xminSub = min;
    let retraso = "";
    const dif = ((max - min) / (1000 * 60 * 60 * 24)).toFixed(0);
    // console.log('retraso',moment(min).format('yyyyMMDD'),moment(max).format('yyyyMMDD'),dif,Number(dts[0].tiempo_ejecucion));

    if (dif > dts[0].tiempo_ejecucion)
      retraso = ` Desfase, ${
        Number(dif) - Number(dts[0].tiempo_ejecucion)
      } días`;
    this.armadoSeriesSub = [{ data: previa }];
    this.titulosSub = {
      central: "ETAPA: " + dts[0].etapa,
      horizontal:
        "Total tiempo sub etapas " +
        dts[0].tiempo_ejecucion +
        " días." +
        retraso,
      vertical: "",
    };
    // console.log('casi armados',previa, this.armadoSeriesSub);
    this.subEtapa = true;
  }
}
