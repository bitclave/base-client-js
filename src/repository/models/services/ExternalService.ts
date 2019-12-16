import { ClassCreator, DeepCopy } from '../DeepCopy';
import { JsonObject } from '../JsonObject';

export class ExternalService extends DeepCopy<ExternalService> {

    public readonly publicKey: string;
    public readonly endpoint: string;

    public static fromJson(json: JsonObject<ExternalService>): ExternalService {
        return Object.assign(new ExternalService(), json);
    }

    constructor(publicKey: string = '', endpoint: string = '') {
        super();
        this.publicKey = publicKey || '';
        this.endpoint = endpoint || '';
    }

    public toJson(): object {
        return this;
    }

    protected getClass(): ClassCreator<ExternalService> {
        return ExternalService;
    }
}
