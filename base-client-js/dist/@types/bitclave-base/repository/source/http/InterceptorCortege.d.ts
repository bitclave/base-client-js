import { HttpMethod } from './HttpMethod';
export declare class InterceptorCortege {
    path: string;
    method: HttpMethod;
    headers: Map<string, string>;
    data?: any;
    constructor(path: string, method: HttpMethod, headers: Map<string, string>, data?: any);
    isTransaction(): boolean;
}
