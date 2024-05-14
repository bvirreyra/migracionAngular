import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MonitoreoSeguimientoComponent } from "../modulos/monitoreo/monitoreo-seguimiento/monitoreo-seguimiento.component";
import { MonitoreoSolicitudesComponent } from "../modulos/monitoreo/monitoreo-solicitudes/monitoreo-solicitudes.component";
import { SubmenuModulosComponent } from "../modulos/seguridad/submenu-modulos/submenu-modulos.component";
import { BandejaCompromisoV2Component } from "../modulos/sgp/continuidad/proyecto-compromiso/monitoreo-compromiso-v2/bandeja-compromiso-v2.component";

const appRoutes: Routes = [
  {
    path: "17_monitoreo_solicitudes/:idcon/:idmod",
    component: SubmenuModulosComponent,
    children: [
      { path: "", redirectTo: "17_monitoreo_compromisos", pathMatch: "full" },
      {
        path: "17_monitoreo_compromisos",
        component: BandejaCompromisoV2Component,
      },
      {
        path: "17_monitoreo_solicitudes",
        component: MonitoreoSolicitudesComponent,
      },
      {
        path: "17_monitoreo_seguimiento",
        component: MonitoreoSeguimientoComponent,
      },
    ],
  },
];
//utilizando el decorador NgModule

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class MonitoreoRoutingModule {}
