export interface HttpInterceptor {

    onIntercept(path: string, headers: Map<string, string>, data: any): Promise<void>

    getData(): any

    getPath(): string

    getHeaders(): Map<string, string>

}
