import { Injectable } from "@angular/core";
// import { Http, ResponseContentType } from "@angular/http";
import { HttpClient,HttpResponse} from "@angular/common/http";
import { Globals } from "../../global";

var varsession = "";
@Injectable()
export class AlmacenesService {
  public url: string;
  public urlFonadal: string;
  userName: string;
  loggeIn: boolean;

  constructor(private _http: HttpClient, private globals: Globals) {
    //this.url='http://localhost:8383/';
    this.url = globals.rutaSrvBackEnd;
    this.urlFonadal = globals.rutaSrvBackEndFonadal;

    //this.url='http://192.168.1.153:8383/';
    this.userName = "";
    this.loggeIn = false;
  }

  getListaInventarioFisicoValorado(fechafin: string) {
    return this._http.get(
      this.url + "almacenes_rpt_inventariofisicovalorado/" + fechafin
    );
  }
  getListaResumenInventarioFisicoValorado(fechafin: string) {
    return this._http.get(
      this.url + "almacenes_rpt_resumeninventariofisicovalorado/" + fechafin
    );
  }
  /**************NUEVOS */
  crudPartida(dts) {
    return this._http.get(this.url + "2_almacenCRUDPartida", { params: dts });
  }
  crudInsumo(dts) {
    return this._http.get(this.url + "2_almacenCRUDInsumo", { params: dts });
  }
  crudIngreso(dts) {
    return this._http.get(this.url + "2_almacenCRUDIngreso", { params: dts });
  }
  crudIngresoDetalle(dts) {
    return this._http.get(this.url + "2_almacenCRUDIngresoDetalle", {
      params: dts,
    });
  }
  crudProveedor(dts) {
    return this._http.get(this.url + "2_almacenCRUDProveedor", { params: dts });
  }
  crudSolicitud(dts) {
    return this._http.get(this.url + "2_almacenCRUDSolicitud", { params: dts });
  }
  crudSolicitudDetalle(dts) {
    return this._http.get(this.url + "2_almacenCRUDSolicitudDetalle", {
      params: dts,
    });
  }
  partidas() {
    return this._http.get(this.url + "2_partidas");
  }
  insumos() {
    return this._http.get(this.url + "2_insumos");
  }
  ingresos() {
    return this._http.get(this.url + "2_ingresos");
  }
  ingresosDetalle(idIngreso) {
    return this._http.get(this.url + "2_ingresosDetalle/" + idIngreso);
  }
  proveedores() {
    return this._http.get(this.url + "2_proveedores");
  }
  solicitudes(gestion) {
    return this._http.get(this.url + `2_solicitudes/${gestion}`);
  }
  solicitudesDetalle(idSolicitud) {
    return this._http.get(this.url + "2_solicitudesDetalle/" + idSolicitud);
  }
  solicitudesUnidad(unidad, gestion) {
    return this._http.get(
      this.url + `2_solicitudesUnidad/${unidad}/${gestion}`
    );
  }

  chartInsumosMasComprados(gestion) {
    return this._http.get(this.url + `2_insumosMasComprados/${gestion}`);
  }
  chartPorPartida(gestion) {
    return this._http.get(this.url + `2_porPartidas/${gestion}`);
  }
  chartInsumosMasSolicitados(gestion) {
    return this._http.get(this.url + `2_insumosMasSolicitados/${gestion}`);
  }
  kardexInsumo(dts) {
    return this._http.get(this.url + "2_kardexInsumo", { params: dts });
  }
  //para reprotes
  entradasFV(dts) {
    return this._http.get(this.url + "2_entradasFV", { params: dts });
  }
  salidasFV(dts) {
    return this._http.get(this.url + "2_salidasFV", { params: dts });
  }
  // reportesAlmacences2(dts) {
  //     return this._http.get(this.url + '2_reportesAlmacenes2/',{responseType:ResponseContentType.Blob,params: dts});
  // }
  reportesAlmacences(dts) {
    return this._http.post(this.url + "2_reportesAlmacenes/", dts, {
      responseType:'arraybuffer',
    });
  }
}
