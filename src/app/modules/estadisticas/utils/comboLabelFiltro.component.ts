const estadosAgendas = [
    { id: 'planificacion', nombre: 'Planificación' },
    { id: 'disponible', nombre: 'Disponible' },
    { id: 'publicada', nombre: 'Publicada' },
    { id: 'suspendida', nombre: 'Suspendida' },
    { id: 'pausada', nombre: 'Pausada' },
    { id: 'pendienteAsistencia', nombre: 'Pendiente Asistencia' },
    { id: 'pendienteAuditoria', nombre: 'Pendiente Auditoría' },
    { id: 'auditada', nombre: 'Auditada' },
    { id: 'borrada', nombre: 'Borrada' }
];

const estadosTurnos = [
    { id: 'disponible', nombre: 'Disponible' },
    { id: 'asignado', nombre: 'Asignado' },
    { id: 'reasignado', nombre: 'Reasignado' },
    { id: 'suspendido', nombre: 'Suspendido' }
];

const tipoTurnos = [
    { id: 'delDia', nombre: 'Del Día' },
    { id: 'programado', nombre: 'Programado' },
    { id: 'gestion', nombre: 'Con llave' },
    { id: 'profesional', nombre: 'Profesional' },
    { id: 'sobreturno', nombre: 'Sobreturno' },
    { id: 'appMobile', nombre: 'App Mobile' }
];

export function getEstadosAgendas() {
    return estadosAgendas;
}

export function getEstadosTurnos() {
    return estadosTurnos;
}

export function getTipoTurnos() {
    return tipoTurnos;
}

