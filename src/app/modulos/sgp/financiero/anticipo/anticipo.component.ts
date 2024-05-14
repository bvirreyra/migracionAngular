import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from "@angular/core";

/*servicios*/
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MensajesComponent } from "../../../seguridad/mensajes/mensajes.component";
import { SgpService } from "../../sgp.service";

import * as moment from "moment";
import swal2 from "sweetalert2";

@Component({
  selector: "app-anticipo",
  templateUrl: "./anticipo.component.html",
  styleUrls: ["./anticipo.component.css"],
})
export class AnticipoComponent implements OnInit, OnChanges {
  @Input() idProyecto: number;
  @Input() idSGP: number;
  @Input() editar: any;
  @Input() eliminar: number;
  @Output() messageEvent = new EventEmitter<string>();

  private idUsuario: number;
  public cargando = false;
  public prop_msg: string;
  public prop_tipomsg: string;
  public errorMessage: string;

  formAnticipo: FormGroup;
  modeloAnticipo: {
    anticipo: any;
    detalleAnticipo: number;
    fechaPago: string;
  };

  constructor(
    private _seguimiento: SgpService,
    private _msg: MensajesComponent,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    console.log("anticipo onInit");
  }

  ngOnChanges() {
    console.log("anticipo onChange");
    const datos = JSON.parse(localStorage.getItem("dts_con"));
    console.log(datos);
    this.idUsuario = datos.s_usu_id;

    this.formAnticipo = this.formBuilder.group({
      anticipo: ["", Validators.required],
      detalleAnticipo: ["", Validators.required],
      fechaPago: ["", Validators.required],
    });

    if (this.editar) {
      console.log("editando", this.editar);
      this.formAnticipo.setValue({
        anticipo: this.editar.anticipo,
        detalleAnticipo: this.editar.detalle_anticipo,
        fechaPago: moment(this.editar.fecha_pago)
          .format("YYYY-MM-DD")
          .toString(),
      });
    }

    if (this.eliminar) {
      swal2({
        title: "Advertencia!!!",
        text: `Realmente desea eliminar el Anticipo?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d9534f",
        cancelButtonColor: "#f0ad4e",
        customClass: "swal2-popup",
        confirmButtonText: "Confirmar!",
      }).then((result) => {
        if (result.value) {
          this.registrarAnticipo();
        } else {
          this.sendMessage("REGISTRADO");
        }
      });
    }
  }

  sendMessage(valor_pnl) {
    console.log("sacando el mensaje", valor_pnl);
    this.messageEvent.emit(valor_pnl);
  }

  registrarAnticipo() {
    let ope = "I";
    let idAnt = 0;
    if (this.editar) {
      ope = "U";
      idAnt = this.editar.id_anticipo;
    }
    if (this.eliminar) {
      ope = "D";
      idAnt = this.eliminar;
    }
    let elAnticipo = {
      operacion: ope,
      idAnticipo: idAnt,
      idProyecto: this.idProyecto,
      idSGP: this.idSGP,
      anticipo: this.formAnticipo.value.anticipo || 0,
      detalleAnticipo: this.formAnticipo.value.detalleAnticipo.toUpperCase(),
      fechaPago: this.formAnticipo.value.fechaPago,
      usuarioRegistro: this.idUsuario,
    };

    console.log("el anticipo", elAnticipo);

    this._seguimiento.financieraCRUDAnticipo(elAnticipo).subscribe(
      (result: any) => {
        console.log("el result", result);
        if (Array.isArray(result) && result.length > 0) {
          if (result[0].message && !result[0].message.startsWith("ERROR")) {
            if (ope != "D") {
              this.prop_msg = "Anticipo registrado con éxito!!!";
              this.prop_tipomsg = "success";
              this._msg.formateoMensaje("modal_success", this.prop_msg);
              this.formAnticipo.reset();
              this.cargando = false;
            }
            this.sendMessage("REGISTRADO");
          } else {
            this.prop_msg = "Alerta: " + result[0].message;
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        } else {
          this.prop_msg = "Alerta: Error al registrar el Anticipo";
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
