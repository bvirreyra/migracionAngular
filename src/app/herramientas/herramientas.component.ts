import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { ToastrService } from "ngx-toastr";
import { HerraminetasService } from "./herraminetas.service";
import * as moment from "moment";

declare var $: any;

@Component({
  selector: "app-herramientas",
  templateUrl: "./herramientas.component.html",
  styleUrls: ["./herramientas.component.css"],
})
export class HerramientasComponent implements OnInit {
  public cargando: boolean = false;
  public idUsuario: number = 0;

  public dtsConfigCorreos: any[];
  formCorreo: FormGroup;
  correoEditar: boolean = false;
  public Editor = DecoupledEditor;
  public model = {
    editorData: "<p>Hello, world!</p>",
  };
  public compara: string;

  public dtsConfigMensaje: any[];
  formMensaje: FormGroup;
  mensajeEditar: boolean = false;

  dtsConfigInterop: any[] = [];
  formInterop: FormGroup;
  interopEditar: boolean = false;

  constructor(
    private _herramientas: HerraminetasService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private _fun: FuncionesComponent
  ) {}

  ngOnInit() {
    const datos = JSON.parse(localStorage.getItem("dts_con"));
    this.idUsuario = datos.s_usu_id;

    this.formCorreo = this.formBuilder.group({
      idConfigCorreo: [0],
      tipo: ["", Validators.required],
      servidor: ["", Validators.required],
      puerto: [0, Validators.required],
      usuario: ["", Validators.required],
      clave: ["", Validators.required],
      cuentaOrigen: ["", Validators.required],
      para: ["", Validators.required],
      asunto: [""],
    });

    this.formMensaje = this.formBuilder.group({
      idConfigMensaje: [0],
      tipo: ["", Validators.required],
      idCuenta: ["", Validators.required],
      tokenCuenta: ["", Validators.required],
      origen: ["", Validators.required],
      para: ["", Validators.required],
      mensaje: ["", Validators.required],
    });

    this.formInterop = this.formBuilder.group({
      id_config_interop: [0],
      institucion: ["", Validators.required],
      nombre: ["", Validators.required],
      principal: ["", Validators.required],
      ruta: ["", Validators.required],
      llave_token: ["", Validators.required],
      metodo:["GET",Validators.required],
      puerto:["443",Validators.required],
      cuerpo:[""],
      observacion: [""],
      respuesta: [""],
    });

    this.listarConfigCorreo("T");
    this.listarConfigMensaje("T");
    this.listarConfigInterop({ opcion: "T" });
  }

  listarConfigCorreo(opcion: string) {
    this.cargando = true;
    this._herramientas.listaConfigCorreo(opcion).subscribe(
      (result: any) => {
        console.log("correos", result);
        if (result.length > 0) {
          this.dtsConfigCorreos = result;
          this._fun.limpiatabla(".dt-correos");
          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V6(
              [50, 100, 150, 200],
              false,
              10,
              [1, "asc"]
            );
            if (!$.fn.dataTable.isDataTable(".dt-correos")) {
              var table = $(".dt-correos").DataTable(confiTable);
              this._fun.inputTable(table, [2, 3, 4, 5, 6]);
            }
          }, 100);
        } else {
          this.toastr.warning(
            "No se encontraron configuraciones de correos",
            "Listar Correos",
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

  listarConfigMensaje(opcion: string) {
    this.cargando = true;
    this._herramientas.listaConfigMensaje(opcion).subscribe(
      (result: any) => {
        console.log("mensajes", result);
        if (result.length > 0) {
          this.dtsConfigMensaje = result;
          this._fun.limpiatabla(".dt-mensajes");
          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V6(
              [50, 100, 150, 200],
              false,
              10,
              [1, "asc"]
            );
            if (!$.fn.dataTable.isDataTable(".dt-mensajes")) {
              var table = $(".dt-mensajes").DataTable(confiTable);
              this._fun.inputTable(table, [2, 3, 4, 5]);
            }
          }, 100);
        } else {
          this.toastr.warning(
            "No se encontraron configuraciones de mensajería",
            "Listar Mensajes",
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

  listarConfigInterop(opcion: any) {
    this.cargando = true;
    this._herramientas.listaInterop(opcion).subscribe(
      (result: any) => {
        console.log("interops", result);
        if (result.length > 0) {
          this.dtsConfigInterop = result;
          this._fun.limpiatabla(".dt-interops");
          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V6(
              [50, 100, 150, 200],
              false,
              10,
              [1, "asc"]
            );
            if (!$.fn.dataTable.isDataTable(".dt-interops")) {
              var table = $(".dt-interops").DataTable(confiTable);
              this._fun.inputTable(table, [2, 3, 4, 5, 6]);
            }
          }, 100);
        } else {
          this.toastr.warning(
            "No se encontraron configuraciones de InterOperabilidad",
            "Listar Interop",
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

  abrirFormCorreo(config?) {
    console.log("abrir form correo");
    config ? (this.correoEditar = true) : (this.correoEditar = false);
    if (this.correoEditar) {
      this.formCorreo.setValue({
        idConfigCorreo: config.id_config_correo,
        tipo: config.tipo,
        servidor: config.servidor,
        puerto: config.puerto,
        usuario: config.usuario,
        clave: config.clave,
        cuentaOrigen: config.cuenta_origen,
        para: config.para,
        asunto: config.asunto,
      });
      this.model.editorData = config.mensaje;
      this.compara = config.mensaje;
    } else {
      this.formCorreo.reset();
    }
    $("#modalCorreo").modal("show");
    $(".modal").on("shown.bs.modal", function () {
      $(this).find("[autofocus]").focus();
    });
  }

  abrirFormMensaje(config?) {
    console.log("abrir form mensaje");
    config ? (this.mensajeEditar = true) : (this.mensajeEditar = false);
    if (this.mensajeEditar) {
      this.formMensaje.setValue({
        idConfigMensaje: config.id_config_mensaje,
        tipo: config.tipo,
        idCuenta: config.id_cuenta,
        tokenCuenta: config.token_cuenta,
        origen: config.origen,
        para: config.para,
        mensaje: config.mensaje,
      });
    } else {
      this.formMensaje.reset();
    }
    $("#modalMensaje").modal("show");
    $(".modal").on("shown.bs.modal", function () {
      $(this).find("[autofocus]").focus();
    });
  }

  abrirFormInterop(config?) {
    console.log("abrir form interop");
    config ? (this.interopEditar = true) : (this.interopEditar = false);
    if (this.interopEditar) {
      this.formInterop.setValue({
        id_config_interop: config.id_config_interop,
        institucion: config.institucion,
        nombre: config.nombre,
        principal: config.principal,
        ruta: config.ruta,
        llave_token: config.llave_token,
        metodo:config.metodo,
        puerto:config.puerto,
        cuerpo:config.cuerpo,
        observacion: config.observacion,
        respuesta: config.respuesta,
      });
    } else {
      this.formInterop.reset();
    }
    $("#modalInterop").modal("show");
    $(".modal").on("shown.bs.modal", function () {
      $(this).find("[autofocus]").focus();
    });
  }

  registrarCorreo(id?: number) {
    this.cargando = true;
    console.log("para registrar /actualizar", this.formCorreo.value);
    const config = this.formCorreo.getRawValue();
    this.correoEditar ? (config.operacion = "U") : (config.operacion = "I");
    if (id) config.operacion = "D";
    config.usuarioRegistro = this.idUsuario;
    config.mensaje = this.model.editorData;
    if (!config.idConfigCorreo) config.idConfigCorreo = 0;
    console.log("el objt", config);

    this._herramientas.crudCorreo(config).subscribe(
      (result: any) => {
        console.log("el result", result);
        if (!result[0].message.toUpperCase().startsWith("ERROR")) {
          this.toastr.success(
            "Configuración Registrada con Éxito!!!",
            "Registro Configuración",
            {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            }
          );
          this.listarConfigCorreo("T");
        } else {
          this.toastr.error(
            "Error al registrar configuracion: " + result[0].message,
            "Registro Configuración",
            {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            }
          );
        }
        this.correoEditar = false;
        $("#modalCorreo").modal("hide");
        this.cargando = false;
      },
      (error) => {
        this.cargando = false;
        this.toastr.error(error.toString(), "Error desde el servidor", {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        });
      }
    );
  }

  registrarMensaje(id?: number) {
    this.cargando = true;
    console.log("para registrar /actualizar", this.formMensaje.value);
    const config = this.formMensaje.getRawValue();
    this.mensajeEditar ? (config.operacion = "U") : (config.operacion = "I");
    if (id) config.operacion = "D";
    config.usuarioRegistro = this.idUsuario;
    if (!config.idConfigMensaje) config.idConfigMensaje = 0;
    console.log("el objt", config);

    this._herramientas.crudMensaje(config).subscribe(
      (result: any) => {
        console.log("el result", result);
        if (!result[0].message.toUpperCase().startsWith("ERROR")) {
          this.toastr.success(
            "Configuración de mensaje Registrada con Éxito!!!",
            "Registro Mensaje",
            {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            }
          );
          this.listarConfigMensaje("T");
        } else {
          this.toastr.error(
            "Error al registrar configuracion de mensaje: " + result[0].message,
            "Registro Mensaje",
            {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            }
          );
        }
        this.correoEditar = false;
        $("#modalMensaje").modal("hide");
        this.cargando = false;
      },
      (error) => {
        this.cargando = false;
        this.toastr.error(error.toString(), "Error desde el servidor", {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        });
      }
    );
  }

  registrarInterop(id?: number) {
    this.cargando = true;
    console.log("para registrar /actualizar interop", this.formInterop.value);
    const config = this.formInterop.getRawValue();
    this.interopEditar ? (config.operacion = "U") : (config.operacion = "I");
    if (id) config.operacion = "D";
    config.usuario_registro = this.idUsuario;
    if (!config.id_config_interop) config.id_config_interop = 0;
    console.log("la interop", config);

    this._herramientas.crudInterop(config).subscribe(
      (result: any) => {
        console.log("el result", result);
        if (!result[0].message.toUpperCase().startsWith("ERROR")) {
          this.toastr.success(
            "Configuración Registrada con Éxito!!!",
            "Registro Configuración",
            {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            }
          );
          this.listarConfigInterop({ opcion: "T" });
        } else {
          this.toastr.error(
            "Error al registrar configuracion: " + result[0].message,
            "Registro Configuración",
            {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            }
          );
        }
        this.interopEditar = false;
        $("#modalInterop").modal("hide");
        this.cargando = false;
      },
      (error) => {
        this.cargando = false;
        this.toastr.error(error.toString(), "Error desde el servidor", {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        });
      }
    );
  }

  public onReady(editor) {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
  }

  onChangePlantillaCorreo() {
    this.compara != this.model.editorData
      ? this.formCorreo.markAsDirty()
      : this.formCorreo.markAsPristine();
  }

  verificarServicioMensaje(destino: string) {
    this.cargando = true;
    const data = {
      para:destino.split(",")[0],
      mensaje:"⚙️ Prueba de estado de servicio WhatsApp UPRE ✅ " + moment().format('DD/MM/YYYY HH:mm:ss')
    }
    this._herramientas.verificaEstadoMensaje(data).subscribe(
      (result: any) => {
        result.message.includes("satisfactoriamente")
          ? this.toastr.success(result.message, "Servicio Mensajería", {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            })
          : this.toastr.error(result.message, "Servicio Mensajería", {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            });
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

  detenerServicio(destino: string) {
    const confirmar = confirm(
      "Realmente desea detener el servicio de Whatsapp?"
    );
    if (!confirmar) return true;
    this.cargando = true;
    this._herramientas.detenerServicioWP(destino.split(",")[0]).subscribe(
      (result: any) => {
        result[0].message.includes("detenido")
          ? this.toastr.success(result[0].message, "Servicio Mensajería", {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            })
          : this.toastr.error(result[0].message, "Servicio Mensajería", {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            });
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

  verificarInteropBack(config:any){
    const data = prompt("NIT/matrícula/usuario/clave/CI/Fecha Nacimiento:", "425856020/425856020/usuario/clave/1234567/1982-07-25");
    const nit = data.split('/')[0] || '0';
    const matricula = data.split('/')[1] || '0';
    const usuario = data.split('/')[2] || 'user';
    const clave = data.split('/')[3] || 'clave';
    const ci = data.split('/')[4] || '123';
    const fn = data.split('/')[5] || '2000-05-05';

    const ruta_old = config.ruta;

    if(config.nombre.includes('matriculas')) config.ruta = config.ruta.replace('000',nit);
    if(config.nombre.includes('datos')) config.ruta = config.ruta.replace('000',(matricula || nit));
    if(config.nombre.includes('representantes')) config.ruta = config.ruta.replace('000',(matricula || nit));
    if(config.nombre.includes('personas')) config.ruta = config.ruta.replace('000',ci).replace('111',fn);
    if(config.nombre.includes('NIT')) config.cuerpo= {"nit":nit,"usuario":usuario,"clave":clave}

    this.cargando = true;
    this._herramientas.verificarInterop(config).subscribe(
      (result:any)=>{
        console.log('result verif interop',result);
        if(result.message.includes('satisfactorio')) this.toastr.success(
          "Servicio de Interoperabilidad Activo",
          "Interoperabilidad",
          {
            positionClass: "toast-top-right",
            timeOut: 5000,
            progressBar: true,
          });
        config.respuesta = result.data[0] ? JSON.stringify(result.data[0]).replace(/'/g, "*") : 'undefined';
        config.operacion = "U";
        config.usuario_registro = this.idUsuario
        alert(JSON.stringify(result.data[0]));
        config.ruta = ruta_old;
        this._herramientas.crudInterop(config).subscribe(
          (result: any) => {
            console.log("crud interop", result);
            if (!result[0].message.toUpperCase().startsWith("ERROR")) {
              console.log('interop actualizada');
              this.listarConfigInterop({ opcion: "T" });
            } else {
              console.error('error crud interop:',result[0].message);
            }
          },
          (error) => {
            console.error(error.toString(), "Error desde el servidor");
          }
        );
        this.cargando = false;
      },
      (error)=>{
        this.toastr.error(error.toString(), "Error desde el servidor", {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        });
        this.cargando = false;
      })
  }

  verificaInterop(interop: any) {
    this.cargando = true;
    console.log(interop);
    const nit = prompt("NIT:", "425856020");
    // const mat = confirm('MATRICULAT:');
    const data = {
      headers: {
        authorization: interop.llave_token,
        'Access-Control-Allow-Origin': '*',
      },
      url2: interop.principal + interop.ruta.replace("000", nit),
      url: interop.ruta.replace("000", nit),
    };

    fetch(data.url2, {
      method: "GET", // or 'PUT'
      // body: JSON.stringify(data), // data can be `string` or {object}!
      headers: new Headers({
        "Content-Type": "application/json",
        "Authorization": interop.llave_token,
      }),
      mode:"cors",
    })
      .then((res) => res.json())
      .catch((error) => console.error("Error:", error))
      .then((response) => {
        console.log("el response interop", response, typeof response);
        const final =
          typeof response == "object" && response ? JSON.stringify(response) : response;
        alert(final);
        interop.respuesta = final ? final.replace(/'/g, "*") : 'undefined';
        interop.operacion = "U";
        this._herramientas.crudInterop(interop).subscribe(
          (result: any) => {
            console.log("crud interop", result);
            if (!result[0].message.toUpperCase().startsWith("ERROR")) {
              this.toastr.success(
                "Configuración Actualizada con Éxito!!!",
                "Registro Configuración",
                {
                  positionClass: "toast-top-right",
                  timeOut: 5000,
                  progressBar: true,
                }
              );
              this.listarConfigInterop({ opcion: "T" });
            } else {
              this.toastr.error(
                "Error al registrar configuracion: " + result[0].message,
                "Registro Configuración",
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
            this.cargando = false;
            this.toastr.error(error.toString(), "Error desde el servidor", {
              positionClass: "toast-top-right",
              timeOut: 8000,
              progressBar: true,
            });
          }
        );
      });
  }

  verificarCorreos(config:any){
    console.log('verificando servicio correo',config);
    this.cargando = true;
    this._herramientas.verificaEstadoCorreo(config).subscribe(
      (result: any) => {
        console.log('el result',result);
        
        result.message.includes("satisfactoriamente")
          ? this.toastr.success(result.message, "Servicio Correos", {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            })
          : this.toastr.error(result.message, "Servicio Correos", {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            });
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
