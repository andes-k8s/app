import { Component, Input, EventEmitter, Output, OnInit, HostBinding, ViewEncapsulation } from '@angular/core';
import { Plex } from '@andes/plex';
import { Auth } from '@andes/auth';
import { IAgenda } from './../../../../interfaces/turnos/IAgenda';
import { PacienteService } from './../../../../services/paciente.service';
import * as moment from 'moment';

@Component({
    selector: 'listar-turnos',
    templateUrl: 'listar-turnos.html',
    styleUrls: ['listar-turnos.print.scss'],
    // Use to disable CSS Encapsulation for this component
    encapsulation: ViewEncapsulation.None
})

export class ListarTurnosComponent implements OnInit {

    private _agenda;
    @Input('agenda')
    set agenda(value: any) {
        this._agenda = value;
        let turnos = [];
        for (let i = 0; i < this.agenda.bloques.length; i++) {
            turnos = turnos.concat(this.agenda.bloques[i].turnos);
            // this.turnosAsignados = (this.agenda.bloques[i].turnos).filter((turno) => {
        }
        if (this.agenda.sobreturnos.length > 0) {
            turnos = turnos.concat(this.agenda.sobreturnos);
        }

        this.turnosAsignados = (turnos).filter((turno) => {
            return (turno.paciente && turno.paciente.id) && (turno.estado === 'asignado' || turno.estado === 'suspendido');
        });
    }
    get agenda(): any {
        return this._agenda;
    }

    @Output() volverAlGestor = new EventEmitter<boolean>();
    @HostBinding('class.plex-layout') layout = true;

    autorizado = false;
    showListarTurnos = true;
    turnosAsignados = [];
    public idOrganizacion = this.auth.organizacion.id;

    constructor(public plex: Plex, public servicePaciente: PacienteService, public auth: Auth) { }

    ngOnInit() {
        this.autorizado = this.auth.getPermissions('turnos:agenda:puedeImprimir:').length > 0;
    }

    // Abre diálogo de impresión del navegador
    imprimir() {
        window.print();
    }

    // Vuelve al gestor
    cancelar() {
        this.volverAlGestor.emit(true);
        this.showListarTurnos = false;
    }

}