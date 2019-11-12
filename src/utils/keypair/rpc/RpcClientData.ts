import { Permissions } from '../Permissions';
import AccessData from './RpcAccessData';

export default class ClientData extends AccessData {

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
