import { RpcToken } from './RpcToken';
export default class RpcFieldPassword extends RpcToken {
    fieldName: string;
    constructor(accessToken: string, fieldName: string);
}
