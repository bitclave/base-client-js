// tslint:disable:no-unused-expression
import * as chai from 'chai';
import { KeyPairFactory, PermissionsSource, SiteDataSource, TokenType } from '../../src/Base';
import { BaseClientHelper, MANAGERS_TYPE } from '../BaseClientHelper';

const chaiAsPromised = require('chai-as-promised');

const expect = chai.expect;
chai.use(chaiAsPromised).should();

function sleep(ms: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(() => resolve(), ms));
}

const shouldBeThrowed = async <T>(promise: Promise<T>): Promise<boolean> => {
    try {
        await promise;

        return false;
    } catch (e) {
        // ignore
    }

    return true;
};

describe('Account Manager', async () => {
    const passPhraseAlisa: string = 'I\'m Alisa. This is my secret password';
    const passPhraseBob: string = 'I\'m Bob. This is my secret password';
    const messageForSigAlisa = 'some random message for Alisa';
    const messageForSigBob = 'some random message for Bob';

    it('should throw when token expired', async () => {
        if (BaseClientHelper.managerType !== MANAGERS_TYPE.REMOTE) {
            return;
        }

        const pass = 'some user pass phrase';
        const msg = 'some user message';
        const someUserToken = await BaseClientHelper.AUTH_HELPER.generateAccessToken(pass, 2000);
        const someUser = await BaseClientHelper.createUnRegistered();

        const result = await someUser.accountManager.authenticationByAccessToken(someUserToken, TokenType.BASIC, msg);
        result.should.exist;

        await sleep(3000);

        (await shouldBeThrowed(someUser.accountManager.authenticationByAccessToken(
            someUserToken,
            TokenType.BASIC,
            msg
        ))).should.be.eq(true);
    });

    it('should lazy create user value of created account', async () => {
        if (BaseClientHelper.managerType !== MANAGERS_TYPE.LOCAL) {
            return;
        }

        const pass = 'some pass for test user';
        const message = 'someSigMessage';

        const user = await BaseClientHelper.createUnRegistered();
        await expect(user.accountManager.checkAccount(pass, message)).should.throw;

        await expect(user.accountManager.authenticationByPassPhrase(pass, message)).should.be.exist;
        await expect(user.accountManager.checkAccount(pass, message)).should.be.exist;
        await expect(user.accountManager.authenticationByPassPhrase(pass, message)).should.be.exist;

        await user.accountManager.unsubscribe();

        await expect(user.accountManager.checkAccount(pass, message)).should.throw;
    });

    it('should register same account and change it', async () => {
        const user = await BaseClientHelper.createRegistered(passPhraseAlisa, messageForSigAlisa);

        (await user.accountManager.getPublicKeyFromMnemonic(passPhraseAlisa))
            .should.be.equal(user.accountManager.getAccount().publicKey);
    });

    it('should valid public key from sig in registration and check account', async () => {
        const user = await BaseClientHelper.createRegistered(passPhraseAlisa, messageForSigAlisa);
        const account = user.accountManager.getAccount();

        const keyPairHelper = KeyPairFactory.createDefaultKeyPair({} as PermissionsSource, {} as SiteDataSource, '');
        const keyPair = await keyPairHelper.createKeyPair(passPhraseAlisa);

        account.publicKey.should.be.equal(keyPair.publicKey);
        account.message.should.be.equal(messageForSigAlisa);

        (await keyPairHelper.checkSig(messageForSigAlisa, account.sig)).should.be.equal(true);
        (await keyPairHelper.checkSig(messageForSigAlisa, 'some fake sig')).should.be.equal(false);
        (await keyPairHelper.checkSig(messageForSigBob, account.sig)).should.be.equal(false);
    });

    it('should valid public key from sig (with empty message) in registration and check account', async () => {
        try {
            await BaseClientHelper.createRegistered(passPhraseAlisa, '');
        } catch (e) {
            e.message.should.be.equal('message for signature should be have min 10 symbols');
        }
    });

    it('should register different account and change it', async () => {
        const userBob = await BaseClientHelper.createRegistered(passPhraseBob);
        const userAlisa = await BaseClientHelper.createRegistered(passPhraseAlisa);

        userBob.accountManager.getAccount()
            .publicKey
            .should
            .be
            .not
            .equal(userAlisa.accountManager.getAccount().publicKey);
    });

    it('should check mnemonic phrase', async () => {
        const user = await BaseClientHelper.createUnRegistered();

        const m1 = await user.accountManager.getNewMnemonic();
        const m2 = await user.accountManager.getNewMnemonic();

        m1.should.be.not.equal(m2);
    });

    it('should be return account with createdAt/updateAt fields', async () => {
        const user = await BaseClientHelper.createRegistered('is alice pass');
        const account = user.accountManager.getAccount();

        await user.accountManager.unsubscribe();
        account.createdAt.getTime().should.be.gt(0);
        account.updatedAt.getTime().should.be.gt(0);
        account.createdAt.getTime().should.be.eq(account.updatedAt.getTime());
        const timeDelta = account.updatedAt.getTime() - account.createdAt.getTime();
        timeDelta.should.be.lt(100);
    });
});
