import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

/*COMPONENTES*/
import { CambiopasswordComponent } from "../modulos/seguridad/cambiopassword/cambiopassword.component";
import { ContenedorEmpresaComponent } from "../modulos/seguridad/contenedor-empresa/contenedor-empresa.component";
import { HomeComponent } from "../modulos/seguridad/home.component";
import { LoginComponent } from "../modulos/seguridad/login.component";
import { MenuEmpresaComponent } from "../modulos/seguridad/menu-empresa/menu-empresa.component";

const appRoutes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", component: LoginComponent, pathMatch: "full" },
  {
    path: "home/:idcon",
    component: ContenedorEmpresaComponent,
    pathMatch: "full",
  },
  // { path: 'empresa/:nit/:usu/:pass/:idcon', component: MenuEmpresaComponent,pathMatch: 'full' },
  {
    path: "empresamae/:id_usu/:usu/:idcon",
    component: MenuEmpresaComponent,
    pathMatch: "full",
  },
  { path: "home", component: ContenedorEmpresaComponent, pathMatch: "full" },
  { path: "addUsr", component: HomeComponent, pathMatch: "full" },
  {
    path: "cambiopassword/:idcon",
    component: CambiopasswordComponent,
    pathMatch: "full",
  },
  //Continuar
];
//utilizando el decorador NgModule

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only)
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
