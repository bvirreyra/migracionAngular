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
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";
import { RrhhService } from "../rrhh.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-horario",
  templateUrl: "./horario.component.html",
  styleUrls: ["./horario.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    RrhhService,
    NgSelect2Module,
  ],
})
export class HorarioComponent implements OnInit {
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

  //variables del componente
  public dts_asistencia: any;
  public fecha_inicio: string;
  public fecha_fin: string;
  public dts_funcionario: any;
  public e_usuario: any;
  public dts_tipoHorario: any;
  public dts_horarioExcepcion: any;
  public dts_grupo: any;
  public pnlGrupo: boolean;
  public dts_grupoFuncionario: any;
  public dts_tipoHorarioActual: any;
  public dts_tipoHorarioDestino: any;
  public dts_grupoFuncionarioModificacion: any;
  public dts_tipoPermiso: any;
  public dts_usuarioSQL: any;
  public tipoHorario: {
    idTipoHorario;
    descripcionHorario;
    horaIngreso1;
    horaSalida1;
    horaIngreso2;
    horaSalida2;
    minutosTolerancia1;
    minutosTolerancia2;
    estado;
    usuarioRegistro;
    operacion;
  };

  public grupoHorario_Usuario: {
    idUsuario;
    idGrupoUsuario;
    idTipoHorario;
    idGrupoFuncionario;
    fechaDesde;
    estado;
    idUsuarioRegistro;
    operacion;
    idTipoHorarioAnterior;
  };

  public horarioExcepcion: {
    idHorarioExcepcion;
    idTipoPermiso;
    idUsuarioBiometrico;
    fechaDesde;
    fechaHasta;
    horaIngreso1;
    horaSalida1;
    horaIngreso2;
    horaSalida2;
    diasAplica;
    estado;
    idUsuarioRegistro;
    operacion;
  };
  public diasAplica: {
    lunes;
    martes;
    miercoles;
    jueves;
    viernes;
  };
  fechaValida: any;
  public comboSeleccion: any;
  public dts_usuarioSQLCombo: any;

  llave: any;
  dts_permisos: any;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _biometrico: RrhhService,

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
    this.tipoHorario = {
      idTipoHorario: null,
      descripcionHorario: "",
      horaIngreso1: "",
      horaSalida1: "",
      horaIngreso2: null,
      horaSalida2: null,
      minutosTolerancia1: 0,
      minutosTolerancia2: 0,
      estado: 1,
      usuarioRegistro: null,
      operacion: "I",
    };
    this.grupoHorario_Usuario = {
      idUsuario: 0,
      idGrupoUsuario: null,
      idTipoHorario: 0,
      idGrupoFuncionario: 0,
      fechaDesde: null,
      estado: 1,
      idUsuarioRegistro: 0,
      operacion: "I",
      idTipoHorarioAnterior: null,
    };
    this.pnlGrupo = false;
    this.horarioExcepcion = {
      idHorarioExcepcion: null,
      idTipoPermiso: 0,
      idUsuarioBiometrico: null,
      fechaDesde: "",
      fechaHasta: "",
      horaIngreso1: "",
      horaSalida1: "",
      horaIngreso2: "",
      horaSalida2: "",
      diasAplica: "",
      estado: 1,
      idUsuarioRegistro: null,
      operacion: "I",
    };
    this.diasAplica = {
      lunes: false,
      martes: false,
      miercoles: false,
      jueves: false,
      viernes: false,
    };
  }

  ngOnInit() {
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
        this.dts_roles_usuario = dts;
        this.GuardarLocalStorage();
        this.dts_permisos = JSON.parse(localStorage.getItem("dts_permisos"));
        return this.devuelveUsuarios();
      })
      .then((dts) => {
        //DEVUELVE USUARIO DE SISUPRE
        this.dts_funcionario = dts;
        console.log("FUNCIONARIOS", this.dts_funcionario);
        this.e_usuario = this.s_usu_id;
        return this.listaTipoHorario();
      })
      .then((dts) => {
        this.dts_tipoHorarioDestino = dts;
        this.dts_tipoHorarioActual = dts;
        return this.listaGrupoFuncionario();
      })
      .then((dts) => {
        this.dts_grupoFuncionario = dts;
        return this.listaTipoPermiso();
      })
      .then((dts) => {
        this.dts_tipoPermiso = dts;
        console.log("Tipo Excepcion", dts);
        return this.listaUsuarios();
      })
      .then((dts) => {
        console.log("lista usuarios", dts);
        let dtsusuarioSQL = this.mergeTablas(dts, this.dts_funcionario);
        console.log("despues del merge", this.dts_usuarioSQL);
        //filtrando usuarios activos
        this.dts_usuarioSQL = alasql("select * from ? where id_estado=1", [
          dtsusuarioSQL,
        ]);
        this.cargarDatos();
        return this.parametrosConfiguracion("REGISTRO_BOLETAS");
      })
      .then((dts) => {
        console.log("JSON OBTENIDO", dts["valor"]);
        this.llave = dts["valor"];
        this.fechaValida = moment(this.dtsFechaSrv).subtract(
          dts["valor"],
          "days"
        );
        console.log("fecha valida", this.fechaValida);
        return this.armaDatosCombo(this.dts_usuarioSQL);
      })
      .then((dts) => {
        this.dts_usuarioSQLCombo = dts;
        console.log("LISTA USUARIOS", this.dts_usuarioSQL);
        console.log("LISTA USUARIOS", this.dts_usuarioSQLCombo);
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
  armaDatosCombo(dts) {
    var combo = new Array(dts.length);
    let registro_inicial = {
      id: 0,
      text: "TODOS",
    };
    combo.push(registro_inicial);

    dts.forEach((element) => {
      let registro = {
        id: element.IdUsuario,
        text: element.Nombre,
      };
      combo.push(registro);
    });
    this.comboSeleccion = combo;
    this.comboSeleccion = this.comboSeleccion.filter(function (el) {
      return el != null;
    });

    return this.comboSeleccion;
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

  cargarDatos() {
    this.listarTipoHorario();
  }

  limpiarModalGrupoFuncionario() {
    this.grupoHorario_Usuario.idUsuario = 0;
    this.grupoHorario_Usuario.idTipoHorario = 0;
    this.grupoHorario_Usuario.idGrupoFuncionario = 0;
    this.grupoHorario_Usuario.fechaDesde = null;
    this.grupoHorario_Usuario.estado = 1;
    this.grupoHorario_Usuario.idUsuarioRegistro = 0;
    this.grupoHorario_Usuario.operacion = "I";
    this.grupoHorario_Usuario.idTipoHorarioAnterior = null;
  }

  insertarHorario() {
    if (
      this.tipoHorario.descripcionHorario == "" ||
      this.tipoHorario.horaIngreso1 == "" ||
      this.tipoHorario.horaSalida1 == ""
    ) {
      this.prop_msg =
        "No se puede actualizar se requiere al menos el horario 1";
      this._msg.formateoMensaje("modal_info", this.prop_msg);
      return;
    }
    this.tipoHorario.usuarioRegistro = this.s_usu_bio;

    this._biometrico.insertaHorario(this.tipoHorario).subscribe(
      (result: any) => {
        $("#modalHorario").modal("hide");
        this.listarTipoHorario();
        // this.limpiarModalHorario();
        this.prop_msg = result[0]["_mensaje"];

        this.prop_tipomsg = result[0]["_accion"].includes("Error")
          ? "modal_warning"
          : "modal_success";
        this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          // console.log(this.errorMessage);
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos ";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_warning", this.prop_msg);
        }
      }
    );
  }

  insertarGrupoUsuario() {
    if (
      this.grupoHorario_Usuario.idGrupoFuncionario <= 0 ||
      this.grupoHorario_Usuario.idTipoHorarioAnterior <= 0 ||
      this.grupoHorario_Usuario.idTipoHorario <= 0 ||
      this.grupoHorario_Usuario.fechaDesde == null
    ) {
      this.prop_msg = "No se puede actualizar porque existen datos vacios.";
      this._msg.formateoMensaje("modal_info", this.prop_msg);
      return;
    }
    this.grupoHorario_Usuario.idUsuarioRegistro = this.s_usu_bio;
    this.grupoHorario_Usuario.operacion = "U";

    var a = this.grupoHorario_Usuario;
    console.log(a);

    this._biometrico.insertaGrupousuario(a).subscribe(
      (result: any) => {
        $("#modalGrupoFuncionario").modal("hide");
        this.limpiarModalGrupoFuncionario();
        this.prop_msg = result[0]["_mensaje"];

        this.prop_tipomsg = result[0]["_accion"].includes("Error")
          ? "modal_warning"
          : "modal_success";
        this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          // console.log(this.errorMessage);
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos ";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_warning", this.prop_msg);
        }
      }
    );
  }
  limpiarModalmodalExcepcion() {
    this.horarioExcepcion = {
      idHorarioExcepcion: null,
      idTipoPermiso: 0,
      idUsuarioBiometrico: null,
      fechaDesde: "",
      fechaHasta: "",
      horaIngreso1: "",
      horaSalida1: "",
      horaIngreso2: "",
      horaSalida2: "",
      diasAplica: "",
      estado: 1,
      idUsuarioRegistro: null,
      operacion: "I",
    };
    this.diasAplica.lunes = false;
    this.diasAplica.martes = false;
    this.diasAplica.miercoles = false;
    this.diasAplica.jueves = false;
    this.diasAplica.viernes = false;

    this.listahorarioExcepcion();
  }

  modificarHorarioExcepcion() {
    if (
      this.horarioExcepcion.idTipoPermiso <= 0 ||
      this.horarioExcepcion.idUsuarioBiometrico == null ||
      this.horarioExcepcion.fechaHasta == "" ||
      this.horarioExcepcion.fechaDesde == "" ||
      this.horarioExcepcion.horaIngreso1 == "" ||
      this.horarioExcepcion.horaSalida1 == ""
    ) {
      this.prop_msg = "No se puede actualizar porque existen datos vacios.";
      this._msg.formateoMensaje("modal_info", this.prop_msg);
      return;
    }
    this.horarioExcepcion.idUsuarioRegistro = this.s_usu_bio;

    var dias = "";
    if (this.diasAplica.lunes)
      if (dias != "") dias = dias + "-1";
      else dias = dias + "1";

    if (this.diasAplica.martes)
      if (dias != "") dias = dias + "-2";
      else dias = dias + "2";

    if (this.diasAplica.miercoles)
      if (dias != "") dias = dias + "-3";
      else dias = dias + "3";

    if (this.diasAplica.jueves)
      if (dias != "") dias = dias + "-4";
      else dias = dias + "4";

    if (this.diasAplica.viernes)
      if (dias != "") dias = dias + "-5";
      else dias = dias + "5";

    this.horarioExcepcion.diasAplica = dias;

    this._biometrico.insertaHorarioExcepcion(this.horarioExcepcion).subscribe(
      (result: any) => {
        $("#modalExcepcion").modal("hide");
        this.limpiarModalmodalExcepcion();
        this.prop_msg = result[0]["_mensaje"];

        this.prop_tipomsg = result[0]["_accion"].includes("Error")
          ? "modal_warning"
          : "modal_success";
        this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          // console.log(this.errorMessage);
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos ";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_warning", this.prop_msg);
        }
      }
    );
  }

  insertarHorarioExcepcion() {
    if (
      this.horarioExcepcion.idTipoPermiso <= 0 ||
      this.horarioExcepcion.idUsuarioBiometrico == null ||
      this.horarioExcepcion.fechaHasta == "" ||
      this.horarioExcepcion.fechaDesde == "" ||
      this.horarioExcepcion.horaIngreso1 == "" ||
      this.horarioExcepcion.horaSalida1 == ""
    ) {
      this.prop_msg = "No se puede actualizar porque existen datos vacios.";
      this._msg.formateoMensaje("modal_info", this.prop_msg);
      return;
    }
    this.horarioExcepcion.idUsuarioRegistro = this.s_usu_bio;

    var dias = "";
    if (this.diasAplica.lunes)
      if (dias != "") dias = dias + "-1";
      else dias = dias + "1";

    if (this.diasAplica.martes)
      if (dias != "") dias = dias + "-2";
      else dias = dias + "2";

    if (this.diasAplica.miercoles)
      if (dias != "") dias = dias + "-3";
      else dias = dias + "3";

    if (this.diasAplica.jueves)
      if (dias != "") dias = dias + "-4";
      else dias = dias + "4";

    if (this.diasAplica.viernes)
      if (dias != "") dias = dias + "-5";
      else dias = dias + "5";

    this.horarioExcepcion.diasAplica = dias;
    this._biometrico.insertaHorarioExcepcion(this.horarioExcepcion).subscribe(
      (result: any) => {
        $("#modalExcepcion").modal("hide");
        this.limpiarModalmodalExcepcion();
        this.prop_msg = result[0]["_mensaje"];

        this.prop_tipomsg = result[0]["_accion"].includes("Error")
          ? "modal_warning"
          : "modal_success";
        this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          // console.log(this.errorMessage);
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos ";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_warning", this.prop_msg);
        }
      }
    );
  }
  abrirModal() {
    this.horarioExcepcion = {
      idHorarioExcepcion: null,
      idTipoPermiso: 0,
      idUsuarioBiometrico: null,
      fechaDesde: "",
      fechaHasta: "",
      horaIngreso1: "",
      horaSalida1: "",
      horaIngreso2: "",
      horaSalida2: "",
      diasAplica: "",
      estado: 1,
      idUsuarioRegistro: null,
      operacion: "I",
    };

    $("#btnRegistrarEx").show();
    $("#btnModificarEx").hide();
    $("#usuarioBiometrico :input").prop("disabled", false);
  }

  datosModal(datos, tipo) {
    console.log(datos);
    if (tipo == "U") {
      $("#btnRegistrarEx").hide();
      $("#btnModificarEx").show();
      $("#usuarioBiometrico :input").prop("disabled", true);
    }
    this.horarioExcepcion.idUsuarioRegistro = this.s_usu_bio;
    this.horarioExcepcion.idHorarioExcepcion = datos.IdHorarioExcepcion;
    this.horarioExcepcion.idTipoPermiso = datos.IdTipoPermiso;
    this.horarioExcepcion.idUsuarioBiometrico = datos.Biometrico;
    this.horarioExcepcion.fechaDesde = datos.FechaDesdeN.substr(0, 10);
    this.horarioExcepcion.fechaHasta = datos.FechaHastaN.substr(0, 10);
    var aplica = datos.DiasAplica;
    this.diasAplica.lunes = aplica.includes("1") ? true : false;
    this.diasAplica.martes = aplica.includes("2") ? true : false;
    this.diasAplica.miercoles = aplica.includes("3") ? true : false;
    this.diasAplica.jueves = aplica.includes("4") ? true : false;
    this.diasAplica.viernes = aplica.includes("5") ? true : false;
    this.horarioExcepcion.horaIngreso1 = datos.HoraIngreso1;
    this.horarioExcepcion.horaSalida1 = datos.HoraSalida1;
    this.horarioExcepcion.horaIngreso2 = datos.HoraIngreso2;
    this.horarioExcepcion.horaSalida2 = datos.HoraSalida2;
    this.horarioExcepcion.operacion = "U";
  }

  EliminarExcepcion(datos, tipo) {
    console.log(datos);

    this.horarioExcepcion.idUsuarioRegistro = this.s_usu_bio;
    this.horarioExcepcion.idHorarioExcepcion = datos.IdHorarioExcepcion;
    this.horarioExcepcion.idTipoPermiso = datos.IdTipoPermiso;
    this.horarioExcepcion.idUsuarioBiometrico = datos.Biometrico;
    this.horarioExcepcion.fechaDesde = datos.FechaDesdeN.substr(0, 10);
    this.horarioExcepcion.fechaHasta = datos.FechaHastaN.substr(0, 10);
    var aplica = datos.DiasAplica;
    this.diasAplica.lunes = aplica.includes("1") ? true : false;
    this.diasAplica.martes = aplica.includes("2") ? true : false;
    this.diasAplica.miercoles = aplica.includes("3") ? true : false;
    this.diasAplica.jueves = aplica.includes("4") ? true : false;
    this.diasAplica.viernes = aplica.includes("5") ? true : false;
    this.horarioExcepcion.horaIngreso1 = datos.HoraIngreso1;
    this.horarioExcepcion.horaSalida1 = datos.HoraSalida1;
    this.horarioExcepcion.horaIngreso2 = datos.HoraIngreso2;
    this.horarioExcepcion.horaSalida2 = datos.HoraSalida2;
    this.horarioExcepcion.operacion = tipo;
    this.horarioExcepcion.idUsuarioRegistro = this.s_usu_bio;

    this._biometrico.insertaHorarioExcepcion(this.horarioExcepcion).subscribe(
      (result: any) => {
        this.prop_msg = result[0]["_mensaje"];
        this.prop_tipomsg = result[0]["_accion"].includes("Error")
          ? "modal_warning"
          : "modal_success";
        this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos ";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_warning", this.prop_msg);
        }
      }
    );
    this.limpiarModalmodalExcepcion();
  }

  listarTipoHorario() {
    this._biometrico.listaTipoHorario().subscribe(
      (result: any) => {
        this.listahorarioExcepcion();
        if (Array.isArray(result) && result.length > 0) {
          $(".dt-horarios").DataTable().destroy();
          this.dts_tipoHorario = result;
          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V4(
              [10, 20, 50, 100],
              false,
              20,
              0,
              "desc"
            );
            $(".dt-horarios").DataTable(confiTable);
            this.cargando = false;
          }, 500);
        } else {
          this.prop_msg = "Alerta: No existen registros en el biometrico";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
          this.cargando = false;
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

  listahorarioExcepcion() {
    this._biometrico.listaHorarioExcepcion().subscribe((result: any) => {
      if (Array.isArray(result) && result.length > 0) {
        $(".dt-excepcion").DataTable().destroy();
        var a = this.mergeTablas(result, this.dts_funcionario);
        this.dts_horarioExcepcion = a;
        setTimeout(() => {
          let confiTable = this._fun.CONFIGURACION_TABLA_V5(
            [50, 100, 150, 200],
            false,
            50,
            [[0, "asc"]]
          );
          var table = $(".dt-excepcion").DataTable(confiTable);
          this._fun.inputTable(table, [1, 2, 3, 4, 5, 10]);
          this.cargando = false;
        }, 500);
      }
    });
  }

  changeTipoHorario() {
    var seleccionado = this.grupoHorario_Usuario.idTipoHorario;
    this._biometrico.listaDetalleGrupoFuncionario(seleccionado).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_grupoFuncionarioModificacion = this.mergeTablas(
            result,
            this.dts_funcionario
          );
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
          this.cargando = false;
        }
      }
    );
  }

  muestraDetalleFuncionarios(idTipoHorario) {
    this.pnlGrupo = true;
    this.cargando = true;
    this._biometrico.listaDetalleGrupoFuncionario(idTipoHorario).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          $(".dt-detalle").DataTable().destroy();
          this.dts_grupo = this.mergeTablas(result, this.dts_funcionario);
          this.dts_grupoFuncionarioModificacion = this.dts_grupo;
          this.grupoHorario_Usuario.idTipoHorarioAnterior = idTipoHorario;
          this.grupoHorario_Usuario.idGrupoFuncionario =
            this.dts_grupo[0]["IdGrupoFuncionario"];
          // var a = this.dts_tipoHorarioDestino.filter((obj) => {
          //   obj.IdTipoHorario != idTipoHorario;
          // });
          // console.log(a);
          // this.dts_tipoHorarioDestino = a;

          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V4(
              [10, 20, 50, 100],
              false,
              20,
              0,
              "desc"
            );
            var table = $(".dt-detalle").DataTable(confiTable);
            this._fun.inputTable(table, [1, 5, 6]);
            this.cargando = false;
          }, 500);
        } else {
          this.dts_grupo = null;
          $(".dt-detalle").DataTable().destroy();
          let confiTable = this._fun.CONFIGURACION_TABLA_V4(
            [10, 20, 50, 100],
            false,
            20,
            0,
            "desc"
          );
          setTimeout(() => {
            var table = $(".dt-detalle").DataTable(confiTable);
            this._fun.inputTable(table, [1, 2, 3]);
            this.cargando = false;
          }, 500);
          this.prop_msg = "No existen registros con el Horario seleccionado";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
          this.limpiarModalGrupoFuncionario();
          this.cargando = false;
          this.pnlGrupo = false;
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
          this.cargando = false;
        }
      }
    );
  }

  devuelveUsuarios() {
    var id_usu_siga = 0;

    return new Promise((resolve, reject) => {
      this._biometrico
        .listaUsuarioSispre(id_usu_siga)
        .subscribe((result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            resolve(result);
          }
        });
    });
  }

  listaTipoHorario() {
    return new Promise((resolve, reject) => {
      this._biometrico.listaTipoHorario().subscribe((result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          resolve(result);
        }
      });
    });
  }

  listaGrupoFuncionario() {
    return new Promise((resolve, reject) => {
      this._biometrico.listaGrupoFuncionario().subscribe((result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          resolve(result);
        }
      });
    });
  }

  mergeTablas(array1, array2) {
    //ARRAY 1 USUARIOS BIOMETRICO
    //ARRAY 2 USUARIOS SISUPRE
    for (let index1 = 0; index1 < array1.length; index1++) {
      //Tabla Asistencia
      for (let index2 = 0; index2 < array2.length; index2++) {
        // Tabla Usuarios

        if (array1[index1]["IdUsuario"] == array2[index2]["t_userid"]) {
          array1[index1]["Nombre"] = array2[index2]["nombre"];
          array1[index1]["id_estado"] = array2[index2]["id_estado"];
        }
      }
    }
    return array1;
  }

  listaTipoPermiso() {
    return new Promise((resolve, reject) => {
      this._biometrico.listaTipoPermiso().subscribe((result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          //resolve(result.filter((obj) => obj.IdTipoPermiso >= 7));
          let dts = alasql(
            `select * from ? where IdTipoPermiso in (8,10,13,7)`,
            [result]
          );
          resolve(dts);
        }
      });
    });
  }

  listaUsuarios() {
    return new Promise((resolve, reject) => {
      this._biometrico.listaUsuarioSQL().subscribe((result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          resolve(result);
        }
      });
    });
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
}
