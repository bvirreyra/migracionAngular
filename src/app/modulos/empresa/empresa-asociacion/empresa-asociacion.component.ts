import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import swal2 from "sweetalert2";
import { EmpresaService } from "../empresa.service";

declare var $: any;

@Component({
  selector: "app-empresa-asociacion",
  templateUrl: "./empresa-asociacion.component.html",
  styleUrls: ["./empresa-asociacion.component.css"],
})
export class EmpresaAsociacionComponent implements OnInit {
  cargando: boolean = false;
  idUsuario: number;
  elIdEmpresa: number;
  elIdAsociacion: number;
  elIdSocio: number;

  formAsociacion: FormGroup;
  asociacionEditar: boolean = false;
  dtsAsociaciones: any[] = [];

  formSocio: FormGroup;
  socioEditar: boolean = false;
  dtsSocios: any[] = [];

  dtsTiposUnidad: any[] = [];
  dtsEmpresas: any[] = [];

  participacionPrevia: number = 0;

  maxFecha: string = moment().add(5,'hours').format('YYYY-MM-DD');

  // estadoPosibleSocio:boolean=false;

  constructor(
    private _empresa: EmpresaService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private _fun: FuncionesComponent
  ) {
    this.formAsociacion = this.formBuilder.group({
      id_asociacion: [0],
      nombre_asociacion: ["", [Validators.required,Validators.minLength(6)]],
      testimonio: ["", Validators.required],
      fecha_expedicion: [0, Validators.required],
      lugar_testimonio: ["", Validators.required],
      participacion:['',[Validators.required,Validators.min(1),Validators.max(100)]],
      activo: [0],
    });
    this.formSocio = this.formBuilder.group({
      id_asociado: [0],
      fid_asociacion: [0],
      fid_empresa: [0],
      tipo_asociado: [0],
      participacion: [0, [Validators.required,Validators.min(1),Validators.max(100)]],
      razon_social: ["",Validators.required],
      nit: ["",Validators.required],
      matricula: ["",Validators.required],
      fecha_inscripcion: ["",Validators.required],
    });
  }

  ngOnInit() {
    const datos = JSON.parse(localStorage.getItem("dts_con")) || {};
    this.elIdEmpresa = Number(datos.s_id_empresa);
    this.idUsuario = Number(datos.s_id_usuario);
    this.listarAsociaciones({ opcion: "fid_empresa", id: this.elIdEmpresa });
    this.listarEmpresas({ opcion: "T" });
  }

  listarAsociaciones(opcion) {
    this.cargando = true;
    this._empresa.listaAsociaciones(opcion).subscribe(
      (result: any) => {
        console.log("asociaciones", result);
        this.dtsAsociaciones = result;
        this._fun.limpiatabla(".dt-asociaciones");
        setTimeout(() => {
          let confiTable = this._fun.CONFIGURACION_TABLA_V6(
            [50, 100, 150, 200],
            false,
            10,
            [1, "asc"]
          );
          if (!$.fn.dataTable.isDataTable(".dt-asociaciones")) {
            var table = $(".dt-asociaciones").DataTable(confiTable);
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
  listarSocios(opcion) {
    this.cargando = true;
    this.asociacionEditar = false;
    if (opcion.id_asociacion) this.elIdAsociacion = opcion.id_asociacion;
    opcion.opcion = "fid_asociacion";
    opcion.id = this.elIdAsociacion;
    this._empresa.listaAsociados(opcion).subscribe(
      (result: any) => {
        console.log("socio", result);
        this.dtsSocios = result;
        this._fun.limpiatabla(".dt-socios");
        setTimeout(() => {
          let confiTable = this._fun.CONFIGURACION_TABLA_V6(
            [50, 100, 150, 200],
            false,
            10,
            [1, "asc"]
          );
          if (!$.fn.dataTable.isDataTable(".dt-socios")) {
            var table = $(".dt-socios").DataTable(confiTable);
            this._fun.inputTable(table, [1, 2, 3, 4]);
          }
        }, 100);
        setTimeout(() => {
          const lugar = document.getElementById("grilla-socio");
          if(lugar) lugar.scrollIntoView({ block: "start", behavior: "smooth" });
        }, 200);
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
  listarEmpresas(opcion) {
    this._empresa.listaEmpresas(opcion).subscribe(
      (result: any) => {
        console.log("empresas", result);
        this.dtsEmpresas = result;
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

  abrirFormAsociacion(asociacion?: any) {
    console.log("abrir form asocioacion", asociacion);
    asociacion
      ? (this.asociacionEditar = true)
      : (this.asociacionEditar = false);
    if (this.asociacionEditar) {
      this.elIdAsociacion = asociacion.id_asociacion;
      this.formAsociacion.setValue({
        id_asociacion: asociacion.id_asociacion,
        nombre_asociacion: asociacion.nombre_asociacion,
        testimonio: asociacion.testimonio,
        participacion: asociacion.participacion,
        fecha_expedicion: moment(asociacion.fecha_expedicion).add(5,'hours').format(
          "YYYY-MM-DD"
        ),
        lugar_testimonio: asociacion.lugar_testimonio,
        activo: asociacion.activo,
      });
    } else {
      this.formAsociacion.reset();
      this.elIdAsociacion = null;
    }
    $("#modalAsociacion").modal("show");
    $(".modal").on("shown.bs.modal", function () {
      $(this).find("[autofocus]").focus();
    });
  }

  abrirFormSocio(socio?: any) {
    // this.estadoPosibleSocio = true;
    console.log("abrir form socio", socio);
    socio ? (this.socioEditar = true) : (this.socioEditar = false);
    if (this.socioEditar) {
      this.elIdSocio = socio.id_asociado;
      this.participacionPrevia = socio.participacion;
      this.formSocio.setValue({
        id_asociado: socio.id_asociado,
        fid_asociacion: socio.fid_asociacion,
        fid_empresa: socio.fid_empresa,
        tipo_asociado: socio.tipo_asociado,
        participacion: socio.participacion,
        razon_social: socio.razon_social,
        nit: socio.nit,
        matricula: socio.matricula,
        fecha_inscripcion: moment(socio.fecha_inscripcion).add(5,'hours').format("YYYY-MM-DD"),
      });
      this.formSocio.controls['nit'].disable();
      this.formSocio.controls['matricula'].disable();
    } else {
      this.formSocio.reset();
      this.elIdSocio = null;
      this.participacionPrevia = 0;
      this.formSocio.controls['nit'].enable();
      this.formSocio.controls['matricula'].enable();
    }
    $("#modalSocio").modal("show");
    $(".modal").on("shown.bs.modal", function () {
      $(this).find("[autofocus]").focus();
    });
  }

  confirmarEliminacion(data: any, operacion: string) {
    console.log('eliminanado',data,operacion);
    
    let pregunta = data.id_asociado ? "el Asociado?" : "la Asociación?";
    swal2({
      title: "Advertencia!!!",
      text: `Realmente desea eliminar ` + pregunta,
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d9534f",
      cancelButtonColor: "#f0ad4e",
      customClass: "swal2-popup",
      confirmButtonText: "Confirmar!",
    }).then((result) => {
      if (result.value)
        data.nombre_asociacion
          ? this.crudAsociacion(data, operacion)
          : this.crudSocio(data, operacion);
    });
  }

  crudAsociacion(asociacion?: any, operacion?: string) {
    if(this.formAsociacion.controls['fecha_expedicion'].value > this.maxFecha){
      this.toastr.warning(
        "La Fecha Expedición no puede ser mayor a la fecha actual",
        "Registro Asociacion",
        {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        }
      );
      return false;
    }
    this.cargando = true;
    let laAsociacion = this.formAsociacion.getRawValue();
    laAsociacion.id_asociacion
      ? (laAsociacion.operacion = "U")
      : (laAsociacion.operacion = "I");
    if (operacion == "D") {
      laAsociacion = asociacion;
      laAsociacion.operacion = "D";
      this.elIdAsociacion = null;
    }
    if (!laAsociacion.fid_empresa) laAsociacion.fid_empresa = this.elIdEmpresa;
    laAsociacion.usuario_registro = this.idUsuario;
    this._empresa.crudAsociacion(laAsociacion).subscribe(
      (result: any) => {
        if (!result[0].message.toUpperCase().startsWith("ERROR")) {
          this.toastr.success(result[0].message, "Registro Asociacion", {
            positionClass: "toast-top-right",
            timeOut: 5000,
            progressBar: true,
          });
        } else {
          this.toastr.error(
            "Error al actualizar Asociacion: " + result[0].message,
            "Registro Asociacion",
            {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            }
          );
        }
        this.cargando = false;
        $("#modalAsociacion").modal("hide");
        this.asociacionEditar = false;
        this.listarAsociaciones({
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

  crudSocio(socio?: any, operacion?: string) {
    if(this.formSocio.controls['fecha_inscripcion'].value > this.maxFecha){
      this.toastr.warning(
        "La Fecha Inscripción no puede ser mayor a la fecha actual",
        "Registro Asociado",
        {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        }
      );
      return false;
    }
    // if(!this.estadoPosibleSocio) return false;
    this.cargando = true;
    if (
      (this.dtsSocios.reduce((ac, el) => ac + Number(el.participacion), 0) +
        Number(this.formSocio.controls["participacion"].value) -
        this.participacionPrevia > 100) && operacion !='D'
    ) {
      this.toastr.error(
        "La sumatoria total de las participaciones no deben exceder a 100",
        "Control Asociado",
        { positionClass: "toast-top-right", timeOut: 8000, progressBar: true }
      );
      this.cargando = false;
      return true;
    }
    let elSocio = this.formSocio.getRawValue();
    let laEmpresa = this.dtsEmpresas.filter(
      (f) =>
        Number(f.matricula) ==
        Number(this.formSocio.controls["matricula"].value)
    )
    if(!laEmpresa[0]){
      laEmpresa = this.dtsEmpresas.filter(
        (f) =>
          Number(f.nit) ==
          Number(this.formSocio.controls["nit"].value)
      ).sort((a,b)=>b.id_empresa - a.id_empresa);
    }

    console.log('el socio encontrado',laEmpresa);
    if (!laEmpresa[0] && operacion !='D') {
      this.toastr.error(
        "La empresa aun no se encuentra registrada en nuestro sistema, favor de registrarla previamente",
        "Control Asociado",
        { positionClass: "toast-top-right", timeOut: 8000, progressBar: true }
      );
      this.cargando = false;
      return true;
    } else if(operacion!='D'){
      if(this.dtsSocios.filter(f=>laEmpresa[0].id_empresa == f.fid_empresa)[0] && !elSocio.id_asociado){
        this.toastr.warning(
          `La Empresa ${laEmpresa[0].razon_social} ya conforma ésta asociación`,
          "Registro Asociado",
          {
            positionClass: "toast-top-right",
            timeOut: 8000,
            progressBar: true,
          }
          );
        this.cargando = false;
        return false;
      }
      elSocio.fid_empresa = laEmpresa[0].id_empresa;
    }
    elSocio.id_asociado ? (elSocio.operacion = "U") : (elSocio.operacion = "I");
    if (operacion == "D") {
      elSocio = socio;
      elSocio.operacion = "D";
    }
    if (!elSocio.fid_empresa) elSocio.fid_empresa = this.elIdEmpresa;
    elSocio.usuario_registro = this.idUsuario;
    if(!elSocio.tipo_asociado) elSocio.tipo_asociado = 0;
    elSocio.fid_asociacion = this.elIdAsociacion;
    elSocio.matricula_actual = this.formSocio.controls["matricula"].value
    this._empresa.crudAsociado(elSocio).subscribe(
      (result: any) => {
        if (!result[0].message.toUpperCase().startsWith("ERROR")) {
          this.toastr.success(result[0].message, "Registro Asociado", {
            positionClass: "toast-top-right",
            timeOut: 5000,
            progressBar: true,
          });
        } else {
          this.toastr.error(
            "Error al actualizar Asociado: " + result[0].message,
            "Registro Asociado",
            {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            }
          );
        }
        this.cargando = false;
        $("#modalSocio").modal("hide");
        this.listarSocios({
          opcion: "fid_asociacion",
          id: this.elIdAsociacion,
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

  BuscarSocio() {
    this.cargando = true;
    this._empresa
      .serviciosInterop({
        opcion: "SEPRECdatos",
        matricula: this.formSocio.controls["matricula"].value,
      })
      .subscribe(
        (result: any) => {
          console.log("datos socio", result);
          if (result.error == "0000")
            this.cargarSocioInterop(result.detalle.infoMatricula);
          if (result.error != "0000")
            this.toastr.error(
              "Empresa no encontrada en SEPREC" ,
              "Registro Asociado",
              {
                positionClass: "toast-top-right",
                timeOut: 8000,
                progressBar: true,
              }
            );
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

  async cargarSocioInterop(dts: any) {
    // this.estadoPosibleSocio = true;
    this.formSocio.patchValue({
      // id_asociado:0,
      // fid_asociacion: 180,
      // fid_empresa:0,
      // tipo_asociado:0,
      // participacion: 10,
      razon_social: dts.RazonSocial,
      nit: dts.Nit,
      matricula: dts.IdMatricula,
      fecha_inscripcion: moment(dts.FechaInscripcion).add(5,'hours').format("YYYY-MM-DD"),
    });
    // const estado = await this.validarEstadoSocio(dts.Nit);
    // if(estado.toString().includes('Incompleta')){
    //   this.toastr.warning('La empresa seleccionada no se encuentra registrada debidamente en el sistema SIGA, tal empresa debe completar su registro previamente para integrar alguna asociación', "Error Asociado", {
    //     positionClass: "toast-top-right",
    //     timeOut: 8000,
    //     progressBar: true,
    //   });
    //   this.estadoPosibleSocio = false;
    // }
  }

  validarEstadoSocio(nit:string) {
    return new Promise((resolve, reject) => {
      this._empresa.validarEstadoSocio({opcion:'ESTADO',id:nit}).subscribe(
        (result: any) => {
          console.log("validarEstadoSocio", result);
          if(result.length>0) resolve('Empresa Completa');
          if(result.length==0) resolve('Empresa Incompleta');
        },
        (error) => {
          reject('Empresa Incompleta: '+ error)
        }
      );
    })
  }

  handleInput(event: any) {
    const value = event.target.value;
    const pattern = /^\d+(\.\d{0,2})?$/;
    if (!pattern.test(value)) {
      event.target.value = value.slice(0, -1);
    }
  }

  handleBlur(event:any){
    if(event.originalTarget){
      event.originalTarget.value = Number(event.originalTarget.value).toFixed(2);
    } else{
      if(event.target) event.target.value = Number(event.target.value).toFixed(2);
    }
  }
}
