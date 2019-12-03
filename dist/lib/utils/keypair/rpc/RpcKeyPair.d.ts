import { RpcTransport } from '../../../repository/source/rpc/RpcTransport';
import { AccessTokenAccepter } from '../AccessTokenAccepter';
import { KeyPair } from '../KeyPair';
import { AccessRight } from '../Permissions';
import { RemoteKeyPairHelper } from '../RemoteKeyPairHelper';
import { TokenType } from './RpcToken';
export declare class RpcKeyPair implements RemoteKeyPairHelper {
    private readonly rpcTransport;
    private readonly tokenAccepter;
    private clientData;
    constructor(rpcTransport: RpcTransport, tokenAccepter: AccessTokenAccepter);
    createKeyPair(passPhrase: string): Promise<KeyPair>;
    generateMnemonicPhrase(): Promise<string>;
    signMessage(data: string): Promise<string>;
    checkSig(data: string, sig: string): Promise<boolean>;
    getPublicKey(): string;
    encryptMessage(recipientPk: string, message: string): Promise<string>;
    encryptFields(fields: Map<string, string>): Promise<Map<string, string>>;
    encryptPermissionsFields(recipient: string, data: Map<string, AccessRight>): Promise<string>;
    encryptFieldsWithPermissions(recipient: string, data: Map<string, AccessRight>): Promise<Map<string, string>>;
    decryptMessage(senderPk: string, encrypted: string): Promise<string>;
    decryptFields(fields: Map<string, string>, passwords?: Map<string, string>): Promise<Map<string, string>>;
    encryptFile(file: string, fieldName: string): Promise<string>;
    decryptFile(file: string, fieldName: string, password?: string): Promise<string>;
    setAccessData(accessToken: string, tokenType: TokenType): void;
}
