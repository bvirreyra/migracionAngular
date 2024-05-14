import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";

@Component({
  selector: "app-menu-empresa",
  templateUrl: "./menu-empresa.component.html",
  styleUrls: ["./menu-empresa.component.css"],
})
export class MenuEmpresaComponent implements OnInit {
  constructor(
    private _route: ActivatedRoute,
    private _fun: FuncionesComponent
  ) {}

  ngOnInit() {
    let a = this._route.snapshot.params;
    // console.log(this._route.snapshot.params);
    // console.log("nit", this._fun.base64Decode(a.nit));
    // console.log("usu nit", this._fun.base64Decode(a.usu));
    // console.log("pass nit", this._fun.base64Decode(a.pass));
  }
}
