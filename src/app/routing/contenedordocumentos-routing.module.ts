import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ContenedordocumentosComponent } from "../modulos/rrhh/contenedordocumentos/contenedordocumentos.component";
import { SubmenuModulosComponent } from "../modulos/seguridad/submenu-modulos/submenu-modulos.component";

const appRoutes: Routes = [
  {
    path: "13_contenedordocumentos/:idcon/:idmod",
    component: SubmenuModulosComponent,
    children: [
      { path: "", redirectTo: "13_listadocumentos", pathMatch: "full" },
      { path: "13_listadocumentos", component: ContenedordocumentosComponent },
    ],
  },
];
//utilizando el decorador NgModule

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class ContenedorDocumentosRoutingModule {}
