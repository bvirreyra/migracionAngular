import { Component, OnInit } from '@angular/core';
import { Globals } from '../../global';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ImgBase64Globals } from '@imagen64/img_reportes';


declare var jsPDF: any;

declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-funciones-pdf',
  template: `
  `,
  styles: [],
  providers: [DatePipe]
})
export class FuncionesPdfComponent implements OnInit {

  public s_imgLogoCbes: string;

  constructor(

    private datePipe: DatePipe,
    private base64: ImgBase64Globals) {
    this.s_imgLogoCbes = base64.logocabecera;
  }

  ngOnInit() {
  }

  /*MANEJO DE FECHAS */
  transformDate_ddmmyyyy(date) {
    if (date != null && date != undefined && date.length > 0) {
      return this.datePipe.transform(date, 'dd-MM-yyyy');
    }
    return '';
    //whatever format you need. 
  }
  transformDate_ddmmyyyy_v2(date) {

    return this.datePipe.transform(date, 'dd/MM/yyyy');
    //whatever format you need. 
  }
  transformDate_yyyymmdd(date) {
    return this.datePipe.transform(date, 'MM-dd-yyyy');
    //whatever format you need. 
  }
  transformDate_yyyymmddOf_ddmmyyyy(fecha) {
    let dd = parseInt(fecha.substr(8, 2));
    let mm = parseInt(fecha.substr(5, 2));
    let yyyy = parseInt(fecha.substr(0, 4));

    let mes = (mm < 10) ? "0" + mm : mm;
    let dia = (dd < 10) ? "0" + dd : dd;

    return fecha = dia + '-' + mes + '-' + yyyy;

  }
  transformDate_yyyymmddOf_mmddyyyy(fecha) {
    let mm = parseInt(fecha.substr(0, 2));
    let dd = parseInt(fecha.substr(3, 2));
    let yyyy = parseInt(fecha.substr(6, 4));

    let mes = (mm < 10) ? "0" + mm : mm;
    let dia = (dd < 10) ? "0" + dd : dd;

    return fecha = yyyy + '-' + mes + '-' + dia;

  }
  transformDateOf_yyyymmdd(fecha) {
    let dd = parseInt(fecha.substr(0, 2));
    let mm = parseInt(fecha.substr(3, 2));
    let yyyy = parseInt(fecha.substr(6, 4));

    let mes = (mm < 10) ? "0" + mm : mm;
    let dia = (dd < 10) ? "0" + dd : dd;

    return fecha = yyyy + '-' + mes + '-' + dia;
    //return this.datePipe.transform(date, 'yyyy-MM-dd');
    //whatever format you need. 
  }

  insertarTextoJustificado(doc: any, interlineadoInicial: any, texto: any, size?: any, cordenadaX?: any, anchotabla?: any, font?: any, setFontType?: any) {

    if (size == undefined) {
      size = 9;
    }
    if (cordenadaX == undefined) {
      cordenadaX = 10;
    }
    if (anchotabla == undefined) {
      anchotabla = 200;
    }
    if (font == undefined) {
      font = 'helvetica';
    }
    if (setFontType == undefined) {
      setFontType = 'normal';
    }
    let interlineadoFinal;
    let cabecera = [
      { title: "", dataKey: "TEXTO" }
    ];

    let fila = [
      {
        "TEXTO": texto
      }
    ];
    doc.autoTable(cabecera, fila, {
      //Propiedades
      startY: interlineadoInicial,
      showHeader: 'never',
      margin: { horizontal: cordenadaX },
      tableWidth: 'wrap',
      tableLineColor: [255, 255, 255],
      tableLineWidth: 0,
      lineColor: [255, 255, 255],
      //Estilos
      headerStyles: {
        valign: 'middle',
        halign: 'center',
        fillColor: [230, 230, 230],
        lineColor: [255, 255, 255],
        lineWidth: 0,
        textColor: 0,
      },
      bodyStyles: {
        valign: 'middle',
        halign: 'center',
        fillColor: [230, 230, 230],
        lineColor: [255, 255, 255],
        lineWidth: 0,
        textColor: 0,
        font: font,
        fontStyle: setFontType,


      },
      styles: { overflow: 'linebreak', columnWidth: 'wrap', fontSize: size },
      columnStyles: {
        TEXTO: { columnWidth: anchotabla, halign: 'left' }
      },
      drawCell: function (cell, data) {
        if (data.column.dataKey === 'TEXTO') {
          doc.rect(cell.x, cell.y, cell.width, cell.height, 'S');
          doc.text(cell.text, cell.x, cell.y, { maxWidth: cell.width - 7, align: "justify" });
          return false;
        }
      }
    });
    let tabla = doc.autoTable.previous;
    interlineadoFinal = tabla.finalY;
    doc.setDrawColor(0, 0, 0); // draw red lines
    doc.setLineWidth(0.1);
    return interlineadoFinal;
  }

  insertarTextoJustificadoMediaCarta(doc: any, interlineadoInicial: any, texto: any) {
    let interlineadoFinal;
    let cabecera = [
      { title: "", dataKey: "TEXTO" }
    ];

    let fila = [
      {
        "TEXTO": texto
      }
    ];
    doc.autoTable(cabecera, fila, {
      //Propiedades
      startY: interlineadoInicial,
      showHeader: 'never',
      margin: { horizontal: 13 },
      tableWidth: 'wrap',
      tableLineColor: [255, 255, 255],
      tableLineWidth: 0,
      lineColor: [255, 255, 255],
      lineWidth: 0,
      //Estilos
      headerStyles: {
        valign: 'middle',
        halign: 'center',
        fillColor: [230, 230, 230],
        lineColor: [255, 255, 255],
        lineWidth: 0,
        textColor: 0,
      },
      bodyStyles: {
        valign: 'middle',
        halign: 'center',
        fillColor: [230, 230, 230],
        lineColor: [255, 255, 255],
        lineWidth: 0,
        textColor: 0,
      },
      styles: { overflow: 'linebreak', columnWidth: 'wrap', fontSize: 10 },
      columnStyles: {
        TEXTO: { columnWidth: 115, halign: 'left' }
      },
      drawCell: function (cell, data) {
        if (data.column.dataKey === 'TEXTO') {
          doc.rect(cell.x, cell.y, cell.width, cell.height, 'S');
          doc.text(cell.text, cell.x, cell.y, { maxWidth: cell.width - 3, align: "justify" });
          return false;
        }
      }
    });
    let tabla = doc.autoTable.previous;
    interlineadoFinal = tabla.finalY;
    return interlineadoFinal;
  }

  insertaCheckBox(doc: any, margen: any, interlineado: any, textoOpcion: any, valorAEvaluar: string, valorOpcion: string) {
    doc.setFontStyle("normal");
    doc.setFontSize(9);
    doc.setLineWidth(0.5)
    doc.setDrawColor(0)
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(margen, interlineado - 4, 5, 5, 1, 1)
    doc.text(margen + 8, interlineado, textoOpcion);
    if (valorOpcion.toUpperCase() === valorAEvaluar.toUpperCase()) {
      doc.setFontStyle("bold");
      doc.setFontSize(10);
      doc.text(margen + 1.5, interlineado, 'X');
    }

  }
  insertarTextoCentrado(doc: any, interlineadoInicial: any, texto: any) {
    let anchopagina = doc.internal.pageSize.getWidth();
    doc.text(texto, anchopagina / 2, interlineadoInicial, 'center');
  }

  insertapiepaginaHorizontal(doc: any, fechaserv: any, horaserv: any, user: any) {
    doc.setFontSize(8);
    var numpage = doc.internal.getNumberOfPages();
    var fecha = this.transformDate_ddmmyyyy(fechaserv);
    for (var i = 1; i <= numpage; i++) {
      doc.setPage(i).text(250, doc.internal.pageSize.getHeight() - 10, 'Página ' + i + ' de ' + numpage + '');
      doc.setPage(i).text(13, doc.internal.pageSize.getHeight() - 10, fecha + ' ' + horaserv);
      doc.setPage(i).text(13, doc.internal.pageSize.getHeight() - 7, user);
    }
  }

  insertarCabeceraReporte(doc: any, dts_datosAsegurado: any, tituloFormulario: any, NroFormulario: any) {
    let interlineado_0_5 = 0.5 * 10;
    let interlineado_1_0 = 1 * 10;
    let interlineado_1_15 = 1.15 * 10;
    let interlineado_1_5 = 1.5 * 10;
    let interlineado_2_0 = 2 * 10;
    let interlineado_2_5 = 2.5 * 10;
    let interlineado_3_0 = 3 * 10;
    //Margen expresado en Milimetros
    let margen_izquierdo_1 = 10;
    let margen_izquierdo_2 = 20;
    let margen_izquierdo_3 = 30;
    //Interlineados
    let interlineadodefault = interlineado_1_0;
    let interlieadoTexto = interlineadodefault;
    let logo = this.s_imgLogoCbes;

    doc.addImage(logo, 'JPEG', margen_izquierdo_1, interlieadoTexto, 40, 20);
    doc.setFontSize(8);
    doc.setFontStyle("bold");
    doc.text(margen_izquierdo_1 + 145, 15, 'Nro. Com. : ');
    doc.setFontStyle("italic");
    doc.setFillColor(214, 219, 223);
    doc.rect(175, 12, 30, 4, 'F');

    doc.text(margen_izquierdo_1 + 170, 15, dts_datosAsegurado.COM_NRO);

    doc.setFontStyle('bold');
    doc.text(margen_izquierdo_1 + 146, 20, 'Mat. Ase. : ');
    doc.setFontStyle('italic');
    doc.setFillColor(214, 219, 223);
    doc.rect(175, 17, 30, 4, 'F');
    doc.text(margen_izquierdo_1 + 170, 20, dts_datosAsegurado.ASE_MAT_TIT);

    doc.setFontStyle('bold');
    doc.text(margen_izquierdo_1 + 146, 25, 'Mat. Ben. : ');
    doc.setFontStyle('italic');
    doc.setFillColor(214, 219, 223);
    doc.rect(175, 22, 30, 4, 'F');
    doc.text(margen_izquierdo_1 + 170, 25, dts_datosAsegurado.ASE_MAT);

    doc.setFontStyle('bold');
    doc.text(margen_izquierdo_1 + 144, 30, 'Nro. Form. : ');
    doc.setFontStyle('italic');
    doc.setFillColor(214, 219, 223);
    doc.rect(175, 27, 30, 4, 'F');
    doc.text(margen_izquierdo_1 + 170, 30, NroFormulario);


    let titulo = tituloFormulario;
    doc.setFontSize(10);
    doc.setFontType('bold');
    this.insertarTextoCentrado(doc, interlieadoTexto += interlineado_3_0, titulo);
    interlieadoTexto += interlineado_1_0;
    doc.setFontSize(9);
    doc.line(10, interlieadoTexto + 1, 205, interlieadoTexto + 1);
    doc.setFontType("italic")
    doc.text(margen_izquierdo_1 + 10, interlieadoTexto, dts_datosAsegurado.ASE_APAT)

    doc.setFontType("bold")
    doc.text(margen_izquierdo_1 + 20, interlieadoTexto + interlineado_0_5, 'Apellido Paterno')
    doc.setFontType("italic")
    doc.text(margen_izquierdo_1 + 55, interlieadoTexto, dts_datosAsegurado.ASE_AMAT)

    doc.setFontType("bold")
    doc.text(margen_izquierdo_1 + 64, interlieadoTexto + interlineado_0_5, 'Apellido Materno')
    doc.setFontType("italic")
    doc.text(margen_izquierdo_1 + 100, interlieadoTexto, dts_datosAsegurado.ASE_NOM)

    doc.setFontType("bold")
    doc.text(margen_izquierdo_1 + 115, interlieadoTexto + interlineado_0_5, 'Nombre(s)')
    doc.setFontType("italic")
    doc.text(margen_izquierdo_1 + 150, interlieadoTexto, dts_datosAsegurado.ASE_ESPOSO)

    doc.setFontType("bold")
    doc.text(margen_izquierdo_1 + 158, interlieadoTexto + interlineado_0_5, 'Ap. del Esposo')

    doc.setFontStyle("normal");
    doc.setFontSize(8);
    doc.setFontStyle("bold");
    doc.text(margen_izquierdo_1, interlieadoTexto += interlineado_1_0, 'FEC.INT:');
    doc.setFontStyle("normal");
    doc.text(margen_izquierdo_1 + 14, interlieadoTexto, this.transformDate_ddmmyyyy(dts_datosAsegurado.FECHA_ADMISION));

    doc.setFontStyle("bold");
    doc.text(margen_izquierdo_1 + 35, interlieadoTexto, 'CAMA:');
    doc.setFontStyle("normal");
    doc.text(margen_izquierdo_1 + 47, interlieadoTexto, dts_datosAsegurado.DESCRIPCIONDETALLECLASIFICADOR);

    doc.setFontStyle("bold");
    doc.text(margen_izquierdo_1 + 63, interlieadoTexto, 'SALA:');
    doc.setFontStyle("normal");
    doc.text(margen_izquierdo_1 + 72, interlieadoTexto, dts_datosAsegurado.AGRUPA_CLASIFICADOR.substring(0, 18));

    doc.setFontStyle("bold");
    doc.text(margen_izquierdo_1 + 105, interlieadoTexto, 'Med. Tratante:');
    doc.setFontStyle("normal");
    doc.text(margen_izquierdo_1 + 125, interlieadoTexto, dts_datosAsegurado.MEDI_NOM.substring(0, 45));//MEDI_NOM


    doc.setFontStyle("bold");
    doc.text(margen_izquierdo_1, interlieadoTexto += interlineado_0_5, 'EDAD:');
    doc.setFontStyle("normal");
    doc.text(margen_izquierdo_1 + 14, interlieadoTexto, dts_datosAsegurado.EDAD_A + '');

    doc.setFontStyle("bold");
    doc.text(margen_izquierdo_1 + 35, interlieadoTexto, 'SEXO:');
    doc.setFontStyle("normal");
    doc.text(margen_izquierdo_1 + 47, interlieadoTexto, dts_datosAsegurado.ASE_SEXO);

    doc.line(10, interlieadoTexto + 1, 205, interlieadoTexto + 1);

    return interlieadoTexto;
  }

  insertarCabeceraReporteConsultaExterna(doc: any, dts_datosAsegurado: any, tituloFormulario: any, NroFormulario: any) {
    let interlineado_0_5 = 0.5 * 10;
    let interlineado_1_0 = 1 * 10;
    let interlineado_1_15 = 1.15 * 10;
    let interlineado_1_5 = 1.5 * 10;
    let interlineado_2_0 = 2 * 10;
    let interlineado_2_5 = 2.5 * 10;
    let interlineado_3_0 = 3 * 10;
    //Margen expresado en Milimetros
    let margen_izquierdo_1 = 10;
    let margen_izquierdo_2 = 20;
    let margen_izquierdo_3 = 30;
    //Interlineados
    let interlineadodefault = interlineado_1_0;
    let interlieadoTexto = interlineadodefault;
    let logo = this.s_imgLogoCbes;

    doc.addImage(logo, 'JPEG', margen_izquierdo_1, interlieadoTexto, 50, 20);
    doc.setFontSize(8);
    doc.setFontStyle("bold");

    doc.setFontStyle('bold');
    doc.text(margen_izquierdo_1 + 146, 20, 'Mat. Ase. : ');
    doc.setFontStyle('italic');
    doc.setFillColor(214, 219, 223);
    doc.rect(175, 17, 30, 4, 'F');
    doc.text(margen_izquierdo_1 + 170, 20, dts_datosAsegurado.ASE_MAT_TIT);

    doc.setFontStyle('bold');
    doc.text(margen_izquierdo_1 + 146, 25, 'Mat. Ben. : ');
    doc.setFontStyle('italic');
    doc.setFillColor(214, 219, 223);
    doc.rect(175, 22, 30, 4, 'F');
    doc.text(margen_izquierdo_1 + 170, 25, dts_datosAsegurado.ASE_MAT);

    doc.setFontStyle('bold');
    doc.text(margen_izquierdo_1 + 144, 30, 'Nro. Form. : ');
    doc.setFontStyle('italic');
    doc.setFillColor(214, 219, 223);
    doc.rect(175, 27, 30, 4, 'F');
    doc.text(margen_izquierdo_1 + 170, 30, NroFormulario);


    let titulo = tituloFormulario;
    doc.setFontSize(10);
    doc.setFontType('bold');
    this.insertarTextoCentrado(doc, interlieadoTexto += interlineado_3_0, titulo);
    interlieadoTexto += interlineado_1_0;
    doc.setFontSize(9);
    doc.line(10, interlieadoTexto + 1, 205, interlieadoTexto + 1);
    doc.setFontType("italic")
    doc.text(margen_izquierdo_1 + 10, interlieadoTexto, dts_datosAsegurado.ASE_APAT)

    doc.setFontType("bold")
    doc.text(margen_izquierdo_1 + 20, interlieadoTexto + interlineado_0_5, 'Apellido Paterno')
    doc.setFontType("italic")
    doc.text(margen_izquierdo_1 + 55, interlieadoTexto, dts_datosAsegurado.ASE_AMAT)

    doc.setFontType("bold")
    doc.text(margen_izquierdo_1 + 64, interlieadoTexto + interlineado_0_5, 'Apellido Materno')
    doc.setFontType("italic")
    doc.text(margen_izquierdo_1 + 100, interlieadoTexto, dts_datosAsegurado.ASE_NOM)

    doc.setFontType("bold")
    doc.text(margen_izquierdo_1 + 115, interlieadoTexto + interlineado_0_5, 'Nombre(s)')
    doc.setFontType("italic")
    doc.text(margen_izquierdo_1 + 150, interlieadoTexto, dts_datosAsegurado.ASE_ESPOSO)

    doc.setFontType("bold")
    doc.text(margen_izquierdo_1 + 158, interlieadoTexto + interlineado_0_5, 'Ap. del Esposo')

    doc.setFontStyle("normal");
    doc.setFontSize(8);
    doc.setFontStyle("bold");
    doc.text(margen_izquierdo_1, interlieadoTexto += interlineado_1_0, 'EDAD:');
    doc.setFontStyle("normal");
    doc.text(margen_izquierdo_1 + 14, interlieadoTexto, dts_datosAsegurado.EDAD_A + '');

    doc.setFontStyle("bold");
    doc.text(margen_izquierdo_1 + 35, interlieadoTexto, 'SEXO:');
    doc.setFontStyle("normal");
    doc.text(margen_izquierdo_1 + 47, interlieadoTexto, dts_datosAsegurado.ASE_SEXO);
    doc.line(10, interlieadoTexto + 1, 205, interlieadoTexto + 1);

    return interlieadoTexto;
  }

  insertarCabeceraReporteHistoria(doc: any, dts_datosAsegurado: any, tituloFormulario: any, NroFormulario: any) {
    let interlineado_0_5 = 0.5 * 10;
    let interlineado_1_0 = 1 * 10;
    let interlineado_1_15 = 1.15 * 10;
    let interlineado_1_5 = 1.5 * 10;
    let interlineado_2_0 = 2 * 10;
    let interlineado_2_5 = 2.5 * 10;
    let interlineado_3_0 = 3 * 10;
    //Margen expresado en Milimetros
    let margen_izquierdo_1 = 10;
    let margen_izquierdo_2 = 20;
    let margen_izquierdo_3 = 30;
    //Interlineados
    let interlineadodefault = interlineado_1_0;
    let interlieadoTexto = interlineadodefault;
    let logo = this.s_imgLogoCbes;

    doc.addImage(logo, 'JPEG', margen_izquierdo_1, interlieadoTexto, 40, 20);
    doc.setFontSize(8);
    doc.setFontStyle("bold");
    doc.text(margen_izquierdo_1 + 145, 15, 'Nro. Com. : ');
    doc.setFontStyle("italic");
    doc.setFillColor(214, 219, 223);
    doc.rect(175, 12, 30, 4, 'F');

    doc.text(margen_izquierdo_1 + 170, 15, dts_datosAsegurado.COM_NRO.toString());

    doc.setFontStyle('bold');
    doc.text(margen_izquierdo_1 + 146, 20, 'Mat. Ase. : ');
    doc.setFontStyle('italic');
    doc.setFillColor(214, 219, 223);
    doc.rect(175, 17, 30, 4, 'F');
    doc.text(margen_izquierdo_1 + 170, 20, dts_datosAsegurado.ASE_MAT_TIT);

    doc.setFontStyle('bold');
    doc.text(margen_izquierdo_1 + 146, 25, 'Mat. Ben. : ');
    doc.setFontStyle('italic');
    doc.setFillColor(214, 219, 223);
    doc.rect(175, 22, 30, 4, 'F');
    doc.text(margen_izquierdo_1 + 170, 25, dts_datosAsegurado.ASE_MAT);

    doc.setFontStyle('bold');
    doc.text(margen_izquierdo_1 + 144, 30, 'Nro. Form. : ');
    doc.setFontStyle('italic');
    doc.setFillColor(214, 219, 223);
    doc.rect(175, 27, 30, 4, 'F');
    doc.text(margen_izquierdo_1 + 170, 30, NroFormulario);


    let titulo = tituloFormulario;
    doc.setFontSize(10);
    doc.setFontType('bold');
    this.insertarTextoCentrado(doc, interlieadoTexto += interlineado_3_0, titulo);
    interlieadoTexto += interlineado_1_0;
    doc.setFontSize(9);
    doc.line(10, interlieadoTexto + 1, 205, interlieadoTexto + 1);
    doc.setFontType("italic")
    doc.text(margen_izquierdo_1 + 10, interlieadoTexto, dts_datosAsegurado.ASE_APAT)

    doc.setFontType("bold")
    doc.text(margen_izquierdo_1 + 20, interlieadoTexto + interlineado_0_5, 'Apellido Paterno')
    doc.setFontType("italic")
    doc.text(margen_izquierdo_1 + 55, interlieadoTexto, dts_datosAsegurado.ASE_AMAT)

    doc.setFontType("bold")
    doc.text(margen_izquierdo_1 + 64, interlieadoTexto + interlineado_0_5, 'Apellido Materno')
    doc.setFontType("italic")
    doc.text(margen_izquierdo_1 + 100, interlieadoTexto, dts_datosAsegurado.ASE_NOM)

    doc.setFontType("bold")
    doc.text(margen_izquierdo_1 + 115, interlieadoTexto + interlineado_0_5, 'Nombre(s)')
    doc.setFontType("italic")
    doc.text(margen_izquierdo_1 + 150, interlieadoTexto, dts_datosAsegurado.ASE_ESPOSO)

    doc.setFontType("bold")
    doc.text(margen_izquierdo_1 + 158, interlieadoTexto + interlineado_0_5, 'Ap. del Esposo')

    doc.setFontStyle("normal");
    doc.setFontSize(8);
    doc.setFontStyle("bold");
    doc.text(margen_izquierdo_1, interlieadoTexto += interlineado_1_15, 'Med. Tratante:');
    doc.setFontStyle("normal");
    doc.text(margen_izquierdo_1 + 20, interlieadoTexto, dts_datosAsegurado.HIS_MEDICO_TRATANTE.substring(0, 45));

    doc.setFontStyle("bold");
    doc.text(margen_izquierdo_1 + 80, interlieadoTexto, 'EDAD:');
    doc.setFontStyle("normal");
    doc.text(margen_izquierdo_1 + 90, interlieadoTexto, dts_datosAsegurado.EDAD_D.toString());

    doc.setFontStyle("bold");
    doc.text(margen_izquierdo_1 + 100, interlieadoTexto, 'SEXO:');
    doc.setFontStyle("normal");
    doc.text(margen_izquierdo_1 + 110, interlieadoTexto, dts_datosAsegurado.ASE_SEXO);

    doc.line(10, interlieadoTexto + 1, 205, interlieadoTexto);

    return interlieadoTexto;
  }

  insertarOpcionesParametrizada(doc: any, margen: any, interlineado: any, textoOpcion: any, valorOpcion: string, textoOpcional?: string) {
    doc.setFontStyle("normal");
    doc.setFontSize(9);
    if (textoOpcional.length > 0) {
      doc.text(margen, interlineado, `${textoOpcion}: ${valorOpcion} ${textoOpcional}`);
    }
    else {
      doc.text(margen, interlineado, `${textoOpcion}: ${valorOpcion}`);
    }
  }

  //Crea tabla
  //crearTabla(doc: any, nombreCabecera, Detalle, inicioY, margenX, widthTabla, heightTabla?, justificado = false): any {
  crearTabla(doc: any, nombreCabecera, Detalle, inicioY, margenX, widthTabla, justificado = false): any {
    let tabla = {
      posicionX: margenX,
      posicionY: inicioY,
      posicionFinalY: 0,
      alto: 0,
      ancho: 0
    }
    let valorJustificado = { maxWidth: widthTabla - 4, align: "justify" };
    let interlineado;
    let cabecera = [
      { title: nombreCabecera, dataKey: "TEXTO" }
    ];

    let fila = [
      {
        "TEXTO": `${Detalle}`
      }
    ];

    doc.autoTable(cabecera, fila, {
      //Propiedades
      startY: inicioY,
      //showHeader: 'never',
      margin: { horizontal: margenX },
      tableWidth: 'wrap',
      //Estilos
      headerStyles: {
        valign: 'middle',
        halign: 'center',
        fillColor: [230, 230, 230],
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        textColor: 0,
      },
      bodyStyles: {
        valign: 'middle',
        halign: 'center',
        fillColor: [230, 230, 230],
        lineColor: [0, 0, 0],
        lineWidth: 0,
        textColor: 0,
      },
      styles: { overflow: 'linebreak', columnWidth: 'wrap' },
      columnStyles: {
        TEXTO: { columnWidth: widthTabla, halign: 'left' }
      },
      drawCell: function (cell, data) {

        doc.setFillColor(255, 0, 0);
        doc.setLineWidth(0.1);
        if (data.column.dataKey === 'TEXTO') {
          // doc.rect(cell.x, y, cell.width, cell.height, 'S');
          doc.rect(cell.x, cell.y, cell.width, cell.height, 'S');
          tabla.alto = cell.height
          tabla.ancho = cell.width
          doc.text(cell.text, cell.x + 1, cell.y + 5, justificado === true ? valorJustificado : '');
          return false;
        }
      }
    });
    let tabladoc = doc.autoTable.previous;
    interlineado = tabladoc.finalY;
    tabla.posicionFinalY = tabladoc.finalY;
    return tabla;
  }

  crearTabla_3_Col(doc: any, cabecera: any, data: any, inicioX: any, inicioY: any, anchoTabla?: any, justificado = false) {
    let valorJustificado = { maxWidth: anchoTabla - 4, align: "justify" };
    
    doc.autoTable(cabecera, data, {
      //Propiedades
      startY: inicioY,
      //showHeader: 'never',
      margin: { horizontal: inicioX },
      tableWidth: 'auto',
      pageBreak: 'auto',
      //Estilos
      headerStyles: {
        valign: 'middle',
        halign: 'center',
        fillColor: [230, 230, 230],
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        textColor: 0,
      },
      bodyStyles: {
        valign: 'top',
        halign: 'left',
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        textColor: 0,
      },
      styles: {
        overflow: 'linebreak',
        columnWidth: 65,//'wrap' 
      },
      columnStyles: {
        valign: 'top',
        halign: 'left',
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        textColor: 0,
      },
      drawCell: function (cell, data) {
        doc.setFillColor(255, 255, 255);
      }
    });
    let tabladoc = doc.autoTable.previous;
    let interlineado;
    interlineado = tabladoc.finalY;
    return interlineado;
  }

  crearTabla_2_Col(doc: any, cabecera: any, data: any, inicioX: any, inicioY: any, anchoTabla?: any, justificado = false) {

    let valorJustificado = { maxWidth: anchoTabla - 4, align: "justify" };
    doc.autoTable(cabecera, data, {
      //Propiedades
      startY: inicioY,
      //showHeader: 'never',
      margin: { horizontal: inicioX },
      tableWidth: 'auto',
      pageBreak: 'auto',
      //Estilos
      headerStyles: {
        valign: 'middle',
        halign: 'center',
        fillColor: [230, 230, 230],
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        textColor: 0,
      },
      bodyStyles: {
        valign: 'top',
        halign: 'left',
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        textColor: 0,
      },
      styles: {
        overflow: 'linebreak',
        columnWidth: 97.5,
      },
      columnStyles: {
        text: {
          halign: 'left',
        }
      },
      drawCell: function (cell, data) {
        doc.setFillColor(255, 255, 255);
      }
    });
    let tabladoc = doc.autoTable.previous;
    let interlineado;
    interlineado = tabladoc.finalY;
    return interlineado;
  }
}
