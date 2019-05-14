import { DeepCopy } from './DeepCopy';

export class Site extends DeepCopy<Site> {

    public readonly id: number;
    public readonly origin: string;
    public readonly publicKey: string;
    public readonly confidential: boolean;

    constructor(id: number = 0, origin: string = '', publicKey: string = '', confidential: boolean = false) {
        super(Site);
        this.id = id;
        this.origin = origin;
        this.publicKey = publicKey;
        this.confidential = confidential;
    }

}
