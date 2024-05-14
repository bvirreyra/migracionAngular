import { HerraminetasService } from "../../herramientas/herraminetas.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { HostListener} from "@angular/core";
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: "app-sheet",
  templateUrl: "./sheet.component.html",
  styleUrls: ["./sheet.component.css"],
})
export class SheetComponent implements OnInit {
  @ViewChild("tableContainer")
  @Input() id : number;
  tableContainer: ElementRef<HTMLDivElement>;

  activeSheet = 1;
  data: any[] = [];
  registro: any;
  idUsuario:number;
  formUsu: any;

  constructor(
    private _herramientasService: HerraminetasService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.idUsuario = JSON.parse(localStorage.getItem("dts_con")).s_usu_id;
    }, 1000);
       this.listarPresupuestaria({opcion:"id_inscripcion_presupuestaria"},{id:this.id}); 
  }

  switchSheet(sheetNum: number): void {
    this.activeSheet = sheetNum;
  }

  listarPresupuestaria(opcion: any, id:any){
    console.log("la opcion es: ",opcion , "id:",this.id);

    this._herramientasService.listarInscripciones(opcion,id).subscribe(
      (resultado: any) => {
        console.log("listarInscripciones:", resultado);
        this.registro = resultado[0];
        this.data = resultado;
      },
      (error) => {
        this.toastr.error(
          "Error al obtener los datos de inscripciones presupuestarias.",
          "Error",
          { timeOut: 3000 }
        );
        console.error("Error al obtener datos:", error);
      }
    );
  }
  onCellInput(event: any): void {
    const input = event.target as HTMLTableCellElement;
    const value = input.innerText.trim();
    const regex = /^[0-9.]*$/;
    if (!regex.test(value)) {
      input.innerText = value.replace(/[^0-9.]/g, "");
    }
  }
  @HostListener("window:keydown", ["$event"])
  handleKeyDown(event: KeyboardEvent): void {
    const key = event.key;
    const currentCell = document.activeElement as HTMLTableCellElement;
    const currentRowIndex = (currentCell.parentElement as HTMLTableRowElement)
      .rowIndex;
    const currentCellIndex = currentCell.cellIndex;

    let nextCell: HTMLTableCellElement | undefined;
    switch (key) {
      case "ArrowLeft":
        nextCell =
          currentCellIndex > 0
            ? (currentCell.parentElement as HTMLTableRowElement).cells[
                currentCellIndex - 1
              ]
            : currentCell;
              if (nextCell && nextCell !== currentCell && currentCellIndex > 0) {
              nextCell.focus();
              event.preventDefault();
              const seleccion = window.getSelection();
              const rango = document.createRange();
              rango.selectNodeContents(nextCell);
              seleccion.removeAllRanges();
              seleccion.addRange(rango);
              
            }
        break;
      case "ArrowUp":
      nextCell = currentRowIndex >1 ? (currentCell.parentElement.previousElementSibling as HTMLTableRowElement).cells[currentCellIndex] : currentCell;
      break;
      case "ArrowRight":
        nextCell =
          currentCellIndex <
          (currentCell.parentElement as HTMLTableRowElement).cells.length - 1
          ? (currentCell.parentElement as HTMLTableRowElement).cells[
                currentCellIndex + 1
              ]
            : currentCell;
            if (nextCell && nextCell !== currentCell && currentCellIndex< (currentCell.parentElement as HTMLTableRowElement).cells.length  -1) {
              nextCell.focus();
              event.preventDefault();
              const seleccion = window.getSelection();
              const rango = document.createRange();
              rango.selectNodeContents(nextCell);
              seleccion.removeAllRanges();
              seleccion.addRange(rango);
           
            }
        break;
      case "ArrowDown":
        nextCell =
          currentRowIndex <
            (currentCell.parentElement.parentElement as HTMLTableElement).rows
            .length && currentRowIndex > 0
            ? (
                currentCell.parentElement
                  .nextElementSibling as HTMLTableRowElement
              ).cells[currentCellIndex]
            : currentCell;
        if (currentRowIndex === 1 && currentCellIndex === 0) { 
          this.tableContainer.nativeElement.scrollTop -= 50;
        }
        break;
    }
    const firstRowCell = (currentCell.parentElement as HTMLTableRowElement).cells[currentCellIndex];

    if (nextCell && nextCell !== currentCell) {
      nextCell.focus();
      event.preventDefault();
    }
    // if (nextCell === firstRowCell && nextCell.parentElement.parentElement === this.tableContainer.nativeElement) {
    //   nextCell.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    // }
  }
    
  guardarDato() {
    var table = document.getElementById("tablaPrincipal") as HTMLTableElement;
    var row = table.rows[1];
    console.log("Fila seleccionada:", row);
    var rowData = [];

    for (var i = 0; i < row.cells.length; i++) {
      rowData.push(row.cells[i].innerText);
    }
      const dts = { operacion:'U'
      ,id_inscripcion_presupuestaria:this.registro.id_inscripcion_presupuestaria
      ,fid_proyecto:this.registro.fid_proyecto
      ,solicitud1:rowData[0]
      ,solicitud2:rowData[1]
      ,solicitud3:rowData[2]
      ,solicitud4:rowData[3]
      ,solicitud5:rowData[4]
      ,solicitud6:rowData[5]
      ,presupuesto_designado1:rowData[6]
      ,presupuesto_designado2:rowData[7]
      ,presupuesto_designado3:rowData[8]
      ,presupuesto_designado4:rowData[9]
      ,presupuesto_designado5:rowData[10]
      ,presupuesto_designado6:rowData[11]
      ,usr_registro:this.idUsuario}

      this._herramientasService.crudInscripcion(dts).subscribe(
        (resultado: any) => {
          if(resultado[0]){
            if (resultado[0].message.includes("Error")) {
              this.toastr.error(
                resultado[0].message,
                "Registro Inscriocion Presupuestaria"
              );
            }
            if (!resultado[0].message.includes("Error")) {
              this.toastr.success(
                resultado[0].message,
                "Registro Inscriocion Presupuestaria"
              );
            }
          }
          this.listarPresupuestaria({opcion:"id_inscripcion_presupuestaria"},{id:this.id});
        },
        (error) => {
          this.toastr.error(
            "Error al obtener los datos de inscripciones presupuestarias.",
            "Error"
          );
          console.error("Error al obtener datos:", error);
        }
      );
  }
}
