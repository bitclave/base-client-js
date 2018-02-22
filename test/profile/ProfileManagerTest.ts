import KeyPairFactory from '../../src/utils/keypair/KeyPairFactory';
import { KeyPairHelper } from '../../src/utils/keypair/KeyPairHelper';
import { BehaviorSubject } from 'rxjs/Rx';
import Account from '../../src/repository/models/Account';
import ProfileManager from '../../src/manager/ProfileManager';
import ClientDataRepositoryImplMock from './ClientDataRepositoryImplMock';
import CryptoUtils from '../../src/utils/CryptoUtils';
import JsonUtils from '../../src/utils/JsonUtils';

const should = require('chai')
    .use(require('chai-as-promised'))
    .should();

describe('Profile Manager', async () => {
    const passPhraseAlisa: string = 'I\'m Alisa. This is my secret password';
    const passPhraseBob: string = 'I\'m Bob. This is my secret password';

    const keyPairHelperAlisa: KeyPairHelper = KeyPairFactory.getDefaultKeyPairCreator();
    const keyPairHelperBob: KeyPairHelper = KeyPairFactory.getDefaultKeyPairCreator();
    const clientRepository: ClientDataRepositoryImplMock = new ClientDataRepositoryImplMock();

    keyPairHelperAlisa.createKeyPair(passPhraseAlisa);
    keyPairHelperBob.createKeyPair(passPhraseBob);

    const accountAlisa: Account = new Account(keyPairHelperAlisa.createKeyPair(passPhraseAlisa).publicKey);
    const authAccountBehaviorAlisa: BehaviorSubject<Account> = new BehaviorSubject<Account>(accountAlisa);

    const profileManager = new ProfileManager(
        clientRepository,
        authAccountBehaviorAlisa,
        keyPairHelperAlisa,
        keyPairHelperAlisa
    );

    beforeEach(function (done) {
        clientRepository.clearData();
        done();
    });

    it('get and decrypt encrypted data', async () => {
        const origMockData: Map<string, string> = new Map();
        const mockData: Map<string, string> = new Map();

        origMockData.set('name', 'my name');
        origMockData.forEach((value, key) => {
            const passForValue = keyPairHelperAlisa.generatePasswordForFiled(key);
            mockData.set(key, CryptoUtils.encryptAes256(value, passForValue));
        });

        clientRepository.setMockData(authAccountBehaviorAlisa.getValue().publicKey, mockData);

        const data = await profileManager.getData();

        data.should.be.deep.equal(origMockData);
    });

    it('update data and validate updated data', async () => {
        const origMockData: Map<string, string> = new Map();
        const mockData: Map<string, string> = new Map();

        origMockData.set('email', 'im@host.com');
        origMockData.forEach((value, key) => {
            const passForValue = keyPairHelperAlisa.generatePasswordForFiled(key);
            mockData.set(key, CryptoUtils.encryptAes256(value, passForValue));
        });

        const data = await profileManager.updateData(origMockData);
        const savedData = await profileManager.getRawData(authAccountBehaviorAlisa.getValue().publicKey);
        const savedDecrypted = await profileManager.getData();

        data.should.be.not.deep.equal(mockData); // different IV every encryption. should be different value
        savedData.should.be.deep.equal(data);
        savedDecrypted.should.be.deep.equal(origMockData);
    });

    it('should decrypt foreign data', async () => {
        const origMockData: Map<string, string> = new Map();
        const mockData: Map<string, string> = new Map();
        const originMessage: Map<string, string> = new Map();

        origMockData.set('name', 'Bob');
        origMockData.forEach((value, key) => {
            const passForValue = keyPairHelperBob.generatePasswordForFiled(key);
            mockData.set(key, CryptoUtils.encryptAes256(value, passForValue));
            originMessage.set(key, passForValue);
        });

        const encryptedMessage = keyPairHelperBob.encryptMessage(
            keyPairHelperAlisa.getPublicKey(),
            JSON.stringify(JsonUtils.mapToJson(originMessage))
        );

        clientRepository.setMockData(keyPairHelperBob.getPublicKey(), mockData);

        const data = await profileManager.getAuthorizedData(keyPairHelperBob.getPublicKey(), encryptedMessage);

        data.should.be.deep.equal(origMockData);
    });

});
