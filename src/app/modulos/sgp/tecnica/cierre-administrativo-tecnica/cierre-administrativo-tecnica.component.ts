import { DatePipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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
  selector: "app-cierre-administrativo-tecnica",
  templateUrl: "./cierre-administrativo-tecnica.component.html",
  styleUrls: ["./cierre-administrativo-tecnica.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
    AccesosRolComponent,
  ],
})
export class CierreAdministrativoTecnicaComponent implements OnInit {
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

  public pnl_listaproyecto = false;
  public pnl_supervision = false;
  public pnl_ampliacionplazo = false;

  public pnl_tecnica = false;
  public pnl_financiero = false;
  public pnl_legal = false;
  public pnl_galeria = false;
  public pnl_listaderecho = false;

  /************************************
   * VARIABLES DEL COMPONENTE
   ***********************************/
  public dts_listacierreadministrativo: any;
  public dts_listaempresaversion: any;
  public nombre_proyecto: any;
  public dts_estadoCierreAdministratvo: any;
  public id_estadoCierreAdministrativo: any;
  public dts_listaimagenes: any;
  public cierre_administrativo: {
    idcierre: any;
    fidproyecto: any;
    idsgp: any;
    estadocierre: any;
    descripcion: any;
    nombrearchivo: any;
    usrregistro: any;
    idestado: any;
    operacion: any;
    tipo: any;
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
  public btn_Actualiza = false;
  public btn_Registra = true;
  public id_sgp: any;

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
    this.cierre_administrativo = {
      idcierre: 0,
      fidproyecto: 0,
      idsgp: 0,
      estadocierre: "",
      descripcion: "",
      nombrearchivo: "",
      usrregistro: 0,
      idestado: 1,
      operacion: "",
      tipo: "",
    };

    this.dts_listaimagenes = [];
  }

  ngOnInit() {
    console.log(this.inputDts);
    this.obtenerConexion()
      .then(() => {
        return this._accesos.accesosRestriccionesxRolV2(this.s_usu_id);
      })
      .then((data) => {
        this.camposHabilitados = data;
        console.log("Adm Roles===>", this.camposHabilitados);
        this.listaEstadoCierre(20);
        this.nombre_proyecto = this.inputDts["_nombreproyecto"];
        this.id_sgp = this.inputDts["_id_sgp"];
        this.lista_cierre_administrativo(this.inputDts["_id_proyecto"]);
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
    if (string == "REGISTRA_FORMULARIO") {
      this.pnl_formulario = true;
      this.pnl_descarga = false;
      this.btn_Actualiza = false;
      this.btn_Registra = true;
    }
    if (string == "EDITA_FORMULARIO") {
      this.pnl_formulario = true;
      this.pnl_descarga = true;
      this.btn_Actualiza = true;
      this.btn_Registra = false;
    }
    if (string == "TERMINA_PROCESO") {
      this.pnl_formulario = false;
      this.pnl_descarga = false;
      this.btn_Actualiza = false;
      this.btn_Registra = false;
    }
  }

  obtieneEstadoCierre() {
    console.log(this.id_estadoCierreAdministrativo);
    var datos = this.dts_estadoCierreAdministratvo;

    var filtro = datos.filter((element) => {
      return element.id_detalle == this.id_estadoCierreAdministrativo;
    });

    this.cierre_administrativo.estadocierre =
      filtro[0]["descripciondetalleclasificador"];
    console.log(this.cierre_administrativo);
  }

  obtieneIdEstadoCierre(estadoCierre) {
    console.log(estadoCierre);
    var datos = this.dts_estadoCierreAdministratvo;

    var filtro = datos.filter((element) => {
      return element.descripciondetalleclasificador == estadoCierre;
    });

    this.id_estadoCierreAdministrativo = filtro[0]["id_detalle"];
  }
  listaEstadoCierre(idtipoclasificador) {
    this._seguimiento.listaClasificador(idtipoclasificador).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_estadoCierreAdministratvo = result;
          console.log(result);
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
  insertaCierreAdministrativo() {
    this.dts_listacierreadministrativo = [];
    this.cierre_administrativo.fidproyecto = this.inputDts["_id_proyecto"];
    this.cierre_administrativo.idsgp = this.inputDts["_id_sgp"];
    this.cierre_administrativo.usrregistro = this.s_usu_id;
    this.cierre_administrativo.operacion = "I";
    this.cierre_administrativo.tipo = "NN";

    this._seguimiento
      .insertaCierreAdministrativo(this.cierre_administrativo)
      .subscribe(
        (result: any) => {
          this.prop_tipomsg = result.estado.includes("Correcto")
            ? "modal_success"
            : "modal_warning";
          this.prop_msg = result.estado.includes("Correcto")
            ? "Se realizo correctamente el registro"
            : "No se pudo realizar el registro";
          this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
          this.cargando = false;
          this.lista_cierre_administrativo(this.inputDts["_id_proyecto"]);
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

  actualizaCierreAdministrativo() {
    this.cargando = true;
    this.dts_listacierreadministrativo = [];
    this.cierre_administrativo.fidproyecto = this.inputDts["_id_proyecto"];
    this.cierre_administrativo.idsgp = this.inputDts["_id_sgp"];
    this.cierre_administrativo.usrregistro = this.s_usu_id;
    this.cierre_administrativo.operacion = "U";
    this.cierre_administrativo.tipo = "NN";
    this.paneles("TERMINA_PROCESO");

    this._seguimiento
      .actualizaCierreAdministrativo(this.cierre_administrativo)
      .subscribe(
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
          this.lista_cierre_administrativo(this.inputDts["_id_proyecto"]);
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
  subirArchivoInsertaCierre() {
    this.archivoModel.TIPO_DOCUMENTO = "cierre_administrativo";
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
    this._autenticacion.subirArchivo(this.archivoModel).subscribe(
      (result: any) => {
        let respuestaSubida = result;
        console.log("resulSubida", respuestaSubida);
        if (respuestaSubida.ok) {
          this.cierre_administrativo.nombrearchivo =
            respuestaSubida.nombre_archivo;
          this.insertaCierreAdministrativo();
        } else {
          this._msg.formateoMensaje(
            "modal_warning",
            respuestaSubida.message,
            10
          );
        }
      },
      (error) => {
        this._msg.formateoMensaje("modal_danger", error);
      }
    );
  }
  actualizarArchivo() {
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
      this.actualizaCierreAdministrativo();
      //return;
    } else {
      this.archivoModel.FILE =
        this.inputArchivo === null ? this.file_empty : this.inputArchivo;
      console.log(this.archivoModel);
      this._autenticacion.reemplazarArchivo(this.archivoModel).subscribe(
        (result: any) => {
          let respuestaSubida = result;
          console.log("resulSubida", respuestaSubida);
          if (respuestaSubida.ok) {
            this.cierre_administrativo.nombrearchivo =
              respuestaSubida.nombre_archivo;
            setTimeout(() => {
              this.actualizaCierreAdministrativo();
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
  handleFileInput(files: FileList) {
    this.inputArchivo = files.item(0);
    let extensionesValidas = ["pdf"];
    let nombreArchivo = this.inputArchivo.name;
    let extension_archivo = nombreArchivo.substr(
      nombreArchivo.indexOf(".") + 1
    );
    console.log(this.inputArchivo);
    if (extensionesValidas.indexOf(extension_archivo) < 0) {
      this.prop_msg = "El formato del archivo seleccionado no es válido";
      this.prop_tipomsg = "modal_info";
      this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
      $("#inputArchivo").val("");
    } else {
      this.cierre_administrativo.nombrearchivo = this.inputArchivo.name;
      this.archivoModel.TIPO_DOCUMENTO = "cierre_administrativo";
      this.archivoModel.CODIGO = this.inputDts["_id_sgp"];
      this.archivoModel.NOM_FILE = this.inputArchivo.name;
    }
  }

  lista_cierre_administrativo(id_proy) {
    this.cargando = true;
    this.dts_listacierreadministrativo = [];
    this._seguimiento.listaCierreAdministrativoSgp(id_proy).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_listacierreadministrativo = this._fun.RemplazaNullArray(
            result[0]
          );
          this.cierre_administrativo.idcierre =
            this.dts_listacierreadministrativo.id_cierre;
          this.cierre_administrativo.estadocierre =
            this.dts_listacierreadministrativo.estado_cierre;
          this.cierre_administrativo.descripcion =
            this.dts_listacierreadministrativo.descripcion;
          this.cierre_administrativo.nombrearchivo =
            this.dts_listacierreadministrativo.nombre_archivo;
          this.paneles("EDITA_FORMULARIO");
        } else {
          this.prop_msg = "Alerta: No existe Cierre Administrativo registrado";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_info", this.prop_msg);
          this.paneles("REGISTRA_FORMULARIO");
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
}
