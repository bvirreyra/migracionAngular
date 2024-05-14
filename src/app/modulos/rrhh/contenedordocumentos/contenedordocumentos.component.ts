import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Globals } from "../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";
import { RrhhService } from "../rrhh.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-contenedordocumentos",
  templateUrl: "./contenedordocumentos.component.html",
  styleUrls: ["./contenedordocumentos.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    RrhhService,
  ],
})
export class ContenedordocumentosComponent implements OnInit {
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

  /*paneles*/

  public pnl_bandeja = false;
  public pnl_formulario = false;
  public btnEliminar = false;
  public btnNuevo = false;

  //dts
  public dts_listatipodocumento: any;

  //variables
  public m_tipodocumento: any;
  public m_nrocite: any;
  public m_descripciondocumento: any;
  public m_fechadocumento: any;

  //VARIABLES DEL COMPONENTE
  public dts_listacontenedor: any;

  public archivoModel: any = {
    TIPO_DOCUMENTO: "",
    CODIGO: "",
    FILE: null,
    NOM_FILE: "",
  };

  public m_nombre_file: any;
  public m_tipodocumento_file: any;
  public m_codigoproy_file: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _recursoshumanos: RrhhService,

    private globals: Globals,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent,
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
    //$('#btnRegistrar').show();
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
        console.log("roles", this.dts_roles_usuario);
        this.paneles("VER_BANDEJA");
        this.GuardarLocalStorage();
        this.manejoRoles();
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
  paneles(string, dts?) {
    if (string == "VER_BANDEJA") {
      this.pnl_bandeja = true;
      this.pnl_formulario = false;

      this.listaContenedor();
    }
    if (string == "VER_FORMULARIO") {
      this.pnl_bandeja = false;
      this.pnl_formulario = true;
      this.m_tipodocumento = "";
      this.m_descripciondocumento = "";
      this.m_fechadocumento = "";
      this.m_nrocite = "";

      this.listaTipoDocumento();
    }
  }
  /************************************************************************ */
  manejoRoles() {
    var lineas = this.dts_roles_usuario.length;
    var datos = this.dts_roles_usuario;
    for (var i = 0; i < lineas; i++) {
      var rol = datos[i].idrol;
      if (rol == 43) {
        // ADMINITRADOR
        this.btnEliminar = true;
        this.btnNuevo = true;
      }
      if (rol == 44) {
        // USUARIO
        this.btnEliminar = false;
        this.btnNuevo = false;
      }
      console.log(this.btnEliminar, this.btnNuevo);
    }
  }
  listaContenedor() {
    this.cargando = true;
    //this.dts_listacontenedor='';
    this._recursoshumanos.listaContenedor().subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_listacontenedor = this._fun.RemplazaNullArray(result);
          console.log(this.dts_listacontenedor);
          this._fun.limpiatabla(".dt-listadocumentos");
          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V5(
              [50, 100, 150, 200],
              false,
              50,
              [
                [1, "desc"],
                [2, "desc"],
              ]
            );
            var table = $(".dt-listadocumentos").DataTable(confiTable);
            this._fun.selectTable(table, [1, 3]);
            this._fun.inputTable(table, [2, 4, 5]);
            this.cargando = false;
          }, 5);
        } else {
          this.prop_msg = "Alerta: No existen responsables registrados1";
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
        }
      }
    );
  }
  obtenerArchivo(nombre_file) {
    this.m_tipodocumento_file = "contenedor_documentos";
    this.m_codigoproy_file = "CON";
    this.archivoModel.NOM_FILE = nombre_file;
    this.archivoModel.TIPO_DOCUMENTO = this.m_tipodocumento_file;
    this.archivoModel.CODIGO = this.m_codigoproy_file;
    console.log("doc_file", this.archivoModel);
    this._autenticacion.obtenerArchivo(this.archivoModel).subscribe(
      (result: any) => {
        const url = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${this.archivoModel.NOM_FILE}`);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        // let respuestaDescarga = result;
        // console.log(respuestaDescarga);
        // if (respuestaDescarga.ok) {
        //   window.open(respuestaDescarga.url);
        // }
      },
      (error) => {
        this._msg.formateoMensaje("modal_danger", error || error.message);
      }
    );
  }
  listaTipoDocumento() {
    this.cargando = true;
    this._recursoshumanos.listaTipoDocumento().subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_listatipodocumento = this._fun.RemplazaNullArray(result);
          console.log(this.dts_listatipodocumento);
        } else {
          this.prop_msg = "Alerta: No existen responsables registrados1";
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
        }
      }
    );
  }
  postDogumento(dts) {
    console.log("post_doc", dts);
    if (dts.MENSAJE == "CORRECTO") {
      this.insertaDatosDocumento(dts.NOM_FILE);
    }
  }
  insertaDatosDocumento(ruta) {
    console.log("fecha", this.m_fechadocumento);
    this._recursoshumanos
      .insertaDatosDocumento(
        this._fun.textoUpper(this.m_tipodocumento),
        this._fun.textoUpper(this.m_nrocite),
        this._fun.textoUpper(this.m_fechadocumento),
        this._fun.textoUpper(this.m_descripciondocumento),
        this._fun.textoNormal(ruta),
        this._fun.textoUpper(this.s_usu_id)
      )
      .subscribe(
        (result: any) => {
          console.log("inserta", result);
          if ((result.estado = "CORRECTO")) {
            this.paneles("VER_BANDEJA");
          } else {
            this.prop_msg = "Alerta: No existen responsables registrados1";
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
          }
        }
      );
  }

  eliminaDocumento(id, ruta) {
    this._recursoshumanos.eliminaDocumento(id).subscribe(
      (result: any) => {
        console.log("elimina", result);
        if ((result.estado = "CORRECTO")) {
          this.eliminarArchivo(ruta);
        } else {
          this.prop_msg = "Alerta: No existen responsables registrados1";
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
        }
      }
    );
  }
  eliminarArchivo(archivo) {
    this.archivoModel.NOM_FILE = archivo;
    this.archivoModel.TIPO_DOCUMENTO = "contenedor_documentos";
    this.archivoModel.CODIGO = "sn";

    this._autenticacion.eliminarArchivo(this.archivoModel).subscribe(
      (result: any) => {
        let respuestaSubida = result;
        if (respuestaSubida.ok && respuestaSubida.modificado) {
          this.listaContenedor();
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
}
