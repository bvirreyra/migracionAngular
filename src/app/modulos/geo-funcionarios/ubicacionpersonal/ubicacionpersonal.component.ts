import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Inputmask from "inputmask";
import { Globals } from "../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { GeofuncionariosService } from "../../geo-funcionarios/geofuncionarios.service";
import { AdmusuariosService } from "../../seguridad/admusuarios/admusuarios.service";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";

declare var $: any;

declare let L;

@Component({
  selector: "app-ubicacionpersonal",
  templateUrl: "./ubicacionpersonal.component.html",
  styleUrls: ["./ubicacionpersonal.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    GeofuncionariosService,
    AdmusuariosService,
  ],
})
export class UbicacionpersonalComponent implements OnInit {
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
  public m_fechanacimiento: any;
  public m_celular: any;
  public m_direccion: any;
  public m_latitud: any;
  public m_longitud: any;
  public m_ubicacionactual: any;
  dtsUsuario: any;

  public m_latitud_casa: any;
  public m_longitud_casa: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,
    private _geofuncionarios: GeofuncionariosService,

    private globals: Globals,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent,
    private datePipe: DatePipe,
    private base64: ImgBase64Globals,

    private _admusuarios: AdmusuariosService
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
        this.BuscarUsuarios();
      })
      .catch(falloCallback);
    this.inicializandoMapaV0();
  }

  DatosConexion() {
    return new Promise((resolve, reject) => {
      this._autenticacion
        .getdatosconexion(this.s_idcon, this.s_idmod)
        .subscribe(
          (result: any) => {
            
            this.dtsUsuario = result;
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
  }
  transformAnio(date) {
    return this.datePipe.transform(date, "YYYY");
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
      this.m_fechanacimiento = "";
      this.m_map.removeLayer(this.marca_domicilio);
    }
  }
  inicializandoMapaV0() {
    this.m_map = L.map("map", {
      //center: [-16.6057484, -65.9199602], BOLIVIA
      center: [-16.496389, -68.131006],
      zoom: 18,
    });
    //this.ubicacionActual();

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
    //this.m_ubicacionactual=[0,0];

    //console.log(this.m_ubicacionactual) ;

    this.m_baseMaps = {
      OSM: this.m_osmBase,
      Catastro: this.m_osmCatastro,
    };
    // this.m_marca = {
    //   "Puntazo": this.m_ubicacionactual
    // };

    L.control
      .layers(this.m_baseMaps, this.m_marca, {
        position: "topright", // 'topleft', 'bottomleft', 'bottomright'
        collapsed: false, // true
      })
      .addTo(this.m_map);

    var upre = [-16.495996993911135, -68.13113281417846];
    var marker = L.marker(upre, {
      icon: this.tempIconUpre,
      draggable: true,
    }).bindPopup("UNIDAD DE PROYECTOS ESPECIALES - UPRE");
    //.bindPopup('<img src="./assets/imagenes/logo/logo_upre_2021.png" width="150px" height="80px" class="img-responsive" />');
    marker.addTo(this.m_map);

    /*
        var popup = L.popup();
        popup
          .setLatLng(upre_popup) // Sets the geographical point where the popup will open.
          .setContent('<img src="./assets/imagenes/logo/logo_upre_2021.png" width="150px" height="80px" class="img-responsive" />') // Sets the HTML content of the popup.
          .openOn(this.m_map); // Adds the popup to the map and closes the previous one. 
    */

    /**************************************************
     MUESTRA PUNTO CON UN POPUP
     *************************************************/

    this.m_map.on("click", (e) => {
      this.onMapClickV2(e);
    });

    //this.m_map.attributionControl.setPrefix(false);
    //this.onMapClickV3();
    //this.onMapClickV4();
    //this.m_map.on('locationfound', this.onMapClickV2);
  }
  ubicacionActual() {
    this.m_map.on("locationfound", this.onLocationFound);
    this.m_map.on("locationerror", this.onLocationError);
    this.m_map.locate();
  }
  onLocationFound(e) {
    console.log("on", e);
    this.m_ubicacionactual = e;
    var punto = L.marker(this.m_ubicacionactual.latlng).bindPopup(
      "Soy un puntazo"
    );
    //this.m_ubicacionactual = [0, 0];
    // this.m_ubicacionactual[0]=e.latlng.lat;
    // this.m_ubicacionactual[1]=e.latlng.lng;
    console.log("on2", this.m_ubicacionactual);
  }
  onLocationError(e) {
    alert(
      "No es posible encontrar su ubicación. Es posible que tenga que activar la geolocalización."
    );
  }
  onMapClick(e) {
    let tempMarker = L.marker(e.latlng, {
      icon: this.tempIcon,
      draggable: true,
    }).bindPopup(
      "<p>Latitud:" +
        e.latlng.lat.toString() +
        "<br> Longitud" +
        e.latlng.lng.toString() +
        "</p>"
    );
    tempMarker.addTo(this.m_map);

    var popup = L.popup();
    popup
      .setLatLng(e.latlng) // Sets the geographical point where the popup will open.
      .setContent(
        "<p>Latitud:" +
          e.latlng.lat.toString() +
          "<br> Longitud" +
          e.latlng.lng.toString() +
          "</p>"
      ) // Sets the HTML content of the popup.
      .openOn(this.m_map); // Adds the popup to the map and closes the previous one.
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
  onMapClickV3() {
    var curLocation = [0, 0];
    if (curLocation[0] == 0 && curLocation[1] == 0) {
      curLocation = [-16.496372477499456, -68.13025469624141];
    }

    var marker = new L.marker(curLocation, {
      icon: this.tempIcon,
      draggable: true,
    });

    marker.on("dragend", function (event) {
      var position = marker.getLatLng();
      marker
        .setLatLng(position, {
          draggable: "true",
        })
        .bindPopup(position)
        .update();
      $("#Latitude").val(position.lat);
      $("#Longitude").val(position.lng).keyup();
    });

    $("#Latitude, #Longitude").change(function () {
      var position = [
        parseInt($("#Latitude").val()),
        parseInt($("#Longitude").val()),
      ];
      marker
        .setLatLng(position, {
          draggable: "true",
        })
        .bindPopup(position)
        .update();
      this.m_map.panTo(position);
    });

    this.m_map.addLayer(marker);
  }

  onMapClickV4() {
    function onLocationFound(e) {
      //var radius = e.accuracy / 2;

      L.marker(e.latlng)
        .addTo(this.m_map)
        .bindPopup("Estas en Este Punto" + e.latlng)
        .openPopup();
      L.circle(e.latlng).addTo(this.m_map);
    }

    function onLocationError(e) {
      alert(e.message);
    }

    this.m_map.on("locationfound", onLocationFound);
    this.m_map.on("locationerror", onLocationError);

    this.m_map.locate({ setView: true, maxZoom: 16 });
  }

  // preinsertaGeoFuncionario() {
  //   if (this.m_nombre.length > 0 || this.m_ci.length > 0 || this.m_latitud.length > 0 || this.m_longitud.length > 0 || this.m_celular.length > 0 || this.m_direccion.length > 0 || this.m_expedido.length > 0) {
  //     this.insertaGeoFuncionario();
  //   }
  //   else {
  //     this.prop_msg = 'Debe ingresar todos los campos requeridos (*)';
  //     this.prop_tipomsg = 'danger';
  //     this._msg.formateoMensaje('modal_danger', this.prop_msg);
  //   }
  // }

  // insertaGeoFuncionario() {
  //   this._geofuncionarios.insertaGeoFuncionario(
  //     this._fun.textoUpper(this.m_unidad),
  //     this._fun.textoUpper(this.m_nombre),
  //     this._fun.textoUpper(this.m_paterno),
  //     this._fun.textoUpper(this.m_materno),
  //     this._fun.textoUpper(this.m_ci),
  //     this._fun.textoUpper(this.m_expedido),
  //     this._fun.textoUpper(this.m_complementosegip),
  //     this._fun.textoUpper(this.m_celular),
  //     this._fun.textoUpper(this.m_direccion),
  //     this._fun.textoUpper(this.m_latitud),
  //     this._fun.textoUpper(this.m_longitud)
  //   ).subscribe(
  //     (result: any) => {
  //       
  //       if (result[0]._accion == 'CORRECTO') {
  //         this.paneles('LIMPIA_FORMULARIO');
  //         this.prop_msg = result[0]._mensaje;
  //         this.prop_tipomsg = 'success';
  //         this._msg.formateoMensaje('modal_success', this.prop_msg, 7);
  //       }
  //       else {
  //         this.prop_msg = result[0]._mensaje;
  //         this.prop_tipomsg = 'danger';
  //         this._msg.formateoMensaje('modal_danger', this.prop_msg, 7);
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

  // Búsqueda del usuario para completar los datos en geofuncionarios
  BuscarUsuarios() {
    this._admusuarios
      .getUsuarioGeopersonal(this.dtsUsuario[0]._usu_id)
      .subscribe(
        (result: any) => {
          
          this.m_unidad = result[0].usu_area;
          this.m_nombre = result[0].usu_nom;
          this.m_paterno = result[0].usu_app;
          this.m_materno = result[0].usu_apm;
          this.m_ci = result[0].usu_ci;
          this.m_expedido = result[0].usu_exp;
          this.m_complementosegip = result[0].usu_complementosegip;
          this.m_fechanacimiento = this._fun.transformDate_ddmmyyyy(
            result[0].usu_fn
          );
          this.m_celular = result[0].usu_cel;
          this.m_direccion = result[0].usu_direccion;
          if (
            result[0].usu_latitud != undefined &&
            result[0].usu_longitud != undefined &&
            result[0].usu_latitud != "undefined" &&
            result[0].usu_longitud != "undefined"
          ) {
            this.m_latitud = result[0].usu_latitud;
            this.m_longitud = result[0].usu_longitud;
            this.m_latitud_casa = this.m_latitud;
            this.m_longitud_casa = this.m_longitud;
            var casa = [this.m_latitud, this.m_longitud];
            this.marca_domicilio = L.marker(casa, { icon: this.tempIcon });
            this.marca_domicilio.addTo(this.m_map);
          } else {
            this.m_latitud = "";
            this.m_longitud = "";
            this.m_latitud_casa = this.m_latitud;
            this.m_longitud_casa = this.m_longitud;
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            console.log(this.errorMessage);
            alert("1Error en la petición BUSQUEDA");
          }
        }
      );
  }

  // Actualiza datos del funcionario
  actualizarUbicacionGeo() {
    if (this.m_celular == "" || this.m_direccion == "") {
      this.prop_msg = "No deben existir datos vacios.";
      this.prop_tipomsg = "danger";
      this._msg.formateoMensaje("modal_info", this.prop_msg);
      return;
    }
    this._admusuarios
      .getActualizaGeosuario(
        this.dtsUsuario[0]._usu_id,
        this.m_celular,
        this.m_direccion,
        this.m_latitud,
        this.m_longitud
      )
      .subscribe(
        (result: any) => {
          
          this.prop_msg = "Se actualizó el registro de manera correcta.";
          this.m_latitud_casa = this.m_latitud;
          this.m_longitud_casa = this.m_longitud;
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_success", this.prop_msg);
          //this._router.navigate(['../geofuncionarios/:idcon/:idmod']);
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            console.log(this.errorMessage);
            alert("1Error en la petición BUSQUEDA");
          }
        }
      );
  }

  cancelar() {
    this.m_map.removeLayer(this.marca_domicilio);
    this.m_latitud = this.m_latitud_casa;
    this.m_longitud = this.m_longitud_casa;
    var casa = [this.m_latitud, this.m_longitud];
    this.marca_domicilio = L.marker(casa, { icon: this.tempIcon });
    this.marca_domicilio.addTo(this.m_map);
  }
}
