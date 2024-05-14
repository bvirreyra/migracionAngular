import { Component, OnInit } from '@angular/core';
import { SeguimientoProyectosService } from '../seguimiento-proyectos.service';
import { ToastrService } from 'ngx-toastr';
import { FuncionesComponent } from '@funciones/funciones/funciones.component';
import { SiptaService } from '../../sipta/sipta.service';
import alasql from 'alasql';
import { data } from 'jquery';
import * as moment from 'moment';

declare var $: any;
@Component({
  selector: 'app-bandeja-hrplanillas',
  templateUrl: './bandeja-hrplanillas.component.html',
  styleUrls: ['./bandeja-hrplanillas.component.css'],
  providers: [
    FuncionesComponent,
    SeguimientoProyectosService,
    SiptaService,
  ],
})
export class BandejaHrplanillasComponent implements OnInit {
  cargando: boolean = false;
  idUsuario: number = 0;

  dtsRelaciones:any[]=[];
  gestiones:number[]=[];
  gestionSel:number=new Date().getFullYear();
  tipoSel:string='EnProceso';
  dtsProyectos:any[]=[];
  dtsProyectosAll:any[]=[];
  pivot:any[]=[];
  elProyecto:any;
  mostrarChart:boolean=false;
  numCorrespondencia:number;
  departamentos:any[]=[];
  municipios:any[]=[];
  elDep:string='';
  mostrarGrid:boolean=true;

  dtsDiasProveidos: any[]=[];
  dtsMaxProveidos: any[]=[];

  constructor(
    private _seguimiento: SeguimientoProyectosService,
    private toastr: ToastrService,
    private _fun: FuncionesComponent,
    private _sipta:SiptaService
  ) {
    for (let i = this.gestionSel; i > this.gestionSel-4;i--){
      this.gestiones.push(i)
    }
  }

  ngOnInit() {
    setTimeout(async () => {
      const datos = await JSON.parse(localStorage.getItem("dts_con"));
      this.idUsuario = datos.s_usu_id;
    }, 1000);
    this.buscarPoryectosHR({ opcion: "T" });
    this.cargarDiasProveidos();
    this.cargarMaxProveidos();
    // for (let i = this.gestionSel; i > this.gestionSel-4;i--){
    //   this.gestiones.push(i)
    // }
  }

  cargarBandeja(opcion:any) {
    this.cargando = true;
    this._seguimiento.bandejaProyectoHR(opcion).subscribe(
      async (result: any) => {
        console.log("relaciones", result);
        if (result.length > 0) {
          this.pivot = result.map(r=>{
            r.tipo = r.tipo_documento.split('-')[1];
            return r
          });
          if(opcion.tipo == 'Terminado'){
            this.mostrarGrid = false;
            this.dtsRelaciones = this.pivot
            this.agregarTiempos();
            this.dtsProyectos = await alasql('select p.* from ? as p inner join ? as c on p.id_sgp = c.id_sgp',[this.dtsProyectosAll,this.pivot])
          }
          if(opcion.tipo == 'EnProceso'){
            this.dtsRelaciones = this.pivot;
            this.agregarTiempos();
            this.rearmarTabla();
          }
        } else {
          this.dtsRelaciones = [];
          this.toastr.warning("No se encontraron relaciones","Planillas HR",);
        }
        this.cargando = false;
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor");
        this.cargando = false;
      }
    );
  }

  cargarDiasProveidos(){
    this._seguimiento.proveidoDiasUnidad({}).subscribe(
      (result: any) => {
        console.log("proveidosDias", result);
        this.dtsDiasProveidos = result;
      },
      (error) => console.log(error)
    );
  }

  cargarMaxProveidos(){
    this._seguimiento.proveidoMax({}).subscribe(
      (result: any) => {
        console.log("proveidosMax", result);
        this.dtsMaxProveidos = result;
        this.cargarBandeja({gestion:this.gestionSel,tipo:this.tipoSel})
      },
      (error) => console.log(error)
    );
  }

  agregarTiempos(){
    this.dtsRelaciones.map(async r=>{
      let p = await this.dtsDiasProveidos.filter(f=>f.id_correspondencia == r.id_correspondencia)
      let m = await this.dtsMaxProveidos.filter(f=>f.id_correspondencia == r.id_correspondencia)[0]
      r.tiempo = p || [];
      r.tiempo_total = p.reduce((ac,el)=>ac+(Number(el.dias)-Number(el.puntos)),0);
      let dge = p.filter(f=>f.unidad=='DGE')[0];
      r.dge = dge ? dge.dias - dge.puntos:0;
      let utec = p.filter(f=>f.unidad=='UTEC')[0];
      r.utec = utec ? utec.dias - utec.puntos:0;
      let jur = p.filter(f=>f.unidad=='JUR')[0];
      r.jur = jur ? jur.dias - jur.puntos:0;
      let uaf = p.filter(f=>f.unidad=='UAF')[0];
      r.uaf = uaf ? uaf.dias - uaf.puntos:0;
      if(m){
        r.tiempo_act = m.dias_total;
        r.usuario = m.usu_user;
        r.unidad_act = m.unidad;
      }
      if(r.unidad_act == 'DGE') r.dge = Number(r.tiempo_act) - Number(r.tiempo_total) + Number(r.dge);
      if(r.unidad_act == 'UTEC') r.utec = Number(r.tiempo_act) - Number(r.tiempo_total) + Number(r.utec);
      if(r.unidad_act == 'JUR') r.jur = Number(r.tiempo_act) - Number(r.tiempo_total) + Number(r.jur);
      if(r.unidad_act == 'UAF') r.uaf = Number(r.tiempo_act) - Number(r.tiempo_total) + Number(r.uaf);
      return r;
    })
  }

  buscarPoryectosHR(opcion: any) {
    this._sipta.hrProyectos(opcion).subscribe(
      (result: any) => {
        console.log("proyectosHR", result);
        this.dtsProyectosAll = result.map((p) => {
          p.formateado = `${p.id_sgp}-${p.nombreproyecto}`;
          return p;
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async filtrarHRProyectos(proyecto: string) {
    console.log("el proy", proyecto);
    if (proyecto.split("-")[0]){
      this.elProyecto = await this.dtsProyectos.filter(
        (f) => f.id_sgp == proyecto.split("-")[0]
      )[0];
      if(this.elProyecto){
        this.mostrarGrid=true;
        this.dtsRelaciones = await this.pivot.filter((f)=>f.id_sgp == proyecto.split("-")[0]);
        // this.agregarTiempos();
        this.rearmarTabla();
        $('#proyecto').val('');
        this.elProyecto = null;
      }
    }
  }

  recargarBandeja(){
    $("#modalChart").modal("hide");
    this.cargarBandeja({gestion:this.gestionSel,tipo:this.tipoSel})
  }

  abrirChartProveido(data:any){
    console.log(data);
    $("#modalChart").modal("show");
    this.mostrarChart=true
    this.numCorrespondencia = data.numero
    // setTimeout(() => {
    //   const lugar = document.getElementById("verChart");
    //   if(lugar) lugar.scrollIntoView({ block: "start", behavior: "smooth" });
    // }, 300);
  }

  rearmarTabla(){
    this.mostrarGrid=true
    this.departamentos = alasql('select distinct v_departamento from ?',[this.dtsRelaciones]);
    this.municipios = alasql('select distinct v_municipio from ?',[this.dtsRelaciones]);
    this.departamentos.unshift({v_departamento:''});
    this.municipios.unshift({v_municipio:''});
    this._fun.limpiatabla(".dt-bandeja");
    setTimeout(() => {
      let confiTable = this._fun.CONFIGURACION_TABLA_V7(
        [10, 20, 50, 100],
        false,
        10,
        true,
        [1, "asc"],
        true,
        [{ visible: false, targets: 1 }]
      );
      if (!$.fn.dataTable.isDataTable(".dt-bandeja")) {
        console.log('la data',this.dtsRelaciones);
        var table = $(".dt-bandeja").DataTable(confiTable);
        this._fun.inputTable(table, [1,4, 5, 6,7,9]);
        this._fun.selectTable(table, [8]);
      }
    }, 100);
  }

  async filtrarDinamico(campo:string,valor:string){
    this.mostrarGrid = false;

    if(campo == 'v_departamento') this.elDep = valor;

    this.dtsRelaciones = await alasql(`select * from ? where ${campo} like'%${valor}%' and v_departamento like '%${this.elDep}%'`,[this.pivot])
    
    setTimeout(() => {
      this.rearmarTabla();
    }, 100); 
    
    setTimeout(() => {
      $('#'+campo).val(valor);
      if(this.elDep) $('#v_departamento').val(this.elDep);
    }, 400);
  }

  reporteDTS(data: any) {
    console.log("generando reporte DTS");
    const tipo = this.tipoSel == 'Terminado' ? '04' : '03';
    this.cargando = true;
    const miDTS = { tipoReporte: tipo, data };
    let nombreReporte = "";
    if (tipo == "03") nombreReporte = "BandejaHRPlanillas.xlsx";
    if (tipo == "04") nombreReporte = "BandejaHRTerminadas.xlsx";

    this._seguimiento.reportesDTS(miDTS).subscribe(
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
