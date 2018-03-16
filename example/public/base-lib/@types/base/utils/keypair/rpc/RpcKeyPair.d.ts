import { KeyPairHelper } from '../KeyPairHelper';
import KeyPair from '../KeyPair';
import { RpcTransport } from '../../../repository/source/rpc/RpcTransport';
export default class RpcKeyPair implements KeyPairHelper {
    private client;
    private auth;
    private publicKey;
    constructor(client: RpcTransport);
    createKeyPair(passPhrase: string): Promise<KeyPair>;
    signMessage(data: string): Promise<string>;
    getPublicKey(): string;
    encryptMessage(recipientPk: string, message: string): Promise<string>;
    generatePasswordForField(fieldName: string): Promise<string>;
    decryptMessage(senderPk: string, encrypted: string): Promise<string>;
}
