export class InterceptorCortege {

    path: string;
    headers: Map<string, string>;
    data?: any;

    constructor(path: string, headers: Map<string, string>, data?: any) {
        this.path = path;
        this.headers = headers;
        this.data = data;
    }

}
