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
import { SiptaService } from "../../../sipta/sipta.service";
import { AdmusuariosService } from "../../admusuarios/admusuarios.service";
import { RolUsuarioService } from "../../rolusuario/rolusuario.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-usuarios",
  templateUrl: "./usuarios.component.html",
  styleUrls: ["./usuarios.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    AdmusuariosService,
    SiptaService,
    RolUsuarioService,
  ],
})
export class UsuariosComponent implements OnInit {
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
  public s_usu_id: string;
  public s_usu_id_sipta: string;
  public m_usu_id: string;
  public m_tituloformulario: string;

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
  public m_nombres: any; //---juan
  public m_apaterno: any;
  public m_amaterno: any;
  public m_nusuario: any;
  public m_pass: any;
  public m_usu_idsipta: any;

  public m_ci: any;
  public m_fn: any;
  public m_email: any;
  public m_celular: any;
  public m_unidad: any;
  public m_cargo: any;
  public m_idunidadorganizacional: any;
  public m_direcciondom: any;
  public m_idcargo: any;
  public m_nombrecompleto: any;
  public m_responsablepreinversion: any;
  public m_idjefatura: any;
  public m_nrointerno: any;

  public dts_ListaUnidadOrganizacional: any;
  public dts_listajefaturas: any;
  public dts_filtrounidadorganizacional: any;

  //roles
  public m_nombre: any;
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

  public e_expedido: any;
  public e_complemento: any;
  public m_pinpbx: any;
  public m_pinpbx_anterior: any;
  public msj_validausuario: any;

  /*paneles*/
  public pnlModalEliminaProveido = false;
  public pnlModalEditarProveido = false;
  public pnlListaProveidos = false;
  public pnlModalNuevoUsuario = false;
  public pnlModalEliminaRegistro = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _admusuarios: AdmusuariosService,
    private _siptaservice: SiptaService,
    private globals: Globals,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent,
    private datePipe: DatePipe,
    private base64: ImgBase64Globals,

    private _rolusuario: RolUsuarioService
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
    this.m_nombres = "";
    this.m_apaterno = "";
    this.m_amaterno = "";

    function falloCallback(error) {
      console.log("Falló con " + error);
    }
    this.mask_numerodecimal = new Inputmask("9.9{1,2}");
    this.mask_fecha = new Inputmask("9{1,2}/9{1,2}/9{1,4}");
    this.mask_numero = new Inputmask("9{1,9}");
    this.mask_gestion = new Inputmask("9999");

    // this.cargarmascaras();
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

    this.ListaUnidadOrganizacional();
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
                this.s_idrol = result[0]["_idrol"];
                this.s_user = result[0]["_usu_user"];
                this.s_nomuser = result[0]["_usu_nom_com"];
                this.s_usu_id = result[0]["_usu_id"];
                this.s_usu_id_sipta = result[0]["_usu_id_sipta"];
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

  BuscarUsuarios() {
    //alert('ingreso a buscar usuarios:'+this.m_nombres );
    if (this.m_nombres == "") {
      this.m_nombres = null;
    }
    if (this.m_apaterno == "") {
      this.m_apaterno = null;
    }
    if (this.m_amaterno == "") {
      this.m_amaterno = null;
    }
    this._admusuarios
      .getListarUsuarios(this.m_nombres, this.m_apaterno, this.m_amaterno)
      .subscribe(
        (result: any) => {
          

          $("#pnl_busqueda").show();

          //this.ListaProveidos(this.m_idcorrespondencia)
          this.pnlListaProveidos = true;

          if (Array.isArray(result) && result.length > 0) {
            $(".dt-Proveidos").DataTable().destroy();

            this.dts_ListaUsuarios = this._fun.RemplazaNullArray(result);
            let confiTable = this._fun.CONFIGURACION_TABLA_V6(
              [50, 100, 150, 200],
              false,
              10,
              [0, "desc"]
            );
            setTimeout(() => {
              if (!$.fn.dataTable.isDataTable(".dt-Proveidos")) {
                var table = $(".dt-Proveidos").DataTable(confiTable);
                this._fun.inputTable(table, [1, 2, 3, 5, 6]);
                this._fun.selectTable(table, [4, 7]);
              }
            }, 500);
          } else {
            this.prop_msg = "Alerta: No existen registrados";
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
  ListaUnidadOrganizacional() {
    this._siptaservice.ListaUnidadOrganizacional().subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_ListaUnidadOrganizacional =
            this._fun.RemplazaNullArray(result);
          //console.log(this.dts_ListaUnidadOrganizacional);
          console.log("usuarios", result);

          this.dts_listajefaturas = this.dts_ListaUnidadOrganizacional.filter(
            (item) => item.fid_padre == 72
          );
          //console.log(this.dts_listajefaturas);
        } else {
          this.prop_msg = "Alerta: No existen registrados";
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
  obtieneIdJefatura() {
    console.log("filrtando", this.dts_listajefaturas, this.m_unidad);

    var dts = this.dts_listajefaturas.filter(
      (item) => item.nombre == this.m_unidad
    );
    this.m_idjefatura = dts[0]["id_unidad"];
  }
  FiltraUnidadOrganizacional(unidadorganizacional) {
    //console.log(unidadorganizacional);
    if (
      unidadorganizacional != undefined &&
      unidadorganizacional.length >= 2 &&
      unidadorganizacional.length <= 10
    ) {
      this._siptaservice
        .BusquedaLikeUnidadOrganizacional(
          unidadorganizacional.toUpperCase(),
          this.m_idjefatura
        )
        .subscribe(
          (result: any) => {
            
            if (result.length > 0) {
              this.dts_filtrounidadorganizacional = result;
              //console.log(this.dts_filtrounidadorganizacional);
            } else {
              alert("No se encuentran registros con el criterio de busqueda");
              this.prop_msg =
                "Info: No se encuentran registros con el criterio de busqueda ";
              this.prop_tipomsg = "info";
              this._msg.formateoMensaje("modal_info", this.prop_msg);
            }
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
  }
  IdUo() {
    this.dts_filtrounidadorganizacional =
      this.dts_ListaUnidadOrganizacional.filter(
        (item) => item.nombre == this.m_cargo
      );
    this.m_idunidadorganizacional =
      this.dts_filtrounidadorganizacional[0]["id_unidad"];
    //console.log(this.m_idunidadorganizacional);
  }
  MuetraUsuario(datos) {
    this.e_idusuario = datos.usu_id;
    $("#modalFormularioUsuario").modal("show");
    $("#btnRegistrar").hide();
    $("#btnEditar").show();
    this.m_tituloformulario = "ACTUALIZAR USUARIO";
    $("#e_nusuario").prop("readonly", true);
    $("#btnValidaUsuario").hide();
    this.msj_validausuario = "";
    //this.msj_validausuario = 'NO EXISTE'

    console.log("los datos", datos);

    this.e_nombres = datos.usu_nom;
    this.e_apaterno = datos.usu_app;
    this.e_amaterno = datos.usu_apm;
    this.m_ci = datos.usu_ci;
    this.m_fn = this._fun.transformDateOf_yyyymmdd(datos.usu_fn);
    this.m_email = datos.usu_email;
    this.m_celular = datos.usu_cel;
    this.m_direcciondom = datos.usu_direccion;
    this.m_unidad = datos.usu_area;
    this.m_cargo = datos.usu_cargo;
    this.e_nusuario = datos.usu_user;
    this.e_pass = datos.usu_pass;
    this.e_estado = datos.id_estado;
    this.m_usu_id = datos.usu_id;
    this.m_usu_idsipta = datos.usu_sipta;
    this.m_responsablepreinversion = datos.responsablepreinversion;
    this.e_expedido = datos.usu_exp;
    this.e_complemento = datos.usu_complementosegip;
    this.m_pinpbx = datos.usu_pinpbx;
    this.m_pinpbx_anterior = datos.usu_pinpbx;
    this.m_nrointerno = datos.nro_interno;
    console.log("al inicio", this.m_unidad);

    if (this.m_usu_idsipta == "") {
      this.m_usu_idsipta = this.m_usu_id;
    }
  }

  FormNuevoUsuario(datos) {
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

    this.m_tituloformulario = "INSERTAR NUEVO USUARIO";
    this.e_fecha = fecha_hora();
    $("#modalFormularioUsuario").modal("show");
    $("#btnRegistrar").hide();
    $("#btnEditar").hide();
    $("#e_nusuario").prop("readonly", false);
    $("#btnValidaUsuario").show();
    this.msj_validausuario = "";
    this.e_nombres = "";
    this.e_apaterno = "";
    this.e_amaterno = "";
    this.m_ci = "";
    this.m_fn = "";
    this.m_email = "";
    this.m_celular = "";
    this.m_direcciondom = "";
    this.m_unidad = "";
    this.m_cargo = "";
    this.m_responsablepreinversion = "0";
    this.e_nusuario = "";
    this.e_pass = "";
    this.e_estado = "1";
    this.e_expedido = "LP";
    this.e_complemento = "";
    this.m_pinpbx = "";
    this.m_nrointerno = "";
  }

  InsertaNuevoUsuario() {
    if (
      this.e_nombres == "" ||
      this.e_apaterno == "" ||
      this.m_ci == "" ||
      this.m_fn == "" ||
      this.m_email == "" ||
      this.m_celular == "" ||
      this.m_direcciondom == "" ||
      this.m_unidad == "" ||
      this.m_cargo == "" ||
      this.e_nusuario == "" ||
      this.e_pass == "" ||
      this.m_responsablepreinversion === "" ||
      this.m_responsablepreinversion == null ||
      this.m_pinpbx == "" ||
      this.e_estado == "" ||
      this.m_pinpbx == null ||
      this.m_ci == null ||
      this.m_celular == null ||
      this.e_estado == null ||
      this.e_expedido == ""
    ) {
      this.prop_msg = "Debe registrar todos los datos.";
      this.prop_tipomsg = "danger";
      this._msg.formateoMensaje("modal_info", this.prop_msg);
      return;
    }
    this.verificaPinPBX(this.m_pinpbx, 0).then((dts1) => {
      this.m_pinpbx = dts1[0].pinpbx;
      this._admusuarios
        .getInsertaNuevoUsuario(
          this._fun.textoUpper(this.e_nombres),
          this._fun.textoUpper(this.e_apaterno),
          this._fun.textoUpper(this.e_amaterno),
          this._fun.textoNormal(this.m_ci),
          this._fun.textoUpper(this.e_complemento),
          this._fun.textoNormal(this.e_expedido),
          this._fun.textoNormal(this.m_fn),
          this._fun.textoNormal(this.m_email),
          this._fun.textoNormal(this.m_celular),
          this._fun.textoUpper(this.m_direcciondom),
          this._fun.textoUpper(this.m_unidad),
          this._fun.textoUpper(this.m_cargo),
          this._fun.textoUpper(this.e_nusuario),
          this._fun.textoNormal(this.e_pass),
          this.e_estado,
          this.s_usu_id,
          this.m_responsablepreinversion,
          this._fun.textoNormal(this.m_pinpbx),
          this.m_nrointerno
        )
        .subscribe(
          (result: any) => {
            
            this.m_usu_id = result[0]._usu_id;
            $("#modalFormularioUsuario").modal("hide");
            $("#btnRegistrar").hide();
            this.BuscarUsuarios();
            this.InsertaNuevoRolUsuario();
            // this.InsertaNuevoUsuarioSipta();
            this.prop_msg = "Se registró de manera correcta";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_success", this.prop_msg);
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
    });
  }
  InsertaNuevoUsuarioSipta() {
    this.m_idcargo = this.dts_ListaUnidadOrganizacional.filter(
      (item) => item.nombre == this.m_cargo
    );
    this.m_idcargo = this.m_idcargo[0]["id_unidad"];
    this.m_nombrecompleto =
      this.e_nombres + " " + this.e_apaterno + " " + this.e_amaterno;
    let estado;
    if (this.e_estado == "1") {
      estado = "Activo";
    } else {
      estado = "Eliminado";
    }
    this._admusuarios
      .InsertaNuevoUsuarioSipta(
        this.m_usu_id,
        this.m_idcargo,
        this._fun.textoNormal(this.m_ci),
        this._fun.textoUpper(this.m_direcciondom),
        this._fun.textoNormal(this.m_celular),
        this._fun.textoUpper(this.m_email),
        this._fun.textoUpper(this.e_nusuario),
        this._fun.textoNormal(this.e_pass),
        this._fun.textoUpper(this.m_nombrecompleto),
        estado
      )
      .subscribe(
        (result: any) => {
          
          //console.log(result);
          // this.InsertaNuevoUsuarioSgp()
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
  InsertaNuevoUsuarioSgp() {
    this.m_nombrecompleto =
      this.e_nombres + " " + this.e_apaterno + " " + this.e_amaterno;
    this._admusuarios
      .InsertaNuevoUsuarioSgp(
        this.m_usu_id,
        this._fun.textoUpper(this.e_nusuario),
        this._fun.textoUpper(this.m_email),
        this._fun.textoNormal(this.e_pass),
        this.e_estado,
        this._fun.textoUpper(this.m_nombrecompleto),
        this.m_responsablepreinversion
      )
      .subscribe(
        (result: any) => {
          
          //console.log(result);
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
  confirmaCambioPin() {
    this.m_pinpbx_anterior = this.m_pinpbx;
    $("#confirmaCambioPinPBX").modal("hide");
    this.ActualizaUsuario();
  }
  actualizaEstadoRol() {
    this._rolusuario
      .getActualizaEstado(
        this._fun.textoNormal(this.m_usu_id),
        this._fun.textoNormal(this.e_estado)
      )
      .subscribe(
        (result: any) => {
          
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
  ActualizaUsuario() {
    if (
      this.e_nombres == "" ||
      this.e_apaterno == "" ||
      this.m_ci == "" ||
      this.m_fn == "" ||
      this.m_email == "" ||
      this.m_celular == "" ||
      this.m_direcciondom == "" ||
      this.m_unidad == "" ||
      this.m_cargo == "" ||
      this.e_nusuario == "" ||
      this.e_pass == "" ||
      this.m_responsablepreinversion === "" ||
      this.m_responsablepreinversion == null ||
      this.m_pinpbx == "" ||
      this.e_estado == "" ||
      this.m_pinpbx == null ||
      this.m_ci == null ||
      this.m_celular == null ||
      this.e_estado == null ||
      this.e_expedido == ""
    ) {
      this.prop_msg = "No se puede actualizar porque existen datos vacios.";
      this.prop_tipomsg = "danger";
      this._msg.formateoMensaje("modal_info", this.prop_msg);
      return;
    }

    this.verificaPinPBX(this.m_pinpbx, this.e_idusuario).then((dts1) => {
      this.m_pinpbx = dts1[0].pinpbx;
      if (this.m_pinpbx != this.m_pinpbx_anterior) {
        $("#confirmaCambioPinPBX").modal("show");
        return;
      }
      this.m_idcargo = this.dts_ListaUnidadOrganizacional.filter(
        (item) => item.nombre == this.m_cargo
      );
      this._admusuarios
        .getActualizaUsuario(
          this._fun.textoUpper(this.e_nombres),
          this._fun.textoUpper(this.e_apaterno),
          this._fun.textoUpper(this.e_amaterno),
          this._fun.textoNormal(this.m_ci),
          this._fun.textoUpper(this.e_complemento),
          this._fun.textoNormal(this.e_expedido),
          this._fun.textoNormal(this.m_fn),
          this._fun.textoUpper(this.m_email),
          this._fun.textoNormal(this.m_celular),
          this._fun.textoUpper(this.m_direcciondom),
          this._fun.textoUpper(this.m_unidad),
          this._fun.textoUpper(this.m_cargo),
          this._fun.textoUpper(this.e_nusuario),
          this._fun.textoNormal(this.e_pass),
          this.e_estado,
          this.m_usu_id,
          this.m_responsablepreinversion,
          this._fun.textoNormal(this.m_pinpbx),
          this._fun.getNullVacio(this.m_nrointerno)
        )
        .subscribe(
          (result: any) => {
            console.log("ENTRA AQUI2");
            
            $("#modalFormularioUsuario").modal("hide");
            $("#btnEditar").hide();
            // this.ActualizaUsuarioSipta();
            this.BuscarUsuarios();
            this.actualizaEstadoRol();
            console.log("ENTRA A LA ACTUALIZACION");
            this.prop_msg = "Se actualizó de manera correcta";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_success", this.prop_msg);
          },
          (error) => {
            this.errorMessage = <any>error;
            if (this.errorMessage != null) {
              console.log(this.errorMessage);
              this.prop_msg =
                "Error: No se pudo ejecutar la petición en la base de datos2 ";
              this.prop_tipomsg = "danger";
              this._msg.formateoMensaje("modal_danger", this.prop_msg);
            }
          }
        );
    });
  }
  ActualizaUsuarioSipta() {
    this.m_idcargo = this.dts_ListaUnidadOrganizacional.filter(
      (item) => item.nombre == this.m_cargo
    );
    this.m_idcargo = this.m_idcargo[0]["id_unidad"];
    console.log("el cargo id", this.m_idcargo);

    this.m_nombrecompleto =
      this.e_nombres + " " + this.e_apaterno + " " + this.e_amaterno;
    let estado;
    if (this.e_estado == "1") {
      estado = "Activo";
    } else {
      estado = "Eliminado";
    }
    this._admusuarios
      .ActualizaUsuarioSipta(
        this.m_usu_idsipta,
        this.m_idcargo,
        this._fun.textoNormal(this.m_ci),
        this._fun.textoUpper(this.m_direcciondom),
        this._fun.textoNormal(this.m_celular),
        this._fun.textoUpper(this.m_email),
        this._fun.textoUpper(this.e_nusuario),
        this._fun.textoNormal(this.e_pass),
        this._fun.textoUpper(this.m_nombrecompleto),
        estado
      )
      .subscribe(
        (result: any) => {
          
          //console.log(result);
          //this.ActualizaUsuarioSgp();
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
  ActualizaUsuarioSgp() {
    this.m_nombrecompleto =
      this.e_nombres + " " + this.e_apaterno + " " + this.e_amaterno;
    this._admusuarios
      .ActualizaUsuarioSgp(
        this.m_usu_id,
        this._fun.textoUpper(this.e_nusuario),
        this._fun.textoUpper(this.m_email),
        this._fun.textoNormal(this.e_pass),
        this.e_estado,
        this._fun.textoUpper(this.m_nombrecompleto),
        this.m_responsablepreinversion
      )
      .subscribe(
        (result: any) => {
          
          //console.log(result);
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

  EliminaRegistroActual(usu_id: any) {
    //console.log(this.m_prov_fecha);
    this._admusuarios.getEliminaRegistroUsuarios(usu_id).subscribe(
      (result: any) => {
        

        this.pnlModalEliminaRegistro = false;
        $("#modalEliminaRegistro").modal("hide");
        this.BuscarUsuarios();
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
    this.m_nombres = "";
    this.m_apaterno = "";
    this.m_amaterno = "";
  }

  /*juan ---------------------------------------------------*/

  VolverAtras() {
    $("#pnl_busqueda").show();
    $("#pnl_hjcabecera").hide();
    $("#pnl_hjproveidos").hide();
    this.LimpiarBusqueda();
  }

  // Inserta los roles de SIPTA y geopersonal
  InsertaNuevoRolUsuario() {
    // Rol Usuario GeoFuncionario = 18
    // Rol Usuario Correspondencia = 22
    let roles = ["18", "22", "29"];
    let estado = "1";

    this._rolusuario.getInsertaRolUsuarioInicial(this.m_usu_id).subscribe(
      (result: any) => {
        
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
        }
      }
    );
  }
  generaPinPBX() {
    this._admusuarios.generaPinPBX().subscribe(
      (result: any) => {
        
        this.m_pinpbx = result[0].pinpbx;
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
        }
      }
    );
  }
  verificaPinPBX(pin_pbx: any, id_usuario: any) {
    return new Promise((resolve) => {
      this._admusuarios
        .verificaPinPBX(
          this._fun.textoNormal(pin_pbx),
          this._fun.textoNormal(id_usuario)
        )
        .subscribe(
          (result: any) => {
            
            if (result[0].mensaje == "CORRECTO") {
              resolve(result);
              return result;
            } else {
              this.prop_msg = "El pin PBX ya está asignado a otro usuario.";
              this.prop_tipomsg = "danger";
              this._msg.formateoMensaje("modal_danger", this.prop_msg);
            }
          },
          (error) => {
            this.errorMessage = <any>error;
            if (this.errorMessage != null) {
              console.log(this.errorMessage);
            }
          }
        );
    });
  }
  verificaUsuarioSiga() {
    var mensaje = "NO_EXISTE";
    return new Promise((resolve, reject) => {
      this._admusuarios
        .verificaUsuarioSiga(this._fun.textoUpper(this.e_nusuario))
        .subscribe(
          (result: any) => {
            
            console.log("verificado", result);

            if (Array.isArray(result) && result.length > 0) {
              if (result[0]["mensaje"] == "EXISTE") {
                // console.log('siga existe')
                this.msj_validausuario = "EXISTE";
                resolve(mensaje);
              }
            } else {
              if (this.m_tituloformulario == "INSERTAR NUEVO USUARIO") {
                this.msj_validausuario = "NO EXISTE";
                $("#btnRegistrar").show();
                $("#btnEditar").hide();
              }
              if (this.m_tituloformulario == "ACTUALIZAR USUARIO") {
                this.msj_validausuario = "NO EXISTE";
                $("#btnRegistrar").hide();
                $("#btnEditar").show();
              }
              resolve(mensaje);
            }
          },
          (error) => {
            this.errorMessage = <any>error;
            if (this.errorMessage != null) {
              this.prop_msg =
                "Error2: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
              this.prop_tipomsg = "danger";
              this._msg.formateoMensaje("modal_danger", this.prop_msg);
            }
            //reject(this.prop_msg);
          }
        );
    });
  }
  // verificaUsuarioSgp() {
  //   var mensaje = 'NO_EXISTE';
  //   return new Promise((resolve, reject) => {
  //     this._admusuarios.verificaUsuarioSgp(this._fun.textoUpper(this.e_nusuario)).subscribe(
  //       (result: any) => {
  //         
  //         console.log('sgp', result)
  //         if (Array.isArray(result) && result.length > 0) {
  //           if (result[0]["mensaje"] == 'EXISTE') {
  //             mensaje = result[0]["mensaje"];
  //             resolve(mensaje);
  //           }
  //         }
  //         else {
  //           resolve(mensaje);

  //         }
  //       },
  //       error => {
  //         this.errorMessage = <any>error;
  //         if (this.errorMessage != null) {
  //           this.prop_msg = 'Errorrr: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas';
  //           this.prop_tipomsg = 'danger';
  //           this._msg.formateoMensaje('modal_danger', this.prop_msg);
  //         }
  //         //reject(this.prop_msg);
  //       }
  //     )
  //   });
  // }
  // verificaUsuarioFonadal() {
  //   var mensaje = 'NO_EXISTE';
  //   return new Promise((resolve, reject) => {
  //     this._admusuarios.verificaUsuarioFonadal(this._fun.textoUpper(this.e_nusuario)).subscribe(
  //       (result: any) => {
  //         
  //         if (Array.isArray(result) && result.length > 0) {
  //           if (result[0]["mensaje"] == 'EXISTE') {
  //             mensaje = result[0]["mensaje"];
  //             resolve(mensaje);
  //           }
  //         }
  //         else {
  //           resolve(mensaje);
  //         }
  //       },
  //       error => {
  //         this.errorMessage = <any>error;
  //         if (this.errorMessage != null) {
  //           console.log(this.errorMessage);
  //           this.prop_msg = 'Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas';
  //           this.prop_tipomsg = 'danger';
  //           this._msg.formateoMensaje('modal_danger', this.prop_msg);
  //         }
  //         reject(this.prop_msg);
  //       }
  //     )
  //   });
  // }
  // verificaUsuarioAll() {
  //   this.verificaUsuarioSiga()
  //     .then((dts1) => {
  //       console.log('res', dts1)
  //       if (dts1 == 'NO_EXISTE') {
  //         return this.verificaUsuarioSgp()
  //           .then((dts) => {
  //             console.log('sgp', dts)
  //             if (dts == 'NO_EXISTE') {
  //               this.verificaUsuarioFonadal()
  //                 .then((dts) => {
  //                   console.log('fonadal', dts)
  //                   if (dts == 'NO_EXISTE') {
  //                     if(this.m_tituloformulario=='INSERTAR NUEVO USUARIO')
  //                     {
  //                     this.msj_validausuario = 'NO EXISTE'
  //                     $('#btnRegistrar').show();
  //                     $('#btnEditar').hide();
  //                     }
  //                     if(this.m_tituloformulario=='ACTUALIZAR USUARIO')
  //                     {
  //                     this.msj_validausuario = 'NO EXISTE'
  //                     $('#btnRegistrar').hide();
  //                     $('#btnEditar').show();
  //                     }

  //                   }
  //                   else {
  //                     this.msj_validausuario = 'EXISTE'
  //                     $('#btnRegistrar').hide();
  //                     $('#btnEditar').hide();
  //                   }
  //                 })
  //            }
  //             else {
  //               this.msj_validausuario = 'EXISTE'
  //               $('#btnRegistrar').hide();
  //               $('#btnEditar').hide();
  //             }
  //          })
  //       }
  //       else {
  //         this.msj_validausuario = 'EXISTE'
  //         $('#btnRegistrar').hide();
  //         $('#btnEditar').hide();
  //       }
  //     })
  // }
}
