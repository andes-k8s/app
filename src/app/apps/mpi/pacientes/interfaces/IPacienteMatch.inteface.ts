
import { IPaciente } from '../../pacientes/interfaces/IPaciente';

export interface IPacienteMatch {
    id: String;
    paciente: IPaciente;
    match: number;
}
