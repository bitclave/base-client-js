import OfferSearchResultItem from './../models/OfferSearchResultItem';
import { OfferSearchRepository } from './OfferSearchRepository';
export default class OfferSearchRepositoryImpl implements OfferSearchRepository {
    private readonly OFFER_SEARCH_API;
    private host;
    constructor(host: string);
    getOfferSearchItem(clientId: string, searchResultId: number): Promise<OfferSearchResultItem>;
    private jsonToListResult;
}
