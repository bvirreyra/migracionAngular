import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { AutenticacionService } from "src/app/modulos/seguridad/autenticacion.service";
import { MensajesComponent } from "../../../seguridad/mensajes/mensajes.component";
import { AccesosRolComponent } from "../../accesos-rol/accesos-rol.component";
import { SgpService } from "../../sgp.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-ambiental",
  templateUrl: "./ambiental.component.html",
  styleUrls: ["./ambiental.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
    AccesosRolComponent,
  ],
})
export class AmbientalComponent implements OnInit {
  @Input() idProyecto: number;
  @Input() nombreProyecto: string;
  @Input() idSGP: number;

  @Output() messageEvent = new EventEmitter<string>();

  /*VARIABLES PARA MASCARAS */
  public mask_numerodecimal: any;
  public mask_fecha: any;
  public mask_numero: any;
  public mask_gestion: any;
  public mask_cite: any;

  //variables para el compononete de mensajes
  public prop_msg: string;
  public prop_tipomsg: string;

  //variables de session y iniciales
  public s_idcon: string;
  public s_idmod: string;
  public s_idrol: number;
  public s_user: string;
  public s_nomuser: string;
  public s_usu_id: string;
  public dts_roles_usuario: any;
  public s_usu_id_sipta: any;
  public s_usu_id_sispre: any;
  public s_ci_user: any;

  public url: string;
  public urlApi: string;
  public url_reporte: string;
  public errorMessage: string;
  public fechasrv: string;

  public dtsDatosConexion: any;
  public dtsFechaSrv: any;
  public dtsFechaLiteral: any;
  public dtsHoraSrv: any;
  public dtsAnio: any;
  public s_imgLogo: any;

  public m_gestion: any;
  public m_mes_actual: any;

  public pnl_listaproyecto = false;
  public pnl_supervision = false;
  public pnl_ampliacionplazo = false;

  public pnl_tecnica = false;
  public pnl_financiero = false;
  public pnl_legal = false;

  //variables para el compononete de mensajes

  public cargando: boolean = false;

  public idUsuario: number;
  public dts_ambiental: any;
  public dts_otros: any;
  public dts_tipo: any;
  public dts_ubicacion: any;
  public dts_observacion: any;
  public idAmbiental: number = 0;
  public editando: boolean = false;
  public habilitarEnvio: boolean = false;
  public mostrarArchivo: boolean = false;
  public pnl_ambiental = false;

  public camposHabilitados: {};

  formAmbiental: FormGroup;

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

  constructor(
    private _route: ActivatedRoute,
    private _seguimiento: SgpService,
    private _autenticacion: AutenticacionService,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent,
    private _accesos: AccesosRolComponent,
    private formBuilder: FormBuilder
  ) {
    this._route.parent.params.subscribe((parametros) => {
      this.s_idcon = parametros["idcon"];
      this.s_idmod = parametros["idmod"];
    });
  }

  ngOnInit() {
    this.obtenerConexion()
      .then(() => {
        return this._accesos.accesosRestriccionesxRolV2(this.s_usu_id);
      })
      .then((data) => {
        this.camposHabilitados = data;
        this.camposHabilitados["_ambientalista"] = data["_ambientalista"];
        console.log("Adm Rolesaa===>", this.camposHabilitados);
        console.log(
          "Adm Rolesaa===>",
          this.camposHabilitados["_ambientalista"]
        );

        if (this.camposHabilitados["_ambientalista"] == false) {
          this.formAmbiental.controls.codigo.enable();
          this.formAmbiental.controls.tipo.enable();
          this.formAmbiental.controls.observacion.enable();
          this.formAmbiental.controls.ubicacion.enable();
          this.formAmbiental.controls.transferencia.enable();
        } else {
          this.formAmbiental.controls.codigo.disable();
          this.formAmbiental.controls.tipo.disable();
          this.formAmbiental.controls.observacion.disable();
          this.formAmbiental.controls.ubicacion.disable();
          this.formAmbiental.controls.transferencia.disable();
        }

        const datos = JSON.parse(localStorage.getItem("dts_con"));
        console.log(datos);
        this.idUsuario = datos.s_usu_id;

        this.cargarCombos();
        this.cargarAmbiental();
      });
    this.formAmbiental = this.formBuilder.group({
      proyecto: [this.nombreProyecto],
      codigo: [{ value: "", disabled: true }, Validators.required],
      tipo: [{ value: "", disabled: true }, Validators.required],
      observacion: [{ value: "", disabled: true }, Validators.required],
      ubicacion: [{ value: "", disabled: true }, Validators.required],
      transferencia: [{ value: "", disabled: true }, Validators.required],
      archivo: ["", Validators.required],
    });
  }
  obtenerConexion() {
    //  var camposHabilitados;
    return new Promise((resolve, reject) => {
      this.dtsDatosConexion = JSON.parse(localStorage.getItem("dts_con"));
      this.dts_roles_usuario = JSON.parse(localStorage.getItem("dts_rol"));
      this.s_idrol = this.dtsDatosConexion.s_idrol;
      this.s_user = this.dtsDatosConexion.s_idrol;
      this.s_nomuser = this.dtsDatosConexion.s_nomuser;
      this.s_usu_id = this.dtsDatosConexion.s_usu_id;
      this.s_usu_id_sipta = this.dtsDatosConexion.s_usu_id_sipta;
      this.s_usu_id_sispre = this.dtsDatosConexion.s_usu_id_sispre;
      this.s_ci_user = this.dtsDatosConexion.s_ci_user;
      //this.accesosRestriccionesxRol(JSON.parse(localStorage.getItem("dts_rol")));
      // camposHabilitados= this._accesos.accesosRestriccionesxRol(
      //   JSON.parse(localStorage.getItem("dts_rol"))
      // );
      // resolve(camposHabilitados);
      resolve(1);
    });
  }

  cargarCombos() {
    this._seguimiento.listarClasificadorTotal().subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_tipo = this._fun
            .RemplazaNullArray(result)
            .filter((el) => el.id_tipoclasificador == 28);
          this.dts_otros = this._fun
            .RemplazaNullArray(result)
            .filter((el) => el.id_tipoclasificador == 29);
          this.dts_observacion = this._fun
            .RemplazaNullArray(result)
            .filter((el) => el.id_tipoclasificador == 30);
          this.dts_ubicacion = this._fun
            .RemplazaNullArray(result)
            .filter((el) => el.id_tipoclasificador == 31);
        } else {
          this.prop_msg = "Alerta: No existen clasificadores";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      }
    );
  }

  cargarAmbiental() {
    this.pnl_ambiental = true;
    this.cargando = true;
    this.mostrarArchivo = false;
    this._seguimiento.ambiental(this.idProyecto).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_ambiental = this._fun.RemplazaNullArray(result);
          this.idAmbiental = this.dts_ambiental[0].id_ambiental;
          this.formAmbiental.setValue({
            proyecto: this.nombreProyecto,
            codigo: this.dts_ambiental[0].codigo,
            tipo: this.dts_ambiental[0].tipo,
            observacion: this.dts_ambiental[0].observacion,
            ubicacion: this.dts_ambiental[0].ubicacion,
            transferencia: this.dts_ambiental[0].transferencia,
            archivo: this.dts_ambiental[0].archivo,
          });
          if (this.dts_ambiental[0].archivo) this.mostrarArchivo = true;
          const lista = this.dts_ambiental[0].otros.split(",");
          setTimeout(() => {
            console.log("arr", lista, this.dts_otros);
            lista.forEach((element) => {
              this.dts_otros.forEach((el) => {
                if (el.descripciondetalleclasificador == element)
                  $("#c" + el.id_detalle).prop("checked", true);
              });
            });
          }, 200);
          this.editando = true;
          this.cargando = false;
        } else {
          this.prop_msg = "Alerta: No existen ficha ambiental registrada";
          this.prop_tipomsg = "info";
          this._msg.formateoMensaje("modal_info", this.prop_msg);
        }
        this.cargando = false;
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      }
    );
  }

  armarOtros(e) {
    console.log("armando", e);
    this.habilitarEnvio = true;
  }

  handleFileInput(files: FileList) {
    this.inputArchivo = files.item(0);
    let extensionesValidas = ["pdf"];
    let nombreArchivo = this.inputArchivo.name;
    let extension_archivo = nombreArchivo.substr(
      nombreArchivo.indexOf(".") + 1
    );
    console.log("archivo", this.inputArchivo);
    console.log(extension_archivo);
    if (extensionesValidas.indexOf(extension_archivo) < 0) {
      this.prop_msg = "El formato del archivo seleccionado no es válido";
      this.prop_tipomsg = "modal_info";
      this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
      $("#inputArchivo").val("");
    } else {
      this.formAmbiental.get("archivo").setValue(this.inputArchivo.name);
      this.habilitarEnvio = true;
      this.archivoModel.NOM_FILE = this.inputArchivo.name;
      this.archivoModel.TIPO_DOCUMENTO = "ficha_ambiental";
      this.archivoModel.CODIGO = this.idProyecto;
      this.archivoModel.NOM_FILE = this.inputArchivo.name;
    }
  }

  registrarAmbiental() {
    this.cargando = true;
    console.log("registrando ambiental");
    let confirmados = [];
    document.querySelectorAll("input:checked").forEach((v) => {
      if (v.classList.contains("check")) {
        const obs = this.dts_otros.filter(
          (el) => el.id_detalle == v.getAttribute("id").replace("c", "")
        );
        console.log(obs);
        confirmados.push(obs[0].descripciondetalleclasificador);
      }
    });
    console.log(confirmados);
    let ope = "I";
    if (this.idAmbiental > 0) ope = "U";
    const fichaAmbiental = {
      operacion: ope,
      idAmbiental: this.idAmbiental,
      fidProyecto: this.idProyecto,
      fidSGP: this.idSGP,
      codigo: (this.formAmbiental.value.codigo || "").toUpperCase(),
      tipo: this.formAmbiental.value.tipo,
      archivo: this.formAmbiental.value.archivo,
      transferencia: (
        this.formAmbiental.value.transferencia || ""
      ).toUpperCase(),
      ubicacion: this.formAmbiental.value.ubicacion,
      otros: confirmados.toString(),
      observacion: this.formAmbiental.value.observacion,
      usuarioRegistro: this.idUsuario,
    };

    this._seguimiento.crudAmbiental(fichaAmbiental).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          if (result[0].message && !result[0].message.startsWith("ERROR")) {
            if (ope != "D") {
              this.prop_msg = "Ficha Ambiental registrada con éxito!!!";
              this.prop_tipomsg = "success";
              this._msg.formateoMensaje("modal_success", this.prop_msg);
              // this.archivoModel.NOM_FILE!='' ? this.subirAdjunto() :  this.cargarAmbiental();
              this.cargarAmbiental();
              this.habilitarEnvio = false;
            }
          } else {
            this.prop_msg = "Alerta: " + result[0].message;
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
          // this.cargarRevision(this.idProyecto,this.tipoLista);
        } else {
          this.prop_msg = "Alerta: Error al registrar la revisión";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
          this.cargando = false;
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      }
    );
  }

  subirAdjunto() {
    this.cargando = true;
    console.log("subiendo archivo");
    this.archivoModel.CODIGO = this.idProyecto;
    if (
      this.archivoModel.TIPO_DOCUMENTO === null ||
      this.archivoModel.TIPO_DOCUMENTO === undefined ||
      this.archivoModel.TIPO_DOCUMENTO === ""
    ) {
      if (this.formAmbiental.value.archivo) {
        this.registrarAmbiental();
      } else {
        this._msg.formateoMensaje(
          "modal_warning",
          "Seleccione el documento a subir"
        );
      }
      return;
    }
    this.archivoModel.FILE =
      this.inputArchivo === null ? this.file_empty : this.inputArchivo;
    console.log(this.archivoModel);
    this._autenticacion.subirArchivo(this.archivoModel).subscribe(
      (result: any) => {
        let respuestaSubida = result;
        if (respuestaSubida.ok) {
          this.nombreArchivo = respuestaSubida.nombre_archivo;
          this.formAmbiental.get("archivo").setValue(this.nombreArchivo);
          this.registrarAmbiental();
        } else {
          // this._msg.formateoMensaje("modal_warning",respuestaSubida.message,10);
          this._autenticacion.reemplazarArchivo(this.archivoModel).subscribe(
            (result: any) => {
              let respuestaSubida = result;
              if (respuestaSubida.ok) {
                this.nombreArchivo = respuestaSubida.nombre_archivo;
                this.formAmbiental.get("archivo").setValue(this.nombreArchivo);
                this.registrarAmbiental();
              } else {
                this._msg.formateoMensaje(
                  "modal_warning",
                  respuestaSubida.message,
                  10
                );
              }
              this.cargando = false;
            },
            (error) => {
              this._msg.formateoMensaje("modal_danger", error, 10);
              this.cargando = false;
            }
          );
        }
        this.cargando = false;
      },
      (error) => {
        this._msg.formateoMensaje("modal_danger", error, 10);
        this.cargando = false;
      }
    );
  }
}
