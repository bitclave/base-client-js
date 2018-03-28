import { HttpInterceptor } from './HttpInterceptor';
import { RepositoryStrategyType } from '../../RepositoryStrategyType';
export default class RepositoryStrategyInterceptor implements HttpInterceptor {
    private data;
    private path;
    private headers;
    private strategy;
    constructor(strategy: RepositoryStrategyType);
    changeStrategy(strategy: RepositoryStrategyType): void;
    onIntercept(path: string, headers: Map<string, string>, data: any): Promise<void>;
    getData(): any;
    getPath(): string;
    getHeaders(): Map<string, string>;
}
