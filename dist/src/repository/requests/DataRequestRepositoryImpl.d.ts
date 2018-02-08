import { DataRequestRepository } from './DataRequestRepository';
import DataRequest from '../models/DataRequest';
import { HttpTransport } from '../source/http/HttpTransport';
import { DataRequestState } from '../models/DataRequestState';
export default class DataRequestRepositoryImpl implements DataRequestRepository {
    private readonly CREATE_DATA_REQUEST;
    private readonly GET_DATA_REQUEST_FORM;
    private readonly GET_DATA_REQUEST_TO;
    private readonly GET_DATA_REQUEST_FROM_TO;
    private readonly RESPONSE_DATA_REQUEST;
    private transport;
    constructor(transport: HttpTransport);
    createRequest(toPk: string, encryptedRequest: string): Promise<string>;
    createResponse(requestId: number, encryptedResponse: string | null): Promise<DataRequestState>;
    getRequests(fromPk: string | null, toPk: string | null, state: DataRequestState): Promise<Array<DataRequest>>;
}
