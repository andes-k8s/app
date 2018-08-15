export interface IEnum {
    [index: string]: {
        nombre: string;
        class: string;
    };
}

export function enumToArray(object: IEnum): Array<any> {
    return Object.keys(object).map(key => ({...object[key],  id: key}));
}
