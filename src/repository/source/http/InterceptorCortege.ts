import { HttpMethod } from './HttpMethod';

export class InterceptorCortege {

    public path: string;
    public method: HttpMethod;
    public headers: Map<string, string>;
    public data?: object | string | number;

    constructor(
        path: string,
        method: HttpMethod,
        headers: Map<string, string>,
        data?: object | string | number,
    ) {
        this.path = path;
        this.method = method;
        this.headers = headers;
        this.data = data;
    }

    public isTransaction(): boolean {
        return this.method === HttpMethod.Delete ||
            this.method === HttpMethod.Put ||
            this.method === HttpMethod.Patch ||
            this.method === HttpMethod.Post;
    }

}
