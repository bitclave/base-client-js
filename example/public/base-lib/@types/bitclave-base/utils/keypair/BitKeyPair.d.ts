import { KeyPairHelper } from './KeyPairHelper';
import { KeyPair } from './KeyPair';
import { PermissionsSource } from '../../repository/assistant/PermissionsSource';
import { SiteDataSource } from '../../repository/assistant/SiteDataSource';
export declare class BitKeyPair implements KeyPairHelper {
    private privateKey;
    private publicKey;
    private addr;
    private permissions;
    private permissionsSource;
    private siteDataSource;
    private origin;
    constructor(permissionsSource: PermissionsSource, siteDataSource: SiteDataSource, origin: string);
    createKeyPair(passPhrase: string): Promise<KeyPair>;
    generateMnemonicPhrase(): Promise<string>;
    signMessage(data: string): Promise<string>;
    checkSig(data: string, sig: string): Promise<boolean>;
    getPublicKey(): string;
    getAddr(): string;
    encryptMessage(recipientPk: string, message: string): Promise<string>;
    generatePasswordForField(fieldName: string): Promise<string>;
    decryptMessage(senderPk: string, encrypted: string): Promise<string>;
}
