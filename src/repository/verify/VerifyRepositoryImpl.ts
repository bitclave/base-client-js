import { VerifyRepository } from './VerifyRepository';
import OfferSearch from '../models/OfferSearch';
import { HttpTransport } from '../source/http/HttpTransport';
import { HttpMethod } from '../source/http/HttpMethod';

export class VerifyRepositoryImpl implements VerifyRepository {

    private readonly VERIFY_GET_OFFER_SEARCH_API = '/dev/verify/offersearch/ids';

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

    private async jsonToOfferSearchList(json: any): Promise<Array<OfferSearch>> {
        const result: Array<OfferSearch> = [];

        for (let item of json) {
            result.push(OfferSearch.fromJson(item));
        }

        return result;
    }

}
