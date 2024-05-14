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
  selector: "app-seguimientofisicofinanciero",
  templateUrl: "./seguimientofisicofinanciero.component.html",
  styleUrls: ["./seguimientofisicofinanciero.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    FinancieraService,
  ],
})
export class SeguimientofisicofinancieroComponent implements OnInit {
  /*VARIABLES PARA MASCARAS */
  public mask_numerodecimal: any;
  public mask_fecha: any;
  public mask_numero: any;
  public mask_gestion: any;

  //variables para el compononete de mensajes
  public prop_msg: string;
  public prop_tipomsg: string;

  //variables de session y iniciales
  public s_idcon: string;
  public s_idmod: string;
  public s_idrol: number;
  public s_user: string;
  public s_nomuser: string;
  public s_usu_id: string;
  public dts_roles_usuario: any;

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

  public m_gestion: any;
  public m_mes_actual: any;

  /*paneles*/

  public pnlFormularioRegistrar = false;
  public pnlGridView = false;
  public pnl_formulario2 = false;

  /*variables del componente*/

  public m_nombresponsable: any;
  public m_cargoresponsable: any;
  public m_nombreproyecto: any;
  public m_idseg: any;
  public m_idseg_detalle: any;
  public m_estadoproyecto: any;
  public m_acciones: any;
  public m_plazosolucion: any;
  public m_avanceacumulado: any;
  public m_mes: any;
  public m_monto: any;
  public m_detallec31: any;
  public m_codigo_sisin: any;
  public m_departamento: any;
  public m_provincia: any;
  public m_municipio: any;

  public dts_departamento: any;
  public dts_provincia: any;
  public dts_municipio: any;
  public dts_provinciafiltrada: any;
  public dts_municipiofiltrado: any;
  public dts_responsables: any;
  public dts_seguimiento: any;
  public dts_seguimiento_mes: any;

  /*VARIABLEA PARA LA ADMINITRACION POR ROLES*/
  public vbtn_NuevoProyecto = false;
  public vbtn_EditaProyecto = false;
  public vbtn_NuevoSeguimiento = false;
  public vbtn_EditaSeguimiento = false;
  public vpanel_Tecnico = false;
  public vpanel_Financiero = false;
  public vusrAdministrador = false;

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
    this.paneles("VER_GRIDVIEW");

    function falloCallback(error) {
      console.log("Falló con " + error);
    }
    this.mask_numerodecimal = new Inputmask("9{1,9}.9{1,2}");
    this.mask_fecha = new Inputmask("9{1,2}/9{1,2}/9{1,4}");
    this.mask_numero = new Inputmask("9{1,9}");
    this.mask_gestion = new Inputmask("9999");

    this.listaDepartamento();
    this.listaProvincia();
    this.listaMunicipio();

    this.DatosConexion()
      .then((dts1) => {
        this.dtsDatosConexion = dts1;

        return this.FechaServidor();
      })
      .then((dts2) => {
        this.dtsFechaSrv = dts2[0]["fechasrv"];
        this.dtsHoraSrv = this.transformHora(this.dtsFechaSrv);
        this.m_gestion = this.dtsFechaSrv.substr(0, 4);
        this.m_mes_actual = this.dtsFechaSrv.substr(5, 2);
        return this.FechaLiteral(dts2[0]["fechasrv"]);
      })
      .then((dts3) => {
        this.dtsFechaLiteral = dts3;
      })
      .then((dts) => {
        return this.RolesAsignados(this.dtsDatosConexion[0]._usu_id);
      })
      .then((dts) => {
        this.dts_roles_usuario = dts;
        this.manejoRoles();
      })
      .catch(falloCallback);

    this.consulta_seguimiento();
  }
  /*******************************************************************************/
  /*MASCARAS
  /*******************************************************************************/
  cargarmascaras() {
    var monto = document.getElementById("monto");
    this.mask_numerodecimal.mask(monto);
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
              if (result[0]["_idrol"] != "") {
                this.s_idrol = result[0]["_idrol"];
                this.s_user = result[0]["_usu_user"];
                this.s_nomuser = result[0]["_usu_nom_com"];
                this.s_usu_id = result[0]["_usu_id"];
                resolve(result);
                return result;
              }
            } else {
              this.prop_msg =
                "Error: La conexion no es valida2, contáctese con el área de sistemas";
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
                "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas1";
              this.prop_tipomsg = "danger";
              this._msg.formateoMensaje("modal_danger", this.prop_msg);
            }
            reject(this.prop_msg);
          }
        );
    });
  }
  RolesAsignados(usu_id) {
    return new Promise((resolve, reject) => {
      this._autenticacion.rolesasignados(usu_id).subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            resolve(result);
          } else {
            this.prop_msg =
              "Error: La conexion no es valida1, contáctese con el área de sistemas";
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
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas2";
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
  manejoRoles() {
    var lineas = this.dts_roles_usuario.length;
    var datos = this.dts_roles_usuario;
    for (var i = 0; i < lineas; i++) {
      var rol = datos[i].idrol;
      if (rol == 4) {
        // rol 4 adminitrador financiera
        this.vbtn_NuevoProyecto = true;
        this.vbtn_EditaProyecto = true;
      }
      if (rol == 5) {
        // rol 5 tecnico
        this.vbtn_EditaSeguimiento = true;
        this.vpanel_Tecnico = true;
      }
      if (rol == 6) {
        // rol 6 financiera sisin
        this.vbtn_NuevoSeguimiento = true;
        this.vbtn_EditaSeguimiento = true;
        this.vpanel_Financiero = true;
      }
      if (rol == 14) {
        this.vusrAdministrador = true;
        this.vbtn_NuevoProyecto = true;
        this.vbtn_EditaProyecto = true;
        this.vbtn_EditaSeguimiento = true;
        this.vpanel_Tecnico = true;
        this.vbtn_NuevoSeguimiento = true;
        this.vbtn_EditaSeguimiento = true;
        this.vpanel_Financiero = true;
      }
    }
  }
  paneles(string) {
    if (string == "NUEVA_FICHA") {
      $("#pnl_gridview").hide();
      $("#pnl_gridview_bandeja").hide();
      $("#pnl_formulario").show();
      $("#pnl_formulario_bandeja").hide();
      $("#btnRegistrar").show();
      $("#btnActualizar").hide();
      $("#nombreproyecto").attr("disabled", false);
      $("#codigo_sisin").attr("disabled", false);
      // $("input:text").each(function () {
      //   $($(this)).val('');
      // });
      this.limpiar();
    }
    if (string == "NUEVO_SEGUIMIENTO") {
      $("#pnl_gridview").hide();
      $("#pnl_gridview_bandeja").hide();
      $("#pnl_formulario").hide();
      $("#pnl_formulario_bandeja").show();
      $("#btnRegistrarDetalle").show();
      $("#btnActualizarDetalle").hide();
      $("#nombreproyecto").attr("disabled", false);
      $("#codigo_sisin").attr("disabled", false);
      // if (this.s_idrol==6){
      setTimeout(() => {
        this.cargarmascaras();
      }, 100);

      //}
      // $("input:text").each(function () {
      //   $($(this)).val('');
      // });
      this.limpiar();
    }
    if (string == "EDITA_SEGUIMIENTO") {
      $("#pnl_gridview").hide();
      $("#pnl_gridview_bandeja").hide();
      $("#pnl_formulario").hide();
      $("#pnl_formulario_bandeja").show();
      $("#btnRegistrarDetalle").hide();
      $("#btnActualizarDetalle").show();
      $("#nombreproyecto").attr("disabled", false);
      $("#codigo_sisin").attr("disabled", false);
      /// if (this.s_idrol == 6) {
      //this.cargarmascaras();
      // }
      // $("input:text").each(function () {
      //   $($(this)).val('');
      // });
      // this.limpiar();
    }
    if (string == "VER_GRIDVIEW") {
      $("#pnl_gridview").show();
      $("#pnl_gridview_bandeja").hide();
      $("#pnl_formulario").hide();
      $("#pnl_formulario_bandeja").hide();
      $("#btnRegistrar").hide();
      $("#nombreproyecto").attr("disabled", true);
      $("#codigo_sisin").attr("disabled", true);
      // $("input:text").each(function () {
      //   $($(this)).val('');
      // });
      this.limpiar();
    }
    if (string == "VER_GRIDVIEW_BANDEJA") {
      $("#pnl_gridview").hide();
      $("#pnl_gridview_bandeja").show();
      $("#pnl_formulario").hide();
      $("#pnl_formulario_bandeja").hide();
      $("#btnRegistrar").hide();
      $("#nombreproyecto").attr("disabled", true);
      $("#codigo_sisin").attr("disabled", true);
      $("#nombreproyecto2").attr("disabled", true);
      $("#codigo_sisin2").attr("disabled", true);
      // $("input:text").each(function () {
      //   $($(this)).val('');
      // });
      //this.limpiar();
    }
  }

  limpiar() {
    this.dts_responsables = [];
    this.m_estadoproyecto = "";
    this.m_acciones = "";
    this.m_plazosolucion = "";
    this.m_avanceacumulado = "";
    this.m_mes = "";
    this.m_monto = "";
    this.m_detallec31 = "";
    this.m_nombresponsable = "";
    this.m_cargoresponsable = "";
  }
  consulta_seguimiento() {
    this._financiera.getConsultaSeguimiento().subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_seguimiento = this._fun.RemplazaNullArray(result);
          this._fun.limpiatabla(".dt-seguimiento");
          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V3(
              [10, 20, 50],
              false
            );
            var table = $(".dt-seguimiento").DataTable(confiTable);
            this._fun.inputTable(table, [4, 5]);
            this._fun.selectTable(table, [1, 2, 3]);
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
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas3";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      }
    );
  }
  inserta_seguimiento() {
    this._financiera
      .getInsertaSeguimiento(
        this.m_nombreproyecto.toUpperCase(),
        this.m_codigo_sisin.toUpperCase(),
        this.m_departamento,
        this.m_provincia,
        this.m_municipio,
        this.s_user.toUpperCase()
      )
      .subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            this.paneles("VER_GRIDVIEW");
            // this._fun.limpiatabla('.dt-seguimiento')
            setTimeout(() => {
              this.consulta_seguimiento();
            }, 500);
          } else {
            this.prop_msg = "Alerta: No existen registrosss";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas4";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        }
      );
  }
  actualiza_seguimiento() {
    if (
      this.s_idrol == 5 &&
      (this.m_estadoproyecto.length < 50 || this.m_acciones.length < 50)
    ) {
      this.prop_msg =
        "Alerta: Debe ingresar minimo 50 caracteres en los campos Estado situación del proyecto y/o Acciones a Tomar";
      this.prop_tipomsg = "danger";
      this._msg.formateoMensaje("modal_danger", this.prop_msg);
    } else {
      this._financiera
        .getActualizaSeguimiento(
          this.m_idseg,
          this.m_nombreproyecto.toUpperCase(),
          this.m_codigo_sisin.toUpperCase(),
          this.m_departamento,
          this.m_provincia,
          this.m_municipio,
          this.s_user.toUpperCase(),
          this.s_idrol
        )
        .subscribe(
          (result: any) => {
            

            if (Array.isArray(result) && result.length > 0) {
              this.dts_seguimiento = this._fun.RemplazaNullArray(result);
              $("#pnl_gridview").show();
              $("#pnl_formulario").hide();
              $("#pnl_formulario2").hide();
              this._fun.limpiatabla(".dt-seguimiento");
              setTimeout(() => {
                let confiTable = this._fun.CONFIGURACION_TABLA_V3(
                  [10, 20, 50],
                  false
                );
                var table = $(".dt-seguimiento").DataTable(confiTable);
                this._fun.inputTable(table, [4, 5]);
                this._fun.selectTable(table, [1, 2, 3]);
              }, 500);
            } else {
              this.prop_msg = "Alerta: No existen registros1";
              this.prop_tipomsg = "danger";
              this._msg.formateoMensaje("modal_danger", this.prop_msg);
            }
          },
          (error) => {
            this.errorMessage = <any>error;
            if (this.errorMessage != null) {
              this.prop_msg =
                "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas5";
              this.prop_tipomsg = "danger";
              this._msg.formateoMensaje("modal_danger", this.prop_msg);
            }
          }
        );
    }
  }
  preactualiza_seguimiento(dts: any) {
    this.dts_responsables = [];
    this.limpiar();
    $("#nombreproyecto").attr("disabled", false);
    $("#codigo_sisin").attr("disabled", true);
    $("#pnl_gridview").hide();
    $("#pnl_formulario").show();
    $("#pnl_formulario2").show();
    $("#btnRegistrar").hide();
    $("#btnActualizar").show();

    this.m_idseg = dts._id_seg;
    this.m_nombreproyecto = dts._nomb_proyecto;
    this.m_codigo_sisin = dts._codigo_sisin;
    this.m_estadoproyecto = dts._estado_situacion;
    this.m_acciones = dts._acciones_tomar;
    this.m_plazosolucion = dts._plazo_solucion;
    this.m_avanceacumulado = dts._porcentaje_avance;
    this.m_mes = dts._importe_mes;
    this.m_monto = dts._c31;
    this.m_detallec31 = dts._detallec31;
    this.m_departamento = dts._codigo_departamento;
    this.m_provincia = dts._codigo_provincia;
    this.m_municipio = dts._codigo_municipio;
    setTimeout(() => {
      this.filtraProvincia();
      this.filtraMunicipio();
    }, 10);
  }
  preactualiza_seguimiento_detalle(dts: any) {
    this.dts_responsables = [];
    this.paneles("EDITA_SEGUIMIENTO");
    this.m_idseg = dts._id_seg;
    this.m_idseg_detalle = dts._id_seg_detalle;
    this.m_nombreproyecto = this.m_nombreproyecto;
    this.m_codigo_sisin = this.m_codigo_sisin;
    this.m_estadoproyecto = dts._estado_situacion;
    this.m_acciones = dts._acciones_tomar;
    this.m_plazosolucion = dts._plazo_solucion;
    this.m_avanceacumulado = dts._porcentaje_avance;
    this.m_mes = dts._importe_mes;
    this.m_monto = dts._c31;

    this.m_detallec31 = dts._detallec31;
    this.m_nombresponsable = dts._nomb_responsable;
    this.m_cargoresponsable = dts._cargo_responsable;
  }
  actualiza_seguimiento_detalle() {
    if (
      this.s_idrol == 5 &&
      (this.m_estadoproyecto.length < 50 || this.m_acciones.length < 50)
    ) {
      this.prop_msg =
        "Alerta: Debe ingresar minimo 50 caracteres en los campos Estado situación del proyecto y/o Acciones a Tomar";
      this.prop_tipomsg = "danger";
      this._msg.formateoMensaje("modal_danger", this.prop_msg);
    } else {
      this._financiera
        .getActualizaSeguimientoDetalle(
          this.m_idseg_detalle,
          this.m_idseg,
          this._fun.getNullVacio(this.m_estadoproyecto.toUpperCase()),
          this._fun.getNullVacio(this.m_acciones.toUpperCase()),
          this._fun.getNullVacio(this.m_plazosolucion),
          this._fun.getNullVacio(this.m_nombresponsable),
          this._fun.getNullVacio(this.m_cargoresponsable),
          this._fun.getNullVacio(this.m_avanceacumulado),
          this._fun.getNullVacio(this.m_mes),
          parseFloat(this.m_monto).toFixed(2),
          this._fun.getNullVacio(this.m_detallec31.toUpperCase()),
          this.s_user.toUpperCase(),
          this.s_idrol
        )
        .subscribe(
          (result: any) => {
            
            if (Array.isArray(result) && result.length > 0) {
              this.dts_seguimiento_mes = this._fun.RemplazaNullArray(result);
              this.paneles("VER_GRIDVIEW_BANDEJA");
              this._fun.limpiatabla(".dt-seguimiento_mes");
              setTimeout(() => {
                let confiTable = this._fun.CONFIGURACION_TABLA_V3(
                  [12, 24, 36],
                  false
                );
                var table = $(".dt-seguimiento_mes").DataTable(confiTable);
              }, 500);
            } else {
              this.prop_msg = "Alerta: No existen registros1";
              this.prop_tipomsg = "danger";
              this._msg.formateoMensaje("modal_danger", this.prop_msg);
            }
          },
          (error) => {
            this.errorMessage = <any>error;
            if (this.errorMessage != null) {
              this.prop_msg =
                "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas6";
              this.prop_tipomsg = "danger";
              this._msg.formateoMensaje("modal_danger", this.prop_msg);
            }
          }
        );
    }
  }
  elimina_seguimiento(idseg) {
    this._financiera.getEliminaSeguimiento(idseg, this.s_user).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_seguimiento = this._fun.RemplazaNullArray(result);
          $("#pnl_formulario2").show();
          $("#nombreproyecto").attr("disabled", true);
          $("#btnRegistrar").hide();
          this.m_idseg = this.dts_seguimiento[0]._id_seg;
          this._fun.limpiatabla(".dt-seguimiento");
          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V3(
              [10, 20, 50],
              false
            );
            var table = $(".dt-seguimiento").DataTable(confiTable);
            this._fun.inputTable(table, [4, 5]);
            this._fun.selectTable(table, [1, 2, 3]);
          }, 500);
        } else {
          this.dts_seguimiento = [];
          this.prop_msg = "Alerta: No existen registros";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas7";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      }
    );
  }
  elimina_seguimiento_detalle(id_seg, idseg_detalle) {
    this._financiera
      .getEliminaSeguimientoDetalle(id_seg, idseg_detalle)
      .subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            this.dts_seguimiento_mes = this._fun.RemplazaNullArray(result);
            this._fun.limpiatabla(".dt-seguimiento_mes");
            setTimeout(() => {
              let confiTable = this._fun.CONFIGURACION_TABLA_V3(
                [12, 24, 36],
                false
              );
              var table = $(".dt-seguimiento_mes").DataTable(confiTable);
            }, 500);
          } else {
            //this.dts_seguimiento = [];
            this._fun.limpiatabla(".dt-seguimiento_mes");
            this.prop_msg = "Alerta: No existen registros";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas8";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        }
      );
  }
  ver_bandeja(dts) {
    this.paneles("VER_GRIDVIEW_BANDEJA");
    this.m_idseg = dts._id_seg;
    this.m_nombreproyecto = dts._nomb_proyecto;
    this.m_codigo_sisin = dts._codigo_sisin;
    this.dts_seguimiento_mes = [];
    setTimeout(() => {
      this.lista_seguimiento_detalle(dts._id_seg);
    }, 50);
  }
  inserta_seguimiento_detalle() {
    if (
      this.s_idrol == 5 &&
      (this.m_estadoproyecto.length < 50 || this.m_acciones.length < 50)
    ) {
      this.prop_msg =
        "Alerta: Debe ingresar minimo 50 caracteres en los campos Estado situación del proyecto y/o Acciones a Tomar";
      this.prop_tipomsg = "danger";
      this._msg.formateoMensaje("modal_danger", this.prop_msg);
    } else {
      //this._financiera.getInsertaSeguimientoDetalle(this.m_idseg, this._fun.getNullVacio(this.m_estadoproyecto.toUpperCase()), this._fun.getNullVacio(this.m_acciones.toUpperCase()), this._fun.getNullVacio(this.m_plazosolucion), this._fun.getNullVacio(this.m_nombresponsable), this._fun.getNullVacio(this.m_cargoresponsable), this._fun.getNullVacio(this.m_avanceacumulado), this._fun.getNullVacio(this.m_mes), this._fun.getNullVacio(this.m_monto), this._fun.getNullVacio(this.m_detallec31.toUpperCase()), this.s_user.toUpperCase(), this.s_idrol).subscribe(
      this._financiera
        .getInsertaSeguimientoDetalle(
          this.m_idseg,
          this._fun.getNullVacio(this.m_estadoproyecto.toUpperCase()),
          this._fun.getNullVacio(this.m_acciones.toUpperCase()),
          this._fun.getNullVacio(this.m_plazosolucion),
          this._fun.getNullVacio(this.m_nombresponsable),
          this._fun.getNullVacio(this.m_cargoresponsable),
          this._fun.getNullVacio(this.m_avanceacumulado),
          this._fun.getNullVacio(this.m_mes),
          parseFloat(this.m_monto).toFixed(2),
          this._fun.getNullVacio(this.m_detallec31.toUpperCase()),
          this.s_user.toUpperCase(),
          this.s_idrol
        )
        .subscribe(
          (result: any) => {
            
            if (Array.isArray(result) && result.length > 0) {
              this.paneles("VER_GRIDVIEW");
              this._fun.limpiatabla(".dt-seguimiento");
              this._fun.limpiatabla(".dt-seguimiento_mes");
              setTimeout(() => {
                this.consulta_seguimiento();
              }, 500);
            } else {
              this.prop_msg =
                "Alerta: El importe del mes ya se encuentra registrado";
              this.prop_tipomsg = "danger";
              this._msg.formateoMensaje("modal_danger", this.prop_msg);
            }
          },
          (error) => {
            this.errorMessage = <any>error;
            if (this.errorMessage != null) {
              this.prop_msg =
                "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas9";
              this.prop_tipomsg = "danger";
              this._msg.formateoMensaje("modal_danger", this.prop_msg);
            }
          }
        );
    }
  }
  lista_seguimiento_detalle(id_seg) {
    this._financiera.getListaSeguimientoDetalle(id_seg).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this._fun.limpiatabla(".dt-seguimiento_mes");
          this.dts_seguimiento_mes = this._fun.RemplazaNullArray(result);

          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V3(
              [12, 24, 36],
              false
            );
            var table = $(".dt-seguimiento_mes").DataTable(confiTable);
          }, 500);
        } else {
          this.prop_msg = "Alerta: No existen registrosss";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas10";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      }
    );
  }
  listaDepartamento() {
    this._autenticacion.listaDepartamentos().subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_departamento = result;
        } else {
          this.prop_msg = "Alerta: No existen registrosss";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas11";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      }
    );
  }
  listaProvincia() {
    this._autenticacion.listaProvincias().subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_provincia = result;
        } else {
          this.prop_msg = "Alerta: No existen registrosss";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas12";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      }
    );
  }
  listaMunicipio() {
    this._autenticacion.listaMunicipios().subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_municipio = result;
        } else {
          this.prop_msg = "Alerta: No existen registrosss";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas13";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      }
    );
  }
  filtraProvincia() {
    this.dts_provinciafiltrada = this.dts_provincia.filter(
      (item) => item.fcodigo_departamento == this.m_departamento
    );
    this.dts_municipiofiltrado = [];
  }
  filtraMunicipio() {
    this.dts_municipiofiltrado = this.dts_municipio.filter(
      (item) => item.fcodigo_provincia == this.m_provincia
    );
  }
}
