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

    public onIntercept(cortege: InterceptorCortege): Promise<InterceptorCortege> {
        return new Promise<InterceptorCortege>(resolve => {
            cortege.headers.set('Strategy', this.strategy);

            resolve(cortege);
        });
    }

}
