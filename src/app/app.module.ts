import { AgmCoreModule } from "@agm/core";
import { DatePipe } from "@angular/common";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { FormusuarioComponent } from "./formusuario/formusuario.component";
/*REQUERIDOS*/
import { FuncionesPdfComponent } from "@funciones/funciones-pdf/funciones-pdf.component";
import { FuncionesComponent } from "@funciones/funciones/funciones.component";
import { ImgBase64Globals } from "@imagen64/img_reportes";
import { ImgBase64Globals_v2 } from "@imagen64/img_reportes_v2";
import { QRCodeModule } from "angular2-qrcode";
import { ChartsModule } from "ng2-charts/ng2-charts";
import { Globals } from "./global";

/*NPM*/
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { TextMaskModule } from "angular2-text-mask/";
import { NgxPaginationModule } from "ngx-pagination";
// import { InputMaskModule } from 'ng2-inputmask';

/*PIPES*/
import { PipeTranformaPipe } from "./pipe-tranforma.pipe";
import { FilterPipe } from "./pipes/filter.pipe";
import { GroupByPipe } from "./pipes/group-by.pipe";
import { ImagenAfiliadoPipe } from "./pipes/imagen-afiliado.pipe";
import { mostrarSlashPipe } from "./pipes/mostrarslash.pipe";
import { SearchPipe } from "./pipes/search.pipe";

/*DIRECTIVAS*/
import { CalendarioDirective } from "@directivas/calendario.directive";
import { KzMaskDirectiveDirective } from "./directivas/kz-mask-directive.directive";
/*SERVICIOS*/

import { AlmacenesService } from "./modulos/almacenes/almacenes.service";
import { ArchivocentralService } from "./modulos/archivo_central/archivocentral.service";
import { FinancieraService } from "./modulos/financiera/financiera.service";
import { GeofuncionariosService } from "./modulos/geo-funcionarios/geofuncionarios.service";
import { SeguimientoService } from "./modulos/seguimiento/seguimiento.service";
import { AutenticacionService } from "./modulos/seguridad/autenticacion.service";
import { ObservacionesService } from "./modulos/sgp/observaciones/observaciones.service";
import { SgpService } from "./modulos/sgp/sgp.service";
import { SiptaService } from "./modulos/sipta/sipta.service";
import { SispreService } from "./modulos/sispre/sispre.service";

/*COMPONENTE SEGURIDAD*/
import { CambiopasswordComponent } from "./modulos/seguridad/cambiopassword/cambiopassword.component";
import { ContenedorComponent } from "./modulos/seguridad/contenedor/contenedor.component";
import { FooterComponent } from "./modulos/seguridad/footer/footer.component";
import { FormularioaltaComponent } from "./modulos/seguridad/formularioalta/formularioalta.component";
import { HeaderComponent } from "./modulos/seguridad/header/header.component";
import { HomeComponent } from "./modulos/seguridad/home.component";
import { LoginComponent } from "./modulos/seguridad/login.component";
import { MensajesComponent } from "./modulos/seguridad/mensajes/mensajes.component";
import { MenuComponent } from "./modulos/seguridad/menu/menu.component";
import { PaginaComponent } from "./modulos/seguridad/pagina/pagina.component";
import { SubmenuComponent } from "./modulos/seguridad/submenu/submenu.component";

/*RUTAS*/
import { AlmacenesRoutingModule } from "./routing/almacen-routing.module";
import { AppRoutingModule } from "./routing/app-routing.module";
import { ArchivoCentralRoutingModule } from "./routing/archivocentral-routing.module";
import { BiometricoRoutingModule } from "./routing/biometrico-routing.module";
import { CompromisosPresidencialesRoutingModule } from "./routing/compromisos-routing.module";
import { ContenedorDocumentosRoutingModule } from "./routing/contenedordocumentos-routing.module";
import { EmpresaGeneralRoutingModule } from "./routing/empresa-general-routing.module";
import { FinancieraRoutingModule } from "./routing/financiera-routing.module";
import { GeoFuncionariosRoutingModule } from "./routing/geofuncionarios-routing.module";
import { GestionProyectosRoutingModule } from "./routing/gestionproyectos-routing.module";
import { MonitoreoRoutingModule } from "./routing/monitoreo-routing.module";
import { MonitoreoprogramacionRoutingModule } from "./routing/monitoreoprogramacion-routing.module";
import { SeguimientoRoutingModule } from "./routing/seguimiento-routing.module";
import { SeguridadRoutingModule } from "./routing/seguridad-routing.module";
import { SgpRoutingModule } from "./routing/sgp-routing.module";
import { SiptaRoutingModule } from "./routing/sipta-rounting.module";
import { SispreRoutingModule } from "./routing/sispre-routing.module";
import { SolicitudProyectosRoutingModule } from "./routing/solicituddeproyectos-routing.module";
/***************************************************************************** */

import { OrderModule } from "ngx-order-pipe";
import { ReporteComponent } from "./reporte/reporte.component";
import { Rptej1Component } from "./reporte/rptej1/rptej1.component";
import { Rptej2Component } from "./reporte/rptej2/rptej2.component";
//import { UsuarioComponent } from './modulos/seguridad/usuario/usuario.component';
//import { RolComponent } from './modulos/seguridad/rol/rol.component';
//import { ModuloComponent } from './modulos/seguridad/modulo/modulo.component';
import { AdmmenuComponent } from "./modulos/seguridad/admmenu/admmenu.component";
import { MenurolComponent } from "./modulos/seguridad/menurol/menurol.component";
import { PermisosComponent } from "./modulos/seguridad/permisos/permisos.component";
import { RptArchivoClinicoComponent } from "./reporte/rpt-archivoclinico/rpt-archivoclinico.component";
import { RptMedicosComponent } from "./reporte/rpt-medicos/rpt-medicos.component";

import { RptEjtablaComponent } from "./reporte/rpt-ejtabla/rpt-ejtabla.component";

import { HeaderMainComponent } from "./modulos/seguridad/header-main/header-main.component";
import { SubmenuDesplegableComponent } from "./modulos/seguridad/submenu-desplegable/submenu-desplegable.component";

import { EntradassalidasComponent } from "./modulos/almacenes/entradassalidas/entradassalidas.component";
import { InventariofisicovaloradoComponent } from "./modulos/almacenes/inventariofisicovalorado/inventariofisicovalorado.component";
import { AsignacionpresupuestoComponent } from "./modulos/financiera/asignacionpresupuesto/asignacionpresupuesto.component";
import { InicioFinancieraComponent } from "./modulos/financiera/inicio-financiera/inicio-financiera.component";
import { SeguimientofisicofinancieroComponent } from "./modulos/financiera/seguimientofisicofinanciero/seguimientofisicofinanciero.component";
import { InicioSeguimientoComponent } from "./modulos/seguimiento/inicio-seguimiento/inicio-seguimiento.component";
import { SubmenuModulosComponent } from "./modulos/seguridad/submenu-modulos/submenu-modulos.component";
import { HojaderutaComponent } from "./modulos/sipta/hojaderuta/hojaderuta.component";

import { NgSelect2Module } from "ng-select2";
import { FormulariocompromisoComponent } from "./modulos/compromisos/formulariocompromiso/formulariocompromiso.component";
import { InicioComponent } from "./modulos/compromisos/inicio/inicio.component";
import { LeafletComponent } from "./modulos/compromisos/leaflet/leaflet.component";
import { DonacionesComponent } from "./modulos/financiera/proyectos-venezuela/donaciones/donaciones.component";
import { ProyvenezuelaComponent } from "./modulos/financiera/proyectos-venezuela/proyvenezuela/proyvenezuela.component";
import { MapeogeneralComponent } from "./modulos/geo-funcionarios/mapeogeneral/mapeogeneral.component";
import { UbicacionpersonalComponent } from "./modulos/geo-funcionarios/ubicacionpersonal/ubicacionpersonal.component";
import { AsistenciaComponent } from "./modulos/rrhh/asistencia/asistencia.component";
import { AsistenciaSinDepurarComponent } from "./modulos/rrhh/asistencia_depurar/asistenciasindepurar.component";
import { DatosCompletarComponent } from "./modulos/rrhh/datoscompletar/datoscompletar.component";
import { HorarioComponent } from "./modulos/rrhh/horario/horario.component";
import { PermisoComponent } from "./modulos/rrhh/permiso/permiso.component";
import { BoletaItemComponent } from "./modulos/seguimiento/boleta-item/boleta-item.component";
import { UbicaciongeoComponent } from "./modulos/seguimiento/ubicaciongeo/ubicaciongeo.component";
import { AdmusuariosService } from "./modulos/seguridad/admusuarios/admusuarios.service";
import { UsuariosComponent } from "./modulos/seguridad/admusuarios/usuarios/usuarios.component";
import { AdmtablaComponent } from "./modulos/seguridad/estructura-backend/admtabla/admtabla.component";
import { MMenuComponent } from "./modulos/seguridad/mmenu/mmenu/mmenu.component";
import { MMenuRolComponent } from "./modulos/seguridad/mmenurol/mmenurol/mmenurol.component";
import { MModuloComponent } from "./modulos/seguridad/modulo/modulo/mmodulo.component";
import { RolesComponent } from "./modulos/seguridad/roles/roles/roles.component";
import { RolUsuarioComponent } from "./modulos/seguridad/rolusuario/rolusuario/rolusuario.component";
import { UploadFileComponent } from "./modulos/seguridad/upload-file/upload-file.component";
import { UsuarioComponent } from "./modulos/seguridad/usuario/usuario.component";
import { CabeceraSgpNorelacionadosComponent } from "./modulos/sgp/consolidacion/cabecera-sgp-norelacionados/cabecera-sgp-norelacionados.component";
import { CabeceraSgpComponent } from "./modulos/sgp/consolidacion/cabecera-sgp/cabecera-sgp.component";
import { SgpAsignadoDobleComponent } from "./modulos/sgp/consolidacion/sgp-asignado-doble/sgp-asignado-doble.component";
import { SgpSinasignarComponent } from "./modulos/sgp/consolidacion/sgp-sinasignar/sgp-sinasignar.component";
import { BandejaFinancieroComponent } from "./modulos/sgp/financiero/bandeja-financiero/bandeja-financiero.component";
import { ResumenFinancieroComponent } from "./modulos/sgp/financiero/resumen-financiero/resumen-financiero.component";
import { IngresarseguimientoComponent } from "./modulos/sgp/ingresarseguimiento/ingresarseguimiento.component";
import { BandejaLegalComponent } from "./modulos/sgp/legal/bandeja-legal/bandeja-legal.component";
import { ProyectoNuevoComponent } from "./modulos/sgp/legal/proyecto-nuevo/proyecto-nuevo.component";
import { NuevoproyectoComponent } from "./modulos/sgp/nuevoproyecto/nuevoproyecto.component";
import { ContratoComponent } from "./modulos/sgp/resumen/contrato/contrato.component";
import { DatosGeneralesComponent } from "./modulos/sgp/resumen/datos-generales/datos-generales.component";
import { EquipoTecnicoComponent } from "./modulos/sgp/resumen/equipo-tecnico/equipo-tecnico.component";
import { FormulariosComponent } from "./modulos/sgp/resumen/formularios/formularios.component";
import { GarantiasComponent } from "./modulos/sgp/resumen/garantias/garantias.component";
import { MaeBeneficiariaComponent } from "./modulos/sgp/resumen/mae-beneficiaria/mae-beneficiaria.component";
import { ModulosItemsComponent } from "./modulos/sgp/resumen/modulos-items/modulos-items.component";
import { ResumenComponent } from "./modulos/sgp/resumen/resumen.component";
import { ApliacionPlazoComponent } from "./modulos/sgp/tecnica/apliacion-plazo/apliacion-plazo.component";
import { BandejaTecnicaComponent } from "./modulos/sgp/tecnica/bandeja-tecnica/bandeja-tecnica.component";
import { SupervisionComponent } from "./modulos/sgp/tecnica/supervision/supervision.component";
import { AdmGestionComponent } from "./modulos/sipta/adm-gestion/adm-gestion.component";
import { CorrespondenciaEnviadaComponent } from "./modulos/sipta/correspondencia-enviada/correspondencia-enviada.component";
import { FormCorrespondenciaExternaComponent } from "./modulos/sipta/form-correspondencia-externa/form-correspondencia-externa.component";
import { FormCorrespondenciaInternaComponent } from "./modulos/sipta/form-correspondencia-interna/form-correspondencia-interna.component";
import { frmdatosComponent } from "./modulos/sipta/frmdatos/frmdatos.component";
import { InstitucionComponent } from "./modulos/sipta/institucion/institucion.component";
import { InstitucioncargoComponent } from "./modulos/sipta/institucioncargo/institucioncargo.component";
import { ProveidoComponent } from "./modulos/sipta/proveido/proveido.component";
import { unidadorganizacionalComponent } from "./modulos/sipta/unidadorganizacional/unidadorganizacional.component";
import { CitesComponent } from "./modulos/sispre/cites/cites.component";
import { ConsultaCitesComponent } from "./modulos/sispre/consulta-cites/consulta-cites.component";

import { NgApexchartsModule } from "ng-apexcharts";
import { BarrasComponent } from "./charts/barras/barras.component";
import { PieComponent } from "./charts/pie/pie.component";
import { RadialComponent } from "./charts/radial/radial.component";
import { AdministradorComponent } from "./modulos/almacenes/administrador/administrador.component";
import { BandejaAlmacenComponent } from "./modulos/almacenes/bandeja-almacen/bandeja-almacen.component";
import { SolicitudComponent } from "./modulos/almacenes/solicitud/solicitud.component";
import { BandejaArchivocentralComponent } from "./modulos/archivo_central/bandeja-archivocentral/bandeja-archivocentral.component";
import { BandejaRegistroComponent } from "./modulos/archivo_central/bandeja-registro/bandeja-registro.component";
import { DetalleArchivoComponent } from "./modulos/archivo_central/detalle-archivo/detalle-archivo.component";
import { FormularioModificacionComponent } from "./modulos/archivo_central/formulario-modificacion/formulario-modificacion.component";
import { UbicacionArchivoComponent } from "./modulos/archivo_central/ubicacion-archivo/ubicacion-archivo.component";
import { EmpresaMaeComponent } from "./modulos/empresa-mae/empresa-mae/empresa-mae.component";
import { EmpresaSeguimientoComponent } from "./modulos/empresa-seguimiento/empresa-seguimiento.component";
import { ReportesComponent } from "./modulos/reportes/reportes.component";
import { ContenedordocumentosComponent } from "./modulos/rrhh/contenedordocumentos/contenedordocumentos.component";
import { FeriadosComponent } from "./modulos/rrhh/feriados/feriados.component";
import { GrupofuncionarioComponent } from "./modulos/rrhh/grupofuncionario/grupofuncionario.component";
import { SeguimientoExternoComponent } from "./modulos/seguimiento/seguimiento-externo/seguimiento-externo.component";
import { MenuEmpresaComponent } from "./modulos/seguridad/menu-empresa/menu-empresa.component";
import { MenuMaeComponent } from "./modulos/seguridad/menu-mae/menu-mae.component";
import { AccesosRolComponent } from "./modulos/sgp/accesos-rol/accesos-rol.component";
import { Compromisos2025Component } from "./modulos/sgp/compromisos2025/compromisos2025.component";
import { BandejaContinuidadComponent } from "./modulos/sgp/continuidad/bandeja-continuidad/bandeja-continuidad.component";
import { ComparativaComponent } from "./modulos/sgp/continuidad/comparativa/comparativa.component";
import { DesgloseComponent } from "./modulos/sgp/continuidad/desglose/desglose.component";
import { DetalleContinuidadComponent } from "./modulos/sgp/continuidad/detalle-continuidad/detalle-continuidad.component";
import { ParametrosComponent } from "./modulos/sgp/continuidad/parametros/parametros.component";
import { PriorizacionComponent } from "./modulos/sgp/continuidad/proyecto-compromiso/priorizacion/priorizacion.component";
import { ProyectoCompromisoComponent } from "./modulos/sgp/continuidad/proyecto-compromiso/proyecto-compromiso.component";
import { ProyectosContinuidadComponent } from "./modulos/sgp/continuidad/proyectos-continuidad/proyectos-continuidad.component";
import { TarjetaComponent } from "./modulos/sgp/continuidad/tarjeta/tarjeta.component";
import { AnticipoComponent } from "./modulos/sgp/financiero/anticipo/anticipo.component";
import { AuditoriaComponent } from "./modulos/sgp/financiero/auditoria/auditoria.component";
import { DescripcionComponent } from "./modulos/sgp/financiero/descripcion/descripcion.component";
import { DescuentoComponent } from "./modulos/sgp/financiero/descuento/descuento.component";
import { PlanillaComponent } from "./modulos/sgp/financiero/planilla/planilla.component";
import { AdendaComponent } from "./modulos/sgp/legal/adenda/adenda.component";
import { ConvenioComponent } from "./modulos/sgp/legal/convenio/convenio.component";
import { DerechoPropietarioLegalComponent } from "./modulos/sgp/legal/derecho-propietario-legal/derecho-propietario-legal.component";
import { RatificacionConvenioComponent } from "./modulos/sgp/legal/ratificacion-convenio/ratificacion-convenio.component";
import { ResolucionConvenioComponent } from "./modulos/sgp/legal/resolucion-convenio/resolucion-convenio.component";
import { BandejaObservacionesComponent } from "./modulos/sgp/observaciones/bandeja-observaciones/bandeja-observaciones.component";
import { RegistroObservacionComponent } from "./modulos/sgp/observaciones/registro-observacion/registro-observacion.component";
import { CierreAdministrativoComponent } from "./modulos/sgp/resumen/cierre-administrativo/cierre-administrativo.component";
import { AmbientalComponent } from "./modulos/sgp/tecnica/ambiental/ambiental.component";
import { AsignacionUsuarioComponent } from "./modulos/sgp/tecnica/asignacion-usuario/asignacion-usuario.component";
import { CierreAdministrativoTecnicaComponent } from "./modulos/sgp/tecnica/cierre-administrativo-tecnica/cierre-administrativo-tecnica.component";
import { ContactosComponent } from "./modulos/sgp/tecnica/contactos/contactos.component";
import { FichaTecnicaComponent } from "./modulos/sgp/tecnica/ficha-tecnica/ficha-tecnica.component";
import { ObservarProyectoComponent } from "./modulos/sgp/tecnica/observar-proyecto/observar-proyecto.component";
import { SeguimientoEjecucionComponent } from "./modulos/sgp/tecnica/seguimiento-ejecucion/seguimiento-ejecucion.component";
import { RevisionComponent } from "./modulos/sipta/revision/revision.component";
import { FormatoDecimalPipe } from "./pipes/formato-decimal.pipe";
import { EmpresaSeguimientoMaeRoutingModule } from "./routing/empresa-mae-routing.module";
import { EmpresaSeguimientoRoutingModule } from "./routing/empresa-seguimiento-routing.module";
import { ProyectosContinuidadModule } from "./routing/proyectos-continuidad-routing.module";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { ToastrModule } from "ngx-toastr";
import { BarCategoriasComponent } from "./charts/bar-categorias/bar-categorias.component";
import { LineComponent } from "./charts/line/line.component";
import { RadialCriticComponent } from "./charts/radial-critic/radial-critic.component";
import { RangeBarComponent } from "./charts/range-bar/range-bar.component";
import { SemiDonutComponent } from "./charts/semi-donut/semi-donut.component";
import { WorkflowComponent } from "./charts/workflow/workflow.component";
import { CalendarioComponent } from "./herramientas/calendario/calendario.component";
import { HerramientasComponent } from "./herramientas/herramientas.component";
import { EmpresaAsociacionComponent } from "./modulos/empresa/empresa-asociacion/empresa-asociacion.component";
import { EmpresaDatosGeneralesComponent } from "./modulos/empresa/empresa-datos-generales/empresa-datos-generales.component";
import { EmpresaEquipoTrabajoComponent } from "./modulos/empresa/empresa-equipo-trabajo/empresa-equipo-trabajo.component";
import { EmpresaExperienciaComponent } from "./modulos/empresa/empresa-experiencia/empresa-experiencia.component";
import { EmpresaPersonalComponent } from "./modulos/empresa/empresa-personal/empresa-personal.component";
import { FormularioEmpresaComponent } from "./modulos/empresa/formulario-empresa/formulario-empresa.component";
import { BandejagestionproyectosComponent } from "./modulos/gestionproyecto/bandejagestionproyectos/bandejagestionproyectos.component";
import { BandejaitemsComponent } from "./modulos/gestionproyecto/bandejaitems/bandejaitems.component";
import { MonitoreoSeguimientoComponent } from "./modulos/monitoreo/monitoreo-seguimiento/monitoreo-seguimiento.component";
import { MonitoreoSolicitudesComponent } from "./modulos/monitoreo/monitoreo-solicitudes/monitoreo-solicitudes.component";
import { TarjetaMonitoreoComponent } from "./modulos/monitoreo/tarjeta/tarjeta-monitoreo.component";
import { ContenedorEmpresaComponent } from "./modulos/seguridad/contenedor-empresa/contenedor-empresa.component";
import { FiltraCamposComponent } from "./modulos/sgp/continuidad/filtra-campos/filtra-campos.component";
import { FormularioResumenComponent } from "./modulos/sgp/continuidad/proyecto-compromiso/formulario-resumen/formulario-resumen.component";
import { BandejaCompromisoV2Component } from "./modulos/sgp/continuidad/proyecto-compromiso/monitoreo-compromiso-v2/bandeja-compromiso-v2.component";
import { MonitoreoCompromisoV2Component } from "./modulos/sgp/continuidad/proyecto-compromiso/monitoreo-compromiso-v2/monitoreo-compromiso-v2.component";
import { MonitoreoCompromisoComponent } from "./modulos/sgp/continuidad/proyecto-compromiso/monitoreo-compromiso/monitoreo-compromiso.component";
import { EstructurafinanciamientoComponent } from "./modulos/sgp/legal/convenio/estructurafinanciamiento.component";
import { MonitoreoDbcComponent } from "./modulos/sgp/monitoreo-dbc/monitoreo-dbc.component";
import { MonitoreoEtapasComponent } from "./modulos/sgp/monitoreo-etapas/monitoreo-etapas.component";
import { MonitoreoV5Component } from "./modulos/sgp/monitoreo-v5/monitoreo-v5.component";
import { ContratosComponent } from "./modulos/sgp/tecnica/contratos/contratos.component";
import { ProgramacionComponent } from "./modulos/sgp/tecnica/programacion/programacion.component";
import { DocumentoComponent } from "./modulos/sipta/documento/documento.component";
import { TransicionesComponent } from "./modulos/transiciones/transiciones.component";

import { ChartProveidosComponent } from "./charts/chart-proveidos/chart-proveidos.component";
import { HeaderInterceptor } from "./headerInterceptor";
import { CorrespondenciaAuditoriaComponent } from "./modulos/auditoria/correspondencia-auditoria/correspondencia-auditoria.component";

import { BackupsComponent } from "./herramientas/backups/backups.component";
import { BuzonComponent } from "./herramientas/buzon/buzon.component";
import { DasEstructurafinanciamientoComponent } from "./modulos/dashboard/das-estructurafinanciamiento/das-estructurafinanciamiento.component";
import { DasPlanillasComponent } from "./modulos/dashboard/das-planillas/das-planillas.component";
import { CertificacionPresupuestariaComponent } from "./modulos/seguimiento-proyectos/certificacion-presupuestaria/certificacion-presupuestaria.component";
import { BandejaProgramacionfinancieraComponent } from "./modulos/seguimiento-proyectos/programacion-financiera/bandeja-programacionfinanciera/bandeja-programacionfinanciera.component";
import { SeguimientoProyectosComponent } from "./modulos/seguimiento-proyectos/seguimiento-proyectos.component";
import { DiferenciaenDiasEntrefechasPipe } from "./pipes/diferenciaen-dias-entrefechas.pipe";

import { TacometroComponent } from "./charts/tacometro/tacometro.component";
import { BandejaHrplanillasComponent } from "./modulos/seguimiento-proyectos/bandeja-hrplanillas/bandeja-hrplanillas.component";
import { EmpresasPeriodopresidencialComponent } from "./modulos/sgp/empresas-proyecto/empresas-periodopresidencial/empresas-periodopresidencial.component";
import { EmpresasProyectoComponent } from "./modulos/sgp/empresas-proyecto/empresas-proyecto.component";
import { SheetComponent } from './charts/sheet/sheet.component';

@NgModule({
  declarations: [
    AppComponent,
    FormusuarioComponent,
    /* REQUERIDOS */
    FuncionesComponent,
    FuncionesPdfComponent,
    /* PIPE */
    GroupByPipe,
    FilterPipe,
    SearchPipe,
    mostrarSlashPipe,
    PipeTranformaPipe,
    ImagenAfiliadoPipe,
    /*COMPONENTES SEGURIDAD*/
    LoginComponent,
    HomeComponent,
    PaginaComponent,
    HeaderComponent,
    FooterComponent,
    ContenedorComponent,
    MenuComponent,
    SubmenuComponent,
    FormularioaltaComponent,
    MensajesComponent,
    /*juan*/
    UsuariosComponent,
    RolesComponent,
    RolUsuarioComponent,
    MModuloComponent,
    MMenuComponent,
    MMenuRolComponent,

    /*DIRECTIVAS*/
    CalendarioDirective,
    KzMaskDirectiveDirective,

    /********************************************************* */

    AppComponent,
    // FilterNgModel,

    LoginComponent,
    HomeComponent,
    PaginaComponent,
    HeaderComponent,
    FooterComponent,
    ContenedorComponent,
    MenuComponent,
    SubmenuComponent,
    FormularioaltaComponent,
    ReporteComponent,
    Rptej1Component,
    Rptej2Component,
    //UsuarioComponent,
    //RolComponent,
    //ModuloComponent,
    AdmmenuComponent,
    PermisosComponent,
    RptMedicosComponent,
    RptArchivoClinicoComponent,
    MenurolComponent,
    UsuarioComponent,
    CambiopasswordComponent,
    // RemplazaCaracterPipe,

    PipeTranformaPipe,
    ImagenAfiliadoPipe,
    RptEjtablaComponent,

    CalendarioDirective,

    SubmenuDesplegableComponent,
    // MensajeModalComponent,
    HeaderMainComponent,
    KzMaskDirectiveDirective,
    SubmenuModulosComponent,
    GroupByPipe,
    FilterPipe,
    SearchPipe,
    InventariofisicovaloradoComponent,
    EntradassalidasComponent,
    HojaderutaComponent,
    SeguimientofisicofinancieroComponent,
    InicioFinancieraComponent,
    AsignacionpresupuestoComponent,
    InicioSeguimientoComponent,
    BoletaItemComponent,
    InicioComponent,
    FormulariocompromisoComponent,
    LeafletComponent,
    UbicaciongeoComponent,
    UbicacionpersonalComponent,
    MapeogeneralComponent,
    DonacionesComponent,
    ProyvenezuelaComponent,
    AdmtablaComponent,

    InstitucionComponent,
    InstitucioncargoComponent,
    FormCorrespondenciaExternaComponent,
    FormCorrespondenciaInternaComponent,
    ProveidoComponent,
    frmdatosComponent,
    unidadorganizacionalComponent,
    CorrespondenciaEnviadaComponent,
    AdmGestionComponent,
    CitesComponent,
    ConsultaCitesComponent,
    NuevoproyectoComponent,
    IngresarseguimientoComponent,
    UploadFileComponent,
    SupervisionComponent,
    ApliacionPlazoComponent,
    BandejaTecnicaComponent,
    BandejaFinancieroComponent,
    ResumenFinancieroComponent,
    BandejaLegalComponent,
    CabeceraSgpComponent,
    CabeceraSgpNorelacionadosComponent,
    SgpSinasignarComponent,
    SgpAsignadoDobleComponent,
    ProyectoNuevoComponent,
    DatosGeneralesComponent,
    MaeBeneficiariaComponent,
    ModulosItemsComponent,
    FormulariosComponent,
    ContratoComponent,
    GarantiasComponent,
    EquipoTecnicoComponent,
    ResumenComponent,
    AsistenciaComponent,
    AsistenciaSinDepurarComponent,
    PermisoComponent,
    HorarioComponent,
    DatosCompletarComponent,
    FormatoDecimalPipe,
    CierreAdministrativoComponent,
    FeriadosComponent,
    GrupofuncionarioComponent,
    BandejaArchivocentralComponent,
    BandejaRegistroComponent,
    DetalleArchivoComponent,
    FormularioModificacionComponent,
    ContenedordocumentosComponent,
    ContactosComponent,
    FichaTecnicaComponent,
    AsignacionUsuarioComponent,
    CierreAdministrativoTecnicaComponent,
    RatificacionConvenioComponent,
    DerechoPropietarioLegalComponent,
    SeguimientoEjecucionComponent,
    BandejaContinuidadComponent,
    ProyectosContinuidadComponent,
    ProyectoCompromisoComponent,
    DetalleContinuidadComponent,
    MenuEmpresaComponent,
    EmpresaSeguimientoComponent,
    EmpresaMaeComponent,
    MenuMaeComponent,
    BandejaObservacionesComponent,
    RegistroObservacionComponent,
    SeguimientoExternoComponent,
    DesgloseComponent,
    TarjetaComponent,
    ParametrosComponent,
    BarrasComponent,
    RadialComponent,
    PlanillaComponent,
    DescuentoComponent,
    DescripcionComponent,
    PieComponent,
    AnticipoComponent,
    ConvenioComponent,
    AccesosRolComponent,
    AdministradorComponent,
    SolicitudComponent,
    BandejaAlmacenComponent,
    RevisionComponent,
    AdendaComponent,
    AmbientalComponent,
    UbicacionArchivoComponent,
    AuditoriaComponent,
    ReportesComponent,
    ObservarProyectoComponent,
    ComparativaComponent,
    ResolucionConvenioComponent,
    Compromisos2025Component,
    PriorizacionComponent,
    FormularioResumenComponent,
    HerramientasComponent,
    ContratosComponent,
    DocumentoComponent,
    ContenedorEmpresaComponent,
    EmpresaDatosGeneralesComponent,
    EmpresaExperienciaComponent,
    EmpresaPersonalComponent,
    EmpresaEquipoTrabajoComponent,
    EmpresaAsociacionComponent,
    CalendarioComponent,
    MonitoreoCompromisoComponent,
    MonitoreoEtapasComponent,
    RangeBarComponent,
    RadialCriticComponent,
    ProgramacionComponent,
    MonitoreoDbcComponent,
    SemiDonutComponent,
    BarCategoriasComponent,
    FiltraCamposComponent,
    MonitoreoSolicitudesComponent,
    MonitoreoSeguimientoComponent,
    TarjetaMonitoreoComponent,
    BandejagestionproyectosComponent,
    BandejaitemsComponent,
    FormularioEmpresaComponent,
    EstructurafinanciamientoComponent,
    MonitoreoCompromisoV2Component,
    TransicionesComponent,
    BandejaCompromisoV2Component,
    WorkflowComponent,
    LineComponent,
    MonitoreoV5Component,
    ChartProveidosComponent,

    BackupsComponent,

    SeguimientoProyectosComponent,
    BuzonComponent,
    CertificacionPresupuestariaComponent,
    DiferenciaenDiasEntrefechasPipe,
    CorrespondenciaAuditoriaComponent,
    DasEstructurafinanciamientoComponent,
    BandejaProgramacionfinancieraComponent,
    BandejaHrplanillasComponent,
    DasPlanillasComponent,
    TacometroComponent,
    EmpresasProyectoComponent,
    EmpresasPeriodopresidencialComponent,
    SheetComponent,
  ],
  imports: [
    BrowserModule,
    LeafletModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyCMHcWmHVNOwafyNBNkmKOsvor69HcB97k",
    }),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    TextMaskModule,
    NgxPaginationModule,
    /*REQUERIDAS*/
    QRCodeModule,
    ChartsModule,
    //toast
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      timeOut: 8000,
      positionClass: "toast-top-right",
      progressBar: true,
      preventDuplicates: true,
    }), // ToastrModule added

    // InputMaskModule,
    /******************************************************** */
    /*RUTAS*/
    SeguridadRoutingModule,
    AlmacenesRoutingModule,
    SiptaRoutingModule,
    FinancieraRoutingModule,
    SeguimientoRoutingModule,
    SispreRoutingModule,
    SgpRoutingModule,
    BiometricoRoutingModule,
    CompromisosPresidencialesRoutingModule,
    GeoFuncionariosRoutingModule,
    ArchivoCentralRoutingModule,
    ContenedorDocumentosRoutingModule,
    SolicitudProyectosRoutingModule,
    ProyectosContinuidadModule,
    EmpresaSeguimientoRoutingModule,
    EmpresaSeguimientoMaeRoutingModule,
    EmpresaGeneralRoutingModule,
    MonitoreoRoutingModule,
    GestionProyectosRoutingModule,
    MonitoreoprogramacionRoutingModule,
    /******************************************************** */
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    QRCodeModule,
    HttpModule,
    AppRoutingModule,
    TextMaskModule,
    ChartsModule,
    OrderModule,
    NgxPaginationModule,
    NgSelect2Module,
    /****charts****/
    NgApexchartsModule,
    CKEditorModule,
  ],
  providers: [
    Globals,
    FuncionesComponent,
    FuncionesPdfComponent,
    MensajesComponent,
    DatePipe,
    ImgBase64Globals,
    ImgBase64Globals_v2,
    AutenticacionService,
    AdmusuariosService,
    AlmacenesService,
    SiptaService,
    FinancieraService,
    SeguimientoService,
    GeofuncionariosService,
    SispreService,
    SgpService,
    ArchivocentralService,
    ObservacionesService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeaderInterceptor,
      multi: true,
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
