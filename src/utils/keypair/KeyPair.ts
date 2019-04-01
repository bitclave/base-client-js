export class KeyPair {

    private readonly _privateKey: string;
    private readonly _publicKey: string;

    constructor(privateKey: string, publicKey: string) {
        this._privateKey = privateKey;
        this._publicKey = publicKey;
    }

    get privateKey(): string {
        return this._privateKey;
    }

    get publicKey(): string {
        return this._publicKey;
    }

}
