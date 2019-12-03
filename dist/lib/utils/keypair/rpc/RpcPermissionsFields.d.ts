import { AccessRight } from '../Permissions';
import { RpcToken } from './RpcToken';
export default class RpcPermissionsFields extends RpcToken {
    readonly recipient: string;
    readonly data: Map<string, AccessRight>;
    constructor(recipient: string, data: Map<string, AccessRight>);
}
