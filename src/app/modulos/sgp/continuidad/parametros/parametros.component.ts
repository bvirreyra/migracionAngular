import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Globals } from "../../../../global";
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
  selector: "app-parametros",
  templateUrl: "./parametros.component.html",
  styleUrls: ["./parametros.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
  ],
})
export class ParametrosComponent implements OnInit {
  @Input("inputDts") inputDts: any;
  @Input("valor") valor: string;
  @Output() messageEvent = new EventEmitter<string>();

  public datosFiltradoA: any;
  public dts_departamento: any;
  public dts_municipio: any;
  public dts_municipio_back: any;
  public filtroDpto = "TODOS";
  public filtroMunicipio = "";
  public titulo: string;
  public mostrarDetalle: boolean = false;
  public dtsDetalle: any;
  public tituloDetalle: string;

  //dts internos
  public dtsInternoConcluidos: any;
  public dtsInternoMayor80: any;
  public dtsInternoMenor80: any;
  public dtsTotalGrupo: any;

  public comparativa: boolean = false;
  public dts_comparativa: any;
  public labelComparativa: string = "Detalle x Monto Financiado";

  public cargando: boolean = false;
  public errorMessage: string;
  public urlBack: string;

  constructor(
    private _seguimiento: SgpService,
    private _msg: MensajesComponent,
    private globals: Globals
  ) {
    this.urlBack = globals.rutaSrvBackEnd;
  }

  ngOnInit() {
    this.cargarCombos();
    this.armarDts();
  }

  cargarCombos() {
    console.log("cargando los combos");
    console.log(this.inputDts);
    //para filtrar por una propiedad
    const arr = this.inputDts.map((el) => el.departamento).sort();
    const a = arr.filter((item, index) => arr.indexOf(item) === index);
    const b = a.map(function (valor) {
      var obj = { departamento: valor };
      return obj;
    });
    this.dts_departamento = b;
  }

  cargaComboMunicipio() {
    console.log("Dpto", this.filtroDpto);
    this.dtsTotalGrupo = this.dtsInternoConcluidos
      .concat(this.dtsInternoMayor80)
      .concat(this.dtsInternoMenor80);
    this.dts_municipio_back = this.dtsTotalGrupo;
    this.dts_municipio = this.dts_municipio_back.filter((elemento) => {
      return elemento.departamento == this.filtroDpto;
    });
    //por filtrar en front
    const arr = this.dts_municipio.map((el) => el.municipio).sort();
    const a = arr.filter((item, index) => arr.indexOf(item) === index);
    const b = a.map(function (valor) {
      var obj = { municipio: valor };
      return obj;
    });
    this.dts_municipio = b;
    if (this.dts_municipio.length > 0) {
      this.dts_municipio.push({
        departamento: this.filtroDpto,
        municipio: "TODOS",
      });
      this.filtroMunicipio = "TODOS";
    } else {
      this.filtroMunicipio = "";
    }
  }

  sendMessage(valor_pnl) {
    this.messageEvent.emit(valor_pnl);
  }

  armarDts() {
    if (this.valor == "PARAMETROS-ENTREGADOS") {
      //inicial
      this.dtsInternoConcluidos = this.inputDts.filter(
        (elemento) =>
          elemento.avance_financiero == 100 &&
          elemento.entrega_protocolar == "SI"
      );
      //MAYOR 80
      this.dtsInternoMayor80 = this.inputDts.filter(
        (elemento) =>
          elemento.avance_financiero >= 80 &&
          elemento.avance_financiero <= 99 &&
          elemento.entrega_protocolar == "SI"
      );
      //MENOR 80
      this.dtsInternoMenor80 = this.inputDts.filter(
        (elemento) =>
          elemento.avance_financiero < 80 && elemento.entrega_protocolar == "SI"
      );
      this.titulo = "PROYECTOS ENTREGADOS";
    }
    if (this.valor == "PARAMETROS-100") {
      //inicial
      this.dtsInternoConcluidos = this.inputDts.filter(
        (elemento) =>
          elemento.avance_financiero == 100 &&
          elemento.entrega_protocolar == "NO" &&
          elemento.rango_fisico == "100%"
      );
      //MAYOR 80
      this.dtsInternoMayor80 = this.inputDts.filter(
        (elemento) =>
          elemento.avance_financiero >= 80 &&
          elemento.avance_financiero <= 99 &&
          elemento.entrega_protocolar == "NO" &&
          elemento.rango_fisico == "100%"
      );
      //MENOR 80
      this.dtsInternoMenor80 = this.inputDts.filter(
        (elemento) =>
          elemento.avance_financiero < 80 &&
          elemento.entrega_protocolar == "NO" &&
          elemento.rango_fisico == "100%"
      );
      this.titulo = "PROYECTOS CON AVANCE FÍSICO 100%";
      this.dts_comparativa = this.dtsInternoConcluidos
        .concat(this.dtsInternoMayor80)
        .concat(this.dtsInternoMenor80);
      console.log("total dts", this.dts_comparativa);
    }
    if (this.valor == "PARAMETROS-LISTOS") {
      //inicial
      this.dtsInternoConcluidos = this.inputDts.filter(
        (elemento) =>
          elemento.avance_fisico == 100 && elemento.listo_p_entrega == 1
      );
      //MAYOR 80
      this.dtsInternoMayor80 = this.inputDts.filter(
        (elemento) =>
          elemento.avance_financiero >= 80 && elemento.listo_p_entrega == 1
      );
      //MENOR 80
      this.dtsInternoMenor80 = this.inputDts.filter(
        (elemento) =>
          elemento.avance_financiero < 80 && elemento.listo_p_entrega == 1
      );
      this.titulo = "PROYECTOS LISTOS PARA ENTREGA";
    }
  }

  filtrarDepartamento() {
    this.filtroMunicipio = "TODOS";
    this.filtrarMunicipio();
    setTimeout(() => {
      this.cargaComboMunicipio();
    }, 20);
  }

  filtrarMunicipio() {
    this.armarDts();
    console.log("dpto", this.filtroDpto, "municipio", this.filtroMunicipio);
    if (this.filtroMunicipio != "TODOS") {
      this.dtsInternoConcluidos = this.dtsInternoConcluidos.filter(
        (elemento) =>
          elemento.departamento == this.filtroDpto &&
          elemento.municipio == this.filtroMunicipio
      );
      this.dtsInternoMayor80 = this.dtsInternoMayor80.filter(
        (elemento) =>
          elemento.departamento == this.filtroDpto &&
          elemento.municipio == this.filtroMunicipio
      );
      this.dtsInternoMenor80 = this.dtsInternoMenor80.filter(
        (elemento) =>
          elemento.departamento == this.filtroDpto &&
          elemento.municipio == this.filtroMunicipio
      );
    } else {
      this.dtsInternoConcluidos = this.dtsInternoConcluidos.filter(
        (elemento) => elemento.departamento == this.filtroDpto
      );
      this.dtsInternoMayor80 = this.dtsInternoMayor80.filter(
        (elemento) => elemento.departamento == this.filtroDpto
      );
      this.dtsInternoMenor80 = this.dtsInternoMenor80.filter(
        (elemento) => elemento.departamento == this.filtroDpto
      );
    }
  }

  recibeMensaje($event) {
    console.log("recibiendo mensaje en parametros");
    $event ? (this.mostrarDetalle = true) : (this.mostrarDetalle = false);
    console.log($event);
    console.log(this.mostrarDetalle);
    this.cargarDetalle($event);
  }

  cargarDetalle(tipo: string) {
    if (tipo == "GRILLA-DETALLEINI") {
      this.dtsDetalle = this.dtsInternoConcluidos;
      this.tituloDetalle = this.titulo + " - detalle Concluidos";
    }
    if (tipo == "GRILLA-DETALLEMAYOR") {
      this.dtsDetalle = this.dtsInternoMayor80;
      this.tituloDetalle = this.titulo + " - detalle Mayor a 80%";
    }
    if (tipo == "GRILLA-DETALLEMENOR") {
      this.dtsDetalle = this.dtsInternoMenor80;
      this.tituloDetalle = this.titulo + " - detalle Menor a 80%";
    }
    if (!tipo.startsWith("GRILLA")) {
      this.mostrarDetalle = false;
      // this.sendMessage(tipo);
    }
  }

  verComparativa() {
    console.log("abrir componente");
    this.comparativa = !this.comparativa;
    let b = document.getElementById("compara");
    b.classList.toggle("btn-info");
    this.labelComparativa === "Detalle x Monto Financiado"
      ? (this.labelComparativa = "Mostrar Tarjetas")
      : (this.labelComparativa = "Detalle x Monto Financiado");
    if (this.comparativa) {
      this.filtroDpto = null;
      this.filtroMunicipio = null;
    }
  }

  reportesFinanciera() {
    this.cargando = true;
    let nombreReporte: string = "";
    console.log("generando reporte");
    nombreReporte = "proyectosParaEntrega.xlsx";
    const miDTS = { tipoReporte: "02" };

    this._seguimiento.reportesFinanciera(miDTS).subscribe(
      (result: any) => {
        // console.log(result);
        // const file = new Blob([result.blob()], {
        //   type: "application/vnd.ms.excel",
        // });
        const fileURL = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", nombreReporte);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(fileURL);
        this.cargando = false;
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage,
            10
          );
        this.cargando = false;
      }
    );
  }
}
