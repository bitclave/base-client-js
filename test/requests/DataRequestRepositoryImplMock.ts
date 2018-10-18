import { DataRequestRepository } from '../../src/repository/requests/DataRequestRepository';
import DataRequest from '../../src/repository/models/DataRequest';
import OfferShareData from '../../src/repository/models/OfferShareData';

export default class DataRequestRepositoryImplMock implements DataRequestRepository {

    private _data: Array<DataRequest> = [];
    private _shareData: Set<OfferShareData> = new Set();
    private fromPK: string = null;
    private toPk: string = null;

    clearData() {
        this._data = [];
        this._shareData = new Set();
    }

    setPK(fromPK: string, toPk: string) {
        this.fromPK = fromPK;
        this.toPk = toPk;
    }

    async requestPermissions(toPk: string, encryptedRequest: string): Promise<number> {
        const requests: Array<DataRequest> = await this.findRequest(this.fromPK, toPk, false);
        const request = requests.length > 0 ? requests[0] : new DataRequest(toPk, encryptedRequest);

        request.fromPk = this.fromPK;
        request.requestData = encryptedRequest;
        request.id = request.id > 0 ? request.id : this._data.length + 1;

        if (requests.length === 0) {
            this._data.push(request);
        }

        return this._data.length;
    }

    async grantAccessForClient(fromPk: string, toPk: string, encryptedResponse: string): Promise<number> {
        const requests: Array<DataRequest> = await this.findRequest(this.fromPK, toPk, false);
        const request = requests.length > 0 ? requests[0] : new DataRequest(toPk, '');

        request.responseData = encryptedResponse;
        request.fromPk = fromPk;

        request.id = request.id > 0 ? request.id : this._data.length + 1;

        if (requests.length === 0) {
            this._data.push(request);
        }

        return this._data.length;
    }

    async getRequests(fromPk: string | null, toPk: string | null): Promise<Array<DataRequest>> {
        return this.findRequest(fromPk, toPk);
    }

    grantAccessForOffer(offerId: number, clientPk: string, encryptedClientResponse: string, priceId: number): Promise<void> {
      return new Promise<void>(resolve => {
          this._shareData.add(new OfferShareData(offerId, encryptedClientResponse, priceId));
          resolve();
      });
  }

    private async findRequest(fromPk: string | null,
                              toPk: string | null,
                              makeUnique: boolean = true): Promise<Array<DataRequest>> {

        const result: Array<DataRequest> = [];

        this._data.forEach(item => {
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
