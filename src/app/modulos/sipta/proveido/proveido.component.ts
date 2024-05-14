import { Component, Input, OnInit } from "@angular/core";
//import OlMap from 'ol/Map';
//import OlXYZ from 'ol/source/XYZ';
//import OlTileLayer from 'ol/layer/Tile';
//import OlView from 'ol/View';

import { DatePipe } from "@angular/common";
import Inputmask from "inputmask";
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
  selector: "app-proveido",
  templateUrl: "./proveido.component.html",
  styleUrls: ["./proveido.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SiptaService,
  ],
})
export class ProveidoComponent implements OnInit {
  @Input("inputIdInstitucion") id_institucion: string;

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
  public dts_correspondencia: any;
  public dts_proveido: any;
  public usuario_sipta: any;
  public s_usuario_sipta: any;
  public m_idcorrespondencia: any;
  public m_hoja_ruta: any;
  public m_cite: any;
  public m_referencia: any;
  public m_fecha: any;
  public m_hora: any;
  public m_tipo: any;
  public m_estado: any;
  public m_remitente: any;
  public m_destinatario: any;
  public m_para: any;
  public m_anexo: any;
  public m_observacion: any;
  public m_estadosituacion: any;
  public m_estadorespuesta: any;
  public m_estadorecibido: any;
  public dts_editarCorrespondencia: any;
  public s_usu_id_sipta: any;
  public dts_Anexo: any;
  public nombre_usuario: any;
  public dts_usuario: any;
  public dtsUsuarioFiltrado: any;
  public m_prov_idreceptor: any;
  public m_prov_para: any;
  public dts_item: any;
  public m_item: any;
  public m_contenido: any;
  public dts_proveidoUltimo: any;
  public m_ContenidoAnterior: any;
  public m_idProveidoAnterior: any;
  public m_IndiceProveido: any;
  public dts_ProveidoNuevo: any;
  public sumaIndiceProveido: any;
  public dts_Documentos: any;
  public m_descripcion: any;
  public dts_NuevoAnexo: any;
  public m_conproveido: any;
  public m_tiempo: any;
  public dts_updaterecibido: any;
  public m_tipodocumentohr: any;
  public m_plazodias: any;
  public m_idanexo: any;
  public m_tipocabeceraproveido: any;
  public m_idproveido: any;
  public dtsListaHistorialProveidos: any;
  public m_respuesta: any;
  public m_descripcionterminado: any;
  public m_auxDestinatario: any;

  public controlClick: number = 0;

  public tipoCorrespondencia: any;

  //flujo
  public id_proyectFlujo: any;
  public pnl_Flujo = false;
  public s_usu_id_sispre: any;
  public s_ci_user: any;
  public s_usu_area: any;
  public tipoLista: any;
  public modoConsulta = true;
  public dts_realcionPHR: any;

  fgestion: number;
  fhr: number;
  elIdCorrespondencia: number;
  elidProveido: number;
  //////////////////////////////
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
    sessionStorage.clear();
    this.m_respuesta = "";
    this.dts_Anexo = [];
    this.m_IndiceProveido = 0;
    this.m_idProveidoAnterior = 0;
    this.m_tiempo = 0;
    this.m_auxDestinatario = 0;

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
        return this.listarDocumentos();
      })
      .then((dts) => {
        this.dts_Documentos = this._fun
          .RemplazaNullArray(dts)
          .sort(
            (a, b) => a.codigodetalleclasificador - b.codigodetalleclasificador
          );
        this.paneles("VER_INICIO");
        this.GuardarLocalStorage();
      })
      .catch(falloCallback);
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
      s_usu_area: this.s_usu_area,
    };
    let dts_rol = this.dts_roles_usuario;

    localStorage.setItem("dts_con", JSON.stringify(dts_con));
    localStorage.setItem("dts_rol", JSON.stringify(dts_rol));
  }
  paneles(string, dts?) {
    if (string == "VER_INICIO") {
      //this.limpiar();
      $("#pnl_correspondencia").show();
      $("#pnl_FormularioCorrespondencia").hide();
      $("#pnl_proveidos").hide();
      $("#pnl_nuevoproveido").hide();
      $("#pnl_anexos").hide();
      $("#pnlHistorialProveidos").hide();
      setTimeout(() => {
        this.Listacorrespondencia();
      }, 5);
      $("#pnlBotonesRecepcion").hide();
      this.dts_Anexo = [];
      this.m_IndiceProveido = 0;
      this.m_idProveidoAnterior = 0;
      this.m_tiempo = 0;
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
    if (string == "NUEVO_PROVEIDO") {
      this.listarusuario().then((dts) => {
        //this.dts_usuario = dts;
        this.BusquedaUsuario("");
      });
      this.limpiar_nuevoProveido();
      $("#pnl_nuevoproveido").show();
      $("#pnl_correspondencia").hide();
      $("#pnl_FormularioCorrespondencia").hide();
      $("#pnl_proveidos").hide();
      $("#pnl_anexos").hide();
      $("#pnlBotonesRecepcion").hide();
    }
    if (string == "GUARDAR_NUEVOPROVEIDO") {
      $("#pnl_nuevoproveido").hide();
      $("#pnl_correspondencia").hide();
      $("#pnl_FormularioCorrespondencia").hide();
      $("#pnl_proveidos").hide();
      $("#pnl_Guardarregistros").modal("hide");
      $("#pnl_anexos").show();
      $("#btnInsertarAnexo").show();
      $("#btnModificarAnexo").hide();
    }
    if (string == "NUEVO_ANEXO") {
      $("#btnModificarAnexo").hide();
      $("#btnInsertarAnexo").show();
    }
    if (string == "EDITAR_ANEXO") {
      $("#btnModificarAnexo").show();
      $("#btnInsertarAnexo").hide();
    }
    if (string == "ELIMINAR_ANEXO") {
      $("#btnModificarAnexo").hide();
      $("#btnInsertarAnexo").show();
      //$('#pnl_cargo').hide();
    }

    if (string == "ANEXO_FLUJO") {
      this.pnl_Flujo = true;
      if (this.s_usu_area === "UNIDAD TECNICA") {
        this.tipoLista = "TECNICA";
        this.modoConsulta = false;
      }
      if (this.s_usu_area === "UNIDAD JURIDICA") {
        this.tipoLista = "JURIDICA";
        this.modoConsulta = false;
      }
      if (this.s_usu_area === "UNIDAD ADMINISTRATIVA FINANCIERA") {
        this.tipoLista = "FINANCIERA";
        this.modoConsulta = false;
      }
      this.id_proyectFlujo = dts.flujo;
      this.fgestion = new Date(dts.fecha).getFullYear();
      this.fhr = dts.numero;
      this.elIdCorrespondencia = dts.id_correspondencia;
      this.elidProveido = dts.id_proveido;
      setTimeout(() => {
        $("#pnl_Flujo").modal("show");
        console.log("ANEXO FLUJO", dts);
      }, 10);
    }
    if (string == "CERRAR_FLUJO") {
      $("#pnl_Flujo").modal("hide");
      this.pnl_Flujo = false;
    }
  }
  limpiar_nuevoProveido() {
    this.m_para = "";
    this.m_tiempo = 0;
    this.m_item = "";
    this.m_contenido = "";
    this.dts_Anexo = [];
  }
  volverpanelinicio() {
    // this._fun.limpiatabla('.dt-proveido')
    // this._fun.limpiatabla('.dtsListaHistorialProveidos')
    // this._fun.limpiatabla('.dt-nuevoanexo')
    this.paneles("VER_INICIO");
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
                this.s_usu_area = result[0]["_usu_area"];
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
            if (this.errorMessage)
              this._msg.formateoMensaje(
                "modal_danger",
                "Error: " + this.errorMessage
              );
            reject(this.errorMessage);
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
          if (this.errorMessage)
            this._msg.formateoMensaje(
              "modal_danger",
              "Error: " + this.errorMessage
            );
          reject(this.errorMessage);
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
          if (this.errorMessage)
            this._msg.formateoMensaje(
              "modal_danger",
              "Error: " + this.errorMessage
            );
          reject(this.errorMessage);
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
  Listacorrespondencia() {
    this.controlClick = 0;
    console.log("iniciando");
    this._sipta.getListaCorrespondencia(this.s_usu_id).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_correspondencia = this._fun.RemplazaNullArray(result);
          console.log(this.dts_correspondencia);
          this.revisarFlujoHR(0);
          this._fun.limpiatabla(".dt-correspondencia");
          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V3(
              [10, 20, 50],
              false,
              50
            );
            var table = $(".dt-correspondencia").DataTable(confiTable);
            this._fun.selectTable(table, [4, 5]);
            this._fun.inputTable(table, [0, 1, 2, 6, 7]);
          }, 10);
        } else {
          this._msg.formateoMensaje(
            "modal_danger",
            "Alerta: No existen registros"
          );
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage
          );
      }
    );
  }

  VerCorrespondenciaPre(dts) {
    console.log("para cambiar estado", dts);

    this.paneles("VER_CORRESPONDENCIA");
    this.tipoCorrespondencia = dts.tipo;
    this.m_idcorrespondencia = dts.id_correspondencia;
    this.m_fecha = dts.fecha;
    this.m_fecha = this.transformFecha(dts.fecha);
    this.m_hora = dts.hora.substring(0, 8);
    this.m_hoja_ruta = dts.numero;
    this.m_cite = dts.ruta;
    this.m_remitente = dts.nombre_de;
    this.m_destinatario = dts.nombre_para;
    this.m_referencia = dts.referencia;
    // this.m_anexo = dts.anexosResumen;
    this.m_observacion = dts.observacion;
    this.m_conproveido = dts.existe_proveido;
    this.m_estadorespuesta = dts.estado_respuesta;
    this.m_estadosituacion = dts.estado_situacion;
    this.m_estadorecibido = dts.estado_recibido;
    this.m_tipodocumentohr = dts.tipo_documento;
    this.m_plazodias = dts.dias;
    this.m_tipocabeceraproveido = dts.cabecera_proveido;
    this.m_idproveido = dts.id_proveido;

    //LIMPIANDO CAMPOS
    this.m_ContenidoAnterior = "";
    this.m_tiempo = "";
    this.m_contenido = "";
    /*************************************
     * CAMBIO DE ESTADO CORRESPONDENCIA LEIDA
     **************************************/

    if (
      this.m_tipocabeceraproveido == "CABECERA" &&
      this.m_estadorespuesta == "NoAplica" &&
      this.m_estadosituacion == "Recibido"
    ) {
      //console.log('cabecera leida')
      setTimeout(() => {
        this.cambioEstadoCorrespondencia(
          this.m_idcorrespondencia,
          this.m_idproveido,
          this.m_tipocabeceraproveido,
          "Leido"
        );
        this.m_estadorespuesta = "NoAplica";
        this.m_estadosituacion = "Leido";
      }, 10);
    }
    if (
      this.m_tipocabeceraproveido == "PROVEIDO" &&
      this.m_estadorespuesta == "Enviado" &&
      this.m_estadosituacion == "Recibido" &&
      this.m_estadorecibido == "EnEspera"
    ) {
      //console.log('proveido leida')
      setTimeout(() => {
        this.cambioEstadoCorrespondencia(
          this.m_idcorrespondencia,
          this.m_idproveido,
          this.m_tipocabeceraproveido,
          "Leido"
        );
        this.m_estadorespuesta = "Enviado";
        this.m_estadosituacion = "Leido";
        this.m_estadorecibido = "EnEspera";
      }, 10);
    }
    if (
      this.m_tipocabeceraproveido == "PROVEIDO" &&
      this.m_estadorespuesta == "Enviado" &&
      this.m_estadosituacion == "Leido" &&
      this.m_estadorecibido == "EnEspera"
    ) {
      //console.log('proveido leida')
      this.ListaAnexoResumen();
    }
    if (
      this.m_tipocabeceraproveido == "PROVEIDO" &&
      this.m_estadorespuesta == "Enviado" &&
      this.m_estadosituacion == "Leido" &&
      this.m_estadorecibido == "Recibido"
    ) {
      //console.log('proveido ya recibido')

      this.ListaAnexoResumen();
    }
  }
  cambioEstadoCorrespondencia(
    idcorrespondencia,
    idproveido,
    tipocabeceraproveido,
    estadocorrespondencia
  ) {
    this._sipta
      .cambioEstadoCorrespondencia(
        idcorrespondencia,
        idproveido,
        tipocabeceraproveido,
        estadocorrespondencia
      )
      .subscribe(
        (result: any) => {
          if (result[0]["message"].startsWith("CORRECTO")) {
            this._msg.formateoMensaje(
              "modal_success",
              result[0]["message"].split("-")[1]
            );
            this.ListaAnexoResumen();
          } else {
            this._msg.formateoMensaje("modal_danger", result[0].message);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage)
            this._msg.formateoMensaje(
              "modal_danger",
              "Error: " + this.errorMessage
            );
        }
      );
  }
  ListaProveido() {
    this._sipta.getListaProveido(this.m_idcorrespondencia).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dtsListaHistorialProveidos = this._fun.RemplazaNullArray(result);
          this._fun.limpiatabla(".dt-historialProveidos");
          $("#pnlHistorialProveidos").show();
          $("#collapseHistorialProvedios").collapse("hide");

          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V3(
              [10, 20, 50],
              false
            );
            var table = $(".dt-historialProveidos").DataTable(confiTable);
            this._fun.inputTable(table, [1]);
            this._fun.selectTable(table, [2]);
          }, 10);
        } else {
          this._msg.formateoMensaje(
            "modal_danger",
            "Alerta: No existen registros"
          );
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage
          );
      }
    );
  }
  ListaAnexoResumen() {
    this._sipta.getListaAnexoDescripcion(this.m_idcorrespondencia).subscribe(
      (result: any) => {
        //console.log('anexo', result);

        console.log(result);
        if (Array.isArray(result) && result.length > 0) {
          this.m_anexo = result[0].descripcion; //['descripcion']
          this._fun.limpiatabla(".dt-nuevoanexo");

          if (this.m_conproveido == "Si") {
            this.listaProveidoUltimo();
          } else {
            //this._fun.limpiatabla('.dt-proveido');
            $("#pnl_proveidos").hide();
            //debugger
            this.m_idProveidoAnterior = null; //idproveido
            this.m_idProveidoAnterior = 0;
          }
        } else {
          this._msg.formateoMensaje(
            "modal_danger",
            "Alerta: No existen registros"
          );
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage
          );
      }
    );
  }
  listarusuario() {
    return new Promise((resolve, reject) => {
      this._sipta.getListaUsuario().subscribe(
        (result: any) => {
          this.listaItem();
          if (Array.isArray(result) && result.length > 0) {
            resolve(this._fun.RemplazaNullArray(result));
          } else {
            this._msg.formateoMensaje(
              "modal_danger",
              "Alerta: No existen registros"
            );
            reject(this.prop_msg);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage)
            this._msg.formateoMensaje(
              "modal_danger",
              "Error: " + this.errorMessage
            );
        }
      );
    });
  }
  listaItem() {
    this._sipta.getListaItem().subscribe(
      (result: any) => {
        //this.listaProveidoUltimo();
        if (Array.isArray(result) && result.length > 0) {
          this.dts_item = this._fun
            .RemplazaNullArray(result)
            .sort(
              (a, b) =>
                a.codigodetalleclasificador - b.codigodetalleclasificador
            );
          //console.log(this.dts_item)
        } else {
          this._msg.formateoMensaje(
            "modal_danger",
            "Alerta: No existen registros"
          );
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage
          );
      }
    );
  }
  listaProveidoUltimo() {
    this._sipta.getListaProveidoUltimo(this.m_idcorrespondencia).subscribe(
      (result: any) => {
        // console.log('ÚLTIMO PROVEIDO ====>', result);
        if (Array.isArray(result) && result.length > 0) {
          this._fun.limpiatabla(".dt-proveido");
          this.dts_proveidoUltimo = this._fun.RemplazaNullArray(result);
          this.m_ContenidoAnterior = this.dts_proveidoUltimo[0]["contenido"];
          this.m_idProveidoAnterior = this.dts_proveidoUltimo[0]["id_proveido"];
          this.m_IndiceProveido = this.dts_proveidoUltimo[0]["indice_proveido"];
          this.ListaProveido();
        } else {
          this._msg.formateoMensaje(
            "modal_danger",
            "Alerta: No existen registros"
          );
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage
          );
      }
    );
  }
  insertarNuevoProveido() {
    if (
      this.m_IndiceProveido == undefined ||
      this.m_IndiceProveido == null ||
      this.m_IndiceProveido == ""
    ) {
      this.m_IndiceProveido = 0;
    }
    if (
      this.m_idProveidoAnterior == undefined ||
      this.m_idProveidoAnterior == null ||
      this.m_idProveidoAnterior == ""
    ) {
      this.m_idProveidoAnterior = 0;
    }
    if (this.m_tiempo == undefined || this.m_tiempo == "") {
      this.m_tiempo = 0;
    }
    this.controlClick++;
    console.log(
      "- Ingresó a guardar el registro por " + this.controlClick + "º vez"
    );
    if (this.controlClick == 1) {
      console.log("Procediendo a guardar el registro...");
      this._sipta
        .getInsertaProveido(
          this.m_idProveidoAnterior,
          this.m_idcorrespondencia,
          this.s_usu_id,
          this.m_auxDestinatario,
          // this._fun.textoUpper(this.m_contenido),
          (this.m_contenido || "").toUpperCase(),
          this.m_IndiceProveido,
          this.m_item,
          this.m_tiempo
        )
        .subscribe(
          (result: any) => {
            //console.log(result);

            if (Array.isArray(result) && result.length > 0) {
              console.log("Se guardó el registro con éxito.");
              this.dts_ProveidoNuevo = this._fun.RemplazaNullArray(result);
              this.paneles("GUARDAR_NUEVOPROVEIDO");
              this.ListaAnexos();
              this._msg.formateoMensaje(
                "modal_success",
                "Proveido generado correctamente",
                6
              );
            } else {
              this._msg.formateoMensaje(
                "modal_danger",
                "Alerta: No existen registros"
              );
            }
          },
          (error) => {
            this.errorMessage = <any>error;
            if (this.errorMessage)
              this._msg.formateoMensaje(
                "modal_danger",
                "Error: " + this.errorMessage
              );
          }
        );
    } else {
      console.log(this.controlClick + "º vez que hizo clic a guardar");
      //this.prop_msg = 'Ya se registró la correspondencia.';
      //this.prop_tipomsg = 'danger';
      //this._msg.formateoMensaje('modal_danger', this.prop_msg);
    }
  }
  listarDocumentos() {
    return new Promise((resolve, reject) => {
      this._sipta.getListaDocumentos().subscribe(
        (result: any) => {
          //console.log(result);
          if (Array.isArray(result) && result.length > 0) {
            resolve(this._fun.RemplazaNullArray(result));
          } else {
            this._msg.formateoMensaje(
              "modal_danger",
              "Alerta: No existen registros"
            );
            reject(this.prop_msg);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage)
            this._msg.formateoMensaje(
              "modal_danger",
              "Error: " + this.errorMessage
            );
        }
      );
    });
  }
  InsertarAnexo() {
    if (!this.m_anexo || !this.m_descripcion) {
      this._msg.formateoMensaje(
        "modal_danger",
        "Debe registrar el anexo y la descripción"
      );
      return;
    }
    this._sipta
      .getInsertaAnexo(
        this.m_idcorrespondencia,
        (this.m_anexo || "").toUpperCase(),
        (this.m_descripcion || "").toUpperCase(),
        this.s_usu_id
      )
      .subscribe(
        (result: any) => {
          //console.log(result);
          this.ListaAnexos();
          this.limpiaranexo();
          //console.log('anexos', result);//result[0].message.split('-')[1]
          if (result[0].message.startsWith("CORRECTO"))
            this._msg.formateoMensaje(
              "modal_success",
              "Anexo registrado correctramente!"
            );
          if (!result[0].message.startsWith("CORRECTO"))
            this._msg.formateoMensaje("modal_danger", result[0].message);
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage)
            this._msg.formateoMensaje(
              "modal_danger",
              "Error: No se pudo ejecutar la petición en la base de datos"
            );
        }
      );
  }

  ListaAnexos() {
    this._sipta.getListaAnexo(this.m_idcorrespondencia).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_Anexo = this._fun.RemplazaNullArray(result);
          this._fun.limpiatabla(".dt-nuevoanexo");
          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V3(
              [10, 20, 50],
              false
            );
            var table = $(".dt-nuevoanexo").DataTable(confiTable);
            this._fun.inputTable(table, [1]);
            this._fun.selectTable(table, [1]);
          }, 10);
        }
        // else {
        //   this.prop_msg = 'Alerta: No existen registros1';
        //   this.prop_tipomsg = 'danger';
        //   this._msg.formateoMensaje('modal_danger', this.prop_msg);
        // }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error:" + this.errorMessage
          );
      }
    );
  }
  correspondenciaRecibida() {
    console.log(
      "Recibido",
      this.m_idcorrespondencia,
      this.m_idProveidoAnterior
    );
    this._sipta
      .correspondenciaRecibida(
        this.m_idcorrespondencia,
        this.m_idProveidoAnterior
      )
      .subscribe(
        (result: any) => {
          //console.log('recibe correspondencia', result);
          if (result[0].message.startsWith("CORRECTO")) {
            this._msg.formateoMensaje(
              "modal_success",
              result[0].message.split("-")[1]
            );
            if (this.m_tipocabeceraproveido == "CABECERA") {
              this.m_estadorespuesta = "Recibido";
              this.m_estadosituacion = "Leido";
            }
            if (this.m_tipocabeceraproveido == "PROVEIDO") {
              this.m_estadorespuesta = "Enviado";
              this.m_estadosituacion = "Leido";
              this.m_estadorecibido = "Recibido";
            }
          } else {
            this._msg.formateoMensaje("modal_danger", result[0].message);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage)
            this._msg.formateoMensaje(
              "modal_danger",
              "Error:" + this.errorMessage
            );
        }
      );
  }
  /***********************************************
   * ANEXOS
   ***********************************************/
  editaranexoPre(dts) {
    this.paneles("EDITAR_ANEXO");
    this.m_idanexo = dts.id_anexo;
    this.m_idcorrespondencia = dts.fid_correspondencia;
    this.m_anexo = dts.documento;
    this.m_descripcion = dts.descripcion;
  }
  editarAnexo() {
    this._sipta
      .getEditarAnexo(
        this.m_idanexo,
        this.m_idcorrespondencia,
        (this.m_anexo || "").toUpperCase(),
        (this.m_descripcion || "").toUpperCase(),
        this.s_usu_id
      )
      .subscribe(
        (result: any) => {
          this.paneles("NUEVO_ANEXO");
          this.ListaAnexos();
          this.limpiaranexo();
          if (result[0].message.startsWith("CORRECTO"))
            this._msg.formateoMensaje(
              "modal_success",
              "Anexo editado correctamente"
            );
          if (!result[0].message.startsWith("CORRECTO"))
            this._msg.formateoMensaje("modal_danger", result[0].message);
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage)
            this._msg.formateoMensaje(
              "modal_danger",
              "Error:" + this.errorMessage
            );
        }
      );
  }
  limpiaranexo() {
    this.m_descripcion = "";
  }
  eliminar_anexo(dts) {
    this.paneles("ELIMINAR_ANEXO");
    this._sipta
      .getEliminarAnexo(dts.id_anexo, dts.fid_correspondencia, this.s_usu_id)
      .subscribe(
        (result: any) => {
          console.log(result);

          this.ListaAnexos();
          this.limpiaranexo();
          //console.log('anexos', result);
          if (result[0].message.startsWith("CORRECTO"))
            this._msg.formateoMensaje(
              "modal_success",
              "Anexo eliminado correctamente"
            );
          if (!result[0].message.startsWith("CORRECTO"))
            this._msg.formateoMensaje("modal_danger", result[0].message);
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage)
            this._msg.formateoMensaje(
              "modal_danger",
              "Error:" + this.errorMessage
            );
        }
      );
  }
  terminar_correspondencia() {
    this.controlClick = 0;
    this._sipta
      .terminarCorrespondencia(
        this.m_idcorrespondencia,
        (this.m_respuesta || "").toUpperCase()
      )
      .subscribe(
        (result: any) => {
          if (result[0].message.startsWith("CORRECTO")) {
            this._msg.formateoMensaje(
              "modal_success",
              result[0].message.split("-")[1]
            );
            $("#modalTerminarCorrespondencia").modal("hide");
            this.paneles("VER_INICIO");
            this.m_respuesta = "";
          } else {
            this._msg.formateoMensaje("modal_danger", result[0].message);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage)
            this._msg.formateoMensaje(
              "modal_danger",
              "Error: " + this.errorMessage
            );
        }
      );
  }
  ListaCorrespondenciaEnviada() {
    // let v_ruta = 'internaciones';
    // let v_modulo = 'rpt_admisionepicrisis';
    // this._router.navigate(['./' + v_ruta + '/' + this.s_idcon + '/' + this.s_idmod + '/' + v_modulo], { queryParams: { comprobante: comprobante } });
    let v_ruta = "sipta";
    let v_modulo = "3_correspondenciaenviada";
    this._router.navigate(
      [
        "./" +
          v_ruta +
          "/" +
          this.s_idcon +
          "/" +
          this.s_idmod +
          "/" +
          v_modulo,
      ],
      { queryParams: { tipo: "CORRESPONDENCIA_ENVIADA" } }
    );
  }
  ListaProveidosEnviados() {
    let v_ruta = "sipta";
    let v_modulo = "3_correspondenciaenviada";
    this._router.navigate(
      [
        "./" +
          v_ruta +
          "/" +
          this.s_idcon +
          "/" +
          this.s_idmod +
          "/" +
          v_modulo,
      ],
      { queryParams: { tipo: "PROVEIDOS_ENVIADOS" } }
    );
  }
  ListaCorrespondenciaTerminada() {
    let v_ruta = "sipta";
    let v_modulo = "3_correspondenciaenviada";
    this._router.navigate(
      [
        "./" +
          v_ruta +
          "/" +
          this.s_idcon +
          "/" +
          this.s_idmod +
          "/" +
          v_modulo,
      ],
      { queryParams: { tipo: "CORRESPONDENCIA_TERMINADA" } }
    );
  }

  BusquedaUsuario(usuario: string) {
    if (usuario.length >= 2) {
      this._sipta.getListaUsuarios(usuario.toUpperCase()).subscribe(
        (result: any) => {
          if (result.length > 0) {
            this.dts_usuario = result;
            this.dts_usuario = result.filter(
              (item) => item.NombreCompletoUsuario != this.nombre_usuario
            );
          } else {
            //alert('No se encuentran registros con el criterio de busqueda');
            this.prop_msg =
              "Info: No se encuentran registros con el criterio de busqueda ";
            this.prop_tipomsg = "info";
            this._msg.formateoMensaje("modal_info", this.prop_msg);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage)
            this._msg.formateoMensaje(
              "modal_danger",
              "Error: " + this.errorMessage
            );
        }
      );
    } else {
      this.dts_usuario = [];
    }
  }

  ValidaDestinatario() {
    if (this.m_para.length > 1) {
      let destinatario = this.dts_usuario.filter(
        (item) => item.nombre_completo_usuario == this.m_para.toUpperCase()
      );
      if (destinatario.length > 0 && destinatario != undefined) {
        this.m_auxDestinatario = destinatario[0].usu_id;
      } else {
        this.m_auxDestinatario = 0;
        this.prop_msg = "ERROR: Debe registrar un DESTINATARIO válido. ";
        this.prop_tipomsg = "danger";
        this._msg.formateoMensaje("modal_danger", this.prop_msg);
      }
    } else {
      this.m_auxDestinatario = 0;
      this.prop_msg = "ERROR: Debe registrar un DESTINATARIO válido. ";
      this.prop_tipomsg = "danger";
      this._msg.formateoMensaje("modal_danger", this.prop_msg);
    }
  }

  limpiaContador() {
    this.controlClick = 0;
    //console.log('controlClick = 0');
  }

  Verifica() {
    if (this.m_destinatario == "") {
      this.prop_msg = "Debe registrar el Destinatario.";
      this.prop_tipomsg = "danger";
      this._msg.formateoMensaje("modal_danger", this.prop_msg);
      return;
    }
    if (this.m_item == undefined || this.m_item == "") {
      this.prop_msg = "Debe registrar el ITEM";
      this.prop_tipomsg = "danger";
      this._msg.formateoMensaje("modal_danger", this.prop_msg);
      return;
    }
    if (this.m_auxDestinatario == 0 || this.m_para == "") {
      this.prop_msg = "Debe registrar un DESTINATARIO válido. ";
      this.prop_tipomsg = "danger";
      this._msg.formateoMensaje("modal_danger", this.prop_msg);
      return;
    }
    $("#pnl_Guardarregistros").modal("show");
  }

  revisarFlujoHR(id: number) {
    this.controlClick = 0;
    console.log("iniciando FLUJO");
    this._sipta.buscarFlujoHR({ id }).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_realcionPHR = this._fun.RemplazaNullArray(result);
          console.log(this.dts_realcionPHR);
          this.dts_correspondencia.map((el) => {
            if (
              this.dts_realcionPHR.filter(
                (f) => f.fid_correspondencia == el.id_correspondencia
              )[0]
            ) {
              el.flujo = this.dts_realcionPHR.filter(
                (f) => f.fid_correspondencia == el.id_correspondencia
              )[0].fid_proyecto;
            }
            return el;
          });
        } else {
          // this._msg.formateoMensaje('modal_danger', 'Alerta: No existen registros');
          console.log("sin datos", result);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage
          );
      }
    );
  }
}
