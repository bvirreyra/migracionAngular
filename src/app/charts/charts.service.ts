import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from '../global';

@Injectable({
  providedIn: 'root'
})
export class ChartsService {
  public url: string;

  constructor(
    private _http:HttpClient,
    private globals:Globals
  ) { 
    this.url = globals.rutaSrvBackEnd;
  }

  //LISTADOS
  listaTareas = (dts:any) => this._http.get(this.url + '50_listaTareas',{params: dts,});

  listaMonitoreos = (dts:any) => this._http.get(this.url + '50_listaMonitoreos',{params: dts,});

  compromisos = (dts:any) => this._http.get(this.url + '15_compromisosPresidencia',{params: dts,});

  /*******chart proveido */
  listarProveidos = (dts) => this._http.get(this.url + '3_chartProveido',{params: dts,});
}
