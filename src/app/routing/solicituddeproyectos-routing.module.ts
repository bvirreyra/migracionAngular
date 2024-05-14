import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SubmenuModulosComponent } from "../modulos/seguridad/submenu-modulos/submenu-modulos.component";
import { ProyectoCompromisoComponent } from "../modulos/sgp/continuidad/proyecto-compromiso/proyecto-compromiso.component";

const appRoutes: Routes = [
  {
    path: "15_solicitudproyectos/:idcon/:idmod",
    component: SubmenuModulosComponent,
    children: [
      {
        path: "",
        redirectTo: "15_monitoreosolicituddeproyectos",
        pathMatch: "full",
      },
      {
        path: "15_monitoreosolicituddeproyectos",
        component: ProyectoCompromisoComponent,
      },
    ],
  },
];
//utilizando el decorador NgModule

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class SolicitudProyectosRoutingModule {}
