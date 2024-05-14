import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { DatosMenuRol } from "./datosmenurol";
import { MenuRolService } from "./menurol.service";

import { AdmMenuService } from "../admmenu/admmenu.service";
import { DatosMenu } from "../admmenu/datosmenu";
//paginador
import { DatePipe } from "@angular/common";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { PaginationInstance } from "ngx-pagination/dist/ngx-pagination.module";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;

declare var jsPDF: any; // Important

@Component({
  selector: "app-menurol",
  templateUrl: "./menurol.component.html",
  styleUrls: ["./menurol.component.css"],
  providers: [
    AdmMenuService,
    MenuRolService,
    FuncionesComponent,
    MensajesComponent,
    DatePipe,
  ],
})
export class MenurolComponent implements OnInit {
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
  public m_menurol: DatosMenuRol;
  public buscamenurolxparametro: any;

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
    id: "pagmenurol",
    itemsPerPage: 5,
    currentPage: 1,
  };

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _admmenuservices: AdmMenuService,
    private _menurolservice: MenuRolService,
    private _fun: FuncionesComponent,
    private _msg: MensajesComponent
  ) {}

  ngOnInit() {
    this.m_menu = new DatosMenu("", "", "", "", "", "", "", "");
    this.m_menurol = new DatosMenuRol("", "", "");

    this._admmenuservices.ListaMenuRaiz().subscribe(
      (result: any) => {
        
        //  console.log(result);
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
        //console.log(this.submenu);
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
  /*
    FormularioEditaMenu(row_registrosbusqueda: any )  {
      this.titulo = 'Edicion Menu';
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
  
  
      //console.log(row_registrosbusqueda);
      console.log(this.m_menu);
  
  
    }
  */

  RegistrarMenuRol(row_regbusquedamenurol: any, submenu: any) {
    this.m_menurol.IDMENU = this.m_menu.IDMENU;
    this.m_menurol.IDROL = row_regbusquedamenurol.IDROL;
    //this.insertar = true;

    //console.log(this.m_menurol);

    this._menurolservice.getAltaMenuRol(this.m_menurol).subscribe(
      (result: any) => {
        
        //console.log(result);
        if (result[0]["ESTADO"] === "INSERTADO") {
          this.titulo_alerta = "Registrado!";
          this.respuestas = result;
          this.pnl_alert_error = false;
          //this.pnl_alert_success = true;
          this.busquedaMenurol();
        }
        if (result[0]["ESTADO"] === "ERROR") {
          alert("NO SE REGISTRO EL MENU ROL");
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          this.titulo_alerta = "Error!";
          this.mensaje_alerta = "En los campos enviados.";
          this.pnl_alert_error = true;
          //alert('Error en la petición1');
        }
      }
    );

    this.pnl_registrosbusqueda = false;

    this.busquedaMenurol();
  }

  ActualizarEstadoMenuRol(row_regbusquedamenurol: any) {
    //    console.log(row_regbusquedamenurol);
    this.m_menurol.IDMENU = row_regbusquedamenurol.IDMENU;
    this.m_menurol.IDROL = row_regbusquedamenurol.IDROL;
    this.m_menurol.IDESTADO = row_regbusquedamenurol.IDESTADO;

    //    console.log(this.m_menurol);
    this._menurolservice.getModificaEstadoMenuRol(this.m_menurol).subscribe(
      (result: any) => {
        
        // console.log(result);
        if (result[0]["ESTADO"] === "MODIFICADO") {
          if (result[0]["IDESTADO"] === 32) {
            this.titulo_alerta = " Inactivacion del Menu Correcta!";
          } else {
            this.titulo_alerta = "Activación del Menu Correcta!";
          }
          this.respuestas = result;
          this.pnl_alert_success = true;
          this.busquedaMenurol();
          //this.m_menu = new DatosMenu("", "", "", "", "", "", "", "");
          //this.pnl_formulariobusqueda = false;
          //this.pnl_registrosbusqueda = false;
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

    //console.log(this.pnl_formulariobusqueda);
  }

  busquedaMenurol() {
    this.pnl_registrosbusqueda = true;
    this.pnl_alert_success = false;
    this.pnl_alert_error = false;

    var v_idmenu;

    v_idmenu = this.m_menu.IDMENU;

    // console.log(v_idmenu);
    this.BuscaMenurolxParametro(v_idmenu);
  }

  BuscaMenurolxParametro(v_idmenu: string) {
    this._menurolservice.buscamenurolxparametro(v_idmenu).subscribe(
      (response: any) => {
        if (Array.isArray(response)) {
          this.buscamenurolxparametro = response;
          this.respuestas = response;

          let confiTable = this._fun.CONFIGURACION_TABLA_V2(
            [10, 20, 30],
            true,
            0,
            "desc"
          );
          setTimeout(() => {
            if ($.fn.dataTable.isDataTable(".tablaMenuRol")) {
              // No hace Nada xq ya tiene la Configuracion establecida
            } else {
              $(".tablaMenuRol").DataTable(confiTable);
            }
          }, 500);

          //console.log(this.buscamenurolxparametro);
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
}
