import DataRequest from '../models/DataRequest';

export interface DataRequestRepository {

    requestPermissions(toPk: string, encryptedRequest: string): Promise<number>;

    grantAccessForClient(fromPk: string, toPk: string, encryptedResponse: string): Promise<number>

    getRequests(fromPk: string | null, toPk: string | null): Promise<Array<DataRequest>>

    grantAccessForOffer(offerId: number, clientPk: string, encryptedClientResponse: string): Promise<void>

}
