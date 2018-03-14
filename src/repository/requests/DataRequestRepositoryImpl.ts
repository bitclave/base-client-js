import { DataRequestRepository } from './DataRequestRepository';
import DataRequest from '../models/DataRequest';
import { HttpTransport } from '../source/http/HttpTransport';
import { HttpMethod } from '../source/http/HttpMethod';
import { DataRequestState } from '../models/DataRequestState';
import OfferShareData from '../models/OfferShareData';

export default class DataRequestRepositoryImpl implements DataRequestRepository {

    private readonly CREATE_DATA_REQUEST: string = '/data/request/';
    private readonly GET_DATA_REQUEST_FORM: string = '/data/request/from/{fromPk}/state/{state}/';
    private readonly GET_DATA_REQUEST_TO: string = '/data/request/to/{toPk}/state/{state}/';
    private readonly GET_DATA_REQUEST_FROM_TO: string = '/data/request/from/{fromPk}/to/{toPk}/state/{state}/';
    private readonly RESPONSE_DATA_REQUEST: string = '/data/request/{id}/';
    private readonly GRANT_ACCESS_FOR_CLIENT: string = '/data/grant/request/';
    private readonly GRANT_ACCESS_FOR_OFFER: string = '/data/grant/offer';

    private transport: HttpTransport;

    constructor(transport: HttpTransport) {
        this.transport = transport;
    }

    createRequest(toPk: string, encryptedRequest: string): Promise<number> {
        const data: DataRequest = new DataRequest(toPk, encryptedRequest);
        return this.transport
            .sendRequest(
                this.CREATE_DATA_REQUEST,
                HttpMethod.Post,
                data
            ).then((response) => parseInt(response.json.toString()));
    }

    createResponse(requestId: number, encryptedResponse: string | null): Promise<DataRequestState> {
        return this.transport
            .sendRequest(
                this.RESPONSE_DATA_REQUEST.replace('{id}', requestId.toString()),
                HttpMethod.Patch,
                encryptedResponse || '',
            )
            .then((response) => DataRequestState[response.json.toString()]);
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

    getRequests(fromPk: string | null, toPk: string | null, state: DataRequestState): Promise<Array<DataRequest>> {
        let path: string = '';

        if (!this.isEmpty(fromPk) && !this.isEmpty(toPk)) {
            path = this.GET_DATA_REQUEST_FROM_TO;

        } else if (!this.isEmpty(fromPk) && this.isEmpty(toPk)) {
            path = this.GET_DATA_REQUEST_FORM;

        } else if (this.isEmpty(fromPk) && !this.isEmpty(toPk)) {
            path = this.GET_DATA_REQUEST_TO;
        }

        path = path.replace('{fromPk}', (fromPk || ''))
            .replace('{toPk}', (toPk || ''))
            .replace('{state}', state);

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
            .then(() => {});
    }

    private isEmpty(value: string | null): boolean {
        return value == null || value.trim().length === 0;
    }

}
