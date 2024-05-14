import { Globals } from '../global';
import { Injectable } from '@angular/core';
// import { Http, Response, Headers, Request, RequestOptions,ResponseContentType } from '@angular/http';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HerraminetasService {

  public url: string;
  public urlServicios: string;

  constructor(
    private _http: HttpClient,
    private globals: Globals
  ) { 
    this.url = globals.rutaSrvBackEnd;
    this.urlServicios = globals.rutaSrvServicios;
  }

  /*****************CONFIG CORREO **********/
  crudCorreo(dts) {
    return this._http.get(this.url + '100_crudConfigCorreo',{params: dts,});
  }
  listaConfigCorreo(opcion:string) {
    return this._http.get(this.url + '100_listaConfigCorreo/'+opcion);
  }
  // verificaEstadoCorreo = (dts) => this._http.get(this.url + '100_verificaServicioCorreo',{params: dts,});
  verificaEstadoCorreo = (dts) => this._http.post(this.urlServicios + 'correo/enviarCorreo',dts);

  /*****************CONFIG MENSAJE **********/
  crudMensaje(dts) {
    return this._http.get(this.url + '100_crudConfigMensaje',{params: dts,});
  }
  listaConfigMensaje(opcion:string) {
    return this._http.get(this.url + '100_listaConfigMensaje/'+opcion);
  }
  verificaEstadoMensaje(dts:any){
    return this._http.post(this.urlServicios + 'wp/enviarMensaje/',dts);
  }
  detenerServicioWP(destino:string){
    return this._http.get(this.url + '100_detenerServicioWP/'+destino);
  }

  /*****************CONFIG INTEROP **********/
  listaInterop = (dts) =>  this._http.get(this.url + '100_listaConfigInterop',{params: dts,});
  crudInterop = (dts) =>  this._http.get(this.url + '100_crudConfigInterop',{params: dts,});
  // verificarInterop = (dts) =>  this._http.get(dts.url2,{headers:dts.headers});
  // verificarInterop = (dts) =>  this._http.get(this.url + '100_verificaInterop',{params: dts,});
  verificarInterop = (dts) =>  this._http.post(this.urlServicios + 'interop/consumirInterop',dts);
  
  /********************** CRUD BACKUPS FUNCIONARIOS************************** */
  listaBackups = (dts) =>  this._http.get(this.url + '19_listarBackup',{params: dts,});
  crudBackups = (dts) =>  this._http.get(this.url + '19_crudBackup',{params: dts,});
  listarFuncionarios = (dts) =>  this._http.get(this.url + '19_listarFuncionarios',{params: dts,});
  crearReporteBackup =(dts)=> this._http.get(this.url + '19_crearReporteBackup',{responseType:'arraybuffer',params: {id:dts}});
  crearReporteGeneral = () =>  this._http.get(this.url + '19_crearReporteGeneral',{responseType:'arraybuffer',params: {},});

 /********************** CRUD INSCRIPCION PRESUPUESTARIA FUNCIONARIOS************************** */
  // listarInscripciones = (dts, id) =>  this._http.get(this.url + '19_listarInscripcionesPresupuestarias',{params: {id:dts}});
  listarInscripciones = (opcion, id) => {
    return this._http.get(this.url + '19_listarInscripcionesPresupuestarias', {params: {...opcion,...id}});};
  crudInscripcion = (dts) =>  this._http.get(this.url + '19_crudInscripcion',{params: dts,});
}
