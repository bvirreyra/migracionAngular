import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Globals } from "../../../global";

import { ImgBase64Globals } from "@imagen64/img_reportes";
import { Workbook } from "exceljs";
import * as fs from "file-saver";

var varsession = "";

@Injectable()
export class ContinuidadService {
  public url: string;
  userName: string;
  loggeIn: boolean;
  private _workbook: Workbook;

  public s_imgLogo: string;

  constructor(
    private _http: HttpClient,
    private globals: Globals,
    private base64: ImgBase64Globals
  ) {
    this.url = globals.rutaSrvBackEnd;
    this.s_imgLogo = base64.LogoUpre;
  }

  descargaExcel(dataExcel, tiporeporte, titulo) {
    this._workbook = new Workbook(); // inicializando la variable
    this._workbook.creator = "DigiDev"; // modificacion de la meta data del archivo excel QUIEN FUE EL CREADOR
    if (tiporeporte == "PARA_ENTREGA") {
      this.reporteProyectosParaEntrega(dataExcel, titulo);
    }
    // para descargar el archivo
    this._workbook.xlsx.writeBuffer().then(async (data) => {
      // const blob = new Blob([data]);
      // fs.saveAs(blob, "reporte.xlsx");

      // const fileURL = window.URL.createObjectURL(new Blob([data],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
      // window.location.href = fileURL;
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
  reporteProyectosParaEntrega(dts, titulo) {
    const sheet = this._workbook.addWorksheet("RTP_1"); // AÑADIENDO UNA HOJA DE CALCULO
    // INSERTANDO EL LOGO
    var myBase64Image = this.s_imgLogo;
    var logo = this._workbook.addImage({
      base64: myBase64Image,
      extension: "png",
    });
    sheet.addImage(logo, "A1:B2");

    // ESTABLECIENDO EL ANCHO Y ESTILO DE LAS COLUMNAS
    sheet.getColumn("A").width = 6;
    sheet.getColumn("B").width = 30;
    sheet.getColumn("C").width = 20;
    sheet.getColumn("D").width = 30;
    sheet.getColumn("E").width = 30;
    sheet.getColumn("F").width = 20;
    sheet.getColumn("G").width = 20;
    sheet.getColumn("H").width = 20;
    sheet.getColumn("I").width = 20;
    sheet.getColumn("J").width = 20;
    sheet.getColumn("K").width = 20;
    sheet.getColumn("L").width = 20;

    //ALINENADO TEXTO
    sheet.columns.forEach((column) => {
      column.style.alignment = { vertical: "top", wrapText: true };
    });
    // AGREGANDO UN TITULO}
    sheet.mergeCells("A2:L2");
    sheet.mergeCells("A3:L3");
    const titleCell = sheet.getCell("E2");
    const title2Cell = sheet.getCell("E3");
    titleCell.style.font = { bold: true, size: 14 };
    titleCell.style.alignment = { horizontal: "center" };
    title2Cell.style.alignment = { horizontal: "center" };
    title2Cell.style.font = { bold: true, size: 14 };
    sheet.getRow(2).height = 40;
    titleCell.value = "UNIDAD DE PROYECTOS ESPECIALES";
    title2Cell.value = titulo;

    // CREANDO LOS TITULOS PAR LA CABECERA
    const headerRow = sheet.getRow(5);
    //estamos jalando todas las columans de esa fila
    headerRow.values = [
      "NRO",
      "NOMBRE DE PROYECTO",
      "DEPARTAMENTO",
      "MUNICIPIO",
      "AREA",
      "TIPO FIN.",
      "MONTO UPRE",
      "MONTO SALDO",
      "AV. FIS.",
      "AV. FIN",
      "EMPRESA",
      "ENTREGA PROTOCOLAR",
    ];

    headerRow.font = { bold: true, size: 12 };
    var col = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
    col.forEach((d, i) => {
      var c = d + "5";
      //DIBUDA LOS BORDES
      sheet.getCell(c).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      //DA FORMATO A LAS CELDAS
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
      row.height = 50;
      var col = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

      var rowValues = [];
      rowValues[0] = i + 1;
      rowValues[1] = element.nombreproyecto;
      rowValues[2] = element.departamento;
      rowValues[3] = element.municipio;
      rowValues[4] = element.area;
      rowValues[5] = element.tipofinanciamiento;
      rowValues[6] = element.montoupre;
      rowValues[7] = element.montosaldo;
      rowValues[8] = element.avancefisico;
      rowValues[9] = element.avancefinanciero;
      rowValues[10] = element.empresa;
      rowValues[11] = element.entregaprotocolar;
      row.values = rowValues;

      col.forEach((d, i) => {
        var c = d + f;
        // console.log('columnas',c);
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
