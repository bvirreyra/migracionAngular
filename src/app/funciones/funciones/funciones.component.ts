import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Globals } from "../../global";

/*servicios*/
//import { AutenticacionService } from '../../modulos/seguridad/autenticacion.service';
import { MensajesComponent } from "../../modulos/seguridad/mensajes/mensajes.component";
//import { CitasMedicasService } from '../../modulos/citasmedicas/citasmedicas.service';
/*npm*/
import { DatePipe } from "@angular/common";
//declare var jsPDF: any; // Important
import * as moment from "moment";
import { SgpService } from "src/app/modulos/sgp/sgp.service";
moment.locale("es");

//
declare var jQuery: any;
declare var $: any;
declare var jsPDF: any;
@Component({
  selector: "app-funciones",
  templateUrl: "./funciones.component.html",
  styleUrls: ["./funciones.component.css"],
  providers: [DatePipe],
})
export class FuncionesComponent implements OnInit {
  //usamos el decorador OutPut

  public nombre: any;

  //variables de session y iniciales
  public s_datosconexion: any;
  public s_idrol: any;
  public s_matricula: any;
  public errorMessage: string;
  //variable para mensajes del sistema
  public mensaje: string;
  //variables para el compononete de mensajes
  public prop_msg: string;
  public prop_tipomsg: string;
  public CONFIGURACION_TABLA: any = {
    // responsive: {
    //   details: {
    //     renderer: function (api, rowIdx, columns) {
    //       var data = $.map(columns, function (col, i) {
    //         return col.hidden ?
    //           '<tr data-dt-row="' + col.rowIndex + '" data-dt-column="' + col.columnIndex + '">' +
    //           '<td>' + col.title + ':' + '</td> ' +
    //           '<td>' + col.data + '</td>' +
    //           '</tr>' :
    //           '';
    //       }).join('');

    //       return data ?
    //         $('<table/>').append(data) :
    //         false;
    //     }
    //   }
    // },
    // "scrollX": true,
    order: [[3, "desc"]],
    language: {
      sProcessing: "Procesando...",
      sLengthMenu: "Mostrar _MENU_ registros",
      sZeroRecords: "No se encontraron resultados",
      sEmptyTable: "Ningún dato disponible en esta tabla",
      sInfo: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_",
      sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0",
      sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
      sInfoPostFix: "",
      sSearch: "Buscar:",
      sUrl: "",
      sInfoThousands: ",",
      sLoadingRecords: "Cargando...",
      oPaginate: {
        sFirst: "Primero",
        sLast: "Último",
        sNext: "Siguiente",
        sPrevious: "Anterior",
      },
      oAria: {
        sSortAscending:
          ": Activar para ordenar la columna de manera ascendente",
        sSortDescending:
          ": Activar para ordenar la columna de manera descendente",
      },
    },
    lengthMenu: [5, 10, 25, 50, 100],
  };

  constructor(
    //rivate _autenticacion: AutenticacionService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _globals: Globals,
    private datePipe: DatePipe,
    private _msg: MensajesComponent,
    private _sgp: SgpService
  ) {
    this.nombre = "Pueblo de la Toscana";
  }

  ngOnInit() {}
  // DatosConexion(idcon: string, idmod: string) {
  //   this._autenticacion.getdatosconexion(idcon, idmod).subscribe(
  //     (result: any) => {
  //       if (result[0]['IDROL'] != '') {

  //         this.s_datosconexion = result[0];

  //         this.s_idrol = result[0]['IDROL'];
  //         this.s_matricula = result[0]['MATRICULA'];

  //       }
  //     },
  //     error => {
  //       this.errorMessage = <any>error;
  //       if (this.errorMessage != null) {
  //         console.log(this.errorMessage);

  //         this.prop_msg = 'Error: No se pudo ejecutar la petición en la base de datos ';
  //         this.prop_tipomsg = 'danger';
  //         this._msg.formateoMensaje('modal_danger', this.prop_msg);
  //       }
  //     }
  //   )
  // }

  FechaLiteral(fecha: Date) {
    //2019-04-02T18:39:37.818Z
    let ff = new Date(fecha);

    var meses = new Array(
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre"
    );
    var diasSemana = new Array(
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado"
    );
    var fechaNum = ff.getDate();
    var mes_name = ff.getMonth();
    return (
      diasSemana[ff.getDay()] +
      " " +
      fechaNum +
      " de " +
      meses[mes_name] +
      " de " +
      ff.getFullYear()
    );
  }

  FechaLiteralSinDia(fecha: Date) {
    let ff = new Date(fecha);

    var meses = new Array(
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre"
    );
    var diasSemana = new Array(
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado"
    );
    var fechaNum = ff.getDate();
    var mes_name = ff.getMonth();
    return fechaNum + " de " + meses[mes_name] + " de " + ff.getFullYear();
  }

  /*REMPLAZA 'NULL','null','Null' y null POR VACIO ''
  Y POR NO EL CARACTER © POR \n PARA QUE SE VISUALIZE EL SALTO DE LINEA EN HTML */
  RemplazaNull(cadena: any) {
    let result = "";
    if (
      cadena === "NULL" ||
      cadena === "null" ||
      cadena === "Null" ||
      cadena === null
    ) {
      result = "";
    } else {
      //if (!/^([-0-9])*$/.test(cadena)) {
      if (!/^-?\d+(\.\d+)?$/.test(cadena)) {
        //cadena = cadena.replace(/©/g, "\n");
        cadena = cadena.replace(/'/g, '"');
      }

      result = cadena;
    }
    return result;
  }
  /*RECORRE UN ARRAY HACIENDO USO DEL REMPLAZANULL*/
  RemplazaNullArray(datos: any) {
    var lineas = datos.length;
    for (var i = 0; i < lineas; i++) {
      for (var atributo in datos[i]) {
        datos[i][atributo] = this.RemplazaNull(datos[i][atributo]);
      }
    }

    return datos;
  }
  /*REMPLAZA 'NULL','null','Null' y null por S/D 
  Y POR NO RETORNA LA CADENA TAL CUAL
  */
  RemplazaNull2(cadena: any) {
    let result = "";
    if (
      cadena === "NULL" ||
      cadena === "null" ||
      cadena === "Null" ||
      cadena === null
    ) {
      result = "SD";
    } else {
      result = cadena;
    }
    return result;
  }
  /*RECORRE UN ARRAY HACIENDO USO DEL REMPLAZANUL2L*/
  RemplazaNullArraySincaracter(datos: any) {
    var lineas = datos.length;
    for (var i = 0; i < lineas; i++) {
      for (var atributo in datos[i]) {
        datos[i][atributo] = this.RemplazaNull2(datos[i][atributo]);
      }
    }
    return datos;
  }

  /*RECORRE TODO UN ARRAY ==>PARA MANDAR VARIALBES VACIAS AL API (null, undefined '' )*/
  getNullArrayVacio(datos: any) {
    var lineas = datos.length;
    let result = "";
    for (var i = 0; i < lineas; i++) {
      for (var atributo in datos[i]) {
        datos[i][atributo] = this.getNullVacio(datos[i][atributo]);
      }
    }

    return datos;
  }
  getNullVectorVacio(datos: any) {
    let result = "";
    for (var atributo in datos) {
      datos[atributo] = this.getNullVacio(datos[atributo]);
    }

    return datos;
  }
  /*PARA MANDAR VARIALBES VACIAS AL API (null, undefined '' )*/
  getNullVacio(cadena: string) {
    let result = "";

    if (cadena === null || cadena === undefined || cadena === "") {
      result = "NULL";
    } else {
      cadena = this.formateaEnter(cadena);
      result = cadena;
    }
    return result;
  }

  /*VALIDA SI LA CADENA INGRESADA ES UN NUMERO*/
  valorNumerico(cadena: string) {
    var resultado: boolean;

    try {
      //console.log(parseInt(cadena));
      resultado = true;
    } catch (NumberFormatException) {
      resultado = false;
    }

    return resultado;
  }
  /*VALIDA SI LA CADENA INGRESADA ES UN NUMERO*/
  valorNumericoDecimal(dato: any) {
    var resultado;
    resultado = isNaN(Number.parseFloat(dato))
      ? 0
      : Number.parseFloat(dato).toFixed(2);

    return Number.parseFloat(resultado);
  }
  /*VALIDA SI ES NUMERO RESULTADO TRUE FALSE*/
  validarSiNumero(numero) {
    var resultado: boolean;
    if (!/^-?\d+(\.\d+)?$/.test(numero)) {
      resultado = false;
    } else {
      resultado = true;
    }
  }

  /*JUSTIFICA UNA CADENA:EFR*/
  justificacadena(texto: string, long: number) {
    var cadena = texto;
    var cantidadespacio;
    var nueva_cadena = "";
    var cadena_array = [];
    var contador = 0;
    var longitud_justificado = long;
    if (cadena.length < longitud_justificado) {
      cantidadespacio = longitud_justificado - cadena.length;
      cadena_array = cadena.split(" ");
      for (var i = 0; i < cadena_array.length; i++) {
        if (contador < cantidadespacio) {
          nueva_cadena += cadena_array[i] + "  ";
        } else {
          nueva_cadena += cadena_array[i] + " ";
        }
        contador++;
      }
    } else {
      nueva_cadena = cadena;
    }
    return nueva_cadena;
  }

  // Consulta e inserta una pagina nueva en caso de exceder el limite

  verificainterlineado(doc: any, interlineado: number, heightPagina: number) {
    var cabecera = 20;
    if (interlineado > heightPagina) {
      doc.addPage();
      interlineado = cabecera;
      //prueba
    }
    return interlineado;
  }
  insertapiepagina(doc: any, fechaserv: any, horaserv: any, user: any) {
    doc.setFontSize(8);
    var numpage = doc.internal.getNumberOfPages();
    let altoPagina =
      doc.internal.pageSize.getHeight() || doc.internal.pageSize.getHeight();
    var fecha = this.transformDate_ddmmyyyy(fechaserv);
    for (var i = 1; i <= numpage; i++) {
      doc
        .setPage(i)
        .text(180, altoPagina - 10, "Página " + i + " de " + numpage + "");
      doc.setPage(i).text(13, altoPagina - 10, fecha + " " + horaserv);
      doc.setPage(i).text(13, altoPagina - 7, user);
    }
  }
  cabeceratabla(
    doc: any,
    datos: any,
    interlineado: any,
    rows: any,
    registros: any,
    estructura_col: any,
    espacio_letra: any
  ) {
    doc.setFontSize(8);
    doc.setFontType("bold");

    var linea = [];
    for (var j = 0; j < rows; j++) {
      linea[j] = interlineado;
      interlineado = interlineado + 5;
    }

    var columnas = datos.length;
    var left = 10;

    for (var i = 0; i < columnas; i++) {
      if (parseInt(datos[i].row) == rows) {
        var k = datos[i].linea;
        doc.rect(
          left,
          linea[k - 1],
          parseInt(datos[i].y),
          5 * parseInt(datos[i].row)
        );
        //doc.text(left + 1, linea[k - 1] + parseInt(datos[i].row) * 3, datos[i].dato);

        var texto: string = datos[i].dato;
        var dts_texto = [];
        dts_texto = this.formateacadena(
          texto.toString(),
          estructura_col[i].y / espacio_letra
        );

        var l;
        for (l = 0; l < dts_texto.length; l++) {
          var texto_formateado = dts_texto[l].texto;

          doc.text(left + 1, linea[l] + 3, texto_formateado.toString());
        }

        left = left + parseInt(datos[i].y);
      } else {
        if (parseInt(datos[i].row) < rows) {
          if (parseInt(datos[i].row) == parseInt(datos[i].col)) {
            var k = datos[i].linea;
            doc.rect(
              left,
              linea[k - 1],
              parseInt(datos[i].y),
              5 * parseInt(datos[i].row)
            );
            doc.text(
              left + 1,
              linea[k - 1] + parseInt(datos[i].row) * 3,
              datos[i].dato
            );
            if (datos[i].linea == rows) {
              left = left + parseInt(datos[i].y);
            }
          } else {
            var k = datos[i].linea;
            doc.rect(
              left,
              linea[k - 1],
              parseInt(datos[i].y),
              5 * parseInt(datos[i].row)
            );
            doc.text(
              left + 1,
              linea[k - 1] + parseInt(datos[i].row) * 3,
              datos[i].dato
            );
          }
        }
      }
    }
    /*********************************************** */
    /*llenando los registros de la tabla
    /*********************************************** */
    //console.log(estructura_col, registros);
    var columnas_registros = estructura_col.length;
    var lineas_registros = registros.length;
    interlineado = interlineado;
    left = 10;
    var alto = 0;
    doc.setFontSize(8);
    doc.setFontType("normal");

    for (var i = 0; i < lineas_registros; i++) {
      var nro_item = i + 1;
      doc.text(left + 1, interlineado + 3, nro_item.toString());
      left = left + parseInt(estructura_col[0].y);
      for (var j = 0; j < columnas_registros; j++) {
        for (var atributo in registros[i]) {
          if (estructura_col[j].campo == atributo) {
            var texto: string = registros[i][atributo];
            var dts_texto = [];
            dts_texto = this.formateacadena(
              texto.toString(),
              estructura_col[j].y / espacio_letra
            );

            var l;
            for (l = 0; l < dts_texto.length; l++) {
              var texto_formateado = dts_texto[l].texto;

              doc.text(
                left + 1,
                interlineado + 3 + l * 5,
                texto_formateado.toString()
              );
            }
            if (alto < l) {
              alto = l;
            } else {
              alto = alto;
            }
            //console.log('l', l);
            //console.log('alto', alto);
            left = left + parseInt(estructura_col[j].y);
          }
        }
      }
      left = 10;
      doc.rect(left, interlineado, parseInt(estructura_col[0].y), alto * 5);
      left = left + parseInt(estructura_col[0].y);
      for (var j = 0; j < columnas_registros; j++) {
        for (var atributo in registros[i]) {
          if (estructura_col[j].campo == atributo) {
            doc.rect(
              left,
              interlineado,
              parseInt(estructura_col[j].y),
              alto * 5
            );
            left = left + parseInt(estructura_col[j].y);
          }
        }
      }

      // doc.rect(left, interlineado, parseInt(estructura_col[0].y), 5+(alto*5));
      interlineado = interlineado + 5 * alto;
      left = 10;
    }
    return interlineado;
  }
  insertapiepaginaHorizontal(
    doc: any,
    fechaserv: any,
    horaserv: any,
    user: any
  ) {
    doc.setFontSize(8);
    var numpage = doc.internal.getNumberOfPages();
    var fecha = this.transformDate_ddmmyyyy(fechaserv);
    for (var i = 1; i <= numpage; i++) {
      doc
        .setPage(i)
        .text(
          250,
          doc.internal.pageSize.getHeight() - 10,
          "Página " + i + " de " + numpage + ""
        );
      doc
        .setPage(i)
        .text(
          13,
          doc.internal.pageSize.getHeight() - 10,
          fecha + " " + horaserv
        );
      doc.setPage(i).text(13, doc.internal.pageSize.getHeight() - 7, user);
    }
  }
  /*FORMATEA CADENA PARA LOS REPORTES DE TIPO TEXTAREA*/
  formateacadena(texto: string, longitud: number) {
    var i;
    var j;
    var caracteres = longitud;

    var caracterescadena;
    var nro_caracteres;
    var nro_cadenas;
    var nueva_cadena = [];
    var caracteres2 = 0;
    var cadena;
    var count_str;
    var count_str2;
    var car2;
    var cadena2;

    if (texto.length > 1700) {
      caracterescadena = Math.round(texto.length / caracteres + 0.5);
    } else {
      caracterescadena = Math.floor(texto.length / caracteres);
    }

    count_str = texto.replace(/[^©]/g, "").length;

    nro_cadenas = caracterescadena + 1;

    var next_car;
    for (j = 0; j < nro_cadenas + count_str; j++) {
      //var cadena;
      var car;
      cadena = texto.substr(caracteres2, caracteres);

      /*cambio enter*/
      if (cadena.indexOf("©") >= 0) {
        car = cadena.indexOf("©");
        cadena = cadena.substring(0, car);
        cadena = cadena.trim();
        caracteres2 = caracteres2 + car + 1;
        nueva_cadena.push({ texto: cadena });

        continue;
      } else {
        if (texto.length > caracteres) {
          next_car = texto.substr(caracteres2 + caracteres, 1);
        } else {
          next_car = " ";
        }

        car = cadena.length;
        cadena = cadena.substring(0, car);
        count_str2 = cadena.replace(/[^©]/g, "").length;

        if (j >= nro_cadenas + count_str - 1 && count_str2 === 0) {
          car2 = cadena.length;
          cadena2 = cadena.substring(0, car2);
          count_str2 = cadena2.replace(/[^©]/g, "").length;
          cadena2 = cadena2.trim();
          nueva_cadena.push({ texto: cadena2 });

          break;
        }

        if (next_car !== " ") {
          car = cadena.lastIndexOf(" ");

          cadena = cadena.substring(0, car);

          caracteres2 = caracteres2 + car;
        } else {
          car = caracteres;
          caracteres2 = caracteres2 + car;
        }
        cadena = cadena.trim();
        nueva_cadena.push({ texto: cadena });
      }
    }
    return nueva_cadena;
  }
  /*REMPLAZA EN CADA SALTO DE LINEA POR © */
  formateaEnter(texto: string) {
    if (!/^-?\d+(\.\d+)?$/.test(texto)) {
      // texto = texto.replace(/\n/g, "©");
    } else {
      texto = texto;
    }

    return texto;
  }

  /*MANEJO DE FECHAS */
  transformDate_ddmmyyyy(date) {
    return this.datePipe.transform(date, "dd-MM-yyyy");
    //whatever format you need.
  }
  transformDate_ddmmyyyy_v2(date) {
    return this.datePipe.transform(date, "dd/MM/yyyy");
    //whatever format you need.
  }

  transformDate_yyyymmddOf_ddmmyyyy(fecha) {
    let dd = parseInt(fecha.substr(8, 2));
    let mm = parseInt(fecha.substr(5, 2));
    let yyyy = parseInt(fecha.substr(0, 4));

    let mes = mm < 10 ? "0" + mm : mm;
    let dia = dd < 10 ? "0" + dd : dd;

    return (fecha = dia + "-" + mes + "-" + yyyy);
  }
  transformDate_yyyymmddOf_mmddyyyy(fecha) {
    let mm = parseInt(fecha.substr(0, 2));
    let dd = parseInt(fecha.substr(3, 2));
    let yyyy = parseInt(fecha.substr(6, 4));

    let mes = mm < 10 ? "0" + mm : mm;
    let dia = dd < 10 ? "0" + dd : dd;

    return (fecha = yyyy + "-" + mes + "-" + dia);
  }
  transformDateOf_yyyymmdd(fecha) {
    // console.log('pruebaaaaa',fecha)
    // let dd = parseInt(fecha.substr(0, 2));
    // let mm = parseInt(fecha.substr(3, 2));
    // let yyyy = parseInt(fecha.substr(6, 4));

    // let mes = (mm < 10) ? "0" + mm : mm;
    // let dia = (dd < 10) ? "0" + dd : dd;

    // return fecha = yyyy + '-' + mes + '-' + dia;
    return this.datePipe.transform(fecha, "yyyy-MM-dd", "es-ES");
    //whatever format you need.
  }
  transformDate_yyyymmdd(fecha) {
    let dd = parseInt(fecha.substr(0, 2));
    let mm = parseInt(fecha.substr(3, 2));
    let yyyy = parseInt(fecha.substr(6, 4));

    let mes = mm < 10 ? "0" + mm : mm;
    let dia = dd < 10 ? "0" + dd : dd;

    return (fecha = yyyy + "-" + mes + "-" + dia);
    //return this.datePipe.transform(date, 'yyyy-MM-dd');
    //whatever format you need.
  }
  optieneHora(date) {
    return this.datePipe.transform(date, "H:mm");
  }

  //incrementa fechas sin feriados ni domingos, los feriados desde seguridad.feriado
  incrementaFechaSF(
    opcion: string,
    fechaIni: Date,
    fechaFin?: Date,
    incremento?: number,
    feriados?: any[]
  ) {
    //para no tomar en cuenta las horas
    fechaIni = new Date(
      fechaIni.getFullYear(),
      fechaIni.getMonth(),
      fechaIni.getDate()
    );
    fechaFin = new Date(
      fechaFin.getFullYear(),
      fechaFin.getMonth(),
      fechaFin.getDate()
    );
    // console.log('incrementando',fechaIni,incremento,feriados);
    let cont = 2; //si se quiere contar desde el siguiente dia => 1, desde el mismo dia => 2;
    let f2 = new Date(fechaIni).getTime();
    feriados
      ? (feriados = feriados.map((e) =>
          new Date(e.FechaFeriado || e.fecha_feriado).getTime()
        ))
      : (feriados = []);
    if (opcion == "FECHA_FIN") {
      if (cont > incremento) cont = 1;
      while (cont <= incremento) {
        // console.log("iniciando", cont, new Date(f2).toLocaleDateString(),feriados);
        f2 += 1000 * 60 * 60 * 24;
        if ([6, 0].includes(new Date(f2).getDay()) || feriados.includes(f2))
          cont -= 1;
        cont += 1;
      }
      return new Date(f2).toISOString();
    }
    if (opcion == "DIAS_HABILES") {
      cont = 0;
      let f3 = new Date(fechaFin).getTime(); //+ (1000 * 60 * 60 * 24); sin incremento de 1 dia
      while (
        new Date(f2) < new Date(f3) //pra diferencias ede fechas en el mimso dia que cuente cero dias
      ) {
        if (![6, 0].includes(new Date(f2).getDay()) && !feriados.includes(f2)) {
          cont += 1;
        }
        f2 += 1000 * 60 * 60 * 24;
      }
      return cont.toString();
    }
  }
  incrementaFechaAsync(
    opcion: string,
    fechaIni: Date,
    fechaFin?: Date,
    incremento?: number
  ) {
    // console.log('incrementando',fechaIni,incremento,feriados);
    return new Promise((resolve, reject) => {
      // console.log('incrementando',fechaIni,incremento);
      let cont = 1;
      let f2 = new Date(fechaIni).getTime();
      this._sgp.feriados().subscribe(
        (result: any) => {
          const feriados = result.map((e) =>
            new Date(e.fecha_feriado).getTime()
          );
          if (opcion == "FECHA_FIN") {
            while (cont <= incremento) {
              // console.log("iniciando", cont, new Date(f2).toLocaleDateString(),feriados);
              f2 += 1000 * 60 * 60 * 24;
              if (
                [6, 0].includes(new Date(f2).getDay()) ||
                feriados.includes(f2)
              )
                cont -= 1;
              cont += 1;
            }
            resolve(new Date(f2).toLocaleDateString());
          }
          if (opcion == "DIAS_HABILES") {
            cont = 0;
            let f3 = new Date(fechaFin).getTime() + 1000 * 60 * 60 * 24;
            while (
              new Date(f2).toLocaleDateString() !=
              new Date(f3).toLocaleDateString()
            ) {
              if (
                ![6, 0].includes(new Date(f2).getDay()) &&
                !feriados.includes(f2)
              )
                cont += 1;
              f2 += 1000 * 60 * 60 * 24;
            }
            resolve(cont.toString());
          }
        },
        (error) => {
          reject(error.toString());
        }
      );
    });
  }

  DataTable(ClassTabla: any, NroCampo: number = 0, TipoOrden: string = "asc") {
    let CONFIGURACION_TABLA: any = {
      order: [[NroCampo, TipoOrden]],
      language: {
        sProcessing: "Procesando...",
        sLengthMenu: "Mostrar _MENU_ registros",
        sZeroRecords: "No se encontraron resultados",
        sEmptyTable: "Ningún dato disponible en esta tabla",
        sInfo:
          "Mostrando registros del _START_ al _END_ de un total de _TOTAL_",
        sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0",
        sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
        sInfoPostFix: "",
        sSearch: "Buscar:",
        sUrl: "",
        sInfoThousands: ",",
        sLoadingRecords: "Cargando...",
        oPaginate: {
          sFirst: "Primero",
          sLast: "Último",
          sNext: "Siguiente",
          sPrevious: "Anterior",
        },
        oAria: {
          sSortAscending:
            ": Activar para ordenar la columna de manera ascendente",
          sSortDescending:
            ": Activar para ordenar la columna de manera descendente",
        },
      },
      lengthMenu: [5, 10, 25, 50, 100],
    };
    $("." + ClassTabla).DataTable(CONFIGURACION_TABLA);
    $("." + ClassTabla)
      .parent()
      .addClass("table-responsive");
  }

  replaceSlash(cadena: string) {
    return cadena.replace("/", "*");
  }

  tranforSlash(cadena: string) {
    return cadena.replace("*", "/");
  }
  //"dom": '<"top"iflp<"clear">>rt<"bottom"iflp<"clear">>',

  CONFIGURACION_TABLA_RESPONSIVE(
    filtro: number[],
    PaginadorHead: boolean,
    CampoFiltro?: any,
    TipoFiltro?: any
  ) {
    let paginadorHeader: any;
    let CONFIGURACION_TABLA: any = {
      //responsive: true,
      order: [
        [
          CampoFiltro == null ? 0 : CampoFiltro,
          TipoFiltro == null ? "desc" : TipoFiltro,
        ],
      ],
      language: {
        sProcessing: "Procesando...",
        sLengthMenu: "Mostrar _MENU_ registros",
        sZeroRecords: "No se encontraron resultados",
        sEmptyTable: "Ningún dato disponible en esta tabla",
        sInfo:
          "Mostrando registros del _START_ al _END_ de un total de _TOTAL_",
        sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0",
        sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
        sInfoPostFix: "",
        sSearch: "Buscar:",
        sUrl: "",
        sInfoThousands: ",",
        sLoadingRecords: "Cargando...",
        oPaginate: {
          sFirst: "Primero",
          sLast: "Último",
          sNext: "Siguiente",
          sPrevious: "Anterior",
        },
        oAria: {
          sSortAscending:
            ": Activar para ordenar la columna de manera ascendente",
          sSortDescending:
            ": Activar para ordenar la columna de manera descendente",
        },
      },
      lengthMenu: filtro,
    };
    if (PaginadorHead) {
      paginadorHeader = '<"top"flp<"clear">>rt<"bottom"ip<"clear">>';
      CONFIGURACION_TABLA.dom = paginadorHeader;
    }

    return CONFIGURACION_TABLA;
  }
  CONFIGURACION_TABLA_V2(
    filtro: number[],
    PaginadorHead: boolean,
    CampoFiltro?: any,
    TipoFiltro?: any
  ) {
    let paginadorHeader: any;

    let CONFIGURACION_TABLA: any = {
      order: [
        [
          CampoFiltro == null ? 0 : CampoFiltro,
          TipoFiltro == null ? "desc" : TipoFiltro,
        ],
      ],
      language: {
        sProcessing: "Procesando...",
        sLengthMenu: "Mostrar _MENU_ registros",
        sZeroRecords: "No se encontraron resultados",
        sEmptyTable: "Ningún dato disponible en esta tabla",
        sInfo:
          "Mostrando registros del _START_ al _END_ de un total de _TOTAL_",
        sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0",
        sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
        sInfoPostFix: "",
        sSearch: "Buscar:",
        sUrl: "",
        sInfoThousands: ",",
        sLoadingRecords: "Cargando...",
        oPaginate: {
          sFirst: "Primero",
          sLast: "Último",
          sNext: "Siguiente",
          sPrevious: "Anterior",
        },
        oAria: {
          sSortAscending:
            ": Activar para ordenar la columna de manera ascendente",
          sSortDescending:
            ": Activar para ordenar la columna de manera descendente",
        },
      },
      lengthMenu: filtro,
      iDisplayLength: 10,
    };
    if (PaginadorHead) {
      paginadorHeader = '<"top"flp<"clear">>rt<"bottom"ip<"clear">>';
      CONFIGURACION_TABLA.dom = paginadorHeader;
    }

    return CONFIGURACION_TABLA;
  }
  CONFIGURACION_TABLA_V3(
    filtro: number[],
    PaginadorHead: boolean,
    displayreg?: any
  ) {
    let paginadorHeader: any;

    let CONFIGURACION_TABLA: any = {
      //"responsive": true,
      ordering: false,
      language: {
        sProcessing: "Procesando...",
        sLengthMenu: "Mostrar _MENU_ registros",
        sZeroRecords: "No se encontraron resultados",
        sEmptyTable: "Ningún dato disponible en esta tabla",
        sInfo:
          "Mostrando registros del _START_ al _END_ de un total de _TOTAL_",
        sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0",
        sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
        sInfoPostFix: "",
        sSearch: "Buscar:",
        sUrl: "",
        sInfoThousands: ",",
        sLoadingRecords: "Cargando...",
        oPaginate: {
          sFirst: "Primero",
          sLast: "Último",
          sNext: "Siguiente",
          sPrevious: "Anterior",
        },
        oAria: {
          sSortAscending:
            ": Activar para ordenar la columna de manera ascendente",
          sSortDescending:
            ": Activar para ordenar la columna de manera descendente",
        },
      },
      lengthMenu: filtro,
      iDisplayLength: displayreg == null ? 10 : displayreg,
    };
    if (PaginadorHead) {
      paginadorHeader = '<"top"flp<"clear">>rt<"bottom"ip<"clear">>';
      CONFIGURACION_TABLA.dom = paginadorHeader;
    }

    return CONFIGURACION_TABLA;
  }
  CONFIGURACION_TABLA_V4(
    filtro: number[],
    PaginadorHead: boolean,
    displayreg?: any,
    CampoFiltro?: any,
    TipoFiltro?: any
  ) {
    let paginadorHeader: any;

    let CONFIGURACION_TABLA: any = {
      order: [
        [
          CampoFiltro == null ? 0 : CampoFiltro,
          TipoFiltro == null ? "desc" : TipoFiltro,
        ],
      ],
      language: {
        sProcessing: "Procesando...",
        sLengthMenu: "Mostrar _MENU_ registros",
        sZeroRecords: "No se encontraron resultados",
        sEmptyTable: "Ningún dato disponible en esta tabla",
        sInfo:
          "Mostrando registros del _START_ al _END_ de un total de _TOTAL_",
        sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0",
        sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
        sInfoPostFix: "",
        sSearch: "Buscar:",
        sUrl: "",
        sInfoThousands: ",",
        sLoadingRecords: "Cargando...",
        oPaginate: {
          sFirst: "Primero",
          sLast: "Último",
          sNext: "Siguiente",
          sPrevious: "Anterior",
        },
        oAria: {
          sSortAscending:
            ": Activar para ordenar la columna de manera ascendente",
          sSortDescending:
            ": Activar para ordenar la columna de manera descendente",
        },
      },
      lengthMenu: filtro,
      iDisplayLength: displayreg == null ? 10 : displayreg,
    };
    if (PaginadorHead) {
      paginadorHeader = '<"top"flp<"clear">>rt<"bottom"ip<"clear">>';
      CONFIGURACION_TABLA.dom = paginadorHeader;
    }

    return CONFIGURACION_TABLA;
  }

  CONFIGURACION_TABLA_V5(
    filtro: number[],
    PaginadorHead: boolean,
    displayreg?: any,
    CampoFiltro?: any
  ) {
    let paginadorHeader: any;

    let CONFIGURACION_TABLA: any = {
      //"responsive": true,
      order: CampoFiltro,
      language: {
        sProcessing: "Procesando...",
        sLengthMenu: "Mostrar _MENU_ registros",
        sZeroRecords: "No se encontraron resultados",
        sEmptyTable: "Ningún dato disponible en esta tabla",
        sInfo:
          "Mostrando registros del _START_ al _END_ de un total de _TOTAL_",
        sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0",
        sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
        sInfoPostFix: "",
        sSearch: "Buscar:",
        sUrl: "",
        sInfoThousands: ",",
        sLoadingRecords: "Cargando...",
        oPaginate: {
          sFirst: "Primero",
          sLast: "Último",
          sNext: "Siguiente",
          sPrevious: "Anterior",
        },
        oAria: {
          sSortAscending:
            ": Activar para ordenar la columna de manera ascendente",
          sSortDescending:
            ": Activar para ordenar la columna de manera descendente",
        },
      },
      lengthMenu: filtro,
      iDisplayLength: displayreg == null ? 10 : displayreg,
    };
    if (PaginadorHead) {
      paginadorHeader = '<"top"flp<"clear">>rt<"bottom"ip<"clear">>';
      CONFIGURACION_TABLA.dom = paginadorHeader;
    }

    return CONFIGURACION_TABLA;
  }
  CONFIGURACION_TABLA_V6(
    filtro: number[],
    PaginadorHead: boolean,
    displayreg?: any,
    CampoFiltro?: any,
    Responsive?: any
  ) {
    let paginadorHeader: any;

    let CONFIGURACION_TABLA: any = {
      responsive: Responsive == null ? true : Responsive,
      autoWidth: false,
      order: CampoFiltro == null ? [0, "asc"] : CampoFiltro,
      language: {
        sProcessing: "Procesando...",
        sLengthMenu: "Mostrar _MENU_ registros",
        sZeroRecords: "No se encontraron resultados",
        sEmptyTable: "Ningún dato disponible en esta tabla",
        sInfo:
          "Mostrando registros del _START_ al _END_ de un total de _TOTAL_",
        sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0",
        sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
        sInfoPostFix: "",
        sSearch: "Buscar:",
        sUrl: "",
        sInfoThousands: ",",
        sLoadingRecords: "Cargando...",
        oPaginate: {
          sFirst: "Primero",
          sLast: "Último",
          sNext: "Siguiente",
          sPrevious: "Anterior",
        },
        oAria: {
          sSortAscending:
            ": Activar para ordenar la columna de manera ascendente",
          sSortDescending:
            ": Activar para ordenar la columna de manera descendente",
        },
      },
      lengthMenu: filtro,
      iDisplayLength: displayreg == null ? 10 : displayreg,
    };
    if (PaginadorHead) {
      paginadorHeader = '<"top"flp<"clear">>rt<"bottom"ip<"clear">>';
      CONFIGURACION_TABLA.dom = paginadorHeader;
    }

    return CONFIGURACION_TABLA;
  }
  CONFIGURACION_TABLA_V7(
    filtro: number[],
    PaginadorHead: boolean,
    displayreg?: any,
    EstadoFiltro?: any,
    CampoFiltro?: any,
    Responsive?: any,
    ConfiguracionColumnas?: any
  ) {
    let paginadorHeader: any;

    let CONFIGURACION_TABLA: any = {
      responsive: Responsive == null ? true : Responsive,
      autoWidth: false,
      ordering: EstadoFiltro == null ? false : EstadoFiltro,
      order: CampoFiltro == null ? [0, "asc"] : CampoFiltro,
      language: {
        sProcessing: "Procesando...",
        sLengthMenu: "Mostrar _MENU_ registros",
        sZeroRecords: "No se encontraron resultados",
        sEmptyTable: "Ningún dato disponible en esta tabla",
        sInfo:
          "Mostrando registros del _START_ al _END_ de un total de _TOTAL_",
        sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0",
        sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
        sInfoPostFix: "",
        sSearch: "Buscar:",
        sUrl: "",
        sInfoThousands: ",",
        sLoadingRecords: "Cargando...",
        oPaginate: {
          sFirst: "Primero",
          sLast: "Último",
          sNext: "Siguiente",
          sPrevious: "Anterior",
        },
        oAria: {
          sSortAscending:
            ": Activar para ordenar la columna de manera ascendente",
          sSortDescending:
            ": Activar para ordenar la columna de manera descendente",
        },
      },
      lengthMenu: filtro,
      iDisplayLength: displayreg == null ? 10 : displayreg,
      columnDefs: ConfiguracionColumnas == null ? [] : ConfiguracionColumnas,
      //columnDefs: [{ visible: false, targets: 0 }],
    };
    if (PaginadorHead) {
      paginadorHeader = '<"top"flp<"clear">>rt<"bottom"ip<"clear">>';
      CONFIGURACION_TABLA.dom = paginadorHeader;
    }

    return CONFIGURACION_TABLA;
  }
  CONFIGURACION_TABLA_V8(
    filtro: number[],
    PaginadorHead: boolean,
    displayreg?: any,
    EstadoFiltro?: any,
    CampoFiltro?: any,
    Responsive?: any,
    Paginacion?: any,
    Buscador?: any
  ) {
    let paginadorHeader: any;

    let CONFIGURACION_TABLA: any = {
      paging: Paginacion == null ? false : Paginacion,
      searching: Buscador == null ? false : Buscador,
      bInfo: false,
      responsive: Responsive == null ? true : Responsive,
      autoWidth: false,
      ordering: EstadoFiltro == null ? false : EstadoFiltro,
      order: CampoFiltro == null ? [0, "asc"] : CampoFiltro,
      language: {
        sProcessing: "Procesando...",
        sLengthMenu: "Mostrar _MENU_ registros",
        sZeroRecords: "No se encontraron resultados",
        sEmptyTable: "Ningún dato disponible en esta tabla",
        sInfo:
          "Mostrando registros del _START_ al _END_ de un total de _TOTAL_",
        sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0",
        sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
        sInfoPostFix: "",
        sSearch: "Buscar:",
        sUrl: "",
        sInfoThousands: ",",
        sLoadingRecords: "Cargando...",
        oPaginate: {
          sFirst: "Primero",
          sLast: "Último",
          sNext: "Siguiente",
          sPrevious: "Anterior",
        },
        oAria: {
          sSortAscending:
            ": Activar para ordenar la columna de manera ascendente",
          sSortDescending:
            ": Activar para ordenar la columna de manera descendente",
        },
      },
      lengthMenu: filtro,
      iDisplayLength: displayreg == null ? 10 : displayreg,
    };
    if (PaginadorHead) {
      paginadorHeader = '<"top"flp<"clear">>rt<"bottom"ip<"clear">>';
      CONFIGURACION_TABLA.dom = paginadorHeader;
    }

    return CONFIGURACION_TABLA;
  }
  /******************************************************************** */
  /* FILTROS SELECT Y INPUT EN UNA TABLA
  /******************************************************************** */
  selectTable(table, col) {
    table.columns(col).every(function () {
      var column = this;
      var select = $(
        '<select style="width: 100px;"><option value="" ></option></select>'
      )
        .appendTo($(column.footer()).empty())
        .on("change", function () {
          var val = $.fn.dataTable.util.escapeRegex($(this).val());

          column.search(val ? "^" + val + "$" : "", true, false).draw();
        });

      column
        .data()
        .unique()
        .sort()
        .each(function (d, j) {
          select.append('<option value="' + d + '" >' + d + "</option>");
        });
    });
  }
  inputTable(table, col) {
    table.columns(col).every(function () {
      var column = this;
      var select = $(
        '<input type="text" placeholder="Buscar" style="width: 100px;"/>'
      )
        .appendTo($(column.footer()).empty())
        .on("keyup change clear", function () {
          column.search(this.value).draw();
        });
      column
        .data()
        .unique()
        .sort()
        .each(function (d, j) {
          select.append('<input value="' + d + '"  style="width: 100px;"/>');
        });
    });
  }
  totalTable(table, col) {
    var dtsTotales = [];
    col.forEach((element, i) => {
      table.columns(element).every(function () {
        var api = this;
        // Remove the formatting to get integer data for summation
        var intVal = function (i) {
          var num;
          if (typeof i === "string") {
            num = i.replace(/[\$\.]/g, "");
            num = num.replace(/,/g, ".");
          } else {
            num = i;
          }

          return parseFloat(num);
        };

        // Total over all pages
        var total = api
          .column(element)
          .data()
          .reduce(function (a, b) {
            return intVal(a) + intVal(b);
          }, 0);

        // Update footer
        $(api.column(element).footer()).html(
          "<strong>" + total.toLocaleString("es-ES") + "</strong>"
        );
        dtsTotales[i] = Number.parseFloat(total).toFixed(2);
      });
    });
    return dtsTotales;
  }
  subtotal_totalTable(table, col) {
    table.columns(col).every(function () {
      var api = this;
      // Remove the formatting to get integer data for summation
      var intVal = function (i) {
        var num;
        if (typeof i === "string") {
          num = i.replace(/[\$\.]/g, "");
          num = num.replace(/,/g, ".");
        } else {
          num = i;
        }
        return parseFloat(num);
      };

      // Total over all pages
      var total = api
        .column(col)
        .data()
        .reduce(function (a, b) {
          return intVal(a) + intVal(b);
        }, 0);

      // Total over this page
      var pageTotal = api
        .column(col, { page: "current" })
        .data()
        .reduce(function (a, b) {
          return intVal(a) + intVal(b);
        }, 0);

      // Update footer
      $(api.column(col).footer()).html(
        "<strong>" + pageTotal + "Sub Total (" + total + " total)</strong>"
      );
    });
  }
  /******************************************************************** */
  /*LIMPIA & DESTRUYE TABLA*/
  /******************************************************************** */
  limpiatabla(nombre_tabla) {
    $(nombre_tabla).dataTable().fnClearTable();
    $(nombre_tabla).dataTable().fnDestroy();
  }

  /**************************************************************************
   codifica y decodifica base 64 SIPTA
   *************************************************************************/

  base64Encode(cadena) {
    let result = "";

    if (cadena === null || cadena === undefined || cadena === "") {
      result = "NULL";
    } else {
      result = cadena;
    }
    return btoa(unescape(encodeURIComponent(result)));
    //return encodeURIComponent(btoa(unescape(result)));
  }
  base64Decode(cadena) {
    let result = "";
    cadena = decodeURIComponent(escape(atob(cadena)));
    //cadena=atob(escape(decodeURIComponent(cadena)));
    if (cadena === "NULL") {
      result = "";
    } else {
      result = cadena;
    }
    return result;
  }

  textoUpper(cadena) {
    if (cadena != undefined) {
      cadena = cadena.toString().toUpperCase();
      cadena = cadena.replace(/–/gi, "-");
      cadena = cadena.replace(/%/gi, "®");
      cadena = cadena.replace("Ñ", "£");
      cadena = cadena.replace("ñ", "¢");
    } else {
      cadena = "";
    }
    return this.base64Encode(cadena);
  }
  textoNormal(cadena) {
    if (cadena != undefined) {
      cadena = cadena.toString();
      cadena = cadena.replace(/–/gi, "-");
      cadena = cadena.replace(/%/gi, "®");
      cadena = cadena.replace("Ñ", "£");
      cadena = cadena.replace("ñ", "¢");
    } else {
      cadena = "";
    }
    return this.base64Encode(cadena);
  }

  base64EncodeArray(datos: any) {
    var lineas = datos.length;
    let result = "";
    for (var i = 0; i < lineas; i++) {
      for (var atributo in datos[i]) {
        datos[i][atributo] = this.textoNormal(datos[i][atributo]);
      }
    }

    return datos;
  }
  base64EncodeArrayUpper(datos: any) {
    var lineas = datos.length;
    let result = "";
    for (var i = 0; i < lineas; i++) {
      for (var atributo in datos[i]) {
        datos[i][atributo] = this.textoUpper(datos[i][atributo]);
      }
    }

    return datos;
  }
  redondearExp(numero, digitos, masEspaciado = false) {
    function toExp(numero, digitos) {
      let arr = numero.toString().split("e");
      let mantisa = arr[0],
        exponente = digitos;
      if (arr[1]) exponente = Number(arr[1]) + digitos;
      return Number(mantisa + "e" + exponente.toString());
    }
    let absNumero = Math.abs(numero);
    let signo = Math.sign(numero);
    if (masEspaciado) {
      let n = Math.floor(Math.log2(absNumero));
      let spacing = Math.pow(2, n) * Number.EPSILON;
      if (spacing < Math.pow(10, -digitos - 1)) {
        absNumero += spacing;
      }
    }
    let entero = Math.round(toExp(absNumero, digitos));
    return signo * toExp(entero, -digitos);
  }
  /*********************************************************
   * OBTIENE LA EXTENSION DE UN ARCHIVO
   **********************************************************/
  nombre_extension(dato) {
    return dato.slice(((dato.lastIndexOf(".") - 1) >>> 0) + 2);
  }
  /*VALIDA FECHA CON MOMENT*/
  formatoFechaMoment(dato: any) {
    var resultado;
    resultado = dato == "" ? "" : moment(dato).format("DD/MM/YYYY");

    return resultado;
  }
  /*********************************************************
   * VALIDAR COORDENADAS GEOGRAFICAS
   ********************************************************/

  isValidCoordinates(coordinates) {
    const [latitude, longitude] = coordinates.split(";");

    if (!latitude.match(/^[-]?\d+[\.]?\d*$/)) {
      return false;
    }
    if (!longitude.match(/^[-]?\d+[\.]?\d*$/)) {
      return false;
    }

    //var lat=latitude.replace(",",".");
    //var lon=longitude.replace(",",".");
    //console.log('latitud es numero',isNaN(Number.parseFloat(latitude)));
    //console.log('longitud es numero',isNaN(Number.parseFloat(longitude)));

    return (
      latitude > -90 && latitude < 90 && longitude > -180 && longitude < 180
    );
  }

  /*****************monto aliteral************/
  /*******************************************/
  numeroAMontoLiteral(num: number) {
    function Unidades(num) {
      switch (num) {
        case 1:
          return "UN";
        case 2:
          return "DOS";
        case 3:
          return "TRES";
        case 4:
          return "CUATRO";
        case 5:
          return "CINCO";
        case 6:
          return "SEIS";
        case 7:
          return "SIETE";
        case 8:
          return "OCHO";
        case 9:
          return "NUEVE";
      }

      return "";
    }

    function Decenas(num) {
      const decena = Math.floor(num / 10);
      const unidad = num - decena * 10;

      switch (decena) {
        case 1:
          switch (unidad) {
            case 0:
              return "DIEZ";
            case 1:
              return "ONCE";
            case 2:
              return "DOCE";
            case 3:
              return "TRECE";
            case 4:
              return "CATORCE";
            case 5:
              return "QUINCE";
            default:
              return "DIECI" + Unidades(unidad);
          }
        case 2:
          switch (unidad) {
            case 0:
              return "VEINTE";
            default:
              return "VEINTI" + Unidades(unidad);
          }
        case 3:
          return DecenasY("TREINTA", unidad);
        case 4:
          return DecenasY("CUARENTA", unidad);
        case 5:
          return DecenasY("CINCUENTA", unidad);
        case 6:
          return DecenasY("SESENTA", unidad);
        case 7:
          return DecenasY("SETENTA", unidad);
        case 8:
          return DecenasY("OCHENTA", unidad);
        case 9:
          return DecenasY("NOVENTA", unidad);
        case 0:
          return Unidades(unidad);
      }
    }

    function DecenasY(strSin, numUnidades) {
      if (numUnidades > 0) return strSin + " Y " + Unidades(numUnidades);

      return strSin;
    }

    function Centenas(num) {
      const centenas = Math.floor(num / 100);
      const decenas = num - centenas * 100;

      switch (centenas) {
        case 1:
          if (decenas > 0) return "CIENTO " + Decenas(decenas);
          return "CIEN";
        case 2:
          return "DOSCIENTOS " + Decenas(decenas);
        case 3:
          return "TRESCIENTOS " + Decenas(decenas);
        case 4:
          return "CUATROCIENTOS " + Decenas(decenas);
        case 5:
          return "QUINIENTOS " + Decenas(decenas);
        case 6:
          return "SEISCIENTOS " + Decenas(decenas);
        case 7:
          return "SETECIENTOS " + Decenas(decenas);
        case 8:
          return "OCHOCIENTOS " + Decenas(decenas);
        case 9:
          return "NOVECIENTOS " + Decenas(decenas);
      }

      return Decenas(decenas);
    }

    function Seccion(num, divisor, strSingular, strPlural) {
      const cientos = Math.floor(num / divisor);
      const resto = num - cientos * divisor;

      let letras = "";

      if (cientos > 0)
        if (cientos > 1) letras = Centenas(cientos) + " " + strPlural;
        else letras = strSingular;

      if (resto > 0) letras += "";

      return letras;
    }

    function Miles(num) {
      const divisor = 1000;
      const cientos = Math.floor(num / divisor);
      let resto = num - cientos * divisor;

      let strMiles = Seccion(num, divisor, "UN MIL", "MIL");
      let strCentenas = Centenas(resto);

      if (strMiles == "") return strCentenas;

      return strMiles + " " + strCentenas;
    }

    function Millones(num) {
      const divisor = 1000000;
      const cientos = Math.floor(num / divisor);
      let resto = num - cientos * divisor;

      let strMillones = Seccion(num, divisor, "UN MILLON", "MILLONES");
      let strMiles = Miles(resto);

      if (strMillones == "") return strMiles;

      return strMillones + " " + strMiles;
    }

    const data = {
      numero: num,
      enteros: Math.floor(num),
      centavos: Math.round(num * 100) - Math.floor(num) * 100,
      letrasCentavos: "",
      letrasMonedaPlural: "Bolivianos",
      letrasMonedaSingular: "Boliviano",

      letrasMonedaCentavoPlural: "CENTAVOS",
      letrasMonedaCentavoSingular: "CENTAVO",
    };

    if (data.centavos > 0) {
      data.letrasCentavos =
        "CON " +
        (function () {
          if (data.centavos == 1)
            return (
              Millones(data.centavos) + " " + data.letrasMonedaCentavoSingular
            );
          else
            return (
              Millones(data.centavos) + " " + data.letrasMonedaCentavoPlural
            );
        })();
    }

    if (data.enteros == 0)
      return "CERO " + data.letrasMonedaPlural + " " + data.letrasCentavos;
    if (data.enteros == 1)
      return (
        Millones(data.enteros) +
        " " +
        data.letrasMonedaSingular +
        " " +
        data.letrasCentavos
      );
    else
      return (
        Millones(data.enteros) +
        " " +
        data.letrasMonedaPlural +
        " " +
        data.letrasCentavos
      );
  }
}
