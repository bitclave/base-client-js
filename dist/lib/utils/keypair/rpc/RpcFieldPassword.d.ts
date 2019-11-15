import { RpcToken } from './RpcToken';
export default class RpcFieldPassword extends RpcToken {
    readonly fieldName: string;
    constructor(fieldName: string);
}
