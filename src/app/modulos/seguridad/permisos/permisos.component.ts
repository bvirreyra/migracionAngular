import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { DatosUsuario } from "../usuario/datosusuario";
import { UsuarioService } from "../usuario/usuario.service";

import { DatosRolUsuario } from "./datosrolusuario";
import { PermisosService } from "./permisos.service";

//paginador
import { PaginationInstance } from "ngx-pagination/dist/ngx-pagination.module";

@Component({
  selector: "app-permisos",
  templateUrl: "./permisos.component.html",
  styleUrls: ["./permisos.component.css"],
  providers: [UsuarioService, PermisosService],
})
export class PermisosComponent implements OnInit {
  // variables del componente VolverPanelPrincipal
  public idcon: string;
  public idmod: string;
  public idrol: number;

  public idrolcon: string;
  public usercon: string;

  /*variables control de paneles*/
  public pnl_formulariobusqueda = true;
  public pnl_registrosbusqueda = false;
  public pnl_alert_error = false;
  public pnl_alert_success = false;
  public pnl_alert = false;

  public pnl_formulariobusquedapermiso = false;
  public pnl_registrosbusquedapermiso = false;
  public pnl_crudpermisos = false;
  public pnl_formularioaltapermiso = false;

  // Variables para la cuenta y contraseña del usuario
  public usr: string;
  public pass: string;

  public datospersonales;
  public errorMessage: any;

  /*variables de modelo*/
  public m_usuario: DatosUsuario;
  public m_permisos: DatosRolUsuario;
  public nombre_rol: any;
  public v_fecha_vigencia: any;
  public listapermisos: any;
  public buscauserxparametros: any;

  // variables del componente
  public combo_rol: any;
  public respuestas: any;

  public titulo: string;
  public titulo_alerta: string;
  public mensaje_alerta: string;
  public insertar = false;

  //Paginador
  public currentPage = 0;
  public pageSize = 10;
  public pages = [];
  public config: PaginationInstance = {
    id: "pagusu",
    itemsPerPage: 5,
    currentPage: 1,
  };

  public configPermisos: PaginationInstance = {
    id: "pagpermiso",
    itemsPerPage: 5,
    currentPage: 1,
  };

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _usuarioservices: UsuarioService,
    private _permisosservices: PermisosService
  ) {}

  ngOnInit() {
    this.m_permisos = new DatosRolUsuario("", "", "", "", "");
    this.m_usuario = new DatosUsuario("", "", "", "", "", "", "", "");
  }

  VolverPanelPrincipal() {
    this.pnl_formulariobusqueda = true;
    this.pnl_registrosbusquedapermiso = false;
    this.pnl_crudpermisos = false;
    this.pnl_formularioaltapermiso = false;
    this.pnl_formulariobusquedapermiso = false;
    this.insertar = false;

    this.pnl_alert_success = false;
    this.pnl_alert_error = false;
    this.m_usuario = new DatosUsuario("", "", "", "", "", "", "", "");
  }

  busquedaUsuario() {
    this.pnl_registrosbusqueda = true;
    this.pnl_registrosbusquedapermiso = false;
    this.pnl_alert_success = false;
    this.pnl_alert_error = false;
    this.pnl_crudpermisos = false;

    var v_user;
    var v_apat;
    var v_amat;
    var v_nom;
    var v_ci;

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

    if (this.m_usuario.usu_id != "") {
      v_ci = this.m_usuario.usu_id;
    } else {
      v_ci = "0";
    }

    this.BuscaUserxParametro(v_user, v_apat, v_amat, v_nom, v_ci);
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

  FormularioPermiso(row_registrousuariobusqueda: any) {
    var v_idusuario;
    this.pnl_formulariobusqueda = false;
    this.pnl_registrosbusqueda = false;
    this.pnl_formulariobusquedapermiso = true;

    this.m_permisos.IDUSUARIO = row_registrousuariobusqueda.US_ID;

    v_idusuario = this.m_permisos.IDUSUARIO;

    //console.log(v_idusuario);
    this.BuscaPermisoxParametro(v_idusuario);

    this.pnl_registrosbusquedapermiso = true;
    this.pnl_crudpermisos = true;
  }

  FormularioAltaPermiso() {
    this.m_permisos = new DatosRolUsuario(
      "",
      this.m_permisos.IDUSUARIO,
      "",
      "",
      ""
    );
    this.titulo = "Nuevo Permiso";
    this.pnl_formulariobusqueda = false;
    this.pnl_registrosbusqueda = false;
    this.pnl_formulariobusquedapermiso = false;
    this.pnl_registrosbusquedapermiso = false;
    this.pnl_crudpermisos = false;

    this._permisosservices.ListaRolModulo(this.m_permisos.IDUSUARIO).subscribe(
      (result: any) => {
        
        //console.log(result);
        this.combo_rol = result;
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la petición select");
        }
      }
    );

    this.pnl_formularioaltapermiso = true;
    this.insertar = true;
  }

  FormularioEditaPermiso(row_registropermisobusqueda: any) {
    this.titulo = "Edicion Permiso";
    this.pnl_formularioaltapermiso = true;
    this.pnl_formulariobusqueda = false;
    this.pnl_registrosbusqueda = false;
    this.pnl_registrosbusquedapermiso = false;
    this.pnl_formulariobusquedapermiso = false;

    this.insertar = false;

    this.m_permisos.IDROL = row_registropermisobusqueda.IDROL;
    this.m_permisos.IDUSUARIO = row_registropermisobusqueda.IDUSUARIO;
    this.m_permisos.FECHAVIGENCIA = row_registropermisobusqueda.FECHAVIGENCIA;
    this.m_permisos.FECHAEXPIRACION =
      row_registropermisobusqueda.FECHAEXPIRACION1;
    this.nombre_rol = row_registropermisobusqueda.ROL_NOMBRE;

    //console.log(this.nombre_rol);
    /*console.log(this.m_usuario);*/

    this._permisosservices.ListaRolModulo(this.m_permisos.IDUSUARIO).subscribe(
      (result: any) => {
        
        //console.log(result);
        this.combo_rol = result;
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

  BusquedaPermisos() {
    this.pnl_registrosbusqueda = false;
    this.pnl_alert_success = false;
    this.pnl_alert_error = false;

    var v_idusuario;

    this.BuscaPermisoxParametro(v_idusuario);
  }

  BuscaPermisoxParametro(v_idusuario: string) {
    this._permisosservices.buscapermisosxparametros(v_idusuario).subscribe(
      (response: any) => {
        
        if (Array.isArray(response)) {
          this.listapermisos = response;
          this.respuestas = response;

          //console.log(this.listapermisos);
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

  RegistrarPermiso() {
    this.pnl_formularioaltapermiso = false;
    this.pnl_registrosbusquedapermiso = false;
    this.pnl_formulariobusquedapermiso = false;

    this._permisosservices.getAltaPermiso(this.m_permisos).subscribe(
      (result: any) => {
        
        //console.log(result);
        if (result[0]["ESTADO"] === "INSERTADO") {
          this.titulo_alerta = "Registrado!";
          this.respuestas = result;
          this.pnl_alert_success = true;
          this.pnl_crudpermisos = true;
          this.pnl_formularioaltapermiso = false;
        }
        if (result[0]["ESTADO"] === "ERROR") {
          alert("NO SE REGISTRO EL PERMISO");
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          this.titulo_alerta = "Error!";
          this.mensaje_alerta = "En los campos enviados.";
          this.pnl_alert_error = true;
          this.pnl_crudpermisos == true;
          //alert('Error en la petición1');
        }
      }
    );
  }

  ActualizarPermiso() {
    this.pnl_formularioaltapermiso = false;
    this.pnl_registrosbusquedapermiso = false;
    this.pnl_formulariobusquedapermiso = false;

    this._permisosservices.getModificaPermiso(this.m_permisos).subscribe(
      (result: any) => {
        

        if (result[0]["ESTADO"] === "MODIFICADO") {
          this.titulo_alerta = "Actualizacion Correcta!";
          this.respuestas = result;
          this.pnl_alert_success = true;
          this.pnl_crudpermisos = true;
          this.pnl_formularioaltapermiso = false;
        }
        if (result[0]["ESTADO"] === "ERROR") {
          alert("NO SE REGISTRO EL PERMISO");
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
  }

  ActualizarEstadoPermiso(row_registropermisobusqueda: any) {
    this.m_permisos.IDROL = row_registropermisobusqueda.IDROL;
    this.m_permisos.IDUSUARIO = row_registropermisobusqueda.IDUSUARIO;
    this.m_permisos.IDESTADO = row_registropermisobusqueda.IDESTADO;

    let v_idusuario = this.m_permisos.IDUSUARIO;

    //console.log(this.m_usuario);
    this._permisosservices.getModificaEstadoPermiso(this.m_permisos).subscribe(
      (result: any) => {
        
        //console.log(result);
        if (result[0]["ESTADO"] === "MODIFICADO") {
          if (result[0]["IDESTADO"] === 32) {
            this.titulo_alerta = " Inactivacion del Permiso Correcta!";
          } else {
            this.titulo_alerta = "Activación del Permiso Correcta!";
          }

          this.respuestas = result;
          //this.pnl_alert_success = true;
          this.pnl_registrosbusqueda = false;
          //
          //this.m_permisos = new DatosRolUsuario("", "", "", "", "");
          this.pnl_formulariobusqueda = false;
          this.pnl_registrosbusqueda = false;
          //this.pnl_registrosbusquedapermiso = false;
          //this.pnl_formulariobusquedapermiso = false;
          this.BuscaPermisoxParametro(v_idusuario);
        }
        if (result[0]["ESTADO"] === "ERROR") {
          alert("NO SE REGISTRO EL PERMISO");
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la petición actualiza estado usuario");
        }
      }
    );
  }

  /*Control Formulario */
  limpiarFormulario() {
    this.m_usuario.usu_user = "";
    this.m_usuario.usu_app = "";
    this.m_usuario.usu_apm = "";
    this.m_usuario.usu_id = "";
    this.pnl_registrosbusqueda = false;
  }
}
