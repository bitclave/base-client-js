import Account from '../models/Account';
import OfferSearch from '../models/OfferSearch';

export interface VerifyRepository {
    getOfferSearchesByIds(ids: Array<number>): Promise<Array<OfferSearch>>;

    getAccountsByPublicKeys(publicKeys: Array<string>): Promise<Array<Account>>;

    getAllAccounts(): Promise<Array<Account>>;
}
