import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SubmenuModulosComponent } from "../modulos/seguridad/submenu-modulos/submenu-modulos.component";

import { AdmGestionComponent } from "../modulos/sipta/adm-gestion/adm-gestion.component";
import { CorrespondenciaEnviadaComponent } from "../modulos/sipta/correspondencia-enviada/correspondencia-enviada.component";
import { DocumentoComponent } from "../modulos/sipta/documento/documento.component";
import { FormCorrespondenciaExternaComponent } from "../modulos/sipta/form-correspondencia-externa/form-correspondencia-externa.component";
import { FormCorrespondenciaInternaComponent } from "../modulos/sipta/form-correspondencia-interna/form-correspondencia-interna.component";
import { HojaderutaComponent } from "../modulos/sipta/hojaderuta/hojaderuta.component";
import { InstitucionComponent } from "../modulos/sipta/institucion/institucion.component";
import { InstitucioncargoComponent } from "../modulos/sipta/institucioncargo/institucioncargo.component";
import { ProveidoComponent } from "../modulos/sipta/proveido/proveido.component";
import { unidadorganizacionalComponent } from "../modulos/sipta/unidadorganizacional/unidadorganizacional.component";

const appRoutes: Routes = [
  /* Rutas modulo almacenes*/
  {
    path: "sipta/:idcon/:idmod",
    component: SubmenuModulosComponent,
    children: [
      { path: "", redirectTo: "3_proveido", pathMatch: "full" },
      //{ path: '', redirectTo: '3_proveido', pathMatch: 'full' },
      { path: "3_hojaderuta", component: HojaderutaComponent },
      { path: "3_institucion", component: InstitucionComponent },
      { path: "3_institucioncargo", component: InstitucioncargoComponent },
      {
        path: "3_formcorrespondenciaexterna",
        component: FormCorrespondenciaExternaComponent,
      },
      {
        path: "3_formcorrespondenciainterna",
        component: FormCorrespondenciaInternaComponent,
      },
      { path: "3_proveido", component: ProveidoComponent },
      { path: "3_usuarios", component: unidadorganizacionalComponent },
      {
        path: "3_correspondenciaenviada",
        component: CorrespondenciaEnviadaComponent,
      },
      { path: "3_ADMgestion", component: AdmGestionComponent },
      { path: "3_documento", component: DocumentoComponent },
    ],
  },
];

//utilizando el decorador NgModule

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class SiptaRoutingModule {}
