import { Permissions } from '../Permissions';

export default class AccessData {

    public readonly origin: string;
    public readonly expireDate: string;
    public readonly permissions: Permissions;

    constructor(
        origin: string = '',
        expireDate: string = '',
        permissions: Permissions = new Permissions()
    ) {
        this.origin = origin;
        this.expireDate = expireDate;
        this.permissions = permissions;
    }
}
