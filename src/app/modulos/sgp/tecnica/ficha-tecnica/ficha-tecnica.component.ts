import { DatePipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Inputmask from "inputmask";
import { Globals } from "../../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { AutenticacionService } from "../../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../../seguridad/mensajes/mensajes.component";
import { AccesosRolComponent } from "../../accesos-rol/accesos-rol.component";
import { SgpService } from "../../sgp.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-ficha-tecnica",
  templateUrl: "./ficha-tecnica.component.html",
  styleUrls: ["./ficha-tecnica.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
    AccesosRolComponent,
  ],
})
export class FichaTecnicaComponent implements OnInit {
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
  public pnl_galeria = false;

  /************************************
   * VARIABLES DEL COMPONENTE
   ***********************************/
  public btn_Actualiza = false;
  public btn_Registra = false;

  public dts_listafichatecnica: any;
  public dts_listaempresaversion: any;
  public nombre_proyecto: any;
  public dts_estadoFichaTecnica: any;
  public id_estadoFicha: any;
  public dts_listaimagenes: any;
  public pnl_listacontactos = false;
  public ficha_tecnica: {
    idfichatecnica: any;
    fidproyecto: any;
    autoridad: any;
    estadoficha: any;
    aspectorelevante: any;
    monto_ejecutado_upre: any;
    monto_ejecutado_contraparte: any;
    fecha_concluida: any;
    monto_pagado: any;
    monto_porpagar: any;
    rutaimagenuno: any;
    rutaimagendos: any;
    usrregistro: any;
    idestado: any;
    operacion: any;
    tipo: any;
    distancia_km: any;
  };
  public inputArchivo = null;
  public archivoModel: any = {
    TIPO_DOCUMENTO: "",
    CODIGO: "",
    FILE: null,
    NOM_FILE: "",
  };
  public file_empty: File;
  public pnl_descarga = false;
  public pnl_formulario = false;
  public flag_galeria = 0;
  public id_sgp = 0;
  public id_proyecto = 0;

  public camposHabilitados: {};

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
    this.ficha_tecnica = {
      idfichatecnica: 0,
      fidproyecto: 0,
      autoridad: "",
      estadoficha: "",
      aspectorelevante: "",
      monto_ejecutado_upre: 0,
      monto_ejecutado_contraparte: 0,
      fecha_concluida: "",
      monto_pagado: 0,
      monto_porpagar: 0,
      rutaimagenuno: "",
      rutaimagendos: "",
      usrregistro: 0,
      idestado: 1,
      operacion: "",
      tipo: "",
      distancia_km: "",
    };
    this.dts_listaimagenes = [];
  }

  ngOnInit() {
    this.mask_numerodecimal = new Inputmask("9{1,9}.9{1,2}");
    this.mask_fecha = new Inputmask("9{1,2}/9{1,2}/9{1,4}");
    this.mask_numero = new Inputmask("9{1,9}");
    this.mask_gestion = new Inputmask("9999");

    this.nombre_proyecto = this.inputDts["_nombreproyecto"];
    this.id_sgp = this.inputDts["_id_sgp"];
    this.id_proyecto = this.inputDts["_id_proyecto"];
    this.ficha_tecnica.monto_ejecutado_upre = this.inputDts["v_monto_cierre"];
    this.ficha_tecnica.monto_pagado = this.inputDts["v_monto_cierre"];
    this.ficha_tecnica.monto_porpagar = this.inputDts["v_monto_saldo"];

    console.log("datosFICHA==>", this.inputDts);

    this.lista_imagenes(this.inputDts["_id_proyecto"]);
    this.obtenerConexion()
      .then(() => {
        return this._accesos.accesosRestriccionesxRolV2(this.s_usu_id);
      })
      .then((data) => {
        this.camposHabilitados = data;
        console.log("Adm Roles===>", this.camposHabilitados);
        this.listaEstadoFichaTecnica(17);
        this.lista_ficha_tecnica(this.inputDts["_id_proyecto"]);
      });
  }
  /*******************************************************************************/
  /*MASCARAS
  /*******************************************************************************/
  cargarmascaras() {
    setTimeout(() => {
      var montoejecutadoupre = document.getElementById("montoejecutadoupre");
      this.mask_numerodecimal.mask(montoejecutadoupre);
      var m_montoejecutadocontraparte = document.getElementById(
        "m_montoejecutadocontraparte"
      );
      this.mask_numerodecimal.mask(m_montoejecutadocontraparte);
      var m_montopagado = document.getElementById("m_montopagado");
      this.mask_numerodecimal.mask(m_montopagado);
      var m_montoporpagar = document.getElementById("m_montoporpagar");
      this.mask_numerodecimal.mask(m_montoporpagar);
    }, 10);
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
    if (string == "LISTA_CONTACTOS") {
      $("#pnl_listacontactos").show();
      $("#pnl_nuevocontactos").hide();
    }
    if (string == "NUEVO_CONTACTO") {
      $("#modalContactos").modal("show");
      $("#btnRegistrar").show();
      $("#btnModificar").hide();
    }
    if (string == "REGISTRA_FORMULARIO") {
      this.pnl_formulario = true;
      this.pnl_descarga = false;
      this.btn_Actualiza = false;
      this.btn_Registra = true;
      this.cargarmascaras();
    }
    if (string == "EDITA_FORMULARIO") {
      this.pnl_formulario = true;
      this.pnl_descarga = true;
      this.btn_Actualiza = true;
      this.btn_Registra = false;
      this.cargarmascaras();
    }
    if (string == "TERMINA_PROCESO") {
      this.pnl_formulario = false;
      this.pnl_descarga = false;
      this.btn_Actualiza = false;
      this.btn_Registra = false;
    }
  }

  lista_imagenes(codigo) {
    this._autenticacion.listaArchivo(codigo).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          var dts = result.filter((item) => item.img_aplicacion == 1);
          if (dts.length > 0) {
            this.dts_listaimagenes = dts;
          } else {
            this.dts_listaimagenes = result;
            // for (let i = 0; i < 4; i++) {
            //   if (result[i]) {
            //     this.dts_listaimagenes.push(result[i]);
            //   }
            // }
          }
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
  listaEstadoFichaTecnica(idtipoclasificador) {
    this._seguimiento.listaClasificador(idtipoclasificador).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_estadoFichaTecnica = result;
        } else {
          this.prop_msg = "Alerta: No existen supervisiones registradas";
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

  insertaFichaTecnica() {
    this.cargando = true;

    this.dts_listafichatecnica = [];
    this.ficha_tecnica.fidproyecto = this.inputDts["_id_proyecto"];
    this.ficha_tecnica.usrregistro = this.s_usu_id;
    this.ficha_tecnica.operacion = "I";
    this.ficha_tecnica.tipo = "NN";
    this.ficha_tecnica.monto_ejecutado_upre = this._fun.valorNumericoDecimal(
      this.ficha_tecnica.monto_ejecutado_upre
    );
    this.ficha_tecnica.monto_ejecutado_contraparte =
      this._fun.valorNumericoDecimal(
        this.ficha_tecnica.monto_ejecutado_contraparte
      );
    this.ficha_tecnica.monto_pagado = this._fun.valorNumericoDecimal(
      this.ficha_tecnica.monto_pagado
    );
    this.ficha_tecnica.monto_porpagar = this._fun.valorNumericoDecimal(
      this.ficha_tecnica.monto_porpagar
    );
    this.paneles("TERMINA_PROCESO");

    this._seguimiento.insertaFichaTecnica(this.ficha_tecnica).subscribe(
      (result: any) => {
        
        this.prop_tipomsg = result.estado.includes("Correcto")
          ? "modal_success"
          : "modal_warning";
        this.prop_msg = result.estado.includes("Correcto")
          ? "Se realizo correctamente el registro"
          : "No se pudo realizar el registro";
        this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
        this.cargando = false;
        this.lista_ficha_tecnica(this.inputDts["_id_proyecto"]);
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

  actualizaFichaTecnica() {
    this.cargando = true;

    this.dts_listafichatecnica = [];
    this.ficha_tecnica.fidproyecto = this.inputDts["_id_proyecto"];
    this.ficha_tecnica.usrregistro = this.s_usu_id;
    this.ficha_tecnica.operacion = "U";
    this.ficha_tecnica.tipo = "NN";
    this.ficha_tecnica.monto_ejecutado_upre = this._fun.valorNumericoDecimal(
      this.ficha_tecnica.monto_ejecutado_upre
    );
    this.ficha_tecnica.monto_ejecutado_contraparte =
      this._fun.valorNumericoDecimal(
        this.ficha_tecnica.monto_ejecutado_contraparte
      );
    this.ficha_tecnica.monto_pagado = this._fun.valorNumericoDecimal(
      this.ficha_tecnica.monto_pagado
    );
    this.ficha_tecnica.monto_porpagar = this._fun.valorNumericoDecimal(
      this.ficha_tecnica.monto_porpagar
    );
    this.paneles("TERMINA_PROCESO");
    this._seguimiento.actualizaFichaTecnica(this.ficha_tecnica).subscribe(
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
        this.lista_ficha_tecnica(this.inputDts["_id_proyecto"]);
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

  obtieneEstadoFicha() {
    console.log(this.id_estadoFicha);
    var datos = this.dts_estadoFichaTecnica;

    var filtro = datos.filter((element) => {
      return element.id_detalle == this.id_estadoFicha;
    });

    this.ficha_tecnica.estadoficha =
      filtro[0]["descripciondetalleclasificador"];
    console.log(this.ficha_tecnica);
  }

  obtieneIdEstadoFicha(estadoFicha) {
    console.log(estadoFicha);
    var datos = this.dts_estadoFichaTecnica;

    var filtro = datos.filter((element) => {
      return element.descripciondetalleclasificador == estadoFicha;
    });

    this.id_estadoFicha = filtro[0]["id_detalle"];
  }

  obtieneNombreArchivoUno($event) {
    console.log("DATOS HIJO", $event);
    this.ficha_tecnica.rutaimagenuno = $event.NOM_FILE;
    this.pnl_galeria = false;
  }
  obtieneNombreArchivoDos($event) {
    this.ficha_tecnica.rutaimagendos = $event.NOM_FILE;
    this.pnl_galeria = false;
  }
  abreGaleria(inputGaleria) {
    this.pnl_galeria = true;
    this.flag_galeria = inputGaleria;
  }
  iniciarDtsFichaTecnica() {
    this.ficha_tecnica.autoridad = "";
    this.ficha_tecnica.estadoficha = "";
    this.ficha_tecnica.aspectorelevante = "";
    this.ficha_tecnica.monto_ejecutado_upre = 0;
    this.ficha_tecnica.monto_ejecutado_contraparte = 0;
    this.ficha_tecnica.fecha_concluida = this._fun.transformDateOf_yyyymmdd(
      this.dts_listafichatecnica.fecha_concluida
    );
    this.ficha_tecnica.monto_pagado = this.dts_listafichatecnica.monto_pagado;
    this.ficha_tecnica.monto_porpagar =
      this.dts_listafichatecnica.monto_porpagar;
    this.ficha_tecnica.rutaimagenuno =
      this.dts_listafichatecnica.ruta_imagen_uno;
    this.ficha_tecnica.rutaimagendos =
      this.dts_listafichatecnica.ruta_imagen_dos;
    this.ficha_tecnica.distancia_km =
      this.dts_listafichatecnica.distancia_en_km;
  }
  lista_ficha_tecnica(id_proy) {
    this.pnl_listacontactos = true;
    this.cargando = true;
    this.dts_listafichatecnica = [];

    this._seguimiento.listaFichaTecnica(id_proy).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_listafichatecnica = this._fun.RemplazaNullArray(result[0]);
          console.log("lista ficha tecnica", this.dts_listafichatecnica);
          this.ficha_tecnica.idfichatecnica =
            this.dts_listafichatecnica.id_fichatecnica;
          this.ficha_tecnica.fidproyecto =
            this.dts_listafichatecnica.fid_proyecto;
          this.ficha_tecnica.autoridad = this.dts_listafichatecnica.autoridad;
          this.ficha_tecnica.estadoficha =
            this.dts_listafichatecnica.estado_proyecto;
          this.ficha_tecnica.aspectorelevante =
            this.dts_listafichatecnica.aspectos_relevantes;
          this.ficha_tecnica.monto_ejecutado_upre =
            this.dts_listafichatecnica.monto_ejecutado_upre;
          this.ficha_tecnica.monto_ejecutado_contraparte =
            this.dts_listafichatecnica.monto_ejecutado_contraparte;
          this.ficha_tecnica.fecha_concluida =
            this._fun.transformDateOf_yyyymmdd(
              this.dts_listafichatecnica.fecha_concluida
            );
          this.ficha_tecnica.monto_pagado =
            this.dts_listafichatecnica.monto_pagado;
          this.ficha_tecnica.monto_porpagar =
            this.dts_listafichatecnica.monto_porpagar;
          this.ficha_tecnica.rutaimagenuno =
            this.dts_listafichatecnica.ruta_imagen_uno;
          this.ficha_tecnica.rutaimagendos =
            this.dts_listafichatecnica.ruta_imagen_dos;
          this.ficha_tecnica.distancia_km =
            this.dts_listafichatecnica.distancia_en_km;

          console.log("datos recu", this.ficha_tecnica);
          this.paneles("EDITA_FORMULARIO");
          this.cargando = false;
          //this.habilitaPanel(this.dts_listafichatecnica);
        } else {
          this.prop_msg = "Alerta: No existe ficha técnica registrada";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_info", this.prop_msg);
          //this.habilitaPanel(this.dts_listafichatecnica);
          this.paneles("REGISTRA_FORMULARIO");
          this.cargando = false;
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
          this.cargando = false;
        }
      }
    );
  }

  reporteFichaTecnicaExcel() {
    this.cargando = true;
    let nombreReporte = "FichaTecnica_" + this.id_sgp + ".xlsx";
    console.log("generando reporte");

    const miDTS = { tipo: "02", idProyecto: this.id_proyecto };

    this._seguimiento.reportesExcelJS(miDTS).subscribe(
      (result: any) => {
        // console.log(result);
        // const file = new Blob([result.blob()], {
        //   type: "application/vnd.ms.excel",
        // });
        //const file = new Blob([result])
        const fileURL = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", nombreReporte);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(fileURL);
        this.cargando = false;
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage,
            10
          );
        this.cargando = false;
      }
    );
  }
}
