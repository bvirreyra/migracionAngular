import { DatePipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Inputmask from "inputmask";
import { Globals } from "../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import alasql from "alasql";
import swal2 from "sweetalert2";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";
import { SiptaService } from "../../sipta/sipta.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important
@Component({
  selector: "app-unidadorganizacional",
  templateUrl: "./unidadorganizacional.component.html",
  styleUrls: ["./unidadorganizacional.component.css"],
})
export class unidadorganizacionalComponent implements OnInit {
  //cargar_variable_exportada_de_otro_formulario
  @Input("inputIdInstitucion") id_institucion: string;

  /*VARIABLES PARA MASCARAS */
  public mask_numerodecimal: any;
  public mask_fecha: any;
  public mask_numero: any;
  public mask_gestion: any;

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

  //variables del componente
  public dts_unidad: any;
  public dtsPadres: any;
  public dtsCodigos: any;

  public actualizando: boolean = false;
  public idUnidad: number;
  public nombre: string;
  public descripcion: string;
  public prefijo: string;
  public tipo: string;
  public fidPadre: number;
  public codigo: string;
  public fidTipo: number;
  esCodigoNuevo: boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _sipta: SiptaService,

    private globals: Globals,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent,
    private datePipe: DatePipe,
    private base64: ImgBase64Globals
  ) {
    this._route.parent.params.subscribe((parametros) => {
      this.s_idcon = parametros["idcon"];
      this.s_idmod = parametros["idmod"];
    });
    this.url = globals.rutaSrvFronEnd;
    this.s_imgLogo = base64.logocabecera;
    this.url_reporte = globals.rutaSrvReportes;
  }
  ngOnInit() {
    this.ListaUnidad();
    function falloCallback(error) {
      console.log("Falló con " + error);
    }
    this.mask_numerodecimal = new Inputmask("9{1,9}.9{1,2}");
    this.mask_fecha = new Inputmask("9{1,2}/9{1,2}/9{1,4}");
    this.mask_numero = new Inputmask("9{1,9}");
    this.mask_gestion = new Inputmask("9999");
    this.DatosConexion()
      .then((dts1) => {
        this.dtsDatosConexion = dts1;

        return this.FechaServidor();
      })
      .then((dts2) => {
        this.dtsFechaSrv = dts2[0]["fechasrv"];
        this.dtsHoraSrv = this.transformHora(this.dtsFechaSrv);
        this.m_gestion = this.dtsFechaSrv.substr(0, 4);
        this.m_mes_actual = this.dtsFechaSrv.substr(5, 2);
        return this.FechaLiteral(dts2[0]["fechasrv"]);
      })
      .then((dts3) => {
        this.dtsFechaLiteral = dts3;
      })
      .then((dts) => {
        return this.RolesAsignados(this.dtsDatosConexion[0]._usu_id);
      })
      .then((dts) => {
        this.dts_roles_usuario = dts;
      })
      .catch(falloCallback);
  }
  paneles(string) {
    if (string == "NUEVO_CARGO") {
    }
  }

  DatosConexion() {
    return new Promise((resolve, reject) => {
      this._autenticacion
        .getdatosconexion(this.s_idcon, this.s_idmod)
        .subscribe(
          (result: any) => {
            if (Array.isArray(result) && result.length > 0) {
              if (result[0]["_idrol"] != "") {
                this.s_idrol = result[0]["_idrol"];
                this.s_user = result[0]["_usu_user"];
                this.s_nomuser = result[0]["_usu_nom_com"];
                this.s_usu_id = result[0]["_usu_id"];
                this.s_usu_id_sipta = result[0]["_usu_id_sipta"];
                resolve(result);
                return result;
              }
            } else {
              this.prop_msg =
                "Error: La conexion no es valida2, contáctese con el área de sistemas";
              this.prop_tipomsg = "danger";
              this._msg.formateoMensaje("modal_danger", this.prop_msg);
              reject(this.prop_msg);
            }
          },
          (error) => {
            this.errorMessage = <any>error;
            if (this.errorMessage != null) {
              console.log(this.errorMessage);
              this.prop_msg =
                "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas1";
              this.prop_tipomsg = "danger";
              this._msg.formateoMensaje("modal_danger", this.prop_msg);
            }
            reject(this.prop_msg);
          }
        );
    });
  }
  RolesAsignados(usu_id) {
    return new Promise((resolve, reject) => {
      this._autenticacion.rolesasignados(usu_id).subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            resolve(result);
          } else {
            this.prop_msg =
              "Error: La conexion no es valida1, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
            reject(this.prop_msg);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            console.log(this.errorMessage);
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas2";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
          reject(this.prop_msg);
        }
      );
    });
  }
  FechaServidor() {
    return new Promise((resolve, reject) => {
      this._autenticacion.getfechaservidor().subscribe(
        (result: any) => {
          
          if (result[0]["fechasrv"] != "") {
            resolve(result);
            return result;
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos ";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  transformHora(date) {
    return this.datePipe.transform(date, "HH:mm:ss");
    //whatever format you need.
  }
  FechaLiteral(f) {
    return this._fun.FechaLiteral(f);
  }
  ListaUnidad() {
    this._sipta.getListaunidad().subscribe(
      (result: any) => {
        
        console.log(result);
        if (Array.isArray(result) && result.length > 0) {
          this.dts_unidad = this._fun.RemplazaNullArray(result);
          this.dtsPadres = alasql("select * from ? where fid_tipo = 2", [
            result,
          ]);
          this.dtsCodigos = alasql(
            "select distinct codigo as cod_padre from ? where fid_tipo = 2",
            [result]
          );
          this.esCodigoNuevo = false;
          this._fun.limpiatabla(".dt-unidad");
          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V3(
              [10, 20, 50],
              false
            );
            var table = $(".dt-unidad").DataTable(confiTable);
            this._fun.inputTable(table, [1, 2, 3, 4, 5]);
            this._fun.selectTable(table, [6]);
          }, 500);
        } else {
          this._msg.formateoMensaje(
            "modal_danger",
            "Alerta: No existen registros"
          );
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage
          );
      }
    );
  }

  crudCargo(id: number, opcion: string) {
    console.log("el nombre act", this.nombre, opcion);
    if (
      ((!id &&
        this.dtsCodigos.filter((f) => f.cod_padre === this.codigo)[0] &&
        !this.esCodigoNuevo) ||
        this.dtsPadres.filter(
          (f) => f.id_unidad != id && f.codigo == this.codigo
        ).length > 0) &&
      this.fidTipo == 2
    ) {
      this._msg.formateoMensaje(
        "modal_warning",
        "Alerta: El código ya se encuentra asociado a una UNIDAD/AREA diferente"
      );
      return true;
    }
    if (id) this.idUnidad = id;
    if (!this.idUnidad) {
      this.idUnidad = id;
      opcion = "I";
    }
    const unidad = {
      operacion: opcion,
      idUnidad: this.idUnidad || 0,
      fidTipo: this.fidTipo,
      fidPadre: this.fidPadre || 0,
      nombre: (this.nombre || "").toUpperCase(),
      descripcion: (this.descripcion || "").toUpperCase(),
      codigo: (this.codigo || "").toUpperCase(),
      prefijo: (this.prefijo || "").toUpperCase(),
      usuario_registro: this.s_usu_id,
    };
    this._sipta.getCrudUnidad(unidad).subscribe(
      (result: any) => {
        
        console.log(result);
        if (result[0].message.startsWith("CORRECTO")) {
          this._msg.formateoMensaje("modal_success", result[0].message);
          this.ListaUnidad();
          this.idUnidad = null;
        } else {
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage
          );
        }
        $("#modalCargo").modal("hide");
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage
          );
        $("#modalCargo").modal("hide");
      }
    );
  }

  confirmar(id: number) {
    swal2({
      title: "Advertencia!!!",
      text: `Realmente desea eliminar el registro?`,
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d9534f",
      cancelButtonColor: "#f0ad4e",
      customClass: "swal2-popup",
      confirmButtonText: "Confirmar!",
    })
      .then((result) => {
        console.log(result);
        if (result.value) this.crudCargo(id, "D");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  cargarCargo(cargo: any) {
    this.actualizando = true;
    this.nombre = cargo.nombre;
    this.descripcion = cargo.descripcion;
    this.prefijo = cargo.prefijo;
    this.idUnidad = cargo.id_unidad;
    this.codigo = cargo.codigo;
    this.fidPadre = cargo.fid_padre;
    this.fidTipo = cargo.fid_tipo;
  }

  limpiarCargoModal() {
    this.actualizando = false;
    this.nombre = "";
    this.descripcion = "";
    this.prefijo = "";
    this.idUnidad = null;
    this.codigo = "";
    this.fidPadre = null;
    this.fidTipo = null;
  }

  nuevoElemento(opcion: string) {
    console.log("nuevo elemetno", opcion);
    const nuevo = prompt("Agregar Código", "Nuevo Elemento");
    if (nuevo) {
      if (opcion == "codigo") {
        this.dtsCodigos.push({ cod_padre: nuevo.toUpperCase() });
        this.esCodigoNuevo = true;
      }
    }
  }
}
