import DataRequest from '../models/DataRequest';
import { DataRequestState } from '../models/DataRequestState';
export interface DataRequestRepository {
    createRequest(toPk: string, encryptedRequest: string): Promise<string>;
    createResponse(requestId: number, encryptedResponse: string | null): Promise<DataRequestState>;
    getRequests(fromPk: string | null, toPk: string | null, state: DataRequestState): Promise<Array<DataRequest>>;
}
