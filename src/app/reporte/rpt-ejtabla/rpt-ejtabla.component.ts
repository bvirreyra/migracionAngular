import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Input, Output } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChartsModule, Color } from 'ng2-charts';


//declare var jsPDF: any; // Important
declare var CanvasJS: any;
declare var jsPDF: any; // Important
declare var Chart: any; // Important
declare var jQuery: any;
declare var $: any;
declare var match: any;
declare var test: any;
declare var html2canvas: any;

@Component({
  selector: 'app-rpt-ejtabla',
  templateUrl: './rpt-ejtabla.component.html',
  styleUrls: ['./rpt-ejtabla.component.css']
})
export class RptEjtablaComponent implements OnInit {

  public v_imagen0: any;
  public img2: any;

  constructor() { }

  ngOnInit() {
    this.generaImagen();
  }
  rpt_listacaCanvas() {

    /*************************************************************** */
    /*seccion optencion imagenes canvas*/
    var imagen = new Image();
    var imgdental: string;
    var cvs = document.getElementById("printDiv") as HTMLCanvasElement;
    imagen.src = cvs.toDataURL();
    //ctx.drawImage(imagen, 0, 0);    

    imagen.onload = function () {
      //ctx.drawImage(imagen, 0, 0);
      //var imgTag = document.getElementById('myImg') as HTMLCanvasElement;
      var dataURL = cvs.toDataURL();

      imgdental = dataURL;
      return imgdental;
    }
    this.v_imagen0 = imagen.src;
    return this.v_imagen0;


  }
  generaImagen() {

    var canvas = document.getElementById("canvasid") as HTMLCanvasElement;;

    var ctx = canvas.getContext("2d");

    ctx.fillStyle = "rgb(200,0,0)";

    ctx.fillRect(20, 20, 150, 100);

    ctx.fillStyle = "rgba(0, 0, 200, 0.5)";

    ctx.fillRect(30, 30, 55, 350);


  }
  convierteImagen() {

    /*************************************************************** */
    /*seccion optencion imagenes canvas*/
    var imagen = new Image();
    var imgdental: string;
    var cvs = document.getElementById('canvasid') as HTMLCanvasElement;
    imagen.src = cvs.toDataURL();
    //ctx.drawImage(imagen, 0, 0);    

    // imagen.onload = function () {
    //   //ctx.drawImage(imagen, 0, 0);
    //   //var imgTag = document.getElementById('myImg') as HTMLCanvasElement;
    //   var dataURL = cvs.toDataURL();

    //   imgdental = dataURL;
    //   return imgdental;
    // }
    this.v_imagen0 = imagen.src;
    return this.v_imagen0;
  }
  convierteImagen2() {
    var img = document.getElementById("output") as HTMLCanvasElement;
    //console.log(img);
    return img;
  }

  download() {

   
    var img3
    
    var imagen = this.convierteImagen();

    html2canvas($("#contenido"), {
      onrendered: function (canvas) {
        //document.body.appendChild(canvas); //para visualizar en la pagina
        var img = canvas.toDataURL();
        
        var doc = new jsPDF();
        doc.text(128, 15, 'IMAGEN PRUEBA');
        doc.addImage(imagen, 'png', 60, 60, 100, 80);
        doc.addImage(img, 'png', 10, 10, 189, 23);
        doc.save('testCanvas.pdf');
      }
    }
    );


    
    

  }

  downloadcontenido() {


    html2canvas($("#contenido"), {
      onrendered: function (canvas) {
        document.body.appendChild(canvas); //para visualizar en la pagina
        var img = canvas.toDataURL();
        document.getElementById("output").innerHTML = img;
      }
    }
    );
  }
  

}
