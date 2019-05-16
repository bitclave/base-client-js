import { DataRequest } from '../models/DataRequest';

export interface DataRequestRepository {

    requestPermissions(toPk: string, dataRequests: Array<DataRequest>): Promise<void>;

    grantAccessForClient(dataRequests: Array<DataRequest>): Promise<void>;

    revokeAccessForClient(dataRequests: Array<DataRequest>): Promise<void>;

    getRequests(fromPk: string | null, toPk: string | null): Promise<Array<DataRequest>>;

    grantAccessForOffer(
        offerId: number,
        clientPk: string,
        encryptedClientResponse: string,
        priceId: number
    ): Promise<void>;
}
