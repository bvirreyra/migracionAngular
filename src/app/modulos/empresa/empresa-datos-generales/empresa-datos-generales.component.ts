import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import alasql from "alasql";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { EmpresaService } from "../empresa.service";

declare var $: any;

@Component({
  selector: "app-empresa-datos-generales",
  templateUrl: "./empresa-datos-generales.component.html",
  styleUrls: ["./empresa-datos-generales.component.css"],
})
export class EmpresaDatosGeneralesComponent implements OnInit, OnDestroy {
  idConexion: string;
  public idUsuario: number;
  public cargando: boolean = false;
  public gestion: number = new Date().getFullYear();

  empresa: {
    id_empresa: number;
    razon_social: string;
    matricula: string;
    fecha_inscripcion: string;
    telefono: string;
    fax: string;
    correo: string;
    pais: string;
    ciudad: string;
    direccion: string;
    tipo: string;
  };

  representantes: any[] = [];
  dtsCiudades: any[] = [];

  dtsMatriculas: any;
  dtsTotalEmpresas: any[] = [];

  elNIT: string = "";
  laMatricula: string = "";
  elIdEmpresa: number = 0;

  laSubscripcion: Subscription;
  elBS: any;

  buscar:{nit:string,razon_social:string,parcial:string} = {nit:'',razon_social:'',parcial:''}
  coincidenciasEmpresa:any[]=[];
  coincidenciasContenido:any[]=[];

  constructor(
    private _empresa: EmpresaService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private _fun: FuncionesComponent,
    private _route: ActivatedRoute,
    private _autenticacion: AutenticacionService
  ) {
    this.empresa = {
      id_empresa: 0,
      razon_social: "",
      matricula: "",
      fecha_inscripcion: "2022-08-06",
      telefono: "",
      fax: "",
      correo: "",
      pais: "",
      ciudad: "",
      direccion: "",
      tipo: "",
    };
    // this.elBS = _empresa.getInfo();
    // _empresa.getInfo().subscribe(info=> console.log('con BS',info));
    // this.laSubscripcion = this._empresa.nombre$.subscribe(texto=>{
    //   this.elNIT = texto;
    //   console.log('nava',texto,this.elNIT);
    // })
    this._route.parent.params.subscribe((parametros) => {
      this.idConexion = parametros["idcon"];
    });
  }

  ngOnInit() {
    this.datosConexion(this.idConexion);
    const datos = JSON.parse(localStorage.getItem("dts_con")) || {};
    // setTimeout(() => {
      this.listarEmpresas({ opcion: "T" });
    // }, 500);
    setTimeout(() => {
      console.log('rev conex',datos,this.idConexion);
      
      if(datos.s_id_conexion == this.idConexion){
        this.laMatricula = datos.s_matricula;
        this.elNIT = datos.s_nit;
        this.idUsuario = datos.s_id_usuario;
      }else{
        localStorage.removeItem('dts_con');
      }
      if(datos.s_id_conexion != this.idConexion && this.elNIT === '2323'){
        $("#modalEmpresas").modal({ backdrop: "static", keyboard: false });
        return true;
      }
      this.mostrarMatriculas(datos);
      console.log('mas revi',datos);
      if(!this.idUsuario)this.listarUsuarios({ opcion: "nit", id: this.elNIT });
    }, 900);
    
  }
  mostrarMatriculas(datos:any){
    console.log(
      "iniciando",
      this.idUsuario,
      this.elNIT,
      this.laMatricula,
      datos
    );
    //this.listarEmpresas({ opcion: "T" });
    setTimeout(() => {
      if (!this.laMatricula) {
        this.buscarMatriculas();
        $("#modalMatricula").modal({ backdrop: "static", keyboard: false });
        // $("#modalMatricula").modal("show");
      } else {
        setTimeout(() => {
          this.seleccionarMatricula(this.laMatricula);
        }, 500);
      }
    }, 500);
  }
  listarUsuarios(opcion) {
    this.cargando = true;
    this._empresa.listaUsuarios(opcion).subscribe(
      (result: any) => {
        this.idUsuario = result[0].id_usuario;
        this.cargando = false;
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor", {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        });
        this.cargando = false;
      }
    );
  }

  datosConexion(id: string) {
    this._autenticacion.getconexion(id).subscribe(
      (result: any) => {
        console.log("datos conexion empresa", result);
        this.elNIT = result[0]._usu_nom_com;
        // this.idUsuario = Number(this.elNIT);
        //this.listarUsuarios({ opcion: "nit", id: this.elNIT });
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor", {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        });
      }
    );
  }

  GuardarLocalStorage() {
    let dts_con = {
      s_nit: this.elNIT,
      s_matricula: this.laMatricula,
      s_id_conexion: this.idConexion,
      s_id_empresa: this.elIdEmpresa,
      s_id_usuario: this.idUsuario,
    };
    const rev23 = JSON.parse(localStorage.getItem("dts_con")) || {};
    if(rev23.s_id_usuario == 2000) dts_con.s_id_usuario = 2000;
    localStorage.setItem("dts_con", JSON.stringify(dts_con));
    console.log("guardo en LS", dts_con);
  }

  ngOnDestroy() {
    console.log("destruyendo empresa-datos-generales");
    // this.laSubcripcion.unsubscribe();
  }

  buscarMatriculas() {
    this.cargando = true;
    this._empresa
      .serviciosInterop({ opcion: "SEPRECmatriculas", nit: this.elNIT })
      .subscribe(
        (result: any) => {
          console.log("matriculas", result);
          if (result.error == "0000" || result.detalle) {
            this.dtsMatriculas = result.detalle.infoNit;
            //aca mandar a crudEmpresa para actualizar matricula si no exite ya la actual
            const emp = this.dtsTotalEmpresas.filter(f=> f.nit == this.elNIT && f.matricula != this.dtsMatriculas[0].IdMatricula)[0];
            const empOK = this.dtsTotalEmpresas.filter(f=> f.nit == this.elNIT && f.matricula == this.dtsMatriculas[0].IdMatricula)[0];
            //TODO evaluar algo mas apra el caso 1684183010
            if(emp && !empOK){
              emp.operacion = 'U';
              emp.matricula = this.elNIT;
              emp.usuario_registro = this.idUsuario;
              this._empresa.crudEmpresa(emp).subscribe(
              (res:any)=> console.log('matriculaAct',res,emp.id_empresa,emp.matricula),
              (error) => console.log('Error crud empresa',error)
              )
            }
          } else {
            this.toastr.error(
              "Error en el servicio de interoperabilidad",
              "Error desde el servidor",
              {
                positionClass: "toast-top-right",
                timeOut: 8000,
                progressBar: true,
              }
            );
            const pivot = this.dtsTotalEmpresas.filter(
              (f) => f.nit == this.elNIT
            );
            console.log("antes", pivot, this.dtsTotalEmpresas);

            if (pivot) {
              this.dtsMatriculas = pivot.map((e) => {
                e.IdMatricula = e.matricula;
                e.RazonSocial = e.razon_social;
                return e;
              });
              console.log("matriculas sin interop", this.dtsMatriculas);
            }
          }
          this.cargando = false;
        },
        (error) => {
          this.toastr.error(error.toString(), "Error desde el servidor", {
            positionClass: "toast-top-right",
            timeOut: 8000,
            progressBar: true,
          });
          this.cargando = false;
        }
      );
  }

  buscarRepresentantes(nit) {
    this.cargando = true;
    this.listarRepresentantes({
      opcion: "rl.fid_empresa",
      id: this.empresa.id_empresa,
    });
    setTimeout(() => {
      this._empresa
        .serviciosInterop({
          opcion: "SEPRECrepresentantes",
          matricula: nit,
        })
        .subscribe(
          (result: any) => {
            console.log("representantes Serv", result);
            if (result.error == "0000" || result.detalle) {
              const servicioRL = result.detalle.Representantes.Representante; //revisar con servicio activo
              servicioRL.forEach((r) => {
                // console.log("rep", r, this.representantes);
                if (
                  !this.representantes.filter(
                    (f) => Number(f.num_id) == Number(r.NumId)
                  )[0]
                ) {
                  const rl = {
                    operacion: "I",
                    id_representante_legal: 0,
                    fid_empresa: this.empresa.id_empresa,
                    fid_persona: null,
                    nombre: r.NombreVinculo,
                    num_id: r.NumId,
                    poder_testimonio: r.NumDoc,
                    poder_lugar_emision: null,
                    poder_fecha_expedicion:
                      r.FecDocumento.length > 6 ? r.FecDocumento : null,
                    verificado_segip: false,
                    usuario_registro: this.idUsuario,
                  };
                  this.crudRepresentante("I", null, rl);
                }
              });
              // this.representantes.map(e=>{
              //   e.nombre = e.NombreVinculo;
              //   e.num_id = e.NumId;
              //   e.poder_lugar_emision = '';
              //   e.poder_fecha_expedicion = moment(e.FecRegistro).format('YYYY-MM-DD');
              //   return e;
              // })
            }
            this.cargando = false;
          },
          (error) => {
            this.toastr.error(error.toString(), "Error desde el servidor", {
              positionClass: "toast-top-right",
              timeOut: 8000,
              progressBar: true,
            });
            this.cargando = false;
          }
        );
    }, 500);
  }

  seleccionarMatricula(matricula: string) {
    console.log("entrando matri", matricula);
    console.log(
      matricula,
      this.dtsTotalEmpresas,
      this.dtsTotalEmpresas.filter(
        (f) => Number(f.matricula) == Number(matricula)
      )
    );
    this.listarEmpresas({ opcion: "T" });
    setTimeout(() => {
      this.empresa = this.dtsTotalEmpresas.filter(
        (f) => Number(f.matricula) == Number(matricula)
      )[0];
      if(this.empresa){
        this.empresa.fecha_inscripcion = moment(
          this.empresa.fecha_inscripcion
        ).add(5,'hours').format("YYYY-MM-DD");
        this.laMatricula = this.empresa.matricula;
        this.elIdEmpresa = this.empresa.id_empresa;
        this.GuardarLocalStorage();
        // this.listarRepresentantes({opcion:'fid_empresa',id:this.empresa.id_empresa});
        this.buscarRepresentantes(matricula);
        $("#modalMatricula").modal("hide");
      }
      if(!this.empresa){
        this.almacenarEmpresa(matricula)
      }
    }, 500);
  }

  almacenarEmpresa(matricula) {
    this._empresa
      .serviciosInterop({
        opcion: "SEPRECdatos",
        matricula: matricula,
      })
      .subscribe(
        (result: any) => {
          // result = result.json();
          console.log("datos de la empresa Interop", result);
          if (result.detalle) {
            const pivot = result.detalle.infoMatricula;
            const laEmpresa = {
              operacion: "I",
              id_empresa: 0,
              fid_usuario: this.idUsuario,
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
              usuario_registro: this.idUsuario,
            };
            this._empresa.crudEmpresa(laEmpresa).subscribe(
              (result: any) => {
                console.log("empresa almacenada", result);
                this.seleccionarMatricula(matricula);
                if (result[0].message.startsWith("ERROR"))
                  console.log("NO SE REGISTRO NUEVA EMPRESA!!!",result);
              },
              (error) => {
                this.toastr.error(error.toString(), "Error desde crudEmpresa");
              }
            );
          }
        },
        (error) => {
          this.toastr.error(error.toString(), "Error desde SEPREC");
        }
      );
  }

  listarEmpresas(opcion) {
    this._empresa.listaEmpresas(opcion).subscribe(
      (result: any) => {
        console.log("empresas", result);
        this.dtsTotalEmpresas = result;
        this.dtsCiudades = alasql("select distinct ciudad from ?", [result]);
        this.cargando = false;
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor");
      }
    );
  }

  listarRepresentantes(opcion) {
    this.cargando = true;
    this._empresa.listaRepresentantes(opcion).subscribe(
      (result: any) => {
        console.log("representantes", result);
        this.representantes = result;
        this.representantes.map((e) => {
          e.poder_fecha_expedicion = e.poder_fecha_expedicion
            ? moment(e.poder_fecha_expedicion).add(5,'hours').format("YYYY-MM-DD")
            : null;
          return e;
        });
        this.cargando = false;
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor");
        this.cargando = false;
      }
    );
  }

  crudEmpresa(laEmpresa: any) {
    const validarCorreo = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/
    if(!validarCorreo.test(laEmpresa.correo)){
      this.toastr.warning(
        "Correo Electrónico no válido","Registro Empresa",
        {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        }
      );
      return false;
    }
    this.cargando = true;
    laEmpresa.operacion = "U";
    laEmpresa.usuario_registro = this.idUsuario;
    this._empresa.crudEmpresa(laEmpresa).subscribe(
      (result: any) => {
        console.log("crud empresa", result);
        if (!result[0].message.toUpperCase().startsWith("ERROR")) {
          this.toastr.success(
            "Datos actualizados con éxito!!!",
            "Registro Empresa",
            {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            }
          );
          // this.listarDocumentosRecientes(this.idUsuario.toString(),this.gestionSel);
        } else {
          this.toastr.error(
            "Error al actualizar empresa: " + result[0].message,
            "Registro Empresa",
            {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            }
          );
        }
        this.cargando = false;
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor", {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        });
        this.cargando = false;
      }
    );
  }

  actualizarFundempresa() {
    this.cargando = true;
    this._empresa
      .serviciosInterop({ opcion: "SEPRECdatos", matricula: this.laMatricula })
      .subscribe(
        (result: any) => {
          console.log("datos empresa", result);
          if (result.error == "0000" || result.detalle) {
            this.reemplazarDatosFundeempresa(result.detalle.infoMatricula);
          } else {
            this.toastr.error(
              "Servicio Interop inaccesible",
              "Error desde el servidor",
              {
                positionClass: "toast-top-right",
                timeOut: 8000,
                progressBar: true,
              }
            );
          }
          this.cargando = false;
        },
        (error) => {
          this.toastr.error(error.toString(), "Error desde el servidor", {
            positionClass: "toast-top-right",
            timeOut: 8000,
            progressBar: true,
          });
          this.cargando = false;
        }
      );
  }
  reemplazarDatosFundeempresa(data: any) {
    this.empresa.razon_social = data.RazonSocial;
    this.empresa.fecha_inscripcion = data.FechaInscripcion;
    this.empresa.telefono = data.Telefono;
    this.empresa.correo = data.CorreoElectronico;
    this.empresa.ciudad = data.Departamento;
    this.empresa.direccion = `PROV. ${data.Provincia}, MUNICIPIO ${
      data.Municipio
    }, ${data.CalleAv}, #${data.Nro.replace("Sin número", "S/N")}`;
    this.crudEmpresa(this.empresa);
  }

  crudRepresentante(operacion: string, id: number, rl?: any) {
    let elRepresentante: any;
    rl
      ? (elRepresentante = rl)
      : this.representantes.filter((f) => f.id_representante_legal == id)[0];

    console.log("el representante", elRepresentante, id, this.representantes);
    if ((!elRepresentante.poder_fecha_expedicion || !elRepresentante.poder_lugar_emision) && id) {
      this.toastr.warning(
        "Debe completar fecha de expedición y Lugar de Emisión",
        "Registro Representante",
        { positionClass: "toast-top-right", timeOut: 8000, progressBar: true }
      );
      return true;
    }
    this.cargando = true;
    elRepresentante.operacion = operacion;
    elRepresentante.usuario_registro = this.idUsuario;
    elRepresentante.fid_empresa = this.elIdEmpresa;
    elRepresentante.fid_persona = elRepresentante.id_persona || null;
    this._empresa.crudRepresentante(elRepresentante).subscribe(
      (result: any) => {
        console.log("crud representante", result);
        if (!result[0].message.toUpperCase().startsWith("ERROR")) {
          this.toastr.success(
            "Representante actualizado con éxito!!!",
            "Registro Representante",
            {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            }
          );
          this.listarRepresentantes({
            opcion: "rl.fid_empresa",
            id: this.elIdEmpresa,
          });
        } else {
          this.toastr.error(
            "Error al actualizar representante: " + result[0].message,
            "Registro Representante",
            {
              positionClass: "toast-top-right",
              timeOut: 5000,
              progressBar: true,
            }
          );
        }
        this.cargando = false;
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor", {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        });
        this.cargando = false;
      }
    );
  }

  limpiarRepresentante(id:number){
    this.representantes.map(e=>{
      if(e.id_representante_legal === id){
        e.poder_testimonio = ''
        e.poder_lugar_emision = ''
        e.poder_fecha_expedicion = ''
      }
      return e;
    })
  }

  buscarEmpresas(){
    if(this.buscar.nit && this.buscar.razon_social) this.coincidenciasEmpresa = this.dtsTotalEmpresas.filter(f=>f.razon_social.includes(this.buscar.razon_social) || f.nit.includes(this.buscar.nit))
    if(this.buscar.nit && !this.buscar.razon_social) this.coincidenciasEmpresa = this.dtsTotalEmpresas.filter(f=> f.nit.includes(this.buscar.nit))
    if(!this.buscar.nit && this.buscar.razon_social) this.coincidenciasEmpresa = this.dtsTotalEmpresas.filter(f=> f.razon_social.includes(this.buscar.razon_social))
    
    console.log('coincide',this.coincidenciasEmpresa);
  }
  cargarEmpresa(rawEmpresa:any){
    this.elNIT = rawEmpresa.nit;
    this.laMatricula = rawEmpresa.matricula;
    this.elIdEmpresa = rawEmpresa.id_empresa;
    this.idUsuario = 2000;
    this.seleccionarMatricula(this.laMatricula);
    $("#modalEmpresas").modal("hide");
  }
  buscarContenido(){
    this.cargando = true;
    this._empresa.buscarContenidoFormulario({opcion:this.buscar.parcial}).subscribe(
      (result: any) => {
        console.log("contenidos", result);
        this.coincidenciasContenido = result;
        this.cargando = false;
      },
      (error) => {
        this.toastr.error(error.toString(), "Error desde el servidor", {
          positionClass: "toast-top-right",
          timeOut: 8000,
          progressBar: true,
        });
        this.cargando = false;
      }
    );
  }

  handleInput(event: any) {
    const value = event.target.value;
    const pattern =/^[0-9,()\s-]+$/ ////^[^a-zA-Z]+$/
    if (!pattern.test(value)) {
      event.target.value = value.slice(0, -1);
    }
  }
}
