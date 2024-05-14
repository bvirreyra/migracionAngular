import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { AdmMenuService } from "./admmenu.service";
import { DatosMenu } from "./datosmenu";
//paginador
import { PaginationInstance } from "ngx-pagination/dist/ngx-pagination.module";

@Component({
  selector: "app-admmenu",
  templateUrl: "./admmenu.component.html",
  styleUrls: ["./admmenu.component.css"],
  providers: [AdmMenuService],
})
export class AdmmenuComponent implements OnInit {
  // variables del componente VolverPanelPrincipal
  public idcon: string;
  public idmod: string;
  public idmenu: number;

  public idmenucon: string;
  public usercon: string;

  /*variables contmenu de paneles*/
  public pnl_formulariobusqueda = true;
  public pnl_formularioalta = false;
  public pnl_registrosbusqueda = false;
  public pnl_alert_error = false;
  public pnl_alert_success = false;
  public pnl_alert = false;

  // Variables para la cuenta y contraseña del menu
  public usr: string;
  public pass: string;

  public datospersonales;
  public errorMessage: any;

  /*variables de modelo*/
  public m_menu: DatosMenu;
  public buscamenuxparametros: any;

  // variables del componente
  public combo_modulos: any;
  public combo_menus: any;
  public respuestas: any;
  public submenu: any;

  public titulo: string;
  public titulo_alerta: string;
  public mensaje_alerta: string;
  public insertar = false;
  //Paginador
  public currentPage = 0;
  public pageSize = 10;
  public pages = [];
  public config: PaginationInstance = {
    id: "pagmenu",
    itemsPerPage: 5,
    currentPage: 1,
  };

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _admmenuservices: AdmMenuService
  ) {}

  ngOnInit() {
    this.m_menu = new DatosMenu("", "", "", "", "", "", "", "");
    this.m_menu.ICONO = "fa fa-id-card fa-3x";

    this._admmenuservices.ListaMenuRaiz().subscribe(
      (result: any) => {
        
        //console.log(result);
        this.combo_menus = result;
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la petición select");
        }
      }
    );
  }

  ListaSubMenu() {
    var idmenu = this.m_menu.IDMENU;

    this._admmenuservices.ListaSubMenu(idmenu).subscribe(
      (result: any) => {
        
        this.submenu = result;
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la petición select2");
        }
      }
    );
  }

  FormularioMenu() {
    this.titulo = "Nuevo Menu";
    this.pnl_formularioalta = true;
    this.pnl_formulariobusqueda = false;
    this.pnl_registrosbusqueda = false;
    this.insertar = true;

    this._admmenuservices.ListaMenuRaiz().subscribe(
      (result: any) => {
        
        // console.log(result);
        this.combo_menus = result;
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la petición select");
        }
      }
    );
  }

  FormularioEditaMenu(row_registrosbusqueda: any) {
    this.titulo = "Edicion Menu";
    this.pnl_formularioalta = true;
    this.pnl_formulariobusqueda = false;
    this.pnl_registrosbusqueda = false;
    this.insertar = false;

    this.m_menu.IDMENU = row_registrosbusqueda.IDMENU;
    this.m_menu.DESCRIPCION = row_registrosbusqueda.DESCRIPCION;
    this.m_menu.IDMENUSUPERIOR = row_registrosbusqueda.IDMENUSUPERIOR;
    this.m_menu.NIVEL = row_registrosbusqueda.NIVEL;
    this.m_menu.ORDEN = row_registrosbusqueda.ORDEN;
    this.m_menu.ICONO = row_registrosbusqueda.ICONO;
    this.m_menu.RUTA = row_registrosbusqueda.RUTA;
    this.m_menu.IDESTADO = row_registrosbusqueda.IDESTADO;
  }

  RegistrarMenu() {
    this._admmenuservices.getAltaMenu(this.m_menu).subscribe(
      (result: any) => {
        
        //console.log(result);
        if (result[0]["ESTADO"] === "INSERTADO") {
          this.titulo_alerta = "Registrado!";
          this.pnl_formularioalta = false;
          this.respuestas = result;
          this.pnl_alert_error = false;
          this.pnl_alert_success = true;
        }
        if (result[0]["ESTADO"] === "ERROR") {
          alert("NO SE REGISTRO EL menu");
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          this.titulo_alerta = "Error!";
          this.mensaje_alerta = "En los campos enviados.";
          this.pnl_alert_error = true;
          this.pnl_formularioalta = false;
          //alert('Error en la petición1');
        }
      }
    );
  }

  ActualizarMenu() {
    this._admmenuservices.getModificaMenu(this.m_menu).subscribe(
      (result: any) => {
        

        if (result[0]["ESTADO"] === "MODIFICADO") {
          this.titulo_alerta = "Actualizacion Correcta!";
          this.respuestas = result;
          this.pnl_alert_success = true;
          this.pnl_alert_error = false;
          this.pnl_formularioalta = false;
        }
        if (result[0]["ESTADO"] == "ERROR") {
          alert("NO SE REGISTRO EL menu");
        }
        if (result[0]["ESTADO"] == "ERROR Menu") {
          alert("EXISTE EL ID DE menu!, ");
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          this.titulo_alerta = "Error!";
          this.mensaje_alerta = "En los campos enviados.";
          this.pnl_alert_error = true;
          this.pnl_formularioalta = false;
        }
      }
    );
  }

  ActualizarEstadoMenu(row_registrosbusqueda: any) {
    this.m_menu.IDMENU = row_registrosbusqueda.IDMENU;
    this.m_menu.IDESTADO = row_registrosbusqueda.IDESTADO;

    this._admmenuservices.getModificaEstadoMenu(this.m_menu).subscribe(
      (result: any) => {
        
        //console.log(result);
        if (result[0]["ESTADO"] === "MODIFICADO") {
          if (result[0]["IDESTADO"] === 32) {
            this.titulo_alerta = " Inactivacion del Menu Correcta!";
          } else {
            this.titulo_alerta = "Activación del Menu Correcta!";
          }
          this.respuestas = result;
          this.pnl_alert_success = true;
          this.m_menu = new DatosMenu("", "", "", "", "", "", "", "");
          this.pnl_formulariobusqueda = false;
          this.pnl_registrosbusqueda = false;
        }
        if (result[0]["ESTADO"] === "ERROR") {
          alert("NO SE REGISTRO EL menu");
        }
        if (result[0]["ESTADO"] === "ERROR menu") {
          alert("EXISTE EL ID DE menu!, ");
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la petición actualiza estado menu");
        }
      }
    );
  }

  VolverPanelPrincipal() {
    this.pnl_formulariobusqueda = true;
    this.pnl_formularioalta = false;
    this.pnl_alert_success = false;
    this.pnl_alert_error = false;
    this.m_menu = new DatosMenu("", "", "", "", "", "", "", "");

    this._admmenuservices.ListaMenuRaiz().subscribe(
      (result: any) => {
        
        //console.log(result);
        this.combo_menus = result;
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la petición select");
        }
      }
    );

    //console.log(this.pnl_formulariobusqueda);
  }

  busquedaMenu() {
    this.pnl_registrosbusqueda = true;
    this.pnl_alert_success = false;
    this.pnl_alert_error = false;

    var v_idmenu;

    v_idmenu = this.m_menu.IDMENU;

    //console.log(v_idmenu);
    this.BuscaMenuxParametro(v_idmenu);
  }

  BuscaMenuxParametro(v_idmenu: string) {
    this._admmenuservices.buscamenuxparametros(v_idmenu).subscribe(
      (response: any) => {
        if (Array.isArray(response)) {
          this.buscamenuxparametros = response;
          this.respuestas = response;

          //console.log(this.buscauserxparametros);
        } else {
          alert("No existen registros con los datos ingresados");
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la petición 1");
        }
      }
    );
  }

  /*Control Formulario */
  limpiarFormulario() {
    this.m_menu.IDMENU = "";
    this.pnl_registrosbusqueda = false;
  }

  configPages() {
    this.pages.length = 0;
    var ini = this.currentPage - 4;
    var fin = this.currentPage + 5;
    //this.cabeceralistahistorico();
    if (ini < 1) {
      ini = 1;
      if (Math.ceil(this.buscamenuxparametros.length / this.pageSize) > 10)
        fin = 10;
      else fin = Math.ceil(this.buscamenuxparametros.length / this.pageSize);
    } else {
      if (ini >= Math.ceil(this.buscamenuxparametros / this.pageSize) - 10) {
        ini = Math.ceil(this.buscamenuxparametros / this.pageSize) - 10;
        fin = Math.ceil(this.buscamenuxparametros / this.pageSize);
      }
    }
    if (ini < 1) ini = 1;
    for (var i = ini; i <= fin; i++) {
      this.pages.push({
        no: i,
      });
    }

    if (this.currentPage >= this.pages.length)
      this.currentPage = this.pages.length - 1;
  }
}
