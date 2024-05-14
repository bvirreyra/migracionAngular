import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Inputmask from "inputmask";
import { Globals } from "../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { FinancieraService } from "../../financiera/financiera.service";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-asignacionpresupuesto",
  templateUrl: "./asignacionpresupuesto.component.html",
  styleUrls: ["./asignacionpresupuesto.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    FinancieraService,
  ],
})
export class AsignacionpresupuestoComponent implements OnInit {
  /*VARIABLES PARA MASCARAS */
  public mask_numerodecimal: any;
  public mask_fecha: any;
  public mask_numero: any;
  public mask_gestion: any;
  public mask_miles: any;

  //variables para el compononete de mensajes
  public prop_msg: string;
  public prop_tipomsg: string;

  //variables de session y iniciales
  public s_idcon: string;
  public s_idmod: string;
  public s_idrol: number;
  public s_user: string;
  public s_id_user: string;
  public s_nomuser: string;

  public url: string;
  public urlApi: string;
  public url_reporte: string;
  public errorMessage: string;
  public fechasrv: string;

  public dtsDatosConexion: any;
  public dtsFechaSrv: any;
  public dtsFechaLiteral: any;
  public dtsHoraSrv: any;
  public dtsAnio: any;
  public s_imgLogo: any;

  /*paneles*/

  public pnlFormulario = false;
  public pnlGridView = false;

  /*variables del componente*/

  public dts_listabandeja_fichatecnica: any;
  public dts_listabandeja_fichatecnica_semilla: any;
  public dts_listapresupuestoasignado: any;
  public dts_departamentos: any;
  public dts_municipios: any;

  public m_idproy: any;
  public m_idpresupuesto: any;
  public m_gestion: any;
  public m_presupuesto: any;
  public m_departamento: any;
  public m_municipio: any;
  public m_nombreproyecto: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _financiera: FinancieraService,

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
    this.url_reporte = globals.rutaSrvReportes;
  }

  ngOnInit() {
    $("#pnl_gridview1").show();
    $("#pnl_gridview2").hide();
    $("#pnl_formulario").hide();
    this.mask_numerodecimal = new Inputmask("9{1,9}.9{1,2}");
    this.mask_fecha = new Inputmask("9{1,2}/9{1,2}/9{1,4}");
    this.mask_numero = new Inputmask("9{1,9}");
    this.mask_gestion = new Inputmask("9999");

    function falloCallback(error) {
      console.log("Falló con " + error);
    }

    this.DatosConexion()
      .then((dts1) => {
        this.dtsDatosConexion = dts1;
        //console.log(this.dtsDatosConexion);
        this.cargarmascaras();
        return this.FechaServidor();
      })
      .then((dts2) => {
        this.dtsFechaSrv = dts2[0]["fechasrv"];
        this.dtsHoraSrv = this.transformHora(this.dtsFechaSrv);
        // this.m_gestion = this.dtsFechaSrv.substr(0, 4);
        console.log("año", this.m_gestion);
        return this.FechaLiteral(dts2[0]["fechasrv"]);
      })
      .then((dts3) => {
        this.dtsFechaLiteral = dts3;
      })
      .catch(falloCallback);

    this.ListaBandejaFichaTecnica();
    this.ListaDepartamentos();
    this.m_departamento = 0;
    this.m_municipio = 0;
  }
  /*******************************************************************************/
  /*MASCARAS
  /*******************************************************************************/
  cargarmascaras() {
    var gestion = document.getElementById("m_gestion");
    this.mask_gestion.mask(gestion);
    var presupuesto = document.getElementById("m_presupuesto");
    this.mask_numerodecimal.mask(presupuesto);
    // var hojaruta = document.getElementById("nrohojaderuta");
    // var fecha = document.getElementById("fecha");
    // var fecha_respuesta = document.getElementById("fecharespuesta");
    // this.mask_gestion.mask(gestion);
    // this.mask_numero.mask(hojaruta);
    // this.mask_fecha.mask(fecha);
    // this.mask_fecha.mask(fecha_respuesta);
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
            
            console.log("aqui1", result);
            if (Array.isArray(result) && result.length > 0) {
              if (result[0]["_idrol"] != "") {
                this.s_idrol = result[0]["_idrol"];
                this.s_user = result[0]["_usu_user"];
                this.s_id_user = result[0]["_usu_id"];
                this.s_nomuser = result[0]["_usu_nom_com"];
                console.log("aqui", this.s_idrol);
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
  paneles(string) {
    if (string == "FORMULARIO") {
      $("#pnl_gridview1").hide();
      $("#pnl_gridview2").hide();
      $("#pnl_formulario").show();

      this.limpiar();
      //$('#btnRegistrar').show();
      // $('#nombreproyecto').attr('disabled', false);
      // $('#codigo_sisin').attr('disabled', false);
      // $("input:text").each(function () {
      //   $($(this)).val('');
      // });

      //this.m_gestion='2222'
    }

    if (string == "VER_GRIDVIEW1") {
      $("#pnl_gridview1").show();
      $("#pnl_gridview2").hide();
      $("#pnl_formulario").hide();
      // $('#btnRegistrar').hide();
      $("#nombreproyecto").attr("disabled", true);
      $("#codigo_sisin").attr("disabled", true);
      // $("input:text").each(function () {
      //   $($(this)).val('');
      // });
      this.limpiar();
    }
    if (string == "VER_GRIDVIEW2") {
      $("#pnl_gridview1").hide();
      $("#pnl_gridview2").show();
      $("#pnl_formulario").hide();
      //$('#btnRegistrar').hide();
      $("#nombreproyecto").attr("disabled", true);
      $("#codigo_sisin").attr("disabled", true);
      // $("input:text").each(function () {
      //   $($(this)).val('');
      // });
      this.limpiar();
    }
  }
  limpiar() {
    // this.dts_responsables=[];
    // this.m_nombreproyecto="";
    // this.m_codigo_sisin="";
    // this.m_idseg = "";
    // this.m_nombreproyecto ="";
    // this.m_codigo_sisin ="";
    // this.m_estadoproyecto ="";
    // this.m_acciones ="";
    // this.m_plazosolucion ="";
    // this.m_avanceacumulado ="";
    // this.m_mes ="";
    // this.m_monto ="";
    // this.m_detallec31="";
    // $('#m_gestion').val('');
    // $('#m_presupuesto').val('');
    // setTimeout(() => {
    //   $('#m_gestion').focus();
    // }, 10);
    this.m_presupuesto = "";
  }
  ListaBandejaFichaTecnica() {
    this._financiera.get_bandejafichatecnica().subscribe(
      (result: any) => {
        

        if (Array.isArray(result) && result.length > 0) {
          this.dts_listabandeja_fichatecnica =
            this._fun.RemplazaNullArray(result);
          this.dts_listabandeja_fichatecnica_semilla =
            this.dts_listabandeja_fichatecnica;
          this._fun.limpiatabla(".dt-ListaFichaTecnica");
          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V3(
              [20, 40, 60, 100],
              false
            );
            var table = $(".dt-ListaFichaTecnica").DataTable(confiTable);
            this._fun.inputTable(table, [0, 6]);
            this._fun.selectTable(table, [1, 2, 3, 4, 7, 10]);
          }, 500);
        } else {
          this.prop_msg = "Alerta: No existen registros";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      }
    );
  }
  lista_presupuestos(dts: any) {
    var id_proy = dts.id;
    this.m_nombreproyecto = dts.nombre_proyecto_compromiso;
    this.paneles("VER_GRIDVIEW2");
    console.log("entra");
    var table = $("#ListaPresupuestoAsignado").DataTable();
    table.clear().destroy();
    this.ListaPresupuestoAsignado(id_proy);
  }
  ListaPresupuestoAsignado(id_proy: any) {
    this._financiera.get_listapresupuestoasignado(id_proy).subscribe(
      (result: any) => {
        
        this.m_idproy = id_proy;
        console.log("dts", result);
        if (Array.isArray(result) && result.length > 0) {
          this.dts_listapresupuestoasignado =
            this._fun.RemplazaNullArray(result);
          let confiTable = this._fun.CONFIGURACION_TABLA_V3(
            [10, 20, 50, 100],
            false
          );
          setTimeout(() => {
            if ($.fn.dataTable.isDataTable(".dt-seguimiento")) {
              // No hace Nada xq ya tiene la Configuracion establecida
            } else {
              $(".dt-ListaPresupuestoAsignado").DataTable(confiTable);
            }
          }, 500);
        } else {
          this.prop_msg =
            "Alerta: No existen registros con el criterio de busqueda";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      }
    );
  }
  PreInsertarPresupuesto() {
    $("#modalFormulario").modal("show");
    $("#btnRegistrarPresupuesto").show();
    $("#btnEditarPresupuesto").hide();
    this.m_gestion = this.dtsFechaSrv.substr(0, 4);

    this.limpiar();
  }
  PreEditarPresupuesto(dts: any) {
    console.log("dtsm", dts);
    $("#modalFormulario").modal("show");
    $("#btnRegistrarPresupuesto").hide();
    $("#btnEditarPresupuesto").show();
    this.m_idpresupuesto = dts.id;

    setTimeout(() => {
      this.m_gestion = dts.gestion.toString();
      this.m_presupuesto = dts.presupuesto.toString();
    }, 10);
  }
  InsertarPresupuesto() {
    this._financiera
      .get_insertapresupuestoasignado(
        this.m_idproy,
        this.m_gestion,
        this.m_presupuesto,
        this.s_id_user
      )
      .subscribe(
        (result: any) => {
          
          $("#modalFormulario").modal("hide");
          console.log("dts", result);
          if (Array.isArray(result) && result.length > 0) {
            this.dts_listapresupuestoasignado =
              this._fun.RemplazaNullArray(result);
            let confiTable = this._fun.CONFIGURACION_TABLA_V3(
              [10, 20, 50, 100],
              false
            );
            setTimeout(() => {
              if ($.fn.dataTable.isDataTable(".dt-ListaPresupuestoAsignado")) {
                // No hace Nada xq ya tiene la Configuracion establecida
              } else {
                $(".dt-ListaPresupuestoAsignado").DataTable(confiTable);
              }
            }, 500);
          } else {
            this.prop_msg = "Alerta: No existen registros";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        }
      );
  }
  EditarPresupuesto() {
    this._financiera
      .get_editapresupuestoasignado(
        this.m_idpresupuesto,
        this.m_idproy,
        this.m_gestion,
        this.m_presupuesto,
        this.s_id_user
      )
      .subscribe(
        (result: any) => {
          
          $("#modalFormulario").modal("hide");
          console.log("dts", result);
          if (Array.isArray(result) && result.length > 0) {
            this.dts_listapresupuestoasignado =
              this._fun.RemplazaNullArray(result);
            let confiTable = this._fun.CONFIGURACION_TABLA_V3(
              [10, 20, 50, 100],
              false
            );
            setTimeout(() => {
              if ($.fn.dataTable.isDataTable(".dt-ListaPresupuestoAsignado")) {
                // No hace Nada xq ya tiene la Configuracion establecida
              } else {
                $(".dt-ListaPresupuestoAsignado").DataTable(confiTable);
              }
            }, 500);
          } else {
            this.prop_msg = "Alerta: No existen registros";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        }
      );
  }
  EliminaPresupuesto(id_presupuesto: any) {
    this._financiera
      .get_eliminapresupuestoasignado(
        id_presupuesto,
        this.m_idproy,
        this.s_id_user
      )
      .subscribe(
        (result: any) => {
          
          $("#modalFormulario").modal("hide");
          console.log("dts", result);
          if (Array.isArray(result) && result.length > 0) {
            this.dts_listapresupuestoasignado =
              this._fun.RemplazaNullArray(result);
            let confiTable = this._fun.CONFIGURACION_TABLA_V3(
              [10, 20, 50, 100],
              false
            );
            setTimeout(() => {
              if ($.fn.dataTable.isDataTable(".dt-ListaPresupuestoAsignado")) {
                // No hace Nada xq ya tiene la Configuracion establecida
              } else {
                $(".dt-ListaPresupuestoAsignado").DataTable(confiTable);
              }
            }, 500);
          } else {
            this.prop_msg = "Alerta: No existen registros";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        }
      );
  }
  ListaDepartamentos() {
    this._financiera.get_listadepartamentos().subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_departamentos = this._fun.RemplazaNullArray(result);
        } else {
          this.prop_msg = "Alerta: No existen registros";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      }
    );
  }
  ListaMunicipios(departamento: any) {
    var table = $("#tblFT").DataTable();
    table.destroy();
    this._financiera.get_listamunicipios().subscribe(
      (result: any) => {
        

        if (Array.isArray(result) && result.length > 0) {
          this.dts_municipios = this._fun.RemplazaNullArray(result);
          this.dts_municipios = this.dts_municipios.filter(
            (item) => item.departamento === departamento
          );
          this.dts_listabandeja_fichatecnica =
            this.dts_listabandeja_fichatecnica_semilla.filter(
              (item) => item.departamento === departamento
            );
          var a = setTimeout(() => {
            this.LimpiaInicializaDataTable();
          }, 10);
        } else {
          this.prop_msg = "Alerta: No existen registros";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      }
    );
  }
  bandejafichatecnica() {
    var table = $("#tblFT").DataTable();
    table.destroy();
    this.dts_listabandeja_fichatecnica =
      this.dts_listabandeja_fichatecnica_semilla;
    setTimeout(() => {
      this.LimpiaInicializaDataTable();
    }, 10);
    this.m_departamento = 0;
    this.m_municipio = 0;
  }
  LimpiaInicializaDataTable() {
    let confiTable = this._fun.CONFIGURACION_TABLA_V3([10, 20, 50, 100], false);
    $("#tblFT").DataTable(confiTable);
  }
  FiltroMunicipio(municipio) {
    var table = $("#tblFT").DataTable();
    table.destroy();
    this.dts_listabandeja_fichatecnica =
      this.dts_listabandeja_fichatecnica_semilla.filter(
        (item) => item.municipio === municipio
      );
    setTimeout(() => {
      this.LimpiaInicializaDataTable();
    }, 10);
  }
}
