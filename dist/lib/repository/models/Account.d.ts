import { ClassCreator } from './DeepCopy';
import { JsonObject } from './JsonObject';
import SimpleAccount from './SimpleAccount';
export default class Account extends SimpleAccount {
    message: string;
    sig: string;
    static fromJson(json: JsonObject<Account>): Account;
    constructor(publicKey?: string, nonce?: number);
    toSimpleAccount(): SimpleAccount;
    toJson(): object;
    protected deepCopyFromJson(): SimpleAccount;
    protected getClass(): ClassCreator<Account>;
}
