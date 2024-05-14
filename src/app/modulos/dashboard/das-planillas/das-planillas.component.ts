import { Component, OnInit } from "@angular/core";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import alasql from "alasql";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { SeguimientoProyectosService } from "../../seguimiento-proyectos/seguimiento-proyectos.service";

declare var $: any;
@Component({
  selector: "app-das-planillas",
  templateUrl: "./das-planillas.component.html",
  styleUrls: ["./das-planillas.component.css"],
})
export class DasPlanillasComponent implements OnInit {
  public cargando: boolean = false;
  idUsuario: number;

  mostrarGrid: boolean = true;
  elDep: string = "";
  laProv: string = "";
  departamentos: any[] = [];
  provincias: any[] = [];
  municipios: any[] = [];

  dtsProyectos: any[];
  dtsPivot: any[] = [];
  f1: string = moment(new Date().setDate(1)).format("YYYY-MM-DD");
  f2: string = moment().endOf("month").format("YYYY-MM-DD");
  f1Anterior:string;
  f2Anterior:string;

  porPeriodo: boolean = true;
  dtsMes1: any[] = [];
  dtsMes2: any[] = [];
  dtsMes3: any[] = [];
  losDepartamentos : any[] = [{d:'BENI'},{d:'CHUQUISACA'},{d:'COCHABAMBA'},{d:'LA PAZ'},{d:'ORURO'},{d:'PANDO'},{d:'POTOSÍ'},{d:'SANTA CRUZ'},{d:'TARIJA'}]

  seriesBarDep: any[] = [];
  periodosBarDep: any[] = [];
  periodosBarEtapa: any[] = [];
  titulosBarDep: { central: string; vertical: string; horizontal: string };
  coloresDeptos: string[] = [
    "#449DD1",
    "#749629",
    "#EA3546",
    "#662E9B",
    "#cc028f",
    "#0251f0",
    "#546E7A",
    "#00b312",
    "#a35948",
    "#2b908f",
  ];

  coloresEstructura: string[] = [
    "#4281aa",
    "#82aa42",
    "#8d8140",
    "#853021",
    "#852185",
    "#218580",
  ];
  titulosEstructura: { central: string; vertical: string; horizontal: string };
  dtsSeriesEstructura: any[] = [];
  dtsEtapasEstructura: string[] = [];

  alto: number = 350;

  elProyecto: any;
  sinData: boolean = false;

  totalesDepto = { costo: 0, cantidad: 0, costoP: 0, cantidadP: 0 };
  totalesMes1 = { costo: 0, cantidad: 0, costoP: 0, cantidadP: 0 };
  totalesMes2 = { costo: 0, cantidad: 0, costoP: 0, cantidadP: 0 };
  totalesMes3 = { costo: 0, cantidad: 0, costoP: 0, cantidadP: 0 };

  periodo1={valor:'',texto:''};
  periodo2={valor:'',texto:''};
  periodo3={valor:'',texto:''};

  coloresPagos: string[] = [
    "#4281aa",
    "#82aa42",
    "#8d8140",
    "#853021",
    "#852185",
    "#218580",
  ];
  titulosPagos: { central: string; vertical: string; horizontal: string };
  dtsSeriesPagos: any[] = [];
  dtsEtapasPagos: string[] = [];

  dtsEstructuras: any[] = [];
  dtsDepEst: any[] = [];

  mostrarTE: boolean = false;
  mostrarED: boolean = false;

  titulosPE: { central: string; vertical: string; horizontal: string };
  dtsSeriesPE: any[] = [];
  dtsEtapasPE: string[] = [];

  constructor(
    private _seguimiento: SeguimientoProyectosService,
    private toastr: ToastrService,
    private _fun: FuncionesComponent
  ) {
    this.titulosBarDep = {
      central: "Proyectos por departamento",
      vertical: "Proyectos",
      horizontal: "Departamentos",
    };
  }

  async ngOnInit() {
    const datos = (await JSON.parse(localStorage.getItem("dts_con"))) || {};
    this.idUsuario = Number(datos.s_id_usuario);
    this.listarProyectosLP({ f1: this.f1, f2: this.f2 });
  }

  armarPeriodo(f: string) {
    if (!this.porPeriodo) return false;
    const n = f.split("-");
    this.f1 = moment(new Date(Number(n[0]), Number(n[1]) - 1, 1)).format("YYYY-MM-DD");
    this.f2 = moment(new Date(Number(n[0]), Number(n[1]), 0)).format("YYYY-MM-DD");
  }

  listarProyectosLP(opcion: any) {
    this.cargando = true;
    this.dtsMes1 = [];
    this.dtsMes2 = [];
    this.dtsMes3 = [];
    this.periodo1={valor:'',texto:''};
    this.periodo2={valor:'',texto:''};
    this.periodo3={valor:'',texto:''};
    if(this.porPeriodo) this.listarPagosAnterior();
    this._seguimiento.proyectosLiquidoPagable(opcion).subscribe(
      async (result: any) => {
        console.log("plp", result);
        this.dtsPivot = result;
        this.dtsProyectos = result;
        this.rearmarTabla();
        this.cargando = false;
        if (result.length > 0) {
          this.armarSeries(this.dtsPivot);
          this.armarSeriesEstructura(this.dtsPivot);
          this.armarSeriesPagos(this.dtsPivot);
          this.dtsEstructuras = await alasql(
            `select estructura_financiamiento,sum(cast(liquido_apagar as numeric(20,2)))monto
          ,count(*)cantidad from ? group by estructura_financiamiento order by 1`,
            [this.dtsPivot]
          );
          this.dtsDepEst = await alasql(
            `select estructura_financiamiento,v_departamento,sum(cast(liquido_apagar as numeric(20,2)))monto
          ,count(*)cantidad from ? group by estructura_financiamiento, v_departamento order by 1,2`,
            [this.dtsPivot]
          );
        }
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor");
        this.cargando = false;
      }
    );
  }

  listarPagosAnterior() {
    console.log('listarPagosAnterior');
    const n = this.f1.split("-");
    this.f1Anterior = moment(new Date(Number(n[0]), Number(n[1]) - 1, 1)).add(-2,'months').format('YYYY-MM-DD');
    this.f2Anterior = this.f2;//moment(new Date(Number(n[0]), Number(n[1]) , 0)).add(-1,'months').endOf('month').format('YYYY-MM-DD');
    this.periodo1.texto = moment(new Date(Number(n[0]), Number(n[1]) - 1, 1)).add(-2,'months').format('MMMM - YYYY');
    this.periodo1.valor = this.f1Anterior.slice(0,7);
    this.periodo2.texto = moment(new Date(Number(n[0]), Number(n[1]) , 0)).add(-1,'months').endOf('month').format('MMMM - YYYY');
    this.periodo2.valor = moment(new Date(Number(n[0]), Number(n[1]) , 0)).add(-1,'months').endOf('month').format('YYYY-MM');
    this.periodo3.texto = moment(new Date(Number(n[0]), Number(n[1])-1 , 1)).format('MMMM - YYYY');
    this.periodo3.valor = this.f1.slice(0,7);
    console.log('fechas ant',this.f1Anterior,this.f2Anterior);
    this._seguimiento.liquidoPagableAnterior({f1:this.f1Anterior,f2:this.f2Anterior}).subscribe(
      async (result: any) => {
        this.listarPagosProgramados({f1:this.f1Anterior,f2:this.f2Anterior})
        // const anteriores = await alasql(`select distinct periodo from ? order by periodo`,[result])
        console.log("anteriores", result,this.periodo1,this.periodo2,this.periodo3,this.losDepartamentos);
        this.losDepartamentos.forEach(d => {
          this.dtsMes1.push({departamento:d.d,periodo:this.periodo1.valor})
          this.dtsMes2.push({departamento:d.d,periodo:this.periodo2.valor})
          this.dtsMes3.push({departamento:d.d,periodo:this.periodo3.valor})
        });

        this.dtsMes1 = await alasql(`select * from ? as d left join ? as a on d.departamento = a.v_departamento and d.periodo = a.periodo`,[this.dtsMes1,result])
        this.dtsMes2 = await alasql(`select * from ? as d left join ? as a on d.departamento = a.v_departamento and d.periodo = a.periodo`,[this.dtsMes2,result])
        this.dtsMes3 = await alasql(`select * from ? as d left join ? as a on d.departamento = a.v_departamento and d.periodo = a.periodo`,[this.dtsMes3,result])
        console.log('dos dtsMes',this.dtsMes1,this.dtsMes2,this.dtsMes3);
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor");
      }
    );
  }

  listarPagosProgramados(opcion:any) {
    this._seguimiento.montosProgramados(opcion).subscribe(
      async (result: any) => {
        console.log("programados", result,this.dtsMes1,this.dtsMes2);
        this.dtsMes1 = await alasql(`select d.*,p.monto as montop,p.cantidad as cantidadp from ? as d left join ? as p on d.departamento = p.departamento and d.periodo = p.periodo`,[this.dtsMes1,result])
        this.dtsMes2 = await alasql(`select d.*,p.monto as montop,p.cantidad as cantidadp from ? as d left join ? as p on d.departamento = p.departamento and d.periodo = p.periodo`,[this.dtsMes2,result])
        this.dtsMes3 = await alasql(`select d.*,p.monto as montop,p.cantidad as cantidadp from ? as d left join ? as p on d.departamento = p.departamento and d.periodo = p.periodo`,[this.dtsMes3,result])
        this.totalizar();
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor");
      }
    );
  }

  totalizar(){
    this.totalesMes1.cantidad = this.dtsMes1.reduce((a,e)=>a+Number(e.cantidad || 0),0);
    this.totalesMes1.costo = this.dtsMes1.reduce((a,e)=>a+Number(e.monto || 0),0);
    this.totalesMes1.cantidadP = this.dtsMes1.reduce((a,e)=>a+Number(e.cantidadp || 0),0);
    this.totalesMes1.costoP = this.dtsMes1.reduce((a,e)=>a+Number(e.montop || 0),0);

    this.totalesMes2.cantidad = this.dtsMes2.reduce((a,e)=>a+Number(e.cantidad || 0),0);
    this.totalesMes2.costo = this.dtsMes2.reduce((a,e)=>a+Number(e.monto || 0),0);
    this.totalesMes2.cantidadP = this.dtsMes2.reduce((a,e)=>a+Number(e.cantidadp || 0),0);
    this.totalesMes2.costoP = this.dtsMes2.reduce((a,e)=>a+Number(e.montop || 0),0);

    this.totalesMes3.cantidad = this.dtsMes3.reduce((a,e)=>a+Number(e.cantidad || 0),0);
    this.totalesMes3.costo = this.dtsMes3.reduce((a,e)=>a+Number(e.monto || 0),0);
    this.totalesMes3.cantidadP = this.dtsMes3.reduce((a,e)=>a+Number(e.cantidadp || 0),0);
    this.totalesMes3.costoP = this.dtsMes3.reduce((a,e)=>a+Number(e.montop || 0),0);
  }

  rearmarTabla() {
    this.mostrarGrid = true;
    this.departamentos = alasql("select distinct v_departamento from ?", [
      this.dtsProyectos,
    ]);
    this.provincias = alasql("select distinct v_provincia from ?", [
      this.dtsProyectos,
    ]);
    this.municipios = alasql("select distinct v_municipio from ?", [
      this.dtsProyectos,
    ]);
    this.departamentos.unshift({ v_departamento: "" });
    this.provincias.unshift({ v_provincia: "" });
    this.municipios.unshift({ v_municipio: "" });
    this._fun.limpiatabla(".dt-bandeja");
    setTimeout(() => {
      let confiTable = this._fun.CONFIGURACION_TABLA_V6(
        [10, 20, 50, 100, 2000],
        false,
        10,
        [1, "asc"],
        true
      );
      if (!$.fn.dataTable.isDataTable(".dt-bandeja")) {
        var table = $(".dt-bandeja").DataTable(confiTable);
        this._fun.inputTable(table, [0, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
        this._fun.selectTable(table, [5]);
      }
    }, 100);
  }

  async filtrarDinamico(campo: string, valor: string) {
    this.mostrarGrid = false;

    if (campo == "v_departamento") this.elDep = valor;
    if (campo == "v_provincia") this.laProv = valor;

    this.dtsProyectos = await alasql(
      `select * from ? where ${campo} like'%${valor}%' and v_departamento like '%${this.elDep}%' and v_provincia like '%${this.laProv}%'`,
      [this.dtsPivot]
    );

    setTimeout(() => {
      this.rearmarTabla();
    }, 100);

    setTimeout(() => {
      $("#" + campo).val(valor);
      if (this.elDep) $("#v_departamento").val(this.elDep);
      if (this.laProv) $("#v_provicnia").val(this.laProv);
    }, 400);
  }

  armarSeries(dts: any[]) {
    this.titulosBarDep = {
      central: `Total Planillas Pagadas por Departamento(${dts.length})`,
      vertical: "Proyectos",
      horizontal: "Departamentos",
    };

    const porDep = alasql(
      "select v_departamento as departamento, count(*) cantidad ,sum(cast(liquido_apagar as numeric(10,2))) monto from ? group by v_departamento order by departamento",
      [dts]
    );
    const porFinanciamiento = alasql(
      "select estructura_financiamiento, count(*) cantidad ,sum(cast(liquido_apagar as numeric(10,2))) monto from ? group by estructura_financiamiento order by tipo_financiamiento",
      [dts]
    );
    let modDep = [];
    let modArea = [];
    let modFinanciamiento = [];
    console.log("rev", porDep);

    porDep.forEach((e) => {
      modDep.push({
        name: e.departamento,
        data: [e.cantidad],
        monto: e.monto,
      });
    });
    porFinanciamiento.forEach((e) => {
      modFinanciamiento.push({
        name: e.estructura_financiamiento,
        data: [e.cantidad],
        monto: e.monto,
      });
    });
    this.seriesBarDep = modDep;
    // this.dtsMes3 = alasql(`select * from ? d left join ? m on d.d = m.name`,[this.losDepartamentos,modDep]);
    // console.log('este es el m3',this.dtsMes3);
    
    this.periodosBarDep = [
      "Pago de planillas del " +
        moment(this.f1).format("DD/MM/yyyy") +
        " al " +
        moment(this.f2).format("DD/MM/yyyy"),
    ];
    this.totalesDepto.costo = this.seriesBarDep.reduce(
      (ac, el) => ac + Number(el.monto),
      0
    );
    this.totalesDepto.cantidad = this.seriesBarDep.reduce(
      (ac, el) => ac + el.data[0],
      0
    );
    setTimeout(() => {
      this.colorearDepartaemntos();
    }, 100);
  }

  async armarSeriesEstructura(dts: any) {
    const totalPagado = await alasql(
      "select sum(cast(liquido_apagar as numeric(20,2)))pagado from ?",
      [dts]
    )[0].pagado;
    this.titulosEstructura = {
      central: `Líquido Pagable por Periodo y Estructura Financiamiento (${
        totalPagado.toLocaleString("es-ES", {
          style: "decimal",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + " Bs."
      })`,
      vertical: "Monto Pagado",
      horizontal: "Periodos por Estructura Financiamiento",
    };
    dts.map((e) => (e.periodo_pago = moment(e.fecha_pago).format("MM-YYYY")));
    const p = await alasql(
      `select estructura_financiamiento,periodo_pago,sum(cast(liquido_apagar as numeric(20,2)))pagado
    from ? group by estructura_financiamiento,periodo_pago order by estructura_financiamiento,periodo_pago`,
      [dts]
    );
    console.log("q devuelve p ", p);

    const armado = await alasql(
      "select distinct estructura_financiamiento as name from ?",
      [p]
    );
    armado.map((e) => (e.data = []));

    p.forEach(async (e) => {
      await armado
        .filter((f) => f.name == e.estructura_financiamiento)[0]
        .data.push(Math.round(e.pagado * 100) / 100);
    });

    console.log("luego", armado);
    this.dtsSeriesEstructura = armado;

    const pivot_etapas = await alasql(
      "select distinct periodo_pago from ? order by periodo_pago",
      [p]
    );
    let etapas = [];
    pivot_etapas.forEach((e) => {
      etapas.push(e.periodo_pago);
    });

    this.dtsEtapasEstructura = etapas;
  }

  async armarSeriesPagos(dts: any) {
    const totalPagado = await alasql(
      "select sum(cast(liquido_apagar as numeric(20,2)))pagado from ?",
      [dts]
    )[0].pagado;
    this.titulosPagos = {
      central: `Líquido Pagable por Departamento y Estructura Financiamiento (${
        totalPagado.toLocaleString("es-ES", {
          style: "decimal",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + " Bs."
      })`,
      vertical: "Monto Pagado",
      horizontal: "Departamento por Estructura Financiamiento",
    };

    const estructuras = await alasql(
      "select distinct estructura_financiamiento from ? order by 1",
      [dts]
    );
    const departamentos = await alasql(
      "select distinct v_departamento as name from ? order by 1",
      [dts]
    );
    const montos = await alasql(
      `select estructura_financiamiento,v_departamento,sum(cast(liquido_apagar as numeric(20,2)))pagado
    from ? group by estructura_financiamiento,v_departamento`,
      [dts]
    );

    console.log("los datos", estructuras, departamentos, montos);

    let p = [];

    departamentos.forEach((d) => {
      d.data = [];
      estructuras.forEach(async (e) => {
        let m =
          (
            (await montos.filter(
              (f) =>
                f.v_departamento == d.name &&
                f.estructura_financiamiento == e.estructura_financiamiento
            )[0]) || {}
          ).pagado || 0;
        m = Math.round(m * 100) / 100;
        d.data.push(m);
      });
      p.push(d);
    });

    console.log("luego pagos", p);
    this.dtsSeriesPagos = p;

    let etapas = [];
    estructuras.forEach((e) => {
      etapas.push(e.estructura_financiamiento);
    });
    console.log("etapas pagos", etapas);
    this.dtsEtapasPagos = etapas;
  }

  colorearDepartaemntos() {
    const departamentos = alasql(
      "select distinct v_departamento from ? order by v_departamento",
      [this.dtsPivot]
    );
    departamentos.forEach((d, i) => {
      const obj = document.getElementById(`dep${i + 1}`);
      obj.style.backgroundColor = this.coloresDeptos[i];
      obj.style.color = "whitesmoke";
    });
  }

  desglosar(tipo: string) {
    if (tipo == "TE") this.mostrarTE = !this.mostrarTE;
    if (tipo == "ED") this.mostrarED = !this.mostrarED;
  }

  filtrarTE(tipo: string, filtro: string) {
    if (tipo == "estructura")
      return this.dtsDepEst.filter(
        (f) => f.estructura_financiamiento == filtro
      );
  }

  reporte(tipo: string) {
    console.log("generando reporte");
    this.cargando = true;
    const miDTS = {
      tipoReporte: tipo,
      f1: moment(this.f1).format("YYYY-MM-DD"),
      f2: moment(this.f2).format("YYYY-MM-DD"),
    };
    let nombreReporte = "";
    if (tipo == "01") nombreReporte = "LiquidoPagado.xlsx";

    this._seguimiento.reportes(miDTS).subscribe(
      (result: any) => {
        console.log(result);
        const url = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", nombreReporte);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        this.cargando = false;
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor");
        this.cargando = false;
      }
    );
  }

  reporteDTS(tipo: string, data: any) {
    console.log("generando reporte");
    this.cargando = true;
    const miDTS = { tipoReporte: tipo, data };
    let nombreReporte = "";
    if (tipo == "02") nombreReporte = "LiquidoPagadoFiltrado.xlsx";

    this._seguimiento.reportesDTS(miDTS).subscribe(
      (result: any) => {
        console.log(result);
        const url = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", nombreReporte);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        this.cargando = false;
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor");
        this.cargando = false;
      }
    );
  }

  recibeMensaje(data: any, tipo: string) {
    console.log("recibiendo mensaje de chart", data, tipo);
  }

  armarPagosEstructura(data: any) {
    const laEstructura = this.dtsEstructuras[data.d].estructura_financiamiento;
    if (laEstructura == this.dtsEtapasPE[0]) {
      this.dtsSeriesPE = [];
      this.dtsEtapasPE = [];
      return false;
    }
    this.titulosPE = {
      central: `Líquido Pagabla - ${laEstructura}`,
      vertical: "Monto Pagado",
      horizontal: "Departamento",
    };
    let pivot = [];
    this.dtsSeriesPagos.forEach((s) => {
      pivot.push({
        name: s.name,
        data: [s.data[data.d]],
      });
    });
    this.dtsSeriesPE = pivot;
    this.dtsEtapasPE = [this.dtsEtapasPagos[data.d]];
    console.log(
      data,
      laEstructura,
      this.titulosPE,
      this.dtsSeriesPE,
      this.dtsEtapasPE,
      this.dtsSeriesPagos
    );
  }

  obtenerDTS(id: string) {
    const nombreColumnas = [
      "id_sgp",
      "v_departamento",
      "v_provincia",
      "v_municipio",
      "nombreproyecto",
      "estructura_financiamiento",
      "nro_planilla",
      "fecha_inicio",
      "fecha_fin",
      "detalle_planilla",
      "fecha_pago",
      "liquido_apagar",
      "total_descuento",
      "preventivo",
      "usuario_registro",
      "fecha_registro",
      "f1",
      "f2",
    ];
    let select = document.querySelector(
      'select[name="tabla-bandeja_length"]'
    ) as HTMLSelectElement;
    if (select) {
      select.value = "2000";
      let eventoChange = new Event("change");
      select.dispatchEvent(eventoChange);
    }

    const tabla = document.getElementById(id) as HTMLTableElement;
    let datos = [];
    for (let i = 1; i < tabla.rows.length; i++) {
      let fila = tabla.rows[i];
      let objeto = {};
      for (let j = 0; j < fila.cells.length; j++) {
        let encabezado = nombreColumnas[j]; //tabla.rows[0].cells[j].textContent; // Obtener el encabezado de la columna
        let valor = fila.cells[j].textContent; // Obtener el valor de la celda
        objeto[encabezado] = valor; // Agregar al objeto usando el encabezado como clave
      }
      objeto["f1"] = `${moment(this.f1).format("YYYY-MM-DD")} 05:00:00`;
      objeto["f2"] = `${moment(this.f2).format("YYYY-MM-DD")} 23:59:59`;
      datos.push(objeto);
    }
    datos.pop();
    console.log("la dts", datos);
    this.reporteDTS("02", datos);
    if (select) {
      select.value = "10";
      let eventoChange = new Event("change");
      select.dispatchEvent(eventoChange);
    }
  }
}
