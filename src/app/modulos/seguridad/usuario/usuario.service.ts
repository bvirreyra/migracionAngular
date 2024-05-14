import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Globals } from "../../../global";

@Injectable()
export class UsuarioService {
  public url: string;
  public mat: string;
  public ci: string;
  public fn: string;

  constructor(private _http: HttpClient, private globals: Globals) {
    //this.url='http://localhost:8383/';
    this.url = globals.rutaSrvBackEnd;
    //this.url='http://192.168.1.153:8383/';
  }
  emailcuentausuario(user: string, pass: string, email: string) {
    return this._http.get(
      this.url + "email/" + user + "/" + pass + "/" + email
    );
  }

  /*CRUD MODULO SEGURIDAD*/
  /*
    getAltaUsuario(alta: DatosUsuario) {
        
        let USU_ID = alta.USU_ID;
        let USU_USER = null;
        let USU_APAT = alta.USU_APAT;
        let USU_AMAT = alta.USU_AMAT;
        let USU_NOM = alta.USU_NOM;
        let USU_PERFIL = alta.USU_PERFIL;
        let USU_GRUPO = alta.USU_GRUPO;
        let MEDI_COD = null;
        let ESP_COD = null;
        let ESP_NOM = null;
        let IDESTADO = 31;
        let CORREO = alta.CORREO;
        let operacion='I';

        return this._http.get(this.url + 'mseg_insertausuario/' +
                                        operacion +
                                      '/' + USU_ID +
                                      '/' + USU_USER +
                                      '/' + USU_APAT +
                                      '/' + USU_AMAT +
                                      '/' + USU_NOM +
                                      '/' + USU_GRUPO +
                                      '/' + USU_PERFIL +
                                      '/' + IDESTADO +
                                      '/' + CORREO)
            
    }
*/
  ListaAreas() {
    return this._http.get(this.url + "listaareas");
  }
  /*
    ListaPerfiles(area: string) {
        return this._http.get(this.url + 'listaperfiles/' + area)
            
    }
*/

  buscauserxparametros(
    user: string,
    apat: string,
    amat: string,
    nom: string,
    ci: string
  ) {
    let operacion = "C";

    return this._http.get(
      this.url +
        "buscauserxparametro/" +
        operacion +
        "/" +
        ci +
        "/" +
        user +
        "/" +
        apat +
        "/" +
        amat
    );
  }

  /*
    getModificaUsuario(alta: DatosUsuario) {
        
        let USU_ID = alta.USU_ID;
        let USU_USER = alta.USU_USER;
        let USU_APAT = alta.USU_APAT;
        let USU_AMAT = alta.USU_AMAT;
        let USU_NOM = alta.USU_NOM;
        let USU_PERFIL = alta.USU_PERFIL;
        let USU_GRUPO = alta.USU_GRUPO;
        let MEDI_COD = null;
        let ESP_COD = null;
        let ESP_NOM = null;
        let IDESTADO = 31;
        let CORREO = alta.CORREO;
        let operacion='U';

        return this._http.get(this.url + 'mseg_actualizausuario/' +
                                        operacion +
                                      '/' + USU_ID +
                                      '/' + USU_USER +
                                      '/' + USU_APAT +
                                      '/' + USU_AMAT +
                                      '/' + USU_NOM +
                                      '/' + USU_GRUPO +
                                      '/' + USU_PERFIL +
                                      '/' + IDESTADO +
                                      '/' + CORREO)
            
    }

    getModificaEstadoUsuario(alta: DatosUsuario) {
        

        
        let USU_ID = alta.USU_ID;
        let IDESTADO = alta.IDESTADO;
        let operacion = 'D';

        return this._http.get(this.url + 'mseg_estadousuario/' +
                                        operacion +
                                      '/' + USU_ID +
                                      '/' + IDESTADO )
            
    }
*/
}
