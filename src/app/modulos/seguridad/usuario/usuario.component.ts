import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { DatosUsuario } from "./datosusuario";
import { UsuarioService } from "./usuario.service";
//paginador
import { PaginationInstance } from "ngx-pagination/dist/ngx-pagination.module";

@Component({
  selector: "app-usuario",
  templateUrl: "./usuario.component.html",
  styleUrls: ["./usuario.component.css"],
  providers: [UsuarioService],
})
export class UsuarioComponent implements OnInit {
  // variables del componente VolverPanelPrincipal
  public idcon: string;
  public idmod: string;
  public idrol: number;

  public idrolcon: string;
  public usercon: string;

  /*variables control de paneles*/
  public pnl_formulariobusqueda = true;
  public pnl_formularioalta = false;
  public pnl_registrosbusqueda = false;
  public pnl_alert_error = false;
  public pnl_alert_success = false;
  public pnl_alert = false;

  // Variables para la cuenta y contraseña del usuario
  public usr: string;
  public pass: string;

  public datospersonales;
  public errorMessage: any;

  /*variables de modelo*/
  public m_usuario: DatosUsuario;
  public buscauserxparametros: any;

  // variables del componente
  public areas: any;
  public perfiles: any;
  public respuestas: any;

  public titulo: string;
  public titulo_alerta: string;
  public mensaje_alerta: string;
  public insertar = false;

  //Paginador
  public currentPage = 0;
  public pageSize = 10;
  public pages = [];
  //Paginado
  public config: PaginationInstance = {
    id: "pagusuario",
    itemsPerPage: 5,
    currentPage: 1,
  };

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _usuarioservices: UsuarioService
  ) {}

  ngOnInit() {
    this.m_usuario = new DatosUsuario("", "", "", "", "", "", "0000-00-00", "");
  }

  FormularioUsuario() {
    this.titulo = "Nuevo Usuario";
    this.pnl_formularioalta = true;
    this.pnl_formulariobusqueda = false;
    this.pnl_registrosbusqueda = false;
    this.insertar = true;

    this._usuarioservices.ListaAreas().subscribe(
      (result: any) => {
        this.areas = result;
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
  FormularioEditaUsuario(row_registrosbusqueda: any )  {
    this.titulo = 'Edicion Usuario';
    this.pnl_formularioalta = true;
    this.pnl_formulariobusqueda = false;
    this.pnl_registrosbusqueda = false;
    this.insertar = false;

    this.m_usuario.USU_ID = row_registrosbusqueda.US_ID;
    this.m_usuario.USU_NOM = row_registrosbusqueda.USU_NOM;
    this.m_usuario.USU_APAT = row_registrosbusqueda.USU_APAT;
    this.m_usuario.USU_AMAT = row_registrosbusqueda.USU_AMAT;
    this.m_usuario.CORREO = row_registrosbusqueda.CORREO;
    this.m_usuario.USU_PERFIL = row_registrosbusqueda.USU_PERFIL;
    this.m_usuario.USU_GRUPO = row_registrosbusqueda.USU_GRUPO;
    this.m_usuario.USU_USER = row_registrosbusqueda.USU_USER;
    
  

    this._usuarioservices.ListaAreas().subscribe(
      (result:any) => { result=result.json();
        this.areas = result;
      },
      error => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
              console.log(this.errorMessage);
              alert('Error en la petición ');
          }
      }
    )

  }

  ListaPerfiles()  {
    var area = this.m_usuario.USU_GRUPO;

    this._usuarioservices.ListaPerfiles(area).subscribe(
      (result:any) => { result=result.json();
        this.perfiles = result;
      
      },
      error => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
              console.log(this.errorMessage);
              alert('Error en la petición select2');
          }
      }
    )
  }

  RegistrarUsuario() {

    this._usuarioservices.getAltaUsuario(this.m_usuario).subscribe(
      (result:any) => { result=result.json();
      //console.log(result);
          if (result[0]['ESTADO'] === 'INSERTADO') {
            this.titulo_alerta = 'Registrado!';
            this.respuestas =  result;
            this.pnl_alert_success = true;
            this.pnl_formularioalta = false;
          }
          if (result[0]['ESTADO'] === 'ERROR') {
            alert('NO SE REGISTRO EL USUARIO');
          }
          if (result[0]['ESTADO'] === 'ERROR USUARIO') {
            this.titulo_alerta = 'Error!';
            this.mensaje_alerta = 'Existe el numero de Documento de Identidad.';
            this.pnl_alert_error = true;
          }

      },
      error => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
              //console.log(this.errorMessage);
              this.titulo_alerta = 'Error!';
              this.mensaje_alerta = 'En los campos enviados.';
              this.pnl_alert_error = true;
              this.pnl_formularioalta = false;
              //alert('Error en la petición1');
          }
      }
    );
  }

  ActualizarUsuario() {
    this._usuarioservices.getModificaUsuario(this.m_usuario).subscribe(
      (result:any) => { result=result.json();

          if (result[0]['ESTADO'] === 'MODIFICADO') {
            this.titulo_alerta = 'Actualizacion Correcta!';
            this.respuestas =  result;
            this.pnl_alert_success = true;
            this.pnl_formularioalta = false;
          }
          if (result[0]['ESTADO'] == 'ERROR') {
            alert('NO SE REGISTRO EL USUARIO');
          }
          if (result[0]['ESTADO'] == 'ERROR USUARIO') {
            alert('EXISTE EL ID DE USUARIO!, ');
          }


      },
      error => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
              
              this.titulo_alerta = 'Error!';
              this.mensaje_alerta = 'En los campos enviados.';
              this.pnl_alert_error = true;
              this.pnl_formularioalta = false;
          }
      }
    );
  }

  ActualizarEstadoUsuario(row_registrosbusqueda: any) {

    this.m_usuario.USU_ID = row_registrosbusqueda.US_ID;
    this.m_usuario.IDESTADO = row_registrosbusqueda.IDESTADO;

    
    this._usuarioservices.getModificaEstadoUsuario(this.m_usuario).subscribe(
      (result:any) => { result=result.json();
      
          if (result[0]['ESTADO'] === 'MODIFICADO') {

            if (result[0]['IDESTADO'] === 32 ) {
              this.titulo_alerta = ' Inactivacion del Usuario Correcta!';
            }
            else {
              this.titulo_alerta = 'Activación del Usuario Correcta!';  
            }


            this.respuestas =  result;
            this.pnl_alert_success = true;
            this.pnl_registrosbusqueda = false;
            this.m_usuario = new DatosUsuario("", "", "", "", "", "", "","","");
            this.pnl_formulariobusqueda = false;
            this.pnl_registrosbusqueda = false;
          }
          if (result[0]['ESTADO'] == 'ERROR') {
            alert('NO SE REGISTRO EL USUARIO');
          }
          if (result[0]['ESTADO'] == 'ERROR USUARIO') {
            alert('EXISTE EL ID DE USUARIO!, ');
          }


      },z
      error => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
              console.log(this.errorMessage);
              alert('Error en la petición actualiza estado usuario');
          }
      }
    );
  }

  VolverPanelPrincipal() {
    this.pnl_formulariobusqueda = true;
    this.pnl_formularioalta = false;
    this.pnl_alert_success = false;
    this.pnl_alert_error = false;
    this.m_usuario = new DatosUsuario("", "", "", "", "", "", "","","");
  }
*/

  busquedaUsuario() {
    this.pnl_registrosbusqueda = true;
    this.pnl_alert_success = false;
    this.pnl_alert_error = false;

    var v_user;
    var v_apat;
    var v_amat;
    var v_nom;
    var v_estado;

    if (this.m_usuario.usu_user != "") {
      v_user = this.m_usuario.usu_user;
    } else {
      v_user = "-";
    }
    if (this.m_usuario.usu_app != "") {
      v_apat = this.m_usuario.usu_app;
    } else {
      v_apat = "-";
    }

    if (this.m_usuario.usu_apm != "") {
      v_amat = this.m_usuario.usu_apm;
    } else {
      v_amat = "-";
    }

    if (this.m_usuario.id_estado != "") {
      v_estado = this.m_usuario.id_estado;
    } else {
      v_estado = "-";
    }

    this.BuscaUserxParametro(v_user, v_apat, v_amat, v_nom, v_estado);
  }

  BuscaUserxParametro(
    v_user: string,
    v_apat: string,
    v_amat: string,
    v_nom: string,
    v_ci: string
  ) {
    this._usuarioservices
      .buscauserxparametros(v_user, v_apat, v_amat, v_nom, v_ci)
      .subscribe(
        (response: any) => {
          if (Array.isArray(response)) {
            this.buscauserxparametros = response;
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

  /*
    limpiarFormulario()
    {
      this.m_usuario.USU_USER = "";
      this.m_usuario.USU_ID = "";
      this.m_usuario.USU_NOM = "";
      this.m_usuario.USU_APAT = "";
      this.m_usuario.USU_AMAT = "";
      this.pnl_registrosbusqueda=false;
    }
*/

  configPages() {
    this.pages.length = 0;
    var ini = this.currentPage - 4;
    var fin = this.currentPage + 5;
    //this.cabeceralistahistorico();
    if (ini < 1) {
      ini = 1;
      if (Math.ceil(this.buscauserxparametros.length / this.pageSize) > 10)
        fin = 10;
      else fin = Math.ceil(this.buscauserxparametros.length / this.pageSize);
    } else {
      if (ini >= Math.ceil(this.buscauserxparametros / this.pageSize) - 10) {
        ini = Math.ceil(this.buscauserxparametros / this.pageSize) - 10;
        fin = Math.ceil(this.buscauserxparametros / this.pageSize);
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
