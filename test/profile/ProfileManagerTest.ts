import { BehaviorSubject } from 'rxjs/Rx';
import { ProfileManager } from '../../src/manager/ProfileManager';
import { ProfileManagerImpl } from '../../src/manager/ProfileManagerImpl';
import Account from '../../src/repository/models/Account';
import { RpcTransport } from '../../src/repository/source/rpc/RpcTransport';
import { TransportFactory } from '../../src/repository/source/TransportFactory';
import { KeyPairFactory } from '../../src/utils/keypair/KeyPairFactory';
import { RemoteKeyPairHelper } from '../../src/utils/keypair/RemoteKeyPairHelper';
import { RemoteSigner } from '../../src/utils/keypair/RemoteSigner';
import AuthenticatorHelper from '../AuthenticatorHelper';
import ClientDataRepositoryImplMock from './ClientDataRepositoryImplMock';

require('chai')
    .use(require('chai-as-promised'))
    .should();

describe('Profile Manager', async () => {
    const passPhraseAlisa: string = 'I\'m Alisa. This is my secret password';
    const passPhraseBob: string = 'I\'m Bob. This is my secret password';

    const rpcSignerHost = process.env.SIGNER || 'http://localhost:3545';

    const rpcTransport: RpcTransport = TransportFactory.createJsonRpcHttpTransport(rpcSignerHost);
    const authenticatorHelper: AuthenticatorHelper = new AuthenticatorHelper(rpcTransport);

    const keyPairHelperAlisa: RemoteKeyPairHelper = KeyPairFactory.createRpcKeyPair(rpcTransport);
    const keyPairHelperBob: RemoteKeyPairHelper = KeyPairFactory.createRpcKeyPair(rpcTransport);

    const clientRepository: ClientDataRepositoryImplMock = new ClientDataRepositoryImplMock();

    let accountAlisa: Account;
    let authAccountBehaviorAlisa: BehaviorSubject<Account>;

    let profileManager: ProfileManager;

    before(async () => {
        const alisaAccessToken = await authenticatorHelper.generateAccessToken(passPhraseAlisa);
        const bobAccessToken = await authenticatorHelper.generateAccessToken(passPhraseBob);

        (keyPairHelperAlisa as RemoteSigner).setAccessToken(alisaAccessToken);
        (keyPairHelperBob as RemoteSigner).setAccessToken(bobAccessToken);

        await keyPairHelperAlisa.createKeyPair('');
        await keyPairHelperBob.createKeyPair('');

        accountAlisa = new Account((await keyPairHelperAlisa.createKeyPair('')).publicKey);
        authAccountBehaviorAlisa = new BehaviorSubject<Account>(accountAlisa);

        profileManager = new ProfileManagerImpl(
            clientRepository,
            authAccountBehaviorAlisa,
            keyPairHelperAlisa,
            keyPairHelperAlisa,
            keyPairHelperAlisa
        );
    });

    beforeEach(async () => {
        clientRepository.clearData();
    });

    after(async () => {
        rpcTransport.disconnect();
    });

    it('update data and validate updated data', async () => {
        const origMockData: Map<string, string> = new Map();

        origMockData.set('email', 'im@host.com');

        const data = await profileManager.updateData(origMockData);
        const savedData = await profileManager.getRawData(authAccountBehaviorAlisa.getValue().publicKey);
        const savedDecrypted = await profileManager.getData();

        savedData.should.be.deep.equal(data);
        savedDecrypted.should.be.deep.equal(origMockData);
    });

    it('should be get data by keys', async () => {
        const origMockData: Map<string, string> = new Map();

        origMockData.set('email', 'im@host.com');
        origMockData.set('name', 'isName');
        origMockData.set('last_name', 'isLastName');

        const data = await profileManager.updateData(origMockData);
        const savedData = await profileManager.getRawData(authAccountBehaviorAlisa.getValue().publicKey);
        let savedDecrypted = await profileManager.getData();

        savedData.should.be.deep.equal(data);
        savedDecrypted.size.should.be.equal(3);

        savedDecrypted = await profileManager.getData('name');

        savedDecrypted.size.should.be.equal(1);
        (savedDecrypted.get('name') || '').should.be.eq(origMockData.get('name'));

        savedDecrypted = await profileManager.getData(['name', 'last_name']);

        savedDecrypted.size.should.be.equal(2);
        (savedDecrypted.get('name') || '').should.be.eq(origMockData.get('name'));
        (savedDecrypted.get('last_name') || '').should.be.eq(origMockData.get('last_name'));
    });
});
