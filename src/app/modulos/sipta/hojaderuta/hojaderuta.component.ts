import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Inputmask from "inputmask";
import { Globals } from "../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import alasql from "alasql";
import { ToastrService } from "ngx-toastr";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";
import { SiptaService } from "../../sipta/sipta.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-hojaderuta",
  templateUrl: "./hojaderuta.component.html",
  styleUrls: ["./hojaderuta.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SiptaService,
  ],
})
export class HojaderutaComponent implements OnInit {
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
  public s_usu_id_sipta: string;
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
  public m_pagina: number;

  /*VARIABLES DEL MODULO*/
  public m_nrohojaderuta: any;
  public dts_cabecera: any;
  public dts_hijos: any;
  public m_cite: any;
  public m_recepcionado: any;
  public m_remitente: any;
  public m_destinatario: any;
  public m_referencia: any;
  public m_anexos: any;
  public m_fecha: any;
  public m_hora: any;
  public m_descripcionrespuesta: any;
  public m_fecharespuesta: any;
  public m_idcorrespondencia: any;

  public m_idremitente: any;
  public m_iddestinatario: any;
  public m_tipo: any;
  public m_estado: any;
  public m_estadorespuesta: any;
  public m_estadosituacion: any;
  public m_existeproveido: any;

  public dtsListaProveidos: any;
  public dtsUsuario: any;
  public dtsUsuarioFiltrado: any;

  public dtsRegitroProveido: any;
  public NroRegistrosProveido: any;

  public m_prov_emisor: any;
  public m_prov_receptor: any;
  public m_prov_contenido: any;
  public m_prov_fecha: any;
  public m_prov_hora: any;
  public m_prov_estadosituacion: any;
  public m_prov_fecharecibido: any;
  public m_prov_horarecibido: any;
  public m_prov_estadorecibido: any;
  public m_prov_fecharespuesta: any;
  public m_prov_horarespuesta: any;
  public m_prov_estadorespuesta: any;

  public m_prov_idemisor: any;
  public m_prov_idreceptor: any;

  public m_prov_idproveido: any;
  public m_prov_idpadre: any;
  public m_prov_idcorrespondencia: any;
  public dts_busquedareferencia: any;

  public m_referenciabusqueda: any = "";
  public m_busremitente: any = "";
  public m_busTipoDoc: any = "";
  public m_buscaCite: any = "";

  /*paneles*/
  public pnlModalEliminaProveido = false;
  public pnlModalEditarProveido = false;
  public pnlListaProveidos = false;

  /*VARIABLEA PARA LA ADMINITRACION POR ROLES*/
  public vbtn_bitacora = false;
  public vcolumnas_edicion = false;
  public vbtn_hojaderuta = false;

  public dts_ListaTipoDocumentoHr: any;
  public cargando: boolean = false;

  public modoConsulta: boolean = false;
  public IdProyecto: number;
  dtsUsuarioExterno: any;
  m_parametro_usuario_externo: any;
  m_remitenteexterno: any;
  m_idremitenteexterno: any;
  comboSeleccion: any;
  mostrarRevision: boolean = false;

  dtsProyectos: any[] = [];
  elProyecto: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _sipta: SiptaService,
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
    $("#pnl_busqueda").show();
    $("#pnl_hjcabecera").hide();
    $("#pnl_hjproveidos").hide();
    $("#modalEliminaProveido").modal("hide");
    $("#pnl_resutadohr").hide();
    $("#pnl_resutadoref").hide();

    function falloCallback(error) {
      console.log("Falló con " + error);
    }
    this.mask_numerodecimal = new Inputmask("9.9{1,2}");
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
        return this.listaTipodocumentohr();
      })
      .then((dts6) => {
        this.dts_ListaTipoDocumentoHr = dts6;
        this.manejoRoles();
      })
      .catch(falloCallback);
    this.cargarmascaras();
  }
  /*******************************************************************************/
  /*MASCARAS
  /*******************************************************************************/
  cargarmascaras() {
    const gestion = document.getElementById("gestion");
    const hojaruta = document.getElementById("nrohojaderuta");
    const fecha = document.getElementById("fecha");
    const fecha_respuesta = document.getElementById("fecharespuesta");
    this.mask_gestion.mask(gestion);
    this.mask_numero.mask(hojaruta);
    //this.mask_fecha.mask(fecha);
    //this.mask_fecha.mask(fecha_respuesta);
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
              if (result[0]["IDROL"] !== "") {
                this.s_idrol = result[0]["IDROL"];
                this.s_user = result[0]["USU_USER"];
                this.s_nomuser = result[0]["USU_NOM_COM"];
                this.s_usu_id_sipta = result[0]["_usu_id_sipta"];
                //console.log(this.s_usu_id_sipta);
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
              "Error: La conexion no es valida, contáctese con el área de sistemas";
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
          if (result[0]["fechasrv"] !== "") {
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
  transformAnio(date) {
    return this.datePipe.transform(date, "YYYY");
    //whatever format you need.
  }
  HoraServidor() {
    return new Promise((resolve, reject) => {
      this._autenticacion.gethoraservidor().subscribe(
        (result: any) => {
          if (result[0]["HORA"] !== "") {
            const hora = this.transformHora(result[0]["HORA"]);
            resolve(hora);
            return hora;
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

  FechaLiteral(f) {
    return this._fun.FechaLiteral(f);
  }
  manejoRoles() {
    var lineas = this.dts_roles_usuario.length;
    var datos = this.dts_roles_usuario;
    for (var i = 0; i < lineas; i++) {
      var rol = datos[i].idrol;
      if (rol == 16 || rol == 3) {
        // rol 16 bitacora 3 adm sipta
        this.vbtn_bitacora = true;
        this.vbtn_hojaderuta = true;
      }
      if (rol == 3 || rol == 23) {
        // rol 3 adm sipta rol 23 soporte sipta
        this.vcolumnas_edicion = true;
        this.vbtn_hojaderuta = true;
      }
      if (rol == 3 || rol == 22) {
        // rol 3 adm sipta rol 22 usuario correspondencia
        this.vbtn_hojaderuta = true;
      }
      if (rol == 3 || rol == 21) {
        // rol 3 adm sipta rol 22 usuario correspondencia
        this.vbtn_hojaderuta = true;
      }
    }
  }
  /*******************************************************************************/
  /* COMPONENTE
  /*******************************************************************************/
  BusquedaHojadeRuta() {
    this.CargarUsuarios();
    if (this.m_nrohojaderuta != "" && this.m_nrohojaderuta != undefined) {
      if (this.m_gestion == "") {
        this._msg.formateoMensaje(
          "modal_info",
          "Debe ingresar la gestion en la que desea buscar"
        );
        return;
      }
      this.BusquedaHojadeRutaNro();
      $("#pnl_resutadohr").show();
      $("#pnl_resutadoref").hide();
    } else {
      this.dts_busquedareferencia = [];
      if (
        this.m_referenciabusqueda == "" &&
        this.m_busremitente == "" &&
        this.m_busTipoDoc == "" &&
        this.m_buscaCite == ""
      ) {
        this._msg.formateoMensaje(
          "modal_info",
          "Debe ingresar algún parámetro de búsqueda"
        );
        return;
      }
      // if (this.m_busTipoDoc == '') {
      if (
        this.m_busremitente.length < 3 &&
        this.m_referenciabusqueda.length < 3 &&
        this.m_buscaCite.length < 3 &&
        !this.m_busTipoDoc
      ) {
        this._msg.formateoMensaje(
          "modal_info",
          "Datos insuficientes, verifique por favor."
        );
        return;
      }
      // }
      setTimeout(() => {
        $("#pnl_resutadoref").hide();
        this.BusquedaReferencia();
      }, 50);
    }
  }
  FiltroBusquedaHojadeRuta(dts) {
    this.m_nrohojaderuta = dts.numero;
    this.m_gestion = dts.gestion;
    this.BusquedaHojadeRuta();
  }
  BusquedaHojadeRutaNro() {
    this.cargando = true;
    this._sipta
      .getMuetraHojadeRuta(this.m_gestion, this.m_nrohojaderuta)
      .subscribe(
        (result: any) => {
          console.log("resultado de busqueda", result);

          if (Array.isArray(result) && result.length > 0) {
            this.comprobarRelacion(this.m_nrohojaderuta);
            $("#pnl_busqueda").hide();
            $("#pnl_hjcabecera").show();
            $("#pnl_hjproveidos").show();
            this.dts_cabecera = result[0];
            this.m_cite = this.dts_cabecera.ruta;
            this.m_idcorrespondencia = this.dts_cabecera.id_correspondencia;
            this.m_recepcionado = this.dts_cabecera.nombre_completo_usuario_de;

            this.m_destinatario =
              this.dts_cabecera.nombre_completo_usuario_para;
            this.m_referencia = this.dts_cabecera.referencia;
            this.m_anexos = this.dts_cabecera.anexos_resumen;

            this.m_fecha = this._fun.transformDateOf_yyyymmdd(
              this.dts_cabecera.fecha
            );
            this.m_hora = this.dts_cabecera.hora.substring(0, 5);

            this.m_descripcionrespuesta = this.dts_cabecera.descripcion;
            this.m_fecharespuesta = this._fun.transformDateOf_yyyymmdd(
              this.dts_cabecera.fecha_respuesta
            );
            if (this.dts_cabecera.tipo !== "Externa") {
              this.m_idremitente = this.dts_cabecera.fid_usuario_de;
              this.m_remitente = this.dts_cabecera.nombre_completo_usuario_de;
            } else {
              this.m_idremitente = this.dts_cabecera.fid_usuario_externo_de;
              this.m_remitente = this.m_remitente =
                this.dts_cabecera.nombre_completo_usuario_externo_de;
            }
            this.m_destinatario =
              this.dts_cabecera.nombre_completo_usuario_para;
            this.m_iddestinatario = this.dts_cabecera.fid_usuario_para;
            this.m_tipo = this.dts_cabecera.tipo;
            this.m_estado = this.dts_cabecera.estado;
            this.m_estadorespuesta = this.dts_cabecera.estado_respuesta;
            this.m_estadosituacion = this.dts_cabecera.estado_situacion;
            this.m_existeproveido = this.dts_cabecera.existe_proveido;
            this.m_remitenteexterno =
              this.dts_cabecera.nombre_completo_usuario_externo_de;
            this.m_idremitenteexterno = this.dts_cabecera.fid_usuario_externode;
            this.m_parametro_usuario_externo =
              this.dts_cabecera.nombre_completo_usuario_externo_de;

            if (this.m_tipo == "Externa") {
              this.BusquedaUsuarioExterno().then((dts) => {
                this.dtsUsuarioExterno = dts;
                console.log(
                  "Lista segun parametro usuario externo",
                  this.dtsUsuarioExterno
                );
                if (this.m_remitenteexterno != "") {
                  //this.IdRemitenteExterno();
                  this.armaDatosCombo(dts);
                }
              });
            }

            console.log("bus remitente ext", this.m_remitenteexterno);

            this.ListaProveidos(this.m_idcorrespondencia);
            this.pnlListaProveidos = true;
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
  BusquedaReferencia() {
    this.cargando = true;
    this.cargando = true;
    this.dts_busquedareferencia = [];
    this._sipta
      .BuscaReferencia(
        this.m_gestion,
        this.m_referenciabusqueda,
        this.m_busremitente,
        this.m_busTipoDoc,
        this.m_buscaCite
      )
      .subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            console.log("el proy sel", this.elProyecto, result);

            if (this.elProyecto)
              result = result.filter(
                (f) =>
                  f.id_correspondencia == this.elProyecto.fid_correspondencia
              );
            this.dts_busquedareferencia = result;
            console.log("buscando", this.dts_busquedareferencia);

            this._fun.limpiatabla(".dt-resultadoreferencia");
            setTimeout(() => {
              let confiTable = this._fun.CONFIGURACION_TABLA_V4(
                [10, 20, 50, 100, 150, 200],
                false,
                50,
                0,
                "desc"
              );
              var table = $(".dt-resultadoreferencia").DataTable(confiTable);
              this._fun.inputTable(table, [0, 1, 2, 5, 6, 7, 8]);
              this._fun.selectTable(table, [3, 4]);
              $("#pnl_resutadohr").hide();
              $("#pnl_resutadoref").show();
              this.cargando = false;
            }, 5);
          } else {
            this.cargando = false;
            this._msg.formateoMensaje(
              "modal_info",
              "No se encontraron registros"
            );
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
  ActualizarCabecera() {
    if (this.m_tipo == "Externa") {
      if (
        this.m_anexos == "" ||
        this.m_remitenteexterno == "" ||
        this.m_referencia == "" ||
        this.m_destinatario == ""
      ) {
        this._msg.formateoMensaje(
          "modal_info",
          "Datos insuficientes, verifique por favor."
        );
      }
    }
    if (this.m_tipo == "Interna") {
      if (
        this.m_anexos == "" ||
        this.m_remitente == "" ||
        this.m_referencia == "" ||
        this.m_destinatario == ""
      ) {
        this._msg.formateoMensaje(
          "modal_info",
          "Datos insuficientes, verifique por favor."
        );
      }
    }

    this.cargando = true;
    this._sipta
      .getActualizarCabecera(
        this.m_idcorrespondencia,
        this.m_idremitente,
        this.m_iddestinatario,
        (this.m_referencia || "").toUpperCase(),
        (this.m_anexos || "").toUpperCase(),
        (this.m_fecha || "").toUpperCase(),
        (this.m_descripcionrespuesta || "").toUpperCase(),
        (this.m_fecharespuesta || "").toUpperCase(),
        this.m_estado,
        (this.m_cite || "").toUpperCase(),
        this.m_hora,
        this.m_tipo,
        this.m_estadorespuesta,
        this.m_estadosituacion,
        this.m_existeproveido,
        this.m_idremitenteexterno
      )
      .subscribe(
        (result: any) => {
          console.log("actualizar cabecera", result);

          if (result.length > 0 && result[0].message.startsWith("CORRECTO")) {
            this._msg.formateoMensaje(
              "modal_success",
              "Info: Se Actualizo de Forma Correcta"
            );
            this.BusquedaHojadeRutaNro();
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
  ListaProveidos(idcorrespondencia) {
    this.cargando = true;
    this._sipta.getListaProveido(idcorrespondencia).subscribe(
      (result: any) => {
        console.log("cargando proveidos", result);

        this.NroRegistrosProveido = result.length;

        $(".dt-Proveidos").DataTable().destroy();

        this.dtsListaProveidos = result;

        const confiTable = this._fun.CONFIGURACION_TABLA_V2(
          [10, 20],
          false,
          0,
          "asc"
        );
        setTimeout(() => {
          $(".dt-Proveidos").DataTable(confiTable);
        }, 500);
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
  LimpiarBusqueda() {
    this.m_nrohojaderuta = "";
    this.m_referenciabusqueda = "";
    this.m_busremitente = "";
    this.m_busTipoDoc = "";
    this.m_buscaCite = "";
    this.dts_busquedareferencia = [];
    $("#pnl_resutadohr").hide();
    $("#pnl_resutadoref").hide();
    this.mostrarRevision = false;
    this.elProyecto = null;
  }
  VolverAtras() {
    $("#pnl_busqueda").show();
    $("#pnl_hjcabecera").hide();
    $("#pnl_hjproveidos").hide();
    this.LimpiarBusqueda();
  }
  BusquedaUsuario(usuario) {
    // console.log('aqui',usuario)
    if (usuario.length >= 2) {
      this._sipta.getListaUsuarios(usuario.toUpperCase()).subscribe(
        (result: any) => {
          if (result.length > 0) {
            this.dtsUsuario = result;
          } else {
            // alert('No se encuentran registros con el criterio de busqueda');
            this._msg.formateoMensaje(
              "modal_info",
              "Info: No se encuentran registros con el criterio de busqueda"
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
  }
  BusquedaUsuarioExterno() {
    this.cargando = true;
    return new Promise((resolve, reject) => {
      if (this.m_parametro_usuario_externo.length >= 4) {
        this._sipta
          .getListaUsuarioExternoMantenimiento(
            this.m_parametro_usuario_externo.toUpperCase()
          )
          .subscribe(
            (result: any) => {
              if (result.length > 0) {
                this.dtsUsuarioExterno = result;
                if (Array.isArray(this.dtsUsuarioExterno)) {
                  this.armaDatosCombo(this.dtsUsuarioExterno);
                  $("#btnActualizarCabecera").prop("disabled", false);
                  this.cargando = false;
                }

                resolve(result);
              } else {
                this.comboSeleccion = [];
                $("#btnActualizarCabecera").prop("disabled", true);

                this.prop_msg =
                  "Error: La conexion no es valida, contáctese con el área de sistemas";

                this._msg.formateoMensaje(
                  "modal_info",
                  "Info: No se encuentran registros con el criterio de busqueda"
                );
                this.cargando = false;
                resolve(this.prop_msg);
              }
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
    });
  }
  armaDatosCombo(dts) {
    var combo = new Array(dts.length);

    dts.forEach((element) => {
      let registro = {
        id: element.id_usuario_externo,
        text: element.dato_completo,
      };
      combo.push(registro);
    });
    this.comboSeleccion = combo;
    this.comboSeleccion = this.comboSeleccion.filter(function (el) {
      return el != null;
    });

    //return this.comboSeleccion;
  }
  CargarUsuarios() {
    this._sipta.getListaUsuario().subscribe(
      (result: any) => {
        console.log("cargando usuarios", result);

        if (result.length > 0) {
          this.dtsUsuario = result;
        } else {
          // alert('No se encuentran registros con el criterio de busqueda');
          this._msg.formateoMensaje(
            "modal_info",
            "Info: No se encuentran registros con el criterio de busqueda"
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
  IdRemitente() {
    this.dtsUsuarioFiltrado = this.dtsUsuario.filter(
      (item) => item.nombre_completo_usuario === this.m_remitente
    );
    this.m_idremitente = this.dtsUsuarioFiltrado[0]
      ? this.dtsUsuarioFiltrado[0]["usu_id"]
      : null;
  }
  IdRemitenteExterno() {
    console.log("lista_externo", this.dtsUsuarioExterno);
    console.log("remi_externo", this.m_remitenteexterno);

    this.m_idremitenteexterno = alasql(
      `select * from ? where dato_completo=?`,
      [this.dtsUsuarioExterno, this.m_remitenteexterno]
    )[0]["id_usuario_externo"];

    console.log("id remitente externo", this.m_idremitenteexterno);

    /*
    this.dtsUsuarioFiltrado = this.dtsUsuarioEx.filter(
      (item) => item.nombre_completo_usuario === this.m_remitenteexterno
    );
    this.m_idremitenteexterno = this.dtsUsuarioFiltrado[0]
      ? this.dtsUsuarioFiltrado[0]["usu_id"]
      : null;
      */
  }

  IdDestinatario() {
    this.dtsUsuarioFiltrado = this.dtsUsuario.filter(
      (item) => item.nombre_completo_usuario === this.m_destinatario
    );
    this.m_iddestinatario = this.dtsUsuarioFiltrado[0]
      ? this.dtsUsuarioFiltrado[0]["usu_id"]
      : null;
  }
  PreEliminaProveido(data) {
    this.pnlModalEliminaProveido = true;
    this.dtsRegitroProveido = data;
  }
  ProvIdEmisor() {
    console.log("en proveido emisor", this.dtsUsuario, this.m_remitente);
    this.dtsUsuarioFiltrado = this.dtsUsuario.filter(
      (item) => item.nombre_completo_usuario === this.m_prov_emisor
    );
    this.m_prov_idemisor = this.dtsUsuarioFiltrado[0]
      ? this.dtsUsuarioFiltrado[0]["usu_id"]
      : null;
  }
  ProvIdReceptor() {
    console.log("revisando", this.dtsUsuario, this.m_prov_receptor);

    this.dtsUsuarioFiltrado = this.dtsUsuario.filter(
      (item) => item.nombre_completo_usuario === this.m_prov_receptor
    );
    this.m_prov_idreceptor = this.dtsUsuarioFiltrado[0]
      ? this.dtsUsuarioFiltrado[0]["usu_id"]
      : null;
  }

  EliminaProveido(proveido: any) {
    this.cargando = true;
    this._sipta.getEliminaProveido(proveido).subscribe(
      (result: any) => {
        console.log(result);

        if (result.length > 0 && result[0].message.startsWith("CORRECTO")) {
          this.pnlModalEliminaProveido = false;
          $("#modalEliminaProveido").modal("hide");
          this.ListaProveidos(proveido.fid_correspondencia);
        } else {
          // alert('No se encuentran registros con el criterio de busqueda');
          this._msg.formateoMensaje("modal_info", result[0].message);
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
  MuetraProveido(datos) {
    this.pnlModalEditarProveido = true;
    this.dtsRegitroProveido = datos;
    this.m_prov_idproveido = this.dtsRegitroProveido.id_proveido;
    this.m_prov_idpadre = this.dtsRegitroProveido.fid_padre;
    this.m_prov_idcorrespondencia = this.dtsRegitroProveido.fid_correspondencia;
    this.m_prov_emisor = this.dtsRegitroProveido.nombre_usuario_de;
    this.m_prov_receptor = this.dtsRegitroProveido.nombre_usuario_para;
    this.m_prov_idemisor = this.dtsRegitroProveido.id_usuario_de;
    this.m_prov_idreceptor = this.dtsRegitroProveido.id_usuario_para;
    this.m_prov_contenido = this.dtsRegitroProveido.contenido;
    this.m_prov_fecha = this._fun.transformDateOf_yyyymmdd(
      this.dtsRegitroProveido.fecha
    );
    this.m_prov_hora = this.dtsRegitroProveido.hora.substring(0, 8);
    this.m_prov_estadosituacion = this.dtsRegitroProveido.estado_situacion;
    this.m_prov_fecharecibido = this._fun.transformDateOf_yyyymmdd(
      this.dtsRegitroProveido.fecha_recibido
    );
    this.m_prov_horarecibido = this.dtsRegitroProveido.hora_recibido.substring(
      0,
      8
    );
    this.m_prov_estadorecibido = this.dtsRegitroProveido.estado_recibido;
    this.m_prov_fecharespuesta = this._fun.transformDateOf_yyyymmdd(
      this.dtsRegitroProveido.fecha_respuesta
    );
    this.m_prov_horarespuesta =
      this.dtsRegitroProveido.hora_respuesta.substring(0, 8);
    this.m_prov_estadorespuesta = this.dtsRegitroProveido.estado_respuesta;
    console.log("en muestra", datos, this.m_prov_fecha, this.m_prov_hora);
  }
  ActualizaProveido() {
    this.cargando = true;
    this._sipta
      .getActualizaProveido(
        this.m_prov_idproveido,
        this.m_prov_idpadre,
        this.m_prov_idcorrespondencia,
        this.m_prov_idemisor,
        this.m_prov_idreceptor,
        (this.m_prov_contenido || "").toUpperCase(),
        (this.m_prov_fecha || "").toUpperCase(),
        this.m_prov_hora,
        this.m_prov_estadosituacion,
        (this.m_prov_fecharecibido || "").toUpperCase(),
        this.m_prov_horarecibido,
        this.m_prov_estadorecibido,
        (this.m_prov_fecharespuesta || "").toUpperCase(),
        this.m_prov_horarespuesta,
        this.m_prov_estadorespuesta
      )
      .subscribe(
        (result: any) => {
          if (result.length > 0 && result[0].message.startsWith("CORRECTO")) {
            this.pnlModalEditarProveido = false;
            $("#modalEditarProveido").modal("hide");
            this.ListaProveidos(this.m_prov_idcorrespondencia);
          } else {
            // alert('No se encuentran registros con el criterio de busqueda');
            this._msg.formateoMensaje(
              "modal_info",
              "Info: No se encuentran registros con el criterio de busqueda"
            );
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

  listaTipodocumentohr() {
    return new Promise((resolve, reject) => {
      this._sipta.listaTipodocumentohr().subscribe((result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          var dts = this._fun.RemplazaNullArray(result);
          resolve(dts);
        } else {
          this._msg.formateoMensaje(
            "modal_danger",
            "Alerta: No existen registros"
          );
        }
      });
    });
  }

  ListaAnexos(idcorrespondencia: any) {
    return new Promise((resolve, reject) => {
      this._sipta.getListaAnexo(idcorrespondencia).subscribe(
        (result: any) => {
          resolve(result);
          return result;
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

  generarReporte(tipo: string) {
    this.cargando = true;
    console.log("generando reporte hr", tipo);
    let nombre = `HR_${this.m_nrohojaderuta}_${this.m_gestion}`;
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
      nombre = `HR_${this.m_nrohojaderuta}_${this.m_gestion}_${pagina}`;
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
      numero: this.m_nrohojaderuta,
      gestion: this.m_gestion,
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

  comprobarRelacion(hr: number) {
    this._sipta.buscarFlujoHR({ id: 0 }).subscribe(
      (result: any) => {
        if (
          Array.isArray(result) &&
          result.filter((el) => el.nro_hr == hr).length > 0
        ) {
          this.IdProyecto = this._fun
            .RemplazaNullArray(result)
            .filter((el) => el.nro_hr == hr)[0].fid_proyecto;
          this.modoConsulta = true;
        } else {
          console.log("sin relacion de HR - Proyecto");
        }
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

  mostrarProyectos() {
    if (
      !this.m_busTipoDoc.startsWith(
        "PLANILLA DE AVANCE O CERTIFICADO DE AVANCE"
      )
    )
      return false;
    this.buscarPoryectosHR({ opcion: "T" });
  }

  buscarPoryectosHR(opcion: any) {
    this._sipta.hrProyectos(opcion).subscribe(
      (result: any) => {
        console.log("proyectosHR", result);
        this.dtsProyectos = result.map((p) => {
          p.formateado = `${p.id_sgp}-${p.nombreproyecto}`;
          return p;
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async filtrarHRProyectos(proyecto: string) {
    console.log("el proy", proyecto);
    if (proyecto.split("-")[0])
      this.elProyecto = await this.dtsProyectos.filter(
        (f) => f.id_sgp == proyecto.split("-")[0]
      )[0];
  }
  verRevision() {
    this.mostrarRevision = false;
    $("#modalRevision").modal("show");
    this.mostrarRevision = true; //esto para que cargue bien el subcomponente <app-line></app-line>
  }
}
