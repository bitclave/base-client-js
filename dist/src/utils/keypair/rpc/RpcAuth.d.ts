import RpcToken from './RpcToken';
import RpcPermissions from './RpcPermissions';
export default class RpcAuth extends RpcToken {
    passPhrase: string;
    origin: string;
    expireDate: string;
    permissions: RpcPermissions;
    constructor(accessToken?: string, passPhrase?: string, origin?: string, expireDate?: string, permissions?: RpcPermissions);
}
