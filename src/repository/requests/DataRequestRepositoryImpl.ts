import { DataRequestRepository } from './DataRequestRepository';
import DataRequest from '../models/DataRequest';
import { HttpTransport } from '../source/http/HttpTransport';
import { HttpMethod } from '../source/http/HttpMethod';
import OfferShareData from '../models/OfferShareData';

export default class DataRequestRepositoryImpl implements DataRequestRepository {

    private readonly CREATE_DATA_REQUEST: string = '/v1/data/request/';
    private readonly GET_DATA_REQUEST_FORM: string = '/v1/data/request/from/{fromPk}/';
    private readonly GET_DATA_REQUEST_TO: string = '/v1/data/request/to/{toPk}/';
    private readonly GET_DATA_REQUEST_FROM_TO: string = '/v1/data/request/from/{fromPk}/to/{toPk}/';
    private readonly GRANT_ACCESS_FOR_CLIENT: string = '/v1/data/grant/request/';
    private readonly GRANT_ACCESS_FOR_OFFER: string = '/v1/data/grant/offer';

    private transport: HttpTransport;

    constructor(transport: HttpTransport) {
        this.transport = transport;
    }

    requestPermissions(toPk: string, encryptedRequest: string): Promise<number> {
        const data: DataRequest = new DataRequest(toPk, encryptedRequest);
        return this.transport
            .sendRequest(
                this.CREATE_DATA_REQUEST,
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
        let path: string = '';

        if (!this.isEmpty(fromPk) && !this.isEmpty(toPk)) {
            path = this.GET_DATA_REQUEST_FROM_TO;

        } else if (!this.isEmpty(fromPk) && this.isEmpty(toPk)) {
            path = this.GET_DATA_REQUEST_FORM;

        } else if (this.isEmpty(fromPk) && !this.isEmpty(toPk)) {
            path = this.GET_DATA_REQUEST_TO;
        }

        path = path.replace('{fromPk}', (fromPk || ''))
            .replace('{toPk}', (toPk || ''));

        return this.transport
            .sendRequest(
                path,
                HttpMethod.Get
            ).then((response) => Object.assign([], response.json));
    }

    grantAccessForOffer(offerId: number, clientPk: string, encryptedClientResponse: string): Promise<void> {
        const shareData = new OfferShareData(offerId, clientPk, encryptedClientResponse);
        return this.transport
            .sendRequest(this.GRANT_ACCESS_FOR_OFFER, HttpMethod.Post, shareData)
            .then(() => {
            });
    }

    private isEmpty(value: string | null): boolean {
        return value == null || value.trim().length === 0;
    }

}
