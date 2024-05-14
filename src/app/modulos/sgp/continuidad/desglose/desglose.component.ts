import { DatePipe, Location } from "@angular/common";
import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Globals } from "../../../../global";

/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { AutenticacionService } from "../../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../../seguridad/mensajes/mensajes.component";
import { SgpService } from "../../sgp.service";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important
declare var $: any;
declare let L;

@Component({
  selector: "app-desglose",
  templateUrl: "./desglose.component.html",
  styleUrls: ["./desglose.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
  ],
})
export class DesgloseComponent implements OnInit {
  @Input("dts_registro") dts_listaProyectos: any;
  @Input("finicio") finicio: any;
  @Input("ffin") ffin: any;

  public cargando = false;
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

  //negocio
  // public dts_listaProyectos: any;
  public inputDts: any;
  public proyectosEntregados: number;
  public montoPE: number;
  public porRegionales: any;
  public porSectores: any;
  public dtsTotalSector: any;
  public dtsTotalRegion: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _seguimiento: SgpService,

    private globals: Globals,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent,
    private datePipe: DatePipe,
    private base64: ImgBase64Globals,

    private location: Location
  ) {
    this._route.parent.params.subscribe((parametros) => {
      this.s_idcon = parametros["idcon"];
      this.s_idmod = parametros["idmod"];
    });
    this.url = globals.rutaSrvFronEnd;
    this.s_imgLogo = base64.logocabecera;
    this.url_reporte = globals.rutaSrvReportes;
    // this.dts_departamento = [];
    // this.dts_municipio = [];
    // this.dts_municipio_back = [];
  }

  ngOnInit() {
    // sessionStorage.clear();
    // function falloCallback(error) {
    //   console.log("Falló con " + error);
    // }

    // this.DatosConexion()
    //   .then((dts1) => {
    //     this.dtsDatosConexion = dts1;
    //     return this.FechaServidor();
    //   })
    //   .then((dts2) => {
    //     this.dtsFechaSrv = dts2[0]["fechasrv"];
    //     this.dtsHoraSrv = this.transformHora(this.dtsFechaSrv);
    //     this.m_gestion = this.dtsFechaSrv.substr(0, 4);
    //     this.m_mes_actual = this.dtsFechaSrv.substr(5, 2);
    //     return this.FechaLiteral(dts2[0]["fechasrv"]);
    //   })
    //   .then((dts3) => {
    //     this.dtsFechaLiteral = dts3;
    //   })
    //   .then((dts) => {
    //     return this.RolesAsignados(this.s_usu_id);
    //   })
    //   .then((dts) => {
    //     this.dts_roles_usuario = dts;
    //     console.log("roles", this.dts_roles_usuario);
    //     this.GuardarLocalStorage();
    //   });
      console.log('dataaaaaaaa',this.dts_listaProyectos);

    // //this.listaProyectos();
    this.cargarInfo();
    this.desgloseRegionales();
    this.desgloseSector();
    // // this.cargarInfo();
    // // this.comboDepartamento();
    // // this.comboMunicipio();
    // //   })
    // //   .catch(falloCallback);
  }

  /*******************************************************************************/
  /*DATOS INICIALES
  /*******************************************************************************/
  DatosConexion() {
    return new Promise((resolve, reject) => {
      console.log(this.s_idcon, this.s_idmod);
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
      s_usu_id: this.s_usu_id,
      s_usu_id_sipta: this.s_usu_id_sipta,
      s_usu_id_sispre: this.s_usu_id_sispre,
      s_ci_user: this.s_ci_user,
    };
    let dts_rol = this.dts_roles_usuario;

    localStorage.setItem("dts_con", JSON.stringify(dts_con));
    localStorage.setItem("dts_rol", JSON.stringify(dts_rol));
  }

  //negocio
  // listaProyectos() {
  //   this.cargando = true;
  //   this._seguimiento.listaProyectoContinuidad().subscribe(
  //     (result: any) => {
  //       
  //       if (Array.isArray(result) && result.length > 0) {
  //         this.dts_listaProyectos = this._fun.RemplazaNullArray(result);
  //         // console.log("esta es la api");
  //         // console.log(this.dts_listaProyectos);
  //         this.inputDts = this._fun.RemplazaNullArray(result);
  //         this.cargarInfo();
  //       } else {
  //         this.prop_msg = "Alerta: No existen responsables registrados1";
  //         this.prop_tipomsg = "danger";
  //         this._msg.formateoMensaje("modal_danger", this.prop_msg);
  //       }
  //     },
  //     (error) => {
  //       this.errorMessage = <any>error;
  //       if (this.errorMessage != null) {
  //         this.prop_msg =
  //           "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
  //         this.prop_tipomsg = "danger";
  //         this._msg.formateoMensaje("modal_danger", this.prop_msg);
  //       }
  //     }
  //   );
  // }

  cargarInfo() {
    this.proyectosEntregados = this.dts_listaProyectos.filter((elemento) => {
      return elemento.entrega_protocolar == "SI";
    }).length;

    let entregados = this.dts_listaProyectos.filter((elemento) => {
      return elemento.entrega_protocolar == "SI";
    });
    this.montoPE = entregados.reduce(
      (ac, el) => ac + parseFloat(el.monto_upre),
      0
    );
    // console.log("total entregados");
    // console.log(this.proyectosEntregados);
    // console.log(this.montoPE);

    // this.porRegionales = group(entregados,'departamento');
    // function group(xs, key) {
    //   return xs.reduce(function(rv, x) {
    //     (rv[x[key]] = rv[x[key]] || []).push(x);
    //     return rv;
    //   }, {});
    // }

    // console.log(this.porRegionales);

    //este si funciona group by
    // function groupBy(array, groups, valueKey) {
    //   var map = new Map;
    //   groups = [].concat(groups);
    //   return array.reduce((r, o) => {
    //       groups.reduce((m, k, i, { length }) => {
    //           var child;
    //           if (m.has(o[k])) return m.get(o[k]);
    //           if (i + 1 === length) {
    //               child = Object
    //                   .assign(...groups.map(k => ({ [k]: o[k] })), { [valueKey]: 0 });
    //               r.push(child);
    //           } else {
    //               child = new Map;
    //           }
    //           m.set(o[k], child);
    //           return child;
    //       }, map)[valueKey] += +o[valueKey];
    //       return r;
    //   }, [])
    // };

    // console.log(groupBy(arr, 'departamento', 'monto'));
  }

  desgloseRegionales() {
    this.cargando = true;
    this._seguimiento
      .desglose("departamento", this.finicio, this.ffin)
      .subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            console.log("POR_REGIONALES====>", result);
            this.porRegionales = this._fun.RemplazaNullArray(result);
            // this.porRegionales = alasql(
            //   "select departamento, cantidad,cast(monto as double) monto  from ?  order by departamento",
            //   [DATO]);
            this._fun.limpiatabla(".dt-regionales");
            setTimeout(() => {
              let confiTable = this._fun.CONFIGURACION_TABLA_V8(
                [50, 100, 150, 200],
                false,
                null,
                true,
                [2, "desc"]
              );
              var table = $(".dt-regionales").DataTable(confiTable);
              //this._fun.selectTable(table, [0]);
              this.dtsTotalRegion = this._fun.totalTable(table, [1, 3]);
              console.log("TOTAL_REGION===>", this.dtsTotalRegion);
              this.cargando = false;
            }, 5);
            this.inputDts = this._fun.RemplazaNullArray(result);
          } else {
            // this.prop_msg = "Alerta: No existen desglose por regionales";
            // this.prop_tipomsg = "danger";
            // this._msg.formateoMensaje("modal_danger", this.prop_msg);
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
            this.cargando = false;
          }
        }
      );
  }

  desgloseSector() {
    this.cargando = true;
    this._seguimiento.desglose("sector", this.finicio, this.ffin).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.porSectores = this._fun.RemplazaNullArray(result);
          this._fun.limpiatabla(".dt-sectores");
          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V8(
              [50, 100, 150, 200],
              false,
              null,
              true,
              [2, "desc"]
            );
            var table = $(".dt-sectores").DataTable(confiTable);
            this.dtsTotalSector = this._fun.totalTable(table, [1, 3]);
            console.log("TOTAL_SECTOR===>", this.dtsTotalSector);
            this.cargando = false;
          }, 5);
          this.cargando = false;
        } else {
          this.cargando = false;
          // this.prop_msg = "Alerta: No existen desglose por sectores";
          // this.prop_tipomsg = "danger";
          // this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
          this.cargando = false;
        }
      }
    );
  }

  retornar() {
    this.location.back();
  }

  reporte() {
    this.cargando = true;
    console.log("generando reporte");
    // window.open("http://localhost:8283/10_reportePrueba/");//ok
    const miDTS = { tipoReporte: "01" };

    this._seguimiento.reportesJuridica(miDTS).subscribe(
      (result: any) => {
        // 
        console.log(result);
        // const file = new Blob([result.blob()], {
        //   type: "application/vnd.ms.excel",
        // });
        //const file = new Blob([result])
        const fileURL = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", "reporteJuridica.xlsx");
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(fileURL);
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
        this.cargando = false;
      }
    );
  }
}
