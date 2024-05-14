import { Injectable } from '@angular/core';
//import { Http, Response, Headers, Request, RequestOptions } from '@angular/http';
import {HttpClient} from '@angular/common/http'
import {FuncionesComponent} from '../funciones/funciones/funciones.component'

import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Injectable()
export class FormusuarioService {
  public url: string;
  constructor(
    private _http: HttpClient,
    private _fun:FuncionesComponent
  ) {
    this.url = 'http://192.168.1.102:8686/';
  }
  insertar_usuario(op: string, id: string, user: string, apat: string, amat: string, nom: string, usr_registro: string, estado: string) {
    return this._http.get(this.url + 'crud_usuario/' + op + '/' + id + '/' + user + '/' + apat + '/' + amat + '/' + nom + '/' + usr_registro + '/' + estado);
  }
  lista_usuario(op: string) {
    
    return this._http.get(this.url + 'lista_usuario/' + op );
  }
  // VerReceta(comprobante: string,ase_mat:string) {
  //   return this._http.get(this.url + 'verreceta/' + comprobante+'/'+ase_mat);
  // }
}
