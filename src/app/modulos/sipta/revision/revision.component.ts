import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import swal2 from "sweetalert2";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";
import { SgpService } from "../../sgp/sgp.service";
import { SiptaService } from "../sipta.service";

declare var $: any;

@Component({
  selector: "app-revision",
  templateUrl: "./revision.component.html",
  styleUrls: ["./revision.component.css"],
})
export class RevisionComponent implements OnInit, OnChanges {
  @Input() idProyecto: number;
  @Input() tipoLista: string;
  @Input() consulta: boolean;
  @Input() idCorrespondencia: number;
  @Input() idProveido: number;
  @Output() enviaPadre = new EventEmitter<string>();

  //variables para el compononete de mensajes
  public prop_msg: string;
  public prop_tipomsg: string;
  public errorMessage: string;
  public cargando: boolean = false;

  public idUsuario: number;
  public idRevision: number = 0;
  public idAnexo: number = 0;
  public observacion: string = "";
  public adjuntarAnexo: boolean = true;

  public dts_revision: any;
  public dts_anexo: any;
  public dts_lista: any;
  public dts_lista2: any;

  public file_empty: File;
  public rutaArchivo: string = "";
  public inputArchivo = null;
  public archivoModel: any = {
    TIPO_DOCUMENTO: "",
    CODIGO: "",
    FILE: null,
    NOM_FILE: "",
  };

  public respuesta: any = {
    ACCION: "",
  };

  public dts_listaFinanciera: any;
  public dts_listaJuridica: any;
  public dts_listaTecnica: any;
  public lista: string[] = [];

  public checkList: boolean[] = [false];

  constructor(
    private _sipta: SiptaService,
    private _seguimiento: SgpService,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent,
    private formBuilder: FormBuilder,
    private _autenticacion: AutenticacionService
  ) {}

  async ngOnInit() {
    const datos = await JSON.parse(localStorage.getItem("dts_con"));
    this.idUsuario = datos.s_usu_id;
    // this.cargarLista(this.tipoLista);
  }
  ngOnChanges() {
    this.cargarRevision(this.idProyecto, this.consulta ? "I" : this.tipoLista,this.idCorrespondencia);
  }
  cargarRevision(elIdProyecto, elTipo,elIdCorrespondencia) {
    this.cargando = true;
    console.log("cargando rev", elIdProyecto);
    const data = {
      operacion:'PROYECTO',
      fidProyecto:elIdProyecto,
      fidCorrespondencia:elIdCorrespondencia,
      tipo:elTipo,
    }
    this._sipta.revision(data).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.lista = [];
          this.dts_revision = this._fun.RemplazaNullArray(result);
          if (this.consulta) {
            this.dts_revision.forEach((el) => {
              this.lista = this.lista.concat(el.lista.split(",")); //[...el.lista.split(',')];
              // console.log('armando lista',lista);
            });
            this.cargarAnexosProyecto(this.idProyecto);
          } else {
            this.idRevision = this.dts_revision[0].id_revision;
            this.lista = this.dts_revision[0].lista.split(","); //igual puede subir al foreach
            this.cargarAnexos(this.idRevision);
          }
          this.observacion = this.dts_revision[0].observacion;
        } else {
          // this._msg.formateoMensaje("modal_info", "No existe revisión para el proyecto",6);
          console.log("No existe revisión para el proyecto");
        }
        this.cargando = false;
        this.cargarLista(this.tipoLista);
      },
      (error) => {
        this.cargando = false;
        this.errorMessage = <any>error;
        if (this.errorMessage != null)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage,
            10
          );
      }
    );
  }
  cargarLista(elTipo) {
    this.cargando = true;
    this._seguimiento.listaClasificador(26).subscribe(
      (result: any) => {
        console.log('clasif 26',result);
        
        if (Array.isArray(result) && result.length > 0) {
          if (this.consulta) {
            this.dts_listaFinanciera = this._fun
              .RemplazaNullArray(result)
              .filter(
                (el) =>
                  el.agrupa_clasificador == "FINANCIERA" &&
                  this.lista.includes("c" + el.id_detalle)
              );
            this.dts_listaJuridica = this._fun
              .RemplazaNullArray(result)
              .filter(
                (el) =>
                  el.agrupa_clasificador == "JURIDICA" &&
                  this.lista.includes("c" + el.id_detalle)
              );
            this.dts_listaTecnica = this._fun
              .RemplazaNullArray(result)
              .filter(
                (el) =>
                  el.agrupa_clasificador == "TECNICA" &&
                  this.lista.includes("c" + el.id_detalle)
              );
            console.log(
              "consulta",
              this.dts_listaFinanciera,
              this.dts_listaJuridica
            );
          } else {
            this.dts_lista = this._fun
              .RemplazaNullArray(result)
              .filter((el) => el.agrupa_clasificador == elTipo);
            this.dts_lista2 = this.dts_lista;
          }
          setTimeout(() => {
            this.lista.forEach((element) => {
              if(element) $("#" + element).prop("checked", true);
              //luego borrar todos los checks que no estan true :bonk
              //$('#lab180').parent().remove();//funciona
              // this.dts_listaJuridica = this.dts_listaJuridica.map(el=>{
              //   if (lista.includes('c'+ el.id_detalle)) return el;
              // });
            });
          }, 200);
        } else {
          this._msg.formateoMensaje(
            "modal_danger",
            "Alerta: No existen clasificadores para el ID: 26",
            10
          );
        }
        this.cargando = false;
      },
      (error) => {
        this.cargando = false;
        this.errorMessage = <any>error;
        if (this.errorMessage != null)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage,
            10
          );
      }
    );
  }
  cargarAnexos(id) {
    this._sipta.anexo(id).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_anexo = this._fun.RemplazaNullArray(result);
          this.idAnexo = this.dts_anexo[0].id_anexo;
        } else {
          console.log("sin aenxos registrados");
        }
      },
      (error) => {
        this.cargando = false;
        this.errorMessage = <any>error;
        if (this.errorMessage != null)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage,
            10
          );
      }
    );
  }
  cargarAnexosProyecto(id) {
    this._sipta.anexosProyecto(id).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_anexo = this._fun.RemplazaNullArray(result);
        } else {
          console.log("sin aenxos registrados");
        }
      },
      (error) => {
        this.cargando = false;
        this.errorMessage = <any>error;
        if (this.errorMessage != null)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage,
            10
          );
      }
    );
  }

  registrarRevison() {
    this.cargando = true;
    let confirmados = [];
    let checks = document.querySelectorAll("input:checked").forEach((v) => {
      confirmados.push(v.getAttribute("id"));
    });
    console.log(confirmados);
    let ope = "I";
    if (this.idRevision > 0) ope = "U";
    const laRevision = {
      operacion: ope,
      idRevision: this.idRevision,
      fidProyecto: this.idProyecto,
      fidCorrespondencia: this.idCorrespondencia,
      tipo: this.tipoLista,
      subtipo: null,
      lista: confirmados.toString() || "",
      observacion: this.observacion,
      usuarioRegistro: this.idUsuario,
      fidProveido:this.idProveido,
    };

    this._sipta.crudRevision(laRevision).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          if (result[0].message && !result[0].message.startsWith("ERROR")) {
            this.idRevision = result[0].message.split("-")[1];
            this._msg.formateoMensaje(
              "modal_success",
              "Revisión registrada con éxito!!!"
            );
            // ID && this.archivoModel.NOM_FILE ? console.log('listo para subir anexo'): console.log('no listo anexo',ID,this.archivoModel.NOM_FILE) ;
            if (this.archivoModel.NOM_FILE) this.subirAnexo();
            this.adjuntarAnexo = false;
          } else {
            this._msg.formateoMensaje(
              "modal_danger",
              "Alerta: " + result[0].message,
              10
            );
          }
          this.cargarRevision(this.idProyecto, this.tipoLista,this.idCorrespondencia);
        } else {
          this._msg.formateoMensaje(
            "modal_danger",
            "Alerta: Error al registrar la revisión",
            6
          );
        }
        this.cargando = false;
      },
      (error) => {
        this.cargando = false;
        this.errorMessage = <any>error;
        if (this.errorMessage != null)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage,
            10
          );
      }
    );
  }

  handleFileInput(files: FileList) {
    this.inputArchivo = files.item(0);
    let extensionesValidas = ["pdf"];
    let nombreArchivo = this.inputArchivo.name;
    let extension_archivo = this._fun.nombre_extension(nombreArchivo);
    if (extensionesValidas.indexOf(extension_archivo) < 0) {
      this._msg.formateoMensaje(
        "modal_info",
        "El formato del archivo seleccionado no es válido",
        6
      );
      $("#inputArchivo").val("");
    } else {
      // this.datos_convenio.nombrearchivo = this.inputArchivo.name;
      this.archivoModel.NOM_FILE = this.inputArchivo.name;
      this.archivoModel.TIPO_DOCUMENTO = "INFORME";
      this.archivoModel.CODIGO = this.idProyecto;
      this.archivoModel.NOM_FILE = this.inputArchivo.name;
      if (this.idRevision > 0) this.adjuntarAnexo = false;
    }
  }

  subirAnexo() {
    this.cargando = true;
    if (this.tipoLista == "JURIDICA")
      this.archivoModel.TIPO_DOCUMENTO = "anexo_juridica";
    if (this.tipoLista == "TECNICA")
      this.archivoModel.TIPO_DOCUMENTO = "anexo_tecnica";
    if (this.tipoLista == "FINANCIERA")
      this.archivoModel.TIPO_DOCUMENTO = "anexo_financiera";
    this.archivoModel.CODIGO = this.idProyecto;

    if (!this.archivoModel.TIPO_DOCUMENTO) {
      this._msg.formateoMensaje(
        "modal_warning",
        "Seleccione el tipo de documento a subir",
        6
      );
      return;
    }
    this.archivoModel.FILE =
      this.inputArchivo === null ? this.file_empty : this.inputArchivo;
    this._autenticacion.subirArchivo(this.archivoModel).subscribe(
      (result: any) => {
        let respuestaSubida = result;
        if (respuestaSubida.ok) {
          this.rutaArchivo = respuestaSubida.nombre_archivo;
          this.registrarAnexo(
            this.archivoModel.TIPO_DOCUMENTO,
            `${respuestaSubida.ruta}/${respuestaSubida.nombre_archivo}`
          );
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
                        this.registrarAnexo(
                          this.archivoModel.TIPO_DOCUMENTO,
                          `${respuestaSubida.ruta}/${respuestaSubida.nombre_archivo}`
                        );
                      } else {
                        this._msg.formateoMensaje(
                          "modal_warning",
                          respuestaSubida.message,
                          10
                        );
                      }
                    },
                    (error) => {
                      this.cargando = false;
                      this._msg.formateoMensaje("modal_danger", error, 10);
                    }
                  );
              } else {
                console.log("cancelo");
              }
            });
          } else {
            this._msg.formateoMensaje(
              "modal_warning",
              respuestaSubida.message,
              10
            );
          }
        }
        this.cargando = false;
      },
      (error) => {
        this.cargando = false;
        this._msg.formateoMensaje("modal_danger", error, 10);
      }
    );
  }

  registrarAnexo(tipo: string, ruta: string) {
    this.cargando = true;
    let ope = "I";
    if (this.dts_anexo) ope = "U";
    const elAnexo = {
      operacion: ope,
      idAnexo: this.idAnexo,
      fidRevision: this.idRevision,
      tipo: tipo,
      ruta: ruta,
      observacion: this.observacion,
      usuarioRegistro: this.idUsuario,
    };
    console.log("el aenxo", elAnexo);
    this._sipta.crudAnexo(elAnexo).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          if (result[0].message && !result[0].message.startsWith("ERROR")) {
            this._msg.formateoMensaje(
              "modal_success",
              "Anexo registrado con éxito!!!",
              6
            );
            this.cargarAnexos(this.idRevision);
            this.archivoModel.NOM_FILE = "";
            $("#inputArchivo").val("");
          } else {
            this._msg.formateoMensaje(
              "modal_danger",
              "Alerta: " + result[0].message,
              10
            );
          }
        } else {
          this._msg.formateoMensaje(
            "modal_danger",
            "Error al registrar el anexo",
            6
          );
        }
        this.cargando = false;
      },
      (error) => {
        this.cargando = false;
        this.errorMessage = <any>error;
        if (this.errorMessage != null)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage,
            10
          );
      }
    );
  }
  metodoenviaPadre(dts?) {
    //this.enviaPadre.emit('ok',dts);
    console.log("dato a eliminar", dts);
    this.enviaPadre.emit(dts);
  }
}
