import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AutenticacionService } from "./autenticacion.service";

@Injectable()
export class AutenticacionLogin implements CanActivate {
  constructor(private router: Router, private auth: AutenticacionService) {}
  canActivate() {
    if (this.auth.isLoggedIn()) {
      return true;
    }
    this.router.navigate(["/login]"]);
    return false;
  }
}
