import { Permissions } from '../Permissions';
import AccessData from './RpcAccessData';

export default class ClientData extends AccessData {

    public readonly publicKey: string;

    constructor(
        publicKey: string = '',
        accessToken: string = '',
        origin: string = '',
        expireDate: string = '',
        permissions: Permissions = new Permissions()
    ) {
        super(accessToken, origin, expireDate, permissions);
        this.publicKey = publicKey;
    }

}
