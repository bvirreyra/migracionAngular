import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Globals } from "../../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { AutenticacionService } from "../../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../../seguridad/mensajes/mensajes.component";
import { AccesosRolComponent } from "../../accesos-rol/accesos-rol.component";
import { SgpService } from "../../sgp.service";
import { SupervisionComponent } from "../supervision/supervision.component";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-bandeja-tecnica",
  templateUrl: "./bandeja-tecnica.component.html",
  styleUrls: ["./bandeja-tecnica.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
    SupervisionComponent,
    AccesosRolComponent,
  ],
})
export class BandejaTecnicaComponent implements OnInit {
  @Input("inputDts") inputDtsBandeja: string;

  @Output() panel_proy = new EventEmitter<string>();
  @Output() enviaPadre = new EventEmitter<string>();

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
  public pnl_datosgenerales = false;
  public pnl_contrato = false;
  public pnl_supervision = false;
  public pnl_ampliacionplazo = false;
  public pnl_galeriaimagenes = false;
  public pnl_contactos = false;
  public pnl_ficha_tecnica = false;
  public pnl_cierre_administrativo = false;
  public pnl_seguimiento_ejecucion = false;
  public pnl_subirArchivoModal = false;
  public pnl_ambiental = false;
  public pnl_programacion = false;

  public pnl_tecnica = false;
  public pnl_financiero = false;
  public pnl_legal = false;

  public dts_listaimagenes: any;
  public id_sgp: any;
  public dts_listaempresaversion: any;
  public habilitaAdicion = true;
  public nro_version = 0;
  public inputDts: any;

  public camposHabilitados: {};
  public respuesta: any = {
    ID_PROYECTO: "",
    ESTADO: "",
    ACCION: "",
  };

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
    this.dts_listaimagenes = [];
    this.dts_listaempresaversion = [];
  }

  ngOnInit() {
    this.id_sgp = this.inputDtsBandeja["_id_sgp"];
    console.log("BandejaTecnica", this.inputDtsBandeja["_id_sgp"]);

    if (this.inputDtsBandeja != undefined) {
      this.obtieneDatosProyecto(this.inputDtsBandeja["_id_proyecto"]).then(
        (dts) => {
          this.inputDts = dts;

          console.log("DATOS DEL PROYECTO..", this.inputDts);
          this.nro_version = this.inputDts["_nro_version"];
          this.paneles("DATOS_GENERALES_INICIAL");
          this.lista_imagenes(this.inputDts["_id_proyecto"]);
        }
      );
      this.obtenerConexion()
        .then(() => {
          return this._accesos.accesosRestriccionesxRolV2(this.s_usu_id);
        })
        .then((data) => {
          this.camposHabilitados = data;
          console.log("Adm Roles===>", this.camposHabilitados);
        });
    }
  }
  // cargarbandeja() {
  //   this.obtenerConexion();
  // }
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
    if (string == "VER_PANELPROYECTOS") {
      this.panel_proy.emit(string);
      this.respuesta.ID_PROYECTO = this.inputDtsBandeja["_id_proyecto"];
      this.respuesta.ACCION = "REGISTRADO";
      this.metodoenviaPadre(this.respuesta);
      //$('#pnl_listaproyecto').show();
      //$('#pnl_tecnica').hide();
    }
    if (string == "DATOS_GENERALES_INICIAL") {
      this.pnl_datosgenerales = true;
      this.pnl_supervision = false;
      this.pnl_ampliacionplazo = false;
      this.pnl_galeriaimagenes = false;
      this.pnl_contactos = false;
      this.pnl_seguimiento_ejecucion = false;
      this.pnl_ficha_tecnica = false;
      this.pnl_cierre_administrativo = false;
      this.pnl_ambiental = false;
      this.pnl_programacion = false;
    }
    if (string == "DATOS_GENERALES") {
      $("#pnl_datosgenerales").show();
      this.pnl_supervision = false;
      this.pnl_ampliacionplazo = false;
      this.pnl_galeriaimagenes = false;
      this.pnl_contactos = false;
      this.pnl_seguimiento_ejecucion = false;
      this.pnl_ficha_tecnica = false;
      this.pnl_cierre_administrativo = false;
      this.pnl_ambiental = false;
      this.pnl_contrato = false;
      this.pnl_programacion = false;
    }
    if (string == "CONTRATO") {
      //this.pnl_datosgenerales = false;
      $("#pnl_datosgenerales").hide();
      this.pnl_supervision = false;
      this.pnl_ampliacionplazo = false;
      this.pnl_galeriaimagenes = false;
      this.pnl_contactos = false;
      this.pnl_seguimiento_ejecucion = false;
      this.pnl_ficha_tecnica = false;
      this.pnl_cierre_administrativo = false;
      this.pnl_ambiental = false;
      this.pnl_contrato = true;
      this.pnl_programacion = false;
    }
    if (string == "SUPERVISION") {
      //this.pnl_datosgenerales = false;
      $("#pnl_datosgenerales").hide();
      this.pnl_supervision = true;
      this.pnl_ampliacionplazo = false;
      this.pnl_galeriaimagenes = false;
      this.pnl_contactos = false;
      this.pnl_seguimiento_ejecucion = false;
      this.pnl_ficha_tecnica = false;
      this.pnl_cierre_administrativo = false;
      this.pnl_ambiental = false;
      this.pnl_contrato = false;
      this.pnl_programacion = false;
    }
    if (string == "AMPLIACIONPLAZO") {
      //this.pnl_datosgenerales = false;
      $("#pnl_datosgenerales").hide();
      this.pnl_supervision = false;
      this.pnl_ampliacionplazo = true;
      this.pnl_galeriaimagenes = false;
      this.pnl_contactos = false;
      this.pnl_seguimiento_ejecucion = false;
      this.pnl_ficha_tecnica = false;
      this.pnl_cierre_administrativo = false;
      this.pnl_ambiental = false;
      this.pnl_contrato = false;
      this.pnl_programacion = false;
    }
    if (string == "GALERIA_IMAGENES") {
      //this.pnl_datosgenerales = false;
      $("#pnl_datosgenerales").hide();
      this.pnl_supervision = false;
      this.pnl_ampliacionplazo = false;
      this.pnl_galeriaimagenes = true;
      this.pnl_contactos = false;
      this.pnl_seguimiento_ejecucion = false;
      this.pnl_ficha_tecnica = false;
      this.pnl_cierre_administrativo = false;
      this.pnl_ambiental = false;
      this.pnl_contrato = false;
      this.pnl_programacion = false;
    }
    if (string == "CONTACTOS") {
      //this.pnl_datosgenerales = false;
      $("#pnl_datosgenerales").hide();
      this.pnl_supervision = false;
      this.pnl_ampliacionplazo = false;
      this.pnl_galeriaimagenes = false;
      this.pnl_contactos = true;
      this.pnl_seguimiento_ejecucion = false;
      this.pnl_ficha_tecnica = false;
      this.pnl_cierre_administrativo = false;
      this.pnl_ambiental = false;
      this.pnl_contrato = false;
      this.pnl_programacion = false;
    }
    if (string == "PROGRAMACION") {
      $("#pnl_datosgenerales").hide();
      this.pnl_supervision = false;
      this.pnl_ampliacionplazo = false;
      this.pnl_galeriaimagenes = false;
      this.pnl_contactos = false;
      this.pnl_seguimiento_ejecucion = false;
      this.pnl_ficha_tecnica = false;
      this.pnl_cierre_administrativo = false;
      this.pnl_ambiental = false;
      this.pnl_contrato = false;
      this.pnl_programacion = true;
    }
    if (string == "SEGUIMIENTO_EJECUCION") {
      //this.pnl_datosgenerales = false;
      $("#pnl_datosgenerales").hide();
      this.pnl_supervision = false;
      this.pnl_ampliacionplazo = false;
      this.pnl_galeriaimagenes = false;
      this.pnl_contactos = false;
      this.pnl_seguimiento_ejecucion = true;
      this.pnl_ficha_tecnica = false;
      this.pnl_cierre_administrativo = false;
      this.pnl_ambiental = false;
      this.pnl_contrato = false;
      this.pnl_programacion = false;
    }
    if (string == "FICHA_TECNICA") {
      //this.pnl_datosgenerales = false;
      $("#pnl_datosgenerales").hide();
      this.pnl_supervision = false;
      this.pnl_ampliacionplazo = false;
      this.pnl_galeriaimagenes = false;
      this.pnl_contactos = false;
      this.pnl_seguimiento_ejecucion = false;
      this.pnl_ficha_tecnica = true;
      this.pnl_cierre_administrativo = false;
      this.pnl_ambiental = false;
      this.pnl_contrato = false;
      this.pnl_programacion = false;
    }
    if (string == "CIERRE_ADMINISTRATIVO") {
      //this.pnl_datosgenerales = false;
      $("#pnl_datosgenerales").hide();
      this.pnl_supervision = false;
      this.pnl_ampliacionplazo = false;
      this.pnl_galeriaimagenes = false;
      this.pnl_contactos = false;
      this.pnl_seguimiento_ejecucion = false;
      this.pnl_ficha_tecnica = false;
      this.pnl_cierre_administrativo = true;
      this.pnl_ambiental = false;
      this.pnl_contrato = false;
      this.pnl_programacion = false;
    }
    if (string == "FICHA_AMBIENTAL") {
      //this.pnl_datosgenerales = false;
      $("#pnl_datosgenerales").hide();
      this.pnl_supervision = false;
      this.pnl_ampliacionplazo = false;
      this.pnl_galeriaimagenes = false;
      this.pnl_contactos = false;
      this.pnl_seguimiento_ejecucion = false;
      this.pnl_ficha_tecnica = false;
      this.pnl_cierre_administrativo = false;
      this.pnl_ambiental = true;
      this.pnl_contrato = false;
      this.pnl_programacion = false;
    }
  }

  filtradoimagenes(listado, idsgp) {
    var a = listado.filter((item) => item.id_sgp == idsgp);
    return a;
  }
  lista_imagenes(codigo) {
    this._autenticacion.listaArchivo(codigo).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_listaimagenes = result;
          // for (let i = 0; i < result.length; i++) {
          //   result[i].id_sgp = codigo;
          //   this.dts_listaimagenes.push(result[i]);

          // }
          console.log("IMAGENES GALERIAa", this.dts_listaimagenes);
        } else {
          this.prop_msg = "El proyecto no contiene imágenes";
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
          this._msg.formateoMensaje("modal_info", this.prop_msg);
        }
      }
    );
  }
  subirArchivoModal() {
    this.pnl_subirArchivoModal = true;
    setTimeout(() => {
      $("#modalUploadArchivo").modal("show");
    }, 10);
  }
  cerrarArchivoModal() {
    $("#modalUploadArchivo").modal("hide");
    setTimeout(() => {
      this.pnl_subirArchivoModal = false;
    }, 10);
  }

  refrescaGaleriaImagenes($event) {
    console.log("evento hijo: ", $event);
    this.dts_listaimagenes = [];
    if ($event.ACCION == "ELIMINA") {
      this.eliminaGaleriaImagen($event.ID_REGISTRO, $event.NOM_FILE);
    }
    if ($event.ACCION == "EDITA") {
    }
    if ($event.ACCION == "INSERTA") {
      this.insertaGaleriaImagen($event.NOM_FILE);
      $("#modalUploadArchivo").modal("hide");
      this.pnl_subirArchivoModal = false;
    }
    if ($event.ACCION == "SELECCIONADO") {
      this.seleccionImagenAppMovil($event.ID_REGISTRO, $event.NOM_FILE);
    }
    if ($event.ACCION == "DES_SELECCIONADO") {
      this.desseleccionImagenAppMovil($event.ID_REGISTRO, $event.NOM_FILE);
    }
  }

  insertaGaleriaImagen(nombreImagen) {
    let fichaImagen = {
      id: 0,
      fidproyecto: this.inputDts["_id_proyecto"],
      idsgp: this.inputDts["_id_sgp"],
      nroversion: this.inputDts["_nro_version"],
      ruta: this.inputDts["_id_sgp"] + "/" + nombreImagen,
      observaciones: "",
      usrregistro: this.s_usu_id,
      idestado: 1,
      operacion: "I",
      tipo: "NN",
    };
    console.log(fichaImagen);
    this._seguimiento.insertaSupervisionImagen(fichaImagen).subscribe(
      (result: any) => {
        
        this.prop_tipomsg = result.estado.includes("Correcto")
          ? "modal_success"
          : "modal_warning";
        this.prop_msg = result.estado.includes("Correcto")
          ? "Se realizo correctamente el registro"
          : "No se pudo realizar el registro";
        this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
        // this.listaEmpresaImagenes(this.inputDts["_id_proyecto"]);
        this.lista_imagenes(this.inputDts["_id_proyecto"]);
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
  eliminaGaleriaImagen(id_registro, nombreImagen) {
    let fichaImagen = {
      id: id_registro,
      fidproyecto: this.inputDts["_id_proyecto"],
      idsgp: this.inputDts["_id_sgp"],
      nroversion: this.inputDts["_nro_version"],
      ruta: this.inputDts["_id_sgp"] + "/" + nombreImagen,
      observaciones: "",
      usrregistro: this.s_usu_id,
      idestado: 0,
      operacion: "D",
      tipo: "LOGICO",
    };
    console.log(fichaImagen);
    this._seguimiento.eliminaSupervisionImagen(fichaImagen).subscribe(
      (result: any) => {
        
        this.prop_tipomsg = result.estado.includes("Correcto")
          ? "modal_success"
          : "modal_warning";
        this.prop_msg = result.estado.includes("Correcto")
          ? "Se realizo correctamente el registro"
          : "No se pudo realizar el registro";
        this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
        // this.listaEmpresaImagenes(this.inputDts["_id_proyecto"]);
        this.lista_imagenes(this.inputDts["_id_proyecto"]);
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
  seleccionImagenAppMovil(id_registro, nombreImagen) {
    let fichaImagen = {
      id: id_registro,
      fidproyecto: this.inputDts["_id_proyecto"],
      idsgp: this.inputDts["_id_sgp"],
      nroversion: this.inputDts["_nro_version"],
      ruta: this.inputDts["_id_sgp"] + "/" + nombreImagen,
      observaciones: "",
      usrregistro: this.s_usu_id,
      idestado: 0,
      operacion: "S",
      tipo: "NN",
    };
    console.log(fichaImagen);
    this._seguimiento.seleccionaSupervisionImagen(fichaImagen).subscribe(
      (result: any) => {
        
        this.prop_tipomsg = result.estado.includes("Correcto")
          ? "modal_success"
          : "modal_warning";
        this.prop_msg = result.estado.includes("Correcto")
          ? "La seleccion de la Imagen se realizo de forma Correcta"
          : "No se pudo realizar el registro";
        this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
        // this.listaEmpresaImagenes(this.inputDts["_id_proyecto"]);
        this.lista_imagenes(this.inputDts["_id_proyecto"]);
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
  desseleccionImagenAppMovil(id_registro, nombreImagen) {
    let fichaImagen = {
      id: id_registro,
      fidproyecto: this.inputDts["_id_proyecto"],
      idsgp: this.inputDts["_id_sgp"],
      nroversion: this.inputDts["_nro_version"],
      ruta: this.inputDts["_id_sgp"] + "/" + nombreImagen,
      observaciones: "",
      usrregistro: this.s_usu_id,
      idestado: 0,
      operacion: "DS",
      tipo: "NN",
    };
    console.log(fichaImagen);
    this._seguimiento.seleccionaSupervisionImagen(fichaImagen).subscribe(
      (result: any) => {
        
        this.prop_tipomsg = result.estado.includes("Correcto")
          ? "modal_success"
          : "modal_warning";
        this.prop_msg = result.estado.includes("Correcto")
          ? "La seleccion de la Imagen se realizo de forma Correcta"
          : "No se pudo realizar el registro";
        this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
        // this.listaEmpresaImagenes(this.inputDts["_id_proyecto"]);
        this.lista_imagenes(this.inputDts["_id_proyecto"]);
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
  obtieneDatosProyecto(id_proyecto) {
    return new Promise((resolve, reject) => {
      //this.cargando = true;
      this._seguimiento.listaProyectosConsolidadosId(id_proyecto).subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            var dts = this._fun.RemplazaNullArray(result[0]);
            //console.log('DATOS PROYECTOS',this.inputDts);
            resolve(dts);
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
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  metodoenviaPadre(dts) {
    this.enviaPadre.emit(dts);
  }
}
