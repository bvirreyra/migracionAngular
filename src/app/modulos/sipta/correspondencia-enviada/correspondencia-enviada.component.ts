import { Component, OnInit } from "@angular/core";
//import OlMap from 'ol/Map';
//import OlXYZ from 'ol/source/XYZ';
//import OlTileLayer from 'ol/layer/Tile';
//import OlView from 'ol/View';

import { DatePipe } from "@angular/common";
import { Globals } from "../../../global";

import { ActivatedRoute, Router } from "@angular/router";

/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";
import { SiptaService } from "../../sipta/sipta.service";
//import { isArray } from 'util';
//import { isNgTemplate } from '@angular/compiler';

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-correspondencia-enviada",
  templateUrl: "./correspondencia-enviada.component.html",
  styleUrls: ["./correspondencia-enviada.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SiptaService,
  ],
})
export class CorrespondenciaEnviadaComponent implements OnInit {
  /*VARIABLES PARA MASCARAS */
  public mask_numerodecimal: any;
  public mask_fecha: any;
  public mask_numero: any;
  public mask_gestion: any;

  public cargando: boolean = false;

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
  public s_usu_id_sipta: any;
  public nombre_usuario: any;

  public dts_roles_usuario: any;

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

  public m_tipocorrespondencia: any;
  public m_titulo: any;
  public dts_correspondenciaenviada: any;

  public vbtn_bitacora = false;

  public m_nrohojaderuta: any;

  public mensajePRueba: string = "desde correspondencia enviada";

  subscription: any;

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
    if (this.getUrlVars()["tipo"] == undefined) {
      this.m_tipocorrespondencia = "CORRESPONDENCIA_ENVIADA";
    } else {
      this.m_tipocorrespondencia = this.getUrlVars()["tipo"];
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
        return this.RolesAsignados(this.dtsDatosConexion[0]._usu_id);
      })
      .then((dts) => {
        this.dts_roles_usuario = dts;
        if (this.m_tipocorrespondencia == "CORRESPONDENCIA_ENVIADA") {
          this.ListaCorrespondenciaEnviada();
        }
        if (this.m_tipocorrespondencia == "PROVEIDOS_ENVIADOS") {
          this.ListaProveidosEnviados();
        }
        if (this.m_tipocorrespondencia == "CORRESPONDENCIA_TERMINADA") {
          this.ListaCorrespondenciaTerminada();
        }
      })
      .then((dts) => {
        this.manejoRoles();
        //this.dts_Documentos = dts;
        //this.paneles('VER_INICIO');
      })
      .catch(falloCallback);

    function falloCallback(error) {
      console.log("Falló con " + error);
    }
  }
  /*obteniendo los datos de la url*/
  getUrlVars() {
    var vars = [],
      hash;
    var hashes = window.location.href
      .slice(window.location.href.indexOf("?") + 1)
      .split("&");
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split("=");
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  }

  manejoRoles() {
    var lineas = this.dts_roles_usuario.length;
    var datos = this.dts_roles_usuario;
    for (var i = 0; i < lineas; i++) {
      var rol = datos[i].idrol;
      if (rol == 16 || rol == 3) {
        // rol 16 bitacora 3 adm sipta
        this.vbtn_bitacora = true;
      }
    }
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
                this.nombre_usuario = this.s_nomuser;
                //console.log(this.s_usu_id_sipta);
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
          
          //console.log(result);
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
  transformFecha(date) {
    return this.datePipe.transform(date, "dd/MM/yyyy");
    //whatever format you need.
  }
  FechaLiteral(f) {
    return this._fun.FechaLiteral(f);
  }
  paneles(string) {
    if (string == "VER_INICIO") {
      //this.limpiar();
      $("#pnl_correspondencia").show();
      $("#pnl_FormularioCorrespondencia").hide();
      $("#pnl_proveidos").hide();
      $("#pnl_nuevoproveido").hide();
      $("#pnl_anexos").hide();
      $("#pnlHistorialProveidos").hide();
      setTimeout(() => {}, 5);
      $("#pnlBotonesRecepcion").hide();
    }
    if (string == "VER_CORRESPONDENCIA") {
      //this.limpiar();
      $("#pnl_correspondencia").hide();
      $("#pnl_FormularioCorrespondencia").show();
      $("#pnl_proveidos").show();
      $("#pnl_nuevoproveido").hide();
      $("#pnl_anexos").hide();
      $("#pnlBotonesRecepcion").show();
    }
  }
  ListaCorrespondenciaEnviada() {
    this.cargando = true;
    this._sipta
      .getListaCorrespondenciaEnviada(this.s_usu_id, this.m_gestion)
      .subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            this.m_titulo = "CORRESPONDENCIA ENVIADA";
            this.dts_correspondenciaenviada =
              this._fun.RemplazaNullArray(result);
            this._fun.limpiatabla(".dt-correspondenciaenviada");
            setTimeout(() => {
              let confiTable = this._fun.CONFIGURACION_TABLA_V4(
                [10, 20, 50, 100, 150, 200],
                false,
                50,
                0,
                "desc"
              );
              var table = $(".dt-correspondenciaenviada").DataTable(confiTable);
              this._fun.selectTable(table, [4, 5]);
              this._fun.inputTable(table, [0, 1, 2, 6, 7]);
            }, 10);
          } else {
            this._msg.formateoMensaje("modal_warning", "No existen registros");
            this.dts_correspondenciaenviada = [];
          }
          this.cargando = false;
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage)
            this._msg.formateoMensaje(
              "modal_danger",
              "Error: " + this.errorMessage
            );
          this.cargando = false;
        }
      );
  }
  ListaProveidosEnviados() {
    this.cargando = true;
    this._sipta
      .getListaProveidosEnviados(this.s_usu_id, this.m_gestion)
      .subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            this.dts_correspondenciaenviada =
              this._fun.RemplazaNullArray(result);
            this.m_titulo = "PROVEIDOS ENVIADOS";
            this._fun.limpiatabla(".dt-correspondenciaenviada");
            setTimeout(() => {
              let confiTable = this._fun.CONFIGURACION_TABLA_V4(
                [10, 20, 50, 100, 150, 200],
                false,
                50,
                0,
                "desc"
              );
              var table = $(".dt-correspondenciaenviada").DataTable(confiTable);
              this._fun.selectTable(table, [4, 5]);
              this._fun.inputTable(table, [0, 1, 2, 6, 7]);
            }, 10);
          } else {
            this._msg.formateoMensaje("modal_warning", "No existen registros");
            this.dts_correspondenciaenviada = [];
          }
          this.cargando = false;
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage)
            this._msg.formateoMensaje(
              "modal_danger",
              "Error: " + this.errorMessage
            );
          this.cargando = false;
        }
      );
  }
  ListaCorrespondenciaTerminada() {
    this.cargando = true;
    this._sipta
      .getListaCorrespondenciaTerminada(this.s_usu_id, this.m_gestion)
      .subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            this.dts_correspondenciaenviada =
              this._fun.RemplazaNullArray(result);
            this.m_titulo = "CORRESPONDENCIA TERMINADA";
            this._fun.limpiatabla(".dt-correspondenciaenviada");
            setTimeout(() => {
              let confiTable = this._fun.CONFIGURACION_TABLA_V4(
                [10, 20, 50, 100, 150, 200],
                false,
                50,
                0,
                "desc"
              );
              var table = $(".dt-correspondenciaenviada").DataTable(confiTable);
              this._fun.selectTable(table, [4, 5]);
              this._fun.inputTable(table, [0, 1, 2, 6, 7]);
            }, 10);
          } else {
            this._msg.formateoMensaje("modal_warning", "No existen registros");
            this.dts_correspondenciaenviada = [];
          }
          this.cargando = false;
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage)
            this._msg.formateoMensaje(
              "modal_danger",
              "Error: " + this.errorMessage
            );
          this.cargando = false;
        }
      );
  }
  VerBandeja() {
    let v_ruta = "sipta";
    let v_modulo = "3_proveido";
    this._router.navigate([
      "./" + v_ruta + "/" + this.s_idcon + "/" + this.s_idmod + "/" + v_modulo,
    ]);
  }

  generarReporte(data: any, tipo: string) {
    this.cargando = true;
    console.log("generando reporte", data);
    let nombre = `HR_${data.numero}_${data.gestion}`;
    let url = "3_reportesCorrespondencia/";
    const enviados = [];
    let pagina: string;
    if (tipo === "02") url = "3_reporteProveido/";
    if (tipo === "03") {
      pagina = prompt("Introduzca número página", "2");
      //if(!pagina || Number(pagina)===NaN || Number(pagina)<0 || Number(pagina)>5 ){
      if (!pagina || !Number(pagina) || Number(pagina) < 0) {
        alert("Debe insertar solo números validos");
        this.cargando = false;
        return true;
      }
      nombre = `HR_${data.numero}_${data.gestion}_${pagina}`;
      url = "3_reportePaginaExtra/";
      for (let index = 6; index < 13; index++) {
        enviados.push({
          ["n" + (index - 5)]: index + 7 * (Number(pagina) - 2),
        });
      }
      const enes = Object.assign(enviados);
    }
    const miData = {
      tipoReporte: tipo,
      numero: data.numero,
      gestion: data.gestionhr,
      url,
      pagina,
    };
    enviados.forEach((el) => {
      miData[Object.keys(el)[0]] = Object.values(el)[0];
    });
    this._sipta.reportesCorrespondencia(miData).subscribe(
      (result: any) => {
        // 
        //console.log(result);
        const url = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${nombre}.pdf`);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        this.cargando = false;
      },
      (error) => {
        this.cargando = false;
        this.errorMessage = <any>error;
        if (this.errorMessage != null)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage,
            10
          );
      }
    );
  }
}
