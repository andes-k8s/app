import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '@andes/auth';
import { Plex } from '@andes/plex';
import { MapaCamasService } from '../../services/mapa-camas.service';
import { Observable, Subject } from 'rxjs';
import { MapaCamasHTTP } from '../../services/mapa-camas.http';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-integridad-camas',
    templateUrl: 'integridad-camas.component.html',
})

export class IntegridadCamasComponent implements OnInit {
    public lista = new Subject();
    public listaInconsistencias$: Observable<any[]>;

    public ambito = 'internacion';
    public capa: string;

    constructor(
        public auth: Auth,
        private router: Router,
        private plex: Plex,
        private mapaHTTP: MapaCamasHTTP,
    ) { }

    ngOnInit() {
        this.plex.updateTitle([{
            route: '/inicio',
            name: 'Andes'
        }, {
            route: '/internacion/mapa-camas',
            name: 'Internacion'
        }, {
            name: 'Integridad'
        }]);

        const capaArr  = this.auth.getPermissions('internacion:rol:?');
        if (capaArr.length === 1) {
            this.capa = capaArr[0];
            this.listaInconsistencias$ = this.mapaHTTP.listaInconsistencias(this.ambito, this.capa);
        } else {
            this.router.navigate(['/inicio']);
        }
    }
}
