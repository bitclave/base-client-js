import { KeyPairFactory } from '../../src/utils/keypair/KeyPairFactory';
import { KeyPairHelper } from '../../src/utils/keypair/KeyPairHelper';
import { AccountManager } from '../../src/manager/AccountManager';
import { AccountRepository } from '../../src/repository/account/AccountRepository';
import AccountRepositoryImplMock from './AccountRepositoryImplMock';
import { BehaviorSubject } from 'rxjs/Rx';
import Account from '../../src/repository/models/Account';
import { RpcTransport } from '../../src/repository/source/rpc/RpcTransport';
import { TransportFactory } from '../../src/repository/source/TransportFactory';
import AuthenticatorHelper from '../AuthenticatorHelper';
import { RemoteSigner } from '../../src/utils/keypair/RemoteSigner';
import { AccountManagerImpl } from '../../src/manager/AccountManagerImpl';

const chai = require('chai');
const expect = chai.expect;
const should = chai
    .use(require('chai-as-promised'))
    .should();

describe('Account Manager', async () => {
    const someSigMessage = 'some unique message for signature';

    const passPhraseAlisa: string = 'I\'m Alisa. This is my secret password';
    const passPhraseBob: string = 'I\'m Bob. This is my secret password';

    const authAccountBehavior: BehaviorSubject<Account> = new BehaviorSubject<Account>(new Account());
    const rpcSignerHost = process.env.SIGNER || 'http://localhost:3545';

    console.log("Signer: " + rpcSignerHost);

    const rpcTransport: RpcTransport = TransportFactory.createJsonRpcHttpTransport(rpcSignerHost);
    const authenticatorHelper: AuthenticatorHelper = new AuthenticatorHelper(rpcTransport);

    const keyPairHelperAlisa: KeyPairHelper = KeyPairFactory.createRpcKeyPair(rpcTransport);
    const keyPairHelperBob: KeyPairHelper = KeyPairFactory.createRpcKeyPair(rpcTransport);
    const keyPairHelper: KeyPairHelper = KeyPairFactory.createRpcKeyPair(rpcTransport);
    const accountRepository: AccountRepository = new AccountRepositoryImplMock();

    let accountAlisa: Account;
    let accountBob: Account;
    let accountManager: AccountManager;

    const messageForSigAlisa = 'some random message for Alisa';
    const messageForSigBob = 'some random message for Bob';

    let alisaAccessToken: string;
    let bobAccessToken: string;

    before(async () => {
        alisaAccessToken = await authenticatorHelper.generateAccessToken(passPhraseAlisa);
        bobAccessToken = await authenticatorHelper.generateAccessToken(passPhraseBob);

        // KeyPairFactory.createRpcKeyPair creates instance of class RpcKeyPair
        // which implements both RemoteSigner and KeyPairHelper interfaces
        // it's not ok but better way stay it
        (keyPairHelperAlisa as RemoteSigner).setAccessToken(alisaAccessToken);
        (keyPairHelperBob as RemoteSigner).setAccessToken(bobAccessToken);

        accountAlisa = new Account((await keyPairHelperAlisa.createKeyPair('')).publicKey);
        accountBob = new Account((await keyPairHelperBob.createKeyPair('')).publicKey);
        accountManager = new AccountManagerImpl(
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
        (await keyPairHelperAlisa.checkSig(messageForSigAlisa, account.sig)).should.be.equal(true);
        (await keyPairHelperAlisa.checkSig(messageForSigAlisa, 'some fake sig')).should.be.equal(false);
        (await keyPairHelperAlisa.checkSig(messageForSigBob, account.sig)).should.be.equal(false);
    });

    it('should valid public key from sig (with empty message) in registration and check account', async () => {
        try {
            await accountManager.authenticationByAccessToken(alisaAccessToken, '');
            throw 'message for signature should be have min 10 symbols';
        } catch (e) {
            e.should.be.equal('message for signature should be have min 10 symbols');
        }
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
