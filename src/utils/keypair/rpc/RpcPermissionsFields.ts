import { AccessRight } from '../Permissions';
import { RpcToken } from './RpcToken';

export default class RpcPermissionsFields extends RpcToken {

    public readonly recipient: string;
    public readonly data: Map<string, AccessRight>;

    constructor(recipient: string, data: Map<string, AccessRight>) {
        super();
        this.recipient = recipient;
        this.data = data;
    }
}
