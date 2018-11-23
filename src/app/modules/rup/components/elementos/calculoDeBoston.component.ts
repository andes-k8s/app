import { Component, OnInit } from '@angular/core';
import { RUPComponent } from './../core/rup.component';

@Component({
    selector: 'rup-calculo-boston',
    templateUrl: 'calculoDeBoston.html'
})

export class CalculoDeBostonComponent extends RUPComponent implements OnInit {

    public valorBoston;
    public opciones = [
        { id: 0, label: '0' },
        { id: 1, label: '1' },
        { id: 2, label: '2' },
        { id: 3, label: '3' }];

    ngOnInit() {
        if (!this.registro.valor) {
            this.registro.valor = {
                ci: null,
                ct: null,
                cd: null
            };
        } else {
            this.changeNumber();
        }
    }

    changeNumber() {
        this.registro.valor.total = this.registro.valor.ci + this.registro.valor.ct + this.registro.valor.cd;
        this.valorBoston = `${this.registro.valor.total} / 9`;
    }
}