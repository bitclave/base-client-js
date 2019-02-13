import OfferSearch from '../repository/models/OfferSearch';

export interface VerifyManager {

    getOfferSearchesByIds(ids: number[]): Promise<OfferSearch[]>;

}
