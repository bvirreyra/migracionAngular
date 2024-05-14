import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Globals } from "../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
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
  templateUrl: "./grupofuncionario.component.html",
  styleUrls: ["./grupofuncionario.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    RrhhService,
  ],
})
export class GrupofuncionarioComponent implements OnInit {
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
  public habilitaEdicion: any;
  public grupoFuncionario: {
    idGrupoFuncionario;
    descripcionGrupo;
    detalle;
    idUsuarioRegistro;
    estado;
    operacion;
  };

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
    this.grupoFuncionario = {
      idGrupoFuncionario: null,
      descripcionGrupo: "",
      detalle: "",
      idUsuarioRegistro: null,
      estado: 1,
      operacion: "",
    };
    this.habilitaEdicion = true;
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
      })
      .then((dts) => {
        this.dts_funcionario = dts;
        this.e_usuario = this.s_usu_id;
        this.listaGrupoFuncionario();
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

  listaGrupoFuncionario() {
    this.cargando = true;
    this._biometrico.listaGrupoFuncionario().subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          $(".dt-grupoFuncionario").DataTable().destroy();
          this.dts_grupoFuncionario = result;
          console.log(result);
          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V4(
              [10, 20, 50, 100],
              false,
              20,
              0,
              "asc"
            );
            var table = $(".dt-grupoFuncionario").DataTable(confiTable);
            this._fun.inputTable(table, [1, 2, 3]);
            this.cargando = false;
          }, 500);
        } else {
          this.prop_msg = "Alerta: No existen registros en el biometrico";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_warning", this.prop_msg);
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

  limpiarDatosModal() {
    this.grupoFuncionario = {
      idGrupoFuncionario: null,
      descripcionGrupo: "",
      detalle: "",
      idUsuarioRegistro: null,
      estado: 1,
      operacion: "",
    };
    this.habilitaEdicion = true;
  }

  abrirModal() {
    this.habilitaEdicion = false;
    $("#btnRegistrar").show();
    $("#btnModificar").hide();
    $("#btnEliminar").hide();
  }

  datosModal(datos, tipo) {
    console.log(datos, tipo);
    if (tipo == "U") {
      this.habilitaEdicion = false;
      $("#btnRegistrar").hide();
      $("#btnModificar").show();
      $("#btnEliminar").hide();
    } else if (tipo == "D") {
      this.habilitaEdicion = true;
      this.grupoFuncionario.estado = 0;
      $("#btnRegistrar").hide();
      $("#btnModificar").hide();
      $("#btnEliminar").show();
    }
    this.grupoFuncionario.idUsuarioRegistro = this.s_usu_bio;
    this.grupoFuncionario.idGrupoFuncionario = datos.IdGrupoFuncionario;
    this.grupoFuncionario.descripcionGrupo = datos.DescripcionGrupoFuncionario;
    this.grupoFuncionario.detalle = datos.Observacion;
  }
  insertarGrupoFuncionario() {
    if (
      this.grupoFuncionario.descripcionGrupo == "" ||
      this.grupoFuncionario.detalle == ""
    ) {
      this.prop_msg = "No se puede insertar ambos datos son requridos";
      this._msg.formateoMensaje("modal_info", this.prop_msg);
      return;
    }
    $("#btnRegistrar").show();
    $("#btnModificar").hide();
    $("#btnEliminar").hide();

    this.grupoFuncionario.idUsuarioRegistro = this.s_usu_bio;
    this.grupoFuncionario.operacion = "I";

    this._biometrico.abmGrupoFuncionario(this.grupoFuncionario).subscribe(
      (result: any) => {
        
        $("#modalGrupoFuncionario").modal("hide");
        this.listaGrupoFuncionario();
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

  actualizarGrupoFuncionario() {
    if (
      this.grupoFuncionario.descripcionGrupo == "" ||
      this.grupoFuncionario.detalle == ""
    ) {
      this.prop_msg = "No se puede insertar ambos datos son requridos";
      this._msg.formateoMensaje("modal_info", this.prop_msg);
      return;
    }

    $("#btnRegistrar").hide();
    $("#btnModificar").show();
    $("#btnEliminar").hide();

    this.grupoFuncionario.idUsuarioRegistro = this.s_usu_bio;
    this.grupoFuncionario.operacion = "U";
    this.grupoFuncionario.estado = 1;

    this._biometrico.abmGrupoFuncionario(this.grupoFuncionario).subscribe(
      (result: any) => {
        
        $("#modalGrupoFuncionario").modal("hide");
        this.listaGrupoFuncionario();
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
  eliminarGrupoFuncionario() {
    $("#btnRegistrar").hide();
    $("#btnModificar").hide();
    $("#btnEliminar").show();

    this.grupoFuncionario.idUsuarioRegistro = this.s_usu_bio;
    this.grupoFuncionario.operacion = "D";

    this._biometrico.abmGrupoFuncionario(this.grupoFuncionario).subscribe(
      (result: any) => {
        
        $("#modalGrupoFuncionario").modal("hide");
        this.listaGrupoFuncionario();
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
}
