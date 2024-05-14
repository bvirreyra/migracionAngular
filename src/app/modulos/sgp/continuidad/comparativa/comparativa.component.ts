import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import alasql from "alasql";
import { SgpService } from "../../sgp.service";

declare var $: any;

@Component({
  selector: "app-comparativa",
  templateUrl: "./comparativa.component.html",
  styleUrls: ["./comparativa.component.css"],
  providers: [SgpService],
})
export class ComparativaComponent implements OnInit {
  @Input() data: any;
  @Output() messageEvent = new EventEmitter<string>();

  public maxMonto: number;
  public queryFiltro: string = "";
  public listaFiltro: any[] = [];
  public dts_departamentos: any;
  public dts_provincias: any;
  public dts_municipios: any;
  public dep: string;
  public prov: string;
  public mun: string;
  public pagina: number = 0;
  public itemsPagina: number = 20;
  public dts_inicial: any[] = [];
  public dts_areas: any;
  public area: any;

  public pnl_cabecera: boolean = false;
  public registroFila: any;

  constructor() {}

  ngOnInit() {
    this.data = this.data.sort((a, b) => b.monto_upre - a.monto_upre);
    this.maxMonto = this.data.reduce(
      (ac, el) => (ac > Number(el.monto_upre) ? ac : Number(el.monto_upre)),
      0
    );
    console.log(this.data, this.maxMonto);
    this.dts_areas = alasql(`select distinct area from ?`, [this.data]);
    this.dts_areas.unshift({ area: "" });
    this.dts_departamentos = alasql(`select distinct departamento from ?`, [
      this.data,
    ]);
    this.dts_departamentos.unshift({ departamento: "" });
    this.dts_municipios = alasql(`select distinct municipio from ?`, [
      this.data,
    ]);
    this.dts_municipios.unshift({ municipio: "" });
    this.data.forEach((e) => {
      const obj = Object.assign({}, e);
      this.dts_inicial.push(obj);
    });
    // setTimeout(() => {
    //   let bars = $(".progress-bar").attr("aria-valuenow", 95);
    //   console.log('cambiando',bars);

    //   $(".progress-bar").attr("aria-valuenow", 95);
    // }, 1500);
  }

  detalleProyecto(registro: any) {
    this.registroFila = registro;
    this.pnl_cabecera = true;
    window.scrollTo(0, 0);
  }

  filtrar(campo, valor) {
    //if(this.listaFiltro.length==0) this.listaFiltro.push({campo,valor})
    if (!this.queryFiltro) this.queryFiltro = "select * from ? where";
    if (
      this.listaFiltro.filter((f) => f.campo === campo).length == 0 &&
      valor
    ) {
      this.listaFiltro.push({ campo, valor });
      this.queryFiltro = this.queryFiltro.concat(
        ` and ${campo}::text like '%${valor}%'`
      );
      console.log("if", this.listaFiltro);
    } else {
      this.queryFiltro = "select * from ? where ";
      console.log("else", this.listaFiltro);
      this.listaFiltro.map((e) => {
        if (e.campo === campo) {
          e.valor = valor;
        }
        if (e.campo === "municipio" && campo === "departamento") {
          this.mun = "";
          e.valor = "";
        }
        if (e.valor)
          this.queryFiltro = this.queryFiltro.concat(
            ` and ${e.campo}::text like '%${e.valor}%'`
          );
        return e;
      });
    }

    this.queryFiltro = this.queryFiltro
      .replace("  ", " ")
      .replace("where and", "where ");
    if (this.queryFiltro === "select * from ? where ")
      this.queryFiltro = "select * from ?";
    console.log("dos", this.queryFiltro, this.listaFiltro);
    this.data = alasql(this.queryFiltro, [this.dts_inicial]);

    this.pagina = 0;
    $("#anterior").prop("disabled", true);
    if (this.data.length <= this.itemsPagina)
      $("#siguiente").prop("disabled", true);
    if (this.data.length > this.itemsPagina)
      $("#siguiente").prop("disabled", false);
    //reorganizando los combos municipio y provincia
    if (this.dep) {
      const filtrado = this.dts_inicial.filter(
        (f) => f.departamento === this.dep
      );

      this.dts_municipios = alasql(`select distinct municipio from ?`, [
        filtrado,
      ]);
      this.dts_municipios.unshift({ _municipio: "" });
    }
  }

  // ordenar(campo){
  //   let cambiarOrden = '';
  //   if(!this.queryOrden || (!this.queryOrden.includes(campo))) this.queryOrden = 'select * from ? order by ';
  //   if(this.queryOrden.includes(`${campo} asc`)) cambiarOrden = this.queryOrden.replace(`${campo} asc`,`${campo} desc`);
  //   if(this.queryOrden.includes(`${campo} desc`)) cambiarOrden = this.queryOrden.replace(`${campo} desc`,`${campo} asc`);
  //   !this.queryOrden.includes(campo)? this.queryOrden =  this.queryOrden.concat(`, ${campo} asc`): this.queryOrden = cambiarOrden;

  //   this.queryOrden = this.queryOrden.replace('order by ,','order by ')
  //   console.log('ordenar',campo,this.queryOrden);
  //   this.data = alasql(this.queryOrden,[this.data]);
  // }

  paginar(valor: number) {
    // console.log('paginando',this.pagina,valor,Math.trunc(this.data.length/10));
    // $('#anterior').prop('disabled', true)
    this.pagina += valor;
    this.pagina <= 0
      ? $("#anterior").prop("disabled", true)
      : $("#anterior").prop("disabled", false);
    this.pagina >= Math.trunc(this.data.length / this.itemsPagina)
      ? $("#siguiente").prop("disabled", true)
      : $("#siguiente").prop("disabled", false);
  }

  recibeMensaje($event) {
    //para cualquier mensaje ocultamos cabecera y mostramos grilla
    this.pnl_cabecera = false;
  }
}
