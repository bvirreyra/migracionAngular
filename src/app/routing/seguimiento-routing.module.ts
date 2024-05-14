import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BoletaItemComponent } from "../modulos/seguimiento/boleta-item/boleta-item.component";
import { InicioSeguimientoComponent } from "../modulos/seguimiento/inicio-seguimiento/inicio-seguimiento.component";
import { SeguimientoExternoComponent } from "../modulos/seguimiento/seguimiento-externo/seguimiento-externo.component";
import { UbicaciongeoComponent } from "../modulos/seguimiento/ubicaciongeo/ubicaciongeo.component";
import { SubmenuModulosComponent } from "../modulos/seguridad/submenu-modulos/submenu-modulos.component";

const appRoutes: Routes = [
  /* Rutas modulo almacenes*/
  {
    path: "seguimiento/:idcon/:idmod",
    component: SubmenuModulosComponent,
    children: [
      {
        path: "",
        redirectTo: "6_monitoreoseguimientoexterno",
        pathMatch: "full",
      },
      { path: "6_proyecto", component: InicioSeguimientoComponent },
      { path: "6_boletaitem", component: BoletaItemComponent },
      { path: "6_ubicaciongeo", component: UbicaciongeoComponent },
      {
        path: "6_monitoreoseguimientoexterno",
        component: SeguimientoExternoComponent,
      },
    ],
  },
];
//utilizando el decorador NgModule

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class SeguimientoRoutingModule {}
