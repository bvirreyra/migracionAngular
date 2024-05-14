import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Globals } from "../../../global";
import { AutenticacionService } from "../autenticacion.service";
import { DatosUsr } from "../datosusr";

// import { DOCUMENT } from '@angular/platform-browser';
// import { Location } from '@angular/common';
declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;

@Component({
  selector: "app-header-main",
  templateUrl: "./header-main.component.html",
  styleUrls: ["./header-main.component.css"],
  providers: [AutenticacionService],
})
export class HeaderMainComponent implements OnInit {
  //public menus: Menu[];
  public datosusr: DatosUsr[];
  public errorMessage;
  public s_idcon: string;
  public s_idmod: string;
  public s_usr: string;
  public s_nom: string;
  public s_rutahelp: string;
  public url: string;
  public url_comprobante: any;
  public inputMatricula: any;

  constructor(
    private _menuservicio: AutenticacionService,
    private _route: ActivatedRoute,
    private _router: Router,
    private globals: Globals
  ) {
    this.url = globals.rutaSrvFronEnd;
    this.s_nom;
  }

  ngOnInit() {
    this.getListaLogin();
    if (this.getUrlVars()["comprobante"] == undefined) {
      this.url_comprobante = "9999";
    } else {
      this.url_comprobante = this.getUrlVars()["comprobante"];
    }
    this.inputMatricula = this.getUrlVars()["mat"];
  }
  /*obteniendo los datos de la url*/
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

  DatosConexionRuta() {
    this._menuservicio.getdatosconexion(this.s_idcon, this.s_idmod).subscribe(
      (result: any) => {
        

        if (result[0]["RUTA_HELP"] != "") {
          this.s_rutahelp = result[0]["RUTA_HELP"];
        }
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
  getListaLogin() {
    this._route.params.forEach((params: Params) => {
      this.s_idcon = params["idcon"];
      this.s_idmod = params["idmod"];

      this._menuservicio.getListaLogin(this.s_idcon, this.s_idmod).subscribe(
        (result: any) => {
          
          if (result.length >= 1) {
            if (result[0]["USU_NOM_COM"] != "") {
              this.datosusr = result;

              this.s_nom = this.datosusr[0]["USU_NOM_COM"];
              this.s_usr = this.datosusr[0]["USU_USER"];
            } else {
              alert("No tiene permiso para ingresar a este módulo");
            }
          } else {
            alert("No tiene permiso para ingresar a este módulo");
            let ruta = "home";
            // window.open(this.url + '/' + ruta + '/' + this.s_idcon, '_self');
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            console.log(this.errorMessage);
            alert("2Error en la petición");
          }
        }
      );
    });
  }
}
