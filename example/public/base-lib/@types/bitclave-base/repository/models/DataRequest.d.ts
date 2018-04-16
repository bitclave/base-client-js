import { DataRequestState } from './DataRequestState';
export default class DataRequest {
    readonly id: number;
    fromPk: string;
    toPk: string;
    requestData: string;
    responseData: string;
    state: DataRequestState;
    constructor(toPk?: string, requestData?: string, responseData?: string);
}
