import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import alasql from "alasql";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { FinancieraService } from "src/app/modulos/financiera/financiera.service";

declare var $: any;

@Component({
  selector: "app-buzon",
  templateUrl: "./buzon.component.html",
  styleUrls: ["./buzon.component.css"],
})
export class BuzonComponent implements OnInit {
  cargando: boolean = false;
  idUsuario: number = 0;

  dtsConsultas: any[] = [];
  dtsProyectos: any[] = [];
  dtsTiposOrigen: any[] = [];
  dtsCargos: any[] = [];
  formConsulta: FormGroup;
  elIdConsulta: number = 0;
  reporteF1: Date;
  reporteF2: Date;
  minFecha: string = "2023-01-01";
  maxFecha: string = "2080-12-31";

  constructor(
    private _financiera: FinancieraService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private _fun: FuncionesComponent
  ) {}

  ngOnInit() {
    const datos = JSON.parse(localStorage.getItem("dts_con"));
    this.idUsuario = datos.s_usu_id;

    this.formConsulta = this.formBuilder.group({
      id_buzon: [0],
      fid_proyecto: [0],
      origen: ["", Validators.required],
      consultante: ["", Validators.required],
      telefono: [""],
      consulta: ["", Validators.required],
      respuesta: [""],
      fecha_respuesta: [""],
      responsable: ["", Validators.required],
      estado: ["PENDIENTE"],
      observacion: [""],
      proyecto: [""],
    });
    this.listarBuzon({ opcion: "T" });
    this.listarCargos({ opcion: "T" });
  }

  listarBuzon(opcion) {
    this.cargando = true;
    console.log('antes de listar buzon',opcion);
    
    this._financiera.listarBuzon(opcion).subscribe(
      (result: any) => {
        console.log("consultas", result);
        if (result.length > 0) {
          this.dtsConsultas = result;
          this.dtsTiposOrigen = alasql(`SELECT distinct origen FROM ? `, [
            this.dtsConsultas,
          ]);
          this._fun.limpiatabla(".dt-consultas");
          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V7(
              [10, 20, 50, 100],
              false,
              10,
              true,
              [1, "desc"],
              true,
              [{ visible: false, targets: 1 }]
            );
            if (!$.fn.dataTable.isDataTable(".dt-consultas")) {
              var table = $(".dt-consultas").DataTable(confiTable);
              this._fun.inputTable(
                table,
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
              );
            }
          }, 100);
        } else {
          this.toastr.warning("Buzón de consulta vacío", "Listar Buzón");
        }
        this.cargando = false;
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor");
        this.cargando = false;
      }
    );
  }

  listarProyectos(opcion: any) {
    return new Promise<void>((resolve, reject) => {
      this.cargando = true;
      this._financiera.listarBuzon(opcion).subscribe(
        (result: any) => {
          console.log("proyectos", result);
          this.dtsProyectos = result;
          this.cargando = false;
          resolve()
        },
        (error) => {
          this.toastr.error(error.toString(), "Error desde el servidor");
          this.cargando = false;
          reject()
        }
      );
    })
  }
  listarCargos(opcion: any) {
    this.cargando = true;
    this._financiera.listarCargos(opcion).subscribe(
      (result: any) => {
        console.log("cargos", result);
        this.dtsCargos = result;
        this.cargando = false;
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor");
        this.cargando = false;
      }
    );
  }

  async abrirFormConsulta(consulta?: any) {
    console.log("abrir form consulta");
    if(this.dtsProyectos.length==0) await this.listarProyectos({ opcion: "PROYECTOS" });
    // consulta ? (this.correoEditar = true) : (this.correoEditar = false);
    if (consulta) {
      const proyect = this.dtsProyectos.filter(
        (f) => f.id_proyecto == consulta.fid_proyecto
      )[0];
      this.formConsulta.setValue({
        id_buzon: consulta.id_buzon,
        fid_proyecto: consulta.fid_proyecto || null,
        origen: consulta.origen,
        consultante: consulta.consultante,
        telefono: consulta.telefono,
        consulta: consulta.consulta,
        respuesta: consulta.respuesta,
        fecha_respuesta: consulta.fecha_respuesta,
        responsable: consulta.responsable,
        estado: consulta.estado,
        observacion: consulta.observacion,
        proyecto: proyect ? proyect.nombreproyecto : "",
      });
      this.elIdConsulta = consulta.id_buzon;
    } else {
      this.formConsulta.reset();
      this.elIdConsulta = 0;
    }
    $("#modalConsulta").modal("show");
    $(".modal").on("shown.bs.modal", function () {
      $(this).find("[autofocus]").focus();
    });
  }

  registrarConsulta(row?: any) {
    this.cargando = true;
    let consulta = this.formConsulta.getRawValue();
    consulta.operacion = consulta.id_buzon > 0 ? "U" : "I";
    if (row) {
      consulta = row;
      consulta.operacion = "D";
    }
    consulta.usuario_registro = this.idUsuario;
    console.log("REVISANDO", consulta);

    const elProyecto = this.dtsProyectos.filter(
      (f) => f.nombreproyecto == consulta.proyecto
    )[0];
    consulta.fid_proyecto = elProyecto ? elProyecto.id_proyecto : null;
    consulta.estado = consulta.respuesta ? "ATENDIDA" : "PENDIENTE";
    if (!consulta.fecha_respuesta && consulta.estado == "ATENDIDA")
      consulta.fecha_respuesta = moment().format("YYYYMMDD HH:mm:ss");

    console.log("antes del crud", consulta);
    this._financiera.crudBuzon(consulta).subscribe(
      (result: any) => {
        console.log("result crud buzon", result);
        if (!result[0].message.toUpperCase().startsWith("ERROR")) {
          this.toastr.success(
            "Consulta Registrada con Éxito!!!",
            "Registro Buzón"
          );
          this.listarBuzon({ opcion: "T" });
          this.elIdConsulta = 0;
        } else {
          this.toastr.error(
            "Error al registrar consulta: " + result[0].message,
            "Registro Consulta"
          );
        }
        $("#modalConsulta").modal("hide");
        this.cargando = false;
      },
      (error) => {
        this.cargando = false;
        this.toastr.error(error.toString(), "Error desde el servidor");
      }
    );
  }

  nuevoElemento() {
    console.log("nuevo elemento");
    const nuevo = prompt("Agregar Tipo Origen", "Nuevo Origen");
    if (nuevo) this.dtsTiposOrigen.push({ origen: nuevo.toUpperCase() });
  }

  rangoFechas(tipo: string) {
    console.log("rango fechas", this.reporteF1, this.reporteF2);

    if (this.reporteF1)
      this.minFecha = moment(this.reporteF1).format("YYYY-MM-DD");
    if (this.reporteF2)
      this.maxFecha = moment(this.reporteF2).format("YYYY-MM-DD");
    if (
      moment(this.reporteF1).year() >= 2024 &&
      moment(this.reporteF2).year() >= 2024 &&
      this.reporteF1 <= this.reporteF2
    ) {
      $("#modalReporte").modal("hide");
      this.reportesBuzon(tipo);
    }
  }

  reportesBuzon(tipoReporte: string) {
    console.log("reportesBuzon", tipoReporte);
    this.cargando = true;
    console.log("generando reporte");
    const miDTS = {
      tipoReporte,
      id: 0,
      f1: moment(this.reporteF1).format("DD/MM/YYYY"),
      f2: moment(this.reporteF2).format("DD/MM/YYYY"),
    };
    let nombreReporte = `BuzonConsultas.xlsx`;
    this._financiera.reportes(miDTS).subscribe(
      (result: any) => {
        console.log(result);
        const url = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", nombreReporte);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        this.cargando = false;
        this.reporteF1 = null;
        this.reporteF2 = null;
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor");
        this.cargando = false;
      }
    );
  }
}
