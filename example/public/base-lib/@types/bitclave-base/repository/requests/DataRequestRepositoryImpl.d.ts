import { DataRequestRepository } from './DataRequestRepository';
import DataRequest from '../models/DataRequest';
import { HttpTransport } from '../source/http/HttpTransport';
export default class DataRequestRepositoryImpl implements DataRequestRepository {
    private readonly DATA_REQUEST;
    private readonly GRANT_ACCESS_FOR_CLIENT;
    private readonly GRANT_ACCESS_FOR_OFFER;
    private transport;
    constructor(transport: HttpTransport);
    requestPermissions(toPk: string, encryptedRequest: string): Promise<number>;
    grantAccessForClient(fromPk: string, toPk: string, encryptedResponse: string): Promise<number>;
    getRequests(fromPk: string | null, toPk: string | null): Promise<Array<DataRequest>>;
    grantAccessForOffer(offerSearchId: number, clientPk: string, encryptedClientResponse: string, priceId: number): Promise<any>;
    private joinParams;
    private isEmpty;
}
