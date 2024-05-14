import { Component, OnInit } from "@angular/core";

import { DatePipe } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import Inputmask from "inputmask";
import { Globals } from "../../../global";
/*servicios*/
import { ImgBase64Globals } from "@assets/imagenes_base64/img_reportes";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { EventosService } from "../../compromisos/eventos.service";
import { AutenticacionService } from "../../seguridad/autenticacion.service";
import { MensajesComponent } from "../../seguridad/mensajes/mensajes.component";
declare var $: any;

@Component({
  selector: "app-formulariocompromiso",
  templateUrl: "./formulariocompromiso.component.html",
  styleUrls: ["./formulariocompromiso.component.css"],
  providers: [
    AutenticacionService,
    MensajesComponent,
    FuncionesComponent,
    DatePipe,
    EventosService,
  ],
})
export class FormulariocompromisoComponent implements OnInit {
  //variables de session y iniciales
  public s_idcon: string;
  public s_idmod: string;
  public s_idrol: number;
  public s_user: string;
  public s_nomuser: string;
  public s_usu_id: string;
  public dts_roles_usuario: any;

  public url: string;
  public urlApi: string;
  public url_reporte: string;
  public errorMessage: string;
  public fechasrv: string;

  public dtsDatosConexion: any;
  public dtsFechaSrv: any;
  public dtsFechaLiteral: any;
  public dtsHoraSrv: any;
  public dtsAnio: any;
  public s_imgLogo: any;
  public fcomp: any;
  public _fecha_evento: any;
  public m_gestion: any;
  public m_mes_actual: any;
  public mask_numerodecimal: any;

  //variables
  public pnl_formulariobusqueda = true;
  /*paneles*/
  public pnlListaProveidos = false;
  public pnlModalNuevoModulo = false;
  public pnlModalEditarProveido = false;
  public pnlModalEliminaRegistro = false;
  /*variables del componente */
  public dts_ListaUsuarios: any;
  public dtsRegitroProveido: any;
  public dts_ListaDepartamento: any;
  public dts_ListaTipo: any;
  public dts_ListaMunicipio: any;
  //variables para el compononete de mensajes
  public prop_msg: string;
  public prop_tipomsg: string;

  //modulos
  public e_fcodigo_departamento: any;
  public e_fcodigo_municipio: any;
  public e_nombre_evento: any;
  public e_fecha_evento: any;
  public e_detalle_compromiso: any;
  public e_fid_tipo: any;
  public e_monto: any;
  public e_observaciones: any;
  public e_estado: any;
  public e_id_evento: any;
  public e_fusuario_registro: any;
  public s_nombre_evento: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _autenticacion: AutenticacionService,

    private _compromisos: EventosService,

    private globals: Globals,
    private _msg: MensajesComponent,
    private _fun: FuncionesComponent,
    private datePipe: DatePipe,
    private base64: ImgBase64Globals
  ) {
    this._route.parent.params.subscribe((parametros) => {
      this.s_idcon = parametros["idcon"];
      this.s_idmod = parametros["idmod"];
    });
    this.url = globals.rutaSrvFronEnd;
    this.s_imgLogo = base64.logocabecera;
    this.url_reporte = globals.rutaSrvReportes;
  }

  ngOnInit() {
    this.mask_numerodecimal = new Inputmask("9{1,9}.9{1,2}");

    this.buscarDepartamento();
    this.buscarTipo();

    function falloCallback(error) {
      console.log("Falló con " + error);
    }

    this.DatosConexion()
      .then((dts1) => {
        this.dtsDatosConexion = dts1;

        return this.FechaServidor();
      })
      .then((dts2) => {
        this.dtsFechaSrv = dts2[0]["fechasrv"];
        this.dtsHoraSrv = this.transformHora(this.dtsFechaSrv);
        this.m_gestion = this.dtsFechaSrv.substr(0, 4);
        this.m_mes_actual = this.dtsFechaSrv.substr(5, 2);
        return this.FechaLiteral(dts2[0]["fechasrv"]);
      })
      .then((dts3) => {
        this.dtsFechaLiteral = dts3;
      })
      .then((dts) => {
        return this.RolesAsignados(this.dtsDatosConexion[0]._usu_id);
      })
      .then((dts) => {
        this.dts_roles_usuario = dts;
        //this.manejoRoles();
      })
      .catch(falloCallback);
  }

  /*******************************************************************************/
  /*MASCARAS
  /*******************************************************************************/
  cargarmascaras() {
    var monto = document.getElementById("e_monto");
    this.mask_numerodecimal.mask(monto);
  }

  DatosConexion() {
    return new Promise((resolve, reject) => {
      this._autenticacion
        .getdatosconexion(this.s_idcon, this.s_idmod)
        .subscribe(
          (result: any) => {
            
            if (Array.isArray(result) && result.length > 0) {
              if (result[0]["_idrol"] != "") {
                this.s_idrol = result[0]["_idrol"];
                this.s_user = result[0]["_usu_user"];
                this.s_nomuser = result[0]["_usu_nom_com"];
                this.s_usu_id = result[0]["_usu_id"];
                resolve(result);
                return result;
              }
            } else {
              this.prop_msg =
                "Error: La conexion no es valida2, contáctese con el área de sistemas";
              this.prop_tipomsg = "danger";
              this._msg.formateoMensaje("modal_danger", this.prop_msg);
              reject(this.prop_msg);
            }
          },
          (error) => {
            this.errorMessage = <any>error;
            if (this.errorMessage != null) {
              console.log(this.errorMessage);
              this.prop_msg =
                "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas1";
              this.prop_tipomsg = "danger";
              this._msg.formateoMensaje("modal_danger", this.prop_msg);
            }
            reject(this.prop_msg);
          }
        );
    });
  }

  RolesAsignados(usu_id) {
    return new Promise((resolve, reject) => {
      this._autenticacion.rolesasignados(usu_id).subscribe(
        (result: any) => {
          
          if (Array.isArray(result) && result.length > 0) {
            resolve(result);
          } else {
            this.prop_msg =
              "Error: La conexion no es valida1, contáctese con el área de sistemas";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
            reject(this.prop_msg);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            console.log(this.errorMessage);
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos, contáctese con el área de sistemas2";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
          reject(this.prop_msg);
        }
      );
    });
  }

  FechaServidor() {
    return new Promise((resolve, reject) => {
      this._autenticacion.getfechaservidor().subscribe(
        (result: any) => {
          
          if (result[0]["fechasrv"] != "") {
            resolve(result);
            return result;
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos ";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
            reject(this.prop_msg);
          }
        }
      );
    });
  }
  transformHora(date) {
    return this.datePipe.transform(date, "HH:mm:ss");
    //whatever format you need.
  }
  transformAnio(date) {
    return this.datePipe.transform(date, "YYYY");
    //whatever format you need.
  }
  HoraServidor() {
    return new Promise((resolve, reject) => {
      this._autenticacion.gethoraservidor().subscribe(
        (result: any) => {
          
          if (result[0]["HORA"] != "") {
            var hora = this.transformHora(result[0]["HORA"]);
            resolve(hora);
            return hora;
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos ";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
            reject(this.prop_msg);
          }
        }
      );
    });
  }

  FechaLiteral(f) {
    return this._fun.FechaLiteral(f);
  }

  buscarCompromisos() {
    if (this.s_nombre_evento == "") {
      this.s_nombre_evento = null;
    }
    this._compromisos
      .getListarFormularioCompromiso(this.s_nombre_evento)
      .subscribe(
        (result: any) => {
          
          $("#pnl_busqueda").show();
          this.pnlListaProveidos = true;

          if (Array.isArray(result) && result.length > 0) {
            this.dts_ListaUsuarios = this._fun.RemplazaNullArray(result);
            this._fun.limpiatabla(".dt-Compromisos");
            setTimeout(() => {
              let confiTable = this._fun.CONFIGURACION_TABLA_V3(
                [20, 40, 60, 100],
                false
              );
              var table = $(".dt-Compromisos").DataTable(confiTable);
              this._fun.inputTable(table, [4, 6]);
              this._fun.selectTable(table, [1, 2, 3, 7, 10]);
            }, 500);
          } else {
            this.prop_msg = "Alerta: No existen registros";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            console.log(this.errorMessage);
            alert("1Error en la petición BUSQUEDA");
          }
        }
      );
  }

  FormNuevoCompromiso(datos) {
    this.pnlModalNuevoModulo = true;
    this.e_fcodigo_departamento = "";
    this.e_fcodigo_municipio = "";
    this.e_nombre_evento = "";
    this.e_fecha_evento = "";
    this.e_detalle_compromiso = "";
    this.e_fid_tipo = "";
    this.e_monto = "";
    this.e_observaciones = "";
    this.e_estado = "";
    setTimeout(() => {
      this.cargarmascaras();
    }, 100);
  }

  InsertaNuevoCompromiso() {
    //console.log(this.m_prov_fecha);
    this._compromisos
      .getInsertaNuevoCompromiso(
        this.e_fcodigo_departamento,
        this.e_fcodigo_municipio,
        this.e_nombre_evento,
        this.e_fecha_evento,
        this._fun.getNullVacio(this.e_detalle_compromiso),
        this.e_fid_tipo,
        this.e_monto,
        this._fun.getNullVacio(this.e_observaciones),
        (this.e_fusuario_registro = this.s_usu_id),
        //this.e_fusuario_registro='1',
        this.e_estado
      )
      .subscribe(
        (result: any) => {
          

          this.pnlModalNuevoModulo = false;
          $("#modalNuevoMenuRol").modal("hide");
          this.buscarCompromisos();
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            console.log(this.errorMessage);
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        }
      );
  }

  MuestraFormConvenioEditar(datos) {
    this.pnlModalEditarProveido = true;
    this.dtsRegitroProveido = datos;
    this.e_id_evento = this.dtsRegitroProveido._id_evento;

    this.buscarMunicipio("0: " + this.dtsRegitroProveido._fcodigo_departamento);

    //this.e_fusuario_registro = this.dtsRegitroProveido._fusuario_registro;
    //this.e_fusuario_registro = 1;
    this.e_fusuario_registro = this.s_usu_id;
    this.e_fcodigo_departamento = this.dtsRegitroProveido._fcodigo_departamento;
    this.e_fcodigo_municipio = this.dtsRegitroProveido._fcodigo_municipio;
    this.e_nombre_evento = this.dtsRegitroProveido._nombre_evento;
    this.e_fecha_evento = this._fun.transformDateOf_yyyymmdd(
      this.dtsRegitroProveido._fecha_evento
    );
    //console.log('fecha: '+this.e_fecha_evento);
    this.e_detalle_compromiso = this.dtsRegitroProveido._detalle_compromiso;
    this.e_fid_tipo = this.dtsRegitroProveido._fid_tipo;
    this.e_monto = this.dtsRegitroProveido._monto;
    this.e_observaciones = this.dtsRegitroProveido._observaciones;
    this.e_estado = this.dtsRegitroProveido._fid_estado;
    setTimeout(() => {
      this.cargarmascaras();
    }, 100);
  }

  ActualizaCompromiso() {
    //console.log(this.m_prov_fecha);
    this._compromisos
      .getActualizaCompromiso(
        this.e_id_evento,
        this.e_fcodigo_departamento,
        this.e_fcodigo_municipio,
        this.e_nombre_evento,
        this.e_fecha_evento,
        this._fun.getNullVacio(this.e_detalle_compromiso),
        this.e_fid_tipo,
        this.e_monto,
        this._fun.getNullVacio(this.e_observaciones),
        this.e_fusuario_registro,
        this.e_estado
      )
      .subscribe(
        (result: any) => {
          

          this.pnlModalEditarProveido = false;
          $("#modalEditarProveido").modal("hide");
          this.buscarCompromisos();
        },
        (error) => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            console.log(this.errorMessage);
            this.prop_msg =
              "Error: No se pudo ejecutar la petición en la base de datos jj";
            this.prop_tipomsg = "danger";
            this._msg.formateoMensaje("modal_danger", this.prop_msg);
          }
        }
      );
  }

  EliminarRegistro(datos) {
    this.pnlModalEliminaRegistro = true;
    this.dtsRegitroProveido = datos;
  }

  EliminaRegistroActual(id_evento: any) {
    //console.log(this.m_prov_fecha);
    this._compromisos.getEliminaCompromiso(id_evento, this.s_usu_id).subscribe(
      (result: any) => {
        

        this.pnlModalEliminaRegistro = false;
        $("#modalEliminaRegistro").modal("hide");
        this.buscarCompromisos();
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          this.prop_msg =
            "Error: No se pudo ejecutar la petición en la base de datos ";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      }
    );
  }

  LimpiarBusqueda() {
    this.s_nombre_evento = "";
  }

  buscarDepartamento() {
    this._compromisos.getBuscarDepartamento().subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_ListaDepartamento = this._fun.RemplazaNullArray(result);
        } else {
          this.prop_msg = "Alerta: No existen registros de la busqueda";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la petición BUSQUEDA");
        }
      }
    );
  }

  buscarTipo() {
    this._compromisos.getBuscarTipo().subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_ListaTipo = this._fun.RemplazaNullArray(result);
        } else {
          this.prop_msg = "Alerta: No existen registros de la busqueda";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la petición BUSQUEDA");
        }
      }
    );
  }

  buscarMunicipio(cod_dep: any) {
    //alert('ingreso: '+cod_dep);
    cod_dep = cod_dep.split(" ");
    //alert('cod: '+cod_dep[1]);
    this._compromisos.getBuscarMunicipio(cod_dep[1]).subscribe(
      (result: any) => {
        
        if (Array.isArray(result) && result.length > 0) {
          this.dts_ListaMunicipio = this._fun.RemplazaNullArray(result);
        } else {
          this.prop_msg = "Alerta: No existen registros de la busqueda";
          this.prop_tipomsg = "danger";
          this._msg.formateoMensaje("modal_danger", this.prop_msg);
        }
      },
      (error) => {
        this.errorMessage = <any>error;
        if (this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la petición BUSQUEDA");
        }
      }
    );
  }
}
