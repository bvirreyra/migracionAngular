import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
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
  selector: "app-submenu-desplegable",
  templateUrl: "./submenu-desplegable.component.html",
  styleUrls: ["./submenu-desplegable.component.css"],
  providers: [AutenticacionService],
})
export class SubmenuDesplegableComponent implements OnInit {
  public menus: Menu[];

  public datosusr: DatosUsr[];

  public errorMessage;
  public s_idcon: string;
  public s_idmod: string;
  public s_usr: string;
  public s_nom: string;
  public s_rutahelp: string;

  //variables de historia clinica

  public menu_hc: any;
  public menu_hc2: any;
  public menu_hc3: any;
  public menu_hc4: any;
  public menu_hc5: any;
  //variables de formulario administrativo

  public menu_formadm: any;
  public menu_formadm2: any;
  public menu_formadm3: any;
  public menu_formadm4: any;
  public menu_formadm5: any;
  //variables de formualario

  public menu_form: any;
  public menu_form2: any;
  public menu_form3: any;
  public menu_form4: any;
  public menu_form5: any;

  // public fechaactual: string;
  // public document: any

  public url: string;

  public dts_datosasegurado: any;
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
    //this.getListaSubMenu();
    $("#menu_historiaclinica").collapse("hide");
    $("#menu_formadm").collapse("hide");
    $("#menu_form").collapse("hide");

    this.getListaMenuHistoriaClinica();
    this.getListaMenuFormulariosAdministrativos();
    this.getListaMenuFormularios();
    this.getListaLogin();
    if (this.getUrlVars()["comprobante"] == undefined) {
      this.url_comprobante = "9999";
    } else {
      this.url_comprobante = this.getUrlVars()["comprobante"];
    }
    this.inputMatricula = this.getUrlVars()["mat"];

    //Eventos del Menu

    // $('li.dropdown-submenu').on('click', function(event) {
    //     event.stopPropagation();
    //     if ($(this).hasClass('open')){
    //         $(this).removeClass('open');
    //     }else{
    //         $('li.dropdown-submenu').removeClass('open');
    //         $(this).addClass('open');
    //    }
    // });
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

  goHelp() {
    window.open(this.url + "/assets/pdf_help/" + this.s_rutahelp, "_blank");
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
  getListaMenuHistoriaClinica() {
    this._menuservicio.getListaMenuHistoriaClinica().subscribe(
      (result: any) => {
        
        this.menu_hc = result;
        this.menu_hc2 = this.menu_hc.filter((item) => item.NIVEL == "2");
        this.menu_hc3 = this.menu_hc.filter((item) => item.NIVEL == "3");
        this.menu_hc4 = this.menu_hc.filter((item) => item.NIVEL == "4");
        this.menu_hc5 = this.menu_hc.filter((item) => item.NIVEL == "5");
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("1Error en la petición");
        }
      }
    );
  }

  getListaMenuFormulariosAdministrativos() {
    this._menuservicio.getListaMenuFormulariosAdministrativos().subscribe(
      (result: any) => {
        
        this.menu_formadm = result;
        this.menu_formadm2 = this.menu_formadm.filter(
          (item) => item.NIVEL == "2"
        );
        this.menu_formadm3 = this.menu_formadm.filter(
          (item) => item.NIVEL == "3"
        );
        this.menu_formadm4 = this.menu_formadm.filter(
          (item) => item.NIVEL == "4"
        );
        this.menu_formadm5 = this.menu_formadm.filter(
          (item) => item.NIVEL == "5"
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
  }
  getListaMenuFormularios() {
    this._menuservicio.getListaMenuFormularios().subscribe(
      (result: any) => {
        
        this.menu_form = result;
        this.menu_form2 = this.menu_form.filter((item) => item.NIVEL == "2");
        this.menu_form3 = this.menu_form.filter((item) => item.NIVEL == "3");
        this.menu_form4 = this.menu_form.filter((item) => item.NIVEL == "4");
        this.menu_form5 = this.menu_form.filter((item) => item.NIVEL == "5");
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("1Error en la petición");
        }
      }
    );
  }
  cerrarformulario() {
    $("#menu_historiaclinica").collapse("hide");
    $("#menu_formadm").collapse("hide");
    $("#menu_form").collapse("hide");
  }
  cargarDtsdatosasegurdo(datos) {
    this.dts_datosasegurado = datos[0].ASE_MAT;
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
}
