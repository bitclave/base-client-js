import { KeyPairHelper } from '../KeyPairHelper';
import RpcClientData from './RpcClientData';
import { KeyPair } from '../KeyPair';
import RpcSignMessage from './RpcSignMessage';
import RpcEncryptMessage from './RpcEncryptMessage';
import RpcDecryptMessage from './RpcDecryptMessage';
import { RpcTransport } from '../../../repository/source/rpc/RpcTransport';
import RpcCheckSignature from './RpcCheckSignature';
import { RpcToken } from './RpcToken';
import { RemoteSigner } from '../RemoteSigner';
import RpcDecryptEncryptFields from './RpcDecryptEncryptFields';
import RpcPermissionsFields from './RpcPermissionsFields';
import { AccessRight } from '../Permissions';
import { JsonUtils } from '../../JsonUtils';

const Mnemonic = require('bitcore-mnemonic');

export class RpcKeyPair implements KeyPairHelper, RemoteSigner {

    private rpcTransport: RpcTransport;
    private clientData: RpcClientData;
    private accessToken: string = '';

    constructor(rpcTransport: RpcTransport) {
        this.rpcTransport = rpcTransport;
    }

    public createKeyPair(passPhrase: string): Promise<KeyPair> {
        return this.rpcTransport.request('checkAccessToken', new RpcToken(this.accessToken))
            .then((response: any) => this.clientData = Object.assign(new RpcClientData(), response))
            .then((response: RpcClientData) => new KeyPair('', response.publicKey));
    };

    public generateMnemonicPhrase(): Promise<string> {
        return new Promise<string>(resolve => {
            const mnemonic: string = new Mnemonic(Mnemonic.Words.ENGLISH).toString();

            resolve(mnemonic);
        });
    }

    public signMessage(data: string): Promise<string> {
        return this.rpcTransport.request('signMessage', new RpcSignMessage(data, this.clientData.accessToken));
    }

    public checkSig(data: string, sig: string): Promise<boolean> {
        return this.rpcTransport.request('checkSig', new RpcCheckSignature(data, sig, this.clientData.accessToken));
    }

    public getPublicKey(): string {
        return this.clientData.publicKey;
    }

    public encryptMessage(recipientPk: string, message: string): Promise<string> {
        return this.rpcTransport.request(
            'encryptMessage',
            new RpcEncryptMessage(this.clientData.accessToken, recipientPk, message)
        );
    }

    encryptFields(fields: Map<string, string>): Promise<Map<string, string>> {
        return this.rpcTransport.request(
            'encryptFields',
            new RpcDecryptEncryptFields(this.clientData.accessToken, JsonUtils.mapToJson(fields))
        ).then((response) => JsonUtils.jsonToMap<string, string>(response));
    }

    encryptPermissionsFields(recipient: string, data: Map<string, AccessRight>): Promise<string> {
        return this.rpcTransport.request(
            'encryptPermissionsFields',
            new RpcPermissionsFields(this.clientData.accessToken, recipient, JsonUtils.mapToJson(data))
        );
    }

    public decryptMessage(senderPk: string, encrypted: string): Promise<string> {
        return this.rpcTransport.request(
            'decryptMessage',
            new RpcDecryptMessage(this.clientData.accessToken, senderPk, encrypted)
        );
    }

    public decryptFields(fields: Map<string, string>): Promise<Map<string, string>> {
        return this.rpcTransport.request(
            'decryptFields',
            new RpcDecryptEncryptFields(this.clientData.accessToken, JsonUtils.mapToJson(fields))
        ).then((response) => JsonUtils.jsonToMap<string, string>(response));
    }

    public setAccessToken(accessToken: string) {
        this.accessToken = accessToken;
    }

    public getAccessToken(): string {
        return this.accessToken;
    }

}
