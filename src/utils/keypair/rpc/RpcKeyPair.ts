import { RpcTransport } from '../../../repository/source/rpc/RpcTransport';
import { JsonUtils } from '../../JsonUtils';
import { KeyPair } from '../KeyPair';
import { AccessRight } from '../Permissions';
import { RemoteKeyPairHelper } from '../RemoteKeyPairHelper';
import RpcCheckSignature from './RpcCheckSignature';
import RpcClientData from './RpcClientData';
import RpcDecryptEncryptFields from './RpcDecryptEncryptFields';
import RpcDecryptMessage from './RpcDecryptMessage';
import RpcEncryptMessage from './RpcEncryptMessage';
import RpcPermissionsFields from './RpcPermissionsFields';
import RpcSignMessage from './RpcSignMessage';
import { RpcToken } from './RpcToken';

const Mnemonic = require('bitcore-mnemonic');

export class RpcKeyPair implements RemoteKeyPairHelper {

    private rpcTransport: RpcTransport;
    private clientData: RpcClientData;
    private accessToken: string = '';

    constructor(rpcTransport: RpcTransport) {
        this.rpcTransport = rpcTransport;
    }

    public createKeyPair(passPhrase: string): Promise<KeyPair> {
        return this.rpcTransport.request('checkAccessToken', new RpcToken(this.accessToken))
            .then((response) => this.clientData = Object.assign(new RpcClientData(), response))
            .then((response: RpcClientData) => new KeyPair('', response.publicKey));
    }

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

    public encryptFields(fields: Map<string, string>): Promise<Map<string, string>> {
        return this.rpcTransport.request(
            'encryptFields',
            new RpcDecryptEncryptFields(this.clientData.accessToken, JsonUtils.mapToJson(fields), new Map())
        ).then((response) => JsonUtils.jsonToMap<string, string>(response));
    }

    public encryptPermissionsFields(recipient: string, data: Map<string, AccessRight>): Promise<string> {
        return this.rpcTransport.request(
            'encryptPermissionsFields',
            new RpcPermissionsFields(this.clientData.accessToken, recipient, JsonUtils.mapToJson(data))
        );
    }

    public async encryptFieldsWithPermissions(
        recipient: string,
        data: Map<string, AccessRight>
    ): Promise<Map<string, string>> {

        const resultJson = await this.rpcTransport.request(
            'encryptFieldsWithPermissions',
            new RpcPermissionsFields(this.clientData.accessToken, recipient, JsonUtils.mapToJson(data))
        );

        return JsonUtils.jsonToMap<string, string>(resultJson);
    }

    public decryptMessage(senderPk: string, encrypted: string): Promise<string> {
        return this.rpcTransport.request(
            'decryptMessage',
            new RpcDecryptMessage(this.clientData.accessToken, senderPk, encrypted)
        );
    }

    public decryptFields(fields: Map<string, string>, passwords?: Map<string, string>): Promise<Map<string, string>> {
        return this.rpcTransport.request(
            'decryptFields',
            new RpcDecryptEncryptFields(
                this.clientData.accessToken,
                JsonUtils.mapToJson(fields),
                passwords ? JsonUtils.mapToJson(passwords) : new Map()
            )
        ).then((response) => JsonUtils.jsonToMap<string, string>(response));
    }

    public async encryptFile(file: string, fieldName: string): Promise<string> {
        const map = new Map([[fieldName, file]]);
        const result = await this.encryptFields(map);

        return result.get(fieldName) || '';
    }

    public async decryptFile(file: string, fieldName: string, password?: string): Promise<string> {
        const map = new Map([[fieldName, file]]);
        const passMap = password ? new Map([[fieldName, password]]) : new Map();
        const result = await this.decryptFields(map, passMap);

        return result.get(fieldName) || '';
    }

    public setAccessToken(accessToken: string) {
        this.accessToken = accessToken;
    }

    public getAccessToken(): string {
        return this.accessToken;
    }
}
