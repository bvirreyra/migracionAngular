import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import alasql from "alasql";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { SgpService } from "../sgp.service";

declare var $: any;

@Component({
  selector: "app-monitoreo-dbc",
  templateUrl: "./monitoreo-dbc.component.html",
  styleUrls: ["./monitoreo-dbc.component.css"],
})
export class MonitoreoDbcComponent implements OnInit, OnChanges {
  @Input() fechaIni: string;
  @Input() fechaFin: string;

  dtsCompromisos: any[] = [];
  dtsGrid: any[] = [];
  dtsAgrupadoMunicipio: any[] = [];
  dtsAgrupadoDepartamento: any[] = [];
  etapas: any[] = [];
  maxEtapas: number = 1;
  dtsFiltrado: any[];
  dtsDetallado: any[];

  titulosBarDep: { central: string; vertical: string; horizontal: string };
  seriesBarDep: any[] = [];
  periodosBarDep: any[] = [];

  seriesBarEtapa: any[] = [];
  seriesArea: any[] = [];
  seriesFinanciamiento: any[] = [];
  periodosBarEtapa: any[] = [];
  allEtapas: any[] = [];
  // colores:string[] = ['#47d5fc','#06a3cf','#76d7c4','#22f0c7','#f1c40f','#b89406','#f39c12','#c47a04','#f77245','#d43904'];
  colores: string[]; //= ['#47d5fc','#76d7c4','#f1c40f','#f39c12','#f77245'];
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
  tituloGrillaDetalle: string = "";

  dtsDeptoEtapas: any[] = [];
  titulosDeptoEtapas: { central: string; vertical: string; horizontal: string };
  alto: number = 350;

  elCompromiso: any;
  sinData: boolean = false;

  totalesDepto: { costo: number; cantidad: number } = { costo: 0, cantidad: 0 };
  totalesEtapa: { costo: number; cantidad: number } = { costo: 0, cantidad: 0 };

  dtsDeptoEtapasSF: any[] = [];
  seriesBarEtapaSF: any[] = [];
  // dtsFeriados:any[]=[];

  constructor(
    private _sgp: SgpService,
    private toastr: ToastrService,
    private _fun: FuncionesComponent
  ) {
    this.titulosBarDep = {
      central: "Compromisos por departamento",
      vertical: "Compromisos",
      horizontal: "Departamentos",
    };
    this.titulosDeptoEtapas = {
      central: "Compromisos por departamento y por etapa",
      vertical: "Compromisos",
      horizontal: "Etapas",
    };
  }

  ngOnInit() {}

  ngOnChanges() {
    this.dtsFiltrado = null;
    this.dtsDetallado = null;
    this.dtsAgrupadoDepartamento = [];
    this.etapas = [];
    this.seriesBarEtapa = [];
    this.alto = 350;
    // this.cargarFeridos(); //llamar a cargar Feriados previamente para tener listo el dtsFeriados incrementaFechaSF
    this.cargarCompromisosPeriodos("T");
    this.obtenerEtapasTipo("T");
    let nfasync = "";
    this._fun
      .incrementaFechaAsync(
        "FECHA_FIN",
        new Date("2022-06-15 00:00:00"),
        new Date(),
        3
      )
      .then((r) => (nfasync = r.toString()))
      .then((n) => console.log(n));
    this._fun
      .incrementaFechaAsync(
        "DIAS_HABILES",
        new Date("2022-06-15 00:00:00"),
        new Date(),
        3
      )
      .then((r) => console.log(r + "dias"));
    // setTimeout(() => {//para usar incrementaFechaSF
    // // const nf = this._fun.incrementaFechaSF(new Date('2022-06-15 00:00:00'),3,this.dtsFeriados)
    //   console.log('incrementoSF',nf,nfasync)
    // }, 200);
  }

  // cargarFeridos(){//obtner Fechas desde DB y usar incrementaFechaSF sin async
  //   this._sgp.feriados().subscribe(
  //     (result: any) => {
  //       this.dtsFeriados = result;
  //     },
  //     (error) => console.log('Error al obtnere feriados, ',error.toString())
  //   );
  // }

  cargarCompromisosPeriodos(tipo: string) {
    this._sgp
      .compromisosPeriodo({
        fechaIni: this.fechaIni,
        fechaFin: moment(this.fechaFin).add(1, "days").format("yyyyMMDD"),
        tipo,
      })
      .subscribe(
        (result: any) => {
          result.map((e) => {
            e.costo_proyecto = Number(e.costo_proyecto);
            e.costo_por_beneficiario = Number(e.costo_por_beneficiario);
            return e;
          });
          console.log("monitoreo periodos1", result);
          if (result.length > 0) {
            this.dtsCompromisos = result;
            this.armarGrid(result);
            this.armarSeries(result);
            this.colores = alasql(
              "select  distinct  orden,color  from ? where color is not null order by 1",
              [result]
            ).map((e) => e.color);
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
    this._sgp.etapasTipo({ tipo, idCompromiso: 0 }).subscribe(
      (result: any) => {
        console.log("todas las etapas " + tipo, result);
        this.allEtapas = result;
      },
      (error) =>
        this.toastr.error(error.toString(), "Error desde el servidor", {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        })
    );
  }

  reinicarChart() {
    this.seriesBarEtapa = [];
    this.alto = 350;
  }

  recibeMensaje(data: any, tipo: string) {
    console.log("recibiendo mensaje de chart", data, tipo);
    if (tipo == "bardep") {
      const depto = this.seriesBarDep[data.s].name;
      // const pivot = this.dtsCompromisos.filter(f=>f.departamento == depto);
      let modelo = [];
      this.dtsDeptoEtapas.forEach((e) => {
        modelo.push({
          name: e.name,
          data: [e.data[data.s]], //aca esta filtrando la serie del depto
          monto: e.monto,
          orden: e.orden,
        });
      });
      this.seriesBarEtapa = modelo;
      let modeloSF = [];
      this.dtsDeptoEtapasSF.forEach((e) => {
        modeloSF.push({
          name: e.name,
          data: [e.data[data.s]], //aca esta filtrando la serie del depto
          monto: e.monto,
        });
      });
      this.seriesBarEtapaSF = modeloSF;
      this.alto = 360;
      // const total = this.seriesBarDep[data.s].data[0]
      console.log("montos", this.seriesBarEtapa);

      this.totalesEtapa.costo = this.seriesBarEtapa.reduce(
        (ac, el) => ac + Number(el.monto),
        0
      );
      this.totalesEtapa.cantidad = this.seriesBarEtapa.reduce(
        (ac, el) => ac + el.data[0],
        0
      );

      this.titulosDeptoEtapas.central = `Compromisos por etapas:  ${depto} (${
        this.seriesBarDep[data.s].data[0]
      })`;
      this.periodosBarEtapa = [depto];

      setTimeout(() => {
        const obj = document.getElementById("barEtapas");
        obj.scrollIntoView({ block: "start", behavior: "smooth" });
      }, 300);
    }
    if (tipo == "baretapa") {
    }
  }

  armarGrid(dts: any[]) {
    console.log("ENTRA A ARMAR GRID====>");
    this.dtsGrid = [];
    this.dtsAgrupadoMunicipio = [];
    this.maxEtapas = dts.reduce(
      (ac, el) => (ac > el.orden ? ac : (ac = el.orden)),
      0
    );
    console.log("las max etapas", this.maxEtapas);

    const pivot = alasql(
      `select departamento,municipio,orden,count(*)cantidad,sum(costo_proyecto)monto from ?
    group by departamento,municipio,orden order by departamento,municipio`,
      [dts]
    );

    let modelo;
    let totalMun = 0;
    pivot.forEach((e, i) => {
      if (i == 0) {
        modelo = {
          departamento: e.departamento,
          municipio: e.municipio,
          ["etapa" + e.orden]: e.cantidad,
          ["monto" + e.orden]: e.monto,
        };
        totalMun = e.cantidad;
        // console.log("primera vez", e, modelo);
      }
      if (modelo.municipio !== e.municipio && i > 0) {
        modelo.total = totalMun;
        this.dtsAgrupadoMunicipio.push(modelo);
        modelo = {
          departamento: e.departamento,
          municipio: e.municipio,
          ["etapa" + e.orden]: e.cantidad,
          ["monto" + e.orden]: e.monto,
        };
        totalMun = e.cantidad;
        // console.log("cambiar de reg", e, modelo);
      } else {
        if (modelo.municipio === e.municipio && i > 0) {
          modelo["etapa" + e.orden] = e.cantidad;
          modelo["monto" + e.orden] = e.monto;
          totalMun += e.cantidad;
          // console.log("agrega etapa", e, modelo);
        }
      }
      if (i === pivot.length - 1) {
        modelo.total = totalMun;
        this.dtsAgrupadoMunicipio.push(modelo);
      }
    });
    // console.log('al final',this.dtsAgrupadoMunicipio,pivot,this.dtsGrid,compromisos);
    for (let i = 0; i < this.maxEtapas; i++) {
      if (dts.filter((f) => f.orden == i + 1)[0]) {
        const nombre = dts.filter((f) => f.orden == i + 1)[0].etapa;
        this.etapas.push({ orden: i + 1, nombre });
        console.log("ETAPAS", this.etapas);
      }
    }

    const pivotDep = alasql(
      `select departamento,orden,count(*)cantidad,sum(costo_proyecto)monto from ?
    group by departamento,orden order by departamento`,
      [dts]
    );
    let modeloDep;
    let totalDep = 0;
    pivotDep.forEach((e, i) => {
      if (i == 0) {
        modeloDep = {
          departamento: e.departamento,
          ["etapa" + e.orden]: e.cantidad,
          ["monto" + e.orden]: e.monto,
        };
        totalDep = e.cantidad;
      }
      if (modeloDep.departamento !== e.departamento && i > 0) {
        modeloDep.total = totalDep;
        this.dtsAgrupadoDepartamento.push(modeloDep);
        modeloDep = {
          departamento: e.departamento,
          ["etapa" + e.orden]: e.cantidad,
          ["monto" + e.orden]: e.monto,
        };
        totalDep = e.cantidad;
      } else {
        if (modeloDep.departamento === e.departamento && i > 0) {
          modeloDep["etapa" + e.orden] = e.cantidad;
          modeloDep["monto" + e.orden] = e.monto;
          totalDep += e.cantidad;
        }
      }
      if (i === pivotDep.length - 1) {
        modeloDep.total = totalDep;
        this.dtsAgrupadoDepartamento.push(modeloDep);
      }
    });
    // console.log('por depa',this.dtsAgrupadoDepartamento);
  }

  armarSeries(dts: any[]) {
    this.titulosBarDep = {
      central: `Compromisos Presidenciales (${dts.length})`,
      vertical: "Compromisos",
      horizontal: "Departamentos",
    };
    // const previa = alasql('select fid_compromiso,departamento from ? group by fid_compromiso,departamento',[dts]);
    const porDep = alasql(
      "select departamento, count(*) cantidad ,sum(cast(costo_proyecto as double)) monto from ? group by departamento order by departamento",
      [dts]
    );
    const porArea = alasql(
      "select area, count(*) cantidad ,sum(cast(costo_proyecto as double)) monto from ? group by area order by area",
      [dts]
    );
    const porFinanciamiento = alasql(
      "select tipo_financiamiento, count(*) cantidad ,sum(cast(costo_proyecto as double)) monto from ? group by tipo_financiamiento order by tipo_financiamiento",
      [dts]
    );
    let modDep = [];
    let modArea = [];
    let modFinanciamiento = [];
    porDep.forEach((e) => {
      modDep.push({
        name: e.departamento,
        data: [e.cantidad],
        monto: e.monto,
      });
    });
    porArea.forEach((e) => {
      modArea.push({
        name: e.area,
        data: [e.cantidad],
        monto: e.monto,
      });
    });
    porFinanciamiento.forEach((e) => {
      modFinanciamiento.push({
        name: e.tipo_financiamiento,
        data: [e.cantidad],
        monto: e.monto,
      });
    });
    this.seriesBarDep = modDep;
    this.seriesArea = modArea;
    this.seriesFinanciamiento = modFinanciamiento;
    this.periodosBarDep = [
      "Compromisos entre " +
        moment(this.fechaIni).format("DD/MM/yyyy") +
        " al " +
        moment(this.fechaFin).format("DD/MM/yyyy"),
    ];
    //para BarEtapas
    // const pivotEtapa = alasql(`select fid_compromiso,departamento,tipo_financiamiento, max(orden)max_orden, count(*) cantidad
    // from ? group by fid_compromiso,departamento,tipo_financiamiento`,[dts]);
    const porEtapaDep = alasql(
      `select departamento,tipo_financiamiento, orden,etapa, count(*)cantidad , sum(costo_proyecto) monto
    from ? group by departamento,tipo_financiamiento,orden,etapa order by departamento`,
      [dts]
    );
    const porEtapaDepSF = alasql(
      `select departamento, orden,etapa, count(*)cantidad , sum(costo_proyecto) monto
    from ? group by departamento,orden,etapa order by departamento`,
      [dts]
    );
    // console.log('poretapas',porEtapaDep,this.allEtapas,this.seriesBarDep);
    let armado = [];
    armado = alasql(
      "select distinct orden,etapa,tipo_financiamiento from ? order by orden,etapa,tipo_financiamiento",
      [porEtapaDep]
    );
    const pivot = alasql(
      "select distinct departamento from ? order by departamento",
      [dts]
    );
    // console.log('ahora si',porEtapaDep,armado,pivot);

    const series = [];
    armado.forEach((e) => {
      let modelo = {
        name: e.etapa + " - " + e.tipo_financiamiento,
        data: [],
        monto: 0,
        orden: e.orden,
      };
      pivot.forEach((d) => {
        const reg = porEtapaDep.filter(
          (f) =>
            f.departamento == d.departamento &&
            f.tipo_financiamiento == e.tipo_financiamiento &&
            f.etapa == e.etapa
        )[0];
        if (reg) {
          modelo.data.push(reg.cantidad);
          modelo.monto = reg.monto;
          modelo.orden = reg.orden;
        } else {
          modelo.data.push(0);
          modelo.monto = 0;
        }
      });
      if (!modelo.name.startsWith("null")) series.push(modelo);
      // console.log('por pasos',modelo);
    });
    // this.seriesBarEtapa = series;
    this.dtsDeptoEtapas = series;
    this.periodosBarEtapa = pivot.map((e) => e.departamento);
    // console.log('por etapas',this.seriesBarEtapa,this.periodosBarEtapa,porEtapaDep);
    this.totalesDepto.costo = this.seriesBarDep.reduce(
      (ac, el) => ac + Number(el.monto),
      0
    );
    this.totalesDepto.cantidad = this.seriesBarDep.reduce(
      (ac, el) => ac + el.data[0],
      0
    );

    //para agrupar por solo etapas, sin financiamiento
    const seriesSF = [];
    const armadoSF = alasql(
      "select distinct orden,etapa from ? order by orden,etapa",
      [porEtapaDepSF]
    );

    armadoSF.forEach((e) => {
      let modeloSF = {
        name: e.etapa,
        data: [],
        monto: 0,
        orden: e.orden,
      };
      pivot.forEach((d) => {
        const reg = porEtapaDepSF.filter(
          (f) => f.departamento == d.departamento && f.etapa == e.etapa
        )[0];
        if (reg) {
          modeloSF.data.push(reg.cantidad);
          modeloSF.monto = reg.monto;
          modeloSF.orden = reg.orden;
        } else {
          modeloSF.data.push(0);
          modeloSF.monto = 0;
          modeloSF.orden = 0;
        }
      });
      if (modeloSF.name) seriesSF.push(modeloSF);
      // console.log('por pasos',modelo);
    });
    this.dtsDeptoEtapasSF = seriesSF;
    setTimeout(() => {
      this.colorearDepartaemntos();
    }, 100);
  }

  colorearDepartaemntos() {
    const departamentos = alasql(
      "select distinct departamento from ? order by departamento",
      [this.dtsCompromisos]
    );
    departamentos.forEach((d, i) => {
      const obj = document.getElementById(`dep${i + 1}`);
      obj.style.backgroundColor = this.coloresDeptos[i];
      obj.style.color = "whitesmoke";
    });
  }

  desglosar(valor: any, tipo: string) {
    console.log("desglose", valor, tipo);
    this.elCompromiso = null;
    if (tipo == "d") {
      this.dtsDetallado = null;
      if (this.dtsFiltrado)
        if (this.dtsFiltrado[0].departamento == valor.departamento) {
          this.dtsFiltrado = [];
          return true;
        }
      this.dtsFiltrado = this.dtsAgrupadoMunicipio
        .filter((f) => f.departamento == valor.departamento)
        .sort((a, b) => a.municipio - b.municipio);
    }
    if (tipo == "md") {
      this.dtsFiltrado = null;
      this.dtsDetallado = null;
      // if(this.dtsFiltrado) if(this.dtsFiltrado[0].departamento == valor.departamento){
      //   this.dtsFiltrado = [];
      //   return true;
      // }
      // this.dtsFiltrado = this.dtsAgrupadoMunicipio.filter(f=>f.departamento == valor.departamento).sort((a,b)=>a.municipio - b.municipio);
    }
    if (tipo == "m") {
      this.dtsDetallado = null;
      this.tituloGrillaDetalle = `Compromisos del municipio de ${valor.municipio}, departamento de ${valor.departamento}`;
      setTimeout(() => {
        this.dtsDetallado = this.dtsCompromisos.filter(
          (f) =>
            f.municipio == valor.municipio &&
            f.departamento == valor.departamento
        );
        this.prepararTabla();
      }, 200);
      // .sort((a,b)=>{
      //   if(a.nombreproyecto === b.nombreproyecto){
      //     return a.orden- b.orden
      //   }else{
      //     return a.municipio - b.municipio
      //   }
      // })
      // console.log('detalle',this.dtsDetallado);
    }
    if (tipo == "e") {
      this.dtsDetallado = this.dtsCompromisos
        .filter(
          (f) =>
            f.municipio == valor.municipio &&
            f.departamento == valor.departamento
        )
        .sort((a, b) => {
          if (a.nombreproyecto === b.nombreproyecto) {
            return (
              new Date(a.fecha_inicio).getTime() -
              new Date(b.fecha_inicio).getTime()
            );
          } else {
            return a.nombreproyecto - b.nombreproyecto;
          }
        });
      // const pre = this.dtsCompromisos.filter(f=>f.municipio == valor.municipio && f.departamento == valor.departamento).sort((a,b)=>a.nombreproyecto - b.nombreproyecto)
      // this.dtsDetallado = pre.sort((a,b)=> Number(a.fecha_inicio)- Number(b.fecha_inicio))
    }
    if (tipo.startsWith("etapa")) {
      this.dtsFiltrado = null;
      this.dtsDetallado = null;
      // console.log('desglose etapa',this.dtsCompromisos,valor,tipo);
      this.tituloGrillaDetalle = `Compromisos de ${
        valor.departamento
      } en Etapa ${tipo.substring(5)}: ${
        this.allEtapas.filter((f) => f.orden == tipo.substring(5))[0].etapa
      }`;
      // console.log('entrando',valor.departamento,tipo.substring(5));
      setTimeout(() => {
        this.dtsDetallado = this.dtsCompromisos.filter(
          (f) =>
            f.departamento == valor.departamento && f.orden == tipo.substring(5)
        );
        if (valor.municipio) {
          this.dtsDetallado = this.dtsDetallado.filter(
            (f) => f.municipio == valor.municipio
          );
          this.tituloGrillaDetalle = this.tituloGrillaDetalle.replace(
            `Compromisos de`,
            `Compromisos del municipio de ${valor.municipio}, departamento de `
          );
        }
        this.prepararTabla();
      }, 200);
      // .sort((a,b)=>{
      //   if(a.nombreproyecto === b.nombreproyecto){
      //     return new Date(a.fecha_inicio).getTime()- new Date(b.fecha_inicio).getTime()
      //   }else{
      //     return a.nombreproyecto - b.nombreproyecto
      //   }
      // });
    }
  }

  prepararTabla() {
    this._fun.limpiatabla(".dt-detalle");
    setTimeout(() => {
      let confiTable = this._fun.CONFIGURACION_TABLA_V6(
        [50, 100, 150, 200],
        false,
        10,
        [0, "asc"]
      );
      if (!$.fn.dataTable.isDataTable(".dt-detalle")) {
        var table = $(".dt-detalle").DataTable(confiTable);
        this._fun.inputTable(table, [0, 5, 8, 9, 11]);
        this._fun.selectTable(table, [1, 2, 3, 6, 7, 10]);
      }
      const obj = document.getElementById("tablaDetalle");
      obj.scrollIntoView({ block: "start", behavior: "smooth" });
    }, 100);
  }

  cargarEtapas(compromiso: any) {
    console.log("cargando compromiso etapas", compromiso);
    this.dtsDetallado = null;
    compromiso.id_compromiso = compromiso.fid_compromiso;
    this.elCompromiso = compromiso;
    setTimeout(() => {
      const obj = document.getElementById("monitoreoEtapas");
      obj.scrollIntoView({ block: "start", behavior: "smooth" });
    }, 300);
  }
}
