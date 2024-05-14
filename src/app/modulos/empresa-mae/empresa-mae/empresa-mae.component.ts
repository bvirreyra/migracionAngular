import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";

@Component({
  selector: "app-empresa-mae",
  templateUrl: "./empresa-mae.component.html",
  styleUrls: ["./empresa-mae.component.css"],
})
export class EmpresaMaeComponent implements OnInit {
  public parametros: any;
  public s_id_usu: string;
  public s_usu: string;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _fun: FuncionesComponent
  ) {}
  ngOnInit() {
    this._route.parent.paramMap.subscribe((params) => {
      this.parametros = params;
      console.log(this.parametros);
    });
    if (this.parametros.params.hasOwnProperty("id_usu")) {
      console.log("SOY MAE");
      this.s_id_usu = this._fun.base64Decode(this.parametros.params.id_usu);
      this.s_usu = this._fun.base64Decode(this.parametros.params.usu);
    } else {
      this._router.navigate(["./login/"]);
    }
  }
}
