import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {
  pdfSrc: string = '/pdf-test.pdf';
  page: number = 1;

  constructor() {
    
   }

  ngOnInit() {
 
  }

}

