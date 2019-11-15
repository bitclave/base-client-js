import { Permissions } from '../Permissions';
export default class AccessData {
    readonly origin: string;
    readonly expireDate: string;
    readonly permissions: Permissions;
    constructor(origin?: string, expireDate?: string, permissions?: Permissions);
}
