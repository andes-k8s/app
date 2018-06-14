import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { Auth } from '@andes/auth';
import { Plex } from '@andes/plex';
import { ITurno } from './../../interfaces/turnos/ITurno';
import { PacienteService } from './../../services/paciente.service';
import { IPaciente } from '../../interfaces/IPaciente';

@Component({
    selector: 'carpeta-paciente',
    templateUrl: 'carpeta-paciente.html'
})

export class CarpetaPacienteComponent implements OnInit {

    indiceCarpeta: number;
    carpetaEfectores = [];
    nroCarpetaOriginal: string;
    @Input() turnoSeleccionado: ITurno;
    @Input() pacienteSeleccionado: IPaciente;
    @Output() guardarCarpetaEmit = new EventEmitter<boolean>();
    @Output() cancelarCarpetaEmit = new EventEmitter<boolean>();

    autorizado: any;
    permisosRequeridos = 'turnos:agenda:puedeEditarCarpeta';
    carpetaPaciente: any;
    paciente: any;
    constructor(public auth: Auth, public plex: Plex, public servicioPaciente: PacienteService) { }

    ngOnInit() {

        // Verificamos permiso para editar carpeta de un paciente
        this.autorizado = this.auth.check(this.permisosRequeridos);

        if (this.autorizado) {
            this.carpetaPaciente = {
                organizacion: {
                    _id: this.auth.organizacion.id,
                    nombre: this.auth.organizacion.nombre
                },
                nroCarpeta: ''
            };
            // Hay paciente?
            if (this.turnoSeleccionado && this.turnoSeleccionado.paciente.id) {
                this.paciente = this.turnoSeleccionado.paciente;
                // Obtenemos el paciente completo. (entró por parametro el turno)
                this.servicioPaciente.getById(this.paciente.id).subscribe(resultado => {
                    this.paciente = resultado;
                    this.getCarpetas(this.paciente);
                });

            } else {
                if (this.pacienteSeleccionado) {
                    // entró paciente por parámetro, no hace falta hacer otro get paciente.
                    this.paciente = this.pacienteSeleccionado;
                    this.getCarpetas(this.paciente);
                } else {
                    this.plex.alert('No hay ningún paciente seleccinado', 'Error obteniendo carpetas');
                }
            }

        }
    }

    private getCarpetas(paciente) {
        if (paciente.carpetaEfectores.length > 0) {
            // Filtramos y traemos sólo la carpeta de la organización actual
            this.carpetaEfectores = paciente.carpetaEfectores;
            this.carpetaPaciente = paciente.carpetaEfectores.find(x => {
                return (x.organizacion as any)._id === this.auth.organizacion.id;
            });
            this.nroCarpetaOriginal = this.carpetaPaciente.nroCarpeta;

        }
        if (this.indiceCarpeta === -1) {
            // Si no hay carpeta en el paciente MPI, buscamos la carpeta en colección carpetaPaciente, usando el nro. de documento
            this.servicioPaciente.getNroCarpeta({ documento: paciente.documento, organizacion: this.auth.organizacion.id }).subscribe(carpeta => {
                if (carpeta.nroCarpeta) {
                    this.carpetaPaciente = carpeta;
                }
            });
        }
    }


    guardarCarpetaPaciente() {
        if (this.carpetaPaciente.nroCarpeta && this.carpetaPaciente.nroCarpeta !== '' && this.carpetaPaciente.nroCarpeta !== this.nroCarpetaOriginal) {

            this.carpetaPaciente.nroCarpeta = this.carpetaPaciente.nroCarpeta.trim();
            if (this.indiceCarpeta > -1) {
                this.carpetaEfectores[this.indiceCarpeta] = this.carpetaPaciente;
            } else {
                this.carpetaEfectores.push(this.carpetaPaciente);
            }

            this.servicioPaciente.patch(this.paciente.id, { op: 'updateCarpetaEfectores', carpetaEfectores: this.carpetaEfectores }).subscribe(resultadoCarpeta => {
                this.guardarCarpetaEmit.emit(true);
                this.plex.toast('success', 'Nuevo número de carpeta establecido');
            }, error => {
                this.plex.toast('danger', 'El número de carpeta ya existe');
            });
        } else {
            this.guardarCarpetaEmit.emit(true);
        }
    }

    cancelar() {
        this.cancelarCarpetaEmit.emit(true);
    }

}
