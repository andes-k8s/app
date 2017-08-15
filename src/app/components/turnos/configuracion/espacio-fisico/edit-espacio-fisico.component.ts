import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Plex } from '@andes/plex';
import { Auth } from '@andes/auth';

import { IEspacioFisico } from './../../../../interfaces/turnos/IEspacioFisico';
import { EspacioFisicoService } from './../../../../services/turnos/espacio-fisico.service';
import { OrganizacionService } from './../../../../services/organizacion.service';

@Component({
    selector: 'edit-espacio-fisico',
    templateUrl: 'edit-espacio-fisico.html',
    styleUrls: [
        'edit-espacio-fisico.scss'
    ]
})

export class EditEspacioFisicoComponent implements OnInit {
    equipamientos = [];

    @Input() espacioFisicoHijo: IEspacioFisico;

    @Output() data: EventEmitter<IEspacioFisico> = new EventEmitter<IEspacioFisico>();

    /**
     * Devuelve un elemento seleccionado en el buscador SNOMED.
     */
    @Output() evtData: EventEmitter<any> = new EventEmitter<any>();
    tipoBusqueda = 'equipamientos';

    public modelo: any = {};
    public edif: any = {};
    public autorizado: boolean;
    constructor(public plex: Plex, public EspacioFisicoService: EspacioFisicoService, public OrganizacionService: OrganizacionService,
        public auth: Auth) { }

    ngOnInit() {
        this.autorizado = this.auth.getPermissions('turnos:editarEspacio').length > 0;
        let nombre = this.espacioFisicoHijo ? this.espacioFisicoHijo.nombre : '';
        let descripcion = this.espacioFisicoHijo ? this.espacioFisicoHijo.descripcion : '';
        let edificio = this.espacioFisicoHijo ? this.espacioFisicoHijo.edificio : '';
        let sector = this.espacioFisicoHijo ? this.espacioFisicoHijo.sector : '';
        let servicio = this.espacioFisicoHijo ? this.espacioFisicoHijo.servicio : '';
        let detalle = this.espacioFisicoHijo ? this.espacioFisicoHijo.detalle : '';
        let activo = this.espacioFisicoHijo ? this.espacioFisicoHijo.activo : true;
        let equipamiento = this.espacioFisicoHijo ? this.espacioFisicoHijo.equipamiento : [];
        this.modelo = { nombre, descripcion, activo, edificio, detalle, sector, servicio, equipamiento };
    }

    loadEdificios(event) {
        this.OrganizacionService.getById(this.auth.organizacion._id).subscribe(respuesta => {
            event.callback(respuesta.edificio);
        });
    }
    loadSectores(event) {
        this.EspacioFisicoService.get({}).subscribe(respuesta => {
            let sectores = respuesta.map((ef) => {
                return (typeof ef.sector !== 'undefined' && ef.sector.nombre !== '-' ? ef.sector : []);
            }).filter((elem, index, self) => {
                return index === self.indexOf(elem);
            });
            event.callback(sectores);
        });
    }
    loadServicios(event) {
        this.EspacioFisicoService.get({}).subscribe(respuesta => {
            let servicios = respuesta.map((ef) => {
                return (typeof ef.servicio !== 'undefined' ? ef.servicio : []);
            });
            event.callback(servicios);
        });
    }

    onClick(modelo: IEspacioFisico) {

        let estOperation: Observable<IEspacioFisico>;
        modelo.organizacion = this.auth.organizacion;

        if (this.espacioFisicoHijo) {
            modelo.id = this.espacioFisicoHijo.id;
            estOperation = this.EspacioFisicoService.put(modelo);
        } else {
            estOperation = this.EspacioFisicoService.post(modelo);
        }
        estOperation.subscribe(resultado => this.data.emit(resultado));
    }

    onCancel() {
        this.data.emit(null);
        return false;
    }

    agregarEquipamiento(equipamiento) {
        this.modelo.equipamiento = [... this.modelo.equipamiento, equipamiento];
    }

    eliminarEquipamiento(equipamiento) {
        this.modelo.equipamiento.splice(this.modelo.equipamiento.indexOf(equipamiento), 1);
        this.modelo.equipamiento = [...this.modelo.equipamiento];
    }

}
