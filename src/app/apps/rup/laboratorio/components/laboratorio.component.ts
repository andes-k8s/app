import { Constantes } from './../controllers/constants';
import { LaboratorioContextoCacheService } from './../services/protocoloCache.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-laboratorio',
    templateUrl: 'laboratorio.html'
})
export class LaboratorioComponent implements OnInit {

    public mostrarPuntoInicio;
    public turno;
    public protocolo;
    public paciente;
    private contextoCache;

    constructor(public laboratorioContextoCacheService: LaboratorioContextoCacheService) { }

    ngOnInit() {
        this.contextoCache = this.laboratorioContextoCacheService.getContextoCache();
        this.mostrarPuntoInicio = this.laboratorioContextoCacheService.isModoRecepcionSinTurno();
        let turno = this.contextoCache.turno;
        if (!this.mostrarPuntoInicio) {
            this.laboratorioContextoCacheService.resetContexto();
            this.contextoCache = this.laboratorioContextoCacheService.getContextoCache();
        }
        if (turno) {
            this.contextoCache.turno = turno;
        }
    }

    seleccionarProtocolo($event) {
        this.mostrarPuntoInicio = false;
        this.protocolo = $event.protocolo;
    }

    recepcionarSinTurno($event) {
        this.laboratorioContextoCacheService.cambiarModo(Constantes.modos.recepcionSinTurno);
        this.contextoCache.edicionDatosCabecera = true;
        this.mostrarPuntoInicio = false;
        this.paciente = $event;
    }

    recepcionarTurno($event) {
        this.turno = $event.turno;
        this.contextoCache.edicionDatosCabecera = false;
        this.laboratorioContextoCacheService.modoRecepcion();
        this.mostrarPuntoInicio = false;
    }

}
