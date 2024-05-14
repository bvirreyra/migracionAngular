import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Globals } from "../../../global";
import { AutenticacionService } from "../autenticacion.service";
import { DatosUsr } from "../datosusr";
import { Menu } from "../menu";

// import { DOCUMENT } from '@angular/platform-browser';
// import { Location } from '@angular/common';

@Component({
  selector: "app-submenu",
  templateUrl: "./submenu.component.html",
  styleUrls: ["./submenu.component.css"],
  providers: [AutenticacionService],
})
export class SubmenuComponent implements OnInit {
  public menus: Menu[];

  public datosusr: DatosUsr[];

  public errorMessage;
  public s_idcon: string;
  public s_idmod: string;
  public s_usr: string;
  public s_nom: string;
  public s_rutahelp: string;

  // public fechaactual: string;
  // public document: any

  public url: string;

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
    this.getListaSubMenu();
  }

  getListaSubMenu() {
    this._route.params.forEach((params: Params) => {
      let _idcon = params["idcon"];
      let _idmodulo = params["idmod"];
      this._menuservicio.getListaSubMenu(_idcon, _idmodulo).subscribe(
        (result: any) => {
          

          this.menus = result;
          if (!this.menus) {
            alert("Error en el servidor");
          } else {
            //alert('Bienvenido al Sistema');
            this.s_idcon = _idcon;
            this.s_idmod = _idmodulo;
            this.getListaLogin();
            this.DatosConexionRuta();
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            console.log(this.errorMessage);
            alert("1Error en la petición");
          }
        }
      );
    });
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
          window.open(this.url + "/" + ruta + "/" + this.s_idcon, "_self");
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
  }

  goHelp() {
    window.open(this.url + "/assets/pdf_help/" + this.s_rutahelp, "_blank");
  }
  cerrarsesion() {
    this._menuservicio.cerrarsesion(this.s_idcon).subscribe(
      (result: any) => {
        
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la petición");
        }
      }
    );
  }
}
