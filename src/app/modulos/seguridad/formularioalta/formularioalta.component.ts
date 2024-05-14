import { Component, OnInit } from "@angular/core";

import { ActivatedRoute, Router } from "@angular/router";

import { DatePipe } from "@angular/common";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { AutenticacionService } from "../autenticacion.service";
import { MensajesComponent } from "../mensajes/mensajes.component";
import { DatosUsuario } from "./datosusuario";
import { FormularioAlta } from "./formularioalta";
import { ValidacionAltaService } from "./validacionaltausuario.service";
declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var Pikaday: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-formularioalta",
  templateUrl: "./formularioalta.component.html",
  styleUrls: ["./formularioalta.component.css"],
  providers: [
    ValidacionAltaService,
    DatePipe,
    FuncionesComponent,
    AutenticacionService,
    MensajesComponent,
  ],
})
export class FormularioaltaComponent implements OnInit {
  public maskMatricula = [
    /[0-9]/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    " ",
    /[A-Za-z]/,
    /[A-Za-z]/,
    /[A-Za-z]/,
  ];

  //variables para visualizacion de mensajes del formulario
  public validacionMat = true;
  public altaFormulario = false;

  public msgOkMat = false;
  public msgCuidadoMat = false;
  public msgAtencionMat = false;
  public msgErrorMat = false;

  public msgOkAlta = false;
  public msgCuidadoAlta = false;
  public msgAtencionAlta = false;
  public msgErrorAlta = false;

  public msgPassDistintos = false;

  /* *********************** */
  //Variables para la cuenta y contraseña del usuario
  public usr: string;
  public pass: string;

  public estadocontrol = "readonly";
  public datospersonales;
  public validacionmatricula: FormularioAlta;
  public datosusuario: DatosUsuario;
  public errorMessage: any;

  constructor(
    private _validacionaltausuarioservice: ValidacionAltaService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _fun: FuncionesComponent,
    private _autenticacionService: AutenticacionService,
    private _msg: MensajesComponent
  ) {
    //this.panelvalidacionmatricula=true;
  }

  ngOnInit() {
    this.validacionmatricula = new FormularioAlta("", "", "");
    this.datosusuario = new DatosUsuario(
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    );
  }
  onSubmit() {
    this.validacionmatricula.FECHA_NACIMIENTO =
      this._fun.transformDateOf_yyyymmdd(
        this.validacionmatricula.FECHA_NACIMIENTO
      );

    this._validacionaltausuarioservice
      .getValidaUsuario(this.validacionmatricula)
      .subscribe(
        (response: any) => {
          this.datosusuario = response;

          if (
            response[0]["MATRICULA"] ==
            this.validacionmatricula.MAT.toUpperCase()
          ) {
            this.datospersonales = response[0]["NOM_COM"];
            this.datosusuario.USU_ID = response[0]["C_IDENTIDAD"];
            this.datosusuario.USU_APAT = response[0]["PATERNO"];
            this.datosusuario.USU_AMAT = response[0]["MATERNO"];
            this.datosusuario.USU_NOM = response[0]["NOMBRE"];
            this.datosusuario.USU_PERFIL = null;
            this.datosusuario.USU_GRUPO = null;
            this.datosusuario.MEDI_COD = null;
            this.datosusuario.ESP_COD = null;
            this.datosusuario.ESP_NOM = null;
            this.datosusuario.IDESTADO = "31";
            this.datosusuario.MATRICULA = response[0]["MATRICULA"];
            this.datosusuario.ACCION = response[0]["ACCION"];

            if (this.datosusuario.ACCION == "NO CORRESPONDE") {
              this.msgCuidadoMat = true;
              this.msgAtencionMat = false;
              this.msgErrorMat = false;
            }
            if (this.datosusuario.ACCION == "REGISTRADO") {
              this.msgCuidadoMat = false;
              this.msgAtencionMat = true;
              this.msgErrorMat = false;

              var user = response[0]["USU_USER"];
              var pass = response[0]["USU_PASS"];
              var email = response[0]["EMAIL"];
              if (email != null) {
                this._validacionaltausuarioservice
                  .emailcuentausuario(user, pass, email)
                  .subscribe(
                    (response: any) => {
                      
                      //alert('se envio el correo electronico');
                    },
                    (error) => {
                      this.errorMessage = <any>error;
                      if (this.errorMessage != null) {
                        console.log(this.errorMessage);
                        alert("Error en la petición1");
                      }
                    }
                  );
              }
            }
            if (
              this.datosusuario.ACCION == "MODIFICAR" ||
              this.datosusuario.ACCION == "INSERTAR"
            ) {
              //alert ('Datos validados correctamente');
              this.altaFormulario = true;
              this.validacionMat = false;
              this.msgCuidadoAlta = true;
            }
          } else {
            this.msgErrorMat = true;
            this.msgCuidadoMat = false;
            this.msgAtencionMat = false;
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            console.log(this.errorMessage);
            alert("Error en la petición2");
          }
        }
      );
  }
  onSubmitusuario() {
    if (this.datosusuario.PASSWORD != this.datosusuario.CONFIRMACIONPASSWORD) {
      //alert('Error las constraseñas no son iguales');
      this.msgPassDistintos = true;
    } else {
      this._validacionaltausuarioservice
        .getAltaUsuario(this.datosusuario)
        .subscribe(
          (response: any) => {
            
            //alert ('Se registro de forma correcta el usuario');
            //this._router.navigate(['./']);
            this.altaFormulario = false;
            this.validacionMat = false;

            this.usr = response[0]["USU_USER"];
            this.pass = response[0]["USU_PASS"];

            this.msgOkAlta = true;
            this.msgCuidadoAlta = false;
            this.msgAtencionAlta = false;
            this.msgErrorAlta = false;

            this._msg.formateoMensaje(
              "modal_success",
              " Usuario: " + this.usr + " Constraseña: " + this.pass,
              30
            );

            this._validacionaltausuarioservice
              .emailcuentausuario(this.usr, this.pass, this.datosusuario.CORREO)
              .subscribe(
                (response: any) => {
                  
                  //alert('se envio el correo electronico');
                },
                (error) => {
                  this.errorMessage = <any>error;
                  if (this.errorMessage != null) {
                    console.log(this.errorMessage);
                    alert("Error en la petición1");
                  }
                }
              );
          },
          (error) => {
            this.errorMessage = <any>error;
            if (this.errorMessage != null) {
              console.log(this.errorMessage);
              //alert ('Error en la petición');
              this.msgAtencionAlta = true;
              this.msgOkAlta = false;
              this.msgCuidadoAlta = false;
              this.msgErrorAlta = false;
            }
          }
        );
    }
  }
}
