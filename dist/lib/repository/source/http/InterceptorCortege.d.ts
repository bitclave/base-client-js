import { FileMeta } from '../../models/FileMeta';
import { JsonTransform } from '../../models/JsonTransform';
import { HttpMethod } from './HttpMethod';
export declare class InterceptorCortege {
    path: string;
    method: HttpMethod;
    headers: Map<string, string>;
    data?: object | string | number;
    originalData?: object | string | number | JsonTransform;
    fileMeta?: FileMeta;
    constructor(path: string, method: HttpMethod, headers: Map<string, string>, data?: object | string | number, originalData?: object | string | number | JsonTransform, fileMeta?: FileMeta);
    isTransaction(): boolean;
}
