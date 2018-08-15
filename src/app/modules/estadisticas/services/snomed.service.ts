import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Server } from '@andes/shared';

/**
 * Repetido por ahora hasta modularizar mejor los componentes.
 * Deberíams hacer un ngModule de servicios o ngModule de Snomed por lo menos.
 */

@Injectable()
export class SnomedService {
    private snomedURL = '/core/term/snomed';  // URL to web api
    private snomedURLProblema = '/core/term/snomed/problema';  // URL to web api
    private snomedURLProcedimiento = '/core/term/snomed/procedimiento';  // URL to web api
    private snomedURLEquipamiento = '/core/term/snomed/equipamiento';  // URL to web api
    private snomedURLexpression = '/core/term/snomed/expression';

    constructor(private server: Server) {
    }

    get(params: any): Observable<any[]> {
        return this.server.get(this.snomedURL, { params, showError: true });
    }

    getProblemas(params: any): Observable<any[]> {
        return this.server.get(this.snomedURLProblema, { params, showError: true });
    }

    getProcedimientos(params: any): Observable<any[]> {
        return this.server.get(this.snomedURLProcedimiento, { params, showError: true });
    }

    getEquipamientos(params: any): Observable<any[]> {
        return this.server.get(this.snomedURLEquipamiento, { params, showError: true });
    }

    getProductos(params: any): Observable<any[]> {
        return this.server.get(this.snomedURL + '/producto', { params, showError: true });
    }

    getCie10(params: any): Observable<any> {
        return this.server.get(this.snomedURL + '/map', { params, showError: true });
    }

    getQuery(params: any): Observable<any[]> {
        return this.server.get(this.snomedURLexpression, { params, showError: true });
    }
}
