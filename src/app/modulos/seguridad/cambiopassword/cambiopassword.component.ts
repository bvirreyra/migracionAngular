import { Component, OnInit } from "@angular/core";
import { Globals } from "../../../global";

import { ActivatedRoute, Params, Router } from "@angular/router";

import { AutenticacionService } from "../../seguridad/autenticacion.service";
// import { ValidacionAltaService } from './validacionaltausuario.service';
import { DatePipe } from "@angular/common";
import { FuncionesComponent } from "../../../funciones/funciones/funciones.component";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";
declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var Pikaday: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-cambiopassword",
  templateUrl: "./cambiopassword.component.html",
  styleUrls: ["./cambiopassword.component.css"],
  providers: [
    DatePipe,
    FuncionesComponent,
    AutenticacionService,
    MensajesComponent,
  ],
})
export class CambiopasswordComponent implements OnInit {
  //variables para el compononete de mensajes
  public prop_msg: string;
  public prop_tipomsg: string;

  //variables de session y iniciales
  public s_idcon: string;
  public s_idmod: string;
  public s_idrol: number;
  public s_user: string;
  public s_codregional: string;
  public s_idrolcon: string;
  public s_usercon: string;
  public s_medcod: string;
  public s_nomuser: string;

  public url: string;
  public errorMessage: string;
  public fechasrv: string;

  public dtsDatosConexion: any;
  public dtsFechaSrv: any;
  public dtsFechaLiteral: any;
  public s_usu_id_sipta: any;
  public s_usu_id: any;

  /*propios del modulo*/
  public datosusuario: any;

  constructor(
    private _autenticacion: AutenticacionService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _globals: Globals,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent
  ) {
    (this.datosusuario = { PASSWORD: "" }), { CONFIRMACIONPASSWORD: "" };
  }

  ngOnInit() {
    this._route.params.forEach((params: Params) => {
      this.s_idcon = params["idcon"];
      this.s_idmod = "2";

      function falloCallback(error) {
        console.log("Falló con " + error);
      }

      this.DatosConexion()
        .then((dts1) => {
          this.dtsDatosConexion = dts1;
        })
        .catch(falloCallback);
    });

    this.prop_msg = null;
    this.prop_tipomsg = null;
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
                resolve(result);
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
  cambiarpassword() {
    var pass = this.datosusuario.PASSWORD;
    this._autenticacion
      .getcambiarpassword(
        this._fun.textoNormal(this.s_idcon),
        this._fun.textoNormal(pass)
      )
      .subscribe(
        (result: any) => {
          
          if (result[0]._accion == "CORRECTO") {
            this.prop_msg = "Se realizo la operación con exito";
            this.prop_tipomsg = "success";
            //this.cambiarpasswordsipta();
          } else {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos ";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            console.log(this.errorMessage);
            //alert('Error en la petición');
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos ";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        }
      );
  }
  cambiarpasswordsipta() {
    var pass = this.datosusuario.PASSWORD;
    this._autenticacion
      .getcambiarpasswordsipta(
        this._fun.textoNormal(this.s_usu_id_sipta),
        this._fun.textoNormal(pass)
      )
      .subscribe(
        (result: any) => {
          
          if (result[0]._accion == "CORRECTO") {
            this.cambiarpasswordsgp();
          } else {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos ";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            console.log(this.errorMessage);
            //alert('Error en la petición');
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos ";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        }
      );
  }
  cambiarpasswordsgp() {
    var pass = this.datosusuario.PASSWORD;
    this._autenticacion
      .getcambiarpasswordsgp(
        this._fun.textoNormal(this.s_usu_id),
        this._fun.textoNormal(pass)
      )
      .subscribe(
        (result: any) => {
          
          if (result[0]._accion == "CORRECTO") {
            this.prop_msg = "Se realizo la operación con exito";
            this.prop_tipomsg = "success";
          } else {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos ";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            console.log(this.errorMessage);
            //alert('Error en la petición');
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos ";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        }
      );
  }
}
