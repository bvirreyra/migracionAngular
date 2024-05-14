import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SubmenuModulosComponent } from "../modulos/seguridad/submenu-modulos/submenu-modulos.component";

import { FormulariocompromisoComponent } from "../modulos/compromisos/formulariocompromiso/formulariocompromiso.component";
import { InicioComponent } from "../modulos/compromisos/inicio/inicio.component";

const appRoutes: Routes = [
  /* Rutas modulo almacenes*/
  {
    path: "compromisos/:idcon/:idmod",
    component: SubmenuModulosComponent,
    children: [
      { path: "", redirectTo: "5_inicioCompromiso", pathMatch: "full" },
      { path: "5_inicioCompromiso", component: InicioComponent },
      //{ path: '5_inicioCompromiso', component: LeafletComponent },
      {
        path: "5_formulariocompromiso",
        component: FormulariocompromisoComponent,
      },
    ],
  },
];
//utilizando el decorador NgModule

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class CompromisosPresidencialesRoutingModule {}
