import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Globals } from "../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import alasql from "alasql";
import * as moment from "moment";
import { NgSelect2Module } from "ng-select2";
import { ToastrService } from "ngx-toastr";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";
import { RrhhService } from "../rrhh.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important
@Component({
  selector: "app-permiso",
  templateUrl: "./permiso.component.html",
  styleUrls: ["./permiso.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    RrhhService,
    NgSelect2Module,
  ],
})
export class PermisoComponent implements OnInit {
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
  public dts_roles_usuario: any;
  public s_usu_id_sipta: any;
  public s_usu_id_sispre: any;
  public s_ci_user: any;
  public s_usu_bio: any;

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

  //variables propias del compononete
  public paternoBusqueda: string;
  public maternoBusqueda: string;
  public nombresBusqueda: string;
  public pnlUsuarios: boolean;
  public pnlPermisos: boolean;
  public dts_ListaUsuarios: any;
  public dts_permisos: any;
  public dts_TipoPermiso: any;
  public idTipoPermiso: any;
  public fechaDesde: any;
  public horaDesde: any;
  public fechaHasta: any;
  public horaHasta: any;
  public duracionDias: any;
  public motivo: any;
  public observacion: any;
  public id_usuario_biometrico: any;
  public comboSeleccion: any;
  public idUsuario: any;
  public permiso: {
    idPermiso: any;
    idUsuario: any;
    idTipoPermiso: any;
    fechaDesde: any;
    fechaHasta: any;
    duracionDias: any;
    horaDesde: any;
    horaHasta: any;
    motivo: any;
    observacion: any;
    estado: any;
    idUsuarioRegistro: any;
    operacion: any;
  };
  fechaValida: any;

  reporteF1: Date;
  reporteF2: Date;
  tipoPermisoDesc: string;
  ListaUsuariosTotal: any;
  flagBtnRegistrar: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _biometrico: RrhhService,

    private globals: Globals,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent,
    private datePipe: DatePipe,
    private base64: ImgBase64Globals,
    private toastr: ToastrService
  ) {
    this._route.parent.params.subscribe((parametros) => {
      this.s_idcon = parametros["idcon"];
      this.s_idmod = parametros["idmod"];
    });
    this.url = globals.rutaSrvFronEnd;
    this.s_imgLogo = base64.logocabecera;
    this.url_reporte = globals.rutaSrvReportes;
    this.permiso = {
      idPermiso: 0,
      idUsuario: null,
      idTipoPermiso: null,
      fechaDesde: "",
      fechaHasta: "",
      duracionDias: 0,
      horaDesde: "",
      horaHasta: "",
      motivo: "",
      observacion: "",
      estado: 1,
      idUsuarioRegistro: 0,
      operacion: "I",
    };
  }

  ngOnInit() {
    this.pnlUsuarios = false;
    this.pnlPermisos = false;
    this.paternoBusqueda = "";
    this.maternoBusqueda = "";
    this.nombresBusqueda = "";

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
        console.log("fecha actual", this.dtsFechaSrv);
        // this.fechaValida = moment(this.dtsFechaSrv).subtract(30, "days");
        // console.log("fecha valida", this.fechaValida);
        //this.dtsFechaSrv.getDate() - 5
        //);
        this.dtsFechaLiteral = dts3;
      })
      .then((dts) => {
        return this.RolesAsignados(this.s_usu_id);
      })
      .then((dts) => {
        this.dts_roles_usuario = dts;
        this.GuardarLocalStorage();
        return this.devuelveUsuarios();
      })
      .then((dts) => {
        console.log("Lista Usuarios Permiso", dts);
        this.ListaUsuariosTotal = dts;
        return this.armaDatosCombo(dts);
      })
      .then((dts) => {
        return this.listaTipoPermiso();
      })
      .then((dts) => {
        this.dts_TipoPermiso = dts;
        return this.parametrosConfiguracion("REGISTRO_BOLETAS");
      })
      .then((dts) => {
        console.log("JSON OBTENIDO", dts["valor"]);
        this.fechaValida = moment(this.dtsFechaSrv).subtract(
          dts["valor"],
          "days"
        );
        console.log("fecha valida", this.fechaValida);
      })
      .catch(falloCallback);
  }
  DatosConexion() {
    return new Promise((resolve, reject) => {
      this._autenticacion
        .getdatosconexion(this.s_idcon, this.s_idmod)
        .subscribe(
          (result: any) => {
            console.log("conexion", result);
            if (Array.isArray(result) && result.length > 0) {
              if (result[0]["_idrol"] != "") {
                this.s_idrol = result[0]["_idrol"];
                this.s_user = result[0]["_usu_user"];
                this.s_nomuser = result[0]["_usu_nom_com"];
                this.s_usu_id = result[0]["_usu_id"];
                this.s_usu_id_sipta = result[0]["_usu_id_sipta"];
                this.s_usu_id_sispre = result[0]["_usu_id_sispre"];
                this.s_ci_user = result[0]["_usu_ci"];
                this.s_usu_bio = result[0]["_usu_bio"];
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
  devuelveUsuarios() {
    return new Promise((resolve, reject) => {
      this._biometrico.listaUsuarioSispre(0).subscribe((result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          resolve(result);
        }
      });
    });
  }

  FechaLiteral(f) {
    return this._fun.FechaLiteral(f);
  }
  GuardarLocalStorage() {
    let dts_con = {
      s_idrol: this.s_idrol,
      s_user: this.s_user,
      s_nomuser: this.s_nomuser,
      s_usu_id: this.s_usu_id_sispre,
      s_usu_id_sipta: this.s_usu_id_sipta,
      s_usu_id_sispre: this.s_usu_id_sispre,
      s_ci_user: this.s_ci_user,
    };
    let dts_rol = this.dts_roles_usuario;

    localStorage.setItem("dts_con", JSON.stringify(dts_con));
    localStorage.setItem("dts_rol", JSON.stringify(dts_rol));
  }

  permisosUsuario(userid) {
    this.cargando = true;
    this.pnlPermisos = true;
    this.id_usuario_biometrico = userid;
    this._biometrico.listaPermisosUsuario(userid).subscribe((result: any) => {
      if (Array.isArray(result) && result.length > 0) {
        $(".dt-permisos").DataTable().destroy();

        this.dts_permisos = result;
        console.log("permisos", this.dts_permisos);
        setTimeout(() => {
          let confiTable = this._fun.CONFIGURACION_TABLA_V5(
            [50, 100, 150, 200],
            false,
            50,
            [[0, "asc"]]
          );
          var table = $(".dt-permisos").DataTable(confiTable);
          this._fun.inputTable(table, [1, 2, 3, 5, 8]);
          this.cargando = false;
        }, 500);
      } else {
        this.dts_permisos = null;
        $(".dt-permisos").DataTable().destroy();
        this.prop_msg = "Alerta: No existen registrados";
        this.prop_tipomsg = "danger";
        this._msg.formateoMensaje("modal_warning", this.prop_msg);
        this.cargando = false;
      }
    });
  }

  listaTipoPermiso() {
    return new Promise((resolve, reject) => {
      this._biometrico.listaTipoPermiso().subscribe((result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          //resolve(result.filter((obj) => obj.IdTipoPermiso != 7));
          let dts = alasql(
            `select * from ? where IdTipoPermiso in (1,3,4,6,11,9,12,14)`,
            [result]
          );
          resolve(dts);
        }
      });
    });
  }

  limpiarPaneles() {
    $(".dt-usuarios").DataTable().destroy();
    this.pnlUsuarios = false;
    $(".dt-permisos").DataTable().destroy();
    this.pnlPermisos = false;
  }
  armaDatosCombo(dts) {
    var combo = new Array(dts.length);

    dts.forEach((element) => {
      let registro = {
        id: element.t_userid,
        text: element.nombre,
      };
      combo.push(registro);
    });
    this.comboSeleccion = combo;
    this.comboSeleccion = this.comboSeleccion.filter(function (el) {
      return el != null;
    });

    return this.comboSeleccion;
  }
  modificarPermiso() {
    var duracionDias = 0;
    if (
      moment(this.permiso.fechaHasta + " " + this.permiso.horaHasta) >=
        moment(this.permiso.fechaDesde + " " + this.permiso.horaDesde) &&
      this.permiso.idTipoPermiso != "" &&
      this.motivo != ""
    ) {
      var fechaInicio = moment(this.permiso.fechaDesde);
      var fechaFin = moment(this.permiso.fechaHasta);
      var horaInicio = moment(this.permiso.horaDesde, "HH:mm:ss");
      var horaFin = moment(this.permiso.horaHasta, "HH:mm:ss");
      duracionDias = fechaFin.diff(fechaInicio, "days");
      duracionDias += horaFin.diff(horaInicio, "hours") <= 4 ? 0.5 : 1;
      this.permiso.duracionDias = duracionDias;
    } else {
      this.prop_msg =
        "Alguno de los campos está vacío o las fecha/hora hasta es menor que la fecha/hora desde ";

      this.prop_tipomsg = "modal_warning";

      this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
      return;
    }
    this.permiso.idUsuario = this.id_usuario_biometrico;
    this.permiso.idUsuarioRegistro = this.s_usu_bio;
    this.permiso.operacion = "U";
    this.permiso.estado = 1;

    this._biometrico.insertaPermiso(this.permiso).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          console.log(result);
          $("#modalPermisos").modal("hide");
          this.permisosUsuario(this.id_usuario_biometrico);
          this.prop_msg = result[0]["_mensaje"];

          this.prop_tipomsg = result[0]["_accion"].includes("Error")
            ? "modal_warning"
            : "modal_success";
          this.limpiarModalPermiso();
          this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
        } else {
          this.prop_msg = "Alerta: No existen registrados";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          // console.log(this.errorMessage);
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos ";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      }
    );
  }
  bajaPermiso() {
    this.permiso.idUsuario = this.id_usuario_biometrico;
    this.permiso.idUsuarioRegistro = this.s_usu_bio;
    this.permiso.operacion = "D";
    this.permiso.estado = 1;

    this._biometrico.insertaPermiso(this.permiso).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          console.log(result);
          $("#modalConfirmaBajaPermiso").modal("hide");
          this.permisosUsuario(this.id_usuario_biometrico);
          this.prop_msg = result[0]["_mensaje"];

          this.prop_tipomsg = result[0]["_accion"].includes("Error")
            ? "modal_warning"
            : "modal_success";
          this.limpiarModalPermiso();
          this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
        } else {
          this.prop_msg = "Alerta: No existen registrados";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          // console.log(this.errorMessage);
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos ";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      }
    );
  }

  datosModal(datos, tipo) {
    console.log(datos);
    if (tipo == "U") {
      $("#btnRegistrar").hide();
      $("#btnModificar").show();
    }
    this.permiso.idPermiso = datos.IdPermiso;
    this.permiso.idTipoPermiso = datos.IdTipoPermiso;
    this.permiso.fechaDesde = datos.FechaDesdeN.substr(0, 10);
    this.permiso.fechaHasta = datos.FechaHastaN.substr(0, 10);
    this.permiso.horaDesde = datos.HoraDesde;
    this.permiso.horaHasta = datos.HoraHasta;
    this.permiso.motivo = datos.Motivo;
    this.permiso.observacion = datos.Observacion;
    console.log(this.permiso);
  }

  guardarPermiso() {
    var duracionDias = 0;
    if (
      moment(this.permiso.fechaHasta + " " + this.permiso.horaHasta) >=
        moment(this.permiso.fechaDesde + " " + this.permiso.horaDesde) &&
      this.permiso.idTipoPermiso != "" &&
      this.permiso.motivo != ""
    ) {
      var fechaInicio = moment(this.permiso.fechaDesde);
      var fechaFin = moment(this.permiso.fechaHasta);
      var horaInicio = moment(this.permiso.horaDesde, "HH:mm:ss");
      var horaFin = moment(this.permiso.horaHasta, "HH:mm:ss");
      duracionDias = fechaFin.diff(fechaInicio, "days");
      duracionDias += horaFin.diff(horaInicio, "hours") <= 4 ? 0.5 : 1;
      this.permiso.duracionDias = duracionDias;
    } else {
      this.prop_msg =
        "Alguno de los campos está vacío o las fecha/hora hasta es menor que la fecha/hora desde ";

      this.prop_tipomsg = "modal_warning";

      this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
      return;
    }
    this.permiso.idUsuario = this.id_usuario_biometrico;
    this.permiso.idUsuarioRegistro = this.s_usu_bio;
    this.permiso.operacion = "I";

    this._biometrico.insertaPermiso(this.permiso).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          console.log(result);
          $("#modalPermisos").modal("hide");
          this.permisosUsuario(this.id_usuario_biometrico);
          this.prop_msg = result[0]["_mensaje"];

          this.prop_tipomsg = result[0]["_accion"].includes("Error")
            ? "modal_warning"
            : "modal_success";
          this.limpiarModalPermiso();
          $("#modalConfirmacion").modal("hide");
          this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
        } else {
          this.prop_msg = "Alerta: No existen registrados";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          // console.log(this.errorMessage);
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos ";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      }
    );
  }

  abrirModal() {
    this.permiso = {
      idPermiso: 0,
      idUsuario: null,
      idTipoPermiso: null,
      fechaDesde: "",
      fechaHasta: "",
      duracionDias: 0,
      horaDesde: "",
      horaHasta: "",
      motivo: "",
      observacion: "",
      estado: 1,
      idUsuarioRegistro: 0,
      operacion: "I",
    };

    $("#btnRegistrar").show();
    $("#btnModificar").hide();
  }

  limpiarModalPermiso() {
    this.permiso = {
      idPermiso: 0,
      idUsuario: null,
      idTipoPermiso: null,
      fechaDesde: "",
      fechaHasta: "",
      duracionDias: 0,
      horaDesde: "",
      horaHasta: "",
      motivo: "",
      observacion: "",
      estado: 1,
      idUsuarioRegistro: 0,
      operacion: "I",
    };
    $("#idTipoPermiso").val("");
  }
  muestraPermisos() {
    console.log(this.idUsuario);

    if (
      this.idUsuario != null &&
      this.idUsuario != "" &&
      this.idUsuario != "undefined"
    ) {
      this.permisosUsuario(this.idUsuario);
      this.flagBtnRegistrar = this.ListaUsuariosTotal.filter(
        (item) => item.t_userid == this.idUsuario
      )[0]["id_estado"];
      console.log("flagBtn", this.flagBtnRegistrar);
    }
  }
  listaUsuarios() {
    this.limpiarPaneles();
    if (this.nombresBusqueda == "") {
      this.nombresBusqueda = null;
    }
    if (this.paternoBusqueda == "") {
      this.paternoBusqueda = null;
    }
    if (this.maternoBusqueda == "") {
      this.maternoBusqueda = null;
    }
    this.cargando = true;
    this._biometrico
      .listaUsuariosDatosPendientes(
        this.nombresBusqueda,
        this.paternoBusqueda,
        this.maternoBusqueda
      )
      .subscribe((result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          $(".dt-usuarios").DataTable().destroy();
          this.pnlUsuarios = true;

          let datos = result.filter((obj) => obj.estado == 1);
          this.dts_ListaUsuarios = this._fun.RemplazaNullArray(datos);

          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V4(
              [50, 100, 150, 200],
              false,
              20
            );
            var table = $(".dt-usuarios").DataTable(confiTable);
            this._fun.inputTable(table, [1, 2, 3, 4, 6]);
            this.cargando = false;
          }, 500);
        } else {
          this.prop_msg = "Alerta: No existen registrados";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      });
  }
  insertarValidaHoras() {
    this.permiso.idUsuario = this.id_usuario_biometrico;
    this._biometrico.verificaMinutosUsuario(this.permiso).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          console.log(result);
          this.permisosUsuario(this.id_usuario_biometrico);
          this.prop_msg = result[0]["mensaje"];
          if (result[0]["mensaje"].includes("SALDO") != "SALDO") {
            $("#modalConfirmacion").modal("show");
            $("#btnInsConfirmar").show();
            $("#modalPermisos").modal("show");
            return;
          } else {
            this.guardarPermiso();
          }
        } else {
          this.prop_msg = "Alerta: No existen registrados";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          // console.log(this.errorMessage);
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos ";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      }
    );
  }
  parametrosConfiguracion(codigo) {
    return new Promise((resolve, reject) => {
      this._autenticacion.parametrosConfiguracionRRHH(codigo).subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            resolve(result[0]);
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

  reportePermisos(tipoReporte: string) {
    console.log(
      "reportePermisos",
      this.id_usuario_biometrico,
      this.dts_TipoPermiso,
      this.tipoPermisoDesc
    );
    this.cargando = true;
    console.log("generando reporte");
    const tp = this.tipoPermisoDesc || "TODOS";
    const miDTS = {
      tipoReporte,
      id: this.id_usuario_biometrico,
      f1: moment(this.reporteF1).format("YYYYMMDD"),
      f2: moment(this.reporteF2).format("YYYYMMDD"),
      tipoPermiso: tp,
    };
    let nombreReporte = `Permisos_${this.id_usuario_biometrico}.xlsx`;
    this._biometrico.reportes(miDTS).subscribe(
      (result: any) => {
        console.log(result);
        const url = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", nombreReporte);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        this.cargando = false;
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor");
        this.cargando = false;
      }
    );
  }
}
