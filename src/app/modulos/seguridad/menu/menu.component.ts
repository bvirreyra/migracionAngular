import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { AutenticacionService } from "../autenticacion.service";
import { DatosUsr } from "../datosusr";
import { Menu } from "../menu";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"],
  providers: [AutenticacionService],
})
export class MenuComponent implements OnInit {
  public tituloSis: string;
  public menus: Menu[];
  public menusEmpresa: any[];
  public menusEmpresaMAE: any[];
  public datosusr: DatosUsr[];
  public errorMessage;
  public s_idcon: string;
  public s_idmod: string;

  public s_nit: string;
  public s_nit_usu: string;
  public s_nit_pass: string;

  public s_usr: string;
  public s_nom: string;
  public parametros: any;

  public s_id_usu: string;
  public s_usu_mae: string;

  constructor(
    private _menuservicio: AutenticacionService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this._route.params.forEach((params: Params) => {
      this.s_idcon = params["idcon"];
    });
    this.menusEmpresa = [];
  }

  ngOnInit() {
    this.menusEmpresa = [];
    this.menusEmpresaMAE = [];
    //this.getListaMenu();
    //console.log(this.s_idcon)
    this._route.paramMap.subscribe((params) => {
      this.parametros = params;
    });
    console.log("parametros entrantes", this.parametros);
    if (this.parametros.params.hasOwnProperty("nit")) {
      console.log("SOY EMPRESA");
      this.s_nit = this.parametros.params.nit;
      this.s_nit_usu = this.parametros.params.usu;
      this.s_nit_pass = this.parametros.params.pass;
      this.getListaMenuFiltradoEmpresa();
    } else if (this.parametros.params.hasOwnProperty("id_usu")) {
      console.log("SOY MAE");
      this.getListaMenuFiltradoMAE();
      this.s_id_usu = this.parametros.params.id_usu;
      this.s_usu_mae = this.parametros.params.usu;
    } else {
      console.log("SOY UPRE");
      this.getListaMenuFiltrado();
    }
  }
  getListaMenu() {
    this._route.params.forEach((params: Params) => {
      let _idcon = params["idcon"];
      let _idmodulo = params["idmod"];
      this._menuservicio.getListaModulo().subscribe(
        (result: any) => {
          
          // console.log(result);
          this.menus = result;

          if (!this.menus) {
            alert("Error en el servidor");
          } else {
            //alert('Bienvenido al Sistema');
            this.s_idcon = _idcon;
            this.s_idmod = _idmodulo;
            this.getListaLogin();
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            console.log(this.errorMessage);
            alert("Error en la petición");
          }
        }
      );
    });
  }
  getListaLogin() {
    this._menuservicio.getListaLogin(this.s_idcon, this.s_idmod).subscribe(
      (result: any) => {
        

        this.datosusr = result;

        if (!this.datosusr) {
          alert("Error al obtener los datos del usuario");
        } else {
          if (Array.isArray(this.datosusr)) {
            this.datosusr.forEach((params: Params) => {
              this.s_usr = params["USU_NOM_COM"];
              this.s_nom = params["USU_USER"];
            });
          }
        }
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
  getListaMenuFiltrado() {
    this._menuservicio.getListamodulosXRol(this.s_idcon).subscribe(
      (result: any) => {
        
        this.menus = result;
        if (this.menus.length <= 0) {
          alert("Error en el servidor");
        }
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
  getListaMenuFiltradoEmpresa() {
    this.menusEmpresa.push({
      ruta: "consulta_empresa",
      icono: "fa fa-save",
      nombre: "Consulta para Empresas",
    });
  }
  getListaMenuFiltradoMAE() {
    console.log("ingreso aquii");
    this.menusEmpresaMAE.push({
      ruta: "consulta_empresa_mae",
      icono: "fa fa-save",
      nombre: "Consulta para Empresas",
    });
  }
}
