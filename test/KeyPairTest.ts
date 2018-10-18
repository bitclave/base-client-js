import { KeyPairFactory } from '../src/utils/keypair/KeyPairFactory';
import { KeyPairHelper } from '../src/utils/keypair/KeyPairHelper';
import { MessageSigner } from '../src/utils/keypair/MessageSigner';
import { MessageDecrypt } from '../src/utils/keypair/MessageDecrypt';

const Message = require('bitcore-message');
const bitcore = require('bitcore-lib');
const ECIES = require('bitcore-ecies');

const should = require('chai')
    .use(require('chai-as-promised'))
    .should();

describe('Key pair and cryptography', async () => {

    const keyPairHelperAlisa: KeyPairHelper = KeyPairFactory.createDefaultKeyPair( null, null, '');
    const messageSigner: MessageSigner = keyPairHelperAlisa;

    const passPhraseAlisa: string = 'I\'m Alisa. This is my secret password';
    const passPhraseBob: string = 'I\'m Bob. This is my secret password';

    it('should generate different mnemonic phrase', async () => {
        const keyPairFirst = keyPairHelperAlisa.generateMnemonicPhrase();
        const keyPairSecond = keyPairHelperAlisa.generateMnemonicPhrase();

        keyPairFirst.should.be.not.equal(keyPairSecond);
    });

    it('should generate the same pair', async () => {
        const keyPairFirst = await keyPairHelperAlisa.createKeyPair(passPhraseAlisa);
        const keyPairSecond = await keyPairHelperAlisa.createKeyPair(passPhraseAlisa);

        keyPairFirst.publicKey.should.be.equal(keyPairSecond.publicKey);
        keyPairFirst.privateKey.should.be.equal(keyPairSecond.privateKey);
    });

    it('should generate the different pair', async () => {
        const keyPairAlisa = await keyPairHelperAlisa.createKeyPair(passPhraseAlisa);
        const keyPairBob = await keyPairHelperAlisa.createKeyPair(passPhraseBob);

        keyPairAlisa.publicKey.should.be.not.equal(keyPairBob.publicKey);
        keyPairAlisa.privateKey.should.be.not.equal(keyPairBob.privateKey);
    });

    it('encrypt and decrypt message', async () => {
        const keyPairHelperBob: KeyPairHelper = KeyPairFactory.createDefaultKeyPair(null, null, '');
        const decryptMessageBob: MessageDecrypt = keyPairHelperBob;

        const keyPairAlisa = await keyPairHelperAlisa.createKeyPair(passPhraseAlisa);
        const keyPairBob = await keyPairHelperBob.createKeyPair(passPhraseBob);
        const encryptedMessage = await keyPairHelperAlisa.encryptMessage(keyPairBob.publicKey.toString(), passPhraseAlisa);

        encryptedMessage.should.not.equal(passPhraseAlisa);
        const decryptedMessage = await decryptMessageBob.decryptMessage(
            keyPairAlisa.publicKey.toString(),
            encryptedMessage
        );

        decryptedMessage.should.be.equal(passPhraseAlisa);
    });

    it('validate signature of signed message', async () => {
        const keyPairAlisa = await keyPairHelperAlisa.createKeyPair(passPhraseAlisa);

        const addressAlisa = new bitcore.PrivateKey
            .fromString(keyPairAlisa.privateKey)
            .toAddress()
            .toString(16);

        const sig: string = await messageSigner.signMessage(passPhraseAlisa);

        sig.should.not.equal(passPhraseAlisa);

        Message(passPhraseAlisa).verify(addressAlisa, sig).should.be.equal(true);
    });

    it('Alisa decrypt message sended from Alisa', async () => {
        const keyPairHelperBob: KeyPairHelper = KeyPairFactory.createDefaultKeyPair(null, null, '');

        const keyPairAlisa = await keyPairHelperAlisa.createKeyPair(passPhraseAlisa);
        const keyPairBob = await keyPairHelperBob.createKeyPair(passPhraseBob);

        const encryptedMessage = await keyPairHelperAlisa.encryptMessage(keyPairBob.publicKey, passPhraseAlisa);

        const result = await keyPairHelperAlisa.decryptMessage(keyPairBob.publicKey, encryptedMessage);

        passPhraseAlisa.should.be.equal(result);
    });

});
