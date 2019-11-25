import Account from '../../repository/models/Account';
import { OfferInteraction } from '../../repository/models/OfferInteraction';
import { OfferSearch } from '../../repository/models/OfferSearch';
import SearchRequest from '../../repository/models/SearchRequest';
import { RpcTransport } from '../../repository/source/rpc/RpcTransport';
import { ArrayDeserializer } from '../../utils/types/json-transform/deserializers/ArrayDeserializer';
import { VerifyManager } from '../VerifyManager';

export class RemoteVerifyManagerImpl implements VerifyManager {

    constructor(private readonly transport: RpcTransport) {
    }

    public fixDanglingOfferSearchesByCreatingInteractions(): Promise<Array<OfferInteraction>> {
        return this.transport.request(
            'fixDanglingOfferSearchesByCreatingInteractions',
            [],
            new ArrayDeserializer(OfferInteraction)
        );
    }

    public getAccountsByPublicKeys(publicKeys: Array<string>): Promise<Array<Account>> {
        return this.transport.request('getAccountsByPublicKeys', [publicKeys], new ArrayDeserializer(Account));
    }

    public getAllAccounts(fromDate: Date): Promise<Array<Account>> {
        return this.transport.request('getAllAccounts', [fromDate], new ArrayDeserializer(Account));
    }

    public getDanglingOfferInteractions(): Promise<Array<OfferInteraction>> {
        return this.transport.request('getDanglingOfferInteractions', [], new ArrayDeserializer(OfferInteraction));
    }

    public getDanglingOfferSearches(type: number): Promise<Array<OfferSearch>> {
        return this.transport.request('getDanglingOfferSearches', [type], new ArrayDeserializer(OfferSearch));
    }

    public getOfferInteractionsByOfferIdsAndOwners(
        offerIds: Array<number>,
        owners: Array<string>
    ): Promise<Array<OfferInteraction>> {
        return this.transport.request(
            'getOfferInteractionsByOfferIdsAndOwners',
            [offerIds, owners],
            new ArrayDeserializer(OfferInteraction)
        );
    }

    public getOfferSearchesByIds(ids: Array<number>): Promise<Array<OfferSearch>> {
        return this.transport.request('getDanglingOfferSearches', [ids], new ArrayDeserializer(OfferSearch));
    }

    public getSearchRequestWithSameTags(): Promise<Array<SearchRequest>> {
        return this.transport.request('getSearchRequestWithSameTags', [], new ArrayDeserializer(SearchRequest));
    }

    public getSearchRequestWithoutOwner(): Promise<Array<SearchRequest>> {
        return this.transport.request('getSearchRequestWithoutOwner', [], new ArrayDeserializer(SearchRequest));
    }
}
