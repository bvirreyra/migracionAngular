import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Inputmask from "inputmask";
import { Globals } from "../../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import * as moment from "moment";
import { SeguimientoService } from "../../../seguimiento/seguimiento.service";
import { AutenticacionService } from "../../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../../seguridad/mensajes/mensajes.component";
import { AccesosRolComponent } from "../../accesos-rol/accesos-rol.component";
import { SgpService } from "../../sgp.service";
moment.locale("es");

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-estructurafinanciamiento",
  templateUrl: "./estructurafinanciamiento.component.html",
  styleUrls: ["./estructurafinanciamiento.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
    SeguimientoService,
    AccesosRolComponent,
  ],
})
export class EstructurafinanciamientoComponent implements OnInit {
  @Input("fid_proyecto") fid_proyecto: any;
  @Input("id_detalle") id_detalle: any;
  @Input("monto_upre") imonto_upre: any;
  @Input("monto_beneficiario") imonto_beneficiario: any;
  @Input("monto_municipal") imonto_municipal: any;
  @Input("monto_gobernacion") imonto_gobernacion: any;
  @Input("estructura_financiamiento") estructura_financiamiento: any;
  @Input("operacion") ioperacion: any;
  @Output() respuestaPadre = new EventEmitter<string>();

  public cargando = false;
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
  public m_codigoproyecto: any;

  public pnl_listaproyecto = false;
  public pnl_supervision = false;
  public pnl_ampliacionplazo = false;

  public pnl_tecnica = false;
  public pnl_financiero = false;
  public pnl_legal = false;
  public pnl_galeria = false;
  public pnl_listaderecho = false;

  public btn_RegistraConvenio = false;
  public btn_ActualizaConvenio = false;

  /************************************
   * VARIABLES DEL COMPONENTE
   ***********************************/

  monto_total: any;
  monto_beneficiario: any;
  monto_municipal: any;
  monto_gobernacion: any;
  btnInsertar: boolean;
  btnActualizar: boolean;
  dtsTipoEstructuraFinanciamiento: any;
  monto_upre: any;
  dtsPermisos: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _sgp: SgpService,
    private _seguimiento: SeguimientoService,

    private globals: Globals,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent,
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
    this.mask_numerodecimal = new Inputmask("9{1,9}.9{1,2}");
    this.mask_fecha = new Inputmask("9{1,2}/9{1,2}/9{1,4}");
    this.mask_numero = new Inputmask("9{1,9}");
    this.mask_gestion = new Inputmask("9999");

    console.log("beneficiario", this.imonto_beneficiario);
    console.log("imonto_municipal", this.imonto_municipal);
    console.log("imonto_gobernacion", this.imonto_gobernacion);
    console.log("imonto_upre", this.imonto_upre);
    console.log("estructura financiamiento", this.estructura_financiamiento);
    console.log("operacion", this.ioperacion);
    console.log("idproy", this.fid_proyecto);
    console.log("iddetalle", this.id_detalle);
    this.obtenerConexion();
    console.log("PERMISOS======>", this.dtsPermisos);

    if (this.ioperacion == "I") {
      this.listaTipoEstructuraFinanciamiento().then((dts: any) => {
        //this.cargarmascaras();
        this.dtsTipoEstructuraFinanciamiento = dts.filter(
          (elemento) =>
            elemento.descripciondetalleclasificador != "INFRAESTRUCTURA"
        );
        console.log(
          "dtsTIPOESTRUCTURAFINANCIAMIENTO",
          this.dtsTipoEstructuraFinanciamiento
        );
      });
      this.btnInsertar = true;
      this.btnActualizar = false;
    }
    if (this.ioperacion == "U") {
      // this.cargarmascaras();
      this.btnInsertar = false;
      this.btnActualizar = true;
    }
    setTimeout(() => {
      this.monto_upre = this._fun
        .valorNumericoDecimal(this.imonto_upre)
        .toFixed(2);
      this.monto_beneficiario = this._fun
        .valorNumericoDecimal(this.imonto_beneficiario)
        .toFixed(2);
      this.monto_municipal = this._fun
        .valorNumericoDecimal(this.imonto_municipal)
        .toFixed(2);
      this.monto_gobernacion = this._fun
        .valorNumericoDecimal(this.imonto_gobernacion)
        .toFixed(2);
      this.monto_total =
        this._fun.valorNumericoDecimal(this.monto_upre) +
        this._fun.valorNumericoDecimal(this.monto_gobernacion) +
        this._fun.valorNumericoDecimal(this.monto_beneficiario) +
        this._fun.valorNumericoDecimal(this.monto_municipal);
      this.monto_total = this.monto_total.toFixed(2);
    }, 20);
  }

  handleInput(event: any) {
    const value = event.target.value;
    const pattern = /^\d+(\.\d{0,2})?$/;
    if (!pattern.test(value)) {
      event.target.value = value.slice(0, -1);
    }
  }

  handleBlur(event: any) {
    console.log("HADLEBLUR===>", event);
    //event.originalTarget.value = Number(event.originalTarget.value).toFixed(2);
    event.target.value = Number(event.target.value).toFixed(2);
  }

  obtenerConexion() {
    return new Promise((resolve, reject) => {
      this.dtsPermisos = JSON.parse(localStorage.getItem("dts_permisos"));
      this.dtsDatosConexion = JSON.parse(localStorage.getItem("dts_con"));
      this.dts_roles_usuario = JSON.parse(localStorage.getItem("dts_rol"));
      this.s_idrol = this.dtsDatosConexion.s_idrol;
      this.s_user = this.dtsDatosConexion.s_idrol;
      this.s_nomuser = this.dtsDatosConexion.s_nomuser;
      this.s_usu_id = this.dtsDatosConexion.s_usu_id;
      this.s_usu_id_sipta = this.dtsDatosConexion.s_usu_id_sipta;
      this.s_usu_id_sispre = this.dtsDatosConexion.s_usu_id_sispre;
      this.s_ci_user = this.dtsDatosConexion.s_ci_user;

      resolve(1);
    });
  }
  /*******************************************************************************/
  /*MASCARAS
  /*******************************************************************************/
  cargarmascaras() {
    var monto_total = document.getElementById("ef_montototal");
    this.mask_numerodecimal.mask(monto_total);
    var monto_beneficiario = document.getElementById("ef_montobeneficiario");
    this.mask_numerodecimal.mask(monto_beneficiario);
    var monto_gobernacion = document.getElementById("ef_montogobernacion");
    this.mask_numerodecimal.mask(monto_gobernacion);
    var monto_municipal = document.getElementById("ef_montomunicipal");
    this.mask_numerodecimal.mask(monto_municipal);
  }
  listaTipoEstructuraFinanciamiento() {
    return new Promise((resolve, reject) => {
      this._sgp.listaTipoEstructuraFinanciamiento().subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            var listaTipoEstructuraFinanciamiento =
              this._fun.RemplazaNullArray(result);

            resolve(listaTipoEstructuraFinanciamiento);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            console.log(this.errorMessage);
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos ";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  crudEstructuraFinanciamiento() {
    let datosFormulario = {};
    this.cargando = true;
    datosFormulario = {
      operacion: this.ioperacion,
      id_detalle: this.id_detalle,
      fid_proyecto: this.fid_proyecto,
      estructura_financiamiento: this.estructura_financiamiento,
      monto_total: this.monto_total,
      monto_beneficiario: this.monto_beneficiario,
      monto_municipal: this.monto_municipal,
      monto_gobernacion: this.monto_gobernacion,
      usuario_registro: this.s_usu_id,
    };
    this._sgp.crudEstructuraFinanciamiento(datosFormulario).subscribe(
      (result: any) => {
        this.prop_tipomsg = result[0]._accion;
        this.prop_msg = result[0]._mensaje;
        this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
        this.respuestaPadre.emit("CONVENIO_ACTUALIZADO");
        this.cargando = false;
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos ";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
        this.cargando = false;
      }
    );
  }
  eliminarEstructuraFinanciamiento() {
    this.ioperacion = "D";
    this.crudEstructuraFinanciamiento();
  }
}
