import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Server } from '@andes/shared';
import { IElementoRUP } from './../interfaces/elementoRUP.interface';
import { IElementosRUPCache } from './../interfaces/elementosRUPCache.interface';
import { ISnomedConcept } from './../interfaces/snomed-concept.interface';

const url = '/modules/rup/elementosRUP';

@Injectable()
export class ElementosRUPService {
    // Mantiene un caché de la base de datos de elementos
    public cache: IElementosRUPCache = {};
    public cacheById: IElementosRUPCache = {};
    // Mantiene un caché de la base de datos de elementos
    private cacheParaSolicitud: IElementosRUPCache = {};
    // Precalcula los elementos default
    private defaults: IElementosRUPCache = {};
    // Precalcula los elementos default para solicitudes
    private defaultsParaSolicitud: IElementosRUPCache = {};

    // Indica que el servicio está listo para usarse.
    // BehaviorSubject permite que el subscribe se ejecute con el ultimo valor (aunque no haya cambios)
    public ready = new BehaviorSubject<boolean>(false);

    /**
     * Este objeto se llena con el valor de params de un elementoRUP,
     * según cómo esté definido en la colección dentro de sus "requeridos"
     * Su estructura es
     * 'conceptId': {
            titulo: 'My título',
            refsetId: 'conceptId',
            tipoSelect: 'radio' | 'select',
            multiple: true | false
        }
     */
    public coleccionRetsetId = {};

    constructor(private server: Server) {
        // Precachea la lista completa de elementos RUP
        this.server.get(url).subscribe((data: IElementoRUP[]) => {
            this.cache = {};
            data.forEach(e => this.cacheById[e.id] = e);
            // Precalcula los defaults
            data.filter(e => !e.inactiveAt).forEach(elementoRUP => {
                elementoRUP.conceptos.forEach((concepto) => {
                    if (elementoRUP.esSolicitud) {
                        this.cacheParaSolicitud[concepto.conceptId] = elementoRUP;
                    } else {
                        this.cache[concepto.conceptId] = elementoRUP;
                    }
                });
                if (elementoRUP.defaultFor && elementoRUP.defaultFor.length) {
                    elementoRUP.defaultFor.forEach((semanticTag) => {
                        if (elementoRUP.esSolicitud) {
                            this.defaultsParaSolicitud[semanticTag] = elementoRUP;
                        } else {
                            this.defaults[semanticTag] = elementoRUP;
                        }
                    });
                }
            });

            // Notifica que el servicio está listo
            this.ready.next(true);
        });
    }

    /**
     * Metodo get. Trae el objeto elementoRup.
     * @param {any} params Opciones de busqueda
     */
    get(params: any): Observable<IElementoRUP[]> {
        return this.server.get(url, { params: params, showError: true });
    }

    /**
     * Metodo getById. Trae el objeto elementoRup por su Id.
     * @param {String} id Busca por Id
     */
    getById(id: String): Observable<IElementoRUP> {
        return this.server.get(url + '/' + id, null);
    }

    /**
     * Metodo post. Inserta un objeto elementoRup nuevo.
     * @param {IElementoRUP} elementoRup Recibe IElementoRUP
     */
    post(elementoRup: IElementoRUP): Observable<IElementoRUP> {
        return this.server.post(url, elementoRup);
    }

    /**
     * Metodo put. Actualiza un objeto elementoRup nuevo.
     * @param {IElementoRUP} elementoRup Recibe IElementoRUP
     */
    put(elementoRup: IElementoRUP): Observable<IElementoRUP> {
        return this.server.put(url + '/' + elementoRup.id, elementoRup);
    }

    /**
     * Metodo disable. deshabilita elementoRup.
     * @param {IElementoRUP} elementoRup Recibe IElementoRUP
     */
    disable(elementoRup: IElementoRUP): Observable<IElementoRUP> {
        elementoRup.activo = false;
        return this.put(elementoRup);
    }

    /**
     * Metodo enable. habilita elementoRup.
     * @param {IElementoRUP} elementoRup Recibe IElementoRUP
     */
    enable(elementoRup: IElementoRUP): Observable<IElementoRUP> {
        elementoRup.activo = true;
        return this.put(elementoRup);
    }


    /**
     * Busca el elementoRUP que implemente el concepto o la instancia que fue utilizada en su momento
     * segun el ID del elementoRUP.
     *
     * @param {IPrestacionRegistro} registro Registro de una prestación
     * @returns {IElementoRUP} Elemento que implementa el concepto
     * @memberof ElementosRUPService
     */
    elementoRegistro(registro) {
        if (registro.elementoRUP) {
            return this.cacheById[registro.elementoRUP];
        } else {
            return this.buscarElemento(registro.concepto, registro.esSolicitud);
        }
    }

    /**
     * Devuelve los parametros de un elementoRUP.
     *
     * @param {IPrestacionRegistro} registro Registro de una prestación
     * @returns {IElementoRUP} Elemento que implementa el concepto
     * @memberof ElementosRUPService
     */

    getParams(registro) {
        const elem = this.elementoRegistro(registro);
        if (elem) {
            return elem.params;
        }
        return {};
    }

    /**
     * Busca el elementoRUP que implemente el concepto
     *
     * @param {ISnomedConcept} concepto Concepto de SNOMED
     * @param {boolean} esSolicitud Indica si es una solicitud
     * @returns {IElementoRUP} Elemento que implementa el concepto
     * @memberof ElementosRUPService
     */
    buscarElemento(concepto: ISnomedConcept, esSolicitud: boolean): IElementoRUP {
        // Busca el elemento RUP que implemente el concepto
        if (typeof concepto.conceptId === 'undefined') {
            concepto = concepto[1];
        }

        // TODO: ver cómo resolver esto mejor...
        concepto.semanticTag = concepto.semanticTag === 'plan' ? 'procedimiento' : concepto.semanticTag;
        if (esSolicitud) {
            let elemento = this.cacheParaSolicitud[concepto.conceptId];
            if (elemento) {
                return elemento;
            } else {
                return this.defaultsParaSolicitud[concepto.semanticTag];
            }
        } else {
            let elemento = this.cache[concepto.conceptId];
            if (elemento) {
                return elemento;
            } else {
                return this.defaults[concepto.semanticTag];
            }
        }
    }

    getConceptosInternacion() {
        let conceptosInternacion = {
            // Lo pongo así porque no tiene sentido lo que hicieron con los otros conceptos
            // Pronto este listado no tiene más sentido
            valoracionInicial: {
                conceptId: '5491000013101',
                term: 'evaluación médica inicial',
                fsn: 'evaluación médica inicial (procedimiento)',
                semanticTag: 'procedimiento',
            },
            evolucion: {
                conceptId: '5971000013106',
                term: 'evolución médica',
                fsn: 'evolución médica (procedimiento)',
                semanticTag: 'procedimiento',
            },
            indicaciones: {
                conceptId: '4981000013105',
                term: 'plan de indicaciones médicas',
                fsn: 'plan de indicaciones médicas (procedimiento)',
                semanticTag: 'procedimiento',
            },
            epicrisis: this.cache['2341000013106'] ? this.cache['2341000013106'].conceptos[0] : null,
            ingreso: this.cache['721915006'] ? this.cache['721915006'].conceptos[0] : null,
            egreso: this.cache['58000006'] ? this.cache['58000006'].conceptos[0] : null
        };
        return conceptosInternacion;
    }

    desvincularOdontograma(registrosRelacionados, regitroActual, registroId) {
        if (registrosRelacionados[registroId] && registrosRelacionados[registroId].cara) {
            const cara = registrosRelacionados[registroId].cara;
            const term = registrosRelacionados[registroId].concepto.term;
            return regitroActual.relacionadoCon.filter(rr => rr.cara !== cara || rr.concepto.term !== term);
        } else {
            return regitroActual.relacionadoCon;
        }
    }


}
