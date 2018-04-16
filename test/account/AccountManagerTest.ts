import { KeyPairFactory } from '../../src/utils/keypair/KeyPairFactory';
import { KeyPairHelper } from '../../src/utils/keypair/KeyPairHelper';
import AccountManager from '../../src/manager/AccountManager';
import { AccountRepository } from '../../src/repository/account/AccountRepository';
import AccountRepositoryImplMock from './AccountRepositoryImplMock';
import { BehaviorSubject } from 'rxjs/Rx';
import Account from '../../src/repository/models/Account';
import { RpcTransport } from '../../src/repository/source/rpc/RpcTransport';
import { TransportFactory } from '../../src/repository/source/TransportFactory';
import RpcRegistrationHelper from '../RpcRegistrationHelper';
import { RemoteSigner } from '../../src/utils/keypair/RemoteSigner';

const should = require('chai')
    .use(require('chai-as-promised'))
    .should();

describe('Account Manager', async () => {
    const passPhraseAlisa: string = 'I\'m Alisa. This is my secret password';
    const passPhraseBob: string = 'I\'m Bob. This is my secret password';

    const authAccountBehavior: BehaviorSubject<Account> = new BehaviorSubject<Account>(new Account());
    const rpcSignerHost: string = 'http://localhost:3545';

    const rpcTransport: RpcTransport = TransportFactory.createJsonRpcHttpTransport(rpcSignerHost);

    const keyPairHelperAlisa: KeyPairHelper = KeyPairFactory.createRpcKeyPair(rpcTransport);
    const keyPairHelperBob: KeyPairHelper = KeyPairFactory.createRpcKeyPair(rpcTransport);
    const keyPairHelper: KeyPairHelper = KeyPairFactory.createRpcKeyPair(rpcTransport);
    const accountRepository: AccountRepository = new AccountRepositoryImplMock();

    const accountAlisa: Account;
    const accountBob: Account;
    const accountManager: AccountManager;

    const messageForSigAlisa = 'some random message for Alisa';
    const messageForSigBob = 'some random message for Bob';

    let accountManager: AccountManager;
    let alisaAccessToken: string;
    let bobAccessToken: string;

    before(async () => {
        alisaAccessToken = await RpcRegistrationHelper.generateAccessToken(rpcSignerHost, passPhraseAlisa);
        bobAccessToken = await RpcRegistrationHelper.generateAccessToken(rpcSignerHost, passPhraseBob);

        (keyPairHelperAlisa as RemoteSigner).setAccessToken(alisaAccessToken);
        (keyPairHelperBob as RemoteSigner).setAccessToken(bobAccessToken);

        accountAlisa = new Account((await keyPairHelperAlisa.createKeyPair('')).publicKey);
        accountBob = new Account((await keyPairHelperBob.createKeyPair('')).publicKey);
        accountManager = new AccountManager(
            accountRepository,
            keyPairHelper,
            keyPairHelper,
            authAccountBehavior
        );
    });

    after(async () => {
        rpcTransport.disconnect();
    });

    it('should register same account and change it', async () => {
        await accountManager.authenticationByAccessToken(alisaAccessToken, messageForSigAlisa);
        authAccountBehavior.getValue().publicKey.should.be.equal(accountAlisa.publicKey);
    });

    it('should valid public key from sig in registration and check account', async () => {
        await accountManager.authenticationByAccessToken(alisaAccessToken, messageForSigAlisa);
        const account = authAccountBehavior.getValue();
        account.publicKey.should.be.equal(accountAlisa.publicKey);
        account.message.should.be.equal(messageForSigAlisa);
        (await keyPairHelperAlisa.checkSig(messageForSigAlisa, account.sig)).should.be.true;
        (await keyPairHelperAlisa.checkSig(messageForSigAlisa, 'some fake sig')).should.be.false;
        (await keyPairHelperAlisa.checkSig(messageForSigBob, account.sig)).should.be.false;
    });

    it('should valid public key from sig (with empty message) in registration and check account', async () => {
        await accountManager.authenticationByAccessToken(alisaAccessToken);
        const account = authAccountBehavior.getValue();
        account.message.should.be.equal('');
        (await keyPairHelperAlisa.checkSig('', account.sig)).should.be.true;
        (await keyPairHelperAlisa.checkSig('', 'some fake sig')).should.be.false;
        (await keyPairHelperAlisa.checkSig(messageForSigBob, account.sig)).should.be.false;
    });

    it('should register different account and change it', async () => {
        await accountManager.authenticationByAccessToken(bobAccessToken, messageForSigBob);
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

    it('should check mnemonic phrase', function () {
        const m1 = accountManager.getNewMnemonic();
        const m2 = accountManager.getNewMnemonic();
        m1.should.be.not.equal(m2);
    });

});
