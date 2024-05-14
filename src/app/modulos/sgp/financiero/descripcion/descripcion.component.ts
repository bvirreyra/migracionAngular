import { DatePipe } from "@angular/common";
import { Component, Input, OnChanges, OnInit } from "@angular/core";
/*servicios*/
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { AutenticacionService } from "../../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../../seguridad/mensajes/mensajes.component";
import { SgpService } from "../../sgp.service";

@Component({
  selector: "app-descripcion",
  templateUrl: "./descripcion.component.html",
  styleUrls: ["./descripcion.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
  ],
})
export class DescripcionComponent implements OnInit, OnChanges {
  @Input() inputDts: any;

  public cargado: boolean = false;
  public prop_msg: string;
  public prop_tipomsg: string;
  public errorMessage: string;

  public dts_descripcion: any;
  public mostrar: boolean = true;
  public m_porcentaje_saldo: any;
  public m_porcentaje_desembolsado: any;
  public m_montocontratomodificacion: any;

  constructor(
    private _seguimiento: SgpService,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent
  ) {}

  ngOnInit() {}
  ngOnChanges() {
    console.log("DESCRIPCION===>", this.inputDts);
    this.dts_descripcion = this.inputDts;
    this.cargarDatos();
  }

  cargarDatos() {
    console.log("entrando a cargarDatos");
    console.log("los datos", this.dts_descripcion);

    if (
      this.dts_descripcion.v_monto_contrato_original !=
      this.dts_descripcion.v_monto_modificacion
    ) {
      this.m_porcentaje_saldo =
        (100 * this.dts_descripcion.v_monto_saldo) /
        this.dts_descripcion.v_monto_modificacion;
      this.m_porcentaje_desembolsado =
        (100 * this.dts_descripcion.v_monto_liquidopagado) /
        this.dts_descripcion.v_monto_modificacion;
      this.m_montocontratomodificacion =
        this.dts_descripcion.v_monto_modificacion;
    } else {
      this.m_porcentaje_saldo =
        (100 * this.dts_descripcion.v_monto_saldo) /
        this.dts_descripcion.v_monto_contrato_original;
      this.m_porcentaje_desembolsado =
        (100 * this.dts_descripcion.v_monto_liquidopagado) /
        this.dts_descripcion.v_monto_contrato_original;
      this.m_montocontratomodificacion =
        this.dts_descripcion.v_monto_contrato_original;
    }
    this.m_porcentaje_saldo = this._fun.valorNumericoDecimal(
      this.m_porcentaje_saldo
    );
    this.m_porcentaje_desembolsado = this._fun.valorNumericoDecimal(
      this.m_porcentaje_desembolsado
    );

    setTimeout(() => {
      this.cargado = true;
    }, 20);
  }

  switchMostrar() {
    console.log("entra al switch");
    this.mostrar = !this.mostrar;
  }
}
