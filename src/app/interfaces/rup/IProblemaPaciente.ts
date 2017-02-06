import { ITipoProblema } from './ITipoProblema';
import { IOrganizacion } from './../IOrganizacion';
import { IProfesional } from './../IProfesional';
import { IPaciente } from './../IPaciente';


export interface IProblemaPaciente {
    tipoProblema: ITipoProblema,
    idProblemaOrigen: [String],
    paciente: IPaciente,
    codificador: {
        nombre: String,
        codigo: String,
        jerarquia: String,
        origen: String
    },
    fechaInicio: Date,
    evoluciones: [{
        fecha: Date,
        activo: Boolean,
        observacion: String,
        profesional: [IProfesional],
        organizacion: IOrganizacion,
        //ambito: // TODO
    }]
}