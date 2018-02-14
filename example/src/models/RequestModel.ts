export default class RequestModel {

    requestId: number;
    from: string;
    fields: Array<string>;

    constructor(requestId: number, from: string, fields: Array<string>) {
        this.requestId = requestId;
        this.from = from;
        this.fields = fields;
    }

}
