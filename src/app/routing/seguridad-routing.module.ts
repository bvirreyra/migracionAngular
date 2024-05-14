import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

//import { UsuarioComponent } from '../modulos/seguridad/usuario/usuario.component';
//import { RolComponent } from '../modulos/seguridad/rol/rol.component';
//import { ModuloComponent } from '../modulos/seguridad/modulo/modulo.component';
import { AdmmenuComponent } from "../modulos/seguridad/admmenu/admmenu.component";
import { MenurolComponent } from "../modulos/seguridad/menurol/menurol.component";
import { PermisosComponent } from "../modulos/seguridad/permisos/permisos.component";

import { HerramientasComponent } from "../herramientas/herramientas.component";
import { UsuariosComponent } from "../modulos/seguridad/admusuarios/usuarios/usuarios.component";
import { ContenedorEmpresaComponent } from "../modulos/seguridad/contenedor-empresa/contenedor-empresa.component";
import { AdmtablaComponent } from "../modulos/seguridad/estructura-backend/admtabla/admtabla.component";
import { MMenuComponent } from "../modulos/seguridad/mmenu/mmenu/mmenu.component";
import { MMenuRolComponent } from "../modulos/seguridad/mmenurol/mmenurol/mmenurol.component";
import { MModuloComponent } from "../modulos/seguridad/modulo/modulo/mmodulo.component";
import { RolesComponent } from "../modulos/seguridad/roles/roles/roles.component";
import { RolUsuarioComponent } from "../modulos/seguridad/rolusuario/rolusuario/rolusuario.component";
import { UploadFileComponent } from "../modulos/seguridad/upload-file/upload-file.component";
import { SubmenuModulosComponent } from "../modulos/seguridad/submenu-modulos/submenu-modulos.component";

import { BackupsComponent } from "../herramientas/backups/backups.component";
import { BuzonComponent } from "../herramientas/buzon/buzon.component";

const appRoutes: Routes = [
  /* Rutas modulo seguridad*/
  {
    ///path: "seguridad/:idcon/:idmod",    component: SubmenuModulosComponent,
    path: "seguridad/:idcon/:idmod",
    // component: SubmenuModulosComponent,
    component: ContenedorEmpresaComponent,
    children: [
      { path: "", redirectTo: "5_usuarios", pathMatch: "full" },
      //{ path: 'usuarios', component: UsuarioComponent },
      //{ path: 'rol', component: RolComponent },
      //{ path: 'modulo', component: ModuloComponent },
      { path: "menu", component: AdmmenuComponent },
      { path: "permisos", component: PermisosComponent },
      { path: "menurol", component: MenurolComponent },
      { path: "5_usuarios", component: UsuariosComponent },
      { path: "9_menu", component: MMenuComponent },
      { path: "6_roles", component: RolesComponent },
      { path: "7_rolusuario", component: RolUsuarioComponent },
      { path: "8_modulo", component: MModuloComponent },
      { path: "10_mmenurol", component: MMenuRolComponent },
      { path: "1_creatabla", component: AdmtablaComponent },
      { path: "1_uploadfile", component: UploadFileComponent },
      { path: "1_herramientas", component: HerramientasComponent },
      { path: "19_backups", component: BackupsComponent },
      { path: "04_buzon", component: BuzonComponent },
    ],
  },
  // { path: "menu", component: AdmmenuComponent },
  // { path: "permisos", component: PermisosComponent },
  // { path: "menurol", component: MenurolComponent },
  // { path: "5_usuarios", component: UsuariosComponent },
  // { path: "9_menu", component: MMenuComponent },
  // { path: "6_roles", component: RolesComponent },
  // { path: "7_rolusuario", component: RolUsuarioComponent },
  // { path: "8_modulo", component: MModuloComponent, pathMatch: "full" },
  // { path: "10_mmenurol", component: MMenuRolComponent },
  // { path: "1_creatabla", component: AdmtablaComponent },
  // { path: "1_uploadfile", component: UploadFileComponent },
  // { path: "1_herramientas", component: HerramientasComponent },
  //  {path:'rpt_listamedicos',component:Rptej1Component},
  //  {path:'rpt_listamedicos2',component:RptMedicosComponent}
];
//utilizando el decorador NgModule

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class SeguridadRoutingModule {}
