import { Plex } from '@andes/plex';
import { Input, Component, Output, EventEmitter, OnInit } from '@angular/core';
import { AdjuntosService } from '../../../modules/rup/services/adjuntos.service';
import { environment } from '../../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'prestacion-solicitud',
    templateUrl: './prestacionSolicitud.html',
    styleUrls: ['adjuntarDocumento.scss'],
})
export class PrestacionSolicitudComponent implements OnInit {
    imagenes = ['bmp', 'jpg', 'jpeg', 'gif', 'png', 'tif', 'tiff', 'raw'];
    extensions = [
        // Documentos
        'pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'xml', 'html', 'txt',
        // Audio/Video
        'mp3', 'mp4', 'm4a', 'mpeg', 'mpg', 'mov', 'flv', 'avi', 'mkv',
        // Otros
        'dat'
    ];

    @Input() prestacionSeleccionada: any;
    @Output() returnPrestacion: EventEmitter<any> = new EventEmitter<any>();
    // Adjuntos
    fotos: any[] = [];
    fileToken: String = null;
    lightbox = false;
    indice;
    fecha = new Date();
    constructor(
        public plex: Plex,
        public adjuntosService: AdjuntosService,
        public sanitazer: DomSanitizer,

    ) { }

    ngOnInit() {
        this.extensions = this.extensions.concat(this.imagenes);
        this.adjuntosService.generateToken().subscribe((data: any) => {
            this.fileToken = data.token;
        });
    }

    cancelarPrestacion() {
        this.returnPrestacion.emit({ status: true });
    }

    confirmarPrestacion() {
        this.returnPrestacion.emit({ status: false, fecha: this.fecha, prestacionSeleccionada: this.prestacionSeleccionada });
    }

    esImagen(extension) {
        return this.imagenes.find(x => x === extension.toLowerCase());
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

    activaLightbox(index) {
        if (this.prestacionSeleccionada.solicitud.registros[0].valor.documentos[index].ext !== 'pdf') {
            this.lightbox = true;
            this.indice = index;
        }
    }

    imagenPrevia(i) {
        let imagenPrevia = i - 1;
        if (imagenPrevia >= 0) {
            this.indice = imagenPrevia;
        }
    }

    imagenSiguiente(i) {
        let imagenSiguiente = i + 1;
        if (imagenSiguiente <= this.fotos.length - 1) {
            this.indice = imagenSiguiente;
        }
    }

}
