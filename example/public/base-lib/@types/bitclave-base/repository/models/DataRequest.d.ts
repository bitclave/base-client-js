export default class DataRequest {
    readonly id: number;
    fromPk: string;
    toPk: string;
    requestData: string;
    responseData: string;
    constructor(toPk?: string, requestData?: string, responseData?: string);
}
