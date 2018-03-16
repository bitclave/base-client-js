import { HttpInterceptor } from './HttpInterceptor';
import { RepositoryStrategyType } from '../../RepositoryStrategyType';

export default class RepositoryStrategyInterceptor implements HttpInterceptor {

    private data: any;
    private path: string;
    private headers: Map<string, string>;
    private strategy: RepositoryStrategyType;

    public constructor(strategy: RepositoryStrategyType) {
        this.strategy = strategy;
    }

    public changeStrategy(strategy: RepositoryStrategyType) {
        this.strategy = strategy;
    }

    public onIntercept(path: string, headers: Map<string, string>, data: any): Promise<void> {
        return new Promise(resolve => {
            this.path = path;
            this.headers = headers;
            this.data = data;

            this.headers.set('Strategy', this.strategy);

            resolve();
        })
    }

    public getData(): any {
        return this.data;
    }

    public getPath(): string {
        return this.path;
    }

    public getHeaders(): Map<string, string> {
        return this.headers;
    }

}
