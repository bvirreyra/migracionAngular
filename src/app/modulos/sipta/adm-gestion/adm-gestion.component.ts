import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { Globals } from "../../../global";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";
import { SiptaService } from "../../sipta/sipta.service";

declare var $: any;

@Component({
  selector: "app-adm-gestion",
  templateUrl: "./adm-gestion.component.html",
  styleUrls: ["./adm-gestion.component.css"],
})
export class AdmGestionComponent implements OnInit {
  public dtsDatosConexion: any;
  public dtsFechaSrv: any;
  public dtsFechaLiteral: any;
  public dtsHoraSrv: any;

  public m_gestion: any;
  public m_mes_actual: any;

  public errorMessage: string;

  //variables de session y iniciales
  public s_idcon: string;
  public s_idmod: string;
  public s_idrol: number;
  public s_user: string;
  public s_nomuser: string;
  public s_usu_id: string;
  public dts_roles_usuario: any;
  public s_usu_id_sipta: any;

  //variables para el compononete de mensajes
  public prop_msg: string;
  public prop_tipomsg: string;

  public operacion: string;

  public dts_usuarios: any;
  public dts_usuarios_gestion: any;

  public dtsADMgestion: any;
  public IdConfiguracion: string;
  public Gestion: string;
  public HojaRuta: string;
  public direccion: string;
  public IdUsuario: string;
  public FechaInicio: string;
  public FechaFin: string;
  public Estado: string;
  public TiempoReserva: string;
  public GestionSiguiente: string;

  public url: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _sipta: SiptaService,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent,
    private datePipe: DatePipe,
    private globals: Globals
  ) {
    this._route.parent.params.subscribe((parametros) => {
      this.s_idcon = parametros["idcon"];
      this.s_idmod = parametros["idmod"];
    });
    this.url = globals.rutaSrvFronEnd;
  }

  ngOnInit() {
    function falloCallback(error) {
      console.log("Falló con " + error);
    }
    this.DatosConexion()
      .then((dts1) => {
        this.dtsDatosConexion = dts1;
        return this.listarusuariogestion();
      })
      .then((dts2) => {
        this.dts_usuarios_gestion = dts2;
        return this.listarusuario();
      })
      .then((dts3) => {
        this.dts_usuarios = dts3;
        this.ListaADMgestion();
      })
      .catch(falloCallback);
  }

  DatosConexion() {
    return new Promise((resolve, reject) => {
      this._autenticacion
        .getdatosconexion(this.s_idcon, this.s_idmod)
        .subscribe(
          (result: any) => {
            
            if (Array.isArray(result) && result.length > 0) {
              if (result[0]["_idrol"] != "") {
                this.s_idrol = result[0]["_idrol"];
                this.s_user = result[0]["_usu_user"];
                this.s_nomuser = result[0]["_usu_nom_com"];
                this.s_usu_id = result[0]["_usu_id"];
                this.s_usu_id_sipta = result[0]["_usu_id_sipta"];
                resolve(result);
                return result;
              }
            } else {
              this.prop_msg =
                "Error: La conexion no es valida2, contáctese con el área de sistemas";
              this.prop_tipomsg = "danger";
              this._msg.formateoMensaje("modal_danger", this.prop_msg);
              reject(this.prop_msg);
            }
          },
          (error) => {
            this.errorMessage = <any>error;
            if (this.errorMessage != null) {
              console.log(this.errorMessage);
              this.prop_msg =
                "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas1";
              this.prop_tipomsg = "danger";
              this._msg.formateoMensaje("modal_danger", this.prop_msg);
            }
            reject(this.prop_msg);
          }
        );
    });
  }
  listarusuariogestion() {
    return new Promise((resolve, reject) => {
      this._sipta.getListaUsuarioGestion().subscribe((result: any) => {
        
        let usuarios_gestion = result;
        resolve(usuarios_gestion);
      });
    });
  }
  listarusuario() {
    return new Promise((resolve, reject) => {
      this._sipta.getListaUsuario().subscribe((result: any) => {
        
        let usuarios = result.filter((item) => item.IdUnidad == 153);
        resolve(usuarios);
      });
    });
  }
  pre_insercion() {
    this.operacion = "INSERTAR";
    this.IdConfiguracion = "0";
    this.Gestion = this.GestionSiguiente;
    this.HojaRuta = "General";
    this.direccion = "1";
    this.IdUsuario = null;
    this.FechaInicio = this.GestionSiguiente + "-01-01";
    this.FechaFin = this.GestionSiguiente + "-12-31";
    this.Estado = "Actual";
    this.TiempoReserva = "5";

    $("#pnl_Guardarregistros").modal("show");
    this.prop_msg = "Se insertó el registro de manera correcta.";
  }
  pre_edicion(registro: any) {
    this.operacion = "ACTUALIZAR";
    this.IdConfiguracion = registro.IdConfiguracion;
    this.Gestion = registro.Gestion;
    this.HojaRuta = registro.HojaRuta;
    this.direccion = registro.DIR;
    this.IdUsuario = registro.IdUsuario;
    this.FechaInicio = this._fun.transformDateOf_yyyymmdd(registro.FechaInicio);
    this.FechaFin = this._fun.transformDateOf_yyyymmdd(registro.FechaFin);
    this.Estado = registro.Estado;
    this.TiempoReserva = registro.TiempoReserva;

    $("#pnl_Guardarregistros").modal("show");
    this.prop_msg = "Se actualizó el registro de manera correcta.";
  }
  pre_eliminacion(registro: any) {
    this.operacion = "ELIMINAR";
    this.IdConfiguracion = registro.IdConfiguracion;
    this.Gestion = registro.Gestion;

    $("#pnl_Eliminarregistros").modal("show");
    this.prop_msg = "Se terminó la gestión de manera correcta.";
  }
  ListaADMgestion() {
    this.operacion = "LISTAR";
    this.dtsADMgestion = [];
    this._sipta
      .getListaAdmGestion(this._fun.textoNormal(this.operacion))
      .subscribe(
        (result: any) => {
          this.dtsADMgestion = result;
          for (let i = 0; i < result.length; i++) {
            this.dtsADMgestion[i].FechaInicio = result[i].FechaInicio.substring(
              0,
              10
            );
            this.dtsADMgestion[i].FechaFin = result[i].FechaFin.substring(
              0,
              10
            );
            let nombre = this.dts_usuarios_gestion.filter(
              (item) => item.IdUsuario == this.dtsADMgestion[i].IdUsuario
            );
            if (nombre.length > 0) {
              this.dtsADMgestion[i].nombreUsuario =
                nombre[0].NombreCompletoUsuario;
            }
          }
          let gestionSiguiente =
            this.dtsADMgestion[this.dtsADMgestion.length - 1].Gestion;
          this.GestionSiguiente = gestionSiguiente + 1;
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas3";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        }
      );
  }
  registroAdmGestion() {
    if (this.IdUsuario == undefined) {
      this.prop_msg = "Debe ingresar todos los datos.";
      this.prop_tipomsg = "danger";
      this._msg.formateoMensaje("modal_danger", this.prop_msg);
      return;
    }
    if (this.operacion == "INSERTAR") {
      let gestion = this.dtsADMgestion.filter(
        (item) => item.Gestion == this.Gestion
      );
      if (gestion.length > 0) {
        let verifica = gestion.filter((item) => item.Estado == "Actual");
        if (verifica.length > 0) {
          this.prop_msg =
            "Ya existe un registro con la gestion ingresada, verifique por favor";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
          return;
        }
      }
    }
    this._sipta
      .getRegistroAdmGestion(
        this._fun.textoNormal(this.operacion),
        this._fun.textoNormal(this.IdConfiguracion),
        this._fun.textoNormal(this.Gestion),
        this._fun.textoNormal(this.HojaRuta),
        this._fun.textoNormal(this.direccion),
        this._fun.textoNormal(this.IdUsuario),
        this._fun.textoNormal(this.FechaInicio),
        this._fun.textoNormal(this.FechaFin),
        this._fun.textoNormal(this.Estado),
        this._fun.textoNormal(this.TiempoReserva)
      )
      .subscribe(
        (result: any) => {
          
          this.ListaADMgestion();
          $("#pnl_Guardarregistros").modal("hide");
          this.prop_tipomsg = "success";
          this._msg.formateoMensaje("modal_success", this.prop_msg);
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        }
      );
  }
  eliminarAdmGestion() {
    this._sipta
      .getEliminarAdmGestion(
        this._fun.textoNormal(this.operacion),
        this._fun.textoNormal(this.IdConfiguracion),
        this._fun.textoNormal(this.Gestion)
      )
      .subscribe(
        (result: any) => {
          
          this.ListaADMgestion();
          $("#pnl_Eliminarregistros").modal("hide");
          this.prop_tipomsg = "success";
          this._msg.formateoMensaje("modal_success", this.prop_msg);
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        }
      );
  }
}
