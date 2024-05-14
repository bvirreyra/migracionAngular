import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import alasql from "alasql";
import * as moment from "moment";
import swal2 from "sweetalert2";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";
import { AlmacenesService } from "../almacenes.service";

declare var $: any;

@Component({
  selector: "app-administrador",
  templateUrl: "./administrador.component.html",
  styleUrls: ["./administrador.component.css"],
})
export class AdministradorComponent implements OnInit {
  //variables para el compononete de mensajes
  public prop_msg: string;
  public prop_tipomsg: string;
  public errorMessage: string;
  public cargando: boolean = false;

  public pnlPartida: boolean = false;
  public pnlInsumo: boolean = false;
  public pnlIngreso: boolean = false;
  public pnlIngresoDetalle: boolean = false;
  public pnlProveedor: boolean = false;
  public pnlInicial: boolean = true;
  public pnlKardexInsumo: boolean = false;
  public pnlReportes: boolean = false;

  public dts_partidas: any;
  public dts_insumos: any;
  public dts_ingresos: any;
  public dts_ingresosDetalle: any;
  public dts_proveedores: any;
  public idUsuario: number = 0;
  public elIdPartida: number = 0;
  public elIdInsumo: number = 0;
  public elIdIngreso: number = 0;
  public elIdIngresoDetalle: number = 0;
  public elIdProveedor: number = 0;
  public elNumeroIngreso: number = 0;
  public partidaEditar: boolean = false;
  public insumoEditar: boolean = false;
  public ingresoEditar: boolean = false;
  public ingresoDetalleEditar: boolean = false;
  public proveedorEditar: boolean = false;
  public filtradoInsumos: any;
  public nombreInsumo: string;
  public datosInsumo: {
    descripcion: string;
    codigoAnterior: string;
    unidad: string;
    stock: number;
    minimo: number;
    partida: string;
    fechaIni: string;
    fechaFin: string;
  };

  public fechaDesde: Date;
  public fechaHasta: Date;

  public gestion: number = moment().year();
  public maxIngreso: number = 1;
  public filtro: string = "";

  formPartida: FormGroup;
  formInsumo: FormGroup;
  formIngreso: FormGroup;
  formIngresoDetalle: FormGroup;
  formProveedor: FormGroup;

  public titulos: { central: string; vertical: string; horizontal: string };
  public series: [];
  public listaPeriodos: [];
  public charts = false;
  public chartInsumos: any;
  public chartPartida: any;
  public chartSolicitado: any;
  public seriesInsumos: [];
  public labelsInsumos: [];
  public seriesPartida: [];
  public labelsPartida: [];
  public seriesSolicitado: [];
  public labelsSolicitado: [];
  public dts_kardexInsumo: any;
  public dts_detalleConsulta: any;

  public dts_rolesb: any;
  public fechaMinima: string;
  public elIngresoDesc: string;
  public detalleBloqueado: boolean = false;
  public dts_unidad: any;
  public autor: string;
  public laFechaIngreso: string;
  public resultFV: any;
  public fechaIniFV: string;
  public fechaFinFV: string;

  public maxFecha: string = moment().format("YYYY-MM-DD").toString();
  public minFecha: string = moment()
    .add(-3600, "days")
    .format("YYYY-MM-DD")
    .toString();

  public dts_gestiones: number[] = [];

  public consulta: {
    numeroSolicitud: number;
    fechaSolicitud: string;
    fechaEntrega: string;
    observacion: string;
    usuarioAdmin: number;
    estado: string;
    incremento: string;
    idSolicitud: number;
    idDetalle: number;
  };

  public insumoHistorico: boolean = false;
  public proveedoresFiltrados: any;
  public idProveedorLista: string;

  constructor(
    private _almacen: AlmacenesService,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent,
    private formBuilder: FormBuilder,
    private _autenticacion: AutenticacionService
  ) {
    this.consulta = {
      numeroSolicitud: 1,
      fechaSolicitud: moment().format("YYYY-MM-DD").toString(),
      fechaEntrega: "",
      observacion: "",
      usuarioAdmin: 0,
      estado: "",
      incremento: "",
      idSolicitud: 0,
      idDetalle: 0,
    };

    this.fechaMinima = moment(new Date()).add(-2, "day").format("YYYYMMDD");
    if (moment(new Date()).add(-2, "day").isoWeekday() == 7)
      this.fechaMinima = moment(new Date()).add(-4, "day").format("YYYYMMDD");
    if (moment(new Date()).add(-2, "day").isoWeekday() == 6)
      this.fechaMinima = moment(new Date()).add(-3, "day").format("YYYYMMDD");
  }

  ngOnInit() {
    const datos = JSON.parse(localStorage.getItem("dts_con"));
    for (let i = this.gestion; i > this.gestion - 4; i--) {
      this.dts_gestiones.push(i);
    }
    //console.log(datos);
    this.idUsuario = datos.s_usu_id;
    // this.cargarPartidas();
    // this.cargarInsumos();
    this.formPartida = this.formBuilder.group({
      codigo: ["", Validators.required],
      descripcion: ["", Validators.required],
    });
    this.formInsumo = this.formBuilder.group({
      codigo: ["", Validators.required],
      descripcion: ["", Validators.required],
      unidad: ["", Validators.required],
      cantidad: ["0", Validators.required],
      minimo: ["1", Validators.required],
      codigoPasado: [""],
      // incremento: [''],
      idPartida: ["", Validators.required],
    });
    this.formIngreso = this.formBuilder.group({
      numeroIngreso: [this.maxIngreso, Validators.required],
      fechaIngreso: [
        moment(new Date()).format("YYYY-MM-DD").toString(),
        Validators.required,
      ],
      total: ["", Validators.required],
      numeroEntrega: ["", Validators.required],
      fechaEntrega: ["", Validators.required],
      idProveedor: [""],
      numeroFactura: ["", Validators.required],
      fechaFactura: ["", Validators.required],
      autorizacion: ["", Validators.required],
      c31: ["", Validators.required],
      fechaC31: ["", Validators.required],
      // incremento: [''],
    });
    this.formIngreso
      .get("fechaIngreso")
      .valueChanges.subscribe((selectedValue) => {
        // //console.log('fecha changed')
        if (
          moment(this.laFechaIngreso).format("YYYYMMDD") !=
          moment(selectedValue).format("YYYYMMDD")
        ) {
          //console.log('valor select',selectedValue)
          this.obtenerNumeroIngreso(moment(selectedValue).format("YYYYMMDD"));
        }
      });
    this.formIngresoDetalle = this.formBuilder.group({
      cantidad: ["", Validators.required],
      costoUnidad: ["", Validators.required],
      costoTotal: [""],
      // fecha: [moment(this.laFechaIngreso).format("YYYY-MM-DD").toString()],
      idInsumo: ["", Validators.required],
      existencias: [""],
      unidad: [""],
      codigoPasado: [""],
      filtro: [""],
    });
    this.formProveedor = this.formBuilder.group({
      nombre: ["", Validators.required],
      nit: ["", Validators.required],
      telefono: ["", Validators.required],
      contacto: ["", Validators.required],
    });

    this.datosInsumo = {
      descripcion: "",
      codigoAnterior: "",
      unidad: "",
      stock: 0,
      minimo: 0,
      partida: "",
      fechaIni: "",
      fechaFin: "",
    };
    this.RolesAsignados();
    this.cargarIngresos();
    this.insumosMasComprados();
    this.comprasPorPartidas();
    this.insumosMasSolicitados();
  }

  RolesAsignados() {
    this._autenticacion.rolesasignados(this.idUsuario.toString()).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_rolesb = this._fun
            .RemplazaNullArray(result)
            .map((el) => el.idrol);
          // this.dts_rolesb.includes(72) ? this.idAdmin = this.idUsuario : this.idAdmin = null;
        } else {
          //console.log('error al obtener roles',result);
        }
      },
      (error) => {
        //console.log('error conexion',error);
      }
    );
  }

  cargarCharts(datos: any, tipo: string) {
    if (tipo == "ingresos") {
      // this.titulos.central='Historico de Ingresos en la Gestiión: '+this.gestion;
      // this.titulos.horizontal = 'Fechas Ingresos';
      // this.titulos.vertical = 'Monto Bs.';
      datos.sort((a, b) => Number(a.numero_ingreso) - Number(b.numero_ingreso));
      //console.log('barras bonk',datos);
      this.listaPeriodos = datos.map((el) =>
        moment(el.fecha_entrega).format("L")
      );
      const total = datos.map((el) => el.total);
      const serie1 = { name: "Monto", data: total };
      // const montosDescuento = datos.map(el => el.total_descuento);
      // const serie2 = { name: 'Descuento', data: montosDescuento };
      const truco = [] as any;
      truco.push(serie1);
      // truco.push(serie2);
      this.series = truco;
      // const probando = { central: 'Historial Planillas', vertical: 'Montos', horizontal: 'Planillas' };
      this.titulos = {
        central: "Histórico de Ingresos en la Gestión: " + this.gestion,
        vertical: "Monto Bs.",
        horizontal: "Fechas Ingresos",
      };
    }
    if (tipo == "insumos") {
      this.seriesInsumos = datos.map((el) => Number(el.costo));
      this.labelsInsumos = datos.map((el) => el.descripcion);
    }
    if (tipo == "partidas") {
      this.seriesPartida = datos.map((el) => Number(el.costo));
      this.labelsPartida = datos.map((el) => el.descripcion);
    }
    if (tipo == "solicitado") {
      this.seriesSolicitado = datos.map((el) => Number(el.cantidad));
      this.labelsSolicitado = datos.map((el) => el.descripcion);
    }
    setTimeout(() => {
      if (this.charts == false) this.charts = true;
    }, 400);
  }

  insumosMasComprados() {
    this._almacen.chartInsumosMasComprados(this.gestion).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.chartInsumos = this._fun.RemplazaNullArray(result);
          this.cargarCharts(this.chartInsumos, "insumos");
        } else {
          //console.log('no se recupera registro InsumosMasComprados');
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
  comprasPorPartidas() {
    this._almacen.chartPorPartida(this.gestion).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.chartPartida = this._fun.RemplazaNullArray(result);
          this.cargarCharts(this.chartPartida, "partidas");
        } else {
          //console.log('no se recupera registro comprasPorPartidas');
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
  insumosMasSolicitados() {
    this._almacen.chartInsumosMasSolicitados(this.gestion).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.chartSolicitado = this._fun.RemplazaNullArray(result);
          this.cargarCharts(this.chartSolicitado, "solicitado");
        } else {
          //console.log('no se recupera registro insumosMasSolicitados');
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

  paneles(tipo: string, ingreso?: any) {
    this.pnlIngresoDetalle = false;
    //Array.from(document.getElementsByClassName("btn-info")).forEach(el => el.className = "btn btn-primary");//esto cambia la casle de todos los el con cale inicio
    if (tipo == "partidas") {
      const el = document.getElementById("par");
      // el.classList.add('btn-info');
      // el.className ='btn btn-info';
      this.pnlPartida = !this.pnlPartida;
      el.classList.toggle("btn-info");
      if (!this.dts_partidas) this.cargarPartidas();
      if (this.pnlPartida) this.estilarTabla(".dt-partida");
    }
    if (tipo == "insumos") {
      const el = document.getElementById("ins");
      this.pnlInsumo = !this.pnlInsumo;
      el.classList.toggle("btn-info");
      if (!this.dts_insumos) this.cargarInsumos();
      if (!this.dts_partidas) this.cargarPartidas(); //por lo del clasificador
      this.pnlInsumo
        ? this.estilarTabla(".dt-insumo")
        : (this.pnlKardexInsumo = false);
    }
    if (tipo == "ingresos") {
      const el = document.getElementById("ing");
      this.pnlIngreso = !this.pnlIngreso;
      el.classList.toggle("btn-info");
      if (!this.dts_ingresos) this.cargarIngresos();
      if (!this.dts_proveedores) this.cargarProveedores(); //por lo del clasificador
      if (this.pnlIngreso) this.estilarTabla(".dt-ingreso");
    }
    if (tipo == "proveedores") {
      const el = document.getElementById("pro");
      this.pnlProveedor = !this.pnlProveedor;
      el.classList.toggle("btn-info");
      if (!this.dts_proveedores) this.cargarProveedores();
      if (this.pnlProveedor) this.estilarTabla(".dt-proveedor");
    }
    if (tipo == "ingresosDetalle") {
      this.elIdIngreso = ingreso.id_ingreso;
      this.elNumeroIngreso = ingreso.numero_ingreso;
      this.elIngresoDesc = `${Number(ingreso.numero_ingreso)} de fecha ${moment(
        ingreso.fecha_ingreso
      )
        .format("DD-MM-YYYY")
        .toString()}`;
      this.laFechaIngreso = ingreso.fecha_ingreso;
      this.pnlIngresoDetalle = true;
      this.pnlIngreso = false;
      this.detalleBloqueado = ingreso.pasado;
      if (!this.dts_insumos) this.cargarInsumos();
      this.cargarIngresosDetalle(this.elIdIngreso);
      document.getElementById("ing").classList.remove("btn-info");
      if (this.pnlIngresoDetalle) this.estilarTabla(".dt-detalle");
    }
    if (tipo == "kardexInsumo") {
      this.elIdInsumo = ingreso.id_insumo;
      this.elNumeroIngreso = ingreso.numero_ingreso;
      this.pnlKardexInsumo = true;
      // this.pnlIngreso = false;
      this.nombreInsumo = ingreso.descripcion;
      if (!this.dts_partidas) this.cargarPartidas();
      this.cargarKardexInsumo(ingreso);
      // document.getElementById('ing').classList.remove('btn-info');
      if (this.pnlKardexInsumo) this.estilarTabla(".dt-kardex");
    }
    if (tipo == "reportes") {
      const el = document.getElementById("rep");
      this.pnlReportes = !this.pnlReportes;
      el.classList.toggle("btn-info");
      // this.pnlInsumo ? this.estilarTabla('.dt-insumo'): this.pnlKardexInsumo = false;
    }
  }

  cargarPartidas() {
    this.cargando = true;
    this._almacen.partidas().subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_partidas = this._fun.RemplazaNullArray(result);
          this.estilarTabla(".dt-partida");
        } else {
          this._msg.formateoMensaje(
            "modal_warning",
            "No existen partidas registradas",
            6
          );
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
  cargarInsumos() {
    this.cargando = true;
    this._almacen.insumos().subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_insumos = this._fun.RemplazaNullArray(result);
          this.dts_unidad = alasql(
            `SELECT distinct unidad FROM ? order by unidad`,
            [this.dts_insumos]
          );
          this.estilarTabla(".dt-insumo");
        } else {
          this._msg.formateoMensaje(
            "modal_warning",
            "No existen insumos registradas",
            6
          );
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
  nuevoElemento(opcion: string) {
    //console.log('nuevo elemetno',opcion);
    if (this.insumoHistorico) return true;
    const nuevo = prompt("Agregar Tipo Unidad", "Nuevo Elemento");
    if (nuevo) {
      if (opcion == "unidad")
        this.dts_unidad.push({ unidad: nuevo.toUpperCase() });
    }
  }
  cargarProveedores() {
    this.cargando = true;
    this._almacen.proveedores().subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_proveedores = this._fun.RemplazaNullArray(result);
          this.estilarTabla(".dt-proveedor");
        } else {
          this._msg.formateoMensaje(
            "modal_warning",
            " No existen proveedores registrados",
            6
          );
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
  cargarIngresos() {
    this.cargando = true;
    this._almacen.ingresos().subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_ingresos = this._fun
            .RemplazaNullArray(result)
            .filter((el) => moment(el.fecha_registro).year() == this.gestion)
            .sort((a, b) => b.numero_ingreso - a.numero_ingreso);
          this.maxIngreso = this.dts_ingresos.reduce(
            (ac, el) =>
              ac > Number(el.numero_ingreso) ? ac : Number(el.numero_ingreso),
            0
          );
          this.dts_ingresos.map((el) =>
            (el.pasado =
              moment(el.fecha_registro).format("YYYYMMDD") < this.fechaMinima &&
              !el.fecha_modificado) ||
            (el.pasado =
              moment(el.fecha_modificado).format("YYYYMMDD") <
                this.fechaMinima && el.fecha_modificado)
              ? true
              : false
          );
          //console.log('desp map',this.dts_ingresos,this.fechaMinima);
          this.estilarTabla(".dt-ingreso");
          this.cargarCharts(this.dts_ingresos, "ingresos");
        } else {
          this._msg.formateoMensaje(
            "modal_warning",
            "No existen partidas registradas",
            6
          );
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

  ingresoPasado(): boolean {
    const valor = moment(this.dts_ingresos[0].fecha_registro).format(
      "YYYYMMDD"
    );
    const ver = valor < this.fechaMinima ? true : false;
    //console.log('probando',valor,this.fechaMinima,ver);
    return ver;
  }

  cargarIngresosDetalle(idIngre: number) {
    this.cargando = true;
    this._almacen.ingresosDetalle(idIngre).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_ingresosDetalle = this._fun.RemplazaNullArray(result);
          this.estilarTabla(".dt-detalle");
          this.autor = `realizado por: ${this.dts_ingresosDetalle[0].user_reg}`;
        } else {
          this._msg.formateoMensaje(
            "modal_warning",
            "No existen artículos para este ingreso",
            6
          );
          this.dts_ingresosDetalle = [];
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

  crudPartida(partida, operacion) {
    if (operacion == "editar") {
      this.partidaEditar = true;
      this.elIdPartida = partida.id_partida;
      //console.log('editando',partida);
      $("#modalPartida").modal("show");
      this.formPartida.setValue({
        codigo: partida.codigo,
        descripcion: partida.descripcion,
      });
    }
    if (operacion == "eliminar") {
      swal2({
        title: "Advertencia!!!",
        text: `Realmente desea eliminar la Partida?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d9534f",
        cancelButtonColor: "#f0ad4e",
        customClass: "swal2-popup",
        confirmButtonText: "Confirmar!",
      }).then((result) => {
        if (result.value) {
          this.registrarPartida(partida.id_partida);
        } else {
          //console.log('cancelo');
        }
      });
    }
  }

  crudInsumo(insumo, operacion) {
    if (operacion == "editar") {
      this.insumoEditar = true;
      this.elIdInsumo = insumo.id_insumo;
      //console.log('editando',insumo);
      //esto para ver si el insumo ya tiene movimientos y no editar varios campos
      this.cargarKardexInsumo();
      $("#modalInsumo").modal("show");
      this.formInsumo.setValue({
        codigo: insumo.codigo,
        descripcion: insumo.descripcion,
        unidad: insumo.unidad,
        cantidad: insumo.cantidad,
        minimo: insumo.minimo,
        codigoPasado: insumo.codigo_pasado,
        // incremento: insumo.incremento,
        idPartida: insumo.fid_partida,
      });
    }
    if (operacion == "eliminar") {
      swal2({
        title: "Advertencia!!!",
        text: `Realmente desea eliminar el Insumo?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d9534f",
        cancelButtonColor: "#f0ad4e",
        customClass: "swal2-popup",
        confirmButtonText: "Confirmar!",
      }).then((result) => {
        if (result.value) {
          this.registrarInsumo(insumo.id_insumo);
        } else {
          //console.log('cancelo');
        }
      });
    }
  }

  crudIngreso(ingreso, operacion) {
    if (operacion == "editar") {
      this.ingresoEditar = true;
      this.elIdIngreso = ingreso.id_ingreso;
      //console.log('editando',ingreso);
      this.laFechaIngreso = ingreso.fecha_ingreso;
      $("#modalIngreso").modal("show");
      this.formIngreso.setValue({
        numeroIngreso: ingreso.numero_ingreso,
        fechaIngreso: moment(ingreso.fecha_ingreso)
          .format("YYYY-MM-DD")
          .toString(),
        total: ingreso.total,
        numeroEntrega: ingreso.numero_entrega,
        fechaEntrega: moment(ingreso.fecha_entrega)
          .format("YYYY-MM-DD")
          .toString(),
        idProveedor: ingreso.fid_proveedor,
        numeroFactura: ingreso.numero_factura,
        fechaFactura: moment(ingreso.fecha_factura)
          .format("YYYY-MM-DD")
          .toString(),
        autorizacion: ingreso.autorizacion_factura,
        c31: ingreso.c31,
        fechaC31: moment(ingreso.c31_fecha).format("YYYY-MM-DD").toString(),
        // incremento: ingreso.incremento_alfabetico,
      });
    }
    if (operacion == "eliminar") {
      swal2({
        title: "Advertencia!!!",
        text: `Realmente desea eliminar el Ingreso?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d9534f",
        cancelButtonColor: "#f0ad4e",
        customClass: "swal2-popup",
        confirmButtonText: "Confirmar!",
      }).then((result) => {
        if (result.value) {
          this.registrarIngreso(ingreso.id_ingreso);
        } else {
          //console.log('cancelo');
        }
      });
    }
  }
  crudIngresoDetalle(ingresoDetalle, operacion) {
    //console.log('en el crud',this.elIdIngreso);
    if (operacion == "editar") {
      this.ingresoDetalleEditar = true;
      this.elIdIngresoDetalle = ingresoDetalle.id_ingreso_detalle;
      //console.log('editando',ingresoDetalle);
      $("#modalIngresoDetalle").modal("show");
      this.formIngresoDetalle.setValue({
        cantidad: ingresoDetalle.cantidad,
        costoUnidad: ingresoDetalle.costo_unidad,
        costoTotal: ingresoDetalle.costo_total,
        // fecha: moment(this.laFechaIngreso).format("YYYY-MM-DD").toString(),
        idInsumo: ingresoDetalle.fid_insumo,
        existencias: ingresoDetalle.existencias,
        unidad: ingresoDetalle.unidad,
        codigoPasado: ingresoDetalle.codigo_pasado,
        filtro: "",
      });
    }
    if (operacion == "eliminar") {
      swal2({
        title: "Advertencia!!!",
        text: `Realmente desea eliminar el Artículo?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d9534f",
        cancelButtonColor: "#f0ad4e",
        customClass: "swal2-popup",
        confirmButtonText: "Confirmar!",
      }).then((result) => {
        if (result.value) {
          this.registrarIngresoDetalle(ingresoDetalle.id_ingreso_detalle);
        } else {
          //console.log('cancelo');
        }
      });
    }
  }
  crudProveedor(proveedor, operacion) {
    if (operacion == "editar") {
      this.proveedorEditar = true;
      this.elIdProveedor = proveedor.id_proveedor;
      //console.log('editando',proveedor);
      $("#modalProveedor").modal("show");
      this.formProveedor.setValue({
        nombre: proveedor.nombre,
        nit: proveedor.nit,
        telefono: proveedor.telefono,
        contacto: proveedor.contacto,
      });
    }
    if (operacion == "eliminar") {
      swal2({
        title: "Advertencia!!!",
        text: `Realmente desea eliminar el Artículo?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d9534f",
        cancelButtonColor: "#f0ad4e",
        customClass: "swal2-popup",
        confirmButtonText: "Confirmar!",
      }).then((result) => {
        if (result.value) {
          this.registrarProveedor(proveedor.id_proveedor);
        } else {
          //console.log('cancelo');
        }
      });
    }
  }

  registrarPartida(idPartida?: number) {
    this.cargando = true;
    let ope = "I";
    if (idPartida) {
      ope = "D";
      this.elIdPartida = idPartida;
    }
    if (this.partidaEditar) ope = "U";
    const laPartida = {
      operacion: ope,
      idPartida: this.elIdPartida,
      codigo: this.formPartida.value.codigo || "",
      descripcion: (this.formPartida.value.descripcion || "").toUpperCase(),
      usuarioRegistro: this.idUsuario,
    };

    //console.log('la partida',laPartida);

    this._almacen.crudPartida(laPartida).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          //console.log('el result',result);

          if (result[0].message && !result[0].message.startsWith("ERROR")) {
            if (ope != "D") {
              this._msg.formateoMensaje(
                "modal_success",
                "Partida registrada con éxito!!!",
                6
              );
              this.formPartida.reset();
              this.partidaEditar = false;
              $("#modalPartida").modal("hide");
            }
            this.cargarPartidas();
          } else {
            this._msg.formateoMensaje(
              "modal_warning",
              "Alerta: " + result[0].message,
              6
            );
          }
        } else {
          this._msg.formateoMensaje(
            "modal_danger",
            "Error al registrar la Partida",
            6
          );
        }
        this.cargando = false;
        this.partidaEditar = false;
        $("#modalPartida").modal("hide");
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

  registrarInsumo(idInsumo?: number) {
    this.cargando = true;
    let ope = "I";
    if (idInsumo) {
      ope = "D";
      this.elIdInsumo = idInsumo;
    }
    if (this.insumoEditar) ope = "U";
    const elInsumo = {
      operacion: ope,
      idInsumo: this.elIdInsumo,
      codigo: this.formInsumo.value.codigo || "",
      descripcion: (this.formInsumo.value.descripcion || "").toUpperCase(),
      unidad: (this.formInsumo.value.unidad || "").toUpperCase(),
      cantidad: this.formInsumo.value.cantidad || 0,
      minimo: this.formInsumo.value.minimo || 0,
      codigoPasado: (this.formInsumo.value.codigoPasado || "").toUpperCase(),
      incremento: 0, //this.formInsumo.value.incremento || 0,
      fidPartida: this.formInsumo.value.idPartida || 0,
      usuarioRegistro: this.idUsuario,
    };

    //console.log('el insumo',elInsumo);

    this._almacen.crudInsumo(elInsumo).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          //console.log('el result',result);

          if (result[0].message && !result[0].message.startsWith("ERROR")) {
            if (ope != "D") {
              this._msg.formateoMensaje(
                "modal_success",
                "Insumo registrado con éxito!!!",
                6
              );
              this.formInsumo.reset();
              this.insumoEditar = false;
              $("#modalInsumo").modal("hide");
            }
            this.cargarInsumos();
          } else {
            this._msg.formateoMensaje(
              "modal_warning",
              "Alerta: " + result[0].message,
              6
            );
          }
        } else {
          this._msg.formateoMensaje(
            "modal_danger",
            "Error al registrar el insumo",
            6
          );
        }
        this.cargando = false;
        this.insumoEditar = false;
        $("#modalInsumo").modal("hide");
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

  registrarIngreso(idIngreso?: number) {
    this.cargando = true;
    let ope = "I";
    if (idIngreso) {
      ope = "D";
      this.elIdIngreso = idIngreso;
    }
    if (this.ingresoEditar) ope = "U";
    const elIngreso = {
      operacion: ope,
      idIngreso: this.elIdIngreso,
      numeroIngreso: this.formIngreso.value.numeroIngreso || 0,
      fechaIngreso: this.formIngreso.value.fechaIngreso || null,
      total: this.formIngreso.value.total || 0,
      numeroEntrega: (this.formIngreso.value.numeroEntrega || "").toUpperCase(),
      fechaEntrega: this.formIngreso.value.fechaEntrega || null,
      idProveedor: this.elIdProveedor || null, //this.formIngreso.value.idProveedor || null,
      numeroFactura: this.formIngreso.value.numeroFactura || 0,
      fechaFactura: this.formIngreso.value.fechaFactura || null,
      autorizacion: this.formIngreso.value.autorizacion || 0,
      c31: (this.formIngreso.value.c31 || "").toUpperCase(),
      fechaC31: this.formIngreso.value.fechaC31 || null,
      incremento: 0, //this.formIngreso.value.incremento || 0,
      usuarioRegistro: this.idUsuario,
    };

    //console.log('el ingreso',elIngreso);

    this._almacen.crudIngreso(elIngreso).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          if (result[0].message && !result[0].message.startsWith("ERROR")) {
            if (ope != "D") {
              this._msg.formateoMensaje(
                "modal_success",
                "Ingreso registrado con éxito!!!",
                6
              );
              this.formIngreso.reset();
              this.ingresoEditar = false;
              $("#modalIngreso").modal("hide");
            }
            this.cargarIngresos();
          } else {
            this._msg.formateoMensaje(
              "modal_warning",
              "Alerta: " + result[0].message,
              6
            );
          }
        } else {
          this._msg.formateoMensaje(
            "modal_danger",
            "Error al registrar el ingreso",
            6
          );
        }
        this.cargando = false;
        this.ingresoEditar = false;
        $("#modalIngreso").modal("hide");
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

  registrarIngresoDetalle(idIngresoDetalle?: number) {
    //console.log('en el registrar',this.elIdIngreso);
    this.cargando = true;
    let ope = "I";
    if (idIngresoDetalle) {
      ope = "DF";
      this.elIdIngresoDetalle = idIngresoDetalle;
    }
    if (this.ingresoDetalleEditar) ope = "U";
    const elIngresoDetalle = {
      operacion: ope,
      idIngresoDetalle: this.elIdIngresoDetalle,
      cantidad: this.formIngresoDetalle.value.cantidad || 0,
      costoUnidad: this.formIngresoDetalle.value.costoUnidad || 0,
      costoTotal:
        this.formIngresoDetalle.value.costoUnidad *
          this.formIngresoDetalle.value.cantidad || 0,
      fecha: this.laFechaIngreso || null,
      fidInsumo: this.formIngresoDetalle.value.idInsumo || null,
      existencias: this.formIngresoDetalle.value.existencias || 0,
      fidIngreso: this.elIdIngreso || null,
      usuarioRegistro: this.idUsuario,
    };

    //console.log('el ingresoDetalle',elIngresoDetalle);

    this._almacen.crudIngresoDetalle(elIngresoDetalle).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          //console.log('el result',result);

          if (result[0].message && !result[0].message.startsWith("ERROR")) {
            if (ope != "D") {
              this._msg.formateoMensaje(
                "modal_success",
                "Artículo registrado con éxito!!!",
                6
              );
              this.formIngresoDetalle.reset();
              this.ingresoDetalleEditar = false;
              $("#modalIngresoDetalle").modal("hide");
            }
            this.cargarIngresosDetalle(this.elIdIngreso);
            this.cargarInsumos();
          } else {
            this._msg.formateoMensaje(
              "modal_warning",
              "Alerta: " + result[0].message,
              6
            );
          }
        } else {
          this._msg.formateoMensaje(
            "modal_danger",
            " Error al registrar el ingreso",
            6
          );
        }
        this.cargando = false;
        this.ingresoEditar = false;
        $("#modalIngresoDetalle").modal("hide");
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

  registrarProveedor(idPorveedor?: number) {
    this.cargando = true;
    let ope = "I";
    if (idPorveedor) {
      ope = "D";
      this.elIdProveedor = idPorveedor;
    }
    if (this.proveedorEditar) ope = "U";
    const elProveedor = {
      operacion: ope,
      idProveedor: this.elIdProveedor,
      nombre: (this.formProveedor.value.nombre || "").toUpperCase(),
      nit: this.formProveedor.value.nit || "",
      telefono: (this.formProveedor.value.telefono || "").toUpperCase(),
      contacto: (this.formProveedor.value.contacto || "").toUpperCase(),
      usuarioRegistro: this.idUsuario,
    };

    //console.log('el proveedor',elProveedor);

    this._almacen.crudProveedor(elProveedor).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          if (result[0].message && !result[0].message.startsWith("ERROR")) {
            if (ope != "D") {
              this._msg.formateoMensaje(
                "modal_success",
                "Proveedor registrada con éxito!!!",
                6
              );
              this.formProveedor.reset();
              this.proveedorEditar = false;
              $("#modalProveedor").modal("hide");
            }
            this.cargarProveedores();
          } else {
            this._msg.formateoMensaje(
              "modal_warning",
              "Alerta: " + result[0].message,
              6
            );
          }
        } else {
          this._msg.formateoMensaje(
            "modal_danger",
            "Error al registrar el proveedor",
            6
          );
        }
        this.cargando = false;
        this.proveedorEditar = false;
        $("#modalProveedor").modal("hide");
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

  cambioInsumo() {
    const insumo = this.dts_insumos.filter(
      (el) => el.id_insumo == this.formIngresoDetalle.value.idInsumo
    );
    // //console.log('cambiando el insumo',insumo);
    if (insumo[0]) {
      this.formIngresoDetalle.get("unidad").setValue(insumo[0].unidad);
      this.formIngresoDetalle
        .get("codigoPasado")
        .setValue(insumo[0].codigo_pasado);
      this.formIngresoDetalle.get("existencias").setValue(insumo[0].cantidad);
    }
  }

  cambioPartida() {
    //console.log('cambiando partida');

    const partida = this.formInsumo.value.idPartida;
    const maxCodigo = this.dts_insumos
      .filter((el) => el.fid_partida == partida)
      .reduce((ac, el) => (Number(el.codigo) > ac ? Number(el.codigo) : ac), 0);
    //console.log(partida,maxCodigo);

    if (maxCodigo)
      this.formInsumo.get("codigo").setValue(Number(maxCodigo) + 1);
  }

  nuevoRegistro(tipo: string) {
    switch (tipo) {
      case "partida":
        this.formPartida.reset();
        this.partidaEditar = false;
        $("#modalPartida").modal("show");
        break;
      case "insumo":
        this.insumoHistorico = false;
        this.formInsumo.reset();
        this.insumoEditar = false;
        $("#modalInsumo").modal("show");
        this.formInsumo.controls["cantidad"].setValue(0);
        this.formInsumo.controls["minimo"].setValue(1);
        break;
      case "ingreso":
        this.formIngreso.reset;
        this.ingresoEditar = false;
        $("#modalIngreso").modal("show");
        this.formIngreso.controls["numeroIngreso"].setValue(
          this.maxIngreso + 1
        );
        this.formIngreso.controls["fechaIngreso"].setValue(
          moment(new Date()).format("YYYY-MM-DD").toString()
        );
        break;
      case "detalle":
        this.formIngresoDetalle.reset();
        this.ingresoDetalleEditar = false;
        $("#modalIngresoDetalle").modal("show");
        // $.fn.modal.Constructor.prototype.enforceFocus = function() {};//para que no cause error el seaarch en <ng-select2>
        // this.formIngresoDetalle.controls['fecha'].setValue(moment(this.laFechaIngreso).format("YYYY-MM-DD").toString());
        break;
      case "proveedor":
        this.formProveedor.reset();
        this.proveedorEditar = false;
        $("#modalProveedor").modal("show");
        break;
      default:
        break;
    }
  }

  filtrar() {
    this.filtro
      ? (this.filtradoInsumos = this.dts_insumos.filter(
          (el) =>
            el.descripcion.includes(this.filtro.toUpperCase()) ||
            el.codigo.includes(this.filtro.toUpperCase())
        ))
      : (this.filtradoInsumos = this.dts_insumos);
  }

  estilarTabla(claseTabla: string) {
    let orden = [0, "asc"];
    this._fun.limpiatabla(claseTabla);
    setTimeout(() => {
      if (claseTabla == ".dt-ingreso") orden = [0, "desc"];
      let confiTable = this._fun.CONFIGURACION_TABLA_V6(
        [50, 100, 150, 200],
        false,
        10,
        orden
      );
      if (!$.fn.dataTable.isDataTable(claseTabla)) {
        var table = $(claseTabla).DataTable(confiTable);
        // this._fun.selectTable(table, [1, 2]);
        if (claseTabla == ".dt-partida") this._fun.inputTable(table, [1, 2]);
        if (claseTabla == ".dt-insumo")
          this._fun.inputTable(table, [1, 2, 3, 4, 5]);
        if (claseTabla == ".dt-ingreso")
          this._fun.inputTable(table, [1, 5, 6, 9]);
        if (claseTabla == ".dt-detalle") this._fun.inputTable(table, [1, 2]);
        if (claseTabla == ".dt-proveedor")
          this._fun.inputTable(table, [1, 2, 3, 4]);
        if (claseTabla == ".dt-kardex") this._fun.inputTable(table, [1, 2]);
      }
    }, 200);
  }

  cargarKardexInsumo(insumo?) {
    //necesitamos todos los campos para detallar el insumo como cabecera de la grilla de movimiento posterior
    this.cargando = true;
    // if(!fechaIni) fechaIni = this.fechaDesde || moment().add(-moment().dayOfYear()+1,'day');
    // if(!fechaFin) fechaFin = this.fechaHasta || moment();
    const elInsumo = {
      idInsumo: this.elIdInsumo,
      fechaIni:
        this.fechaDesde || moment().startOf('year').format('YYYY-MM-DD'),//moment().add(-moment().dayOfYear() + 1, "day"),
      fechaFin: this.fechaHasta || moment().format('YYYY-MM-DD'),//moment(),
    };
    console.log(elInsumo,this.fechaDesde,this.fechaHasta,insumo);

    this._almacen.kardexInsumo(elInsumo).subscribe(
      (result: any) => {
        console.log('el kardex',result);
        if (Array.isArray(result) && result.length > 0) {
          this.acondicionarKardex(this._fun.RemplazaNullArray(result));
          if (insumo) {
            const part = this.dts_partidas.filter(
              (el) => (el.id_partida == insumo.fid_partida)
            )[0];
            this.datosInsumo.descripcion = `${insumo.codigo} - ${insumo.descripcion}`;
            this.datosInsumo.codigoAnterior = insumo.codigoAnterior;
            this.datosInsumo.minimo = insumo.minimo;
            this.datosInsumo.stock = insumo.cantidad;
            this.datosInsumo.unidad = insumo.unidad;
            this.datosInsumo.partida = `${part.codigo} - ${part.descripcion}`;
          }
          this.datosInsumo.fechaIni = moment(elInsumo.fechaIni).format(
            "DD/MM/YY"
          ); //.format("YYYY-MM-DD").toString();
          this.datosInsumo.fechaFin = moment(elInsumo.fechaFin).format(
            "DD/MM/YY"
          ); //.format("YYYY-MM-DD").toString();
          if (!this.dts_rolesb.includes(73)) this.insumoHistorico = true; //el rolSoporte almacenes podria editar todo de cualquier insumos
          console.log("entro a kardex", this.insumoHistorico);
        } else {
          // this._msg.formateoMensaje("modal_danger", "Error al cargar kardex artículo",6);
          console.log("Sin registro para kardex");
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

  acondicionarKardex(data) {
    //console.log('en acondicona',data);
    let acumulado = 0;
    let precioAnterior = 0;
    // const costo = data.filter(el => el.tipo == 'ENTRADA' && el.numero == (data.filter(el => Number(el.costo_unidad)>0)
    //                                                                          .reduce((ac,el)=>Number(el.numero)>ac?Number(el.numero):ac,0)))[0].costo_unidad;

    const nuevo = data.map((el) => {
      acumulado += Number(el.cantidad);
      el.existencias = acumulado;
      if (el.tipo == "ENTRADA") precioAnterior = el.costo_unidad;
      if (el.tipo == "SALIDA") {
        el.costo_unidad = precioAnterior; //costo;
        el.costo_total = Math.abs(Number(precioAnterior) * Number(el.cantidad));
      }
      return el;
    });
    //console.log(nuevo);

    this.dts_kardexInsumo = nuevo;
    this.estilarTabla(".dt-kardex");
  }

  detalleKardex(detalle: any) {
    //console.log(detalle);
    if (detalle.ide == 0) return true;
    if (detalle.tipo == "ENTRADA") {
      this.cargarIngresosDetalle(detalle.idc);
      $("#modalIngresoDetalle").modal("show");
      this.ingresoDetalleEditar = true;
      setTimeout(() => {
        const detIng = this.dts_ingresosDetalle.filter(
          (el) => el.id_ingreso_detalle == detalle.ide
        )[0];

        this.formIngresoDetalle.setValue({
          cantidad: detIng.cantidad,
          costoUnidad: detIng.costo_unidad,
          costoTotal: detIng.costo_total,
          // fecha: moment(detIng.fecha).format("YYYY-MM-DD").toString(),
          idInsumo: detIng.fid_insumo,
          existencias: detalle.existencias,
          unidad: detIng.unidad,
          codigoPasado: detIng.codigo_pasado,
          filtro: "",
        });
        $("#todoIngresoDetalle :input").prop("disabled", true);
        $(".btn-secondary").prop("disabled", false);
      }, 400);
    }
    if (detalle.tipo == "SALIDA")
      this.cargarSolicitud(detalle.idc, detalle.ide);
  }

  cargarSolicitud(id: number, idd: number) {
    //console.log('cargando sol',id);

    this._almacen.solicitudes(this.gestion).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          const laSolicitud = this._fun
            .RemplazaNullArray(result)
            .filter((el) => el.id_solicitud == id)[0];
          this.consulta = {
            numeroSolicitud: laSolicitud.numero_solicitud,
            fechaSolicitud: moment(laSolicitud.fecha_registro)
              .format("YYYY-MM-DD")
              .toString(),
            fechaEntrega: moment(laSolicitud.fecha_entrega)
              .format("YYYY-MM-DD")
              .toString(),
            observacion: laSolicitud.observacion,
            usuarioAdmin: laSolicitud.usuario_admin,
            estado: laSolicitud.estado,
            incremento: laSolicitud.incremento,
            idSolicitud: id,
            idDetalle: idd,
          };
          this.cargarDetalle(id);
        } else {
          //console.log('sin solicitudes');
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

  cargarDetalle(id: number) {
    this._almacen.solicitudesDetalle(id).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_detalleConsulta = this._fun.RemplazaNullArray(result);
          this.autor = ` - realizada por: ${this.dts_detalleConsulta[0].user_reg} aprobado por: ${this.dts_detalleConsulta[0].user_adm}`;
        } else {
          //console.log('sin insumos para la solicitud');
          this.dts_detalleConsulta = [];
        }
        $("#modalSolicitudConsulta").modal("show");
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

  habilitarIngreso(ingreso: any) {
    swal2({
      title: "Advertencia!!!",
      text: `Realmente desea habilitar el Ingreso a Almacenes?`,
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d9534f",
      cancelButtonColor: "#f0ad4e",
      customClass: "swal2-popup",
      confirmButtonText: "Confirmar!",
    }).then((result) => {
      if (result.value) {
        this.ingresoEditar = true;
        this.elIdIngreso = ingreso.id_ingreso;
        this.laFechaIngreso = ingreso.fecha_ingreso;
        this.formIngreso.setValue({
          numeroIngreso: ingreso.numero_ingreso,
          fechaIngreso: moment(ingreso.fecha_ingreso)
            .format("YYYY-MM-DD")
            .toString(),
          total: ingreso.total,
          numeroEntrega: ingreso.numero_entrega,
          fechaEntrega: moment(ingreso.fecha_entrega)
            .format("YYYY-MM-DD")
            .toString(),
          idProveedor: ingreso.fid_proveedor,
          numeroFactura: ingreso.numero_factura,
          fechaFactura: moment(ingreso.fecha_factura)
            .format("YYYY-MM-DD")
            .toString(),
          autorizacion: ingreso.autorizacion_factura,
          c31: ingreso.c31,
          fechaC31: moment(ingreso.c31_fecha).format("YYYY-MM-DD").toString(),
        });
        this.registrarIngreso(this.elIdIngreso);
      } else {
        //console.log('cancelo');
      }
    });
  }

  obtenerNumeroIngreso(fecha) {
    //console.log('obteniendo num ing');
    let numero = 0;
    const fechaMenor = this.dts_ingresos
      .filter((el) => moment(el.fecha_ingreso).format("YYYYMMDD") < fecha)
      .reduce(
        (ac, el) =>
          ac > Number(el.numero_ingreso) ? ac : Number(el.numero_ingreso),
        0
      );
    const mismaFecha = this.dts_ingresos
      .filter((el) => moment(el.fecha_ingreso).format("YYYYMMDD") == fecha)
      .reduce(
        (ac, el) =>
          ac > Number(el.numero_ingreso) ? ac : Number(el.numero_ingreso),
        0
      );
    const fechaMayor = this.dts_ingresos
      .filter((el) => moment(el.fecha_ingreso).format("YYYYMMDD") > fecha)
      .reduce(
        (ac, el) =>
          ac > Number(el.numero_ingreso) ? ac : Number(el.numero_ingreso),
        0
      );
    if (fechaMayor > 0 && mismaFecha > 0) numero = mismaFecha + 0.1;
    if (fechaMayor > 0 && mismaFecha == 0) numero = fechaMenor + 0.1;
    if (fechaMayor == 0) numero = this.maxIngreso + 1;
    //console.log(mismaFecha,fechaMayor,fecha,numero);
    this.formIngreso.get("numeroIngreso").setValue(numero);
  }

  procesarReporte(tipo: string, data?: any) {
    this.cargando = true;
    try {
      if (tipo == "01") {
        // window.open("http://localhost:8283/10_reportePrueba/");//ok
        const miDTS = Object.assign(this.datosInsumo);
        // const pivot = JSON.parse(JSON.stringify(this.dts_kardexInsumo));
        const grilla = this.dts_kardexInsumo.map((el, i) => {
          el.fechaRep = moment(el.fecha).format("DD/MM/YYYY HH:mm:ss");
          el.fila = i + 1;
          el.costo_unidad2 = Number(el.costo_unidad).toLocaleString("de-DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
          el.costo_total2 = Number(el.costo_total).toLocaleString("de-DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
          return el;
        });
        if (tipo == "01") {
          miDTS.tipoReporte = tipo;
          miDTS.grilla = grilla;
        }
        this.generarReporte(miDTS, `Kardex${this.datosInsumo.descripcion}`);
      }
      if (tipo == "03") {
        if (!this.fechaIniFV || !this.fechaFinFV) {
          this.cargando = false;
          this._msg.formateoMensaje(
            "modal_warning",
            "Debe seleccionar fechas validas",
            8
          );
          return true;
        }
        if (new Date(this.fechaIniFV) > new Date(this.fechaFinFV)) {
          this.cargando = false;
          this._msg.formateoMensaje(
            "modal_warning",
            "Debe seleccionar rango de fechas coherente",
            8
          );
          return true;
        }
        $("#modalFV").modal("hide");
        const obj = {
          fechaIni: moment(this.fechaIniFV).format("YYYYMMDD"),
          fechaFin: moment(this.fechaFinFV).format("YYYYMMDD"),
          insumos: "0",
        };
        //console.log(obj);

        this.armarReporteFV(obj);
        const codigos = "395004";
        setTimeout(() => {
          console.log(
            "ya lo tengo",
            this.resultFV.filter((el) => el.fid_insumo === 621)
          );
          const totales = alasql(
            `SELECT sum(saldoInicial)saldoInicial,sum(case when saldoInicial >0 then 0 else cantidad end)ingreso
                                  ,sum(entregado)salidas,sum(saldo)saldo,sum(saldoInicial * costo_unidad)saldoIniBs
                                  ,sum(case when saldoInicial>0 then 0 else cantidad end * costo_unidad)ingresoBs
                                  ,sum(entregado * costo_unidad)salidaBs,sum(saldo * costo_unidad)saldoBS FROM ? `,
            [this.resultFV]
          );
          this.resultFV.map((el) => {
            // el.saldoInicial = Number(el.costo_total==0?el.cantidad:el.saldoAnterior);
            // el.saldoInicial = Number(el.fecha<=moment(this.fechaIniFV).format('YYYYMMDD')?el.cantidad:0);
            // el.cantidad = Number(el.fecha<=moment(this.fechaIniFV).format('YYYYMMDD')?0:el.cantidad);
            // el.saldoIniBs = Number(((el.fecha<=moment(this.fechaIniFV).format('YYYYMMDD')?el.cantidad:0)*el.costo_unidad).toFixed(2));
            el.saldoIniBs = Number(
              Number(el.saldoInicial) * Number(el.costo_unidad)
            ).toLocaleString("de-DE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            el.ingresoBs = Number(
              (el.saldoInicial > 0 ? 0 : el.cantidad) * el.costo_unidad
            ).toLocaleString("de-DE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            el.salidaBs = Number(el.entregado * el.costo_unidad).toLocaleString(
              "de-DE",
              { minimumFractionDigits: 2, maximumFractionDigits: 2 }
            );
            el.saldoBS = Number(el.saldo * el.costo_unidad).toLocaleString(
              "de-DE",
              { minimumFractionDigits: 2, maximumFractionDigits: 2 }
            );

            el.costo_unidad = Number(el.costo_unidad).toLocaleString("de-DE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            el.saldoInicial = Number(el.saldoInicial).toLocaleString("de-DE", {
              minimumFractionDigits: 0,
            });
            el.saldo = Number(el.saldo).toLocaleString("de-DE", {
              minimumFractionDigits: 0,
            });
            el.ingreso = Number(
              el.saldoInicial > 0 ? 0 : el.cantidad
            ).toLocaleString("de-DE", { minimumFractionDigits: 0 });
            el.salidas = Number(el.entregado).toLocaleString("de-DE", {
              minimumFractionDigits: 0,
            });
          });
          totales.map((el) => {
            el.saldoIniBs = el.saldoIniBs.toLocaleString("de-DE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            el.ingresoBs = el.ingresoBs.toLocaleString("de-DE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            el.salidaBs = el.salidaBs.toLocaleString("de-DE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            el.saldoBS = el.saldoBS.toLocaleString("de-DE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            el.saldoInicial = el.saldoInicial.toLocaleString("de-DE", {
              minimumFractionDigits: 0,
            });
            el.ingreso = el.ingreso.toLocaleString("de-DE", {
              minimumFractionDigits: 0,
            });
            el.salidas = el.salidas.toLocaleString("de-DE", {
              minimumFractionDigits: 0,
            });
            el.saldo = el.saldo.toLocaleString("de-DE", {
              minimumFractionDigits: 0,
            });
            return el;
          });

          this.resultFV = alasql("select * from ? order by codPartida,codigo", [
            this.resultFV,
          ]);
          const armado = {
            tipoReporte: "03",
            fechaIni: moment(obj.fechaIni).format("DD/MM/YYYY"),
            fechaFin: moment(obj.fechaFin).format("DD/MM/YYYY"),
            codigos: codigos,
            // grilla:this.resultFV.filter(el=> !(el.saldoInicial ==0 && el.ingreso == 0 && el.salidas == 0 && el.saldo == 0)),
            grilla: this.resultFV, //.sort((a,b)=>a.codigo.toString()-b.codigo.toString()),
            totales,
          };
          //console.log('ya lo armo',armado.grilla.filter(f=>f.fid_insumo==371));
          this.generarReporte(armado, `InventarioFV`);
        }, 1200);
      }
      if (tipo == "04") {
        if (!this.resultFV) {
          this._msg.formateoMensaje(
            "modal_warning",
            "Debe generar previamente reporte: 1.Inventario FV",
            10
          );
          return true;
        }
        if (!this.dts_partidas) this.cargarPartidas();
        setTimeout(() => {
          this.resultFV.map((el) => {
            const part = this.dts_partidas.filter(
              (f) => f.id_partida == el.fidPartida
            )[0];
            el.partidaDesc = part.descripcion;
            el.codigoPartida = part.codigo;
            el.saldoIniBs = Number(
              el.saldoIniBs.toString().replace(".", "").replace(",", ".")
            );
            el.ingresoBs = Number(
              el.ingresoBs.toString().replace(".", "").replace(",", ".")
            );
            el.salidaBs = Number(
              el.salidaBs.toString().replace(".", "").replace(",", ".")
            );
            el.saldoBS = Number(el.saldoBS.toString().replace(".", "").replace(",", "."));
            el.costo_unidad = Number(
              el.costo_unidad.toString().replace(".", "").replace(",", ".")
            );

            el.saldoInicial = Number(
              el.saldoInicial.toString().replace(".", "").replace(",", ".")
            );
            el.saldo = Number(el.saldo.toString().replace(".", "").replace(",", "."));
            el.ingreso = Number(el.ingreso.toString().replace(".", "").replace(",", "."));
            el.salidas = Number(el.salidas.toString().replace(".", "").replace(",", "."));
            return el;
          }, 50);

          //console.log('mapeando resumen',this.resultFV);
          console.log("armando4 ", this.resultFV);
          const armado2 = alasql(
            `SELECT fidPartida,codigoPartida,partidaDesc, sum(saldoInicial)saldoInicial,sum(ingreso)ingreso
                                  ,sum(salidas)salidas,sum(saldo)saldo,sum(saldoIniBs)saldoIniBs,sum(ingresoBs)ingresoBs
                                  ,sum(salidaBs)salidaBs,sum(saldoBS)saldoBS
                                  FROM ? group by fidPartida,codigoPartida,partidaDesc  order by codigoPartida`,
            [this.resultFV]
          );
          const totales = alasql(
            `SELECT sum(saldoInicial)saldoInicial,sum(ingreso)ingreso
                                  ,sum(salidas)salidas,sum(saldo)saldo,sum(saldoIniBs)saldoIniBs,sum(ingresoBs)ingresoBs
                                  ,sum(salidaBs)salidaBs,sum(saldoBS)saldoBS FROM ? `,
            [armado2]
          );

          armado2.map((el) => {
            el.saldoIniBs = el.saldoIniBs.toLocaleString("de-DE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            el.ingresoBs = el.ingresoBs.toLocaleString("de-DE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            el.salidaBs = el.salidaBs.toLocaleString("de-DE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            el.saldoBS = el.saldoBS.toLocaleString("de-DE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            el.saldoInicial = el.saldoInicial.toLocaleString("de-DE", {
              minimumFractionDigits: 0,
            });
            el.ingreso = el.ingreso.toLocaleString("de-DE", {
              minimumFractionDigits: 0,
            });
            el.salidas = el.salidas.toLocaleString("de-DE", {
              minimumFractionDigits: 0,
            });
            el.saldo = el.saldo.toLocaleString("de-DE", {
              minimumFractionDigits: 0,
            });
            return el;
          });
          totales.map((el) => {
            el.saldoIniBs = el.saldoIniBs.toLocaleString("de-DE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            el.ingresoBs = el.ingresoBs.toLocaleString("de-DE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            el.salidaBs = el.salidaBs.toLocaleString("de-DE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            el.saldoBS = el.saldoBS.toLocaleString("de-DE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            el.saldoInicial = el.saldoInicial.toLocaleString("de-DE", {
              minimumFractionDigits: 0,
            });
            el.ingreso = el.ingreso.toLocaleString("de-DE", {
              minimumFractionDigits: 0,
            });
            el.salidas = el.salidas.toLocaleString("de-DE", {
              minimumFractionDigits: 0,
            });
            el.saldo = el.saldo.toLocaleString("de-DE", {
              minimumFractionDigits: 0,
            });
            return el;
          });
          const armado = {
            tipoReporte: "04",
            fechaIni: moment(this.fechaIniFV).format("DD/MM/YYYY"),
            fechaFin: moment(this.fechaFinFV).format("DD/MM/YYYY"),
            codigos: "395004",
            grilla: armado2.filter(
              (el) =>
                !(
                  el.saldoInicial == 0 &&
                  el.ingreso == 0 &&
                  el.salidas == 0 &&
                  el.saldo == 0
                )
            ),
            totales: totales,
          };
          //console.log('armado resumen',armado);
          this.generarReporte(armado, `IFVResumen`);
        }, 400);
      }
      if (tipo == "05") {
        this.cargarIngresosDetalle(data.id_ingreso);
        setTimeout(() => {
          const elDetalle = [];
          this.dts_ingresosDetalle.forEach((element) => {
            const obj = Object.assign({}, element);
            elDetalle.push(obj);
          });
          elDetalle.map((el) => {
            el.costo_unidad = Number(el.costo_unidad).toLocaleString("de-DE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            el.costo_total = Number(el.costo_total).toLocaleString("de-DE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            return el;
          });
          const elIngresoReporte = {
            tipoReporte: "05",
            numeroIngreso: Number(data.numero_ingreso),
            proveedor: data.nombre,
            nit: data.nit,
            numeroFactura: data.numero_factura,
            autorizacionFactura: data.autorizacion_factura,
            fechaFactura: moment(data.fecha_factura).format("DD/MM/YYYY"),
            numeroEntrega: data.numero_entrega,
            fechaEntrega: moment(data.fecha_entrega).format("DD/MM/YYYY"),
            c31: data.c31,
            c31Fecha: moment(data.c31_fecha).format("DD/MM/YYYY"),
            total: Number(data.total).toLocaleString("de-DE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            gestion: this.gestion,
            grilla: elDetalle,
          };
          this.generarReporte(
            elIngresoReporte,
            `IngresoAlmacen${data.numero_ingreso}`
          );
        }, 300);
      }
    } catch (error) {
      //console.log('Error procesarReprote:'+error);
      this.cargando = false;
    }
  }

  armarReporteFV(obj: any) {
    let ing, sol;
    if (!this.dts_insumos) this.cargarInsumos();
    this._almacen.entradasFV(obj).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          ing = this._fun.RemplazaNullArray(result);
        } else {
          //console.log('sin ingresos para FV');
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
    this._almacen.salidasFV(obj).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          sol = this._fun.RemplazaNullArray(result);
        } else {
          //console.log('sin ingresos para FV');
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
    setTimeout(() => {
      this.resultFV = [];
      const ins = this.dts_insumos.sort((a, b) => a.id_insumo - b.id_insumo); //.filter(el=>el.id_insumo <50);//.map(m=>m.id_insumo);
      ins.forEach((e) => {
        // if(e.id_insumo==371) //console.log('tengoi31',ing.filter(el=>el.fid_insumo==371),sol.filter(el=>el.fid_insumo==371));
        let dif2 = 0;
        let dif = 0;
        let saldoAnterior = 0;
        let entro = false;
        ing.forEach((i) => {
          if (i.fid_insumo == e.id_insumo) {
            const fila = {
              fid_insumo: i.fid_insumo,
              cantidad: Number(i.cantidad),
              fecha: i.fecha,
              costo_unidad: Number(i.costo_unidad),
              corte: i.corte,
              entregado: 0,
              saldo: 0,
              saldoAnterior: Number(saldoAnterior),
              saldoInicial: 0,
              vigente: i.fecha >= i.corte ? true : false,
              codigo: Number(e.codigo),
              descripcion: e.descripcion,
              fidPartida: e.fid_partida,
              codPartida: Number(i.cod_partida),
            };
            for (const s of sol) {
              if (s.fid_insumo != e.id_insumo) continue;
              if (s.marcado) continue;
              if (fila.cantidad <= dif) {
                fila.entregado = fila.cantidad;
                dif -= fila.cantidad;
                if (fila.fecha < fila.corte) {
                  fila.saldoInicial = fila.cantidad;
                  fila.cantidad = 0;
                }
                this.resultFV.push(fila);
                return true;
              }
              if (s.fecha_entrega >= fila.corte) fila.vigente = true;
              if (
                fila.fecha < fila.corte &&
                s.fecha_entrega >= fila.corte &&
                !entro
              ) {
                entro = true;
                fila.entregado =
                  fila.cantidad < fila.entregado
                    ? fila.cantidad
                    : fila.entregado;

                if (fila.fecha < fila.corte) {
                  fila.vigente = true;
                  fila.cantidad -= fila.entregado + dif;
                  fila.entregado = 0 - dif;
                }
              }
              fila.entregado += s.cantidad_entregada + dif;
              dif = 0;
              s.marcado = true;
              if (fila.cantidad <= fila.entregado) {
                dif = fila.entregado - fila.cantidad;
                fila.entregado = fila.cantidad;
                if (fila.fecha < fila.corte) {
                  fila.saldoInicial = fila.cantidad;
                  fila.cantidad = 0;
                }
                this.resultFV.push(fila);
                return true;
              }
            }
            fila.entregado += dif;
            fila.saldo = fila.cantidad - fila.entregado;
            if (fila.saldo > 0 && fila.saldoAnterior >= 0) fila.vigente = true;
            if (fila.fecha < fila.corte) {
              fila.saldoInicial = fila.cantidad;
              fila.cantidad = 0;
            }
            if (
              fila.fecha < fila.corte &&
              sol.filter(
                (f) =>
                  f.fid_insumo == e.id_insumo && f.fecha_entrega > fila.corte
              ).length == 0
            ) {
              fila.saldoInicial -= fila.entregado;
              fila.entregado = 0;
            }
            if (dif2 > 0) {
              dif2 -= fila.cantidad;
              fila.entregado = fila.cantidad;
              fila.saldo = 0;
            }
            if (
              fila.entregado > fila.cantidad &&
              fila.entregado > fila.saldoInicial
            ) {
              //console.log('entro fin para',fila);

              dif2 = fila.entregado - fila.cantidad;
              fila.entregado = fila.cantidad;
              fila.saldo = 0;
            }
            this.resultFV.push(fila);
            saldoAnterior = fila.saldo;
            dif = 0;
          }
        });
      });
      this.resultFV = this.resultFV.filter((f) => f.vigente);
    }, 600);
  }

  generarReporte(data: any, nombre: string) {
    this.cargando = true;
    //console.log('generando reporte',data);
    this._almacen.reportesAlmacences(data).subscribe(
      (result: any) => {
        console.log('rev rep',result);
        const url = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${nombre}.pdf`);
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
  // probando(){
  //   $('#modalFV').modal('hide');
  //   //console.log('hola desde probando');

  // }

  BusquedaProveedor(id) {
    console.log("entro a buscar", id);
    this.proveedoresFiltrados = this.dts_proveedores.filter(
      (f) => f.nombre != id
    );
  }

  ValidaProveedor() {
    console.log("dejo el control");
    if (this.idProveedorLista.length > 0) {
      this.elIdProveedor = this.dts_proveedores.filter(
        (f) => f.nombre == this.idProveedorLista
      )[0]
        ? this.dts_proveedores.filter(
            (f) => f.nombre == this.idProveedorLista
          )[0].id_proveedor
        : null;
      if (!this.elIdProveedor) this.idProveedorLista = "";
    } else {
      this.elIdProveedor = null;
    }
  }

  cambiarGestion() {
    console.log("cambiando gestion");
    //this.gestion = valor;
    this.cargarIngresos();
    this.insumosMasComprados();
    this.comprasPorPartidas();
    this.insumosMasSolicitados();
  }

  // generarReporte2(data:any,nombre:string){
  //   this.cargando = true;
  //   //console.log('generando reporte',data);
  //   this._almacen.reportesAlmacences2(data).subscribe(
  //     (result: any) => {
  //       //console.log(result);
  //       const url = window.URL.createObjectURL(new Blob([result._body]));
  //       const link = document.createElement('a');
  //       link.href = url;
  //       link.setAttribute('download', `${nombre}.pdf`);
  //       document.body.appendChild(link);
  //       link.click();

  //       document.body.removeChild(link);
  //       URL.revokeObjectURL(url);
  //       this.cargando=false;
  //     },
  //     (error) => {
  //       this.cargando =false;
  //       this.errorMessage = <any>error;
  //       if (this.errorMessage != null)   this._msg.formateoMensaje("modal_danger", 'Error: '+this.errorMessage,10);
  //     }
  //   );
  // }
}
