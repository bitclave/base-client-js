import { Permissions } from '../Permissions';
export declare class RpcAccessData {
    readonly origin: string;
    readonly expireDate: string;
    readonly permissions: Permissions;
    constructor(origin?: string, expireDate?: string, permissions?: Permissions);
}
