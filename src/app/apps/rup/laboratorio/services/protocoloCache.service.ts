import { Constantes } from './../controllers/constants';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

Injectable();
export class LaboratorioContextoCacheService {

    private contextoCache = new BehaviorSubject<any>({ modo: null });

    /**
     *
     *
     * @param {*} prestacion
     * @memberof LaboratorioContextoCacheService
     */
    setContextoCache(prestacion: any) {
        this.contextoCache.next(prestacion);
    }

    resetContexto() {
        this.contextoCache.next(
            {
                cargarPorPracticas: false,
                modo: {
                    id: 0,
                    nombre: 'listado',
                    titulo: 'Listado'
                },
                modoCargaLaboratorio: null,
            }
        );
    }

    /**
     *
     *
     * @returns {*}
     * @memberof LaboratorioContextoCacheService
     */
    getContextoCache(): any {
        return (this.contextoCache.asObservable().source as any)._value;
    }

    /**
     *
     *
     * @param {*} modoId
     * @memberof LaboratorioContextoCacheService
     */
    cambiarModo(modoId) {
        modoId++;
        if (modoId !== Constantes.modos.carga.id) {
            this.getContextoCache().modoCargaLaboratorio = null;
        }

        if (modoId === Constantes.modos.recepcion.id) {
            this.getContextoCache().modo = Constantes.modos.recepcion;
        } else if (modoId === Constantes.modos.recepcionSinTurno.id) {
            this.modoRecepcionSinTurno();
        } else if (modoId === Constantes.modos.control.id) {
            this.modoControl();
        } else if (modoId === Constantes.modos.carga.id) {
            this.getContextoCache().modo = Constantes.modos.carga;
        } else if (modoId === Constantes.modos.validacion.id) {
            this.getContextoCache().modo = Constantes.modos.validacion;
        } else if (modoId === Constantes.modos.listado.id) {
            this.getContextoCache().modo = Constantes.modos.listado;
        }
    }


    /**
     *
     *
     * @memberof LaboratorioContextoCacheService
     */
    modoRecepcion() {
        this.getContextoCache().modo = Constantes.modos.recepcion;
    }
    /**
     *
     *
     * @memberof LaboratorioContextoCacheService
     */
    modoRecepcionSinTurno() {
        this.getContextoCache().modo = Constantes.modos.recepcionSinTurno;
    }

    /**
     *
     *
     * @memberof LaboratorioContextoCacheService
     */
    modoControl() {
        this.getContextoCache().modo = Constantes.modos.control;
    }

    /**
     *
     *
     * @memberof LaboratorioContextoCacheService
     */
    irAuditoriaProtocolo() {
        this.getContextoCache().modoAVolver = this.getContextoCache().modo;
        this.modoControl();
    }

    /**
     *
     *
     * @memberof LaboratorioContextoCacheService
     */
    aceptarCambiosAuditoriaProtocolo() {
        this.getContextoCache().ocultarPanelLateral = false;
        this.getContextoCache().modo = this.getContextoCache().modoAVolver;
        // this.getContextoCache().modoAVolver = null;
    }

    /**
     *
     *
     * @memberof LaboratorioContextoCacheService
     */
    salirDeHistoricoResultados() {
        this.getContextoCache().modo = Constantes.modos.validacion;
        this.getContextoCache().botonesAccion = 'validacion';
        this.getContextoCache().mostrarCuerpoProtocolo = true;
        this.getContextoCache().verHistorialResultados = false;
    }

    /**
     *
     *
     * @memberof LaboratorioContextoCacheServicethis
     */
    seleccionarProtocolo() {
        this.getContextoCache().edicionDatosCabecera = false;
        this.getContextoCache().mostrarCuerpoProtocolo = (!this.isModoRecepcionSinTurno());
        this.getContextoCache().ocultarPanelLateral =
            (this.isModoRecepcionSinTurno()) || this.getContextoCache().cargarPorPracticas;
    }

    /**
     *
     *
     * @memberof LaboratorioContextoCacheService
     */
    setPaciente() {
        this.getContextoCache().ocultarPanelLateral = true;
        this.getContextoCache().mostrarCuerpoProtocolo = true;
    }

    /**
     *
     *
     * @memberof LaboratorioContextoCacheService
     */
    ventanillaSinTurno() {
        // this.cambiarModo(Constantes.modoIds.recepcionSinTurno);
        this.getContextoCache().modo = Constantes.modos.recepcionSinTurno;
        this.getContextoCache().ocultarPanelLateral = true;
        this.getContextoCache().mostrarCuerpoProtocolo = false;
    }


    /**
     *
     *
     * @returns
     * @memberof LaboratorioContextoCacheService
     */
    isModoRecepcion() {
        return this.getContextoCache().modo === Constantes.modos.recepcion;
    }

    /**
     *
     *
     * @returns
     * @memberof LaboratorioContextoCacheService
     */
    isModoRecepcionSinTurno() {
        return this.getContextoCache().modo === Constantes.modos.recepcionSinTurno;
    }

    /**
     *
     *
     * @returns
     * @memberof LaboratorioContextoCacheService
     */
    isModoControl() {
        return this.getContextoCache().modo === Constantes.modos.control;
    }

    /**
     *
     *
     * @returns
     * @memberof LaboratorioContextoCacheService
     */
    isModoCarga() {
        return this.getContextoCache().modo === Constantes.modos.carga;
    }

    /**
     *
     *
     * @returns
     * @memberof LaboratorioContextoCacheService
     */
    isModoValidacion() {
        return this.getContextoCache().modo === Constantes.modos.validacion;
    }

    /**
     *
     *
     * @returns
     * @memberof LaboratorioContextoCacheService
     */
    isModoListado() {
        return this.getContextoCache().modo === Constantes.modos.listado;
    }

    getModo() {
        return this.getContextoCache().modo;
    }
}



