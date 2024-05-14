import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import Inputmask from "inputmask";
import { Globals } from "../../../global";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";
import { SiptaService } from "../../sipta/sipta.service";
declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important
@Component({
  selector: "app-institucioncargo",
  templateUrl: "./institucioncargo.component.html",
  styleUrls: ["./institucioncargo.component.css"],
})
export class InstitucioncargoComponent implements OnInit {
  //cargar_variable_exportada_de_otro_formulario
  @Input("inputIdInstitucion") id_institucion: string;
  message: string = "Hola Mundo!";
  @Output() messageEvent = new EventEmitter<string>();

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
  public dts_roles_usuario: any;
  public s_usu_id_sipta: any;

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

  //variables del componente
  public pnl_formulario: false;
  public dts_cargo: any;
  public m_estadocargo: any;
  public m_nombreinstitucion: any;
  public m_nombrecargo: any;
  public m_idCargoInstitucion: any;
  public m_idcargo: any;
  public m_idinstitucion: any;
  public inputIdInstitucion: any;
  public inputIdCargo: any;
  public dts_institucion: any;
  public dts_UsuarioExterno: any;
  public m_filtroidInstitucion: any;
  public pnlDatos = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _sipta: SiptaService,

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
    this.paneles("VER_GRIDVIEW_CARGO");
    this.listarcargo();
    function falloCallback(error) {
      console.log("Falló con " + error);
    }
    this.mask_numerodecimal = new Inputmask("9{1,9}.9{1,2}");
    this.mask_fecha = new Inputmask("9{1,2}/9{1,2}/9{1,4}");
    this.mask_numero = new Inputmask("9{1,9}");
    this.mask_gestion = new Inputmask("9999");
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
        return this.RolesAsignados(this.dtsDatosConexion[0]._usu_id);
      })
      .then((dts) => {
        this.dts_roles_usuario = dts;
        this.listarInstitucion();
      })
      .catch(falloCallback);
  }
  paneles(string) {
    if (string == "NUEVO_CARGO") {
      this.limpiar();
      $("#pnl_formulariocargo").show();
      $("#pnl_gridviewcargo").hide();
      $("#pnl_edicioncargo").hide();
      $("#btnInsertarcargo").show();
      $("#btnActualizarcargo").hide();
    }
    if (string == "VER_GRIDVIEW_CARGO") {
      $("#pnl_formulariocargo").hide();
      $("#pnl_gridviewcargo").show();
    }
    if (string == "EDITAR_FORMULARIO_CARGO") {
      $("#pnl_formulariocargo").show();
      $("#pnl_gridviewcargo").hide();
      $("#pnl_edicioncargo").show();
      $("#btnInsertarcargo").hide();
      $("#btnActualizarcargo").show();
    }
    if (string == "ENVIO_FORMULARIO_CARGO") {
      $("#pnl_formulariocargo").hide();
      $("#pnl_gridviewcargo").hide();
      $("#pnl_edicioncargo").hide();
      $("#btnInsertarcargo").hide();
      $("#btnActualizarcargo").hide();
      this.pnlDatos = true;
    }
    if (string == "VER_INSTITUCION") {
      //this.receiveMessage();
      $("#pnl_formularioinstitucion").hide();
      $("#pnl_gridviewinstitucion").show();
      $("#pnl_gridviewcargo").hide();
      //this.pnlCargo=true;
    }
  }
  limpiar() {
    this.m_nombrecargo = "";
  }
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
                resolve(result);
                return result;
              }
            } else {
              this.prop_msg =
                "Error: La conexion no es valida2, contáctese con el área de sistemas";
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
                "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas1";
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
              "Error: La conexion no es valida1, contáctese con el área de sistemas";
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
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas2";
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
          
          console.log(this.id_institucion);
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
  FechaLiteral(f) {
    return this._fun.FechaLiteral(f);
  }
  listarcargo() {
    this._sipta.getListacargo_filtro(this.id_institucion).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_cargo = this._fun.RemplazaNullArray(result);
          this._fun.limpiatabla(".dt-cargo");
          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V3(
              [10, 20, 50],
              false
            );
            var table = $(".dt-cargo").DataTable(confiTable);
            this._fun.inputTable(table, [2]);
            this._fun.selectTable(table, [3]);
          }, 20);
        } else {
          this.prop_msg = "Alerta: No existen registros";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas3";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      }
    );
  }
  listarInstitucion() {
    this._sipta.getListaInstitucion().subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_institucion = this._fun.RemplazaNullArray(result);
          var dts = this.dts_institucion.filter(
            (item) => item.IdInstitucion == this.id_institucion
          );
          this.m_filtroidInstitucion = dts[0]["IdInstitucion"];
          this.m_nombreinstitucion = dts[0]["Nombre"];
        } else {
          this.prop_msg = "Alerta: No existen registros....";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas3";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      }
    );
  }
  insertarcargo() {
    if (this.m_nombrecargo != undefined && this.m_nombrecargo.length > 0) {
      this._sipta
        .getInsertarcargo(this.id_institucion, this.m_nombrecargo)
        .subscribe(
          (result: any) => {
            
            if (result[0]["ACCION"] == "CARGO DUPLICADO") {
              this.prop_msg = "Error: Nombre de Cargo Duplicado";
              this.prop_tipomsg = "danger";
              this._msg.formateoMensaje("modal_danger", this.prop_msg);
            } else {
              this.listarcargo();
              this.paneles("VER_GRIDVIEW_CARGO");
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
    } else {
      this.prop_msg = "Error: Debe ingresar el Nombre";
      this.prop_tipomsg = "danger";
      this._msg.formateoMensaje("modal_danger", this.prop_msg);
    }
  }
  editarcargo() {
    this._sipta
      .getEditarcargo(this.m_idcargo, this.id_institucion, this.m_nombrecargo)
      .subscribe(
        (result: any) => {
          
          if (result[0]["ACCION"] == "CARGO DUPLICADO") {
            this.prop_msg = "Error: Nombre de Cargo Duplicado";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          } else {
            this.listarcargo();
            this._fun.limpiatabla(".dt-cargo");
            this.paneles("VER_GRIDVIEW_CARGO");
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas3";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        }
      );
  }
  editarcargopre(dts) {
    this.paneles("EDITAR_FORMULARIO_CARGO");
    this.m_idcargo = dts.IdCargoInstitucion;
    this.m_idinstitucion = dts.IdInstitucion;
    this.m_nombreinstitucion = dts.institucion;
    this.m_nombrecargo = dts.cargo;
    this.m_estadocargo = dts.Estado;
  }
  envio_formulario(dts) {
    this.paneles("ENVIO_FORMULARIO_CARGO");
    this.m_idinstitucion = dts.IdInstitucion;
    this.inputIdInstitucion = this.m_idinstitucion;
    this.m_idcargo = dts.IdCargoInstitucion;
    this.inputIdCargo = this.m_idcargo;
  }
  envio_estado(dts) {
    this.m_idcargo = dts.IdCargoInstitucion;
    this.m_idinstitucion = dts.IdInstitucion;
    this.m_estadocargo = dts.Estado;
    if (this.m_estadocargo == "Activo") {
      this.m_estadocargo = "Inactivo";
    } else {
      this.m_estadocargo = "Activo";
    }
    this._sipta
      .getEnvioestadocargo(
        this.m_idcargo,
        this.m_idinstitucion,
        this.m_estadocargo
      )
      .subscribe((result: any) => {
        
        if (result[0]["ACCION"] == "ESTADO MODIFICACO") {
          this.prop_msg = "Estado Modificado";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
          //this.ListaInstitucion();
          this.listarcargo();
        }
      });
  }
  sendMessage() {
    this.messageEvent.emit(this.message);
    this.paneles("VER_INSTITUCION");
  }
}
