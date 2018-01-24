import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Plex } from '@andes/plex';
import { setTimeout } from 'timers';

@Component({
    selector: 'app-cama',
    templateUrl: './cama.component.html',
    styleUrls: ['./cama.component.css'],
    encapsulation: ViewEncapsulation.None // Use to disable CSS Encapsulation for this component
})
export class CamaComponent implements OnInit {

    @Input() cama: any;

    // opciones dropdown cama internada
    public opcionesDropdown: any = [];

    constructor(private plex: Plex) { }

    ngOnInit() {
        this.opcionesDropdown = [
            {
                label: 'Valoración inicial enfermería',
                handler: (() => {
                    // this.verValoracionInicial(scope.cama.idInternacion);
                    alert('TODO');
                })
            },
            {
                label: 'Valoración inicial médica',
                handler: (() => {
                    // this.verValoracionMedica(scope.cama.idInternacion);
                    alert('TODO');
                })
            },
            {
                label: 'Desocupar cama',
                handler: (() => {
                    // this.egresarPaciente(scope.cama);
                    alert('TODO');
                })
            }
        ];
    }

    public cambiarEstado(cama, estado) {
        /*
        this.organizacionesService.cambiarEstado(this.auth.organizacion.id, cama.id).then(cama => {
            let msg = '';

            switch (estado) {
                case 'reparacion':
                    msg = ' enviada a reparación';
                    break;
                case 'desinfectada':
                    msg = ' desinfectada';
                    break;
                case 'bloqueada':
                    msg = ' bloqueada';
                    break;
                case 'desocupada':
                    if (cama.$action === 'reparacion') {
                        msg = ' reparada';
                    } else if (cama.$action === 'bloquear') {
                        msg = ' desbloqueada';
                    } else {
                        msg = ' desocupada';
                    }
                break;
            }

            this.plex.toast('success', 'Cama ' + msg, 'Cambio estado');

            // rotamos card
            setTimeout(() => {
                cama.$rotar = false;
            }, 100);
        }, (err) => {
            this.plex.info('danger', err, 'Error');
        });
        */
    }
}
