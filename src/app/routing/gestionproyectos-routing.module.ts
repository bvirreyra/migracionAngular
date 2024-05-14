import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
//import { SubmenuModulosComponent } from "../modulos/seguridad/submenu-modulos/submenu-modulos.component";
import { BandejagestionproyectosComponent } from "../modulos/gestionproyecto/bandejagestionproyectos/bandejagestionproyectos.component";
import { ContenedorEmpresaComponent } from "../modulos/seguridad/contenedor-empresa/contenedor-empresa.component";

const appRoutes: Routes = [
  /* Rutas modulo seguridad*/
  {
    //path: "18_bandeja_gestion/:idcon/:idmod",component: SubmenuModulosComponent,
    path: "18_bandeja_gestion/:idcon/:idmod",
    component: ContenedorEmpresaComponent,
    children: [
      { path: "", redirectTo: "18_bandeja_gestion", pathMatch: "full" },
      {
        path: "18_bandeja_gestion",
        component: BandejagestionproyectosComponent,
      },
    ],
  },
  { path: "18_bandeja_gestion", component: BandejagestionproyectosComponent },
];
//utilizando el decorador NgModule

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class GestionProyectosRoutingModule {}
