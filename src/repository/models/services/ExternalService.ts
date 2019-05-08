import { DeepCopy } from '../DeepCopy';

export class ExternalService extends DeepCopy<ExternalService> {
    public readonly publicKey: string;
    public readonly endpoint: string;

    constructor(publicKey: string = '', endpoint: string = '') {
        super();
        this.publicKey = publicKey || '';
        this.endpoint = endpoint || '';
    }
}