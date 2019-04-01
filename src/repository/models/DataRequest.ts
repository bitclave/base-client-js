export default class DataRequest {

    public id: number = 0;
    public fromPk: string = '';
    public toPk: string = '';
    public requestData: string = '';
    public responseData: string = '';

    constructor(
        toPk: string = '',
        requestData: string = '',
        responseData: string = ''
    ) {
        this.toPk = toPk;
        this.requestData = requestData;
        this.responseData = responseData;
    }

}
