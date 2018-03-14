import DataRequest from '../models/DataRequest';
import { DataRequestState } from '../models/DataRequestState';

export interface DataRequestRepository {

    createRequest(toPk: string, encryptedRequest: string): Promise<number>;

    createResponse(requestId: number, encryptedResponse: string | null): Promise<DataRequestState>;

    grantAccessForClient(fromPk: string, toPk: string, encryptedResponse: string): Promise<number>

    getRequests(fromPk: string | null, toPk: string | null, state: DataRequestState): Promise<Array<DataRequest>>

    grantAccessForOffer(offerId: number, clientPk: string, encryptedClientResponse: string): Promise<void>

}
