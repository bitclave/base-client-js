import { KeyPairCreator } from './KeyPairCreator';
import CryptoUtils from '../CryptoUtils';
import KeyPair from './KeyPair';
const bitcore = require('bitcore-lib');

export default class BitKeyPair implements KeyPairCreator {

    createKeyPair(passPhrase: string): KeyPair {
        const pbkdf2: string = CryptoUtils.PBKDF2(passPhrase, 256);
        const hash: any = bitcore.crypto.Hash.sha256(new bitcore.deps.Buffer(pbkdf2));
        const bn: any = bitcore.crypto.BN.fromBuffer(hash);
        const privateKey: any = new bitcore.PrivateKey(bn);
        const publicKey: any = privateKey.toPublicKey();
        const privateKeyHex: string = privateKey.toString(16);
        const publicKeyHex: string = publicKey.toString(16);

        return new KeyPair(privateKeyHex, publicKeyHex);
    }

}
