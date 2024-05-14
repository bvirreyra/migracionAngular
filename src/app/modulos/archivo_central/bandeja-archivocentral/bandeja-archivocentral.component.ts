import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Globals } from "../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";
import { ArchivocentralService } from "../archivocentral.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-bandeja-archivocentral",
  templateUrl: "./bandeja-archivocentral.component.html",
  styleUrls: ["./bandeja-archivocentral.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    ArchivocentralService,
  ],
})
export class BandejaArchivocentralComponent implements OnInit {
  public cargando: boolean = false;
  /*VARIABLES PARA MASCARAS */
  public mask_numerodecimal: any;
  public mask_fecha: any;
  public mask_numero: any;
  public mask_gestion: any;
  public mask_cite: any;

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
  public dts_roles_usuario: any;
  public s_usu_id_sipta: any;
  public s_usu_id_sispre: any;
  public s_ci_user: any;

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
  //VARIABLES DEL COMPONENTE

  public pnl_bandejaprincipal = false;
  public pnl_archivotecnico = false;
  public pnl_archivofinanciero = false;
  public pnl_archivojuridico = false;
  public pnl_detalleArchivo = false;

  //DTS
  public dts_registro: any;
  cabecera: {
    idCabecera: any;
    fidProyecto: any;
    fidSgp: any;
    codDepartamento: any;
    codProvincia: any;
    codMunicipio: any;
    detalleContenido: any;
    tipoArchivo: any;
    region: any;
    gestion: any;
    usrRegistro: any;
    fechaRegistro: any;
    idEstado: any;
    operacion: any;
  };

  //VARIABLES PARA MANEJO DE OBJETOS
  public region = "CENTRO";
  public tipoArchivo: any;
  public mensaje;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _archivocentral: ArchivocentralService,

    private globals: Globals,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent,
    private datePipe: DatePipe,
    private base64: ImgBase64Globals
  ) {
    this._route.parent.params.subscribe((parametros) => {
      this.s_idcon = parametros["idcon"];
      this.s_idmod = parametros["idmod"];
    });
    this.url = globals.rutaSrvFronEnd;
    this.s_imgLogo = base64.logocabecera;
    this.url_reporte = globals.rutaSrvReportes;
    this.cabecera = {
      idCabecera: null,
      fidProyecto: null,
      fidSgp: null,
      codDepartamento: null,
      codProvincia: null,
      codMunicipio: null,
      detalleContenido: null,
      tipoArchivo: null,
      region: null,
      gestion: null,
      usrRegistro: null,
      fechaRegistro: null,
      idEstado: null,
      operacion: null,
    };
  }

  ngOnInit() {
    //sessionStorage.clear();
    console.log('ingresando bandeja AC',this.tipoArchivo);
    
    this.pnl_bandejaprincipal = true;

    function falloCallback(error) {
      console.log("Falló con " + error);
    }

    this.DatosConexion()
      .then((dts1) => {
        this.dtsDatosConexion = dts1;
        return this.FechaServidor();
      })
      .then((dts2) => {
        this.dtsFechaSrv = dts2[0]["fechasrv"];
        this.dtsHoraSrv = this.transformHora(this.dtsFechaSrv);
        this.m_gestion = this.dtsFechaSrv.substr(0, 4);
        this.m_mes_actual = this.dtsFechaSrv.substr(5, 2);
        return this.FechaLiteral(dts2[0]["fechasrv"]);
      })
      .then((dts3) => {
        this.dtsFechaLiteral = dts3;
      })
      .then((dts) => {
        return this.RolesAsignados(this.s_usu_id);
      })
      .then((dts) => {
        this.dts_roles_usuario = dts;
        console.log("roles", this.dts_roles_usuario);
        this.paneles("VER_LISTAPROYECTOS");
        // this.GuardarLocalStorage();
      })
      .catch(falloCallback);
  }
  /*******************************************************************************/
  /*DATOS INICIALES
  /*******************************************************************************/
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
                this.s_usu_id_sispre = result[0]["_usu_id_sispre"];
                this.s_ci_user = result[0]["_usu_ci"];
                resolve(result);
                return result;
              }
            } else {
              this.prop_msg =
                "Error: La conexion no es valida, contáctese con el área de sistemas";
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
                "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
              this.prop_tipomsg = "danger";
              this._msg.formateoMensaje("modal_danger", this.prop_msg);
            }
            reject(this.prop_msg);
          }
        );
    });
  }
  RolesAsignados(usu_id) {
    return new Promise((resolve, reject) => {
      this._autenticacion.rolesasignados(usu_id).subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            resolve(result);
          } else {
            this.prop_msg =
              "Error: La conexion no es valida, contáctese con el área de sistemas";
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
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
          reject(this.prop_msg);
        }
      );
    });
  }
  FechaServidor() {
    return new Promise((resolve, reject) => {
      this._autenticacion.getfechaservidor().subscribe(
        (result: any) => {
          if (result[0]["fechasrv"] != "") {
            resolve(result);
            return result;
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos ";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  transformHora(date) {
    return this.datePipe.transform(date, "HH:mm:ss");
    //whatever format you need.
  }
  transformAnio(date) {
    return this.datePipe.transform(date, "YYYY");
    //whatever format you need.
  }
  HoraServidor() {
    return new Promise((resolve, reject) => {
      this._autenticacion.gethoraservidor().subscribe(
        (result: any) => {
          if (result[0]["HORA"] != "") {
            var hora = this.transformHora(result[0]["HORA"]);
            resolve(hora);
            return hora;
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos ";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  manejoRoles() {
    var lineas = this.dts_roles_usuario.length;
    var datos = this.dts_roles_usuario;
    let dpto = "";
  }

  FechaLiteral(f) {
    return this._fun.FechaLiteral(f);
  }
  paneles(string, dts?) {
    this.dts_registro = dts;
    if (string == "PANEL_PRINCIPAL") {
      this.pnl_archivotecnico = false;
      this.pnl_archivofinanciero = false;
      this.pnl_archivojuridico = false;
      this.pnl_bandejaprincipal = true;
      this.pnl_detalleArchivo = false;
    }
    if (string == "ARCHIVO FINANCIERO") {
      this.pnl_archivotecnico = false;
      this.pnl_archivofinanciero = true;
      this.pnl_archivojuridico = false;
      this.pnl_bandejaprincipal = false;
      this.pnl_detalleArchivo = false;
      this.tipoArchivo = string;
    }
    if (string == "ARCHIVO TECNICO") {
      this.pnl_archivotecnico = true;
      this.pnl_archivofinanciero = false;
      this.pnl_archivojuridico = false;
      this.pnl_bandejaprincipal = false;
      this.pnl_detalleArchivo = false;
      this.tipoArchivo = string;
    }
    if (string == "ARCHIVO JURIDICO") {
      this.pnl_archivotecnico = false;
      this.pnl_archivofinanciero = false;
      this.pnl_archivojuridico = true;
      this.pnl_bandejaprincipal = false;
      this.pnl_detalleArchivo = false;
      this.tipoArchivo = string;
    }
    if (string == "CABECERA_ARCHIVO") {
      this.pnl_archivotecnico = false;
      this.pnl_archivofinanciero = false;
      this.pnl_archivojuridico = false;
      this.pnl_bandejaprincipal = false;
      this.pnl_detalleArchivo = true;
      this.region = dts;
    }
  }
  GuardarLocalStorage() {
    let dts_con = {
      s_idrol: this.s_idrol,
      s_user: this.s_user,
      s_nomuser: this.s_nomuser,
      s_usu_id: this.s_usu_id_sispre,
      s_usu_id_sipta: this.s_usu_id_sipta,
      s_usu_id_sispre: this.s_usu_id_sispre,
      s_ci_user: this.s_ci_user,
    };
    let dts_rol = this.dts_roles_usuario;

    localStorage.setItem("dts_con", JSON.stringify(dts_con));
    localStorage.setItem("dts_rol", JSON.stringify(dts_rol));
  }

  receiveMessage($event) {
    this.paneles($event);
  }
}
