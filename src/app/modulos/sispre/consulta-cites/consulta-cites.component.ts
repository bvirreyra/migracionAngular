import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { Globals } from "../../../global";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";
import { SispreService } from "../sispre.service";

declare var $: any;

@Component({
  selector: "app-consulta-cites",
  templateUrl: "./consulta-cites.component.html",
  styleUrls: ["./consulta-cites.component.css"],
})
export class ConsultaCitesComponent implements OnInit {
  public dtsDatosConexion: any;
  public dtsFechaSrv: any;
  public dtsFechaLiteral: any;
  public dtsHoraSrv: any;

  public m_gestion: any;
  public m_mes_actual: any;

  public errorMessage: string;

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
  public btnVerificaRol: Boolean = false;

  // Variables para el compononete de mensajes
  public prop_msg: string;
  public prop_tipomsg: string;

  public url: string;
  public url_reporte: string;

  // Variables propias del componente
  public dts_usuario: any = [];
  public dtsTipoCites: any = [];
  public dtsEstados: any = [
    { id: 3, nombre: "RESERVADO" },
    { id: 4, nombre: "ANULADO" },
    { id: 5, nombre: "CONFIRMADO" },
  ];

  public dtsBuscaCite: any = [];
  public dtsCites: any = [];
  public registroCite: any = [];
  public registro: boolean = false;

  public verificaUsuario: any;

  public cargando: boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _sispre: SispreService,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent,
    private datePipe: DatePipe,
    private globals: Globals
  ) {
    this._route.parent.params.subscribe((parametros) => {
      this.s_idcon = parametros["idcon"];
      this.s_idmod = parametros["idmod"];
    });
    this.url = globals.rutaSrvFronEnd;
    this.url_reporte = globals.rutaSrvReportes;
  }

  ngOnInit() {
    function falloCallback(error) {
      console.log("Falló con " + error);
    }
    this.DatosConexion()
      .then((dts1) => {
        this.dtsDatosConexion = dts1;
        return this.RolesAsignados(this.dtsDatosConexion[0]._usu_id);
      })
      .then((dts2) => {
        this.dts_roles_usuario = dts2;
        return this.listaCites();
      })
      .then((dts3) => {
        this.dtsTipoCites = dts3;
        return this.listaUsuarios();
      })
      .then((dts4) => {
        this.dts_usuario = dts4;
        this.manejoRoles();
      })
      .catch(falloCallback);
  }
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
  manejoRoles() {
    var lineas = this.dts_roles_usuario.length;
    var datos = this.dts_roles_usuario;
    for (var i = 0; i < lineas; i++) {
      var rol = datos[i].idrol;
      if (rol == 24) {
        // rol 16 bitacora 3 adm sipta
        this.btnVerificaRol = true;
      }
    }
  }
  listaCites() {
    return new Promise((resolve, reject) => {
      this._sispre.listaCites().subscribe((result: any) => {
        
        let cites = result;
        this.LimpiarBusqueda();
        resolve(cites);
        return cites;
      });
    });
  }
  listaUsuarios() {
    return new Promise((resolve, reject) => {
      this._sispre.busquedaUsuariosSispre().subscribe((result: any) => {
        
        resolve(result);
        return result;
      });
    });
  }
  LimpiarBusqueda() {
    this.registro = false;
    this.dtsBuscaCite.gestion = new Date().getFullYear();
    this.dtsBuscaCite.numero_cite = "";
    this.dtsBuscaCite.tipo_cite = "";
    this.dtsBuscaCite.referencia = "";
    this.dtsBuscaCite.estado = "";
    this.dtsCites = [];
    this.registroCite = [];
    $("#pnl_busquedaCite").show();
    $("#pnl_resutadoCite").hide();
    $("#pnl_actualizaCite").hide();
  }
  busquedaCite() {
    this.dtsCites = [];
    $("#pnl_resutadoCite").hide();
    if (this.dtsBuscaCite.gestion == "") {
      this.prop_msg = "Debe ingresar la gestión para la búsqueda";
      this.prop_tipomsg = "info";
      this._msg.formateoMensaje("modal_info", this.prop_msg);
      return;
    }
    if (
      this.dtsBuscaCite.tipo_cite == "" &&
      this.dtsBuscaCite.numero_cite == "" &&
      this.dtsBuscaCite.referencia == "" &&
      this.dtsBuscaCite.estado == ""
    ) {
      this.prop_msg = "Debe ingresar algún parámetro de búsqueda";
      this.prop_tipomsg = "info";
      this._msg.formateoMensaje("modal_info", this.prop_msg);
      return;
    }
    this.busquedaEspecificaCite();
  }
  busquedaEspecificaCite() {
    this.cargando = true;
    this._sispre
      .busquedaCite(
        this._fun.textoNormal("BUSQUEDA_CITE"),
        this._fun.textoNormal(this.dtsBuscaCite.tipo_cite),
        this._fun.textoNormal(this.dtsBuscaCite.numero_cite),
        this._fun.textoUpper(this.dtsBuscaCite.referencia),
        this._fun.textoNormal(this.dtsBuscaCite.estado),
        this._fun.textoNormal(this.dtsBuscaCite.gestion)
      )
      .subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            if (
              result.length == 1 &&
              this.dtsBuscaCite.numero_cite != "" &&
              this.dtsBuscaCite.tipo_cite != ""
            ) {
              this.cargando = false;
              this.visualizaRegistro(result[0]);
            } else {
              this.dtsCites = this._fun.RemplazaNullArray(result);
              this._fun.limpiatabla(".dt-tipoCite");
              setTimeout(() => {
                let confiTable = this._fun.CONFIGURACION_TABLA_V3(
                  [10, 20, 50],
                  false,
                  10
                );
                var table = $(".dt-tipoCite").DataTable(confiTable);
                this._fun.selectTable(table, [2]);
                this._fun.inputTable(table, [1, 3, 4]);
                $("#pnl_resutadoCite").show();
                this.cargando = false;
              }, 10);
              $("#pnl_actualizaCite").hide();
            }
          } else {
            this.dtsCites = [];
            this.cargando = false;
            $("#pnl_resutadoCite").hide();
            this.prop_msg = "Alerta: No existen registros";
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
  visualizaRegistro(registro: any) {
    this.registro = true;
    this.registroCite.id_detalle = registro._id_detalle;
    this.registroCite.numero_cite = registro._numero_cite;
    this.registroCite.id_usuario = registro._id_user;
    this.registroCite.usuario = registro._usuario;
    this.registroCite.id_cite = registro._id_cite;
    this.registroCite.fecha_registro = this._fun.transformDateOf_yyyymmdd(
      registro._fecha_registro
    );
    this.registroCite.asunto_referencia = registro._asunto_referencia;
    this.registroCite.id_estado = registro._id_estado;
    this.registroCite.descripcion = registro._descripcion;
    this.registroCite.cite = registro._tipocite;
    this.registroCite.estado = registro._estado;
    $("#pnl_actualizaCite").show();
    $("#pnl_busquedaCite").hide();
    $("#pnl_resutadoCite").hide();
    this.verificaUsuario = this.registroCite.usuario;
  }
  actualizaCite() {
    let usuario = this.dts_usuario.filter(
      (item) => item._nombre_completo == this.registroCite.usuario.toUpperCase()
    );
    if (usuario.length > 0) {
      this.registroCite.id_usuario = usuario[0]._id_sispre;
      this.registroCite.usuario = usuario[0]._nombre_completo;
    } else {
      if (this.registroCite.usuario.toUpperCase() != this.verificaUsuario) {
        this.prop_msg =
          "Debe registrar un usuario válido, verifique por favor.";
        this.prop_tipomsg = "danger";
        this._msg.formateoMensaje("modal_danger", this.prop_msg);
        return;
      }
    }
    if (
      this.registroCite.asunto_referencia == "" ||
      this.registroCite.id_estado == null
    ) {
      this.prop_msg = "Existen datos vacios, verifique por favor.";
      this.prop_tipomsg = "danger";
      this._msg.formateoMensaje("modal_danger", this.prop_msg);
      return;
    } else {
      if (
        this.registroCite.id_estado != 3 &&
        this.registroCite.descripcion == ""
      ) {
        this.prop_msg = "Debe registrar alguna descripción.";
        this.prop_tipomsg = "danger";
        this._msg.formateoMensaje("modal_danger", this.prop_msg);
        return;
      } else {
        if (this.registroCite.id_estado == 3) {
          this.registroCite.descripcion = "";
        }
      }
    }
    this._sispre
      .modificacionCite(
        this._fun.textoNormal("MODIFICA_ADM"),
        this._fun.textoNormal(this.registroCite.id_usuario),
        this._fun.textoNormal(this.registroCite.id_cite),
        this._fun.textoNormal(this.registroCite.id_detalle),
        this._fun.textoUpper(this.registroCite.asunto_referencia),
        this._fun.textoUpper(this.registroCite.descripcion),
        this._fun.textoNormal(this.registroCite.id_estado),
        this._fun.textoNormal(this.registroCite.fecha_registro)
      )
      .subscribe(
        (result: any) => {
          
          this.prop_msg = "Se modificó de manera correcta";
          this.prop_tipomsg = "success";
          this._msg.formateoMensaje("modal_success", this.prop_msg);
          this.LimpiarBusqueda();
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
