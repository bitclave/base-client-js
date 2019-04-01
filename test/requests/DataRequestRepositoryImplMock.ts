import DataRequest from '../../src/repository/models/DataRequest';
import OfferShareData from '../../src/repository/models/OfferShareData';
import { DataRequestRepository } from '../../src/repository/requests/DataRequestRepository';

export default class DataRequestRepositoryImplMock implements DataRequestRepository {

    public shareData: Set<OfferShareData> = new Set();
    private data: Array<DataRequest> = [];
    private fromPK: string = '0x';

    public clearData() {
        this.data = [];
        this.shareData = new Set();
    }

    public setPK(fromPK: string) {
        this.fromPK = fromPK;
    }

    public async requestPermissions(toPk: string, encryptedRequest: string): Promise<number> {
        const requests: Array<DataRequest> = await this.findRequest(this.fromPK, toPk, false);
        const request = requests.length > 0 ? requests[0] : new DataRequest(toPk, encryptedRequest);

        request.fromPk = this.fromPK;
        request.requestData = encryptedRequest;
        request.id = request.id > 0 ? request.id : this.data.length + 1;

        if (requests.length === 0) {
            this.data.push(request);
        }

        return this.data.length;
    }

    public async grantAccessForClient(fromPk: string, toPk: string, encryptedResponse: string): Promise<number> {
        const requests: Array<DataRequest> = await this.findRequest(this.fromPK, toPk, false);
        const request = requests.length > 0 ? requests[0] : new DataRequest(toPk, '');

        request.responseData = encryptedResponse;
        request.fromPk = fromPk;

        request.id = request.id > 0 ? request.id : this.data.length + 1;

        if (requests.length === 0) {
            this.data.push(request);
        }

        return this.data.length;
    }

    public async getRequests(fromPk: string | null, toPk: string | null): Promise<Array<DataRequest>> {
        return this.findRequest(fromPk, toPk);
    }

    public grantAccessForOffer(
        offerId: number,
        clientPk: string,
        encryptedClientResponse: string,
        priceId: number
    ): Promise<void> {
        return new Promise<void>((resolve) => {
            this.shareData.add(new OfferShareData(offerId, encryptedClientResponse, priceId));
            resolve();
        });
    }

    private async findRequest(
        fromPk: string | null,
        toPk: string | null,
        makeUnique: boolean = true
    ): Promise<Array<DataRequest>> {

        const result: Array<DataRequest> = [];

        this.data.forEach((item) => {
            if ((fromPk == null || fromPk === undefined) && item.toPk === toPk ||
                (toPk == null || toPk === undefined) && item.fromPk === fromPk ||
                (fromPk != null && fromPk !== undefined && toPk != null && fromPk !== undefined) &&
                item.toPk === toPk && item.fromPk === fromPk) {
                if (makeUnique) {
                    result.push(Object.assign(new DataRequest(), item));
                } else {
                    result.push(item);
                }
            }
        });
        return result;
    }
}
