import Permissions from './RpcPermissions';
import RpcToken from './RpcToken';
export default class AccessData extends RpcToken {
    origin: string;
    expireDate: string;
    permissions: Permissions;
    constructor(accessToken?: string, origin?: string, expireDate?: string, permissions?: Permissions);
}
