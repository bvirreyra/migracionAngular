import { Component, OnInit } from "@angular/core";

import { DatePipe } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import Inputmask from "inputmask";
import { Globals } from "../../../global";

import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import alasql from "alasql";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";
import { SgpService } from "../../sgp/sgp.service";
import { SiptaService } from "../../sipta/sipta.service";

import { ToastrService } from "ngx-toastr";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-form-correspondencia-externa",
  templateUrl: "./form-correspondencia-externa.component.html",
  styleUrls: ["./form-correspondencia-externa.component.css"],
})
export class FormCorrespondenciaExternaComponent implements OnInit {
  /*VARIABLES PARA MASCARAS */
  public mask_numerodecimal: any;
  public mask_fecha: any;
  public mask_numero: any;
  public mask_gestion: any;

  //variables para el compononete de mensajes
  public prop_msg: string;
  public prop_tipomsg: string;
  public cargando: boolean = false;

  //variables de session y iniciales
  public s_idcon: string;
  public s_idmod: string;
  public s_idrol: number;
  public s_user: string;
  public s_nomuser: string;
  public s_usu_id: string;
  public dts_roles_usuario: any;
  public dtsListaUsuarioExterno: any;

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
  public s_usu_id_sipta: any;

  public m_gestion: any;
  public m_mes_actual: any;

  public m_pagina: number;

  //variables del componente
  public m_fecha_actual: any;
  public m_usuario_configuracion: any;
  public dts_institucion: any;
  public dts_institucionSD: any;
  public dts_cargo: any;
  public dts_Documentos: any;
  public dts_correspondencia: any;
  public dts_configuracion: any;
  public m_institucion: string;
  public id_institucion: any;
  public dts_cargofiltrada: any;
  public dts_Anexo: any;
  public m_cargo: string;
  public m_nombre_cargo: any;
  public m_nombre: any;
  public m_descripcion: any;
  public m_documento: any;
  public m_anexo: any;
  public m_idcorrespondencia: any;
  public m_idanexo: any;
  public m_numero: any;
  public m_idusuarioexterno: any;
  public m_limitardias: any;
  public m_tipodocumentohc: any;

  public dts_ListaTipoDocumentoHr: any;

  public m_cite: any;
  public m_referencia: any;
  public m_idusuariode: any;
  public m_idusuariopara: any;
  public m_observaciones: any;
  public m_idconfiguracion: any;
  public m_nombrecompleto: any;
  public m_recepcionado: any;
  public milista: any;
  public m_tipo: any = "Externa";
  public m_filtroInstitucion: any;
  public dts_filtroCargo: any;
  public m_NombreInstitucion: any;
  public m_NombreCargo: any;
  public sw_institucion = false;
  public sw_usuarioexterno = false;
  public sw_cargo = false;
  public btn_agregarcargo = false;
  public btn_agregarusuario = false;
  public m_idcargo = false;
  public m_gestionhr = false;
  public m_usuario_externo: string;

  public controlClick: number = 0;

  public dts_proyectosflujo: any;
  public m_nombreProyecto: string;
  public m_idProyecto: number;

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
    this.m_limitardias = 0;
    this.sw_usuarioexterno = false;
    this.sw_institucion = false;
    this.sw_cargo = false;
    this.m_limitardias = 0;
    this.m_tipodocumentohc = "DOCUMENTACION";
    this.dts_Anexo = [];
    this.dts_institucion = [];
    //console.log(this.id_institucion);
    this.paneles("VER_INICIO");

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
      })
      .then((dts) => {
        return this.RolesAsignados(this.dtsDatosConexion[0]._usu_id);
      })
      .then((dts) => {
        this.dts_roles_usuario = dts;
        return this.listaTipodocumentohr();
      })
      .then((dts) => {
        this.dts_ListaTipoDocumentoHr = dts;
        return this.listaConfiguracion();
      })
      .then((dts) => {
        this.dts_configuracion = dts;
        this.m_idconfiguracion = this.dts_configuracion[0].usu_id;
        this.m_nombrecompleto =
          this.dts_configuracion[0].nombre_completo_usuario;
        return this.listarInstitucion();
      })
      .then((dts) => {
        this.dts_institucion = dts;
        this.dts_institucionSD = alasql(`select distinct institucion from ?`, [
          this.dts_institucion,
        ]);
      })
      .catch(falloCallback);

    this.listaProyectosFlujo();
  }
  paneles(string) {
    if (string == "GUARDAR_CORRESPONDENCIA_EXTERNA") {
      $("#pnl_anexos").show();
      $("#pnl_cabecera").hide();
      $("#pnl_Guardarregistros").hide();
      $("#pnl_Guardarregistros").modal("hide");
    }

    if (string == "VER_INICIO") {
      //this.limpiar();
      $("#pnl_anexos").hide();
      $("#pnl_cabecera").show();
      $("#btnModificarAnexo").hide();
      this.limpiar();
      this._fun.limpiatabla(".dt-anexo");
    }
    if (string == "EDITAR_ANEXO") {
      $("#btnModificarAnexo").show();
      $("#btnInsertarAnexo").hide();
      //$('#pnl_cargo').hide();
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
  }
  limpiar() {
    this.m_cite = "";
    this.m_institucion = "";
    this.m_cargo = "";
    this.m_nombre = "";
    this.m_referencia = "";
    this.m_observaciones = "";
    this.m_limitardias = 0;
    this.m_tipodocumentohc = "DOCUMENTACION";
    this.dts_Anexo = [];
    this.dtsListaUsuarioExterno = [];
    this.m_usuario_externo = "";
    this.m_nombreProyecto = null;
    this.m_gestion = new Date().getFullYear();
    this.m_numero = "";
    this.m_idProyecto = null;
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
                //console.log(this.s_usu_id_sipta);
                //console.log(this.s_usu_id);
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
  transformFecha(date) {
    //return this.datePipe.transform(date, 'HH:mm:ss');
    return this.datePipe.transform(date, "dd/MM/yyyy  HH:mm");

    //whatever format you need.
  }
  FechaLiteral(f) {
    return this._fun.FechaLiteral(f);
  }
  listaConfiguracion() {
    return new Promise((resolve, reject) => {
      this._sipta.getListaConfiguracion().subscribe(
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
          reject(this.prop_msg);
        }
      );
    });
  }
  listarInstitucion() {
    return new Promise((resolve, reject) => {
      this._sipta.getListaInstitucion().subscribe(
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
          reject(this.prop_msg);
        }
      );
    });
  }

  listaCargo() {
    console.log("lista cargo", this.dts_cargofiltrada);
    this._sipta.getListacargo_filtro(this.dts_cargofiltrada).subscribe(
      (result: any) => {
        console.log(result);

        if (Array.isArray(result) && result.length > 0) {
          $("#m_cargo").prop("disabled", false);
          $("#m_idusuarioexterno").prop("disabled", false);
          this.dts_cargo = this._fun.RemplazaNullArray(result);
        } else {
          // this.prop_msg = 'Alerta: No existen registros....';
          // this.prop_tipomsg = 'danger';
          // this._msg.formateoMensaje('modal_danger', this.prop_msg);
          $("#m_cargo").prop("disabled", true);
          $("#m_idusuarioexterno").prop("disabled", true);
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
  filtraCargo() {
    this.m_cargo = "";
    this.m_idusuarioexterno = "";
    this.dts_cargo = [];
    this.dtsListaUsuarioExterno = [];
    const dts = this.dts_institucion.filter(
      (item) => item.institucion == this.m_institucion.toUpperCase()
    );
    if (dts.length > 0) {
      this.dts_cargofiltrada = dts[0]["institucion"]; // dts[0]['IdInstitucion'];//bonk
      this.listaCargo();
    } else {
      // this._msg.formateoMensaje('modal_warning', 'La empresa ingresada no se encuentra en la Base de Datos');
      this.toastr.warning(
        "La empresa ingresada no se encuentra en la Base de Datos",
        "Alerta!",
        { positionClass: "toast-top-right", timeOut: 4000, progressBar: true }
      );
    }
  }
  listaTipodocumentohr() {
    return new Promise((resolve, reject) => {
      this._sipta.listaTipodocumentohr().subscribe(
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
          reject(this.prop_msg);
        }
      );
    });
  }
  listaUsuarioExterno(institucion, cargo) {
    console.log('listando UE',institucion,cargo);
    
    this._sipta
      .listaUsuarioExterno(
        (institucion || "").toUpperCase(),
        (cargo || "").toUpperCase()
      )
      .subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            this.dtsListaUsuarioExterno = this._fun.RemplazaNullArray(result);
            console.log('lista ue',this.dtsListaUsuarioExterno)
          } else {
            // this._msg.formateoMensaje('modal_warning', 'Cargo nuevo se creará automáticamente');
            this.toastr.warning(
              "Cargo nuevo se creará automáticamente",
              "Alerta!",
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
          // if (this.errorMessage) this._msg.formateoMensaje('modal_danger', 'Error: '+this.errorMessage);
          console.log(error);
        }
      );
  }
  listarDocumentos() {
    this._sipta.getListaDocumentos().subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_Documentos = this._fun
            .RemplazaNullArray(result)
            .sort(
              (a, b) =>
                a.codigodetalleclasificador - b.codigodetalleclasificador
            );
        } else {
          // this._msg.formateoMensaje('modal_warning', 'Nombre se creará automáticamente');
          this.toastr.warning("Nombre se creará automáticamente", "Alerta!", {
            positionClass: "toast-top-right",
            timeOut: 4000,
            progressBar: true,
          });
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

  Verifica() {
    if (!this.m_cite) {
      this._msg.formateoMensaje("modal_danger", "Debe registrar el CITE.");
      return;
    }
    if (!this.m_idusuarioexterno) {
      this._msg.formateoMensaje(
        "modal_danger",
        "Debe registrar todos los datos correspondientes a REMITENTE."
      );
      return;
    }
    // if (!this.m_idProyecto && this.m_tipodocumentohc =='PLANILLA DE AVANCE O CERTIFICADO DE AVANCE') {
    //   this._msg.formateoMensaje('modal_danger', 'Debe seleccionar un Proyecto Valido.');
    //   return;
    // }
    $("#pnl_Guardarregistros").modal("show");
  }

  insertarCorrespondencia() {
    this.controlClick++;
    if (this.controlClick == 1) {
      this._sipta
        .getInsertarCorrespondencia(
          this.m_tipo,
          (this.m_cite || "").toUpperCase(),
          (this.m_referencia || "").toUpperCase(),
          this.s_usu_id,
          this.m_idconfiguracion,
          (this.m_observaciones || "").toUpperCase(),
          this.m_idusuarioexterno,
          (this.m_tipodocumentohc || "").toUpperCase(),
          this.m_limitardias,
          "0"
        )
        .subscribe(
          (result: any) => {
            if (Array.isArray(result) && result.length > 0) {
              if (!result[0].message.startsWith("ERROR")) {
                this.dts_correspondencia = this._fun.RemplazaNullArray(result);
                this.m_numero =
                  this.dts_correspondencia[0].message.split("-")[3];
                this.m_gestionhr =
                  this.dts_correspondencia[0].message.split("-")[4];
                this.m_idcorrespondencia =
                  this.dts_correspondencia[0].message.split("-")[2];
                this.paneles("GUARDAR_CORRESPONDENCIA_EXTERNA");
                this.listarDocumentos();
                if (
                  this.m_tipodocumentohc.startsWith(
                  "PLANILLA DE AVANCE O CERTIFICADO DE AVANCE")
                ) {
                  console.log("INGRESA A RELACION PROYECTO HOJA DE RUTA");
                  this.InsertarRelacionProyectoHr();
                } else {
                  console.log("NO INGRESA A RELACION PROYECTO HOJA DE RUTA");
                }
              } else {
                this._msg.formateoMensaje("modal_danger", result[0].message);
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
    } else {
      console.log(this.controlClick);
      //this.prop_msg = 'Ya se registró la correspondencia.';
      //this.prop_tipomsg = 'danger';
      //this._msg.formateoMensaje('modal_danger', this.prop_msg);
    }
  }
  InsertarAnexo() {
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
            this.ListaAnexo();
            this.limpiaranexo();
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
        "Error!",
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
    //console.log('editaanexo',this.m_idanexo, this.m_idcorrespondencia, this.m_anexo, this.m_descripcion)
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
        "Error!",
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
            this.dts_correspondencia = this._fun.RemplazaNullArray(result);
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
  preAgregarInstitucion() {
    this.sw_institucion = true;
    $("#modal_Institucion").modal("show");
  }

  preAgregarCargo() {
    //console.log('cargoaaa')
    this.sw_cargo = true;
    $("#modal_Cargo").modal("show");
  }
  preAgregarUsuarioExterno() {
    var dts = this.dts_cargo.filter((item) => item.cargo == this.m_cargo);
    this.m_idcargo = dts[0]["IdCargoInstitucion"]; //ya no deberia usaarse idcargo, solo la descripcionde manera temproal para insertar todo en usuario externo

    this.sw_usuarioexterno = true;
    //console.log('id institucion',this.dts_cargofiltrada);
    //console.log('id cargo',this.m_idcargo);
    setTimeout(() => {
      $("#modal_UsuarioExterno").modal("show");
    }, 20);
  }
  cerrar_ModalInstitucion() {
    this.sw_institucion = false;
    this.dts_institucion = null;
    $("#modal_Institucion").modal("hide");
    this.listarInstitucion().then((dts) => {
      this.dts_institucion = dts;
    });
  }

  cerrar_ModalCargo() {
    this.sw_cargo = false;
    this.dts_cargo = null;
    $("#modal_Cargo").modal("hide");
    this.listaCargo();
  }
  cerrar_ModalUsuarioExterno() {
    this.sw_usuarioexterno = false;
    this.dtsListaUsuarioExterno = null;
    $("#modal_UsuarioExterno").modal("hide");
    this.listaUsuarioExterno(this.m_institucion, this.m_cargo);
  }
  terminar_correspondencia() {
    this.controlClick = 0;
    // window.open(this.url_reporte + '/modulos/sipta/rptHojadeRuta.php?gestion='+this.m_gestionhr+'&nro=' + this.m_numero+'&pag=1', 'blank');
    this.generarReporte("01");
    //this.m_remitente='0';
    //this.m_sumacite='0';
    //this.m_fecha_actual='0';
    this.m_idusuarioexterno = null;
    this.m_referencia = "";
    this.m_observaciones = "";
    this.m_anexo = "";
    this.m_descripcion = "";
    this.m_limitardias = 0;
    this.m_tipodocumentohc = "DOCUMENTACION";
    this._fun.limpiatabla(".dt-anexo");
    //this._fun.limpiatabla('.dt-listaitemcorrespondencia');
    this.paneles("VER_INICIO");
  }

  // Procedimientos para realizar el registro de CARGO y USUARIO automaticamente
  ModalRegAutomatico(opcion: string) {
    if (opcion == "PreRegistro") {
      $("#modal_RegAutomatico").modal("show");
    } else {
      $("#modal_RegAutomatico").modal("hide");
    }
  }

  registrar_automaticamente() {
    this.controlClick++;
    if (this.controlClick == 1) {
      this._sipta
        .getRegAutomatico(this.dts_cargofiltrada, this.s_usu_id)
        .subscribe(
          //bonk
          (result: any) => {
            //console.log(result);
            if (result[0]["ACCION"] == "CARGO CREADO") {
              this.filtraCargo();
              this.m_cargo = "SD";
              setTimeout(() => {
                this.listaUsuarioExterno(this.m_institucion, this.m_cargo);
                setTimeout(() => {
                  var dts = this.dtsListaUsuarioExterno.filter(
                    (item) => item.nombre == "SD"
                  );
                  this.m_idusuarioexterno = dts[0]["id_usuario_externo"];
                }, 100);
              }, 150);
              // this._msg.formateoMensaje('modal_success', 'SE REGISTRÓ DE FORMA CORRECTA');
              this.toastr.success(
                "SE REGISTRÓ DE FORMA CORRECTA",
                "Registro Automático",
                {
                  positionClass: "toast-top-right",
                  timeOut: 4000,
                  progressBar: true,
                }
              );
            } else {
              // this._msg.formateoMensaje('modal_danger', 'YA EXISTE UN REGISTRO SIN DATOS, VERIFIQUE POR FAVOR.');
              this.toastr.error(
                "YA EXISTE UN REGISTRO SIN DATOS, VERIFIQUE POR FAVOR.",
                "Registro Automático",
                {
                  positionClass: "toast-top-right",
                  timeOut: 4000,
                  progressBar: true,
                }
              );
            }
            this.controlClick = 0;
            $("#modal_RegAutomatico").modal("hide");
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

  determinar_idue() {
    console.log(
      "para determinar UE",
      this.dtsListaUsuarioExterno,
      this.m_institucion,
      this.m_cargo,
      this.m_usuario_externo
    );
    const filtrado = this.dtsListaUsuarioExterno.filter(
      (f) =>
        f.institucion.trim() == this.m_institucion.trim() &&
        f.cargo.trim() == this.m_cargo.trim() &&
        f.nombre.trim() == this.m_usuario_externo.trim()
    );
    if (filtrado[0]) this.m_idusuarioexterno = filtrado[0].id_usuario_externo;
    console.log('antes de',filtrado[0],this.m_idusuarioexterno,this.m_institucion,this.m_cargo,this.m_usuario_externo);
    
    if (
      !filtrado[0] &&
      !this.m_idusuarioexterno &&
      this.m_institucion &&
      this.m_cargo &&
      this.m_usuario_externo
    ) {
      this._sipta
        .getInsertaRemitente(
          this.m_institucion.toUpperCase(),
          this.m_cargo.toUpperCase(),
          this.m_usuario_externo.toUpperCase(),
          this.s_usu_id
        )
        .subscribe(
          (result: any) => {
            //console.log(result);
            if (result[0].message.startsWith("CORRECTO")) {
              // this._msg.formateoMensaje('modal_success', 'Remitente creado con éxito');
              this.toastr.success(
                "Remitente creado con éxito",
                "Registro Automático",
                {
                  positionClass: "toast-top-right",
                  timeOut: 4000,
                  progressBar: true,
                }
              );
              this.m_idusuarioexterno = result[0].message.split("-")[2];
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
    // this.m_idusuarioexterno = this.dtsListaUsuarioExterno[0].id_usuario_externo;
    console.log(this.m_idusuarioexterno);
  }

  generarReporte(tipo: string) {
    this.cargando = true;
    console.log("generando reporte", tipo, this.m_numero, this.m_gestion);
    let nombre = `HR_${this.m_numero}_${this.m_gestion}`;
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
      nombre = `HR_${this.m_numero}_${this.m_gestion}_${pagina}`;
      url = "3_reportePaginaExtra/";
    }
    const miData = {
      tipoReporte: tipo,
      numero: this.m_numero,
      gestion: this.m_gestion,
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

  personaNatural() {
    this.m_institucion = "PERSONAL";
    this.m_cargo = "PERSONA NATURAL";
  }

  listaProyectosFlujo() {
    this._seguimiento.listaProyectosFlujo().subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_proyectosflujo = this._fun.RemplazaNullArray(result);
          console.log("proyectos", this.dts_proyectosflujo);
          // this.armaDatosCombo(this.dts_proyectosflujo);
        } else {
          console.log("sin proyectos");
          this.cargando = false;
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        console.log(this.errorMessage);
      }
    );
  }

  validarProyecto() {
    this.m_idProyecto = null;
    const proyecto = this.dts_proyectosflujo.filter(
      (f) => f._nombreproyecto === this.m_nombreProyecto
    )[0];
    this.m_idProyecto = proyecto ? proyecto._id_proyecto : null;
    if(proyecto) this.m_referencia = this.m_nombreProyecto;
  }

  InsertarRelacionProyectoHr() {
    console.log(this.m_idcorrespondencia, this.m_numero, this.m_gestion);
    const dataHR = {
      gestion: this.m_gestion,
      fid_correspondencia: this.m_idcorrespondencia,
      fid_proyecto: this.m_idProyecto,
      nro_hr: this.m_numero,
      tipo_hr:this.m_tipodocumentohc,
      usuario_registro:this.s_usu_id,
    };
    this._sipta.insertaProyectoHr(dataHR).subscribe(
      (result: any) => {
        console.log("inserta relacion flujo", result);
      },
      (error) => {
        this.errorMessage = <any>error;
        console.log(this.errorMessage);
      }
    );
  }
}
