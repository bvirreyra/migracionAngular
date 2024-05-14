import { Component, OnInit } from "@angular/core";
import { AutenticacionService } from "../autenticacion.service";

@Component({
  selector: "app-pagina",
  templateUrl: "./pagina.component.html",
  styleUrls: ["./pagina.component.css"],
  providers: [AutenticacionService],
})
export class PaginaComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
