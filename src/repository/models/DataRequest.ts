import { ClassCreator, DeepCopy } from './DeepCopy';
import { JsonObject } from './JsonObject';

export class DataRequest extends DeepCopy<DataRequest> {

    public id: number = 0;
    public fromPk: string = '';
    public toPk: string = '';
    public rootPk: string = '';
    public requestData: string = '';
    public responseData: string = '';

    public static fromJson(json: JsonObject<DataRequest>): DataRequest {
        return Object.assign(new DataRequest(), json);
    }
    
    constructor(
        fromPk: string = '',
        toPk: string = '',
        rootPk: string = '',
        requestData: string = '',
        responseData: string = ''
    ) {
        super();
        this.fromPk = fromPk || '';
        this.toPk = toPk || '';
        this.rootPk = rootPk || '';
        this.requestData = requestData || '';
        this.responseData = responseData;
    }

    public toJson(): object {
        return this;
    }

    protected getClass(): ClassCreator<DataRequest> {
        return DataRequest;
    }
}
