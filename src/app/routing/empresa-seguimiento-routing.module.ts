import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EmpresaSeguimientoComponent } from "../modulos/empresa-seguimiento/empresa-seguimiento.component";
import { SubmenuModulosComponent } from "../modulos/seguridad/submenu-modulos/submenu-modulos.component";

const appRoutes: Routes = [
  {
    path: "consulta_empresa/:nit/:usu/:pass",
    component: SubmenuModulosComponent,
    children: [
      { path: "", redirectTo: "consulta_empresa", pathMatch: "full" },
      //{ path: '', redirectTo: '10_bandejatecnica', pathMatch: 'full' },
      { path: "consulta_empresa", component: EmpresaSeguimientoComponent },
    ],
  },
];
//utilizando el decorador NgModule

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class EmpresaSeguimientoRoutingModule {}
