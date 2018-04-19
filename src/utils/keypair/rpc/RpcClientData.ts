import AccessData from './RpcAccessData';
import { Permissions } from '../Permissions';

export default class ClientData extends AccessData {

    publicKey: string;

    constructor(publicKey: string = '',
                accessToken: string = '',
                origin: string = '',
                expireDate: string = '',
                permissions: Permissions = new Permissions()) {
        super(accessToken, origin, expireDate, permissions);
        this.publicKey = publicKey;
    }

}
