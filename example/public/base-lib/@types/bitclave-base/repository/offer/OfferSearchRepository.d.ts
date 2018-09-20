import OfferSearchResultItem from './../models/OfferSearchResultItem';
export interface OfferSearchRepository {
    getOfferSearchItem(clientId: string, searchResultId: number): Promise<OfferSearchResultItem>;
}
