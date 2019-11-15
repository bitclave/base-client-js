import { DataRequest } from '../models/DataRequest';
import { InputGraphData } from '../models/InputGraphData';
import { OutputGraphData } from '../models/OutputGraphData';
import { HttpTransport } from '../source/http/HttpTransport';
import { DataRequestRepository } from './DataRequestRepository';
export default class DataRequestRepositoryImpl implements DataRequestRepository {
    private readonly DATA_REQUEST_GRAPH_API;
    private readonly DATA_REQUEST;
    private readonly GRANT_ACCESS_FOR_CLIENT;
    private readonly GRANT_ACCESS_FOR_OFFER;
    private transport;
    constructor(transport: HttpTransport);
    getRequestsGraph(data: InputGraphData): Promise<OutputGraphData>;
    requestPermissions(toPk: string, dataRequests: Array<DataRequest>): Promise<void>;
    grantAccessForClient(dataRequests: Array<DataRequest>): Promise<void>;
    revokeAccessForClient(dataRequests: Array<DataRequest>): Promise<void>;
    getRequests(fromPk: string | null, toPk: string | null): Promise<Array<DataRequest>>;
    grantAccessForOffer(offerSearchId: number, clientPk: string, encryptedClientResponse: string, priceId: number): Promise<void>;
    private joinParams;
    private isEmpty;
}
