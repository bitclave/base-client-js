export declare class KeyPair {
    private _privateKey;
    private _publicKey;
    constructor(privateKey: string, publicKey: string);
    readonly privateKey: string;
    readonly publicKey: string;
}
