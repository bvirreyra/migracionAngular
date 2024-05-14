import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Globals } from "../../../../../global";
/*servicios*/
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { MensajesComponent } from "@mensajes/mensajes.component";
import alasql from "alasql";
import * as moment from "moment";
import { NgSelect2Module } from "ng-select2";
import swal2 from "sweetalert2";
import { AutenticacionService } from "../../../../seguridad/autenticacion.service";
import { AccesosRolComponent } from "../../../../sgp/accesos-rol/accesos-rol.component";
import { MonitoreoCompromisoV2Service } from "./monitoreo-compromiso-v2.service";
declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important
moment.locale("es");
@Component({
  selector: "app-bandeja-compromiso-v2",
  templateUrl: "./bandeja-compromiso-v2.component.html",
  styleUrls: ["./bandeja-compromiso-v2.component.css"],
  providers: [
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    NgSelect2Module,
    MonitoreoCompromisoV2Service,
    AutenticacionService,
    AccesosRolComponent,
  ],
})
export class BandejaCompromisoV2Component implements OnInit {
  public cargando: boolean = false;
  /*VARIABLES PARA MASCARAS */
  public mask_numerodecimal: any;
  public mask_fecha: any;
  public mask_numero: any;
  public mask_gestion: any;
  public mask_cite: any;

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
  public s_usu_id_sipta: any;
  public s_usu_id_sispre: any;
  public s_ci_user: any;
  public s_usu_area: any;
  public dtsRolesUsuario: any;
  public s_menusuperior: any;

  public url: string;
  public urlApi: string;
  public url_reporte: string;
  public errorMessage: string;
  public fechasrv: string;

  public dtsDatosConexion: any;
  public dtsRoles: any;
  public dtsPermisos: any;

  public dtsFechaSrv: any;
  public dtsFechaLiteral: any;
  public dtsHoraSrv: any;
  public dtsAnio: any;
  public s_imgLogo: any;

  public m_gestion: any;
  public m_mes_actual: any;

  public camposHabilitados: {};
  dtsBandeja: any = [];
  m_rolMonitoreo: any;

  /***********************************
   * VARIABLES DEL COMPONENTE
   ***********************************/
  public pnl_FormularioInicial = false;
  public pnl_FormularioGeneral = false;
  public pnl_FormularioAdminitracion = false;
  public pnl_Bandeja = true;
  public dts_registro: any;
  public dts_transicion: any;
  ingreso_transicion: {
    id_flujo: number;
    tipo_flujo: any;
    estado_monitoreo: any;
    rol: any;
    codigo_tarea_nueva: any;
    nombre_tarea_nueva: any;
    operacion: any;
    id_compromiso: any;
    tipo_financiamiento: any;
    detalle: any;
    fecha_inicio: any;
    fecha_fin: any;
    usuario_registro: any;
    hoja_ruta: any;
    estructura_financiera: any;
  };

  public m_accesoDepartamento: any;
  public dtsBandejaPivote: any = [];
  dts_registros_monitoreo: any[];
  pnl_registroMonitoreo: boolean;
  pnl_FormularioEstructura: any;
  pnl_registroObservaciones: boolean;
  dts_registros_observaciones: any[];
  m_estadomonitoreo: any;
  dts_estadosmonitoreo: any;
  pnl_obs_curso: any;
  pnl_obs_etapa: any;
  m_obs_curso: any;

  /***PARA GRID MANUAL***/
  public queryFiltro: string;
  public queryOrden: string;
  public pagina: number = 0;
  public dts_inicial: any[] = [];
  public dts_departamentos: any;
  public dts_municipios: any;
  public municipioSel: string;
  public departamentoSel: string;
  public listaFiltro: any[] = [];
  public dts_estados: any;
  public estadoSel: string;
  public dts_areas: any;
  public areaSel: string;
  public dts_provincias: any;
  public provinciaSel: string;
  public dts_tfinanciamiento: string;
  public tfinanciamientoSel: string;
  public dts_estructurafinanciera: string;
  public estructura_financieraSel: string;
  public dts_nombre_tarea: string;
  public nombre_tareaSel: string;
  pnl_LineaTiemopHr: boolean;
  m_nrohojaderuta: any;
  m_hrgestion: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _monitoreo: MonitoreoCompromisoV2Service,
    private _autenticacion: AutenticacionService,
    private _accesos: AccesosRolComponent,
    private globals: Globals,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent,
    private datePipe: DatePipe
  ) {
    this._route.parent.params.subscribe((parametros) => {
      this.s_idcon = parametros["idcon"];
      this.s_idmod = parametros["idmod"];
    });
    this.url = globals.rutaSrvFronEnd;
    this.url_reporte = globals.rutaSrvReportes;
  }

  ngOnInit() {
    sessionStorage.clear();
    function falloCallback(error) {
      console.log("Falló con " + error);
    }
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
        return this.RolesAsignados(this.s_usu_id);
      })
      .then((dts) => {
        this.dtsRolesUsuario = dts;
        console.log("Roles", this.dtsRolesUsuario);
        this.manejoRoles();
        return this._accesos.accesosRestriccionesxRolV2(this.s_usu_id);
      })
      .then((data) => {
        this.camposHabilitados = data;
        console.log("Adm Permisos===>", this.camposHabilitados);
        this.GuardarLocalStorage();
        this.prelistaBandeja();
        return this.listaBandeja(this.m_rolMonitoreo);
      })
      .then((data) => {
        this.dtsBandejaPivote = data;
        this.prepararTablaV2();
        //this.prepararTabla();
      })
      .catch(falloCallback);
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
                this.s_usu_id_sipta = result[0]["_usu_id_sipta"];
                this.s_usu_id_sispre = result[0]["_usu_id_sispre"];
                this.s_ci_user = result[0]["_usu_ci"];
                this.s_usu_area = result[0]["_usu_area"];
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
  RolesAsignados(usu_id) {
    return new Promise((resolve, reject) => {
      this._autenticacion.rolesasignados(usu_id).subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            resolve(result);
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
  GuardarLocalStorage() {
    let dts_con = {
      s_idrol: this.s_idrol,
      s_user: this.s_user,
      s_nomuser: this.s_nomuser,
      s_usu_id: this.s_usu_id,
      s_usu_id_sipta: this.s_usu_id_sipta,
      s_usu_id_sispre: this.s_usu_id_sispre,
      s_ci_user: this.s_ci_user,
      s_usu_area: this.s_usu_area,
      s_menusuperior: this.s_menusuperior,
    };
    let dts_rol = this.dtsRolesUsuario;
    let camposHabilitados = this.camposHabilitados;

    localStorage.setItem("dts_con", JSON.stringify(dts_con));
    localStorage.setItem("dts_rol", JSON.stringify(dts_rol));
    localStorage.setItem("dts_permisos", JSON.stringify(camposHabilitados));
  }
  handleInputHr(event: any) {
    const value = event.target.value;
    //const pattern = /^\d+(\.\d{0,2})?$/;
    const pattern = /^([0-9]{0,9})(\/[0-9]{0,4})?$/;
    if (!pattern.test(value)) {
      event.target.value = value.slice(0, -1);
    }
  }

  handleBlurHr(event: any) {
    if (event.originalTarget) {
      event.originalTarget.value = Number(event.originalTarget.value).toFixed(
        2
      );
    } else {
      if (event.target)
        event.target.value = Number(event.target.value).toFixed(2);
    }
  }
  prelistaBandeja() {
    this.m_rolMonitoreo = alasql(
      `select * from ? where idrol in (100,101,102,103,104,105,106,109)`,
      [this.dtsRolesUsuario]
    )[0]["idrol"];
    console.log("rolMonitoreo", this.m_rolMonitoreo);
  }
  listaBandeja(id_rol) {
    return new Promise((resolve, reject) => {
      this.cargando = true;
      console.log('antes de',id_rol);
      
      this._monitoreo.listaBandejaMonitoreo(id_rol).subscribe(
        (result: any) => {
          console.log('revisando',result);
          if (Array.isArray(result) && result.length > 0) {
            resolve(result);
          } else {
            this.prop_msg = "Alerta: No existen registros disponibles";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
            this.dtsBandeja = [];

            // reject(this.prop_msg);
          }
          this.cargando = false;
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
          this.cargando = false;
        }
      );
    });
  }
  prepararTabla() {
    this._fun.limpiatabla(".dt-monitoreo");
    setTimeout(() => {
      let confiTable = this._fun.CONFIGURACION_TABLA_V7(
        [10, 50, 100, 150, 200],
        false,
        10,
        true,
        [
          [2, "asc"],
          [3, "asc"],
          [0, "asc"],
          [6, "asc"],
        ]
      );
      if (!$.fn.dataTable.isDataTable(".dt-monitoreo")) {
        var table = $(".dt-monitoreo").DataTable(confiTable);
        //this._fun.inputTable(table, [0, 6]);
        this._fun.selectTable(table, [1, 4, 5, 7, 8]);
      }
      // const obj = document.getElementById('tablaDetalle');
      // obj.scrollIntoView({block: "start", behavior: "smooth"});
    }, 100);
  }
  paneles(string, dts?) {
    if (string == "VISTA_BANDEJA") {
      this.pnl_FormularioInicial = false;
      this.pnl_FormularioGeneral = false;
      this.pnl_registroMonitoreo = false;
      this.pnl_registroObservaciones = false;
      this.pnl_FormularioAdminitracion = false;
      this.pnl_LineaTiemopHr = false;
      $("#pnl_Bandeja").show();
    }
    if (string == "REFRESCA_BANDEJA") {
      this.pnl_FormularioInicial = false;
      this.pnl_FormularioGeneral = false;
      this.pnl_registroMonitoreo = false;
      this.pnl_registroObservaciones = false;
      this.pnl_FormularioAdminitracion = false;
      this.pnl_LineaTiemopHr = false;
      $("#pnl_Bandeja").show();
      this.ActualizarListado();
    }
    if (string == "REGISTRO_MONITOREO") {
      this.dts_registros_monitoreo = [];
      this.dts_registro = dts;
      this.pnl_FormularioInicial = false;
      this.pnl_FormularioGeneral = false;
      this.pnl_registroMonitoreo = true;
      this.pnl_registroObservaciones = false;
      this.pnl_FormularioAdminitracion = false;
      this.pnl_LineaTiemopHr = false;

      $("#pnl_Bandeja").hide();
      this.registrosMonitoreoV2(dts.id_compromiso, dts.fid_flujo);
    }
    if (string == "HISTORIAL_OBSERVACIONES") {
      this.dts_registros_observaciones = [];
      this.dts_registro = dts;
      this.pnl_FormularioInicial = false;
      this.pnl_FormularioGeneral = false;
      this.pnl_registroMonitoreo = false;
      this.pnl_registroObservaciones = true;
      this.pnl_FormularioAdminitracion = false;
      this.pnl_LineaTiemopHr = false;

      $("#pnl_Bandeja").hide();
      this.registrosObservaciones(dts.id_compromiso);
    }
    if (string == "LINEA_TIEMPO_HR") {
      //this.dts_registros_observaciones = [];

      this.dts_registro = dts;
      var hr = dts.observacion_monitoreo.split("/");
      this.m_nrohojaderuta = hr[0];

      this.m_hrgestion = hr[1];
      this.pnl_FormularioInicial = false;
      this.pnl_FormularioGeneral = false;
      this.pnl_registroMonitoreo = false;
      this.pnl_registroObservaciones = false;
      this.pnl_FormularioAdminitracion = false;
      this.pnl_LineaTiemopHr = true;

      $("#pnl_Bandeja").hide();
    }
    if (string == "ADMINISTRACION") {
      this.dts_registro = dts;
      this.pnl_FormularioInicial = false;
      this.pnl_FormularioGeneral = false;
      this.pnl_registroMonitoreo = false;
      this.pnl_registroObservaciones = false;
      this.pnl_FormularioAdminitracion = true;
      this.pnl_LineaTiemopHr = false;
      this.pnl_obs_curso = false;
      this.pnl_obs_etapa = false;
      console.log("1", this.dts_registro);
      this.listaEstadoMonitoreo(dts.fid_flujo);
      this.m_estadomonitoreo = dts.estado_monitoreo;

      $("#pnl_Bandeja").hide();
      this.ingreso_transicion = {
        id_flujo: dts.fid_flujo == null ? 1 : dts.fid_flujo,
        tipo_flujo: dts.tipo_flujo,
        estado_monitoreo: dts.estado_monitoreo,
        rol: this.m_rolMonitoreo,
        codigo_tarea_nueva: null,
        nombre_tarea_nueva: null,
        operacion: "I",
        id_compromiso: this.dts_registro.id_compromiso,
        tipo_financiamiento:
          dts.tfinanciamiento == null ? "CIFE" : dts.tfinanciamiento,
        detalle: null,
        fecha_inicio: null,
        fecha_fin: null,
        hoja_ruta: null,
        usuario_registro: this.s_usu_id,
        estructura_financiera: this.dts_registro.estructura_financiera,
      };
    }
    if (string == "FORMULARIO") {
      this.dts_registro = dts;
      console.log("1", this.dts_registro);
      this.pnl_obs_curso = false;
      this.pnl_obs_etapa = false;
      this.ingreso_transicion = {
        id_flujo: dts.fid_flujo == null ? 1 : dts.fid_flujo,
        tipo_flujo: dts.tipo_flujo,
        estado_monitoreo: dts.estado_monitoreo,
        rol: this.m_rolMonitoreo,
        codigo_tarea_nueva: null,
        nombre_tarea_nueva: null,
        operacion: "I",
        id_compromiso: this.dts_registro.id_compromiso,
        tipo_financiamiento:
          dts.tfinanciamiento == null ? "CIFE" : dts.tfinanciamiento,
        detalle: null,
        fecha_inicio: null,
        fecha_fin: null,
        hoja_ruta: null,
        usuario_registro: this.s_usu_id,
        estructura_financiera: this.dts_registro.estructura_financiera,
      };
      console.log("1_1", this.ingreso_transicion);
      this.obtieneTransicion(this.ingreso_transicion).then((datos) => {
        this.dts_transicion = datos;
        this.ingreso_transicion.codigo_tarea_nueva =
          this.dts_transicion.codigo_tarea_nueva;
        this.ingreso_transicion.nombre_tarea_nueva =
          this.dts_transicion.codigo_tarea_nueva;

        console.log("2", this.dts_transicion);

        this.pnl_FormularioInicial = this.dts_transicion.areas["formulario_tf"];
        this.pnl_FormularioGeneral =
          this.dts_transicion.areas["formulario_monitoreo"];
        this.pnl_FormularioEstructura =
          this.dts_transicion.areas["formulario_estructura"];

        this.ingreso_transicion.fecha_fin = moment()
          .format("YYYY-MM-DD")
          .toString();
        /*
        this.pnl_FormularioInicial = this.dts_transicion.areas.includes(
          "FORMULARIO TF"
        )
          ? true
          : false;
        this.pnl_FormularioGeneral = this.dts_transicion.areas.includes(
          "FORMULARIO FORMULARIO MONITOREO"
        )
          ? true
          : false;
          */

        console.log("3", this.pnl_FormularioInicial);
        console.log("4", this.pnl_FormularioGeneral);
        if (this.dts_registro.tipo_flujo == "INICIO") {
          this.ingreso_transicion.fecha_inicio = moment(
            this.dts_registro.fecha_aprobacion
          )
            .format("YYYY-MM-DD")
            .toString();
        } else {
          this.ingreso_transicion.fecha_inicio = moment(
            this.dts_registro.fultima_aprobacion
          )
            .format("YYYY-MM-DD")
            .toString();
          this.ingreso_transicion.tipo_financiamiento =
            this.dts_registro.tfinanciamiento;
        }
      });

      $("#pnl_Bandeja").hide();
    }
  }
  obtieneTransicion(dts) {
    return new Promise((resolve, reject) => {
      this.cargando = true;
      this._monitoreo.obtieneTransicion(dts).subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            resolve(result[0]);
            console.log("TRANSICION", result);
          }
          this.cargando = false;
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_info", this.prop_msg);
            reject(this.prop_msg);
          }
          this.cargando = false;
        }
      );
    });
  }
  insertaMonitoreo() {
    swal2({
      title: "Advertencia!!!",
      text: `Esta seguro en registrar el evento?`,
      type: "info",
      showCancelButton: true,
      confirmButtonColor: "#d9534f",
      cancelButtonColor: "#f0ad4e",
      customClass: "swal2-popup",
      confirmButtonText: "Confirmar!",
    }).then((result) => {
      if (result.value) {
        this.crudMonitoreoV2(this.ingreso_transicion);
      }
    });
  }
  crudMonitoreoV2(dts) {
    this.cargando = true;
    console.log("INGRESA AL GRUD DATOS===>", dts);
    this._monitoreo.crudMonitoreoV2(dts).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.prop_msg = result[0].message;
          this.prop_tipomsg = result[0].msg_estado;
          this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg, 5);
          this.paneles("REFRESCA_BANDEJA");
        }
        this.cargando = false;
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
        this.cargando = false;
      }
    );
  }
  ActualizarListado() {
    this.prelistaBandeja();
    this.listaBandeja(this.m_rolMonitoreo).then((data) => {
      this.dtsBandejaPivote = data;
      this.prepararTablaV2();
      //this.prepararTabla();
    });
  }
  SeguimientoMonitoreo() {
    this.dtsBandeja = [];
    this.dtsBandejaPivote = [];
    this.m_rolMonitoreo = 104; //asignando el rol de visualizador
    this.listaBandeja(this.m_rolMonitoreo).then((data) => {
      this.dtsBandejaPivote = data;
      console.log("PROYECTOS TOTALES", this.dtsBandejaPivote);
      this.prepararTablaV2();
      //this.prepararTabla();
    });
  }
  preEditaObservacion(id_compromiso, estructura_financiera, etapa) {
    var id_observacion = "#observacion" + id_compromiso + estructura_financiera;
    var observacion = $(id_observacion).val();

    this.editaObservacion(
      id_compromiso,
      estructura_financiera,
      observacion,
      etapa
    );
  }
  preEditaContacto(id_compromiso, estructura_financiera) {
    var id_contacto = "#contacto" + id_compromiso + estructura_financiera;
    var contacto = $(id_contacto).val();

    this.editaContacto(id_compromiso, estructura_financiera, contacto);
  }
  editaObservacion(id_compromiso, estructura_financiera, observacion, etapa) {
    console.log("EDITA OBS HOJA DE RUTA", id_compromiso, estructura_financiera);
    var dts = {
      operacion: "IHR",
      id_compromiso: id_compromiso,
      estructura_financiera: estructura_financiera,
      etapa: etapa,
      observacion: observacion,
      id_usuario: this.s_usu_id,
    };
    this._monitoreo.actualizaObservacion(dts).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          console.log("ACTUALIZO OBSRVACION HOJA DE RUTA", result);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_info", this.prop_msg);
        }
      }
    );
  }
  editaObservacionV2() {
    this.cargando = true;
    var dts = {
      operacion: "I",
      id_compromiso: this.dts_registro.id_compromiso,
      estructura_financiera: this.dts_registro.estructura_financiera,
      etapa: this.dts_registro.estado_monitoreo,
      observacion: this.m_obs_curso,
      id_usuario: this.s_usu_id,
    };
    this._monitoreo.actualizaObservacion(dts).subscribe(
      (result: any) => {
        console.log("RESULTADO", result);
        if (Array.isArray(result) && result.length > 0) {
          this.cargando = false;
          this.prop_msg = result[0].message;
          this.prop_tipomsg = result[0].msg_estado;
          this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
          console.log("ACTUALIZO OBSERVACION", result);
          this.m_obs_curso = "";
          this.paneles("REFRESCA_BANDEJA");
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_info", this.prop_msg);
          this.cargando = false;
        }
      }
    );
  }
  editaContacto(id_compromiso, estructura_financiera, contacto) {
    console.log("EDITA OBS", id_compromiso, estructura_financiera);
    var dts = {
      id_compromiso: id_compromiso,
      estructura_financiera: estructura_financiera,
      contacto: contacto,
      id_usuario: this.s_usu_id,
    };
    this._monitoreo.actualizaContacto(dts).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          console.log("ACTUALIZO EL CONTACTO", result);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_info", this.prop_msg);
        }
      }
    );
  }
  obtenerAccesoxDpto(lineas, datos) {
    return new Promise((resolve, reject) => {
      var accesoDepartamento = "";
      console.log("roles asignados", datos);
      for (var i = 0; i < lineas; i++) {
        var rol = datos[i].idrol;
        var detalle_rol = datos[i].detalle_rol;
        if (
          rol == 26 ||
          rol == 30 ||
          rol == 31 ||
          rol == 32 ||
          rol == 33 ||
          rol == 34 ||
          rol == 35 ||
          rol == 36 ||
          rol == 37 ||
          rol == 38 ||
          rol == 39 ||
          rol == 40 ||
          rol == 41 ||
          rol == 52 ||
          rol == 53 ||
          rol == 54 ||
          rol == 55 ||
          rol == 56 ||
          rol == 57 ||
          rol == 63 ||
          rol == 64 ||
          rol == 65 ||
          rol == 66 ||
          rol == 67 ||
          rol == 68 ||
          rol == 69 ||
          rol == 77 ||
          rol == 78 ||
          rol == 79 ||
          rol == 80 ||
          rol == 81 ||
          rol == 82 ||
          rol == 83 ||
          rol == 84 ||
          rol == 85
        ) {
          if (accesoDepartamento == "") {
            accesoDepartamento = detalle_rol;
          } else {
            accesoDepartamento = accesoDepartamento + "," + detalle_rol;
          }
        }
      }
      if (accesoDepartamento != "") {
        accesoDepartamento = "(" + accesoDepartamento + ")";
      }

      resolve(accesoDepartamento);
    });
  }
  manejoRoles() {
    this.m_accesoDepartamento = "";
    this.obtenerAccesoxDpto(
      this.dtsRolesUsuario.length,
      this.dtsRolesUsuario
    ).then((dts) => {
      this.m_accesoDepartamento = dts;
      console.log("depa", this.m_accesoDepartamento);
    });
  }
  registrosMonitoreoV2(id_compromiso, id_flujo) {
    this.cargando = true;

    this._monitoreo.registrosMonitoreoV2(id_compromiso, id_flujo).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_registros_monitoreo = result;
        }
        this.cargando = false;
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
        this.cargando = false;
      }
    );
  }
  registrosObservaciones(id_compromiso) {
    this.cargando = true;

    this._monitoreo.registrosObservaciones(id_compromiso).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_registros_observaciones = result;
        }
        this.cargando = false;
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
        this.cargando = false;
      }
    );
  }
  preinsertaEstructuraFinanciamiento(dato) {
    swal2({
      title: "Advertencia!!!",
      text: `Esta seguro en registrar la estructura financiera? ==>` + dato,
      type: "info",
      showCancelButton: true,
      confirmButtonColor: "#d9534f",
      cancelButtonColor: "#f0ad4e",
      customClass: "swal2-popup",
      confirmButtonText: "Confirmar!",
    }).then((result) => {
      if (result.value) {
        this.insertaEstructuraFinanciamiento(dato);
      }
    });
  }
  insertaEstructuraFinanciamiento(dato) {
    this.cargando = true;
    var dts = {
      operacion: "I",
      id_estructura: null,
      fid_compromiso: this.dts_registro.id_compromiso,
      tipo_financiamiento: this.dts_registro.tfinanciamiento,
      estructura_financiera: dato,
      observacion_monitoreo: null,
      estado_monitoreo: dato.substring(0, 3) + "_SOL_INSCRIPCION_PRESUPUESTO",
      usuario_registro: this.s_usu_id,
      id_estado: 1,
    };

    this._monitoreo.insertaEstructuraFinanciamiento(dts).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
        }
        this.cargando = false;
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
        this.cargando = false;
      }
    );
  }
  CambiaTf(dts) {
    console.log("CAMBIAR TF====>", dts);
    dts.tfinanciamiento = dts.tfinanciamiento == "CIFE" ? "CIF" : "CIFE";
    dts.fid_flujo = dts.fid_flujo == 1 ? 4 : 1;

    this.ingreso_transicion = {
      id_flujo: dts.fid_flujo,
      tipo_flujo: dts.tipo_flujo,
      estado_monitoreo: dts.estado_monitoreo,
      rol: this.m_rolMonitoreo,
      codigo_tarea_nueva: null,
      nombre_tarea_nueva: null,
      operacion: "CAMBIA_TF",
      id_compromiso: dts.id_compromiso,
      tipo_financiamiento: dts.tfinanciamiento,
      detalle: null,
      fecha_inicio: moment().format("YYYY-MM-DD").toString(),
      fecha_fin: moment().format("YYYY-MM-DD").toString(),
      hoja_ruta: null,
      usuario_registro: this.s_usu_id,
      estructura_financiera: dts.estructura_financiera,
    };

    console.log("ingreso transicion===>", this.ingreso_transicion);
    this.crudMonitoreoV2(this.ingreso_transicion);
  }
  listaEstadoMonitoreo(id_flujo) {
    console.log("FLUJO===>", id_flujo);
    this.cargando = true;
    this._monitoreo.listaEstadosMonitoreo(id_flujo).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_estadosmonitoreo = result;
        }
        this.cargando = false;
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
        this.cargando = false;
      }
    );
  }
  cambiaEstadosMonitoreo() {
    this.cargando = true;
    this._monitoreo
      .cambiaEstadosMonitoreo(
        this.dts_registro.id_compromiso,
        this.dts_registro.estructura_financiera,
        this.m_estadomonitoreo
      )
      .subscribe(
        (result: any) => {
          console.log("TAREA ACTUALIZADA", result.estado);
          if (result.estado == "CORRECTO") {
            this.paneles("REFRESCA_BANDEJA");
          }
          this.cargando = false;
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
          this.cargando = false;
        }
      );
  }
  habilitaCamposFormulario(e) {
    var obs = e.target.value;
    if (obs == "OBS_CURSO") {
      this.pnl_obs_curso = true;
      this.pnl_obs_etapa = false;
    }
    if (obs == "OBS_ETAPA") {
      this.pnl_obs_curso = false;
      this.pnl_obs_etapa = true;
    }
  }
  /******************************************
   * CONFIGURACION FILTROS
   *****************************************/
  ordenar(campo) {
    let cambiarOrden = "";
    if (!this.queryOrden) this.queryOrden = "select * from ? order by ";
    if (this.queryOrden.includes(`${campo} asc`))
      cambiarOrden = this.queryOrden.replace(`${campo} asc`, `${campo} desc`);
    if (this.queryOrden.includes(`${campo} desc`))
      cambiarOrden = this.queryOrden.replace(`${campo} desc`, `${campo} asc`);
    if (!this.queryOrden.includes(`${campo}`))
      this.queryOrden = `select * from ? order by ${campo} asc`;

    if (cambiarOrden) this.queryOrden = cambiarOrden;

    this.queryOrden = this.queryOrden
      .replace("order by   ,", "order by ")
      .replace("order by  ,", "order by ")
      .replace("order by ,", "order by ");
    console.log(
      "ordenar",
      campo,
      this.queryOrden,
      this.queryOrden.includes(`${campo} asc`),
      !this.queryOrden.includes(`${campo}`)
    );
    // this.dts_seguimiento.sort((a,b)=>a[campo] - b[campo]);
    this.dtsBandeja = alasql(this.queryOrden, [this.dtsBandeja]);
    this.paginar(0);
  }
  paginar(valor: number) {
    this.pagina += valor;
    console.log("entra a paginar", valor, this.pagina);
    this.pagina <= 0
      ? $("#anterior").prop("disabled", true)
      : $("#anterior").prop("disabled", false);
    this.pagina >= Math.trunc(this.dtsBandeja.length / 10)
      ? $("#siguiente").prop("disabled", true)
      : $("#siguiente").prop("disabled", false);
  }
  prepararTablaV2() {
    this.dtsBandeja = alasql(
      `SELECT * 
            FROM ? where cod_departamento in ${this.m_accesoDepartamento}`,
      [this.dtsBandejaPivote]
    );
    this.dts_inicial = this.dtsBandeja;

    this.dts_departamentos = alasql(
      `select distinct departamento from ? order by 1`,
      [this.dts_inicial]
    );
    this.dts_provincias = alasql(
      `select distinct provincia from ? order by 1`,
      [this.dts_inicial]
    );
    this.dts_municipios = alasql(
      `select distinct municipio from ? order by 1`,
      [this.dts_inicial]
    );
    this.dts_tfinanciamiento = alasql(
      `select distinct tfinanciamiento from ? order by 1`,
      [this.dts_inicial]
    );
    this.dts_estructurafinanciera = alasql(
      `select distinct estructura_financiera from ? order by 1`,
      [this.dts_inicial]
    );
    this.dts_nombre_tarea = alasql(
      `select distinct nombre_tarea from ? order by 1`,
      [this.dts_inicial]
    );
    //limpiando textos y combos de filtros grilla
    const cajas = document.querySelectorAll("td input[type=text]");
    cajas.forEach((el: HTMLFormElement) => {
      el.value = "";
    });
    this.departamentoSel = undefined;
    this.provinciaSel = undefined;
    this.municipioSel = undefined;
    this.areaSel = undefined;
    this.estadoSel = undefined;
    this.tfinanciamientoSel = undefined;
    this.estructura_financieraSel = undefined;

    this.queryFiltro = "";
    this.listaFiltro = [];
  }
  filtro_grid(campo, valor) {
    //console.log("CampoValor==>", campo, valor);
    if (valor === null) return true;

    if (!this.queryFiltro) this.queryFiltro = "select * from ? where";

    this.queryFiltro = "select * from ? where ";
    if (this.listaFiltro.filter((f) => f.campo === campo).length === 0)
      this.listaFiltro.push({ campo, valor });

    console.log("filtrando", this.listaFiltro);
    this.listaFiltro.map((e) => {
      if (e.campo === campo) {
        e.valor = valor;
      }
      if (
        e.campo === "municipio" &&
        (campo === "departamento" || campo === "provincia")
      ) {
        this.municipioSel = "";
        e.valor = "";
      }
      if (e.campo === "provincia" && campo === "departamento") {
        this.provinciaSel = "";
        e.valor = "";
      }
      if (e.campo === "tfinanciamiento") {
        if (e.valor)
          this.queryFiltro = this.queryFiltro.concat(
            ` and ${e.campo}::text == '${e.valor}'`
          );
      } else if (e.valor)
        this.queryFiltro = this.queryFiltro.concat(
          ` and ${e.campo}::text like '%${e.valor}%'`
        );

      return e;
    });

    console.log("antes de nada", this.queryFiltro);

    this.queryFiltro = this.queryFiltro
      .replace(/,/g, `','`)
      .replace(/\(/g, `('`)
      .replace(/\)/g, `')`);

    this.queryFiltro = this.queryFiltro
      .replace("  ", " ")
      .replace("where and", "where ");

    if (this.queryFiltro === "select * from ? where ")
      this.queryFiltro = "select * from ?";
    console.log("dos", this.queryFiltro, this.listaFiltro, campo, valor);
    this.dtsBandeja = alasql(this.queryFiltro, [this.dts_inicial]);

    this.pagina = 0;
    $("#anterior").prop("disabled", true);
    if (this.dtsBandeja.length <= 10) $("#siguiente").prop("disabled", true);
    if (this.dtsBandeja.length > 10) $("#siguiente").prop("disabled", false);
    if (campo !== "departamento" || !valor)
      this.dts_departamentos = alasql(
        `select distinct departamento from ? order by 1`,
        [this.dts_inicial]
      );
    if (campo !== "provincia" || !valor)
      this.dts_provincias = alasql(
        `select distinct provincia from ? order by 1`,
        [this.dtsBandeja]
      );
    if (campo !== "municipio" || !valor)
      this.dts_municipios = alasql(
        `select distinct municipio from ? order by 1`,
        [this.dtsBandeja]
      );
    if (campo !== "tfinanciamiento" || !valor)
      this.dts_tfinanciamiento = alasql(
        `select distinct tfinanciamiento from ? order by 1`,
        [this.dtsBandeja]
      );
    if (campo !== "estructura_financiera" || !valor)
      this.dts_estructurafinanciera = alasql(
        `select distinct estructura_financiera from ? order by 1`,
        [this.dtsBandeja]
      );
    if (campo !== "nombre_tarea" || !valor)
      this.dts_nombre_tarea = alasql(
        `select distinct nombre_tarea from ? order by 1`,
        [this.dtsBandeja]
      );
    this.pagina = 0;
    $("#anterior").prop("disabled", true);
  }
}
