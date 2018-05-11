export default class DataRequest {

    readonly id: number = 0;
    fromPk: string = '';
    toPk: string = '';
    requestData: string = '';
    responseData: string = '';

    constructor(toPk: string = '',
                requestData: string = '',
                responseData: string = '') {
        this.toPk = toPk;
        this.requestData = requestData;
        this.responseData = responseData;
    }

}
