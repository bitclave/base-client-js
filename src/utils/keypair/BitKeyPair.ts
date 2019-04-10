import { PermissionsSource } from '../../repository/assistant/PermissionsSource';
import { SiteDataSource } from '../../repository/assistant/SiteDataSource';
import DataRequest from '../../repository/models/DataRequest';
import { Site } from '../../repository/models/Site';
import { CryptoUtils } from '../CryptoUtils';
import { JsonUtils } from '../JsonUtils';
import { AcceptedField } from './AcceptedField';
import { KeyPair } from './KeyPair';
import { KeyPairHelper } from './KeyPairHelper';
import { AccessRight, Permissions } from './Permissions';

const bitcore = require('bitcore-lib');
const Message = require('bitcore-message');
const ECIES = require('bitcore-ecies');
const Mnemonic = require('bitcore-mnemonic');

declare interface PublicKey {
    toString(radix: number): string;
}

declare interface PrivateKey {
    toPublicKey(): PublicKey;

    toAddress(): Address;

    toString(radix: number): string;
}

declare interface Address {
    toString(radix: number): string;
}

export class BitKeyPair implements KeyPairHelper {

    private privateKey: PrivateKey;
    private publicKey: PublicKey;
    private addr: Address;
    private readonly permissions: Permissions;
    private readonly permissionsSource: PermissionsSource;
    private siteDataSource: SiteDataSource;
    private readonly origin: string;
    private isConfidential: boolean = false;

    public static getPublicKeyFromMnemonic(passPhrase: string): string {
        const pbkdf2: string = CryptoUtils.PBKDF2(passPhrase, 256);
        const hash = bitcore.crypto.Hash.sha256(new bitcore.deps.Buffer(pbkdf2));
        const bn = bitcore.crypto.BN.fromBuffer(hash);
        const privateKey = new bitcore.PrivateKey(bn);
        const publicKey = privateKey.toPublicKey();

        const publicKeyHex = publicKey.toString(16);
        return publicKeyHex;
    }
    
    constructor(permissionsSource: PermissionsSource, siteDataSource: SiteDataSource, origin: string) {
        this.permissions = new Permissions();
        this.permissionsSource = permissionsSource;
        this.siteDataSource = siteDataSource;
        this.origin = origin;
    }

    public createKeyPair(passPhrase: string): Promise<KeyPair> {
        return new Promise<KeyPair>(resolve => {
            const pbkdf2: string = CryptoUtils.PBKDF2(passPhrase, 256);
            const hash = bitcore.crypto.Hash.sha256(new bitcore.deps.Buffer(pbkdf2));
            const bn = bitcore.crypto.BN.fromBuffer(hash);
            this.privateKey = new bitcore.PrivateKey(bn);
            this.publicKey = this.privateKey.toPublicKey();
            this.addr = this.privateKey.toAddress();

            const privateKeyHex: string = this.privateKey.toString(16);
            const publicKeyHex = this.publicKey.toString(16);

            resolve(new KeyPair(privateKeyHex, publicKeyHex));
        });
    }

    public generateMnemonicPhrase(): Promise<string> {
        return new Promise<string>(resolve => {
            const mnemonic: string = new Mnemonic(Mnemonic.Words.ENGLISH).toString();

            resolve(mnemonic);
        });
    }

    public signMessage(data: string): Promise<string> {
        return new Promise<string>(resolve => {
            const message = new Message(data);

            resolve(message.sign(this.privateKey));
        });
    }

    public checkSig(data: string, sig: string): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            let result: boolean;

            try {
                result = Message(data).verify(this.privateKey.toAddress(), sig);
            } catch (e) {
                result = false;
            }
            resolve(result);
        });
    }

    public getPublicKey(): string {
        return this.publicKey.toString(16);
    }

    public getAddr(): string {
        return this.addr.toString(16);
    }

    public encryptMessage(recipientPk: string, message: string): Promise<string> {
        return new Promise<string>(resolve => {
            const ecies = new ECIES({noKey: true})
                .privateKey(this.privateKey)
                .publicKey(bitcore.PublicKey.fromString(recipientPk));

            resolve(
                ecies.encrypt(message)
                    .toString('base64')
            );
        });
    }

    public async encryptFields(fields: Map<string, string>): Promise<Map<string, string>> {
        return this.prepareData(fields, true);
    }

    public async encryptPermissionsFields(recipient: string, data: Map<string, AccessRight>): Promise<string> {
        const resultMap: Map<string, AcceptedField> = new Map();

        if (data != null && data.size > 0) {
            let pass: string;

            await this.syncPermissions();

            for (const [key, value] of data.entries()) {
                if (!this.hasPermissions(key, false)) {
                    continue;
                }

                pass = await this.generatePasswordForField(key.toLowerCase());
                resultMap.set(key, new AcceptedField(pass, value));
            }
        }

        const jsonMap = JsonUtils.mapToJson(resultMap);

        return await this.encryptMessage(recipient, JSON.stringify(jsonMap));
    }

    public async encryptFile(file: string): Promise<string> {
        return this.encryptMessage(this.getPublicKey(), file);

    }

    public async decryptFile(file: string): Promise<string> {
        return this.decryptMessage(this.getPublicKey(), file);
    }

    public async decryptMessage(senderPk: string, encrypted: string): Promise<string> {
        const ecies = new ECIES({noKey: true})
            .privateKey(this.privateKey)
            .publicKey(bitcore.PublicKey.fromString(senderPk));

        return ecies
            .decrypt(Buffer.from(encrypted, 'base64'))
            .toString();
    }

    public async decryptFields(fields: Map<string, string>): Promise<Map<string, string>> {
        return this.prepareData(fields, false);
    }

    private async prepareData(data: Map<string, string>, encrypt: boolean): Promise<Map<string, string>> {
        const result: Map<string, string> = new Map<string, string>();
        let pass: string;
        let changedValue: string;

        await this.syncPermissions();

        for (const [key, value] of data.entries()) {
            if (!this.hasPermissions(key, !encrypt)) {
                continue;
            }

            pass = await this.generatePasswordForField(key);
            if (pass != null && pass !== undefined && pass.length > 0) {
                changedValue = encrypt
                               ? CryptoUtils.encryptAes256(value, pass)
                               : CryptoUtils.decryptAes256(value, pass);

                result.set(key.toLowerCase(), changedValue);
            }
        }

        return result;
    }

    private hasPermissions(field: string, read: boolean): boolean {
        if (this.isConfidential) {
            return true;
        }

        const keyPermission: AccessRight | undefined = this.permissions.fields.get(field);

        return read
               ? keyPermission === AccessRight.R || keyPermission === AccessRight.RW
               : keyPermission === AccessRight.RW;
    }

    private async syncPermissions() {
        if (!this.isConfidential && this.permissions.fields.size === 0) {
            const site: Site = await this.siteDataSource.getSiteData(this.origin);
            this.isConfidential = site.confidential;

            if (!site.confidential) {
                const requests: Array<DataRequest> = await this.permissionsSource.getGrandAccessRecords(
                    site.publicKey, this.getPublicKey()
                );

                for (const request of requests) {
                    const strDecrypt: string = await this.decryptMessage(site.publicKey, request.responseData);
                    const jsonDecrypt = JSON.parse(strDecrypt);
                    const resultMap: Map<string, AcceptedField> = JsonUtils.jsonToMap(jsonDecrypt);

                    this.permissions.fields.clear();
                    resultMap.forEach(
                        (value, key) => {
                            this.permissions.fields.set(key, value.access);
                        },
                        this
                    );
                }
            }
        }
    }

    private generatePasswordForField(fieldName: string): Promise<string> {
        return new Promise<string>(resolve => {
            // const result: string = CryptoUtils.PBKDF2(
            //     CryptoUtils.keccak256(this.privateKey.toString(16)) + fieldName.toLowerCase(),
            //     384
            // );

            const result: string = bitcore.crypto.Hash.sha256hmac(
                bitcore.deps.Buffer(this.privateKey.toString(16)),
                bitcore.deps.Buffer(fieldName.toLowerCase())
            ).toString('hex');

            resolve(result);
        });
    }

}
