import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Inputmask from "inputmask";
import { Globals } from "../../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { FinancieraService } from "../../../financiera/financiera.service";
import { AutenticacionService } from "../../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../../seguridad/mensajes/mensajes.component";
//import { ConsoleReporter } from 'jasmine';

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-donaciones",
  templateUrl: "./donaciones.component.html",
  styleUrls: ["./donaciones.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    FinancieraService,
  ],
})
export class DonacionesComponent implements OnInit {
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

  public m_empresa: any;
  public m_representante: any;
  public m_cirepresentante: any;
  public m_modalidadfinanciamiento: any;
  public m_firmacontrato: any;
  public m_montofinanciarsus: any;
  public m_tipocambio: any;
  public m_montofinanciarbs: any;
  public m_gestion_proy: any;
  public m_id_donacion: any;
  public m_tipopago: any;
  public m_nropago: any;
  public m_montodesembolso: any;
  public m_respaldo: any;
  public m_modalidadpago: any;
  public m_nrocuenta: any;
  public m_id_desembolso: any;
  public m_porcentaje: any;
  public m_montofinanciarbs_porcentaje: any;
  public m_obs: any;
  public m_totaldesembolso: any;
  public m_diferencia: any;

  public m_semaforo_for1 = 0;
  public m_semaforo_for2 = 0;

  public dts_donaciones: any;
  public dts_modalidadfinanciamiento: any;
  public dts_donacion_detalle: any;

  public vbtn_NuevoProyecto = false;
  public vbtn_EditaProyecto = false;
  public vbtnEliminaProyecto = false;
  public vbtn_NuevoDetalle = false;
  public vbtn_EditaDetalle = false;
  public vbtnEliminaDetalle = false;

  /*VARIABLEA PARA LA ADMINITRACION POR ROLES*/

  // public vbtn_NuevoSeguimiento = false;
  // public vbtn_EditaSeguimiento = false;
  // public vpanel_Tecnico = false;
  // public vpanel_Financiero = false;
  // public vusrAdministrador = false;

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

    this.consultaDonacion();
  }
  /*******************************************************************************/
  /*MASCARAS
  /*******************************************************************************/
  cargarmascaras() {
    var m_montofinanciarsus = document.getElementById("m_montofinanciarsus");
    this.mask_numerodecimal.mask(m_montofinanciarsus);
    var m_tipocambio = document.getElementById("m_tipocambio");
    this.mask_numerodecimal.mask(m_tipocambio);
    var m_montofinanciarbs = document.getElementById("m_montofinanciarbs");
    this.mask_numerodecimal.mask(m_montofinanciarbs);
  }
  cargarmascaras_detalle() {
    var m_montodesembolso = document.getElementById("m_montodesembolso");
    this.mask_numerodecimal.mask(m_montodesembolso);
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
      if (rol == 19) {
        // adminitrador proy ven
        this.vbtn_NuevoProyecto = true;
        this.vbtn_EditaProyecto = true;
        this.vbtnEliminaProyecto = true;
        this.vbtn_NuevoDetalle = true;
        this.vbtn_EditaDetalle = true;
        this.vbtnEliminaDetalle = true;
      }
      if (rol == 20) {
        // usuario restringido proy ven
        this.vbtn_NuevoProyecto = true;
        this.vbtn_EditaProyecto = true;
        this.vbtnEliminaProyecto = false;
        this.vbtn_NuevoDetalle = true;
        this.vbtn_EditaDetalle = true;
        this.vbtnEliminaDetalle = false;
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
      this.m_nombreproyecto = "";
      this.consultaModalidadFinanciamiento();
      this.m_semaforo_for1 = this.m_semaforo_for1 + 1;
      this.limpiar();
      if (this.m_semaforo_for1 == 1) {
        setTimeout(() => {
          this.cargarmascaras();
        }, 100);
      }
    }
    if (string == "EDITA_FICHA") {
      //$('#nombreproyecto').attr('disabled', false);
      $("#pnl_gridview").hide();
      $("#pnl_formulario").show();
      $("#btnRegistrar").hide();
      $("#btnActualizar").show();
      $("#pnl_gridview_bandeja").hide();
      this.consultaModalidadFinanciamiento();
      this.m_semaforo_for1 = this.m_semaforo_for1 + 1;
      //this.limpiar();
      if (this.m_semaforo_for1 == 1) {
        setTimeout(() => {
          this.cargarmascaras();
        }, 100);
      }
    }
    if (string == "NUEVO_DETALLE") {
      $("#pnl_gridview").hide();
      $("#pnl_gridview_bandeja").hide();
      $("#pnl_formulario").hide();
      $("#pnl_formulario_bandeja").show();
      $("#btnRegistrarDetalle").show();
      $("#btnActualizarDetalle").hide();
      $("#nombreproyecto").attr("disabled", false);
      $("#codigo_sisin").attr("disabled", false);
      this.m_semaforo_for2 = this.m_semaforo_for2 + 1;
      this.limpiar();
      if (this.m_semaforo_for2 == 1) {
        setTimeout(() => {
          this.cargarmascaras_detalle();
        }, 100);
      }
    }
    if (string == "EDITA_DETALLE") {
      $("#pnl_gridview").hide();
      $("#pnl_gridview_bandeja").hide();
      $("#pnl_formulario").hide();
      $("#pnl_formulario_bandeja").show();
      $("#btnRegistrarDetalle").hide();
      $("#btnActualizarDetalle").show();
      $("#nombreproyecto").attr("disabled", false);
      $("#codigo_sisin").attr("disabled", false);
      this.m_semaforo_for2 = this.m_semaforo_for2 + 1;
      this.m_porcentaje = "";
      //this.limpiar();
      if (this.m_semaforo_for2 == 1) {
        setTimeout(() => {
          this.cargarmascaras_detalle();
        }, 100);
      }
    }
    if (string == "VER_GRIDVIEW") {
      $("#pnl_gridview").show();
      $("#pnl_gridview_bandeja").hide();
      $("#pnl_formulario").hide();
      $("#pnl_formulario_bandeja").hide();
      $("#btnRegistrar").hide();
      $("#nombreproyecto").attr("disabled", true);
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
    }
  }

  limpiar() {
    this.m_empresa = "";
    this.m_representante = "";
    this.m_cirepresentante = "";
    this.m_modalidadfinanciamiento = "";
    this.m_firmacontrato = "";
    this.m_montofinanciarsus = "";
    this.m_tipocambio = "";
    this.m_montofinanciarbs = "";
    //this.m_id_desembolso = "";
    //this.m_id_donacion = "";
    this.m_tipopago = "";
    //this.m_nombreproyecto = "";
    this.m_nropago = "";
    this.m_montodesembolso = "";
    this.m_respaldo = "";
    this.m_modalidadpago = "";
    this.m_nrocuenta = "";
    this.m_porcentaje = "";
    this.m_obs = "";
  }
  consultaModalidadFinanciamiento() {
    this._financiera.consultaModalidadFinanciamiento().subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_modalidadfinanciamiento =
            this._fun.RemplazaNullArray(result);
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
  consultaDonacion() {
    this.dts_donaciones = "";
    this._financiera.consultaDonacion().subscribe(
      (result: any) => {
        

        if (Array.isArray(result) && result.length > 0) {
          this.dts_donaciones = this._fun.RemplazaNullArray(result);

          this._fun.limpiatabla(".dt-donaciones");
          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V3(
              [10, 20, 50],
              false
            );
            var table = $(".dt-donaciones").DataTable(confiTable);
            this._fun.inputTable(table, [5, 6, 8]);
            this._fun.selectTable(table, [1, 2, 3, 4, 9, 10]);
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
  insertaDonacion() {
    this._financiera
      .insertaDonacion(
        this._fun.textoUpper(this.m_gestion_proy),
        this._fun.textoUpper(this.m_nombreproyecto),
        this._fun.textoUpper(this.m_departamento),
        this._fun.textoUpper(this.m_municipio.substring(0, 4)),
        this._fun.textoUpper(this.m_municipio),
        this._fun.textoUpper(this.m_empresa),
        this._fun.textoUpper(this.m_representante),
        this._fun.textoUpper(this.m_cirepresentante),
        this._fun.textoUpper(this.m_modalidadfinanciamiento),
        this._fun.textoUpper(this.m_firmacontrato),
        this._fun.textoUpper(this.m_montofinanciarsus),
        this._fun.textoUpper(this.m_tipocambio),
        this._fun.textoUpper(this.m_montofinanciarbs),
        this._fun.textoUpper(this.s_user)
      )
      .subscribe(
        (result: any) => {
          
          if (
            Array.isArray(result) &&
            result.length > 0 &&
            result[0]["_accion"] == "CORRECTO"
          ) {
            this.prop_msg = result[0]["_mensaje"];
            this.prop_tipomsg = "success";
            this._msg.formateoMensaje("modal_success", this.prop_msg);
            this.paneles("VER_GRIDVIEW");
            setTimeout(() => {
              this.consultaDonacion();
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
  preactualizaDonacion(dts: any) {
    this.paneles("EDITA_FICHA");

    this.m_id_donacion = dts._id_donacion;
    this.m_gestion_proy = dts._gestion;
    this.m_nombreproyecto = dts._nomb_proyecto;
    this.m_departamento = dts._cod_departamento;
    this.m_provincia = dts._cod_provincia;
    this.m_municipio = dts._cod_municipio;
    this.m_empresa = dts._empresa_constructora;
    this.m_representante = dts._representante_legal;
    this.m_cirepresentante = dts._ci_representantelegal;
    this.m_modalidadfinanciamiento = dts._modalidad_financiamiento;
    this.m_firmacontrato = dts._firma_contrato;
    this.m_montofinanciarsus = dts._monto_financiar_sus;
    this.m_tipocambio = dts._tipo_cambio;
    this.m_montofinanciarbs = dts._montoa_financiar_bs;

    setTimeout(() => {
      //this.filtraProvincia();
      this.filtraMunicipio();
      this.consultaModalidadFinanciamiento();
    }, 10);
  }
  actualizaDonacion() {
    console.log("1", this._fun.textoUpper(this.m_id_donacion));
    console.log("2", this._fun.textoUpper(this.m_gestion_proy));
    console.log("3", this._fun.textoUpper(this.m_nombreproyecto));
    console.log("4", this._fun.textoUpper(this.m_departamento));
    console.log("5", this._fun.textoUpper(this.m_municipio.substring(0, 4)));
    console.log("6", this._fun.textoUpper(this.m_municipio));
    console.log("7", this._fun.textoUpper(this.m_empresa));
    console.log("8", this._fun.textoUpper(this.m_representante));
    console.log("9", this._fun.textoUpper(this.m_cirepresentante));
    console.log("10", this._fun.textoUpper(this.m_modalidadfinanciamiento));
    console.log("11", this._fun.textoUpper(this.m_firmacontrato));
    console.log("12", this._fun.textoUpper(this.m_montofinanciarsus));
    console.log("13", this._fun.textoUpper(this.m_tipocambio));
    console.log("14", this._fun.textoUpper(this.m_montofinanciarbs));
    console.log("15", this._fun.textoUpper(this.s_user));

    this._financiera
      .actualizaDonacion(
        this._fun.textoUpper(this.m_id_donacion),
        this._fun.textoUpper(this.m_gestion_proy),
        this._fun.textoUpper(this.m_nombreproyecto),
        this._fun.textoUpper(this.m_departamento),
        this._fun.textoUpper(this.m_municipio.substring(0, 4)),
        this._fun.textoUpper(this.m_municipio),
        this._fun.textoUpper(this.m_empresa),
        this._fun.textoUpper(this.m_representante),
        this._fun.textoUpper(this.m_cirepresentante),
        this._fun.textoUpper(this.m_modalidadfinanciamiento),
        this._fun.textoUpper(this.m_firmacontrato),
        this._fun.textoUpper(this.m_montofinanciarsus),
        this._fun.textoUpper(this.m_tipocambio),
        this._fun.textoUpper(this.m_montofinanciarbs),
        this._fun.textoUpper(this.s_user)
      )
      .subscribe(
        (result: any) => {
          
          if (
            Array.isArray(result) &&
            result.length > 0 &&
            result[0]["_accion"] == "CORRECTO"
          ) {
            this.prop_msg = result[0]["_mensaje"];
            this.prop_tipomsg = "success";
            this._msg.formateoMensaje("modal_success", this.prop_msg);
            this.paneles("VER_GRIDVIEW");
            setTimeout(() => {
              this.consultaDonacion();
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
  elimina_donacion(id) {
    this._financiera.elimina_donacion(id, this.s_user).subscribe(
      (result: any) => {
        
        if (
          Array.isArray(result) &&
          result.length > 0 &&
          result[0]["_accion"] == "CORRECTO"
        ) {
          this.prop_msg = result[0]["_mensaje"];
          this.prop_tipomsg = "success";
          this._msg.formateoMensaje("modal_success", this.prop_msg);
          this.paneles("VER_GRIDVIEW");
          setTimeout(() => {
            this.consultaDonacion();
          }, 500);
        } else {
          this.dts_donaciones = [];
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
  lista_donacion_detalle(id_donacion) {
    this.m_totaldesembolso = 0;
    this._financiera.lista_donacion_detalle(id_donacion).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this._fun.limpiatabla(".dt-donaciondetalle");
          this.dts_donacion_detalle = this._fun.RemplazaNullArray(result);
          var lineas = this.dts_donacion_detalle.length;
          for (var i = 0; i < lineas; i++) {
            var monto = 0;
            if (this.dts_donacion_detalle[i]["_monto"] == "") {
              monto = 0;
            } else {
              monto = parseFloat(this.dts_donacion_detalle[i]["_monto"]);
            }
            this.m_totaldesembolso = parseFloat(this.m_totaldesembolso) + monto;
            this.m_diferencia =
              parseFloat(this.m_montofinanciarbs_porcentaje) -
              parseFloat(this.m_totaldesembolso);
            this.m_diferencia = this._fun.redondearExp(
              this.m_diferencia,
              2,
              true
            );
          }

          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V3(
              [12, 24, 36],
              false
            );
            var table = $(".dt-donaciondetalle").DataTable(confiTable);
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
  inserta_donacion_detalle() {
    this._financiera
      .inserta_donacion_detalle(
        this._fun.textoUpper(this.m_id_donacion),
        this._fun.textoUpper(this.m_tipopago),
        this._fun.textoUpper(this.m_nropago),
        this._fun.textoUpper(this.m_montodesembolso),
        this._fun.textoUpper(this.m_respaldo),
        this._fun.textoUpper(this.m_modalidadpago),
        this._fun.textoUpper(this.m_nrocuenta),
        this._fun.textoUpper(this.s_user),
        this._fun.textoUpper(this.m_obs)
      )
      .subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            this.prop_msg = result[0]["_mensaje"];
            this.prop_tipomsg = "success";
            this._msg.formateoMensaje("modal_success", this.prop_msg);
            this.paneles("VER_GRIDVIEW_BANDEJA");
            setTimeout(() => {
              this.lista_donacion_detalle(this.m_id_donacion);
            }, 500);
          } else {
            this.prop_msg = "Alerta: No se registro el desembolso";
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
  preactualiza_donacion_detalle(dts: any) {
    this.m_id_desembolso = dts._id_desembolso;
    this.m_id_donacion = dts._fid_donacion;
    this.m_tipopago = dts._tipo_pago;
    this.m_nombreproyecto = this.m_nombreproyecto;
    this.m_nropago = dts._nro_pago;
    this.m_montodesembolso = dts._monto;
    this.m_respaldo = dts._respaldo;
    this.m_modalidadpago = dts._modalidad_pago;
    this.m_nrocuenta = dts._nro_cuenta;
    this.paneles("EDITA_DETALLE");
  }
  actualiza_donacion_detalle() {
    this._financiera
      .actualiza_donacion_detalle(
        this._fun.textoUpper(this.m_id_desembolso),
        this._fun.textoUpper(this.m_id_donacion),
        this._fun.textoUpper(this.m_tipopago),
        this._fun.textoUpper(this.m_nropago),
        this._fun.textoUpper(this.m_montodesembolso),
        this._fun.textoUpper(this.m_respaldo),
        this._fun.textoUpper(this.m_modalidadpago),
        this._fun.textoUpper(this.m_nrocuenta),
        this._fun.textoUpper(this.s_user),
        this._fun.textoUpper(this.m_obs)
      )
      .subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            this.prop_msg = result[0]["_mensaje"];
            this.prop_tipomsg = "success";
            this._msg.formateoMensaje("modal_success", this.prop_msg);
            this.paneles("VER_GRIDVIEW_BANDEJA");
            setTimeout(() => {
              this.lista_donacion_detalle(this.m_id_donacion);
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

  elimina_desembolso_detalle(m_id_desembolso) {
    this._financiera
      .elimina_desembolso_detalle(this._fun.textoUpper(m_id_desembolso))
      .subscribe(
        (result: any) => {
          

          if ((result.estado = "CORRECTO")) {
            this.prop_msg = "SE ELIMINO DE FORMA CORRECTA";
            this.prop_tipomsg = "success";
            this._msg.formateoMensaje("modal_success", this.prop_msg);
            this.paneles("VER_GRIDVIEW_BANDEJA");
            setTimeout(() => {
              this.lista_donacion_detalle(this.m_id_donacion);
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
    this.m_montofinanciarbs_porcentaje = "";
    this.paneles("VER_GRIDVIEW_BANDEJA");
    this.m_id_donacion = dts._id_donacion;
    this.m_nombreproyecto = dts._nomb_proyecto;

    this.dts_donacion_detalle = [];
    setTimeout(() => {
      this.lista_donacion_detalle(dts._id_donacion);
      this.m_montofinanciarbs_porcentaje = dts._montoa_financiar_bs;
    }, 50);
  }

  calculo() {
    if (this.m_montofinanciarsus != "" && this.m_montofinanciarsus != "") {
      var cal = this.m_montofinanciarsus * this.m_tipocambio;
      this.m_montofinanciarbs = this._fun.redondearExp(cal, 2, true);
      $("#m_montofinanciarbs").attr("disabled", true);
    } else {
      $("#m_montofinanciarbs").attr("disabled", false);
    }
  }
  calculo_porcentaje() {
    if (this.m_porcentaje != "") {
      var cal = (this.m_montofinanciarbs_porcentaje * this.m_porcentaje) / 100;
      this.m_montodesembolso = this._fun.redondearExp(cal, 2, true);
      $("#m_montodesembolso").attr("disabled", true);
    } else {
      $("#m_montodesembolso").attr("disabled", false);
    }
  }

  /*****************************************************************************
   GEOREFERENCIACION
   ****************************************************************************/
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
      (item) => item.fcodigo_provincia.substring(0, 2) == this.m_departamento
    );
  }
}
