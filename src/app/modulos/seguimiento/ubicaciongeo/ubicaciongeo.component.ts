import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Inputmask from "inputmask";
import { tileLayer } from "leaflet";
import { Globals } from "../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { SeguimientoService } from "../../seguimiento/seguimiento.service";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";

declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var jsPDF: any; // Important

declare let L;

@Component({
  selector: "app-ubicaciongeo",
  templateUrl: "./ubicaciongeo.component.html",
  styleUrls: ["./ubicaciongeo.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    SeguimientoService,
  ],
})
export class UbicaciongeoComponent implements OnInit {
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

  public dts_departamento: any;
  public dts_provincia: any;
  public dts_municipio: any;
  public dts_ListaMunicipio: any;

  public m_codigo_departamento: any;
  public m_codigo_provincia: any;
  public m_codigo_municipio: any;
  public m_map: any;
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

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _seguimiento: SeguimientoService,

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
    this.paneles("VER_GRIDVIEW");

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
    this.dtsDepartamentos();
    this.dtsMunicipios();
    this.inicializandoMapa();
    $("#pnl_municipio").hide();
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
          
          console.log("rolesasignados", result);
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
    if (string == "EDITAR_ESTADOPROYECTO") {
      $("#pnl_gridview").hide();
      $("#pnl_formulario").show();
      $("#pnl_gridview_supervision").hide();
      $("#pnl_formulario_supervision").hide();
      $("#modalConfirmacion").modal("hide");
      $("#modalSupervision").modal("hide");
      $("#pnl_gridview_equipotecnico").hide();
    }
    if (string == "VER_GRIDVIEW") {
      $("#pnl_gridview").show();
      $("#pnl_formulario").hide();
      $("#pnl_gridview_supervision").hide();
      $("#pnl_formulario_supervision").hide();
      $("#modalConfirmacion").modal("hide");
      $("#modalSupervision").modal("hide");
      $("#pnl_gridview_equipotecnico").hide();
    }
    if (string == "VER_GRIDVIEW_SUPERVISION") {
      $("#pnl_gridview").hide();
      $("#pnl_formulario").hide();
      $("#pnl_gridview_supervision").show();
      $("#pnl_formulario_supervision").hide();
      $("#modalConfirmacion").modal("hide");
      $("#modalSupervision").modal("hide");
      $("#pnl_gridview_equipotecnico").hide();
    }
    if (string == "EDITAR_ESTADOSUPERVISION") {
      $("#pnl_gridview").hide();
      $("#pnl_formulario").hide();
      $("#pnl_gridview_supervision").hide();
      $("#pnl_formulario_supervision").show();
      $("#modalConfirmacion").modal("hide");
      $("#pnl_gridview_equipotecnico").hide();
    }
    if (string == "EQUIPO_TECNICO") {
      $("#pnl_gridview").hide();
      $("#pnl_formulario").hide();
      $("#pnl_gridview_supervision").hide();
      $("#pnl_formulario_supervision").hide();
      $("#modalConfirmacion").modal("hide");
      $("#pnl_gridview_equipotecnico").show();
    }
  }
  dtsDepartamentos() {
    this._seguimiento.listaDepartamentos().subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          //this.dts_departamento = this._fun.RemplazaNullArray(result);
          this.dts_departamento = result;
          console.log(this.dts_departamento);
        } else {
          this.prop_msg = "Alerta: No existen departamentos";
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
  dtsProvincias() {
    this._seguimiento.listaProvincias().subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_provincia = this._fun.RemplazaNullArray(result);
        } else {
          this.prop_msg = "Alerta: No existen responsables registrados";
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
  dtsMunicipios() {
    this._seguimiento.listaMunicipios().subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_municipio = result;
          console.log(this.dts_municipio);
        } else {
          this.prop_msg = "Alerta: No existen responsables registrados";
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
  listaMunicipio(cod_dep) {
    // if(this.m_JsonMun !=undefined){
    //   this.m_map.removeLayer(this.m_JsonMun);
    // }

    this.dts_ListaMunicipio = this.dts_municipio.filter(
      (item) => item.codigo_departamento == cod_dep
    );
    // this.m_JsonMun =new L.GeoJSON(this.dts_ListaMunicipio[0].geojson, {
    //   style: function (feature) {
    //     return feature.properties.style
    //   }
    // })

    // this.m_map.addLayer(this.m_JsonMun);
  }

  inicializandoMapaV0() {
    var mapOptions = {
      center: [-21.53549, -64.7295609],
      zoom: 6,
    };

    const map = L.map("map", mapOptions);
    tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    //mostrando un poppup
    L.marker([-21.53549, -64.7295609])
      .addTo(map)
      .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
      .openPopup();
  }

  poligonos() {
    var mapOptions = {
      center: [16.506174, 80.648015],
      zoom: 6,
    };

    const map = L.map("map", mapOptions);
    // Creating a Layer object
    var layer = new L.tileLayer(
      "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    );

    // Adding layer to the map
    map.addLayer(layer);
    // Creating latlng object

    var latlngs = [
      [
        // first polygon
        [
          [37, -109.05],
          [41, -109.03],
          [41, -102.05],
          [37, -102.04],
        ], // outer ring
        [
          [37.29, -108.58],
          [40.71, -108.58],
          [40.71, -102.5],
          [37.29, -102.5],
        ], // hole
      ],
      [
        // second polygon
        [
          [41, -111.03],
          [45, -111.04],
          [45, -104.05],
          [41, -104.05],
        ],
      ],
    ];
    var polyline = L.polyline(latlngs, { color: "red" }).addTo(map);
    // zoom the map to the polyline
    map.fitBounds(polyline.getBounds());
  }
  mapaInicial(dts) {
    var mapOptions = {
      center: [-21.53549, -64.7295609],
      zoom: 6,
    };

    const map = L.map("map", mapOptions);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // let marca1=L.marker([-19.0333195,-65.2627411])
    // marca1.addTo(map);
    console.log("datos", dts[0].row_to_json);
    fetch(dts).then((data) => {
      let geojsonlayer = L.geoJson(data).addTo(map);
      map.fitBounds(geojsonlayer.getBounds());
    });
  }

  layerDepartamento() {
    if (this.m_JsonDpto != undefined) {
      this.m_map.removeLayer(this.m_JsonDpto);
      if (this.m_JsonMun != undefined) {
        this.m_map.removeLayer(this.m_JsonMun);
      }
    }

    var dts = this.dts_departamento.filter(
      (item) => item.codigo_departamento == this.m_codigo_departamento
    );
    console.log("depto", dts[0].geojson);
    this.m_JsonDpto = new L.GeoJSON(dts[0].geojson, {
      style: function (feature) {
        switch (feature.properties.f3) {
          case "departamento":
            return { color: "#3689EC" };
          case "municipio":
            return { color: "#DE9755" };
        }
        return feature.properties.style;
      },
    });

    this.m_map.addLayer(this.m_JsonDpto);
    this.m_map.fitBounds(this.m_JsonDpto.getBounds());
    $("#pnl_municipio").show();
    this.listaMunicipio(this.m_codigo_departamento);
  }
  layerMunicipio() {
    if (this.m_JsonMun != undefined) {
      this.m_map.removeLayer(this.m_JsonMun);
    }

    var dts = this.dts_municipio.filter(
      (item) => item.codigo_municipio == this.m_codigo_municipio
    );
    console.log(dts[0].geojson);
    this.m_JsonMun = new L.GeoJSON(dts[0].geojson, {
      style: function (feature) {
        switch (feature.properties.f3) {
          case "departamento":
            return {
              color: "#3689EC",
              weight: 2,
              fillColor: "#00ad79",
              fillOpacity: 0.6,
            };
          case "municipio":
            return {
              color: "#DE9755",
              weight: 2,
              fillColor: "#00ad79",
              fillOpacity: 0.6,
            };
        }

        return feature.properties.style;
      },
    });

    this.m_map.addLayer(this.m_JsonMun);
    this.m_map.fitBounds(this.m_JsonMun.getBounds());
  }

  limpiarLayers() {
    this.m_map.flyTo([-16.6057484, -65.9199602], 6);
    // var latLon = L.latLng(-16.6057484, -65.9199602);
    // var bounds = latLon.toBounds(6);
    // this.m_map.panTo(latLon).fitBounds(bounds);

    if (this.m_JsonDpto != undefined) {
      this.m_map.removeLayer(this.m_JsonDpto);
      if (this.m_JsonMun != undefined) {
        this.m_map.removeLayer(this.m_JsonMun);
      }
    }
    var centroInicial = L.addLayer([-16.6057484, -65.9199602]);
    //this.m_map.setView({lat:-16.6057484, lng:-65.9199602}, 6)
    //this.m_map.setZoom(6)
  }
  inicializandoMapa() {
    this.m_map = L.map("map", {
      center: [-16.6057484, -65.9199602],
      //center: [101.2, 1.2],
      zoom: 6,
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

    var punto = L.marker([37.8843717608536, -4.779524803161621]).bindPopup(
      "Soy un puntazo"
    );

    this.m_baseMaps = {
      OSM: this.m_osmBase,
      Catastro: this.m_osmCatastro,
    };

    //   this.m_marca = {
    //     "Puntazo": punto
    // };

    L.control
      .layers(this.m_baseMaps, this.m_marca, {
        position: "topright", // 'topleft', 'bottomleft', 'bottomright'
        collapsed: false, // true
      })
      .addTo(this.m_map);
  }
  // // a GeoJSON multipolygon
  // var mp = {
  //   "type": "Feature",
  //   "geometry": {
  //     "type": "MultiPolygon",
  //     "coordinates": [
  //       [
  //         [
  //           [101.2, 1.2], [101.8, 1.2], [101.8, 1.8], [101.2, 1.8], [101.2, 1.2]
  //         ],
  //         [
  //           [101.2, 1.2], [101.3, 1.2], [101.3, 1.3], [101.2, 1.3], [101.2, 1.2]
  //         ],
  //         [
  //           [101.6, 1.4], [101.7, 1.4], [101.7, 1.5], [101.6, 1.5], [101.6, 1.4]
  //         ],
  //         [
  //           [101.5, 1.6], [101.6, 1.6], [101.6, 1.7], [101.5, 1.7], [101.5, 1.6]
  //         ]
  //       ],
  //       [
  //         [
  //           [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]
  //         ],
  //         [
  //           [100.35, 0.35], [100.65, 0.35], [100.65, 0.65], [100.35, 0.65], [100.35, 0.35]
  //         ]
  //       ]
  //     ]
  //   },
  //   "properties": {
  //     "name": "MultiPolygon",
  //     "style": {
  //       color: "black",
  //       opacity: 1,
  //       fillColor: "white",
  //       fillOpacity: 1
  //     }
  //   }
  // };

  // create a map in the "map" div, set the view to a given place and zoom
  // var map = L.map('map', {
  //    center: [-16.6057484, -65.9199602],
  //   //center: [101.2, 1.2],
  //   zoom: 6
  // });
}
