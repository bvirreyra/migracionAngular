import { Injectable,EventEmitter } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Globals } from 'src/app/global';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  public url: string;

  nit$:BehaviorSubject<string> = new BehaviorSubject('0');
  nombre$ = new EventEmitter<string>();
  
  constructor(
    private _http:HttpClient,
    private globals:Globals
  ) { 
    this.url = globals.rutaSrvBackEnd;
  }
  //globales
  getInfo(){
    return this.nit$.asObservable();
  }
  setInfo(info:string){
    this.nit$.next(info);
  }

  //LISTADOS
  listaAsociaciones = (dts) => this._http.get(this.url + '16_listaAsociacion',{params: dts,});

  listaAsociados = (dts) => this._http.get(this.url + '16_listaAsociado',{params: dts,});

  listaEmpleados = (dts) => this._http.get(this.url + '16_listaEmpleado',{params: dts,});
  
  listaEmpresas = (dts) => this._http.get(this.url + '16_listaEmpresa',{params: dts,});

  listaEquiposTrabajo = (dts) => this._http.get(this.url + '16_listaEquipoTrabajo',{params: dts,});

  listaExperienciasEmpleado = (dts) => this._http.get(this.url + '16_listaExperienciaEmpleado',{params: dts,});

  listaExperienciasEmpresa = (dts) => this._http.get(this.url + '16_listaExperienciaEmpresa',{params: dts,});

  listaFormularios = (dts) => this._http.get(this.url + '16_listaFormulario',{params: dts,});

  listaPersonas = (dts) => this._http.get(this.url + '16_listaPersona',{params: dts});
  
  listaRepresentantes = (dts) => this._http.get(this.url + '16_listaRepresentante',{params: dts,});
  
  listaUsuarios = (dts) => this._http.get(this.url + '16_listaUsuario',{params: dts,});

  listaParametros = (dts) => this._http.get(this.url + '16_parametros',{params: dts,});

  listaPersonaExperiencia = (dts) => this._http.get(this.url + '16_listaPersonaExperiencia',{params: dts,});

  validarEstadoSocio = (dts) => this._http.get(this.url + '16_validarEstadoSocio',{params: dts,});

  //CRUD
  crudAsociacion = (dts) => this._http.get(this.url + '16_crudAsociacion',{params: dts,});
  
  crudAsociado = (dts) => this._http.get(this.url + '16_crudAsociado',{params: dts,});
  
  crudEmpleado = (dts) => this._http.get(this.url + '16_crudEmpleado',{params: dts,});
  
  crudEmpresa = (dts) => this._http.get(this.url + '16_crudEmpresa',{params: dts,});
  
  crudEquipoTrabajo = (dts) => this._http.get(this.url + '16_crudEquipoTrabajo',{params: dts,});
  
  crudExperienciaEmpleado = (dts) => this._http.get(this.url + '16_crudExperienciaEmpleado',{params: dts,});
  
  crudExperienciaEmpresa = (dts) => this._http.get(this.url + '16_crudExperienciaEmpresa',{params: dts,});
  
  crudFormulario = (dts) => this._http.post(this.url + '16_crudFormulario',dts);
  
  crudPersona = (dts) => this._http.get(this.url + '16_crudPersona',{params: dts,});
  
  crudRepresentante = (dts) => this._http.get(this.url + '16_crudRepresentante',{params: dts,});
  
  crudUsuario = (dts) => this._http.get(this.url + '16_crudUsuario',{params: dts,});

  //SERVICIOS
  serviciosInterop = (dts) => this._http.get(this.url + '16_serviciosInterop',{params: dts,});
  desvincular = (dts) => this._http.get(this.url + '16_desvincularPersona',{params: dts,});

  //REPORTES
  reportesCompromisosQuery =(data) => this._http.get(this.url + '15_reportesCompromisosQuery/',{params: data,responseType:'arraybuffer'});
  reportesFormulario =(data) => this._http.get(this.url + '16_reportes/',{params: data,responseType:'arraybuffer'});

  //FORMULARIO
  armarPreFormulario = (dts) => this._http.get(this.url + '16_armarPreFormulario',{params: dts,});
  buscarContenidoFormulario = (dts) => this._http.get(this.url + '16_buscaContenidoFormulario',{params: dts,});

  //EXCEL
  cargarExperienciaExcel = (dts) => {
    const formData: FormData = new FormData();
    // formData.append("FILE", dts.FILE, dts.FILE.name);
    formData.append("FILE", dts, dts.fid_empresa);
    return this._http.put(this.url + '16_cargarExperienciaExcel',formData,{params:{fid_empresa:dts.fid_empresa,usuario_registro:dts.usuario_registro}});
  }
  descargarPlantilla = (dts) => this._http.get(this.url + "16_descargarPlantilla", {responseType: 'arraybuffer',params: dts,});

}
