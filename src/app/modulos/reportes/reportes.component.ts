import { Component, OnInit } from "@angular/core";
/*servicios*/
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { Globals } from "../../global";
import { AutenticacionService } from "../seguridad/autenticacion.service";
import { MensajesComponent } from "../seguridad/mensajes/mensajes.component";
import { SgpService } from "../sgp/sgp.service";
@Component({
  selector: "app-reportes",
  templateUrl: "./reportes.component.html",
  styleUrls: ["./reportes.component.css"],
  providers: [
    MensajesComponent,
    SgpService,
    FuncionesComponent,
    AutenticacionService,
  ],
})
export class ReportesComponent implements OnInit {
  public url: string;
  public urlApi: string;
  public url_reporte: string;
  public errorMessage: string;
  public fechasrv: string;
  public cargando: boolean = false;
  //variables para el compononete de mensajes
  public prop_msg: string;
  public prop_tipomsg: string;

  public dts_listareportes: any;
  public dtsFechaSrv: any;

  constructor(
    private _seguimiento: SgpService,
    private _autenticacion: AutenticacionService,
    private globals: Globals,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent
  ) {
    this.url = globals.rutaSrvFronEnd;
    this.url_reporte = globals.rutaSrvReportes;
  }

  ngOnInit() {
    this.litaReportes();
    this.FechaServidor().then((dts) => {
      this.dtsFechaSrv = dts[0]["fechasrv"];
    });
  }
  FechaServidor() {
    return new Promise((resolve, reject) => {
      this._autenticacion.getfechaservidor().subscribe(
        (result: any) => {
          
          if (result[0]["fechasrv"] != "") {
            resolve(result);
            return result;
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos ";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  litaReportes() {
    this._seguimiento.listaReportesGenerales().subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_listareportes = this._fun.RemplazaNullArray(result);
          console.log(this.dts_listareportes);
        } else {
          this.prop_msg = "Alerta: No existen reportes disponibles";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la petición listarTecnicos");
        }
      }
    );
  }
  generarReporte(dts) {
    this.cargando = true;
    let nombreReporte: string = `${dts.codigo}_${this.dtsFechaSrv}.${dts.extension}`;
    console.log("datos del reporte", dts);
    this._seguimiento.generarReportesGenerales(dts).subscribe(
      (result: any) => {
        // 
        console.log(result);
        // const file = new Blob([result.blob()], { type: "application/vnd.ms.excel" });
        //const file = new Blob([result])
        const fileURL = window.URL.createObjectURL(new Blob([result]));
        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", nombreReporte);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(fileURL);
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
        this.cargando = false;
      }
    );
  }
}
