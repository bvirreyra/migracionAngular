import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BandejaArchivocentralComponent } from "../modulos/archivo_central/bandeja-archivocentral/bandeja-archivocentral.component";
import { BandejaRegistroComponent } from "../modulos/archivo_central/bandeja-registro/bandeja-registro.component";
import { DetalleArchivoComponent } from "../modulos/archivo_central/detalle-archivo/detalle-archivo.component";
import { FormularioModificacionComponent } from "../modulos/archivo_central/formulario-modificacion/formulario-modificacion.component";
import { SubmenuModulosComponent } from "../modulos/seguridad/submenu-modulos/submenu-modulos.component";

const appRoutes: Routes = [
  {
    path: "12_archivocentral/:idcon/:idmod",
    component: SubmenuModulosComponent,
    children: [
      { path: "", redirectTo: "12_bandejaarchivocentral", pathMatch: "full" },
      //{ path: '', redirectTo: '10_bandejatecnica', pathMatch: 'full' },
      {
        path: "12_bandejaarchivocentral",
        component: BandejaArchivocentralComponent,
      },
      { path: "12_bandejaregistro", component: BandejaRegistroComponent },
      {
        path: "12_detallecabeceraarchivo",
        component: DetalleArchivoComponent,
      },
      {
        path: "12_formulariomodificacion",
        component: FormularioModificacionComponent,
      },
    ],
  },
];
//utilizando el decorador NgModule

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class ArchivoCentralRoutingModule {}
