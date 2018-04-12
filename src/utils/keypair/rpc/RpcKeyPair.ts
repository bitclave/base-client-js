import { KeyPairHelper } from '../KeyPairHelper';
import RpcAuth from './RpcAuth';
import RpcPassPhrase from './RpcPassPhrase';
import KeyPair from '../KeyPair';
import RpcSignMessage from './RpcSignMessage';
import RpcEncryptMessage from './RpcEncryptMessage';
import RpcFieldPassword from './RpcFieldPassword';
import RpcDecryptMessage from './RpcDecryptMessage';
import { RpcTransport } from '../../../repository/source/rpc/RpcTransport';
import RpcCheckSignature from './RpcCheckSignature';

const Mnemonic = require('bitcore-mnemonic');

export default class RpcKeyPair implements KeyPairHelper {

    private client: RpcTransport;
    private auth: RpcAuth;
    private publicKey: string = '';

    constructor(client: RpcTransport) {
        this.client = client;
    }

    public createKeyPair(passPhrase: string): Promise<KeyPair> {
        return this.client.request('generateAccessToken', new RpcPassPhrase(passPhrase))
            .then((response: any) => this.auth = response)
            .then((auth: RpcAuth) => this.client.request('registerClient', auth))
            .then((response: any) => {
                this.publicKey = response;

                return new KeyPair('', response);
            });
    };

    public generateMnemonicPhrase(): Promise<string> {
        return new Promise<string>(resolve => {
            const mnemonic: string = new Mnemonic(Mnemonic.Words.ENGLISH).toString();

            resolve(mnemonic);
        });
    }

    public signMessage(data: string): Promise<string> {
        return this.client.request('signMessage', new RpcSignMessage(data, this.auth.accessToken))
    }

    public checkSig(data: string, sig: string): Promise<boolean> {
        return this.client.request('checkSig', new RpcCheckSignature(data, sig, this.auth.accessToken))
    }

    public getPublicKey(): string {
        return this.publicKey;
    }

    public encryptMessage(recipientPk: string, message: string): Promise<string> {
        return this.client.request(
            'encryptMessage',
            new RpcEncryptMessage(this.auth.accessToken, recipientPk, message)
        );
    }

    public generatePasswordForField(fieldName: string): Promise<string> {
        return this.client.request(
            'generatePasswordForField',
            new RpcFieldPassword(this.auth.accessToken, fieldName)
        );
    }

    public decryptMessage(senderPk: string, encrypted: string): Promise<string> {
        return this.client.request(
            'decryptMessage',
            new RpcDecryptMessage(this.auth.accessToken, senderPk, encrypted)
        );
    }

}
