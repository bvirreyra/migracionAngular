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
import { RolesService } from "../../roles/roles.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-roles",
  templateUrl: "./roles.component.html",
  styleUrls: ["./roles.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    RolesService,
  ],
})
export class RolesComponent implements OnInit {
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

  public e_nombres: any; //---juan
  public e_apaterno: any;
  public e_amaterno: any;
  public e_estado: any;
  public e_idusuario: any;
  public e_nusuario: any;
  public e_pass: any;
  public e_fecha: any;
  public e_user_adm: any;
  public e_nombre: any;
  public e_descripcion: any;
  public e_idmodulo: any;
  public e_idrol: any;

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
  public dts_ListaRoles: any;
  public dts_ListaModulos: any;
  public pnlModalEliminaRegistro: any;

  public dtsListaProveidos: any;
  public dtsUsuario: any;
  public dtsUsuarioFiltrado: any;

  public dtsRegitroProveido: any;
  public NroRegistrosProveido: any;

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
  public pnlModalEliminaProveido = false;
  public pnlModalEditarProveido = false;
  public pnlListaProveidos = false;
  public pnlModalNuevoUsuario = false;
  public pnlModalNuevoRol = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _roles: RolesService,
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
    $("#modalEliminaProveido").modal("hide");

    //datos iniciales
    this.m_nombre = "";
    this.m_descripcion = "";

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

  BuscarRoles() {
    //alert('ingreso a buscar usuarios:'+this.m_nombres );
    if (this.m_nombre == "") {
      this.m_nombre = null;
    }
    if (this.m_descripcion == "") {
      this.m_descripcion = null;
    }

    this._roles.getListarRoles(this.m_nombre, this.m_descripcion).subscribe(
      (result: any) => {
        
        //alert('resultado1:'+result);
        console.log("hojaderuta", result);
        //if ( result.length > 0) {
        console.log(result);
        //alert('resultado2:'+result);
        $("#pnl_busqueda").show();
        //this.ListaProveidos(this.m_idcorrespondencia)
        this.pnlListaProveidos = true;

        if (Array.isArray(result) && result.length > 0) {
          $(".dt-Proveidos").DataTable().destroy();
          this.dts_ListaRoles = this._fun.RemplazaNullArray(result);
          let confiTable = this._fun.CONFIGURACION_TABLA_V2(
            [10, 20],
            false,
            0,
            "asc"
          );
          setTimeout(() => {
            $(".dt-Proveidos").DataTable(confiTable);
          }, 500);
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

  MuestraRol(datos) {
    console.log("MuetraProveido", datos);
    this.pnlModalEditarProveido = true;
    this.dtsRegitroProveido = datos;

    this.e_idrol = this.dtsRegitroProveido.idrol;
    this.e_nombre = this.dtsRegitroProveido.nombre;
    this.e_descripcion = this.dtsRegitroProveido.descripcion;
    this.e_idmodulo = this.dtsRegitroProveido.idmodulo;
    this.e_estado = this.dtsRegitroProveido.id_estado;

    this.buscarModulos();
  }

  ActualizaRol() {
    //console.log(this.e_idrol);
    this._roles
      .getActualizaRol(
        this.e_idrol,
        this.e_nombre,
        this.e_descripcion,
        this.e_idmodulo,
        this.e_estado
      )
      .subscribe(
        (result: any) => {
          
          console.log(result);
          this.pnlModalEditarProveido = false;
          $("#modalEditarProveido").modal("hide");
          this.BuscarRoles();
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            console.log(this.errorMessage);
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos AC ";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        }
      );
  }

  FormNuevoRol(datos) {
    this.pnlModalNuevoRol = true;
    /* 
  this.dtsRegitroProveido = datos;  
  */
    this.e_nombre = "";
    this.e_descripcion = "";
    this.e_idmodulo = "";
    this.e_estado = "";

    this.buscarModulos();
  }

  InsertaNuevoRol() {
    console.log(this.m_prov_fecha);
    this._roles
      .getInsertaNuevoRol(
        this.e_nombre,
        this.e_descripcion,
        this.e_idmodulo,
        this.e_estado
      )
      .subscribe(
        (result: any) => {
          
          console.log(result);
          this.pnlModalNuevoRol = false;
          $("#modalNuevoRol").modal("hide");
          this.BuscarRoles();
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
    this._roles.getEliminaRegistroActual(id).subscribe(
      (result: any) => {
        
        console.log(result);
        this.pnlModalEditarProveido = false;
        $("#modalEliminaRegistro").modal("hide");
        this.BuscarRoles();
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
    this.m_nombre = "";
    this.m_descripcion = "";
  }

  buscarModulos() {
    this._roles.getBuscarModulos().subscribe(
      (result: any) => {
        
        console.log("hojaderuta", result);
        console.log(result);
        if (Array.isArray(result) && result.length > 0) {
          this.dts_ListaModulos = this._fun.RemplazaNullArray(result);
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
