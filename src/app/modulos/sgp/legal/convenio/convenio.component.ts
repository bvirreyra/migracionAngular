import { DatePipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Inputmask from "inputmask";
import { Globals } from "../../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import * as moment from "moment";
import { SeguimientoService } from "../../../seguimiento/seguimiento.service";
import { AutenticacionService } from "../../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../../seguridad/mensajes/mensajes.component";
import { AccesosRolComponent } from "../../accesos-rol/accesos-rol.component";
import { SgpService } from "../../sgp.service";
moment.locale("es");

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-convenio",
  templateUrl: "./convenio.component.html",
  styleUrls: ["./convenio.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
    SeguimientoService,
    AccesosRolComponent,
  ],
})
export class ConvenioComponent implements OnInit {
  @Input("inputDts") inputDts: any;
  public cargando = false;
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
  public m_codigoproyecto: any;

  public pnl_listaproyecto = false;
  public pnl_supervision = false;
  public pnl_ampliacionplazo = false;

  public pnl_tecnica = false;
  public pnl_financiero = false;
  public pnl_legal = false;
  public pnl_galeria = false;
  public pnl_listaderecho = false;

  public btn_RegistraConvenio = false;
  public btn_ActualizaConvenio = false;

  /************************************
   * VARIABLES DEL COMPONENTE
   ***********************************/
  public dts_listaConvenio: any;
  public dts_listaempresaversion: any;
  public nombre_proyecto: any;
  public id_sgp: any;
  public id_seguimiento: any;
  public dts_estadoDerechoPropietario: any;
  public id_estadoDerechoPropietario: any;
  public dts_listaimagenes: any;
  public datos_convenio: {
    id_convenio: any;
    fid_proyecto: any;
    fid_sgp: any;
    codigo: any;
    nro_convenio: any;
    fechadesuscripcion: any;
    nombrearchivo: any;
    monto_convenio: any;
    monto_contraparte_beneficiario: any;
    monto_contraparte_gobernacion: any;
    monto_contraparte_municipio: any;
    tipo_convenio: any;
    usrregistro: any;
    idestado: any;
    operacion: any;
    tipo: any;
    repositorio: any;
  };
  public inputArchivo = null;
  public inputAccion: any;
  public inputNombre: any;
  public inputCodigoProy: any;
  public archivoModel: any = {
    TIPO_DOCUMENTO: "",
    CODIGO: "",
    FILE: null,
    NOM_FILE: "",
  };
  public file_empty: File;
  public pnl_descarga = false;
  public pnl_descarga_seguimiento = false;
  public pnl_formulario = false;

  public btn_Registra = false;
  public btn_Actualiza = false;
  public m_tipoclasificador: any;
  public dts_ListaTipoConvenio: any;
  public dts_adjuntos: any;
  public file_resolucionministerial: any;

  public seccionConvenio = false;
  public seccionResolucionAdministrativa = false;

  public tipo_financiamiento: any = null;

  public inputAccionResolucionMinisterial: any = null;
  public inputTipoImagen: any = "";
  public inputRepositorio: any;
  public inputRepositorioRM: any;

  public camposHabilitados: any = {};
  dts_estructuraFinanciamiento: any;
  pnl_FormularioEstructuraFinanciamiento: boolean = false;
  id_proyecto: any;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _sgp: SgpService,
    private _seguimiento: SeguimientoService,

    private globals: Globals,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent,
    private _accesos: AccesosRolComponent,
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
    this.datos_convenio = {
      id_convenio: 0,
      fid_proyecto: 0,
      fid_sgp: 0,
      codigo: "",
      nro_convenio: "",
      fechadesuscripcion: "",
      nombrearchivo: "",
      monto_convenio: 0,
      monto_contraparte_beneficiario: 0,
      monto_contraparte_gobernacion: 0,
      monto_contraparte_municipio: 0,
      tipo_convenio: "",
      usrregistro: 0,
      idestado: 1,
      operacion: "",
      tipo: "",
      repositorio: "",
    };

    this.dts_listaimagenes = [];
  }

  ngOnInit() {
    this.mask_numerodecimal = new Inputmask("9{1,9}.9{1,2}");
    this.mask_fecha = new Inputmask("9{1,2}/9{1,2}/9{1,4}");
    this.mask_numero = new Inputmask("9{1,9}");
    this.mask_gestion = new Inputmask("9999");

    this.nombre_proyecto = this.inputDts["_nombreproyecto"];
    this.id_proyecto = this.inputDts["_id_proyecto"];
    this.id_sgp = this.inputDts["_id_sgp"];
    this.id_seguimiento = this.inputDts["_id_seguimiento"];
    this.tipo_financiamiento = this.inputDts["tipo_financiamiento"];
    console.log("dts", this.inputDts);
    console.log("tipo_financiamiento===>", this.tipo_financiamiento);

    console.log(this.inputDts);
    this.obtenerConexion()
      .then(() => {
        return this._accesos.accesosRestriccionesxRolV2(this.s_usu_id);
      })
      .then((data) => {
        this.camposHabilitados = data;
        console.log("Adm Roles===>", this.camposHabilitados);
        return this.lista_convenio(this.inputDts["_id_proyecto"]);
      })
      .then((dts) => {
        this.dts_listaConvenio = dts;

        console.log("lista convenio", this.dts_listaConvenio);

        //this.datos_convenio.fechadesuscripcion == "" ? this.datos_convenio.fechadesuscripcion:this._fun.transformDateOf_yyyymmdd(this.dts_listaConvenio[0].fecha_convenio);
        if (
          this.dts_listaConvenio.length > 0 &&
          this.dts_listaConvenio[0].id_convenio != ""
        ) {
          if (this.camposHabilitados["_usuario_nuevo_proyecto"] == false) {
            this.inputAccion = "VISUALIZAR_ACTUALIZAR";
          } else {
            this.inputAccion = "VISUALIZAR";
          }
          this.inputNombre = this.dts_listaConvenio[0].nombre_archivo;
          this.inputCodigoProy = this.dts_listaConvenio[0].codigo;
          this.inputTipoImagen = "documento";
          this.paneles("ACTUALIZAR_REGISTRO");
        } else {
          if (this.camposHabilitados["_usuario_nuevo_proyecto"] == false) {
            this.paneles("NUEVO_REGISTRO");
            this.inputAccion = "SUBIR_ARCHIVO";
            this.inputNombre = "Nuevo Archivo";
            this.inputCodigoProy = "";
          } else {
            this.inputAccion = "";
            this.inputNombre = "";
            this.inputCodigoProy = "";
          }
        }
        return this.listaTipoConvenio();
      })
      .then((dts) => {
        this.dts_ListaTipoConvenio = dts;
        console.log("tipo_convenio", this.dts_ListaTipoConvenio);
        return this.lista_adjuntos();
      })
      .then((dts) => {
        this.dts_adjuntos = dts;
        console.log("ARCHIVOS ADJUNTOS", this.dts_adjuntos);
        /*SE VERIFICA SI EXISTE ADJUNTO EL ARCHIVO DE RESOLUCION MINISTERIAL*/
        if (
          this.dts_adjuntos.filter(
            (element) =>
              element.tipo_documento == "resolucion_ministerial" ||
              element.tipo_documento == "resolucion_ministerial_sgp"
          ).length > 0
        ) {
          if (this.camposHabilitados["_usuario_nuevo_proyecto"] == false) {
            this.inputAccionResolucionMinisterial = "VISUALIZAR_ACTUALIZAR";
          } else {
            this.inputAccionResolucionMinisterial = "VISUALIZAR";
          }

          console.log("ACCION UPLOAD", this.inputAccionResolucionMinisterial);

          this.file_resolucionministerial = this.dts_adjuntos.filter(
            (element) =>
              element.tipo_documento == "resolucion_ministerial" ||
              element.tipo_documento == "resolucion_ministerial_sgp"
          )[0]["nombre_archivo"];
          console.log(
            "ARCHIVOS RESOLUCION MINISTERIAL",
            this.file_resolucionministerial
          );
        } else {
          if (this.camposHabilitados["_usuario_nuevo_proyecto"] == false) {
            this.inputAccionResolucionMinisterial = "SUBIR_ARCHIVO";
            this.file_resolucionministerial = "Nuevo Archivo";
          } else {
            this.inputAccionResolucionMinisterial = "";
            this.file_resolucionministerial = "";
          }

          console.log("ACCION UPLOAD", this.inputAccionResolucionMinisterial);
        }
        return this.listaEstructuraFinanciamiento();
      })
      .then((dts) => {
        this.dts_estructuraFinanciamiento = dts;
        console.log(
          "ESTRUCTURA FINANCIAMIENTO==>",
          this.dts_estructuraFinanciamiento
        );
      });
  }
  obtenerConexion() {
    return new Promise((resolve, reject) => {
      this.dtsDatosConexion = JSON.parse(localStorage.getItem("dts_con"));
      this.dts_roles_usuario = JSON.parse(localStorage.getItem("dts_rol"));
      this.s_idrol = this.dtsDatosConexion.s_idrol;
      this.s_user = this.dtsDatosConexion.s_idrol;
      this.s_nomuser = this.dtsDatosConexion.s_nomuser;
      this.s_usu_id = this.dtsDatosConexion.s_usu_id;
      this.s_usu_id_sipta = this.dtsDatosConexion.s_usu_id_sipta;
      this.s_usu_id_sispre = this.dtsDatosConexion.s_usu_id_sispre;
      this.s_ci_user = this.dtsDatosConexion.s_ci_user;

      resolve(1);
    });
  }
  paneles(string) {
    if (string == "NUEVO_REGISTRO") {
      this.pnl_descarga = false;
      this.pnl_formulario = true;
      this.btn_Registra = true;
      this.btn_Actualiza = false;
      //this.inputAccion = "SUBIR_ARCHIVO";
      setTimeout(() => {
        //  this.cargarmascaras();
        this.inicia_datos();
      }, 10);
    }
    if (string == "ACTUALIZAR_REGISTRO") {
      this.pnl_descarga = true;
      console.log("INGRESA AL FORMULARIO DE ACTUALIZACION");
      this.pnl_formulario = true;
      this.btn_Registra = false;
      this.btn_Actualiza = true;
      //this.inputAccion = "ACTUALIZAR";
      this.datos_convenio.codigo = this.dts_listaConvenio[0].codigo;
      this.datos_convenio.nro_convenio = this.dts_listaConvenio[0].nro_convenio;
      this.datos_convenio.nombrearchivo =
        this.dts_listaConvenio[0].nombre_archivo;
      this.datos_convenio.fechadesuscripcion = moment(
        this.dts_listaConvenio[0].fecha_convenio
      ).format("DD-MM-YYYY");
      this.datos_convenio.monto_convenio =
        this.dts_listaConvenio[0].monto_contrato;
      this.datos_convenio.monto_contraparte_beneficiario =
        this.dts_listaConvenio[0].monto_contraparte_beneficiario;
      this.datos_convenio.monto_contraparte_gobernacion =
        this.dts_listaConvenio[0].monto_contraparte_gobernacion;
      this.datos_convenio.monto_contraparte_municipio =
        this.dts_listaConvenio[0].monto_contraparte_municipal;
      this.datos_convenio.tipo_convenio =
        this.dts_listaConvenio[0].tipo_convenio;

      this.datos_convenio.id_convenio = this.dts_listaConvenio[0].id_convenio;
      this.datos_convenio.fid_proyecto = this.dts_listaConvenio[0].id_proyecto;
      this.datos_convenio.fid_sgp = this.dts_listaConvenio[0].id_sgp;
      this.datos_convenio.usrregistro =
        this.dts_listaConvenio[0].usuario_registro;
      this.datos_convenio.idestado = 1;
      this.datos_convenio.operacion = "U";
      this.datos_convenio.tipo = "";
      this.datos_convenio.repositorio = this.dts_listaConvenio[0].repositorio;
      if (this.datos_convenio.repositorio == "convenio_sgp") {
        this.inputRepositorioRM = "resolucion_ministerial_sgp";
      }
      if (this.datos_convenio.repositorio == "convenio") {
        this.inputRepositorioRM = "resolucion_ministerial";
      }
      setTimeout(() => {
        //this.cargarmascaras();
      }, 5);
    }
    if (string == "CERRAR_FORMULARIO") {
      $("#modalFormulario").modal("hide");
      setTimeout(() => {
        this.pnl_formulario = false;
      }, 10);
    }
    if (string == "FORMULARIO_ESTRUCTURAFINANCIAMIENTO") {
      this.pnl_FormularioEstructuraFinanciamiento = true;
    }
    if (string == "CONVENIO") {
      this.pnl_FormularioEstructuraFinanciamiento = false;
    }
    if (string == "CONVENIO_ACTUALIZADO") {
      this.pnl_FormularioEstructuraFinanciamiento = false;
      this.listaEstructuraFinanciamiento().then((dts) => {
        this.dts_estructuraFinanciamiento = dts;
      });
    }
  }
  /*******************************************************************************/
  /*MASCARAS
  /*******************************************************************************/
  cargarmascaras() {
    var monto_convenio = document.getElementById("monto_convenio");
    this.mask_numerodecimal.mask(monto_convenio);
    var monto_contraparte_beneficiario = document.getElementById(
      "monto_contraparte_beneficiario"
    );
    this.mask_numerodecimal.mask(monto_contraparte_beneficiario);
    var monto_contraparte_gobernacion = document.getElementById(
      "monto_contraparte_gobernacion"
    );
    this.mask_numerodecimal.mask(monto_contraparte_gobernacion);
    var monto_contraparte_municipal = document.getElementById(
      "monto_contraparte_municipal"
    );
    this.mask_numerodecimal.mask(monto_contraparte_municipal);
    var fechadesuscripcion = document.getElementById("fechadesuscripcion");
    this.mask_fecha.mask(fechadesuscripcion);
  }

  lista_convenio(id_proy) {
    return new Promise((resolve, reject) => {
      this.cargando = true;
      this.dts_listaConvenio = [];
      this._sgp.listaConvenioxIdSgp(id_proy).subscribe(
        (result: any) => {
          var lista_convenio;
          if (Array.isArray(result) && result.length > 0) {
            lista_convenio = this._fun.RemplazaNullArray(result);
            resolve(lista_convenio);
          } else {
            this.prop_msg = "Alerta: No existen convenio registrado";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_info", this.prop_msg);
            lista_convenio = [];
            resolve(lista_convenio);
            //this.habilitaPanel(this.dts_listaConvenio);
          }
          this.cargando = false;
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  lista_adjuntos() {
    return new Promise((resolve, reject) => {
      this.cargando = true;
      this.dts_listaConvenio = [];
      this._seguimiento
        .listaAdjuntosProyecto(
          this.inputDts["_id_proyecto"],
          this.id_seguimiento
        )
        .subscribe(
          (result: any) => {
            
            var lista_adjuntos;
            if (Array.isArray(result) && result.length > 0) {
              lista_adjuntos = this._fun.RemplazaNullArray(result);
              resolve(lista_adjuntos);
            } else {
              // this.prop_msg = "Alerta: No existen convenio registrado";
              // this.prop_tipomsg = "danger";
              // this._msg.formateoMensaje("modal_info", this.prop_msg);
              lista_adjuntos = [];
              resolve(lista_adjuntos);
              //this.habilitaPanel(this.dts_listaConvenio);
            }
            this.cargando = false;
          },
          (error) => {
            this.errorMessage = <any>error;
            if (this.errorMessage != null) {
              this.prop_msg =
                "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
              this.prop_tipomsg = "danger";
              this._msg.formateoMensaje("modal_danger", this.prop_msg);
              reject(this.prop_msg);
            }
          }
        );
    });
  }
  inicia_datos() {
    this.datos_convenio.nro_convenio = "";
    this.datos_convenio.fechadesuscripcion = "";
    this.datos_convenio.nombrearchivo = "";
    this.datos_convenio.repositorio = this.dts_listaConvenio[0].repositorio;
    this.datos_convenio.codigo = this.dts_listaConvenio[0].codigo;
    this.datos_convenio.tipo_convenio = "";

    if (this.datos_convenio.repositorio == "convenio_sgp") {
      this.inputRepositorioRM = "resolucion_ministerial_sgp";
    }
    if (this.datos_convenio.repositorio == "convenio") {
      this.inputRepositorioRM = "resolucion_ministerial";
    }
  }
  insertarConvenio(dts) {
    this.cargando = true;

    this.dts_listaConvenio = [];
    this.datos_convenio.nombrearchivo = dts.NOM_FILE;
    this.datos_convenio.fid_proyecto = this.inputDts["_id_proyecto"];
    this.datos_convenio.fid_sgp = this.inputDts["_id_sgp"];
    this.datos_convenio.usrregistro = this.s_usu_id;
    this.datos_convenio.operacion = "I";
    this.datos_convenio.tipo = "NN";
    this.datos_convenio.monto_convenio = this._fun.valorNumericoDecimal(
      this.datos_convenio.monto_convenio
    );
    this.datos_convenio.monto_contraparte_beneficiario =
      this._fun.valorNumericoDecimal(
        this.datos_convenio.monto_contraparte_beneficiario
      );
    this.datos_convenio.monto_contraparte_gobernacion =
      this._fun.valorNumericoDecimal(
        this.datos_convenio.monto_contraparte_gobernacion
      );
    this.datos_convenio.monto_contraparte_municipio =
      this._fun.valorNumericoDecimal(
        this.datos_convenio.monto_contraparte_municipio
      );

    this._sgp.insertaConvenio(this.datos_convenio).subscribe(
      (result: any) => {
        
        this.prop_tipomsg = result.estado.includes("Correcto")
          ? "modal_success"
          : "modal_warning";
        this.prop_msg = result.estado.includes("Correcto")
          ? "Se realizo correctamente el registro"
          : "No se pudo realizar el registro";
        this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
        this.cargando = false;
        this.lista_convenio(this.inputDts["_id_proyecto"]).then((dts) => {
          this.dts_listaConvenio = dts;
          this.pnl_descarga = true;
        });
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
        this.cargando = false;
      }
    );
  }

  actualizaConvenio(dts) {
    this.cargando = true;
    this.dts_listaConvenio = [];
    if (dts.NOM_FILE == "") {
      this.datos_convenio.nombrearchivo = this.datos_convenio.nombrearchivo;
    } else {
      this.datos_convenio.nombrearchivo = dts.NOM_FILE;
    }
    this.datos_convenio.fid_proyecto = this.inputDts["_id_proyecto"];
    this.datos_convenio.fid_sgp = this.inputDts["_id_sgp"];
    this.datos_convenio.usrregistro = this.s_usu_id;
    this.datos_convenio.operacion = "U";
    this.datos_convenio.tipo = "NN";

    this.datos_convenio.monto_convenio = this._fun.valorNumericoDecimal(
      this.datos_convenio.monto_convenio
    );
    this.datos_convenio.monto_contraparte_beneficiario =
      this._fun.valorNumericoDecimal(
        this.datos_convenio.monto_contraparte_beneficiario
      );
    this.datos_convenio.monto_contraparte_gobernacion =
      this._fun.valorNumericoDecimal(
        this.datos_convenio.monto_contraparte_gobernacion
      );
    this.datos_convenio.monto_contraparte_municipio =
      this._fun.valorNumericoDecimal(
        this.datos_convenio.monto_contraparte_municipio
      );

    this.dts_listaConvenio = [];
    console.log("datos conveniossss", this.datos_convenio);
    this._sgp.actualizaConvenio(this.datos_convenio).subscribe(
      (result: any) => {
        
        console.log(result);
        this.prop_tipomsg = result.estado.includes("Correcto")
          ? "modal_success"
          : "modal_warning";
        this.prop_msg = result.estado.includes("Correcto")
          ? "Se actualizo correctamente el registro"
          : "No se pudo actualizar el registro";
        this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
        this.cargando = false;
        this.lista_convenio(this.inputDts["_id_proyecto"]).then((dts) => {
          this.dts_listaConvenio = dts;
        });
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
        this.cargando = false;
      }
    );
  }
  crudArchivosAdjuntos(dts) {
    let registro = {};

    if (dts.ACCION == "INSERTA") {
      registro = {
        operacion: "I",
        id_archivo: null,
        fid_proyecto: this.inputDts["_id_proyecto"],
        fid_seguimiento: this.id_seguimiento,
        tipo_documento: dts.TIPO_DOCUMENTO,
        nombre_archivo: dts.NOM_FILE,
        usuario_registro: this.s_usu_id,
        id_estado: 1,
      };
    }
    if (dts.ACCION == "EDITA") {
      registro = {
        operacion: "U",
        id_archivo: null,
        fid_proyecto: this.inputDts["_id_proyecto"],
        fid_seguimiento: this.id_seguimiento,
        tipo_documento: dts.TIPO_DOCUMENTO,
        nombre_archivo: dts.NOM_FILE,
        usuario_registro: this.s_usu_id,
        id_estado: 1,
      };
      console.log("EDITAR====>", registro);
    }

    this.cargando = true;
    this._seguimiento.crudRegistroArchivoAdjunto(registro).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          console.log("TIPO_DOCUMENTO====>", result);
          //this.dts_archivoadjuntoproyecto =this._fun.RemplazaNullArray(result);
          this.cargando = false;
        } else {
          this.cargando = false;
        }
      },
      (error) => {
        this.cargando = false;
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      }
    );

    console.log("DATOS DEL ARCHIVO SUBIDO", dts);
  }

  refrescaLista($event) {
    console.log("evento hijo: ", $event);
    this.dts_listaimagenes = [];
    if (
      $event.TIPO_DOCUMENTO == "convenio" ||
      $event.TIPO_DOCUMENTO == "convenio_sgp" ||
      $event.TIPO_DOCUMENTO == ""
    ) {
      if ($event.ACCION == "EDITA") {
        this.actualizaConvenio($event);
      }
      if ($event.ACCION == "INSERTA") {
        this.insertarConvenio($event);
      }
    }
    if (
      $event.TIPO_DOCUMENTO == "resolucion_ministerial" ||
      $event.TIPO_DOCUMENTO == "resolucion_ministerial_sgp"
    ) {
      this.crudArchivosAdjuntos($event);
    }
  }
  listaTipoConvenio() {
    //this.cargando = true;
    this.m_tipoclasificador = "TIPO CONVENIO";
    console.log("TIPO CLASIFICADOR", this.m_tipoclasificador);
    return new Promise((resolve, reject) => {
      this._sgp.listaTipoConvenio(this.m_tipoclasificador).subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            var listaTipoConvenio = this._fun.RemplazaNullArray(result);
            //this.cargando = false;

            resolve(listaTipoConvenio);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            console.log(this.errorMessage);
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos ";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  listaEstructuraFinanciamiento() {
    return new Promise((resolve, reject) => {
      this._sgp
        .listaEstructuraFinanciamiento(this.inputDts["_id_proyecto"])
        .subscribe(
          (result: any) => {
            
            if (Array.isArray(result) && result.length > 0) {
              var listaEstructuraFinanciamiento =
                this._fun.RemplazaNullArray(result);

              resolve(listaEstructuraFinanciamiento);
            }
          },
          (error) => {
            this.errorMessage = <any>error;
            if (this.errorMessage != null) {
              console.log(this.errorMessage);
              this.prop_msg =
                "Error: No se pudo ejecutar la petición en la base de datos ";
              this._msg.formateoMensaje("modal_danger", this.prop_msg);
              reject(this.prop_msg);
            }
          }
        );
    });
  }
}
