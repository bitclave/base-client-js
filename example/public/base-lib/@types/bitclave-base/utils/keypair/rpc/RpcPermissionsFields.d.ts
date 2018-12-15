import { RpcToken } from './RpcToken';
import { AccessRight } from '../Permissions';
export default class RpcPermissionsFields extends RpcToken {
    recipient: string;
    data: Map<string, AccessRight>;
    constructor(accessToken: string, recipient: string, data: Map<string, AccessRight>);
}
