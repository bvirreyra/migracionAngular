import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { Globals } from "../../../global";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";
import { SispreService } from "../sispre.service";
import { AuditoriaService } from "../../auditoria/auditoria.service";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";
import swal2 from "sweetalert2";
import { event } from "jquery";

declare var $: any;

@Component({
  selector: "app-cites",
  templateUrl: "./cites.component.html",
  styleUrls: ["./cites.component.css"],
})
export class CitesComponent implements OnInit {
  public dtsDatosConexion: any;
  public dtsFechaSrv: any;
  public dtsFechaLiteral: any;
  public dtsHoraSrv: any;

  public m_gestion: any;
  public m_mes_actual: any;

  public errorMessage: string;

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

  // Variables para el compononete de mensajes
  public prop_msg: string;
  public prop_tipomsg: string;

  public url: string;

  // Variables propias del componente
  public opcionCite: string;
  public cite: any = [];
  public detalleCite: any = [];

  public dtsCites: any = [];
  public dtsGeneralCites: any = [];
  public dtsEspecificoCites: any = [];

  public gestion_busqueda: any;
  mostrarAuditoria:boolean = false;
  dtsCitesAuditoria:any[]=[];
  elIdCiteAuditoria:number=0;
  laAbreviatura:string;
  elCodigoPadre:string=null;
  elCiteProyecto:any;
  elFidProyecto:number;

  f1: string = moment(new Date().setDate(1)).format("YYYY-MM-DD");
  f2: string = moment().endOf("month").format("YYYY-MM-DD");
  
  cargando: boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _sispre: SispreService,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent,
    private datePipe: DatePipe,
    private globals: Globals,
    private _auditoria: AuditoriaService,
    private toastr: ToastrService,
  ) {
    this._route.parent.params.subscribe((parametros) => {
      this.s_idcon = parametros["idcon"];
      this.s_idmod = parametros["idmod"];
    });
    this.url = globals.rutaSrvFronEnd;
  }

  ngOnInit() {
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
        this.m_gestion = this.dtsFechaSrv.substr(0, 4);
        this.m_mes_actual = this.dtsFechaSrv.substr(5, 2);
        return this.listaCites();
      })
      .then((dts2) => {
        this.dtsCites = dts2;
        this.listaGeneralCites();
      })
      .catch(falloCallback);
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
                this.s_usu_id_sispre = result[0]["_usu_id_sispre"];
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
              //console.log(this.errorMessage);
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
  InicioCites() {
    $("#pnlListaCites").show();
    $("#pnlListaCiteEspecifico").hide();
    $("#pnlRegistroCites").hide();
    this.dtsEspecificoCites = [];
  }
  InicioCitesEspecifico() {
    $("#pnlListaCites").hide();
    $("#pnlListaCiteEspecifico").show();
    $("#pnlRegistroCites").hide();
  }
  pre_lista_especifica(registro: any) {
    this.gestion_busqueda = this.m_gestion;
    this.cite.tipo = registro._id;
    this.cite.descripcion = registro._descripcion;
    this.cite.sigla = registro._sigla;
    console.log('bonk',this.cite,this.cite.tipo);
    this.listaEspecificaCite();
  }
  async pre_estado_cite(opcion: string, registro: any,id_proyecto?:number) {
    if(this.cite.tipo == 11) {
      console.log('entra nuevo');
      if(typeof(registro) == 'object') registro.tipo = opcion
      this.mostrarAuditoria = true;
      this.elCodigoPadre = registro.length>0 ? registro : null;
      this.elIdCiteAuditoria = 0;
      if(opcion == 'RESPUESTA') this.elCiteProyecto = registro;
      if(opcion != 'RESPUESTA') this.elCiteProyecto = null;
      if(opcion == 'REITERAR') this.elFidProyecto = id_proyecto;
      if(opcion == 'VISTA') this.elCiteProyecto = registro
      if( ['ELIMINAR','FINALIZAR'].includes(opcion)){
        const conf = await swal2({
              title: "Advertencia!!!",
              text: `Realmente desea ${opcion == 'ELIMINAR' ? 'eliminar':'finalizar'} El proyecto?`,
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#d9534f",
              cancelButtonColor: "#f0ad4e",
              customClass: "swal2-popup",
              confirmButtonText: "Confirmar!",
            })
        console.log('la respuesta',conf);
        if(!conf.value) return false;
        registro.operacion= opcion == 'ELIMINAR' ? 'D':'U';
        if(opcion == 'FINALIZAR') registro.estado='FINAL'
        if(opcion == 'FINALIZAR') registro.estado_auditado='INFORME DE AUDITORIA CUMPLIDO SEGÚN CONVENIO'
        registro.fid_proyecto=registro.id_proyecto
        registro.fid_cite=registro.id_cite
        registro.usuario_registro = this.s_usu_id;
        console.log('antes del D',registro);   
        this._auditoria.crudCiteProyecto(registro).subscribe(
          (result: any) => {
            console.log("elimnando cite auditoria", result);
            this.listaEspecificaCite();
          },
          (error) => {
            this.toastr.error(error.toString(), "Error desde el servidor");
          }
        );
      }else{
        $("#modalAuditoria").modal({ backdrop: 'static', keyboard: false });
        $(".modal").on("shown.bs.modal", function () {
          $(this).find("[autofocus]").focus();
        });
      }
      return true;
    }
    this.opcionCite = opcion;
    if (opcion != "INSERTAR") {
      this.detalleCite.id_detalle = registro._id_detalle;
      this.detalleCite.numero_cite = registro._numero_cite;
      this.detalleCite.fecha_registro = this._fun.transformDateOf_yyyymmdd(
        registro._fecha_registro
      );
      this.detalleCite.asunto_referencia = registro._asunto_referencia;
      this.detalleCite.descripcion = registro._descripcion;
      this.detalleCite.estado = registro._estado;
    } else {
      this.detalleCite.fecha_registro = this._fun.transformDateOf_yyyymmdd(
        new Date()
      );
      this.detalleCite.numero_cite = "";
      this.detalleCite.asunto_referencia = "";
    }
    $("#pnl_AnulaConfirmaCite").modal("show");
  }
  listaCites() {
    return new Promise((resolve, reject) => {
      this._sispre.listaCites().subscribe((result: any) => {
        this.InicioCites();
        this.laAbreviatura = (result.filter(f=>f._id == 11)[0] || {})._abreviatura;
        let cites = result;
        resolve(cites);
        return cites;
      });
    });
  }
  listaGeneralCites() {
    this.dtsGeneralCites = [];
    this._sispre
      .listaCitesGeneral(
        this._fun.textoNormal("LISTA_GENERAL"),
        this._fun.textoNormal(this.s_usu_id_sispre)
      )
      .subscribe(
        (result: any) => {
          
          this.dtsGeneralCites = result;
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
  listaEspecificaCite() {
    this.dtsEspecificoCites = [];
    if(this.cite.tipo == 11){
      this.InicioCitesEspecifico();
      this._auditoria.listarCite({opcion:'completo',id:'c.id_cite'}).subscribe(
        (result: any) => {
          console.log("Cites Auditoria", result);
          this.dtsCitesAuditoria = result.filter(f=>f.gestion == this.gestion_busqueda
                || (f.estado!='INFORME DE AUDITORIA CUMPLIDO SEGÚN CONVENIO'
                      && f.estadocp =='INICIAL'
                      && f.gestion<this.gestion_busqueda))//result[0].contenido_json.cites;

          this._fun.limpiatabla(".dt-auditoria");
            setTimeout(() => {
              let confiTable = this._fun.CONFIGURACION_TABLA_V6(
                [10, 20, 50, 100],
                false,
                10,
                [0, "desc"]
              );
              if (!$.fn.dataTable.isDataTable(".dt-auditoria")) {
                var table = $(".dt-auditoria").DataTable(confiTable);
                this._fun.inputTable(table, [0,1,2,3,4,5,6,7,8]);
              }
            }, 50);
        },
        (error) => {
          this.toastr.error(error.toString(), "Error desde el servidor");
        }
      );
    }else{
      this._sispre
        .listaCitesEspecifico(
          this._fun.textoNormal("LISTA_ESPECIFICA"),
          this._fun.textoNormal(this.s_usu_id_sispre),
          this._fun.textoNormal(this.cite.tipo),
          this._fun.textoNormal(this.gestion_busqueda)
        )
        .subscribe(
          (result: any) => { 
            this.InicioCitesEspecifico();
            if (Array.isArray(result) && result.length > 0) {
              this.dtsEspecificoCites = this._fun.RemplazaNullArray(result);
            } else {
              this.prop_msg = "Alerta: No existen registros";
              this.prop_tipomsg = "danger";
              this._msg.formateoMensaje("modal_danger", this.prop_msg);
            }
            this._fun.limpiatabla(".dt-CitesEspecifico");
            setTimeout(() => {
              let confiTable = this._fun.CONFIGURACION_TABLA_V4(
                [10, 20, 50, 100, 150, 200],
                false,
                50,
                0,
                "desc"
              );
              var table = $(".dt-CitesEspecifico").DataTable(confiTable);
              this._fun.selectTable(table, [4]);
              this._fun.inputTable(table, [0, 2, 3]);
            }, 10);
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
  pre_registroCite() {
    if (
      this.detalleCite.asunto_referencia == "" ||
      this.detalleCite.asunto_referencia == undefined ||
      this.detalleCite.asunto_referencia == null
    ) {
      this.prop_msg = "Debe registrar el asunto o la referencia del cite";
      this.prop_tipomsg = "danger";
      this._msg.formateoMensaje("modal_danger", this.prop_msg);
      return;
    } else {
      this.registroCite();
    }
  }
  registroCite() {
    this._sispre
      .insertaCite(
        this._fun.textoNormal("INSERTAR"),
        this._fun.textoNormal(this.s_usu_id_sispre),
        this._fun.textoNormal(this.cite.tipo),
        this._fun.textoUpper(this.detalleCite.asunto_referencia)
      )
      .subscribe(
        (result: any) => {
          
          $("#pnl_AnulaConfirmaCite").modal("hide");
          this.prop_msg = "Se registró de manera correcta";
          this.prop_tipomsg = "success";
          this._msg.formateoMensaje("modal_success", this.prop_msg);
          this.listaEspecificaCite();
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

  aprobar_operacion() {
    if (this.opcionCite == "EDITAR") {
      if (
        this.detalleCite.asunto_referencia == "" ||
        this.detalleCite.asunto_referencia == undefined ||
        this.detalleCite.asunto_referencia == null
      ) {
        this.prop_msg = "El ASUNTO o REFERENCIA no puede quedar vacío.";
        this.prop_tipomsg = "danger";
        this._msg.formateoMensaje("modal_danger", this.prop_msg);
        return;
      }
      this._sispre
        .actualizaCite(
          this._fun.textoNormal("ACTUALIZAR"),
          this._fun.textoNormal(this.detalleCite.id_detalle),
          this._fun.textoUpper(this.detalleCite.asunto_referencia)
        )
        .subscribe(
          (result: any) => {
            
            $("#pnl_AnulaConfirmaCite").modal("hide");
            this.prop_msg = "Se actualizó el registro de manera correcta";
            this.prop_tipomsg = "success";
            this._msg.formateoMensaje("modal_success", this.prop_msg);
            this.listaEspecificaCite();
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
    } else {
      var estado = "0";
      var mensaje = "";
      if (this.opcionCite == "ANULAR") {
        estado = "4";
        this.prop_msg = "El registro se anuló de manera correcta.";
        mensaje = "ANULANDO";
      } else {
        estado = "5";
        this.prop_msg = "El registro se confirmó de manera correcta.";
        mensaje = "CONFIRMANDO";
      }
      if (
        this.detalleCite.descripcion == "" ||
        this.detalleCite.descripcion == undefined ||
        this.detalleCite.descripcion == null
      ) {
        this.prop_msg =
          "Debe registrar la DESCRIPCIÓN por la que se está " +
          mensaje +
          " el cite.";
        this.prop_tipomsg = "danger";
        this._msg.formateoMensaje("modal_danger", this.prop_msg);
        return;
      }
      this._sispre
        .anulaConfirmaCite(
          this._fun.textoNormal("ANULAR_CONFIRMAR"),
          this._fun.textoNormal(this.detalleCite.id_detalle),
          this._fun.textoUpper(this.detalleCite.descripcion),
          this._fun.textoNormal(estado)
        )
        .subscribe(
          (result: any) => {
            
            $("#pnl_AnulaConfirmaCite").modal("hide");
            this.prop_tipomsg = "success";
            this._msg.formateoMensaje("modal_success", this.prop_msg);
            this.listaEspecificaCite();
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
  adjuntarArchivo() {
    console.log("adjunta archivo");
  }

  //#region auditoria cites
  editarCitesAuditoria(id:number,codpadre:string){
    this.elIdCiteAuditoria = 0;
    this.mostrarAuditoria = true;
    this.elIdCiteAuditoria = id;
    this.elCodigoPadre = codpadre || null;
    console.log('rev',this.elIdCiteAuditoria,id);
    this.elCiteProyecto = null;
    $("#modalAuditoria").modal({ backdrop: 'static', keyboard: false });
    $(".modal").on("shown.bs.modal", function () {
      $(this).find("[autofocus]").focus();
    });
  }

  recibeMensaje($event) {
    console.log("recibiendo mensaje CORR-AUD",$event);
    this.gestion_busqueda = $event.gestion;
    this.elIdCiteAuditoria = 0;
    this.elCodigoPadre = null;
    this.elCiteProyecto = null;
    this.elFidProyecto = null;
    this.listaEspecificaCite();
    $("#modalAuditoria").modal('hide');
    this.mostrarAuditoria = false
  }

  reportesCitesAuditoria(tipoReporte){
    this.cargando = true;
    const miDTS = { tipoReporte,f1:this.f1,f2:this.f2};
    let nombreReporte = `CITES_Auditoria_${moment().format('YYYY-MM-DD')}.xlsx`;
    if(tipoReporte=='02') nombreReporte = `CITES_Aud_Alertas_${moment().format('YYYY-MM-DD')}.xlsx`;
    if(tipoReporte=='03') nombreReporte = `Historico_Proyecto_${moment().format('YYYY-MM-DD')}.xlsx`;

    this._auditoria.reportesAuditoria(miDTS).subscribe(
      (result: any) => {
        console.log(result);
        const url = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", nombreReporte);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        this.cargando = false;
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor");
        this.cargando = false;
      }
    );
  }
  //#endregion
}
