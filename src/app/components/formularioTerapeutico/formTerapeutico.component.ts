import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter, HostBinding, ViewChild } from '@angular/core';
import { Plex } from '@andes/plex';
import { Auth } from '@andes/auth';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { FormTerapeuticoService } from './../../services/formTerapeutico/formTerapeutico.service';
import { ArbolItem } from './arbolItem';


@Component({
    selector: 'app-formTerapeutico',
    templateUrl: './formTerapeutico.html'
})
export class formTerapeuticoComponent implements OnInit {
    @ViewChild('arbol') arbolHijo: ArbolItem;
    @HostBinding('class.plex-layout') layout = true;
    @Input() indice: any;
    @Input() deep: Number;
    private indices;
    private titulo;
    private padres: any[];
    private hijos: any[];
    public detalleMedicamento: any;
    public idMedicamentoPadre: any;
    public newMedicamento: any;
    constructor(private router: Router,
        private plex: Plex, public auth: Auth,
        public servicioFormTerapeutico: FormTerapeuticoService) { }


    ngOnInit() {
        this.servicioFormTerapeutico.get({ tree: 1, root: 1 }).subscribe((data: any) => {
            this.indices = data;

        });
    }

    detallesMedicamento(data) {
        this.detalleMedicamento = data;
        this.idMedicamentoPadre = null;
    }

    recibeMedicamenteAgregar(data) {
        this.idMedicamentoPadre = data;
        this.detalleMedicamento = null;
    }

    recibeHijos(data) {
        return data;
    }

    agregar(data) {
        if (data.carroEmergencia === true) {
            data.carroEmergencia = 'SI';
        } else {
            data.carroEmergencia = '';
        }
        data.idpadre = this.idMedicamentoPadre.indice._id;

        this.servicioFormTerapeutico.post(data).subscribe((salida: any) => {
            console.log(salida);
            debugger;
            this.plex.toast('success', 'El medicamento se agrego correctamente', 'Información', 3000);

            this.idMedicamentoPadre.hijos.push(salida);
            // this.idMedicamentoPadre.hijos = [this.idMedicamentoPadre.hijos];

        });
    }

    plegar() {
        this.servicioFormTerapeutico.get({ tree: 1, root: 1 }).subscribe((data: any) => {
            this.indices = data;

        });
    }




}