import { DataRequest } from '../models/DataRequest';
import { InputGraphData } from '../models/InputGraphData';
import { OutputGraphData } from '../models/OutputGraphData';
export interface DataRequestRepository {
    getRequestsGraph(data: InputGraphData): Promise<OutputGraphData>;
    requestPermissions(toPk: string, dataRequests: Array<DataRequest>): Promise<void>;
    grantAccessForClient(dataRequests: Array<DataRequest>): Promise<void>;
    revokeAccessForClient(dataRequests: Array<DataRequest>): Promise<void>;
    getRequests(fromPk: string | null, toPk: string | null): Promise<Array<DataRequest>>;
    grantAccessForOffer(offerId: number, clientPk: string, encryptedClientResponse: string, priceId: number): Promise<void>;
}
