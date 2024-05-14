import { Pipe, PipeTransform } from "@angular/core";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import * as moment from "moment";
@Pipe({
  name: "diferenciaenDiasEntrefechas",
})
export class DiferenciaenDiasEntrefechasPipe implements PipeTransform {
  constructor(private _fun: FuncionesComponent) {}
  transform(f1: Date, f1t: string, f2: Date, f2t: string): any {
    // let preEnd;
    // if (endingDate == undefined) {
    //   preEnd = moment();
    // }
    // endingDate = preEnd;
    //console.log("tipo_de_datos", f1t, f2t);
    if (f1t == "string") {
      f1 = new Date(this._fun.transformDate_yyyymmdd(f1));
    }
    if (f2t == "string") {
      f2 = new Date(this._fun.transformDate_yyyymmdd(f2));
    }
    let fecha1 = moment(f1);
    let fecha2 = moment(f2);
    let dayDiff = fecha2.diff(fecha1, "days");
    //console.log("datos pipe2", fecha1, fecha2, dayDiff);

    return dayDiff;
  }
}
