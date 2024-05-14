import { Component, OnInit } from "@angular/core";
//import { ActivatedRoute, Router } from "@angular/router";
//import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { ActivatedRoute, Router } from "@angular/router";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { EmpresaService } from "../empresa/empresa.service";
import { AutenticacionService } from "./autenticacion.service";
import { Conexion } from "./conexion";
// import { DOCUMENT } from '@angular/common';

declare var jQuery: any;
declare var $: any;
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  providers: [AutenticacionService, EmpresaService],
})
export class LoginComponent implements OnInit {
  //lista: Autenticacion[];
  list: boolean;

  public tituloLogin: string;
  //public autenticacion: Autenticacion;
  public autenticacion: any;
  public errorMessage: any;
  public pnl_alerta = false;
  public dtsRegionales: any;
  public Regional: any;
  public pnlRegionales = false;
  public contador_reload = 0;
  public soyEmpresa = false;
  public soyMae = false;

  conexion: Conexion[];

  constructor(
    private _autenticacionService: AutenticacionService,
    private _empresa: EmpresaService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _fun: FuncionesComponent // @Inject(DOCUMENT) document: any
  ) {
    this.tituloLogin = "Acceder al Sistema Integral";
    this.soyEmpresa = false;
    this.soyMae = false;
  }

  ngOnInit() {
    //this.autenticacion = new Autenticacion("", "", "", "", "","","");
    const spin = document.querySelector('.modal-backdrop');
    if(spin) spin.classList.remove('modal-backdrop');
    localStorage.removeItem("token");
    localStorage.removeItem("dts_con");
    localStorage.removeItem("dts_permisos");
    localStorage.removeItem("dts_rol");
    this.autenticacion = {
      USU_ID: "",
      USU_USER: "",
      USU_PASS: "",
      USU_NOM_COM: "",
      IDESTADO: "",
      IDROLCON: "",
      USU_USERCON: "",
      NIT: "",
      USU_NIT: "",
      PASS_NIT: "",
      USU_MAE: "",
      PASS_MAE: "",
      TIPO: "",
    };
    if ((this.contador_reload = 0)) {
      window.location.reload();
      this.contador_reload = 1;
    }
  }

  // PreListaRegionales() {
  //   this._autenticacionService
  //     .listaregionalesusuario(this.autenticacion.USU_USER.toUpperCase())
  //     .subscribe(
  //       (result: any) => {
  //         if (Array.isArray(result) && result.length > 1) {
  //           this.pnlRegionales = true;
  //           this.dtsRegionales = result;
  //           setTimeout(() => {
  //             $("#modalListaRegionales").modal("show");
  //           }, 500);
  //         } else {
  //           if (result.length == 0) {
  //             this.onSubmit("11");
  //           } else {
  //             this.onSubmit(result[0].CODIGO_REGIONAL);
  //           }
  //           this.pnlRegionales = false;
  //         }
  //       },
  //       (error) => {
  //         this.errorMessage = <any>error;
  //         if (this.errorMessage != null) {
  //           console.log(this.errorMessage);
  //           alert("Error en la petición");
  //         }
  //       }
  //     );
  // }
  onSubmit(regional?: any) {
    $("#modalListaRegionales").modal("hide");
    this.pnlRegionales = false;
    //LOGIN POR EMPRESA
    if (this.autenticacion.NIT != "") {
      this.autenticacion.TIPO = "EMPRESA";
      this._autenticacionService
        .getLoginEmpresaIn(
          this.autenticacion.NIT,
          this.autenticacion.USU_NIT.trim() + this.autenticacion.PASS_NIT.trim()
        )
        .subscribe(
          (result: any) => {
            this.conexion = result;
            let id_con;
            console.log("primera llamada:", result);
            if (Array.isArray(result) && result.length > 0) {
              //let conn = this.generaConexionEmpresa(20);
              //   this._router.navigate(["./home/" + conn]);
              let nit = this._fun.textoNormal(this.autenticacion.NIT);
              let nit_usu = this._fun.textoNormal(this.autenticacion.USU_NIT);
              let nit_pass = this._fun.textoNormal(this.autenticacion.PASS_NIT);
              let tipo = "EMPRESA";
              this.registraConexion(this.autenticacion.NIT, tipo).then(
                (dts) => {
                  id_con = dts;
                  console.log("conexion obtenida", id_con);
                  // this._router.navigate([
                  //   "./16_empresa/" + nit + "/" + nit_usu + "/" + nit_pass+ "/" +id_con,
                  // ]);
                  this._router.navigate(["./16_empresa/" + id_con + "/16"]);
                }
              );
            } else {
              this._autenticacionService
                .getloginEmpresa(
                  this.autenticacion.NIT,
                  this.autenticacion.USU_NIT,
                  this.autenticacion.PASS_NIT
                )
                .subscribe(
                  (result: any) => {
                    this.conexion = result;
                    let tipo = "EMPRESA";
                    console.log("Datos empresa servicio", result);

                    if (result.hasOwnProperty("Estado")) {
                      if (result.Estado == "ACTIVO HABILITADO") {
                        let id_con;
                        //   this._router.navigate(["./home/" + conn]);
                        let nit = this._fun.textoNormal(this.autenticacion.NIT);
                        let nit_usu = this._fun.textoNormal(
                          this.autenticacion.USU_NIT
                        );
                        let nit_pass = this._fun.textoNormal(
                          this.autenticacion.PASS_NIT
                        );
                        //una vez que sea ok la repuesta del servicio de authNIT y aun no este registrado
                        //en la base empresa.usuario, realizar el insert
                        //this.registrarEmpresa bonk :)
                        this.almacenarEmpresaUsuario();
                        this.registraConexion(
                          this.autenticacion.NIT,
                          tipo
                        ).then((dts) => {
                          id_con = dts;
                          console.log("conexion obtenida", id_con);
                          this._router.navigate([
                            "./16_empresa/" + id_con + "/16",
                          ]);
                        });
                      } else {
                        this.pnl_alerta = true;
                      }
                    } else {
                      this.pnl_alerta = true;
                    }
                  },
                  (error) => {
                    this.errorMessage = <any>error;
                    if (this.errorMessage != null) {
                      console.log(this.errorMessage);
                      alert("Error en la petición");
                    }
                  }
                );
            }
          },
          (error) => {
            this.errorMessage = <any>error;
            if (this.errorMessage != null) {
              console.log(this.errorMessage);
              alert("Error en la petición");
            }
          }
        );
    } else if (this.autenticacion.USU_MAE != "") {
      this._autenticacionService
        .getLoginMAE(
          this._fun.textoUpper(this.autenticacion.USU_MAE),
          this._fun.textoNormal(this.autenticacion.PASS_MAE)
        )
        .subscribe(
          (result: any) => {
            this.conexion = result;
            console.log(result);
            let tipo = "MAE";
            if (Array.isArray(result) && result.length > 0) {
              console.log(result);
              let id_con = this.registraConexion(
                this.autenticacion.USU_MAE,
                tipo
              );

              this._router.navigate([
                "./empresamae/" +
                  this._fun.base64Encode(this.conexion[0]["_id_usuario"]) +
                  "/" +
                  this._fun.base64Encode(this.conexion[0]["_usuario"]) +
                  "/" +
                  id_con,
              ]);
            } else {
              this.pnl_alerta = true;
            }
          },
          (error) => {
            this.errorMessage = <any>error;
            if (this.errorMessage != null) {
              console.log(this.errorMessage);
              alert("Error en la petición");
            }
          }
        );
    } else {
      this._autenticacionService
        .getLogin(
          (this.autenticacion.USU_USER || "").toUpperCase(),
          this.autenticacion.USU_PASS
        )
        .subscribe(
          (result: any) => {
            this.conexion = result;
            console.log("conexion upre login", result);

            if (Array.isArray(result) && result.length > 0) {
              if (this.conexion[0]["nro_roles"] > "1") {
                let _idcon = this.conexion[0]["id_conexion"];
                let _tipo = this.conexion[0]["tipo"];

                this._router.navigate(["./home/" + _idcon]);
              } else {
                let _idcon = this.conexion[0]["id_conexion"];
                let id_modulo = this.conexion[0]["id_modulo"];
                let ruta = this.conexion[0]["ruta"];
                let id_rol = this.conexion[0]["id_rol"];
                let rol = this.conexion[0]["rol"];

                //console.log(_idcon,id_modulo,ruta,id_rol,rol);
                this._router.navigate(["./home/" + _idcon]);
                // this._router.navigate(['./' + ruta + '/' + _idcon + '/' + id_modulo]);
              }
              console.log("casi casi", this.conexion[this.conexion.length - 1]);
              let pivot = this.conexion[this.conexion.length - 1]["ruta"];
              // if(['r1RMRVY4exbY7fX5Bd15','ZCMO7uADNqUtudpAaNNf','kNUoEv18Hmetjpk5Gbf7'].includes(_idcon)) pivot = _idcon;
              localStorage.setItem("token", pivot);
            } else {
              this.pnl_alerta = true;
            }
          },
          (error) => {
            this.errorMessage = <any>error;
            if (this.errorMessage != null) {
              console.log(this.errorMessage);
              alert("Error en la petición");
            }
          }
        );
    }
  }
  limpiaLogin() {
    this.autenticacion = {
      USU_ID: "",
      USU_USER: "",
      USU_PASS: "",
      USU_NOM_COM: "",
      IDESTADO: "",
      IDROLCON: "",
      USU_USERCON: "",
      NIT: "",
      USU_NIT: "",
      PASS_NIT: "",
      USU_MAE: "",
      PASS_MAE: "",
    };
  }
  generaConexionEmpresa(tamanio): string {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < tamanio; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  registraConexion(usuario, tipo) {
    return new Promise((resolve, reject) => {
      console.log("Datos de Otros", usuario, tipo);
      this._autenticacionService.registraConexion(usuario, tipo).subscribe(
        (result: any) => {
          console.log("Id Conexion Otros", result);
          let con = result[0].id_conexion;
          console.log("Id Conexion Otros2", con);
          localStorage.setItem("token", result[0].token);
          resolve(con);
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            console.log(this.errorMessage);
            alert("1Error en la petición");
          }
        }
      );
    });
  }

  setChecks() {
    console.log(this.soyEmpresa, this.soyMae);
    if (!this.soyEmpresa) {
      this.soyMae = false;
    } else if (!this.soyMae) {
      this.soyEmpresa = false;
    } else {
      this.soyEmpresa = false;
      this.soyMae = false;
    }
  }
  limpiarInputs() {
    this.soyMae = false;
    this.soyEmpresa = false;
    this.limpiaLogin();
    this.pnl_alerta = false;
  }

  almacenarEmpresaUsuario() {
    console.log("el nit para almacenar", this.autenticacion.NIT);
    const elUsuarioEmpresa = {
      operacion: "I",
      idUsuario: 0,
      nit: this.autenticacion.NIT,
      usuario: this.autenticacion.USU_NIT,
      password: this.autenticacion.PASS_NIT,
      usuarioRegistro: 1,
    };
    this._empresa.crudUsuario(elUsuarioEmpresa).subscribe(
      (result: any) => {
        // result = result.json();
        console.log("usuario almacenado", result);
        if (!result[0].message.startsWith("ERROR")) {
          this.almacenarEmpresa(result[0].message.split("|")[1]);
        } else {
          console.log("NO SE REGISTRO NUEVO USUARIO EMPRESA");
        }
      },
      (error) => {
        this.errorMessage = <any>error;
      }
    );
  }

  almacenarEmpresa(idUser: number) {
    this._empresa
      .serviciosInterop({
        opcion: "SEPRECdatos",
        matricula: this.autenticacion.NIT,
      })
      .subscribe(
        (result: any) => {
          // result = result.json();
          console.log("datos de la empresa Interop", result, idUser);
          if (result.detalle) {
            const pivot = result.detalle.infoMatricula;
            const laEmpresa = {
              operacion: "I",
              id_empresa: 0,
              fid_usuario: idUser,
              nit: pivot.Nit,
              matricula: pivot.IdMatricula,
              razon_social: pivot.RazonSocial,
              fecha_inscripcion: pivot.FechaInscripcion,
              direccion: [
                `Prov. ${pivot.Provincia}`,
                `Municipio: ${pivot.Municipio}`,
                pivot.Zona,
                pivot.CalleAv,
                pivot.Nro,
              ].join(" "),
              telefono: pivot.Telefono,
              tipo: "Empresa Nacional", //pivot.TipoSocietario,
              correo: pivot.CorreoElectronico,
              fax: "",
              pais: "BOLIVIA",
              ciudad: pivot.Departamento,
              usuario_registro: idUser,
            };
            this._empresa.crudEmpresa(laEmpresa).subscribe(
              (result: any) => {
                // result = result.json();
                console.log("empresa almacenada", result);
                if (result[0].message.startsWith("ERROR"))
                  console.log("NO SE REGISTRO NUEVA EMPRESA",result[0]);
              },
              (error) => {
                this.errorMessage = <any>error;
              }
            );
          }
        },
        (error) => {
          this.errorMessage = <any>error;
        }
      );
  }
}
