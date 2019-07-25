import { FileMeta } from '../../models/FileMeta';
import { JsonTransform } from '../../models/JsonTransform';
import { HttpMethod } from './HttpMethod';

export class InterceptorCortege {

    public path: string;
    public method: HttpMethod;
    public headers: Map<string, string>;
    public data?: object | string | number;
    public originalData?: object | string | number | JsonTransform;
    public fileMeta?: FileMeta;

    constructor(
        path: string,
        method: HttpMethod,
        headers: Map<string, string>,
        data?: object | string | number,
        originalData?: object | string | number | JsonTransform,
        fileMeta?: FileMeta
    ) {
        this.path = path;
        this.method = method;
        this.headers = headers;
        this.data = data;
        this.originalData = originalData;
        this.fileMeta = fileMeta;
    }

    public isTransaction(): boolean {
        return this.method === HttpMethod.Delete ||
            this.method === HttpMethod.Put ||
            this.method === HttpMethod.Patch ||
            this.method === HttpMethod.Post;
    }
}
