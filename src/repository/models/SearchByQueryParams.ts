import { excludeNonce } from '../source/http/NonceInterceptor';
import { excludeSignature } from '../source/http/SignInterceptor';
import { SignedSearchByQueryParams } from './SignedSearchByQueryParams';

@excludeSignature
@excludeNonce
export class SearchByQueryParams extends SignedSearchByQueryParams {
}
