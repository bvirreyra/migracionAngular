import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Globals } from "../../../../../global";

/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { AutenticacionService } from "../../../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../../../seguridad/mensajes/mensajes.component";
import { AccesosRolComponent } from "../../../accesos-rol/accesos-rol.component";
import { SgpService } from "../../../sgp.service";
import { PriorizacionService } from "./priorizacion.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important
declare var $: any;
declare let L;

@Component({
  selector: "app-priorizacion",
  templateUrl: "./priorizacion.component.html",
  styleUrls: ["./priorizacion.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
    AccesosRolComponent,
    PriorizacionService,
  ],
})
export class PriorizacionComponent implements OnInit {
  @Input("id_compromiso") id_compromiso: any;
  @Output() respuestaPadre = new EventEmitter<string>();

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
  public s_usu_area: any;

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
  public pnl_georeferenciacion = false;
  public pnl_supervision = false;
  public pnl_ampliacionplazo = false;
  public dts_listaimagenes: any;

  /***********************************
   * VARIABLES DEL COMPONENTE
   ***********************************/
  public dts_ListaPriorizacion: any;
  public dts_ListaPriorizacionProyecto: any;
  public datos_Priorizacion: {
    operacion: string;
    id_priorizacion: number;
    fid_compromiso: number;
    tipo: string;
    usr_registro: number;
    id_estado: number;
  };

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _priorizacion: PriorizacionService,

    private _sgp: SgpService,
    private _accesos: AccesosRolComponent,

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
    this.dts_listaimagenes = [];

    $(".dt-compromisos").on("click", ".deleteMe", function () {
      var dataString = $(this).attr("data");

      alert(dataString);
    });
    this.datos_Priorizacion = {
      operacion: "",
      id_priorizacion: null,
      fid_compromiso: null,
      tipo: null,
      usr_registro: null,
      id_estado: null,
    };
  }

  ngOnInit() {
    this.obtenerConexion();
    this.listaPriorizacion().then((dts) => {
      this.dts_ListaPriorizacion = dts;
      this.listaPriorizacionProyecto(this.id_compromiso);
    });
  }
  obtenerConexion() {
    this.dtsDatosConexion = JSON.parse(localStorage.getItem("dts_con"));
    this.dts_roles_usuario = JSON.parse(localStorage.getItem("dts_rol"));
    this.s_idrol = this.dtsDatosConexion.s_idrol;
    this.s_user = this.dtsDatosConexion.s_idrol;
    this.s_nomuser = this.dtsDatosConexion.s_nomuser;
    this.s_usu_id = this.dtsDatosConexion.s_usu_id;
    this.s_usu_id_sipta = this.dtsDatosConexion.s_usu_id_sipta;
    this.s_usu_id_sispre = this.dtsDatosConexion.s_usu_id_sispre;
    this.s_ci_user = this.dtsDatosConexion.s_ci_user;
  }
  async listaPriorizacion() {
    let promise = new Promise((resolve, reject) => {
      this._sgp.listaClasificador(41).subscribe(
        (result: any) => {
          resolve(result);
          //this.dts_ListaPriorizacion = result;
          console.log(this.dts_ListaPriorizacion);
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            console.log(this.errorMessage);
            reject("Error en la petición");
            //alert("Error en la petición BUSQUEDA5");
          }
        }
      );
    });
    return await promise;
  }
  listaPriorizacionProyecto(id_compromiso) {
    let fid_compromiso = {
      fid_compromiso: id_compromiso,
    };
    console.log("Lista priorizacion1==>", fid_compromiso);
    this._priorizacion.listaPriorizacionProyecto(fid_compromiso).subscribe(
      (result: any) => {
        
        this.dts_ListaPriorizacionProyecto = result;
        let nro_proyecto = this.dts_ListaPriorizacionProyecto.length;
        let nro_priorizacion = this.dts_ListaPriorizacion.length;
        for (var i = 0; i < nro_proyecto; i++) {
          let tipo = this.dts_ListaPriorizacionProyecto[i].tipo;
          for (var j = 0; j < nro_priorizacion; j++) {
            var name = "#chk_" + j;
            var value = $(name).val();
            console.log("comparacion", tipo, value);
            if (tipo == value) {
              $(name).prop("checked", true);
            }
          }
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la petición BUSQUEDA5");
        }
      }
    );
  }
  pre_registro_priorizacion() {
    this.cargando = true;
    var nro = this.dts_ListaPriorizacion.length;

    for (var i = 0; i < nro; i++) {
      var name = "#chk_" + i;
      console.log("Nombre===>", name);
      if ($(name).is(":checked")) {
        var valor = $(name).val();
        console.log(valor, this.id_compromiso, this.s_usu_id);
        this.crudPriorizacion("I", valor, this.id_compromiso, this.s_usu_id);
      } else {
        var valor = $(name).val();
        this.crudPriorizacion("D", valor, this.id_compromiso, this.s_usu_id);
      }

      if (i == nro - 1) {
        this.cargando = false;
        this.enviarRespuestaPadre("CIERRA_MODAL_PRIORIZACION");
      }
    }
  }
  crudPriorizacion(operacion, valor, id_compromiso, usr_registro) {
    console.log("====>", operacion, valor, id_compromiso, usr_registro);

    this.datos_Priorizacion.operacion = operacion;
    this.datos_Priorizacion.id_priorizacion = null;
    this.datos_Priorizacion.fid_compromiso = id_compromiso;
    this.datos_Priorizacion.tipo = valor;
    this.datos_Priorizacion.usr_registro = Number(this.s_usu_id);
    if (operacion == "I") {
      this.datos_Priorizacion.id_estado = 1;
    } else {
      this.datos_Priorizacion.id_estado = 0;
    }

    this._priorizacion
      .crudPriorizacion(this.datos_Priorizacion)

      .subscribe(
        (result: any) => {
          
          console.log("RESULTADO==>", result);
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
  enviarRespuestaPadre(dts) {
    console.log("entra aqui");
    this.respuestaPadre.emit(dts);
  }
}
