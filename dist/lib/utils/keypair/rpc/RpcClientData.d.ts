import { Permissions } from '../Permissions';
import { RpcAccessData } from './RpcAccessData';
export default class ClientData extends RpcAccessData {
    readonly publicKey: string;
    constructor(publicKey?: string, origin?: string, expireDate?: string, permissions?: Permissions);
}
