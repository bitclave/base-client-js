import OfferSearch from '../models/OfferSearch';

export interface VerifyRepository {
    getOfferSearchesByIds(ids: Array<number>): Promise<Array<OfferSearch>>;
}
