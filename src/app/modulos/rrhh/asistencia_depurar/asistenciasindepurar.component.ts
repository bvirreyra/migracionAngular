import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Globals } from "../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import * as moment from "moment";
import { NgSelect2Module } from "ng-select2";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";
import { RrhhService } from "../rrhh.service";
import { ToastrService } from "ngx-toastr";
declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-asistencia",
  templateUrl: "./asistenciasindepurar.component.html",
  styleUrls: ["./asistenciasindepurar.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    RrhhService,
    NgSelect2Module,
  ],
})
export class AsistenciaSinDepurarComponent implements OnInit {
  public cargando: boolean = false;
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

  //variables del componente
  public dts_asistencia: any;
  public fecha_inicio: string;
  public fecha_fin: string;
  public dts_funcionario: any;
  public e_usuario: any;
  public comboSeleccion: any;
  public reporte: {
    biometrico: any;
    fechaDesde: any;
    fechaHasta: any;
    nombre: any;
  };
  public asistencia: {
    idBiometrico: any;
    fechaHoraMarcado: any;
    entradaSalida: any;
    operacion: any;
  };

  dtsOmisiones:any[]=[];
  fechaOmision:string = moment().format('YYYY-MM-DD');
  horaOmision:string;
  tipoMarcadoOmision:number;
  elIdOmision:number;
  laObservacion:string;
  maxFecha = moment().format('YYYY-MM-DD');

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _biometrico: RrhhService,

    private globals: Globals,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent,
    private datePipe: DatePipe,
    private base64: ImgBase64Globals,
    private toastr: ToastrService,
  ) {
    this._route.parent.params.subscribe((parametros) => {
      this.s_idcon = parametros["idcon"];
      this.s_idmod = parametros["idmod"];
    });
    this.url = globals.rutaSrvFronEnd;
    this.s_imgLogo = base64.logocabecera;
    this.url_reporte = globals.rutaSrvReportes;
    this.e_usuario = 0;
    this.fecha_inicio = "";

    this.asistencia = {
      idBiometrico: 0,
      fechaHoraMarcado: null,
      entradaSalida: 0,
      operacion: "U",
    };
  }

  ngOnInit() {
    // jquery(".js-example-basic-single").select2();
    function falloCallback(error) {
      console.log("Falló con " + error);
    }

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
        return this.RolesAsignados(this.s_usu_id);
      })
      .then((dts) => {
        this.dts_roles_usuario = dts;
        this.GuardarLocalStorage();
        return this.devuelveUsuarios();
      })
      .then((dts) => {
        this.dts_funcionario = dts;
        return this.armaDatosCombo(this.dts_funcionario);
      })
      .then((dts) => {
        this.reporte = {
          biometrico: this.e_usuario,
          fechaDesde: this.fecha_inicio,
          fechaHasta: this.fecha_fin,
          nombre: "",
        };
        this.paneles("VER_LISTAASISTENCIA");
      })
      .catch(falloCallback);
  }
  DatosConexion() {
    return new Promise((resolve, reject) => {
      this._autenticacion
        .getdatosconexion(this.s_idcon, this.s_idmod)
        .subscribe(
          (result: any) => {
            
            console.log("conexion", result);
            if (Array.isArray(result) && result.length > 0) {
              if (result[0]["_idrol"] != "") {
                this.s_idrol = result[0]["_idrol"];
                this.s_user = result[0]["_usu_user"];
                this.s_nomuser = result[0]["_usu_nom_com"];
                this.s_usu_id = result[0]["_usu_id"];
                this.s_usu_id_sipta = result[0]["_usu_id_sipta"];
                this.s_usu_id_sispre = result[0]["_usu_id_sispre"];
                this.s_ci_user = result[0]["_usu_ci"];
                resolve(result);
                return result;
              }
            } else {
              this.prop_msg =
                "Error: La conexion no es valida, contáctese con el área de sistemas";
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
                "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
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
              "Error: La conexion no es valida, contáctese con el área de sistemas";
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
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
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
  transformAnio(date) {
    return this.datePipe.transform(date, "YYYY");
    //whatever format you need.
  }
  HoraServidor() {
    return new Promise((resolve, reject) => {
      this._autenticacion.gethoraservidor().subscribe(
        (result: any) => {
          
          if (result[0]["HORA"] != "") {
            var hora = this.transformHora(result[0]["HORA"]);
            resolve(hora);
            return hora;
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

  FechaLiteral(f) {
    return this._fun.FechaLiteral(f);
  }
  GuardarLocalStorage() {
    let dts_con = {
      s_idrol: this.s_idrol,
      s_user: this.s_user,
      s_nomuser: this.s_nomuser,
      s_usu_id: this.s_usu_id_sispre,
      s_usu_id_sipta: this.s_usu_id_sipta,
      s_usu_id_sispre: this.s_usu_id_sispre,
      s_ci_user: this.s_ci_user,
    };
    let dts_rol = this.dts_roles_usuario;

    localStorage.setItem("dts_con", JSON.stringify(dts_con));
    localStorage.setItem("dts_rol", JSON.stringify(dts_rol));
  }
  paneles(string, dts?) {
    if (string == "VER_LISTAASISTENCIA") {
      // $('#pnl_listaproyecto').show();
      // this.pnl_tecnica=false;
      // this.pnl_financiero=false;
      // this.pnl_legal=false;
      this.listaAsistencia();
    }
  }

  armaDatosCombo(dts) {
    var combo = new Array(dts.length);
    dts.forEach((element) => {
      let registro = {
        id: element.t_userid,
        text: element.nombre,
      };
      combo.push(registro);
    });
    this.comboSeleccion = combo;
    this.comboSeleccion = this.comboSeleccion.filter(function (el) {
      return el != null;
    });
    this.comboSeleccion.unshift({ id: 0, text: "TODOS" });
    return this.comboSeleccion;
  }

  devuelveUsuarios() {
    var id_usu_siga = this.s_usu_id;
    console.log("Roles", this.dts_roles_usuario);
    this.dts_roles_usuario.forEach((element) => {
      if (element.idrol == "28") {
        id_usu_siga = "0";
        return;
      }
    });

    return new Promise((resolve, reject) => {
      this._biometrico
        .listaUsuarioSispre(id_usu_siga)
        .subscribe((result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            resolve(result);
          }
        });
    });
  }

  mergeTablas(array1, array2) {
    for (let index1 = 0; index1 < array1.length; index1++) {
      //Tabla Asistencia
      for (let index2 = 0; index2 < array2.length; index2++) {
        // Tabla Usuarios
        if (array1[index1]["IdUsuario"] === array2[index2]["t_userid"]) {
          array1[index1]["Nombre"] = array2[index2]["nombre"];
        }
      }
    }
    return array1;
  }

  onChangeFecInicio() {
    this.reporte.fechaDesde = this.fecha_inicio
      .replace("-", "")
      .replace("-", "");
  }

  onChangeFecFin() {
    this.reporte.fechaHasta = this.fecha_fin.replace("-", "").replace("-", "");
  }

  datosReporte() {
    console.log(this.e_usuario, this.fecha_inicio, this.fecha_fin);

    var datos = this.comboSeleccion;

    var filtro = datos.filter((element) => {

      return element.id == this.e_usuario;
    });

    this.reporte.nombre = filtro[0]["text"];
    this.reporte.biometrico = this.e_usuario;
    console.log(this.reporte);
  }

  datosMarcadoModal(registro, marcado) {
    this.asistencia.idBiometrico = registro.IdUsuario;
    this.asistencia.fechaHoraMarcado = registro.FechaMarcadoC + " " + marcado;

    console.log(this.asistencia);
    $("#modalMarcado").modal("show");
  }

  actualizaMarcacion() {
    var fecha = this.asistencia.fechaHoraMarcado.substring(0, 10).split("/");
    var fechaFormato = fecha[2] + fecha[1] + fecha[0];
    this.asistencia.fechaHoraMarcado =
      fechaFormato + this.asistencia.fechaHoraMarcado.substring(10);

    console.log(this.asistencia);
    this._biometrico.actualizarMarcacion(this.asistencia).subscribe(
      (result: any) => {
        
        $("#modalMarcado").modal("hide");
        this.prop_msg = result[0]["_mensaje"];

        this.prop_tipomsg = result[0]["_accion"].includes("Error")
          ? "modal_warning"
          : "modal_success";
        this._msg.formateoMensaje(this.prop_tipomsg, this.prop_msg);
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          // console.log(this.errorMessage);
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos ";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      }
    );
  }

  crudOmision(tipo:string,omision?:any){
    // if(omision && tipo == 'U' && !this.elIdOmision){
    //   this.elIdOmision = omision.IdAsistencia;
    //   return true;
    // }
    console.log('la omision',omision);
    
    if((!this.fechaOmision || !this.horaOmision || !this.e_usuario || !this.laObservacion) && !omision){
      this.toastr.error("Datos faltantes","Registro Omisión",{positionClass: "toast-top-right",timeOut: 5000,progressBar: true,});
      return true;
    }
    this.cargando = true;
    const marcacion={
      idBiometrico:this.e_usuario,
      fechaHoraMarcado:`${this.fechaOmision.replace(/-/g,'')} ${this.horaOmision}:01`,
      entradaSalida:5,
      operacion:tipo,
      idAsistencia:0,
      observacion:(this.laObservacion || '').toUpperCase()
    }
    if(omision){
      marcacion.idBiometrico = omision.IdUsuario;
      marcacion.fechaHoraMarcado = `${omision.FechaHoraMarcado.substring(0,10)} ${omision.Hora}:01`;
      marcacion.idAsistencia = omision.IdAsistencia;
      marcacion.observacion = omision.Observacion.toUpperCase();
    }
    this._biometrico.actualizarMarcacion(marcacion).subscribe(
      (result: any) => {
        
        console.log("el result", result);
        if (result[0]._accion == 'Correcto') {
          this.toastr.success(result[0]._mensaje,"Gestión Omisión",{positionClass: "toast-top-right",timeOut: 5000,progressBar: true,});
          this.listarOmisiones({opcion:'T',id:0});
          this.elIdOmision = null;
          this.fechaOmision = moment().format('YYYY-MM-DD');
          this.horaOmision = '';
          this.laObservacion = '';
        } else {
          this.toastr.error("Error al registrar la omisión: " + result[0]._mensaje,"Gestión Omisión",{positionClass: "toast-top-right",timeOut: 5000,progressBar: true,});
        }
        // $("#modalOmision").modal("hide");
        this.cargando = false;
      },
      (error) => {
        this.cargando = false;
        this.toastr.error(error.toString(), "Error desde el servidor", {positionClass: "toast-top-right",timeOut: 8000,progressBar: true,});
      }
    );
  }

  mostrarOmisiones(){
    $("#modalOmision").modal("show");
    $(".modal").on("shown.bs.modal", function () {
      $(this).find("[autofocus]").focus();
    });
    this.listarOmisiones({opcion:'T',id:0});
    console.log(this.dts_funcionario);
    
  }

  listarOmisiones(opcion:any){
    this._biometrico.listarOmisiones(opcion).subscribe(
      (result: any) => {
        
        console.log("omisiones", result);
        this.dtsOmisiones = result;
        this._fun.limpiatabla('.dt-omisiones');
          setTimeout(() => {let confiTable = this._fun.CONFIGURACION_TABLA_V6([50, 100, 150, 200],false,10,null);
            if (!$.fn.dataTable.isDataTable('.dt-omisiones')) {
              var table = $('.dt-omisiones').DataTable(confiTable);
              this._fun.inputTable(table, [0, 1, 2, 3]);
            }
          }, 100);
      },
      (error) => console.log('error omisiones',error)
    );
  }

  listaAsistencia() {
    this.cargando = true;

    if (
      this.fecha_inicio == null ||
      this.fecha_inicio == "undefined" ||
      this.fecha_inicio == ""
    )
      this.fecha_inicio = moment().format("YYYY-MM-DD").toString();

    if (
      this.fecha_fin == null ||
      this.fecha_fin == "undefined" ||
      this.fecha_fin == ""
    )
      this.fecha_fin = moment().format("YYYY-MM-DD").toString();

    this.reporte.fechaDesde = this.fecha_inicio
      .replace("-", "")
      .replace("-", "");

    this.reporte.fechaHasta = this.fecha_fin.replace("-", "").replace("-", "");

    this._biometrico
      .listaMarcadoSinDepurar(this.e_usuario, this.fecha_inicio, this.fecha_fin)
      .subscribe(
        (result: any) => {
          if (Array.isArray(result) && result.length > 0) {
            this.dts_asistencia = this._fun.RemplazaNullArray(result);

            this.dts_asistencia = this.mergeTablas(
              this.dts_asistencia,
              this.dts_funcionario
            );
            console.log('mostrando asiatenia con post',this.dts_asistencia);
            this._fun.limpiatabla(".dt-asistencia");
            setTimeout(() => {
              let confiTable = this._fun.CONFIGURACION_TABLA_V4(
                [10, 20, 50, 100],
                false,
                50,
                0,
                "asc"
              );
              var table = $(".dt-asistencia").DataTable(confiTable);
              this._fun.inputTable(table, [5, 6]);
              this.cargando = false;
            }, 5);
          } else {
            this.toastr.warning(
              "No existen registros en el biometrico",
              "Cargar marcaciones",
              {
                positionClass: "toast-top-right",
                timeOut: 5000,
                progressBar: true,
              }
            );
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
}
