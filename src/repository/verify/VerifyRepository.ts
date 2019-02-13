import OfferSearch from '../models/OfferSearch';
import Account from '../models/Account';

export interface VerifyRepository {
    getOfferSearchesByIds(ids: Array<number>): Promise<Array<OfferSearch>>;
    getAccountsByPublicKeys(publicKeys: Array<string>): Promise<Array<Account>>;
}
