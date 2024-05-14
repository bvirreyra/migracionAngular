import { DatePipe } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from "@angular/core";
import { Globals } from "../../../global";
/*servicios*/
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import alasql from "alasql";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";
import { MonitoreoService } from "../monitoreo.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-tarjeta-monitoreo",
  templateUrl: "./tarjeta-monitoreo.component.html",
  styleUrls: ["./tarjeta-monitoreo.component.css"],
  providers: [
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    MonitoreoService,
  ],
})
export class TarjetaMonitoreoComponent implements OnInit, OnChanges {
  @Input("inputDts") inputDts: any;
  @Input("valor") valor: string;
  @Input("color") color: string;
  @Input("panel") panel: string;
  @Input("saldo") saldo: boolean;
  @Input("buscador") buscador: boolean;
  @Output() messageEvent = new EventEmitter<string>();

  public titulo: string;
  public montoFinanciado: any; //montoupre
  public montoDesembolsado: any; //totalacumulado
  public montoSaldo: any; //saldoReal
  public cantidad: any;
  public visibleTarjeta: boolean;
  public visibleParam: boolean;
  public dtsDatosTabla: any;
  public cargando: any;
  public muestra_tabla = false;
  public seriesBarDep: any;
  public periodosBarDep: any;
  public alto: any;
  public coloresDeptos: string[];
  public urlBack: string;
  public varUrl: string;

  constructor(
    private _fun: FuncionesComponent,
    private globals: Globals,
    private _monitoreo: MonitoreoService
  ) {
    this.urlBack = globals.rutaSrvBackEnd;
  }

  ngOnInit() {
    console.log("datos ingresados", this.inputDts);
    this.varUrl = JSON.stringify(this.inputDts);
    this.cargarInfo();
    this.visibleTarjeta = true;
  }
  ngOnChanges() {
    console.log("datos ingresados", this.inputDts);
    this.varUrl = JSON.stringify(this.inputDts);
    this.cargarInfo();
    //this.visibleTarjeta = true;
  }

  cargarInfo() {
    this.titulo = this.valor;
    if (this.inputDts != undefined) {
      this.cantidad = this.inputDts.length;

      this._fun.limpiatabla(".dt-reporte");
      this.dtsDatosTabla = alasql(
        "select departamento, count(*) cantidad,sum(cast(costo_proyecto as double)) monto  from ? group by departamento order by departamento",
        [this.inputDts]
      );
      let modDep = [];
      this.dtsDatosTabla.forEach((e) => {
        modDep.push({
          name: e.departamento,
          data: [e.cantidad],
          monto: e.monto,
        });
      });
      this.seriesBarDep = modDep;
      this.periodosBarDep = ["Compromisos entre "];
      this.alto = 350;
      this.coloresDeptos = [
        "#449DD1",
        "#749629",
        "#EA3546",
        "#662E9B",
        "#cc028f",
        "#0251f0",
        "#546E7A",
        "#00b312",
        "#a35948",
      ];
    } else {
      this.cantidad = 0;
    }
  }
  parametrosTabla(tipo) {
    console.log("ENTRA AQUI====>");
    let confiTable = this._fun.CONFIGURACION_TABLA_V8([10, 20, 50], false);
    tipo = "#" + tipo;
    var table = $(tipo).DataTable(confiTable);
    this._fun.totalTable(table, [1]);
  }

  sendMessage(valor_pnl) {
    this.messageEvent.emit(valor_pnl);
  }

  recibeMensaje($event) {
    console.log("recibiendo mensaje en Tarjeta");
    console.log($event);
    this.sendMessage($event);
  }

  detallar(tipo) {
    this.muestra_tabla = !this.muestra_tabla;
    setTimeout(() => {
      this.parametrosTabla(tipo);
    }, 30);
  }
  descargarArchivoExcel() {
    console.log("REPORTE EXCEL ENVIADO", this.inputDts);
    this._monitoreo.descargaExcel(this.inputDts, this.panel, this.valor);
  }
}
