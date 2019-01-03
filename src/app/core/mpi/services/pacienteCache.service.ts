import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { IPaciente } from '../interfaces/IPaciente';

Injectable();
export class PacienteCacheService {

    private pacienteCache = new BehaviorSubject<any>(null);
    private isScannedCache = new BehaviorSubject<any>(null);

    setPaciente(paciente: IPaciente) {
        this.pacienteCache.next(paciente);
    }

    getPaciente(): Observable<any> {
        return this.pacienteCache.asObservable();
    }

    clearPaciente() {
        this.pacienteCache.next(null);
    }

    setScanState(scanState: boolean) {
        this.isScannedCache.next(scanState);
    }

    getScanState(): Observable<boolean> {
        return this.isScannedCache.asObservable();
    }

    clearScanState() {
        this.isScannedCache.next(null);
    }
}
