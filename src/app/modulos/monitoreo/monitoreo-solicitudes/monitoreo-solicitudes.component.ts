import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Inputmask from "inputmask";
import { Globals } from "../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";
import { AccesosRolComponent } from "../../sgp/accesos-rol/accesos-rol.component";
import { MonitoreoService } from "../monitoreo.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-monitoreo-solicitudes",
  templateUrl: "./monitoreo-solicitudes.component.html",
  styleUrls: ["./monitoreo-solicitudes.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    MonitoreoService,
    AccesosRolComponent,
  ],
})
export class MonitoreoSolicitudesComponent implements OnInit {
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
  public dts_compromisoSinResumen: any;
  public dts_criticoSinResumen: any;
  public dts_compromisoSinMonitoreoProyectistas: any;
  public dts_compromisoSinBeneficiario: any;
  public dts_criticoSinBeneficiario: any;
  public dts_compromisoMontoCero: any;
  public dts_compromisoSinEvaluacionPrevia: any;
  public dts_compromisoSinEvaluacionTecnica: any;
  public dts_compromisoSinSuscripcionConvenio: any;
  public dts_compromisoSinEtapaContratacionSolicitud: any;
  public dts_compromisoSinEtapaContratacion: any;
  public dts_suscripcionConvenio: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private globals: Globals,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent,
    private _monitoreo: MonitoreoService,
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
    this.mask_numerodecimal = new Inputmask("9{1,20}.9{1,2}");
    this.mask_gestion = new Inputmask("9999");
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
        return this.listaCriticoSinResumen();
      })
      .then((dts) => {
        console.log("1====>", dts);
        this.dts_criticoSinResumen = dts;
        return this.listaCompromisoSinResumen();
      })
      .then((dts) => {
        console.log("2====>", dts);
        this.dts_compromisoSinResumen = dts;
        return this.listaCompromisoSinMonitoreoProyectistas();
      })
      .then((dts) => {
        console.log("3====>", dts);
        this.dts_compromisoSinMonitoreoProyectistas = dts;
        return this.listaCompromisoSinBeneficiarios();
      })
      .then((dts) => {
        console.log("4====>", dts);
        this.dts_compromisoSinBeneficiario = dts;
        return this.listaCriticoSinBeneficiario();
      })
      .then((dts) => {
        console.log("5====>", dts);
        this.dts_criticoSinBeneficiario = dts;
        return this.listaCompromisosMontoCero();
      })
      .then((dts) => {
        console.log("6====>", dts);
        this.dts_compromisoMontoCero = dts;
        return this.listaCompromisoSinEvaluacionPrevia();
      })
      .then((dts) => {
        console.log("7====>", dts);
        this.dts_compromisoSinEvaluacionPrevia = dts;
        return this.listaCompromisoSinEvaluacionTecnica();
      })
      .then((dts) => {
        console.log("8====>", dts);
        this.dts_compromisoSinEvaluacionTecnica = dts;
        return this.listaCompromisoSinSuscripcionConvenio();
      })
      .then((dts) => {
        console.log("9====>", dts);
        this.dts_compromisoSinSuscripcionConvenio = dts;
        return this.listaCompromisoSinEtapaContratacionSolicitud();
      })
      .then((dts) => {
        console.log("10====>", dts);
        this.dts_compromisoSinEtapaContratacionSolicitud = dts;
        return this.listaCompromisoSinEtapaContratacion();
      })
      .then((dts) => {
        console.log("10====>", dts);
        this.dts_compromisoSinEtapaContratacion = dts;
        return this.listaSuscripcionConvenio();
      })
      .then((dts) => {
        console.log("11====>", dts);
        this.dts_suscripcionConvenio = dts;
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
  listaCriticoSinResumen() {
    return new Promise((resolve, reject) => {
      var datos = {
        tipo: "CRITICO_SIN_RESUMEN",
      };

      this._monitoreo.listaReportes(datos).subscribe(
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
  listaCompromisoSinResumen() {
    return new Promise((resolve, reject) => {
      var datos = {
        tipo: "COMPROMISO_SIN_RESUMEN",
      };

      this._monitoreo.listaReportes(datos).subscribe(
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
  listaCompromisoSinMonitoreoProyectistas() {
    return new Promise((resolve, reject) => {
      var datos = {
        tipo: "COMPROMISO_SIN_MONITOREO_PROYECTISTAS",
      };

      this._monitoreo.listaReportes(datos).subscribe(
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
  listaCompromisoSinBeneficiarios() {
    return new Promise((resolve, reject) => {
      var datos = {
        tipo: "COMPROMISO_SIN_BENEFICIARIO",
      };
      this._monitoreo.listaReportes(datos).subscribe(
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
  listaCriticoSinBeneficiario() {
    return new Promise((resolve, reject) => {
      var datos = {
        tipo: "CRITICO_SIN_BENEFICIARIO",
      };

      this._monitoreo.listaReportes(datos).subscribe(
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
  listaCompromisosMontoCero() {
    return new Promise((resolve, reject) => {
      var datos = {
        tipo: "COMPROMISO_MONTO_CERO",
      };

      this._monitoreo.listaReportes(datos).subscribe(
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
  listaCompromisoSinEvaluacionPrevia() {
    return new Promise((resolve, reject) => {
      var datos = {
        tipo: "COMPROMISO_SIN_EVALUACION_PREVIA",
      };

      this._monitoreo.listaReportes(datos).subscribe(
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
  listaCompromisoSinEvaluacionTecnica() {
    return new Promise((resolve, reject) => {
      var datos = {
        tipo: "COMPROMISO_SIN_EVALUACION_TECNICA",
      };

      this._monitoreo.listaReportes(datos).subscribe(
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
  listaCompromisoSinSuscripcionConvenio() {
    return new Promise((resolve, reject) => {
      var datos = {
        tipo: "COMPROMISO_SIN_SUSCRIPCION_DE_CONVENIO",
      };

      this._monitoreo.listaReportes(datos).subscribe(
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
  listaCompromisoSinEtapaContratacionSolicitud() {
    return new Promise((resolve, reject) => {
      var datos = {
        tipo: "COMPROMISO_SIN_ETAPA_DE_CONTRATACION_SOLICITUD",
      };

      this._monitoreo.listaReportes(datos).subscribe(
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
  listaCompromisoSinEtapaContratacion() {
    return new Promise((resolve, reject) => {
      var datos = {
        tipo: "COMPROMISO_SIN_ETAPA_DE_CONTRATACION",
      };

      this._monitoreo.listaReportes(datos).subscribe(
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
  listaSuscripcionConvenio() {
    return new Promise((resolve, reject) => {
      var datos = {
        tipo: "SUSCRIPCION_DE_CONVENIO",
      };

      this._monitoreo.listaReportes(datos).subscribe(
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
  recibeMensaje(e){
    console.log('recibiendo clic chart',e);
    
  }
}
