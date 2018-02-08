import { DataRequestState } from './DataRequestState';

export default class DataRequest {

    readonly id: number = 0;
    fromPk: string = '';
    toPk: string = '';
    requestData: string = '';
    responseData: string = '';

    state: DataRequestState = DataRequestState.UNDEFINED;

    constructor(toPk: string = '', requestData: string = '', responseData: string = '') {
        this.toPk = toPk;
        this.requestData = requestData;
        this.responseData = responseData;
    }

}
