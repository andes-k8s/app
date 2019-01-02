import {
    Component,
    OnInit,
    Input,
    HostBinding
} from '@angular/core';
import { Plex } from '@andes/plex';
import { ParentescoService } from '../../../services/parentesco.service';
import { PacienteService } from '../services/paciente.service';
import { IPaciente } from '../interfaces/IPaciente';

@Component({
    selector: 'relaciones-pacientes',
    templateUrl: 'relaciones-pacientes.html',
    styleUrls: ['relaciones-pacientes.scss']
})
export class RelacionesPacientesComponent implements OnInit {
    @HostBinding('class.plex-layout') layout = true; // Permite el uso de flex-box en el componente
    @Input() paciente: IPaciente;
    @Input() seleccion: IPaciente;

    parentescoModel: any[] = [];
    relacionesBorradas: any[] = [];
    relacionesIniciales: any[] = [];
    posiblesRelaciones: any[] = [];
    disableGuardar = false;
    enableIgnorarGuardar = false;
    buscarPacRel = '';
    PacientesRel = null;
    loading = false;
    searchClear = true;    // True si el campo de búsqueda se encuentra vacío

    public nombrePattern: string;

    constructor(
        private pacienteService: PacienteService,
        private parentescoService: ParentescoService,
        public plex: Plex) { }


    ngOnInit() {
        this.parentescoService.get().subscribe(resultado => {
            this.parentescoModel = resultado;
        });

        // Se guarda estado de las relaciones al comenzar la edición
        if (this.paciente.relaciones && this.paciente.relaciones.length) {
            this.relacionesIniciales = this.paciente.relaciones.slice(0, this.paciente.relaciones.length);
        }
    }

    // -------------- SOBRE BUSCADOR ----------------

    onSearchStart() {
        this.loading = true;
    }

    onSearchEnd(pacientes: IPaciente[]) {
        if (pacientes) {
            this.searchClear = false;
            this.loading = false;
            this.actualizarPosiblesRelaciones(pacientes);
        }
    }

    onSearchClear() {
        this.searchClear = true;
        this.posiblesRelaciones = [];
    }

    // ------------- SOBRE RELACIONES ---------------

    // Resultado de la búsqueda de pacientes para relacionar (Tab 'relaciones')
    actualizarPosiblesRelaciones(listaPacientes: any[]) {
        // Se elimina el paciente en edición
        listaPacientes = listaPacientes.filter(p => p.id !== this.paciente.id);

        // Se eliminan de los resultados de la búsqueda los pacientes ya relacionados
        if (this.paciente.relaciones && this.paciente.relaciones.length) {
            for (let i = 0; i < this.paciente.relaciones.length; i++) {
                listaPacientes = listaPacientes.filter(p => p.id !== this.paciente.relaciones[i].referencia);
            }
        }
        this.posiblesRelaciones = listaPacientes;
    }

    seleccionarPacienteRelacionado(pacienteEncontrado) {
        if (pacienteEncontrado) {
            let ultimaRelacion = null;
            let permitirNuevaRelacion = true;
            // Control: Si los datos de las relaciones agregadas anteriormente no estan completas, no se permitira agregar nuevas.
            if (this.paciente.relaciones && this.paciente.relaciones.length) {
                ultimaRelacion = this.paciente.relaciones[this.paciente.relaciones.length - 1];
                permitirNuevaRelacion = Boolean(ultimaRelacion.documento && ultimaRelacion.apellido && ultimaRelacion.nombre && ultimaRelacion.relacion);
            }

            if (permitirNuevaRelacion) {
                this.buscarPacRel = '';
                let unaRelacion = Object.assign({}, {
                    relacion: null,
                    referencia: null,
                    nombre: '',
                    apellido: '',
                    documento: '',
                    foto: ''
                });

                // Se completan los campos de la nueva relación
                unaRelacion.referencia = pacienteEncontrado.id;
                unaRelacion.documento = pacienteEncontrado.documento;
                unaRelacion.apellido = pacienteEncontrado.apellido;
                unaRelacion.nombre = pacienteEncontrado.nombre;
                if (pacienteEncontrado.foto) {
                    unaRelacion.foto = pacienteEncontrado.foto;
                }

                // Se inserta nueva relación en array de relaciones del paciente
                let index = null;
                if (this.paciente.relaciones) {
                    this.paciente.relaciones.push(unaRelacion);
                } else {
                    this.paciente.relaciones = [unaRelacion];
                }

                // Si esta relación fue borrada anteriormente en esta edición, se quita del arreglo 'relacionesBorradas'
                index = this.relacionesBorradas.findIndex(rel => rel.documento === unaRelacion.documento);
                if (index >= 0) {
                    this.relacionesBorradas.splice(index, 1);
                }
                // Se borran los resultados de la búsqueda.
                this.posiblesRelaciones = null;
            } else {
                this.plex.toast('info', 'Antes de agregar una nueva relación debe completar las existentes.', 'Informacion');
            }
        }
    }

    removeRelacion(i) {
        if (i >= 0) {
            // si la relacion borrada ya se encotraba almacenada en la DB
            let index = this.relacionesIniciales.findIndex(unaRel => unaRel.documento === this.paciente.relaciones[i].documento);
            if (index >= 0) {
                this.relacionesBorradas.push(this.paciente.relaciones[i]);
            }
            this.paciente.relaciones.splice(i, 1);
        }
    }
}