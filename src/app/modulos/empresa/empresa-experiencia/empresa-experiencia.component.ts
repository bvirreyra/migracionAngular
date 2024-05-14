import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import swal2 from "sweetalert2";
import { EmpresaService } from "../empresa.service";

declare var $: any;

@Component({
  selector: "app-empresa-experiencia",
  templateUrl: "./empresa-experiencia.component.html",
  styleUrls: ["./empresa-experiencia.component.css"],
})
export class EmpresaExperienciaComponent implements OnInit {
  cargando: boolean = false;
  idUsuario: number;
  elIdEmpresa: number;

  formExperiencia: FormGroup;
  experienciaEditar: boolean = false;

  dtsExperienciaEmpresa: any[] = [];

  archivoExcel: any;

  minFechaFin: string;
  maxFechaIni: string;

  constructor(
    private _empresa: EmpresaService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private _fun: FuncionesComponent
  ) {
    this.formExperiencia = this.formBuilder.group({
      id_experiencia_empresa: [0],
      fid_empresa: [0],
      nombre_contratante: ["", Validators.required],
      direccion_contacto: ["", Validators.required],
      objeto_contratacion: ["", Validators.required],
      ubicacion: ["", Validators.required],
      monto_contrato_bs: [0, [Validators.required, Validators.min(1)]],
      monto_contrato_sus: [0, [Validators.min(1)]],
      fecha_inicio: [
        moment(new Date()).add(5,'hours').format("YYYY-MM-DD").toString(),
        Validators.required,
      ],
      fecha_fin: [
        moment(new Date()).add(5,'hours').format("YYYY-MM-DD").toString(),
        Validators.required,
      ],
      participacion: [
        0,
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
      socio: [""],
      responsable: ["", Validators.required],
    });
  }

  ngOnInit() {
    const datos = JSON.parse(localStorage.getItem("dts_con")) || {};
    this.elIdEmpresa = Number(datos.s_id_empresa);
    this.idUsuario = Number(datos.s_id_usuario);
    this.listarExperienciaEmpresa({
      opcion: "fid_empresa",
      id: this.elIdEmpresa,
    });
  }

  listarExperienciaEmpresa(opcion) {
    this.cargando = true;
    this._empresa.listaExperienciasEmpresa(opcion).subscribe(
      (result: any) => {
        console.log("experiencia empresa", result);
        this.dtsExperienciaEmpresa = result;
        this._fun.limpiatabla(".dt-experiencia-empresa");
        setTimeout(() => {
          let confiTable = this._fun.CONFIGURACION_TABLA_V6(
            [50, 100, 150, 200],
            false,
            10,
            [1, "asc"]
          );
          if (!$.fn.dataTable.isDataTable(".dt-experiencia-empresa")) {
            var table = $(".dt-experiencia-empresa").DataTable(confiTable);
            this._fun.inputTable(table, [1, 2, 3, 4, 7, 8, 9, 10, 11]);
          }
        }, 100);
        this.cargando = false;
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor", {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        });
        this.cargando = false;
      }
    );
  }

  abrirFormExperienciaEmpresa(experiencia?: any) {
    console.log("abrir form experiencia", experiencia);
    this.formExperiencia.get("fecha_inicio").valueChanges.subscribe((val) => {
      this.minFechaFin = moment(val).add(1,'day').format("YYYY-MM-DD");
    });
    this.formExperiencia.get("fecha_fin").valueChanges.subscribe((val) => {
      this.maxFechaIni = moment(val).add(-1,'day').format("YYYY-MM-DD");
    });
    experiencia
      ? (this.experienciaEditar = true)
      : (this.experienciaEditar = false);
    if (this.experienciaEditar) {
      this.formExperiencia.setValue({
        id_experiencia_empresa: experiencia.id_experiencia_empresa,
        fid_empresa: experiencia.fid_empresa,
        nombre_contratante: experiencia.nombre_contratante,
        direccion_contacto: experiencia.direccion_contacto,
        objeto_contratacion: experiencia.objeto_contratacion,
        ubicacion: experiencia.ubicacion,
        monto_contrato_bs: experiencia.monto_contrato_bs,
        monto_contrato_sus: experiencia.monto_contrato_sus,
        fecha_inicio: moment(experiencia.fecha_inicio).add(5,'hours').format("YYYY-MM-DD"),
        fecha_fin: moment(experiencia.fecha_fin).add(5,'hours').format("YYYY-MM-DD"),
        participacion: experiencia.participacion,
        socio: experiencia.socio,
        responsable: experiencia.responsable,
      });
      // this.elCodigo = experiencia.codigo;
      // this.formexperiencia.controls['fidTipo'].disable();
    } else {
      this.formExperiencia.reset();
    }
    $("#modalExperiencia").modal("show");
    $(".modal").on("shown.bs.modal", function () {
      $(this).find("[autofocus]").focus();
    });
    this.formExperiencia.get("participacion").valueChanges.subscribe((val) => {
      if (val >= 100) {
        this.formExperiencia.controls["socio"].setValue("");
        this.formExperiencia.controls["socio"].disable({ emitEvent: true });
      } else {
        this.formExperiencia.controls["socio"].enable({ emitEvent: true });
      }
    });
  }

  confirmarEliminacion(experiencia: any, operacion: string) {
    swal2({
      title: "Advertencia!!!",
      text: `Realmente desea eliminar la experiencia?`,
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d9534f",
      cancelButtonColor: "#f0ad4e",
      customClass: "swal2-popup",
      confirmButtonText: "Confirmar!",
    }).then((result) => {
      if (result.value) this.crudExperienciaEmpresa(experiencia, operacion);
    });
  }

  crudExperienciaEmpresa(experiencia?: any, operacion?: string) {
    if (
      this.formExperiencia.controls["fecha_inicio"].value >=
      this.formExperiencia.controls["fecha_fin"].value
      && operacion !== 'D'
    ) {
      this.toastr.warning(
        "La Fecha Inicio no puede ser meayor a Fecha Finalización",
        "Registro Experiencia",
        {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        }
      );
      return false;
    }
    this.cargando = true;
    let laExperiencia = this.formExperiencia.getRawValue();
    laExperiencia.id_experiencia_empresa
      ? (laExperiencia.operacion = "U")
      : (laExperiencia.operacion = "I");
    if (operacion == "D") {
      laExperiencia = experiencia;
      laExperiencia.operacion = "D";
    }
    if (!laExperiencia.fid_empresa)
      laExperiencia.fid_empresa = this.elIdEmpresa;
    laExperiencia.usuario_registro = this.idUsuario;
    this._empresa.crudExperienciaEmpresa(laExperiencia).subscribe(
      (result: any) => {
        if (!result[0].message.toUpperCase().startsWith("ERROR")) {
          this.toastr.success(result[0].message, "Registro Experiencia", {
            positionClass: "toast-top-right",
            timeOut: 5000,
            progressBar: true,
          });
        } else {
          this.toastr.error(
            "Error al actualizar experiencia: " + result[0].message,
            "Registro Experiencia",
            {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            }
          );
        }
        this.cargando = false;
        $("#modalExperiencia").modal("hide");
        this.listarExperienciaEmpresa({
          opcion: "fid_empresa",
          id: this.elIdEmpresa,
        });
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor", {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        });
        this.cargando = false;
      }
    );
  }

  handleInput(event: any) {
    const value = event.target.value;
    const pattern = /^\d+(\.\d{0,2})?$/;
    if (!pattern.test(value)) {
      event.target.value = value.slice(0, -1);
    }
  }

  handleBlur(event: any) {
    if (event.originalTarget) {
      event.originalTarget.value = Number(event.originalTarget.value).toFixed(
        2
      );
    } else {
      if (event.target)
        event.target.value = Number(event.target.value).toFixed(2);
    }
  }

  buscarExcel() {
    $("#modalExcel").modal("show");
    $(".modal").on("shown.bs.modal", function () {
      $(this).find("[autofocus]").focus();
    });
  }

  cargarExcel() {
    this.archivoExcel.fid_empresa = this.elIdEmpresa;
    this.archivoExcel.usuario_registro = this.idUsuario;
    console.log("excel", this.archivoExcel);
    this.cargando = true;
    this._empresa.cargarExperienciaExcel(this.archivoExcel).subscribe(
      (result: any) => {
        console.log("cargar excel", result);
        if (result[0].message.startsWith("Error")) {
          this.toastr.error(result[0].message, "Validación Información", {
            positionClass: "toast-top-right",
            timeOut: 8000,
            progressBar: true,
          });
        } else {
          this.toastr.success(result[0].message, "Registro Experiencia", {
            positionClass: "toast-top-right",
            timeOut: 8000,
            progressBar: true,
          });
          $("#modalExcel").modal("hide");
          this.listarExperienciaEmpresa({
            opcion: "fid_empresa",
            id: this.elIdEmpresa,
          });
        }

        this.cargando = false;
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor", {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        });
        this.cargando = false;
      }
    );
  }

  handleFileInput(files: FileList, opcion?: string) {
    // this.inputArchivo = files.item(0);
    let extensionesValidas = ["ods"];
    let nombreArchivo = files.item(0).name;
    let extension_archivo = nombreArchivo.substr(
      nombreArchivo.indexOf(".") + 1
    );
    if (extensionesValidas.indexOf(extension_archivo) < 0) {
      this.toastr.error(
        "Solo se peuden cargar archvios con extensiones .ods (Libre Office - Calc)",
        "Error desde el servidor",
        { positionClass: "toast-top-right", timeOut: 8000, progressBar: true }
      );
      $("#inputArchivo").val("");
    } else {
      this.archivoExcel = files.item(0);
    }
  }

  descargarExperiencia() {
    this.cargando = true;
    let nombrePlantilla = "experiencias_empresa.ods";
    console.log("descargar plantilla");

    const miDTS = { tipo: nombrePlantilla };

    this._empresa.descargarPlantilla(miDTS).subscribe(
      (result: any) => {
        console.log(result);
        // const file = new Blob([result.blob()], {
        //   type: "application/vnd.oasis.opendocument.spreadsheet", //"application/vnd.ms.excel",
        // });
        //const file = new Blob([result])
        const fileURL = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", nombrePlantilla);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(fileURL);
        this.cargando = false;
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor", {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        });
        this.cargando = false;
      }
    );
  }
}
