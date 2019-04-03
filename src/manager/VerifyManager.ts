import Account from '../repository/models/Account';
import OfferSearch from '../repository/models/OfferSearch';

export interface VerifyManager {

    getOfferSearchesByIds(ids: Array<number>): Promise<Array<OfferSearch>>;

    getAccountsByPublicKeys(publicKeys: Array<string>): Promise<Array<Account>>;

}
