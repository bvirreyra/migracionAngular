import { Component, ViewChild,OnInit,Input, Output, EventEmitter,OnChanges } from '@angular/core';
import { LOCALE_ID,NgModule} from '@angular/core';
import localeEs from '@angular/common/locales/es'
import { registerLocaleData } from '@angular/common';
declare var jQuery: any;
declare var $: any;
registerLocaleData(localeEs,'es');

import * as moment from 'moment'


@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css'],
  providers:[{provide:LOCALE_ID,useValue:'es'}],
  
})
export class CalendarioComponent implements OnInit ,OnChanges{

  

  public gestion:number;
  public gestion_min:number;
  public gestion_max:number;
  public mes:number;
  public dia:number;
  
  public dts_gestiones:number[]=[];
  public pnlCalendario=false;

  @Input('fecha') i_fecha: string;
  @Input('min') i_min: string;
  @Input('max') i_max: string;
  @Output() enviaHijo = new EventEmitter<string>();
  week: any = [
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
    "Domingo"
  ];


  monthSelect: any[];
  dateSelect: any;
  dateValue: any;

  constructor() { }

  ngOnInit(){   
  }
  ngOnChanges(){
    console.log('FechaA',this.i_fecha);
    console.log('FechaMin',this.i_min);
    console.log('FechaMax',this.i_max);

    if (this.i_fecha !=""){
      this.gestion=moment(this.i_fecha).year();
      this.mes= moment(this.i_fecha).month()+1;
      this.dia= parseInt(moment(this.i_fecha).format('D'));
      console.log('DIA2===>',this.i_fecha,this.dia);
      
      this.getDaysFromDate(this.mes, this.gestion);
    }
    else{
      this.gestion= moment().year();      
      this.mes = moment().month()+1;
      this.dia=moment().day();
      console.log('DIA3===>',this.dia);
      this.getDaysFromDate(this.mes, this.gestion);
    }

    this.gestion_min=moment(this.i_min).year();
    this.gestion_max=moment(this.i_max).year();
    console.log("rango fechas",this.gestion_min,this.gestion_max)

    for (let i = this.gestion_min; i <= this.gestion_max; i++){   
      this.dts_gestiones.push(i); 
    }
  }

  getDaysFromDate(month, year) {

    //const startDate = moment.utc(`${year}/${month}/01`)
    const startDate = moment(`${year}/${month}/01`);
    const endDate = startDate.clone().endOf('month')
    this.dateSelect = startDate;
    console.log('fecha_actual',this.dateSelect);

    const diffDays = endDate.diff(startDate, 'days', true)
    const numberDays = Math.round(diffDays);

    // const arrayDays = Object.keys([...Array(numberDays)]).map((a: any) => {
    const arrayDays = Object.keys(Array(numberDays)).map((a: any) => {
      a = parseInt(a) + 1;
      const dayObject = moment(`${year}-${month}-${a}`);
      return {
        name: dayObject.format("dddd"),
        value: a,
        indexWeek: dayObject.isoWeekday()
      };
    });

    this.monthSelect = arrayDays;
  }

  changeMonth(flag) {
    if (flag < 0) {
      const prevDate = this.dateSelect.clone().subtract(1, "month");
      this.getDaysFromDate(prevDate.format("MM"), prevDate.format("YYYY"));
    } else {
      const nextDate = this.dateSelect.clone().add(1, "month");
      this.getDaysFromDate(nextDate.format("MM"), nextDate.format("YYYY"));
    }
  }
  changeYear(){
    this.getDaysFromDate(this.mes,this.gestion);
  }

  clickDay(day) {
    console.log("ENTRA AQUI=======>");
    const monthYear = this.dateSelect.format('YYYY-MM')
    const parse = `${monthYear}-${day.value}`
    const objectDate = moment(parse)
    this.dateValue = objectDate;
    setTimeout(() => {
      this.enviaHijo.emit(parse);
      console.log('FechaSeleccionada',parse,this.enviaHijo);
    }, 100);
    this.pnlCalendario=false;
    


  }
  btnCalendario(){
    this.pnlCalendario=!this.pnlCalendario;    
  }
  sendMessage() {
    //this.messageEvent.emit(this.message)    
  }


}
