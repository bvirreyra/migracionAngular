import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EmpresaAsociacionComponent } from "../modulos/empresa/empresa-asociacion/empresa-asociacion.component";
import { EmpresaDatosGeneralesComponent } from "../modulos/empresa/empresa-datos-generales/empresa-datos-generales.component";
import { EmpresaEquipoTrabajoComponent } from "../modulos/empresa/empresa-equipo-trabajo/empresa-equipo-trabajo.component";
import { EmpresaExperienciaComponent } from "../modulos/empresa/empresa-experiencia/empresa-experiencia.component";
import { EmpresaPersonalComponent } from "../modulos/empresa/empresa-personal/empresa-personal.component";
import { FormularioEmpresaComponent } from "../modulos/empresa/formulario-empresa/formulario-empresa.component";
import { CambiopasswordComponent } from "../modulos/seguridad/cambiopassword/cambiopassword.component";
import { ContenedorEmpresaComponent } from "../modulos/seguridad/contenedor-empresa/contenedor-empresa.component";

const appRoutes: Routes = [
  {
    //path: '16_empresa/:nit/:usu/:pass/:idcon', component: ContenedorEmpresaComponent,
    path: "16_empresa/:idcon/:idmod",
    component: ContenedorEmpresaComponent,
    children: [
      { path: "", redirectTo: "16_datosgenerales", pathMatch: "full" },
      { path: "16_datosgenerales", component: EmpresaDatosGeneralesComponent },
      { path: "16_experiencia", component: EmpresaExperienciaComponent },
      { path: "16_personal", component: EmpresaPersonalComponent },
      { path: "16_equipodetrabajo", component: EmpresaEquipoTrabajoComponent },
      { path: "16_asociacion", component: EmpresaAsociacionComponent },
      { path: "16_formulario", component: FormularioEmpresaComponent },
      {
        path: "cambiopassword/:idcon",
        component: CambiopasswordComponent,
        pathMatch: "full",
      },
    ],
  },
];
//utilizando el decorador NgModule

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class EmpresaGeneralRoutingModule {}
