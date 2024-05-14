import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Globals } from "../../global";

import { Workbook } from "exceljs";
import * as fs from "file-saver";

var varsession = "";

@Injectable()
export class MonitoreoService {
  public url: string;
  userName: string;
  loggeIn: boolean;
  private _workbook: Workbook;

  constructor(private _http: HttpClient, private globals: Globals) {
    this.url = globals.rutaSrvBackEnd;
  }
  listaReportes(dts) {
    return this._http.get(this.url + "17_listaReportes", { params: dts });
  }
  listaReporteExcel(dts) {
    //return this._http.get(this.url + '17_listaReporteExcel',{responseType:ResponseContentType.Blob,params: dts});
    return this._http.get(this.url + "17_listaReporteExcel");
  }
  listaMonitoreoSeguimiento(dts) {
    return this._http.get(this.url + "17_listaMonitoreoSeguimiento", {
      params: dts,
    });
  }

  descargaExcel(dataExcel, tiporeporte, titulo) {
    this._workbook = new Workbook(); // inicializando la variable
    this._workbook.creator = "UPRE"; // modificacion de la meta data del archivo excel QUIEN FUE EL CREADOR
    if (tiporeporte == "SEGUIMIENTO") {
      this.reporteMonitoreoSeguimiento(dataExcel, titulo);
    }
    if (tiporeporte == "SOLICITUD") {
      this.reporteMonitoreoSolicitud(dataExcel, titulo);
    }

    // para descargar el archivo

    this._workbook.xlsx.writeBuffer().then((data) => {
      // const blob = new Blob([data]);
      // fs.saveAs(blob, "reporte.xlsx");
      const fileURL = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", 'reporte.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(fileURL);
    });
  }
  reporteMonitoreoSeguimiento(dts, titulo) {
    const sheet = this._workbook.addWorksheet("RTP_1"); // AÑADIENDO UNA HOJA DE CALCULO
    // ESTABLECIENDO EL ANCHO Y ESTILO DE LAS COLUMNAS
    sheet.getColumn("A").width = 6;
    sheet.getColumn("B").width = 12;
    sheet.getColumn("C").width = 30;
    sheet.getColumn("D").width = 25;
    sheet.getColumn("E").width = 80;

    //ALINENADO TEXTO
    sheet.columns.forEach((column) => {
      column.style.alignment = { vertical: "top", wrapText: true };
    });
    // AGREGANDO UN TITULO}
    sheet.mergeCells("A2:E2");
    sheet.mergeCells("A3:E3");
    const titleCell = sheet.getCell("E2");
    const title2Cell = sheet.getCell("E3");
    titleCell.style.font = { bold: true, size: 14 };
    titleCell.style.alignment = { horizontal: "center" };
    title2Cell.style.alignment = { horizontal: "center" };
    title2Cell.style.font = { bold: true, size: 14 };
    sheet.getRow(2).height = 40;
    titleCell.value = "DATOS AUSENTES MODULO SEGUIMIENTO";
    title2Cell.value = titulo;

    // CREANDO LOS TITULOS PAR LA CABECERA
    const headerRow = sheet.getRow(5);
    //estamos jalando todas las columans de esa fila
    headerRow.values = [
      "NRO", //COLUMNA A
      "CODIGO", // COLUMNA B
      "DEPARTAMENTO", // COLUMNA C
      "MUNICIPIO", // COLUMNA D
      "NOMBRE DE PROYECTO", // COLUMNA E
    ];

    headerRow.font = { bold: true, size: 12 };
    var col = ["A", "B", "C", "D", "E"];
    col.forEach((d, i) => {
      var c = d + "5";
      sheet.getCell(c).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      sheet.getCell(c).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "54a4f0" },
      };
    });

    var fila = 6;
    //INSERTAR REGISTROS
    dts.forEach((element, i) => {
      var f = i + fila;
      var row = sheet.getRow(f);
      row.height = 40;
      var col = ["A", "B", "C", "D", "E"];

      var rowValues = [];
      rowValues[0] = i + 1;
      rowValues[1] = element.fid_sgp;
      rowValues[2] = element.departamento;
      rowValues[3] = element.municipio;
      rowValues[4] =
        element.nombreproyecto == null
          ? element.nombre_proyecto_financiera
          : element.nombreproyecto;
      row.values = rowValues;

      col.forEach((d, i) => {
        var c = d + f;
        console.log("columnas", c);
        sheet.getCell(c).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });
  }
  reporteMonitoreoSolicitud(dts, titulo) {
    const sheet = this._workbook.addWorksheet("RTP_1"); // AÑADIENDO UNA HOJA DE CALCULO
    // ESTABLECIENDO EL ANCHO Y ESTILO DE LAS COLUMNAS
    sheet.getColumn("A").width = 6;
    sheet.getColumn("B").width = 12;
    sheet.getColumn("C").width = 30;
    sheet.getColumn("D").width = 25;
    sheet.getColumn("E").width = 80;

    //ALINENADO TEXTO
    sheet.columns.forEach((column) => {
      column.style.alignment = { vertical: "top", wrapText: true };
    });
    // AGREGANDO UN TITULO}
    sheet.mergeCells("A2:E2");
    sheet.mergeCells("A3:E3");
    const titleCell = sheet.getCell("E2");
    const title2Cell = sheet.getCell("E3");
    titleCell.style.font = { bold: true, size: 14 };
    titleCell.style.alignment = { horizontal: "center" };
    title2Cell.style.alignment = { horizontal: "center" };
    title2Cell.style.font = { bold: true, size: 14 };
    sheet.getRow(2).height = 40;
    titleCell.value = "DATOS AUSENTES MODULO SOLICITUD";
    title2Cell.value = titulo;

    // CREANDO LOS TITULOS PAR LA CABECERA
    const headerRow = sheet.getRow(5);
    //estamos jalando todas las columans de esa fila
    headerRow.values = [
      "NRO", //COLUMNA A
      "CODIGO", // COLUMNA B
      "DEPARTAMENTO", // COLUMNA C
      "MUNICIPIO", // COLUMNA D
      "NOMBRE DE PROYECTO", // COLUMNA E
    ];

    headerRow.font = { bold: true, size: 12 };
    var col = ["A", "B", "C", "D", "E"];
    col.forEach((d, i) => {
      var c = d + "5";
      sheet.getCell(c).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      sheet.getCell(c).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "54a4f0" },
      };
    });

    var fila = 6;
    //INSERTAR REGISTROS
    dts.forEach((element, i) => {
      var f = i + fila;
      var row = sheet.getRow(f);
      row.height = 40;
      var col = ["A", "B", "C", "D", "E"];

      var rowValues = [];
      rowValues[0] = i + 1;
      rowValues[1] = element.codigo;
      rowValues[2] = element.departamento;
      rowValues[3] = element.municipio;
      rowValues[4] = element.nombreproyecto;
      row.values = rowValues;

      col.forEach((d, i) => {
        var c = d + f;
        console.log("columnas", c);
        sheet.getCell(c).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });
  }
}
