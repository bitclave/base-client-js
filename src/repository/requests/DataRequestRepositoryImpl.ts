import { DataRequestRepository } from './DataRequestRepository';
import DataRequest from '../models/DataRequest';
import { HttpTransport } from '../source/http/HttpTransport';
import { HttpMethod } from '../source/http/HttpMethod';
import OfferShareData from '../models/OfferShareData';

export default class DataRequestRepositoryImpl implements DataRequestRepository {

    private readonly DATA_REQUEST: string = '/v1/data/request/';
    private readonly GRANT_ACCESS_FOR_CLIENT: string = '/v1/data/grant/request/';
    private readonly GRANT_ACCESS_FOR_OFFER: string = '/v1/data/grant/offer/';

    private transport: HttpTransport;

    constructor(transport: HttpTransport) {
        this.transport = transport;
    }

    requestPermissions(toPk: string, encryptedRequest: string): Promise<number> {
        const data: DataRequest = new DataRequest(toPk, encryptedRequest);
        return this.transport
            .sendRequest(
                this.DATA_REQUEST,
                HttpMethod.Post,
                data
            ).then((response) => parseInt(response.json.toString()));
    }

    grantAccessForClient(fromPk: string, toPk: string, encryptedResponse: string): Promise<number> {
        const data: DataRequest = new DataRequest(toPk, '');
        data.responseData = encryptedResponse;
        data.fromPk = fromPk;

        return this.transport
            .sendRequest(
                this.GRANT_ACCESS_FOR_CLIENT,
                HttpMethod.Post,
                data
            ).then((response) => parseInt(response.json.toString()));
    }

    getRequests(fromPk: string | null, toPk: string | null): Promise<Array<DataRequest>> {
        const params: Map<string, any> = new Map([
            ['toPk', toPk],
            ['fromPk', fromPk]
        ]);

        const strParams: string = this.joinParams(params);

        return this.transport
            .sendRequest(
                this.DATA_REQUEST + `?${strParams}`,
                HttpMethod.Get
            ).then((response) => Object.assign([], response.json));
    }

    grantAccessForOffer(offerSearchId: number, clientPk: string, encryptedClientResponse: string): Promise<void> {
        const shareData = new OfferShareData(offerSearchId, encryptedClientResponse);
        return this.transport
            .sendRequest(this.GRANT_ACCESS_FOR_OFFER, HttpMethod.Post, shareData)
            .then(() => {
            });
    }

    private joinParams(params: Map<string, any>): string {
        let result: Array<string> = [];
        params.forEach((value, key) => {
            if (!this.isEmpty(value)) {
                result.push(`${key}=${value}`)
            }
        });

        return result.join('&');
    }

    private isEmpty(value: string | null): boolean {
        return value == null || value == undefined || value.trim().length === 0;
    }

}
