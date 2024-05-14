import { DatePipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Inputmask from "inputmask";
import * as moment from "moment";
import { Globals } from "../../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
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
  selector: "app-apliacion-plazo",
  templateUrl: "./apliacion-plazo.component.html",
  styleUrls: ["./apliacion-plazo.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
    AccesosRolComponent,
  ],
})
export class ApliacionPlazoComponent implements OnInit {
  @Input("inputDts") inputDts: string;
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

  public pnl_listaproyecto = false;
  public pnl_supervision = false;
  public pnl_ampliacionplazo = false;

  public pnl_tecnica = false;
  public pnl_financiero = false;
  public pnl_legal = false;

  /************************************
   * VARIABLES DEL COMPONENTE
   ***********************************/
  public dts_listaampliacion: any;
  public dts_listaempresaversion: any;
  public nombre_proyecto: any;
  public id_sgp: any;
  public inputArchivo = null;
  public file_empty: File;
  public archivoModel: any = {
    TIPO_DOCUMENTO: "",
    CODIGO: "",
    FILE: null,
    NOM_FILE: "",
  };

  public btnRegistrar = false;
  public btnActualizar = false;
  public pnl_listaampliacion = false;

  public ampliacion: {
    idampliacion: any;
    fidproyecto: any;
    idsgp: any;
    nroversion: any;
    plazoin: any;
    montoin: any;
    monto_contraparte_beneficiario: any;
    monto_contraparte_gobernacion: any;
    monto_contraparte_municipio: any;
    descripcionin: any;
    fechaaprobacionin: any;
    usrregistro: any;
    idestado: any;
    operacion: any;
    tipo: any;
    archivo_adjunto: any;
  };

  public camposHabilitados: {};

  public habilitaAdicion = true;
  public nro_version = 0;
  public fecha_tope = moment().format("YYYY-MM-DD").toString();

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _seguimiento: SgpService,

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
    this.ampliacion = {
      idampliacion: 0,
      fidproyecto: 0,
      idsgp: 0,
      nroversion: 0,
      plazoin: 0,
      montoin: 0,
      monto_contraparte_beneficiario: 0,
      monto_contraparte_gobernacion: 0,
      monto_contraparte_municipio: 0,
      descripcionin: "",
      fechaaprobacionin: "",
      usrregistro: 0,
      idestado: 1,
      operacion: "",
      tipo: "",
      archivo_adjunto: "",
    };
  }

  ngOnInit() {
    this.mask_numero = new Inputmask("9{1,9}");
    this.mask_numerodecimal = new Inputmask("9{1,9}.9{1,2}");
    this.mask_fecha = new Inputmask("9{1,2}/9{1,2}/9{1,4}");
    this.nombre_proyecto = this.inputDts["_nombreproyecto"];
    this.id_sgp = this.inputDts["_id_sgp"];
    this.nro_version = this.inputDts["_nro_version"];
    this.obtenerConexion()
      .then(() => {
        return this._accesos.accesosRestriccionesxRolV2(this.s_usu_id);
      })
      .then((data) => {
        this.camposHabilitados = data;
        console.log("Adm Roles===>", this.camposHabilitados);
        return this.FechaServidor();
      })
      .then((dts) => {
        this.dtsFechaSrv = dts[0]["fechasrv"];
        this.cargarmascaras();
        this.paneles("LISTA_AMPLIACION");
      });
  }

  cargarmascaras() {
    var plazo = document.getElementById("plazo");
    var monto = document.getElementById("monto");
    var monto_contraparte_beneficiario = document.getElementById(
      "monto_contraparte_beneficiario"
    );
    var monto_contraparte_gobernacion = document.getElementById(
      "monto_contraparte_gobernacion"
    );
    var monto_contraparte_municipio = document.getElementById(
      "monto_contraparte_municipio"
    );
    this.mask_numero.mask(plazo);
    this.mask_numerodecimal.mask(monto_contraparte_beneficiario);
    this.mask_numerodecimal.mask(monto_contraparte_gobernacion);
    this.mask_numerodecimal.mask(monto_contraparte_municipio);
    this.mask_numerodecimal.mask(monto);
    var fechaaprobacion = document.getElementById("fechaaprobacion");
    this.mask_fecha.mask(fechaaprobacion);
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
  paneles(string, dts?) {
    if (string == "LISTA_AMPLIACION") {
      $("#pnl_listaampliacion").show();
      $("#pnl_nuevaampliacion").hide();
      this.lista_ampliacion(this.inputDts["_id_proyecto"]);
    }
    if (string == "NUEVA_AMPLIACION") {
      $("#modalAmpliacion").modal("show");
      // $("#btnRegistrar").show();
      // $("#btnModificar").hide();
      this.btnRegistrar = true;
      this.btnActualizar = false;
      this.limpiarAmpliacion();
    }
    if (string == "EDITA_AMPLIACION") {
      $("#modalAmpliacion").modal("show");
      this.btnRegistrar = false;
      this.btnActualizar = true;
      this.abrirEdicion(dts);
    }
  }

  // listaEmpresaAmpliacion(idproyecto) {
  //   this.cargando = true;
  //   this._seguimiento.listaEmpresaAmpliacion(idproyecto).subscribe(
  //     (result: any) => {
  //       
  //       if (Array.isArray(result) && result.length > 0) {
  //         this.dts_listaempresaversion = this._fun.RemplazaNullArray(result);
  //         console.log("version proyecto", this.nro_version);
  //         let valida = this.dts_listaempresaversion.filter(
  //           (item) => item.nro_version == this.nro_version
  //         );
  //         if (valida.length <= 0) {
  //           this.habilitaAdicion = false;
  //         } else {
  //           this.habilitaAdicion = true;
  //         }
  //       } else {
  //         this.prop_msg = "Alerta: No existen ampliaciones registradas";
  //         this.prop_tipomsg = "danger";
  //         this._msg.formateoMensaje("modal_info", this.prop_msg);
  //       }
  //     },
  //     (error) => {
  //       this.errorMessage = <any>error;
  //       if (this.errorMessage != null) {
  //         this.prop_msg =
  //           "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
  //         this.prop_tipomsg = "danger";
  //         this._msg.formateoMensaje("modal_danger", this.prop_msg);
  //       }
  //     }
  //   );
  // }
  lista_ampliacion(id_proy) {
    this.pnl_listaampliacion = true;
    this.cargando = true;
    this.dts_listaampliacion = [];
    this._seguimiento.listaAmpliacionPlazoSgp(id_proy).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_listaampliacion = this._fun.RemplazaNullArray(result);
          console.log("listaampiacion", this.dts_listaampliacion);

          // $(".dt-listaampliacion").DataTable().destroy();
          // this._fun.limpiatabla(".dt-listaampliacion");
          // setTimeout(() => {
          //   let confiTable = this._fun.CONFIGURACION_TABLA_V4(
          //     [50, 100, 150, 200],
          //     false,
          //     20
          //   );
          //   var table = $(".dt-listaampliacion").DataTable(confiTable);
          //   this._fun.inputTable(table, [1, 2, 3, 4]);
          // }, 5);
        } else {
          this.prop_msg = "Alerta: No existen registros de ampliaciones";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_info", this.prop_msg);
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
  }
  limpiarAmpliacion() {
    this.ampliacion = {
      idampliacion: 0,
      fidproyecto: 0,
      idsgp: 0,
      nroversion: 0,
      plazoin: 0,
      montoin: 0,
      monto_contraparte_beneficiario: 0,
      monto_contraparte_gobernacion: 0,
      monto_contraparte_municipio: 0,
      descripcionin: "",
      fechaaprobacionin: "",
      usrregistro: 0,
      idestado: 1,
      operacion: "",
      tipo: "",
      archivo_adjunto: "",
    };
  }
  filtradosupervisiones(listado, version) {
    var a = listado.filter((item) => item.nro_version == version);
    return a;
  }

  abrirEdicion(registro) {
    console.log(registro);
    this.ampliacion.idampliacion = registro.id_ampliacion;
    this.ampliacion.fidproyecto = registro.fid_proyecto;
    this.ampliacion.idsgp = 0;
    this.ampliacion.nroversion = registro.nro_version;
    this.ampliacion.usrregistro = this.s_usu_id;
    this.ampliacion.operacion = "U";
    this.ampliacion.tipo = "NN";
    this.ampliacion.plazoin = registro.plazo;
    this.ampliacion.montoin = registro.monto;
    this.ampliacion.monto_contraparte_beneficiario =
      registro.monto_contraparte_beneficiario;
    this.ampliacion.monto_contraparte_gobernacion =
      registro.monto_contraparte_gobernacion;
    this.ampliacion.monto_contraparte_municipio =
      registro.monto_contraparte_municipal;
    this.ampliacion.descripcionin = registro.descripcion;
    //this.ampliacion.fechaaprobacionin = registro.fecha_aprobacion.substr(0, 10);
    //this.ampliacion.fechaaprobacionin=moment(registro.fecha_aprobacion).format('DD/MM/YYYY');
    this.ampliacion.fechaaprobacionin = this._fun.formatoFechaMoment(
      registro.fecha_aprobacion
    );

    console.log("fecha_amp", this.ampliacion.fechaaprobacionin);
  }

  abrirEliminacion(registro) {
    this.ampliacion.idampliacion = registro.id_ampliacion;
    this.ampliacion.fidproyecto = registro.fid_proyecto;
    this.ampliacion.idsgp = 0;
    this.ampliacion.nroversion = registro.nro_version;
    this.ampliacion.usrregistro = this.s_usu_id;
    this.ampliacion.operacion = "D";
    this.ampliacion.tipo = "LOGICO";
    this.ampliacion.idestado = 0;
    this.ampliacion.plazoin = registro.plazo;
    this.ampliacion.montoin = registro.monto;
    this.ampliacion.monto_contraparte_beneficiario =
      registro.monto_contraparte_beneficiario;
    this.ampliacion.monto_contraparte_gobernacion =
      registro.monto_contraparte_gobernacion;
    this.ampliacion.monto_contraparte_municipio =
      registro.monto_contraparte_municipal;
    this.ampliacion.descripcionin = registro.descripcion;
    //this.ampliacion.fechaaprobacionin = registro.fecha_aprobacion.substr(0, 10);
    //this.ampliacion.fechaaprobacionin=moment(registro.fecha_aprobacion).format('DD/MM/YYYY');
    this.ampliacion.fechaaprobacionin = this._fun.formatoFechaMoment(
      registro.fecha_aprobacion
    );
    $("#modalEliminacion").modal("show");
  }
  subirImagenInserta() {
    this.archivoModel.TIPO_DOCUMENTO = "ampliacion_plazo";
    this.archivoModel.CODIGO = this.inputDts["_id_sgp"];

    if (
      this.archivoModel.TIPO_DOCUMENTO === null ||
      this.archivoModel.TIPO_DOCUMENTO === undefined ||
      this.archivoModel.TIPO_DOCUMENTO === ""
    ) {
      this._msg.formateoMensaje(
        "modal_warning",
        "Seleccione el tipo de documento a subir"
      );
      return;
    }
    this.archivoModel.FILE =
      this.inputArchivo === null ? this.file_empty : this.inputArchivo;
    console.log(this.archivoModel);
    if (this.archivoModel.FILE == undefined) {
      this.insertaAmpliacion();
    } else {
      this._autenticacion.subirArchivo(this.archivoModel).subscribe(
        (result: any) => {
          let respuestaSubida = result;
          console.log("resulSubida", respuestaSubida);
          if (respuestaSubida.ok) {
            this.ampliacion.archivo_adjunto = respuestaSubida.nombre_archivo;
            this.insertaAmpliacion();
          } else {
            this._msg.formateoMensaje(
              "modal_warning",
              respuestaSubida.message,
              10
            );
          }
        },
        (error) => {
          let respuesta = error;
          this._msg.formateoMensaje("modal_danger", respuesta.error, 10);
        }
      );
    }
  }
  actualizarArchivo() {
    console.log("Fecha aprobacion", this.ampliacion.fechaaprobacionin);
    if (
      this.archivoModel.TIPO_DOCUMENTO === null ||
      this.archivoModel.TIPO_DOCUMENTO === undefined ||
      this.archivoModel.TIPO_DOCUMENTO === ""
    ) {
      // this._msg.formateoMensaje(
      //   "modal_warning",
      //   "Seleccione el tipo de documento a subir"
      // );
      console.log("ENTRA AQUI");
      this.actualizaAmpliacion();
      //return;
    } else {
      this.archivoModel.FILE =
        this.inputArchivo === null ? this.file_empty : this.inputArchivo;
      console.log(this.archivoModel);
      if (this.archivoModel.FILE == undefined) {
        this.actualizaAmpliacion();
      } else {
        this._autenticacion.reemplazarArchivo(this.archivoModel).subscribe(
          (result: any) => {
            let respuestaSubida = result;
            console.log("resulSubida", respuestaSubida);
            if (respuestaSubida.ok) {
              this.ampliacion.archivo_adjunto = respuestaSubida.nombre_archivo;
              setTimeout(() => {
                this.actualizaAmpliacion();
              }, 10);
            } else {
              this._msg.formateoMensaje(
                "modal_warning",
                respuestaSubida.message,
                10
              );
            }
          },
          (error) => {
            let respuesta = error;
            this._msg.formateoMensaje("modal_danger", respuesta.error, 10);
          }
        );
      }
    }
  }

  insertaAmpliacion() {
    this.cargando = true;
    this.dts_listaampliacion = [];
    let fecha_formulario = moment(
      this.ampliacion.fechaaprobacionin,
      "DD/MM/YYYY"
    ).format("YYYY-MM-DD");
    let fecha_actual = moment(this.dtsFechaSrv).format("YYYY-MM-DD");

    this.ampliacion.montoin = this._fun.valorNumericoDecimal(
      this.ampliacion.montoin
    );
    this.ampliacion.monto_contraparte_beneficiario =
      this._fun.valorNumericoDecimal(
        this.ampliacion.monto_contraparte_beneficiario
      );
    this.ampliacion.monto_contraparte_gobernacion =
      this._fun.valorNumericoDecimal(
        this.ampliacion.monto_contraparte_gobernacion
      );
    this.ampliacion.monto_contraparte_municipio =
      this._fun.valorNumericoDecimal(
        this.ampliacion.monto_contraparte_municipio
      );
    console.log("ENTRA A INSERTAR AMPLIACION");

    if (this.ampliacion.plazoin <= 0 && this.ampliacion.montoin <= 0) {
      this.prop_msg = "Alerta: El plazo o monto deber mayor a 0";
      this._msg.formateoMensaje("modal_info", this.prop_msg);
      return;
    }

    if (this.ampliacion.fechaaprobacionin == "") {
      this.prop_msg = "Alerta: La fecha de aprobación es obligatoria";
      this._msg.formateoMensaje("modal_info", this.prop_msg);
      return;
    }

    if (this.ampliacion.descripcionin == "") {
      this.prop_msg = "Alerta: La descripción es obligatoria";
      this._msg.formateoMensaje("modal_info", this.prop_msg);
      return;
    }

    // if (
    //   fecha_formulario > fecha_actual
    // ) {
    //   this.prop_msg =
    //     "Alerta: La fecha de aprobación no puede ser mayor a fecha actual";
    //   this._msg.formateoMensaje("modal_info", this.prop_msg);
    //   return;
    // }

    this.ampliacion.fidproyecto = this.inputDts["_id_proyecto"];
    this.ampliacion.idsgp = this.inputDts["_id_sgp"];
    this.ampliacion.nroversion = this.inputDts["_nro_version"];
    this.ampliacion.usrregistro = this.s_usu_id;
    this.ampliacion.operacion = "I";
    this.ampliacion.tipo = "NN";

    this._seguimiento.insertaAmpliacion(this.ampliacion).subscribe(
      (result: any) => {
        

        if (Array.isArray(result) && result.length > 0) {
          if (result[0]._accion == "CORRECTO") {
            this.prop_msg = "Se actualizó de manera correcta los datos";
            this._msg.formateoMensaje("modal_success", this.prop_msg);
            // this.listaEmpresaAmpliacion(this.inputDts["_id_proyecto"]);
            this.lista_ampliacion(this.inputDts["_id_proyecto"]);
          } else {
            this._msg.formateoMensaje(
              "modal_danger",
              "Error:" + result[0]._mensaje,
              10
            );
          }
        } else {
          console.log("no devuleve array", result);
        }
        this.cargando = false;
        $("#modalAmpliacion").modal("hide");
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
        $("#modalAmpliacion").modal("hide");
        this.cargando = false;
      }
    );
  }

  actualizaAmpliacion() {
    this.cargando = true;
    this.dts_listaampliacion = [];

    let fecha_formulario = moment(
      this.ampliacion.fechaaprobacionin,
      "DD/MM/YYYY"
    ).format("YYYY-MM-DD");
    let fecha_actual = moment(this.dtsFechaSrv).format("YYYY-MM-DD");

    this.ampliacion.montoin = this._fun.valorNumericoDecimal(
      this.ampliacion.montoin
    );
    this.ampliacion.monto_contraparte_beneficiario =
      this._fun.valorNumericoDecimal(
        this.ampliacion.monto_contraparte_beneficiario
      );
    this.ampliacion.monto_contraparte_gobernacion =
      this._fun.valorNumericoDecimal(
        this.ampliacion.monto_contraparte_gobernacion
      );
    this.ampliacion.monto_contraparte_municipio =
      this._fun.valorNumericoDecimal(
        this.ampliacion.monto_contraparte_municipio
      );

    if (this.ampliacion.plazoin <= 0 && this.ampliacion.montoin <= 0) {
      this.prop_msg = "Alerta: El plazo o monto deber mayor a 0";
      this._msg.formateoMensaje("modal_info", this.prop_msg);
      return;
    }

    if (this.ampliacion.fechaaprobacionin == "") {
      this.prop_msg = "Alerta: La fecha de aprobación es obligatoria";
      this._msg.formateoMensaje("modal_info", this.prop_msg);
      return;
    }

    if (this.ampliacion.descripcionin == "") {
      this.prop_msg = "Alerta: La descripción es obligatoria";
      this._msg.formateoMensaje("modal_info", this.prop_msg);
      return;
    }

    // if (

    //   fecha_formulario > fecha_actual
    // ) {
    //   this.prop_msg =
    //     "Alerta: La fecha de aprobación no puede ser mayor a fecha actual";
    //   this._msg.formateoMensaje("modal_info", this.prop_msg);
    //   return;
    // }

    this._seguimiento.actualizaAmpliacion(this.ampliacion).subscribe(
      (result: any) => {
        
        console.log(result);

        if (Array.isArray(result) && result.length > 0) {
          if (result[0]._accion == "CORRECTO") {
            this.prop_msg = "Se actualizó de manera correcta los datos";
            this._msg.formateoMensaje("modal_success", this.prop_msg);
            this.lista_ampliacion(this.inputDts["_id_proyecto"]);
          } else {
            this._msg.formateoMensaje(
              "modal_danger",
              "Error:" + result[0]._mensaje,
              10
            );
          }
        } else {
          console.log("no devuleve array", result);
        }
        $("#modalAmpliacion").modal("hide");
        this.cargando = false;
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
        $("#modalAmpliacion").modal("hide");
        this.cargando = false;
      }
    );
  }

  eliminaAmpliacion() {
    this.cargando = true;
    this.dts_listaampliacion = [];

    this._seguimiento.eliminaAmpliacion(this.ampliacion).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          if (result[0]._accion == "CORRECTO") {
            this.prop_msg = "Se elimino de manera correcta el registro";
            this._msg.formateoMensaje("modal_success", this.prop_msg);
            this.lista_ampliacion(this.inputDts["_id_proyecto"]);
          } else {
            this._msg.formateoMensaje(
              "modal_danger",
              "Error:" + result[0]._mensaje,
              10
            );
          }
        } else {
          console.log("no devuleve array", result);
        }
        this.lista_ampliacion(this.inputDts["_id_proyecto"]);
        this.cargando = false;
        $("#modalEliminacion").modal("hide");
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
        $("#modalEliminacion").modal("hide");
      }
    );
  }
  handleFileInput(files: FileList) {
    console.log("ENTRA A FILEIPUT", this.inputArchivo);
    this.inputArchivo = files.item(0);
    let extensionesValidas = ["pdf"];
    let nombreArchivo = this.inputArchivo.name;
    // let extension_archivo = nombreArchivo.substr(
    //   nombreArchivo.indexOf(".") + 1
    // );
    let extension_archivo = this._fun.nombre_extension(this.inputArchivo.name);
    console.log("ENTRA A FILEIPUT", this.inputArchivo);
    if (extensionesValidas.indexOf(extension_archivo) < 0) {
      this.prop_msg = "El formato del archivo seleccionado no es válido";
      this.prop_tipomsg = "modal_info";
      this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
      $("#inputArchivo").val("");
    } else {
      this.ampliacion.archivo_adjunto = this.inputArchivo.name;
      this.archivoModel.TIPO_DOCUMENTO = "ampliacion_plazo";
      this.archivoModel.CODIGO = this.inputDts["_id_sgp"];
      //this.archivoModel.NOM_FILE=this.dts_listaderechopropietario.nombre_archivo;
      this.archivoModel.NOM_FILE = this.inputArchivo.name;
    }
  }
}
