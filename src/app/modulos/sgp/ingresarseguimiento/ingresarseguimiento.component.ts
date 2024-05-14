import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-ingresarseguimiento",
  templateUrl: "./ingresarseguimiento.component.html",
  styleUrls: ["./ingresarseguimiento.component.css"],
})
export class IngresarseguimientoComponent implements OnInit {
  public m_nombreproyecto: any;
  public m_descripcionproyecto: any;
  public m_tipoproyecto: any;
  public dts_TipoProyecto: any;
  public m_tipoconvenio: any;
  public dts_TipoConvenio: any;
  public m_entidadbeneficiaria: any;
  public dts_EntidadBeneficiaria: any;
  public m_detallebeneficiario: any;
  public m_departamento: any;
  public dts_ListaDepartamento: any;
  public m_municipio: any;
  public dts_ListaMunicipio: any;
  public m_nroconvenio: any;
  public m_fechaconvenio: any;
  public m_plazoconvenio: any;
  public m_montofinanciadoupre: any;
  public m_montocontrapartebeneficiario: any;
  public m_montocontrapartegobernacion: any;
  public m_montocontrapartemunicipio: any;
  public m_montototalconvenio: any;
  public buscarMunicipio: any;
  public inserta_seguimiento_sgp: any;
  public actualiza_seguimiento: any;

  constructor() {}

  ngOnInit() {}
}
