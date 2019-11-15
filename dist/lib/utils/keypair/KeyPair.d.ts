export declare class KeyPair {
    private readonly _privateKey;
    private readonly _publicKey;
    constructor(privateKey: string, publicKey: string);
    readonly privateKey: string;
    readonly publicKey: string;
}
