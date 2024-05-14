import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FuncionesComponent } from '@funciones/funciones/funciones.component';
import { AutenticacionService } from '../../seguridad/autenticacion.service';
import { MensajesComponent } from '../../seguridad/mensajes/mensajes.component';

@Component({
  selector: 'app-bandeja-almacen',
  templateUrl: './bandeja-almacen.component.html',
  styleUrls: ['./bandeja-almacen.component.css'],
  providers: [
    AutenticacionService,
  ],
})
export class BandejaAlmacenComponent implements OnInit {

  //variables de session y iniciales
  public s_idcon: string;
  public s_idmod: string;
  public s_idrol: number;
  public s_user: string;
  public s_nomuser: string;
  public s_usu_id: string;
  public dts_roles_usuario: any;
  public s_usu_id_sipta: any;
  public s_usu_id_sispre: any;
  public s_ci_user: any;
  public s_usu_area:any;

  //variables para el compononete de mensajes
  public prop_msg: string;
  public prop_tipomsg: string;
  public errorMessage: string;

  //negocio
  public administrador:boolean=false;
  public conStorage:boolean=false;
  public dts_rolesc:any;

  constructor(
    private _route: ActivatedRoute,
    private _autenticacion: AutenticacionService,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent,
  ) { 
      this._route.parent.params.subscribe(parametros => {
      this.s_idcon = parametros['idcon'];
      this.s_idmod = parametros['idmod'];
      })
    }

  ngOnInit() {
    // const datos = JSON.parse(localStorage.getItem('dts_con'));
    // console.log(datos);
    // this.idUsuario = datos.s_usu_id;
    this.DatosConexion();
  }

  DatosConexion() {
    return new Promise((resolve, reject) => {
      console.log(this.s_idcon, this.s_idmod);
      this._autenticacion
        .getdatosconexion(this.s_idcon, this.s_idmod)
        .subscribe(
          (result: any) => {
            if (Array.isArray(result) && result.length > 0) {
              console.log('datos concex',result);
              if (result[0]["_idrol"] != "") {
                this.s_idrol = result[0]["_idrol"];
                this.s_user = result[0]["_usu_user"];
                this.s_nomuser = result[0]["_usu_nom_com"];
                this.s_usu_id = result[0]["_usu_id"];
                this.s_usu_id_sipta = result[0]["_usu_id_sipta"];
                this.s_usu_id_sispre = result[0]["_usu_id_sispre"];
                this.s_ci_user = result[0]["_usu_ci"];
                this.s_usu_area = result[0]["_usu_area"];
                this.GuardarLocalStorage();
                this.RolesAsignados();
                resolve(result);
                return result;
              }
            } else {
              this.prop_msg ="Error: La conexion no es valida, contáctese con el área de sistemas";
              this.prop_tipomsg = "danger";
              this._msg.formateoMensaje("modal_danger", this.prop_msg);
              reject(this.prop_msg);
            }
          },
          (error) => {
            this.errorMessage = <any>error;
            if (this.errorMessage != null) {
              console.log(this.errorMessage);
              this.prop_msg = "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
              this.prop_tipomsg = "danger";
              this._msg.formateoMensaje("modal_danger", this.prop_msg);
            }
            reject(this.prop_msg);
          }
        );
    });
  }

  RolesAsignados() {
    this._autenticacion.rolesasignados(this.s_usu_id).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_rolesc = this._fun.RemplazaNullArray(result).map(el => el.idrol);
          // this.dts_rolesb.includes(72) ? this.idAdmin = this.idUsuario : this.idAdmin = null;
          if (this.dts_rolesc.includes(2) || this.dts_rolesc.includes(73)) this.administrador = true;
        } else {
          console.log('error al obtener roles',result);
        }
      },
      (error) => {
        console.log('error conexion',error);
      }
    );
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
      s_usu_area:this.s_usu_area,
    };
    let dts_rol = this.dts_roles_usuario;

    localStorage.setItem("dts_con", JSON.stringify(dts_con));
    localStorage.setItem("dts_rol", JSON.stringify(dts_rol));
    this.conStorage = true;
  }

}
