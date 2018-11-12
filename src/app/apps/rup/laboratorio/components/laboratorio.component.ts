import { Component } from '@angular/core';

@Component({
    selector: 'app-laboratorio',
    templateUrl: 'laboratorio.html'
})
export class LaboratorioComponent {
    public mostrarPuntoInicio = false;

    // valor se debe asignar segun permuiso de usuario
    public modo = 'control';
    // public modo = "puntoInicio";

    public protocolo;
    public paciente;

    seleccionarProtocolo($event) {
        console.log('principal seleccionarProtocolo', $event);
        this.mostrarPuntoInicio = false;
        this.protocolo = $event.protocolo;
    }

    recepcionarSinTurno($event) {
        console.log('lab recepcionarSinTurno', $event);
        this.mostrarPuntoInicio = false;
        this.paciente = $event;
    }
}
