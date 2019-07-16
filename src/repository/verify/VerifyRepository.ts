import Account from '../models/Account';
import { OfferInteraction } from '../models/OfferInteraction';
import { OfferSearch } from '../models/OfferSearch';

export interface VerifyRepository {
    getOfferSearchesByIds(ids: Array<number>): Promise<Array<OfferSearch>>;

    getAccountsByPublicKeys(publicKeys: Array<string>): Promise<Array<Account>>;

    getAllAccounts(fromDate: Date): Promise<Array<Account>>;

    getDanglingOfferSearches(type: number): Promise<Array<OfferSearch>>;

    getDanglingOfferInteractions(): Promise<Array<OfferInteraction>>;
}
