import KeyPairFactory from '../../src/utils/keypair/KeyPairFactory';
import { KeyPairHelper } from '../../src/utils/keypair/KeyPairHelper';
import AccountManager from '../../src/manager/AccountManager';
import { AccountRepository } from '../../src/repository/account/AccountRepository';
import AccountRepositoryImplMock from './AccountRepositoryImplMock';
import { BehaviorSubject } from 'rxjs/Rx';
import Account from '../../src/repository/models/Account';

const should = require('chai')
    .use(require('chai-as-promised'))
    .should();

describe('Account Manager', async () => {
    const passPhraseAlisa: string = 'I\'m Alisa. This is my secret password';
    const passPhraseBob: string = 'I\'m Bob. This is my secret password';

    const authAccountBehavior: BehaviorSubject<Account> = new BehaviorSubject<Account>(new Account());

    const keyPairHelperAlisa: KeyPairHelper = KeyPairFactory.getDefaultKeyPairCreator();
    const keyPairHelperBob: KeyPairHelper = KeyPairFactory.getDefaultKeyPairCreator();
    const keyPairHelper: KeyPairHelper = KeyPairFactory.getDefaultKeyPairCreator();
    const accountRepository: AccountRepository = new AccountRepositoryImplMock();

    const accountAlisa: Account = new Account(keyPairHelperAlisa.createKeyPair(passPhraseAlisa).publicKey);
    const accountBob: Account = new Account(keyPairHelperBob.createKeyPair(passPhraseBob).publicKey);

    const messageForSigAlisa = 'some random message for Alisa';
    const messageForSigBob = 'some random message for Bob';

    const accountManager = new AccountManager(
        accountRepository,
        keyPairHelper,
        keyPairHelper,
        authAccountBehavior
    );

    it('should register same account and change it', async () => {
        await accountManager.registration(passPhraseAlisa, messageForSigAlisa);
        authAccountBehavior.getValue().publicKey.should.be.equal(accountAlisa.publicKey);
    });

    it('should check account and change it', async () => {
        await accountManager.checkAccount(passPhraseAlisa, messageForSigAlisa);
        authAccountBehavior.getValue().publicKey.should.be.equal(accountAlisa.publicKey);
    });

    it('should valid public key from sig in registration and check account', async () => {
        await accountManager.registration(passPhraseAlisa, messageForSigAlisa);
        const account = authAccountBehavior.getValue();
        account.publicKey.should.be.equal(accountAlisa.publicKey);
        account.message.should.be.equal(messageForSigAlisa);
        keyPairHelperAlisa.checkSig(messageForSigAlisa, account.sig).should.be.true;
        keyPairHelperAlisa.checkSig(messageForSigAlisa, 'some fake sig').should.be.false;
        keyPairHelperAlisa.checkSig(messageForSigBob, account.sig).should.be.false;

        await accountManager.checkAccount(passPhraseAlisa, messageForSigAlisa);
        const account = authAccountBehavior.getValue();
        account.publicKey.should.be.equal(accountAlisa.publicKey);
        account.message.should.be.equal(messageForSigAlisa);
        keyPairHelperAlisa.checkSig(messageForSigAlisa, account.sig).should.be.true;
        keyPairHelperAlisa.checkSig(messageForSigAlisa, 'some fake sig').should.be.false;
        keyPairHelperAlisa.checkSig(messageForSigBob, account.sig).should.be.false;
    });

    it('should valid public key from sig (with empty message) in registration and check account', async () => {
        await accountManager.registration(passPhraseAlisa);
        const account = authAccountBehavior.getValue();
        account.message.should.be.equal('');
        keyPairHelperAlisa.checkSig('', account.sig).should.be.true;
        keyPairHelperAlisa.checkSig('', 'some fake sig').should.be.false;
        keyPairHelperAlisa.checkSig(messageForSigBob, account.sig).should.be.false;

        await accountManager.checkAccount(passPhraseAlisa);
        const account = authAccountBehavior.getValue();
        account.publicKey.should.be.equal(accountAlisa.publicKey);
        account.message.should.be.equal('');
        keyPairHelperAlisa.checkSig('', account.sig).should.be.true;
        keyPairHelperAlisa.checkSig('', 'some fake sig').should.be.false;
        keyPairHelperAlisa.checkSig(messageForSigBob, account.sig).should.be.false;
    });

    it('should register different account and change it', async () => {
        await accountManager.registration(passPhraseBob, messageForSigBob);
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
        await accountManager.checkAccount(passPhraseBob, messageForSigBob);
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

    it('should check mnemonic phrase', function() {
        const m1 = accountManager.getNewMnemonic();
        const m2 = accountManager.getNewMnemonic();
        m1.should.be.not.equal(m2);
    });

});
