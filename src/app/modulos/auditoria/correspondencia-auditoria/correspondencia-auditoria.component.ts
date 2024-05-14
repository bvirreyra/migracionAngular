import { Component, EventEmitter, Input, OnChanges, OnInit , Output } from '@angular/core';
import { AuditoriaService } from '../auditoria.service';
import { ToastrService } from 'ngx-toastr';
import { FuncionesComponent } from '@funciones/funciones/funciones.component';
import alasql from 'alasql';
// import * as DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import { AutenticacionService } from '../../seguridad/autenticacion.service';
import swal2 from "sweetalert2";
import * as moment from 'moment';

declare var $: any;

@Component({
  selector: 'app-correspondencia-auditoria',
  templateUrl: './correspondencia-auditoria.component.html',
  styleUrls: ['./correspondencia-auditoria.component.css']
})
export class CorrespondenciaAuditoriaComponent implements OnInit,OnChanges {
  @Input() elIdCite: number;
  @Input() abreviatura: string = 'MP/UPRE/JUAF/';
  @Input() elCodigoPadre: string = null;
  @Input() elCiteProyecto: any;
  @Input() elFidProyecto: number;
  @Input() laGestion: string;
  @Output() messageEvent = new EventEmitter<any>();
  idUsuario: number;
  cargando: boolean = false;
  // elIdCorrAuditoria:number=0;

  dtsEstados:any[]=[];
  dtsEstadosFiltrados:any[]=[];
  dtsGrupoEstados:any[]=[];
  dtsProyectos:any[]=[];
  dtsProyectosAuditados:any[]=[];
  dtsProyectosCorrespondecia:any[]=[];
  dtsCodigosPadre:any[]=[];

  dtsGestiones:string[]=[];
  dtsHistoricoProyecto:any[]=[];

  correspondencia = {
    id_cite:0,
    codigo_padre:'',
    codigo:'',
    referencia:'',
    informe:'',
    resumen:'',
    estado:null,
    gestion:null,//moment().year().toString(),
    operacion:'I',
    usuario_registro:0,
    fecha_registro: '',
  }

  cite_proyecto = {
    id_cite:0,
    id_cite_proyecto:0,
    id_proyecto:0,
    hr_respuesta:'',
    detalle_respuesta:'',
    estado_auditado:'',
    informe_respuesta:'',
    fecha_respuesta:moment().format('YYYY-MM-DD'),
  }

  public file_empty: File;
  public rutaArchivo: string = "";
  public nombreArchivo: string = "";
  public inputArchivo = null;
  public archivoModel: any = {
    TIPO_DOCUMENTO: "",
    CODIGO: "",
    FILE: null,
    NOM_FILE: "",
  };
  bloquear:boolean=false;

  fecha_min_respuesta = moment().add(-5,'days').format("YYYY-MM-DD").toString();
  fecha_min_reiterativa = moment().add(-10,'years').format("YYYY-MM-DD").toString();
  proyect:any;
  
  constructor(
    private _auditoria: AuditoriaService,
    private toastr: ToastrService,
    private _fun: FuncionesComponent,
    private _autenticacion: AutenticacionService
  ) {}

  ngOnInit() {
    console.log('init corrAuditoria',this.elIdCite);
  }

  async ngOnChanges() {
    for (let i = moment().year(); i > moment().year() -6; i--) {
      this.dtsGestiones.push(i.toString());      
    }
    this.listarProyectos({opcion:'T'})
    this.correspondencia = {
      id_cite:0,
      codigo_padre:'',
      codigo:'',
      referencia:'',
      informe:'',
      resumen:'',
      estado:null,
      gestion:null,//moment().year().toString(),
      operacion:'I',
      usuario_registro:0,
      fecha_registro:moment().format('YYYY-MM-DD'),
    }
    this.dtsProyectosCorrespondecia = [];
    console.log('cargando corrAuditoria',this.elIdCite ,this.abreviatura,this.elCodigoPadre,this.elCiteProyecto,this.elFidProyecto,this.laGestion);
    const datos = await JSON.parse(localStorage.getItem("dts_con"));
    this.idUsuario = Number(datos.s_usu_id);
    this.listarEstados();
    if(this.elCodigoPadre) this.correspondencia.codigo_padre = this.elCodigoPadre;
    this.correspondencia.id_cite = this.elIdCite;
    if(this.elCiteProyecto){
      this.cite_proyecto.id_cite_proyecto = this.elCiteProyecto.id_cite_proyecto;
      this.cite_proyecto.id_cite = this.elCiteProyecto.id_cite;
      // this.cite_proyecto.informe_respuesta = (this.elCiteProyecto.informe_respuesta || '').replace(/^.*\\/, '');
      this.cite_proyecto.informe_respuesta = this.elCiteProyecto.informe_respuesta;
      this.cite_proyecto.hr_respuesta = this.elCiteProyecto.hr_respuesta;
      this.cite_proyecto.detalle_respuesta = this.elCiteProyecto.detalle_respuesta;
      this.cite_proyecto.fecha_respuesta = moment(this.elCiteProyecto.fecha_respuesta || new Date()).format('YYYY-MM-DD');
    }
    $('#proyecto').val('');
    setTimeout(() => {
      this.listarCorrAuditoria({opcion:'completo',id:'c.id_cite'})
    }, 200);
  }

  listarEstados() {
    this._auditoria.clasificadores(47).subscribe(
      async (result: any) => {
        console.log("estados", result);
        this.dtsEstados = result;
        this.dtsGrupoEstados = await alasql(`select distinct agrupa_clasificador from ?`,[this.dtsEstados]);
        this.dtsGrupoEstados.unshift({agrupa_clasificador:'Seleccione...'})
        
        this.dtsEstados.unshift({descripciondetalleclasificador:'Seleccione...'})
        if(!this.elIdCite){
          this.cambiarGrupoEstados('INICIAL');
          $("#tipo").prop('disabled',true);
        }
        console.log('estados',this.dtsEstados,this.dtsGrupoEstados);
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor");
      }
    );
  }

  async listarProyectos(opcion) {
    this._auditoria.proyectos(opcion).subscribe(
      (result: any) => {
        console.log("los proyectos", result);
        if(this.elCiteProyecto) this.proyect = result.filter(f=>f.id_proyecto == this.elCiteProyecto.id_proyecto)[0];
        if(this.proyect) this.proyect.fc = moment(this.proyect.fecha_convenio).format('DD/MM/YYYY')
        this.dtsProyectos = result.map(p=>{
          p.formateado= `${p.id_sgp}-${p.nombreproyecto}`;
          return p;
        });
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor");
      }
    );
  }

  listarCorrAuditoria(opcion){
    this._auditoria.listarCite(opcion).subscribe(
      async (result: any) => {
        console.log("listar proy audit", result);
        this.dtsProyectosAuditados = result;
        if(this.elCiteProyecto) {
          this.dtsHistoricoProyecto = await result.filter(f=>f.id_proyecto == this.elCiteProyecto.id_proyecto);
          this.dtsHistoricoProyecto.map(e=>{
            e.fr = moment(e.fecha_registro).format('DD/MM/YYYY');
            e.fir = moment(e.fecha_respuesta).format('DD/MM/YYYY');
          })
        } 
        this.dtsCodigosPadre = await alasql(`select distinct codigo from ?`,[this.dtsProyectosAuditados]);
        setTimeout(() => {
          console.log('revi',this.elCodigoPadre);
          if(this.elCodigoPadre){
            this.dtsProyectos = this.dtsProyectosAuditados.filter(f=>f.codigo == this.elCodigoPadre && f.estadocp == 'INICIAL');
            this.dtsProyectos = this.dtsProyectos.map(p=>{
              p.formateado= `${p.id_sgp}-${p.nombreproyecto}`;
              return p;
            });
            this.fecha_min_reiterativa = moment(this.dtsProyectosAuditados.filter(f=>f.codigo == this.elCodigoPadre)[0].fecha_registro).format("YYYY-MM-DD").toString();
            console.log('luego b',this.dtsProyectos);
          }
          if(!this.elCodigoPadre){
            const ids = this.dtsProyectosAuditados.map(p => p.id_proyecto);
            this.dtsProyectos = this.dtsProyectos.filter(f=> !ids.includes(f.id_proyecto));
            console.log('luego c',this.dtsProyectos);
          }
          if(this.elCiteProyecto){
            const p = this.dtsProyectosAuditados.filter(f=>f.id_cite == this.elCiteProyecto.id_cite);
            if(p){
              p.forEach(e => {
                // if(e.estadocp != 'REITERADO'){
                  console.log('cada uno',e);
                  if(!e.detalle_respuesta || (e.id_proyecto == this.elCiteProyecto.id_proyecto )){
                    this.dtsProyectosCorrespondecia.push({
                      nombre:e.nombreproyecto,
                      id_cite_proyecto:e.id_cite_proyecto,
                      id_proyecto:e.id_proyecto,
                      id_sgp:e.id_sgp,
                      marcado: (e.detalle_respuesta || e.id_proyecto == this.elCiteProyecto.id_proyecto) ? true : false,
                      estado: e.estado_auditado,
                      estadocp:e.estadocp,
                    });
                  }
                // }
              });
              this.fecha_min_respuesta = moment(p[0].fecha_registro).format("YYYY-MM-DD").toString();
            }
          }
        }, 200);
        if(this.elIdCite) this.filtrarAuditados(this.elIdCite);
        if(!this.elIdCite) this.dtsProyectosCorrespondecia = [];      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor");
      }
    );
  }

  cambiarGrupoEstados(valor:string){
    this.dtsEstadosFiltrados = this.dtsEstados.filter(f=>f.agrupa_clasificador == valor)
    .sort((a,b)=>a.id_detalle - b.id_detalle);
    this.dtsEstadosFiltrados.unshift({descripciondetalleclasificador:'Seleccione...'})
  }

  crudCorrespondenciaAuditoria(){
    return new Promise<void>((resolve, reject) => {
      this.cargando = true;
      this.correspondencia.operacion = this.correspondencia.id_cite > 0 ? 'U' :'I';
      if(!this.correspondencia.codigo_padre) this.correspondencia.codigo_padre = this.elCodigoPadre;
      if(!this.correspondencia.codigo) this.correspondencia.codigo = this.abreviatura + '000/' + this.laGestion;
      if(!this.correspondencia.gestion) this.correspondencia.gestion = this.laGestion;
      this.correspondencia.usuario_registro = this.idUsuario
      this.elCodigoPadre ? this.correspondencia.estado = 'REITERATIVA' : this.correspondencia.estado = 'SOLICITUD INICIAL';
      // this.correspondencia.informe = this.model.editorData;
      if(this.correspondencia.codigo.slice(-4) != this.correspondencia.gestion) this.correspondencia.gestion = this.correspondencia.codigo.slice(-4);
      console.log('antes del crud Cite',this.correspondencia);
      
      this._auditoria.crudCite(this.correspondencia).subscribe(
        (result: any) => {
          console.log('el crud cite',result);
          if (!result[0].message.toUpperCase().startsWith("ERROR")) {
            this.toastr.success(result[0].message.split('|')[0], "Correspondencia Auditoria");
            if(this.correspondencia.operacion == 'I'){
              this.correspondencia.id_cite = result[0].message.split('|')[1];
              this.correspondencia.codigo = result[0].message.split('|')[2];
              this.elIdCite = this.correspondencia.id_cite
            }
            if(this.elFidProyecto && this.correspondencia.operacion == 'I'){
              console.log('pra el fidProyecto',this.correspondencia);
              const p = this.dtsProyectos.filter(f=>f.id_proyecto == this.elFidProyecto)[0];
              if(p) this.crudCorrAuditoriaProyecto(p.formateado,'I');
            } 
          }else{
            if(result[0].message.includes('llave duplicada')) result[0].message = 'EL CITE ya fue utilizado previamnete!';
            if(result[0].message.includes('llave foránea')) result[0].message = 'EL CITE PADRE no existe!';
            this.toastr.error(result[0].message,'Correspondencia Auditoria')
          }
          this.cargando = false;
          resolve()
        },
        (error) => {
          this.toastr.error(error.toString(), "Error desde el servidor");
          this.cargando = false;
          resolve()
        }
      );
    })
  }

  async crudCorrAuditoriaProyecto(id:any,tipo:string,data?:any){
    console.log('rev crud proy',id,tipo,data);
    let fid_proyecto = 0//para casos D
    if(tipo!='D'){
      if(!id.split('-')[1]) return false;
      if(id.split('-')[1]) id = id.split('-')[0];
      id = await (this.dtsProyectos.filter(f=>f.id_sgp == id)[0] || {}).id_proyecto;
    } 
    if(tipo == 'D') fid_proyecto = await (this.dtsProyectosAuditados.filter(f=>f.id_cite_proyecto == id)[0] || {}).id_proyecto || 0;
    if(isNaN(id)) return false
    if(this.dtsProyectosCorrespondecia.filter(f=>f.id_proyecto == id)[0]  && tipo == 'I'){
      this.toastr.warning('El proyecto ya se encuentra en la lista','Registro Proyectos');
      return false
    } 
    this.cargando = true;
    const cp = {
      operacion:tipo,
      id_cite_proyecto:data ? data.id_cite_proyecto : id,
      fid_cite:this.correspondencia.id_cite,
      fid_proyecto:fid_proyecto || id,
      estado: data ? data.estado : '',
      hr_respuesta: data ? data.hr_respuesta : 0,
      informe_respuesta: data ? data.informe_respuesta : '',
      detalle_respuesta: data ? data.detalle_respuesta : '',
      estado_auditado: data ? data.estado_auditado : this.correspondencia.estado,
      fecha_respuesta: data ? data.fecha_respuesta : null,
      usuario_registro:this.idUsuario
    }
    this._auditoria.crudCiteProyecto(cp).subscribe(
      (result: any) => {
        console.log('el crud cite proy',result);
        if (!result[0].message.toUpperCase().startsWith("ERROR")) {
          this.toastr.success(result[0].message, "Auditoria Proyectos");
          if(tipo=='I'){
            this.dtsProyectosCorrespondecia.push({
              nombre:this.dtsProyectos.filter(f=>f.id_proyecto == id)[0].nombreproyecto,
              id_cite_proyecto:result[0].message.split('|')[1],
              id_proyecto:id,
              id_sgp:this.dtsProyectos.filter(f=>f.id_proyecto == id)[0].id_sgp,
            })
            $('#proyecto').val('');
          }
          if(tipo == 'D'){
            this.dtsProyectosCorrespondecia = this.dtsProyectosCorrespondecia.filter(f=>f.id_cite_proyecto!=id);
          }
        }else{
          this.toastr.error(result[0].message,'Auditoria Proyectos')
        }
        this.cargando = false;
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor");
        this.cargando = false;
      }
    );
  }

  onReady(editor:any) {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
  }

  buscarCorrespondencia(){
    this.listarCorrAuditoria({opcion:'completo',id:'c.id_cite'})
    $("#modalBusqueda").modal("show");
    $(".modal").on("shown.bs.modal", function () {
      $(this).find("[autofocus]").focus();
    });
  }

  async filtrarAuditados(data:number){
    console.log('filtrando',data,this.dtsProyectosAuditados);
    this.dtsProyectosCorrespondecia = [];
    const pivot = this.dtsProyectosAuditados.filter(f=>f.id_cite == data)
    this.dtsEstadosFiltrados = this.dtsEstados;
    if(pivot){
      this.correspondencia = {
        id_cite:pivot[0].id_cite,
        codigo_padre:pivot[0].codigo_padre,
        codigo:pivot[0].codigo,
        referencia:pivot[0].referencia,
        informe:pivot[0].informe,
        resumen:pivot[0].resumen,
        estado:pivot[0].estado,
        gestion:pivot[0].gestion,
        operacion:pivot[0].operacion,
        usuario_registro:pivot[0].idUsuario,
        fecha_registro:moment(pivot[0].fecha_registro).format('YYYY-MM-DD'),
      }
      const agrupadorEstado = (await this.dtsEstados.filter(f=>f.descripciondetalleclasificador == pivot[0].estado)[0] || {}).agrupa_clasificador;
      // console.log('rev agrupador',agrupadorEstado);
      
      $("#tipo").val(agrupadorEstado);
      pivot.forEach(p => {
        if(p.estadocp != 'INICIAL' && p.estadocp) this.bloquear = true;
        if(p.nombreproyecto /*&& p.estadocp != 'REITERADO'*/){
          this.dtsProyectosCorrespondecia.push({
            nombre:p.nombreproyecto,
            id_cite_proyecto:p.id_cite_proyecto,
            id_proyecto:p.id_proyecto,
            id_sgp:p.id_sgp,
            marcado: p.detalle_respuesta ? true : false,
            estado: p.estado_auditado,
            estadocp:p.estadocp,
          })
        }
      });
      if(this.correspondencia.codigo_padre){
        console.log('ingreasndo',this.correspondencia,this.dtsProyectosAuditados.filter(f=>f.codigo == this.correspondencia.codigo_padre));
        this.dtsProyectos = this.dtsProyectosAuditados.filter(f=>f.codigo == this.correspondencia.codigo_padre && f.estadocp == 'INICIAL')
        this.dtsProyectos = this.dtsProyectos.map(p=>{
          p.formateado= `${p.id_sgp}-${p.nombreproyecto}`;
          return p;
        });
        console.log('luego a',this.dtsProyectos);
      }  
      //TODO: reactivar este bloqueo cuando ya no tenga historicos 
      // if( moment().diff(moment(pivot[0].fecha_registro),'days') > 1) this.bloquear = true;
      setTimeout(() => {
        if(this.bloquear) $('.contenedor button,.contenedor input,.contenedor textarea,.contenedor select').prop('disabled', true);
        $('#btnDescargarArchivo').prop('disabled',false);
        $('#subearchivo').prop('disabled',false);
        $('#cerrar').prop('disabled',false);
      }, 50);
    }
  }

  
  handleFileInput(files: FileList, opcion?: string) {
    this.inputArchivo = files.item(0);
    let extensionesValidas = ["pdf","docx","doc"];
    let nombreArchivo = this.inputArchivo.name;
    let extension_archivo = nombreArchivo.substr(
      nombreArchivo.indexOf(".") + 1
    );
    if (extensionesValidas.indexOf(extension_archivo) < 0) {
      this.toastr.error("El formato del archivo seleccionado no es válido","Error desde el servidor");
      $("#inputArchivo").val("");
    } else {
      this.archivoModel.NOM_FILE =  this.inputArchivo.name;
      this.archivoModel.TIPO_DOCUMENTO = this.elCiteProyecto ? "auditoria_respuesta" : "auditoria"
      this.archivoModel.CODIGO = this.elCiteProyecto ? this.elCiteProyecto.id_cite : this.elIdCite;
    }
  }

  subirAnexo() {
    if((!this.cite_proyecto.hr_respuesta || !this.cite_proyecto.detalle_respuesta)
        && this.archivoModel.TIPO_DOCUMENTO == 'auditoria_respuesta'){
      this.toastr.warning("HR y Detalle Respuesta deben tener datos válidos","Error Subir Archivo");
      return false;
    }
    if(!this.dtsProyectosCorrespondecia.filter(f=>f.marcado)[0] && this.archivoModel.TIPO_DOCUMENTO == 'auditoria_respuesta'){
      this.toastr.warning("Debe selecionar algún proyecto de referencia para la respuesta","Error Respuesta");
      return false;
    }
    if (!this.archivoModel.TIPO_DOCUMENTO) {
      this.toastr.warning("Seleccione el tipo de documento a subir","Error Subir Archivo");
      return false;
    }
    this.cargando = true;
    this.archivoModel.FILE = this.inputArchivo === null ? this.file_empty : this.inputArchivo;
    this.archivoModel.TIPO_DOCUMENTO = this.elCiteProyecto ? "auditoria_respuesta" : "auditoria";

    this._autenticacion.subirArchivo(this.archivoModel).subscribe(
      (result: any) => {
        console.log('la respuesta de subida',result);
        
        let respuestaSubida = result;
        if (respuestaSubida.ok) {
          this.rutaArchivo = respuestaSubida.nombre_archivo;
          this.toastr.success("Archivo almacenado correctamente","Subir Archivo");
          if(this.elCiteProyecto){
            this.cite_proyecto.informe_respuesta = respuestaSubida.nombre_archivo;
            this.actualizarRespuesta();
          }else{
            this.correspondencia.informe = respuestaSubida.nombre_archivo;
            this.crudCorrespondenciaAuditoria();
          }
        } else {
          if (respuestaSubida.message.includes("ya existe")) {
            swal2({
              title: "Advertencia!!!",
              text: `Realmente desea reemplazar el anexo?`,
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#d9534f",
              cancelButtonColor: "#f0ad4e",
              customClass: "swal2-popup",
              confirmButtonText: "Confirmar!",
            }).then((result) => {
              if (result.value) {
                this._autenticacion.reemplazarArchivo(this.archivoModel).subscribe(
                  (result: any) => {
                    let respuestaSubida = result;
                    if (respuestaSubida.ok) {
                      this.rutaArchivo = respuestaSubida.nombre_archivo;
                      this.toastr.success("Archvio reemplazo exitosamente","Subir Archivo");
                      if(this.elCiteProyecto){
                        this.cite_proyecto.informe_respuesta = respuestaSubida.nombre_archivo;
                        this.actualizarRespuesta();
                      }else{
                        this.correspondencia.informe = respuestaSubida.nombre_archivo;
                        this.crudCorrespondenciaAuditoria();
                      }
                    } else {
                      this.toastr.error(respuestaSubida.message.toString(),"Error Subir Archivo");
                    }
                  },
                  (error) => {
                    this.cargando = false;
                    this.toastr.error(error, "Error Subir Archivo");
                  }
                );
              }
            });
          } else {
            this.toastr.error(respuestaSubida.message.toString(),"Error Subir Archivo");
          }
        }
        this.cargando = false;
      },
      (error) => {
        this.cargando = false;
        this.toastr.error(error, "Error desde el Servidor");
      }
    );
  }

  obtenerArchivo(nombre:string,tipo:string,codigo:number) {
    this.archivoModel.NOM_FILE = nombre;
    this.archivoModel.TIPO_DOCUMENTO = tipo;
    this.archivoModel.CODIGO = codigo;
    console.log("doc_file", this.archivoModel);
    this._autenticacion.obtenerArchivo(this.archivoModel).subscribe(
      (result: any) => {
        const url = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${this.archivoModel.NOM_FILE}`);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      },
      (error) => this.toastr.warning("Error al obtener archivo: " +error,"Error Respuesta")
    );
  }

  actualizarRespuesta(){
    let marcados = [];
    if((!this.cite_proyecto.hr_respuesta || !this.cite_proyecto.detalle_respuesta)){
      this.toastr.warning("HR y Detalle Respuesta deben tener datos válidos","Error Respuesta");
      return false;
    }
    this.cargando = true;
    this.dtsProyectosCorrespondecia.forEach(p => {
      if(p.marcado)  marcados.push({id:p.id_cite_proyecto,estado:p.estado})
    });
    let tipoOpcion = ''
    if(this.elCiteProyecto) tipoOpcion = this.elCiteProyecto.estadocp == 'REITERADO' ? 'RESPUESTA_PASADA' : 'RESPUESTA' 

    const dts = {
      opcion:tipoOpcion,
      marcados,
      hr:this.cite_proyecto.hr_respuesta,
      informe : this.cite_proyecto.informe_respuesta,
      detalle : this.cite_proyecto.detalle_respuesta,
      fecha : moment(this.cite_proyecto.fecha_respuesta).format('YYYY-MM-DD'),
    }
    if(marcados.length==0){
      this.toastr.warning("Debe selecionar algún proyecto de referencia para la respuesta","Error Respuesta");
      this.cargando = false;
      return false;
    }
    console.log('antes de respuesta',dts,this.dtsProyectosCorrespondecia);
    this._auditoria.respuestaCiteProyecto(dts).subscribe(
      async (result: any) => {
        console.log("respuesta actualizada", result);
        this.cite_proyecto.id_cite_proyecto = this.elCiteProyecto.id_cite_proyecto
        this.toastr.success("Respuesta registrada satisfactoriamente!","Correspondencia Auditoria");
        this.cargando = false;
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor");
        this.cargando = false;
      }
    );
  }

  sendMessage(respuesta:string) {
    this.correspondencia = {
      id_cite:0,
      codigo_padre:'',
      codigo:'',
      referencia:'',
      informe:'',
      resumen:'',
      estado:null,
      gestion:null,//moment().year().toString(),
      operacion:'I',
      usuario_registro:0,
      fecha_registro:moment().format('YYYY-MM-DD'),
    }
    $("#tipo").val('Seleccione...');
    this.dtsProyectosCorrespondecia = [];
    this.messageEvent.emit({respuesta,gestion:this.laGestion});
  }

  cambiarEstadosRespuestas(valor:string,id?:number){
    console.log('cambiar estado',valor,id);
    
    if(id){
      this.dtsProyectosCorrespondecia.filter(f=>f.id_cite_proyecto == id)[0].estado = valor;
      this.dtsProyectosCorrespondecia.filter(f=>f.id_cite_proyecto == id)[0].marcado = true;
      return true;
    } 
    this.dtsProyectosCorrespondecia = this.dtsProyectosCorrespondecia.map(p=>{
      p.estado = valor;
      p.marcado = true;
      return p;
    });
  }

  cambairGestion(){
    this.laGestion = moment(this.correspondencia.fecha_registro).year().toString();
  }

  reportesCitesAuditoria(tipoReporte:string,id:number){
    this.cargando = true;
    const miDTS = { tipoReporte,id};
    let nombreReporte = `CITES_Auditoria_${moment().format('YYYYMMDD')}.xlsx`;
    if(tipoReporte=='02') nombreReporte = `CITES_Aud_Alertas_${moment().format('YYYYMMDD')}.xlsx`;
    if(tipoReporte=='03') nombreReporte = `Historico_Proyecto(${this.proyect.id_sgp})_${moment().format('YYYYMMDD')}.xlsx`;

    this._auditoria.reportesAuditoria(miDTS).subscribe(
      (result: any) => {
        console.log(result);
        const url = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", nombreReporte);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        this.cargando = false;
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor");
        this.cargando = false;
      }
    );
  }

}
