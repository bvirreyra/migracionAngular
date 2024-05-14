import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from 'src/app/global';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {
  public url: string;

  constructor(
    private _http:HttpClient,
    private globals:Globals
  ) { 
    this.url = globals.rutaSrvBackEnd;
  }

  listarCite = (dts) => this._http.get(this.url + '14_listarCite',{params: dts,});
  listarCiteProyecto = (dts) => this._http.get(this.url + '14_listarCiteProyecto',{params: dts,});
  clasificadores = (id) => this._http.get(this.url + `3_listadosVarios/clasificadores/${id}/det`);
  proyectos = (dts) => this._http.get(this.url + `14_listarProyectos`,{params:dts});
  reportesAuditoria = (dts) => this._http.get(this.url + `14_reportesAuditoria`,{params:dts,responseType:'arraybuffer'});

  crudCite = (dts) => this._http.get(this.url + '14_crudCite',{params:dts});
  crudCiteProyecto = (dts) => this._http.get(this.url + '14_crudCiteProyecto',{params: dts,});
  respuestaCiteProyecto = (dts) => this._http.post(this.url + '14_respuestaCiteProyecto',{dts});
}
