import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Globals } from "../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";
import { ArchivocentralService } from "../archivocentral.service";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-bandeja-registro",
  templateUrl: "./bandeja-registro.component.html",
  styleUrls: ["./bandeja-registro.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    ArchivocentralService,
  ],
})
@Component({
  selector: "app-bandeja-registro",
  templateUrl: "./bandeja-registro.component.html",
  styleUrls: ["./bandeja-registro.component.css"],
})
export class BandejaRegistroComponent implements OnInit {
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
  //VARIABLES DEL COMPONENTE

  public pnl_bandejacabecera = true;
  public pnl_bandejaproyectos = false;

  //DTS
  public dts_cabecera: any;

  //VARIABLES DEL FORMULARIO
  public dts_contenedor: any;
  public proyectoDatos: {
    fisico: boolean;
    digital: boolean;
    viabilidad: boolean;
    contratacion: boolean;
  };
  public estudio = 0;
  public arrayPlanillas: boolean[] = [false]; // EJECUCION
  public arrayPlanillasSup: boolean[] = [false]; // SUPERVISION
  public arrayPlanillasFis: boolean[] = [false]; // FISCALIZACION
  public ejecucionCierre: {
    cierre: boolean;
    garantia: boolean;
    conciliacion: boolean;
    resolucion: boolean;
  };
  public arrayContrato: boolean[] = [false];
  public arrayOrdenCambio: boolean[] = [false];
  public arrayOrdenTrabajo: boolean[] = [false];
  public informeProyecto = false;
  public informeProyectoSup = false;
  public informeProyectoFis = false;
  public cierreCife: {
    tecnico: boolean;
    financiero: boolean;
    legal: boolean;
    institucional: boolean;
  };
  public cierreCif: {
    tecnico: boolean;
    financiero: boolean;
    legal: boolean;
    institucional: boolean;
    ficha: boolean;
  };
  public actasCierre: {
    provisional: boolean;
    definitiva: boolean;
  };

  public licenciaAmbiental: {
    original: boolean;
    legalizada: boolean;
    simple: boolean;
  };
  public auditoria: {
    auditoria: boolean;
    compromiso: boolean;
    seguimiento: boolean;
  };
  public pnl_formulario = false;
  public pnl_formulario2 = false;
  public pnl_formulario3 = false;
  public contenedor: any;
  public codigoArchivo = "";
  public codigoRegion = "";
  public codigoContenedor = "";
  public idSgp = null;
  public codDpto = "";
  public codProv = "";
  public codMun = "";
  public municipioDescripcion = "";
  public nombreProyecto = "";
  public gestion = 0;
  public habilitaContenedor = false;
  public habilitaFormulario = true;
  public observacion = "";
  public habilitaAgrupador = true;
  public contenedorAgrupador = "";
  public cajaCodigo = "";

  public ubicar: boolean = false;
  public elProyecto: any;

  public detalleArchivo: {
    idDetalle: any;
    fidCabecera: any;
    contenedor: any;
    codigoContenedor: any;
    grupoContenido: any;
    tipoContenido: any;
    nroContenido: any;
    detalleContenido: any;
    usrRegistro: any;
    idEstado: any;
    operacion: any;
  };
  //VARIABLES PARA MANEJO DE OBJETOS
  public cabecera: {
    idCabecera: any;
    fidProyecto: any;
    fidSgp: any;
    codDepartamento: any;
    codProvincia: any;
    codMunicipio: any;
    detalleContenido: any;
    tipoArchivo: any;
    region: any;
    gestion: any;
    usrRegistro: any;
    idEstado: any;
    operacion: any;
  };

  //CORRECCIONES MODULO
  public totalDetalleArchivo: any[] = [];
  public elIdCabecera: number;
  public modoConsulta: boolean = false;

  jtipo_documento:string='';
  jobservacion:string='';
  dtsJuridicas:any[]=[];
  elIdJuridica:number=0;
  fecha_documento:Date;
  dtsTiposDocumentos:string[]=[];

  dtsFinanciera:any[]=[];
  elIdFinanciera:number=0;
  ftipo_documento:string='';
  fobservacion:string='';
  fhr:string='';
  fcite:string='';
  ftomo:string='';
  

  regionReporte:string = 'SELECCIONE...';

  @Input() tipoArchivo: any;
  @Input() region: any;
  @Output() messageEvent = new EventEmitter<string>();
  // public mensaje = '';
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _archivocentral: ArchivocentralService,

    private globals: Globals,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent,
    private datePipe: DatePipe,
    private base64: ImgBase64Globals,
    private toastr: ToastrService,
  ) {
    this._route.parent.params.subscribe((parametros) => {
      this.s_idcon = parametros["idcon"];
      this.s_idmod = parametros["idmod"];
    });
    this.url = globals.rutaSrvFronEnd;
    this.s_imgLogo = base64.logocabecera;
    this.url_reporte = globals.rutaSrvReportes;
    this.detalleArchivo = {
      idDetalle: 0,
      fidCabecera: 0,
      contenedor: "",
      codigoContenedor: "",
      grupoContenido: "",
      tipoContenido: "",
      nroContenido: 0,
      detalleContenido: "",
      usrRegistro: 0,
      idEstado: 1,
      operacion: "I",
    };

    this.cabecera = {
      idCabecera: 0,
      fidProyecto: 0,
      fidSgp: null,
      codDepartamento: null,
      codProvincia: null,
      codMunicipio: null,
      detalleContenido: null,
      tipoArchivo: null,
      region: null,
      gestion: null,
      usrRegistro: null,
      idEstado: 1,
      operacion: "I",
    };
    this.proyectoDatos = {
      fisico: false,
      digital: false,
      viabilidad: false,
      contratacion: false,
    };
    this.ejecucionCierre = {
      cierre: false,
      garantia: false,
      conciliacion: false,
      resolucion: false,
    };
    this.cierreCife = {
      tecnico: false,
      financiero: false,
      legal: false,
      institucional: false,
    };
    this.cierreCif = {
      tecnico: false,
      financiero: false,
      legal: false,
      institucional: false,
      ficha: false,
    };
    this.actasCierre = {
      provisional: false,
      definitiva: false,
    };
    this.auditoria = {
      auditoria: false,
      compromiso: false,
      seguimiento: false,
    };
    this.licenciaAmbiental = {
      original: false,
      legalizada: false,
      simple: false,
    };
    //EJECUCION
    for (let index = 0; index < 50; index++) {
      this.arrayPlanillas.push(false);
    }
    //FISCALIZACION
    for (let index = 0; index < 30; index++) {
      this.arrayPlanillasFis.push(false);
    }
    //SIPERVISION
    for (let index = 0; index < 30; index++) {
      this.arrayPlanillasSup.push(false);
    }
    //MODIFICACIONES
    for (let index = 0; index < 35; index++) {
      this.arrayContrato.push(false);
    }
    //ORDEN CAMBIO
    for (let index = 0; index < 35; index++) {
      this.arrayOrdenCambio.push(false);
    }
    //ORDEN TRABAJO
    for (let index = 0; index < 35; index++) {
      this.arrayOrdenTrabajo.push(false);
    }
  }

  ngOnInit() {
    this.cabecera.tipoArchivo = this.tipoArchivo;
    this.cabecera.region = this.region;
    //OBTENCION DE CODIGO DE TIPO DE ARCHIVO PARA LA CABECERA
    if (this.tipoArchivo == "ARCHIVO TECNICO") this.codigoArchivo = "AT";
    if (this.tipoArchivo == "ARCHIVO JURIRICO") this.codigoArchivo = "AJ";
    if (this.tipoArchivo == "ARCHIVO FINANCIERO") this.codigoArchivo = "AF";

    //OBTENCION DE CODIGO DE REGION
    if (this.region == "ORIENTE") this.codigoRegion = "OR";
    if (this.region == "OCCIDENTE") this.codigoRegion = "OC";
    if (this.region == "CENTRO") this.codigoRegion = "CT";

    sessionStorage.clear();
    function falloCallback(error) {
      console.log("Falló con " + error);
    }

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
        this.combocontenedor();
      })
      .then((dts) => {
        return this.RolesAsignados(this.s_usu_id);
      })
      .then((dts) => {
        this.dts_roles_usuario = dts;
        console.log("roles", this.dts_roles_usuario);
        this.GuardarLocalStorage();
      })
      .then((dts) => {
        this.listaArchivoCabecera();
      })
      .catch(falloCallback);
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
              if (result[0]["_idrol"] != "") {
                this.s_idrol = result[0]["_idrol"];
                this.s_user = result[0]["_usu_user"];
                this.s_nomuser = result[0]["_usu_nom_com"];
                this.s_usu_id = result[0]["_usu_id"];
                this.s_usu_id_sipta = result[0]["_usu_id_sipta"];
                this.s_usu_id_sispre = result[0]["_usu_id_sispre"];
                this.s_ci_user = result[0]["_usu_ci"];
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
            if (this.errorMessage != null) {
              console.log(this.errorMessage);
              this.prop_msg =
                "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
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
              "Error: La conexion no es valida, contáctese con el área de sistemas";
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
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
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
  transformAnio(date) {
    return this.datePipe.transform(date, "YYYY");
    //whatever format you need.
  }
  HoraServidor() {
    return new Promise((resolve, reject) => {
      this._autenticacion.gethoraservidor().subscribe(
        (result: any) => {
          if (result[0]["HORA"] != "") {
            var hora = this.transformHora(result[0]["HORA"]);
            resolve(hora);
            return hora;
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
  manejoRoles() {
    var lineas = this.dts_roles_usuario.length;
    var datos = this.dts_roles_usuario;
    let dpto = "";
  }

  FechaLiteral(f) {
    return this._fun.FechaLiteral(f);
  }
  GuardarLocalStorage() {
    let dts_con = {
      s_idrol: this.s_idrol,
      s_user: this.s_user,
      s_nomuser: this.s_nomuser,
      s_usu_id: this.s_usu_id_sispre,
      s_usu_id_sipta: this.s_usu_id_sipta,
      s_usu_id_sispre: this.s_usu_id_sispre,
      s_ci_user: this.s_ci_user,
    };
    let dts_rol = this.dts_roles_usuario;

    localStorage.setItem("dts_con", JSON.stringify(dts_con));
    localStorage.setItem("dts_rol", JSON.stringify(dts_rol));
  }

  listaArchivoCabecera(id?:number) {
    this.cargando = true;
    // this.dts_cabecera = null;
    console.log(this.cabecera.tipoArchivo, this.cabecera.region);
    if(this.tipoArchivo == 'ARCHIVO TECNICO'){
      this._archivocentral
        .listaArchivoCabecera(this.cabecera.tipoArchivo, this.cabecera.region)
        .subscribe(
          (result: any) => {
            if (Array.isArray(result) && result.length > 0) {
              this.dts_cabecera = this._fun.RemplazaNullArray(result);
              this.estilarTabla();
            } else {
              this.toastr.warning('No existen registro de cabecera','Listar Proyectos');
            }
            this.cargando = false;
          },
          (error) => {
            this.toastr.error(error.toString(), "Error desde el servidor");
            this.cargando = false;
          }
        );
    }
    if(this.tipoArchivo == 'ARCHIVO JURIDICO'){
      this._archivocentral
        .listarArchivoJuridica({region:this.region,id})
        .subscribe(
          (result: any) => {
            console.log('mis result juridico',result);
            if (result[0].contenido_json) {
              this.pnl_bandejacabecera = true;
              this.pnl_bandejaproyectos = false;
              this.dts_cabecera = result[0].contenido_json.proyectos;
              if(this.dts_cabecera){
                this.dts_cabecera.forEach(c => {
                  if(c.juridica){
                    c.juridica.forEach(d => {
                      if(!this.dtsTiposDocumentos.includes(d.tipo_documento)) this.dtsTiposDocumentos.push(d.tipo_documento);
                    });
                  }
                });
              }
              this.estilarTabla();
            } 
            if(result[0].id_juridica) this.dtsJuridicas = result;
            if(!result[0]) this.toastr.warning('No existen registro de cabecera','Listar Proyectos');
            
            this.cargando = false;
          },
          (error) => {
            this.toastr.error(error.toString(), "Error desde el servidor");
            this.cargando = false;
          }
        );
    }
    if(this.tipoArchivo == 'ARCHIVO FINANCIERO'){
      this._archivocentral
        .listarArchivoFinanciera({region:this.region,id})
        .subscribe(
          (result: any) => {
            console.log('mis result financiero',result);
            if (result[0].contenido_json) {
              this.pnl_bandejacabecera = true;
              this.pnl_bandejaproyectos = false;
              this.dts_cabecera = result[0].contenido_json.proyectos;
              if(this.dts_cabecera){
                this.dts_cabecera.forEach(c => {
                  if(c.financiera){
                    c.financiera.forEach(d => {
                      if(!this.dtsTiposDocumentos.includes(d.tipo_documento)) this.dtsTiposDocumentos.push(d.tipo_documento);
                    });
                  }
                });
              }
              this.estilarTabla();
            } 
            if(result[0].id_financiera) this.dtsFinanciera = result;
            if(!result[0]) this.toastr.warning('No existen registro de cabecera','Listar Proyectos');
            
            this.cargando = false;
          },
          (error) => {
            this.toastr.error(error.toString(), "Error desde el servidor");
            this.cargando = false;
          }
        );
    }

  }

  estilarTabla(){
    this._fun.limpiatabla(".dt-cabecera");
    setTimeout(() => {
      let confiTable = this._fun.CONFIGURACION_TABLA_V4(
        [10, 20, 50, 100],false,20 );
      var table = $(".dt-cabecera").DataTable(confiTable);
      this._fun.inputTable(table, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    }, 50);
  }

  paneles(valor) {
    if (valor == "cabecera") {
      this.pnl_bandejacabecera = true;
      this.pnl_bandejaproyectos = false;
      this.pnl_formulario = false;
      // if (!this.dts_cabecera) this.listaArchivoCabecera();
      this.listaArchivoCabecera();
    }
    if (valor == "proyectos") {
      this.pnl_bandejacabecera = false;
      this.pnl_bandejaproyectos = true;
      this.pnl_formulario = false;
      // if (!this.dts_cabecera) this.listarProyectos();
      this.listarProyectos();
    }
  }

  listarProyectos() {
    this.cargando = true;
    this.pnl_bandejacabecera = false;
    this.pnl_bandejaproyectos = true;

    console.log(this.cabecera);
    this._archivocentral.listaProyectos(this.cabecera.region,this.tipoArchivo).subscribe(
      (result: any) => {
        console.log("rev", result);
        if (Array.isArray(result) && result.length > 0) {
          this.dts_cabecera = this._fun.RemplazaNullArray(result);

          this._fun.limpiatabla(".dt-proyectos");
          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V4(
              [20, 50, 100, 150],
              false,
              20
            );
            var table = $(".dt-proyectos").DataTable(confiTable);
            this._fun.inputTable(table, [1, 2, 3, 4, 5]);
            this.cargando = false;
          }, 5);
        } else {
          this.toastr.warning('No existen registros', "Listar Proyectos");
          this.cargando = false;
        }
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor");
        this.cargando =false;
      }
    );
  }
  combocontenedor() {
    this._archivocentral.listaClasificador(13, undefined).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_contenedor = result;
        } else {
          this.toastr.warning('No existen registros de clasificadores', "Lista Clasificadores");
        }
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor");
      }
    );
  }

  obtieneidsgp(registro) {
    console.log(registro);
    this.cajaCodigo =
      this.codigoArchivo +
      "-" +
      this.codigoRegion +
      "-" +
      registro.abreviacion +
      "-" +
      registro.mundesc;
    this.gestion = registro.gestion;
    this._archivocentral.verificaiidsgp(registro.id,this.tipoArchivo).subscribe(
      (result: any) => {
        this.limpiarFormulario();
        this.nombreProyecto = registro.nombre_proyecto;
        this.municipioDescripcion = registro.mundesc;
        this.cabecera.codDepartamento = registro.codigo_departamento;
        this.cabecera.codMunicipio = registro.codigo_municipio;
        this.cabecera.codProvincia = registro.codigo_provincia;
        this.cabecera.gestion = registro.gestion;
        this.cabecera.fidSgp = registro.id;
        this.cabecera.detalleContenido = registro.descripcion;
        this.cabecera.usrRegistro = this.s_usu_id;
        if (result[0]["_accion"] == "CORRECTO" && result[0]["_tipoarchivo"]==this.tipoArchivo ) {
          console.log('bonk',result[0]);
          
          this.cabecera.idCabecera = result[0]["_idsgp"];
          this.detalleArchivo.fidCabecera = result[0]["_idsgp"];
        } else {
          this.cabecera.idCabecera = 0;
          this.detalleArchivo.fidCabecera = 0;
        }
        if (this.detalleArchivo.fidCabecera > 0) {
          this.habilitaAgrupador = false;
        } else {
          this.habilitaAgrupador = true;
        }
        this.pnl_bandejaproyectos = false;
        this.pnl_formulario = true;
        this.pnl_formulario3 = true;
        this.pnl_formulario2 = false;
        this.contenedorAgrupador =
          this.codigoArchivo +
          "-" +
          this.codigoRegion +
          "-" +
          registro.abreviacion +
          "-" +
          registro.mundesc;
        console.log(this.cabecera);
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor");
        this.cargando = false;
      }
    );
  }

  abrirformulario(registro) {
    if(this.tipoArchivo == 'ARCHIVO TECNICO'){
      this.limpiar();
      this.obtieneidsgp(registro);
    }
    if(this.tipoArchivo == 'ARCHIVO JURIDICO' || this.tipoArchivo == 'ARCHIVO FINANCIERO'){
      this.cabecera = {
        idCabecera: 0,
        fidProyecto: 0,
        fidSgp: registro.id,
        codDepartamento: registro.codigo_departamento,
        codProvincia: registro.codigo_provincia,
        codMunicipio: registro.codigo_municipio,
        detalleContenido: null,
        tipoArchivo: this.tipoArchivo,
        region: this.region,
        gestion: registro.gestion,
        usrRegistro: this.s_usu_id,
        idEstado: 1,
        operacion: "I",
      };
      this.nombreProyecto = registro.nombre_proyecto;
      this.registraCabecera(this.cabecera);
    }
    // if(this.tipoArchivo == 'ARCHIVO FINANCIERO'){
    //   this.cabecera = {
    //     idCabecera: 0,
    //     fidProyecto: 0,
    //     fidSgp: registro.id,
    //     codDepartamento: registro.codigo_departamento,
    //     codProvincia: registro.codigo_provincia,
    //     codMunicipio: registro.codigo_municipio,
    //     detalleContenido: null,
    //     tipoArchivo: this.tipoArchivo,
    //     region: this.region,
    //     gestion: registro.gestion,
    //     usrRegistro: this.s_usu_id,
    //     idEstado: 1,
    //     operacion: "I",
    //   };
    //   this.nombreProyecto = registro.nombre_proyecto;
    //   this.registraCabecera(this.cabecera);
    // }
  }

  datosContenedor() {
    this.limpiar2();
    this.codigoContenedor = this.contenedor.codigodetalleclasificador;
    this.detalleArchivo.contenedor =
      this.contenedor.descripciondetalleclasificador;
    this.habilitaContenedor = true;
    this.habilitaFormulario = false;
    var codigo =
      this.codigoArchivo +
      "-" +
      this.codigoRegion +
      "-" +
      this.codigoContenedor +
      "-" +
      this.municipioDescripcion;
    this.obtieneCorrelativo(codigo, this.gestion);
  }
  actualiza(pos) {
    console.log(pos);
  }
  indexTracker(index: number, value: any) {
    return index;
  }

  actualizaDatosDetalle(grupo, tipo, valor, posicion = null) {
    console.log("actualizando", grupo, tipo, valor, posicion);
    if (
      this.totalDetalleArchivo.filter(
        (el) =>
          el.grupoContenido == grupo &&
          el.tipoContenido == tipo &&
          el.nroContenido == posicion
      )[0]
    ) {
      this.totalDetalleArchivo = this.totalDetalleArchivo.filter(
        (el) =>
          !(
            el.grupoContenido == grupo &&
            el.tipoContenido == tipo &&
            el.nroContenido == posicion
          )
      );
      return true;
    }
    if (grupo == "ESTUDIO SOCIO ECONOMICO") {
      this.totalDetalleArchivo = this.totalDetalleArchivo.filter(
        (f) => !(f.grupoContenido == grupo)
      );
    }
    const elRegistro = Object.assign({}, this.detalleArchivo);
    elRegistro.grupoContenido = grupo;
    elRegistro.tipoContenido = tipo;
    elRegistro.nroContenido = posicion; //posicion == undefined ? null : posicion;
    elRegistro.usrRegistro = this.s_usu_id;
    elRegistro.operacion = valor ? "I" : "D";
    this.totalDetalleArchivo.push(elRegistro);
    console.log(this.totalDetalleArchivo);
  }

  registrarTotalDetalle() {
    console.log(this.cabecera.idCabecera);
    if (!this.totalDetalleArchivo) return true;
    if (this.cabecera.idCabecera == 0 || this.cabecera.idCabecera == null) {
      this.registraCabecera(this.totalDetalleArchivo[0]);
    }
    const regObservacion = {
      idDetalle: 0,
      fidCabecera: this.elIdCabecera,
      contenedor: this.detalleArchivo.contenedor, //this.contenedorAgrupador,
      codigoContenedor: this.detalleArchivo.codigoContenedor,
      detalleContenido: this.observacion,
      idEstado: 1,
      grupoContenido: "OBSERVACION",
      tipoContenido: "DETALLE CONTENIDO",
      nroContenido: null,
      usrRegistro: this.s_usu_id,
      operacion: "I",
    };
    this.totalDetalleArchivo.push(regObservacion);
    setTimeout(() => {
      this.totalDetalleArchivo.forEach((element) => {
        element.fidCabecera = this.elIdCabecera;
        this.insertarDetalle(element);
      });
      this.habilitaFormulario = true;
    }, 200);
  }

  registraCabecera(valor) {
    console.log(this.cabecera);
    this.cabecera.detalleContenido = null;
    this._archivocentral.insertaCebecera(this.cabecera).subscribe(
      (result: any) => {
        this.cabecera.idCabecera = result[0]["_idcabecera"];
        // this.detalleArchivo.fidCabecera = result[0]["_idcabecera"];
        this.elIdCabecera = result[0]["_idcabecera"];
        if(this.tipoArchivo == 'ARCHIVO JURIDICO') this.mostrarDocumentos({juridica:[],proyecto:this.nombreProyecto,id_cabecera:this.elIdCabecera});
        if(this.tipoArchivo == 'ARCHIVO FINANCIERO') this.mostrarDocumentosFinanciera({financiera:[],proyecto:this.nombreProyecto,id_cabecera:this.elIdCabecera});
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor");
      }
    );
  }

  limpiarFormulario() {
    this.habilitaContenedor = false;
    this.habilitaFormulario = true;
    this.detalleArchivo = {
      idDetalle: 0,
      fidCabecera: this.cabecera.idCabecera,
      contenedor: "",
      codigoContenedor: "",
      grupoContenido: "",
      tipoContenido: "",
      nroContenido: 0,
      detalleContenido: "",
      usrRegistro: 0,
      idEstado: 1,
      operacion: "I",
    };

    this.proyectoDatos = {
      fisico: false,
      digital: false,
      viabilidad: false,
      contratacion: false,
    };
    this.ejecucionCierre = {
      cierre: false,
      garantia: false,
      conciliacion: false,
      resolucion: false,
    };
    this.cierreCife = {
      tecnico: false,
      financiero: false,
      legal: false,
      institucional: false,
    };
    this.cierreCif = {
      tecnico: false,
      financiero: false,
      legal: false,
      institucional: false,
      ficha: false,
    };
    this.actasCierre = {
      provisional: false,
      definitiva: false,
    };
    this.auditoria = {
      auditoria: false,
      compromiso: false,
      seguimiento: false,
    };
    //EJECUCION
    for (let index = 0; index < 50; index++) {
      this.arrayPlanillas[index] = false;
    }
    //FISCALIZACION
    for (let index = 0; index < 30; index++) {
      this.arrayPlanillasFis[index] = false;
    }
    //SUPERVISION
    for (let index = 0; index < 30; index++) {
      this.arrayPlanillasSup[index] = false;
    }
    //MODIFICACIONES
    for (let index = 0; index < 35; index++) {
      this.arrayContrato[index] = false;
    }
    //ORDEN CAMBIO
    for (let index = 0; index < 35; index++) {
      this.arrayOrdenCambio[index] = false;
    }
    //ORDEN TRABAJO
    for (let index = 0; index < 35; index++) {
      this.arrayOrdenTrabajo[index] = false;
    }
    this.cabecera.tipoArchivo = this.tipoArchivo;
    this.cabecera.region = this.region;
    this.observacion = "";
    this.contenedor = null;
  }

  insertarDetalle(detalle) {
    console.log(detalle);
    this.cargando = true;
    if (detalle.grupoContenido == "OBSERVACION") {
      detalle.detalleContenido = this.observacion;
    }
    this._archivocentral.insertaDetalle(detalle).subscribe(
      (result: any) => {
        if (detalle.grupoContenido == "OBSERVACION") {
          this.habilitaAgrupador = false;
          this.limpiarFormulario();
        }
        this.cargando = false;
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor");
        this.cargando = false;
      }
    );
  }
  elminarDetalle(detalle) {
    this._archivocentral.eliminaDetalle(detalle).subscribe(
      (result: any) => {
        this.prop_msg = result[0]["_mensaje"];
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor");
      }
    );
  }

  abrirAgrupacion(dato1, dato2, dato3) {
    var ruta = "12_archivocentral";
    var conexion = this.s_idcon;
    var modulo = this.s_idmod;
    this._router.navigate(
      [ruta + "/" + conexion + "/" + modulo + "/12_detallecabeceraarchivo"],
      {
        queryParams: {
          idcabecera: dato1,
          codigo: dato2,
          gestion: dato3,
        },
      }
    );
  }

  obtieneCorrelativo(valor, gestion) {
    this._archivocentral.obtieneIndice(valor, gestion).subscribe(
      (result: any) => {
        console.log(result);
        this.detalleArchivo.codigoContenedor = result[0]["vcorrelativo"];
        // console.log(this.detalleArchivo.codigoContenedor);
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor");
      }
    );
  }
  sendMessage() {
    this.messageEvent.emit(this.tipoArchivo);
  }
  datosFormulario(datos) {
    this.limpiar();
    console.log(datos);
    this.modoConsulta = false;
    this.elIdCabecera = datos.id_cabecera;
    this.cabecera = {
      idCabecera: datos.id_cabecera,
      fidProyecto: 0,
      fidSgp: datos.fid_sgp,
      codDepartamento: datos.cod_departamento,
      codProvincia: datos.cod_provincia,
      codMunicipio: datos.cod_municipio,
      detalleContenido: datos.detalle_contenido,
      tipoArchivo: datos.tipo_archivo,
      region: datos.region,
      gestion: datos.gestion,
      usrRegistro: this.s_usu_id,
      idEstado: 1,
      operacion: "I",
    };
    this.nombreProyecto = datos.nombre_proyecto_compromiso;
    this.municipioDescripcion = datos.mundesc;
    this.gestion = datos.gestion;
    this.tipoArchivo = datos.tipo_archivo;
    this.region = datos.region;
    this.detalleArchivo.fidCabecera = datos.id_cabecera;
    this.pnl_bandejacabecera = false;
    this.pnl_formulario = true;
    this.pnl_formulario2 = true;
    this.pnl_formulario3 = false;
    this.habilitaAgrupador = false;
    this.cajaCodigo =
      this.codigoArchivo +
      "-" +
      this.codigoRegion +
      "-" +
      datos.abreviacion +
      "-" +
      datos.mundesc;
  }

  generarReporte(tipo:string,id?:number,id_doc?:number) {
    this.cargando = true;
    console.log("generando reporte");
    const miDTS = { tipoReporte: tipo, region: this.regionReporte,id,id_doc};
    let nombreReporte ='';
    if(['03','05','07'].includes(tipo)) nombreReporte = `Proyectos ${this.tipoArchivo}.xlsx`;
    if(tipo == '04') nombreReporte = 'LomoJuridico.pdf';
    if(tipo == '06') nombreReporte = 'LomoFinanciero.pdf';
    if(tipo == '08') nombreReporte = 'LomoCajaFinanciero.pdf';

    this._archivocentral.reportes(miDTS).subscribe(
      (result: any) => {
        console.log(result);
        const url = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", nombreReporte);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        this.cargando = false;
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor");
        this.cargando = false;
      }
    );
  }

  habilitarUbicar(registro: any) {
    this.ubicar = true;
    this.elProyecto = registro;
  }

  consultaContenido(proyecto: any) {
    this.modoConsulta = true;
    this.nombreProyecto = proyecto.nombre_proyecto_compromiso;
    this.municipioDescripcion = proyecto.mundesc;
    this.elIdCabecera = proyecto.id_cabecera;
    // this.gestion = proyecto.gestion;
    // this.tipoArchivo = proyecto.tipo_archivo;
    this.region = proyecto.region;
    this.pnl_bandejacabecera = false;
    this.pnl_formulario = true;
    this.pnl_formulario2 = true;
    this.pnl_formulario3 = false;
    this.habilitaFormulario = true;
    this.obtieneDetalle();
    //para ir a agrupaciones
    this.gestion = proyecto.gestion;
    this.detalleArchivo.fidCabecera = proyecto.id_cabecera;
    this.cajaCodigo =
      this.codigoArchivo +
      "-" +
      this.codigoRegion +
      "-" +
      proyecto.abreviacion +
      "-" +
      proyecto.mundesc;
  }

  obtieneDetalle() {
    this._archivocentral
      .obtieneDetalleContenedor(this.elIdCabecera, "CONSULTA")
      .subscribe(
        (result: any) => {
          this.llenaDatos(result);
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null)
            this._msg.formateoMensaje(
              "modal_danger",
              "Error:" + this.errorMessage
            );
        }
      );
  }

  llenaDatos(dts) {
    dts.forEach((element) => {
      // this.nombreProyecto = element.nombre_proyecto_compromiso; //Proyecto
      // this.municipioDescripcion = element.mundesc; //MUNICIPIO
      // this.detalleArchivo = element.fid_cabecera;
      // this.cabecera.idCabecera = element.fid_cabecera;
      // this.codigoArchivo = element.tipoarchivo;
      // this.codigoRegion = element.tiporegion;
      // this.gestion = element.gestion;
      if (
        (element.grupo_contenido ==
          "PROYECTO" && element.tipo_contenido == "PROYECTO EN FISICO")
      )
        this.proyectoDatos.fisico = true;
      if (
        (element.grupo_contenido ==
          "PROYECTO" && element.tipo_contenido == "PROYECTO DIGITAL")
      )
        this.proyectoDatos.digital = true;
      if (
        (element.grupo_contenido ==
          "PROYECTO" && element.tipo_contenido == "VIABILIDAD")
      )
        this.proyectoDatos.viabilidad = true;
      if (
        (element.grupo_contenido ==
          "PROYECTO" && element.tipo_contenido == "PROCESO DE CONTRATACION")
      )
        this.proyectoDatos.contratacion = true;
      if (
        (element.grupo_contenido ==
          "ESTUDIO SOCIO ECONOMICO" && element.tipo_contenido == "SI")
      )
        this.estudio = 1;
      if (
        (element.grupo_contenido ==
          "ESTUDIO SOCIO ECONOMICO" && element.tipo_contenido == "NO")
      )
        this.estudio = 2;
      if (
        (element.grupo_contenido ==
          "LICENCIA AMBIENTAL" && element.tipo_contenido == "ORIGINAL")
      )
        this.licenciaAmbiental.original = true;
      if (
        (element.grupo_contenido ==
          "LICENCIA AMBIENTAL" && element.tipo_contenido == "COPIA LEGALIZADA")
      )
        this.licenciaAmbiental.legalizada = true;
      if (
        (element.grupo_contenido ==
          "LICENCIA AMBIENTAL" && element.tipo_contenido == "COPIA SIMPLE")
      )
        this.licenciaAmbiental.simple = true;
      if (
        (element.grupo_contenido ==
          "EJECUCION" && element.tipo_contenido == "PLANILLA")
      )
        this.arrayPlanillas[element.nro_contenido - 1] = true;
      if (
        (element.grupo_contenido ==
          "EJECUCION" && element.tipo_contenido == "PLANILLA DE CIERRE")
      )
        this.ejecucionCierre.cierre = true;
      if (
        (element.grupo_contenido ==
          "EJECUCION" && element.tipo_contenido == "LIBERACION DE GARANTIA")
      )
        this.ejecucionCierre.garantia = true;
      if (
        (element.grupo_contenido ==
          "EJECUCION" && element.tipo_contenido == "PLANILLA DE CONCILIACION")
      )
        this.ejecucionCierre.conciliacion = true;
      if (
        (element.grupo_contenido ==
          "EJECUCION" && element.tipo_contenido == "RESOLUCION DE CONTRATO")
      )
        this.ejecucionCierre.resolucion = true;
      if (
        (element.grupo_contenido ==
          "SUPERVISION" && element.tipo_contenido == "PLANILLA")
      )
        this.arrayPlanillasSup[element.nro_contenido - 1] = true;
      if (
        (element.grupo_contenido ==
          "FISCALIZACION" && element.tipo_contenido == "PLANILLA")
      )
        this.arrayPlanillasFis[element.nro_contenido - 1] = true;
      if (
        (element.grupo_contenido ==
          "MODIFICACION" && element.tipo_contenido == "CONTRATO MODIFICATORIO")
      )
        this.arrayContrato[element.nro_contenido - 1] = true;
      if (
        (element.grupo_contenido ==
          "MODIFICACION" && element.tipo_contenido == "ORDEN DE CAMBIO")
      )
        this.arrayOrdenCambio[element.nro_contenido - 1] = true;
      if (
        (element.grupo_contenido ==
          "MODIFICACION" && element.tipo_contenido == "ORDEN DE TRABAJO")
      )
        this.arrayOrdenTrabajo[element.nro_contenido - 1] = true;
      if (
        (element.grupo_contenido ==
          "CIERRE CIFE" && element.tipo_contenido == "INFORME DE PROYECTO")
      )
        this.informeProyecto = true;
      if (
        (element.grupo_contenido ==
          "CIERRE CIFE" && element.tipo_contenido == "INFORME DE FISCALIZACION")
      )
        this.informeProyectoFis = true;
      if (
        (element.grupo_contenido ==
          "CIERRE CIFE" && element.tipo_contenido == "INFORME DE SUPERVISION")
      )
        this.informeProyectoSup = true;
      if (
        (element.grupo_contenido ==
          "CIERRE CIFE" && element.tipo_contenido == "CIERRE TECNICO")
      )
        this.cierreCife.tecnico = true;
      if (
        (element.grupo_contenido ==
          "CIERRE CIFE" && element.tipo_contenido == "CIERRE FINANCIERO")
      )
        this.cierreCife.financiero = true;
      if (
        (element.grupo_contenido ==
          "CIERRE CIFE" && element.tipo_contenido == "CIERRE LEGAL")
      )
        this.cierreCife.legal = true;
      if (
        (element.grupo_contenido ==
          "CIERRE CIFE" && element.tipo_contenido == "CIERRE INSTITUCIONAL")
      )
        this.cierreCife.institucional = true;
      if (
        (element.grupo_contenido ==
          "CIERRE CIF" && element.tipo_contenido == "INFORME CIERRE TECNICO")
      )
        this.cierreCif.tecnico = true;
      if (
        (element.grupo_contenido ==
          "CIERRE CIF" && element.tipo_contenido == "INFORME CIERRE FINANCIERO")
      )
        this.cierreCif.financiero = true;
      if (
        (element.grupo_contenido ==
          "CIERRE CIF" && element.tipo_contenido == "INFORME CIERRE LEGAL")
      )
        this.cierreCif.legal = true;
      if (
        (element.grupo_contenido ==
          "CIERRE CIF" &&
          element.tipo_contenido == "INFORME CIERRE INSTITUCIONAL")
      )
        this.cierreCif.institucional = true;
      if (
        (element.grupo_contenido ==
          "CIERRE CIF" && element.tipo_contenido == "FICHA DE CIERRE TECNICO")
      )
        this.cierreCif.ficha = true;
      if (
        (element.grupo_contenido ==
          "ACTAS DE CIERRE" && element.tipo_contenido == "ACTA PROVISIONAL")
      )
        this.actasCierre.provisional = true;
      if (
        (element.grupo_contenido ==
          "ACTAS DE CIERRE" && element.tipo_contenido == "ACTA DEFINITIVA")
      )
        this.actasCierre.definitiva = true;
      if (
        (element.grupo_contenido ==
          "AUDITORIA" && element.tipo_contenido == "INFORME AUDITORIA")
      )
        this.auditoria.auditoria = true;
      if (
        (element.grupo_contenido ==
          "AUDITORIA" && element.tipo_contenido == "NOTA COMPROMISO")
      )
        this.auditoria.compromiso = true;
      if (
        (element.grupo_contenido ==
          "AUDITORIA" && element.tipo_contenido == "NOTA SEGUIMIENTO")
      )
        this.auditoria.seguimiento = true;
      if (
        (element.grupo_contenido ==
          "OBSERVACION" && element.tipo_contenido == "DETALLE CONTENIDO")
      )
        this.observacion += element.detalle_contenido + "\n";
    });
  }

  limpiar() {
    this.detalleArchivo = {
      idDetalle: 0,
      fidCabecera: 0,
      contenedor: "",
      codigoContenedor: "",
      grupoContenido: "",
      tipoContenido: "",
      nroContenido: 0,
      detalleContenido: "",
      usrRegistro: 0,
      idEstado: 1,
      operacion: "I",
    };

    this.cabecera = {
      idCabecera: 0,
      fidProyecto: 0,
      fidSgp: null,
      codDepartamento: null,
      codProvincia: null,
      codMunicipio: null,
      detalleContenido: null,
      tipoArchivo: null,
      region: null,
      gestion: null,
      usrRegistro: null,
      idEstado: 1,
      operacion: "I",
    };
    this.proyectoDatos = {
      fisico: false,
      digital: false,
      viabilidad: false,
      contratacion: false,
    };
    this.ejecucionCierre = {
      cierre: false,
      garantia: false,
      conciliacion: false,
      resolucion: false,
    };
    this.cierreCife = {
      tecnico: false,
      financiero: false,
      legal: false,
      institucional: false,
    };
    this.cierreCif = {
      tecnico: false,
      financiero: false,
      legal: false,
      institucional: false,
      ficha: false,
    };
    this.actasCierre = {
      provisional: false,
      definitiva: false,
    };
    this.auditoria = {
      auditoria: false,
      compromiso: false,
      seguimiento: false,
    };
    this.licenciaAmbiental = {
      original: false,
      legalizada: false,
      simple: false,
    };
    //EJECUCION
    this.arrayPlanillas = [];
    for (let index = 0; index < 50; index++) {
      this.arrayPlanillas.push(false);
    }
    //SUPERVISION
    this.arrayPlanillasSup = [];
    for (let index = 0; index < 30; index++) {
      this.arrayPlanillasSup.push(false);
    }
    //FISCALIZACION
    this.arrayPlanillasFis = [];
    for (let index = 0; index < 30; index++) {
      this.arrayPlanillasFis.push(false);
    }
    //MODIFICACIONES
    this.arrayContrato = [];
    for (let index = 0; index < 35; index++) {
      this.arrayContrato.push(false);
    }
    //ORDEN CAMBIO
    this.arrayOrdenCambio = [];
    for (let index = 0; index < 35; index++) {
      this.arrayOrdenCambio.push(false);
    }
    //ORDEN TRABAJO
    this.arrayOrdenTrabajo = [];
    for (let index = 0; index < 35; index++) {
      this.arrayOrdenTrabajo.push(false);
    }
    this.observacion = "";
    this.informeProyecto = false;
    this.informeProyectoSup = false;
    this.informeProyectoFis = false;
    this.estudio = 0;
    this.totalDetalleArchivo = [];
  }

  limpiar2() {
    this.detalleArchivo = {
      idDetalle: 0,
      fidCabecera: 0,
      contenedor: "",
      codigoContenedor: "",
      grupoContenido: "",
      tipoContenido: "",
      nroContenido: 0,
      detalleContenido: "",
      usrRegistro: 0,
      idEstado: 1,
      operacion: "I",
    };
    this.proyectoDatos = {
      fisico: false,
      digital: false,
      viabilidad: false,
      contratacion: false,
    };
    this.ejecucionCierre = {
      cierre: false,
      garantia: false,
      conciliacion: false,
      resolucion: false,
    };
    this.cierreCife = {
      tecnico: false,
      financiero: false,
      legal: false,
      institucional: false,
    };
    this.cierreCif = {
      tecnico: false,
      financiero: false,
      legal: false,
      institucional: false,
      ficha: false,
    };
    this.actasCierre = {
      provisional: false,
      definitiva: false,
    };
    this.auditoria = {
      auditoria: false,
      compromiso: false,
      seguimiento: false,
    };
    this.licenciaAmbiental = {
      original: false,
      legalizada: false,
      simple: false,
    };
    //EJECUCION
    this.arrayPlanillas = [];
    for (let index = 0; index < 50; index++) {
      this.arrayPlanillas.push(false);
    }
    //SUPERVISION
    this.arrayPlanillasSup = [];
    for (let index = 0; index < 30; index++) {
      this.arrayPlanillasSup.push(false);
    }
    //FISCALIZACION
    this.arrayPlanillasFis = [];
    for (let index = 0; index < 30; index++) {
      this.arrayPlanillasFis.push(false);
    }
    //MODIFICACIONES
    this.arrayContrato = [];
    for (let index = 0; index < 35; index++) {
      this.arrayContrato.push(false);
    }
    //ORDEN CAMBIO
    this.arrayOrdenCambio = [];
    for (let index = 0; index < 35; index++) {
      this.arrayOrdenCambio.push(false);
    }
    //ORDEN TRABAJO
    this.arrayOrdenTrabajo = [];
    for (let index = 0; index < 35; index++) {
      this.arrayOrdenTrabajo.push(false);
    }
    this.observacion = "";
    this.informeProyecto = false;
    this.informeProyectoSup = false;
    this.informeProyectoFis = false;
    this.estudio = 0;
    this.totalDetalleArchivo = [];
  }

  recibeMensaje($event) {
    if ($event == "UBICADO") {
      this.listaArchivoCabecera();
      this.ubicar = false;
    }
    if ($event == "CANCELADO") {
      this.ubicar = false;
    }
  }

  mostrarDocumentos(proyecto:any){
    console.log({proyecto});
    
    this.dtsJuridicas = proyecto.juridica
    this.nombreProyecto = proyecto.proyecto;
    this.elIdCabecera = proyecto.id_cabecera;
    $('#modalDocumentos').modal({backdrop: 'static', keyboard: false});
    $(".modal").on("shown.bs.modal", function () {
      $(this).find("[autofocus]").focus();
    });
  }

  mostrarDocumentosFinanciera(proyecto:any){
    console.log({proyecto});
    
    this.dtsFinanciera = proyecto.financiera
    this.nombreProyecto = proyecto.proyecto;
    this.elIdCabecera = proyecto.id_cabecera;
    $('#modalFinanciera').modal({backdrop: 'static', keyboard: false});
    $(".modal").on("shown.bs.modal", function () {
      $(this).find("[autofocus]").focus();
    });
  }

  cargarDocumento(data:any){
    this.jtipo_documento = data.tipo_documento;
    this.jobservacion = data.observacion;
    this.elIdJuridica = data.id_juridica;
    this.fecha_documento = data.fecha_documento;
  }

  cargarDocumentoFinanicera(data:any){
    this.ftipo_documento = data.tipo_documento;
    this.fobservacion = data.observacion;
    this.fhr = data.hr;
    this.fcite = data.cite;
    this.ftomo = data.tomo;
    this.elIdFinanciera = data.id_financiera;
  }

  crudDetalleJuridica(operacion:string,doc?:any){
    this.cargando = true;
    let elDocumento = {
      operacion,
      id_juridica:this.elIdJuridica,
      fid_cabecera:this.elIdCabecera,
      fecha_documento:moment(moment(this.fecha_documento).add(5,'hours')).format('YYYY-MM-DD'),
      tipo_documento:this.jtipo_documento,
      observacion:this.jobservacion,
      usuario_registro:this.s_usu_id,
    }
    if(doc) elDocumento = doc;
    elDocumento.usuario_registro = this.s_usu_id
    elDocumento.operacion = operacion;
    this._archivocentral.crudArchivoJuridica(elDocumento).subscribe(
      (result: any) => {
        if (!result[0].message.toUpperCase().startsWith("ERROR")) {
          this.toastr.success(result[0].message, "Registro Documento Jurídico")
        } else {
          this.toastr.error(result[0].message,"Registro Documento Jurídico");
        }
        // $("#modalDocumentos").modal("hide");
        this.elIdJuridica = null;
        this.fecha_documento = null;
        this.jtipo_documento = null;
        this.jobservacion = null;
        this.listaArchivoCabecera(this.elIdCabecera);
        const miInput = document.getElementById("tipoDocumento");
        miInput.focus();
        this.cargando = false;
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor")
        this.cargando = false;
      }
    );
  }

  crudDetalleFinanciera(operacion:string,doc?:any){
    this.cargando = true;
    let elDocumentoFinanciera = {
      operacion,
      id_financiera:this.elIdFinanciera,
      fid_cabecera:this.elIdCabecera,
      tipo_documento:this.ftipo_documento,
      observacion:this.fobservacion,
      hr:this.fhr,
      cite:this.fcite,
      tomo:this.ftomo,
      usuario_registro:this.s_usu_id,
    }
    if(doc) elDocumentoFinanciera = doc;
    elDocumentoFinanciera.usuario_registro = this.s_usu_id
    elDocumentoFinanciera.operacion = operacion;
    this._archivocentral.crudArchivoFinanciera(elDocumentoFinanciera).subscribe(
      (result: any) => {
        if (!result[0].message.toUpperCase().startsWith("ERROR")) {
          this.toastr.success(result[0].message, "Registro Documento Financiera")
        } else {
          this.toastr.error(result[0].message,"Registro Documento Financiera");
        }
        // $("#modalDocumentos").modal("hide");
        this.elIdFinanciera = null;
        this.ftipo_documento = null;
        this.fobservacion = null;
        this.fcite = null;
        this.fhr = null;
        this.ftomo = null;
        this.listaArchivoCabecera(this.elIdCabecera);
        const miInput = document.getElementById("tipoDocumento");
        miInput.focus();
        this.cargando = false;
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor")
        this.cargando = false;
      }
    );
  }

  nuevoElemento(opcion: string) {
    console.log("nuevo elemetno", opcion);
    const nuevo = prompt("Agregar Clasificador", "Nuevo Elemento");
    if (nuevo) {
      this.dtsTiposDocumentos.push(nuevo.toUpperCase());
    }
  }

}
