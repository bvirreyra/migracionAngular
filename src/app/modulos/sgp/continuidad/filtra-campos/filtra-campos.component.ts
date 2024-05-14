import { DatePipe } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { Globals } from "../../../../global";

/*servicios*/
import { AutenticacionService } from "../../../seguridad/autenticacion.service";

import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import alasql from "alasql";
import { MensajesComponent } from "../../../seguridad/mensajes/mensajes.component";
import { SgpService } from "../../sgp.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important
declare var $: any;
declare let L;
moment.locale("es");

@Component({
  selector: "app-filtra-campos",
  templateUrl: "./filtra-campos.component.html",
  styleUrls: ["./filtra-campos.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
  ],
})
export class FiltraCamposComponent implements OnInit, OnChanges {
  @Input("inputDts") inputDts: any;
  @Input("filtros") filtros: any;
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

  /***********************************
   * VARIABLES DEL COMPONENTE
   ***********************************/

  public dts_principal: any;
  public dts_departamento: any;
  public dts_municipio: any;
  public dts_area: any;

  public m_departamento: any = "TODOS";
  public m_municipio: any = "TODOS";
  public m_area: any = "TODOS";
  public m_tipofinanciamiento: any = "TODOS";

  // public datos_monitoreo: {
  //   operacion: string;
  //   id_monitoreo: number;
  //   fid_compromiso: number;
  //   etapa: string;
  //   sub_etapa: string;
  //   tipo_financiamiento: string;
  //   tarea: string;
  //   fecha_inicio: string;
  //   fecha_fin: string;
  //   estado_monitoreo: string;
  //   usuario_registro: string;
  //   id_estado: number;
  // };

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,

    private _sgp: SgpService,
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
    $("#filtro_departamento").hide();
    $("#filtro_municipio").hide();
    $("#filtro_area").hide();
    $("#filtro_tf").hide();
    this.cargarInfo();
    console.log(this.filtros);
    for (var i = 0; i < this.filtros.length; i++) {
      let dato = "#" + this.filtros[i];
      console.log("filtros", dato);
      $(dato).show();
    }
  }
  ngOnChanges() {
    this.cargarInfo();
  }
  cargarInfo() {
    this.dts_principal = this.inputDts;
    //FILTRANDO DEPARTAMENTO
    this.dts_departamento = alasql(
      `select  departamento from ? group by departamento `,
      [this.inputDts]
    );
    //FILTRANDO AREA
    this.dts_area = alasql(
      `select  area from ? WHERE area!='' group by area `,
      [this.inputDts]
    );
    console.log("LISTA DEPARTAMENTOS", this.dts_departamento);
    $("#municipio").prop("disabled", true);
  }

  enviarRespuesta(dato) {
    console.log("enviapadre");
    this.respuestaPadre.emit(dato);
  }

  procesofiltros() {
    var consulta: any;
    console.log(
      "FILTROS===>",
      this.m_departamento,
      this.m_municipio,
      this.m_area
    );
    if (this.m_departamento === "TODOS") {
      consulta = alasql(
        `select  * from ? order by departamento,municipio,area asc`,
        [this.dts_principal]
      );
      $("#municipio").prop("disabled", true);
      this.m_municipio = "TODOS";
    }
    if (this.m_departamento != "TODOS") {
      consulta = alasql(
        `select  * from ? where departamento=?   order by departamento,municipio,area asc`,
        [this.dts_principal, this.m_departamento]
      );
      $("#municipio").prop("disabled", false);

      this.dts_municipio = alasql(
        `select  municipio from ? where departamento=? group by municipio  order by municipio asc`,
        [this.dts_principal, this.m_departamento]
      );
    }
    if (this.m_municipio === "TODOS" && this.m_departamento === "TODOS")
      consulta = alasql(
        `select  * from ?   order by departamento,municipio,area asc`,
        [this.dts_principal]
      );
    if (this.m_municipio === "TODOS" && this.m_departamento != "TODOS") {
      consulta = alasql(
        `select  * from ? where departamento=?  order by departamento,municipio,area asc`,
        [this.dts_principal, this.m_departamento]
      );
    }
    if (this.m_municipio != "TODOS") {
      consulta = alasql(
        `select  * from ? where departamento=? and municipio=? order by departamento,municipio,area asc`,
        [this.dts_principal, this.m_departamento, this.m_municipio]
      );
    }

    if (this.m_area != "TODOS") {
      consulta = alasql(
        `select  * from ? where area=? order by departamento,municipio,area asc`,
        [consulta, this.m_area]
      );
    }
    if (this.m_tipofinanciamiento != "TODOS") {
      consulta = alasql(
        `select  * from ? where tipo_financiamiento=? order by departamento,municipio,area asc`,
        [consulta, this.m_tipofinanciamiento]
      );
    }

    setTimeout(() => {
      this.inputDts = consulta;
      const miDTS = {
        OPCION: "EJECUCION_PERIODO_PRESIDENCIAL",
        DTS: this.inputDts,
      };
      this.enviarRespuesta(miDTS);
    }, 20);
  }
  limpiaFiltros() {
    this.m_departamento = "TODOS";
    this.m_municipio = "TODOS";
    this.m_area = "TODOS";
    this.m_tipofinanciamiento = "TODOS";
    this.procesofiltros();
  }
}
