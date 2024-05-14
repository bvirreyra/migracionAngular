import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Inputmask from "inputmask";
import { Globals } from "../../../global";
/*servicios*/
import { AlmacenesService } from "../../almacenes/almacenes.service";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { SiptaService } from "../../sipta/sipta.service";

import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-entradassalidas",
  templateUrl: "./entradassalidas.component.html",
  styleUrls: ["./entradassalidas.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SiptaService,
    AlmacenesService,
  ],
})
export class EntradassalidasComponent implements OnInit {
  public mask_numerodecimal: any;
  public mask_fecha: any;
  public mask_numero: any;
  public mask_gestion: any;

  public m_fechafin: any;

  //variables para el compononete de mensajes
  public prop_msg: string;
  public prop_tipomsg: string;

  //variables de session y iniciales
  public s_idcon: string;
  public s_idmod: string;
  public s_idrol: number;
  public s_user: string;
  public s_nomuser: string;

  public url: string;
  public urlApi: string;
  public errorMessage: string;
  public fechasrv: string;

  public dtsDatosConexion: any;
  public dtsFechaSrv: any;
  public dtsFechaLiteral: any;
  public dtsHoraSrv: any;
  public dtsAnio: any;
  public s_imgLogo: any;

  //

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _sipta: SiptaService,
    private _almacenes: AlmacenesService,
    private globals: Globals,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent,
    private datePipe: DatePipe,
    private base64: ImgBase64Globals
  ) {
    this._route.parent.params.subscribe((parametros) => {
      this.s_idcon = parametros["idcon"];
      this.s_idmod = parametros["idmod"];
    });
    this.url = globals.rutaSrvFronEnd;
    this.s_imgLogo = base64.logocabecera;
  }

  ngOnInit() {
    function falloCallback(error) {
      console.log("Falló con " + error);
    }
    this.mask_numerodecimal = new Inputmask("9.9{1,2}");
    this.mask_fecha = new Inputmask("9{1,2}/9{1,2}/9{1,4}");
    this.mask_numero = new Inputmask("9{1,9}");
    this.mask_gestion = new Inputmask("9999");

    this.cargarmascaras();
    this.DatosConexion()
      .then((dts1) => {
        this.dtsDatosConexion = dts1;
        //console.log(this.dtsDatosConexion);
        return this.FechaServidor();
      })
      .then((dts2) => {
        this.dtsFechaSrv = dts2[0]["fechasrv"];
        this.dtsHoraSrv = this.transformHora(this.dtsFechaSrv);
        //console.log(this.m_gestion);
        return this.FechaLiteral(dts2[0]["fechasrv"]);
      })
      .then((dts3) => {
        this.dtsFechaLiteral = dts3;
      })
      .catch(falloCallback);
  }
  cargarmascaras() {
    var montodesembolsoparcial = document.getElementById(
      "montodesembolsoparcial"
    );
    this.mask_numerodecimal.mask(montodesembolsoparcial);
  }
  /*******************************************************************************/
  /*DATOS INICIALES
  /*******************************************************************************/
  DatosConexion() {
    return new Promise((resolve, reject) => {
      this._autenticacion
        .getdatosconexion(this.s_idcon, this.s_idmod)
        .subscribe(
          (result: any) => {
            if (Array.isArray(result) && result.length > 0) {
              if (result[0]["IDROL"] != "") {
                this.s_idrol = result[0]["_idrol"];
                this.s_user = result[0]["_usu_user"];
                this.s_nomuser = result[0]["_usu_nom_com"];
                resolve(result);
                return result;
              }
            } else {
              this.prop_msg =
                "Error: La conexion no es valida, contáctese con el área de sistemas";
              this.prop_tipomsg = "danger";
              this._msg.formateoMensaje("modal_danger", this.prop_msg);
              reject(this.prop_msg);
            }
          },
          (error) => {
            this.errorMessage = <any>error;
            if (this.errorMessage != null) {
              console.log(this.errorMessage);
              this.prop_msg =
                "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
              this.prop_tipomsg = "danger";
              this._msg.formateoMensaje("modal_danger", this.prop_msg);
            }
            reject(this.prop_msg);
          }
        );
    });
  }
  FechaServidor() {
    return new Promise((resolve, reject) => {
      this._autenticacion.getfechaservidor().subscribe(
        (result: any) => {
          if (result[0]["fechasrv"] != "") {
            resolve(result);
            return result;
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos ";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  transformHora(date) {
    return this.datePipe.transform(date, "HH:mm:ss");
    //whatever format you need.
  }
  transformAnio(date) {
    return this.datePipe.transform(date, "YYYY");
    //whatever format you need.
  }
  HoraServidor() {
    return new Promise((resolve, reject) => {
      this._autenticacion.gethoraservidor().subscribe(
        (result: any) => {
          if (result[0]["HORA"] != "") {
            var hora = this.transformHora(result[0]["HORA"]);
            resolve(hora);
            return hora;
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos ";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
            reject(this.prop_msg);
          }
        }
      );
    });
  }

  FechaLiteral(f) {
    return this._fun.FechaLiteral(f);
  }
  BuscarFecha() {
    this._almacenes
      .getListaResumenInventarioFisicoValorado(this.m_fechafin)
      .subscribe(
        (result: any) => {
          if (result.length > 0) {
            this.rpt_inventariofisicovalorado(result);
            console.log(result);
          } else {
            alert("No se encuentran registros con el criterio de busqueda");
            this.prop_msg =
              "Info: No se encuentran registros con el criterio de busqueda ";
            this.prop_tipomsg = "info";
            this._msg.formateoMensaje("modal_info", this.prop_msg);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            console.log(this.errorMessage);
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos ";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        }
      );
  }
  rpt_inventariofisicovalorado(datos: any) {
    let total_saldos = 0;
    let total_saldosvalor = 0;
    let total_ingresos = 0;
    let total_ingresosvalor = 0;
    let total_salida = 0;
    let total_salidavalor = 0;
    let total_saldoexistente = 0;
    let total_costounitario = 0;
    let total_saldobs = 0;

    let doc = new jsPDF("p", "mm", "letter");
    //let doc = new jsPDF('L', 'mm', 'letter');
    var dts = datos;
    var interlineado = 20;
    var margenleft = 10;
    doc.text(
      margenleft + 40,
      interlineado,
      "RESUMEN - INVENTARIO FÍSICO VALORADO"
    );
    interlineado = interlineado + 5;
    doc.text(margenleft + 80, interlineado, "AL " + this.m_fechafin);
    interlineado = interlineado + 5;
    let cabecera = [
      { title: "CODIGO", dataKey: "cod_material" },
      { title: "DESCRIPCION", dataKey: "description" },
      { title: "SALDO INICIAL Q", dataKey: "cantidad" },
      { title: "INGRESO", dataKey: "nueva_entrada" },
      { title: "SALIDAS", dataKey: "cantidad_salida" },
      { title: "SALDO EXISTENTE", dataKey: "saldo_existente" },
      { title: "SALDO INICIAL EN BS.", dataKey: "valor_inicial" },
      { title: "INGRESO EN BS.", dataKey: "valor_entrada" },
      { title: "SALIDA EN BS.", dataKey: "valor_salida" },
      { title: "SALDO BS.", dataKey: "saldo_bs" },
    ];
    let detalle = [];
    dts.forEach((registro) => {
      let row = {
        cod_material: registro.cod_material,
        description: registro.description.trim(),
        cantidad: registro.cantidad.toLocaleString("de-DE"),
        nueva_entrada: registro.nueva_entrada.toLocaleString("de-DE"),
        cantidad_salida: registro.cantidad_salida.toLocaleString("de-DE"),
        saldo_existente: registro.saldo_existente.toLocaleString("de-DE"),
        valor_inicial: registro.valor_inicial.toLocaleString("de-DE", {
          style: "decimal",
          decimal: "2",
          minimumFractionDigits: 2,
        }),
        valor_entrada: registro.valor_entrada.toLocaleString("de-DE", {
          style: "decimal",
          decimal: "2",
          minimumFractionDigits: 2,
        }),
        valor_salida: registro.valor_salida.toLocaleString("de-DE", {
          style: "decimal",
          decimal: "2",
          minimumFractionDigits: 2,
        }),
        saldo_bs: registro.saldo_bs.toLocaleString("de-DE", {
          style: "decimal",
          decimal: "2",
          minimumFractionDigits: 2,
        }),
      };

      total_saldos = total_saldos + registro.cantidad;
      total_saldosvalor = total_saldosvalor + registro.valor_inicial;
      total_ingresos = total_ingresos + registro.nueva_entrada;
      total_ingresosvalor = total_ingresosvalor + registro.valor_entrada;
      total_salida = total_salida + registro.cantidad_salida;
      total_salidavalor = total_salidavalor + registro.valor_salida;
      total_saldoexistente = total_saldoexistente + registro.saldo_existente;
      total_costounitario = total_costounitario + registro.costo_unitario;
      total_saldobs = total_saldobs + registro.saldo_bs;

      detalle.push(row);
    });

    let row2 = {
      cod_articulo: "",
      description: "TOTALES",
      cantidad: total_saldos.toLocaleString("de-DE", { style: "decimal" }),
      nueva_entrada: total_ingresos.toLocaleString("de-DE", {
        style: "decimal",
      }),
      cantidad_salida: total_salida.toLocaleString("de-DE", {
        style: "decimal",
      }),
      saldo_existente: total_saldoexistente.toLocaleString("de-DE", {
        style: "decimal",
      }),
      valor_inicial: total_saldosvalor.toLocaleString("de-DE", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      valor_entrada: total_ingresosvalor.toLocaleString("de-DE", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      valor_salida: total_salidavalor.toLocaleString("de-DE", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      costo_unitario: "",
      saldo_bs: total_saldobs.toLocaleString("de-DE", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    };
    detalle.push(row2);

    doc.autoTable(cabecera, detalle, {
      //Propiedades
      margin: { horizontal: 30, top: interlineado + 10 },
      tableWidth: "wrap",
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.1,
      lineColor: [0, 0, 0],
      //Estilos
      headerStyles: {
        valign: "middle",
        halign: "center",
        fillColor: [230, 230, 230],
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        textColor: 0,
      },
      bodyStyles: {
        valign: "middle",
        halign: "center",
        fillColor: [255, 255, 255],
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
      },
      styles: { overflow: "linebreak", columnWidth: "wrap", fontSize: 6 },
      columnStyles: {
        cod_articulo: { columnWidth: 15, halign: "right" },
        descripcion: { columnWidth: 60, halign: "right" },
        cantidad: { columnWidth: 13, halign: "right" },
        nueva_entrada: { columnWidth: 13, halign: "right" },
        cantidad_salida: { columnWidth: 13, halign: "right" },
        saldo_existente: { columnWidth: 15, halign: "right" },

        valor_inicial: { columnWidth: 15, halign: "right" },
        valor_entrada: { columnWidth: 15, halign: "right" },
        valor_salida: { columnWidth: 15, halign: "right" },
        costo_unitario: { columnWidth: 15, halign: "right" },
        saldo_bs: { columnWidth: 15, halign: "right" },
      },
    });
    let tabla = doc.autoTable.previous;
    doc.setFontStyle("normal");
    doc.setFont("helvetica");

    this._fun.insertapiepagina(
      doc,
      this.dtsFechaSrv,
      this.dtsHoraSrv,
      this.s_user
    );
    doc.save("rptResumenInventarioFisicoValorado.pdf");
  }
}
