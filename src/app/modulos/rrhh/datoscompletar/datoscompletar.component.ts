import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Inputmask from "inputmask";
import { Globals } from "../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import * as moment from "moment";
import { AdmusuariosService } from "../../seguridad/admusuarios/admusuarios.service";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";
import { RrhhService } from "../rrhh.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-grupo-funcionario",
  templateUrl: "./datoscompletar.component.html",
  styleUrls: ["./datoscompletar.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    RrhhService,
  ],
})
export class DatosCompletarComponent implements OnInit {
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
  public s_usu_bio: any;
  public s_ci_user: any;

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
  public pnlModalEliminaProveido = false;
  public pnlModalEditarProveido = false;
  public pnlListaProveidos = false;
  public pnlModalNuevoUsuario = false;
  public pnlModalEliminaRegistro = false;

  /*Variables del módulo*/
  public m_nombres: any; //---juan
  public m_apaterno: any;
  public m_amaterno: any;
  public m_nusuario: any;
  public m_pass: any;
  public m_usu_idsipta: any;
  public dts_ListaUsuarios: any;
  public nombre_completo: any;
  public contrato: any;
  public fecha_inicio: any;
  public cua: any;
  public numero_cuenta: any;
  public id_biometrico: any;
  public id_biometrico_anterior: any;
  public id_usu_siga: any;
  public dts_tipoHorario: any;
  public dts_grupoFuncionario: any;
  public id_tipoHorario: any;
  public id_grupoFuncionario: any;
  estado_semaforo: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _biometrico: RrhhService,
    private _admusuarios: AdmusuariosService,
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
    $("#pnl_busqueda").show();
    $("#pnl_hjcabecera").hide();
    $("#pnl_hjproveidos").hide();
    $("#modalEliminaProveido").modal("hide");

    //datos iniciales
    this.m_nombres = "";
    this.m_apaterno = "";
    this.m_amaterno = "";

    this.mask_numerodecimal = new Inputmask("9.9{1,2}");
    this.mask_fecha = new Inputmask("9{1,2}/9{1,2}/9{1,4}");
    this.mask_numero = new Inputmask("9{1,9}");
    this.mask_gestion = new Inputmask("9999");
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
        return this.listaGrupoFuncionario();
      })
      .then((dts) => {
        this.dts_grupoFuncionario = dts;
        return this.listaTipoHorario();
      })
      .then((dts) => {
        this.dts_tipoHorario = dts;
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

  LimpiarBusqueda() {
    this.m_nombres = "";
    this.m_apaterno = "";
    this.m_amaterno = "";
    $("#pnl_hjcabecera").hide();
    $("#pnl_hjproveidos").hide();
  }
  muestraDatos(datos) {
    $("#modalFormularioUsuario").modal("show");
    $("#btnRegistrar").hide();
    $("#btnEditar").show();
    $("#e_nusuario").prop("readonly", true);
    $("#btnValidaUsuario").hide();
    this.nombre_completo = datos.nombre.concat(
      " ",
      datos.paterno.concat(" ", datos.materno)
    );
    this.cua = " ";
    this.numero_cuenta = " ";
    this.contrato = " ";
    //this.fecha_inicio = datos.t_fecha_inicio_contrato.substr(0, 10);
    this.fecha_inicio = moment(
      moment(datos.fecha_inicio_laboral).add(5, "hour")
    ).format("YYYY-MM-DD");
    console.log("Fecha inicio Laboral", this.fecha_inicio);
    this.id_usu_siga = datos.id;
    this.id_biometrico = datos.t_userid;
    this.estado_semaforo = datos.estado_semaforo;
  }

  muestraDatosBiometrico(datos) {
    $("#btnBiometrico").show();
    this.nombre_completo = datos.nombre.concat(
      " ",
      datos.paterno.concat(" ", datos.materno)
    );
    this.id_biometrico_anterior = datos.t_userid;
    this.id_biometrico = datos.t_userid;
    this.id_usu_siga = datos.id;
    console.log("biometricoAnterior", this.id_biometrico_anterior);
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

  ActualizaUsuario() {
    if (
      this.cua == "" ||
      this.numero_cuenta == "" ||
      this.contrato == "" ||
      this.fecha_inicio == ""
    ) {
      this.prop_msg = "No se puede actualizar porque existen datos vacios.";
      this.prop_tipomsg = "danger";
      this._msg.formateoMensaje("modal_info", this.prop_msg);
      return;
    }

    this._biometrico
      .insertaActualizaDatos(
        this.id_usu_siga,
        this.cua,
        this.numero_cuenta,
        this.contrato,
        this.fecha_inicio,
        this.s_usu_id
      )
      .subscribe(
        (result: any) => {
          $("#modalFormularioUsuario").modal("hide");
          $("#btnEditar").hide();
          this.BuscarUsuarios();
          this.prop_msg = "Se actualizó de manera correcta";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_success", this.prop_msg);
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            console.log(this.errorMessage);
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos ";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        }
      );
  }

  insertaGrupoUsuario() {
    var parametros = {
      idUsuario: this.id_biometrico,
      idGrupoUsuario: null,
      idGrupoFuncionario: this.id_grupoFuncionario,
      idTipoHorario: this.id_tipoHorario,
      estado: 1,
      idUsuarioRegistro: this.s_usu_bio,
      operacion: "I",
      fchaDesde: null,
      idTipoHorarioAnterior: null,
    };

    this._biometrico.insertaGrupousuario(parametros).subscribe(
      (result: any) => {
        $("#modalBiometrico").modal("hide");
        $("#btnBiometrico").hide();
        this.BuscarUsuarios();
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
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      }
    );
  }

  ActualizaBiometricoUsuario() {
    if (
      this.id_biometrico == 0 ||
      this.id_biometrico == null ||
      this.id_biometrico == "undefined"
    ) {
      this.prop_msg = "No se puede actualizar porque existen datos vacios.";
      this.prop_tipomsg = "danger";
      this._msg.formateoMensaje("modal_info", this.prop_msg);
      return;
    }

    this._biometrico
      .marcacionesUsuarioBiometrico(this.id_biometrico_anterior)
      .subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length == 0) {
            console.log("marcacionesUsuarioBiometrico", result);
            this._biometrico
              .insertaActualizaBiometrico(
                this.id_usu_siga,
                this.id_biometrico,
                this.s_usu_id
              )
              .subscribe(
                (result: any) => {
                  $("#modalBiometrico").modal("hide");
                  $("#btnBiometrico").hide();
                  this.BuscarUsuarios();
                  this.prop_msg = result[0][
                    "pr_inserta_datos_biometrico"
                  ].includes("ERROR")
                    ? "YA EXISTE OTRA PERSONA CON EL BIOMETRICO"
                    : "SE REGISTRO EL BIOMETRICO DE MANERA CORRECTA";

                  this.prop_tipomsg = result[0][
                    "pr_inserta_datos_biometrico"
                  ].includes("ERROR")
                    ? "modal_warning"
                    : "modal_success";

                  if (this.prop_tipomsg == "modal_waring") {
                    this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
                  } else {
                    this.insertaGrupoUsuario();
                    this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
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
          } else {
            this.prop_msg =
              "Existe marcaciones con el Biometrico anterior, no se puede realizar el cambio";

            this.prop_tipomsg = "modal_warning";

            this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
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

  BuscarUsuarios() {
    this.cargando = true;
    //alert('ingreso a buscar usuarios:'+this.m_nombres );
    if (this.m_nombres == "") {
      this.m_nombres = null;
    }
    if (this.m_apaterno == "") {
      this.m_apaterno = null;
    }
    if (this.m_amaterno == "") {
      this.m_amaterno = null;
    }
    this._biometrico
      .listaUsuariosDatosPendientes(
        this.m_nombres,
        this.m_apaterno,
        this.m_amaterno
      )
      .subscribe(
        (result: any) => {
          $("#pnl_busqueda").show();
          $("#pnl_hjcabecera").show();
          $("#pnl_hjproveidos").show();

          //this.ListaProveidos(this.m_idcorrespondencia)
          this.pnlListaProveidos = true;

          if (Array.isArray(result) && result.length > 0) {
            $(".dt-Proveidos").DataTable().destroy();

            this.dts_ListaUsuarios = this._fun.RemplazaNullArray(
              result.filter((obj) => obj.estado == 1)
            );
            setTimeout(() => {
              let confiTable = this._fun.CONFIGURACION_TABLA_V4(
                [10, 20, 50, 100],
                false,
                20,
                0,
                "desc"
              );
              var table = $(".dt-Proveidos").DataTable(confiTable);
              this._fun.inputTable(table, [1, 2, 3, 5]);
              this.cargando = false;
            }, 500);
          } else {
            this.prop_msg = "Alerta: No existen registrados";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            console.log(this.errorMessage);
            alert("1Error en la petición BUSQUEDA");
          }
        }
      );
  }
}
