import { DataRequestRepository } from './DataRequestRepository';
import DataRequest from '../models/DataRequest';
import { HttpTransport } from '../source/http/HttpTransport';
import { HttpMethod } from '../source/http/HttpMethod';
import { DataRequestState } from '../models/DataRequestState';

export default class DataRequestRepositoryImpl implements DataRequestRepository {

    private readonly CREATE_DATA_REQUEST: string = '/request/';
    private readonly GET_DATA_REQUEST_FORM: string = '/request/from/{fromPk}/state/{state}/';
    private readonly GET_DATA_REQUEST_TO: string = '/request/to/{toPk}/state/{state}/';
    private readonly GET_DATA_REQUEST_FROM_TO: string = '/request/from/{fromPk}/to/{toPk}/state/{state}/';
    private readonly RESPONSE_DATA_REQUEST: string = '/request/{id}/';

    private transport: HttpTransport;

    constructor(transport: HttpTransport) {
        this.transport = transport;
    }

    createRequest(toPk: string, encryptedRequest: string): Promise<string> {
        const data: DataRequest = new DataRequest(toPk, encryptedRequest);
        return this.transport
            .sendRequest(
                this.CREATE_DATA_REQUEST,
                HttpMethod.Post,
                data
            ).then((response) => response.json.toString());
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

    private isEmpty(value: string | null): boolean {
        return value == null || value.trim().length === 0;
    }

}
