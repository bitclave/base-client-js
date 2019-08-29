import { ClassCreator } from './DeepCopy';
import { JsonObject } from './JsonObject';
import SimpleAccount from './SimpleAccount';

export default class Account extends SimpleAccount {

    public message: string = '';
    public sig: string = '';

    public static fromJson(json: JsonObject<Account>): Account {
        json.createdAt = new Date((json.createdAt as string) || new Date().getTime());
        json.updatedAt = new Date((json.updatedAt as string) || new Date().getTime());

        return Object.assign(new Account(), json);
    }

    constructor(publicKey: string = '', nonce: number = 0) {
        super(publicKey, nonce);
    }

    public toSimpleAccount() {
        return new SimpleAccount(this.publicKey, this.nonce);
    }

    public toJson(): object {
        const json = JSON.parse(JSON.stringify(this));
        json.createdAt = this.createdAt.toJSON();
        json.updatedAt = this.updatedAt.toJSON();

        return json;
    }

    protected deepCopyFromJson(): SimpleAccount {
        return Account.fromJson(this.toJson() as JsonObject<Account>);
    }

    protected getClass(): ClassCreator<Account> {
        return Account;
    }
}
