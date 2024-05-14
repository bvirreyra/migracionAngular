import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Inputmask from "inputmask";
import { Globals } from "../../../../global";

/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { AutenticacionService } from "../../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../../seguridad/mensajes/mensajes.component";
import { MMenuRolService } from "../mmenurol.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-mmenurol",
  templateUrl: "./mmenurol.component.html",
  styleUrls: ["./mmenurol.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    MMenuRolService,
  ],
})
export class MMenuRolComponent implements OnInit {
  /*VARIABLES PARA MASCARAS */
  public mask_numerodecimal: any;
  public mask_fecha: any;
  public mask_numero: any;
  public mask_gestion: any;

  //variables para el compononete de mensajes
  public prop_msg: string;
  public prop_tipomsg: string;

  //variables de session y iniciales
  public s_idcon: string;
  public s_idmod: string;
  public s_idrol: number;
  public s_user: string;
  public s_nomuser: string;

  public url: string;
  public urlApi: string;
  public errorMessage: string;
  public fechasrv: string;

  public dtsDatosConexion: any;
  public dtsFechaSrv: any;
  public dtsFechaLiteral: any;
  public dtsHoraSrv: any;
  public dtsAnio: any;
  public s_imgLogo: any;

  /*VARIABLES DEL MODULO*/
  //usuarios
  public m_nombres: any; //---juan
  public m_apaterno: any;
  public m_amaterno: any;
  public m_nusuario: any;
  public m_pass: any;

  //roles
  public m_nombre: any; //---juan
  public m_descripcion: any;
  //rol usuario
  public m_rol: any; //---juan
  public m_usuario: any;
  public m_idrol: any;
  public m_idusuario: any;
  //modulos
  public m_icono: any; //---juan
  public m_ruta: any;
  //menu
  public m_idmenu: any; //---juan
  public m_idmenusuperior: any;
  public m_orden: any;
  public m_nivel: any;

  public e_nombres: any; //---juan
  public e_apaterno: any;
  public e_amaterno: any;
  public e_estado: any;
  public e_idusuario: any;
  public e_nusuario: any;
  public e_pass: any;
  public e_fecha: any;
  public e_user_adm: any;
  public e_rol: any;
  public e_usuario: any;
  public e_idrol: any;
  public e_id: any;
  public e_fecha_vigencia: any;

  public e_nombre: any;
  public e_descripcion: any;
  public e_icono: any;
  public e_ruta: any;
  public e_idmodulo: any;
  public e_idmenu: any; //---juan
  public e_idmenusuperior: any;
  public e_orden: any;
  public e_nivel: any;

  public m_gestion: any;
  public m_nrohojaderuta: any;
  public dts_cabecera: any;
  public dts_hijos: any;
  public m_cite: any;
  public m_recepcionado: any;
  public m_remitente: any;
  public m_destinatario: any;
  public m_referencia: any;
  public m_anexos: any;
  public m_fecha: any;
  public m_hora: any;
  public m_descripcionrespuesta: any;
  public m_fecharespuesta: any;
  public m_idcorrespondencia: any;

  public m_idremitente: any;
  public m_iddestinatario: any;
  public m_tipo: any;
  public m_estado: any;

  /*variables del componente */
  public dts_ListaUsuarios: any;
  public dtsListaProveidos: any;
  public dtsUsuario: any;
  public dtsUsuarioFiltrado: any;
  public dtsRegitroProveido: any;
  public NroRegistrosProveido: any;
  public dts_ListaRoles: any;
  public dts_ListaMenu: any;

  public m_prov_emisor: any;
  public m_prov_receptor: any;
  public m_prov_contenido: any;
  public m_prov_fecha: any;
  public m_prov_hora: any;
  public m_prov_estadosituacion: any;
  public m_prov_fecharecibido: any;
  public m_prov_horarecibido: any;
  public m_prov_estadorecibido: any;
  public m_prov_fecharespuesta: any;
  public m_prov_horarespuesta: any;
  public m_prov_estadorespuesta: any;

  public m_prov_idemisor: any;
  public m_prov_idreceptor: any;

  public m_prov_idproveido: any;
  public m_prov_idpadre: any;
  public m_prov_idcorrespondencia: any;

  /*paneles*/
  // public pnlModalEliminaProveido = false;
  public pnlModalEditarProveido = false;
  public pnlListaProveidos = false;
  public pnlModalNuevoModulo = false;
  public pnlModalNuevoMenuRol = false;
  public pnlModalEliminaRegistro = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _mmenurol: MMenuRolService,
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
  }

  ngOnInit() {
    $("#pnl_busqueda").show();
    $("#pnl_hjcabecera").hide();
    $("#pnl_hjproveidos").hide();
    $("#modalEliminaRegistro").modal("hide");

    //datos iniciales
    this.m_idrol = "";
    this.m_idmenu = "";
    this.buscarRoles();
    this.buscarMenu();

    function falloCallback(error) {
      console.log("Falló con " + error);
    }
    this.mask_numerodecimal = new Inputmask("9.9{1,2}");
    this.mask_fecha = new Inputmask("9{1,2}/9{1,2}/9{1,4}");
    this.mask_numero = new Inputmask("9{1,9}");
    this.mask_gestion = new Inputmask("9999");

    //this.cargarmascaras();
    this.DatosConexion()
      .then((dts1) => {
        this.dtsDatosConexion = dts1;
        //console.log(this.dtsDatosConexion);
        return this.FechaServidor();
      })
      .then((dts2) => {
        this.dtsFechaSrv = dts2[0]["fechasrv"];
        this.dtsHoraSrv = this.transformHora(this.dtsFechaSrv);
        this.m_gestion = this.dtsFechaSrv.substr(0, 4);
        //console.log(this.m_gestion);
        return this.FechaLiteral(dts2[0]["fechasrv"]);
      })
      .then((dts3) => {
        this.dtsFechaLiteral = dts3;
      })
      .catch(falloCallback);
  }
  /*******************************************************************************/
  /*MASCARAS
  /*******************************************************************************/
  cargarmascaras() {
    var gestion = document.getElementById("gestion");
    var hojaruta = document.getElementById("nrohojaderuta");
    var fecha = document.getElementById("fecha");
    var fecha_respuesta = document.getElementById("fecharespuesta");
    this.mask_gestion.mask(gestion);
    this.mask_numero.mask(hojaruta);
    this.mask_fecha.mask(fecha);
    this.mask_fecha.mask(fecha_respuesta);
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
              if (result[0]["IDROL"] != "") {
                this.s_idrol = result[0]["IDROL"];
                this.s_user = result[0]["USU_USER"];
                this.s_nomuser = result[0]["USU_NOM_COM"];
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
  /*******************************************************************************/
  /* COMPONENTE
  /*******************************************************************************/

  /*juan --------------------------------------------------------------*/

  BuscarMenuRol() {
    if (this.m_idrol == "") {
      this.m_idrol = null;
    }
    if (this.m_idmenu == "") {
      this.m_idmenu = null;
    }

    this._mmenurol.getListarMenuRol(this.m_idrol, this.m_idmenu).subscribe(
      (result: any) => {
        

        $("#pnl_busqueda").show();

        //this.ListaProveidos(this.m_idcorrespondencia)
        this.pnlListaProveidos = true;

        if (Array.isArray(result) && result.length > 0) {
          $(".dt-Proveidos").DataTable().destroy();
          this.dts_ListaUsuarios = this._fun.RemplazaNullArray(result);
          let confiTable = this._fun.CONFIGURACION_TABLA_V2(
            [10, 20],
            false,
            0,
            "asc"
          );
          setTimeout(() => {
            $(".dt-Proveidos").DataTable(confiTable);
            // this.pnlNuevo = false;
          }, 500);
        } else {
          this.prop_msg = "Alerta: No existen registros";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("1Error en la petición BUSQUEDA");
        }
      }
    );
  }

  MuestraMenuRol(datos) {
    this.pnlModalEditarProveido = true;
    this.dtsRegitroProveido = datos;

    this.e_id = this.dtsRegitroProveido.id;
    this.e_idrol = this.dtsRegitroProveido.id_rol;
    this.e_idmenu = this.dtsRegitroProveido.id_menu;
    this.e_estado = this.dtsRegitroProveido.id_estado;
  }

  ActualizaMenuRol() {
    //console.log(this.m_prov_fecha);
    this._mmenurol
      .getActualizaMenuRol(
        this.e_id,
        this.e_idrol,
        this.e_idmenu,
        this.e_estado
      )
      .subscribe(
        (result: any) => {
          

          this.pnlModalEditarProveido = false;
          $("#modalEditarProveido").modal("hide");
          this.BuscarMenuRol();
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            console.log(this.errorMessage);
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos ";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        }
      );
  }

  FormNuevoMenuRol(datos) {
    this.pnlModalNuevoMenuRol = true;
    this.e_idrol = "";
    this.e_idmenu = "";
    this.e_estado = "";
  }

  InsertaNuevoMenuRol() {
    this._mmenurol
      .getInsertaNuevoMenuRol(this.e_idrol, this.e_idmenu, this.e_estado)
      .subscribe(
        (result: any) => {
          

          this.pnlModalNuevoMenuRol = false;
          $("#modalNuevoMenuRol").modal("hide");
          this.BuscarMenuRol();
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            console.log(this.errorMessage);
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos ";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        }
      );
  }

  EliminarRegistro(datos) {
    this.pnlModalEliminaRegistro = true;
    this.dtsRegitroProveido = datos;
    //console.log(datos);
  }

  EliminaRegistroActual(id: any) {
    //console.log(this.m_prov_fecha);
    this._mmenurol.getEliminaRegistroMenuRol(id).subscribe(
      (result: any) => {
        

        this.pnlModalEliminaRegistro = false;
        $("#modalEliminaRegistro").modal("hide");
        this.BuscarMenuRol();
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos ";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      }
    );
  }

  LimpiarBusqueda() {
    this.m_idrol = "";
    this.m_idmenu = "";
  }

  buscarRoles() {
    this._mmenurol.getBuscarRoles().subscribe(
      (result: any) => {
        

        if (Array.isArray(result) && result.length > 0) {
          this.dts_ListaRoles = this._fun.RemplazaNullArray(result);
        } else {
          this.prop_msg = "Alerta: No existen registros de la busqueda";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("1Error en la petición BUSQUEDA");
        }
      }
    );
  }

  buscarMenu() {
    this._mmenurol.getBuscarMenu().subscribe(
      (result2: any) => {
        if (Array.isArray(result2) && result2.length > 0) {
          this.dts_ListaMenu = this._fun.RemplazaNullArray(result2);
        } else {
          this.prop_msg = "Alerta: No existen registros de la busqueda";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("1Error en la petición BUSQUEDA");
        }
      }
    );
  }

  /*juan ---------------------------------------------------*/

  VolverAtras() {
    $("#pnl_busqueda").show();
    $("#pnl_hjcabecera").hide();
    $("#pnl_hjproveidos").hide();
    this.LimpiarBusqueda();
  }
}
