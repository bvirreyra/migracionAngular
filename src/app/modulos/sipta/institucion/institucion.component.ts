import { Component, OnInit } from "@angular/core";
import OlTileLayer from "ol/layer/Tile";
import OlMap from "ol/Map";
import OlXYZ from "ol/source/XYZ";
import OlView from "ol/View";

import { DatePipe } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import Inputmask from "inputmask";
import { Globals } from "../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";
import { SiptaService } from "../../sipta/sipta.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-institucion",
  templateUrl: "./institucion.component.html",
  styleUrls: ["./institucion.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SiptaService,
  ],
})
export class InstitucionComponent implements OnInit {
  map: OlMap;
  source: OlXYZ;
  layer: OlTileLayer;
  view: OlView;

  mapId: string;

  public title: any;
  public lat: any;
  public lng: any;
  public locations: any;
  public features = [];
  // map;

  vectorSource;
  vectorLayer;
  rasterLayer;
  public estilo: any;

  /*VARIABLES PARA MASCARAS */
  public mask_numerodecimal: any;
  public mask_fecha: any;
  public mask_numero: any;
  public mask_gestion: any;

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

  //variables del componente

  public pnl_formulario: false;
  public dts_institucion: any;
  public m_estadoinstitucion: any;
  public m_nombreinstitucion: any;
  public m_idinstitucion: any;
  public inputIdInstitucion: any;
  public pnlCargo = false;
  public datoComunicar: string;
  public datoComunicarPadre: string;
  public message: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _sipta: SiptaService,

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
  }

  ngOnInit() {
    this.paneles("VER_GRIDVIEW");
    this.ListaInstitucion();
    function falloCallback(error) {
      console.log("Falló con " + error);
    }
    this.mask_numerodecimal = new Inputmask("9{1,9}.9{1,2}");
    this.mask_fecha = new Inputmask("9{1,2}/9{1,2}/9{1,4}");
    this.mask_numero = new Inputmask("9{1,9}");
    this.mask_gestion = new Inputmask("9999");

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
        return this.RolesAsignados(this.dtsDatosConexion[0]._usu_id);
      })
      .then((dts) => {
        this.dts_roles_usuario = dts;
        //this.manejoRoles();
      })
      .catch(falloCallback);
  }
  paneles(string) {
    if (string == "NUEVA_INSTITUCION") {
      this.limpiar();
      $("#pnl_formularioinstitucion").show();
      $("#pnl_gridviewinstitucion").hide();
      $("#pnl_edicion").hide();
      $("#btnInsertar").show();
      $("#btnActualizar").hide();
    }
    if (string == "VER_GRIDVIEW") {
      $("#pnl_formularioinstitucion").hide();
      $("#pnl_gridviewinstitucion").show();
    }
    if (string == "EDITAR_FORMULARIO") {
      $("#pnl_formularioinstitucion").show();
      $("#pnl_gridviewinstitucion").hide();
      $("#pnl_edicion").show();
      $("#btnInsertar").hide();
      $("#btnActualizar").show();
    }
    if (string == "ENVIO_FORMULARIO_CARGO") {
      $("#pnl_formularioinstitucion").hide();
      $("#pnl_gridviewinstitucion").hide();
      $("#pnl_edicion").hide();
      $("#btnInsertar").hide();
      $("#btnActualizar").hide();
      $("#pnl_gridviewcargo").show();
      this.pnlCargo = true;
    }
  }
  limpiar() {
    this.m_nombreinstitucion = "";
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
  RolesAsignados(usu_id) {
    return new Promise((resolve, reject) => {
      this._autenticacion.rolesasignados(usu_id).subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            resolve(result);
          } else {
            this.prop_msg =
              "Error: La conexion no es valida1, contáctese con el área de sistemas";
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
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas2";
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
  FechaLiteral(f) {
    return this._fun.FechaLiteral(f);
  }
  ListaInstitucion() {
    this._sipta.getListaInstitucion().subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_institucion = this._fun.RemplazaNullArray(result);
          this._fun.limpiatabla(".dt-institucion");
          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V3(
              [10, 20, 50],
              false
            );
            var table = $(".dt-institucion").DataTable(confiTable);
            this._fun.inputTable(table, [1]);
            this._fun.selectTable(table, [2]);
          }, 20);
        } else {
          this.prop_msg = "Alerta: No existen registros";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
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
  editarInstitucionPre(dts) {
    this.paneles("EDITAR_FORMULARIO");
    this.m_nombreinstitucion = dts.Nombre;
    this.m_estadoinstitucion = dts.Estado;
    this.m_idinstitucion = dts.IdInstitucion;
    //console.log(this.m_idinstitucion);
  }
  insertarInstitucion() {
    if (
      this.m_nombreinstitucion != undefined &&
      this.m_nombreinstitucion.length > 0
    ) {
      this._sipta.getInsertarInstitucion(this.m_nombreinstitucion).subscribe(
        (result: any) => {
          
          if (result[0]["ACCION"] == "INSTITUCION DUPLICADA") {
            this.prop_msg = "Error: Nombre de Institucion Duplicada";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          } else {
            this.paneles("VER_GRIDVIEW");
            this.ListaInstitucion();
          }
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
    } else {
      this.prop_msg = "Error: Debe ingresar el Nombre";
      this.prop_tipomsg = "danger";
      this._msg.formateoMensaje("modal_danger", this.prop_msg);
    }
  }
  editarInstitucion() {
    this._sipta
      .getEditarInstitucion(
        this.m_idinstitucion,
        this.m_nombreinstitucion,
        this.m_estadoinstitucion
      )
      .subscribe(
        (result: any) => {
          
          if (result[0]["ACCION"] == "INSTITUCION DUPLICADA") {
            this.prop_msg = "Error: Nombre de Institucion Duplicada";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          } else {
            this.paneles("VER_GRIDVIEW");
            this.ListaInstitucion();
          }
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
  envio_cargoPre(dts) {
    this.paneles("ENVIO_FORMULARIO_CARGO");
    this.m_idinstitucion = dts.IdInstitucion;
    this.inputIdInstitucion = this.m_idinstitucion;
    //console.log(this.inputIdInstitucion);
  }
  envio_estado(dts) {
    this.m_idinstitucion = dts.IdInstitucion;
    this.m_estadoinstitucion = dts.Estado;
    if (this.m_estadoinstitucion == "Activo") {
      this.m_estadoinstitucion = "Inactivo";
    } else {
      this.m_estadoinstitucion = "Activo";
    }
    this._sipta
      .getEnvioEstado(this.m_idinstitucion, this.m_estadoinstitucion)
      .subscribe((result: any) => {
        
        if (result[0]["ACCION"] == "ESTADO MODIFICACO") {
          this.prop_msg = "Estado Modificado";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
          this.ListaInstitucion();
        }
      });
  }
  receiveMessage($event) {
    this.message = $event;
  }
}
