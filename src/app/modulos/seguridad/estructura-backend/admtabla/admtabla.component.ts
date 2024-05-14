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

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-admtabla",
  templateUrl: "./admtabla.component.html",
  styleUrls: ["./admtabla.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    FinancieraService,
  ],
})
export class AdmtablaComponent implements OnInit {
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

  public dts_estructura: any;
  public dts_esquema: any;
  public dts_columnas: any;
  public m_nombretabla: any;
  public m_llaveprimaria: any;
  public m_esquema: any;
  public m_nombrecolumna: any;
  public m_tipocolumna: any;
  public m_detallecolumna: any;

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

    this.consulta_estructura();
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
    if (string == "VER_GRIDVIEW") {
      $("#pnl_gridview").show();
      $("#pnl_gridview_columnas").hide();
      $("#pnl_formulario").hide();
      $("#pnl_formulariocolumna").hide();
    }
    if (string == "NUEVA_TABLA") {
      $("#pnl_gridview").hide();
      $("#pnl_formulario").show();
      $("#pnl_formulariocolumna").hide();
      this.consulta_esquema();
      this.m_esquema = "";
      this.m_nombretabla = "";
      this.m_llaveprimaria = "";
    }
    if (string == "ELIMINA_TABLA") {
      $("#modalEliminaTabla").modal("show");
    }
    if (string == "VER_GRIDVIEW_COLUMNAS") {
      $("#pnl_gridview").hide();
      $("#pnl_gridview_columnas").show();
      $("#pnl_formulario").hide();
      $("#pnl_formulariocolumna").hide();
      $("#modalEliminaColumna").modal("hide");
    }
    if (string == "NUEVA_COLUMNA") {
      $("#pnl_gridview").hide();
      $("#pnl_gridview_columnas").hide();
      $("#pnl_formulario").hide();
      $("#pnl_formulariocolumna").show();
    }
    if (string == "ELIMINA_COLUMNA") {
      $("#modalEliminaColumna").modal("show");
    }
  }

  limpiar() {}
  consulta_estructura() {
    this._autenticacion.consultaEstructura().subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_estructura = this._fun.RemplazaNullArray(result);
          console.log(this.dts_estructura);
          this._fun.limpiatabla(".dt-estructura");
          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V3(
              [10, 20, 50],
              false
            );
            var table = $(".dt-estructura").DataTable(confiTable);
            this._fun.inputTable(table, [2]);
            this._fun.selectTable(table, [1]);
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
  consulta_esquema() {
    this._autenticacion.consultaEsquema().subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_esquema = this._fun.RemplazaNullArray(result);
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
  creaTabla() {
    this._autenticacion
      .creaTabla(this.m_esquema, this.m_nombretabla, this.m_llaveprimaria)
      .subscribe(
        (result: any) => {
          
          if (
            Array.isArray(result) &&
            result.length > 0 &&
            result[0]["_accion"] == "CORRECTO"
          ) {
            //this.dts_esquema = this._fun.RemplazaNullArray(result);
            this.prop_msg = result[0]["_mensaje"];
            this.prop_tipomsg = "success";
            this._msg.formateoMensaje("modal_success", this.prop_msg);
            this.consulta_estructura();
            this.paneles("VER_GRIDVIEW");
          } else {
            this.prop_msg = "Alerta: No se creo la tabla";
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
  preelimina_tabla(dts) {
    this.paneles("ELIMINA_TABLA");
    this.m_esquema = dts._esquema;
    this.m_nombretabla = dts._nombretabla;
  }
  eliminaTabla() {
    this._autenticacion
      .eliminaTabla(this.m_esquema, this.m_nombretabla)
      .subscribe(
        (result: any) => {
          
          if (
            Array.isArray(result) &&
            result.length > 0 &&
            result[0]["_accion"] == "CORRECTO"
          ) {
            $("#modalEliminaTabla").modal("hide");
            this.prop_msg = result[0]["_mensaje"];
            this.prop_tipomsg = "success";
            this._msg.formateoMensaje("modal_success", this.prop_msg);
            this.consulta_estructura();
          } else {
            this.prop_msg = "Alerta: No se elimino la tabla";
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
  pre_vercolumnas(dts) {
    console.log(dts);
    this.m_esquema = dts._esquema;
    this.m_nombretabla = dts._nombretabla;
    this.paneles("VER_GRIDVIEW_COLUMNAS");
    this.consulta_columnas();
  }
  consulta_columnas() {
    this._autenticacion
      .consultaColumnas(this.m_esquema, this.m_nombretabla)
      .subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            this.dts_columnas = this._fun.RemplazaNullArray(result);
            console.log("c", this.dts_columnas);
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
  creaColumna() {
    console.log(
      this.m_esquema,
      this.m_nombretabla,
      this.m_nombrecolumna,
      this.m_tipocolumna,
      this.m_detallecolumna
    );
    this._autenticacion
      .creaColumna(
        this.m_esquema,
        this.m_nombretabla,
        this.m_nombrecolumna,
        this.m_tipocolumna,
        this.m_detallecolumna
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
            this.consulta_columnas();
            this.paneles("VER_GRIDVIEW_COLUMNAS");
          } else {
            this.prop_msg = "Alerta: No se creo la tabla";
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
  preelimina_columna(dts) {
    console.log("columnas", dts);
    this.m_esquema = dts._esquema;
    this.m_nombretabla = dts._tabla;
    this.m_nombrecolumna = dts._nombrecolumna;
    this.m_tipocolumna = dts._tipodato;
    this.paneles("ELIMINA_COLUMNA");
  }
  eliminaColumna() {
    this._autenticacion
      .eliminaColumna(this.m_esquema, this.m_nombretabla, this.m_nombrecolumna)
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
            this.consulta_columnas();
            this.paneles("VER_GRIDVIEW_COLUMNAS");
          } else {
            this.prop_msg = "Alerta: No se creo la tabla";
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
}
