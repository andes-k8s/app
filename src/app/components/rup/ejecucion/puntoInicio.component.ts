import { ElementosRupService } from './../../../services/elementosRUP.service';
import { IElementoRUP } from './../../../interfaces/IElementoRUP';
import * as elementosRupFunciones from '../core/elementosRup.funciones';
import {
    PacienteSearch
} from './../../../services/pacienteSearch.interface';
import {
    TipoPrestacionService
} from './../../../services/tipoPrestacion.service';
import {
    element
} from 'protractor';
import {
    IOrganizacion
} from './../../../interfaces/IOrganizacion';
import {
    OrganizacionComponent
} from './../../organizacion/organizacion.component';
import {
    IProfesional
} from './../../../interfaces/IProfesional';
import {
    Auth
} from '@andes/auth';
import {
    Plex
} from '@andes/plex';
import {
    AgendaService
} from './../../../services/turnos/agenda.service';
import {
    ITipoPrestacion
} from './../../../interfaces/ITipoPrestacion';
import {
    PrestacionPacienteService
} from './../../../services/rup/prestacionPaciente.service';
import {
    IPrestacionPaciente
} from './../../../interfaces/rup/IPrestacionPaciente';
import {
    Component,
    OnInit,
    Output,
    Input,
    EventEmitter,
    HostBinding
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';
import {
    ProblemaPacienteService
} from './../../../services/rup/problemaPaciente.service';
import {
    IPaciente
} from './../../../interfaces/IPaciente';
import {
    IProblemaPaciente
} from './../../../interfaces/rup/IProblemaPaciente';
// Rutas
import {
    Router,
    ActivatedRoute,
    Params
} from '@angular/router';
import * as moment from 'moment';

@Component({
    selector: 'rup-puntoInicio',
    templateUrl: 'puntoInicio.html'
})

export class PuntoInicioComponent implements OnInit {
    paciente: IPaciente;

    @HostBinding('class.plex-layout') layout = true;

    // Lista de elementos RUP en memoria
    public elementosRUP: IElementoRUP[] = [];
    // termino a buscar en Snomed
    public searchTerm: String = '';


    public listaPrestaciones: IPrestacionPaciente[] = [];
    public agendas: any = [];
    public breadcrumbs: any;

    public alerta = false;
    public mostrarLista = true;
    public mostrarPacientesSearch = true;

    public conjuntoDePrestaciones: any = [];
    public pacientesPresentes: any = [];
    public pacientesPresentesCompleto: any = [];
    public todasLasPrestaciones: any = [];
    public fechaDesde: Date;
    public fechaHasta: Date;
    public prestacionSeleccion: any;
    public estadoSeleccion: any;
    public misPacientesSeleccion = false;
    public todosSeleccion = false;
    public selectPrestacionesProfesional: any = [];





    public searchPaciente: any;
    public filtrosPacientes = true;
    public textoTipeado: string = null;

    private buscarMPI = false;

    constructor(private servicioPrestacion: PrestacionPacienteService,
        private servicioProblemasPaciente: ProblemaPacienteService,
        private servicioTipoPrestacion: TipoPrestacionService,
        public servicioAgenda: AgendaService, public auth: Auth,
        private router: Router, private route: ActivatedRoute,
        private plex: Plex,
        private servicioElementosRUP: ElementosRupService) { }

    ngOnInit() {
        this.breadcrumbs = this.route.routeConfig.path;
        // buscamos los elementos rup de la api
        this.servicioElementosRUP.get({}).subscribe(elementosRup => {
            this.elementosRUP = elementosRup;
        });

        let hoy = {
            fechaDesde: moment().startOf('day').format(),
            fechaHasta: moment().endOf('day').format()
        }

        // this.fechaDesde = new Date(hoy.fechaDesde);
        // this.fechaHasta = new Date(hoy.fechaHasta);
        // this.loadAgendasXDia(hoy);

        // this.TraetodasLasPrestacionesFiltradas(hoy);

    }

    conceptoSnomed(concepto) {

        console.log(concepto);
        let elemento = elementosRupFunciones.buscarElementoRup(this.elementosRUP, concepto);
        debugger;
        this.crearPrestacionVacia(concepto);

    }



    volverAlInicio() {
        this.paciente = null;
        this.mostrarLista = true;
    }

    loadAgendasXDia(params) {
        if (this.auth.profesional) {
            this.servicioAgenda.get(params).subscribe(
                agendas => {
                    this.agendas = agendas;
                    this.CreaConjuntoPrestacionesProfesional();
                    this.TraetodasLasPrestacionesFiltradas(params);
                    this.pacientesPresentes = [];
                },
                err => {
                    if (err) {
                        console.log(err);
                    }
                });

        } else {
            this.alerta = true;
        }

    }

    /**
     *
     * Genera el listado de tipo de prestaciones
     *
     * @memberof PuntoInicioComponent
     */
    CreaConjuntoPrestacionesProfesional() {
        // Obtenemos los tipos de prestaciones que tiene autorizadas el usuario
        let tipoPrestacionesAuth = this.auth.getPermissions('rup:tipoPrestacion:?');
        if (tipoPrestacionesAuth && (tipoPrestacionesAuth.length > 0)) {
            this.servicioTipoPrestacion.get({
                'incluir': tipoPrestacionesAuth.join(',')
            }).subscribe(resultado => {
                if (resultado) {
                    this.selectPrestacionesProfesional = resultado;
                    this.conjuntoDePrestaciones = resultado;
                }
                // Agregamos los tipos de prestaciones de las agendas filtradas
                if (this.agendas && this.agendas.length > 0) {
                    this.agendas.forEach(agenda => {
                        let agregar = true;
                        this.conjuntoDePrestaciones = [... this.conjuntoDePrestaciones, ...agenda.tipoPrestaciones];
                        this.conjuntoDePrestaciones = this.conjuntoDePrestaciones.filter(function (elem, pos, arr) {
                            return arr.indexOf(elem) === pos;
                        });

                    });
                    this.selectPrestacionesProfesional = [... this.conjuntoDePrestaciones];
                }
            });
        }
    }

    /**
     * Buscar todas las prestaciones ya generadas
     *
     * @param {any} params
     *
     * @memberof PuntoInicioComponent
     */
    TraetodasLasPrestacionesFiltradas(params) {

        let fechaActual = new Date();
        let fechaDesde = fechaActual.setHours(0, 0, 0, 0);
        let fechaHasta = fechaActual.setHours(23, 59, 0, 0);

        this.servicioPrestacion.get({
            // turneables: true,
            fechaDesde: params.fechaDesde || fechaDesde,
            fechaHasta: params.fechaHasta || fechaHasta
        }).subscribe(resultado => {
            if (resultado) {
                this.todasLasPrestaciones = resultado;
            }
            this.cargaPacientes();
        });
    }

    /**
     * Generar listado de posibles pacientes que serán o fueron atendidos
     *
     * @memberof PuntoInicioComponent
     */
    cargaPacientes() {
        this.pacientesPresentes = [];
        let unPacientePresente: any = {};
        // this.agendas.forEach(agenda => {
        //     let turnos: any = [];
        //     // Recorremos los bloques de una agenda para sacar los turnos asignados.
        //     for (let i in agenda.bloques) {
        //         if (i) {
        //             let turnosAsignados = agenda.bloques[i].turnos.filter(turno => (
        //                 (turno.estado === 'asignado') || (turno.paciente && turno.estado === 'suspendido')));
        //             turnos = [...turnos, ...turnosAsignados];
        //         }
        //     }
        //     turnos.forEach(turno => {
        //         unPacientePresente.idAgenda = agenda.id;
        //         unPacientePresente.turno = turno;
        //         unPacientePresente.tipoPrestacion = turno.tipoPrestacion;
        //         // El estado para pacientes que aún no dieron asistencia es Programado
        //         unPacientePresente.estado = 'Programado';
        //         unPacientePresente.fecha = turno.horaInicio;
        //         unPacientePresente.profesionales = agenda.profesionales;
        //         // Cargo el tipo de prestacion y el paciente del turno
        //         unPacientePresente.nombrePrestacion = turno.tipoPrestacion.nombre;
        //         unPacientePresente.paciente = turno.paciente;

        //         if (turno.asistencia === 'asistio') {
        //             unPacientePresente.estado = 'En espera';
        //         } else {
        //             if (turno.estado === 'suspendido') {
        //                 unPacientePresente.estado = 'Suspendido';
        //                 unPacientePresente.fecha = turno.horaInicio;
        //             }
        //         }

        //         // Buscar si existe una prestacion asociada al turno
        //         let prestacionTurno = this.todasLasPrestaciones.find(x => {
        //             if (x.solicitud.idTurno && (x.solicitud.idTurno.toString() === turno._id.toString())) {

        //                 return x;
        //             }
        //         });

        //         if (prestacionTurno) {
        //             unPacientePresente.idPrestacion = prestacionTurno.id;
        //             // Cargo un objeto con el profesional que realizó el ultimo cambio de estado.
        //             unPacientePresente.profesionales = [prestacionTurno.estado[prestacionTurno.estado.length - 1].profesional];
        //             if (prestacionTurno.estado[(prestacionTurno.estado.length - 1)].tipo !== 'pendiente') {
        //                 unPacientePresente.estado = prestacionTurno.estado[prestacionTurno.estado.length - 1].tipo;
        //                 unPacientePresente.fecha = prestacionTurno.estado[prestacionTurno.estado.length - 1].timestamp;
        //             }
        //         }

        //         this.pacientesPresentes = [... this.pacientesPresentes, unPacientePresente];
        //         unPacientePresente = {};
        //     });
        // });

        // Buscamos los que solo tienen prestacion y no tienen turno
        debugger;
        let prestacionesSinTurno = this.todasLasPrestaciones.filter(prestacion => {
            if (prestacion.solicitud.idTurno === null) {
                return prestacion;
            }
        });

        prestacionesSinTurno.forEach(prestacion => {
            unPacientePresente.idAgenda = null;
            unPacientePresente.turno = null;
            unPacientePresente.estado = prestacion.estado[prestacion.estado.length - 1].tipo;
            unPacientePresente.fecha = prestacion.estado[prestacion.estado.length - 1].timestamp;
            unPacientePresente.profesionales = [prestacion.estado[prestacion.estado.length - 1].profesional];

            if (unPacientePresente.estado === 'pendiente') {
                unPacientePresente.estado = 'Programado';
            }

            unPacientePresente.idPrestacion = prestacion.id;
            // //Cargo el tipo de prestacion
            unPacientePresente.nombrePrestacion = prestacion.solicitud.tipoPrestacion.term; // Recorrer las prestaciones si tiene mas de una
            // //Recorro agenda saco el estados
            unPacientePresente.paciente = prestacion.paciente;
            this.pacientesPresentes = [... this.pacientesPresentes, unPacientePresente];
            unPacientePresente = {};
        });
        // Ordenar los turnos y prestaciones por fecha y hora
        this.pacientesPresentes = this.pacientesPresentes.sort((a, b) => { return (a.fecha > b.fecha) ? 1 : ((b.fecha > a.fecha) ? -1 : 0); });
        this.pacientesPresentesCompleto = [... this.pacientesPresentes];
        this.filtrarPacientes(this.filtrosPacientes);
    }

    /**
     * Se selecciona un turno o paciente. Si la prestacion no existe la creamos en este momento
     *
     * @param {any} unPacientePresente
     *
     * @memberof PuntoInicioComponent
     */
    elegirPrestacion(unPacientePresente) {
        if (unPacientePresente.idPrestacion) {
            this.router.navigate(['/rup/resumen', unPacientePresente.idPrestacion]);
        } else {
            // Marcar la asistencia al turno
            if (unPacientePresente.estado !== 'Suspendido' && unPacientePresente.turno.asistencia !== 'asistio') {
                let patch: any = {
                    op: 'darAsistencia',
                    turnos: [unPacientePresente.turno]
                };
                this.servicioAgenda.patchMultiple(unPacientePresente.idAgenda, patch).subscribe(resultado => {
                    if (resultado) {
                        //TODO: Ver si se muestra un mensaje
                    }
                });
            }
            // Si aún no existe la prestación creada vamos a generarla
            let nuevaPrestacion;
            nuevaPrestacion = {
                paciente: unPacientePresente.paciente,
                solicitud: {
                    tipoPrestacion: unPacientePresente.tipoPrestacion,
                    fecha: new Date(),
                    listaProblemas: [],
                    idTurno: unPacientePresente.turno.id ? unPacientePresente.turno.id : null,
                    // profesional logueado
                    profesional:
                    {
                        id: this.auth.profesional.id, nombre: this.auth.usuario.nombre,
                        apellido: this.auth.usuario.apellido, documento: this.auth.usuario.documento
                    },
                    // organizacion desde la que se solicita la prestacion
                    organizacion: { id: this.auth.organizacion.id, nombre: this.auth.organizacion.id.nombre },
                },
                estado: {
                    timestamp: new Date(),
                    tipo: 'pendiente',
                    profesional:
                    {
                        id: this.auth.profesional.id, nombre: this.auth.usuario.nombre,
                        apellido: this.auth.usuario.apellido, documento: this.auth.usuario.documento
                    }
                },
                ejecucion: {
                    fecha: new Date(),
                    evoluciones: []
                }
            };

            this.servicioPrestacion.post(nuevaPrestacion).subscribe(prestacion => {
                if (prestacion) {
                    this.router.navigate(['/rup/resumen', prestacion.id]);
                } else {
                    this.plex.alert('ERROR: no se pudo cargar la prestación');
                }
            });

        }
    }

    onPacienteSelected(paciente: IPaciente): void {
        this.paciente = paciente;
        this.mostrarPacientesSearch = false;
        this.mostrarLista = false;
    }

    /**
     * Crear prestaciones para pacientes que no tienen turno pero se atienden igual
     *
     * @param {any} tipoPrestacion
     *
     * @memberof PuntoInicioComponent
     */
    crearPrestacionVacia(conceptoSnomed) {
        debugger;
        let nuevaPrestacion;
        nuevaPrestacion = {
            paciente: {
                id: this.paciente.id,
                nombre: this.paciente.nombre,
                apellido: this.paciente.apellido,
                documento: this.paciente.documento,
                sexo: this.paciente.sexo,
                fechaNacimiento: this.paciente.fechaNacimiento
            },
            solicitud: {
                tipoPrestacion: conceptoSnomed,
                fecha: new Date(),
                idTurno: null,
                hallazgos: [],
                idPrestacionOrigen: null,
                // profesional logueado
                profesional:
                {
                    id: this.auth.profesional.id, nombre: this.auth.usuario.nombre,
                    apellido: this.auth.usuario.apellido, documento: this.auth.usuario.documento
                },
                // organizacion desde la que se solicita la prestacion
                organizacion: { id: this.auth.organizacion.id, nombre: this.auth.organizacion.id.nombre },
            },
            ejecucion: {
                fecha: new Date(),
                registros: [],
                // profesionales:[] falta asignar.. para obtener el nombre ver si va a venir en token
            },
            estados: {
                fecha: new Date(),
                tipo: 'pendiente'
            }
        };

        nuevaPrestacion.paciente['_id'] = this.paciente.id;
        this.servicioPrestacion.post(nuevaPrestacion).subscribe(prestacion => {
            this.plex.alert('Prestación creada.').then(() => {
                this.paciente = null;
                this.mostrarPacientesSearch = true;
                this.mostrarLista = true;
                // this.router.navigate(['/rup/resumen', prestacion.id]);
            });
        });
    }

    onReturn() {
        this.router.navigate(['/rup']);
    }

    /**
     * Cargar combo de prestaciones que puede ver o agregar el profesional para filtrar
     * @param {any} $event
     * @returns
     *
     * @memberof PuntoInicioComponent
     */
    loadPrestacionesProfesional($event) {
        return $event.callback(this.selectPrestacionesProfesional);
    }

    /**
     * Cargar combo de estados para filtrar prestaciones
     * @param {any} $event
     * @returns
     *
     * @memberof PuntoInicioComponent
     */
    loadEstados($event) {
        return $event.callback([{ id: 'Programado', nombre: 'Programado' }, { id: 'En espera', nombre: 'En espera' }, { id: 'ejecucion', nombre: 'En ejecución' }, { id: 'validada', nombre: 'Validada' }, { id: 'Suspendido', nombre: 'Suspendido' }]);
    }


    /**
     * Regenerar el listado de agendas filtradas por fechas
     *
     * @memberof PuntoInicioComponent
     */
    filtrarPorFecha() {
        this.todasLasPrestaciones = [];
        // this.pacientesPresentes = [];
        let fechaDesde = moment(this.fechaDesde).startOf('day');
        let fechaHasta = moment(this.fechaHasta).endOf('day');

        if (fechaDesde.isValid() && fechaHasta.isValid()) {
            let params = {
                fechaDesde: fechaDesde.format(),
                fechaHasta: fechaHasta.format()
            };
            this.loadAgendasXDia(params);
        } else {
            this.plex.info('danger', 'ERROR: fechas invalidas');
        }
    }

    /**
     * Filtrar el listado de pacientes
     *
     * @param {boolean} misPacientes: solo listar los pacientes del profesional
     *
     * @memberof PuntoInicioComponent
     */
    filtrarPacientes(misPacientes: boolean) {
        this.filtrosPacientes = misPacientes;
        let listadoFiltrado = [... this.pacientesPresentesCompleto];

        // solo los pacientes del profesional logueado
        if (this.filtrosPacientes) {
            listadoFiltrado = listadoFiltrado.filter(paciente => {
                if (paciente.profesionales.length > 0) {
                    if (paciente.profesionales.find(profesional => profesional.id === this.auth.profesional.id)) {
                        return paciente;
                    }
                }
            });
        }

        // por tipo de prestación
        if (this.prestacionSeleccion) {
            listadoFiltrado = listadoFiltrado.filter(paciente => {
                if (paciente.nombrePrestacion === this.prestacionSeleccion.nombre) {
                    return paciente;
                }
            });
        }

        // por estado
        if (this.estadoSeleccion) {
            listadoFiltrado = listadoFiltrado.filter(paciente => {
                if (paciente.estado === this.estadoSeleccion.id) {
                    return paciente;
                }
            });
        }

        this.pacientesPresentes = [...listadoFiltrado];

    }


    /**************** RELACION CON MPI **********************/

    /**
     * @returns Realiza la búsqueda de pacientes localmente y si no existe lo busca en mpi
     *
     * @memberof PuntoInicioComponent
     */
    buscar() {
        this.cargaPacientes();

        let pacientesFiltrados: any = [];
        if (this.searchTerm) {
            let search = this.searchTerm.toUpperCase();
            pacientesFiltrados = this.pacientesPresentes.filter(paciente => {
                let nombreCompleto = paciente.paciente.apellido + ' ' + paciente.paciente.nombre;
                if (nombreCompleto.indexOf(search) !== -1 || paciente.paciente.nombre.indexOf(search) !== -1 || paciente.paciente.apellido.indexOf(search) !== -1 || paciente.paciente.documento.indexOf(search) !== -1) {
                    return paciente;
                }
            });
            this.pacientesPresentes = pacientesFiltrados;
            if (this.pacientesPresentes.length <= 0 && this.searchTerm.length > 0) {
                this.buscarMPI = true;
            } else {
                this.buscarMPI = false;
            }
        }
    }


    /**
     * Reinicia la búsqueda en la tabla de acuerdo al output de componente pacienteSearch
     *
     * @param {any} event
     *
     * @memberof PuntoInicioComponent
     */
    handleBlanqueo(event) {
        this.buscarMPI = false;
        this.searchTerm = null;
        this.volverAlInicio();
        this.cargaPacientes();
    }

    /**************** /RELACION CON MPI **********************/

} // export class Punto Inicio Component


