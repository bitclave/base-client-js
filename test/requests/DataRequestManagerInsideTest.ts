import { KeyPairFactory } from '../../src/utils/keypair/KeyPairFactory';
import { KeyPairHelper } from '../../src/utils/keypair/KeyPairHelper';
import { DataRequestManager } from '../../src/manager/DataRequestManager';
import DataRequestRepositoryImplMock from './DataRequestRepositoryImplMock';
import ClientDataRepositoryImplMock from '../profile/ClientDataRepositoryImplMock';
import { AssistantPermissions } from './AssistantPermissions';
import { BehaviorSubject } from 'rxjs/Rx';
import Account from '../../src/repository/models/Account';
import { Site } from '../../src/repository/models/Site';
import { ProfileManager } from '../../src/manager/ProfileManager';
import { AccessRight } from '../../src/utils/keypair/Permissions';
import { ProfileManagerImpl } from '../../src/manager/ProfileManagerImpl';
import { DataRequestManagerImpl } from '../../src/manager/DataRequestManagerImpl';

const should = require('chai')
    .use(require('chai-as-promised'))
    .should();

describe('Data Request Manager: permissions for inside signer', async () => {
    const passPhraseAlisa: string = 'I\'m Alisa. This is my secret password';
    const passPhraseBob: string = 'I\'m Bob. This is my secret password';

    const alisaData: Map<string, string> = new Map([
        ['name', 'Alisa'],
        ['email', 'Email'],
        ['phone', 'my phone'],
    ]);

    const dataRepository: DataRequestRepositoryImplMock = new DataRequestRepositoryImplMock();
    const clientRepository: ClientDataRepositoryImplMock = new ClientDataRepositoryImplMock();
    const assistant: AssistantPermissions = new AssistantPermissions(dataRepository);

    beforeEach(async () => {
        dataRepository.clearData();
        clientRepository.clearData();
        assistant.clearData();

        await authenticatorSetAccessDataForBobSite();
    });

    const authenticatorSetAccessDataForBobSite = async () => {
        const keyPairHelperAlisa: KeyPairHelper = KeyPairFactory.createDefaultKeyPair(
            assistant, assistant, 'confedentialSite'
        );

        const keyPairHelperAuthSite: KeyPairHelper = KeyPairFactory.createDefaultKeyPair(
            assistant, assistant, ''
        );

        const keyPairHelperBobSite: KeyPairHelper = KeyPairFactory.createDefaultKeyPair(
            assistant, assistant, ''
        );

        await keyPairHelperAlisa.createKeyPair(passPhraseAlisa);
        await keyPairHelperAuthSite.createKeyPair('pass for Auth');
        await keyPairHelperBobSite.createKeyPair(passPhraseBob);

        assistant.setSiteData(new Site(0, 'confedentialSite', keyPairHelperAuthSite.getPublicKey(), true));
        assistant.setSiteData(new Site(1, 'BobSite', keyPairHelperBobSite.getPublicKey(), false));

        const accountAlisa: Account = new Account(keyPairHelperAlisa.getPublicKey());
        const authAccountBehaviorAlisa: BehaviorSubject<Account> = new BehaviorSubject<Account>(accountAlisa);

        const requestManagerAlisa: DataRequestManager = new DataRequestManagerImpl(
            dataRepository,
            authAccountBehaviorAlisa,
            keyPairHelperAlisa,
            keyPairHelperAlisa
        );

        const grantAccess: Map<string, AccessRight> = new Map();
        grantAccess.set('name', AccessRight.R);

        await requestManagerAlisa.grantAccessForClient(keyPairHelperBobSite.getPublicKey(), grantAccess);

        const profileManager: ProfileManager = new ProfileManagerImpl(
            clientRepository,
            authAccountBehaviorAlisa,
            keyPairHelperAlisa,
            keyPairHelperAlisa,
            keyPairHelperAlisa
        );

        await profileManager.updateData(alisaData);
    };

    it('site has access to any data', async () => {
        const keyPairHelperAlisa: KeyPairHelper = KeyPairFactory.createDefaultKeyPair(
            assistant, assistant, 'localhost'
        );
        const keyPairHelperLocalSite: KeyPairHelper = KeyPairFactory.createDefaultKeyPair(
            assistant, assistant, 'localhost'
        );

        await keyPairHelperAlisa.createKeyPair(passPhraseAlisa);
        await keyPairHelperLocalSite.createKeyPair(passPhraseBob);

        assistant.setSiteData(new Site(0, 'localhost', keyPairHelperLocalSite.getPublicKey(), true));

        const accountAlisa: Account = new Account(keyPairHelperAlisa.getPublicKey());
        const authAccountBehaviorAlisa: BehaviorSubject<Account> = new BehaviorSubject<Account>(accountAlisa);

        const profileManager: ProfileManager = new ProfileManagerImpl(
            clientRepository,
            authAccountBehaviorAlisa,
            keyPairHelperAlisa,
            keyPairHelperAlisa,
            keyPairHelperAlisa
        );

        const resultData = await profileManager.getData();

        alisaData.should.be.deep.equal(resultData);
    });

    it('site bobSite has access only for "name" field', async () => {
        const keyPairHelperAlisa: KeyPairHelper = KeyPairFactory.createDefaultKeyPair(
            assistant, assistant, 'bobSite'
        );
        const keyPairHelperBobSite: KeyPairHelper = KeyPairFactory.createDefaultKeyPair(
            assistant, assistant, 'bobSite'
        );

        await keyPairHelperAlisa.createKeyPair(passPhraseAlisa);
        await keyPairHelperBobSite.createKeyPair(passPhraseBob);

        const accountAlisa: Account = new Account(keyPairHelperAlisa.getPublicKey());
        const authAccountBehaviorAlisa: BehaviorSubject<Account> = new BehaviorSubject<Account>(accountAlisa);

        const accountBob: Account = new Account(keyPairHelperBobSite.getPublicKey());
        const authAccountBehaviorBob: BehaviorSubject<Account> = new BehaviorSubject<Account>(accountBob);

        dataRepository.setPK(keyPairHelperAlisa.getPublicKey(), keyPairHelperBobSite.getPublicKey());

        const requestManagerAlisa = new DataRequestManagerImpl(
            dataRepository,
            authAccountBehaviorAlisa,
            keyPairHelperAlisa,
            keyPairHelperAlisa
        );

        const requestManagerBob = new DataRequestManagerImpl(
            dataRepository,
            authAccountBehaviorBob,
            keyPairHelperBobSite,
            keyPairHelperBobSite
        );

        const profileManager: ProfileManager = new ProfileManagerImpl(
            clientRepository,
            authAccountBehaviorAlisa,
            keyPairHelperAlisa,
            keyPairHelperAlisa,
            keyPairHelperAlisa
        );

        const rawData: Map<string, string> = await profileManager.getRawData(keyPairHelperAlisa.getPublicKey());

        alisaData.should.be.not.deep.equal(rawData);

        const resultData = await profileManager.getData();

        alisaData.get('name').should.be.equal(resultData.get('name'));
        alisaData.get('email').should.be.not.equal(resultData.get('email'));
        alisaData.get('phone').should.be.not.equal(resultData.get('phone'));
    });

});
