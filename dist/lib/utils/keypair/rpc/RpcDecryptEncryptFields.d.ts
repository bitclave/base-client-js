import { RpcToken } from './RpcToken';
export default class RpcDecryptEncryptFields extends RpcToken {
    readonly fields: Map<string, string>;
    readonly passwords: Map<string, string>;
    constructor(fields: Map<string, string>, passwords: Map<string, string>);
}
