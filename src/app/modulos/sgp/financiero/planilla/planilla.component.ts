import { DatePipe } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { Globals } from "../../../../global";

/*servicios*/
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import alasql from "alasql";
import { AutenticacionService } from "../../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../../seguridad/mensajes/mensajes.component";
import { SgpService } from "../../sgp.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important
declare var $: any;
declare let L;

@Component({
  selector: "app-planilla",
  templateUrl: "./planilla.component.html",
  styleUrls: ["./planilla.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
  ],
})
export class PlanillaComponent implements OnInit, OnChanges {
  @Input() idProyecto: number;
  @Input() idSGP: number;
  @Input() maxPlanilla: number;
  @Input() editar: any;
  @Output() messageEvent = new EventEmitter<string>();

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

  /*******negocio********/
  public dts_estructuras: any;
  public dts_estadosPlanilla: any;
  public dts_estadosDescuento: any;
  public maxFechaPago: string = moment().format("YYYY-MM-DD").toString();
  public minFechaPago: string = moment()
    .add(-3600, "days")
    .format("YYYY-MM-DD")
    .toString();
  public estructura: string = "INFRAESTRUCTURA";

  private idUsuario: number;

  formPlanilla: FormGroup;
  createMode: boolean = true;
  modeloPlanilla: {
    estructuraFinanciamiento: any;
    numeroPlanilla: number;
    fechaInicio: string; //Date
    fechaFin: string;
    montoPlanilla: number;
    detallePlanilla: string;
    preventivo: string;
    fechPago: string;
  };

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _seguimiento: SgpService,

    private globals: Globals,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent,
    private datePipe: DatePipe,
    private base64: ImgBase64Globals,

    private formBuilder: FormBuilder
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
    console.log("cargando planilla form");
  }

  ngOnChanges() {
    console.log("en change planilla");
    const datos = JSON.parse(localStorage.getItem("dts_con"));
    console.log(datos);
    this.idUsuario = datos.s_usu_id;
    this.cargarCombos();

    this.formPlanilla = this.formBuilder.group({
      estructuraFinanciamiento: ["", Validators.required],
      numeroPlanilla: [this.maxPlanilla + 1],
      fechaInicio: [""],
      fechaFin: [""],
      montoPlanilla: ["", Validators.required],
      detallePlanilla: ["", Validators.required],
      preventivo: [""],
      fechaPago: ["", Validators.required],
    });

    if (this.editar) {
      const est = {
        id_detalle: 16,
        id_tipoclasificador: 4,
        codigodetalleclasificador: "",
        descripciondetalleclasificador: "FISCALIZACION",
        agrupa_clasificador: "",
        id_estado: 1,
      };
      console.log(
        "impFechaInicio",
        moment(this.editar.fecha_inicio).format("YYYY-MM-DD").toString()
      );
      var finicio = "";
      var ffin = "";
      if (this.editar.fecha_inicio != "") {
        finicio = moment(this.editar.fecha_inicio)
          .format("YYYY-MM-DD")
          .toString();
      }
      if (this.editar.fecha_fin != "") {
        ffin = moment(this.editar.fecha_fin).format("YYYY-MM-DD").toString();
      }

      console.log("la planilla a editar", this.editar);
      this.formPlanilla.setValue({
        estructuraFinanciamiento: est,
        numeroPlanilla: this.editar.nro_planilla,
        fechaInicio: finicio,
        fechaFin: ffin,
        montoPlanilla: this.editar.monto_planilla,
        detallePlanilla: this.editar.detalle_planilla,
        preventivo: this.editar.preventivo,
        fechaPago: moment(this.editar.fecha_pago)
          .format("YYYY-MM-DD")
          .toString(),
      });
      //this.formPlanilla.controls['estructuraFinanciamiento'].setValue('INFRAESTRUCTURA', {onlySelf: true});
      //this.formPlanilla.get('estructuraFinanciamiento').setValue(this.dts_estructuras[2].id_detalle);
      console.log("esctrut", this.formPlanilla.value.estructuraFinanciamiento);
      console.log(this.estructura);
    }

    console.log("maxpago", this.maxFechaPago);
    const el = document.getElementById("FechaPago");
    el.setAttribute("max", this.maxFechaPago);
  }

  /*******************************************************************************/
  /*DATOS INICIALES
  /*******************************************************************************/
  DatosConexion() {
    return new Promise((resolve, reject) => {
      console.log(this.s_idcon, this.s_idmod);
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
      s_usu_id: this.s_usu_id,
      s_usu_id_sipta: this.s_usu_id_sipta,
      s_usu_id_sispre: this.s_usu_id_sispre,
      s_ci_user: this.s_ci_user,
    };
    let dts_rol = this.dts_roles_usuario;

    localStorage.setItem("dts_con", JSON.stringify(dts_con));
    localStorage.setItem("dts_rol", JSON.stringify(dts_rol));
  }

  /***************NEGOCIO PLANILLA*************/
  cargarCombos() {
    this.cargando = true;
    this._seguimiento.listaClasificador(4).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_estructuras = this._fun.RemplazaNullArray(result);
          this.dts_estructuras = alasql(
            `select * from ? where descripciondetalleclasificador!='ANTICIPO 20%'`,
            [this.dts_estructuras]
          );
          console.log(this.dts_estructuras);
          if (this.editar) {
            const selected = this.dts_estructuras.find(
              (i) =>
                i.descripciondetalleclasificador ==
                this.editar.estructura_financiamiento
            ); //'INFRAESTRUCTURA'
            //console.log('el selectedCustomer:',selectedCustomer);
            this.formPlanilla
              .get("estructuraFinanciamiento")
              .setValue(selected.descripciondetalleclasificador);
          }
        } else {
          this.prop_msg = "Alerta: No existen clasificadores para el ID: 4";
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

    this._seguimiento.listaClasificador(11).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_estadosPlanilla = this._fun.RemplazaNullArray(result);
        } else {
          this.prop_msg = "Alerta: No existen clasificadores para el ID: 11";
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

    this._seguimiento.listaClasificador(12).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_estadosDescuento = this._fun.RemplazaNullArray(result);
        } else {
          this.prop_msg = "Alerta: No existen clasificadores para el ID: 12";
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
    this.cargando = false;
  }

  sendMessage(valor_pnl) {
    console.log("sacando el mensaje", valor_pnl);
    this.messageEvent.emit(valor_pnl);
  }

  cambioEstructura() {
    console.log(this.formPlanilla.value.estructuraFinanciamiento);
    // this.laPlanilla.estructuraFinanciamiento = 'ESTRUCTURA';
  }

  registrarPlanilla() {
    this.cargando = true;
    let desc = 0;
    console.log(this.formPlanilla.value.fechaInicio);
    if (this.editar) desc = this.editar.total_descuento;
    let laPlanilla = {
      operacion: this.editar ? "U" : "I",
      idPlanilla: this.editar ? this.editar.id_planilla : 0,
      idProyecto: this.idProyecto,
      idSGP: this.idSGP,
      numeroPlanilla: this.formPlanilla.value.numeroPlanilla,
      fechaInicio:
        this.formPlanilla.value.fechaInicio == undefined
          ? ""
          : this.formPlanilla.value.fechaInicio,
      fechaFin:
        this.formPlanilla.value.fechaFin == undefined
          ? ""
          : this.formPlanilla.value.fechaFin,
      montoPlanilla: this.formPlanilla.value.montoPlanilla,
      detallePlanilla: this.formPlanilla.value.detallePlanilla.toUpperCase(),
      totalDescuentos: desc,
      liquidoPagar: this.formPlanilla.value.montoPlanilla,
      preventivo: this.formPlanilla.value.preventivo.toUpperCase(),
      fechaPago: this.formPlanilla.value.fechaPago,
      estadoPlanilla: 48, //por defecto CONSOLIDADO
      estructuraFinanciamiento:
        this.formPlanilla.value.estructuraFinanciamiento,
      usuarioRegistro: this.idUsuario,
    };

    console.log("la planilla", laPlanilla);

    this._seguimiento.financieraCRUDPlanilla(laPlanilla).subscribe(
      (result: any) => {
        console.log("el result", result);
        if (Array.isArray(result) && result.length > 0) {
          if (result[0].message && !result[0].message.startsWith("ERROR")) {
            this.prop_msg = "Planilla registrada con éxito!!!";
            this.prop_tipomsg = "success";
            this._msg.formateoMensaje("modal_success", this.prop_msg);
            console.log("el form", this.formPlanilla);
            this.formPlanilla.reset();
            this.sendMessage("REGISTRADO");
          } else {
            this.prop_msg = "Alerta: " + result[0].message;
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        } else {
          this.prop_msg = "Alerta: Error al registrar la planilla";
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
    this.cargando = false;
  }
}
