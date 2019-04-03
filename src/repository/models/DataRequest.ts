import { DeepCopy } from './ObjectClone';

export default class DataRequest extends DeepCopy<DataRequest> {

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
        super();
        this.toPk = toPk;
        this.requestData = requestData;
        this.responseData = responseData;
    }

}
