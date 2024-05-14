import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
//import { SubmenuModulosComponent } from "../modulos/seguridad/submenu-modulos/submenu-modulos.component";
import { BandejaHrplanillasComponent } from "../modulos/seguimiento-proyectos/bandeja-hrplanillas/bandeja-hrplanillas.component";
import { BandejaProgramacionfinancieraComponent } from "../modulos/seguimiento-proyectos/programacion-financiera/bandeja-programacionfinanciera/bandeja-programacionfinanciera.component";
import { ContenedorEmpresaComponent } from "../modulos/seguridad/contenedor-empresa/contenedor-empresa.component";

const appRoutes: Routes = [
  /* Rutas modulo seguridad*/
  {
    //path: "18_bandeja_gestion/:idcon/:idmod",component: SubmenuModulosComponent,
    path: "19_bandejaprogramacion/:idcon/:idmod",
    component: ContenedorEmpresaComponent,
    children: [
      { path: "", redirectTo: "19_bandejaprogramacion", pathMatch: "full" },
      {
        path: "19_bandejaprogramacion",
        component: BandejaProgramacionfinancieraComponent,
      },
      {
        path: "19_bandejahrplanillas",
        component: BandejaHrplanillasComponent,
      },
    ],
  },
  {
    path: "19_bandejaprogramacion",
    component: BandejaProgramacionfinancieraComponent,
  },
];
//utilizando el decorador NgModule

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class MonitoreoprogramacionRoutingModule {}
