import { DeepCopy } from './DeepCopy';

export class DataRequest extends DeepCopy<DataRequest> {

    public id: number = 0;
    public fromPk: string = '';
    public toPk: string = '';
    public rootPk: string = '';
    public requestData: string = '';
    public responseData: string = '';

    constructor(
        fromPk: string = '',
        toPk: string = '',
        rootPk: string = '',
        requestData: string = '',
        responseData: string = ''
    ) {
        super(DataRequest);
        this.fromPk = fromPk || '';
        this.toPk = toPk || '';
        this.rootPk = rootPk || '';
        this.requestData = requestData || '';
        this.responseData = responseData || '';
    }
}
