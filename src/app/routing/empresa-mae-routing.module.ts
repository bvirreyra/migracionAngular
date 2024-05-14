import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EmpresaMaeComponent } from "../modulos/empresa-mae/empresa-mae/empresa-mae.component";
import { SubmenuModulosComponent } from "../modulos/seguridad/submenu-modulos/submenu-modulos.component";

const appRoutes: Routes = [
  {
    path: "consulta_empresa_mae/:id_usu/:usu",
    component: SubmenuModulosComponent,
    children: [
      { path: "", redirectTo: "consulta_empresa_mae", pathMatch: "full" },
      //{ path: '', redirectTo: '10_bandejatecnica', pathMatch: 'full' },
      { path: "consulta_empresa_mae", component: EmpresaMaeComponent },
    ],
  },
];
//utilizando el decorador NgModule

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class EmpresaSeguimientoMaeRoutingModule {}
