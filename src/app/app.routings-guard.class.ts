import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRoute, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Auth } from '@andes/auth';
import { Plex } from '@andes/plex';
import { HUDSService } from './modules/rup/services/huds.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RoutingGuard implements CanActivate {
    constructor(private auth: Auth, private router: Router, private plex: Plex) { }

    canActivate() {
        if (this.auth.loggedIn()) {
            this.plex.updateUserInfo({ usuario: this.auth.usuario, organizacion: this.auth.organizacion });
            return true;
        } else if (this.auth.inProgress()) {
            return true;
        } else if (this.auth.getToken()) {
            return this.auth.session().pipe(map(() => {
                this.plex.updateUserInfo({ usuario: this.auth.usuario, organizacion: this.auth.organizacion });
                return true;
            }));
        } else {
            this.router.navigate(['auth/login']);
            return false;
        }
    }
}

@Injectable()
export class RoutingNavBar implements CanActivate {
    constructor(private plex: Plex) { }

    canActivate() {
        this.plex.clearNavbar();
        this.plex.updateTitle('ANDES | Apps de Salud');
        return true;
    }
}

@Injectable()
export class RoutingHudsGuard implements CanActivate {
    constructor(private router: Router, private hudsService: HUDSService) { }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
        if (route.params.id) {
            return this.hudsService.checkHudsToken(route.params.id).pipe(map(resp => {
                if (!resp) {
                    this.router.navigate(['/rup']);
                    return false;
                }
                return true;
            }));
        } else {
            this.router.navigate(['/rup']);
            return false;
        }
    }
}
