import OfferSearch from '../repository/models/OfferSearch';
import Account from '../repository/models/Account';

export interface VerifyManager {

    getOfferSearchesByIds(ids: number[]): Promise<OfferSearch[]>;
    getAccountsByPublicKeys(publicKeys: string[]): Promise<Account[]>;

}
