import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormusuarioService} from './formusuario.service'
import {FuncionesComponent} from '../funciones/funciones/funciones.component'

@Component({
  selector: 'app-formusuario',
  templateUrl: './formusuario.component.html',
  styleUrls: ['./formusuario.component.css'],
  providers: [FormusuarioService,FuncionesComponent]
})
export class FormusuarioComponent implements OnInit {
  public titulo:string;
  public subtitulo:string;
  public m_usuario:any;
  public errorMessage:any;

  // PANELES
  public pnl_formularioalta=false;

  //BOTONES
  public btn_insertar:boolean;
  public btn_actualizar:boolean;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _formularioservice: FormusuarioService,
    private _fun: FuncionesComponent


  ) {

    this.titulo = 'mi-proyecto-angular';
    this.m_usuario =[{ USU_ID: '' , USU_USER: '' , USU_PASS: '', USU_APAT: '', USU_AMAT: '', USU_NOM:'', USU_REGISTRO: '' , USU_ESTADO: '' }]
    
  }


  ngOnInit() {
    this.btn_insertar=false;
    this.btn_actualizar=false;   
    
  }
  NuevoFormulario(){
    this.pnl_formularioalta=true;
    this.btn_insertar=true;
    this.btn_actualizar=false;
    this.subtitulo='INSERTAR NUEVO USUARIO'
  }
  EditarFormulario(){
    this.pnl_formularioalta=true;
    this.subtitulo='EDITAR USUARIO'
    this.btn_insertar=false;
    this.btn_actualizar=true;
  }
  ListaUsuarios(){
    //this.pnl_listado=true;
    this.subtitulo='INSERTAR NUEVO USUARIO'
  }
  RegistrarUsuario(){


    this._formularioservice.insertar_usuario('I',this._fun.getNullVacio(null),'vlopez','lopez','castro','vladimir','vlopez','31').subscribe(
      (result: any) => { 
      console.log(result);
         
      },
      error => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
              
              
          }
      }
    );
  }
  ListarUsuarios(){
    this._formularioservice.lista_usuario('Q').subscribe(
      (result: any) => {
      console.log(result);
         

      },
      error => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
              
              
          }
      }
    );
  }

}
