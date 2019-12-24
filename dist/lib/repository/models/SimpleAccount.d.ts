import { ClassCreator, DeepCopy } from './DeepCopy';
import { JsonObject } from './JsonObject';
export default class SimpleAccount extends DeepCopy<SimpleAccount> {
    publicKey: string;
    nonce: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    static fromJson(json: JsonObject<SimpleAccount>): SimpleAccount;
    constructor(publicKey?: string, nonce?: number);
    toJson(): object;
    protected deepCopyFromJson(): SimpleAccount;
    protected getClass(): ClassCreator<SimpleAccount>;
}
