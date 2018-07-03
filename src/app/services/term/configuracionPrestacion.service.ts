import { Server } from '@andes/shared';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class ConfiguracionPrestacionService {
    private configPres = '/core/term/configuracionPrestaciones';  // URL to web api
    constructor(private server: Server) { }

    get(params: any): Observable<any[]> {
        return this.server.get(this.configPres, { params: params, showError: true });
    }

    put(params: any): Observable<any> {
        console.log('put: ', params);
        return this.server.put(this.configPres, { query: params, showError: true });
    }

    post(params: any): Observable<any[]> {
        console.log('post: ', params);
        return this.server.post(this.configPres, { params: params, showError: true });
    }
}
