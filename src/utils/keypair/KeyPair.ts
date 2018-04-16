export class KeyPair {

    private _privateKey: string;
    private _publicKey: string;

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
