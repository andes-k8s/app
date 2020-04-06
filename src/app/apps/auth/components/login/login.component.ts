import { DisclaimerService } from '../../../../services/disclaimer.service';
import { UsuarioService } from '../../../../services/usuarios/usuario.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Plex } from '@andes/plex';
import { Auth } from '@andes/auth';
import { WebSocketService } from '../../../../services/websocket.service';
import { HotjarService } from '../../../../shared/services/hotJar.service';

@Component({
    templateUrl: 'login.html',
    styleUrls: ['login.scss'],
    encapsulation: ViewEncapsulation.None // Use to disable CSS Encapsulation for this component
})
export class LoginComponent implements OnInit {
    public usuario: number;
    public password: string;
    public loading = false;
    public regionesValidas = ['America/Buenos_Aires', 'America/Catamarca', 'America/Cordoba', 'America/Jujuy', 'America/Argentina/La_Rioja', 'America/Mendoza', 'America/Argentina/Rio_Gallegos', 'America/Argentina/Salta', 'America/Argentina/San_Juan', 'America/Argentina/San_Luis', 'America/Argentina/Tucuman', 'America/Argentina/Ushuaia'];

    constructor(
        private plex: Plex,
        private auth: Auth,
        private router: Router,
        public ws: WebSocketService,
        public us: UsuarioService,
        public ds: DisclaimerService
    ) { }

    ngOnInit() {
        this.auth.logout();
        this.ws.close();
    }

    husoHorarioCorrecto() {
        let timeZone;
        let result = false;
        if (typeof Intl === 'object' && typeof Intl.DateTimeFormat === 'function') {
            timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (this.regionesValidas.indexOf(timeZone) === -1) {
                this.plex.info('danger', 'Su computadora está configurada en una región no válida. Por favor, verifique y vuelva a intentar.');
                this.loading = false;
            } else {
                result = true;
            }
        }
        return result;
    }

    login(event) {
        if (event.formValid) {
            this.loading = true;
            this.auth.login(this.usuario.toString(), this.password)
                .subscribe((data) => {
                    this.ws.setToken(window.sessionStorage.getItem('jwt'));
                    this.plex.updateUserInfo({ usuario: this.auth.usuario });
                    this.ds.get({ activo: true }).subscribe(disclaimers => {
                        if (disclaimers && disclaimers.length > 0) {
                            let disclaimer = disclaimers[0];
                            this.us.getDisclaimers(this.auth.usuario).subscribe((userDisclaimers) => {
                                if (userDisclaimers.some(item => item.id === disclaimer.id)) {
                                    this.router.navigate(['/auth/select-organizacion']);
                                } else {
                                    this.router.navigate(['/auth/disclaimer']);
                                }
                            });
                        } else {
                            this.router.navigate(['/auth/select-organizacion']);
                        }
                    });
                }, (err) => {
                    this.plex.info('danger', 'Usuario o contraseña incorrectos');
                    this.loading = false;
                });
        }
    }

}
