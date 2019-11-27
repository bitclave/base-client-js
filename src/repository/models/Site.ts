import { ClassCreator, DeepCopy } from './DeepCopy';
import { JsonObject } from './JsonObject';

export class Site extends DeepCopy<Site> {

    public readonly id: number;
    public readonly origin: string;
    public readonly publicKey: string;
    public readonly confidential: boolean;

    public static fromJson(json: JsonObject<Site>): Site {
        return Object.assign(new Site(), json);
    }

    constructor(id: number = 0, origin: string = '', publicKey: string = '', confidential: boolean = false) {
        super();
        this.id = id;
        this.origin = origin;
        this.publicKey = publicKey;
        this.confidential = confidential;
    }

    public toJson(): object {
        return this;
    }

    protected getClass(): ClassCreator<Site> {
        return Site;
    }
}
