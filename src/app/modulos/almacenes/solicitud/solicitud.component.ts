import { Component, OnChanges, OnInit } from "@angular/core";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import * as moment from "moment";
import { AutenticacionService } from "src/app/modulos/seguridad/autenticacion.service";
import swal2 from "sweetalert2";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";
import { AlmacenesService } from "../almacenes.service";

declare var $: any;

@Component({
  selector: "app-solicitud",
  templateUrl: "./solicitud.component.html",
  styleUrls: ["./solicitud.component.css"],
})
export class SolicitudComponent implements OnInit, OnChanges {
  //variables para el compononete de mensajes
  public prop_msg: string;
  public prop_tipomsg: string;
  public errorMessage: string;
  public cargando: boolean = false;

  public idUsuario: number;
  public idRol: number;
  public idAdmin: number;
  public area: string;
  public nomAdmin: string;
  public dts_solicitudes: any;
  public dts_detalle: any = [];
  public dts_insumos: any;
  public comboInsumos: any;
  public gestion: number = moment().year();
  public editados = [];
  public dts_roles: number[] = [];
  public render = false;

  public maxSolicitud: number = 1;
  public elIdSolicitud: number;
  public solicitudEditar: boolean = false;
  public habilitarRegistro: boolean = false;
  public stockActual: number = 0;
  public insumo: any;
  // public sinFecha:boolean=false;

  public solicitud: {
    numeroSolicitud: number;
    fechaSolicitud: string;
    fechaEntrega: string;
    observacion: string;
    usuarioAdmin: number;
    estado: string;
    incremento: string;
    idSolicitud: number;
    idUsuarioRegistro: number;
  };

  public dts_gestiones: number[] = [];

  constructor(
    private _almacen: AlmacenesService,
    private _autenticacion: AutenticacionService,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent
  ) {
    this.solicitud = {
      numeroSolicitud: 1,
      fechaSolicitud: moment().format("YYYY-MM-DD").toString(),
      fechaEntrega: "",
      observacion: "",
      usuarioAdmin: 0,
      estado: "",
      incremento: "",
      idSolicitud: 0,
      idUsuarioRegistro: 0,
    };
  }

  ngOnInit() {
    console.log("iniciando solicitudes");
    const datos = JSON.parse(localStorage.getItem("dts_con"));
    console.log(datos);
    for (let i = this.gestion; i > this.gestion - 4; i--) {
      this.dts_gestiones.push(i);
    }
    this.idUsuario = datos.s_usu_id;
    // this.idRol = datos.s_idrol;
    this.area = datos.s_usu_area;
    this.nomAdmin = datos.s_nomuser;
    console.log("la gest", this.gestion);
    this.RolesAsignados();
    this.cargarSolicitudes();
    this.cargarInsumos();
    setTimeout(() => {
      this.render = true;
    }, 200);
  }
  ngOnChanges() {
    console.log("entrando al change");
  }

  RolesAsignados() {
    this._autenticacion.rolesasignados(this.idUsuario.toString()).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_roles = this._fun
            .RemplazaNullArray(result)
            .map((el) => el.idrol);
          this.dts_roles.includes(2)
            ? (this.idAdmin = this.idUsuario)
            : (this.idAdmin = null);
          console.log("roles asignados", this.dts_roles);
        } else {
          console.log("error al obtener roles", result);
        }
      },
      (error) => {
        console.log("error conexion", error);
      }
    );
  }

  cargarSolicitudes(filtro?: string) {
    this.cargando = true;
    this._almacen.solicitudes(this.gestion).subscribe(
      (result: any) => {
        console.log("las solicitudes", result);
        if (Array.isArray(result) && result.length > 0) {
          this.filtrarSolicitudes(this._fun.RemplazaNullArray(result), filtro);
          this._fun.limpiatabla(".dt-solicitud");
          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V6(
              [50, 100, 150, 200],
              false,
              10,
              [0, "desc"]
            );
            if (!$.fn.dataTable.isDataTable(".dt-solicitud")) {
              var table = $(".dt-solicitud").DataTable(confiTable);
              // this._fun.selectTable(table, [1, 2]);
              this._fun.inputTable(table, [0, 2, 3, 4, 5]);
            }
          }, 200);
          this.cargando = false;
        } else {
          this.cargando = false;
          this._msg.formateoMensaje(
            "modal_Info",
            "No existen solicitudes registradas",
            6
          );
        }
      },
      (error) => {
        this.cargando = false;
        this.errorMessage = <any>error;
        if (this.errorMessage != null)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage,
            10
          );
      }
    );
  }

  async filtrarSolicitudes(sol, filtro?: string) {
    // this.dts_solicitudes = await sol.filter(el =>moment(el.fecha_registro).year()==this.gestion);//ya se filtra desde el back
    this.dts_solicitudes = sol;
    this.maxSolicitud = await this.dts_solicitudes.reduce(
      (ac, el) => (ac > el.numero_solicitud ? ac : el.numero_solicitud),
      0
    );
    if (!this.dts_roles.includes(2)) {
      this.dts_solicitudes = this.dts_solicitudes.filter(
        (el) => el.usuario_registro == this.idUsuario
      );
    } else {
      if (filtro == "ACTIVOS")
        this.dts_solicitudes = this.dts_solicitudes.filter(
          (el) => el.estado != "" || el.usuario_registro == this.idUsuario
        );
      if (!filtro)
        this.dts_solicitudes = this.dts_solicitudes.filter(
          (el) =>
            el.estado === "CONFIRMADO" || el.usuario_registro == this.idUsuario
        );
    }
    // this.maxSolicitud = this.dts_solicitudes.reduce((ac,el)=>ac>el.numero_solicitud?ac:el.numero_solicitud,0)//esto si fuera numero sol por unidad
    this.solicitud.numeroSolicitud = this.maxSolicitud + 1;
  }

  solicitudDetalle(solicitud: any) {
    this.solicitudEditar = true;
    // if (solicitud.estado == 'ENTREGADO') this.sinFecha = true;
    console.log("detalle", solicitud);
    this.solicitud = {
      numeroSolicitud: solicitud.numero_solicitud,
      fechaSolicitud: moment(solicitud.fecha_registro)
        .format("YYYY-MM-DD")
        .toString(),
      fechaEntrega: moment(solicitud.fecha_entrega)
        .format("YYYY-MM-DD")
        .toString(),
      observacion: solicitud.observacion,
      usuarioAdmin: solicitud.usuarioAdmin,
      estado: solicitud.estado,
      incremento: solicitud.incremento,
      idSolicitud: solicitud.id_solicitud,
      idUsuarioRegistro: solicitud.usuario_registro,
    };
    this.cargarDetalle(solicitud.id_solicitud);
    $("#modalSolicitud").modal("show");
    $.fn.modal.Constructor.prototype.enforceFocus = function () {}; //esto para que no tenga confilctos el <ng-select2> con el modal de bootstarp
    setTimeout(() => {
      this.bloquear(solicitud.estado);
    }, 500);
  }

  bloquear(estado: string) {
    estado == "INICIADO"
      ? $("#todo :input").prop("disabled", false)
      : $("#todo :input").prop("disabled", true);
    if (estado == "INICIADO") {
      // $('.cuser').prop('disabled',false);
      $(".cadmin").prop("disabled", true);
      $("#registrar").prop("disabled", false);
    }
    if (estado == "CONFIRMADO" && this.dts_roles.includes(2)) {
      // $('.cuser').prop('disabled',false);
      $(".cadmin").prop("disabled", false);
      $("#registrar").prop("disabled", false);
    }
    // if(solicitud.estado != 'INICIADO'){
    //   $('#todo :input').prop('disabled', true);
    // }else{
    //   $('#todo :input').prop('disabled', false);
    //   // this.dts_roles.includes(2) ? $('.cuser').prop('disabled',true): $('.cadmin').prop('disabled',true)
    //   if (this.dts_roles.includes(2)) $('.cadmin').prop('disabled',false);
    // }
    $(".btn-secondary").prop("disabled", false);
    // $('#registrar').prop('disabled', true);
  }

  cargarDetalle(id: number) {
    this.elIdSolicitud = id;
    this.cargarInsumos();
    this._almacen.solicitudesDetalle(id).subscribe(
      (result: any) => {
        console.log("el resul", result);
        if (Array.isArray(result) && result.length > 0) {
          this.dts_detalle = this._fun.RemplazaNullArray(result);
          //para actualizar el valor de stock sin tomar en cuenta lo que este en estado SOLICITADO, para ajustes de cambios de cantidad solicitada
          this.dts_detalle.map(
            (el) =>
              (el.stock = Number(el.stock) + Number(el.cantidad_entregada))
          );
        } else {
          console.log("sin insumos para la solicitud");
          this.dts_detalle = [];
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage,
            10
          );
      }
    );
  }

  cargarInsumos() {
    console.log("cargando insumos");

    this.cargando = true;
    this._almacen.insumos().subscribe(
      (result: any) => {
        console.log("result ins", result);

        if (Array.isArray(result) && result.length > 0) {
          this.dts_insumos = this._fun.RemplazaNullArray(result);
          // this.comboInsumos = this.dts_insumos.map(el => {el.text = `${el.codigo}-${el.descripcion}-${el.unidad}`;el.id = el.id_insumo})
          this.comboInsumos = this.dts_insumos
            .filter((f) => f.cantidad > 0)
            .map((el) => {
              const obj = {
                text: `${el.codigo}-${el.descripcion}-${el.unidad}`,
                id: el.id_insumo,
              };
              return obj;
            });
          console.log("el combo", this.comboInsumos);
        } else {
          console.log("no se cargaron insumos");
        }
        this.cargando = false;
      },
      (error) => {
        this.cargando = false;
        this.errorMessage = <any>error;
        if (this.errorMessage != null)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage,
            10
          );
      }
    );
  }

  async solicitarInsumo(e) {
    console.log("sol ins", e);

    if (!e) return true;
    const objInsumo = await this.dts_insumos.filter(
      (el) => el.id_insumo == e
    )[0];
    this.stockActual = objInsumo.cantidad;
    const note = document.getElementById("stock");
    if (objInsumo.cantidad <= 0) {
      note.style.backgroundColor = "#d43f3a";
      note.style.color = "white";
      this._msg.formateoMensaje(
        "modal_warning",
        "Artículo sin existencias en almacenes",
        6
      );
      return true;
    } else {
      note.style.removeProperty("background-Color");
      note.style.removeProperty("color");
    }
    if (this.dts_detalle.filter((el) => el.fid_insumo == e).length > 0)
      return true;
    console.log("sol insum", e, this.dts_insumos);
    const nuevaSolicitud = {
      id_solicitud_detalle: 0,
      fid_insumo: e,
      fid_solicitud: this.elIdSolicitud || 0,
      cantidad: 1,
      cantidad_entregada: 1,
      codigo: objInsumo.codigo,
      codigo_pasado: objInsumo.codigo_pasado,
      descripcion: objInsumo.descripcion,
      unidad: objInsumo.unidad,
      stock: objInsumo.cantidad,
    };
    this.dts_detalle.push(nuevaSolicitud);
    console.log("solicitnado insumo", this.dts_detalle);
    this.habilitarRegistro = true;
    // this.dts_insumos = this.dts_insumos.filter(el => el.id_insumo != e)
    // setTimeout(() => {
    //   if(this.dts_insumos.includes(2)) {

    //   }
    //   this.idRol == 2 && this.solicitudEditar? $('.cuser').prop('disabled',true): $('.cadmin').prop('disabled',true);//prod
    // }, 200);
  }

  async registrarSolicitud() {
    console.log("registrar sol y detalle");
    const respValida = await this.detalleExcede();
    if (
      !this.solicitud.observacion &&
      (this.solicitud.estado == "" || this.solicitud.estado == "SOLICITADO")
    ) {
      this._msg.formateoMensaje(
        "modal_warning",
        "Debe ingresar Observacion / Justificación.",
        6
      );
      return true;
    }
    if (
      this.dts_detalle.length <= 0 &&
      (this.solicitud.estado == "" || this.solicitud.estado == "SOLICITADO")
    ) {
      this._msg.formateoMensaje(
        "modal_warning",
        "Debe cargar como mínimo un artículo.",
        6
      );
      return true;
    }
    if (respValida.length > 0) {
      this._msg.formateoMensaje("modal_warning", respValida, 10);
      return true;
    }
    if (
      this.dts_detalle.length <= this.editados.filter((el) => el < 0).length &&
      (this.solicitud.estado == "" || this.solicitud.estado == "SOLICITADO")
    ) {
      this._msg.formateoMensaje(
        "modal_warning",
        "La solicitud debe contener como mínimo un artículo",
        10
      );
      return true;
    }
    console.log(
      "ultima bonk",
      this.dts_detalle.length,
      this.editados.filter((el) => el < 0).length
    );

    this.cargando = true;
    let ope = "I";
    if (this.elIdSolicitud > 0) ope = "U";
    if (!this.solicitud.fechaEntrega.startsWith("20"))
      this.solicitud.fechaEntrega = null;
    const laSolicitud = {
      operacion: ope,
      idSolicitud: this.elIdSolicitud || 0,
      usuarioAdmin: this.solicitud.usuarioAdmin || this.idAdmin,
      estado: this.solicitud.estado || "INICIADO",
      fechaEntrega: this.solicitud.fechaEntrega || null,
      numeroSolicitud: this.solicitud.numeroSolicitud,
      incremento: this.solicitud.incremento || "",
      observacion: (this.solicitud.observacion || "").toUpperCase(),
      usuarioRegistro: this.idUsuario,
      unidad: this.area,
    };
    console.log("la solicitud", laSolicitud);

    this._almacen.crudSolicitud(laSolicitud).subscribe(
      (result: any) => {
        console.log("inseto la solciitud", result);
        if (Array.isArray(result) && result.length > 0) {
          if (result[0].message && !result[0].message.startsWith("ERROR")) {
            if (
              laSolicitud.estado == "INICIADO" ||
              laSolicitud.estado == "CONFIRMADO"
            ) {
              console.log("regs los detalles", this.dts_detalle, this.editados);

              const ID = result[0].message.split("-")[1];
              this.dts_detalle.forEach((element, index) => {
                console.log("iteracion", index, element);
                const obj = {
                  idSolicitudDetalle: element.id_solicitud_detalle || 0,
                  fidInsumo: element.fid_insumo,
                  fidSolicitud: ID || this.solicitud.idSolicitud,
                  cantidad: element.cantidad,
                  cantidadEntregada: element.cantidad_entregada,
                  operacion: "I",
                };
                if (!element.id_solicitud_detalle) {
                  this.registrarDetalle(obj);
                }
                if (
                  element.id_solicitud_detalle &&
                  this.editados.includes(element.id_solicitud_detalle)
                ) {
                  obj.operacion = "U";
                  this.registrarDetalle(obj);
                }
                if (
                  element.id_solicitud_detalle &&
                  this.editados.includes(-element.id_solicitud_detalle)
                ) {
                  obj.operacion = "DF";
                  this.registrarDetalle(obj);
                }
                // this.registrarDetalle(obj);
                if (index == this.dts_detalle.length - 1) {
                  this._msg.formateoMensaje(
                    "modal_success",
                    "Solicitud registrada con éxito!!!",
                    6
                  );
                  this.reiniciar();
                  $("#modalSolicitud").modal("hide");
                  this.cargarSolicitudes();
                }
              });
              if (this.dts_detalle.length == 0) this.cargando = false;
              this.cargarSolicitudes();
            } else {
              this._msg.formateoMensaje(
                "modal_success",
                `Solicitud ${laSolicitud.estado.replace("O", "A")}`,
                6
              );
              this.cargarSolicitudes();
              this.cargando = false;
              if ((laSolicitud.estado = "ENTREGADO"))
                this.reporteSolicitud(this.elIdSolicitud);
            }
          } else {
            this._msg.formateoMensaje(
              "modal_danger",
              "Error: " + result[0].message,
              6
            );
            this.cargando = false;
          }
        } else {
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: Error al registrar la revisión",
            6
          );
          this.cargando = false;
        }
      },
      (error) => {
        this.cargando = false;
        this.errorMessage = <any>error;
        if (this.errorMessage != null)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage,
            10
          );
      }
    );
  }

  registrarDetalle(detalle: any, directo?: boolean) {
    console.log("registrar el detalle");
    this._almacen.crudSolicitudDetalle(detalle).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          if (result[0].message && !result[0].message.startsWith("ERROR")) {
            console.log("detalle reg ok");
          } else {
            console.log("detalle reg bad");
          }
        } else {
          console.log("detalle reg bad", result);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage,
            10
          );
      }
    );
  }

  detalleExcede(): string {
    let verificacion = "";
    this.dts_detalle.forEach((el) => {
      console.log("revisando cada detalle", el);
      if (/*el.cantidad>el.stock ||*/ el.cantidad_entregada > el.stock)
        verificacion = `Cantidad de: ${el.codigo}-${el.descripcion} no debe ser mayor a ${el.stock}`;
    });
    console.log("la verify", verificacion);
    return verificacion;
  }

  marcar(fila, id, tipo) {
    console.log("marcando", fila, id, tipo);
    if (id > 0) {
      const cantidad = (<HTMLInputElement>document.getElementById("cant" + id))
        .value;
      const cantidad2 = (<HTMLInputElement>document.getElementById("ent" + id))
        .value;
      console.log(cantidad, cantidad2);
      this.dts_detalle = this.dts_detalle.map((el) => {
        if (el.fid_insumo == fila.fid_insumo) {
          el.cantidad = cantidad;
          //no cargar al momento de solicitar ya que la registrar va contar como stock pedido
          tipo == "S"
            ? (el.cantidad_entregada = cantidad)
            : (el.cantidad_entregada = cantidad2);
          // el.cantidad_entregada = cantidad2;
        }
        return el;
      });
      if (!this.editados.includes(fila.id_solicitud_detalle))
        this.editados.push(fila.id_solicitud_detalle);
    } else {
      // this.dts_detalle = this.dts_detalle.filter(el => el.fid_insumo != Math.abs(id));
      if (fila.id_solicitud_detalle == 0) {
        this.dts_detalle = this.dts_detalle.filter(
          (el) => el.fid_insumo != Math.abs(id)
        );
      } else {
        if (!this.editados.includes(fila.id_solicitud_detalle))
          this.editados.push(-fila.id_solicitud_detalle);
      }
    }
    this.habilitarRegistro = true;
    console.log("editados", this.editados);
  }

  reporteSolicitud(idSol: number) {
    this.cargando = true;
    console.log("generando reporte", idSol);
    this.cargarDetalle(idSol);
    const sol = this.dts_solicitudes.filter(
      (el) => el.id_solicitud == idSol
    )[0];
    setTimeout(() => {
      const elReporte = {
        tipoReporte: "02",
        numeroSolicitud: sol.numero_solicitud,
        entregadoPor: sol.user_adm || this.nomAdmin,
        solicitadoPor: sol.user_reg,
        fechaSolicitud: moment(sol.fecha_registro).format(
          "DD/MM/YYYY HH:mm:ss"
        ),
        fechaEntrega: moment(sol.fecha_entrega).format("DD/MM/YYYY HH:mm:ss"),
        area: sol.unidad,
        gestion: this.gestion,
        grilla: this.dts_detalle.map((el, i) => {
          el.fila = i + 1;
          return el;
        }),
      };
      // console.log('data lista',elReporte);
      this.generarReporte(elReporte);
    }, 300);
  }

  generarReporte(reporte: any) {
    this.cargando = true;
    this._almacen.reportesAlmacences(reporte).subscribe(
      (result: any) => {
        console.log('rev rep',result);
        // const url = window.URL.createObjectURL(new Blob([result._body]));
        const url = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `SolicitudMateriales_${reporte.numeroSolicitud}.pdf`
        );
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        this.cargando = false;
      },
      (error) => {
        this.cargando = false;
        this.errorMessage = <any>error;
        if (this.errorMessage != null)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage,
            10
          );
      }
    );
  }

  reiniciar() {
    this.cargarInsumos();
    this.cargando = false;
    this.editados = [];
    this.habilitarRegistro = false;
    this.solicitudEditar = false;
    this.dts_detalle = [];
    this.solicitud.fechaEntrega = "";
    this.solicitud.observacion = "";
    this.solicitud.usuarioAdmin = 0;
    this.solicitud.estado = "";
    this.solicitud.incremento = "";
    this.solicitud.idSolicitud = 0;
    this.solicitud.numeroSolicitud = this.maxSolicitud + 1;
    this.elIdSolicitud = 0;
    $("#todo :input").prop("disabled", false);
  }

  habilitar() {
    this.habilitarRegistro = true;
  }

  cambiarEstado(solicitud: any, tipo: string) {
    swal2({
      title: "Advertencia!!!",
      text: `Realmente desea cambiar el estado de la solicitud a: ${tipo}?`,
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d9534f",
      cancelButtonColor: "#f0ad4e",
      customClass: "swal2-popup",
      confirmButtonText: "Confirmar!",
    }).then((result) => {
      if (result.value) {
        this.elIdSolicitud = solicitud.id_solicitud;
        if (tipo == "ENTREGADO")
          solicitud.fecha_entrega = moment().format("YYYY-MM-DD HH:mm:ss");
        this.solicitud = {
          numeroSolicitud: solicitud.numero_solicitud,
          fechaSolicitud: moment(solicitud.fecha_registro)
            .format("YYYY-MM-DD")
            .toString(),
          fechaEntrega: solicitud.fecha_entrega, //moment(solicitud.fecha_entrega).format("YYYY-MM-DD").toString(),
          observacion: solicitud.observacion,
          usuarioAdmin: solicitud.usuarioAdmin,
          estado: tipo,
          incremento: solicitud.incremento,
          idSolicitud: solicitud.id_solicitud,
          idUsuarioRegistro: solicitud.usuario_registro,
        };
        this.registrarSolicitud();
      } else {
        console.log("cancelo");
      }
    });
  }

  crudDetalle(detalle: any) {}

  cambiarGestion() {
    console.log("cambiando gestion");
    //this.gestion = valor;
    this.cargarSolicitudes();
  }
}
