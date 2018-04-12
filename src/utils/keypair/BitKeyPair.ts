import { KeyPairHelper } from './KeyPairHelper';
import CryptoUtils from '../CryptoUtils';
import KeyPair from './KeyPair';

const bitcore = require('bitcore-lib');
const Message = require('bitcore-message');
const ECIES = require('bitcore-ecies');
const Mnemonic = require('bitcore-mnemonic');

export default class BitKeyPair implements KeyPairHelper {

    private privateKey: any;
    private publicKey: any;
    private addr: any;

    public createKeyPair(passPhrase: string): Promise<KeyPair> {
        return new Promise<KeyPair>(resolve => {
            const pbkdf2: string = CryptoUtils.PBKDF2(passPhrase, 256);
            const hash: any = bitcore.crypto.Hash.sha256(new bitcore.deps.Buffer(pbkdf2));
            const bn: any = bitcore.crypto.BN.fromBuffer(hash);
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

    public initKeyPairFromPrvKey(prvKey: string): KeyPair {
        this.privateKey = new bitcore.PrivateKey(bitcore.crypto.BN.fromString(prvKey, 16));
        this.publicKey = this.privateKey.toPublicKey();
        this.addr = this.privateKey.toAddress();

        const privateKeyHex: string = this.privateKey.toString(16);
        const publicKeyHex = this.publicKey.toString(16);

        return new KeyPair(privateKeyHex, publicKeyHex);
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
            const ecies: any = ECIES()
                .privateKey(this.privateKey)
                .publicKey(bitcore.PublicKey.fromString(recipientPk));

            resolve(ecies.encrypt(message)
                .toString('base64'));
        });
    }

    public generatePasswordForField(fieldName: String): Promise<string> {
        return new Promise<string>(resolve => {
            const result: string = CryptoUtils.PBKDF2(
                CryptoUtils.keccak256(this.privateKey.toString(16)) + fieldName.toLowerCase(),
                384
            );

            resolve(result);
        });
    }

    decryptMessage(senderPk: string, encrypted: string): Promise<string> {
        return new Promise<string>(resolve => {
            const ecies: any = ECIES()
                .privateKey(this.privateKey)
                .publicKey(bitcore.PublicKey.fromString(senderPk));

            const result: string = ecies
                .decrypt(new Buffer(encrypted, 'base64'))
                .toString();

            resolve(result);
        });
    }

}
