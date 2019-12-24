import Account from '../models/Account';
import { OfferInteraction } from '../models/OfferInteraction';
import { OfferSearch } from '../models/OfferSearch';
import SearchRequest from '../models/SearchRequest';
export interface VerifyRepository {
    getOfferSearchesByIds(ids: Array<number>): Promise<Array<OfferSearch>>;
    getAccountsByPublicKeys(publicKeys: Array<string>): Promise<Array<Account>>;
    getAllAccounts(fromDate: Date): Promise<Array<Account>>;
    getDanglingOfferSearches(type: number): Promise<Array<OfferSearch>>;
    getDanglingOfferInteractions(): Promise<Array<OfferInteraction>>;
    fixDanglingOfferSearchesByCreatingInteractions(): Promise<Array<OfferInteraction>>;
    getSearchRequestWithSameTags(): Promise<Array<SearchRequest>>;
    getSearchRequestWithoutOwner(): Promise<Array<SearchRequest>>;
    getOfferInteractionsByOfferIdsAndOwners(offerIds: Array<number>, owners: Array<string>): Promise<Array<OfferInteraction>>;
    deleteUser(publicKey: string): Promise<void>;
}
