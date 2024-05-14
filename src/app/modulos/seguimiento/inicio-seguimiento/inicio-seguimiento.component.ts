import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Inputmask from "inputmask";
import { Globals } from "../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { SeguimientoService } from "../../seguimiento/seguimiento.service";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-inicio-seguimiento",
  templateUrl: "./inicio-seguimiento.component.html",
  styleUrls: ["./inicio-seguimiento.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SeguimientoService,
  ],
})
export class InicioSeguimientoComponent implements OnInit {
  /*VARIABLES PARA MASCARAS */
  public mask_numerodecimal: any;
  public mask_fecha: any;
  public mask_numero: any;
  public mask_gestion: any;

  //variables para el compononete de mensajes
  public prop_msg: string;
  public prop_tipomsg: string;
  public cargando = false;

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
  public dts_seguimiento: any;
  public dts_estadoproyectos: any;
  public dts_estadosupervision: any;
  public dts_supervision: any;
  public dts_equipotecnico: any;

  public m_id_proyecto: any;
  public m_id_supervision: any;
  public m_nrosupervision: any;
  public m_estado_proyecto: any;
  public m_estado_proyecto_anterior: any;
  public m_descripcion_estado_proyecto: any;
  public m_descripcion_estado_proyecto_anterior: any;

  public m_estado_supervision: any;
  public m_estado_supervision_anterior: any;
  public m_descripcion_estado_supervision: any;
  public m_descripcion_estado_supervision_anterior: any;
  public m_nombreproyecto: any;
  public m_fechainicio_planilla: any;
  public m_fechafin_planilla: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _seguimiento: SeguimientoService,

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
        return this.RolesAsignados(this.s_usu_id);
      })
      .then((dts) => {
        this.dts_roles_usuario = dts;
      })
      .catch(falloCallback);

    this.listaProyectos();
    this.ListaEstadosProyecto();
    this.ListaEstadosSupervision();
    // setTimeout(() => {
    //   this.InicializarGridView();
    // }, 500);
  }

  /*******************************************************************************/
  /*MASCARAS
  /*******************************************************************************/
  cargarmascaras() {
    // var gestion = document.getElementById("gestion");
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
    if (string == "EDITAR_ESTADOPROYECTO") {
      $("#pnl_gridview").hide();
      $("#pnl_formulario").show();
      $("#pnl_gridview_supervision").hide();
      $("#pnl_formulario_supervision").hide();
      $("#modalConfirmacion").modal("hide");
      $("#modalSupervision").modal("hide");
      $("#modalEliminaSupervision").modal("hide");
      $("#pnl_gridview_equipotecnico").hide();
    }
    if (string == "VER_GRIDVIEW") {
      $("#pnl_gridview").show();
      $("#pnl_formulario").hide();
      $("#pnl_gridview_supervision").hide();
      $("#pnl_formulario_supervision").hide();
      $("#modalConfirmacion").modal("hide");
      $("#modalSupervision").modal("hide");
      $("#modalEliminaSupervision").modal("hide");
      $("#pnl_gridview_equipotecnico").hide();
    }
    if (string == "VER_GRIDVIEW_SUPERVISION") {
      $("#pnl_gridview").hide();
      $("#pnl_formulario").hide();
      $("#pnl_gridview_supervision").show();
      $("#pnl_formulario_supervision").hide();
      $("#modalConfirmacion").modal("hide");
      $("#modalSupervision").modal("hide");
      $("#modalEliminaSupervision").modal("hide");
      $("#pnl_gridview_equipotecnico").hide();
    }
    if (string == "EDITAR_ESTADOSUPERVISION") {
      $("#pnl_gridview").hide();
      $("#pnl_formulario").hide();
      $("#pnl_gridview_supervision").hide();
      $("#pnl_formulario_supervision").show();
      $("#modalConfirmacion").modal("hide");
      $("#modalSupervision").modal("hide");
      $("#modalEliminaSupervision").modal("hide");
      $("#pnl_gridview_equipotecnico").hide();
    }
    if (string == "EQUIPO_TECNICO") {
      $("#pnl_gridview").hide();
      $("#pnl_formulario").hide();
      $("#pnl_gridview_supervision").hide();
      $("#pnl_formulario_supervision").hide();
      $("#modalConfirmacion").modal("hide");
      $("#modalSupervision").modal("hide");
      $("#modalEliminaSupervision").modal("hide");
      $("#pnl_gridview_equipotecnico").show();
    }
  }

  pre_estadoproyecto(dts: any, nombre_proyecto: any) {
    this.m_nombreproyecto = nombre_proyecto;
    this.m_id_proyecto = dts.id_proyecto;
    this.m_estado_proyecto_anterior = dts.estado_proyecto;
    this.m_estado_proyecto = dts.estado_proyecto;
    this.paneles("EDITAR_ESTADOPROYECTO");
  }
  pre_estadosupervision(dts: any) {
    this.m_id_proyecto = dts.fid_proyecto;
    this.m_id_supervision = dts.id_supervision;
    this.m_estado_supervision_anterior = dts.estado_supervision;
    this.m_estado_supervision = dts.estado_supervision;
    this.paneles("EDITAR_ESTADOSUPERVISION");
  }
  confirmacion_estadoproyecto() {
    $("#modalConfirmacion").modal("show");
    this.m_descripcion_estado_proyecto_anterior =
      this.dts_estadoproyectos.filter(
        (item) => item.codigo == this.m_estado_proyecto_anterior
      );
    this.m_descripcion_estado_proyecto = this.dts_estadoproyectos.filter(
      (item) => item.codigo == this.m_estado_proyecto
    );
    this.m_descripcion_estado_proyecto_anterior =
      this.m_descripcion_estado_proyecto_anterior[0].nombre;
    this.m_descripcion_estado_proyecto =
      this.m_descripcion_estado_proyecto[0].nombre;
  }
  confirmacion_estadosupervision() {
    $("#modalSupervision").modal("show");
    this.m_descripcion_estado_supervision_anterior =
      this.dts_estadosupervision.filter(
        (item) => item.codigo == this.m_estado_supervision_anterior
      );
    this.m_descripcion_estado_supervision = this.dts_estadosupervision.filter(
      (item) => item.codigo == this.m_estado_supervision
    );
    this.m_descripcion_estado_supervision_anterior =
      this.m_descripcion_estado_supervision_anterior[0].nombre;
    this.m_descripcion_estado_supervision =
      this.m_descripcion_estado_supervision[0].nombre;
  }
  /*Busqueda Proyectos*/
  listaProyectos() {
    this._seguimiento.listaProyectos().subscribe(
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
            this._fun.selectTable(table, [1, 4]);
            this._fun.inputTable(table, [2, 3]);
          }, 500);
        } else {
          this.prop_msg = "Alerta: No existen responsables registrados";
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

  ListaEstadosProyecto() {
    this._seguimiento.listaEstadosProyecto().subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_estadoproyectos = this._fun.RemplazaNullArray(result);
        } else {
          this.prop_msg = "Alerta: No existen responsables registrados";
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
  ListaEstadosSupervision() {
    this._seguimiento.listaEstadoSupervision().subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_estadosupervision = this._fun.RemplazaNullArray(result);
        } else {
          this.prop_msg = "Alerta: No existen responsables registrados";
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
  ActualizaEstadosProyecto() {
    this.cargando = true;
    this._seguimiento
      .actualizaEstadosProyecto(this.m_id_proyecto, this.m_estado_proyecto)
      .subscribe(
        (result: any) => {
          console.log(result);
          if (result.msg_estado == "CORRECTO") {
            this.prop_msg = result.message;
            this.prop_tipomsg = "modal_success";
            this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);

            this.paneles("VER_GRIDVIEW");
            this._fun.limpiatabla(".dt-seguimiento");
            setTimeout(() => {
              this.listaProyectos();
            }, 500);

            //this.DestruyeGridView();
          } else {
            this.prop_msg = "Alerta: No se efectuo el cambio de estado";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
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
  ActualizaEstadosSupervision() {
    this._seguimiento
      .actualizaEstadosSupervision(
        this.m_id_supervision,
        this.m_estado_supervision
      )
      .subscribe(
        (result: any) => {
          if (result.estado == "Correcto") {
            this.paneles("VER_GRIDVIEW_SUPERVISION");
            this._fun.limpiatabla(".dt-supervision");
            setTimeout(() => {
              this.listaSupervision();
            }, 500);
          } else {
            this.prop_msg = "Alerta: No existen responsables registrados";
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
  pre_listaSupervision(dts, nombre_proyecto) {
    this.m_nombreproyecto = nombre_proyecto;
    this.paneles("VER_GRIDVIEW_SUPERVISION");
    this.listaSupervision(dts);
    this._fun.limpiatabla(".dt-supervision");
  }
  listaSupervision(dts?) {
    if (dts != undefined) {
      this.m_id_proyecto = dts.id_proyecto;
    }
    this._seguimiento.listaSupervision(this.m_id_proyecto).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_supervision = this._fun.RemplazaNullArray(result);

          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V3(
              [10, 20, 50],
              false
            );
            var table = $(".dt-supervision").DataTable(confiTable);
            this._fun.selectTable(table, [6]);
          }, 500);
        } else {
          this.prop_msg = "Alerta: No existen responsables registrados";
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
  equipotecnico(id_proyecto, nombre_proyecto) {
    this.m_nombreproyecto = nombre_proyecto;
    this.paneles("EQUIPO_TECNICO");
    this._seguimiento.listaequipotecnico(id_proyecto).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_equipotecnico = this._fun.RemplazaNullArray(result);
          //console.log('equipotecnico',this.dts_equipotecnico);
          this._fun.limpiatabla(".dt-EquipoTecnico");
          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V3(
              [20, 40, 60, 100],
              false
            );
            var table = $(".dt-EquipoTecnico").DataTable(confiTable);
            // this._fun.inputTable(table, [0,6]);
            // this._fun.selectTable(table, [1,2,3,4,7,10]);
          }, 500);
        } else {
          this.prop_msg = "Alerta: No existen responsables registrados";
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
  ResetearContrasena(id_proyecto, id_usuario) {
    this._seguimiento.reseteocontrasena(id_usuario).subscribe(
      (result: any) => {
        if (result.estado == "CORRECTO") {
          this.equipotecnico(id_proyecto, this.m_nombreproyecto);
        } else {
          this.prop_msg = "Alerta: No existen responsables registradossss";
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
  ReponerPass(id_proyecto, id_usuario, row) {
    var nomfila = "#m_password" + row;
    var pass = $(nomfila).val();
    this._seguimiento.reponercontrasena(id_usuario, pass).subscribe(
      (result: any) => {
        if (result.estado == "CORRECTO") {
          this.equipotecnico(id_proyecto, this.m_nombreproyecto);
        } else {
          this.prop_msg = "Alerta: No existen responsables registradossss";
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
  /************************************ 
   Eliminar Planilla
  *************************************/

  pre_eliminarplanilla(dts) {
    $("#modalEliminaSupervision").modal("show");
    console.log("supervision", dts);
    this.m_id_proyecto = dts.fid_proyecto;
    this.m_id_supervision = dts.id_supervision;
    this.m_nrosupervision = dts.nro_supervision;
    this.m_fechainicio_planilla = dts.fecha_inicio;
    this.m_fechafin_planilla = dts.fecha_fin;
  }
  EliminarPlanilla() {
    this._seguimiento.eliminarPlanilla(this.m_id_supervision).subscribe(
      (result: any) => {
        console.log(result);
        if (result.estado == "CORRECTO") {
          this.paneles("VER_GRIDVIEW_SUPERVISION");
          this._fun.limpiatabla(".dt-supervision");
          setTimeout(() => {
            this.listaSupervision();
          }, 500);
        } else {
          this.prop_msg = "Alerta: No se puedo eliminar la planilla";
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
}
