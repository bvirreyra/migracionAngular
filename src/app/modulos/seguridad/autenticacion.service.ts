import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { throwError as observableThrowError } from "rxjs";
import { Globals } from "../../global";

var varsession = "";
@Injectable()
export class AutenticacionService {
  public url: string;
  public urlFonadal: string;
  userName: string;
  loggeIn: boolean;

  constructor(
    private _http: HttpClient,
    private globals: Globals,
    private _fun: FuncionesComponent
  ) {
    //this.url='http://localhost:8383/';
    this.url = globals.rutaSrvBackEnd;
    this.urlFonadal = globals.rutaSrvBackEndFonadal;

    //this.url='http://192.168.1.153:8383/';
    this.userName = "";
    this.loggeIn = false;
  }

  // postLogin(autenticacion:Autenticacion){
  //     let json=JSON.stringify(autenticacion);
  //     let params=json;
  //     let headers=new Headers({'Content-Type':'application/json'});
  //     return this._http.post(this.url+'seguridad',params,{headers:headers})
  //         ;

  // }
  getLogin(usu_user: any, usu_pass: any) {
    console.log("como llega", usu_user, usu_pass);

    usu_user = this._fun.base64Encode(usu_user);
    usu_pass = this._fun.base64Encode(usu_pass);
    // console.log("usuario", usu_user, usu_pass);
    let res: any;
    // console.log(this.url + "sisupre_seguridad/" + usu_user + "/" + usu_pass);
    return this._http.get(
      this.url + "sisupre_seguridad/" + usu_user + "/" + usu_pass
    );
  }
  /*AUTENTICACION EN CASO DE MAE*/
  getLoginMAE(usu_user: any, usu_pass: any) {
    usu_user = this._fun.base64Encode(usu_user);
    usu_pass = this._fun.base64Encode(usu_pass);
    // console.log("usuario", usu_user, usu_pass);
    let res: any;
    return this._http.get(
      this.url + "sisupre_loginMAE/" + usu_user + "/" + usu_pass + "/MAE"
    );
  }

  /*AUTENTICACION EN CASO DE EMPRESA BD INTERNA*/
  getLoginEmpresaIn(usu_user: any, usu_pass: any) {
    usu_user = this._fun.base64Encode(usu_user);
    usu_pass = this._fun.base64Encode(usu_pass);
    // console.log("usuario", usu_user, usu_pass);
    let res: any;
    return this._http.get(
      this.url + "sisupre_loginEmpresa/" + usu_user + "/" + usu_pass + "/EMP"
    );
  }

  /*AUTENTICACION EN CASO DE EMPRESA*/
  getloginEmpresa(nit, usu_nit, pass_nit) {
    let datos = {
      nit: this._fun.base64Encode(nit),
      usuario: this._fun.base64Encode(usu_nit),
      password: this._fun.base64Encode(pass_nit),
    };
    console.log("mandando", this._fun.base64Encode(nit));

    return this._http.get(this.url + "loginEmpresa", {
      params: datos,
    });
  }
  cerrarsesion(idcon: any) {
    return this._http.get(this.url + "sisupre_cerrarsesion/" + idcon);
  }
  logout(): void {
    this.userName = "";
    this.loggeIn = false;
  }
  isLoggedIn() {
    return this.loggeIn;
  }

  getListaLogin(idcon: string, idmod: string) {
    return this._http.get(
      this.url + "sisupre_listalogin/" + idcon + "/" + idmod
    );
  }
  registraConexion(usuario: string, tipo: string) {
    return this._http.get(
      this.url + "sisupre_registraConexion/" + usuario + "/" + tipo
    );
  }

  getListaModulo() {
    return this._http.get(this.url + "listamodulos");
  }
  getListamodulosXRol(idcon: string) {
    return this._http.get(this.url + "sisupre_listamoduloxrol/" + idcon);
  }
  getListaSubMenu(idcon: string, idmod: string) {
    return this._http.get(this.url + "listasubmenu/" + idcon + "/" + idmod);
  }
  getListaSubMenuModulo(idcon: string, idmod: string) {
    return this._http.get(
      this.url + "sisupre_listasubmenumodulos/" + idcon + "/" + idmod
    );
  }
  ListaMenu(idcon: string) {
    return this._http.get(this.url + "sisupre_listamenu/" + idcon);
  }
  getListaMenuHistoriaClinica() {
    return this._http.get(this.url + "listamenuhistoriaclinica");
  }
  getListaMenuFormulariosAdministrativos() {
    return this._http.get(this.url + "listamenuformulariosadministrativos");
  }
  getListaMenuFormularios() {
    return this._http.get(this.url + "listamenuformularios");
  }

  getdatosconexion(idcon: string, idmod: string) {
    return this._http.get(
      this.url + "sisupre_listalogin/" + idcon + "/" + idmod
    );
  }
  getconexion(idcon: string) {
    return this._http.get(this.url + "sisupre_conexion/" + idcon);
  }
  getfechaservidor() {
    return this._http.get(this.url + "sisupre_fechasrv/");
  }
  gethoraservidor() {
    return this._http.get(this.url + "horasrv/");
  }
  getcambiarpassword(idcon: string, pass: string) {
    console.log("datoscon", idcon, pass);
    return this._http.get(
      this.url + "sisupre_getcambiarpassword/" + idcon + "/" + pass
    );
  }
  getcambiarpasswordsipta(s_usu_id_sipta: string, pass: string) {
    const data = { s_usu_id_sipta, pass };
    return this._http.get(this.url + "sipta_cambiarpassword", { params: data });
  }
  getcambiarpasswordsgp(s_usu_id: string, pass: string) {
    return this._http.get(
      this.url + "sgp_cambiarpassword/" + s_usu_id + "/" + pass
    );
  }
  mensajesdelsistema(codigo: number) {
    return this._http.get(this.url + "mensajesdelsistema/" + codigo);
  }
  rolesasignados(id_usu: string) {
    return this._http.get(this.url + "sisupre_rolesasignados/" + id_usu);
  }
  administracion_roles(id_usu: string) {
    return this._http.get(this.url + "sisupre_administracion_roles/" + id_usu);
  }
  listaDepartamentos() {
    return this._http.get(this.url + "sisupre_listaDepartamentos/");
  }
  listaProvincias() {
    return this._http.get(this.url + "sisupre_listaProvincias/");
  }
  listaMunicipios() {
    return this._http.get(this.url + "sisupre_listaMunicipios/");
  }

  /*
        postLogin(autenticacion:Autenticacion){
            let url=`${this.url}`;
            let iJson=JSON.stringify(autenticacion);
            
            return this._http.post(url+'seguridad/',iJson,{headers:this.headers})
                      .map(r=>r.json())
                     .catch(this.handleError);
      
        }*/
  public handleError(error: Response | any) {
    console.error(error);
    return observableThrowError(error.error || "Server error");
  }

  verificaRolAdmInternista(iduser: any) {
    return this._http.get(this.url + "verificaroladminternista/" + iduser);
  }
  /*********************LISTA REGIONALES************************************************ */
  listaregionales() {
    return this._http.get(this.url + "listaregionales/");
  }
  /*********************LISTA REGIONALES USUARIOS************************************************ */
  listaregionalesusuario(usuario: any) {
    return this._http.get(this.url + "listaregionalesusuario/" + usuario);
  }
  /******************************************************************** 
     ESTRUCTURA BACKEND
    *********************************************************************/
  consultaEstructura() {
    return this._http.get(this.url + "1_consultaestructura/");
  }
  consultaEsquema() {
    return this._http.get(this.url + "1_consultaesquema/");
  }
  creaTabla(esquema, nombre_tabla, llave_primaria) {
    return this._http.get(
      this.url +
        "1_crea_tabla/" +
        esquema +
        "/" +
        nombre_tabla +
        "/" +
        llave_primaria
    );
  }
  eliminaTabla(esquema, nombre_tabla) {
    return this._http.get(
      this.url + "1_borra_tabla/" + esquema + "/" + nombre_tabla
    );
  }
  consultaColumnas(esquema, nombre_tabla) {
    return this._http.get(
      this.url + "1_muestra_columnas/" + esquema + "/" + nombre_tabla
    );
  }
  creaColumna(
    esquema,
    nombre_tabla,
    nombre_columna,
    tipo_columna,
    detalle_columna
  ) {
    return this._http.get(
      this.url +
        "1_nueva_columna/" +
        esquema +
        "/" +
        nombre_tabla +
        "/" +
        nombre_columna +
        "/" +
        tipo_columna +
        "/" +
        detalle_columna
    );
  }
  eliminaColumna(esquema, nombre_tabla, nombre_columna) {
    return this._http.get(
      this.url +
        "1_borra_columna/" +
        esquema +
        "/" +
        nombre_tabla +
        "/" +
        nombre_columna
    );
  }
  /******************************************************************** 
    MANEJO DE ARCHIVOS
   *********************************************************************/
  subirArchivo(archivo_subido: any) {
    console.log("archivo_subido", archivo_subido);
    if (archivo_subido.FILE === undefined) {
      archivo_subido.FILE = File;
    }
    const formData: FormData = new FormData();
    formData.append("FILE", archivo_subido.FILE, archivo_subido.FILE.name);
    return this._http.put(
      this.url +
        "1_subirarchivo/" +
        encodeURIComponent(archivo_subido.TIPO_DOCUMENTO) +
        "/" +
        encodeURIComponent(archivo_subido.CODIGO),
      formData,
      {}
    );
  }
  reemplazarArchivo(archivo_subido: any) {
    if (archivo_subido.FILE === undefined) {
      archivo_subido.FILE = File;
    }
    const formData: FormData = new FormData();
    formData.append("FILE", archivo_subido.FILE, archivo_subido.FILE.name);
    return this._http.put(
      this.url +
        "1_reemplazararchivo/" +
        encodeURIComponent(archivo_subido.TIPO_DOCUMENTO) +
        "/" +
        encodeURIComponent(archivo_subido.CODIGO) +
        "/" +
        this._fun.textoNormal(archivo_subido.NOM_FILE),
      formData,
      {}
    );
  }
  obtenerArchivo(archivo_subido: any) {
    return this._http.get(
      this.url +
        "1_obtenerarchivo/" +
        encodeURIComponent(archivo_subido.TIPO_DOCUMENTO) +
        "/" +
        encodeURIComponent(archivo_subido.CODIGO) +
        "/" +
        this._fun.textoNormal(archivo_subido.NOM_FILE),
      { responseType: "arraybuffer" }
    );
  }
  eliminarArchivo(archivo_subido: any) {
    return this._http.get(
      this.url +
        "1_eliminararchivo/" +
        encodeURIComponent(archivo_subido.TIPO_DOCUMENTO) +
        "/" +
        encodeURIComponent(archivo_subido.CODIGO) +
        "/" +
        encodeURIComponent(archivo_subido.NOM_FILE)
    );
  }
  listaArchivo(codigo: any) {
    return this._http.get(this.url + "1_listaarchivos_galeria/" + codigo);
  }
  listaArchivoIdSgp(codigo: any) {
    return this._http.get(this.url + "1_listaarchivo_sgp/" + codigo);
  }
  listaArchivoSeguimiento(codigo: any, tipo: any) {
    return this._http.get(
      this.url + "1_listaarchivo_seg/" + codigo + "/" + tipo
    );
  }
  /*******************************************
   * PARAMETROS CONFIGURACION RRHH
   ******************************************/
  parametrosConfiguracionRRHH(codigo: any) {
    return this._http.get(
      this.url + "11_parametrosConfiguracionRRHH/" + codigo
    );
  }
}
