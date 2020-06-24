import { Component, OnInit } from '@angular/core';
import * as enumerados from '../../../../../../utils/enumerados';
import { Auth } from '@andes/auth';
import { DocumentosService } from '../../../../../../services/documentos.service';
import { ListadoInternacionService } from '../listado-internacion.service';

@Component({
    selector: 'app-filtros-internacion',
    templateUrl: './filtros-internacion.component.html',
})

export class FiltrosInternacionComponent implements OnInit {
    filtros: any = {
        fechaIngresoDesde: moment().subtract(1, 'months').toDate(),
        fechaIngresoHasta: moment().toDate()
    };
    estadosInternacion;
    permisoDescarga;
    requestInProgress: boolean;

    constructor(
        private auth: Auth,
        private listadoInternacionService: ListadoInternacionService,
        private servicioDocumentos: DocumentosService
    ) { }

    ngOnInit() {
        this.estadosInternacion = enumerados.getObjEstadoInternacion();
        this.permisoDescarga = this.auth.check('internacion:descargarListado');
    }

    filtrar() {
        this.listadoInternacionService.pacienteDocumento.next(this.filtros.documento);
        this.listadoInternacionService.pacienteApellido.next(this.filtros.apellido);
        if (this.filtros.estado) {
            this.listadoInternacionService.estado.next(this.filtros.estado.id);
        }
    }

    filtrarFecha() {
        this.listadoInternacionService.fechaIngresoDesde.next(this.filtros.fechaIngresoDesde);
        this.listadoInternacionService.fechaIngresoHasta.next(this.filtros.fechaIngresoHasta);
    }

    reporteInternaciones() {
        const params = {
            desde: moment(this.filtros.fechaIngresoDesde).startOf('d').format(),
            hasta: moment(this.filtros.fechaIngresoHasta).endOf('d').format(),
            organizacion: this.auth.organizacion.id
        };
        this.requestInProgress = true;
        this.servicioDocumentos.descargarReporteInternaciones(params, 'Internaciones').subscribe(
            () => this.requestInProgress = false,
            () => this.requestInProgress = false
        );
    }
}
