import { DataRequestRepository } from '../../src/repository/requests/DataRequestRepository';
import DataRequest from '../../src/repository/models/DataRequest';
import { DataRequestState } from '../../src/repository/models/DataRequestState';
import { isNullOrUndefined } from 'util';

export default class DataRequestRepositoryImplMock implements DataRequestRepository {

    private _data: Array<DataRequest> = [];
    private fromPK: string = null;
    private toPk: string = null;

    clearData() {
        this._data = [];
    }

    setPK(fromPK: string, toPk: string) {
        this.fromPK = fromPK;
        this.toPk = toPk;
    }

    createRequest(toPk: string, encryptedRequest: string): Promise<string> {
        return new Promise<string>(resolve => {
            const request = new DataRequest(toPk, encryptedRequest);
            request.fromPk = this.fromPK;
            request.state = DataRequestState.AWAIT;
            request.id = this._data.length + 1;

            this._data.push(request);

            resolve(this._data.length.toString());
        });
    }

    createResponse(requestId: number, encryptedResponse: string | any): Promise<DataRequestState> {
        return new Promise<DataRequestState>(resolve => {

            const state: DataRequestState = (isNullOrUndefined(encryptedResponse) || encryptedResponse.trim().length == 0)
                ? DataRequestState.REJECT
                : DataRequestState.ACCEPT;

            const request: DataRequest = this._data[requestId - 1];

            if (request.toPk !== this.toPk) {
                throw 'different toPk!';
            }
            request.state = state;
            request.responseData = encryptedResponse;

            resolve(state);
        });
    }

    getRequests(fromPk: string | any, toPk: string | any, state: DataRequestState): Promise<Array<DataRequest>> {
        return new Promise<Array<DataRequest>>(resolve => {
            const result: Array<DataRequest> = [];

            this._data.forEach(item => {
                if ((fromPk != null && fromPk == item.fromPk
                        || toPk != null && toPk == item.toPk)
                    && state == item.state) {
                    result.push(Object.assign(new DataRequest(), item));
                }
            });

            resolve(result);
        });
    }

}
