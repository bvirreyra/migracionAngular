import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import swal2 from "sweetalert2";
import { EmpresaService } from "../empresa.service";

declare var $: any;

@Component({
  selector: "app-empresa-personal",
  templateUrl: "./empresa-personal.component.html",
  styleUrls: ["./empresa-personal.component.css"],
})
export class EmpresaPersonalComponent implements OnInit {
  cargando: boolean = false;
  idUsuario: number;
  // elIdEmpleado:number;
  elIdEmpresa: number;
  elIdPersona: number;
  elIdExperienciaEmpleado: number;

  formEmpleado: FormGroup;
  empleadoEditar: boolean = false;
  formExperienciaEmpleado: FormGroup;
  experienciaEditar: boolean = false;

  dtsPersonal: any[] = [];
  dtsExperienciaEmpleado: any[] = [];

  dtsTiposDocumento: any[] = [];
  dtsTIposUnidad: any[] = [];
  dtsTIposExpedido: any[] = [];

  mostrarExperiencia: boolean = false;
  nombreEmpleado: string;
  mostrarEmpleado:boolean = false;
  mostrarListado:boolean = true;
  dtsGenero:string[] = ['MASCULINO','FEMENINO'];

  minFechaFin:string;
  maxFechaIni:string;

  constructor(
    private _empresa: EmpresaService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private _fun: FuncionesComponent
  ) {
    this.formEmpleado = this.formBuilder.group({
      id_persona: [0],
      numero_documento: ["", Validators.required],
      tipo_documento: ["", Validators.required],
      expedido: [""],
      complemento: [""],
      fecha_nacimiento: ["", Validators.required],
      nacionalidad: ["BOLIVIANA", Validators.required],
      nombres: ["", Validators.required],
      primer_apellido: [""],
      segundo_apellido: [""],
      direccion: [""],
      profesion: ["", Validators.required],
      registro_profesional: [""],
      id_persona_empresa: [0],
      fid_empresa: [0],
      genero: ['',Validators.required]
    });
    this.formExperienciaEmpleado = this.formBuilder.group({
      id_experiencia_empleado: [0],
      fid_persona: [0],
      nombre_empresa: ["", Validators.required],
      objeto_obra: ["", Validators.required],
      monto_obra: ["", [Validators.required,Validators.min(0)]],
      cargo: ["", Validators.required],
      fecha_inicio: [
        moment(new Date()).add(5,'hours').format("YYYY-MM-DD"),
        Validators.required
      ],
      fecha_fin: [moment(new Date()).add(5,'hours').format("YYYY-MM-DD"), Validators.required],
    });
  }

  ngOnInit() {
    this.listarParametros({ opcion: "T", id: 0 });
    const datos = JSON.parse(localStorage.getItem("dts_con")) || {};
    this.elIdEmpresa = Number(datos.s_id_empresa);
    this.idUsuario = Number(datos.s_id_usuario);
    this.listarEmpleados({ opcion: "fid_empresa", id: this.elIdEmpresa });
  }

  listarParametros(opcion) {
    this._empresa.listaParametros(opcion).subscribe(
      (result: any) => {
        this.dtsTiposDocumento = result.filter(
          (f) => f.grupo == "TIPO_DOCUMENTO_IDENTIDAD"
        );
        this.dtsTIposUnidad = result.filter(
          (f) => f.grupo == "TIPO_UNIDAD_EQUIPO"
        );
        this.dtsTIposExpedido = result.filter((f) => f.grupo == "EXPEDIDO");
        console.log("parametros", this.dtsTiposDocumento, this.dtsTIposUnidad);
      },
      (error) =>
        this.toastr.error(error.toString(), "Error desde el servidor", {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        })
    );
  }

  listarEmpleados(opcion) {
    this.cargando = true;
    this._empresa.listaEmpleados(opcion).subscribe(
      (result: any) => {
        console.log("empleados", result);
        this.dtsPersonal = result;
        this._fun.limpiatabla(".dt-empleados");
        setTimeout(() => {
          let confiTable = this._fun.CONFIGURACION_TABLA_V6(
            [50, 100, 150, 200],
            false,
            10,
            [1, "asc"]
          );
          if (!$.fn.dataTable.isDataTable(".dt-empleados")) {
            var table = $(".dt-empleados").DataTable(confiTable);
            this._fun.inputTable(table, [1, 2, 3, 4, 5, 6, 7, 8]);
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
  listarExperienciaEmpleado(opcion) {
    this.cargando = true;
    this._empresa.listaExperienciasEmpleado(opcion).subscribe(
      (result: any) => {
        console.log("experiencia empleado", result);
        this.dtsExperienciaEmpleado = result;
        this._fun.limpiatabla(".dt-experiencia-empleado");
        setTimeout(() => {
          let confiTable = this._fun.CONFIGURACION_TABLA_V6(
            [50, 100, 150, 200],
            false,
            10,
            [1, "asc"]
          );
          if (!$.fn.dataTable.isDataTable(".dt-experiencia-empleado")) {
            var table = $(".dt-experiencia-empleado").DataTable(confiTable);
            this._fun.inputTable(table, [1, 2, 3, 4, 5, 6]);
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
  abrirFormEmpleado(empleado?: any) {
    console.log("abrir form experiencia", empleado);
    this.formEmpleado.get('tipo_documento').valueChanges.subscribe((val)=>{
      console.log(val);
      if(val === 'EXT'){
        this.formEmpleado.controls['expedido'].disable();
        // this.formEmpleado.controls['nacionalidad'].setValue('');
      } else{
        this.formEmpleado.controls['expedido'].enable();
        this.formEmpleado.controls['nacionalidad'].setValue('BOLIVIANA');
      } 
    })
    this.mostrarListado = false;
    empleado ? (this.empleadoEditar = true) : (this.empleadoEditar = false);
    if (this.empleadoEditar) {
      this.elIdPersona = empleado.id_persona;
      this.formEmpleado.setValue({
        id_persona: empleado.id_persona,
        numero_documento: empleado.numero_documento,
        tipo_documento: empleado.tipo_documento,
        expedido: empleado.expedido,
        complemento: empleado.complemento,
        fecha_nacimiento: moment(empleado.fecha_nacimiento).add(5,'hours').format(
          "YYYY-MM-DD"
        ),
        nacionalidad: empleado.nacionalidad,
        nombres: empleado.nombres,
        primer_apellido: empleado.primer_apellido,
        segundo_apellido: empleado.segundo_apellido,
        direccion: empleado.direccion,
        profesion: empleado.profesion,
        registro_profesional: empleado.registro_profesional,
        id_persona_empresa: [0],
        fid_empresa: [0],
        genero:empleado.genero
      });
      this.formEmpleado.controls["numero_documento"].disable();
      this.formEmpleado.controls["tipo_documento"].disable();
      this.formEmpleado.controls["expedido"].disable();
      this.formEmpleado.controls["complemento"].disable();
      this.formEmpleado.controls["fecha_nacimiento"].disable();
      this.formEmpleado.controls["nacionalidad"].disable();
      this.formEmpleado.controls["nombres"].disable();
      this.formEmpleado.controls["primer_apellido"].disable();
      this.formEmpleado.controls["segundo_apellido"].disable();
      this.formEmpleado.controls["genero"].disable();
      this.desplegarExperiencia(empleado);
    } else {
      this.formEmpleado.reset();
      this.formEmpleado.controls["numero_documento"].enable();
      this.formEmpleado.controls["tipo_documento"].enable();
      this.formEmpleado.controls["fecha_nacimiento"].enable();
      this.formEmpleado.controls["genero"].enable();
      this.formEmpleado.controls["nacionalidad"].enable();
      this.formEmpleado.controls["nombres"].enable();
      this.formEmpleado.controls["primer_apellido"].enable();
      this.formEmpleado.controls["segundo_apellido"].enable();
      this.formEmpleado.controls["nacionalidad"].setValue('BOLIVIANA');
      this.formEmpleado.controls["complemento"].enable();
      this.elIdPersona = null;
    }
    // $("#modalEmpleado").modal("show");
    this.mostrarEmpleado = true;
    // $('#modalEmpleado').modal({backdrop: 'static', keyboard: false});
    // $(".modal").on("shown.bs.modal", function () {
    //   $(this).find("[autofocus]").focus();
    // });
  }

  abrirFormExperienciaEmpleado(experiencia?: any) {
    console.log("abrir form experiencia", experiencia);
    this.formExperienciaEmpleado.get('fecha_inicio').valueChanges.subscribe((val)=>{
      this.minFechaFin = moment(val).add(1,'day').format('YYYY-MM-DD')
    })
    this.formExperienciaEmpleado.get('fecha_fin').valueChanges.subscribe((val)=>{
      this.maxFechaIni = moment(val).add(-1,'day').format('YYYY-MM-DD')
    })
    experiencia
      ? (this.experienciaEditar = true)
      : (this.experienciaEditar = false);
    if (this.experienciaEditar) {
      this.elIdExperienciaEmpleado = experiencia.id_experiencia_empleado;
      this.formExperienciaEmpleado.setValue({
        id_experiencia_empleado: experiencia.id_experiencia_empleado,
        fid_persona: experiencia.fid_persona,
        nombre_empresa: experiencia.nombre_empresa,
        objeto_obra: experiencia.objeto_obra,
        monto_obra: experiencia.monto_obra,
        cargo: experiencia.cargo,
        fecha_inicio: moment(experiencia.fecha_inicio).format("YYYY-MM-DD"),
        fecha_fin: moment(experiencia.fecha_fin).add(5,'hours').format("YYYY-MM-DD"),
      });
    } else {
      this.formExperienciaEmpleado.reset();
    }
    // $("#modalExperiencia").modal("show");
    $('#modalExperiencia').modal({backdrop: 'static', keyboard: false});
    $(".modal").on("shown.bs.modal", function () {
      $(this).find("[autofocus]").focus();
    });
  }

  confirmarEliminacion(data: any, operacion: string) {
    let tabla = data.id_experiencia_empleado ? "Experiencia" : "Empleado";
    swal2({
      title: "Advertencia!!!",
      text:
        tabla == "Empleado"
          ? `Realmente desea desvincular al Empleado?`
          : `Realmente desea eliminar la Experiencia?`,
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d9534f",
      cancelButtonColor: "#f0ad4e",
      customClass: "swal2-popup",
      confirmButtonText: "Confirmar!",
    }).then((result) => {
      if (result.value)
        tabla == "Empleado"
          ? this.desvincularEmpleado(data)
          : this.crudExperienciaEmpleado(data, operacion);
    });
  }

  crudEmpleado(empleado?: any, operacion?: string) {
    if(operacion != 'D'){
      if(!this.formEmpleado.controls['primer_apellido'].value && !this.formEmpleado.controls['segundo_apellido'].value){
        this.toastr.warning('Debe llenar por lo menos un apellido', "Registro Emplado", {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        });
        return false
      }
      if(!this.formEmpleado.controls['expedido'].value && !(this.formEmpleado.controls['tipo_documento'].value == 'EXT')){
        this.toastr.warning('Debe llenar Lugar Expedición', "Registro Emplado", {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        });
        return false
      }
    }
    this.cargando = true;
    let elEmpleado = this.formEmpleado.getRawValue();
    elEmpleado.id_persona
      ? (elEmpleado.operacion = "U")
      : (elEmpleado.operacion = "I");
    if (operacion == "D") {
      elEmpleado = empleado;
      elEmpleado.operacion = "D";
    }
    if(this.dtsPersonal.filter(f=>f.numero_documento == this.formEmpleado.controls['numero_documento'].value)[0] && !elEmpleado.id_persona){
      this.toastr.warning('El número documento ya se encuentra registrado previamente', "Registro Emplado", {
        positionClass: "toast-top-right",
        timeOut: 8000,
        progressBar: true,
      });
      this.cargando = false;
      return false
    }
    if (!elEmpleado.fid_empresa || elEmpleado.fid_empresa == '0') elEmpleado.fid_empresa = this.elIdEmpresa;
    elEmpleado.usuario_registro = this.idUsuario;
    this._empresa.crudPersona(elEmpleado).subscribe(
      (result: any) => {
        if (!result[0].message.toUpperCase().startsWith("ERROR")) {
          this.toastr.success(result[0].message, "Registro Emplado", {
            positionClass: "toast-top-right",
            timeOut: 5000,
            progressBar: true,
          });
          if(result[0].message.includes('INSERTADO')){
            this.elIdPersona = result[0].message.split('|')[1];
            this.empleadoEditar = true;
            this.formEmpleado.controls['id_persona'].setValue(this.elIdPersona);
            this.dtsExperienciaEmpleado = [];
            this.nombreEmpleado = [
              elEmpleado.nombres,
              elEmpleado.primer_apellido,
              elEmpleado.segundo_apellido,
            ].join(" ").toUpperCase();
          } 
          if(result[0].message.includes('ACTUALIZADO')){
            //por casos de empleados que ya estan en otras empresas
            this.elIdPersona = elEmpleado.id_persona;
            this.formEmpleado.markAsPristine();
          } 
        } else {
          this.toastr.error(
            "Error al actualizar empleado: " + result[0].message,
            "Registro Empleado",
            {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            }
          );
        }
        this.cargando = false;
        $("#modalEmpleado").modal("hide");
        this.listarEmpleados({ opcion: "fid_empresa", id: this.elIdEmpresa });
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

  crudExperienciaEmpleado(experiencia?: any, operacion?: string) {
    if(this.formExperienciaEmpleado.controls['fecha_inicio'].value >= this.formExperienciaEmpleado.controls['fecha_fin'].value && operacion!='D'){
      this.toastr.warning(
        'La Fecha Desde no puede ser meayor a Fecha Hasta',
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
    let laExperiencia = this.formExperienciaEmpleado.getRawValue();
    laExperiencia.id_experiencia_empleado
      ? (laExperiencia.operacion = "U")
      : (laExperiencia.operacion = "I");
    if (operacion == "D") {
      laExperiencia = experiencia;
      laExperiencia.operacion = "D";
    }
    if (!laExperiencia.fid_persona)
      laExperiencia.fid_persona = this.elIdPersona;
    laExperiencia.usuario_registro = this.idUsuario;
    this._empresa.crudExperienciaEmpleado(laExperiencia).subscribe(
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
        this.mostrarExperiencia = true
        this.listarExperienciaEmpleado({
          opcion: "fid_persona",
          id: this.elIdPersona,
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

  buscarPersonaInterop() {
    if (
      !this.formEmpleado.controls["numero_documento"].value ||
      !this.formEmpleado.controls["fecha_nacimiento"].value
    ) {
      this.toastr.warning(
        "Debe ingresar numero documento y fecha nacimiento valida",
        "Control Persona",
        { positionClass: "toast-top-right", timeOut: 8000, progressBar: true }
      );
      return true;
    }
    this.cargando = true; //aun no se tiene serviio de SEGIP
    const fechaFormat = moment(
      this.formEmpleado.controls["fecha_nacimiento"].value
    ).add(5,'hours').format("DD/MM/YYYY");
    // this._empresa
    //   .serviciosInterop({
    //     opcion: "SEGIPpersonas",
    //     ci: this.formEmpleado.controls["numero_documento"].value,
    //     fecha: fechaFormat,
    //   })
    //   .subscribe(
    //     // fecha:'25/07/1981'}).subscribe(
    //     (result: any) => {
    //       console.log("datos persona", result);
    //       if (result.ConsultaDatoPersonaEnJsonResult) {
    //         if(result.ConsultaDatoPersonaEnJsonResult.CodigoRespuesta === "2"){
    //           const laPersona =
    //             result.ConsultaDatoPersonaEnJsonResult.DatosPersonaEnFormatoJson;
    //           this.pasarPersonaSEGIP(JSON.parse(laPersona));
    //         }else{
    //           this.buscarPersona();
    //         }
    //       } else {
    //         // this.formEmpleado.reset();
    //         this.buscarPersona();
    //       }
    //       this.cargando = false;
    //     },
    //     (error) => {
    //       this.toastr.error(error.toString(), "Error desde el servidor", {
    //         positionClass: "toast-top-right",
    //         timeOut: 8000,
    //         progressBar: true,
    //       });
    //       this.cargando = false;
    //     }
    //   );

    //mandando directo a buscar en base interna sin INTEROP SEGIP
    this.buscarPersona();
  }

  pasarPersonaSEGIP(data: any) {
    console.log(data);
    this.toastr.success("Persona encontrada en SEGIP", "Interoperabilidad", {
      positionClass: "toast-top-right",
      timeOut: 8000,
      progressBar: true,
    });
    if (data.ComplementoVisible == 1)
      this.formEmpleado.controls["complemento"].setValue(data.Complemento);
    this.formEmpleado.controls["primer_apellido"].setValue(data.PrimerApellido);
    this.formEmpleado.controls["segundo_apellido"].setValue(
      data.SegundoApellido
    );
    this.formEmpleado.controls["nombres"].setValue(data.Nombres);
    this.formEmpleado.controls["nacionalidad"].setValue(
      data.LugarNacimientoPais
    );
  }

  buscarPersona() {
    this.cargando = true;
    console.log("buscarpersona", this.formEmpleado);
    this._empresa
      .listaPersonas({
        opcion: "numero_documento",
        id: `'${this.formEmpleado.controls["numero_documento"].value}'`,
      })
      .subscribe(
        (result: any) => {
          console.log("datos persona", result);
          // this.reemplazarDatosFundeempresa( result.detalle.infoMatricula);
          result.length > 0
            ? this.cargarDatosPersona(result[0])
            : this.habilitarPersona();
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

  cargarDatosPersona(persona: any) {
    console.log('la person',persona);
    
    this.formEmpleado.patchValue({
      id_persona: persona.id_persona,
      numero_documento: persona.numero_documento,
      tipo_documento: persona.tipo_documento,
      expedido: persona.expedido,
      complemento: persona.complemento,
      fecha_nacimiento: moment(persona.fecha_nacimiento).add(5,'hours').format("YYYY-MM-DD"),
      nacionalidad: persona.nacionalidad,
      nombres: persona.nombres,
      primer_apellido: persona.primer_apellido,
      segundo_apellido: persona.segundo_apellido,
      direccion: persona.direccion,
      genero:persona.genero,
      profesion:persona.profesion,
      registro_profesional:persona.registro_profesional
    });
  }

  habilitarPersona() {
    this.toastr.warning(
      "Persona no encontrada, por favor ingrese todos los datos del formulario",
      "Control Persona",
      { positionClass: "toast-top-right", timeOut: 10000, progressBar: true }
    );
    $("#nacionalidad, #nombres, #primer_apellido, #segundo_apellido").attr(
      "readonly",
      false
    );
    // this.formEmpleado.controls["tipo_documento"].setValue("CI");
    this.elIdPersona = 0;
  }

  desplegarExperiencia(empleado: any) {
    console.log('mostrando exper',empleado);
    
    this.elIdPersona = empleado.id_persona;
    this.mostrarExperiencia = true;
    this.nombreEmpleado = [
      empleado.nombres,
      empleado.primer_apellido,
      empleado.segundo_apellido,
    ].join(" ");
    this.listarExperienciaEmpleado({
      opcion: "fid_persona",
      id: this.elIdPersona,
    });
    setTimeout(() => {
      const obj = document.getElementById("grilla-experiencia");
      obj.scrollIntoView({ block: "start", behavior: "smooth" });
    }, 300);
  }

  desvincularEmpleado(dts) {
    this.cargando = true;
    dts.operacion = "D";
    dts.usuario_registro = this.idUsuario;
    console.log("desvincular", dts);
    this._empresa
      .desvincular({
        opcion: "id_persona_empresa",
        id: dts.id_persona_empresa,
        usuario_registro: this.idUsuario,
      })
      .subscribe(
        (result: any) => {
          this.toastr.success(result[0].message, "Desvincular Empleado", {
            positionClass: "toast-top-right",
            timeOut: 5000,
            progressBar: true,
          });
          this.listarEmpleados({ opcion: "fid_empresa", id: this.elIdEmpresa });
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
