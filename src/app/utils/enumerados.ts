/**
 * TODO: Document THIS
 */

export enum Sexo {
    'femenino',
    'masculino',
    'otro'
}

export enum Genero {
    'femenino',
    'masculino',
    'otro'
}

export enum EstadoCivil {
    'casado',
    'separado',
    'divorciado',
    'viudo',
    'soltero',
    'otro'
}

export enum tipoComunicacion {
    'Teléfono Fijo',
    'Teléfono Celular',
    'Email'
}

export enum estados {
    'temporal',
    'identificado',
    'validado',
    'recienNacido',
    'extranjero'
}

export enum relacionTutor {
    'padre',
    'madre',
    'hijo',
    'tutor'
}

export enum UnidadEdad {
    'años',
    'meses',
    'días',
    'horas'
}

export enum EstadosAuditorias {
    'pendiente',
    'aprobada',
    'desaprobada'
}

export enum PrioridadesPrestacion {
    'no prioritario',
    'urgencia',
    'emergencia'
}

export enum CargaLaboratorio {
    'recepcion',
    'control',
    'carga',
    'validacion',
    'listado'
}

export enum ModoCargaLaboratorio {
    'Lista de protocolos',
    'Hoja de trabajo',
    'Análisis'
}

export enum PrioridadesLaboratorio {
    'normal',
    'urgencia'
}

export enum PrioridadesLaboratorioFiltro {
    'normal',
    'urgencia',
    'todos'
}

export enum OrigenLaboratorio {
    'ambulatorio',
    'internación',
    'guardia',
    'todos'
}
export enum OrigenLaboratorioFiltro {
    'ambulatorio',
    'internación',
    'guardia',
}

export enum laboratorioInterno {
    'derivaciones',
    'guardia',
    'hematologia',
    'hemostasia',
    'inmunofluorescencia',
    'orinas',
    'quimica clinica',
    'serologia'
}

export enum EstadosEspacios {
    'disponible',
    'mantenimiento',
    'clausurado',
    'baja permanente'
}

export enum EstadosLabo {
    'pendiente',
    'ejecucion',
    'validada',
    'todos'
}

export function titleCase(str) {
    return str.toLowerCase().split(' ').map(function (word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}

export function getObjeto(elemento) {
    return {
        'id': elemento,
        'nombre': titleCase(elemento)
    };
}

export function getSexo() {
    let arrSexo = Object.keys(Sexo);
    arrSexo = arrSexo.slice(arrSexo.length / 2);
    return arrSexo;
}

export function getObjSexos() {
    let arrSexo = Object.keys(Sexo);
    arrSexo = arrSexo.slice(arrSexo.length / 2);
    let salida = arrSexo.map(elem => {
        return {
            'id': elem,
            'nombre': titleCase(elem)
        };
    });
    return salida;
}

export function getObjUnidadesEdad() {
    let arrUnidadEdad = Object.keys(UnidadEdad);
    arrUnidadEdad = arrUnidadEdad.slice(arrUnidadEdad.length / 2);
    let salida = arrUnidadEdad.map(elem => {
        return {
            id: elem,
            nombre: titleCase(elem)
        };
    });
    return salida;
}

export function getTipoComunicacion() {
    let arrTC = Object.keys(tipoComunicacion);
    arrTC = arrTC.slice(arrTC.length / 2);
    return arrTC;
}

export function getObjTipoComunicacion() {
    let arrTC = Object.keys(tipoComunicacion);
    arrTC = arrTC.slice(arrTC.length / 2);
    let salida = arrTC.map(elem => {
        let idEnumerado = elem.split(' ')[1] ? elem.split(' ')[1] : elem.split(' ')[0];
        return {
            'id': idEnumerado.toLowerCase(),
            'nombre': titleCase(elem)
        };
    });
    return salida;
}

export function getGenero() {
    let arrGenero = Object.keys(Genero);
    arrGenero = arrGenero.slice(arrGenero.length / 2);
    return arrGenero;
}

export function getObjGeneros() {
    let arrGenero = Object.keys(Genero);
    arrGenero = arrGenero.slice(arrGenero.length / 2);
    let salida = arrGenero.map(elem => {
        return {
            'id': elem,
            'nombre': titleCase(elem)
        };
    });
    return salida;
}

export function getEstadoCivil() {
    let arrEstadoC = Object.keys(EstadoCivil);
    arrEstadoC = arrEstadoC.slice(arrEstadoC.length / 2);
    return arrEstadoC;
}

export function getObjEstadoCivil() {
    let arrEstadoC = Object.keys(EstadoCivil);
    arrEstadoC = arrEstadoC.slice(arrEstadoC.length / 2);
    let salida = arrEstadoC.map(elem => {
        return {
            'id': elem,
            'nombre': titleCase(elem)
        };
    });
    return salida;
}

export function getEstados() {
    let arrEstados = Object.keys(estados);
    arrEstados = arrEstados.slice(arrEstados.length / 2);
    return arrEstados;
}

export function getPrioridades() {
    let arrPrioridades = Object.keys(PrioridadesPrestacion);
    arrPrioridades = arrPrioridades.slice(arrPrioridades.length / 2);
    return arrPrioridades;
}

export function getPrioridadesLab() {
    let arrLab = Object.keys(PrioridadesLaboratorio);
    arrLab = arrLab.slice(arrLab.length / 2);
    let salida = arrLab.map(elem => {
        return {
            'id': elem,
            'nombre': titleCase(elem)
        };
    });
    return salida;
}

export function getPrioridadesFiltroLab() {
    let arrLab = Object.keys(PrioridadesLaboratorioFiltro);
    arrLab = arrLab.slice(arrLab.length / 2);
    let salida = arrLab.map(elem => {
        return {
            'id': elem,
            'nombre': titleCase(elem)
        };
    });
    return salida;
}
export function getEstadosFiltroLab() {
    let arrLab = Object.keys(EstadosLabo);
    arrLab = arrLab.slice(arrLab.length / 2);
    let salida = arrLab.map(elem => {
        return {
            'id': elem,
            'nombre': titleCase(elem)
        };
    });
    return salida;
}

export function getCargaLaboratorio() {
    let arrLab = Object.keys(CargaLaboratorio);
    arrLab = arrLab.slice(arrLab.length / 2);
    let salida = arrLab.map(elem => {
        return {
            'id': elem,
            'nombre': titleCase(elem)
        };
    });
    return salida;
}

export function getModoCargaLaboratorio() {
    let arrLab = Object.keys(ModoCargaLaboratorio);
    arrLab = arrLab.slice(arrLab.length / 2);
    let salida = arrLab.map(elem => {
        return {
            'id': elem,
            'nombre': titleCase(elem)
        };
    });
    return salida;
}

export function getOrigenLab() {
    let arrLab = Object.keys(OrigenLaboratorio);
    arrLab = arrLab.slice(arrLab.length / 2);
    let salida = arrLab.map(elem => {
        return {
            'id': elem,
            'nombre': titleCase(elem)
        };
    });
    return salida;
}


export function getOrigenFiltroLab() {
    let arrLab = Object.keys(OrigenLaboratorioFiltro);
    arrLab = arrLab.slice(arrLab.length / 2);
    let salida = arrLab.map(elem => {
        return {
            'id': elem,
            'nombre': titleCase(elem)
        };
    });
    return salida;
}

export function getLaboratorioInterno() {
    let arrLab = Object.keys(laboratorioInterno);
    arrLab = arrLab.slice(arrLab.length / 2);
    let salida = arrLab.map(elem => {
        return {
            'id': elem,
            'nombre': titleCase(elem)
        };
    });
    return salida;
}

export function getEstadosAuditorias() {
    let arrEstados = Object.keys(EstadosAuditorias);
    arrEstados = arrEstados.slice(arrEstados.length / 2);
    let salida = arrEstados.map(elem => {
        return {
            'id': elem,
            'nombre': titleCase(elem)
        };
    });
    return salida;
}

export function getEstadosEspacios() {
    let arrEstados = Object.keys(EstadosEspacios);
    arrEstados = arrEstados.slice(arrEstados.length / 2);
    let salida = arrEstados.map(elem => {
        return {
            'id': elem,
            'nombre': titleCase(elem)
        };
    });
    return salida;
}

export function getRelacionTutor() {
    let arrRT = Object.keys(relacionTutor);
    arrRT = arrRT.slice(arrRT.length / 2);
    return arrRT;
}

export function getObjRelacionTutor() {
    let arrRT = Object.keys(relacionTutor);
    arrRT = arrRT.slice(arrRT.length / 2);
    let salida = arrRT.map(elem => {
        return {
            'id': elem,
            'nombre': titleCase(elem)
        };
    });
    return salida;
}
