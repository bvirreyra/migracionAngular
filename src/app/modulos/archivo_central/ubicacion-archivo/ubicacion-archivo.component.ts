import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from "@angular/core";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import alasql from "alasql";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";
import { ArchivocentralService } from "../archivocentral.service";
import { ToastrService } from "ngx-toastr";

declare var $: any;

@Component({
  selector: "app-ubicacion-archivo",
  templateUrl: "./ubicacion-archivo.component.html",
  styleUrls: ["./ubicacion-archivo.component.css"],
})
export class UbicacionArchivoComponent implements OnInit, OnChanges {
  @Input() proyecto: any;
  @Input() tipoArchivo: any;
  @Output() messageEvent = new EventEmitter<string>();

  //variables para el compononete de mensajes
  public prop_msg: string;
  public prop_tipomsg: string;
  public errorMessage: string;
  public cargando: boolean = false;
  public idUsuario: number = 0;

  public editando: boolean = false;
  public dts_ubicacion: any;
  public dts_oficinas: any;
  public dts_estantes: any;
  public dts_tipos: any;
  public elIdUbicacion: number = 0;

  public ubicacion: {
    oficina: string;
    estante: string;
    tipo: string;
    codigo: string;
    observacion: string;
  };

  constructor(
    private _archivo: ArchivocentralService,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent,
    private toastr: ToastrService,
  ) {
    this.ubicacion = {
      oficina: "",
      estante: "",
      tipo: "",
      codigo: "",
      observacion: "",
    };
  }

  ngOnInit() {
    const datos = JSON.parse(localStorage.getItem("dts_con"));
    console.log(datos);
    this.idUsuario = datos.s_usu_id;
  }
  ngOnChanges() {
    $("#modalUbicacion").modal("show");
    console.log("el proyecto", this.proyecto);
    this.cargarUbicacion();
  }

  cargarUbicacion() {
    this.cargando = true;
    this._archivo.ubicaciones().subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_ubicacion = this._fun.RemplazaNullArray(result);
          console.log("dts", this.dts_ubicacion);
          this.dts_oficinas = alasql(`SELECT distinct oficina FROM ? `, [
            this.dts_ubicacion,
          ]);
          this.dts_estantes = alasql(`SELECT distinct estante FROM ? `, [
            this.dts_ubicacion,
          ]);
          this.dts_tipos = alasql(`SELECT distinct tipo FROM ? `, [
            this.dts_ubicacion,
          ]);
          console.log(this.dts_oficinas);
          const reg = this.dts_ubicacion.filter(
            (el) => el.fid_cabecera == this.proyecto.id_cabecera
          );
          if (reg[0]) {
            this.editando = true;
            this.elIdUbicacion = reg[0].id_ubicacion;
            this.ubicacion.oficina = reg[0].oficina;
            this.ubicacion.estante = reg[0].estante;
            this.ubicacion.tipo = reg[0].tipo;
            this.ubicacion.codigo = reg[0].codigo;
            this.ubicacion.observacion = reg[0].observacion;
          }
        } else {
          this.editando = false;
          this.dts_oficinas = [];
          this.dts_estantes = [];
          this.dts_tipos = [];
        }
        this.cargando = false;
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor");
      }
    );
  }

  registrarUbicacion() {
    const laUbicacion = {
      operacion: this.editando ? "U" : "I",
      idUbicacion: this.elIdUbicacion,
      fidCabecera: this.proyecto.id_cabecera,
      oficina: (this.ubicacion.oficina || "").toUpperCase(),
      estante: (this.ubicacion.estante || "").toUpperCase(),
      tipo: (this.ubicacion.tipo || "").toUpperCase(),
      codigo: (this.ubicacion.codigo || "").toUpperCase(),
      observacion: (this.ubicacion.observacion || "").toUpperCase(),
      usuarioRegistro: this.idUsuario,
      tipoArchivo:this.tipoArchivo.split(' ')[1] || 'TECNICO',
    };
    this._archivo.crudUbicacion(laUbicacion).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          console.log("el resul", result);
          if (result[0].message && !result[0].message.startsWith("ERROR")) {
            this.toastr.success('Ubicación registrada con éxito!!!', "Registro Ubicación");
            this.messageEvent.emit("UBICADO");
          } else {
            this.toastr.warning("Alerta: " + result[0].message, "Registro Ubicación");
          }
        } else {
          this.toastr.warning("Alerta: " + result, "Registro Ubicación");
        }
        $("#modalUbicacion").modal("hide");
        this.cargando = false;
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor");
        this.cargando = false;
      }
    );
  }

  cancelar() {
    $("#modalUbicacion").modal("hide");
    this.messageEvent.emit("CANCELADO");
  }

  cambiando(e) {
    console.log(e);
    // const nuevo = prompt("Agregar Clasificador","Nuevo Elemento");
    // if(nuevo) this.dts_oficinas.push({oficina:nuevo});
  }

  nuevoElemento(opcion: string) {
    console.log("nuevo elemetno", opcion);
    const nuevo = prompt("Agregar Clasificador", "Nuevo Elemento");
    if (nuevo) {
      if (opcion == "oficina")
        this.dts_oficinas.push({ oficina: nuevo.toUpperCase() });
      if (opcion == "estante")
        this.dts_estantes.push({ estante: nuevo.toUpperCase() });
      if (opcion == "tipo") this.dts_tipos.push({ tipo: nuevo.toUpperCase() });
    }
  }
}
