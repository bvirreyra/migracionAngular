import { Globals } from "../../global";
import { Injectable } from "@angular/core";
// import {Http,Response, Headers, Request, RequestOptions, ResponseContentType,} from "@angular/http";
import {HttpClient, HttpResponse,} from "@angular/common/http";
import { Observable } from "rxjs";
import { map, filter } from "rxjs/operators";

var varsession = "";
@Injectable({
  providedIn: "root",
})
export class ArchivocentralService {
  public url: string;
  public url_sqlserver: string;
  userName: string;
  loggeIn: boolean;
  constructor(private _http: HttpClient, private globals: Globals) {
    this.url = globals.rutaSrvBackEnd;
    this.url_sqlserver = globals.rutaSrvBackEndFonadal;
  }

  listaArchivoCabecera(tipoArchivo, region = "") {
    return this._http.get(
      this.url + "12_lista_archivocabecera/",{params:{tipoArchivo,region}} );
  }

  listaProyectos(region = "",tipo:string) {
    return this._http.get(this.url + "12_lista_proyectosregion/",{params:{region,tipo}});
  }

  listaClasificador(idTipoClasificador, agrupaClasificador = "") {
    return this._http.get(
      this.url +
        "12_lista_clasificador/" +
        idTipoClasificador +
        "/" +
        agrupaClasificador
    );
  }
  insertaCebecera(datos) {
    return this._http.get(this.url + "12_inserta_cabecera", {
      params: datos,
    });
  }
  insertaDetalle(datos) {
    return this._http.get(this.url + "12_inserta_detalle", {
      params: datos,
    });
  }
  eliminaDetalle(datos) {
    return this._http.get(this.url + "12_elimina_detalle", {
      params: datos,
    });
  }

  listaDetalleCabecara(id_cabecera) {
    return this._http.get(this.url + "12_listaDetalleCabecera/" + id_cabecera);
  }
  listaContenedor(id_cabecera) {
    return this._http.get(this.url + "12_listaContenedor/" + id_cabecera);
  }
  obtieneIndice(valor, gestion) {
    return this._http.get(
      this.url + "12_obtieneIndice/" + valor + "/" + gestion
    );
  }
  insertaAgrupacion(id_cabecera, agrupador, valor, id_usr) {
    return this._http.get(
      this.url +
        "12_insertaAgrupacion/" +
        id_cabecera +
        "/" +
        agrupador +
        "/" +
        valor +
        "/" +
        id_usr
    );
  }
  actualizaAgrupacion(
    id_cabecera,
    agrupador_old,
    agrupador_new,
    codigo,
    id_usr
  ) {
    return this._http.get(
      this.url +
        "12_actualizaAgrupacion/" +
        id_cabecera +
        "/" +
        agrupador_old +
        "/" +
        agrupador_new +
        "/" +
        codigo +
        "/" +
        id_usr
    );
  }
  eliminaAgrupacion(id_cabecera, codigo, id_usr) {
    return this._http.get(
      this.url +
        "12_eliminaAgrupacion/" +
        id_cabecera +
        "/" +
        codigo +
        "/" +
        id_usr
    );
  }

  verificaiidsgp(fidsgp,tipoarchivo) {
    return this._http.get(this.url + "12_verificasgp/" + fidsgp + "/" + tipoarchivo);
  }

  obtieneDetalleContenedor(idcabecera, codigo_contenedor) {
    return this._http.get(
      this.url + "12_obtieneDetalle/" + idcabecera + "/" + codigo_contenedor
    );
  }

  reportes(tipoReporte) {
    return this._http.get(this.url + '12_reportes/',{responseType:'arraybuffer',params: tipoReporte});
  }

  crudUbicacion(dts) {
    return this._http.get(this.url + "12_crudUbicacion/",{params: dts,});
  }

  ubicaciones() {
    return this._http.get(this.url + "12_ubicaciones/");
  }

  /********ARCHIVO JURIDICA */
  listarArchivoJuridica = (dts) => this._http.get(this.url + '16_listarArchivoJuridica',{params: dts,});
  crudArchivoJuridica = (dts) => this._http.get(this.url + '16_crudArchivoJuridica',{params: dts,});

  /********ARCHIVO JURIDICA */
  listarArchivoFinanciera = (dts) => this._http.get(this.url + '16_listarArchivoFinanciera',{params: dts,});
  crudArchivoFinanciera = (dts) => this._http.get(this.url + '16_crudArchivoFinanciera',{params: dts,});

}
