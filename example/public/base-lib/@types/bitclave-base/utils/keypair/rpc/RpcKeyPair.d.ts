import { KeyPairHelper } from '../KeyPairHelper';
import { KeyPair } from '../KeyPair';
import { RpcTransport } from '../../../repository/source/rpc/RpcTransport';
import { RemoteSigner } from '../RemoteSigner';
export declare class RpcKeyPair implements KeyPairHelper, RemoteSigner {
    private rpcTransport;
    private clientData;
    private accessToken;
    constructor(rpcTransport: RpcTransport);
    createKeyPair(passPhrase: string): Promise<KeyPair>;
    generateMnemonicPhrase(): Promise<string>;
    signMessage(data: string): Promise<string>;
    checkSig(data: string, sig: string): Promise<boolean>;
    getPublicKey(): string;
    encryptMessage(recipientPk: string, message: string): Promise<string>;
    generatePasswordForField(fieldName: string): Promise<string>;
    decryptMessage(senderPk: string, encrypted: string): Promise<string>;
    setAccessToken(accessToken: string): void;
    getAccessToken(): string;
}
