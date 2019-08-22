import { JsonUtils } from '../../utils/JsonUtils';
import { ExcludeNonce } from '../source/http/NonceInterceptor';
import { JsonTransform } from './JsonTransform';

@ExcludeNonce
export class SignedSearchByQueryParams extends JsonTransform {

    public readonly searchRequestId: number;
    public readonly filters: Map<string, Array<string>>;

    constructor(searchRequestId: number, filters?: Map<string, Array<string>>) {
        super();
        this.searchRequestId = searchRequestId;
        this.filters = filters || new Map();
    }

    public setInterests(interests?: Array<string>): this {
        if (interests) {
            this.filters.set('interests', interests);
        }

        return this;
    }

    public toJson(): object {
        return {
            searchRequestId: this.searchRequestId,
            filters: JsonUtils.mapToJson(this.filters)
        };
    }
}
