import { JsonUtils } from '../../utils/JsonUtils';
import { ClassCreator, DeepCopy } from './DeepCopy';
import { JsonObject } from './JsonObject';

export default class SimpleAccount extends DeepCopy<SimpleAccount> {

    public publicKey: string = '';
    public nonce: number = 0;
    public readonly createdAt: Date = new Date();
    public readonly updatedAt: Date = new Date();

    public static fromJson(json: JsonObject<SimpleAccount>): SimpleAccount {
        json.createdAt = JsonUtils.jsonDateToDate(json.createdAt);
        json.updatedAt = JsonUtils.jsonDateToDate(json.updatedAt);

        return Object.assign(new SimpleAccount(), json);
    }

    constructor(publicKey: string = '', nonce: number = 0) {
        super();
        this.publicKey = publicKey;
        this.nonce = nonce;
    }

    public toJson(): object {
        const json = JSON.parse(JSON.stringify(this));
        json.createdAt = this.createdAt.toJSON();
        json.updatedAt = this.updatedAt.toJSON();

        return json;
    }

    protected deepCopyFromJson(): SimpleAccount {
        return SimpleAccount.fromJson(this.toJson() as JsonObject<SimpleAccount>);
    }

    protected getClass(): ClassCreator<SimpleAccount> {
        return SimpleAccount;
    }
}
