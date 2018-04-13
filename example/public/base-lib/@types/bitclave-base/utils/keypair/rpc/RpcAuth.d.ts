import RpcToken from './RpcToken';
export default class RpcAuth extends RpcToken {
    passPhrase: string;
    baseUrl: string;
    accessToken: string;
    constructor(passPhrase: string, baseUrl: string, accessToken: string);
}
