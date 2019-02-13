import { VerifyRepository } from './VerifyRepository';
import OfferSearch from '../models/OfferSearch';
import { HttpTransport } from '../source/http/HttpTransport';
import { HttpMethod } from '../source/http/HttpMethod';
import Account from '../models/Account';

export class VerifyRepositoryImpl implements VerifyRepository {

    private readonly VERIFY_GET_OFFER_SEARCH_API = '/dev/verify/offersearch/ids';
    private readonly VERIFY_GET_ACCOUNTS_API = '/dev/verify/account/publickeys';

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

    private async jsonToOfferSearchList(json: any): Promise<Array<OfferSearch>> {
        const result: Array<OfferSearch> = [];

        for (let item of json) {
            result.push(OfferSearch.fromJson(item));
        }

        return result;
    }

    private async jsonToAccountList(json: any): Promise<Array<Account>> {
        const result: Array<Account> = [];

        for (let item of json) {
            result.push(Account.fromJson(item));
        }

        return result;
    }

}
