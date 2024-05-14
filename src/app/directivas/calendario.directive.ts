import { Directive, HostListener, Input, AfterViewInit, AfterViewChecked } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms'
import { weekdays, weekdaysShort } from 'moment';

import * as moment from 'moment';
import 'moment/locale/es';

declare var Pikaday: any;
let now = moment().format('LLLL');

@Directive({
  selector: '[appCalendario]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: CalendarioDirective,
    multi: true
  }]
})
export class CalendarioDirective implements AfterViewInit, AfterViewChecked, ControlValueAccessor {
  //export class CalendarioDirective implements AfterViewInit{
  //, AfterViewChecked, ControlValueAccessor {




  @Input('appCalendario') pikaday: string;
  @Input('formato') formato: string = 'DD-MM-YYYY';
  @Input('mascara') mascara: string = '99-99-9999';


  onTouched: any;
  onChange: any;
  picker: any;
  field: any;
  value: any;
  initValue: boolean = false;

  writeValue(value: any): void {
    this.value = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngAfterViewInit() {
   
    
    moment.locale('es');
    this.field = document.getElementById(this.pikaday);
    this.picker = new Pikaday({
      field: this.field,
      onSelect: (date: any) => {
        
        this.field.value = moment(date).format(this.formato);                
        this.onChange(this.field.value);
        
      },
      i18n: {
        previousMonth: 'Anterior',
        nextMonth: 'Proximo',
        months: [
          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ],
        weekdays: [
          'Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'
        ],
        weekdaysShort: [
          'Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'
        ]

      }
      ,
      minDate: new Date(1930, 1, 1),
      maxDate: new Date(2050, 12, 31)

    });
  }
  ngAfterViewChecked() {
    if (this.value !== undefined && !this.initValue) {
      this.picker.setDate(
        moment(this.value, this.formato).toDate()
      );
      this.initValue = true;

    }
  }
  @HostListener('keyup', ['$event'])
  onKeyup($event: any) {
    let valor = $event.target.value.replace(/\D/g, '');

    let pad = this.mascara.replace(/\D/g, '').replace(/9/g, '_');

    let valorMask = valor + pad.substring(0, pad.length - valor.length);
    //console.log(valorMask);

    // retorna caso pressionado backspace
    if ($event.keyCode === 8) {
      this.onChange(valor);
      return;
    }

    let valorMaskPos = 0;
    valor = '';
    for (let i = 0; i < this.mascara.length; i++) {
      if (isNaN(parseInt(this.mascara.charAt(i), 10))) {

        valor += this.mascara.charAt(i);

      } else {
        valor += valorMask[valorMaskPos++];

      }
    }

    if (valor.indexOf('_') > -1) {
      valor = valor.substr(0, valor.indexOf('_'));
    }

    $event.target.value = valor;
    this.onChange(valor);
  }

  //@HostListener('blur', ['$event'])
  onBlur($event: any) {
    let valor = $event.target.value.length;
    if (valor === 10) {
      return;
    }
    this.onChange('');
    $event.target.value = '';
  }
}
