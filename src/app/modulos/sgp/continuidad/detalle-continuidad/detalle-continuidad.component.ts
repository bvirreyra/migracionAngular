import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Globals } from "../../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { isNumber } from "util";
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
  selector: "app-detalle-continuidad",
  templateUrl: "./detalle-continuidad.component.html",
  styleUrls: ["./detalle-continuidad.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SgpService,
  ],
})
export class DetalleContinuidadComponent implements OnInit {
  @Input("inputDts") inputDts: any;
  @Output() mensajeHijo = new EventEmitter<string>();
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

  public pnl_listaproyecto = false;
  public pnl_georeferenciacion = false;
  public pnl_supervision = false;
  public pnl_ampliacionplazo = false;
  public dts_listaimagenes: any;
  public dts_proyecto: any;
  public m_latitud: any;
  public m_longitud: any;

  public m_monto_upre: any;
  public m_total_acumulado: any;
  public m_saldo_real: any;
  /**SECTOR DE MAPA PARA UBICACION DE PROYECTO**/
  public m_map: any;
  public m_osmBase: any;
  public m_osmCatastro: any;
  public m_imagensatelite: any;
  public tempIcon: any;
  public tempIconUpre: any;
  public m_baseMaps: any;
  public m_marca: any;
  public marca_domicilio: any;

  /**FIN SECTOR DE MAPA PARA UBICACION DE PROYECTO**/
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _seguimiento: SgpService,

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
  }

  ngOnInit() {
    this.obtenerConexion();
    console.log("Desde padre", this.inputDts);

    this.inputDts.fecha_inicio = this.inputDts.fecha_inicio.substr(0, 10);
    this.inputDts.fecha_fin = this.inputDts.fecha_fin.substr(0, 10);
    /*
    this.m_monto_upre=this._fun.valorNumericoDecimal(this.inputDts.monto_upre).toLocaleString('de-DE', { style: 'decimal', minimumFractionDigits: 2 });    
    this.m_total_acumulado=this._fun.valorNumericoDecimal(this.inputDts.total_acumulado).toLocaleString('de-DE', { style: 'decimal', minimumFractionDigits: 2 });
    this.m_saldo_real=this._fun.valorNumericoDecimal(this.inputDts.saldo_real).toLocaleString('de-DE', { style: 'decimal', minimumFractionDigits: 2 });
    */
    this.m_monto_upre = this._fun.valorNumericoDecimal(
      this.inputDts.monto_upre
    );
    this.m_total_acumulado = this._fun.valorNumericoDecimal(
      this.inputDts.total_acumulado
    );
    this.m_saldo_real = this._fun.valorNumericoDecimal(
      this.inputDts.saldo_real
    );

    if (
      this.inputDts["fid_sgp"] != "" &&
      this.inputDts["fid_sgp"] != undefined &&
      this.inputDts["fid_sgp"] != null
    ) {
      this.lista_imagenes(this.inputDts["fid_sgp"]);
      this.datos_geograficos(this.inputDts["fid_sgp"]);
    }
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
  emitirMensaje() {
    this.mensajeHijo.emit("PANELPROYECTOS");
  }
  lista_imagenes(codigo) {
    this._autenticacion.listaArchivoIdSgp(codigo).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          var dts = result.filter((item) => item.img_aplicacion == 1);
          if (dts.length > 0) {
            this.dts_listaimagenes = dts;
          } else {
            for (let i = 0; i < 4; i++) {
              if (result[i]) {
                this.dts_listaimagenes.push(result[i]);
              }
            }
          }
          console.log("IMAGENES TOTAL", this.dts_listaimagenes);
        }
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
  }
  datos_geograficos(id_sgp) {
    this._seguimiento.listaProyectoCabeceraXIdSgp(id_sgp).subscribe(
      (result: any) => {
        if (Array.isArray(result) && result.length > 0) {
          this.dts_proyecto = result[0];
          console.log("datosproy", this.dts_proyecto);
          if (this.dts_proyecto._id_seguimiento != undefined) {
            console.log("entra aqui por q  tiene id_seg");
            this.m_latitud = this.dts_proyecto._latitud_seg;
            this.m_longitud = this.dts_proyecto._longitud_seg;
            if (this.m_latitud == undefined) {
              this.pnl_georeferenciacion = false;
            } else {
              this.pnl_georeferenciacion = true;
              setTimeout(() => {
                this.inicializandoMapaV0();
              }, 20);
            }
          } else {
            console.log("entra aqui por q no tiene id_seg");
            this.m_latitud = this.dts_proyecto._latitud;
            this.m_longitud = this.dts_proyecto._longitud;
            if (isNumber(this.m_latitud)) {
              console.log("es numero");
              this.pnl_georeferenciacion = true;
              setTimeout(() => {
                this.inicializandoMapaV0();
              }, 20);
            } else {
              console.log("no es numero");
              this.pnl_georeferenciacion = false;
            }
          }
          console.log(this.m_latitud, this.m_longitud);
        }
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
  }
  inicializandoMapaV0() {
    this.m_map = L.map("map", {
      // center: [-16.496389, -68.131006],
      center: [this.m_latitud, this.m_longitud],
      zoom: 12,
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
    this.m_imagensatelite = L.tileLayer(
      "http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}",
      {
        maxZoom: 30,
        minZoom: 3,
      }
    );
    this.tempIconUpre = L.icon({
      iconUrl: "assets/imagenes/marcas/marca_upre.png",
      shadowUrl: "",
      iconSize: [100, 100], // size of the icon
      shadowSize: [0, 0], // size of the shadow
      iconAnchor: [32, 32], // point of the icon which will correspond to markers location
      shadowAnchor: [0, 0], // the same for the shadow
      popupAnchor: [32, 20], // point from which the popup should open relative to the iconAnchor
    });
    this.tempIcon = L.icon({
      iconUrl: "assets/imagenes/marcas/marca_ubicacion.png",
      shadowUrl: "",
      iconSize: [40, 40], // size of the icon
      shadowSize: [0, 0], // size of the shadow
      iconAnchor: [32, 32], // point of the icon which will correspond to markers location
      shadowAnchor: [0, 0], // the same for the shadow
      popupAnchor: [32, 20], // point from which the popup should open relative to the iconAnchor
    });

    this.m_baseMaps = {
      OSM: this.m_osmBase,
      Catastro: this.m_osmCatastro,
      Satelital: this.m_imagensatelite,
    };

    L.control
      .layers(this.m_baseMaps, this.m_marca, {
        position: "topright", // 'topleft', 'bottomleft', 'bottomright'
        collapsed: false, // true
      })
      .addTo(this.m_map);

    // var upre = [-16.495996993911135, -68.13113281417846];
    var upre = [this.m_latitud, this.m_longitud];
    var marker = L.marker(upre, {
      icon: this.tempIcon,
      draggable: false,
    });
    //.bindPopup(this.dts_proyecto._nombreproyecto);
    marker.addTo(this.m_map);

    // this.m_map.on("click", (e) => {
    //   this.onMapClickV2(e);
    // });
  }
  onMapClickV2(e) {
    if (this.marca_domicilio != undefined) {
      this.m_map.removeLayer(this.marca_domicilio);
    }
    this.marca_domicilio = L.marker(e.latlng, { icon: this.tempIcon });
    this.m_map.addLayer(this.marca_domicilio);
    $("#m_latitud").val(e.latlng.lat);
    $("#m_longitud").val(e.latlng.lng).keyup();
    this.m_latitud = e.latlng.lat;
    this.m_longitud = e.latlng.lng;
  }
}
