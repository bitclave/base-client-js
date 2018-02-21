import KeyPairFactory from '../src/utils/keypair/KeyPairFactory';
import { KeyPairHelper } from '../src/utils/keypair/KeyPairHelper';
import { MessageSigner } from '../src/utils/keypair/MessageSigner';
import { MessageDecrypt } from '../src/utils/keypair/MessageDecrypt';

const Message = require('bitcore-message');
const bitcore = require('bitcore-lib');
const should = require('chai')
    .use(require('chai-as-promised'))
    .should();

describe('Key pair and cryptography', async () => {
    const keyPairHelper: KeyPairHelper = KeyPairFactory.getDefaultKeyPairCreator();
    const messageSigner: MessageSigner = keyPairHelper;

    const passPhraseAlisa: string = 'I\'m Alisa. This is my secret password';
    const passPhraseBob: string = 'I\'m Bob. This is my secret password';

    it('should generate the same pair', async () => {
        const keyPairFirst = keyPairHelper.createKeyPair(passPhraseAlisa);
        const keyPairSecond = keyPairHelper.createKeyPair(passPhraseAlisa);

        keyPairFirst.publicKey.should.be.equal(keyPairSecond.publicKey);
        keyPairFirst.privateKey.should.be.equal(keyPairSecond.privateKey);
    });

    it('should generate the different pair', async () => {
        const keyPairAlisa = keyPairHelper.createKeyPair(passPhraseAlisa);
        const keyPairBob = keyPairHelper.createKeyPair(passPhraseBob);

        keyPairAlisa.publicKey.should.be.not.equal(keyPairBob.publicKey);
        keyPairAlisa.privateKey.should.be.not.equal(keyPairBob.privateKey);
    });

    it('encrypt and decrypt message', async () => {
        const keyPairHelperBob: KeyPairHelper = KeyPairFactory.getDefaultKeyPairCreator();
        const decryptMessageBob: MessageDecrypt = keyPairHelperBob;

        const keyPairAlisa = keyPairHelper.createKeyPair(passPhraseAlisa);
        const keyPairBob = keyPairHelperBob.createKeyPair(passPhraseBob);
        const encryptedMessage = keyPairHelper.encryptMessage(keyPairBob.publicKey.toString(16), passPhraseAlisa);

        encryptedMessage.should.not.equal(passPhraseAlisa);
        const decryptedMessage = decryptMessageBob.decryptMessage(
            keyPairAlisa.publicKey.toString(16), encryptedMessage
        );

        decryptedMessage.should.be.equal(passPhraseAlisa);
    });

    it('validate signature of signed message', async () => {
        const keyPairAlisa = keyPairHelper.createKeyPair(passPhraseAlisa);

        const addressAlisa = new bitcore.PrivateKey
            .fromString(keyPairAlisa.privateKey)
            .toAddress()
            .toString(16);

        const sig: string = messageSigner.signMessage(passPhraseAlisa);

        sig.should.not.equal(passPhraseAlisa);

        Message(passPhraseAlisa).verify(addressAlisa, sig).should.be.true;
    });

});
