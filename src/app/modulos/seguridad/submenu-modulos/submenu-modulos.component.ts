import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { Globals } from "../../../global";
import { AutenticacionService } from "../autenticacion.service";
import { DatosUsr } from "../datosusr";
import { Menu } from "../menu";

// import { DOCUMENT } from '@angular/platform-browser';
// import { Location } from '@angular/common';
declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-submenu-modulos",
  templateUrl: "./submenu-modulos.component.html",
  styleUrls: ["./submenu-modulos.component.css"],
  providers: [AutenticacionService],
})
export class SubmenuModulosComponent implements OnInit {
  public menus: Menu[];

  public datosusr: DatosUsr[];

  public errorMessage;
  public s_idcon: string;
  public s_idmod: string;
  public s_usr: string;
  public s_nom: string;
  public s_rol: string;
  public s_rutahelp: string;
  public s_ruta_inicio = "";
  public s_ruta_inicio_mae = "";

  //variables del menu

  public menu_modulo: any;
  public menu_modulo0: any;
  public menu_modulo1: any;
  public menu_modulo2: any;
  public menu_modulo3: any;
  public menu_modulo4: any;
  public menu_modulo5: any;

  // public fechaactual: string;
  // public document: any

  public url: string;

  public dts_datosasegurado: any;
  public url_comprobante: any;
  public inputMatricula: any;
  public pnl_datosAsegurado = false;
  public NumeroCombrobante: any;

  public parametros: any;

  constructor(
    private _menuservicio: AutenticacionService,

    private _route: ActivatedRoute,
    private _router: Router,
    private globals: Globals,
    private _fun: FuncionesComponent
  ) {
    this.url = globals.rutaSrvFronEnd;
    this.s_nom;
  }

  ngOnInit() {
    $("#menu_formadm").collapse("hide");
    $("#menu_form").collapse("hide");

    this._route.paramMap.subscribe((params) => {
      this.parametros = params;
    });

    if (this.parametros.params.hasOwnProperty("nit")) {
      (this.s_ruta_inicio =
        this.parametros.params.nit +
        "/" +
        this.parametros.params.usu +
        "/" +
        this.parametros.params.pass +
        "/"),
        this.getListaLoginEmpresa();
    } else if (this.parametros.params.hasOwnProperty("id_usu")) {
      this.s_ruta_inicio_mae =
        this.parametros.params.id_usu + "/" + this.parametros.params.usu;
      console.log("ruta_mae", this.s_ruta_inicio_mae);
    } else {
      this.getListaMenuModulo();
      this.getListaLogin();
    }

    // if (this.getUrlVars()["comprobante"]==undefined){
    //     this.url_comprobante='9999';
    // }
    // else{
    //     this.url_comprobante = this.getUrlVars()["comprobante"];
    // }

    // this.inputMatricula = this.getUrlVars()["mat"];

    //Eventos del Menu

    $("li.dropdown-submenu").on("click", function (event) {
      event.stopPropagation();
      if ($(this).hasClass("open")) {
        $(this).removeClass("open");
      } else {
        $("li.dropdown-submenu").removeClass("open");
        $(this).addClass("open");
      }
    });
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

  getListaLogin() {
    this._route.params.forEach((params: Params) => {
      this.s_idcon = params["idcon"];
      this.s_idmod = params["idmod"];

      this._menuservicio.getListaLogin(this.s_idcon, this.s_idmod).subscribe(
        (result: any) => {
          if (result.length >= 1) {
            if (result[0]["_usu_nom_com"] != "") {
              this.datosusr = result;

              this.s_nom = this.datosusr[0]["_usu_nom_com"];
              this.s_usr = this.datosusr[0]["_usu_user"];
              this.s_rol = this.datosusr[0]["_rol"];
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

  goHelp() {
    window.open(this.url + "/assets/pdf_help/" + this.s_rutahelp, "_blank");
  }
  getListaMenuModulo() {
    this._route.params.forEach((params: Params) => {
      this.s_idcon = params["idcon"];
      this.s_idmod = params["idmod"];

      this._menuservicio
        .getListaSubMenuModulo(this.s_idcon, this.s_idmod)
        .subscribe(
          (result: any) => {
            console.log("MENUSSSSSSSSSSSSSSSSSSSSSS", result);
            if (result.estado == "Error") return false;
            this.menu_modulo = result;
            this.menu_modulo0 = this.menu_modulo.filter(
              (item) => item._nivel == ""
            );
            this.menu_modulo1 = this.menu_modulo.filter(
              (item) => item._nivel == "1"
            );
            this.menu_modulo2 = this.menu_modulo.filter(
              (item) => item._nivel == "2"
            );
            this.menu_modulo3 = this.menu_modulo.filter(
              (item) => item._nivel == "3"
            );
            this.menu_modulo4 = this.menu_modulo.filter(
              (item) => item._nivel == "4"
            );
            this.menu_modulo5 = this.menu_modulo.filter(
              (item) => item._nivel == "5"
            );
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
  /*DATOS DE EMPRESA CONECTADA*/

  getListaLoginEmpresa() {
    this._route.params.forEach((params: Params) => {
      this.s_idmod = params["idmod"];
      this.s_nom = this._fun.base64Decode(this.parametros.params.usu);
      this.s_usr = this._fun.base64Decode(this.parametros.params.nit);
      this.s_rol = "EMPRESA";
    });
  }

  getListaLoginMae() {
    this._route.params.forEach((params: Params) => {
      this.s_idmod = params["idmod"];
      this.s_nom = this._fun.base64Decode(this.parametros.params.id_usu);
      this.s_usr = this._fun.base64Decode(this.parametros.params.usu);
      this.s_rol = "MAE";
    });
  }

  /*FIN DATOS DE EMPRESA CONECTADA*/
  cargarDtsdatosasegurdo(datos) {
    this.dts_datosasegurado = datos;
  }
  cargarComprobante(datos) {
    this.url_comprobante = datos;
  }
  abrirMenu(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    var _liParent = target.offsetParent;
    event.stopPropagation();
    if ($(_liParent).hasClass("open")) {
      $(_liParent).removeClass("open");
    } else {
      $("li.dropdown-submenu").removeClass("open");
      $(_liParent).addClass("open");
    }
  }
  abrirMenu2(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    var _liParent = target.offsetParent;
    event.stopPropagation();
    if ($(_liParent).hasClass("open")) {
      $(_liParent).removeClass("open");
    } else {
      $("li.dropdown-submenu").removeClass("open");
      $(_liParent).addClass("open");
    }
  }
  cerrarMenuPadre(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    var _liParent = target.offsetParent;
    var _liParentParent = _liParent.offsetParent;
    var _liParentParentParente = _liParentParent.offsetParent;
    var _liMenu = _liParentParentParente.offsetParent;
    $(_liParentParent).removeClass("open");
    $(_liMenu).removeClass("open");
    $(".navbar-collapse.collapse").removeClass("in");
  }
  cerrarsesion() {
    this._menuservicio.cerrarsesion(this.s_idcon).subscribe(
      (result: any) => {
        this._router.navigate(["/"]);
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
