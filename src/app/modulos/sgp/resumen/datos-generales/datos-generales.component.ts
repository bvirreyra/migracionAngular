import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
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
declare let L;

@Component({
  selector: "app-datos-generales",
  templateUrl: "./datos-generales.component.html",
  styleUrls: ["./datos-generales.component.css"],
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
export class DatosGeneralesComponent implements OnInit {
  @Input("inputDts") inputDts: string;
  @Input("opcion") opcion: string;
  @Output() outputAccion = new EventEmitter<string>();

  public cargando: boolean = false;
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

  /******************************** *
   * VARIABLESD DE COMPONENTE
   ********************************/
  public m_nombreproyecto: any;
  public m_descripcionproyecto: any;
  public m_departamento2: any;
  public m_tipoclasificador: any;
  public m_codentidadcontratante: any;
  public m_codtipoconvenio: any;
  public m_codentidadbeneficiaria: any;
  public m_nombrebeneficiario: any;
  public m_coddepartamento: any;
  public m_codmunicipio: any;
  public m_nroconvenio: any;
  public m_fechaconvenio: any;
  public m_plazoconvenio: any;
  public m_monto_upre: any;
  public m_monto_contraparte_beneficiario: any;
  public m_monto_contraparte_gobernacion: any;
  public m_monto_contraparte_municipal: any;
  public m_monto_convenio: any;
  public m_idseguimiento: any;
  public m_idsgp: any;
  public m_idproyecto: any;
  public m_codigoproyecto: any;
  public m_desembolso: any;
  public m_porcentaje_desembolso: any;
  public m_fecha_desembolso: any;
  public m_fecha_ordenproceder: any;
  public m_tipo_financiamiento: any;

  public m_estadoratificacion: any;
  public m_descripcion: any;
  public m_archivo_ratificacionconvenio: any;

  public m_contrato_contractual: any;

  public doc_base_contratacion: any;
  public doc_cert_presupuestaria: any;
  public doc_convenio: any;
  public doc_especificaciones_tecnicas: any;
  public doc_orden_proceder: any;
  public doc_planos_proyecto: any;
  public doc_resmin_cife: any;
  public doc_respaldo_modificacion: any;

  /**SECTOR DE MAPA PARA UBICACION DE PROYECTO**/
  public m_map: any;
  public m_osmBase: any;
  public m_osmCatastro: any;
  public m_imagensatelite: any;
  public tempIcon: any;
  public tempIconUpre: any;
  public m_baseMaps: any;
  public m_marca: any;
  public marca_domicilio: any;

  public _proyecto_cabecera: {
    _id_proyecto: any;
    _id_sgp: any;
    _id_seguimiento: any;
    _nro_version: 1;
    _cod_migracion: any;
    _cod_programa: any;
    _gestion: any;
    _entidad_detalle: any;
    _nombreproyecto: any;
    _cod_departamento: any;
    _cod_provincia: any;
    _cod_municipio: any;
    _cod_eta: any;
    _nro_convenio: any;
    _fecha_convenio: any;
    _codigo_sisin: any;
    _partida: any;
    _monto_contrato: any;
    _monto_upre: any;
    _monto_contraparte_beneficiario: any;
    _monto_contraparte_municipal: any;
    _monto_contraparte_gobernacion: any;
    _monto_contraparte: any;
    _tipo_convenio: any;
    _cod_entidad_contratante: any;
    _cod_tipo_financiamiento: any;
    _cod_area: any;
    _cod_clasificacion: any;
    _cod_sub_area: any;
    _cod_entidadbeneficiaria: any;
    _nombre_beneficiario: any;
    _descripcion_proyecto: any;
    _plazo_ejecucion: any;
    _superficie: any;
    _poblacion_beneficiada: any;
    _localizacion: any;
    _fecha_inicio: any;
    _entrega_provisional: any;
    _entrega_definitiva: any;
    _latitud: any;
    _longitud: any;
    _estado_fisico: any;
    _estado_financiero: any;
    _estado_cierre: any;
    _estado_proyecto: any;
    _estado_proyecto_migracion: any;
    _estado_proyecto_sgp: any;
    _estado_proyecto_seg: any;
    _usr_registro: any;
    _id_estado: any;
    _operacion: any;
    _tipo: any;
    _monto_contrato_original: any;
  };

  public seguimiento_proyecto: {
    inombreproyecto: any;
    itipo_proyecto: any;
    inroconvenio: any;
    imonto_financiamiento_upre: any;
    imonto_contraparte_beneficiario: any;
    iplazo_ejecucion_convenio: any;
    ientidadbeneficiaria: any;
    ifecha_financiamiento: any;
    imunicipio: any;
    ici_user: any;
  };

  public camposHabilitados: {};

  //DTS
  public dts_ListaDepartamento: any;
  public dts_ListaMunicipio: any;
  public dts_ListaArea: any;
  public dts_ListaClasificacion: any;
  public dts_ListaSubArea: any;
  public dts_ListaTipoFinanciamiento: any;
  public dts_ListaEntidadContratante: any;
  public dts_ListaEntidadContratanteBk: any;
  public dts_ListaTipoConvenio: any;
  public dts_ListaEntidadBeneficiaria: any;
  public dts_ListaEstadoProyecto: any;
  public dts_ListaEstadoFisico: any;
  public dts_ListaEstadoFinanciero: any;
  public dts_ListaEstadoCierre: any;
  public dts_ListaDatosGenerales: any;

  public dts_EquipoTecnico: any;
  public dts_Seguimiento: any;
  public dts_ConvenioSgp: any;
  public dts_lista_adenda: any;
  public dts_ratificacionconvenio: any;
  public m_tipoconvenio: any;

  //PANELES
  public pnl_convenio = false;
  public pnl_convenio_sgp = false;
  public pnl_contrato = false;
  public pnl_resolucionministerial = false;
  public pnl_cert_presupuestaria = false;
  public pnl_orden_proceder = false;
  public pnl_adenda = false;

  public pnl_ratificacionconvenio = false;
  public pnl_nuevoproyecto = false;

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
  }

  ngOnInit() {
    function falloCallback(error) {
      console.log("Falló con " + error);
    }
    console.log("INGRESA A DATOS GENERALES");
    this.mask_numerodecimal = new Inputmask("9{1,9}.9{1,2}");
    this.mask_fecha = new Inputmask("9{1,2}/9{1,2}/9{1,4}");
    this.mask_numero = new Inputmask("9{1,9}");
    this.mask_gestion = new Inputmask("9999");

    this.m_idproyecto = this.inputDts["_id_proyecto"];
    this.m_tipoconvenio = this.inputDts["_des_tipo_convenio"];

    this.inicializaProyectoCabecera();
    this.inicializaSeguimientoProyecto();
    this.cargaCombos(); //lista los clasificadores 9,8 y 7

    this.obtenerConexion()
      .then(() => {
        return this._accesos.accesosRestriccionesxRolV2(this.s_usu_id);
      })
      .then((data) => {
        console.log("Admin Roles2 ===>");
        this.camposHabilitados = data;
        this.camposHabilitados["_tecnica"] = data["_tecnica"];
        this.camposHabilitados["_financiera"] = data["_financiera"];
        this.camposHabilitados["_juridica"] = data["_juridica"];
        this.camposHabilitados["_cierre"] = data["_cierre"];
        this.camposHabilitados["_administrador"] = data["_administrador"];

        return this.listaArea();
      })
      .then((dts) => {
        this.dts_ListaArea = dts;
        if (this.camposHabilitados["_tecnica"] == false) {
          this._proyecto_cabecera._tipo = "TECNICA";
        }
        if (this.camposHabilitados["_financiera"] == false) {
          this._proyecto_cabecera._tipo = "FINANCIERA";
        }
        if (this.camposHabilitados["_juridica"] == false) {
          this._proyecto_cabecera._tipo = "JURIDICA";
        }
        if (this.camposHabilitados["_cierre"] == false) {
          this._proyecto_cabecera._tipo = "CIERRE";
        }
        if (this.camposHabilitados["_administrador"] == false) {
          this._proyecto_cabecera._tipo = "ADMIN";
        }
      })
      .then(() => {
        return this.listaClasificacion();
      })
      .then((dts) => {
        this.dts_ListaClasificacion = dts;
        return this.listaSubArea();
      })
      .then((dts) => {
        this.dts_ListaSubArea = dts;
      })
      .catch(falloCallback);

    this.listaEntidadContratante()
      .then((dts) => {
        this.dts_ListaEntidadContratante = dts;
        return this.listaTipoFinanciamiento();
      })
      .then((dts) => {
        this.dts_ListaTipoFinanciamiento = dts;
        return this.listaEntidadBeneficiaria();
      })
      .then((dts) => {
        this.dts_ListaEntidadBeneficiaria = dts;
        return this.listaTipoConvenio();
      })
      .then((dts) => {
        this.dts_ListaTipoConvenio = dts;

        if (
          this.inputDts != null &&
          this.inputDts != undefined &&
          this.inputDts != ""
        ) {
          this.cargaDatosGenerales();
          this.dtsConveniosSgp(this.inputDts["_id_proyecto"]);
          this.lista_adenda(this.inputDts["_id_proyecto"]).then((dts) => {
            this.dts_lista_adenda = dts;

            this.validaCoordenadasGeograficas();
          });
        }
        if (this.opcion == "INS") {
          this.inicializaProyectoCabecera();
        }
        return this.buscarDepartamento();
      })
      .then((dts) => {
        this.dts_ListaDepartamento = dts;
        if (
          this._proyecto_cabecera._cod_departamento != null &&
          this._proyecto_cabecera._cod_departamento != undefined &&
          this._proyecto_cabecera._cod_departamento != "" &&
          this._proyecto_cabecera._cod_departamento != "0"
        ) {
          console.log(
            "DEPARTAMENTO==>",
            this._proyecto_cabecera._cod_departamento
          );
          return this.buscarMunicipio(
            this._proyecto_cabecera._cod_departamento
          );
        }
      })
      .then((dts) => {
        this.dts_ListaMunicipio = dts;

        let valida = this.dts_ListaMunicipio.filter(
          (item) =>
            item.codigo_municipio == this._proyecto_cabecera._cod_municipio
        );

        if (valida.length <= 0) {
          this._proyecto_cabecera._cod_municipio = "0";
        }
      });
  }

  cargarMascaras() {
    var fecha_inicio = document.getElementById("m_fec_inicio");
    this.mask_fecha.mask(fecha_inicio);
    var entrega_provisional = document.getElementById("m_provisional");
    this.mask_fecha.mask(entrega_provisional);
    var entrega_definitiva = document.getElementById("m_definitiva");
    this.mask_fecha.mask(entrega_definitiva);
    var fecha_suscripcion = document.getElementById("m_fechaconvenio");
    this.mask_fecha.mask(fecha_suscripcion);
  }

  inicializaProyectoCabecera() {
    this._proyecto_cabecera = {
      _id_proyecto: 0,
      _id_sgp: 0,
      _id_seguimiento: 0,
      _nro_version: 1,
      _cod_migracion: null,
      _cod_programa: null,
      _gestion: 0,
      _entidad_detalle: null,
      _nombreproyecto: "",
      _cod_departamento: "0",
      _cod_provincia: "0",
      _cod_municipio: "0",
      _cod_eta: null,
      _nro_convenio: "",
      _fecha_convenio: "",
      _codigo_sisin: null,
      _partida: null,
      _monto_contrato: "0",
      _monto_upre: "0",
      _monto_contraparte_beneficiario: "0",
      _monto_contraparte_municipal: "0",
      _monto_contraparte_gobernacion: "0",
      _monto_contraparte: "0",
      _tipo_convenio: "0",
      _cod_entidad_contratante: "0",
      _cod_tipo_financiamiento: "0",
      _cod_area: "0",
      _cod_clasificacion: "0",
      _cod_sub_area: "0",
      _cod_entidadbeneficiaria: "0",
      _nombre_beneficiario: "",
      _descripcion_proyecto: "",
      _plazo_ejecucion: "0",
      _superficie: "0",
      _poblacion_beneficiada: "0",
      _localizacion: "",
      _fecha_inicio: null,
      _entrega_provisional: null,
      _entrega_definitiva: null,
      _latitud: null,
      _longitud: null,
      _estado_fisico: null,
      _estado_financiero: null,
      _estado_cierre: null,
      _estado_proyecto: "36",
      _estado_proyecto_migracion: null,
      _estado_proyecto_sgp: null,
      _estado_proyecto_seg: null,
      _usr_registro: this.s_usu_id,
      _id_estado: 1,
      _operacion: "U",
      _tipo: "NN",
      _monto_contrato_original: "0",
    };
  }

  inicializaSeguimientoProyecto() {
    this.seguimiento_proyecto = {
      inombreproyecto: "",
      itipo_proyecto: "",
      inroconvenio: "",
      imonto_financiamiento_upre: "",
      imonto_contraparte_beneficiario: "",
      iplazo_ejecucion_convenio: "",
      ientidadbeneficiaria: "",
      ifecha_financiamiento: "",
      imunicipio: "",
      ici_user: "",
    };
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
      console.log("DATOS DEL STORAGE", this.dtsDatosConexion);

      resolve(1);
    });
  }

  cargaDatosGenerales() {
    // _usr_registro: this.s_usu_id,
    // _id_estado: 1,
    // _operacion: "I",
    // _tipo: "NN",

    this._proyecto_cabecera._id_proyecto = this.inputDts["_id_proyecto"];
    this._proyecto_cabecera._id_sgp = this.inputDts["_id_sgp"];
    this._proyecto_cabecera._id_seguimiento = this.inputDts["_id_seguimiento"];
    this._proyecto_cabecera._nro_version = this.inputDts["_nro_version"];
    this._proyecto_cabecera._gestion = this.inputDts["_gestion"];
    this._proyecto_cabecera._nombreproyecto = this.inputDts["_nombreproyecto"];
    this._proyecto_cabecera._cod_departamento =
      this.inputDts["_cod_departamento"];
    this._proyecto_cabecera._cod_municipio = this.inputDts["_cod_municipio"];
    this._proyecto_cabecera._nro_convenio = this.inputDts["_nro_convenio"];
    this._proyecto_cabecera._fecha_convenio = moment(
      this.inputDts["_fecha_convenio"]
    ).format("DD/MM/YYYY");
    this._proyecto_cabecera._monto_upre = this.inputDts["_monto_upre"];
    this._proyecto_cabecera._monto_contraparte_beneficiario =
      this.inputDts["_monto_contraparte_beneficiario"];
    this._proyecto_cabecera._monto_contraparte_municipal =
      this.inputDts["_monto_contraparte_municipal"];
    this._proyecto_cabecera._monto_contraparte_gobernacion =
      this.inputDts["_monto_contraparte_gobernacion"];
    this._proyecto_cabecera._monto_contraparte =
      this._proyecto_cabecera._monto_contraparte_beneficiario +
      this._proyecto_cabecera._monto_contraparte_gobernacion +
      this._proyecto_cabecera._monto_contraparte_municipal;

    this._proyecto_cabecera._monto_contraparte = this._fun.valorNumericoDecimal(
      this._proyecto_cabecera._monto_contraparte
    );
    this._proyecto_cabecera._monto_contrato = this.inputDts["_monto_contrato"];
    // this._proyecto_cabecera._monto_contrato = this._proyecto_cabecera._monto_upre +
    // this._proyecto_cabecera._monto_contraparte_beneficiario +
    // this._proyecto_cabecera._monto_contraparte_gobernacion +
    // this._proyecto_cabecera._monto_contraparte_municipal;

    this._proyecto_cabecera._monto_contrato = this._fun.valorNumericoDecimal(
      this._proyecto_cabecera._monto_contrato
    );

    this._proyecto_cabecera._tipo_convenio = this.inputDts["_tipo_convenio"];
    this._proyecto_cabecera._cod_entidad_contratante =
      this.inputDts["_cod_entidad_contratante"];
    this._proyecto_cabecera._cod_tipo_financiamiento =
      this.inputDts["_cod_tipo_financiamiento"];
    this._proyecto_cabecera._cod_area = this.inputDts["_cod_area"];
    this._proyecto_cabecera._cod_clasificacion =
      this.inputDts["_cod_clasificacion"];
    this._proyecto_cabecera._cod_sub_area = this.inputDts["_cod_sub_area"];
    this._proyecto_cabecera._cod_entidadbeneficiaria =
      this.inputDts["_cod_entidadbeneficiaria"];
    this._proyecto_cabecera._nombre_beneficiario =
      this.inputDts["_nombre_beneficiario"];
    this._proyecto_cabecera._descripcion_proyecto =
      this.inputDts["_descripcion_proyecto"];
    this._proyecto_cabecera._plazo_ejecucion =
      this.inputDts["_plazo_ejecucion"];
    this._proyecto_cabecera._superficie = this.inputDts["_superficie"];
    this._proyecto_cabecera._poblacion_beneficiada =
      this.inputDts["_poblacion_beneficiada"];
    this._proyecto_cabecera._localizacion = this.inputDts["_localizacion"];
    this._proyecto_cabecera._fecha_inicio = moment(
      this.inputDts["_fecha_inicio"]
    ).format("DD/MM/YYYY");
    this._proyecto_cabecera._entrega_provisional = moment(
      this.inputDts["_entrega_provisional"]
    ).format("DD/MM/YYYY");
    this._proyecto_cabecera._entrega_definitiva = moment(
      this.inputDts["_entrega_definitiva"]
    ).format("DD/MM/YYYY");
    this._proyecto_cabecera._estado_proyecto =
      this.inputDts["_estado_proyecto"];
    this._proyecto_cabecera._estado_fisico = this.inputDts["_estado_fisico"];
    this._proyecto_cabecera._estado_financiero =
      this.inputDts["_estado_financiero"];
    this._proyecto_cabecera._estado_cierre = this.inputDts["_estado_cierre"];
    this._proyecto_cabecera._latitud = this.inputDts["_latitud"];
    this._proyecto_cabecera._longitud = this.inputDts["_longitud"];

    this.m_idseguimiento = this.inputDts["_id_seguimiento"];
    this.m_idsgp = this.inputDts["_id_sgp"];
    this.m_idproyecto = this.inputDts["_id_proyecto"];
    this.m_codigoproyecto = this.inputDts["_codigo"];

    if (this.inputDts["_id_seguimiento"] > 0) {
      this.dtsProyectoSeguimiento();
    } else {
      if (this.inputDts["_id_sgp"] != "") {
        //this.dtsConveniosSgp();
      }
    }
    if (this.inputDts["_id_sgp"] != "") {
      this.dtsRatificacionConvenio();
    }

    // this.buscarDepartamento();
  }
  obtieneDatosGenerales() {
    this.cargando = true;

    this._sgp.listaProyectosConsolidadosId(this.m_idproyecto).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          let dts = this._fun.RemplazaNullArray(result);
          this.dts_ListaDatosGenerales = dts[0];
          this.cargando = false;
          this.cargaDatosGeneralesPost();
        } else {
          this.prop_msg = "Alerta: No existen registros de la busqueda1";
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
  cargaDatosGeneralesPost() {
    this._proyecto_cabecera._id_proyecto =
      this.dts_ListaDatosGenerales["_id_proyecto"];
    this._proyecto_cabecera._id_sgp = this.dts_ListaDatosGenerales["_id_sgp"];
    this._proyecto_cabecera._id_seguimiento =
      this.dts_ListaDatosGenerales["_id_seguimiento"];
    this._proyecto_cabecera._nro_version =
      this.dts_ListaDatosGenerales["_nro_version"];
    this._proyecto_cabecera._gestion = this.dts_ListaDatosGenerales["_gestion"];
    this._proyecto_cabecera._nombreproyecto =
      this.dts_ListaDatosGenerales["_nombreproyecto"];
    this._proyecto_cabecera._cod_departamento =
      this.dts_ListaDatosGenerales["_cod_departamento"];
    this._proyecto_cabecera._cod_municipio =
      this.dts_ListaDatosGenerales["_cod_municipio"];
    this._proyecto_cabecera._nro_convenio =
      this.dts_ListaDatosGenerales["_nro_convenio"];
    this._proyecto_cabecera._fecha_convenio = moment(
      this.dts_ListaDatosGenerales["_fecha_convenio"]
    ).format("DD/MM/YYYY");
    this._proyecto_cabecera._monto_upre =
      this.dts_ListaDatosGenerales["_monto_upre"];
    this._proyecto_cabecera._monto_contraparte_beneficiario =
      this.dts_ListaDatosGenerales["_monto_contraparte_beneficiario"];
    this._proyecto_cabecera._monto_contraparte_municipal =
      this.dts_ListaDatosGenerales["_monto_contraparte_municipal"];
    this._proyecto_cabecera._monto_contraparte_gobernacion =
      this.dts_ListaDatosGenerales["_monto_contraparte_gobernacion"];
    this._proyecto_cabecera._monto_contraparte =
      this._proyecto_cabecera._monto_contraparte_beneficiario +
      this._proyecto_cabecera._monto_contraparte_gobernacion +
      this._proyecto_cabecera._monto_contraparte_municipal;

    this._proyecto_cabecera._monto_contraparte = this._fun.valorNumericoDecimal(
      this._proyecto_cabecera._monto_contraparte
    );
    this._proyecto_cabecera._monto_contrato =
      this.dts_ListaDatosGenerales["_monto_contrato"];
    // this._proyecto_cabecera._monto_contrato = this._proyecto_cabecera._monto_upre +
    // this._proyecto_cabecera._monto_contraparte_beneficiario +
    // this._proyecto_cabecera._monto_contraparte_gobernacion +
    // this._proyecto_cabecera._monto_contraparte_municipal;

    this._proyecto_cabecera._monto_contrato = this._fun.valorNumericoDecimal(
      this._proyecto_cabecera._monto_contrato
    );

    this._proyecto_cabecera._tipo_convenio =
      this.dts_ListaDatosGenerales["_tipo_convenio"];
    this._proyecto_cabecera._cod_entidad_contratante =
      this.dts_ListaDatosGenerales["_cod_entidad_contratante"];
    this._proyecto_cabecera._cod_tipo_financiamiento =
      this.dts_ListaDatosGenerales["_cod_tipo_financiamiento"];
    this._proyecto_cabecera._cod_area =
      this.dts_ListaDatosGenerales["_cod_area"];
    this._proyecto_cabecera._cod_clasificacion =
      this.dts_ListaDatosGenerales["_cod_clasificacion"];
    this._proyecto_cabecera._cod_sub_area =
      this.dts_ListaDatosGenerales["_cod_sub_area"];
    this._proyecto_cabecera._cod_entidadbeneficiaria =
      this.dts_ListaDatosGenerales["_cod_entidadbeneficiaria"];
    this._proyecto_cabecera._nombre_beneficiario =
      this.dts_ListaDatosGenerales["_nombre_beneficiario"];
    this._proyecto_cabecera._descripcion_proyecto =
      this.dts_ListaDatosGenerales["_descripcion_proyecto"];
    this._proyecto_cabecera._plazo_ejecucion =
      this.dts_ListaDatosGenerales["_plazo_ejecucion"];
    this._proyecto_cabecera._superficie =
      this.dts_ListaDatosGenerales["_superficie"];
    this._proyecto_cabecera._poblacion_beneficiada =
      this.dts_ListaDatosGenerales["_poblacion_beneficiada"];
    this._proyecto_cabecera._localizacion =
      this.dts_ListaDatosGenerales["_localizacion"];
    this._proyecto_cabecera._fecha_inicio = moment(
      this.dts_ListaDatosGenerales["_fecha_inicio"]
    ).format("DD/MM/YYYY");
    this._proyecto_cabecera._entrega_provisional = moment(
      this.dts_ListaDatosGenerales["_entrega_provisional"]
    ).format("DD/MM/YYYY");
    this._proyecto_cabecera._entrega_definitiva = moment(
      this.dts_ListaDatosGenerales["_entrega_definitiva"]
    ).format("DD/MM/YYYY");
    this._proyecto_cabecera._estado_proyecto =
      this.dts_ListaDatosGenerales["_estado_proyecto"];
    this._proyecto_cabecera._estado_fisico =
      this.dts_ListaDatosGenerales["_estado_fisico"];
    this._proyecto_cabecera._estado_financiero =
      this.dts_ListaDatosGenerales["_estado_financiero"];
    this._proyecto_cabecera._estado_cierre =
      this.dts_ListaDatosGenerales["_estado_cierre"];

    this.m_idseguimiento = this.dts_ListaDatosGenerales["_id_seguimiento"];
    this.m_idsgp = this.dts_ListaDatosGenerales["_id_sgp"];
    this.m_idproyecto = this.dts_ListaDatosGenerales["_id_proyecto"];
    this.m_codigoproyecto = this.dts_ListaDatosGenerales["_codigo"];

    this._proyecto_cabecera._latitud = this.dts_ListaDatosGenerales["_latitud"];
    this._proyecto_cabecera._longitud =
      this.dts_ListaDatosGenerales["_longitud"];

    if (this.dts_ListaDatosGenerales["_id_seguimiento"] > 0) {
      this.dtsProyectoSeguimiento();
    } else {
      if (this.dts_ListaDatosGenerales["_id_sgp"] != "") {
        //this.dtsConveniosSgp();
      }
    }
    // if (this.dts_ListaDatosGenerales["_id_sgp"] != "") {
    //   this.dtsRatificacionConvenio();
    // }

    //this.buscarDepartamento();
  }

  buscarDepartamento() {
    return new Promise((resolve, reject) => {
      //this.cargando = true;
      this._sgp.getBuscarDepartamento_detalle().subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            var dts = this._fun.RemplazaNullArray(result);
            resolve(dts);
          } else {
            this.prop_msg = "Alerta: No existen registros de la busqueda1";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
            reject(this.prop_msg);
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
    });
  }
  buscarMunicipio(cod_dep: any) {
    return new Promise((resolve, reject) => {
      //this.cargando = true;
      cod_dep = cod_dep.split(" ");

      var dts = this.dts_ListaDepartamento.filter(
        (item) => item.codigo_departamento == cod_dep[0]
      );

      this._sgp.getBuscarMunicipio_detalle(cod_dep[0]).subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            var dts = this._fun.RemplazaNullArray(result);
            resolve(dts);
          } else {
            this.prop_msg = "Alerta: No existen registros de la busqueda";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
            reject(this.prop_msg);
            //this.cargando = false;
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
    });
  }

  listaArea() {
    //this.cargando = true;
    return new Promise((resolve, reject) => {
      this._sgp.listaArea().subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            //this.dts_ListaArea = this._fun.RemplazaNullArray(result);
            //this.cargando = false;
            resolve(this._fun.RemplazaNullArray(result));
            //return result;
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
  validaCoordenadasGeograficas() {
    // this.cargando = true;

    return new Promise((resolve, reject) => {
      this.pnl_nuevoproyecto = true;
      setTimeout(() => {
        this.cargarMascaras();
        var x =
          "" +
          this._proyecto_cabecera._latitud +
          ";" +
          this._proyecto_cabecera._longitud +
          "";

        if (this._fun.isValidCoordinates(x) == true) {
          this.inicializandoMapaV0();
        }
      }, 10);

      return 1;
    });
  }
  listaClasificacion() {
    //this.cargando = true;
    return new Promise((resolve, reject) => {
      this._sgp.listaClasificacion().subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            //this.dts_ListaClasificacion = this._fun.RemplazaNullArray(result);
            //this.cargando = false;
            resolve(this._fun.RemplazaNullArray(result));
            //return result;
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

  listaSubArea() {
    //this.cargando = true;
    return new Promise((resolve, reject) => {
      this._sgp.listaSubArea().subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            //this.dts_ListaSubArea = this._fun.RemplazaNullArray(result);
            //this.cargando = false;
            resolve(this._fun.RemplazaNullArray(result));
            //return result;
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

  listaEntidadContratante() {
    //this.cargando = true;
    return new Promise((resolve, reject) => {
      this._sgp.listaEntidadContratante().subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            //this.dts_ListaEntidadContratante =this._fun.RemplazaNullArray(result);
            //this.dts_ListaEntidadContratanteBk =this._fun.RemplazaNullArray(result);
            // this.cargando = false;
            resolve(this._fun.RemplazaNullArray(result));
            //return result;
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

  listaTipoFinanciamiento() {
    //this.cargando = true;
    return new Promise((resolve, reject) => {
      this._sgp.listaTipoFinancimaento().subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            //this.dts_ListaTipoFinanciamiento =this._fun.RemplazaNullArray(result);
            // this.cargando = false;
            resolve(this._fun.RemplazaNullArray(result));
            //return result;
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
  listaTipoConvenio() {
    //this.cargando = true;
    this.m_tipoclasificador = "TIPO CONVENIO";
    return new Promise((resolve, reject) => {
      this._sgp.listaTipoConvenio(this.m_tipoclasificador).subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            //this.dts_ListaTipoConvenio = this._fun.RemplazaNullArray(result);
            //this.cargando = false;
            resolve(this._fun.RemplazaNullArray(result));
            //return result;
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
  listaEntidadBeneficiaria() {
    //this.cargando = true;
    return new Promise((resolve, reject) => {
      this._sgp.listaEntidadBeneficiaria().subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            //this.dts_ListaEntidadBeneficiaria = this._fun.RemplazaNullArray(result);
            //this.cargando = false;
            resolve(this._fun.RemplazaNullArray(result));
            //return result;
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
  dtsProyectoSeguimiento() {
    // this.cargando = true;
    this._seguimiento
      .listaProyectosxIdSeguimiento(this.m_idseguimiento)
      .subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            this.dts_Seguimiento = this._fun.RemplazaNullArray(result);
            console.log("datos seguimiento", this.dts_Seguimiento);
            this.doc_base_contratacion =
              this.dts_Seguimiento[0]["doc_base_contratacion"];
            this.doc_cert_presupuestaria =
              this.dts_Seguimiento[0]["doc_cert_presupuestaria"];
            this.doc_convenio = this.dts_Seguimiento[0]["doc_convenio"];
            this.doc_especificaciones_tecnicas =
              this.dts_Seguimiento[0]["doc_especificaciones_tecnicas"];
            this.doc_orden_proceder =
              this.dts_Seguimiento[0]["doc_orden_proceder"];
            this.doc_planos_proyecto =
              this.dts_Seguimiento[0]["doc_planos_proyecto"];
            this.doc_resmin_cife = this.dts_Seguimiento[0]["doc_resmin_cife"];
            this.doc_respaldo_modificacion =
              this.dts_Seguimiento[0]["doc_respaldo_modificacion"];

            this.m_desembolso = this.dts_Seguimiento[0]["desembolso"];
            this.m_porcentaje_desembolso =
              this.dts_Seguimiento[0]["porcentaje_desembolso"];
            this.m_fecha_desembolso =
              this.dts_Seguimiento[0]["fecha_desembolso"];
            this.m_fecha_ordenproceder =
              this.dts_Seguimiento[0]["orden_proceder"];
            //this.cargando = false;
            if (this.doc_convenio != "") {
              this.pnl_convenio = true;
            }
            if (this.doc_resmin_cife != "") {
              this.pnl_resolucionministerial = true;
            }
            if (this.doc_cert_presupuestaria != "") {
              this.pnl_cert_presupuestaria = true;
            }
            if (this.doc_orden_proceder != "") {
              this.pnl_orden_proceder = true;
            }
            this.pnl_contrato = true;
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            console.log(this.errorMessage);
            alert("Error en la petición BUSQUEDA3");
          }
        }
      );
  }
  dtsConveniosSgp(id_proyecto) {
    //this.cargando = true;
    this._sgp.listaConvenioxIdSgp(id_proyecto).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_ConvenioSgp = this._fun.RemplazaNullArray(result);
          console.log("LISTA CONVENIO", this.dts_ConvenioSgp);

          this.m_monto_upre = this.dts_ConvenioSgp[0].monto_upre;
          this.m_monto_contraparte_beneficiario =
            this.dts_ConvenioSgp[0].monto_contraparte_beneficiario;
          this.m_monto_contraparte_gobernacion =
            this.dts_ConvenioSgp[0].monto_contraparte_gobernacion;
          this.m_monto_contraparte_municipal =
            this.dts_ConvenioSgp[0].monto_contraparte_municipal;
          this.m_monto_convenio = this.dts_ConvenioSgp[0].monto_contrato;
          this.pnl_convenio_sgp = true;
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la petición BUSQUEDA4");
        }
      }
    );
  }
  dtsRatificacionConvenio() {
    //this.cargando = true;
    console.log("ingresa derescho");
    this._sgp
      .listaRatificacionConvenio(this._proyecto_cabecera._id_proyecto)
      .subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            this.dts_ratificacionconvenio = this._fun.RemplazaNullArray(result);
            this.pnl_ratificacionconvenio = true;
            this.m_estadoratificacion =
              this.dts_ratificacionconvenio[0]["estado_ratificacionconvenio"];
            this.m_descripcion =
              this.dts_ratificacionconvenio[0]["descripcion"];
            this.m_archivo_ratificacionconvenio =
              this.dts_ratificacionconvenio[0]["nombre_archivo"];
            // console.log("ratificacion", this.dts_ratificacionconvenio);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            console.log(this.errorMessage);
            alert("Error en la petición BUSQUEDA5");
          }
        }
      );
  }

  filtradoMunicipio(dpto) {
    this.buscarMunicipio(dpto).then((dts) => {
      this.dts_ListaMunicipio = dts;
    });
  }
  filtradoClasificacion(listado, campo) {
    var a = [];
    if (listado != undefined) {
      a = listado.filter((item) => item.sgp_area_id == campo);
      let valida = a.filter(
        (item) => item.id == this._proyecto_cabecera._cod_clasificacion
      ).length;

      if (valida <= 0) {
        this._proyecto_cabecera._cod_clasificacion = "0";
      }
    }
    return a;
  }

  filtradoSubArea(listado, campo) {
    var a = [];
    if (listado != undefined) {
      a = listado.filter((item) => item.sgp_clasificacion_id == campo);
      let valida = a.filter(
        (item) => item.id == this._proyecto_cabecera._cod_sub_area
      ).length;

      if (valida <= 0) {
        this._proyecto_cabecera._cod_sub_area = "0";
      }
    }
    return a;
  }

  setTipoClasificacion() {
    this._proyecto_cabecera._cod_clasificacion = "0";
    this._proyecto_cabecera._cod_sub_area = "0";
  }

  setTipoFinanciamiento() {
    this._proyecto_cabecera._cod_tipo_financiamiento = "0";
  }

  setSubArea() {
    this._proyecto_cabecera._cod_sub_area = "0";
  }

  filtradoTipoFinanciamiento(listado, campo) {
    var a = [];
    if (listado != undefined) {
      a = listado.filter((item) => item.sgp_entidad_contratante_id == campo);
    }
    return a;
  }

  insertaProyectoCabecera() {
    this.cargando = true;
    let tipoProy = this.dts_ListaEntidadContratante.filter((elemento) => {
      return elemento.id == this._proyecto_cabecera._cod_entidad_contratante;
    });
    tipoProy = "TP_" + tipoProy[0]["tipo_entidad"];
    this.seguimiento_proyecto = {
      inombreproyecto: this._proyecto_cabecera._nombreproyecto,
      itipo_proyecto: tipoProy,
      inroconvenio: this._proyecto_cabecera._nro_convenio,
      imonto_financiamiento_upre: this._proyecto_cabecera._monto_upre,
      imonto_contraparte_beneficiario:
        this._proyecto_cabecera._monto_contraparte,
      iplazo_ejecucion_convenio: this._proyecto_cabecera._plazo_ejecucion,
      ientidadbeneficiaria: this._proyecto_cabecera._nombre_beneficiario,
      ifecha_financiamiento: this._proyecto_cabecera._fecha_convenio,
      imunicipio: this._proyecto_cabecera._cod_municipio,
      ici_user: this.s_ci_user,
    };
    this._sgp.insertaSeguimientoProyecto(this.seguimiento_proyecto).subscribe(
      (result: any) => {
        

        if (result.hasOwnProperty("estado")) {
          this.prop_msg =
            "No se pudo realizar la inserción del registro solicitado";
          this._msg.formateoMensaje("modal_info", this.prop_msg);
          this.cargando = false;
          return;
        }
        this._proyecto_cabecera._id_seguimiento = result[0]["_idproyecto"];
        this._proyecto_cabecera._operacion = "I";
        this._proyecto_cabecera._usr_registro = this.s_usu_id;
        this._sgp.insertaProyectoCabecera(this._proyecto_cabecera).subscribe(
          (result: any) => {
            
            if (result.hasOwnProperty("estado")) {
              this.prop_msg =
                "No se pudo realizar la inserción del registro solicitado";
              this._msg.formateoMensaje("modal_info", this.prop_msg);
              this.cargando = false;
              return;
            }
            this.prop_msg = "Se realizó la inserción de manera correcta";
            this._msg.formateoMensaje("modal_success", this.prop_msg);
            setTimeout(() => {
              window.location.reload();
              this.cargando = false;
            }, 1000);
          },
          (error) => {
            this.errorMessage = <any>error;
            if (this.errorMessage != null) {
              console.log(this.errorMessage);
              alert("Error al momento de realizar la inserccion");
              this.cargando = false;
            }
          }
        );
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error al momento de realizar la inserccion");
          this.cargando = false;
        }
      }
    );
  }

  // resetObj() {
  //   this.inicializaProyectoCabecera();
  //   console.log(this._proyecto_cabecera);
  // }
  listaEstados() {
    // ESTADO PROYECTO
    this._sgp.listaClasificador(9).subscribe(
      (result: any) => {
        
        this.dts_ListaEstadoProyecto = result;
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la petición BUSQUEDA5");
        }
      }
    );
    // ESTADO CIERRE
    this._sgp.listaClasificador(8).subscribe(
      (result: any) => {
        
        this.dts_ListaEstadoCierre = result;
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la petición BUSQUEDA5");
        }
      }
    );
    // ESTADO FINANCIERO
    this._sgp.listaClasificador(7).subscribe(
      (result: any) => {
        
        this.dts_ListaEstadoFinanciero = result;
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la petición BUSQUEDA5");
        }
      }
    );
    // ESTADO FISICO
    this._sgp.listaClasificador(6).subscribe(
      (result: any) => {
        
        this.dts_ListaEstadoFisico = result;
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la petición BUSQUEDA5");
        }
      }
    );
  }
  cargaCombos() {
    this.listaEstados();
  }

  setMontoContraparte() {
    let a: number;
    //let a: string;

    this._proyecto_cabecera._monto_upre =
      this._proyecto_cabecera._monto_upre == ""
        ? "0"
        : this._proyecto_cabecera._monto_upre;
    this._proyecto_cabecera._monto_contraparte_beneficiario =
      this._proyecto_cabecera._monto_contraparte_beneficiario == ""
        ? "0"
        : this._proyecto_cabecera._monto_contraparte_beneficiario;
    this._proyecto_cabecera._monto_contraparte_gobernacion =
      this._proyecto_cabecera._monto_contraparte_gobernacion == ""
        ? "0"
        : this._proyecto_cabecera._monto_contraparte_gobernacion;
    this._proyecto_cabecera._monto_contraparte_municipal =
      this._proyecto_cabecera._monto_contraparte_municipal == ""
        ? "0"
        : this._proyecto_cabecera._monto_contraparte_municipal;

    a =
      this._fun.valorNumericoDecimal(this._proyecto_cabecera._monto_upre) +
      this._fun.valorNumericoDecimal(
        this._proyecto_cabecera._monto_contraparte_beneficiario
      ) +
      this._fun.valorNumericoDecimal(
        this._proyecto_cabecera._monto_contraparte_gobernacion
      ) +
      this._fun.valorNumericoDecimal(
        this._proyecto_cabecera._monto_contraparte_municipal
      );
    this._proyecto_cabecera._monto_contraparte =
      this._fun.valorNumericoDecimal(a);
  }

  // setEntregaProvisional() {
  //   let dd = moment(this._proyecto_cabecera._fecha_inicio.substr(0, 10)).add(
  //     "days",
  //     this._proyecto_cabecera._plazo_ejecucion == ""
  //       ? 0
  //       : parseInt(this._proyecto_cabecera._plazo_ejecucion)
  //   );
  //   this._proyecto_cabecera._entrega_provisional = dd.format("YYYY-MM-DD");
  // }
  actualizaProyectoCabecera() {
    this._proyecto_cabecera._usr_registro = this.s_usu_id;
    this._proyecto_cabecera._id_seguimiento =
      this._proyecto_cabecera._id_seguimiento == ""
        ? "0"
        : this._proyecto_cabecera._id_seguimiento;
    //this._proyecto_cabecera._nro_version=this._proyecto_cabecera._nro_version =='' ? "0":this._proyecto_cabecera.;
    this._proyecto_cabecera._cod_migracion =
      this._proyecto_cabecera._cod_migracion == ""
        ? "0"
        : this._proyecto_cabecera._cod_migracion;
    this._proyecto_cabecera._cod_programa =
      this._proyecto_cabecera._cod_programa == ""
        ? "0"
        : this._proyecto_cabecera._cod_programa;
    this._proyecto_cabecera._gestion =
      this._proyecto_cabecera._gestion == ""
        ? "0"
        : this._proyecto_cabecera._gestion;
    this._proyecto_cabecera._cod_eta =
      this._proyecto_cabecera._cod_eta == ""
        ? "0"
        : this._proyecto_cabecera._cod_eta;
    this._proyecto_cabecera._partida =
      this._proyecto_cabecera._partida == ""
        ? "0"
        : this._proyecto_cabecera._partida;
    this._proyecto_cabecera._tipo_convenio =
      this._proyecto_cabecera._tipo_convenio == ""
        ? "0"
        : this._proyecto_cabecera._tipo_convenio;
    this._proyecto_cabecera._cod_entidad_contratante =
      this._proyecto_cabecera._cod_entidad_contratante == ""
        ? "0"
        : this._proyecto_cabecera._cod_entidad_contratante;
    this._proyecto_cabecera._cod_tipo_financiamiento =
      this._proyecto_cabecera._cod_tipo_financiamiento == ""
        ? "0"
        : this._proyecto_cabecera._cod_tipo_financiamiento;
    this._proyecto_cabecera._cod_area =
      this._proyecto_cabecera._cod_area == ""
        ? "0"
        : this._proyecto_cabecera._cod_area;
    this._proyecto_cabecera._cod_clasificacion =
      this._proyecto_cabecera._cod_clasificacion == ""
        ? "0"
        : this._proyecto_cabecera._cod_clasificacion;
    this._proyecto_cabecera._cod_sub_area =
      this._proyecto_cabecera._cod_sub_area == ""
        ? "0"
        : this._proyecto_cabecera._cod_sub_area;
    this._proyecto_cabecera._cod_entidadbeneficiaria =
      this._proyecto_cabecera._cod_entidadbeneficiaria == ""
        ? "0"
        : this._proyecto_cabecera._cod_entidadbeneficiaria;
    this._proyecto_cabecera._plazo_ejecucion =
      this._proyecto_cabecera._plazo_ejecucion == ""
        ? "0"
        : this._proyecto_cabecera._plazo_ejecucion;
    this._proyecto_cabecera._poblacion_beneficiada =
      this._proyecto_cabecera._poblacion_beneficiada == ""
        ? "0"
        : this._proyecto_cabecera._poblacion_beneficiada;
    this._proyecto_cabecera._estado_fisico =
      this._proyecto_cabecera._estado_fisico == ""
        ? "0"
        : this._proyecto_cabecera._estado_fisico;
    this._proyecto_cabecera._estado_financiero =
      this._proyecto_cabecera._estado_financiero == ""
        ? "0"
        : this._proyecto_cabecera._estado_financiero;
    this._proyecto_cabecera._estado_cierre =
      this._proyecto_cabecera._estado_cierre == ""
        ? "0"
        : this._proyecto_cabecera._estado_cierre;
    this._proyecto_cabecera._estado_proyecto =
      this._proyecto_cabecera._estado_proyecto == ""
        ? "0"
        : this._proyecto_cabecera._estado_proyecto;

    this._proyecto_cabecera._fecha_inicio =
      this._proyecto_cabecera._fecha_inicio == "" ||
      this._proyecto_cabecera._fecha_inicio == "Fecha inválida"
        ? null
        : this._proyecto_cabecera._fecha_inicio;

    this._proyecto_cabecera._entrega_provisional =
      this._proyecto_cabecera._entrega_provisional == "" ||
      this._proyecto_cabecera._entrega_provisional == "Fecha inválida"
        ? null
        : this._proyecto_cabecera._entrega_provisional;

    this._proyecto_cabecera._entrega_definitiva =
      this._proyecto_cabecera._entrega_definitiva == "" ||
      this._proyecto_cabecera._entrega_definitiva == "Fecha inválida"
        ? null
        : this._proyecto_cabecera._entrega_definitiva;

    setTimeout(() => {
      console.log("DATOS A ACTUALIZAR", this._proyecto_cabecera);
    }, 50);

    this.cargando = true;
    this._sgp.actualizaProyectoCabecera(this._proyecto_cabecera).subscribe(
      (result: any) => {
        
        console.log("ACTUALIZANDO PROY", result);
        if (Array.isArray(result) && result.length > 0) {
          if (result[0]._accion == "CORRECTO") {
            this.prop_msg = "Se actualizó de manera correcta los datos";
            this._msg.formateoMensaje("modal_success", this.prop_msg);
            this.obtieneDatosGenerales();
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
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la petición BUSQUEDA5");
          this.cargando = false;
        }
      }
    );
  }
  inicializandoMapaV0() {
    this.m_map = L.map("map", {
      //center: [-16.496389, -68.131006],
      center: [
        this._proyecto_cabecera._latitud,
        this._proyecto_cabecera._longitud,
      ],
      //center: [this.m_latitud,this.m_longitud],
      zoom: 12,
    });
    this.m_osmBase = new L.tileLayer(
      "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    );
    //this.m_osmBase.addTo(this.m_map);

    this.m_osmCatastro = L.tileLayer(
      "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 17,
        attribution:
          'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
      }
    );
    this.m_imagensatelite = L.tileLayer(
      "http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}",
      {
        maxZoom: 30,
        minZoom: 3,
      }
    );
    this.m_imagensatelite.addTo(this.m_map);
    this.tempIconUpre = L.icon({
      iconUrl: "assets/imagenes/marcas/marca_upre.png",
      shadowUrl: "",
      iconSize: [100, 100], // size of the icon
      shadowSize: [0, 0], // size of the shadow
      iconAnchor: [32, 32], // point of the icon which will correspond to markers location
      shadowAnchor: [0, 0], // the same for the shadow
      popupAnchor: [32, 20], // point from which the popup should open relative to the iconAnchor
    });
    this.tempIcon = L.icon({
      iconUrl: "assets/imagenes/marcas/marca_ubicacion.png",
      shadowUrl: "",
      iconSize: [40, 40], // size of the icon
      shadowSize: [0, 0], // size of the shadow
      iconAnchor: [32, 32], // point of the icon which will correspond to markers location
      shadowAnchor: [0, 0], // the same for the shadow
      popupAnchor: [32, 20], // point from which the popup should open relative to the iconAnchor
    });

    this.m_baseMaps = {
      OSM: this.m_osmBase,
      Catastro: this.m_osmCatastro,
      Satelital: this.m_imagensatelite,
    };

    L.control
      .layers(this.m_baseMaps, this.m_marca, {
        position: "topright", // 'topleft', 'bottomleft', 'bottomright'
        collapsed: false, // true
      })
      .addTo(this.m_map);

    // var upre = [-16.495996993911135, -68.13113281417846];
    var upre = [
      this._proyecto_cabecera._latitud,
      this._proyecto_cabecera._longitud,
    ];
    var marker = L.marker(upre, {
      icon: this.tempIcon,
      draggable: false,
    });
    //.bindPopup(this.dts_proyecto._nombreproyecto);
    marker.addTo(this.m_map);

    // this.m_map.on("click", (e) => {
    //   this.onMapClickV2(e);
    // });
  }
  lista_adenda(id_proy) {
    return new Promise((resolve, reject) => {
      // this.cargando = true;
      this.dts_lista_adenda = [];
      this._sgp.listaAdendas(id_proy).subscribe(
        (result: any) => {
          
          var lista_adenda;
          if (Array.isArray(result) && result.length > 0) {
            lista_adenda = this._fun.RemplazaNullArray(result);
            this.pnl_adenda = true;
            resolve(lista_adenda);
          } else {
            // this.prop_msg = "Alerta: No existen adendas registradas";
            // this.prop_tipomsg = "danger";
            // this._msg.formateoMensaje("modal_info", this.prop_msg);
            lista_adenda = [];
            this.pnl_adenda = false;
            resolve(lista_adenda);
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
}
