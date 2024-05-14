import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
/*servicios*/
/*servicios*/
import { DatePipe } from "@angular/common";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import * as moment from "moment";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";

moment.locale("es");

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important
@Component({
  selector: "app-das-estructurafinanciamiento",
  templateUrl: "./das-estructurafinanciamiento.component.html",
  styleUrls: ["./das-estructurafinanciamiento.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
  ],
})
export class DasEstructurafinanciamientoComponent implements OnInit {
  @Input("fid_proyecto") fid_proyecto: any;
  @Input("id_detalle") id_detalle: any;
  @Input("monto_upre") imonto_upre: any;
  @Input("monto_beneficiario") imonto_beneficiario: any;
  @Input("monto_municipal") imonto_municipal: any;
  @Input("monto_gobernacion") imonto_gobernacion: any;
  @Input("estructura_financiamiento") estructura_financiamiento: any;
  @Input("monto_pagado") monto_pagado: any;
  @Input("dts_proyecto") dts_proyecto: any;

  @Output() respuestaPadre = new EventEmitter<string>();

  public monto_total: any;
  public cargando: any;
  constructor(private _fun: FuncionesComponent) {}

  ngOnInit() {
    console.log("monto_pagado==>", this.monto_pagado);
    this.monto_total =
      this._fun.valorNumericoDecimal(this.imonto_upre) +
      this._fun.valorNumericoDecimal(this.imonto_beneficiario) +
      this._fun.valorNumericoDecimal(this.imonto_municipal) +
      this._fun.valorNumericoDecimal(this.imonto_gobernacion);
    this.monto_total = this.monto_total.toFixed(2);
  }
  detallar(dts) {
    this.respuestaPadre.emit(dts);
  }
}
