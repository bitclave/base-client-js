import KeyPairFactory from '../../src/utils/keypair/KeyPairFactory';
import { KeyPairHelper } from '../../src/utils/keypair/KeyPairHelper';
import { BehaviorSubject } from 'rxjs/Rx';
import Account from '../../src/repository/models/Account';
import ProfileManager from '../../src/manager/ProfileManager';
import ClientDataRepositoryImplMock from './ClientDataRepositoryImplMock';
import CryptoUtils from '../../src/utils/CryptoUtils';
import JsonUtils from '../../src/utils/JsonUtils';
import { RpcTransport } from '../../src/repository/source/rpc/RpcTransport';
import RpcTransportImpl from '../../src/repository/source/rpc/RpcTransportImpl';

const should = require('chai')
    .use(require('chai-as-promised'))
    .should();

describe('Profile Manager', async () => {
    const passPhraseAlisa: string = 'I\'m Alisa. This is my secret password';
    const passPhraseBob: string = 'I\'m Bob. This is my secret password';

    const rpcClient: RpcTransport = new RpcTransportImpl('ws://localhost:3545');

    const keyPairHelperAlisa: KeyPairHelper = KeyPairFactory.getRpcKeyPairCreator(rpcClient);
    const keyPairHelperBob: KeyPairHelper = KeyPairFactory.getRpcKeyPairCreator(rpcClient);
    const clientRepository: ClientDataRepositoryImplMock = new ClientDataRepositoryImplMock();

    const accountAlisa: Account;
    const authAccountBehaviorAlisa: BehaviorSubject<Account>;

    const profileManager;

    before(async () => {
        await keyPairHelperAlisa.createKeyPair(passPhraseAlisa);
        await keyPairHelperBob.createKeyPair(passPhraseBob);

        accountAlisa = new Account((await keyPairHelperAlisa.createKeyPair(passPhraseAlisa)).publicKey);
        authAccountBehaviorAlisa = new BehaviorSubject<Account>(accountAlisa);

        profileManager = new ProfileManager(
            clientRepository,
            authAccountBehaviorAlisa,
            keyPairHelperAlisa,
            keyPairHelperAlisa
        );
    });

    beforeEach(function (done) {
        clientRepository.clearData();
        done();
    });

    after(async() => {
        rpcClient.disconnect();
    })
    
    it('get and decrypt encrypted data', async () => {
        const origMockData: Map<string, string> = new Map();
        const mockData: Map<string, string> = new Map();

        origMockData.set('name', 'my name');


        for (let [key, value] of origMockData) {
            const passForValue = await keyPairHelperAlisa.generatePasswordForField(key);
            mockData.set(key, CryptoUtils.encryptAes256(value, passForValue));
        }

        clientRepository.setMockData(authAccountBehaviorAlisa.getValue().publicKey, mockData);

        const data = await profileManager.getData();

        data.should.be.deep.equal(origMockData);
    });

    it('update data and validate updated data', async () => {
        const origMockData: Map<string, string> = new Map();
        const mockData: Map<string, string> = new Map();

        origMockData.set('email', 'im@host.com');
        origMockData.forEach(async (value, key) => {
            const passForValue = await keyPairHelperAlisa.generatePasswordForField(key);
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
        for (let [key, value] of origMockData) {
            const passForValue = await keyPairHelperBob.generatePasswordForField(key);
            mockData.set(key, CryptoUtils.encryptAes256(value, passForValue));
            originMessage.set(key, passForValue);
        }

        const encryptedMessage = await keyPairHelperBob.encryptMessage(
            keyPairHelperAlisa.getPublicKey(),
            JSON.stringify(JsonUtils.mapToJson(originMessage))
        );

        clientRepository.setMockData(keyPairHelperBob.getPublicKey(), mockData);

        const data = await profileManager.getAuthorizedData(keyPairHelperBob.getPublicKey(), encryptedMessage);

        data.should.be.deep.equal(origMockData);
    });

});
