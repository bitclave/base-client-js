import { JsonTransform } from './JsonTransform';
export declare class SignedSearchByQueryParams extends JsonTransform {
    readonly searchRequestId: number;
    readonly filters: Map<string, Array<string>>;
    constructor(searchRequestId: number, filters?: Map<string, Array<string>>);
    setInterests(interests?: Array<string>): this;
    toJson(): object;
}
