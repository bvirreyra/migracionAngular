import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MapeogeneralComponent } from "../modulos/geo-funcionarios/mapeogeneral/mapeogeneral.component";
import { UbicacionpersonalComponent } from "../modulos/geo-funcionarios/ubicacionpersonal/ubicacionpersonal.component";
import { SubmenuModulosComponent } from "../modulos/seguridad/submenu-modulos/submenu-modulos.component";

const appRoutes: Routes = [
  {
    path: "geofuncionarios/:idcon/:idmod",
    component: SubmenuModulosComponent,
    children: [
      { path: "", redirectTo: "8_registroubicacion", pathMatch: "full" },
      { path: "8_registroubicacion", component: UbicacionpersonalComponent },
      { path: "8_mapeofuncionarios", component: MapeogeneralComponent },
    ],
  },
];
//utilizando el decorador NgModule

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class GeoFuncionariosRoutingModule {}
