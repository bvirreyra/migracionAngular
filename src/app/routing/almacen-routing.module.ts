import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SubmenuModulosComponent } from "../modulos/seguridad/submenu-modulos/submenu-modulos.component";

import { BandejaAlmacenComponent } from "../modulos/almacenes/bandeja-almacen/bandeja-almacen.component";
import { EntradassalidasComponent } from "../modulos/almacenes/entradassalidas/entradassalidas.component";
import { InventariofisicovaloradoComponent } from "../modulos/almacenes/inventariofisicovalorado/inventariofisicovalorado.component";

const appRoutes: Routes = [
  /* Rutas modulo almacenes*/
  {
    path: "almacenes/:idcon/:idmod",
    component: SubmenuModulosComponent,
    //path: 'almacenes/:idcon/:idmod', component: ContenedorEmpresaComponent,
    children: [
      { path: "", redirectTo: "2_bandejaalmacen", pathMatch: "full" },
      {
        path: "2_inventariofisicovalorado",
        component: InventariofisicovaloradoComponent,
      },
      { path: "2_entradassalidas", component: EntradassalidasComponent },
      { path: "2_bandejaalmacen", component: BandejaAlmacenComponent },
    ],
  },
];
//utilizando el decorador NgModule

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AlmacenesRoutingModule {}
