"use strict";
var paciente_component_1 = require('./components/paciente/paciente.component');
var especialidad_component_1 = require('./components/especialidad/especialidad.component');
var profesional_component_1 = require('./components/profesional/profesional.component');
var organizacion_component_1 = require('./components/organizacion/organizacion.component');
var router_1 = require('@angular/router');
var appRoutes = [
    {
        path: 'organizacion',
        component: organizacion_component_1.OrganizacionComponent
    },
    {
        path: 'profesional',
        component: profesional_component_1.ProfesionalComponent
    },
    {
        path: 'especialidad',
        component: especialidad_component_1.EspecialidadComponent
    },
    {
        path: 'pacientes',
        component: paciente_component_1.PacienteComponent
    },
    {
        path: '**',
        redirectTo: "organizacion"
    }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map