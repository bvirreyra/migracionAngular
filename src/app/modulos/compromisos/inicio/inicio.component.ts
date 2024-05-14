import { Component, OnInit } from "@angular/core";
import OlTileLayer from "ol/layer/Tile";
import OlMap from "ol/Map";
import OlXYZ from "ol/source/XYZ";
import OlView from "ol/View";

import ZoomSlider from "ol/control/ZoomSlider";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Vector as VectorLayer } from "ol/layer";
import Tile from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import { Fill, Icon, Style, Text } from "ol/style";

import { fromLonLat } from "ol/proj";

import { DatePipe } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import Inputmask from "inputmask";
import { Globals } from "../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { EventosService } from "../../compromisos/eventos.service";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

@Component({
  selector: "app-inicio",
  templateUrl: "./inicio.component.html",
  styleUrls: ["./inicio.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    EventosService,
  ],
})
export class InicioComponent implements OnInit {
  map: OlMap;
  source: OlXYZ;
  layer: OlTileLayer;
  view: OlView;

  mapId: string;

  public title: any;
  public lat: any;
  public lng: any;
  public locations: any;
  public features = [];
  // map;

  vectorSource;
  vectorLayer;
  rasterLayer;
  public estilo: any;

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

  /*paneles*/

  public pnlFormularioRegistrar = false;
  public pnlGridView = false;
  public pnl_formulario2 = false;

  /*variables del componente*/
  public dts_listaubicacioneseventos: any;
  public geojsonObject: any;
  public geojsonej1: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _eventos: EventosService,

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
    this.locations = [
      {
        id: 1,
        color: "amarillo",
        x: -67.9216919,
        y: -17.2357998,
        name: "Sucursal 1",
        address: "Avenida Noel Kempff Mercado 715, Santa Cruz de la Sierra",
      },
      {
        id: 2,
        color: "negro",
        x: -65.9854,
        y: -18.2671,
        name: "Sucursal 2",
        address:
          "Av. Ovidio Barbery Justiniano (radial 26), Santa Cruz de la Sierra",
      },
    ];

    this.geojsonObject = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            "marker-color": "#f80505",
            "marker-size": "medium",
            "marker-symbol": "",
            title: "BOLIVIA",
          },
          geometry: {
            type: "Point",
            coordinates: [-65.390625, -17.308687886770024],
          },
        },
        {
          type: "Feature",
          properties: {
            "marker-color": "#07f573",
            "marker-size": "medium",
            "marker-symbol": "",
            title: "sucre",
          },
          geometry: {
            type: "Point",
            coordinates: [-65.3466796875, -18.93746442964186],
          },
        },
      ],
    };
    this.geojsonej1 = {
      type: "FeatureCollection",
      name: "vigo",
      crs: {
        type: "name",
        properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
      },
      features: [
        {
          type: "Feature",
          properties: { id: 1, Nombre: "Vigo", Poblacion: 500000 },
          geometry: {
            type: "Point",
            coordinates: [-65.3466796875, -18.93746442964186],
          },
        },
      ],
    };

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
        //this.manejoRoles();
      })
      .catch(falloCallback);

    this.listaubicacioneventos()
      .then((dts1) => {
        this.dts_listaubicacioneseventos = dts1;
        return this.puntos(this.dts_listaubicacioneseventos);
      })
      .then((dts2) => {
        this.dibujo(dts2);
      });
    //this.dibujo(this.geojsonObject)
    //this.dibujo(this.geojsonej1)
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
  // manejoRoles() {
  //   var lineas = this.dts_roles_usuario.length;
  //   var datos = this.dts_roles_usuario;
  //   for (var i = 0; i < lineas; i++) {
  //     var rol = datos[i].idrol;
  //     if (rol == 4) {// rol 4 adminitrador financiera
  //       this.vbtn_NuevoProyecto = true;
  //       this.vbtn_EditaProyecto = true;
  //     }
  //     if (rol == 5) {// rol 5 tecnico
  //       this.vbtn_EditaSeguimiento = true;
  //       this.vpanel_Tecnico = true;
  //     }
  //     if (rol == 6) {// rol 6 financiera sisin
  //       this.vbtn_NuevoSeguimiento = true;
  //       this.vbtn_EditaSeguimiento = true;
  //       this.vpanel_Financiero = true;
  //     }
  //     if (rol == 14) {
  //       this.vusrAdministrador=true;
  //       this.vbtn_NuevoProyecto = true;
  //       this.vbtn_EditaProyecto = true;
  //       this.vbtn_EditaSeguimiento = true;
  //       this.vpanel_Tecnico = true;
  //       this.vbtn_NuevoSeguimiento = true;
  //       this.vbtn_EditaSeguimiento = true;
  //       this.vpanel_Financiero = true;

  //     }
  //   }
  // }
  /****************************************************************************** */
  listaubicacioneventos() {
    return new Promise((resolve, reject) => {
      this._eventos.listaUbicacionesEventos().subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            //this.dts_listaubicacioneseventos = result;
            resolve(result);
          } else {
            this.prop_msg = "Alerta: No existen registrosss";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
            reject(this.prop_msg);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas11";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
          reject(this.prop_msg);
        }
      );
    });
  }
  puntos(lista) {
    return new Promise((resolve, reject) => {
      var featurespre = [];
      this.locations = [
        {
          id: 1,
          color: "amarillo",
          x: -67.9216919,
          y: -17.2357998,
          name: "Sucursal 1",
          address: "Avenida Noel Kempff Mercado 715, Santa Cruz de la Sierra",
        },
        {
          id: 2,
          color: "negro",
          x: -65.9854,
          y: -18.2671,
          name: "Sucursal 2",
          address:
            "Av. Ovidio Barbery Justiniano (radial 26), Santa Cruz de la Sierra",
        },
      ];

      var contador = lista.length;
      var x;
      var y;

      for (var i = 0; i < contador; i++) {
        x = lista[i].x;
        y = lista[i].y;
        var feature = new Feature({
          geometry: new Point(fromLonLat([x, y])),
        });
        featurespre.push(feature);
        resolve(featurespre);
      }
    });
  }
  dibujo(dts) {
    this.estilo = new Style({
      image: new Icon({
        //color:[241,64,26],
        crossOrigin: "upre",
        src: "assets/marcador20x20.png",
        //imgSize:[40,40]
      }),
      text: new Text({
        font: "11px helvatica, sans-serif",
        fill: new Fill({
          color: "#FAFAFA",
        }),
      }),
    });

    this.vectorSource = new VectorSource({
      features: dts,
      // features: (new OlGeoJSON()).readFeatures(dts, {
      //   dataProjection: 'EPSG:4326',
      //   featureProjection: 'EPSG:3857'
      // })
    });
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
      style: this.estilo,
    });
    this.view = new OlView({
      center: fromLonLat([-64.816689, -17.193368]),
      zoom: 6,
    });

    this.map = new OlMap({
      target: "map",
      view: this.view,
      layers: [
        new Tile({
          source: new OSM(),
        }),
        this.vectorLayer,
      ],
    });
    /*adicionando barra de zoom*/
    this.map.addControl(new ZoomSlider());
  }
  ejemplo() {}
}
