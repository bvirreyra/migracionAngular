import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/internal/operators';
import { Globals } from './global';
import { Router } from "@angular/router";

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  private esRedirigido = false;
  constructor(
    private router: Router,
    private globals: Globals
  ){}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Clona la solicitud existente para agregar la cabecera
    // console.log('la req',request);
    let token = localStorage.getItem("token");
    if(request.url.includes(this.globals.rutaSrvServicios)) token = this.globals.tokenServicios;
    const modifiedRequest = request.clone({
      headers: request.headers.set("Authorization", token || ''),
    });

    // Pasa la solicitud modificada al siguiente manejador
    return next.handle(modifiedRequest).pipe(
      catchError(error => {
        console.log('capturado',error,this.esRedirigido);
        let errorMessage = `Error capturado: ${error.status} - ${error.message}`;
        if([400,401,402,403].includes(error.status) && !this.esRedirigido){
          this.esRedirigido =true;
          alert("Sesión expirada debe autenticarse!")
          this.router.navigate(['/']).then(()=>{this.esRedirigido = false});
          return throwError('Sesión expirada debe autenticarse!!!');
        }
        if(error.status == 404) return throwError('Documento o Recurso no encontrado!');
        return throwError( this.esRedirigido ? 'Sesión expirada debe autenticarse!!!' : errorMessage);
      })
    );;
  }
}
