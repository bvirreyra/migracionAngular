import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Globals } from "../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { EmpresaService } from "../empresa-seguimiento/empresa.service";
import { AutenticacionService } from "../seguridad/autenticacion.service";
import { MensajesComponent } from "../seguridad/mensajes/mensajes.component";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important
@Component({
  selector: "app-empresa-seguimiento",
  templateUrl: "./empresa-seguimiento.component.html",
  styleUrls: ["./empresa-seguimiento.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    EmpresaService,
  ],
})
export class EmpresaSeguimientoComponent implements OnInit {
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

  //VARIABLES DEL COMPONENTE

  public parametros: any;
  public s_nit: string;
  public s_nit_usu: string;
  public s_nit_pass: string;

  public dts_listaDatosEmpresa: any;
  public dts_listaProyectosEmpresa: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _fun: FuncionesComponent,
    private _autenticacion: AutenticacionService,
    private _empresaServicio: EmpresaService,
    private globals: Globals,
    private _msg: MensajesComponent,
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
    sessionStorage.clear();
    this._route.parent.paramMap.subscribe((params) => {
      this.parametros = params;
      console.log(this.parametros);
      this.s_nit = this._fun.base64Decode(this.parametros.params.nit);
      this.s_nit_usu = this._fun.base64Decode(this.parametros.params.usu);
      this.s_nit_pass = this._fun.base64Decode(this.parametros.params.pass);
    });
    if (!this.parametros.params.hasOwnProperty("nit")) {
      this._router.navigate(["./login/"]);
    } else {
      console.log("SOY EMPRESA");
      this.listaDatosEmpresa(this.s_nit);
      this.paneles("VER_PROYECTOS");
    }
  }
  GuardarLocalStorage() {
    let dts_con = {
      s_idEmpresa: this.dts_listaDatosEmpresa[0]["id_empresa"],
      s_direccion: this.dts_listaDatosEmpresa[0]["direccion"],
      s_matricula: this.dts_listaDatosEmpresa[0]["matricula"],
      s_nombre: this.dts_listaDatosEmpresa[0]["nombre"],
      s_nit: this.dts_listaDatosEmpresa[0]["nit"],
    };
    //let dts_rol = this.dts_roles_usuario;

    localStorage.setItem("dts_con", JSON.stringify(dts_con));
    //localStorage.setItem("dts_rol", JSON.stringify(dts_rol));
  }
  paneles(string, dts?) {
    if (string == "VER_PROYECTOS") {
      this.listaProyectosEmpresa(this.s_nit);
    }
  }

  listaProyectosEmpresa(nit) {
    this.cargando = true;
    this._empresaServicio.listaProyectosEmpresa(nit).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_listaProyectosEmpresa = result;

          console.log(this.dts_listaProyectosEmpresa);
          this.conf_tablaListaProyectosEmpresa();
          // this.conf_tablaObservaciones();
        } else {
          this.prop_msg = "Alerta: No existen Proyectos Asignados a la Empresa";
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
  conf_tablaListaProyectosEmpresa() {
    this._fun.limpiatabla(".dt-proyectos");
    setTimeout(() => {
      let confiTable = this._fun.CONFIGURACION_TABLA_V6(
        [50, 100, 150, 200],
        false,
        20
      );
      var table = $(".dt-proyectos").DataTable(confiTable);
      //this._fun.selectTable(table, [1, 2, 3, 4, 5,7]);
      //this._fun.inputTable(table, [6,10]);
      this.cargando = false;
    }, 5);
  }
  conf_tablaObservaciones() {
    this._fun.limpiatabla(".dt-observaciones");
    setTimeout(() => {
      let confiTable = this._fun.CONFIGURACION_TABLA_V6(
        [50, 100, 150, 200],
        false,
        20
      );
      var table = $(".dt-observaciones").DataTable(confiTable);
      //this._fun.selectTable(table, [1, 2, 3, 4, 5,7]);
      //this._fun.inputTable(table, [6,10]);
      this.cargando = false;
    }, 5);
  }
  listaDatosEmpresa(nit) {
    this.cargando = true;
    console.log(nit);
    this._empresaServicio.listaDatosEmpresa(nit).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_listaDatosEmpresa = this._fun.RemplazaNullArray(result);
          console.log(this.dts_listaDatosEmpresa);
        } else {
          this.prop_msg = "Alerta: No existen datos de la Empresa";
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
}
