import Account from '../models/Account';
import { OfferInteraction } from '../models/OfferInteraction';
import { OfferSearch } from '../models/OfferSearch';
import SearchRequest from '../models/SearchRequest';
import { HttpMethod } from '../source/http/HttpMethod';
import { HttpTransport } from '../source/http/HttpTransport';
import { VerifyRepository } from './VerifyRepository';

export class VerifyRepositoryImpl implements VerifyRepository {

    private readonly VERIFY_GET_OFFER_SEARCH_API = '/dev/verify/offersearch/ids';
    private readonly VERIFY_GET_ACCOUNTS_API = '/dev/verify/account/publickeys';
    private readonly VERIFY_GET_ALL_ACCOUNTS_API = '/dev/verify/account/all';

    private readonly VERIFY_GET_DANGLING_OFFER_SEARCH_API = '/dev/verify/offersearch/dangling/{type}';
    private readonly VERIFY_GET_DANGLING_OFFER_INTERACTION_API = '/dev/verify/offerinteraction/dangling';
    private readonly VERIFY_FIX_OFFER_SEARCH_API = '/dev/verify/offersearch/fix';

    private readonly VERIFY_GET_SEARCH_REQUEST_SAME_TAG_API = '/dev/verify/searchrequest/sametag';

    private transport: HttpTransport;

    constructor(transport: HttpTransport) {
        this.transport = transport;
    }

    public getOfferSearchesByIds(ids: Array<number>): Promise<Array<OfferSearch>> {
        return this.transport.sendRequest(
            this.VERIFY_GET_OFFER_SEARCH_API,
            HttpMethod.Post,
            ids
        ).then((response) => this.jsonToOfferSearchList(response.json));
    }

    public getAccountsByPublicKeys(publicKeys: Array<string>): Promise<Array<Account>> {
        return this.transport.sendRequest(
            this.VERIFY_GET_ACCOUNTS_API,
            HttpMethod.Post,
            publicKeys
        ).then((response) => this.jsonToAccountList(response.json));
    }

    public getAllAccounts(fromDate: Date): Promise<Array<Account>> {
        return this.transport.sendRequest(
            this.VERIFY_GET_ALL_ACCOUNTS_API,
            HttpMethod.Post,
            new Date(fromDate).getTime()
        ).then((response) => this.jsonToAccountList(response.json));
    }

    public getDanglingOfferSearches(type: number): Promise<Array<OfferSearch>> {
        return this.transport.sendRequest(
            this.VERIFY_GET_DANGLING_OFFER_SEARCH_API.replace('{type}', type.toString()),
            HttpMethod.Get
        ).then((response) => this.jsonToOfferSearchList(response.json));
    }

    public getDanglingOfferInteractions(): Promise<Array<OfferInteraction>> {
        return this.transport.sendRequest(
            this.VERIFY_GET_DANGLING_OFFER_INTERACTION_API,
            HttpMethod.Get
        ).then((response) => this.jsonToOfferInteractionList(response.json));
    }

    public fixDanglingOfferSearchesByCreatingInteractions(): Promise<Array<OfferInteraction>> {
        return this.transport.sendRequest(
            this.VERIFY_FIX_OFFER_SEARCH_API,
            HttpMethod.Get
        ).then((response) => this.jsonToOfferInteractionList(response.json));
    }

    public getSearchRequestWithSameTags(): Promise<Array<SearchRequest>> {
        return this.transport.sendRequest(
            this.VERIFY_GET_SEARCH_REQUEST_SAME_TAG_API,
            HttpMethod.Get
        ).then((response) => this.jsonToSearchRequestList(response.json));
    }

    private async jsonToOfferInteractionList(json: object): Promise<Array<OfferInteraction>> {
        return Object.keys(json).map(key => OfferInteraction.fromJson(json[key]));
    }

    private async jsonToOfferSearchList(json: object): Promise<Array<OfferSearch>> {
        return Object.keys(json).map(key => OfferSearch.fromJson(json[key]));
    }

    private async jsonToAccountList(json: object): Promise<Array<Account>> {
        return Object.keys(json).map(key => Account.fromJson(json[key]));
    }

    private async jsonToSearchRequestList(json: object): Promise<Array<SearchRequest>> {
        return Object.keys(json).map(key => SearchRequest.fromJson(json[key]));
    }

}
