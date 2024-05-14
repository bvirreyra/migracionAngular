import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { Globals } from "../../../global";
import { AutenticacionService } from "../autenticacion.service";
import { DatosUsr } from "../datosusr";
import { Menu } from "../menu";

import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";
import { AccesosRolComponent } from "../../sgp/accesos-rol/accesos-rol.component";
// import { DOCUMENT } from '@angular/platform-browser';
// import { Location } from '@angular/common';
declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-contenedor-empresa",
  templateUrl: "./contenedor-empresa.component.html",
  styleUrls: ["./contenedor-empresa.component.css"],
  providers: [AutenticacionService, AccesosRolComponent, MensajesComponent],
})
export class ContenedorEmpresaComponent implements OnInit {
  public menus: Menu[];

  public datosusr: DatosUsr[];

  public conStorage: boolean = false;
  public s_tipo: string;
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
  public dtsRolesUsuario: any;
  public s_usu_id_sipta: any;
  public s_usu_id_sispre: any;
  public s_ci_user: any;
  public s_usu_area: any;

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

  public dts_datosasegurado: any;
  public url_comprobante: any;
  public inputMatricula: any;
  public pnl_datosAsegurado = false;
  public NumeroCombrobante: any;

  public parametros: any;
  public dtsMenu: any;
  public pnlBienvenida = true;
  public s_menusuperior = false;

  public camposHabilitados: {};

  constructor(
    private _menuservicio: AutenticacionService,

    private _route: ActivatedRoute,
    private _router: Router,
    private globals: Globals,
    private _fun: FuncionesComponent,
    private _accesos: AccesosRolComponent,
    private _autenticacion: AutenticacionService,
    private _msg: MensajesComponent
  ) {
    this.url = globals.rutaSrvFronEnd;
    this.s_nom;
  }

  ngOnInit() {
    this._route.params.forEach((params: Params) => {
      console.log("parametros url===>", params);

      this.s_idcon = params["idcon"] === undefined ? "SN" : params["idcon"];
      this.s_idmod = params["idmod"];

      console.log("modulo", this.s_idmod);
      console.log("MENUSUPERIOR2===>", this.s_menusuperior);
      this.ListaMenu();
      console.log("revi", this.s_idmod, this.getUrlVars(), this.s_idcon);

      this.getListaMenuModulo();

      // if (this.s_idmod != undefined) {
      //   if (this.getUrlVars()["menusuperior"] == "si") {
      //     this.getListaMenuModulo();
      //   }
      // }

      if (this.s_idmod == undefined || this.s_idmod == "16") {
        console.log("entra aqui??????");
        this._accesos.accesosConexion(this.s_idcon).then((dts) => {
          this.dtsDatosConexion = dts;
          console.log("Datos Conexcion=======>", this.dtsDatosConexion);
          this.s_nomuser = dts["_usu_nom_com"];
          this.s_tipo = dts["_tipo_conexion"];
          if (this.s_tipo == "EMPRESA") {
            this.pnlBienvenida = false;
          } else {
            this.pnlBienvenida = true;
          }
          console.log("tipo====>", this.s_tipo);
          console.log("rol====>", this.s_rol);
        });
      } else {
        this.pnlBienvenida = false;
        this.ConexionStorage(this.s_idcon, this.s_idmod, this.s_menusuperior);
      }
    });
  }

  ConexionStorage(idcon, idmod, menusuperior) {
    sessionStorage.clear();
    this._accesos
      .accesosDatosConexion(idcon, idmod)
      .then((dts) => {
        this.dtsDatosConexion = dts;
        console.log("Datos Conexcion=======>", this.dtsDatosConexion);
        this.s_idrol = dts["_idrol"];
        this.s_user = dts["_usu_user"];
        this.s_nomuser = dts["_usu_nom_com"];
        this.s_rol = dts["_rol"];
        this.s_usu_id = dts["_usu_id"];
        this.s_usu_id_sipta = dts["_usu_id_sipta"];
        this.s_usu_id_sispre = dts["_usu_id_sispre"];
        this.s_ci_user = dts["_usu_ci"];
        this.s_usu_area = dts["_usu_area"];
        this.s_tipo = dts["_tipo_conexion"];
        this.s_menusuperior = menusuperior;
        return this._accesos.accesosRestriccionesxRolV2(dts["_usu_id"]);
      })
      .then((dts) => {
        this.dtsRolesUsuario = dts;
        console.log("Datos roles", this.dtsRolesUsuario);
        this.GuardarLocalStorage();
        // return this._accesos.accesosRestriccionesxRolV2(this.s_usu_id);
      });
    // .then((dts) => {
    //   this.camposHabilitados = dts;
    //   console.log("Rol Campos Habilitados===>", this.camposHabilitados);
    //   this.GuardarLocalStorage();
    // });
  }
  async accesosRestriccionesxRolV2(id) {
    let promise = new Promise((resolve, reject) => {
      this._autenticacion.administracion_roles(id).subscribe(
        (result: any) => {
          this.camposHabilitados = result[0].roles_asignados[0];
          console.log("adm3", this.camposHabilitados);
          resolve(this.camposHabilitados);
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_info", this.prop_msg);
          }
        }
      );
    });
    return await promise;
  }
  GuardarLocalStorage() {
    let dts_con = {
      s_idrol: this.s_idrol,
      s_user: this.s_user,
      s_nomuser: this.s_nomuser,
      s_usu_id: this.s_usu_id,
      s_usu_id_sipta: this.s_usu_id_sipta,
      s_usu_id_sispre: this.s_usu_id_sispre,
      s_ci_user: this.s_ci_user,
      s_usu_area: this.s_usu_area,
      s_menusuperior: this.s_menusuperior,
    };
    let dts_rol = this.dtsRolesUsuario;
    let camposHabilitados = this.camposHabilitados;

    localStorage.setItem("dts_con", JSON.stringify(dts_con));
    localStorage.setItem("dts_rol", JSON.stringify(dts_rol));
    localStorage.setItem("dts_permisos", JSON.stringify(dts_rol));
    this.conStorage = true;
  }

  ListaMenu() {
    console.log("listando menu");
    this._menuservicio.ListaMenu(this.s_idcon).subscribe(
      (result: any) => {
        console.log("lista menu contenedor", result);
        this.dtsMenu = result;
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

  menuAcordeon(e: any) {
    if (document.querySelector(".titulo").classList.contains("ocultar"))
      this.responsivo();
    //para cerrar los menues abiertos
    document.querySelectorAll(".fa-chevron-down").forEach((item) => {
      if (item.getAttribute("id").replace("flecha", "") != e._idmenu) {
        let cambio = document.querySelector("#" + item.getAttribute("id"));
        cambio.classList.toggle("fa-chevron-right");
        cambio.classList.toggle("fa-chevron-down");
        let cerrar = document.querySelector(
          "#sub" + item.getAttribute("id").replace("flecha", "")
        );
        if (cerrar) cerrar.classList.toggle("ocultar");
      }
      if (item.getAttribute("id") == "flechaAdmin")
        document.querySelector("#adminSub").classList.toggle("ocultar");
    });

    if (e == "admin") {
      const menu = document.getElementById("adminSub");
      menu.classList.toggle("ocultar");
      const flecha = document.getElementById("flechaAdmin");
      flecha.classList.toggle("fa-chevron-right");
      flecha.classList.toggle("fa-chevron-down");
    } else {
      const flecha = document.getElementById("flecha" + e._idmenu);
      flecha.classList.toggle("fa-chevron-right");
      flecha.classList.toggle("fa-chevron-down");
      const sub = document.getElementById("sub" + e._idmenu);
      sub.classList.toggle("ocultar");
      // if(this.dtsSubMenu){//para ir al primer submenu
      //   setTimeout(() => {
      //     const primerSubMenu = this.dtsSubMenu.sort((a,b)=>a._orden - b._orden)[0]._idmenu;
      //     document.getElementById("a"+primerSubMenu).click();
      //     console.log('clic',primerSubMenu);

      //   }, 200);
      // }
    }
  }

  responsivo() {
    document
      .querySelectorAll(".contenedor-menu")
      .forEach((e) => e.classList.toggle("ocultar"));
    document.querySelector("#panelMenu").classList.contains("ocultar")
      ? (document.getElementById("principal").style.width = "100%")
      : (document.getElementById("principal").style.width =
          "calc(100% - 300px)");

    document.querySelector("#panelMenu").classList.contains("ocultar")
      ? (document.getElementById("principal").style.padding = "10px 0 0 0")
      : (document.getElementById("principal").style.padding = "10px 0 0 10px");
    //cerrar los submenus abiertos
    // document.querySelectorAll('.fa-chevron-down').forEach(i=>{
    //   i.classList.toggle('fa-chevron-right')
    //   i.classList.toggle('fa-chevron-down')
    // })
    // document.querySelectorAll('.submenuItems').forEach(s=>{
    //   if(!s.classList.contains('ocultar')) s.classList.add('ocultar');
    // })
  }
  link_horizontal(dts) {
    this._router.navigate([
      "/" +
        dts._ruta_modulo +
        "/" +
        this.s_idcon +
        "/" +
        dts._idmodulo +
        "/" +
        dts._ruta,
    ]);
    this.ConexionStorage(this.s_idcon, dts._idmodulo, false);

    console.log("Entra aqui=========>>>>HORIZONTAL");
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
  }
  link_vertical(dts) {
    this._router.navigate(
      ["/" + dts._ruta_modulo + "/" + this.s_idcon + "/" + dts._idmodulo],
      { queryParams: { menusuperior: "si" } }
    );
    this.ConexionStorage(this.s_idcon, dts._idmodulo, true);
    console.log("Entra aqui=========>>>>VERTICAL");
  }
  getListaMenuModulo() {
    // this._route.params.forEach((params: Params) => {
    //   this.s_idcon = params["idcon"];
    //   this.s_idmod = params["idmod"];

    this._menuservicio
      .getListaSubMenuModulo(this.s_idcon, this.s_idmod)
      .subscribe(
        (result: any) => {
          console.log("CON", this.s_idcon);
          console.log("MOD", this.s_idmod);
          console.log("MENUSSSSSSSSSSSSSSSSSSSSSS", result);

          if (result.estado == "Error") return false;
          this.menu_modulo = result;

          if(result.estado=='Error') return false;

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
    // });
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
  goHelp() {
    window.open(this.url + "/assets/pdf_help/" + this.s_rutahelp, "_blank");
  }

  cambiapassword() {
    this._router.navigate(["cambiopassword/" + this.s_idcon]);
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
