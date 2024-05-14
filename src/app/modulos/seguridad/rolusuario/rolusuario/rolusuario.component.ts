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
import { RolUsuarioService } from "../../rolusuario/rolusuario.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-rolusuario",
  templateUrl: "./rolusuario.component.html",
  styleUrls: ["./rolusuario.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    RolUsuarioService,
  ],
})
export class RolUsuarioComponent implements OnInit {
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
  public dts_ListaUsuarios1: any;

  public dtsListaProveidos: any;
  public dtsUsuario: any;
  public dtsUsuarioFiltrado: any;
  public dts_ListaRoles: any;
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
  public pnlModalNuevoRolUsuario = false;
  public pnlModalEliminaRegistro = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _rolusuario: RolUsuarioService,
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
    this.m_idrol = "";
    this.m_idusuario = "";
    this.buscarUsuarios1();
    this.buscarRoles();

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

  BuscarRolUsuario() {
    //alert('ingreso a buscar usuarios:'+this.m_idrol );

    if (this.m_idrol == "") {
      this.m_idrol = null;
    }
    if (this.m_idusuario == "") {
      this.m_idusuario = null;
    }

    this._rolusuario
      .getListarRolUsuario(this.m_idrol, this.m_idusuario)
      .subscribe(
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

  MuetraRolUsuario(datos) {
    this.pnlModalEditarProveido = true;
    this.dtsRegitroProveido = datos;

    this.e_id = this.dtsRegitroProveido.id;
    this.e_idrol = this.dtsRegitroProveido.idrol;
    this.e_idusuario = this.dtsRegitroProveido.idusuario;
    this.e_estado = this.dtsRegitroProveido.id_estado;

    this.buscarRoles();
    this.buscarUsuarios1();
  }

  ActualizaRolUsuario() {
    this._rolusuario
      .getActualizaRolUsuario(
        this.e_id,
        this.e_idrol,
        this.e_idusuario,
        this.e_estado
      )
      .subscribe(
        (result: any) => {
          

          this.pnlModalEditarProveido = false;
          $("#modalEditarProveido").modal("hide");
          this.BuscarRolUsuario();
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

  FormNuevoRolUsuario(datos) {
    function addZero(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    }

    function fecha_hora() {
      var hoy = new Date();
      var dd = hoy.getDate();
      var mm = hoy.getMonth() + 1;
      var yyyy = hoy.getFullYear();
      var h = hoy.getHours();
      var m = hoy.getMinutes();
      var s = hoy.getSeconds();
      dd = addZero(dd);
      mm = addZero(mm);
      h = addZero(h);
      m = addZero(m);
      s = addZero(s);
      return yyyy + "-" + mm + "-" + dd + " " + h + ":" + m + ":" + s;
    }

    this.pnlModalNuevoRolUsuario = true;
    this.e_fecha = fecha_hora();
    this.e_idrol = "";
    this.e_idusuario = "";
    this.e_estado = "";
  }

  InsertaNuevoRolUsuario() {
    this._rolusuario
      .getInsertaNuevoRolUsuario(
        this.e_idrol,
        this.e_idusuario,
        this.e_estado,
        this.e_fecha
      )
      .subscribe(
        (result: any) => {
          

          this.pnlModalNuevoRolUsuario = false;
          $("#modalNuevoRolUsuario").modal("hide");
          this.BuscarRolUsuario();
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
    this._rolusuario.getEliminaRegistroRolUsuario(id).subscribe(
      (result: any) => {
        

        this.pnlModalEliminaRegistro = false;
        $("#modalEliminaRegistro").modal("hide");
        this.BuscarRolUsuario();
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
    this.m_idusuario = "";
  }

  buscarRoles() {
    this._rolusuario.getBuscarRoles().subscribe(
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

  buscarUsuarios1() {
    this._rolusuario.getBuscarUsuarios().subscribe(
      (result2: any) => {
        if (Array.isArray(result2) && result2.length > 0) {
          var dts = this._fun.RemplazaNullArray(result2);
          this.dts_ListaUsuarios1 = dts.filter((item) => item.id_estado == "1");
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
  descargarFormularioFAS09() {
    let nombreReporte = "FAS09.pdf";
    this._rolusuario.descargarFormularioFAS09().subscribe(
      (result: any) => {
        console.log("datos_permisos", result);
        const url = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", nombreReporte);
        //document.body.appendChild(link);
        link.click();

        // document.body.removeChild(link);
        // URL.revokeObjectURL(url);
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
