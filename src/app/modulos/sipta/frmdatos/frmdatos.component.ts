import { DatePipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import Inputmask from "inputmask";
import { Globals } from "../../../global";

import { ActivatedRoute, Router } from "@angular/router";

/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";
import { SiptaService } from "../../sipta/sipta.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important
@Component({
  selector: "app-frmdatos",
  templateUrl: "./frmdatos.component.html",
  styleUrls: ["./frmdatos.component.css"],
})
export class frmdatosComponent implements OnInit {
  @Input("inputIdInstitucion") id_institucion: string;
  @Input("inputIdCargo") id_cargo: string;

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
  public nombre_usuario: any;
  public s_usu_id_sipta: any;
  public dts_institucion: any;
  public dts_cargo: any;
  public m_filtroidInstitucion: any;
  public m_nombreinstitucion: any;
  public m_filtroidCargo: any;
  public m_nombrecargo: any;
  public m_idestado: any;
  public m_nombreusuario: any;
  public pnlCargoRetorno = false;
  public dts_UsuarioExterno: any;
  public m_idusuarioexterno: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _sipta: SiptaService,

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
    //this._router.navigate(['./' + v_ruta + '/' + this.s_idcon + '/' + this.s_idmod + '/' + v_modulo], { queryParams: { matricula: this.m_matricula, tipo: 'INGRESO' } });
    //this.m_matricula = decodeURIComponent(this.getUrlVars()["mat"]);
    //this.m_combrobante = decodeURIComponent(this.getUrlVars()["com"]);

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
        return this.listarInstitucion();
      })
      .then((dts) => {
        this.dts_institucion = dts;
        var datos = this.dts_institucion.filter(
          (item) => item.IdInstitucion == this.id_institucion
        );
        this.m_filtroidInstitucion = datos[0]["IdInstitucion"];
        this.m_nombreinstitucion = datos[0]["Nombre"];
        this.paneles("VER_INICIO");
      })
      .catch(falloCallback);
  }
  getUrlVars() {
    var vars = [],
      hash;
    var hashes = window.location.href
      .slice(window.location.href.indexOf("?") + 1)
      .split("&");
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split("=");
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  }
  paneles(string) {
    if (string == "VER_CARGO") {
      //this.listarcargo();
      $("#pnl_gridviewcargo").show();
      $("#pnl_formulariodatos").hide();
      $("#pnl_modificarusuario").hide();
    }
    if (string == "VER_INICIO") {
      this.listarcargo();
      $("#pnl_formulariodatos").show();
      $("#pnl_modificarusuario").hide();
    }
    if (string == "MODIFICAR_USUARIO") {
      $("#pnl_gridviewcargo").hide();
      $("#pnl_formulariodatos").hide();
      $("#pnl_modificarusuario").show();
    }
  }
  limpiar_variables() {
    this.m_nombreusuario = "";
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
                this.nombre_usuario = this.s_nomuser;
                //this.listarcargo();
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
  transformFecha(date) {
    return this.datePipe.transform(date, "dd/MM/yyyy");
    //whatever format you need.
  }
  FechaLiteral(f) {
    return this._fun.FechaLiteral(f);
  }
  listarInstitucion() {
    return new Promise((resolve, reject) => {
      this._sipta.getListaInstitucion().subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            var dts = this._fun.RemplazaNullArray(result);
            resolve(dts);
          } else {
            this.prop_msg = "Alerta: No existen registros....";
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
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  listarcargo() {
    this._sipta.getListacargo().subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_cargo = this._fun.RemplazaNullArray(result);
          var dts = this.dts_cargo.filter(
            (item) => item.IdCargoInstitucion == this.id_cargo
          );
          this.m_filtroidCargo = dts[0]["IdCargoInstitucion"];
          this.m_nombrecargo = dts[0]["cargo"];
          this.ListaUsuarioExterno();
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
  InsertarUsuario() {
    this.m_idestado = 1;
    if (this.m_nombreusuario != undefined && this.m_nombreusuario.length > 0) {
      this._sipta
        .getInsertarUsuarioExterno(
          this.m_nombreinstitucion,
          this.m_nombrecargo,
          this.m_nombreusuario,
          this.s_usu_id,
          this.m_idestado
        )
        .subscribe(
          (result: any) => {
            
            if (result[0]["ACCION"] == "USUARIO DUPLICADO") {
              this.prop_msg = "Error: Nombre de Usuario Duplicado";
              this.prop_tipomsg = "danger";
              this._msg.formateoMensaje("modal_danger", this.prop_msg);
            } else {
              this.ListaUsuarioExterno();
              this.limpiar_variables();
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
    } else {
      this.prop_msg = "Error: Debe ingresar el Nombre";
      this.prop_tipomsg = "danger";
      this._msg.formateoMensaje("modal_danger", this.prop_msg);
    }
  }
  ListaUsuarioExterno() {
    this._sipta
      .getListarUsuarioExterno(this.m_nombreinstitucion, this.m_nombrecargo)
      .subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            this.dts_UsuarioExterno = this._fun.RemplazaNullArray(result);
            this._fun.limpiatabla(".dt-UsuarioExterno");
            setTimeout(() => {
              let confiTable = this._fun.CONFIGURACION_TABLA_V3(
                [10, 20, 50],
                false
              );
              var table = $(".dt-UsuarioExterno").DataTable(confiTable);
              this._fun.inputTable(table, [3]);
              this._fun.selectTable(table, [4]);
            }, 20);
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
  editarusuarioPre(dts) {
    //this.paneles('EDITAR_FORMULARIO');
    this.paneles("MODIFICAR_USUARIO");
    this.m_idusuarioexterno = dts.IdUsuarioExterno;
    this.m_nombreinstitucion = dts.Institucion;
    this.m_nombrecargo = dts.Cargo;
    this.m_nombreusuario = dts.Nombre;
    /*console.log(this.m_idusuarioexterno);
    console.log(this.m_nombreusuario);
    console.log(this.m_nombreusuario);
    console.log(this.m_nombreusuario);*/
  }
  editarUsuario() {
    this._sipta
      .getEditarUsuario(
        this.m_idusuarioexterno,
        this.m_nombreinstitucion,
        this.m_nombrecargo,
        this.m_nombreusuario,
        this.s_usu_id
      )
      .subscribe(
        (result: any) => {
          
          console.log(result);
          if (result[0]["ACCION"] == "USUARIO DUPLICADO") {
            this.prop_msg = "Error: Nombre de Usuario Duplicado";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          } else {
            this.paneles("VER_INICIO");
            this.limpiar_variables();
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
  eliminar_usuario(dts) {
    this._sipta
      .getEliminarUsuario(dts.IdUsuarioExterno, this.s_usu_id)
      .subscribe(
        (result: any) => {
          
          this.ListaUsuarioExterno();
          if (Array.isArray(result) && result.length > 0) {
            this.dts_UsuarioExterno = this._fun.RemplazaNullArray(result);
            this._fun.limpiatabla("dt-UsuarioExterno");
          } else {
            this._fun.limpiatabla("dt-UsuarioExterno");
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
}
