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
import { AutenticacionService } from "../../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../../seguridad/mensajes/mensajes.component";
import { SgpService } from "../../sgp.service";

import swal2 from "sweetalert2";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important
declare var $: any;
declare let L;

@Component({
  selector: "app-descuento",
  templateUrl: "./descuento.component.html",
  styleUrls: ["./descuento.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
  ],
})
export class DescuentoComponent implements OnInit, OnChanges {
  @Input() idProyecto: number;
  @Input() idPlanilla: number;
  @Input() idSGP: number;
  @Input() numPlanilla: number;
  @Input() editar: any;
  @Input() eliminar: number;

  @Output() messageEvent = new EventEmitter<string>();

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
  public dts_tiposDescuento: any;
  public dts_estadosDescuento: any;
  public cargando: boolean = false;

  private idUsuario: number;

  formDescuento: FormGroup;
  createMode: boolean = true;
  todo: {
    tipoDescuento: any;
    montoDescuento: number;
    fechaDescuento: string; //Date
    preventivo: string;
    detalleDescuento: number;
    observacion: string;
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
    console.log("descuento on init");
  }
  ngOnChanges() {
    console.log("descuento on change");
    const datos = JSON.parse(localStorage.getItem("dts_con"));
    console.log(datos);
    this.idUsuario = datos.s_usu_id;
    this.cargarCombos();

    this.formDescuento = this.formBuilder.group({
      tipoDescuento: ["", Validators.required],
      montoDescuento: [0, Validators.required],
      fechaDescuento: ["", Validators.required],
      preventivo: [""],
      detalleDescuento: ["", Validators.required],
      observacion: [""],
    });

    if (this.editar) {
      console.log("editando", this.editar);

      const des = {
        id_detalle: 16,
        id_tipoclasificador: 24,
        codigodetalleclasificador: "",
        descripciondetalleclasificador: "OTROS DESCUENTOS",
        agrupa_clasificador: "",
        id_estado: 1,
      };
      this.formDescuento.setValue({
        tipoDescuento: des,
        montoDescuento: this.editar.monto_descuento,
        fechaDescuento: moment(this.editar.fecha_descuento)
          .format("YYYY-MM-DD")
          .toString(),
        preventivo: this.editar.preventivo,
        detalleDescuento: this.editar.detalle_descuento,
        observacion: this.editar.observacion,
      });
    }

    if (this.eliminar) {
      swal2({
        title: "Advertencia!!!",
        text: `Realmente desea eliminar el Descuento?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d9534f",
        cancelButtonColor: "#f0ad4e",
        customClass: "swal2-popup",
        confirmButtonText: "Confirmar!",
      }).then((result) => {
        if (result.value) {
          this.registrarDescuento();
        } else {
          this.sendMessage("REGISTRADO");
        }
      });
    }

    if (!this.createMode) {
      this.loadTodo(this.todo);
    }
  }

  loadTodo(todo) {
    this.formDescuento.patchValue(todo);
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
    this._seguimiento.listaClasificador(24).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_tiposDescuento = this._fun.RemplazaNullArray(result);
          if (this.editar) {
            const selected = this.dts_tiposDescuento.find(
              (i) => i.id_detalle == this.editar.tipo_descuento
            );
            //console.log('el selectedCustomer:',selectedCustomer);
            this.formDescuento
              .get("tipoDescuento")
              .setValue(selected.id_detalle);
          }
        } else {
          this.prop_msg = "Alerta: No existen clasificadores para el ID: 13";
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
  }

  sendMessage(valor_pnl) {
    console.log("sacando el mensaje", valor_pnl);
    this.messageEvent.emit(valor_pnl);
  }

  registrarDescuento() {
    let ope = "I";
    if (this.editar) ope = "U";
    if (this.eliminar) ope = "D";
    let idDesc = 0;
    if (this.editar) idDesc = this.editar.id_descuento;
    if (this.eliminar) idDesc = this.eliminar;
    if (this.editar) this.idPlanilla = this.editar.fid_planilla;
    this.cargando = true;
    let elDescuento = {
      operacion: ope,
      idDescuento: idDesc,
      idProyecto: this.idProyecto,
      idPlanilla: this.idPlanilla,
      idSGP: this.idSGP,
      tipoDescuento: this.formDescuento.value.tipoDescuento || 0,
      detalleDescuento: this.formDescuento.value.detalleDescuento.toUpperCase(),
      montoDescuento: this.formDescuento.value.montoDescuento,
      fechaDescuento: this.formDescuento.value.fechaDescuento,
      preventivo:
        this.formDescuento.value.preventivo == ""
          ? this.formDescuento.value.preventivo
          : this.formDescuento.value.preventivo.toUpperCase(),
      observacion:
        this.formDescuento.value.observacion == ""
          ? this.formDescuento.value.observacion
          : this.formDescuento.value.observacion.toUpperCase(),
      estadoDescuento: 51, //por defeceto CONSOLIDADO
      usuarioRegistro: this.idUsuario,
    };

    console.log("el descuento", elDescuento);

    this._seguimiento.financieraCRUDDescuentos(elDescuento).subscribe(
      (result: any) => {
        
        console.log("el result", result);
        if (Array.isArray(result) && result.length > 0) {
          if (result[0].message && !result[0].message.startsWith("ERROR")) {
            if (ope != "D") {
              this.prop_msg = "Descuento registrado con éxito!!!";
              this.prop_tipomsg = "success";
              this._msg.formateoMensaje("modal_success", this.prop_msg);
            }
            //this.recalcularDescuentos();//parece mejor probar desde el pr
            this.sendMessage("REGISTRADO");
          } else {
            this.prop_msg = "Alerta: " + result[0].message;
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        } else {
          this.prop_msg = "Alerta: Error al registrar el descuento";
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

  recalcularDescuentos() {
    this.cargando = true;
    //cargando planillas
    this._seguimiento.financieraPlanillas(this.idProyecto).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          const lasPlanillas = this._fun.RemplazaNullArray(result);
          console.log("en reacalcula", lasPlanillas, this.idPlanilla);
          const modPlanilla = lasPlanillas.filter(
            (elemento) => elemento.id_planilla == this.idPlanilla
          )[0];
          modPlanilla.operacion = "U";
          (modPlanilla.totalDescuentos =
            Number(modPlanilla.total_descuento) +
            Number(this.formDescuento.value.montoDescuento)),
            (modPlanilla.liquidoPagar =
              Number(modPlanilla.liquido_apagar) -
              Number(this.formDescuento.value.montoDescuento)),
            console.log("la planilla mod", modPlanilla);
          this._seguimiento.financieraCRUDPlanilla(modPlanilla).subscribe(
            (result: any) => {
              
              console.log("el result", result);
              if (Array.isArray(result) && result.length > 0) {
                console.log("actualizado montos", result);
                this.sendMessage("REGISTRADO");
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
          console.log("no encontro la planilla", this.idPlanilla);
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
