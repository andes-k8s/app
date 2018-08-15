import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Plex } from '@andes/plex';
import { Auth } from '@andes/auth';
import * as moment from 'moment';
// Servicios
import { TurnoService } from '../../../services/turnos/turno.service';

@Component({
    selector: 'estadisticas-agendas',
    templateUrl: 'estadisticas-agendas.html'
})

export class EstadisticasAgendasComponent implements OnInit {

    cantTurnosAsignados = 125;
    turnosPacientesValidados = 0;
    turnosPacientesTemporales = 0;
    cantTurnosRestantes = 0;
    cantTurnosSuspendidos = 0;
    turnosVerificados = 0;
    turnosCodificados = 0;
    turnosAuditados = 0;
    // Inicialización
    constructor(public serviceTurno: TurnoService, public plex: Plex, public auth: Auth) { }

    ngOnInit() {
        // Se cargan los datos calculados
        this.cantidadTurnosPorEstadoPaciente(this.auth.usuario);
        this.cantidadTotalDeTurnosAsignados();
        this.cantidadTurnosconAsistenciaVerificada(this.auth.usuario);
        this.cantidadTurnosCodificados();
    }

    cantidadTurnosPorEstadoPaciente(userLogged) {
        const datosTurno = { estado: 'asignado', userName: userLogged.username, userDoc: userLogged.documento };
        let countTemporal = 0;
        let countValidado = 0;

        this.serviceTurno.getTurnos(datosTurno).subscribe(turnos => {
            turnos.forEach(turno => {
                if (turno.paciente.estado === 'temporal') {
                    countTemporal++;
                } else {
                    countValidado++;
                }
            });
            this.turnosPacientesTemporales = countTemporal;
            this.turnosPacientesValidados = countValidado;
        });
    }

    cantidadTotalDeTurnosAsignados() {
        const fecha = moment().format();
        const today = moment(fecha).startOf('day');

        const datosTurno = { estado: 'asignado' };
        this.serviceTurno.getTurnos(datosTurno).subscribe(turnos => {
            this.cantTurnosAsignados = turnos.length;
        });
    }

    cantidadTurnosconAsistenciaVerificada(userLogged?) {
        // TurnosChequeados por usuario o total depende si se envia el usuario
        const datosTurno = { asistencia: true };
        if (userLogged) {
            datosTurno['usuario'] = userLogged;
        }
        this.serviceTurno.getTurnos(datosTurno).subscribe(turnos => {
            this.turnosVerificados = turnos.length;
        });
    }

    cantidadTurnosCodificados() {
        const datosTurno = { codificado: true };
        this.serviceTurno.getTurnos(datosTurno).subscribe(turnos => {
            this.turnosAuditados = turnos.filter(item => item.asistencia &&
                (item.asistencia === 'noAsistio' || item.asistencia === 'sinDatos' ||
                    (item.diagnostico.codificaciones[0] && item.diagnostico.codificaciones[0].codificacionAuditoria && item.diagnostico.codificaciones[0].codificacionAuditoria.codigo))).length;
        });
    }

}
