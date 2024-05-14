import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AutenticacionService } from "./autenticacion.service";
import { DatosUsr } from "./datosusr";
import { Menu } from "./menu";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  providers: [AutenticacionService],
})
export class HomeComponent implements OnInit {
  public tituloSis: string;
  public menus: Menu[];
  public datosusr: DatosUsr[];
  public errorMessage;
  public s_idcon: string;
  public s_usr: string;
  public s_nom: string;

  constructor(
    private _menuservicio: AutenticacionService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.tituloSis = "Sistema Administrativo Medico Integrado (SAMI)";
    // this.varsess=_session.varsession;
    //this.varsess=_session.tituloLogin;
    //this.varsess=_session.variablesession;
    //this.varsess=_menuservicio.usr;
  }

  ngOnInit() {
    //this.getListaMenu();
  }
  //   getListaMenu(){
  //         // let usr='ALUNA';
  //         // let pass='2448964Al'

  //      this._route.params.forEach((params:Params)=>{

  //             //  let _usr=params['usr'];
  //             //  let _pass=params['pass'];
  //             let _idcon=params['idcon']

  //               this._menuservicio.getListaModulo(_idcon).subscribe(
  //                       (result:any) => { result=result.json();
  //                           console.log(result);
  //                           this.menus=result;

  //                           if(!this.menus){
  //                               alert('Error en el servidor');
  //                           }
  //                           else{
  //                               //alert('Bienvenido al Sistema');
  //                               this.s_idcon=_idcon;
  //                               this.getListaLogin();
  //                           }
  //                       },
  //                       error=>{
  //                           this.errorMessage=<any>error;
  //                           if(this.errorMessage !=null){
  //                               console.log(this.errorMessage);
  //                               alert ('Error en la petición');
  //                           }
  //                       }
  //               )
  //     });

  // }
  // getListaLogin(){
  //     this._menuservicio.getListaLogin(this.s_idcon).subscribe(
  //                       (result:any) => { result=result.json();
  //                           console.log(result);
  //                           this.datosusr=result;

  //                           if(!this.datosusr){
  //                               alert('Error al obtener los datos del usuario');
  //                           }
  //                           else{
  //                                if(Array.isArray(this.datosusr)){
  //                                     this.datosusr.forEach((params:Params)=>{
  //                                         this.s_usr=params['USU_NOM_COM'];
  //                                         this.s_nom=params['USU_USER'];
  //                                     });

  //                             // alert('Bienvenido al Sistema');

  //                           }
  //                         }
  //                       },
  //                       error=>{
  //                           this.errorMessage=<any>error;
  //                           if(this.errorMessage !=null){
  //                               console.log(this.errorMessage);
  //                               alert ('Error en la petición');
  //                           }
  //                       }
  //               )

  // }
}
