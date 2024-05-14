import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { SgpService } from "src/app/modulos/sgp/sgp.service";
import { ChartsService } from "../charts.service";
import { SiptaService } from "src/app/modulos/sipta/sipta.service";

@Component({
  selector: "app-chart-proveidos",
  templateUrl: "./chart-proveidos.component.html",
  styleUrls: ["./chart-proveidos.component.css"],
})
export class ChartProveidosComponent implements OnInit, OnChanges {
  @Input() numero: number;
  @Input() gestion: number;

  dtsProveidos: any[] = [];

  dtsFeriados: any[] = [];

  colores: string[] = [
    "#f18553",
    "#449DD1",
    "#67c072",
    "#f03bb9",
    "#4b7cc5",
    "#2b908f",
    "#246cfc",
    "#546E7A",
    "#00b312",
    "#a35948",
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

  dtsSeriesLinea: any[] = [];
  dtsPeriodosLinea: any[] = [];
  dtsPeriodosNombre: any[] = [];
  titulosLinea: {
    central: string;
    vertical: string;
    horizontal: string;
    tooltip: string;
  };

  tituloComponente = "";
  infoHR = "";
  dataExtra: {
    id: number
    de: string
    para: string
    f1: string
    f2: string
    ref: string
    obs:string
  }[] = [];
  fmin: Date;
  fmax: Date;
  tiempoTotal: number;

  constructor(
    private _charts: ChartsService,
    private toastr: ToastrService,
    private _sgp: SgpService,
    private _sipta: SiptaService,
    private _fun: FuncionesComponent
  ) {}

  ngOnInit() {}
  ngOnChanges() {
    console.log("resiviendo inputs", this.numero, this.gestion);

    this.cargarFeriados();
    this.obtenerProveidos({
      opcion: "T",
      numero: this.numero,
      gestion: this.gestion,
    });
  }

  obtenerProveidos(opcion: any) {
    this._charts.listarProveidos(opcion).subscribe(
      (result: any) => {
        console.log("proveidos en chart", result);
        this.dtsProveidos = result;
        this.cargarRevision({
          opcion: "HR",
          hr: this.numero,
          gestion: this.gestion,
        })
      },
      (error) =>
        this.toastr.error(error.toString(), "Error desde el servidor")
    );
  }
  cargarRevision(data) {
    this._sipta.revision(data).subscribe(
      (result: any) => {
        console.log('las revs',result);
        this.dtsProveidos.map(p=>{
          p.observacion = (result.filter(f=>f.fid_proveido == p.id_proveido)[0]  || {}).observacion || '';
          return p;
        })
        this.dtsProveidos.unshift({
            id_proveido: 0,
            fid_padre: 0,
            fid_correspondencia: this.dtsProveidos[0].fid_correspondencia,
            contenido: this.dtsProveidos[0].ref_hr,
            fecha: this.dtsProveidos[0].fecha_origen,
            fecha_respuesta: this.dtsProveidos[0].fecha,
            indice_proveido: 0,
            activo: 1,
            usuario_de: this.dtsProveidos[0].origen_de,
            usuario_para: this.dtsProveidos[0].usuario_de,
            estado_hr: this.dtsProveidos[0].estado_hr,
            ref_hr: this.dtsProveidos[0].ref_hr,
            hr: this.dtsProveidos[0].hr,
            ref_final: this.dtsProveidos[0].ref_final,
            observacion: ''
        })
        setTimeout(() => {
          this.armarSeriesLinea();
        }, 200);
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor")
      }
    );
  }

  cargarFeriados() {
    this._sgp.feriados().subscribe(
      (result: any) => {
        this.dtsFeriados = result;
        console.log("feriados", this.dtsFeriados);
      },
      (error) => console.log("Error al obtnere feriados, ", error.toString())
    );
  }

  armarSeriesLinea() {
    console.log("series linea", this.dtsProveidos);

    this.dataExtra = [];
    let pivotReal = [],
      pivotEtapas = [],
      pivotNombres = [];
    this.dtsProveidos.forEach((m, i) => {
      if (i == 0) {
        this.fmin = m.fecha;
        this.fmax = m.fecha_respuesta;
      }
      if (new Date(m.fecha).getTime() < new Date(this.fmin).getTime())
        this.fmin = m.fecha;
      if (new Date(m.fecha_respuesta).getTime() > new Date(this.fmax).getTime())
        this.fmax = m.fecha_respuesta;
      pivotReal.push(
        this._fun.incrementaFechaSF(
          "DIAS_HABILES",
          new Date(m.fecha),
          new Date(m.fecha_respuesta),
          0,
          this.dtsFeriados
        )
      );
      pivotEtapas.push(
        "P-" + (i + 1) + " " + moment(m.fecha_respuesta).format("DD/MM/YYYY")
      );
      pivotNombres.push(
        `De ${m.usuario_de} para ${m.usuario_para} - ${m.contenido}`
      );
      this.dataExtra.push({
        id: m.id_proveido,
        de: m.usuario_de,
        para: m.usuario_para,
        f1: moment(m.fecha).format("DD/MM/YYYY HH:mm:ss"),
        f2: moment(m.fecha_respuesta).format("DD/MM/YYYY HH:mm:ss"),
        ref: m.contenido,
        obs: m.observacion,
      });
    });
    this.dtsSeriesLinea = [
      {
        name: "Tiempo Etapas ",
        data: pivotReal,
      },
    ];
    this.dtsPeriodosLinea = pivotEtapas; //['p 1','p 2','p 3','p 4','p 5','p 6'];//pivotEtapas;
    this.dtsPeriodosNombre = pivotNombres; //['prov 1','prov 2','prov 3','prov 4','prov 5','prov 6'];//pivotNombres;
    this.titulosLinea = {
      central: "TIEMPO PROVEIDOS",
      horizontal: "ETAPAS",
      vertical: "DIAS",
      tooltip: "días",
    };
    if(this.dtsProveidos[0]){
      this.tituloComponente = `${this.dtsProveidos[0].ref_hr}`;
      this.infoHR = `HR: ${this.dtsProveidos[0].hr}`;
      if (this.dtsProveidos[0].estado_hr != "Terminado") this.fmax = new Date();
      this.tiempoTotal = Number(
        this._fun.incrementaFechaSF(
          "DIAS_HABILES",
          new Date(this.fmin),
          new Date(this.fmax),
          0,
          this.dtsFeriados
        )
      );
    }
    // setTimeout(() => {
    //   const obj = <HTMLDivElement> document.querySelector('#baseCharts')
    //   obj.style.display = 'inline-block !important'
    //   console.log('el obj',obj);

    // }, 4000);
  }

  recibeMensaje($event, tipo: string) {
    console.log("recibiendo mensaje de chart", $event, tipo);
  }
}
