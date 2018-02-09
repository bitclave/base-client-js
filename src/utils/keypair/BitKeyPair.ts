import { KeyPairHelper } from './KeyPairHelper';
import CryptoUtils from '../CryptoUtils';
import KeyPair from './KeyPair';

const bitcore = require('bitcore-lib');
const Message = require('bitcore-message');
const ECIES = require('bitcore-ecies');

export default class BitKeyPair implements KeyPairHelper {

    private privateKey: any;
    private publicKey: any;

    createKeyPair(passPhrase: string): KeyPair {
        const pbkdf2: string = CryptoUtils.PBKDF2(passPhrase, 256);
        const hash: any = bitcore.crypto.Hash.sha256(new bitcore.deps.Buffer(pbkdf2));
        const bn: any = bitcore.crypto.BN.fromBuffer(hash);
        this.privateKey = new bitcore.PrivateKey(bn);
        this.publicKey = this.privateKey.toPublicKey();

        const privateKeyHex: string = this.privateKey.toString(16);
        const publicKeyHex = this.publicKey.toString(16);

        return new KeyPair(privateKeyHex, publicKeyHex);
    }

    signMessage(data: string): string {
        const message = new Message(data);

        return message.sign(this.privateKey);
    }

    getPublicKey(): string {
        return this.publicKey.toString(16);
    }

    encryptMessage(recipientPk: string, message: string): string {
        const ecies: any = ECIES()
            .privateKey(this.privateKey)
            .publicKey(bitcore.PublicKey.fromString(recipientPk));

        return ecies.encrypt(message)
            .toString('base64');
    }

    generatePasswordForFiled(fieldName: String): string {
        return CryptoUtils.PBKDF2(
            CryptoUtils.keccak256(this.privateKey.toString(16)) + fieldName.toLowerCase(),
            384
        );
    }

    decryptMessage(senderPk: string, encrypted: string): string {
        const ecies: any = ECIES()
            .privateKey(this.privateKey)
            .publicKey(bitcore.PublicKey.fromString(senderPk));

        return ecies
            .decrypt(new Buffer(encrypted, 'base64'))
            .toString();
    }

}
