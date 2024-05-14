import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Inputmask from "inputmask";
import { Globals } from "../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import alasql from "alasql";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";
import { AccesosRolComponent } from "../../sgp/accesos-rol/accesos-rol.component";
import { SgpService } from "../../sgp/sgp.service";
import { MonitoreoService } from "../monitoreo.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important
@Component({
  selector: "app-monitoreo-seguimiento",
  templateUrl: "./monitoreo-seguimiento.component.html",
  styleUrls: ["./monitoreo-seguimiento.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    MonitoreoService,
    AccesosRolComponent,
    SgpService,
  ],
})
export class MonitoreoSeguimientoComponent implements OnInit {
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
  public s_usu_area: any;

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
  public camposHabilitados: {};

  /**************************************
   * VARIABLES DEL COMPONENETE
   *************************************/
  public dts_pivoteuno: any;
  public dts_pivotedos: any;
  public dts_sindescripcion: any;
  public dts_sinentidadbeneficiaria: any;
  public dts_sindetallebeneficiario: any;
  public dts_sinconvenio: any;
  public dts_sintipoconvenio: any;
  public dts_sinplazoejecucion: any;
  public dts_sintipofinanciamiento: any;
  public dts_sinarea: any;
  public dts_sinclasificacion: any;
  public dts_sinsubarea: any;
  public dts_sindetallelocalizacion: any;
  public dts_sinpoblacionbeneficiada: any;
  public dts_sinsuperficie: any;
  public dts_sinlatitudlongitud: any;
  public dts_sinfechainicio: any;
  public dts_sincontrato: any;
  public dts_sinsupervision: any;
  public dts_ultimasupervision: any;
  public dts_sinimagenesgaleria: any;
  public dts_sincontactos: any;
  public dts_sinprogramacion: any;
  public dts_sinregistroambiental: any;
  public dts_sincierreadministrativo: any;
  public dts_concierreadministrativo: any;
  dts_periodospresidenciales: unknown;
  dts_periodospresidencialesagrupados: any;
  dts_periodo: any;
  m_periodopresidencial: any;
  dts_sinconvenio_pivote: unknown;
  dts_sinfechainicio_pivote: unknown;
  dts_sincontrato_pivote: unknown;
  dts_sinsupervision_pivote: unknown;
  dts_ultimasupervision_pivote: unknown;
  dts_sinimagenesgaleria_pivote: unknown;
  dts_sincontactos_pivote: unknown;
  dts_sinprogramacion_pivote: unknown;
  dts_sinregistroambiental_pivote: unknown;
  dts_sincierreadministrativo_pivote: unknown;
  dts_concierreadministrativo_pivote: unknown;
  dts_pivote_inicial: unknown;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private globals: Globals,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent,
    private _monitoreo: MonitoreoService,
    private _accesos: AccesosRolComponent,
    private _sgp: SgpService,

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
    this.mask_numerodecimal = new Inputmask("9{1,20}.9{1,2}");
    this.mask_gestion = new Inputmask("9999");
    sessionStorage.clear();

    function falloCallback(error) {
      console.log("Falló con " + error);
    }
    this.DatosConexion()
      .then((dts1) => {
        this.dtsDatosConexion = dts1;
        return this.periodosPresidenciales();
      })
      .then((dts) => {
        this.dts_periodospresidenciales = dts;
        this.dts_periodospresidencialesagrupados = alasql(
          `select nombre_completo ,min(fecha_inicio ) as fecha_inicio,
            max(fecha_fin ) as fecha_fin
          from ? where id_estado =1 group by nombre_completo`,
          [dts]
        );
        this.dts_periodo = alasql(
          `select min(fecha_inicio ) as fecha_inicio,
          max(fecha_fin ) fecha_fin
        from ?`,
          [this.dts_periodospresidencialesagrupados]
        );
        console.log("PERIODO SELECCIONADO====>1", this.dts_periodo);
        console.log(
          "periodopresidencialagrupado",
          this.dts_periodospresidencialesagrupados
        );
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
        return this.RolesAsignados(this.s_usu_id);
      })
      .then((dts) => {
        this.dts_roles_usuario = dts;
        return this._accesos.accesosRestriccionesxRolV2(this.s_usu_id);
      })
      .then((data) => {
        this.camposHabilitados = data;
        console.log("Adm Roles===>", this.camposHabilitados);
        this.GuardarLocalStorage();
        return this.listaPivoteUno();
      })
      .then((dts) => {
        this.cargando = true;
        console.log("1====>", dts);
        this.dts_pivote_inicial = dts;
        //this.dts_pivoteuno = dts;
        this.dts_pivoteuno = alasql(
          `select *
        from ? where cast(fecha_convenio as date) between cast(? as date) and cast(? as date) `,
          [dts, this.dts_periodo[0].fecha_inicio, this.dts_periodo[0].fecha_fin]
        );
        console.log("pivote uno ====>", this.dts_pivoteuno);
        this.filtrosPivoteUno();
        return this.listaSinConvenio();
      })
      .then((dts) => {
        console.log("2====>", dts);
        this.dts_sinconvenio = dts;
        this.dts_sinconvenio_pivote = dts;

        return this.listaSinFechaInicio();
      })
      .then((dts) => {
        console.log("3====>", dts);
        this.dts_sinfechainicio = dts;
        this.dts_sinfechainicio_pivote = dts;

        return this.listaSinContrato();
      })
      .then((dts) => {
        console.log("4====>", dts);
        this.dts_sincontrato = dts;
        this.dts_sincontrato_pivote = dts;

        return this.listaSinSupervision();
      })
      .then((dts) => {
        console.log("5====>", dts);
        this.dts_sinsupervision = dts;
        this.dts_sinsupervision_pivote = dts;

        return this.listaSupervision();
      })
      .then((dts) => {
        console.log("6====>", dts);
        this.dts_ultimasupervision = dts;
        this.dts_ultimasupervision_pivote = dts;

        return this.listaSinImagenGaleria();
      })
      .then((dts) => {
        console.log("7====>", dts);
        this.dts_sinimagenesgaleria = dts;
        this.dts_sinimagenesgaleria_pivote = dts;

        return this.listaSinContactos();
      })
      .then((dts) => {
        console.log("8====>", dts);
        this.dts_sincontactos = dts;
        this.dts_sincontactos_pivote = dts;

        return this.listaSinProgramacion();
      })
      .then((dts) => {
        console.log("9====>", dts);
        this.dts_sinprogramacion = dts;
        this.dts_sinprogramacion_pivote = dts;

        return this.listaSinRegistroAmbiental();
      })
      .then((dts) => {
        console.log("10====>", dts);
        this.dts_sinregistroambiental = dts;
        this.dts_sinregistroambiental_pivote = dts;

        return this.listaSinCierreAdministrativo();
      })
      .then((dts) => {
        console.log("11====>", dts);
        this.dts_sincierreadministrativo = dts;
        this.dts_sincierreadministrativo_pivote = dts;

        return this.listaConCierreAdministrativo();
      })
      .then((dts) => {
        console.log("12====>", dts);
        this.dts_concierreadministrativo = dts;
        this.dts_concierreadministrativo_pivote = dts;
        this.cargando = false;
      })
      .catch(falloCallback);

    //this.listaCriticosSinResumen();
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
                this.s_usu_area = result[0]["_usu_area"];
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
  FechaLiteral(f) {
    return this._fun.FechaLiteral(f);
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
  GuardarLocalStorage() {
    let dts_con = {
      s_idrol: this.s_idrol,
      s_user: this.s_user,
      s_nomuser: this.s_nomuser,
      s_usu_id: this.s_usu_id,
      s_usu_id_sipta: this.s_usu_id_sipta,
      s_usu_id_sispre: this.s_usu_id_sispre,
      s_ci_user: this.s_ci_user,
      s_usu_area: this.s_usu_area,
    };
    let dts_rol = this.dts_roles_usuario;

    localStorage.setItem("dts_con", JSON.stringify(dts_con));
    localStorage.setItem("dts_rol", JSON.stringify(dts_rol));
  }
  listaPivoteUno() {
    var datos = {
      tipo: "PIVOTE_UNO",
    };
    return new Promise((resolve, reject) => {
      this._monitoreo.listaMonitoreoSeguimiento(datos).subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            resolve(result);
          } else {
            resolve([]);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_info", this.prop_msg);
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  filtrosPivoteUno() {
    this.dts_sindescripcion = alasql(
      `select * from ? where descripcion_proyecto is null or descripcion_proyecto=''`,
      [this.dts_pivoteuno]
    );
    console.log(this.dts_sindescripcion);
    this.dts_sinentidadbeneficiaria = alasql(
      `select * from ? where cod_entidadbeneficiaria is null or cod_entidadbeneficiaria=0`,
      [this.dts_pivoteuno]
    );
    console.log(this.dts_sinentidadbeneficiaria);
    this.dts_sindetallebeneficiario = alasql(
      `select * from ? where nombre_beneficiario is null or nombre_beneficiario=''`,
      [this.dts_pivoteuno]
    );
    console.log(this.dts_sindetallebeneficiario);
    this.dts_sintipoconvenio = alasql(
      `select * from ? where tipo_convenio is null or tipo_convenio=0`,
      [this.dts_pivoteuno]
    );
    console.log(this.dts_sintipoconvenio);
    this.dts_sinplazoejecucion = alasql(
      `select * from ? where plazo_ejecucion is null or plazo_ejecucion=0`,
      [this.dts_pivoteuno]
    );
    console.log("SIN PLAZO EJECUCION", this.dts_sinplazoejecucion);
    this.dts_sintipofinanciamiento = alasql(
      `select * from ? where cod_tipo_financiamiento is null or cod_tipo_financiamiento=0`,
      [this.dts_pivoteuno]
    );
    console.log("SIN TIPO FINANCIAMIENTO", this.dts_sintipofinanciamiento);
    this.dts_sinarea = alasql(
      `select * from ? where cod_area is null or cod_area=0`,
      [this.dts_pivoteuno]
    );
    console.log("SIN AREA", this.dts_sinarea);
    this.dts_sinclasificacion = alasql(
      `select * from ? where cod_clasificacion is null or cod_clasificacion=0`,
      [this.dts_pivoteuno]
    );
    console.log("SIN CLASIFICACION", this.dts_sinclasificacion);
    this.dts_sinsubarea = alasql(
      `select * from ? where cod_sub_area is null or cod_sub_area=0`,
      [this.dts_pivoteuno]
    );
    console.log("SIN SUB AREA", this.dts_sinsubarea);
    this.dts_sindetallelocalizacion = alasql(
      `select * from ? where localizacion is null or localizacion=''`,
      [this.dts_pivoteuno]
    );
    console.log("SIN DETALLE LOCALIZACION", this.dts_sindetallelocalizacion);
    this.dts_sinpoblacionbeneficiada = alasql(
      `select * from ? where poblacion_beneficiada is null or poblacion_beneficiada=0`,
      [this.dts_pivoteuno]
    );
    console.log("SIN POBLACION BENEFICIADA", this.dts_sinpoblacionbeneficiada);
    this.dts_sinsuperficie = alasql(
      `select * from ? where superficie is null or superficie=''`,
      [this.dts_pivoteuno]
    );
    console.log("SIN SUPERFICIE", this.dts_sinsuperficie);
    this.dts_sinlatitudlongitud = alasql(
      `select * from ? where latitud is null or latitud='' or longitud is null or longitud=''`,
      [this.dts_pivoteuno]
    );
    console.log(
      "SIN UBI.GEOGRAFICA",
      JSON.stringify(this.dts_sinlatitudlongitud)
    );
  }
  listaSinConvenio() {
    return new Promise((resolve, reject) => {
      var datos = {
        tipo: "SIN_CONVENIO",
      };

      this._monitoreo.listaMonitoreoSeguimiento(datos).subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            resolve(result);
          } else {
            resolve([]);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_info", this.prop_msg);
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  listaSinFechaInicio() {
    return new Promise((resolve, reject) => {
      var datos = {
        tipo: "SIN_FECHA_INICIO",
      };

      this._monitoreo.listaMonitoreoSeguimiento(datos).subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            resolve(result);
          } else {
            resolve([]);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_info", this.prop_msg);
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  listaSinContrato() {
    return new Promise((resolve, reject) => {
      var datos = {
        tipo: "SIN_CONTRATO",
      };

      this._monitoreo.listaMonitoreoSeguimiento(datos).subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            resolve(result);
          } else {
            resolve([]);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_info", this.prop_msg);
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  listaSinSupervision() {
    return new Promise((resolve, reject) => {
      var datos = {
        tipo: "SIN_SUPERVISION",
      };

      this._monitoreo.listaMonitoreoSeguimiento(datos).subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            resolve(result);
          } else {
            resolve([]);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_info", this.prop_msg);
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  listaSupervision() {
    return new Promise((resolve, reject) => {
      var datos = {
        tipo: "LISTA_SUPERVISION",
      };

      this._monitoreo.listaMonitoreoSeguimiento(datos).subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            resolve(result);
          } else {
            resolve([]);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_info", this.prop_msg);
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  listaSinImagenGaleria() {
    return new Promise((resolve, reject) => {
      var datos = {
        tipo: "SIN_IMAGEN_GALERIA",
      };

      this._monitoreo.listaMonitoreoSeguimiento(datos).subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            resolve(result);
          } else {
            resolve([]);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_info", this.prop_msg);
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  listaSinContactos() {
    return new Promise((resolve, reject) => {
      var datos = {
        tipo: "SIN_CONTACTOS",
      };

      this._monitoreo.listaMonitoreoSeguimiento(datos).subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            resolve(result);
          } else {
            resolve([]);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_info", this.prop_msg);
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  listaSinProgramacion() {
    return new Promise((resolve, reject) => {
      var datos = {
        tipo: "SIN_PROGRAMACION",
      };

      this._monitoreo.listaMonitoreoSeguimiento(datos).subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            resolve(result);
          } else {
            resolve([]);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_info", this.prop_msg);
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  listaSinRegistroAmbiental() {
    return new Promise((resolve, reject) => {
      var datos = {
        tipo: "SIN_REGISTRO_AMBIENTAL",
      };

      this._monitoreo.listaMonitoreoSeguimiento(datos).subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            resolve(result);
          } else {
            resolve([]);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_info", this.prop_msg);
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  listaSinCierreAdministrativo() {
    return new Promise((resolve, reject) => {
      var datos = {
        tipo: "SIN_CIERRE_ADMINISTRATIVO",
      };

      this._monitoreo.listaMonitoreoSeguimiento(datos).subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            resolve(result);
          } else {
            resolve([]);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_info", this.prop_msg);
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  listaConCierreAdministrativo() {
    return new Promise((resolve, reject) => {
      var datos = {
        tipo: "CON_CIERRE_ADMINISTRATIVO",
      };

      this._monitoreo.listaMonitoreoSeguimiento(datos).subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            resolve(result);
          } else {
            resolve([]);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_info", this.prop_msg);
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  periodosPresidenciales() {
    return new Promise((resolve, reject) => {
      console.log("cargando periodo presidencial");
      this.cargando = true;
      this._sgp.periodoPresidencial().subscribe(
        (result: any) => {
          console.log("result list", result);
          if (Array.isArray(result) && result.length > 0) {
            this.cargando = false;
            resolve(result);
          } else {
            console.log("no se obtuvo resultados");
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
            this._msg.formateoMensaje("modal_info", this.prop_msg);
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  filtraPeriodoPresidencial() {
    if (this.m_periodopresidencial == "TODOS") {
      this.dts_periodo = alasql(
        `select min(fecha_inicio) fecha_inicio,max(fecha_fin)
    from ?`,
        [this.dts_periodospresidencialesagrupados]
      );
    } else {
      this.dts_periodo = alasql(
        `select fecha_inicio,fecha_fin
    from ? where nombre_completo=?`,
        [this.dts_periodospresidencialesagrupados, this.m_periodopresidencial]
      );
    }
    console.log("PERIODO SELECCIONADO====>", this.dts_periodo);
    this.filtrandoDtsTotal();
  }
  filtrandoDtsTotal() {
    var dts1 = this.dts_pivote_inicial;
    var dts2 = this.dts_sinconvenio_pivote;
    var dts3 = this.dts_sinfechainicio_pivote;
    var dts4 = this.dts_sincontrato_pivote;
    var dts5 = this.dts_sinsupervision_pivote;
    var dts6 = this.dts_ultimasupervision_pivote;
    var dts7 = this.dts_sinimagenesgaleria_pivote;
    var dts8 = this.dts_sincontactos_pivote;
    var dts9 = this.dts_sinprogramacion_pivote;
    var dts10 = this.dts_sinregistroambiental_pivote;
    var dts11 = this.dts_sincierreadministrativo_pivote;
    var dts12 = this.dts_concierreadministrativo_pivote;
    this.dts_pivoteuno = alasql(
      `select *
    from ? where cast(fecha_convenio as date) between cast(? as date) and cast(? as date) `,
      [dts1, this.dts_periodo[0].fecha_inicio, this.dts_periodo[0].fecha_fin]
    );
    setTimeout(() => {
      this.filtrosPivoteUno();
      this.dts_sinconvenio = alasql(
        `select *
    from ? where cast(fecha_convenio as date) between cast(? as date) and cast(? as date) `,
        [dts2, this.dts_periodo[0].fecha_inicio, this.dts_periodo[0].fecha_fin]
      );
      this.dts_sinfechainicio = alasql(
        `select *
    from ? where cast(fecha_convenio as date) between cast(? as date) and cast(? as date) `,
        [dts3, this.dts_periodo[0].fecha_inicio, this.dts_periodo[0].fecha_fin]
      );
      this.dts_sincontrato = alasql(
        `select *
    from ? where cast(fecha_convenio as date) between cast(? as date) and cast(? as date) `,
        [dts4, this.dts_periodo[0].fecha_inicio, this.dts_periodo[0].fecha_fin]
      );
      this.dts_sinsupervision = alasql(
        `select *
    from ? where cast(fecha_convenio as date) between cast(? as date) and cast(? as date) `,
        [dts5, this.dts_periodo[0].fecha_inicio, this.dts_periodo[0].fecha_fin]
      );
      this.dts_ultimasupervision = alasql(
        `select *
    from ? where cast(v_fecha_suscripcion_convenio as date) between cast(? as date) and cast(? as date) `,
        [dts6, this.dts_periodo[0].fecha_inicio, this.dts_periodo[0].fecha_fin]
      );
      this.dts_sinimagenesgaleria = alasql(
        `select *
    from ? where cast(fecha_convenio as date) between cast(? as date) and cast(? as date) `,
        [dts7, this.dts_periodo[0].fecha_inicio, this.dts_periodo[0].fecha_fin]
      );
      this.dts_sincontactos = alasql(
        `select *
    from ? where cast(fecha_convenio as date) between cast(? as date) and cast(? as date) `,
        [dts8, this.dts_periodo[0].fecha_inicio, this.dts_periodo[0].fecha_fin]
      );
      this.dts_sinprogramacion = alasql(
        `select *
    from ? where cast(fecha_convenio as date) between cast(? as date) and cast(? as date) `,
        [dts9, this.dts_periodo[0].fecha_inicio, this.dts_periodo[0].fecha_fin]
      );
      this.dts_sinregistroambiental = alasql(
        `select *
    from ? where cast(fecha_convenio as date) between cast(? as date) and cast(? as date) `,
        [dts10, this.dts_periodo[0].fecha_inicio, this.dts_periodo[0].fecha_fin]
      );
      this.dts_sincierreadministrativo = alasql(
        `select *
    from ? where cast(v_fecha_suscripcion_convenio as date) between cast(? as date) and cast(? as date) `,
        [dts11, this.dts_periodo[0].fecha_inicio, this.dts_periodo[0].fecha_fin]
      );
      this.dts_concierreadministrativo = alasql(
        `select *
    from ? where cast(v_fecha_suscripcion_convenio as date) between cast(? as date) and cast(? as date) `,
        [dts12, this.dts_periodo[0].fecha_inicio, this.dts_periodo[0].fecha_fin]
      );
      console.log("1sin convenio", this.dts_sinconvenio);
      console.log("2 sin fecha inicio", this.dts_sinfechainicio);
      console.log("3 sin contrato", this.dts_sincontrato);
      console.log("4 sin supervision", this.dts_sinsupervision);
      console.log("5 ultimas supervisiones", this.dts_ultimasupervision);
      console.log("6 sin imagenes galeria", this.dts_sinimagenesgaleria);
      console.log("7 sin contactos", this.dts_sincontactos);
      console.log("8 sin programacion", this.dts_sinprogramacion);
      console.log("9 sin registro ambiental", this.dts_sinregistroambiental);
      console.log("10 sin cierre adm", this.dts_sincierreadministrativo);
      console.log("11 con cierre adm", this.dts_concierreadministrativo);
    }, 300);
  }
}
