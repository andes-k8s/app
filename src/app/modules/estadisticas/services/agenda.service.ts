import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Auth } from '@andes/auth';
import { Server } from '@andes/shared';

@Injectable()
export class EstAgendasService {

    private baseURL = '/modules/turnos';  // URL to web api

    constructor(private server: Server, public auth: Auth) { }

    /**
     *
     * @param params Filtros de busqueda
     */

    get (params) {
        return this.server.get(this.baseURL + '/estadistica', { params });
    }

    post (params) {
        return this.server.post(this.baseURL + '/estadistica', params);
    }

    postFiltroPorCiudad (params) {
        return this.server.post(this.baseURL + '/filtroPorCiudad', params);
    }

}
