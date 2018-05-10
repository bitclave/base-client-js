import { Permissions } from '../Permissions';
import { RpcToken } from './RpcToken';

export default class AccessData extends RpcToken {
    origin: string;
    expireDate: string;
    permissions: Permissions;

    constructor(accessToken: string = '',
                origin: string = '',
                expireDate: string = '',
                permissions: Permissions = new Permissions()) {
        super(accessToken);
        this.origin = origin;
        this.expireDate = expireDate;
        this.permissions = permissions;
    }

}
