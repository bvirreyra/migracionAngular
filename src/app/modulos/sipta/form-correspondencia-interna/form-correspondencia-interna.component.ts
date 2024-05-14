import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Inputmask from "inputmask";
import { Globals } from "../../../global";

import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { ToastrService } from "ngx-toastr";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";
import { SgpService } from "../../sgp/sgp.service";
import { SiptaService } from "../../sipta/sipta.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important
@Component({
  selector: "app-form-correspondencia-interna",
  templateUrl: "./form-correspondencia-interna.component.html",
  styleUrls: ["./form-correspondencia-interna.component.css"],
  providers: [SgpService],
})
export class FormCorrespondenciaInternaComponent implements OnInit {
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

  public m_pagina: number;
  public cargando: boolean = false;

  //VARIABLES DE COMPONENTE
  public m_fecha_actual: any;
  public dts_usuario: any;
  public marcador = false;
  public lista_usuarios = new Array();
  public contador = 0;
  public m_cite: any;
  public m_referencia: any;
  public m_destinatario: any = "";
  public m_observaciones: any;
  public dts_correspondenciainterna: any;
  public tipo: any = "Interna";
  public m_remitente: any;
  //public m_CodigoCorrespondencia:any;
  public m_idusuariocc: any;
  public m_codigousuario: any;
  public dts_usuariocc: any;
  public dts_Anexo: any;
  public dts_Documentos: any;
  public m_anexo: any;
  public m_descripcion: any;
  public m_idcorrespondencia: any;
  public m_idanexo: any;
  public dts_item: any;
  public dts_Proveido: any;
  public m_hojaruta: any;
  //public m_upre:any;
  //////////variables_proveido///////////
  public m_idpadre: any;
  public m_contenido: any;
  public m_indiceproveido: any;
  public m_id_proveido: any;
  ////////////////////////////////
  /////////////variables_iten_correspondencia
  public dts_ItemCorrespondencia: any;
  public m_item: any;
  /////////////////////////////////
  /////////////////variable tiempo////
  public m_tiempo: any;
  public dts_listaritemCorrespondencia: any;
  public m_filtrousuario: any;
  public m_prefijo: any;
  public m_sumacite: any;
  public m_idproveido: any;
  public m_nombreitem: any;
  public m_codItem: any;
  public m_idUsuarioExterno: any;
  public m_id_unidad: any;
  public m_idUsuario: any;
  public dts_UnidadOrganizacional: any;
  public dts_Cite: any;
  public m_nuevocite: any;
  public dts_proveido: any;
  public dts_ListaTipoDocumentoHr: any;
  public m_limitardias: any;
  public m_tipodocumentohc: any;
  public m_idProveidoAnterior: any;
  public m_gestionhr: any;
  public m_auxDestinatario: any;

  public m_proyectosolicitud: any = "";
  public m_estructura_financiera: any = "";

  public controlClick: number = 0;
  dts_compromisosPresidenciales: any;
  //////////////////////
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _sipta: SiptaService,
    private _seguimiento: SgpService,

    private globals: Globals,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent,
    private datePipe: DatePipe,
    private base64: ImgBase64Globals,
    private toastr: ToastrService
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
    this.paneles("VER_INICIO");
    this.m_limitardias = 0;
    this.m_tipodocumentohc = "DOCUMENTACION";
    this.dts_Anexo = [];

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
        //console.log(this.dtsFechaSrv);
        this.m_fecha_actual = this.transformFecha(this.dtsFechaSrv);
        this.dtsHoraSrv = this.transformHora(this.dtsFechaSrv);
        this.m_gestion = this.dtsFechaSrv.substr(0, 4);
        this.m_mes_actual = this.dtsFechaSrv.substr(5, 2);
        return this.FechaLiteral(dts2[0]["fechasrv"]);
      })
      .then((dts3) => {
        this.dtsFechaLiteral = dts3;
        return this.RolesAsignados(this.dtsDatosConexion[0]._usu_id);
      })
      .then((dts4) => {
        this.dts_roles_usuario = dts4;
        return this.listarusuario();
      })
      .then((dts5) => {
        //this.dts_usuario = dts5
        let dts_usuarios: any;
        dts_usuarios = dts5;
        console.log("le dts5", dts5);

        //this.dts_usuario = dts_usuarios.filter(item => item.IdUsuario != this.s_usu_id_sipta);
        this.m_filtrousuario = dts_usuarios.filter(
          (item) => item.usu_id == this.s_usu_id
        );
        this.m_id_unidad = this.m_filtrousuario[0].m_id_unidad;
        this.m_prefijo = this.m_filtrousuario[0].prefijo;
        this.m_idUsuario = this.m_filtrousuario[0].usu_id;
        this.m_sumacite = this.m_cite = "UPRE-" + this.m_prefijo + "-";
        return this.listaTipodocumentohr();
      })
      .then((dts6) => {
        this.dts_ListaTipoDocumentoHr = dts6;
        return this.listarDocumentos();
      })
      .then((dts7) => {
        this.dts_Documentos = dts7;
        this.listaItem();
        this.BusquedaUsuario("");
        this.listaCompromisosPresidenciales();
      })
      .catch(falloCallback);
  }
  paneles(string) {
    if (string == "VER_INICIO") {
      $("#pnl_cabecera").show();
      $("#pnl_anexos").hide();
      $("#btnInsertarcc").hide();
      $("#m_cc").hide();
      $("#pnl_cc").hide();
      $("#pnl_proveido").hide();
    }
    if (string == "GUARDAR_CORRESPONDENCIA_INTERNA") {
      $("#pnl_cabecera").hide();
      $("#pnl_anexos").show();
      $("#btnModificarAnexo").hide();
      $("#pnl_proveido").hide();
      $("#pnl_Guardarregistros").modal("hide");
    }
    if (string == "EDITAR_ANEXO") {
      $("#btnModificarAnexo").show();
      $("#btnInsertarAnexo").hide();
    }
    if (string == "BOTON_EDITARANEXO") {
      $("#btnModificarAnexo").hide();
      $("#btnInsertarAnexo").show();
    }
    if (string == "ELIMINAR_ANEXO") {
      $("#btnModificarAnexo").hide();
      $("#btnInsertarAnexo").show();
      //$('#pnl_cargo').hide();
    }
    if (string == "NUEVA_PROVEIDO") {
      $("#pnl_proveido").show();
      $("#pnl_cabecera").hide();
      $("#pnl_anexos").hide();
      $("#btnInsertarProveido").show();
      $("#btnModificarProveido").hide();
      this.m_limitardias = 0;
      this.m_tipodocumentohc = "DOCUMENTACION";
      this.dts_Anexo = [];
    }
    if (string == "VER_ANEXO") {
      this.ListaAnexo();
      $("#pnl_anexos").hide();
      $("#pnl_cabecera").hide();
      $("#btnModificarAnexo").hide();
      $("#pnl_proveido").hide();
      $("#pnl_anexos").show();
    }
    if (string == "EDITAR_PROVEIDO") {
      $("#btnInsertarProveido").hide();
      $("#btnModificarProveido").show();
      $("#pnl_cabecera").hide();
    }
    if (string == "GUARDAR_PROVEIDO") {
      $("#btnInsertarProveido").hide();
      $("#btnModificarProveido").show();
      //$('#pnl_cargo').hide();
    }
  }
  limpiaranexo() {
    this.m_descripcion = "";
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
                this.m_remitente = this.s_nomuser;
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
          if (this.errorMessage)
            this._msg.formateoMensaje(
              "modal_danger",
              "Error: " + this.errorMessage
            );
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
          if (this.errorMessage)
            this._msg.formateoMensaje(
              "modal_danger",
              "Error: " + this.errorMessage
            );
          reject(this.prop_msg);
        }
      );
    });
  }
  transformHora(date) {
    return this.datePipe.transform(date, "HH:mm:ss");
    //whatever format you need.
  }
  transformFecha(date) {
    //return this.datePipe.transform(date, 'HH:mm:ss');
    return this.datePipe.transform(date, "dd/MM/yyyy  HH:mm");

    //whatever format you need.
  }
  FechaLiteral(f) {
    return this._fun.FechaLiteral(f);
  }
  listarusuario() {
    return new Promise((resolve, reject) => {
      this._sipta.getListaUsuario().subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            var dts = this._fun.RemplazaNullArray(result);
            resolve(dts);
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
          reject(this.errorMessage);
        }
      );
    });
  }
  listaTipodocumentohr() {
    console.log("ENTREA AQUI");
    return new Promise((resolve, reject) => {
      this._sipta.listaTipodocumentohr().subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            var dts = this._fun.RemplazaNullArray(result);
            //console.log('docu', dts);
            resolve(dts);
          } else {
            this._msg.formateoMensaje(
              "modal_danger",
              "Alerta: No existen registros...."
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
          reject(this.prop_msg);
        }
      );
    });
  }
  listarCite() {
    this.controlClick++;
    if (this.controlClick == 1) {
      this._sipta.getListacite(this.m_idUsuario).subscribe(
        (result: any) => {
          console.log("el result", result);

          if (result[0]) {
            this.dts_Cite = this._fun.RemplazaNullArray(result);
            this.m_nuevocite = this.dts_Cite[0].message;
            this.insertarCorrespondenciaInterna();
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
      console.log(this.controlClick);
      //this.prop_msg = 'Ya se registró la correspondencia.';
      //this.prop_tipomsg = 'danger';
      //this._msg.formateoMensaje('modal_danger', this.prop_msg);
    }
  }

  insertarCorrespondenciaInterna() {
    console.log("registrando corr int");
    this.m_idUsuarioExterno = "0";
    this._sipta
      .getInsertarCorrespondencia(
        this.tipo,
        (this.m_nuevocite || "").toUpperCase(),
        (this.m_referencia || "").toUpperCase(),
        this.s_usu_id,
        this.m_auxDestinatario,
        (this.m_observaciones || "").toUpperCase(),
        this.m_idUsuarioExterno || "",
        (this.m_tipodocumentohc || "").toUpperCase(),
        this.m_limitardias,
        this.m_item
      )
      .subscribe(
        (result: any) => {
          console.log(result);
          if (Array.isArray(result) && result.length > 0) {
            console.log("DATOS DE HOJA DE RUTA==>", result);
            if (!result[0].message.startsWith("ERROR")) {
              this.dts_correspondenciainterna =
                this._fun.RemplazaNullArray(result);
              this.m_idcorrespondencia =
                this.dts_correspondenciainterna[0].message.split("-")[2];
              this.m_hojaruta =
                this.dts_correspondenciainterna[0].message.split("-")[3];
              this.m_gestionhr =
                this.dts_correspondenciainterna[0].message.split("-")[4];
              this.InsertarUsuariocc();
              this.paneles("GUARDAR_CORRESPONDENCIA_INTERNA");
              this.listaItem();
              console.log("despues de insertar corresp", this.m_hojaruta);
              //si es solicitud de proceso
              if (this.m_proyectosolicitud != "") {
                this.vinculaHrCompromiso(this.m_hojaruta);
              }
            } else {
              console.log(result[0].message);
              this._msg.formateoMensaje(
                "modal_danger",
                "Error: " + result[0].message
              );
            }
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
  InsertarUsuariocc() {
    for (let i = 0; i < this.lista_usuarios.length; i++) {
      this.m_codigousuario = this.lista_usuarios[i]["id"];
      this._sipta
        .getInsertarUsuariocc(this.m_idcorrespondencia, this.m_codigousuario)
        .subscribe((result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            this.dts_usuariocc = this._fun.RemplazaNullArray(result);
          }
        });
    }
  }

  listarDocumentos() {
    return new Promise((resolve, reject) => {
      this._sipta.getListaDocumentos().subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            resolve(this._fun.RemplazaNullArray(result));
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
          reject(this.errorMessage);
        }
      );
    });
  }
  InsertarAnexo() {
    console.log("insert anexo");
    if (!this.m_anexo || !this.m_descripcion) {
      this._msg.formateoMensaje(
        "modal_danger",
        "Debe registrar el anexo y la descripción"
      );
      return;
    }
    if (this.m_descripcion != undefined && this.m_descripcion.length > 0) {
      this._sipta
        .getInsertaAnexo(
          this.m_idcorrespondencia,
          (this.m_anexo || "").toUpperCase(),
          (this.m_descripcion || "").toUpperCase(),
          this.s_usu_id
        )
        .subscribe(
          (result: any) => {
            console.log(result);

            if (!result[0].message.startsWith("ERROR")) {
              this.ListaAnexo();
              this.limpiaranexo();
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
    } else {
      // this._msg.formateoMensaje('modal_danger', 'Error: Debe igresar una descripcion, para el Anexo');
      this.toastr.error(
        "Debe igresar una descripcion, para el Anexo",
        "Registro Anexo",
        { positionClass: "toast-top-right", timeOut: 4000, progressBar: true }
      );
    }
  }
  ListaAnexo() {
    this._sipta.getListaAnexo(this.m_idcorrespondencia).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_Anexo = this._fun.RemplazaNullArray(result);
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
  editaranexoPre(dts) {
    this.paneles("EDITAR_ANEXO");
    this.m_idanexo = dts.id_anexo;
    this.m_idcorrespondencia = dts.fid_correspondencia;
    this.m_anexo = dts.documento;
    this.m_descripcion = dts.descripcion;
  }
  editarAnexo() {
    //console.log('editaanexo', this.m_idanexo, this.m_idcorrespondencia, this.m_anexo, this.m_descripcion)
    if (this.m_descripcion != undefined && this.m_descripcion.length > 0) {
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
            this.paneles("BOTON_EDITARANEXO");
            this.limpiaranexo();
            this.ListaAnexo();
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
      // this._msg.formateoMensaje('modal_danger', 'Error: Debe igresar una descripcion, para el Anexo');
      this.toastr.error(
        "Debe igresar una descripcion, para el Anexo",
        "Registro Anexo",
        { positionClass: "toast-top-right", timeOut: 4000, progressBar: true }
      );
    }
  }
  eliminar_anexo(dts) {
    this.paneles("ELIMINAR_ANEXO");
    this._sipta
      .getEliminarAnexo(dts.id_anexo, dts.fid_correspondencia, this.s_usu_id)
      .subscribe(
        (result: any) => {
          this.ListaAnexo();
          if (Array.isArray(result) && result.length > 0) {
            this.dts_correspondenciainterna =
              this._fun.RemplazaNullArray(result);
            this._fun.limpiatabla("dt-anexo");
          } else {
            this._fun.limpiatabla("dt-anexo");
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

  InsertarProveido() {
    if (!this.m_indiceproveido) this.m_indiceproveido = 0;
    if (!this.m_tiempo == undefined) this.m_tiempo = 0;
    this.m_idProveidoAnterior = 0;

    this._sipta
      .getInsertaProveido(
        this.m_idProveidoAnterior,
        this.m_idcorrespondencia,
        this.s_usu_id,
        this.m_destinatario,
        (this.m_contenido || "").toUpperCase(),
        this.m_indiceproveido,
        this.m_item,
        this.m_tiempo
      )
      .subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            this.dts_Proveido = this._fun.RemplazaNullArray(result);
            this.m_id_proveido = this.dts_Proveido[0].id_proveido;
            this.paneles("GUARDAR_PROVEIDO");
            this.InsertarItemCorrespondencia();
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
  InsertarItemCorrespondencia() {
    // if (this.m_tiempo == '') {
    //   this.m_tiempo = '';
    // }
    this._sipta
      .getInsertarItemCorrespondencia(
        this.m_id_proveido,
        this.m_item,
        this.m_tiempo || "",
        this.s_usu_id
      )
      .subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            this.dts_ItemCorrespondencia = this._fun.RemplazaNullArray(result);
            this.listarItemCorrespondencia();
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
  listarItemCorrespondencia() {
    this._sipta.getListarItemCorrespondencia(this.m_id_proveido).subscribe(
      (result: any) => {
        //console.log(result)
        if (Array.isArray(result) && result.length > 0) {
          this.dts_listaritemCorrespondencia =
            this._fun.RemplazaNullArray(result);
          this._fun.limpiatabla(".dt-listaitemcorrespondencia");
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
  editarProveidoPre(dts) {
    this.paneles("EDITAR_PROVEIDO");
    this.m_idproveido = dts.id_proveido;
    this.m_nombreitem = dts.nombre;
    this.m_tiempo = dts.tiempo;
    this.m_contenido = dts.contenido;
    this.m_item = dts.fid_item;
  }
  editarproveido() {
    this._sipta
      .getEditarProveido(this.m_idproveido, this.m_contenido)
      .subscribe(
        (result: any) => {
          //console.log(result);
          if (Array.isArray(result) && result.length > 0) {
            this.dts_proveido = this._fun.RemplazaNullArray(result);
            this.editarItemCorrespondencia();
            //this.paneles('BOTON_EDITARANEXO');
            //this.limpiaranexo();
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
  editarItemCorrespondencia() {
    this._sipta
      .getEditarItemCorrespondencia(
        this.m_idproveido,
        this.m_item,
        this.m_tiempo,
        this.s_usu_id
      )
      .subscribe(
        (result: any) => {
          //console.log(result);
          if (Array.isArray(result) && result.length > 0) {
            //this.dts_Anexo = this._fun.RemplazaNullArray(result);
            this.listarItemCorrespondencia();
            //this._fun.limpiatabla('.dt-anexo');
            //this.paneles('BOTON_EDITARANEXO');
            //this.limpiaranexo();
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
  terminar_correspondencia() {
    this.controlClick = 0;
    // window.open(this.url_reporte + '/modulos/sipta/rptHojadeRuta.php?gestion=' + this.m_gestionhr + '&nro=' + this.m_hojaruta + '&pag=1', 'blank');
    this.generarReporte("01");
    //this.m_remitente='0';
    //this.m_sumacite='0';
    //this.m_fecha_actual='0';
    this.dts_Anexo = [];
    setTimeout(() => {
      this.m_destinatario = "";
      this.m_referencia = "";
      this.m_observaciones = "";
      this.m_anexo = "";
      this.m_descripcion = "";
      this.m_item = "";
      this.m_contenido = "";
      this.m_tiempo = "";
      this.m_limitardias = 0;
      this.m_tipodocumentohc = "DOCUMENTACION";
      this._fun.limpiatabla(".dt-anexo");
      this._fun.limpiatabla(".dt-listaitemcorrespondencia");
      this.paneles("VER_INICIO");
      this.m_limitardias = 0;
      this.m_tipodocumentohc = "DOCUMENTACION";
    }, 50);
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

  BusquedaUsuario(usuario: string) {
    if (usuario.length >= 2) {
      this._sipta.getListaUsuarios(usuario.toUpperCase()).subscribe(
        (result: any) => {
          if (result.length > 0) {
            this.dts_usuario = result.filter(
              (item) => item.usu_id != this.m_idUsuario
            );
          } else {
            //alert('No se encuentran registros con el criterio de busqueda');
            // this._msg.formateoMensaje('modal_info', 'Info: No se encuentran registros con el criterio de busqueda');
            this.toastr.warning(
              "No se encuentran registros con el criterio de busqueda",
              "Validación Destinatario!",
              {
                positionClass: "toast-top-right",
                timeOut: 4000,
                progressBar: true,
              }
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
      this.dts_usuario = [];
    }
  }

  ValidaDestinatario() {
    if (this.m_destinatario.length > 1) {
      let destinatario = this.dts_usuario.filter(
        (item) =>
          item.nombre_completo_usuario == this.m_destinatario.toUpperCase()
      );
      if (destinatario.length > 0 && destinatario != undefined) {
        this.m_auxDestinatario = destinatario[0].usu_id;
      } else {
        this.m_auxDestinatario = 0;
        // this._msg.formateoMensaje('modal_danger', 'ERROR: Debe registrar un DESTINATARIO válido.');
        this.toastr.error(
          "Debe registrar un DESTINATARIO válido.",
          "Validación!",
          { positionClass: "toast-top-right", timeOut: 4000, progressBar: true }
        );
      }
    } else {
      this.m_auxDestinatario = 0;
      // this._msg.formateoMensaje('modal_danger','ERROR: Debe registrar un DESTINATARIO válido.');
      this.toastr.error(
        "Debe registrar un DESTINATARIO válido.",
        "Validación!",
        { positionClass: "toast-top-right", timeOut: 4000, progressBar: true }
      );
    }
  }
  limpiaContador() {
    this.controlClick = 0;
    console.log("controlClick = 0");
  }

  Verifica() {
    if (this.m_destinatario == "") {
      this._msg.formateoMensaje(
        "modal_danger",
        "Debe registrar el Destinatario."
      );
      return;
    }
    if (this.m_item == undefined) {
      this._msg.formateoMensaje("modal_danger", "Debe registrar el ITEM");
      return;
    }
    $("#pnl_Guardarregistros").modal("show");
  }

  generarReporte(tipo: string) {
    this.cargando = true;
    console.log("generando reporte", tipo);
    let nombre = `HR_${this.m_hojaruta}_${this.m_gestionhr}`;
    let url = "3_reportesCorrespondencia/";
    if (tipo === "02") url = "3_reporteProveido/";
    if (tipo === "03") {
      const pagina = prompt("Introduzca número página", "2");
      //if(!pagina || Number(pagina)===NaN || Number(pagina)<0 || Number(pagina)>5 ){
      if (!pagina || !Number(pagina) || Number(pagina) < 0) {
        alert("Debe insertar solo números validos");
        this.cargando = false;
        return true;
      }
      nombre = `HR_${this.m_hojaruta}_${this.m_gestionhr}_${pagina}`;
      url = "3_reportePaginaExtra/";
    }
    const miData = {
      tipoReporte: tipo,
      numero: this.m_hojaruta,
      gestion: this.m_gestionhr,
      url,
    };
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
  /**************************************************
   * SOLICITUD DE INICIO DE PROCESO DE CONTRATACION
   **************************************************/
  listaCompromisosPresidenciales() {
    this._seguimiento.listaCompromisosPresidencialesVinculacion().subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_compromisosPresidenciales =
            this.armaComboCompromisoPresidencial(
              this._fun.RemplazaNullArray(result)
            );
          console.log(
            "LISTA COMPROMISOS PRESIDENCIALES",
            this.dts_compromisosPresidenciales
          );
        } else {
          this.prop_msg = "Alerta: No existen registros de la busqueda";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la petición BUSQUEDA");
        }
      }
    );
  }
  armaComboCompromisoPresidencial(dts) {
    var combo = new Array(dts.length);
    var comboSeleccion;
    dts.forEach((element) => {
      let registro = {
        id: element.id_compromiso,
        text: `${element.id_compromiso} ${element.nombreproyecto}`,
      };
      combo.push(registro);
    });
    comboSeleccion = combo;
    comboSeleccion = comboSeleccion.filter(function (el) {
      return el != null;
    });
    return comboSeleccion;
  }
  verificaContiene() {
    var dato = this.m_tipodocumentohc.includes(
      "SOLICITUD DE INICIO DE PROCESO DE CONTRATACIÓN"
    );
    if (dato) {
      var cadena = this.m_tipodocumentohc.split("-");
      this.m_estructura_financiera = cadena[1].trim();
      console.log(this.m_estructura_financiera);
    } else {
      this.m_estructura_financiera = "";
    }
    return dato;
  }
  vinculaHrCompromiso(hoja_ruta) {
    var dts = {
      operacion: "COMPROMISO_" + this.m_estructura_financiera,
      id_compromiso: this.m_proyectosolicitud,
      estructura_financiera: this.m_estructura_financiera,
      hr: hoja_ruta + "/" + this.m_gestion,
    };
    this._seguimiento.vinculaHrCompromiso(dts).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this._msg.formateoMensaje(result[0].msg_estado, result[0].message);
        } else {
          this._msg.formateoMensaje(
            "modal_danger",
            "Alerta: No se pudo vincular la Hoja de Ruta con el Compromiso"
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
  validaEstructura() {
    console.log("Valida Estructura====<>");
    var dts = {
      operacion: "EXISTE_ESTRUCTURA",
      id_compromiso: this.m_proyectosolicitud,
      estructura_financiera: this.m_estructura_financiera,
      hr: "",
    };
    this._seguimiento.vinculaHrCompromiso(dts).subscribe(
      (result: any) => {
        console.log("DATOS==>", result);
        if (result[0].msg_estado == "ERROR") {
          this.m_proyectosolicitud = "";
          this._msg.formateoMensaje(result[0].tipo_msg, result[0].message, 10);
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
