import { Component, Input, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import alasql from "alasql";
import swal2 from "sweetalert2";
import { Globals } from "../../../global";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";
import { AccesosRolComponent } from "../accesos-rol/accesos-rol.component";
import { FormularioResumenService } from "../continuidad/proyecto-compromiso/formulario-resumen/formulario-resumen.service";
import { SgpService } from "../sgp.service";

declare var $: any;

@Component({
  selector: "app-compromisos2025",
  templateUrl: "./compromisos2025.component.html",
  styleUrls: ["./compromisos2025.component.css"],
  providers: [SgpService, AccesosRolComponent],
})
export class Compromisos2025Component implements OnInit {
  @Input() departamentoInput: string;
  @Input() municipioInput: string;
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
  public s_fechaServidor: any;

  public idUsuario: number = 0;

  //variables para el compononete de mensajes
  public prop_msg: string;
  public prop_tipomsg: string;
  public errorMessage: string;
  public dts_roles: any;

  //negocio
  public cargando: boolean = false;

  public dts_proyectos: any;
  public dts_inicial: any;

  public pnlFiltros: boolean = false;
  public pnlGrilla: boolean = false;
  public pnlVideo: boolean = false;
  public pnlInfo: boolean = false;

  public nbiMin: number;
  public nbiMax: number;
  public nbiMinIni: number;
  public nbiMaxIni: number;
  public invMMax: number;
  public invMMin: number;
  public invMInicial: number;
  public invMinInicial: number;

  public invUPREMax: number;
  public invUPREMin: number;
  public invUPREMaxIni: number;
  public invUPREMinIni: number;

  public npMax: number;
  public npMin: number;
  public npMaxIni: number;
  public npMinIni: number;

  public cmMax: number;
  public cmMin: number;
  public cmMaxIni: number;
  public cmMinIni: number;

  public ipMax: number;
  public ipMin: number;
  public ipMaxIni: number;
  public ipMinIni: number;

  public pm: string[] = [];
  public area: string[] = [];
  public tipoSolicitud: string[] = [];
  public tipoAprobado: string[] = [];

  public dts_partidos: any;
  public dts_area: any;
  public dts_solicitudes: any;
  public dts_opciones: any;
  public dts_aprobados: any;

  public partidoSel: string;
  public areaSel: string;
  public solicitudSel: string;
  public maeSel: string;
  public estado_aprobadoSel: string;
  public opcionSel: string;

  public campo: string;
  public valor: string;
  public dts_estados: any;
  public totalInicial: number = 0;
  public totalFiltrado: number = 0;
  public queryOrden: string = "";
  public queryFiltro: string = "";
  public listaFiltro: any[] = [];
  public pagina: number = 0;
  public estado: any;

  public dts_departamentos: any;
  public dts_municipios: any;
  public dep: string;
  public mun: string;
  //public dts_inicial: any[] = [];
  public mediaNBI: number;
  public mediaINVU: number;
  public mediaIP: number;
  public mediaNP: number;

  public rutaURL: string;
  public arregloURL: string[] = [];
  public elIdCompromiso: number;

  public proyectosSolicitados: number;
  public municipiosVacios: number;

  public votosNacional: number;
  public votosMuniciapl: number;

  public elNombrProyecto: string;
  public totalRecursos: any;
  private reg = /\d{1,3}(?=(\d{3})+$)/g;
  public poblacion: string;
  public partidoMae: string;

  public elFiltro: string = "";
  public urlBack: string;

  public camposHabilitados: {};
  public dtsDatosConexion: any;

  public presupuestoAsignado: number = 0;
  public presupuestoComprometido: number = 0;
  public presupuestoPorComprometer: number = 0;
  //public gestion:number = moment().year();
  public gestion: number;
  public dtsGestiones: number[] = [];
  public dtsFinanciamientos: any[] = [];
  public gestionSel: number;
  public posicionY: number;

  public elComp: any;

  public resumenTecnico: {
    idCompromiso: number;
    area: string;
    beneficiarios: string;
    costoProyecto: string;
    costoXBeneficiario: string;
    alcance: string;
    situacion: string;
    estado: string;
  } = {
    idCompromiso: 0,
    area: "",
    beneficiarios: "",
    costoProyecto: "",
    costoXBeneficiario: "",
    alcance: "",
    situacion: "",
    estado: "",
  };
  nombreproyectoResuman: any;

  constructor(
    private _sgpservice: SgpService,
    private _autenticacion: AutenticacionService,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent,
    private globals: Globals,
    private _sanitizer: DomSanitizer,
    private _accesos: AccesosRolComponent,
    private _formularioresumen: FormularioResumenService
  ) {
    // this.nbiMin=0;
    // this.nbiMax=100;
    this.cmMin = 0;
    this.cmMax = 100;
    this.dts_proyectos = [];
    this.dts_inicial = [];
    this.pnlGrilla = true;
    this.urlBack = globals.rutaSrvBackEnd;
    // this.invMMin=0;
    // this.invMMax=100;
    // this.dts_opciones.push({documento_ingreso:'NOTA'});
    // this.dts_opciones.push({documento_ingreso:'PERFIL'});
    // this.dts_opciones.push({documento_ingreso:'ESTUDIO DE DISEÑO TECNICO DE PREINVERSION'});
  }

  ngOnInit() {
    const datos = JSON.parse(localStorage.getItem("dts_con"));
    this.idUsuario = datos.s_usu_id;
    this.obtenerConexion();
    this._accesos.accesosRestriccionesxRolV2(this.s_usu_id).then((data) => {
      this.camposHabilitados = data;
      console.log("Adm Roles Filtros===>", this.camposHabilitados);
    });

    this.RolesAsignados();
    this.listarProyectos(0);
    this.gestion = this.s_fechaServidor.substr(0, 4);
    //this.listarFinanciamiento(this.gestion.toString());
    this.listarFinanciamiento(this.s_fechaServidor.substr(0, 4));
    console.log("gestion", this.s_fechaServidor.substr(0, 4));
    this.gestionSel = parseInt(this.s_fechaServidor.substr(0, 4));
    console.log("gestion2", this.gestionSel);
    for (let i = 0; i < 4; i++) {
      this.dtsGestiones.push(this.gestion - i);
    }
  }
  obtenerConexion() {
    this.dtsDatosConexion = JSON.parse(localStorage.getItem("dts_con"));
    this.dts_roles_usuario = JSON.parse(localStorage.getItem("dts_rol"));
    this.s_idrol = this.dtsDatosConexion.s_idrol;
    this.s_user = this.dtsDatosConexion.s_user;
    this.s_nomuser = this.dtsDatosConexion.s_nomuser;
    this.s_usu_id = this.dtsDatosConexion.s_usu_id;
    this.s_usu_id_sipta = this.dtsDatosConexion.s_usu_id_sipta;
    this.s_usu_id_sispre = this.dtsDatosConexion.s_usu_id_sispre;
    this.s_ci_user = this.dtsDatosConexion.s_ci_user;
    this.s_fechaServidor = this.dtsDatosConexion.s_fechaServidor;
  }

  RolesAsignados() {
    this._autenticacion.rolesasignados(this.idUsuario.toString()).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_roles = this._fun
            .RemplazaNullArray(result)
            .map((el) => el.idrol);
          // this.dts_rolesb.includes(72) ? this.idAdmin = this.idUsuario : this.idAdmin = null;
        } else {
          console.log("error al obtener roles", result);
        }
      },
      (error) => {
        console.log("error", error);
      }
    );
  }

  async accesosRestriccionesxRolV2(id) {
    let promise = new Promise((resolve, reject) => {
      this._autenticacion.administracion_roles(id).subscribe(
        (result: any) => {
          this.camposHabilitados = result[0].roles_asignados[0];
          console.log("adm3", this.camposHabilitados);
          resolve(this.camposHabilitados);
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_info", this.prop_msg);
          }
        }
      );
    });
    return await promise;
  }

  listarProyectos(idCompromiso) {
    console.log("cargando proyectos");
    this.cargando = true;
    this._sgpservice.listaProyectos2025({ idCompromiso }).subscribe(
      (result: any) => {
        console.log("result list", result);

        if (!result[0].message) {
          this.dts_proyectos = result.map((el) => {
            el.departamento = el.departamento.toUpperCase();
            el.municipio = el.municipio.toUpperCase();
            return el;
          });
          this.dts_inicial = this.dts_proyectos;
          // this.pnlGrilla = true;
          this.proyectosSolicitados = this.dts_inicial.filter(
            (f) => f.id_compromiso != null
          ).length;
          this.municipiosVacios = this.dts_inicial.filter(
            (f) => f.id_compromiso == null
          ).length;
          this.limpiar();
          console.log(
            "los filtros",
            this.departamentoInput,
            this.municipioInput,
            this.municipioInput.length
          );
          this.listarFinanciamiento(this.gestion.toString());
          if (
            this.departamentoInput &&
            this.departamentoInput !== "undefined"
          ) {
            this.dep = this.departamentoInput;
            this.filtrar2("departamento", this.departamentoInput, 1, 0);
          }
          setTimeout(() => {
            if (this.municipioInput && this.municipioInput !== "undefined") {
              this.mun = this.municipioInput;
              this.filtrar2("municipio", this.municipioInput, 1, 0);
            }
          }, 50);
        } else {
          console.log("no se cargaron insumos");
          this.cargando = false;
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

  listarFinanciamiento(gestion: string) {
    console.log("cargando proyectos");
    this.cargando = true;
    this._sgpservice.datosFinanciamiento(gestion).subscribe(
      (result: any) => {
        console.log("result listarFinanciamiento", result);
        this.dtsFinanciamientos = result;
        this.presupuestoAsignado =
          this.dtsFinanciamientos[0].v_monto_financiamiento;
        this.presupuestoComprometido =
          this.dtsFinanciamientos[0].v_monto_acumulado;
        this.presupuestoPorComprometer = this.dtsFinanciamientos[0].v_saldo;
        // this.dtsGestiones = alasql('select distinct  from ?',[this.dtsFinanciamientos])
        this.pnlGrilla = true;
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

  cargaValoresFiltros(excepto: string) {
    this.pnlFiltros = true;
    console.log("cargando filtrosd", excepto);
    this.cargando = false;

    if (excepto != "inversion_proyecto_municipio") {
      this.invMInicial = this.dts_proyectos.reduce(
        (ac, el) =>
          ac > Number(el.inversion_proyecto_municipio)
            ? ac
            : Number(el.inversion_proyecto_municipio),
        0
      );
      this.invMMax = this.invMInicial;
      this.invMinInicial = this.dts_proyectos.reduce(
        (ac, el) =>
          ac < Number(el.inversion_proyecto_municipio)
            ? ac
            : Number(el.inversion_proyecto_municipio),
        this.invMMax
      );
      this.invMMin = this.invMinInicial;
    }

    if (excepto != "inversion_upre_convenio") {
      this.invUPREMaxIni = this.dts_proyectos.reduce(
        (ac, el) =>
          ac > Number(el.inversion_upre_convenio)
            ? ac
            : Number(el.inversion_upre_convenio),
        0
      );
      this.invUPREMax = this.invUPREMaxIni;
      this.invUPREMinIni = this.dts_proyectos.reduce(
        (ac, el) =>
          ac < Number(el.inversion_upre_convenio)
            ? ac
            : Number(el.inversion_upre_convenio),
        this.invUPREMax
      );
      this.invUPREMin = this.invUPREMinIni;
    }

    if (excepto != "nro_proyectos") {
      this.npMaxIni = this.dts_proyectos.reduce(
        (ac, el) =>
          ac > Number(el.nro_proyectos) ? ac : Number(el.nro_proyectos),
        0
      );
      this.npMax = this.npMaxIni;
      this.npMinIni = this.dts_proyectos.reduce(
        (ac, el) =>
          ac < Number(el.nro_proyectos) ? ac : Number(el.nro_proyectos),
        this.npMax
      );
      this.npMin = this.npMinIni;
    }

    if (excepto != "inversion_percapita_upre") {
      this.ipMaxIni = this.dts_proyectos.reduce(
        (ac, el) =>
          ac > Number(el.inversion_percapita_upre)
            ? ac
            : Number(el.inversion_percapita_upre),
        0
      );
      this.ipMax = this.ipMaxIni;
      this.ipMinIni = this.dts_proyectos.reduce(
        (ac, el) =>
          ac < Number(el.inversion_percapita_upre)
            ? ac
            : Number(el.inversion_percapita_upre),
        this.ipMax
      );
      this.ipMin = this.ipMinIni;
    }

    if (excepto != "nbi") {
      this.nbiMaxIni = this.dts_proyectos.reduce(
        (ac, el) => (ac > Number(el.nbi) ? ac : Number(el.nbi)),
        0
      );
      this.nbiMax = this.nbiMaxIni;
      this.nbiMinIni = this.dts_proyectos.reduce(
        (ac, el) => (ac < Number(el.nbi) ? ac : Number(el.nbi)),
        this.nbiMax
      );
      this.nbiMin = this.nbiMinIni;
    }

    // this.cmMaxIni = this.dts_inicial.reduce((ac,el)=>ac>Number(el.p_cumple_mae)?ac:el.p_cumple_mae,0);
    // this.cmMax = this.cmMaxIni;
    // this.cmMinIni = this.dts_inicial.reduce((ac,el)=>ac<Number(el.p_cumple_mae)?ac:el.p_cumple_mae,this.cmMax);
    // this.cmMin = this.cmMinIni;

    if (excepto != "area")
      this.dts_area = alasql(
        `select distinct area from ? where coalesce(area,'')!='' order by 1`,
        [this.dts_proyectos]
      );
    if (excepto != "mae")
      this.dts_partidos = alasql(`select distinct mae from ? order by 1`, [
        this.dts_proyectos,
      ]);
    if (excepto != "estado_compromiso")
      this.dts_solicitudes = alasql(
        `select distinct estado_compromiso from ? where estado_compromiso is not null order by 1`,
        [this.dts_proyectos]
      );
    if (excepto != "documento_ingreso")
      this.dts_opciones = alasql(
        `select distinct documento_ingreso from ? where documento_ingreso is not null order by 1`,
        [this.dts_proyectos]
      );
    if (excepto != "estado_aprobado")
      this.dts_aprobados = alasql(
        `select distinct estado_aprobado from ? order by 1`,
        [this.dts_proyectos]
      );
    //this.estilarTabla();
    if (excepto != "departamento") {
      this.dts_departamentos = alasql(
        `select distinct departamento from ? order by 1`,
        [this.dts_proyectos]
      );
      this.dts_departamentos.unshift({ departamento: "" });
    }
    if (excepto != "municipio") {
      this.dts_municipios = alasql(
        `select distinct municipio from ? order by municipio`,
        [this.dts_proyectos]
      );
      this.dts_municipios.unshift({ municipio: "" });
    }
    this.pagina = 0;
    $("#anterior").prop("disabled", true);
  }

  confirmarProyecto(proyecto: any, operacion?: any) {
    //let op:string,txt:string;
    console.log("OPERACION", proyecto, operacion);
    let txt: string;
    // if(!proyecto.estado_aprobado.startsWith('APROBADO')){
    //   operacion='I';
    //   txt='APROBAR';
    // }else{
    //   operacion='D'
    //   txt='CANCELAR'
    // }
    if (operacion == "I") {
      txt = "APROBAR";
    }
    if (operacion == "D") {
      txt = "CANCELAR";
    }
    if (operacion == "DESESTIMAR") {
      txt = "DESESTIMAR";
    }

    swal2({
      title: "Advertencia!!!",
      text: `Realmente desea ${txt} la continuidad del proyecto?`,
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d9534f",
      cancelButtonColor: "#f0ad4e",
      customClass: "swal2-popup",
      confirmButtonText: "Confirmar!",
    }).then((result) => {
      if (result.value) {
        this.aprobarProyecto(proyecto.id_compromiso, operacion);
      }
    });
  }

  aprobarProyecto(id, opcion) {
    this.cargando = true;
    const aprobado = {
      operacion: opcion,
      idProyectoAprobado: 0,
      fidCompromiso: id,
      usuario_registro: this.idUsuario,
      rol_registro: this.dts_roles.includes(75) ? 75 : 76,
      ruta: this.rutaURL || "",
    };
    this._sgpservice.crudProyectoAprobado(aprobado).subscribe(
      (result: any) => {
        if (result[0].message.startsWith("CORRECTO")) {
          this._msg.formateoMensaje("modal_success", result[0].message, 6);
          // this.listarProyectos(0);
          const nuevoEstado = this.dts_roles.includes(75)
            ? "APROBADO PRESIDENCIA"
            : "APROBADO UPRE";
          this.dts_proyectos.map((el) => {
            if (el.id_compromiso == id && opcion == "I") {
              el.estado_aprobado = nuevoEstado;
              el.estado_compromiso = "COMPROMISO PRESIDENCIAL";
            }
            if (el.id_compromiso == id && opcion == "D") {
              el.estado_aprobado = "NO APROBADO";
              el.estado_compromiso = "SOLICITUD NUEVA";
            }
            if (el.id_compromiso == id && opcion == "DESESTIMAR") {
              el.estado_aprobado = "DESESTIMADO";
              el.estado_compromiso = "COMPROMISO DESESTIMADO";
            }
            if (el.id_compromiso == id && opcion == "AV") {
              el.url = this.rutaURL;
            }
            return el;
          });
          this.cargando = false;
          this.rutaURL = null;
        } else {
          console.log("no se cargaron insumos");
          this.cargando = false;
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

  filtrar2(campo, valor, tipo, valor2, opcion?) {
    console.log("iniciando filtro", campo, valor);
    if (valor == null || valor == undefined) return true;
    if (valor === "undefined") return true;
    if (valor === true) valor = 1;
    if (valor === false) valor = 0;
    if (campo === "nbi")
      if (this.nbiMax < this.nbiMin)
        opcion == "max"
          ? (this.nbiMin = this.nbiMax)
          : (this.nbiMax = this.nbiMin);
    if (campo === "inversion_proyecto_municipio")
      if (this.invMMax < this.invMMin)
        opcion == "max"
          ? (this.invMMin = this.invMMax)
          : (this.invMMax = this.invMMin);
    if (campo === "inversion_upre_convenio")
      if (this.invUPREMax < this.invUPREMin)
        opcion == "max"
          ? (this.invUPREMin = this.invUPREMax)
          : (this.invUPREMax = this.invUPREMin);
    if (campo === "nro_proyectos")
      if (this.npMax < this.npMin)
        opcion == "max" ? (this.npMin = this.npMax) : (this.npMax = this.npMin);
    if (campo === "p_cumple_mae")
      if (this.cmMax < this.cmMin)
        opcion == "max" ? (this.cmMin = this.cmMax) : (this.cmMax = this.cmMin);

    if (["multicriterio_upre", "criticos"].includes(campo) && valor == 0)
      this.listaFiltro = this.listaFiltro.filter((f) => f.campo !== campo);
    if (["nombreproyecto", "beneficiario"].includes(campo) && valor)
      valor = valor.toUpperCase();

    if (campo === "municipio" && valor) {
      if (!this.dep)
        this.dep = this.dts_inicial.filter(
          (f) => f.municipio == valor
        )[0].departamento;
      if (
        this.listaFiltro.filter((f) => f.campo === "departamento").length === 0
      )
        this.listaFiltro.push({
          campo: "departamento",
          valor: this.dep,
          tipo: 1,
          valor2: 0,
        });

      this.partidoMae = this.dts_inicial.filter(
        (f) => f.municipio == valor && f.departamento == this.dep
      )[0].mae;
      //this.votosNacional = this.dts_inicial.filter(f=>f.municipio == valor)[0].elecciones_nacionales;
      //this.votosMuniciapl = this.dts_inicial.filter(f=>f.municipio == valor)[0].elecciones_municipales;
      this.votosNacional = this.dts_inicial.filter(
        (f) => f.municipio == valor && f.departamento == this.dep
      )[0].elecciones_nacionales;
      this.votosMuniciapl = this.dts_inicial.filter(
        (f) => f.municipio == valor && f.departamento == this.dep
      )[0].elecciones_municipales;

      this.totalRecursos = this.dts_inicial.filter(
        (f) => f.municipio == valor && f.departamento == this.dep
      )[0].total_recursos; //alasql(`select total_recursos from ? where municipio ='${valor}' and departamento = '${this.dep}' and gestion_recursos = ${(new Date()).getFullYear()}`,[this.dts_inicial])[0].total_recursos
      this.totalRecursos = (this.totalRecursos + "").replace(this.reg, "$&.");
      this.poblacion = this.dts_inicial.filter(
        (f) => f.municipio == valor && f.departamento == this.dep
      )[0].poblacion_2022;
      this.poblacion = this.poblacion
        .replace(".00", "")
        .replace(this.reg, "$&.");
    }
    if (campo === "municipio" && !valor) {
      console.log("esta entrando", valor);
      this.totalRecursos = null;
      if (
        this.listaFiltro.filter((f) => f.campo === "departamento").length === 0
      )
        this.listaFiltro.push({
          campo: "departamento",
          valor: this.dep,
          tipo: 1,
          valor2: 0,
        });
      this.listaFiltro = this.listaFiltro.filter((f) => f.campo !== campo);
    }
    if (campo === "departamento" && valor == "") {
      this.listaFiltro = this.listaFiltro.filter(
        (f) => f.campo != "inversion_upre_convenio"
      );
      this.listaFiltro = this.listaFiltro.filter(
        (f) => f.campo != "nro_proyectos"
      );
      this.listaFiltro = this.listaFiltro.filter(
        (f) => f.campo != "inversion_percapita_upre"
      );
      this.listaFiltro = this.listaFiltro.filter((f) => f.campo !== campo);
    }
    if (!this.queryFiltro) this.queryFiltro = "select * from ? where";

    this.queryFiltro = "select * from ? where ";
    if (this.listaFiltro.filter((f) => f.campo === campo).length === 0)
      this.listaFiltro.push({ campo, valor, tipo, valor2 });
    if (
      this.listaFiltro.filter((f) => f.campo === campo).length === 0 &&
      valor2 == -1
    )
      this.listaFiltro.push({ campo, valor: `,${valor}`, tipo, valor2 });
    if (
      this.dep &&
      this.listaFiltro.filter((f) => f.campo == "departamento").length == 0
    )
      this.listaFiltro.push({
        campo: "departamento",
        valor: this.dep,
        tipo: 1,
        valor2: 0,
      });
    // if(this.listaFiltro.filter(f=>f.campo == 'departamento' && f.valor=='').length>0) this.listaFiltro = this.listaFiltro.filter(f=>f.campo != 'departamento');
    if (
      !this.dep &&
      this.listaFiltro.filter((f) => f.campo == "departamento").length > 0
    )
      this.dep = this.listaFiltro.filter(
        (f) => f.campo == "departamento"
      )[0].valor;
    console.log("filtrando", this.listaFiltro, this.dep);
    this.listaFiltro.map((e) => {
      if (e.campo === campo && valor2 != -1) {
        e.valor = valor;
        e.valor2 = valor2;
      }
      if (e.campo === campo && valor2 == -1) {
        e.valor = e.valor + `,${valor}`;
      }
      if (e.campo === campo && valor2 == -1 && valor == "") {
        e.valor = "";
        if (campo === "mae") this.pm = [];
        if (campo === "area") this.area = [];
        if (campo === "estado_compromiso") this.tipoSolicitud = [];
        if (campo === "estado_aprobado") this.tipoAprobado = [];
      }
      if (e.campo === "municipio" && campo === "departamento") {
        this.mun = "";
        e.valor = "";
      }

      if (
        e.valor &&
        e.tipo == 1 &&
        e.valor2 != -1 &&
        e.valor2 != 3 &&
        e.campo !== "municipio"
      )
        this.queryFiltro = this.queryFiltro.concat(
          ` and ${e.campo}::text like '%${e.valor}%'`
        );
      if (
        e.valor &&
        e.tipo == 1 &&
        e.valor2 != -1 &&
        e.valor2 != 3 &&
        e.campo === "municipio"
      )
        this.queryFiltro = this.queryFiltro.concat(
          ` and ${e.campo}::text = '${e.valor}'`
        );
      if ((e.valor != 0 || e.valor2 != 100) && e.tipo == 2)
        this.queryFiltro = this.queryFiltro.concat(
          ` and ${e.campo} between ${e.valor} and ${e.valor2}`
        );
      if (e.valor && e.tipo == 1 && e.valor2 == -1)
        this.queryFiltro = this.queryFiltro.concat(
          ` and ${e.campo}::text in(${e.valor})`
        );
      if (e.valor && e.tipo == 1 && e.valor2 == 3)
        this.queryFiltro = this.queryFiltro.concat(
          ` and ${e.campo}::text ='${e.valor}'`
        );
      return e;
    });

    console.log("antes de nada", this.queryFiltro);

    this.queryFiltro = this.queryFiltro
      .replace(/,/g, `','`)
      .replace(/\(/g, `('`)
      .replace(/\)/g, `')`);
    this.queryFiltro = this.queryFiltro
      .replace("  ", " ")
      .replace("where and", "where ");
    this.queryFiltro = this.queryFiltro.replace(
      `multicriterio_upre::text = '1'`,
      `multicriterio_upre::text like '%1%'`
    );
    this.queryFiltro = this.queryFiltro.replace(
      `criticos::text = '1'`,
      `criticos::text like '%1%'`
    );
    if (this.queryFiltro === "select * from ? where ")
      this.queryFiltro = "select * from ?";
    console.log(
      "dos",
      this.queryFiltro,
      this.listaFiltro,
      campo,
      valor,
      this.dts_proyectos
    );
    this.dts_proyectos = alasql(this.queryFiltro, [this.dts_inicial]);

    this.pagina = 0;
    $("#anterior").prop("disabled", true);
    if (this.dts_proyectos.length <= 50) $("#siguiente").prop("disabled", true);
    if (this.dts_proyectos.length > 50) $("#siguiente").prop("disabled", false);
    //reorganizando los combos municipio y provincia
    //campo === 'departamento' && valor
    if (this.dep && campo !== "municipio") {
      const filtrado = this.dts_proyectos.filter(
        (f) => f.departamento === this.dep
      );
      this.dts_municipios = alasql(
        `select distinct municipio from ? order by municipio`,
        [filtrado]
      );
      this.dts_municipios.unshift({ municipio: "" });
    }
    // if (campo!='inversion_upre_convenio' && campo!='nro_proyectos' && campo != 'mae' && campo != 'area' && campo != 'estado_compromiso') this.cargaValoresFiltros();
    valor == ""
      ? this.cargaValoresFiltros("todos")
      : this.cargaValoresFiltros(campo);

    if (!this.pm.includes(this.partidoSel)) this.pm.push(this.partidoSel);
    if (!this.area.includes(this.areaSel)) this.area.push(this.areaSel);
    if (!this.tipoSolicitud.includes(this.solicitudSel))
      this.tipoSolicitud.push(this.solicitudSel);
    if (!this.tipoAprobado.includes(this.estado_aprobadoSel))
      this.tipoAprobado.push(this.estado_aprobadoSel);
    if (!this.pm.includes(this.maeSel)) this.pm.push(this.maeSel);
    //para la app
    this.elFiltro = this.queryFiltro.substring(23, 500);
    // this.elFiltro = this.elFiltro.replace(/ /g,'-').replace(/%/g,'prc');
    this.elFiltro = encodeURIComponent(this.elFiltro);
    console.log(
      "el filtro",
      this.elFiltro,
      this.dep,
      this.dts_departamentos,
      this.listaFiltro
    );
  }

  ordenar(campo, tipo?) {
    let cambiarOrden = "";
    if (!this.queryOrden.includes(campo) && tipo === "anular") return true;
    if (!this.queryOrden) this.queryOrden = "select * from ? order by ";
    if (this.queryOrden.includes(`${campo} asc`))
      cambiarOrden = this.queryOrden.replace(`${campo} asc`, `${campo} desc`);
    if (this.queryOrden.includes(`${campo} desc`))
      cambiarOrden = this.queryOrden.replace(`${campo} desc`, `${campo} asc`);
    !this.queryOrden.includes(campo)
      ? tipo
        ? (this.queryOrden = this.queryOrden.concat(`, ${campo} ${tipo}`))
        : (this.queryOrden = this.queryOrden.concat(`, ${campo} asc`))
      : (this.queryOrden = cambiarOrden);

    if (tipo === "anular")
      this.queryOrden = this.queryOrden
        .replace(` ${campo} asc`, "")
        .replace(` ${campo} desc`, "")
        .replace(` ${campo} anular`, "");
    // this.queryOrden = this.queryOrden.slice(0,-1);
    this.queryOrden = this.queryOrden
      .replace(",nombreproyecto asc", "")
      .replace("nombreproyecto asc", "");
    this.queryOrden = this.queryOrden.concat(",nombreproyecto asc");
    this.queryOrden = this.queryOrden
      .replace("order by   ,", "order by ")
      .replace("order by  ,", "order by ")
      .replace("order by ,", "order by ");
    console.log("ordenar", campo, this.queryOrden, tipo);
    // this.dts_seguimiento.sort((a,b)=>a[campo] - b[campo]);
    this.dts_proyectos = alasql(this.queryOrden, [this.dts_proyectos]);
    const ord = " " + this.queryOrden.substring(16, 500);
    if (this.elFiltro.includes("order"))
      this.elFiltro = this.elFiltro.substring(
        0,
        this.elFiltro.indexOf("order")
      );
    this.elFiltro = this.elFiltro + encodeURIComponent(ord);
    console.log("el filtro orden", this.elFiltro);
  }

  paginar(valor: number) {
    // console.log('paginando',this.pagina,valor,Math.trunc(this.dts_seguimiento.length/10));
    // $('#anterior').prop('disabled', true)

    this.pagina += valor;
    // console.log('entra a paginar',valor,this.pagina);
    this.pagina <= 0
      ? $("#anterior").prop("disabled", true)
      : $("#anterior").prop("disabled", false);
    this.pagina >= Math.trunc(this.dts_proyectos.length / 50)
      ? $("#siguiente").prop("disabled", true)
      : $("#siguiente").prop("disabled", false);
  }

  limpiar() {
    this.dep = "";
    this.mun = "";
    this.opcionSel = "";
    this.areaSel = "";
    this.solicitudSel = "";
    this.maeSel = "";
    this.partidoSel = "";
    this.pm = [];
    this.area = [];
    this.tipoSolicitud = [];
    this.listaFiltro = [];
    this.pm = [];

    this.totalRecursos = null;

    $("#multi").prop("checked", false);
    $("#critic").prop("checked", false);
    // this.nbiMin=0;
    // this.nbiMax=100;
    // this.cmMin=0;
    // this.cmMax=100;
    this.cargaValoresFiltros("todos");
    $("#nbiAsc").prop("checked", false);
    $("#nbiDesc").prop("checked", true);
    $("#upreAsc").prop("checked", false);
    $("#upreDesc").prop("checked", false);
    $("#ipAsc").prop("checked", true);
    $("#ipDesc").prop("checked", false);
    $("#npAsc").prop("checked", false);
    $("#npDesc").prop("checked", false);
    this.queryOrden = `select * from ? order by  nbi desc, inversion_percapita_upre asc`;

    const preNBI = alasql(
      `select departamento ,municipio,max(cast(nbi as decimal)) nbi from ? group by departamento ,municipio`,
      [this.dts_inicial]
    );
    const preINVU = alasql(
      `select departamento ,municipio,max(cast(inversion_upre_convenio as decimal)) inversion_upre_convenio from ? group by departamento ,municipio`,
      [this.dts_inicial]
    );
    const preIP = alasql(
      `select departamento ,municipio,max(cast(inversion_upre_convenio as decimal) ) ivp,max(cast(poblacion_2022 as decimal)) poblacion from ? group by departamento ,municipio`,
      [this.dts_inicial]
    );
    const preNP = alasql(
      `select departamento ,municipio,max(cast(nro_proyectos as decimal)) nro_proyectos from ? group by departamento ,municipio`,
      [this.dts_inicial]
    );

    this.mediaNBI = alasql("select SUM(nbi)/339 media from ?", [
      preNBI,
    ])[0].media;
    this.mediaINVU = alasql(
      "select SUM(inversion_upre_convenio)/339 media from ?",
      [preINVU]
    )[0].media;
    this.mediaIP = alasql("select SUM(ivp)/SUM(poblacion) media from ?", [
      preIP,
    ])[0].media;
    this.mediaNP = alasql("select SUM(nro_proyectos)/339 media from ?", [
      preNP,
    ])[0].media;

    // console.log('las medias',this.mediaNBI,this.mediaINVU,this.mediaIP,this.mediaNP);
    this.rutaURL = null;
  }

  cargarURL(id, preruta) {
    const url = prompt("Agregar ruta URL", "Nuevo Video Entrega");
    this.rutaURL = (preruta || "") + "|" + url;
    if (url) this.aprobarProyecto(id, "AV");
  }

  eliminarURL(url) {
    swal2({
      title: "Advertencia!!!",
      text: `Realmente desea eliminar la url asociada?`,
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d9534f",
      cancelButtonColor: "#f0ad4e",
      customClass: "swal2-popup",
      confirmButtonText: "Confirmar!",
    }).then((result) => {
      if (result.value) {
        this.arregloURL = this.arregloURL.filter((f) => f != url);
        this.rutaURL = this.arregloURL.join("|");
        this.aprobarProyecto(this.elIdCompromiso, "AV");
      }
    });
  }

  getVideoIframe(url) {
    var video, results;

    if (url === null) {
      return "";
    }
    results = url.match("[\\?&]v=([^&#]*)");
    video = results === null ? url : results[1];

    console.log("q url", url);

    if (url.includes("youtube")) {
      console.log("true", url, url.includes("youtube"));
      return this._sanitizer.bypassSecurityTrustResourceUrl(
        "https://www.youtube.com/embed/" + video
      );
    } else {
      console.log("else", url, url.includes("youtube"));
      return this._sanitizer.bypassSecurityTrustResourceUrl(video);
    }
  }

  reproducirVideo(url?, id?, nombre?) {
    // if(url) this.rutaURL = url;
    url ? (this.arregloURL = url.split("|")) : (this.arregloURL = []);

    this.arregloURL = this.arregloURL.filter((f) => f != "");

    id ? (this.elIdCompromiso = id) : (this.elIdCompromiso = null);
    // this.rutaURL = url;
    console.log("mis url", this.arregloURL);

    nombre ? (this.elNombrProyecto = nombre) : (this.elNombrProyecto = "");

    this.pnlVideo = !this.pnlVideo;
    this.pnlFiltros = !this.pnlFiltros;
    this.pnlGrilla = !this.pnlGrilla;
  }

  reinicarFiltros() {
    this.dts_proyectos = this.dts_inicial;
    this.limpiar();
  }

  generarReporte(/*data:any,nombre:string*/) {
    const data = this.dts_proyectos;
    //data.tipoReporte = '03';
    data.map((el, i) => {
      el.fila = i + 1;
      return el;
    });
    const nombre = `solictud_proyectos_dinamico`;
    this.cargando = true;
    //console.log('generando reporte',data);
    this._sgpservice.reportesCompromisos2025(data).subscribe(
      (result: any) => {
        //
        //console.log(result);
        // const file = new Blob([result.blob()], {
        const file = new Blob([result], {
          type: "application/vnd.ms.excel",
        });
        //const file = new Blob([result])
        // const url = window.URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(file);
        // link.setAttribute('download', `${nombre}.xlsx`);
        // document.body.appendChild(link);
        link.download = `${nombre}.xlsx`;
        link.click();
        this.cargando = false;
        // setTimeout(() => {
        //   document.body.removeChild(link);
        //   URL.revokeObjectURL(url);
        //   this.cargando=false;
        // }, 8000);
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

  generarReporteGet() {
    this.cargando = true;
    const data = { condicion: `departamento = 'TARIJA'` };
    const nombre = `solictud_proyectos_condicional`;
    this.cargando = true;
    //console.log('generando reporte',data);
    this._sgpservice.reportesCompromisosQuery(data).subscribe(
      (result: any) => {
        const file = new Blob([result.blob()], {
          type: "application/vnd.ms.excel",
        });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(file);
        link.download = `${nombre}.xlsx`;
        link.click();
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

  cambiarGestion() {
    this.gestion = this.gestionSel;
    this.listarFinanciamiento(this.gestion.toString());
  }

  mostrarDatosProyecto(compromiso) {
    const id = compromiso.id_compromiso;
    this.nombreproyectoResuman = compromiso.nombreproyecto;
    this.elComp = compromiso;
    if (id > 0) {
      this.cargarResumenTecnico(id);
      this.posicionY = id;
    }
    this.resumenTecnico.idCompromiso = id;
    this.pnlGrilla = !this.pnlGrilla;
    this.pnlInfo = !this.pnlInfo;

    setTimeout(() => {
      if (this.pnlGrilla) {
        const fila = document.getElementById("gs" + this.posicionY);
        fila.style.backgroundColor = "rgb(255, 214, 168)";
        fila.scrollIntoView({ block: "center", behavior: "smooth" });
      } else {
        const monitoreo = document.getElementById("monitoreoEtapas");
        monitoreo.scrollIntoView({ block: "start", behavior: "smooth" });
      }
    }, 400);
  }

  cargarResumenTecnico(idCompromiso: number) {
    console.log("cargando proyectos");
    this.cargando = true;
    this._sgpservice.resumenTecnico(idCompromiso).subscribe(
      (result: any) => {
        console.log("result resumenTecnico", result);
        if (result.length > 0) {
          const data = result[0];
          this.resumenTecnico = {
            idCompromiso: data.id_compromiso,
            area: data.area,
            beneficiarios: data.beneficiarios_directos,
            costoProyecto: data.costo_proyecto,
            costoXBeneficiario: data.costo_por_beneficiario,
            alcance: data.alcance,
            situacion: data.situacion_actual,
            estado: data.estado_actual,
          };
        } else {
          this.resumenTecnico.idCompromiso = 0;
        }
        console.log("el id", this.resumenTecnico.idCompromiso);
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

  rptResumenTecnico(tipo: string, id: number) {
    this.cargando = true;
    tipo == "PROYECTISTA" ? (tipo = "CONSOLIDADO") : (tipo = "PRELIMINAR");
    const miDTS = { tipoReporte: tipo, idCompromiso: id };
    let nombreReporte = "";
    tipo == "PRELIMINAR"
      ? (nombreReporte = `ResumenTecnicoPreliminar${id}.pdf`)
      : (nombreReporte = `ResumenTecnico${id}.pdf`);

    this._formularioresumen.rptResumenTecnico(miDTS).subscribe(
      (result: any) => {
        const url = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", nombreReporte);
        link.click();
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
}
