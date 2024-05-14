import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SubmenuModulosComponent } from "../modulos/seguridad/submenu-modulos/submenu-modulos.component";
import { CitesComponent } from "../modulos/sispre/cites/cites.component";
import { ConsultaCitesComponent } from "../modulos/sispre/consulta-cites/consulta-cites.component";

const appRoutes: Routes = [
  {
    path: "sispre/:idcon/:idmod",
    component: SubmenuModulosComponent,
    children: [
      { path: "", redirectTo: "3_cite", pathMatch: "full" },
      { path: "3_cite", component: CitesComponent },
      { path: "3_consultacite", component: ConsultaCitesComponent },
    ],
  },
];
//utilizando el decorador NgModule

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class SispreRoutingModule {}
