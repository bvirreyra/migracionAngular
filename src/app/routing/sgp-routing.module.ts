import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SubmenuModulosComponent } from "../modulos/seguridad/submenu-modulos/submenu-modulos.component";
import { CabeceraSgpNorelacionadosComponent } from "../modulos/sgp/consolidacion/cabecera-sgp-norelacionados/cabecera-sgp-norelacionados.component";
import { CabeceraSgpComponent } from "../modulos/sgp/consolidacion/cabecera-sgp/cabecera-sgp.component";
import { SgpAsignadoDobleComponent } from "../modulos/sgp/consolidacion/sgp-asignado-doble/sgp-asignado-doble.component";
import { SgpSinasignarComponent } from "../modulos/sgp/consolidacion/sgp-sinasignar/sgp-sinasignar.component";
import { BandejaFinancieroComponent } from "../modulos/sgp/financiero/bandeja-financiero/bandeja-financiero.component";
import { IngresarseguimientoComponent } from "../modulos/sgp/ingresarseguimiento/ingresarseguimiento.component";
import { BandejaLegalComponent } from "../modulos/sgp/legal/bandeja-legal/bandeja-legal.component";
import { NuevoproyectoComponent } from "../modulos/sgp/nuevoproyecto/nuevoproyecto.component";
import { ApliacionPlazoComponent } from "../modulos/sgp/tecnica/apliacion-plazo/apliacion-plazo.component";
import { BandejaTecnicaComponent } from "../modulos/sgp/tecnica/bandeja-tecnica/bandeja-tecnica.component";
import { SupervisionComponent } from "../modulos/sgp/tecnica/supervision/supervision.component";
/********************************************
 * SEGUIMIENTO DE PROYECTOS
 ***********************************************/
import { SeguimientoProyectosComponent } from "../modulos/seguimiento-proyectos/seguimiento-proyectos.component";

const appRoutes: Routes = [
  {
    path: "10_inicioseguimiento/:idcon/:idmod",
    component: SubmenuModulosComponent,
    children: [
      { path: "", redirectTo: "10_nuevoproyecto", pathMatch: "full" },
      //{ path: '', redirectTo: '10_bandejatecnica', pathMatch: 'full' },
      { path: "10_nuevoproyecto", component: NuevoproyectoComponent },
      {
        path: "10_ingresarseguimiento",
        component: IngresarseguimientoComponent,
      },
      { path: "10_supervision", component: SupervisionComponent },
      { path: "10_ampliacionplazo", component: ApliacionPlazoComponent },
      { path: "10_bandejatecnica", component: BandejaTecnicaComponent },
      { path: "10_bandejafinanciero", component: BandejaFinancieroComponent },
      { path: "10_bandejalegal", component: BandejaLegalComponent },
      { path: "10_validacionproyasignados", component: CabeceraSgpComponent },
      {
        path: "10_proyectossinrelacionsgp",
        component: CabeceraSgpNorelacionadosComponent,
      },
      { path: "10_proyectossgpsinasignar", component: SgpSinasignarComponent },
      {
        path: "10_proyectossgpasignadodoble",
        component: SgpAsignadoDobleComponent,
      },
      {
        path: "10_seguimientoproyectos",
        component: SeguimientoProyectosComponent,
      },
    ],
  },
];
//utilizando el decorador NgModule

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class SgpRoutingModule {}
