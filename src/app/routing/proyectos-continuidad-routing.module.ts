import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SubmenuModulosComponent } from "../modulos/seguridad/submenu-modulos/submenu-modulos.component";
import { BandejaContinuidadComponent } from "../modulos/sgp/continuidad/bandeja-continuidad/bandeja-continuidad.component";
import { DesgloseComponent } from "../modulos/sgp/continuidad/desglose/desglose.component";

const appRoutes: Routes = [
  {
    path: "14_proyectoscontinuidad/:idcon/:idmod",
    component: SubmenuModulosComponent,
    children: [
      { path: "", redirectTo: "14_proyectoscontinuidad", pathMatch: "full" },
      //{ path: '', redirectTo: '10_bandejatecnica', pathMatch: 'full' },
      {
        path: "14_proyectoscontinuidad",
        component: BandejaContinuidadComponent,
      },
      { path: "14_compromisos", component: BandejaContinuidadComponent },
      //{ path: '14_compromisos', component: ProyectoCompromisoComponent },
      { path: "14_desglose", component: DesgloseComponent },
    ],
  },
];
//utilizando el decorador NgModule

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class ProyectosContinuidadModule {}
