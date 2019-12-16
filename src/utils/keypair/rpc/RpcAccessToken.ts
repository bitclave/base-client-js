export class RpcAccessToken {

    public readonly passPhrase: string;
    public readonly origin: Array<string>;
    public readonly expireDate: Date;

    constructor(
        passPhrase: string = '',
        origin: Array<string> = [],
        expireDate: Date = new Date()
    ) {
        this.passPhrase = passPhrase;
        this.origin = origin;
        this.expireDate = expireDate;
    }
}
