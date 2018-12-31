import { HttpMethod } from './HttpMethod';

export class InterceptorCortege {

    path: string;
    method: HttpMethod;
    headers: Map<string, string>;
    data?: any;
    file?: File;

    constructor(path: string, method: HttpMethod, headers: Map<string, string>, data?: any, file?: File) {
        this.path = path;
        this.method = method;
        this.headers = headers;
        this.data = data;
        this.file = file;
    }

    isTransaction(): boolean {
        return this.method == HttpMethod.Delete ||
            this.method == HttpMethod.Put ||
            this.method == HttpMethod.Patch ||
            this.method == HttpMethod.Post;
    }

}
