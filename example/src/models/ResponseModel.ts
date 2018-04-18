import { DataRequestState } from 'bitclave-base';

export default class ResponseModel {

    requestId: number;
    from: string;
    fields: Map<string, string>;
    state: DataRequestState;

    constructor(requestId: number, from: string, fields: Map<string, string>, state: DataRequestState) {
        this.requestId = requestId;
        this.from = from;
        this.fields = fields;
        this.state = state;
    }

}
