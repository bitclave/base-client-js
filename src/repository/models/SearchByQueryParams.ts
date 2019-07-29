import { ExcludeNonce } from '../source/http/NonceInterceptor';
import { ExcludeSignature } from '../source/http/SignInterceptor';
import { SignedSearchByQueryParams } from './SignedSearchByQueryParams';

@ExcludeSignature
@ExcludeNonce
export class SearchByQueryParams extends SignedSearchByQueryParams {
}
