import { Component, Input, OnChanges, OnInit } from "@angular/core";

@Component({
  selector: "app-tacometro",
  templateUrl: "./tacometro.component.html",
  styleUrls: ["./tacometro.component.css"],
})
export class TacometroComponent implements OnInit, OnChanges {
  @Input() valor: number;
  @Input() titulo: string;
  title = "taco";
  valorTacometro: number = 0;
  tituloTacometro: string="";

  constructor() {}

  ngOnInit() {}
  ngOnChanges() { 
    if(isNaN(this.valor)) this.valor = 0;
    this.valor=this.valor>100? this.valor=100:this.valor<0? this.valor=0:this.valor;
    this.actualizarValor(this.valor, this.titulo)
  }
  calcularAngulo(): number {
    const minValor = 0;
    const maxValor = 100;
    const minAngulo = -90;
    const maxAngulo = 90;

    return (
      ((this.valorTacometro - minValor) * (maxAngulo - minAngulo)) /
        (maxValor - minValor) +
      minAngulo
    );
  }
  actualizarValor(nuevoValor: number, titulo: string): void {
    this.valorTacometro = nuevoValor;
    this.tituloTacometro=titulo;
  }
}
