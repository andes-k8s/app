"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
require('rxjs/add/operator/toPromise');
var Rx_1 = require('rxjs/Rx');
require('rxjs/add/operator/map');
require('rxjs/add/operator/catch');
var EspecialidadService = (function () {
    function EspecialidadService(http) {
        this.http = http;
        this.especialidadUrl = 'http://localhost:3002/api/especialidad'; // URL to web api
    }
    EspecialidadService.prototype.get = function () {
        return this.http.get(this.especialidadUrl)
            .map(function (res) { return res.json(); })
            .catch(this.handleError); //...errors if any*/
    };
    EspecialidadService.prototype.getByTerm = function (codigoSisa, nombre) {
        return this.http.get(this.especialidadUrl + "?codigoSisa=" + codigoSisa + "&nombre=" + nombre)
            .map(function (res) { return res.json(); })
            .catch(this.handleError); //...errors if any*/
    };
    EspecialidadService.prototype.post = function (especialidad) {
        var bodyString = JSON.stringify(especialidad); // Stringify payload
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
        var options = new http_1.RequestOptions({ headers: headers }); // Create a request option
        return this.http.post(this.especialidadUrl, bodyString, options) // ...using post request
            .map(function (res) { return res.json(); }) // ...and calling .json() on the response to return data
            .catch(this.handleError); //...errors if any
    };
    EspecialidadService.prototype.put = function (especialidad) {
        debugger;
        var bodyString = JSON.stringify(especialidad); // Stringify payload
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
        var options = new http_1.RequestOptions({ headers: headers }); // Create a request option
        return this.http.put(this.especialidadUrl + "/" + especialidad._id, bodyString, options) // ...using post request
            .map(function (res) { return res.json(); }) // ...and calling .json() on the response to return data
            .catch(this.handleError); //...errors if any
    };
    EspecialidadService.prototype.disable = function (especialidad) {
        especialidad.habilitado = false;
        especialidad.fechaBaja = new Date();
        var bodyString = JSON.stringify(especialidad); // Stringify payload
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
        var options = new http_1.RequestOptions({ headers: headers }); // Create a request option
        return this.http.put(this.especialidadUrl + "/" + especialidad._id, bodyString, options) // ...using post request
            .map(function (res) { return res.json(); }) // ...and calling .json() on the response to return data
            .catch(this.handleError); //...errors if any
    };
    EspecialidadService.prototype.handleError = function (error) {
        console.log(error.json());
        return Rx_1.Observable.throw(error.json().error || 'Server error');
    };
    EspecialidadService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], EspecialidadService);
    return EspecialidadService;
}());
exports.EspecialidadService = EspecialidadService;
//# sourceMappingURL=especialidad.service.js.map