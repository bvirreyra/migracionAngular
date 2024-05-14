import { DatePipe } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from "@angular/core";
/*servicios*/
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { AutenticacionService } from "../../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../../seguridad/mensajes/mensajes.component";
import { SgpService } from "../../sgp.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-tarjeta",
  templateUrl: "./tarjeta.component.html",
  styleUrls: ["./tarjeta.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
  ],
})
export class TarjetaComponent implements OnInit, OnChanges {
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

  constructor() {}

  ngOnInit() {
    console.log("en el card");
    console.log(this.inputDts);
    this.cargarInfo();
    this.visibleTarjeta = true;
    const el = document.querySelector(".blanca");
    el.classList.remove("blanca");
    el.classList.add(this.color);
  }
  ngOnChanges() {
    this.cargarInfo();
  }

  cargarInfo() {
    this.titulo = this.valor;
    this.cantidad = this.inputDts.length;
    this.montoFinanciado = this.inputDts.reduce(
      (ac, el) => ac + Number(el.monto_upre || el.monto_bs),
      0
    );
    this.montoDesembolsado = this.inputDts.reduce(
      (ac, el) => ac + Number(el.total_acumulado),
      0
    );
    this.montoSaldo = this.inputDts.reduce(
      (ac, el) => ac + Number(el.saldo_real),
      0
    );

    //para adecuar el tamaño de letra de montos si son menores
    if (this.montoFinanciado < 1000000000) {
      // const el = document.getElementById('tarjeta')
      // el.classList.add('montos');
      console.log("es menor");
    }
  }

  sendMessage(valor_pnl) {
    this.messageEvent.emit(valor_pnl);
  }

  recibeMensaje($event) {
    console.log("recibiendo mensaje en Tarjeta");
    console.log($event);
    this.sendMessage($event);
  }

  detallar() {
    if (this.panel) {
      this.sendMessage(this.panel);
      window.scrollTo(0, 0);
    }
  }
}
