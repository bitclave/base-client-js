import { DataRequestRepository } from './DataRequestRepository';
import DataRequest from '../models/DataRequest';
import { HttpTransport } from '../source/http/HttpTransport';
export default class DataRequestRepositoryImpl implements DataRequestRepository {
    private readonly CREATE_DATA_REQUEST;
    private readonly GET_DATA_REQUEST_FORM;
    private readonly GET_DATA_REQUEST_TO;
    private readonly GET_DATA_REQUEST_FROM_TO;
    private readonly GRANT_ACCESS_FOR_CLIENT;
    private readonly GRANT_ACCESS_FOR_OFFER;
    private transport;
    constructor(transport: HttpTransport);
    requestPermissions(toPk: string, encryptedRequest: string): Promise<number>;
    grantAccessForClient(fromPk: string, toPk: string, encryptedResponse: string): Promise<number>;
    getRequests(fromPk: string | null, toPk: string | null): Promise<Array<DataRequest>>;
    grantAccessForOffer(offerId: number, clientPk: string, encryptedClientResponse: string): Promise<void>;
    private isEmpty(value);
}
