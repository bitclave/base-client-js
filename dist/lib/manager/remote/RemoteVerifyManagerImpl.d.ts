import Account from '../../repository/models/Account';
import { OfferInteraction } from '../../repository/models/OfferInteraction';
import { OfferSearch } from '../../repository/models/OfferSearch';
import SearchRequest from '../../repository/models/SearchRequest';
import { RpcTransport } from '../../repository/source/rpc/RpcTransport';
import { VerifyManager } from '../VerifyManager';
export declare class RemoteVerifyManagerImpl implements VerifyManager {
    private readonly transport;
    constructor(transport: RpcTransport);
    fixDanglingOfferSearchesByCreatingInteractions(): Promise<Array<OfferInteraction>>;
    getAccountsByPublicKeys(publicKeys: Array<string>): Promise<Array<Account>>;
    getAllAccounts(fromDate: Date): Promise<Array<Account>>;
    getDanglingOfferInteractions(): Promise<Array<OfferInteraction>>;
    getDanglingOfferSearches(type: number): Promise<Array<OfferSearch>>;
    getOfferInteractionsByOfferIdsAndOwners(offerIds: Array<number>, owners: Array<string>): Promise<Array<OfferInteraction>>;
    getOfferSearchesByIds(ids: Array<number>): Promise<Array<OfferSearch>>;
    getSearchRequestWithSameTags(): Promise<Array<SearchRequest>>;
    getSearchRequestWithoutOwner(): Promise<Array<SearchRequest>>;
    deleteUser(publicKey: string): Promise<void>;
}
