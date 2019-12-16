import { Permissions } from '../Permissions';
import { RpcAccessData } from './RpcAccessData';

export default class ClientData extends RpcAccessData {

    public readonly publicKey: string;

    constructor(
        publicKey: string = '',
        origin: string = '',
        expireDate: string = '',
        permissions: Permissions = new Permissions()
    ) {
        super(origin, expireDate, permissions);
        this.publicKey = publicKey;
    }
}
