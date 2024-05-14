import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Inputmask from "inputmask";
import { Globals } from "../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { AdmusuariosService } from "../../seguridad/admusuarios/admusuarios.service";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

declare let L;

@Component({
  selector: "app-mapeogeneral",
  templateUrl: "./mapeogeneral.component.html",
  styleUrls: ["./mapeogeneral.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    AdmusuariosService,
  ],
})
export class MapeogeneralComponent implements OnInit {
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

  public m_map: any;
  public m_popup: any;
  public m_osmBase: any;
  public m_osmCatastro: any;
  public m_marcaDpto: any;
  public m_marcaProvincia: any;
  public m_marcaMunicipio: any;
  public m_marca: any;
  public m_baseMaps: any;
  public m_overlayMaps: any;
  public m_JsonDpto: any;
  public m_JsonMun: any;
  public tempIcon: any;
  public tempIconUpre: any;
  public marca_domicilio: any;
  public m_unidad: any;
  public m_nombre: any;
  public m_paterno: any;
  public m_materno: any;
  public m_ci: any;
  public m_expedido: any;
  public m_complementosegip: any;
  public m_celular: any;
  public m_direccion: any;
  public m_latitud: any;
  public m_longitud: any;

  public marca_upre: any;
  public marca_tecnica: any;
  public marca_financiera: any;
  public marca_juridica: any;
  public m_punto: any;
  public dts_listaGeoUbicaciones: any;
  public dts_listatecnica: any;
  public dts_listajuridica: any;
  public dts_listafinanciera: any;
  public posicion_marca: any;
  public m_marcaupre: any;
  public m_contadorpersonal = 0;
  public m_contadorpersonal_tecnica = 0;
  public m_contadorpersonal_financiera = 0;
  public m_contadorpersonal_juridica = 0;
  public dts_listaLunes: any;
  public dts_listaMartes: any;
  public dts_listaMiercoles: any;
  public dts_listaJueves: any;
  public dts_listaViernes: any;
  public m_contadorpersonal_lunes = 0;
  public m_contadorpersonallunes_tecnica = 0;
  public m_contadorpersonallunes_financiera = 0;
  public m_contadorpersonallunes_juridica = 0;
  public m_contadorpersonal_martes = 0;
  public m_contadorpersonalmartes_tecnica = 0;
  public m_contadorpersonalmartes_financiera = 0;
  public m_contadorpersonalmartes_juridica = 0;
  public m_contadorpersonal_miercoles = 0;
  public m_contadorpersonalmiercoles_tecnica = 0;
  public m_contadorpersonalmiercoles_financiera = 0;
  public m_contadorpersonalmiercoles_juridica = 0;
  public m_contadorpersonal_jueves = 0;
  public m_contadorpersonaljueves_tecnica = 0;
  public m_contadorpersonaljueves_financiera = 0;
  public m_contadorpersonaljueves_juridica = 0;
  public m_contadorpersonal_viernes = 0;
  public m_contadorpersonalviernes_tecnica = 0;
  public m_contadorpersonalviernes_financiera = 0;
  public m_contadorpersonalviernes_juridica = 0;

  public tipoLista: string = "All";

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _admusuarios: AdmusuariosService,

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
    //this.paneles('VER_GRIDVIEW');

    $("#collapseUno").collapse("show");
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
        return this.RolesAsignados(this.s_usu_id);
      })
      .then((dts) => {
        this.dts_roles_usuario = dts;
      })
      .catch(falloCallback);
    //this.inicializandoMapa();

    //this.multipoligono();
    //this.mapaInicial();
    this.inicializandoMapaV0();
  }
  /*******************************************************************************/
  /*MASCARAS
  /*******************************************************************************/
  cargarmascaras() {
    // var gestion = document.getElementById("gestion");
    // var hojaruta = document.getElementById("nrohojaderuta");
    // var fecha = document.getElementById("fecha");
    // var fecha_respuesta = document.getElementById("fecharespuesta");
    // this.mask_gestion.mask(gestion);
    // this.mask_numero.mask(hojaruta);
    // this.mask_fecha.mask(fecha);
    // this.mask_fecha.mask(fecha_respuesta);
  }
  /*******************************************************************************/
  /*DATOS INICIALES
  /*******************************************************************************/
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
  paneles(string) {
    if (string == "LIMPIA_FORMULARIO") {
      this.m_unidad = "";
      this.m_nombre = "";
      this.m_paterno = "";
      this.m_materno = "";
      this.m_ci = "";
      this.m_expedido = "";
      this.m_complementosegip = "";
      this.m_celular = "";
      this.m_direccion = "";
      this.m_latitud = "";
      this.m_longitud = "";
      this.m_map.removeLayer(this.marca_domicilio);
    }
  }
  inicializandoMapaV0() {
    this.m_map = L.map("map", {
      //center: [-16.6057484, -65.9199602], BOLIVIA
      center: [-16.496389, -68.131006],
      zoom: 15,
    });

    this.m_osmBase = new L.tileLayer(
      "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    );
    this.m_osmBase.addTo(this.m_map);

    this.m_osmCatastro = L.tileLayer(
      "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 17,
        attribution:
          'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
      }
    );

    this.m_baseMaps = {
      OSM: this.m_osmBase,
      Catastro: this.m_osmCatastro,
    };
    this.marca_upre = L.icon({
      iconUrl: "assets/imagenes/marcas/marca_upre.png",
      shadowUrl: "",
      iconSize: [100, 100], // size of the icon
      shadowSize: [0, 0], // size of the shadow
      iconAnchor: [32, 32], // point of the icon which will correspond to markers location
      shadowAnchor: [0, 0], // the same for the shadow
      popupAnchor: [32, 20], // point from which the popup should open relative to the iconAnchor
    });

    L.control
      .layers(this.m_baseMaps, this.m_marca, {
        position: "topright", // 'topleft', 'bottomleft', 'bottomright'
        collapsed: false, // true
      })
      .addTo(this.m_map);

    var upre = [-16.495996993911135, -68.13113281417846];
    this.m_marcaupre = L.marker(upre, { icon: this.marca_upre }).bindPopup(
      '<img src="./assets/imagenes/logo/logo_upre_2021.png" width="150px" height="80px" class="img-responsive" />'
    );
    //marker.addTo(this.m_map);
    this.m_map.addLayer(this.m_marcaupre);

    this.marca_tecnica = L.icon({
      iconUrl: "assets/imagenes/marcas/marca_tecnica.png",
      shadowUrl: "",
      iconSize: [40, 40], // size of the icon
      shadowSize: [0, 0], // size of the shadow
      iconAnchor: [32, 32], // point of the icon which will correspond to markers location
      shadowAnchor: [0, 0], // the same for the shadow
      popupAnchor: [32, 20], // point from which the popup should open relative to the iconAnchor
    });
    this.marca_financiera = L.icon({
      iconUrl: "assets/imagenes/marcas/marca_financiera.png",
      shadowUrl: "",
      iconSize: [40, 40], // size of the icon
      shadowSize: [0, 0], // size of the shadow
      iconAnchor: [32, 32], // point of the icon which will correspond to markers location
      shadowAnchor: [0, 0], // the same for the shadow
      popupAnchor: [32, 20], // point from which the popup should open relative to the iconAnchor
    });
    this.marca_juridica = L.icon({
      iconUrl: "assets/imagenes/marcas/marca_juridica.png",
      shadowUrl: "",
      iconSize: [40, 40], // size of the icon
      shadowSize: [0, 0], // size of the shadow
      iconAnchor: [32, 32], // point of the icon which will correspond to markers location
      shadowAnchor: [0, 0], // the same for the shadow
      popupAnchor: [32, 20], // point from which the popup should open relative to the iconAnchor
    });
    this.listaGeoUbicaciones();
  }

  listaGeoUbicaciones() {
    this._admusuarios.listaGeoUbicaciones().subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_listaGeoUbicaciones = this._fun.RemplazaNullArray(result);
          this._fun.limpiatabla(".dt-personal");
          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V3(
              [10, 20, 50],
              false
            );
            var table = $(".dt-personal").DataTable(confiTable);
          }, 500);
          this.obtenerMarca(this.dts_listaGeoUbicaciones);
          this.listaTotal(this.dts_listaGeoUbicaciones);
          this.listaLunes(this.dts_listaGeoUbicaciones);
          this.listaMartes(this.dts_listaGeoUbicaciones);
          this.listaMiercoles(this.dts_listaGeoUbicaciones);
          this.listaJueves(this.dts_listaGeoUbicaciones);
          this.listaViernes(this.dts_listaGeoUbicaciones);
        } else {
          this.prop_msg = "Alerta: No existen registrosss";
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
  // listaGeoUbicaciones() {
  //   this._geofuncionarios.listaGeoUbicaciones().subscribe(
  //     (result: any) => {
  //       
  //       if (Array.isArray(result) && result.length > 0) {
  //         this.dts_listaGeoUbicaciones = this._fun.RemplazaNullArray(result);
  //         console.log('LISTA',this.dts_listaGeoUbicaciones);

  //         this._fun.limpiatabla('.dt-personal');
  //         setTimeout(() => {
  //           let confiTable = this._fun.CONFIGURACION_TABLA_V3([10, 20, 50], false);
  //           var table = $('.dt-personal').DataTable(confiTable);
  //           // this._fun.selectTable(table, [1, 4]);
  //           // this._fun.inputTable(table, [2, 3]);
  //         }, 500);
  //         this.obtenerMarca(this.dts_listaGeoUbicaciones);
  //         this.listaTotal(this.dts_listaGeoUbicaciones);
  //         this.listaLunes(this.dts_listaGeoUbicaciones);
  //         this.listaMartes(this.dts_listaGeoUbicaciones);
  //         this.listaMiercoles(this.dts_listaGeoUbicaciones);
  //         this.listaJueves(this.dts_listaGeoUbicaciones);
  //         this.listaViernes(this.dts_listaGeoUbicaciones);
  //       }
  //       else {
  //         this.prop_msg = 'Alerta: No existen registrosss';
  //         this.prop_tipomsg = 'danger';
  //         this._msg.formateoMensaje('modal_danger', this.prop_msg);
  //       }

  //     },
  //     error => {
  //       this.errorMessage = <any>error;
  //       if (this.errorMessage != null) {
  //         this.prop_msg = 'Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas';
  //         this.prop_tipomsg = 'danger';
  //         this._msg.formateoMensaje('modal_danger', this.prop_msg);
  //       }
  //     }
  //   )
  // }
  obtenerMarca(dts) {
    //this.m_map.removeLayer(this.posicion_marca);
    this.posicion_marca = [];
    var registros = dts.length;
    var punto = [0, 0];
    for (var i = 0; i < registros; i++) {
      punto[0] = dts[i].usu_latitud;
      punto[1] = dts[i].usu_longitud;
      //console.log('punto==>',punto);
      var nombre = dts[i].usu_nom + " " + dts[i].usu_app + " " + dts[i].usu_apm;
      var celular = dts[i].usu_cel;
      var direccion = dts[i].usu_direccion;
      var detalle =
        "<p><strong>" +
        nombre +
        "</strong><br /><strong>Cel:</strong>" +
        celular +
        "<br /><strong>Dir:</strong>" +
        direccion +
        "</p>";
      var marca;
      if (
        dts[i].usu_area == "UNIDAD TECNICA" ||
        dts[i].usu_cargo == "JEFE DE UNIDAD TECNICA"
      ) {
        marca = this.marca_tecnica;
      }
      if (
        dts[i].usu_area == "UNIDAD ADMINISTRATIVA FINANCIERA" ||
        dts[i].usu_cargo == "JEFE UNIDAD ADMINISTRATIVA Y FINANCIERA"
      ) {
        marca = this.marca_financiera;
      }
      if (
        dts[i].usu_area == "UNIDAD JURIDICA" ||
        dts[i].usu_cargo == "JEFE UNIDAD JURIDICA"
      ) {
        marca = this.marca_juridica;
      }
      this.insertaMarca(i, punto, marca, detalle);
    }
  }
  insertaMarca(reg, punto, marca, detalle) {
    //console.log('aqui marca', reg, punto, marca, detalle);
    var marca = L.marker(punto, { icon: marca }).bindPopup(detalle);
    this.posicion_marca.push(marca);
    this.m_map.addLayer(this.posicion_marca[reg]);
  }
  listaTecnica() {
    if (this.tipoLista == "Tecnica") {
      return;
    }
    this.tipoLista = "Tecnica";
    this.eliminaLayers();
    this.dts_listatecnica = this.dts_listaGeoUbicaciones.filter(
      (item) =>
        item.usu_area == "UNIDAD TECNICA" ||
        item.usu_cargo == "JEFE DE UNIDAD TECNICA"
    );
    this.refrescarTabla();
    this.obtenerMarca(this.dts_listatecnica);
  }
  listaFinanciera() {
    if (this.tipoLista == "Financiera") {
      return;
    }
    this.tipoLista = "Financiera";
    this.eliminaLayers();
    this.dts_listafinanciera = this.dts_listaGeoUbicaciones.filter(
      (item) =>
        item.usu_area == "UNIDAD ADMINISTRATIVA FINANCIERA" ||
        item.usu_cargo == "JEFE UNIDAD ADMINISTRATIVA Y FINANCIERA"
    );
    this.refrescarTabla();
    this.obtenerMarca(this.dts_listafinanciera);
  }
  listaJuridica() {
    if (this.tipoLista == "Juridica") {
      return;
    }
    this.tipoLista = "Juridica";
    this.eliminaLayers();
    this.dts_listajuridica = this.dts_listaGeoUbicaciones.filter(
      (item) =>
        item.usu_area == "UNIDAD JURIDICA" ||
        item.usu_cargo == "JEFE UNIDAD JURIDICA"
    );
    this.refrescarTabla();
    this.obtenerMarca(this.dts_listajuridica);
  }
  listaTodo() {
    if (this.tipoLista == "All") {
      return;
    }
    this.tipoLista = "All";
    this.eliminaLayers();
    this.refrescarTabla();
    this.obtenerMarca(this.dts_listaGeoUbicaciones);
  }
  refrescarTabla() {
    this._fun.limpiatabla(".dt-personal");
    setTimeout(() => {
      let confiTable = this._fun.CONFIGURACION_TABLA_V3([10, 20, 50], false);
      var table = $(".dt-personal").DataTable(confiTable);
    }, 100);
  }
  eliminaLayers() {
    for (var i = 0; i < this.posicion_marca.length; i++) {
      this.m_map.removeLayer(this.posicion_marca[i]);
    }
  }
  obtieneMarcaPersonal(dts) {
    this.eliminaLayers();
    var dt = [];
    dt[0] = dts;
    //console.log(dt);
    this.obtenerMarca(dt);
  }
  listaTotal(dts) {
    this.m_contadorpersonal = dts.length;
    for (var i = 0; i < this.m_contadorpersonal; i++) {
      if (
        dts[i].usu_area == "UNIDAD TECNICA" ||
        dts[i].usu_cargo == "JEFE DE UNIDAD TECNICA"
      ) {
        this.m_contadorpersonal_tecnica = this.m_contadorpersonal_tecnica + 1;
      }
      if (
        dts[i].usu_area == "UNIDAD ADMINISTRATIVA FINANCIERA" ||
        dts[i].usu_cargo == "JEFE UNIDAD ADMINISTRATIVA Y FINANCIERA"
      ) {
        this.m_contadorpersonal_financiera =
          this.m_contadorpersonal_financiera + 1;
      }
      if (
        dts[i].usu_area == "UNIDAD JURIDICA" ||
        dts[i].usu_cargo == "JEFE UNIDAD JURIDICA"
      ) {
        this.m_contadorpersonal_juridica = this.m_contadorpersonal_juridica + 1;
      }
    }
  }
  listaLunes(dts) {
    this.dts_listaLunes = dts.filter(
      (item) => item.ultimo_digito != "1" && item.ultimo_digito != "2"
    );
    this.m_contadorpersonal_lunes = this.dts_listaLunes.length;
    for (var i = 0; i < this.m_contadorpersonal_lunes; i++) {
      if (
        this.dts_listaLunes[i].usu_area == "UNIDAD TECNICA" ||
        this.dts_listaLunes[i].usu_cargo == "JEFE DE UNIDAD TECNICA"
      ) {
        this.m_contadorpersonallunes_tecnica =
          this.m_contadorpersonallunes_tecnica + 1;
      }
      if (
        this.dts_listaLunes[i].usu_area == "UNIDAD ADMINISTRATIVA FINANCIERA" ||
        this.dts_listaLunes[i].usu_cargo ==
          "JEFE UNIDAD ADMINISTRATIVA Y FINANCIERA"
      ) {
        this.m_contadorpersonallunes_financiera =
          this.m_contadorpersonallunes_financiera + 1;
      }
      if (
        this.dts_listaLunes[i].usu_area == "UNIDAD JURIDICA" ||
        this.dts_listaLunes[i].usu_cargo == "JEFE UNIDAD JURIDICA"
      ) {
        this.m_contadorpersonallunes_juridica =
          this.m_contadorpersonallunes_juridica + 1;
      }
    }
  }
  listaMartes(dts) {
    this.dts_listaMartes = dts.filter(
      (item) => item.ultimo_digito != "3" && item.ultimo_digito != "4"
    );
    this.m_contadorpersonal_martes = this.dts_listaMartes.length;
    for (var i = 0; i < this.m_contadorpersonal_martes; i++) {
      if (
        this.dts_listaMartes[i].usu_area == "UNIDAD TECNICA" ||
        this.dts_listaMartes[i].usu_cargo == "JEFE DE UNIDAD TECNICA"
      ) {
        this.m_contadorpersonalmartes_tecnica =
          this.m_contadorpersonalmartes_tecnica + 1;
      }
      if (
        this.dts_listaMartes[i].usu_area ==
          "UNIDAD ADMINISTRATIVA FINANCIERA" ||
        this.dts_listaMartes[i].usu_cargo ==
          "JEFE UNIDAD ADMINISTRATIVA Y FINANCIERA"
      ) {
        this.m_contadorpersonalmartes_financiera =
          this.m_contadorpersonalmartes_financiera + 1;
      }
      if (
        this.dts_listaMartes[i].usu_area == "UNIDAD JURIDICA" ||
        this.dts_listaMartes[i].usu_cargo == "JEFE UNIDAD JURIDICA"
      ) {
        this.m_contadorpersonalmartes_juridica =
          this.m_contadorpersonalmartes_juridica + 1;
      }
    }
  }
  listaMiercoles(dts) {
    this.dts_listaMiercoles = dts.filter(
      (item) => item.ultimo_digito != "5" && item.ultimo_digito != "6"
    );
    this.m_contadorpersonal_miercoles = this.dts_listaMiercoles.length;
    for (var i = 0; i < this.m_contadorpersonal_miercoles; i++) {
      if (
        this.dts_listaMiercoles[i].usu_area == "UNIDAD TECNICA" ||
        this.dts_listaMiercoles[i].usu_cargo == "JEFE DE UNIDAD TECNICA"
      ) {
        this.m_contadorpersonalmiercoles_tecnica =
          this.m_contadorpersonalmiercoles_tecnica + 1;
      }
      if (
        this.dts_listaMiercoles[i].usu_area ==
          "UNIDAD ADMINISTRATIVA FINANCIERA" ||
        this.dts_listaMiercoles[i].usu_cargo ==
          "JEFE UNIDAD ADMINISTRATIVA Y FINANCIERA"
      ) {
        this.m_contadorpersonalmiercoles_financiera =
          this.m_contadorpersonalmiercoles_financiera + 1;
      }
      if (
        this.dts_listaMiercoles[i].usu_area == "UNIDAD JURIDICA" ||
        this.dts_listaMiercoles[i].usu_cargo == "JEFE UNIDAD JURIDICA"
      ) {
        this.m_contadorpersonalmiercoles_juridica =
          this.m_contadorpersonalmiercoles_juridica + 1;
      }
    }
  }
  listaJueves(dts) {
    this.dts_listaJueves = dts.filter(
      (item) => item.ultimo_digito != "7" && item.ultimo_digito != "8"
    );
    this.m_contadorpersonal_jueves = this.dts_listaJueves.length;
    for (var i = 0; i < this.m_contadorpersonal_jueves; i++) {
      if (
        this.dts_listaJueves[i].usu_area == "UNIDAD TECNICA" ||
        this.dts_listaJueves[i].usu_cargo == "JEFE DE UNIDAD TECNICA"
      ) {
        this.m_contadorpersonaljueves_tecnica =
          this.m_contadorpersonaljueves_tecnica + 1;
      }
      if (
        this.dts_listaJueves[i].usu_area ==
          "UNIDAD ADMINISTRATIVA FINANCIERA" ||
        this.dts_listaJueves[i].usu_cargo ==
          "JEFE UNIDAD ADMINISTRATIVA Y FINANCIERA"
      ) {
        this.m_contadorpersonaljueves_financiera =
          this.m_contadorpersonaljueves_financiera + 1;
      }
      if (
        this.dts_listaJueves[i].usu_area == "UNIDAD JURIDICA" ||
        this.dts_listaJueves[i].usu_cargo == "JEFE UNIDAD JURIDICA"
      ) {
        this.m_contadorpersonaljueves_juridica =
          this.m_contadorpersonaljueves_juridica + 1;
      }
    }
  }
  listaViernes(dts) {
    this.eliminaLayers();
    this.dts_listaViernes = dts.filter(
      (item) => item.ultimo_digito != "9" && item.ultimo_digito != "0"
    );
    this.obtenerMarca(this.dts_listaViernes);
    //console.log(this.dts_listaViernes);
    this.m_contadorpersonal_viernes = this.dts_listaViernes.length;
    for (var i = 0; i < this.m_contadorpersonal_viernes; i++) {
      if (
        this.dts_listaViernes[i].usu_area == "UNIDAD TECNICA" ||
        this.dts_listaViernes[i].usu_cargo == "JEFE DE UNIDAD TECNICA"
      ) {
        this.m_contadorpersonalviernes_tecnica =
          this.m_contadorpersonalviernes_tecnica + 1;
      }
      if (
        this.dts_listaViernes[i].usu_area ==
          "UNIDAD ADMINISTRATIVA FINANCIERA" ||
        this.dts_listaViernes[i].usu_cargo ==
          "JEFE UNIDAD ADMINISTRATIVA Y FINANCIERA"
      ) {
        this.m_contadorpersonalviernes_financiera =
          this.m_contadorpersonalviernes_financiera + 1;
      }
      if (
        this.dts_listaViernes[i].usu_area == "UNIDAD JURIDICA" ||
        this.dts_listaViernes[i].usu_cargo == "JEFE UNIDAD JURIDICA"
      ) {
        this.m_contadorpersonalviernes_juridica =
          this.m_contadorpersonalviernes_juridica + 1;
      }
    }
  }
  puntosLunes() {
    this.eliminaLayers();
    this.obtenerMarca(this.dts_listaLunes);
  }
  puntosMartes() {
    this.eliminaLayers();
    this.obtenerMarca(this.dts_listaMartes);
  }
  puntosMiercoles() {
    this.eliminaLayers();
    this.obtenerMarca(this.dts_listaMiercoles);
  }
  puntosJueves() {
    this.eliminaLayers();
    this.obtenerMarca(this.dts_listaJueves);
  }
  puntosViernes() {
    this.eliminaLayers();
    this.obtenerMarca(this.dts_listaViernes);
  }
}
