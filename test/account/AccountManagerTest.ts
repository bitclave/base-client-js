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

    const accountManager = new AccountManager(
        accountRepository,
        keyPairHelper,
        authAccountBehavior
    );

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

    it('should check mnemonic phrase', function() {
        const m1 = accountManager.getNewMnemonic();
        const m2 = accountManager.getNewMnemonic();
        m1.should.be.not.equal(m2);
    });

});
