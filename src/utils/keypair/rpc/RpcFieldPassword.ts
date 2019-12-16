import { RpcToken } from './RpcToken';

export default class RpcFieldPassword extends RpcToken {

    public readonly fieldName: string;

    constructor(fieldName: string) {
        super();
        this.fieldName = fieldName;
    }

}
