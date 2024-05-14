import { Component, OnInit } from "@angular/core";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import * as moment from "moment";
import { nanoid } from "nanoid";
import { ToastrService } from "ngx-toastr";
import swal2 from "sweetalert2";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { EmpresaService } from "../empresa.service";

declare var $: any;

@Component({
  selector: "app-formulario-empresa",
  templateUrl: "./formulario-empresa.component.html",
  styleUrls: ["./formulario-empresa.component.css"],
})
export class FormularioEmpresaComponent implements OnInit {
  idUsuario: number;
  elIdEmpresa: number;
  cargando: boolean = false;
  gestion: number = new Date().getFullYear();
  dtsFormularios: any[] = [];
  elIdFormulario: number;
  contenido: any;
  empresa: any;
  fase: string;
  // dtsExpEmpALL:any[]=[];
  totalDolares: number;
  totalBolivianos: number;

  dtsPersonal: any[] = [];
  elIdEmpleado: number;

  dtsEquipos: any[] = [];
  dtsExperienciaEmpresa: any[] = [];
  dtsExperienciaEmpleado: any[] = [];

  nombreNuevoForm: string;
  estadoForm: string;
  preFormulario: any;

  dtsRepresentantes: any[] = [];
  dtsAsociaciones: any[] = [];
  asociacion: any;
  mostrarAsociacion: boolean = false;
  dtsAsociados: any[] = [];
  // marcadosExpEmpresa:number[]=[];

  dtsPersonalALL: any[] = [];
  dtsCargos: any[] = [];
  elIdAsociacion: number = null;
  // existePendientes:boolean=false;

  existePendientes: boolean = false;

  dtsExpEmpGeneral: any[] = [];
  dtsExpEmpEspecifica: any[] = [];
  mostrarExperiencia: string;
  dtsExpPerGeneral: any[] = [];
  dtsExpPerEspecifica: any[] = [];
  mostrarExperienciaEmpleado: string;

  dtsPermanentes: any[] = [];
  dtsRequeridos: any[] = [];
  mostrarEquipos: string;

  dtsArchivos: any[] = [];

  public file_empty: File;
  public rutaArchivo: string = "";
  public nombreArchivo: string = "";
  public inputArchivo = null;
  public archivoModel: any = {
    TIPO_DOCUMENTO: "",
    CODIGO: "",
    FILE: null,
    NOM_FILE: "",
  };

  tipoArchivos: number = 1;
  dtsMostrar: any;

  toggleVerForms: boolean = true;

  codigoSave: string;
  dtsPersonalActivo: any[] = [];
  elIdrep: string;

  tittleAvanzar: string = 'Experiencia de la Empresa"';
  tittleRetroceder: string = "";
  dtsRepresentantesAsociacion: any[] = [];
  dtsRepresentantesAsociado: any[] = [];
  asociado: any = {};

  proyecto: {
    nombre: string;
    entidad: string;
    monto: number;
    monto_literal: string;
    validez: number;
  } = { nombre: "", entidad: "", monto: 0.0, monto_literal: "", validez: 0 };

  conAsociacion: boolean = false;

  elRLAsociacion: any;
  nuevorep = false;

  constructor(
    private _empresa: EmpresaService,
    private toastr: ToastrService,
    private _fun: FuncionesComponent,
    private _autenticacion: AutenticacionService
  ) {}

  ngOnInit() {
    const datos = JSON.parse(localStorage.getItem("dts_con")) || {};
    this.elIdEmpresa = Number(datos.s_id_empresa);
    this.idUsuario = Number(datos.s_id_usuario);
    this.listarFormulario({ opcion: "fid_empresa", id: this.elIdEmpresa });
    this.listarRepresentantes({
      opcion: "rl.fid_empresa",
      id: this.elIdEmpresa,
    });
    this.listarAsociaciones({ opcion: "fid_empresa", id: this.elIdEmpresa });
    this.listarParametros({ opcion: "T", id: 0 });
    this.cargarEmpleados();
    // this.listarPersonal({opcion:'fid_empresa',id:this.elIdEmpresa})
  }

  listarFormulario(opcion) {
    this.cargando = true;
    // this.existePendientes = false;
    this._empresa.listaFormularios(opcion).subscribe(
      (result: any) => {
        this.dtsFormularios = result;
        this.dtsFormularios.map((e) => {
          try {
            e.contenido_json = JSON.parse(e.contenido);
          } catch (error) {
            e.contenido_json = e.contenido;
          }
          // if(e.estado === 'INICIADO') this.existePendientes = true;
          return e;
        });
        console.log("formularios", this.dtsFormularios);
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

  cargarEmpleados() {
    let socios = `${this.elIdEmpresa}`;
    this._empresa
      .armarPreFormulario({ id: this.elIdEmpresa, socios })
      .subscribe(
        (result: any) => {
          this.dtsPersonalALL = result[0].contenido_json.empleados || [];
          console.log("personal activo", this.dtsPersonalALL);
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

  revisaCambios() {
    let socios = `${this.elIdEmpresa}`;

    if (Object.keys(this.contenido.datos_asociacion || {}).length > 0) {
      this.contenido.datos_asociacion.asociados.forEach((s) => {
        socios += `,${s.fid_empresa}`;
      });
    }
    setTimeout(() => {
      this._empresa
        .armarPreFormulario({ id: this.elIdEmpresa, socios })
        .subscribe(
          (result: any) => {
            console.log("revisando cambios", result[0].contenido_json);
            this.dtsExperienciaEmpresa =
              result[0].contenido_json.experiencias.total || [];
            this.contenido.experiencias.total =
              result[0].contenido_json.experiencias.total;
            this.dtsExpEmpGeneral.forEach((eg) => {
              this.dtsExperienciaEmpresa.filter(
                (f) => f.id_experiencia_empresa == eg.id_experiencia_empresa
              )[0].general = true;
            });
            this.dtsExpEmpEspecifica.forEach((ee) => {
              this.dtsExperienciaEmpresa.filter(
                (f) => f.id_experiencia_empresa == ee.id_experiencia_empresa
              )[0].especifica = true;
            });

            this.contenido.equipos_trabajo.total =
              result[0].contenido_json.equipos_trabajo.total;
            this.dtsEquipos =
              result[0].contenido_json.equipos_trabajo.total || [];
            this.dtsRequeridos.forEach((eg) => {
              this.dtsEquipos.filter(
                (f) => f.id_equipo_trabajo == eg.id_equipo_trabajo
              )[0].requerido = true;
            });
            this.dtsPermanentes.forEach((ee) => {
              this.dtsEquipos.filter(
                (f) => f.id_equipo_trabajo == ee.id_equipo_trabajo
              )[0].permanente = true;
            });
          },
          (error) => {
            this.toastr.error(
              error.toString(),
              "Error desde el servidor armarPreFormulario",
              {
                positionClass: "toast-top-right",
                timeOut: 8000,
                progressBar: true,
              }
            );
          }
        );
    }, 1000);
  }

  nuevoFormulario(f?: any) {
    this.nombreNuevoForm = null;
    this.estadoForm = null;
    $("#modalNuevoForm").modal("show");
    $(".modal").on("shown.bs.modal", function () {
      $(this).find("[autofocus]").focus();
    });
  }

  iniciarFormulario(tipo: string) {
    // this.nombreNuevoForm = (<HTMLInputElement>document.querySelector('#nombreForm')).value;
    if (this.nombreNuevoForm.length < 10) {
      this.toastr.warning(
        "EL nombre de formulario debe contener 10 caracteres como mínimo",
        "Control Formulario",
        {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        }
      );
      return false;
    }
    if (tipo == "uno") this.estadoForm = "INICIADO";
    if (tipo == "dos") {
      this.limpiarVariable();
      this.preFormulario = {};
      this.armarContenido();
      $("#modalNuevoForm").modal("hide");
    }
  }

  limpiarVariable() {
    this.contenido = null;
    this.empresa = null;
    this.asociacion = null;
    this.asociado = {};
    this.proyecto = {
      nombre: "",
      entidad: "",
      monto: 0.0,
      monto_literal: "",
      validez: 0,
    };
  }

  armarContenido() {
    let socios = `${this.elIdEmpresa}`;
    this._empresa
      .armarPreFormulario({ id: this.elIdEmpresa, socios })
      .subscribe(
        (result: any) => {
          this.preFormulario = result[0].contenido_json;
          this.preFormulario.empleados = []; //esto para setear sin empleados al inicar nuevo form
          // console.log('preFormulario',result);
          this.cargarFormulario(this.preFormulario);
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

  listarRepresentantes(opcion: any) {
    this._empresa.listaRepresentantes(opcion).subscribe(
      (result: any) => {
        console.log("representantes", result, opcion);
        if (opcion.opcion == "rl.fid_empresa") this.dtsRepresentantes = result;
        if (opcion.opcion == "a.fid_asociacion")
          this.dtsRepresentantesAsociacion = result;
        if (opcion.opcion == "a.id_asociado")
          this.dtsRepresentantesAsociado = result;
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor", {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        });
      }
    );
  }

  listarAsociaciones(opcion: any) {
    this._empresa.listaAsociaciones(opcion).subscribe(
      (result: any) => {
        console.log("asociaciones", result);
        if ((opcion.opcion = "fid_empresa"))
          this.dtsAsociaciones = result.filter((f) => f.tipo_asociado == 1);
        if ((opcion.opcion = "id_asociacion")) this.dtsAsociados = result;
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

  listarExperienciasEmpresa(opcion: any) {
    this._empresa.listaExperienciasEmpresa(opcion).subscribe(
      (result: any) => {
        console.log(
          "experiencias de socios",
          result,
          this.dtsExperienciaEmpresa
        );
        if (result.length > 1) {
          result.forEach((e) => {
            if (
              !this.dtsExperienciaEmpresa.filter(
                (f) => f.id_experiencia_empresa == e.id_experiencia_empresa
              )[0]
            ) {
              this.dtsExperienciaEmpresa.push(e);
            }
          });
        }
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor", {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        });
      }
    );
  }

  listarEmpleados(opcion: any) {
    this._empresa.listaEmpleados(opcion).subscribe(
      (result: any) => {
        console.log("personal de socios", result, this.dtsPersonalALL);
        if (result[0].contenido_json)
          result = result[0].contenido_json.empleados;
        if (result.length > 1) {
          result.forEach((p) => {
            if (
              !this.dtsPersonalALL.filter(
                (f) => f.id_persona == p.id_persona
              )[0]
            ) {
              this.dtsPersonalALL.push(p);
            }
          });
        }
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor", {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        });
      }
    );
  }

  listarEquipos(opcion: any) {
    this._empresa.listaEquiposTrabajo(opcion).subscribe(
      (result: any) => {
        console.log("equipos de socios", result);
        if (result.length > 1) {
          result.forEach((p) => {
            if (
              !this.dtsEquipos.filter(
                (f) => f.id_equipo_trabajo == p.id_equipo_trabajo
              )[0]
            ) {
              this.dtsEquipos.push(p);
            }
          });
        }
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor", {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        });
      }
    );
  }

  actualizarRepresentante() {
    const sel = (<HTMLInputElement>(
      document.querySelector("#representanteNombre")
    )).value;
    if (sel.length < 4) return false;
    // console.log({sel});
    const elRepresentante = this.dtsRepresentantes.filter(
      (f) => f.nombre === sel
    )[0];
    if (!elRepresentante) return true;
    this.empresa.representante_legal = {
      nombreCompleto: elRepresentante.nombre,
      persona: {
        nombre: elRepresentante.nombre,
        documento_identidad:
          elRepresentante.numero_documento || elRepresentante.num_id,
        fecha_nacimiento: elRepresentante.fecha_nacimiento,
        lugar_expedicion_documento: elRepresentante.expedido,
        nombres: elRepresentante.nombres,
        primer_apellido: elRepresentante.primer_apellido,
        segundo_apellido: elRepresentante.segundo_apellido,
        direccion: elRepresentante.direccion,
        nacionalidad: elRepresentante.nacionalidad,
      },
      poder: {
        nro_testimonio: elRepresentante.poder_testimonio,
        lugar_emision: elRepresentante.poder_lugar_emision,
        fecha_expedicion: elRepresentante.poder_fecha_expedicion,
      },
    };
    this.contenido.datos_empresa.representante_legal =
      this.empresa.representante_legal;
    this.crudFormulario("U", null);
  }

  actualizarRepresentanteAsociacion() {
    const sel = (<HTMLInputElement>(
      document.querySelector("#representanteNombreAsociacion")
    )).value;
    if (this.nuevorep) return true;
    console.log("id_rep_legal asociacion", sel);
    const elRepresentante = this.dtsRepresentantesAsociacion.filter(
      (f) => f.id_representante_legal == sel
    )[0];
    if (!elRepresentante) return true;
    this.asociacion.asociado.representante_legal = {
      nombreCompleto: elRepresentante.nombre,
      persona: {
        nombre: elRepresentante.nombre,
        documento_identidad:
          elRepresentante.numero_documento || elRepresentante.num_id,
        fecha_nacimiento: elRepresentante.fecha_nacimiento,
        lugar_expedicion_documento: elRepresentante.expedido,
        nombres: elRepresentante.nombres,
        primer_apellido: elRepresentante.primer_apellido,
        segundo_apellido: elRepresentante.segundo_apellido,
        direccion: elRepresentante.direccion,
        nacionalidad: elRepresentante.nacionalidad,
      },
      poder: {
        nro_testimonio: elRepresentante.poder_testimonio,
        lugar_emision: elRepresentante.poder_lugar_emision,
        fecha_expedicion: moment(elRepresentante.poder_fecha_expedicion).format(
          "YYYY-MM-DD"
        ),
      },
    };
    this.contenido.datos_asociacion.asociado.representante_legal =
      this.asociacion.asociado.representante_legal;
    this.elRLAsociacion = this.asociacion.asociado.representante_legal;
    this.crudFormulario("U", null);
  }

  actualizarAsociacion() {
    const sel = (<HTMLInputElement>document.querySelector("#asociacionNombre"))
      .value;
    if (sel.length < 6) return true;
    // console.log({sel});
    const laAsociacion = this.dtsAsociaciones.filter(
      (f) => f.nombre_asociacion === sel
    )[0];
    this.listarAsociaciones({
      opcion: "id_asociacion",
      id: laAsociacion.id_asociacion,
    });

    this.listarRepresentantes({
      opcion: "a.fid_asociacion",
      id: laAsociacion.id_asociacion,
    });

    setTimeout(() => {
      let asociados = [];
      this.dtsAsociados.forEach((a) => {
        let obj = {
          id_asociado: a.id_asociado,
          tipo_asociado: a.tipo_asociado,
          participacion: a.participacion,
          estado: "ACTIVO",
          fid_empresa: a.fid_empresa,
          fid_asociacion_accidental: a.id_asociacion,
          razon_social: a.razon_social,
          nit: a.nit,
          nro_matricula: a.matricula,
          fecha_inscripcion: a.fecha_inscripcion,
        };
        asociados.push(obj);
      });

      this.asociacion = {
        id_asociacion_accidental: laAsociacion.id_asociacion,
        nombre_asociacion: laAsociacion.nombre_asociacion,
        nro_testimonio: laAsociacion.testimonio,
        lugar_testimonio: laAsociacion.lugar_testimonio,
        fecha_expedicion: moment(laAsociacion.fecha_expedicion)
          .add(5, "hours")
          .format("YYYY-MM-DD"),
        asociados: asociados,
        asociado: {
          id_asociado: laAsociacion.id_asociado,
          tipo_asociado: laAsociacion.tipo_asociado,
          participacion: laAsociacion.participacion,
          estado: "ACTIVO",
          fid_empresa: laAsociacion.fid_empresa,
          fid_asociacion_accidental: laAsociacion.id_asociacion,
          razon_social: laAsociacion.razon_social,
          nit: laAsociacion.nit,
          nro_matricula: laAsociacion.matricula,
          fecha_inscripcion: laAsociacion.fecha_inscripcion,
        },
      };
      this.contenido.datos_asociacion = this.asociacion;
      this.elIdAsociacion = laAsociacion.id_asociacion;
      this.listarExperienciasEmpresa({
        opcion: "ASOCIACION",
        id: this.contenido.datos_asociacion.id_asociacion_accidental,
      });
      this.listarEmpleados({
        opcion: "ASOCIACION",
        id: this.contenido.datos_asociacion.id_asociacion_accidental,
      });
      this.listarEquipos({
        opcion: "ASOCIACION",
        id: this.contenido.datos_asociacion.id_asociacion_accidental,
      });
      this.crudFormulario("U", null);
    }, 800);
  }

  cambiarAsociado() {
    console.log("entrando");
    const sel = (<HTMLInputElement>document.querySelector("#asociadoNombre"))
      .value;
    if (sel.length < 4) return false;
    const elAsociado = this.dtsAsociados.filter(
      (f) => f.razon_social === sel
    )[0];
    if (!elAsociado) return true;
    this.asociado = {
      id_asociado: elAsociado.id_asociado,
      razon_social: elAsociado.razon_social,
      nit: elAsociado.nit,
      matricula: elAsociado.matricula,
      fecha_inscripcion: moment(elAsociado.fecha_inscripcion)
        .add(5, "hours")
        .format("YYYY-MM-DD"),
    };
    console.log(this.asociado);
    this.listarRepresentantes({
      opcion: "a.id_asociado",
      id: this.asociado.id_asociado,
    });
  }

  cambiarRepresentanteAsociado() {
    console.log("ingrsa cambair rep");

    let sel = (<HTMLInputElement>document.querySelector("#representanteSocio"))
      .value;
    console.log("el input id_rep_legal", sel, this.dtsRepresentantesAsociado);

    const elRepresentante = this.dtsRepresentantesAsociado.filter(
      (f) => f.id_representante_legal == sel
    )[0];
    if (!elRepresentante) return true;
    this.asociado.representante_legal = {
      id_representante_legal: elRepresentante.id_representante_legal,
      nombreCompleto: elRepresentante.nombre,
      persona: {
        nombre: elRepresentante.nombre,
        documento_identidad:
          elRepresentante.numero_documento || elRepresentante.num_id,
        fecha_nacimiento: elRepresentante.fecha_nacimiento,
      },
      poder: {
        nro_testimonio: elRepresentante.poder_testimonio,
        lugar_emision: elRepresentante.poder_lugar_emision,
        fecha_expedicion: elRepresentante.poder_fecha_expedicion
          ? moment(elRepresentante.poder_fecha_expedicion)
              .add(5, "hours")
              .format("YYYY-MM-DD")
          : null,
      },
    };
    console.log("ya el asociado", this.asociado);
    this.contenido.datos_asociacion.asociados.filter(
      (f) => f.id_asociado == this.asociado.id_asociado
    )[0]
      ? (this.contenido.datos_asociacion.asociados.filter(
          (f) => f.id_asociado == this.asociado.id_asociado
        )[0].representante_legal = this.asociado.representante_legal)
      : this.contenido.datos_asociacion.asociados.push(
          this.copiaProfunda(this.asociado)
        );
    setTimeout(() => {
      this.crudFormulario("U", null);
    }, 50);
    setTimeout(() => {
      $("#modalRepAsociado").modal("hide");
      (<HTMLInputElement>document.querySelector("#representanteSocio")).value =
        "";
    }, 1000);
  }

  actualizarRepresentanteAsociado() {
    const sel = (<HTMLInputElement>(
      document.querySelector("#representanteSocio")
    )).value;
    console.log("id_rep_legal", sel);

    const elRepresentante = this.dtsRepresentantesAsociado.filter(
      (f) => f.id_representante_legal == sel
    )[0];
    if (!elRepresentante) return true;
    this.asociado.representante_legal = {
      id_representante_legal: elRepresentante.id_representante_legal,
      persona: {
        nombre: elRepresentante.nombre,
        documento_identidad:
          elRepresentante.numero_documento || elRepresentante.num_id,
        fecha_nacimiento: elRepresentante.fecha_nacimiento,
      },
      poder: {
        nro_testimonio: elRepresentante.poder_testimonio,
        lugar_emision: elRepresentante.poder_lugar_emision,
        fecha_expedicion: moment(elRepresentante.poder_fecha_expedicion)
          .add(5, "hours")
          .format("YYYY-MM-DD"),
      },
    };
    console.log(this.asociado);
    this.contenido.datos_asociacion.asociados.filter(
      (f) => f.id_asociado == this.asociado.id_asociado
    )[0]
      ? (this.contenido.datos_asociacion.asociados.filter(
          (f) => f.id_asociado == this.asociado.id_asociado
        )[0].representante_legal = this.asociado.representante_legal)
      : this.contenido.datos_asociacion.asociados.push(
          this.copiaProfunda(this.asociado)
        );
    setTimeout(() => {
      this.crudFormulario("U", null);
    }, 50);
  }

  cargarRepresentatesAsociado(socio: any) {
    console.log("el soooocio", socio);
    this.asociado = socio;
    this.listarRepresentantes({
      opcion: "a.id_asociado",
      id: this.asociado.id_asociado,
    });
    // if(this.asociado.representante_legal) {
    //   (<HTMLInputElement>document.querySelector("#representanteSocio")).value = this.asociado.representante_legal.persona.nombre;
    // }
    $("#modalRepAsociado").modal("show");
    $(".modal").on("shown.bs.modal", function () {
      $(this).find("[autofocus]").focus();
    });
  }

  cargarFormulario(f: any) {
    console.log("cargando el form", f);

    this.contenido = null;
    this.fase = "";
    // this.dtsAsociaciones = [];
    this.asociacion = {};
    this.cargando = true;
    this.toggleVerForms = false;
    this.asociado = {};
    setTimeout(() => {
      this.elIdFormulario = f.id_formulario;
      this.contenido = f.contenido_json || this.preFormulario;
      console.log(
        "cargando form",
        this.elIdEmpresa,
        this.contenido,
        this.elIdFormulario
      );
      this.empresa = this.contenido.datos_empresa;
      this.empresa.nro_matricula = this.empresa.matricula;
      if (this.contenido.proyecto) this.proyecto = f.contenido.proyecto;
      if (!this.empresa.representante_legal)
        this.empresa.representante_legal = {
          persona: { nombre: "" },
          poder: {},
        };
      this.fase = "generales";
      // this.dtsExpEmpALL = this.contenido.experiencias.generales;
      this.dtsExperienciaEmpresa =
        this.contenido.experiencias.total ||
        this.contenido.experiencias.generales ||
        [];
      this.dtsExpEmpGeneral = this.contenido.experiencias.generales || [];
      this.dtsExpEmpEspecifica = this.contenido.experiencias.especificas || [];
      // this.dtsPersonalALL = this.contenido.empleados;
      this.dtsPersonal = this.contenido.empleados.filter((f) => f.id_empleado);
      //todo: para adecuar foms antiguos copiados
      // if (this.idUsuario === 2000) {
      //   this.dtsPersonal.forEach((p) => {
      //     if (!p.experiencias.total) {
      //       p.idrep = nanoid(8);
      //       p.experiencias.total = this.dtsPersonalALL.filter(
      //         (f) => f.numero_documento == p.persona.documento_identidad
      //       )[0].experiencias.total;
      //       p.experiencias.generales.forEach((g) => {
      //         g.general = true;
      //         p.experiencias.total.filter(
      //           (f) => f.id_experiencia_empleado == g.id_experiencia_empleado
      //         )[0].general = true;
      //       });
      //       p.experiencias.especificas.forEach((e) => {
      //         e.especifica = true;
      //         p.experiencias.total.filter(
      //           (f) => f.id_experiencia_empleado == e.id_experiencia_empleado
      //         )[0].especifica = true;
      //       });
      //     }
      //   });
      // }
      this.dtsEquipos =
        this.contenido.equipos_trabajo.total ||
        this.contenido.equipos_trabajo.permanente ||
        [];
      this.dtsPermanentes = this.contenido.equipos_trabajo.permanente || [];
      this.dtsRequeridos = this.contenido.equipos_trabajo.requerido || [];
      this.estadoForm = f.estado || "INICIADO";
      this.codigoSave = f.codigo;
      if (Object.keys(this.contenido.datos_asociacion || {}).length > 0) {
        this.asociacion = this.contenido.datos_asociacion;
        this.elRLAsociacion =
          this.contenido.datos_asociacion.asociado.representante_legal;
        if(this.elRLAsociacion) this.elRLAsociacion.poder.fecha_expedicion = moment(
          this.elRLAsociacion.poder.fecha_expedicion
        )
          .add(5, "hours")
          .format("YYYY-MM-DD");
        this.asociacion.fecha_expedicion = moment(
          this.asociacion.fecha_expedicion
        )
          .add(5, "hours")
          .format("YYYY-MM-DD");
        this.listarAsociaciones({
          opcion: "id_asociacion",
          id:
            this.contenido.datos_asociacion.id_asociacion_accidental ||
            this.contenido.datos_asociacion.id_asociacion ||
            0,
        });
        this.listarExperienciasEmpresa({
          opcion: "ASOCIACION",
          id: this.contenido.datos_asociacion.id_asociacion_accidental,
        });
        this.listarEmpleados({
          opcion: "ASOCIACION",
          id: this.contenido.datos_asociacion.id_asociacion_accidental,
        });
        this.listarEquipos({
          opcion: "ASOCIACION",
          id: this.contenido.datos_asociacion.id_asociacion_accidental,
        });
        this.elIdAsociacion =
          this.contenido.datos_asociacion.id_asociacion_accidental;
        this.listarRepresentantes({
          opcion: "a.fid_asociacion",
          id: this.elIdAsociacion,
        });
      }
      if (f.nombre) this.nombreNuevoForm = f.nombre;
      if (this.idUsuario === 2000) {
        //para poner en formato actual los forms antiguos y poder editar
        this.estadoForm = "INICIADO";
        let especificas: number[] = [];
        this.dtsExpEmpEspecifica.forEach((e) => {
          e.especifica = true;
          especificas.push(e.id_experiencia_empresa);
        });
        this.dtsExperienciaEmpresa.map((e) => {
          e.general = true;
          if (especificas.includes(e.id_experiencia_empresa))
            e.especifica = true;
          return e;
        });

        let requeridos: number[] = [];
        this.dtsRequeridos.forEach((e) => {
          e.requerido = true;
          requeridos.push(e.id_equipo_trabajo);
        });
        this.dtsEquipos.map((e) => {
          e.permanente = true;
          if (requeridos.includes(e.id_equipo_trabajo)) e.requerido = true;
          return e;
        });
      }

      //para cargar en totales
      if (this.estadoForm != "FINALIZADO" || this.idUsuario === 2000)
        this.revisaCambios();
      // this.dtsExpEmpEspecifica.forEach(e => {
      //   this.marcadosExpEmpresa.push(e.id_experiencia_empresa)
      // });
      if (!this.elIdFormulario) this.crudFormulario("I", null);
      setTimeout(() => {
        this.cambiarFase("generales");
        this.cargando = false;
        // const tl = document.getElementById('timeline');
        // tl.scrollIntoView({block: "start", behavior: "smooth"});
      }, 200);
    }, 200);
  }

  validarFormulario() {
    let alertas = [];
    if (
      !this.contenido.empleados.filter((f) =>
        (f.cargo_actual || [""]).includes("ESPECIALISTA")
      )[0]
    )
      alertas.push(
        "Debe contar con un personal que tenga el cargo de ESPECIALISTA"
      );
    if (this.contenido.empleados.filter((f) => f.cargo_actual).length < 2)
      alertas.push("Debe contar con dos emplados como mínimo");
    if (!this.contenido.datos_empresa.representante_legal)
      alertas.push("Debe asignar un representante lagal para la empresa");
    if (this.contenido.datos_empresa.representante_legal) {
      if (!this.contenido.datos_empresa.representante_legal.persona.nombre) {
        alertas.push("Debe asignar un representante lagal para la empresa");
      }
    }
    if (Object.keys(this.contenido.datos_asociacion || {}).length > 0) {
      this.contenido.datos_asociacion.asociados.forEach((a) => {
        if (!a.representante_legal) {
          alertas.push(
            "Debe asignar un representante lagal para cada ASOCIADO"
          );
        }
      });
    }
    if(this.contenido.datos_asociacion){
      if(this.contenido.datos_asociacion.asociado){
        if(!this.contenido.datos_asociacion.asociado.representante_legal) alertas.push('Debe asiganr un Representante Legal para la Asociación')
      }
    }
    if (
      this.contenido.empleados.filter(
        (f) =>
          (!f.cargo_actual && f.id_empleado) ||
          f.cargo_actual == "Seleccione..."
      ).length > 0
    )
      alertas.push(
        "Todos los empleados deben contar con un CARGO seleccionado"
      );
    // if (this.contenido.experiencias.especificas.length == 0)
    //   alertas.push(
    //     "Se debe cargar experiencias generales y específicas para la empresa"
    //   );
    // if (this.dtsPermanentes.length == 0 && this.dtsRequeridos.length == 0)
    //   alertas.push("Se debn especificar equipos permanentes y a requerimiento");
    if (!this.contenido.proyecto)
      alertas.push("Debe registrar los datos del Proyecto");
    if (this.contenido.proyecto) {
      const proy = this.contenido.proyecto;
      if (
        !proy.monto ||
        !proy.nombre ||
        !proy.entidad ||
        !proy.validez ||
        !proy.monto_literal
      )
        alertas.push("Debe registrar los datos del Proyecto");
    }
    // try {
    //   this.contenido.empleados.forEach((e) => {
        // !e.experiencias.especificas
    //       ? null
    //       : e.experiencias.especificas.length == 0
    //       ? alertas.push(
    //           "Todo el personal seleccionado debe contar con experiencia específica"
    //         )
    //       : null;
    //   });
    // } catch (error) {
    //   // alertas.push('Todo el personal seleccionado debe contar con experiencia específica')
    //   console.log("sin exp especifca", error);
    // }

    if (alertas.length === 0) {
      swal2({
        title: "Advertencia!!!",
        text: `Realmente desea FINALIZAR el Formulario? posteriormente no podrá editarlo`,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d9534f",
        cancelButtonColor: "#f0ad4e",
        customClass: "swal2-popup",
        confirmButtonText: "Confirmar!",
      }).then(async (result) => {
        if (result.value) {
          await this.adecuarFormulario();
          this.crudFormulario("U", null);
          this.toggleVerForms = true;
        }
      });
    } else {
      alertas.forEach((a, i) => {
        setTimeout(() => {
          this.toastr.warning(a, "Finalizar Formulario", {
            positionClass: "toast-top-right",
            timeOut: 9000,
            progressBar: true,
          });
        }, i * 500);
      });
    }
  }

  adecuarFormulario() {
    return new Promise((resolve, reject) => {
      this.estadoForm = "FINALIZADO";
      this.fase = "";
      this.elIdEmpleado = null;
      this.elIdrep = null;
      try {
        this.contenido.datos_empresa.notificacion_correo =
          this.contenido.datos_empresa.correo;
        this.contenido.datos_empresa.notificacion_correo_check = true;
        if (!this.contenido.datos_asociacion)
          this.contenido.datos_asociacion = {};
        this.contenido.empleados.map((e) => {
          if (e.cargo_actual) {
            e.nro_registro_profesional = e.registro_profesional;
            e.experiencias = {}
            e.persona = {
              documento_identidad: e.numero_documento,
              fecha_nacimiento: e.fecha_nacimiento,
              nombres: e.nombres,
              primer_apellido: e.primer_apellido,
              segundo_apellido: e.segundo_apellido,
              nacionalidad: e.nacionalidad,
              lugar_expedicion_documento: e.expedido,
            };
            return e;
          }
        });
        // this.contenido.experiencias.generales.map((e) => {
        //   (e.monto_final_contrato_bs = e.monto_contrato_bs),
        //     (e.monto_final_contrato_sus = e.monto_contrato_sus),
        //     (e.fecha_inicio_ejecucion = e.fecha_inicio),
        //     (e.fecha_fin_ejecucion = e.fecha_fin),
        //     (e.profesional_responsable = e.responsable);
        // });
        // this.contenido.experiencias.especificas.map((e) => {
        //   (e.monto_final_contrato_bs = e.monto_contrato_bs),
        //     (e.monto_final_contrato_sus = e.monto_contrato_sus),
        //     (e.fecha_inicio_ejecucion = e.fecha_inicio),
        //     (e.fecha_fin_ejecucion = e.fecha_fin),
        //     (e.profesional_responsable = e.responsable);
        // });
        this.contenido.experiencias = {}
        this.contenido.equipos_trabajo = {}
        resolve(this.contenido);
      } catch (error) {
        reject(error.message || error);
      }
    });
  }

  async crudFormulario(operacion: string, f: any) {
    // console.log("en le crud", this.codigoSave, this.estadoForm);
    if(f && !this.contenido)  this.contenido =  this.contenido = f.contenido_json;
    if(this.idUsuario == 2000) await this.adecuarFormulario();
    
    if (this.contenido){
      if (this.dtsPersonal.length > 0 && this.contenido.empleados.length > 0)
      this.dtsPersonal = this.contenido.empleados;

      this.contenido.proyecto = this.proyecto;
    } 
    this.cargando = true;
    // if (this.idUsuario == 2000 && operacion != "I")
    //   this.estadoForm = "FINALIZADO";
  
    let elFormulario = {
      operacion,
      id_formulario: this.elIdFormulario || 0,
      fid_asociacion: this.elIdAsociacion || null,
      fid_empresa: this.elIdEmpresa,
      codigo:
        this.codigoSave || (this.estadoForm == "FINALIZADO" ? nanoid() : null),
      nombre: (this.nombreNuevoForm || "").toUpperCase(),
      contenido: this.contenido ?  JSON.stringify(this.contenido) : '',
      estado: this.estadoForm,
      usuario_registro: this.idUsuario,
    };
    if (f) {
      elFormulario = f;
      elFormulario.operacion = operacion;
      (elFormulario.contenido = JSON.stringify(elFormulario.contenido)),
        (elFormulario.usuario_registro = this.idUsuario);
      this.contenido = null;
      this.fase = "";
      this.estadoForm = "";
    }
    // this.elIdFormulario ? elFormulario.operacion ='U': elFormulario.operacion = 'I';
    
    this._empresa.crudFormulario(elFormulario).subscribe(
      (result: any) => {
        console.log("desde el crud form", result);

        if (!result[0].message.toUpperCase().startsWith("ERROR")) {
          this.toastr.success(result[0].message, "Registro Formualrio", {
            positionClass: "toast-top-right",
            timeOut: 5000,
            progressBar: true,
          });
          if (operacion == "I")
            this.elIdFormulario = result[0].message.split("|")[1];

          if (
            elFormulario.estado == "FINALIZADO" ||
            this.estadoForm == "FINALIZADO"
          )
            this.contenido = null;
          // console.log('reg form',this.elIdFormulario);
          this.listarFormulario({
            opcion: "fid_empresa",
            id: this.elIdEmpresa,
          });
          if (this.idUsuario === 2000) {
            this.toggleVerForms = true;
            this.contenido = null;
            this.fase = "";
          }
          this.dtsExperienciaEmpleado = [];
          this.dtsExpPerGeneral = [];
          this.dtsExpPerEspecifica = [];
          this.elIdEmpleado = null;
          this.elIdrep = null;
        } else {
          this.toastr.error(
            "Error al actualizar Formulario: " + result[0].message,
            "Registro Formulario",
            {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            }
          );
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

  editarFormulario(f: any) {
    this.cargarFormulario(f);
    this.toggleVerForms = false;
  }

  eliminarFormulario(f: any) {
    swal2({
      title: "Advertencia!!!",
      text: `Realmente desea eliminar el Fomrulario?`,
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d9534f",
      cancelButtonColor: "#f0ad4e",
      customClass: "swal2-popup",
      confirmButtonText: "Confirmar!",
    }).then((result) => {
      if (result.value) this.crudFormulario("D", f);
    });
  }

  async clonarFormulario(f: any) {
    f.nombre += " - COPIA";
    f.codigo = "";
    f.estado = "INICIADO";
    if (typeof f.contenido == "string") {
      console.log("para oldyes");
      try {
        const newForm = await this.adaptarFormsAntiguos(f);
        console.log("antes de insertar", newForm);
        if (typeof newForm == "object") {
          f.contenido = JSON.stringify(newForm);
          f.contenido_json = newForm;
          this.crudFormulario("I", f);
        } else {
          this.toastr.error(
            "El nuevo form: " + newForm.toString(),
            "Error al copiar fomulariop"
          );
        }
      } catch (error) {
        this.toastr.error(error.message || error, "Error al copiar fomulariop");
      }
    } else {
      console.log("para nuevos");
      this.crudFormulario("I", f);
    }
  }

  toggleExperiencia(tipo: string) {
    if (this.mostrarExperiencia === tipo) return true;
    this.mostrarExperiencia = tipo;
    console.log(tipo, this.dtsExperienciaEmpresa);

    if (tipo == "total") this.dtsMostrar = this.dtsExperienciaEmpresa;
    if (tipo == "general") this.dtsMostrar = this.dtsExpEmpGeneral;
    if (tipo == "especifica") this.dtsMostrar = this.dtsExpEmpEspecifica;

    let controles = ["total", "general", "especifica"];
    if (this.estadoForm == "FINALIZADO") controles.shift();
    setTimeout(() => {
      controles.forEach((c) => {
        document.getElementById(c).style.backgroundColor = "#337ab7";
      });
      document.getElementById(tipo).style.backgroundColor = "#14abf1";
    }, 100);

    const laTabla = ".dt-emp-" + tipo;
    this._fun.limpiatabla(laTabla);
    setTimeout(() => {
      let confiTable = this._fun.CONFIGURACION_TABLA_V6(
        [50, 100, 150, 200],
        false,
        10,
        null
      );
      if (!$.fn.dataTable.isDataTable(laTabla)) {
        var table = $(laTabla).DataTable(confiTable);
        // this._fun.selectTable(table, [1, 2]);
        this.estadoForm === "FINALIZADO"
          ? this._fun.inputTable(table, [0, 1, 2, 3, 9, 10])
          : this._fun.inputTable(table, [1, 2, 3, 4, 10, 11]);
      }
    }, 200);

    this.totalDolares = this.dtsMostrar.reduce(
      (ac, el) => ac + (el.monto_final_contrato_sus || el.monto_contrato_sus),
      0
    );
    this.totalBolivianos = this.dtsMostrar.reduce(
      (ac, el) => ac + (el.monto_final_contrato_bs || el.monto_contrato_bs),
      0
    );
  }

  toggleExperienciaEmpleado(tipo: string) {
    console.log("entra en toggeEE", tipo);

    if (this.mostrarExperienciaEmpleado === tipo) return true;
    this.mostrarExperienciaEmpleado = tipo;
    let controles = ["per-total", "per-general", "per-especifica"];
    if (this.estadoForm == "FINALIZADO") controles.shift();
    setTimeout(() => {
      controles.forEach((c) => {
        const b = document.getElementById(c);
        if (b) b.style.backgroundColor = "#337ab7";
      });
      const c = document.getElementById("per-" + tipo);
      if (c) c.style.backgroundColor = "#14abf1";
    }, 50);
    const laTabla = ".dt-per-" + tipo;
    this._fun.limpiatabla(laTabla);
    setTimeout(() => {
      let confiTable = this._fun.CONFIGURACION_TABLA_V6(
        [10, 20, 50, 100],
        false,
        10,
        [1, "asc"]
      );
      if (!$.fn.dataTable.isDataTable(laTabla)) {
        var table = $(laTabla).DataTable(confiTable);
        // this._fun.selectTable(table, [1, 2]);
        this.estadoForm === "FINALIZADO"
          ? this._fun.inputTable(table, [0, 1, 2, 3])
          : this._fun.inputTable(table, [1, 2, 3, 4]);
      }
    }, 200);
  }

  cargarExperienciaEmpleado(experiencias: any, id: number, idrep?: string) {
    console.log(
      "cargando exp",
      experiencias,
      id,
      idrep,
      this.estadoForm,
      this.elIdEmpleado,
      id,
      this.elIdrep,
      this.dtsExperienciaEmpleado,
      this.dtsExpPerGeneral
    );
    if (
      (this.elIdEmpleado === id && !idrep) ||
      (this.elIdrep === idrep && idrep) ||
      (this.dtsExperienciaEmpleado.length > 0 && this.elIdrep != idrep)
    ) {
      this.dtsExpPerGeneral = [];
      this.dtsExpPerEspecifica = [];
      this.elIdEmpleado = null;
      this.dtsExperienciaEmpleado = [];
      this.mostrarExperienciaEmpleado = null;
      this.elIdrep = null;
      return true;
    }
    this.elIdrep = idrep;
    this.dtsExperienciaEmpleado = experiencias.total || experiencias.generales;
    this.dtsExpPerGeneral = experiencias.generales || [];
    this.dtsExpPerEspecifica = experiencias.especificas || [];

    if (experiencias.total) {
      console.log("entra");

      this.dtsExpPerGeneral.forEach((g) => {
        (
          this.dtsExperienciaEmpleado.filter(
            (f) => f.id_experiencia_empleado == g.id_experiencia_empleado
          )[0] || {}
        ).general = true;
      });
      this.dtsExpPerEspecifica.forEach((e) => {
        (
          this.dtsExperienciaEmpleado.filter(
            (f) => f.id_experiencia_empleado == e.id_experiencia_empleado
          )[0] || {}
        ).especifica = true;
      });
    }

    if (this.idUsuario === 2000 && !experiencias.total) {
      //para poner en formato actual los forms antiguos y poder editar
      let especificas: number[] = [];
      this.dtsExpPerEspecifica.forEach((e) => {
        e.especifica = true;
        especificas.push(e.id_experiencia_empleado);
      });
      this.dtsExperienciaEmpleado.map((e) => {
        e.general = true;
        if (especificas.includes(e.id_experiencia_empleado)) {
          e.especifica = true;
        }
        return e;
      });
    }

    console.log(
      "otra rev",
      this.dtsExperienciaEmpleado,
      this.dtsExpPerGeneral,
      this.elIdrep,
      idrep
    );

    if (!this.dtsExperienciaEmpleado[0] && !this.dtsExpPerGeneral[0]) {
      this.toastr.error(
        "El Personal no cuenta con experiencia previamente cargada",
        "Error cargar experiencia",
        { positionClass: "toast-top-right", timeOut: 8000, progressBar: true }
      );
      return true;
    }
    this.elIdEmpleado = id;
    setTimeout(() => {
      this.toggleExperienciaEmpleado(
        this.estadoForm === "FINALIZADO" ? "general" : "total"
      );
      const exemp = document.getElementById("expEmpleado");
      if (exemp) exemp.scrollIntoView({ block: "start", behavior: "smooth" });
    }, 400);
  }

  toggleEquipos(tipo: string) {
    if (this.mostrarEquipos === tipo) return true;
    this.mostrarEquipos = tipo;
    let controles = ["totalEquipos", "permanente", "requerido"];
    if (this.estadoForm == "FINALIZADO") controles.shift();
    setTimeout(() => {
      controles.forEach((c) => {
        document.getElementById(c).style.backgroundColor = "#337ab7";
      });
      document.getElementById(tipo).style.backgroundColor = "#14abf1";
    }, 50);

    const laTabla = ".dt-" + tipo;
    this._fun.limpiatabla(laTabla);
    setTimeout(() => {
      let confiTable = this._fun.CONFIGURACION_TABLA_V6(
        [50, 100, 150, 200],
        false,
        10,
        [1, "asc"]
      );
      if (!$.fn.dataTable.isDataTable(laTabla)) {
        var table = $(laTabla).DataTable(confiTable);
        // this._fun.selectTable(table, [1, 2]);
        this.estadoForm === "FINALIZADO"
          ? this._fun.inputTable(table, [0, 1, 2, 3, 4])
          : this._fun.inputTable(table, [1, 2, 3, 4, 5]);
      }
    }, 200);
  }

  toggleEmpresa(tipo: string) {
    setTimeout(() => {
      tipo === "datosEmpresa"
        ? (this.mostrarAsociacion = false)
        : (this.mostrarAsociacion = true);
      document.getElementById(tipo).style.backgroundColor = "#14abf1";
      tipo === "datosEmpresa"
        ? (document.getElementById("datosAsociacion").style.backgroundColor =
            "#337ab7")
        : (document.getElementById("datosEmpresa").style.backgroundColor =
            "#337ab7");
    }, 100);
  }

  marcarExperienciaEmpresa(id: number, tipo: string) {
    if (
      tipo === "general" &&
      !this.dtsExperienciaEmpresa.filter(
        (f) => f.id_experiencia_empresa == id
      )[0].general
    ) {
      this.dtsExperienciaEmpresa.filter(
        (f) => f.id_experiencia_empresa == id
      )[0].especifica = false;
      this.dtsExpEmpEspecifica = this.dtsExperienciaEmpresa.filter(
        (f) => f.especifica
      );
      this.contenido.experiencias.especificas = this.dtsExpEmpEspecifica;
    }
    if (tipo === "especifica") {
      this.dtsExpEmpEspecifica = this.dtsExperienciaEmpresa.filter(
        (f) => f.especifica
      );
      this.contenido.experiencias.especificas = this.dtsExpEmpEspecifica;
      this.dtsExperienciaEmpresa.map((e) => {
        if (e.especifica && !e.general) e.general = true;
        return e;
      });
    }
    this.dtsExpEmpGeneral = [];
    this.dtsExperienciaEmpresa.forEach((e) => {
      if (e.general) this.dtsExpEmpGeneral.push(e);
    });
    this.contenido.experiencias.generales = this.dtsExpEmpGeneral;
  }

  agregarPersonal() {
    const nombre = (<HTMLInputElement>document.querySelector("#nombrePersonal"))
      .value;
    const nuevoIdrep = nanoid(5);
    if (nombre.length > 5) {
      console.log(this.dtsPersonalALL);

      this.dtsPersonalALL.map((p) => {
        if (p.nombre == nombre) {
          p.id_empleado = p.id_persona;
          // p.idrep  =  nuevoIdrep
          p.idrep = nuevoIdrep;
          p.experiencias.generales = [];
          p.experiencias.especificas = [];
          if (p.experiencias.total) {
            p.experiencias.total.map((e) => {
              delete e.general;
              delete e.especifica;
            });
          }
          // this.dtsPersonal.push(Object.assign({},p));
          // this.contenido.empleados.push(Object.assign({},p));
          if (this.dtsPersonal.length == 0) this.dtsPersonal.push(this.copiaProfunda(p));
          if (this.idUsuario == 2000) this.dtsPersonal.push(this.copiaProfunda(p));
          this.contenido.empleados.push(this.copiaProfunda(p));

          (<HTMLInputElement>document.querySelector("#nombrePersonal")).value =
            "";
        }
        // return p;
      });
      // console.log(nombre,this.dtsPersonal,this.contenido.empleados);
      this.dtsExperienciaEmpleado = [];
      this.dtsExpPerGeneral = [];
      this.elIdEmpleado = null;
      this.elIdrep = null;
      console.log("desp", this.dtsPersonal, nuevoIdrep);
    }
  }

  copiaProfunda(obj: any) {
    let result: any;
    if (obj instanceof Array) {
      result = [...obj];
    } else if (typeof obj === "object") {
      result = { ...obj };
    } else {
      return obj;
    }
    for (let prop of Reflect.ownKeys(result)) {
      result[prop] = this.copiaProfunda(result[prop]);
    }
    return result;
  }

  listarParametros(opcion) {
    this._empresa.listaParametros(opcion).subscribe(
      (result: any) => {
        this.dtsCargos = result.filter((f) => f.grupo == "CARGO");
        this.dtsCargos.unshift({ nombre: "Seleccione..." });
      },
      (error) =>
        this.toastr.error(error.toString(), "Error desde el servidor", {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        })
    );
  }

  actualizarCargo(id: number, cargo: string, idrep: string) {
    // const elCargo = (<HTMLInputElement>document.querySelector('#personaCargo')).value;
    if (cargo == "Seleccione..." || cargo == "") {
      this.toastr.warning(
        "Debe seleccionar un cargo válido",
        "Cargo erróoneo",
        { positionClass: "toast-top-right", timeOut: 8000, progressBar: true }
      );
      return false;
    }
    console.log(
      "actCargo",
      id,
      cargo,
      this.contenido.empleados,
      this.dtsPersonal,
      idrep
    );

    let tipo_form = "";
    if (this.dtsCargos.filter((f) => f.nombre == cargo)[0])
      tipo_form = this.dtsCargos.filter((f) => f.nombre == cargo)[0]
        .descripcion;

    this.dtsPersonal.map((p) => {
      if (p.idrep == idrep) {
        p.cargo_actual = cargo;
        p.tipo_form = tipo_form;
        this.contenido.empleados.filter(
          (f) => f.idrep === idrep
        )[0].cargo_actual = cargo;
        this.contenido.empleados.filter((f) => f.idrep === idrep)[0].tipo_form =
          tipo_form;
      }
      return p;
    });
    this.crudFormulario("U", null);
    // this.contenido.empleados.filter(f=>f.id_empleado === id && !f.cargo_actual)[0].cargo_actual = cargo;
  }

  marcarExperienciaEmpleado(idexp: string, tipo: string) {
    // console.log("antes", this.dtsExperienciaEmpleado, this.contenido.empleados);
    if (
      tipo === "general" &&
      !this.dtsExperienciaEmpleado.filter(
        (f) => f.id_experiencia_empleado == idexp
      )[0].general
    ) {
      this.dtsExperienciaEmpleado.filter(
        (f) => f.id_experiencia_empleado == idexp
      )[0].especifica = false;
      this.dtsExpPerEspecifica = this.dtsExperienciaEmpleado.filter(
        (f) => f.especifica
      );
      this.contenido.empleados.filter(
        (f) => f.idrep === this.elIdrep
      )[0].experiencias.especificas = [];
      this.dtsExpPerEspecifica.forEach((g) => {
        this.contenido.empleados
          .filter((f) => f.idrep === this.elIdrep)[0]
          .experiencias.especificas.push(this.copiaProfunda(g));
      });
    }
    if (tipo === "especifica") {
      this.contenido.empleados.filter(
        (f) => f.idrep === this.elIdrep
      )[0].experiencias.especificas = [];
      this.dtsExpPerEspecifica = this.dtsExperienciaEmpleado.filter(
        (f) => f.especifica
      );
      this.dtsExpPerEspecifica.forEach((g) => {
        this.contenido.empleados
          .filter((f) => f.idrep === this.elIdrep)[0]
          .experiencias.especificas.push(this.copiaProfunda(g));
      });
      // this.contenido.empleados.filter(f=>f.idrep === this.elIdrep)[0].experiencias.especificas = this.dtsExpPerEspecifica;
      this.dtsExperienciaEmpleado.map((e) => {
        if (e.especifica && !e.general) e.general = true;
        return e;
      });
    }
    this.dtsExpPerGeneral = [];
    this.dtsExperienciaEmpleado.forEach((e) => {
      if (e.general) this.dtsExpPerGeneral.push(e);
    });
    this.contenido.empleados.filter(
      (f) => f.idrep === this.elIdrep
    )[0].experiencias.generales = [];
    this.dtsExpPerGeneral.forEach((g) => {
      this.contenido.empleados
        .filter((f) => f.idrep === this.elIdrep)[0]
        .experiencias.generales.push(this.copiaProfunda(g));
    });
    // this.contenido.empleados.filter(f=>f.idrep === this.elIdrep)[0].experiencias.generales = this.dtsExpPerGeneral;
    console.log(
      "maraado exp emp",
      this.elIdrep,
      idexp,
      this.dtsExperienciaEmpleado,
      this.contenido.empleados
    );
  }

  marcarEquipos(id: number, tipo: string) {
    if (tipo === "permanente") {
      this.dtsPermanentes = this.dtsEquipos.filter((f) => f.permanente);
      this.contenido.equipos_trabajo.permanente = this.dtsPermanentes;
    }
    if (tipo === "requerido") {
      this.dtsRequeridos = this.dtsEquipos.filter((f) => f.requerido);
      this.contenido.equipos_trabajo.requerido = this.dtsRequeridos;
    }
  }

  // #region archivos_excel
  subirArchivos() {
    this.listarArchivos(this.elIdFormulario, "empresa");
    $("#modalArchivos").modal("show");
  }

  handleFileInput(files: FileList, opcion?: string) {
    this.inputArchivo = files.item(0);
    let extensionesValidas = ["pdf"];
    let nombreArchivo = this.inputArchivo.name;
    let extension_archivo = nombreArchivo.substr(
      nombreArchivo.indexOf(".") + 1
    );
    if (extensionesValidas.indexOf(extension_archivo) < 0) {
      this.toastr.error(
        "El formato del archivo seleccionado no es válido",
        "Error desde el servidor",
        { positionClass: "toast-top-right", timeOut: 8000, progressBar: true }
      );
      $("#inputArchivo").val("");
    } else {
      this.archivoModel.NOM_FILE = this.inputArchivo.name;
      this.archivoModel.TIPO_DOCUMENTO = "empresa";
      this.archivoModel.CODIGO = this.elIdFormulario;
    }
  }

  subirAnexo() {
    this.cargando = true;
    if (!this.archivoModel.TIPO_DOCUMENTO) {
      this.toastr.warning(
        "Seleccione el tipo de documento a subir",
        "Error Subir Archivo",
        { positionClass: "toast-top-right", timeOut: 8000, progressBar: true }
      );
      this.cargando = false;
      return;
    }
    this.archivoModel.FILE =
      this.inputArchivo === null ? this.file_empty : this.inputArchivo;
    this.tipoArchivos == 1
      ? (this.archivoModel.TIPO_DOCUMENTO = "empresa1")
      : this.tipoArchivos == 2
      ? (this.archivoModel.TIPO_DOCUMENTO = "empresa2")
      : (this.archivoModel.TIPO_DOCUMENTO = "empresa3");
    this._autenticacion.subirArchivo(this.archivoModel).subscribe(
      (result: any) => {
        let respuestaSubida = result;
        if (respuestaSubida.ok) {
          this.rutaArchivo = respuestaSubida.nombre_archivo;
          this.toastr.success(
            "Archivo almacenado correctamente",
            "Subir Archivo",
            {
              positionClass: "toast-top-right",
              timeOut: 8000,
              progressBar: true,
            }
          );
          this.listarArchivos(this.elIdFormulario, "empresa");
        } else {
          if (respuestaSubida.message.includes("ya existe")) {
            swal2({
              title: "Advertencia!!!",
              text: `Realmente desea reemplazar el anexo?`,
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#d9534f",
              cancelButtonColor: "#f0ad4e",
              customClass: "swal2-popup",
              confirmButtonText: "Confirmar!",
            }).then((result) => {
              if (result.value) {
                this._autenticacion
                  .reemplazarArchivo(this.archivoModel)
                  .subscribe(
                    (result: any) => {
                      let respuestaSubida = result;
                      if (respuestaSubida.ok) {
                        this.rutaArchivo = respuestaSubida.nombre_archivo;
                        this.toastr.success(
                          "Archvio reemplazo exitosamente",
                          "Subir Archivo",
                          {
                            positionClass: "toast-top-right",
                            timeOut: 8000,
                            progressBar: true,
                          }
                        );
                        this.listarArchivos(this.elIdFormulario, "empresa");
                      } else {
                        this.toastr.error(
                          respuestaSubida.message.toString(),
                          "Error Subir Archivo",
                          {
                            positionClass: "toast-top-right",
                            timeOut: 8000,
                            progressBar: true,
                          }
                        );
                      }
                    },
                    (error) => {
                      this.cargando = false;
                      this.toastr.error(error, "Error Subir Archivo", {
                        positionClass: "toast-top-right",
                        timeOut: 8000,
                        progressBar: true,
                      });
                    }
                  );
              }
            });
          } else {
            this.toastr.error(
              respuestaSubida.message.toString(),
              "Error Subir Archivo",
              {
                positionClass: "toast-top-right",
                timeOut: 8000,
                progressBar: true,
              }
            );
          }
        }
        this.cargando = false;
      },
      (error) => {
        this.cargando = false;
        this.toastr.error(error, "Error desde el Servidor", {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        });
      }
    );
  }

  listarArchivos(codigo, tipo) {
    this._autenticacion.listaArchivoSeguimiento(codigo, tipo).subscribe(
      (result: any) => {
        // console.log(result);
        this.dtsArchivos = [];
        result.forEach((a) => {
          this.dtsArchivos.push(a.nombre + "." + a.extension);
        });
      },
      (error) => {
        this.toastr.error(error, "Error desde el Servidor", {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        });
      }
    );
  }
  // #endregion

  eliminarPersonal(idrep: string) {
    if (this.estadoForm == "INICIADO") {
      swal2({
        title: "Advertencia!!!",
        text: `Realmente desea EXCLUIR a este personal del formulario en curso?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d9534f",
        cancelButtonColor: "#f0ad4e",
        customClass: "swal2-popup",
        confirmButtonText: "Confirmar!",
      }).then((result) => {
        if (result.value) {
          this.dtsPersonal = this.dtsPersonal.filter((f) => f.idrep !== idrep);
          this.contenido.empleados = this.contenido.empleados.filter(
            (f) => f.idrep !== idrep
          );
          this.crudFormulario("U", null);
          this.dtsExperienciaEmpleado = [];
          this.dtsExpPerGeneral = [];
          this.elIdEmpleado = null;
          this.elIdrep = null;
        }
      });
    }
  }

  // #region Navegacion
  cambiarFase(f: string) {
    console.log(f);
    if (this.estadoForm !== "FINALIZADO" && this.idUsuario != 2000)
      this.crudFormulario("U", null);
    this.fase = f;
    this.dtsExpPerGeneral = [];
    if (f != "personal") {
      console.log('ingresando',f);
      
      const btn = document.querySelector("#btnAvanzar") as HTMLButtonElement;
      if (btn) {
        btn.innerHTML = 'Siguiente <i class="fa fa-arrow-circle-right"></i>';
        btn.disabled = false;
        btn.classList.remove("btn-warning");
      }
    }
    document.querySelectorAll(".timeline-fase").forEach((e) => {
      e.classList.remove("fase-activa");
    });
    document.querySelector("#" + f).classList.add("fase-activa");

    if (
      f == "generales" &&
      ((this.dtsAsociaciones.length > 0 && this.estadoForm != "FINALIZADO") ||
        (this.elIdAsociacion && this.estadoForm == "FINALIZADO"))
    ) {
      this.tittleRetroceder = "";
      this.tittleAvanzar = 'Personal de la Empresa'//"Experiencia de la Empresa";
      
      this.toggleEmpresa("datosEmpresa");
      if (this.estadoForm == "FINALIZADO") {
        console.log("llega aca");

        $("#proyecto").attr("readonly", true);
        $("#entidad").attr("readonly", true);
        $("#monto").attr("readonly", true);
        $("#validez").attr("readonly", true);
      }
    }
    if(f=='generales'){
      this.tittleRetroceder = "";
      this.tittleAvanzar = 'Personal de la Empresa'//"Experiencia de la Empresa";
    }

    if (f == "experiencia") {
      this.mostrarExperiencia = null;
      this.tittleRetroceder = "Datos Generales de la Empresa";
      this.tittleAvanzar = "Personal de la Empresa";
      this.toggleExperiencia(
        this.estadoForm === "INICIADO" ? "total" : "general"
      );
    }
    if (f == "personal") {
      console.log('el estado',this.estadoForm);
      
      this.tittleRetroceder = 'Datos Generales de la Empresa' //"Experiencia de la Empresa";
      // this.tittleAvanzar = "Equipos de la Empresa";
      this.elIdEmpleado = null;
      this.dtsExperienciaEmpleado = [];
      this.dtsExpPerGeneral = [];
      this.estadoForm != "FINALIZADO"
        ? (this.tittleAvanzar = "Finalizar Formulario")
        : (this.tittleAvanzar = "");

      if (this.estadoForm != "FINALIZADO") {
        const btn = document.querySelector("#btnAvanzar") as HTMLButtonElement;
        btn.classList.add("btn-warning");
        this.contenido.empleados.length==0 ? btn.disabled = true : btn.disabled = false;
        btn.innerHTML = 'Finalizar Formulario <i class="fa fa-check-circle"></i>';
      }
    }
    if (f == "equipos") {
      this.mostrarEquipos = null;
      this.tittleRetroceder = "Personal de la Empresa";
      this.estadoForm != "FINALIZADO"
        ? (this.tittleAvanzar = "Finalizar Formulario")
        : (this.tittleAvanzar = "");
      this.toggleEquipos(
        this.estadoForm === "INICIADO" ? "totalEquipos" : "permanente"
      );
      if (this.estadoForm != "FINALIZADO") {
        const btn = document.querySelector("#btnAvanzar") as HTMLButtonElement;
        btn.classList.add("btn-warning");
        if (!this.contenido.experiencias.especificas) btn.disabled = true;
        btn.innerHTML =
          'Finalizar Formulario <i class="fa fa-check-circle"></i>';
      }
    }
    setTimeout(() => {
      const tl = document.getElementById("timeline");
      tl.scrollIntoView({ block: "start", behavior: "smooth" });
    }, 400);
  }
  avanzarFase() {
    if (this.fase === "generales") {
      // this.cambiarFase("experiencia");
      this.cambiarFase("personal");
      return true;
    }
    if (this.fase === "experiencia") {
      this.cambiarFase("personal");
      return true;
    }
    if (this.fase === "personal") {
      // this.cambiarFase("equipos");
      if (this.estadoForm != "FINALIZADO") {
        this.validarFormulario();
        this.tittleAvanzar = "Finalizar Formulario";
      }
      this.tittleRetroceder = "Datos Generales Empresa";
      return true;
    }
    if (this.fase === "equipos") {
      if (this.estadoForm != "FINALIZADO") {
        this.validarFormulario();
        this.tittleAvanzar = "Finalizar Formulario";
      }
      this.tittleRetroceder = "Personal de la Empresa";
      return true;
    }
  }
  retrocederFase() {
    if (this.fase === "experiencia") {
      this.cambiarFase("generales");
      return true;
    }
    if (this.fase === "personal") {
      // this.cambiarFase("experiencia");
      this.cambiarFase("generales");
      return true;
    }
    if (this.fase === "equipos") {
      this.cambiarFase("personal");
      return true;
    }
  }
  //#endregion

  // #region proyecto

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
      if (event.originalTarget.attributes.name.nodeValue == "monto")
        this.proyecto.monto_literal = this._fun.numeroAMontoLiteral(
          event.originalTarget.value
        );
    } else {
      if (event.target)
        event.target.value = Number(event.target.value).toFixed(2);
      if (event.target.attributes.name.nodeValue == "monto")
        this.proyecto.monto_literal = this._fun
          .numeroAMontoLiteral(event.target.value)
          .toUpperCase();
    }
  }

  validarProyecto() {
    const alertas = [];
    if (this.proyecto.validez < 30)
      alertas.push("Validez debe ser mayor o igual a 30 días");
    if (this.proyecto.monto < 1000)
      alertas.push("Debe ingresar un monto válido");
    if (
      !this.proyecto.entidad ||
      !this.proyecto.monto ||
      !this.proyecto.monto_literal ||
      !this.proyecto.nombre ||
      !this.proyecto.validez
    )
      alertas.push("Debe Ingresar Todos los campos requeridos");

    if (alertas.length > 0) {
      alertas.forEach((a) => {
        this.toastr.warning(a, "Validar Datos", {
          positionClass: "toast-top-right",
          timeOut: 7000,
          progressBar: true,
        });
      });
      return false;
    }
    Object.keys(this.proyecto).forEach((c) => {
      this.proyecto[c] = this.proyecto[c].toUpperCase();
    });
    this.crudFormulario("U", null);
  }

  panelReportes(form: any) {
    console.log(form);
    this.conAsociacion = form.contenido_json.datos_asociacion
      .id_asociacion_accidental
      ? true
      : false;
    $("#modalReportes").modal("show");
    this.elIdFormulario = form.id_formulario;
  }

  generarReporte(tipo: string) {
    this.cargando = true;
    const opcion = {
      tipoReporte: tipo,
      opcion: "id_formulario",
      id: this.elIdFormulario,
    };
    this._empresa.reportesFormulario(opcion).subscribe(
      (result: any) => {
        //console.log('rev rep',result);
        // const url = window.URL.createObjectURL(new Blob([result._body]));
        const url = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `Formulario_${tipo}_${this.elIdFormulario}.pdf`
        );
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        this.cargando = false;
      },
      (error) => {
        this.toastr.error(
          "Error reporte:" + (error.message || error),
          "Generarción Reportes",
          {
            positionClass: "toast-top-right",
            timeOut: 7000,
            progressBar: true,
          }
        );
      }
    );
  }

  nuevoRLAsociacion() {
    const sel = <HTMLButtonElement>document.querySelector("#btnNuevoRLA");
    if (!this.nuevorep) {
      sel.innerHTML = "Guardar Nuevo RL";
      sel.classList.add("btn-success");
      this.elRLAsociacion.persona.nombre = "";
      this.elRLAsociacion.persona.documento_identidad = "";
      this.elRLAsociacion.poder.nro_testimonio = "";
      this.elRLAsociacion.poder.lugar_emision = "";
      this.elRLAsociacion.poder.fecha_expedicion = "";
      // $("#nacionalidad, #nombres, #primer_apellido, #segundo_apellido").attr(
      //   "readonly",
      //   false
      // );
    }
    if (this.nuevorep) {
      const elRLA = {
        operacion: "I",
        id_representante_legal: 0,
        fid_empresa: this.elIdEmpresa,
        fid_persona: null,
        nombre: this.elRLAsociacion.persona.nombre,
        num_id: this.elRLAsociacion.persona.documento_identidad,
        poder_testimonio: this.elRLAsociacion.poder.nro_testimonio,
        poder_lugar_emision: this.elRLAsociacion.poder.lugar_emision,
        poder_fecha_expedicion: this.elRLAsociacion.poder.fecha_expedicion,
        verificado_segip: false,
        usuario_registro: this.idUsuario,
      };
      this._empresa.crudRepresentante(elRLA).subscribe(
        (result: any) => {
          console.log("desde el crud RLA", result);
          if (!result[0].message.toUpperCase().startsWith("ERROR")) {
            sel.innerHTML = "Nuevo Representante";
            sel.classList.remove("btn-success");
            this.elRLAsociacion.nombreCompleto =
              this.elRLAsociacion.persona.nombre;
            this.elRLAsociacion.persona.nombres = null;
            this.elRLAsociacion.persona.direccion = null;
            this.elRLAsociacion.persona.nacionalidad = "BOLIVIANA";
            this.elRLAsociacion.persona.primer_apellido = null;
            this.elRLAsociacion.persona.fecha_nacimiento = null;
            this.elRLAsociacion.persona.segundo_apellido = null;
            this.elRLAsociacion.persona.lugar_expedicion_documento = null;
            console.log("reg ok", this.elRLAsociacion);
            this.contenido.datos_asociacion.asociado.representante_legal =
              this.elRLAsociacion;
            this.crudFormulario("U", null);
          } else {
            this.toastr.error(
              "Error al actualizar Formulario: " + result[0].message,
              "Registro Formulario"
            );
          }
          this.cargando = false;
        },
        (error) => {
          this.toastr.error(error.toString(), "Error desde el servidor");
          this.cargando = false;
        }
      );
    }

    this.nuevorep = !this.nuevorep;
    console.log("nuevo rl asociacion", this.elRLAsociacion, sel);
  }

  //#endregion

  adaptarFormsAntiguos(f: any) {
    return new Promise<any>((resolve, reject) => {
      console.log("reciviendo", f, typeof f.contenido);
      const pivot = JSON.parse(f.contenido);
      console.log("ahora si", pivot);
      let socios = `${this.elIdEmpresa}`;
      let armado: any;
      if(pivot.datos_asociacion){
        if (pivot.datos_asociacion.asociado) {
          pivot.datos_asociacion.asociados.forEach((s) => {
            socios += `,${s.fid_empresa}`;
          });
        }
      }
      console.log("antes", this.elIdEmpresa, socios);
      this._empresa
        .armarPreFormulario({ id: this.elIdEmpresa, socios, historico: true })
        .subscribe(
          (result: any) => {
            armado = result[0].contenido_json;
            console.log("entrando", armado);
            pivot.proyecto = null;
            pivot.datos_empresa.activo = 1;
            pivot.datos_empresa.matricula = pivot.datos_empresa.nro_matricula;
            pivot.datos_empresa.id_empresa = this.elIdEmpresa;
            pivot.datos_empresa.fid_usuario = f.usuario_registro;
            pivot.datos_empresa.fecha_modifica = f.fecha_modifica;
            pivot.datos_empresa.fecha_registro = f.fecha_registro;
            pivot.datos_empresa.usuario_modifica = f.usuario_modifica;
            pivot.datos_empresa.usuario_registro = f.usuario_registro;
            // pivot.experiencias.total = armado.experiencias.total;
            // pivot.experiencias.generales.forEach((e) => {
            //   e.nit = pivot.datos_empresa.nit;
            //   e.activo = 1;
            //   e.general = true;
            //   e.fecha_fin = e.fecha_fin_ejecucion;
            //   e.especifica = pivot.experiencias.especificas.filter(
            //     (f) => f.id_experiencia_empresa == e.id_experiencia_empresa
            //   )[0]
            //     ? true
            //     : false;
            //   e.fid_empresa = this.elIdEmpresa;
            //   e.responsable = e.profesional_responsable;
            //   e.fecha_inicio = e.fecha_inicio_ejecucion;
            //   e.monto_contrato_bs = e.monto_final_contrato_bs;
            //   e.monto_contrato_sus = e.monto_final_contrato_sus;
            // });
            // pivot.experiencias.especificas.forEach((e) => {
            //   e.nit = pivot.datos_empresa.nit;
            //   e.activo = 1;
            //   e.general = true;
            //   e.fecha_fin = e.fecha_fin_ejecucion;
            //   e.especifica = true;
            //   e.fid_empresa = this.elIdEmpresa;
            //   e.responsable = e.profesional_responsable;
            //   e.fecha_inicio = e.fecha_inicio_ejecucion;
            //   e.monto_contrato_bs = e.monto_final_contrato_bs;
            //   e.monto_contrato_sus = e.monto_final_contrato_sus;
            // });
            pivot.empleados.forEach((p) => {
              if (
                !armado.empleados.filter(
                  (f) => f.numero_documento == p.persona.documento_identidad
                )[0]
              )
                return;
              p.nit = pivot.datos_empresa.nit;
              p.idrep = nanoid(5);
              p.activo = 1;
              p.genero = null;
              p.nombres = p.persona.nombres;
              p.expedido = p.persona.lugar_expedicion_documento;
              p.direccion = null;
              p.tipo_form = (
                this.dtsCargos.filter((f) => f.nombre == p.cargo_actual)[0] ||
                {}
              ).descripcion;
              p.id_persona = armado.empleados.filter(
                (f) => f.numero_documento == p.persona.documento_identidad
              )[0].id_persona;
              p.complemento = armado.empleados.filter(
                (f) => f.numero_documento == p.persona.documento_identidad
              )[0].complemento;
              p.id_empleado = armado.empleados.filter(
                (f) => f.numero_documento == p.persona.documento_identidad
              )[0].id_persona;
              p.nacionalidad = p.persona.nacionalidad;
              p.tipo_documento = "CI";
              p.primer_apellido = p.persona.primer_apellido;
              p.fecha_nacimiento = p.persona.fecha_nacimiento;
              p.numero_documento = p.persona.documento_identidad;
              p.segundo_apellido = p.persona.segundo_apellido;
              p.registro_profesional = p.nro_registro_profesional;
              // p.experiencias.total = armado.empleados.filter(
              //   (f) => f.numero_documento == p.persona.documento_identidad
              // )[0].experiencias.total;
              // p.experiencias.generales.forEach((e) => {
              //   e.activo = 1;
              //   e.general = true;
              //   e.especifica = p.experiencias.especificas.filter(
              //     (f) => f.id_experiencia_empleado == e.id_experiencia_empleado
              //   )[0]
              //     ? true
              //     : false;
              //   e.fid_persona = armado.empleados.filter(
              //     (f) => f.numero_documento == p.persona.documento_identidad
              //   )[0].id_persona;
              //   e.fid_empleado = armado.empleados.filter(
              //     (f) => f.numero_documento == p.persona.documento_identidad
              //   )[0].id_persona;
              // });
              // p.experiencias.especificas.forEach((e) => {
              //   e.activo = 1;
              //   e.general = true;
              //   e.especifica = true;
              //   e.fid_persona = armado.empleados.filter(
              //     (f) => f.numero_documento == p.persona.documento_identidad
              //   )[0].id_persona;
              //   e.fid_empleado = armado.empleados.filter(
              //     (f) => f.numero_documento == p.persona.documento_identidad
              //   )[0].id_persona;
              // });
            });
            // pivot.equipos_trabajo.total = armado.equipos_trabajo.total;
            // pivot.equipos_trabajo.requerido.forEach((t) => {
            //   t.activo = 1;
            //   t.requerido = true;
            // });
            // pivot.equipos_trabajo.permanente.forEach((t) => {
            //   t.activo = 1;
            //   t.permanente = true;
            // });
            pivot.empleados = pivot.empleados.filter((f) => f.numero_documento); //esto para filtrar solo los empleados encontrados
            resolve(pivot);
          },
          (error: any) => {
            console.error("Al armarPreFormulario", error);
            reject(error);
          }
        );
    });
  }
}
