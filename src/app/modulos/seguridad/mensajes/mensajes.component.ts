import { Component, Input, OnInit } from "@angular/core";
import swal2 from "sweetalert2";

declare var jQuery: any;
declare var $: any;

@Component({
  selector: "app-mensajes",
  templateUrl: "./mensajes.component.html",
  styleUrls: ["./mensajes.component.css"],
})
export class MensajesComponent implements OnInit {
  public pnl_success = false; //mensaje de exito
  public pnl_info = false; //mensaje de informacion
  public pnl_warning = false; //mensaje de advertencia
  public pnl_danger = false; //mensaje de error

  //public prop_msg:string;
  //public prop_tipomsg:string;

  @Input() prop_msg: string;
  @Input() prop_tipomsg: string;

  constructor() {}

  ngOnInit() {}
  formateoMensaje(
    tipo_modal: string,
    mensaje: string,
    tiempoSegundos?: number
  ) {
    var TIEMPO = 3000;
    if (tiempoSegundos) {
      TIEMPO = tiempoSegundos * 1000;
    }
    if (tipo_modal === "modal_success") {
      swal2({
        type: "success",
        title: "Éxito!",
        text: mensaje,
        timer: TIEMPO,
        backdrop: true,
        customClass: "swal2-popup",
        showConfirmButton: true,
        showCancelButton: false,
        allowOutsideClick: false,
      });
    }
    if (tipo_modal === "modal_info") {
      swal2({
        type: "info",
        title: "Información.",
        text: mensaje,
        timer: TIEMPO,
        backdrop: true,
        customClass: "swal2-popup",
        showConfirmButton: true,
        showCancelButton: false,
        allowOutsideClick: false,
      });
    }
    if (tipo_modal === "modal_warning") {
      swal2({
        type: "warning",
        title: "Advertencia.",
        text: mensaje,
        timer: TIEMPO,
        backdrop: true,
        customClass: "swal2-popup",
        showConfirmButton: true,
        showCancelButton: false,
        allowOutsideClick: false,
      });
    }
    if (tipo_modal === "modal_danger") {
      swal2({
        type: "error",
        title: "Error!",
        text: mensaje,
        timer: TIEMPO,
        backdrop: true,
        customClass: "swal2-popup",
        showConfirmButton: true,
        showCancelButton: false,
        allowOutsideClick: false,
      });
    }
  }
  formateoMensajeTicket(
    tipo_modal: string,
    mensaje: string,
    tiempoSegundos?: number
  ) {
    var TIEMPO = 3000;
    if (tiempoSegundos) {
      TIEMPO = tiempoSegundos * 1000;
    }
    if (tipo_modal === "modal_success") {
      swal2({
        type: "success",
        title: "Éxito!",
        html:
          '<p><font size="24">' +
          mensaje +
          '</font></p><p><font size="5">Con el número de ticket puede realizar el seguimiento</font></p>',
        timer: TIEMPO,
        backdrop: true,
        customClass: "swal2-popup",
        showConfirmButton: true,
        showCancelButton: false,
        allowOutsideClick: false,
      });
    }
    if (tipo_modal === "modal_info") {
      swal2({
        type: "info",
        title: "Información.",
        html: "<h1>" + mensaje + "</h1>",
        timer: TIEMPO,
        backdrop: true,
        customClass: "swal2-popup",
        showConfirmButton: true,
        showCancelButton: false,
        allowOutsideClick: false,
      });
    }
    if (tipo_modal === "modal_warning") {
      swal2({
        type: "warning",
        title: "Advertencia.",
        html: "<h1>" + mensaje + "</h1>",
        timer: TIEMPO,
        backdrop: true,
        customClass: "swal2-popup",
        showConfirmButton: true,
        showCancelButton: false,
        allowOutsideClick: false,
      });
    }
    if (tipo_modal === "modal_danger") {
      swal2({
        type: "error",
        title: "Error!",
        html: "<h1>" + mensaje + "</h1>",
        timer: TIEMPO,
        backdrop: true,
        customClass: "swal2-popup",
        showConfirmButton: true,
        showCancelButton: false,
        allowOutsideClick: false,
      });
    }
  }

  formateoMensajeMin(tipo_modal: string, mensaje: string) {
    if (tipo_modal === "modal_success") {
      swal2({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 5000,
        type: "success",

        title: mensaje,
      });
    }
    if (tipo_modal === "modal_info") {
      swal2({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 5000,
        type: "info",
        title: mensaje,
      });
    }
    if (tipo_modal === "modal_warning") {
      swal2({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 5000,
        type: "warning",
        title: mensaje,
      });
    }
    if (tipo_modal === "modal_danger") {
      swal2({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 5000,
        type: "error",
        title: mensaje,
      });
    }
  }

  preformateoMensajeAlerta(
    prop_msg: string,
    prop_tipomsg: string,
    tipo_modal: string
  ) {
    this.prop_msg = prop_msg;
    this.prop_tipomsg = prop_tipomsg;

    setTimeout(() => {
      this.formateoMensajeAlerta(tipo_modal);
    }, 500);
  }
  preformateoMensajeAlerta1(prop_msg: string, prop_tipomsg: string) {
    this.prop_msg = prop_msg;
    this.prop_tipomsg = prop_tipomsg;
  }
  formateoMensajeAlerta(tipo_modal: string) {
    // console.log(this.prop_msg,this.prop_tipomsg)
    // this.prop_msg=prop_msg
    // this.prop_tipomsg=prop_tipomsg;

    //Modales
    if (tipo_modal === "modal_success") {
      $("#modal_success").modal("show");
    }
    if (tipo_modal === "modal_info") {
      $("#modal_info").modal("show");
    }
    if (tipo_modal === "modal_warning") {
      $("#modal_warning").modal("show");
    }
    if (tipo_modal === "modal_danger") {
      $("#modal_danger").modal("show");
      this.preformateoMensajeAlerta1(this.prop_msg, this.prop_tipomsg);
    }
  }
  cerrarmodal(tipo: string) {
    tipo = "#" + tipo;
    $(tipo).modal("hide");
  }

  confirmarEliminacion(accion) {
    // var flag="false";
    swal2({
      title: "Esta seguro de eliminar el registro?",
      text: "No podra revertir este proceso!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      customClass: "swal2-popup",
      confirmButtonText: "Si, Eliminar!",
    }).then((result) => {
      if (result.value) {
        // flag = "true";
        accion;
      }
    });
    // return flag;
  }
}
