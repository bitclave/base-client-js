import KeyPairFactory from '../../src/utils/keypair/KeyPairFactory';
import { KeyPairHelper } from '../../src/utils/keypair/KeyPairHelper';
import AccountManager from '../../src/manager/AccountManager';
import { AccountRepository } from '../../src/repository/account/AccountRepository';
import AccountRepositoryImplMock from './AccountRepositoryImplMock';
import { BehaviorSubject } from 'rxjs/Rx';
import Account from '../../src/repository/models/Account';
import { RpcTransport } from '../../src/repository/source/rpc/RpcTransport';
import RpcTransportImpl from '../../src/repository/source/rpc/RpcTransportImpl';

const should = require('chai')
    .use(require('chai-as-promised'))
    .should();

describe('Account Manager', async () => {
    const passPhraseAlisa: string = 'I\'m Alisa. This is my secret password';
    const passPhraseBob: string = 'I\'m Bob. This is my secret password';

    const authAccountBehavior: BehaviorSubject<Account> = new BehaviorSubject<Account>(new Account());
    const rpcClient: RpcTransport = new RpcTransportImpl('ws://localhost:3545');

    const keyPairHelperAlisa: KeyPairHelper = KeyPairFactory.getRpcKeyPairCreator(rpcClient);
    const keyPairHelperBob: KeyPairHelper = KeyPairFactory.getRpcKeyPairCreator(rpcClient);
    const keyPairHelper: KeyPairHelper = KeyPairFactory.getRpcKeyPairCreator(rpcClient);
    const accountRepository: AccountRepository = new AccountRepositoryImplMock();

    const accountAlisa: Account;
    const accountBob: Account;
    const accountManager: AccountManager;

    before(async () => {
        accountAlisa = new Account((await keyPairHelperAlisa.createKeyPair(passPhraseAlisa)).publicKey);
        accountBob = new Account((await keyPairHelperBob.createKeyPair(passPhraseBob)).publicKey);
        accountManager = new AccountManager(
            accountRepository,
            keyPairHelper,
            authAccountBehavior
        );
    });

    after(async() => {
        rpcClient.disconnect();
    })

    it('should register same account and change it', async () => {
        await accountManager.registration(passPhraseAlisa);
        authAccountBehavior.getValue().publicKey.should.be.equal(accountAlisa.publicKey);
    });

    it('should check account and change it', async () => {
        await accountManager.checkAccount(passPhraseAlisa);
        authAccountBehavior.getValue().publicKey.should.be.equal(accountAlisa.publicKey);
    });

    it('should register different account and change it', async () => {
        await accountManager.registration(passPhraseBob);
        authAccountBehavior.getValue()
            .publicKey
            .should
            .be
            .not
            .equal(accountAlisa.publicKey);

        authAccountBehavior.getValue()
            .publicKey
            .should
            .be
            .equal(accountBob.publicKey);
    });

    it('should check different account and change it', async () => {
        await accountManager.checkAccount(passPhraseBob);
        authAccountBehavior.getValue()
            .publicKey
            .should
            .be
            .not
            .equal(accountAlisa.publicKey);

        authAccountBehavior.getValue()
            .publicKey
            .should
            .be
            .equal(accountBob.publicKey);
    });

});
