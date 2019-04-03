import { Permissions } from '../Permissions';
import { RpcToken } from './RpcToken';

export default class AccessData extends RpcToken {
    public readonly origin: string;
    public readonly expireDate: string;
    public readonly permissions: Permissions;

    constructor(
        accessToken: string = '',
        origin: string = '',
        expireDate: string = '',
        permissions: Permissions = new Permissions()
    ) {
        super(accessToken);
        this.origin = origin;
        this.expireDate = expireDate;
        this.permissions = permissions;
    }

}
