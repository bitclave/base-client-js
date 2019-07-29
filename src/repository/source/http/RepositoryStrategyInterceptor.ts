import { RepositoryStrategyType } from '../../RepositoryStrategyType';
import { HttpInterceptor } from './HttpInterceptor';
import { InterceptorCortege } from './InterceptorCortege';

export class RepositoryStrategyInterceptor implements HttpInterceptor {

    private strategy: RepositoryStrategyType;

    public constructor(strategy: RepositoryStrategyType) {
        this.strategy = strategy;
    }

    public changeStrategy(strategy: RepositoryStrategyType) {
        this.strategy = strategy;
    }

    public async onIntercept(cortege: InterceptorCortege): Promise<InterceptorCortege> {
        if (this.strategy !== RepositoryStrategyType.Postgres) {
            cortege.headers.set('Strategy', this.strategy);
        }

        return cortege;
    }
}
