import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { AutenticacionService } from "../../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../../seguridad/mensajes/mensajes.component";
import { SgpService } from "../../../sgp/sgp.service";
import { AccesosRolComponent } from "../../accesos-rol/accesos-rol.component";

declare var $: any;

@Component({
  selector: "app-auditoria",
  templateUrl: "./auditoria.component.html",
  styleUrls: ["./auditoria.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
    AccesosRolComponent,
  ],
})
export class AuditoriaComponent implements OnInit {
  @Input() idProyecto: number;
  @Input() idSGP: number;
  @Input() nombreProyecto: string;

  @Output() messageEvent = new EventEmitter<string>();
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

  public pnl_listaproyecto = false;
  public pnl_supervision = false;
  public pnl_ampliacionplazo = false;

  public pnl_tecnica = false;
  public pnl_financiero = false;
  public pnl_legal = false;

  //variables para el compononete de mensajes
  public cargando: boolean = false;
  public dts_vigencia: any;
  public dts_encargado: any;
  public dts_tipo: any;
  public dts_booleano: any;
  public dts_roles: [];
  public render: boolean = false;

  public idUsuario: number;
  public idRol: number;
  public elIdAuditoria: number = 0;
  public editarAuditoria = false;
  public pnl_formularioauditoria = false;

  public camposHabilitados: {};

  public auditoria: {
    diferencia: string;
    vigencia: string;
    encargado: string;
    tipo: string;
    plazo: number;
    presento: string;
    adenda: string;
    observacion: string;
  };

  constructor(
    private _seguimiento: SgpService,
    private _autenticacion: AutenticacionService,
    private _accesos: AccesosRolComponent,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent
  ) {
    this.auditoria = {
      diferencia: "",
      vigencia: "",
      encargado: "",
      tipo: "",
      plazo: 0,
      presento: "",
      adenda: "",
      observacion: "",
    };
    // const datos = JSON.parse(localStorage.getItem('dts_con'));
    // this.idUsuario = datos.s_usu_id;
    // this.RolesAsignados();
  }

  ngOnInit() {
    console.log("iniciando solicitudes");
    const datos = JSON.parse(localStorage.getItem("dts_con"));
    console.log(datos);
    this.idUsuario = datos.s_usu_id;
    this.obtenerConexion()
      .then(() => {
        return this._accesos.accesosRestriccionesxRolV2(this.s_usu_id);
      })
      .then((data) => {
        this.camposHabilitados = data;
        console.log("Adm Roles===>", this.camposHabilitados);
        this.RolesAsignados();
        this.cargarCombos();
        this.cargarAuditoria();
      });

    // this.idRol = datos.s_idrol;
  }
  obtenerConexion() {
    return new Promise((resolve, reject) => {
      this.dtsDatosConexion = JSON.parse(localStorage.getItem("dts_con"));
      this.dts_roles_usuario = JSON.parse(localStorage.getItem("dts_rol"));
      this.s_idrol = this.dtsDatosConexion.s_idrol;
      this.s_user = this.dtsDatosConexion.s_idrol;
      this.s_nomuser = this.dtsDatosConexion.s_nomuser;
      this.s_usu_id = this.dtsDatosConexion.s_usu_id;
      this.s_usu_id_sipta = this.dtsDatosConexion.s_usu_id_sipta;
      this.s_usu_id_sispre = this.dtsDatosConexion.s_usu_id_sispre;
      this.s_ci_user = this.dtsDatosConexion.s_ci_user;

      resolve(1);
    });
  }

  RolesAsignados() {
    this._autenticacion.rolesasignados(this.idUsuario.toString()).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_roles = this._fun
            .RemplazaNullArray(result)
            .map((el) => el.idrol);
          console.log(this.dts_roles);
          this.render = true;
        } else {
          console.log("error al obtener roles", result);
        }
      },
      (error) => {
        console.log("error conexion", error);
      }
    );
  }

  cargarCombos() {
    this._seguimiento.listarClasificadorTotal().subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_tipo = this._fun
            .RemplazaNullArray(result)
            .filter((el) => el.id_tipoclasificador == 34);
          this.dts_encargado = this._fun
            .RemplazaNullArray(result)
            .filter((el) => el.id_tipoclasificador == 33);
          this.dts_vigencia = this._fun
            .RemplazaNullArray(result)
            .filter((el) => el.id_tipoclasificador == 32);
          this.dts_booleano = this._fun
            .RemplazaNullArray(result)
            .filter((el) => el.id_detalle == 64 || el.id_detalle == 65);
        } else {
          this._msg.formateoMensaje(
            "modal_danger",
            "No se recuperaron clasificadores",
            6
          );
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage,
            10
          );
      }
    );
  }

  cargarAuditoria() {
    this.cargando = true;
    this.pnl_formularioauditoria = true;
    this._seguimiento.auditoria(this.idProyecto).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          const audi = this._fun.RemplazaNullArray(result)[0];
          console.log("la auditoria", audi);
          this.elIdAuditoria = audi.id_datos_auditoria;
          this.auditoria = {
            diferencia: audi.diferencia,
            vigencia: audi.vigencia,
            encargado: audi.encargado,
            tipo: audi.tipo,
            plazo: audi.plazo,
            presento: audi.presento,
            adenda: audi.adenda,
            observacion: audi.observacion,
          };
          this.editarAuditoria = true;
          this.cargando = false;
        } else {
          this._msg.formateoMensaje(
            "modal_info",
            "Sin auditoría registrada",
            6
          );
        }
        this.cargando = false;
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage,
            10
          );
        this.cargando = false;
      }
    );
  }

  registrarAuditoria() {
    this.cargando = true;
    console.log("registrando auditoria");
    const laAuditoria = Object.assign(this.auditoria);
    this.editarAuditoria
      ? (laAuditoria.operacion = "U")
      : (laAuditoria.operacion = "I");
    laAuditoria.idDatosAuditoria = this.elIdAuditoria;
    laAuditoria.fidProyecto = this.idProyecto;
    laAuditoria.fidSGP = this.idSGP;
    laAuditoria.usuarioRegistro = this.idUsuario;
    laAuditoria.adenda = (this.auditoria.adenda || "").toUpperCase();
    laAuditoria.observacion = (this.auditoria.observacion || "").toUpperCase();
    console.log("la udi", laAuditoria);
    this._seguimiento.crudAuditoria(laAuditoria).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          if (result[0].message && !result[0].message.startsWith("ERROR")) {
            this._msg.formateoMensaje(
              "modal_success",
              "Auditoría registrada con éxito!!!",
              6
            );
            this.cargarAuditoria();
          } else {
            this._msg.formateoMensaje(
              "modal_danger",
              "Error:" + result[0].message,
              10
            );
          }
        } else {
          console.log("no devuleve array", result);
        }
        this.cargando = false;
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage,
            10
          );
        this.cargando = false;
      }
    );
  }
}
