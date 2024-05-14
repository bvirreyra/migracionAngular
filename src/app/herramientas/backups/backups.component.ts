import { Component, OnInit } from '@angular/core';
import { HerraminetasService } from "../herraminetas.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { MensajesComponent } from "../../modulos/seguridad/mensajes/mensajes.component";
import swal2 from "sweetalert2";

declare var $: any;
@Component({
  selector: 'app-backups',
  templateUrl: './backups.component.html',
  styleUrls: ['./backups.component.css']
})
export class BackupsComponent implements OnInit {
  public cargando: boolean = false;
  public idUsuario: number = 0;
  public idRol: number = 0;
  dtsBackups: any[] = [];
  public formBackups: FormGroup;
  public errorMessage: any;

  public titulo: string;
  public insertar = false;

  dtsFuncionariosActivos: any[]=[];
  dtsFuncionarios: any[]=[];
  
  backupEditar: boolean = false;

   constructor(
    private _herramientas: HerraminetasService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private _fun: FuncionesComponent,
    private _msg: MensajesComponent,

  ) { }

  ngOnInit() {
    const datos = JSON.parse(localStorage.getItem("dts_con"));
    this.idUsuario = datos.s_usu_id;
    this.idRol = datos.s_idrol;
    this.formBackups = this.formBuilder.group({
      id_backup: [0],
      fid_usuariorespaldo: [0],
      funcionario:[""],
      nombre_backup: [""],
      observacion: [""],
      ruta: [""],
      usuario_registro:[""],
      usuario_modifica:[""],
      usr_registro: [0],
      usr_modifica: [0],
    });
    this.listarBackups({ opcion: "T" });
    this.obtenerFuncionarios();
  }

  listarBackups(opcion: any) {
    this.cargando = true;
    this._herramientas.listaBackups (opcion).subscribe(
      (result: any) => {
        console.log("backups", result);
        if (result.length > 0) {
          this.dtsBackups = result;
          this._fun.limpiatabla(".dt-backups");
          setTimeout(() => {
            let confiTable = this._fun.CONFIGURACION_TABLA_V6(
              [50, 100, 150, 200],
              false,
              10,
              [1, "asc"]
            );
            if (!$.fn.dataTable.isDataTable(".dt-backups")) {
              var table = $(".dt-backups").DataTable(confiTable);
              this._fun.inputTable(table, [2, 3, 4, 5, 6]);
            }
          }, 100);
        } else {
          this.toastr.warning(
            "No se encontraron registros de los backcups",
            "Listar Backups",
            {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            }
          );
        }
        this.cargando = false;
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor", {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        });
        this.cargando = false;
      }
    );
  }

  abrirFormBackup(config?) {
    console.log("modal", config);
    config ? (this.backupEditar = true) : (this.backupEditar = false);
    if (this.backupEditar) {
      this.formBackups.setValue({
        id_backup: config.id_backup,
        fid_usuariorespaldo: config.fid_usuariorespaldo,
        funcionario:config.funcionario,
        nombre_backup: config.nombre_backup,
        observacion: config.observacion,
        ruta: config.ruta,
        usuario_registro: config.usuario_registro,
        usuario_modifica:config.usuario_modifica,
        usr_registro: config.usr_registro,
        usr_modifica: config.usr_modifica,
      });
      console.log("MUESTRA USUARIO", config.usuario_registro)
    } else {
      this.formBackups.reset();
    }
    $("#modalBackup").modal("show");
    $(".modal").on("shown.bs.modal", function () {
      $(this).find("[autofocus]").focus();
    });
  }

  reporteGeneral() {
    this._herramientas.crearReporteGeneral().subscribe(
      (result: any) => {
        console.log('para buffer',result);
        const url = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `listadoBackups_${new Date().toLocaleDateString()}.xlsx`
        );
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        this.cargando = false;
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage,
            10
          );
      }
    );
  }

  generarReporte(id: number, nombre:string) {
    this._herramientas.crearReporteBackup(id).subscribe(
      (result: any) => {
        console.log('rev rep',result);
        const url = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `Backups_${nombre}.xlsx`
        );
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        this.cargando = false;
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null)
          this._msg.formateoMensaje(
            "modal_danger",
            "Error: " + this.errorMessage,
            10
          );
      }
    );
  }
  
  registrarBackup(id?: number) {
    this.cargando = true;
    const config = this.formBackups.getRawValue();
    this.backupEditar ? (config.operacion = "U") : (config.operacion = "I");
    if (id){
      config.operacion = "D";
      config.id_backup=id;
    } 
    config.usr_registro = this.idUsuario;
    if (!config.id_backup) config.id_backup = 0;
    const nombre=this.formBackups.controls['funcionario'].value;
    if(!id){
      config.fid_usuariorespaldo= this.dtsFuncionarios.filter(f=>f.funcionario==nombre)[0].usu_id
    }
    
    this._herramientas.crudBackups(config).subscribe(
      (result: any) => {
        if(config.operacion=='I' || config.operacion=='U'){
          if (!result[0].message.toUpperCase().startsWith("ERROR")) {
            if(config.operacion=='I'){
            this.toastr.success(
              "Backup registrado con Éxito!!!",
              "Registro Backup",
              {
                positionClass: "toast-top-right",
                timeOut: 5000,
                progressBar: true,
              }
            );
            } else{
              this.toastr.success(
                "Backup actualizado con Éxito!!!",
                "Actualización Backup",
                {
                  positionClass: "toast-top-right",
                  timeOut: 5000,
                  progressBar: true,
                }
              );
              this.formBackups.reset();
            }
            if(config.operacion=='I')this.generarReporte(result[0].message,result[0].msg_estado)
            this.listarBackups({ opcion: "T" });
          } else {
            this.toastr.error(
              "Error al registrar backup: " + result[0].message,
              "Registro Backup",
              {
                positionClass: "toast-top-right",
                timeOut: 5000,
                progressBar: true,
              }
            );
          }
        } else {
          console.log('quiere eliminar');
            swal2({
              title: "Advertencia!!!",
              text: `Realmente desea eliminar el Backup?`,
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#d9534f",
              cancelButtonColor: "#f0ad4e",
              customClass: "swal2-popup",
              confirmButtonText: "Confirmar!",
            }).then((resulte) => {
              if (resulte.value) {
                if (!result[0].message.toUpperCase().startsWith("ERROR")) {
                  this.toastr.success(
                    "Backup eliminado con Éxito!!!",
                    "Baja de Backup",
                    {
                      positionClass: "toast-top-right",
                      timeOut: 5000,
                      progressBar: true,
                    }
                  );
                  this.listarBackups({ opcion: "T" });
                } else {
                  this.toastr.error(
                    "Error al eliminar backup: " + result[0].message,
                    "Baja de Backup",
                    {
                      positionClass: "toast-top-right",
                      timeOut: 5000,
                      progressBar: true,
                    }
                  );
                }
              } else {
                console.log('cancelo');
              }
            });
        }
        this.backupEditar = false;
        $("#modalBackup").modal("hide");
        this.cargando = false;
      },
      (error) => {
        this.cargando = false;
        this.toastr.error(error.toString(), "Error desde el servidor", {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        });
      }
    );
  }

  obtenerFuncionarios(){
    const config={}
    this._herramientas.listarFuncionarios(config).subscribe(
      (result: any) => {
        console.log("Funcionarios", result);
        if (result.length>0) {  
          this.dtsFuncionarios=result;
          this.dtsFuncionariosActivos=result.filter(f=>f.id_estado==1);
        } 
      },
      (error) => {
       console.log('Error Usuarios',error)        
      }
    );
  }
}
