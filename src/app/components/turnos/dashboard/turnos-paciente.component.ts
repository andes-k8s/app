import { Component, Input, OnInit, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { Plex } from '@andes/plex';
import { Auth } from '@andes/auth';
import * as moment from 'moment';

// Interfaces
import { IPaciente } from './../../../interfaces/IPaciente';

// Servicios
import { TurnoService } from '../../../services/turnos/turno.service';
import { AgendaService } from '../../../services/turnos/agenda.service';
import { IAgenda } from '../../../interfaces/turnos/IAgenda';
import { ITurno } from '../../../interfaces/turnos/ITurno';
@Component({
    selector: 'turnos-paciente',
    templateUrl: 'turnos-paciente.html',
    styleUrls: ['turnos-paciente.scss'],
    encapsulation: ViewEncapsulation.None // Use to disable CSS Encapsulation for this component
})

export class TurnosPacienteComponent implements OnInit {
    agenda: IAgenda;
    showLiberarTurno: boolean;

    _paciente: IPaciente;
    _operacion: string;
    tituloOperacion = 'Operaciones de Turnos';
    turnosPaciente = [];
    turnosSeleccionados: any[] = [];


    @Input('operacion')
    set operacion(value: string) {
        this._operacion = value;
    }
    get operacion(): string {
        return this._operacion;
    }

    @Input('paciente')
    set paciente(value: IPaciente) {
        this._paciente = value;
        if (value) {
            let datosTurno = { pacienteId: this._paciente.id };
            // Obtenemos los turnos del paciente, quitamos los viejos y aplicamos orden descendente
            this.serviceTurno.getTurnos(datosTurno).subscribe(turnos => {
                this.turnosPaciente = turnos.filter(t => {
                    return moment(t.horaInicio).isSameOrAfter(new Date(), 'day');
                });
                this.turnosPaciente = this.turnosPaciente.sort((a, b) => {
                    return moment(a.horaInicio).isAfter(moment(b.horaInicio)) ? 0 : 1;
                });
            });
        }
    }
    get paciente(): IPaciente {
        return this._paciente;
    }

    // Inicialización
    constructor(public serviceTurno: TurnoService, public serviceAgenda: AgendaService, public plex: Plex, public auth: Auth) { }

    ngOnInit() {
    }

    eventosTurno(turno, operacion) {
        let mensaje = '';
        let tipoToast = 'info';
        let patch: any = {
            op: operacion,
            turnos: [turno],
            'idTurno': turno._id
        };

        // Patchea los turnosSeleccionados (1 o más turnos)
        this.serviceAgenda.patchMultiple(turno.agenda_id, patch).subscribe(resultado => {
            let agenda = resultado;

            let datosTurno = { pacienteId: this._paciente.id };
            this.serviceTurno.getTurnos(datosTurno).subscribe(turnos => {
                this.turnosPaciente = turnos;
                switch (operacion) {
                    case 'darAsistencia':
                        mensaje = 'Se registro la asistencia del paciente';
                        tipoToast = 'success';
                        break;
                    case 'sacarAsistencia':
                        mensaje = 'Se registro la inasistencia del paciente';
                        tipoToast = 'warning';
                        break;
                    case 'liberarTurno':
                        break;
                }
                if (mensaje !== '') {
                    this.plex.toast(tipoToast, mensaje);
                }
            });
        });

    }

    liberarTurno(turno) {
        this.turnosSeleccionados = [turno];
        this.serviceAgenda.getById(turno.agenda_id).subscribe(resultado => {
            this.agenda = resultado;
            this.showLiberarTurno = true;
        });
    }

    cancelaLiberarTurno() {
        this.showLiberarTurno = false;
    }
    saveLiberarTurno(agenda: any) {
        this.eventosTurno(this.turnosSeleccionados[0], 'liberarTurno');
        this.showLiberarTurno = false;
    }
}
