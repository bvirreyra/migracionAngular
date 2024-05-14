import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import alasql from "alasql";
import { ToastrService } from "ngx-toastr";
import { SiptaService } from "../sipta.service";

declare var $: any;

@Component({
  selector: "app-documento",
  templateUrl: "./documento.component.html",
  styleUrls: ["./documento.component.css"],
})
export class DocumentoComponent implements OnInit {
  public cargando: boolean = false;
  formDocumento: FormGroup;
  // formOficina : FormGroup;
  formTipo: FormGroup;
  public chartPieDocumentos: any;
  public dtsCorrelativos: any;
  public dtsTiposCites: any;
  public dtsDocumentos: any;
  public dtsDocumentosAll: any;
  // public dtsProcesos:any;
  public dtsUsuarios: any;
  public dtsFrecuentes: any;

  public documentoEditar: boolean = false;

  public idUsuario: number;
  // public idOficina:number;
  public idUnidad: number;
  public remitente: string;
  public cargoRemitente: string;
  public elCodigo: string;
  //charts
  public seriesPie: [];
  public labelsPie: [];
  public tituloPie: string;
  public titulosBarras: {
    central: string;
    vertical: string;
    horizontal: string;
  };
  public seriesBarras: any[] = [];
  public periodosBarras: number[] = [];

  public gestionSel: number = new Date().getFullYear();
  public dtsGestiones: number[] = [];
  public gestionActual: number = new Date().getFullYear();

  public esAdmin: boolean = false;
  // public dtsOficinas:any;
  // public oficinaEditar:boolean = false;
  public dtsDependencias: any;
  public dtsTiposCitesAll: any;
  public tipoEditar: boolean = false;
  public usuarioCite: any;
  public dtsTiposUsuario: any;
  // public nuevaOficina:number;

  public usuariosCorrectos: boolean = false;
  public dtsDocumentosUsuario: any;

  public elModelo: string = "";
  public cites_historicos = false;
  public vwHitorial_cites_adm = false;

  constructor(
    private _sipta: SiptaService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private _fun: FuncionesComponent
  ) {}

  ngOnInit() {
    const datos = JSON.parse(localStorage.getItem("dts_con"));
    this.idUsuario = datos.s_usu_id;
    if ([3, 23].includes(datos.s_idrol)) this.esAdmin = true;

    this.formDocumento = this.formBuilder.group({
      idDocumento: [0],
      descTipo: ["", Validators.required],
      fidTipo: 0,
      // fidProceso: ['', Validators.required],
      remitente: ["", Validators.required],
      remitenteCargo: ["", Validators.required],
      destinatario: ["", Validators.required],
      destinatarioCargo: ["", Validators.required],
      via: [""],
      viaCargo: [""],
      codigo: [""],
      referencia: ["", Validators.required],
    });
    this.listarDocumentosRecientes(this.idUsuario.toString(), this.gestionSel);
    // this.listarProcesos('43');
    this.listarTipoCites(`U${this.idUsuario}`);
    this.listarUsuarios();
    for (let i = this.gestionSel; i > this.gestionSel - 4; i--) {
      this.dtsGestiones.push(i);
    }

    if (this.esAdmin) {
      // this.listarOficinas();
      this.listarTipoCites("T");
    }
    this.formTipo = this.formBuilder.group({
      idTipoCite: [0],
      documento: ["", Validators.required],
      abreviatura: [0, Validators.required],
      // via: [0],
      descripcion: ["", Validators.required],
      plantilla: [""],
      modelo: ["", Validators.required],
    });
  }

  listarDocumentosRecientes(opcion: string, gestion: number) {
    this.cargando = true;
    this.dtsDocumentos = [];
    this.dtsDocumentosUsuario = [];
    this.dtsDocumentosAll = [];

    let tabla = ".dt-documentos1";

    this._sipta.listaDocumentos(opcion.replace("U", ""), gestion).subscribe(
      (result: any) => {
        console.log("docsRecientes", result, this.gestionSel);
        this.dtsDocumentos = result;
        this.dtsDocumentosUsuario = this.dtsDocumentos.filter(
          (atributo) => atributo.usuario_registro == this.idUsuario
        );
        this.dtsDocumentosAll = result;

        if (result.length > 0) {
          if (opcion.startsWith("U")) {
            this.dtsDocumentosUsuario = this.dtsDocumentos.filter(
              (atributo) => atributo.usuario_registro == opcion.replace("U", "")
            );

            const tbl = ".dt-docuser";

            this._fun.limpiatabla(tbl);
            setTimeout(() => {
              let confiTable3 = this._fun.CONFIGURACION_TABLA_V7(
                [50, 100, 150, 200],
                false,
                10,
                true,
                [[0, "desc"]],
                true,
                [{ visible: false, targets: 0 }]
              );
              if (!$.fn.dataTable.isDataTable(tbl)) {
                var table3 = $(tbl).DataTable(confiTable3);
                this._fun.inputTable(table3, [2, 3, 4]);
                this._fun.selectTable(table3, [1, 5]);
              }
            }, 100);
          } else {
            this.dtsDocumentosUsuario = this.dtsDocumentos.filter(
              (atributo) => atributo.usuario_registro == this.idUsuario
            );
          }

          this.prepararChartTipoDocumento(this.dtsDocumentosUsuario);
          console.log("DOCUMENTOS_RECIENTES", this.dtsDocumentosUsuario);
          console.log("DOCUMENTOS TOTALES", this.dtsDocumentos);

          this._fun.limpiatabla(tabla);
          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V7(
              [5, 10, 20, 50],
              false,
              5,
              true,
              [[0, "desc"]],
              true,
              [{ visible: false, targets: 0 }]
            );
            if (!$.fn.dataTable.isDataTable(tabla)) {
              var table = $(tabla).DataTable(confiTable);
              this._fun.inputTable(table, [1, 2, 3]);
            }
          }, 100);
        } else {
          // this.gestionSel = new Date().getFullYear();
          this.dtsDocumentos = [];
          this.prepararChartTipoDocumento(this.dtsDocumentos);
          this.toastr.warning(
            "No se encontraron documentos generados",
            "Listar Documentos",
            {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            }
          );
          // this.listarDocumentosRecientes(this.idUsuario.toString(),this.gestionSel);
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

  prepararChartTipoDocumento(dts: any) {
    const armado = alasql(
      "select documento,count(*) cantidad from ? group by documento",
      [dts]
    ).sort((a, b) => b.cantidad - a.cantidad);
    console.log("el armadao", armado);

    this.seriesPie = armado.map((el) => Number(el.cantidad));
    this.labelsPie = armado.map((el) => el.documento);
    this.tituloPie = `Documentos Generados, total: ${dts.length}`;

    const bar: any = [];
    dts.map((el) => {
      let mes = new Date(el.fecha_registro).toLocaleDateString("es-es", {
        month: "long",
      });
      let aumento: boolean = false;
      bar.forEach((e) => {
        if (e[mes]) {
          e[mes] += 1;
          aumento = true;
        }
      });
      if (!aumento) bar.unshift(new Object({ [mes]: 1 }));
      //unshift porque si se reordena dts tambien reordena dtsDcouemntos :(
    });

    this.titulosBarras = {
      central: `Documentos generados por periodo, total: ${dts.length}`,
      vertical: "Documentos",
      horizontal: "Periodos",
    };
    const totales = bar.map((el) => {
      return el[Object.keys(el)[0]];
    });
    this.seriesBarras = [];
    const serie1 = { name: "Documentos Generados", data: totales };
    this.seriesBarras.push(serie1);
    this.periodosBarras = bar.map((el) => Object.keys(el)[0]);
  }

  listarTipoCites(opcion: string) {
    this.cargando = true;
    this._sipta.listaTipoCites(opcion.replace("F", "")).subscribe(
      (result: any) => {
        console.log("tiposCites", result);
        if (result.length > 0) {
          if (opcion.startsWith("U")) this.dtsTiposCites = result;
          if (opcion.startsWith("F")) this.dtsTiposUsuario = result;
          if (opcion == "T") {
            this.dtsTiposCitesAll = result;
            this._fun.limpiatabla(".dt-tipos");
            setTimeout(() => {
              let confiTable = this._fun.CONFIGURACION_TABLA_V6(
                [50, 100, 150, 200],
                false,
                10,
                [0, "asc"]
              );
              if (!$.fn.dataTable.isDataTable(".dt-tipos")) {
                var table = $(".dt-tipos").DataTable(confiTable);
                this._fun.inputTable(table, [0, 1, 2, 3, 4]);
              }
            }, 100);
          }
        } else {
          this.toastr.warning(
            "No se encontraron tipos cites",
            "Listar Tipos Cites",
            {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            }
          );
          if (opcion.startsWith("U")) this.dtsTiposCites = [];
          if (opcion.startsWith("F")) this.dtsTiposUsuario = [];
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
  }

  // listarProcesos(opcion:string){
  //   this._sipta.listaProcesos(opcion).subscribe(
  //     (result: any) => {
  //
  //       console.log('procesos',result);
  //       if (result.length > 0) {
  //         this.dtsProcesos = result;
  //       } else {
  //         this.toastr.warning('No se encontraron procesos', 'Listar Procesos',{positionClass:'toast-top-right',timeOut: 5000,progressBar: true,});
  //       }
  //     },
  //     (error) => this.toastr.error(error.toString(), 'Error desde el servidor',{positionClass:'toast-top-right',timeOut: 8000,progressBar: true,})
  //   );
  // }

  cargarRemitente(id: string) {
    this._sipta.getListaUsuarios(id).subscribe(
      (result: any) => {
        console.log("el remitente", result);
        if (!result[0].message.toUpperCase().startsWith("ERROR")) {
          // this.idOficina = result[0].id_oficina;
          this.idUnidad = result[0].id_unidad;
          this.remitente = result[0].nombre_completo_usuario;
          this.cargoRemitente = result[0].cargo;
        } else {
          this.toastr.warning(
            `No se encontraron remitente con el id: ${id}`,
            "Cargar Remitente",
            {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            }
          );
        }
      },
      (error) =>
        this.toastr.error(error.toString(), "Error desde el servidor", {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        })
    );
  }

  listarUsuarios() {
    this._sipta.listaUsuarios().subscribe(
      // this._sipta.getListaUsuario().subscribe(
      (result: any) => {
        console.log("usuarios activos", result);
        if (result.length > 0) {
          this.dtsUsuarios = result;
        } else {
          this.toastr.warning(`No se encontraron usuarios`, "Listar Usuarios", {
            positionClass: "toast-top-right",
            timeOut: 5000,
            progressBar: true,
          });
        }
      },
      (error) =>
        this.toastr.error(error.toString(), "Error desde el servidor", {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        })
    );
  }

  abrirFormDocumento(documento?) {
    console.log("abrir form", documento);
    if (this.dtsTiposCites.length == 0 || !this.dtsTiposCites) {
      this.toastr.warning(
        "No cuenta con documentos habilitados",
        "Control Documento",
        { positionClass: "toast-top-right", timeOut: 5000, progressBar: true }
      );
      return true;
    }
    documento ? (this.documentoEditar = true) : (this.documentoEditar = false);
    if (this.documentoEditar) {
      this.formDocumento.setValue({
        idDocumento: documento.id_documento,
        fidTipo: documento.fid_tipo,
        descTipo: this.dtsTiposCites.filter(
          (f) => f.fid_tipo == documento.fid_tipo
        )[0] ? this.dtsTiposCites.filter(
          (f) => f.fid_tipo == documento.fid_tipo
        )[0].documento :null,
        // fidProceso: documento.fid_proceso,
        remitente: documento.remitente,
        remitenteCargo: documento.remitente_cargo,
        destinatario: documento.destinatario,
        destinatarioCargo: documento.destinatario_cargo,
        via: documento.via,
        viaCargo: documento.via_cargo,
        codigo: documento.codigo,
        referencia: documento.referencia,
      });
      this.elCodigo = documento.codigo;
      // this.idOficina = documento.fid_oficina;
      this.idUnidad = documento.fid_unidad;
      this.formDocumento.controls["descTipo"].disable();
      this.elModelo = this.elCodigo;
      console.log("MODELO NRO 1", this.elModelo);
    } else {
      this.formDocumento.reset();
      this.elCodigo = null;
      const { id_unidad, nombre_completo_usuario, usu_cargo } =
        this.dtsUsuarios.filter((f) => f.usu_id == this.idUsuario)[0];
      this.idUnidad = id_unidad;
      this.remitente = nombre_completo_usuario;
      this.cargoRemitente = usu_cargo;
      this.formDocumento.controls["remitente"].setValue(this.remitente);
      this.formDocumento.controls["remitenteCargo"].setValue(
        this.cargoRemitente
      );
      // this.formDocumento.controls['fidTipo'].setValue(this.dtsTiposCites[0].id_tipo_cite);// les confunde q se seleccione automaticamente un tipo cite
      this.formDocumento.controls["descTipo"].enable();
      this.elModelo = "";
      console.log("MODELO NRO 2", this.elModelo);
      this.onChangeModelo();
    }
    this.usuariosCorrectos = false;
    $("#modalDocumento").modal("show");
    $(".modal").on("shown.bs.modal", function () {
      $(this).find("[autofocus]").focus();
    });
  }

  encontrarCargo(usuario: string, campo: string) {
    if (!usuario) {
      this.usuariosCorrectos = true;
      const campoCargo = campo + "Cargo";
      this.formDocumento.controls[campoCargo].setValue("");
      return true;
    }
    console.log("cargos", usuario, campo);
    const cargo = this.dtsUsuarios.filter(
      (f) => f.nombre_completo_usuario === usuario
    );
    if (cargo[0]) {
      this.formDocumento.controls[campo].setValue(cargo[0].usu_cargo);
      // this.formDocumento.controls[campo].disable();
      // if(campo == 'destinatario') $('#via').focus();
      // if(campo == 'via') $('#referencia').focus();
      console.log("esta ingresando", cargo[0].usu_cargo);
      this.usuariosCorrectos = true;
    } else {
      this.usuariosCorrectos = false;
    }
  }

  registrarDocumento() {
    this.cargando = true;
    console.log("para registrar /actualizar", this.formDocumento.value);
    const documento = this.formDocumento.getRawValue();
    if (!documento.fidTipo) {
      this.toastr.warning(
        "Debe seleccionar tipo de documento.",
        "Control Documento",
        { positionClass: "toast-top-right", timeOut: 10000, progressBar: true }
      );
      this.cargando = false;
      return true;
    }
    if (documento.destinatario)
      this.documentoEditar
        ? (documento.operacion = "U")
        : (documento.operacion = "I");
    documento.usuario_registro = this.idUsuario;
    documento.fidUnidad = this.idUnidad;
    this._sipta.crudDocumento(documento).subscribe(
      (result: any) => {
        console.log("el result", result);
        if (!result[0].message.toUpperCase().startsWith("ERROR")) {
          this.elCodigo = result[0].message.split("-")[2];
          this.toastr.success(
            "Documento Generado con Éxito!!!",
            "Registro Documento",
            {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            }
          );
          this.listarDocumentosRecientes(
            this.idUsuario.toString(),
            this.gestionSel
          );
        } else {
          this.toastr.error(
            "Error al generar documento: " + result[0].message,
            "Registro Documento",
            {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            }
          );
        }
        this.documentoEditar = false;
        $("#modalDocumento").modal("hide");
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

  anularDocumento(doc: any, opcion: string = "D") {
    if (opcion == "DF") {
      const resp = confirm(
        `Está seguro de eliminar el documento ${doc.codigo} ?`
      );
      if (!resp) return true;
    }
    this.cargando = true;
    console.log("anulando", doc);
    doc.operacion = opcion;
    doc.idDocumento = doc.id_documento;
    doc.fidUnidad = doc.fid_unidad;
    doc.remitenteCargo = doc.remitente_cargo;
    doc.viaCargo = doc.via_cargo;
    doc.destinatarioCargo = doc.destinatario_cargo;
    doc.fidTipo = doc.fid_tipo;
    doc.usuario_registro = this.idUsuario;
    this._sipta.crudDocumento(doc).subscribe(
      (result: any) => {
        console.log("el result", result);
        if (!result[0].message.toUpperCase().startsWith("ERROR")) {
          const modo =
            opcion == "D"
              ? doc.activo == 1
                ? "Anulado"
                : "Reactivado"
              : "ELIMINADO";
          this.toastr.success(
            `Documento ${modo} correctamente`,
            "Estado Documento",
            {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            }
          );
          this.listarDocumentosRecientes(
            "U" + this.usuarioCite.usu_id.toString(),
            this.gestionSel
          );
        } else {
          this.toastr.error(
            "Error al anular documento: " + result[0].message,
            "Eliminar Documento",
            {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            }
          );
        }
        $("#modalDocumento").modal("hide");
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

  cambiarGestion(id) {
    this.listarDocumentosRecientes(id.toString(), this.gestionSel);
  }

  abrirFormTipos(tipo?) {
    console.log("abrir form tipos", tipo);
    tipo ? (this.tipoEditar = true) : (this.tipoEditar = false);
    if (this.tipoEditar) {
      this.formTipo.setValue({
        idTipoCite: tipo.id_tipo_cite,
        documento: tipo.documento,
        abreviatura: tipo.abreviatura,
        // via: tipo.via,
        descripcion: tipo.descripcion,
        plantilla: tipo.plantilla,
        modelo: tipo.modelo,
      });
      console.log("el uso", tipo.uso);
      if (tipo.uso > 0) {
        this.formTipo.controls["abreviatura"].disable();
        this.formTipo.controls["modelo"].disable();
      } else {
        this.formTipo.controls["abreviatura"].enable();
        this.formTipo.controls["modelo"].enable();
      }
    } else {
      this.formTipo.reset();
      this.formTipo.controls["abreviatura"].enable();
      this.formTipo.controls["modelo"].enable();
    }
    $("#modalTipo").modal("show");
    $(".modal").on("shown.bs.modal", function () {
      $(this).find("[autofocus]").focus();
    });
  }

  registrarTipoCite() {
    if (this.formTipo.controls["modelo"].value.indexOf("$COR") == -1) {
      this.toastr.error("Falta $COR en campo Modelo", "Control Tipo Cite", {
        positionClass: "toast-top-right",
        timeOut: 5000,
        progressBar: true,
      });
      return true;
    }
    if (
      this.dtsTiposCitesAll.filter(
        (f) =>
          f.abreviatura == this.formTipo.controls["abreviatura"].value &&
          f.id_tipo_cite != this.formTipo.controls["idTipoCite"].value
      ).length > 0
    ) {
      this.toastr.error(
        "La abreviatura ya se encuentra asignada a otro tipo cite",
        "Control Tipo Cite",
        { positionClass: "toast-top-right", timeOut: 5000, progressBar: true }
      );
      return true;
    }
    this.cargando = true;
    console.log("para registrar /actualizar tipo cite", this.formTipo.value);
    const tipo = this.formTipo.getRawValue();
    this.tipoEditar ? (tipo.operacion = "U") : (tipo.operacion = "I");
    tipo.usuario_registro = this.idUsuario;
    tipo.via = false;
    this._sipta.crudTipoCite(tipo).subscribe(
      (result: any) => {
        console.log("el result", result);
        if (!result[0].message.toUpperCase().startsWith("ERROR")) {
          this.toastr.success(
            "Tipo Cite creado con Éxito!!!",
            "Registro Tipo Cite",
            {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            }
          );
          this.listarTipoCites("T");
        } else {
          this.toastr.error(
            "Error al crear tipo cite: " + result[0].message,
            "Registro Tipo Cite",
            {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            }
          );
        }
        this.tipoEditar = false;
        $("#modalTipo").modal("hide");
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

  anularTipo(tipo: any) {
    this.cargando = true;
    console.log("anulando", tipo);
    tipo.operacion = "D";
    tipo.idTipoCite = tipo.id_tipo_cite;
    tipo.usuario_registro = this.idUsuario;
    this._sipta.crudTipoCite(tipo).subscribe(
      (result: any) => {
        console.log("el result", result);
        if (!result[0].message.toUpperCase().startsWith("ERROR")) {
          this.toastr.success(
            "Tipo Documento anulado correctamente",
            "Anular Tipo Documento",
            {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            }
          );
          this.listarTipoCites("T");
        } else {
          this.toastr.error(
            "Error al anular tipo documento: " + result[0].message,
            "Anular Tipo Documento",
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
  }

  abrirFormCites() {
    console.log("abrir form cite");
    this.usuarioCite = null;
    // this.nuevaOficina = 0;
    $("#modalCite").modal("show");
    $("#usuario").val("");
    $(".modal").on("shown.bs.modal", function () {
      $(this).find("[autofocus]").focus();
    });
  }

  desplegarUsuario(nombre: string) {
    $(":checkbox").prop("checked", false);
    this.usuarioCite = this.dtsUsuarios.filter(
      (f) => f.nombre_completo_usuario === nombre
    )[0];
    this.listarTipoCites(`FU${this.usuarioCite.usu_id}`);
    console.log("usuario cargado", this.usuarioCite);
    this.listarDocumentosRecientes(
      "U" + this.usuarioCite.usu_id.toString(),
      this.gestionActual
    );
    setTimeout(() => {
      this.dtsTiposUsuario.forEach((element) => {
        $("#c" + element.id_tipo_cite).prop("checked", true);
      });
    }, 400);
  }

  registrarUsuariosTipo() {
    console.log("registrando cites para usuario", this.usuarioCite);
    let confirmados = [];
    document.querySelectorAll("input:checked").forEach((v) => {
      confirmados.push(v.getAttribute("id"));
    });

    let activos = confirmados.map((el) => {
      let armado = {
        operacion: "I",
        idUsuarioTipo: 0,
        fidUsuario: this.usuarioCite.usu_id,
        fidTipo: el.replace("c", ""),
        usuario_registro: this.idUsuario,
      };
      return armado;
    });

    console.log("el armado", activos, confirmados, this.dtsTiposUsuario);

    let comparados = activos;
    this.dtsTiposUsuario.forEach((el) => {
      comparados = comparados.filter((f) => f.fidTipo != el.id_tipo_cite);
      if (!confirmados.includes("c" + el.id_tipo_cite))
        comparados.push({
          operacion: "D",
          idUsuarioTipo: el.id_usuario_tipo,
          fidUsuario: this.usuarioCite.usu_id,
          fidTipo: el.fid_tipo,
          usuario_registro: this.idUsuario,
        });
    });

    console.log("filtrando ya insertados", comparados);

    comparados.forEach((el) => {
      this._sipta.crudUsuarioTipo(el).subscribe(
        (result: any) => {
          console.log("el result usuarioTIpo", result);
          if (result[0].message.toUpperCase().startsWith("ERROR")) {
            this.toastr.error(
              "Error al crear documento para usuario: " + result[0].message,
              "Registro Documento Usuario",
              {
                positionClass: "toast-top-right",
                timeOut: 5000,
                progressBar: true,
              }
            );
          }
          $("#modalCite").modal("hide");
          this.listarDocumentosRecientes("" + this.idUsuario, this.gestionSel);
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

    if (comparados.length == 0) this.cargando = false;
  }

  onChangeReferencia() {
    this.usuariosCorrectos = true;
  }

  onChangeModelo() {
    // this.formDocumento.controls[campo].setValue(cargo[0].usu_cargo);
    if (!this.formDocumento.controls["descTipo"].value) return true;
    const id = this.dtsTiposCites.filter(
      (f) => f.documento === this.formDocumento.controls["descTipo"].value
    )[0].id_tipo_cite;
    this.formDocumento.controls["fidTipo"].setValue(id);
    console.log(
      "tenemmos el modelo",
      id,
      this.formDocumento.controls["descTipo"]
    );
    if (id) {
      const modelos = this.dtsDocumentos.filter((f) => f.fid_tipo == id);
      console.log("MODELO OBTENIDO", modelos);
      modelos.length > 0
        ? (this.elModelo = modelos.sort(
            (a, b) => a.fecha_registro - b.fecha_registro
          )[0].codigo)
        : (this.elModelo = this.dtsTiposCites
            .filter((f) => f.id_tipo_cite == id)[0]
            .modelo.replace("$OFI", "Unidad-Area")
            .replace("$TIP", "Tipo Documento")
            .replace("$COR", "0001")
            .replace("$GES", new Date().getFullYear().toString().slice(-2))
            .replace("$MOS", "mosca"));

      console.log("MODELO NRO 3", this.elModelo);
    }
  }

  recibeMensaje($event, tipo: string) {
    console.log(
      "recibiendo mensaje de chart",
      $event,
      tipo,
      this.labelsPie[$event.d],
      this.periodosBarras[$event.d].toString()
    );
    if (tipo == "pie") {
      this.dtsDocumentosUsuario = this.dtsDocumentosAll.filter(
        (f) =>
          f.documento == this.labelsPie[$event.d] &&
          f.usuario_registro == this.idUsuario
      );
      this.armarTabla();
    }
    if (tipo == "barras") {
      this.dtsDocumentosUsuario = this.dtsDocumentosAll.filter(
        (f) =>
          new Date(f.fecha_registro).toLocaleDateString("es-es", {
            month: "long",
          }) == this.periodosBarras[$event.d].toString() &&
          f.usuario_registro == this.idUsuario
      );
      console.log(
        this.dtsDocumentosUsuario,
        this.dtsDocumentosAll,
        this.idUsuario
      );

      this.armarTabla();
    }
  }

  armarTabla() {
    this._fun.limpiatabla(".dt-documentos1");
    setTimeout(() => {
      let confiTable = this._fun.CONFIGURACION_TABLA_V6(
        [50, 100, 150, 200],
        false,
        10,
        [3, "desc"]
      );
      if (!$.fn.dataTable.isDataTable(".dt-documentos1")) {
        var table = $(".dt-documentos1").DataTable(confiTable);
        this._fun.inputTable(table, [0, 1, 2]);
      }
    }, 100);
  }

  hitorial_cites() {
    this.cites_historicos = !this.cites_historicos;
    if (this.cites_historicos) {
      let tabla2 = ".dt-documentos2";
      this._fun.limpiatabla(tabla2);
      setTimeout(() => {
        let confiTable2 = this._fun.CONFIGURACION_TABLA_V7(
          [50, 100, 150, 200],
          false,
          10,
          true,
          [
            [1, "desc"],
            [3, "desc"],
          ]
        );
        if (!$.fn.dataTable.isDataTable(tabla2)) {
          var table2 = $(tabla2).DataTable(confiTable2);
          this._fun.inputTable(table2, [1, 2, 3]);
          this._fun.selectTable(table2, [0, 4]);
        }
      }, 100);
    }
  }
  hitorial_cites_adm() {
    this.vwHitorial_cites_adm = !this.vwHitorial_cites_adm;
    if (this.vwHitorial_cites_adm) {
      const tbl2 = ".dt-docuser2";
      this._fun.limpiatabla(tbl2);
      setTimeout(() => {
        let confiTable4 = this._fun.CONFIGURACION_TABLA_V7(
          [50, 100, 150, 200],
          false,
          5,
          true,
          [[0, "desc"]],
          true,
          [{ visible: false, targets: 0 }]
        );
        if (!$.fn.dataTable.isDataTable(tbl2)) {
          var table4 = $(tbl2).DataTable(confiTable4);
          this._fun.inputTable(table4, [2, 3, 4]);
          this._fun.selectTable(table4, [1, 5]);
        }
      }, 100);
    }
  }
}
