import { Permissions } from '../Permissions';
import AccessData from './RpcAccessData';
export default class ClientData extends AccessData {
    readonly publicKey: string;
    constructor(publicKey?: string, origin?: string, expireDate?: string, permissions?: Permissions);
}
