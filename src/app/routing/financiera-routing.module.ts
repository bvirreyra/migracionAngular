import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SubmenuModulosComponent } from "../modulos/seguridad/submenu-modulos/submenu-modulos.component";

import { AsignacionpresupuestoComponent } from "../modulos/financiera/asignacionpresupuesto/asignacionpresupuesto.component";
import { InicioFinancieraComponent } from "../modulos/financiera/inicio-financiera/inicio-financiera.component";
import { DonacionesComponent } from "../modulos/financiera/proyectos-venezuela/donaciones/donaciones.component";
import { SeguimientofisicofinancieroComponent } from "../modulos/financiera/seguimientofisicofinanciero/seguimientofisicofinanciero.component";

const appRoutes: Routes = [
  /* Rutas modulo almacenes*/
  {
    path: "financiera/:idcon/:idmod",
    component: SubmenuModulosComponent,
    children: [
      { path: "", redirectTo: "4_inicio", pathMatch: "full" },
      { path: "4_inicio", component: InicioFinancieraComponent },
      { path: "4_financiera", component: SeguimientofisicofinancieroComponent },
      {
        path: "4_asignacionpresupuesto",
        component: AsignacionpresupuestoComponent,
      },
      { path: "4_donacionesvenezuela", component: DonacionesComponent },
    ],
  },
];
//utilizando el decorador NgModule

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class FinancieraRoutingModule {}
