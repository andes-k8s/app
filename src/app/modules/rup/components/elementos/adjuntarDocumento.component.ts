import { Component, Output, Input, EventEmitter, OnInit, ViewChildren, QueryList, ViewChild, ElementRef } from '@angular/core';
import { RUPComponent } from './../core/rup.component';
import { environment } from '../../../../../environments/environment';
import { RupElement } from '../elementos';
import { ISnomedConcept } from '../../interfaces/snomed-concept.interface';
import { isUndefined } from 'util';
@Component({
    selector: 'rup-adjuntar-documento',
    templateUrl: 'adjuntarDocumento.html',
    styleUrls: ['adjuntarDocumento.scss'],
})
@RupElement('AdjuntarDocumentoComponent')
export class AdjuntarDocumentoComponent extends RUPComponent implements OnInit {
    @Input() permiteCarga: boolean;
    @Input() parametroRegistro;

    @ViewChildren('uploaded') childComponents: QueryList<any>;
    @ViewChild('upload', { static: true }) pcUpload: ElementRef;
    @ViewChild('dropMe', { static: true }) dropMe: QueryList<any>;
    // @ViewChildren('upload') childComponents: QueryList<any>;
    image = [
        'bmp', 'jpg', 'jpeg', 'gif', 'png', 'tif', 'tiff', 'raw', 'jpeg_large', 'jpeg_small'
    ];
    audio = [
        'wav', 'm4a', 'mp3', 'ogg', 'opus', 'aac', 'aiff'
    ];

    video = [
        'mp4', 'mpeg', 'mpg', 'mov', 'flv', 'avi', 'mkv', 'ogv'
    ];

    other = [
        'pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'xml', 'html', 'txt', 'dat'
    ];

    extensions: any[];
    adjunto: any;
    loading = false;
    waiting = false;
    timeout = null;
    errorExt = false;

    // fotos: { file?: any, ext: string, id?: any, descripcion?: ISnomedConcept, fecha?: Date }[] = [];
    lightbox = false;
    indice;
    fileToken: String = null;

    items = [
        { label: 'Subir desde PC', handler: (() => { this.pcUpload.nativeElement.click(); return false; }) },
        { label: 'Subir desde App móvil', handler: (() => { this.fromMobile(); }) }
    ];

    mime: any;

    public descendientesInformeClinico: ISnomedConcept[] = [];
    public hoy = moment(new Date()).endOf('day').toDate();
    adjuntos: any;

    ngOnInit() {

        if (isUndefined(this.permiteCarga)) {
            this.permiteCarga = true;
        }

        this.extensions = this.image.concat(this.audio).concat(this.video).concat(this.other);

        if (!isUndefined(this.parametroRegistro)) {
            this.registro = this.parametroRegistro;
        }
        if (!this.registro.valor) {
            this.registro.valor = {};
        }
        if (!this.registro.valor.documentos) {
            this.registro.valor.documentos = [];
        }

        this.adjuntosService.generateToken().subscribe((data: any) => {
            this.fileToken = data.token;
            this.adjuntos = this.registro.valor.documentos.map(x => ({ url: this.createUrl(x), ext: x.ext }));
        });

        this.snomedService.getQuery({ expression: '^4681000013102' }).subscribe(result => {
            this.descendientesInformeClinico = result;
        });

    }

    get adjuntosRUP() {
        console.log(this.adjuntos);
        return this.adjuntos;
    }

    ngAfterContentChecked(): void {
        //Called after every check of the component's or directive's content.
        //Add 'implements AfterContentChecked' to the class.
        (this.pcUpload.nativeElement as HTMLElement).style.display = 'none';
    }

    changeListener($event): void {
        this.readThis($event.target);
    }

    readThis(inputValue: any): void {
        let ext = this.fileExtension(inputValue.value);
        this.errorExt = false;
        if (!this.extensions.find((item) => item === ext.toLowerCase())) {
            (this.childComponents.first as any).nativeElement.value = '';
            this.errorExt = true;
            if (!this.waiting && !this.soloValores) {
                this.plex.info('info', 'El formato de archivo no se reconoce y no se puede adjuntar.', 'Tipo de archivo no soportado');
            }
            return;
        }
        let file: File = inputValue.files[0];
        let myReader: FileReader = new FileReader();

        myReader.onloadend = (e) => {
            (this.childComponents.first as any).nativeElement.value = '';
            let metadata = {
                prestacion: this.prestacion.id,
                registro: this.registro.id
            };
            this.adjuntosService.upload(myReader.result, metadata).subscribe((data) => {
                this.registro.valor.documentos.push({
                    ext,
                    id: data._id,
                });
            });


        };
        myReader.readAsDataURL(file);
    }


    fileExtension(file) {
        if (file.lastIndexOf('.') >= 0) {
            return file.slice((file.lastIndexOf('.') + 1));
        } else {
            return '';
        }
    }


    esDeTipo(extension, tipo: 'image' | 'audio' | 'video' | 'other') {
        return this[String(tipo)].find(x => x === extension.toLowerCase());
    }

    confirmarEliminarImagen($event) {
        this.plex.confirm('¿Eliminar imagen?', 'Confirmación', 'Eliminar', 'Cancelar').then(confirmed => {
            if (confirmed) {
                this.eliminarImagen($event);
                return true;
            } else {
                return false;
            }
        });
    }

    eliminarImagen(ev) {
        let index = this.registro.valor.documentos.indexOf(ev);
        this.registro.valor.documentos.splice(index, 1);
    }

    createUrl(doc) {
        /** Hack momentaneo */
        // let jwt = window.sessionStorage.getItem('jwt');
        if (doc.id) {
            let apiUri = environment.API;
            return apiUri + '/modules/rup/store/' + doc.id + '?token=' + this.fileToken;
        } else {
            // Por si hay algún documento en la vieja versión.
            return this.sanitazer.bypassSecurityTrustResourceUrl(doc.base64);
        }
    }

    fromMobile() {
        let paciente = this.paciente ? this.paciente.id : null;
        let prestacion = this.prestacion.id;
        let registro = this.registro.id;
        this.loading = true;
        this.adjuntosService.post({ paciente, prestacion, registro }).subscribe((data) => {
            this.adjunto = data;
            this.waiting = true;
            this.loading = false;

            this.timeout = setTimeout((() => {
                this.backgroundSync();
            }).bind(this), 5000);

        });
    }

    backgroundSync() {
        this.adjuntosService.get({ id: this.adjunto.id, estado: 'upload' }).subscribe((data) => {
            if (data.length > 0) {
                this.waiting = false;
                this.adjunto = data[0];
                let docs = this.adjunto.valor.documentos;
                docs.forEach((item) => {
                    this.registro.valor.documentos.push(item);
                });
                this.adjuntosService.delete(this.adjunto._id).subscribe(() => { });

            } else {
                this.timeout = setTimeout((() => {
                    this.backgroundSync();
                }).bind(this), 5000);
            }
        });
    }

    cancelar() {
        clearTimeout(this.timeout);
        this.waiting = false;
        this.adjuntosService.delete(this.adjunto._id).subscribe(() => { });
    }
}
// ElementosRUPRegister.register('AdjuntarDocumentoComponent', AdjuntarDocumentoComponent);
