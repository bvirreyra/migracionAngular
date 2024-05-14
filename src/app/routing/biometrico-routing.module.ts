import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AsistenciaComponent } from "../modulos/rrhh/asistencia/asistencia.component";
import { AsistenciaSinDepurarComponent } from "../modulos/rrhh/asistencia_depurar/asistenciasindepurar.component";
import { DatosCompletarComponent } from "../modulos/rrhh/datoscompletar/datoscompletar.component";
import { FeriadosComponent } from "../modulos/rrhh/feriados/feriados.component";
import { GrupofuncionarioComponent } from "../modulos/rrhh/grupofuncionario/grupofuncionario.component";
import { HorarioComponent } from "../modulos/rrhh/horario/horario.component";
import { PermisoComponent } from "../modulos/rrhh/permiso/permiso.component";
import { SubmenuModulosComponent } from "../modulos/seguridad/submenu-modulos/submenu-modulos.component";

const appRoutes: Routes = [
  {
    path: "11_asistencia/:idcon/:idmod",
    component: SubmenuModulosComponent,
    children: [
      { path: "", redirectTo: "11_asistencia", pathMatch: "full" },
      { path: "11_asistencia", component: AsistenciaComponent },
      {
        path: "11_asistencia_sin_depurar",
        component: AsistenciaSinDepurarComponent,
      },
      {
        path: "11_grupo_funcionario",
        component: DatosCompletarComponent,
      },
      {
        path: "11_horario",
        component: HorarioComponent,
      },
      {
        path: "11_permiso",
        component: PermisoComponent,
      },
      {
        path: "11_feriado",
        component: FeriadosComponent,
      },
      {
        path: "11_grupo",
        component: GrupofuncionarioComponent,
      },
      { path: "**", redirectTo: "11_asistencia" },
    ],
  },
];
//utilizando el decorador NgModule

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class BiometricoRoutingModule {}
