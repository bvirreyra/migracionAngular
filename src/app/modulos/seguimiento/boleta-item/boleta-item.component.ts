import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Inputmask from "inputmask";
import { Globals } from "../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { SeguimientoService } from "../../seguimiento/seguimiento.service";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-boleta-item",
  templateUrl: "./boleta-item.component.html",
  styleUrls: ["./boleta-item.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SeguimientoService,
  ],
})
export class BoletaItemComponent implements OnInit {
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

  public pnlFormularioRegistrar = false;
  public pnlGridView = false;
  public pnl_formulario2 = false;

  /*variables del componente*/
  public dts_seguimiento: any;
  public dts_boletas: any;
  public dts_items: any;
  public dts_unidadmedida: any;

  public m_id_proyecto: any;
  public m_nombreproyecto: any;
  public m_id_boleta: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _seguimiento: SeguimientoService,

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
    this.paneles("VER_GRIDVIEW");

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
        return this.RolesAsignados(this.s_usu_id);
      })
      .then((dts) => {
        this.dts_roles_usuario = dts;
      })
      .catch(falloCallback);

    this.listaProyectos();
    this.unidadmedida();
  }
  /*******************************************************************************/
  /*MASCARAS
  /*******************************************************************************/
  cargarmascaras() {
    // var gestion = document.getElementById("gestion");
    // var hojaruta = document.getElementById("nrohojaderuta");
    // var fecha = document.getElementById("fecha");
    // var fecha_respuesta = document.getElementById("fecharespuesta");
    // this.mask_gestion.mask(gestion);
    // this.mask_numero.mask(hojaruta);
    // this.mask_fecha.mask(fecha);
    // this.mask_fecha.mask(fecha_respuesta);
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
          
          console.log("rolesasignados", result);
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
  paneles(string) {
    if (string == "VER_GRIDVIEW") {
      $("#pnl_gridview").show();
      $("#pnl_gridview_boletas").hide();
      $("#modalConfirmacion").modal("hide");
      $("#pnl_gridview_items").hide();
    }
    if (string == "VER_GRIDVIEW_BOLETAS") {
      $("#pnl_gridview").hide();
      $("#pnl_gridview_boletas").show();
      $("#modalConfirmacion").modal("hide");
      $("#pnl_gridview_items").hide();
    }
    if (string == "VER_CONFIRMACION") {
      $("#modalConfirmacion").modal("show");
    }
    if (string == "VER_ITEMS") {
      $("#pnl_gridview").hide();
      $("#pnl_gridview_boletas").hide();
      $("#pnl_gridview_items").show();
      $("#modalConfirmacion").modal("hide");
    }
  }
  /*Busqueda Proyectos*/
  listaProyectos() {
    this._seguimiento.listaProyectos().subscribe(
      (result: any) => {
        
        console.log(result);
        if (Array.isArray(result) && result.length > 0) {
          this.dts_seguimiento = this._fun.RemplazaNullArray(result);

          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V3(
              [10, 20, 50],
              false
            );
            var table = $(".dt-seguimiento").DataTable(confiTable);
            this._fun.selectTable(table, [1, 4, 10]);
            this._fun.inputTable(table, [2, 3]);
          }, 500);
        } else {
          this.prop_msg = "Alerta: No existen responsables registrados";
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
  listaBoletas(id_proyecto, nombre) {
    this.m_id_proyecto = id_proyecto;
    this.m_nombreproyecto = nombre;
    console.log(this.m_id_proyecto, this.m_nombreproyecto);
    this.paneles("VER_GRIDVIEW_BOLETAS");
    this._seguimiento.listaBoletas(this.m_id_proyecto).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_boletas = this._fun.RemplazaNullArray(result);
          this._fun.limpiatabla(".dt-boletas");
          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V3(
              [10, 20, 50],
              false
            );
            var table = $(".dt-boletas").DataTable(confiTable);
            //     this._fun.inputTable(table, [4, 5]);
            //   this._fun.selectTable(table, [1,2,3]);
          }, 500);
        } else {
          this.prop_msg = "Alerta: No existen responsables registrados";
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
  preeliminar(id_boleta) {
    this.paneles("VER_CONFIRMACION");
    this.m_id_boleta = id_boleta;
  }
  eliminaboleta() {
    this.paneles("VER_GRIDVIEW_BOLETAS");
    this._seguimiento
      .eliminaboleta(this.m_id_boleta, this.m_id_proyecto)
      .subscribe(
        (result: any) => {
          
          if (result.estado == "CORRECTO") {
            this.listaBoletas(this.m_id_proyecto, this.m_nombreproyecto);
          } else {
            this.prop_msg = "Alerta: No existen responsables registrados";
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
  unidadmedida() {
    this._seguimiento.unidadmedida().subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_unidadmedida = this._fun.RemplazaNullArray(result);
        } else {
          this.prop_msg = "Alerta: No existen unidades de medida";
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
  listaitems(id_proyecto, nombre) {
    this.paneles("VER_ITEMS");
    this.m_nombreproyecto = nombre;
    this._seguimiento.listaItems(id_proyecto).subscribe(
      (result: any) => {
        
        console.log("items", result);
        if (Array.isArray(result) && result.length > 0) {
          this.dts_items = this._fun.RemplazaNullArray(result);
          /*
          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V3([10, 20, 50], false);
            var table = $('.dt-items').DataTable(confiTable);
            //this._fun.selectTable(table, [1, 4,10]);
            //this._fun.inputTable(table, [2, 3]);
          }, 500);
          */
        } else {
          this.prop_msg = "Alerta: No existen responsables registrados";
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
  pre_editaitems(id_item) {
    var item_unidadmedida = "#item_unidadmedida" + id_item;
    var item_cantidad = "#item_cantidad" + id_item;
    var item_preciounitario = "#item_preciounitario" + id_item;
    var item_estado = "#item_estado" + id_item;
    var unidadmedida = $(item_unidadmedida).val();
    var cantidad = $(item_cantidad).val();
    var preciounitario = $(item_preciounitario).val();
    var estado = $(item_estado).val();
    console.log(unidadmedida, cantidad, preciounitario, estado);
    this.editaitems(id_item, unidadmedida, cantidad, preciounitario, estado);
  }
  editaitems(id_item, unidadmedida, cantidad, preciounitario, estado) {
    this._seguimiento
      .editaitems(id_item, unidadmedida, cantidad, preciounitario, estado)
      .subscribe(
        (result: any) => {
          
          if (result.estado == "CORRECTO") {
            alert("Se edito de forma correcta");
          } else {
            this.prop_msg = "Alerta: No existen responsables registrados";
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
}
