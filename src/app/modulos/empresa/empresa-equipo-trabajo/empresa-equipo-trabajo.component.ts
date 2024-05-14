import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import alasql from "alasql";
import { ToastrService } from "ngx-toastr";
import swal2 from "sweetalert2";
import { EmpresaService } from "../empresa.service";

declare var $: any;

@Component({
  selector: "app-empresa-equipo-trabajo",
  templateUrl: "./empresa-equipo-trabajo.component.html",
  styleUrls: ["./empresa-equipo-trabajo.component.css"],
})
export class EmpresaEquipoTrabajoComponent implements OnInit {
  cargando: boolean = false;
  idUsuario: number;
  elIdEmpresa: number;
  elIdEquipo: number;

  formEquipo: FormGroup;
  equipoEditar: boolean = false;

  dtsEquipos: any[] = [];

  dtsTiposUnidad: any[] = [];

  constructor(
    private _empresa: EmpresaService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private _fun: FuncionesComponent
  ) {
    this.formEquipo = this.formBuilder.group({
      id_equipo_trabajo: [0],
      fid_empresa: [0],
      descripcion: ["", Validators.required],
      unidad: ["", Validators.required],
      cantidad: [0, Validators.required],
      potencia: [""],
      capacidad: [""],
    });
  }

  ngOnInit() {
    const datos = JSON.parse(localStorage.getItem("dts_con")) || {};
    this.elIdEmpresa = Number(datos.s_id_empresa);
    this.idUsuario = Number(datos.s_id_usuario);
    this.listarEquipos({ opcion: "fid_empresa", id: this.elIdEmpresa });
  }

  listarEquipos(opcion) {
    this.cargando = true;
    this._empresa.listaEquiposTrabajo(opcion).subscribe(
      (result: any) => {
        console.log("equipos", result);
        this.dtsEquipos = result;
        this.dtsTiposUnidad = alasql("select distinct unidad from ?", [result]);
        this._fun.limpiatabla(".dt-equipos");
        setTimeout(() => {
          let confiTable = this._fun.CONFIGURACION_TABLA_V6(
            [50, 100, 150, 200],
            false,
            10,
            [1, "asc"]
          );
          if (!$.fn.dataTable.isDataTable(".dt-equipos")) {
            var table = $(".dt-equipos").DataTable(confiTable);
            this._fun.inputTable(table, [1, 2, 3, 4]);
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

  abrirFormEquipo(equipo?: any) {
    console.log("abrir form equipo", equipo);
    equipo ? (this.equipoEditar = true) : (this.equipoEditar = false);
    if (this.equipoEditar) {
      this.elIdEquipo = equipo.id_equipo_trabajo;
      this.formEquipo.setValue({
        id_equipo_trabajo: equipo.id_equipo_trabajo,
        fid_empresa: equipo.fid_empresa,
        descripcion: equipo.descripcion,
        unidad: equipo.unidad,
        cantidad: equipo.cantidad,
        potencia: equipo.potencia,
        capacidad: equipo.capacidad,
      });
    } else {
      this.formEquipo.reset();
      this.elIdEquipo = null;
    }
    $('#modalEquipo').modal({backdrop: 'static', keyboard: false});
    $(".modal").on("shown.bs.modal", function () {
      $(this).find("[autofocus]").focus();
    });
  }

  confirmarEliminacion(data: any, operacion: string) {
    swal2({
      title: "Advertencia!!!",
      text: `Realmente desea eliminar el Equipo de Trabajo?`,
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d9534f",
      cancelButtonColor: "#f0ad4e",
      customClass: "swal2-popup",
      confirmButtonText: "Confirmar!",
    }).then((result) => {
      if (result.value) this.crudEquipo(data, operacion);
    });
  }

  crudEquipo(equipo?: any, operacion?: string) {
    this.cargando = true;
    let elEquipo = this.formEquipo.getRawValue();
    elEquipo.id_equipo_trabajo
      ? (elEquipo.operacion = "U")
      : (elEquipo.operacion = "I");
    if (operacion == "D") {
      elEquipo = equipo;
      elEquipo.operacion = "D";
    }
    if (!elEquipo.fid_empresa) elEquipo.fid_empresa = this.elIdEmpresa;
    elEquipo.usuario_registro = this.idUsuario;
    this._empresa.crudEquipoTrabajo(elEquipo).subscribe(
      (result: any) => {
        if (!result[0].message.toUpperCase().startsWith("ERROR")) {
          this.toastr.success(result[0].message, "Registro Equipo Trabajo", {
            positionClass: "toast-top-right",
            timeOut: 5000,
            progressBar: true,
          });
        } else {
          this.toastr.error(
            "Error al actualizar Equipo de Trabajo: " + result[0].message,
            "Registro Equipo Trabajo",
            {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            }
          );
        }
        this.cargando = false;
        $("#modalEquipo").modal("hide");
        this.listarEquipos({ opcion: "fid_empresa", id: this.elIdEmpresa });
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

  agregarTipoUnidad(opcion: string) {
    const nuevo = prompt("Agregar Tipo Unidad", "Nuevo Tipo Unidad");
    if (nuevo) {
      this.dtsTiposUnidad.push({ unidad: nuevo.toUpperCase() });
    }
  }
}
