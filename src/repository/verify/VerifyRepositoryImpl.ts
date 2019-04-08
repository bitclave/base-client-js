import Account from '../models/Account';
import OfferSearch from '../models/OfferSearch';
import { HttpMethod } from '../source/http/HttpMethod';
import { HttpTransport } from '../source/http/HttpTransport';
import { VerifyRepository } from './VerifyRepository';

export class VerifyRepositoryImpl implements VerifyRepository {

    private readonly VERIFY_GET_OFFER_SEARCH_API = '/dev/verify/offersearch/ids';
    private readonly VERIFY_GET_ACCOUNTS_API = '/dev/verify/account/publickeys';
    private readonly VERIFY_GET_ALL_ACCOUNTS_API = '/dev/verify/account/all';

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

    public getAllAccounts(): Promise<Array<Account>> {
        return this.transport.sendRequest(
            this.VERIFY_GET_ALL_ACCOUNTS_API,
            HttpMethod.Get
        ).then((response) => this.jsonToAccountList(response.json));
    }

    private async jsonToOfferSearchList(json: object): Promise<Array<OfferSearch>> {
        return Object.keys(json).map(key => OfferSearch.fromJson(json[key]));
    }

    private async jsonToAccountList(json: object): Promise<Array<Account>> {
        return Object.keys(json).map(key => Account.fromJson(json[key]));
    }

}
