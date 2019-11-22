import { BehaviorSubject, Observable } from 'rxjs';
import { AccountRepository } from '../repository/account/AccountRepository';
import Account from '../repository/models/Account';
import { BasicLogger, Logger } from '../utils/BasicLogger';
import { ExportMethod } from '../utils/ExportMethod';
import { AccessTokenAccepter } from '../utils/keypair/AccessTokenAccepter';
import { BitKeyPair } from '../utils/keypair/BitKeyPair';
import { KeyPair } from '../utils/keypair/KeyPair';
import { KeyPairHelper } from '../utils/keypair/KeyPairHelper';
import { MessageSigner } from '../utils/keypair/MessageSigner';
import { RpcKeyPair } from '../utils/keypair/rpc/RpcKeyPair';
import { TokenType } from '../utils/keypair/rpc/RpcToken';
import { AccountManager } from './AccountManager';

export class AccountManagerImpl implements AccountManager {

    private readonly logger: Logger;

    constructor(
        private readonly accountRepository: AccountRepository,
        private readonly keyPairCreator: KeyPairHelper,
        private readonly  messageSigner: MessageSigner,
        private readonly  authAccountBehavior: BehaviorSubject<Account>,
        loggerService?: Logger
    ) {
        this.keyPairCreator = keyPairCreator;
        this.messageSigner = messageSigner;
        this.authAccountBehavior = authAccountBehavior;

        this.logger = new BasicLogger();
        this.logger = loggerService ? loggerService : new BasicLogger();
    }

    /**
     * @return {Observable<Account>} subscription to {Account}
     */
    public subscribeAccount(): Observable<Account> {
        return this.authAccountBehavior.asObservable();
    }

    /**
     * Checks or Register user with provided mnemonic phrase is already registered in the system.
     * @param {string} passPhrase Mnemonic phrase for Public/Private key pair
     * generation for asymmetric encryption scheme.
     * @param {string} message on the basis of which a signature will be created to verify the public key
     *
     * @returns {Promise<Account>} {Account} if client exist or create new user.
     */
    @ExportMethod()
    public async authenticationByPassPhrase(passPhrase: string, message: string): Promise<Account> {
        this.checkSigMessage(message);

        if (!(this.keyPairCreator instanceof RpcKeyPair)) {
            const account = await this.lazyRegistration(passPhrase, message);
            this.logger.info(`lazy registration user logged via  base-client-js ${account.publicKey}`);

            return account;
        }

        this.logger.debug(`key pair helper does not support pass-phrase authentication`);
        throw new Error('key pair helper does not support pass-phrase authentication');
    }

    /**
     * Checks if user with provided access token is already registered in the system.
     * @param {string} accessToken token for authenticate on remote signer
     * (if {@link KeyPairHelper} support {@link AccessTokenAccepter})
     *
     * @param {string} message on the basis of which a signature will be created to verify the public key
     *
     * @param {TokenType} tokenType type of token
     *
     * @returns {Promise<Account>} {Account} if client exist or http exception if fail.
     */
    @ExportMethod()
    public async authenticationByAccessToken(
        accessToken: string,
        tokenType: TokenType,
        message: string
    ): Promise<Account> {
        this.checkSigMessage(message);

        if (this.keyPairCreator instanceof RpcKeyPair) {
            (this.keyPairCreator as AccessTokenAccepter).setAccessData(accessToken, tokenType);

            const keyPair = await this.keyPairCreator.createKeyPair('');
            const preparedAccount = await this.generateAccount(keyPair);
            const account = await this.accountRepository.lazyRegistration(preparedAccount);

            return this.onGetAccount(account, message);
        }

        throw new Error('key pair helper does not support token authentication');
    }

    /**
     * Registers a new user in the system.
     * @param {string} mnemonicPhrase Mnemonic phrase for Public/Private key pair
     * generation for asymmetric encryption scheme.
     * @param {string} message on the basis of which a signature will be created to verify the public key
     *
     * @returns {Promise<Account>} {Account} after successful registration or http exception if fail.
     */
    @ExportMethod()
    public registration(mnemonicPhrase: string, message: string): Promise<Account> {
        this.checkSigMessage(message);

        return this.keyPairCreator.createKeyPair(mnemonicPhrase)
            .then(this.generateAccount)
            .then((account) => this.accountRepository.registration(account))
            .then(account => this.onGetAccount(account, message));
    }

    /**
     * Checks if user with provided mnemonic phrase is already registered in the system.
     * @param {string} mnemonicPhrase Mnemonic phrase for Public/Private key pair
     * generation for asymmetric encryption scheme.
     * @param {string} message on the basis of which a signature will be created to verify the public key
     *
     * @returns {Promise<Account>} {Account} if client exist or http exception if fail.
     */
    @ExportMethod()
    public checkAccount(mnemonicPhrase: string, message: string): Promise<Account> {
        this.checkSigMessage(message);

        return this.keyPairCreator.createKeyPair(mnemonicPhrase)
            .then(this.generateAccount)
            .then(account => {
                this.logger.debug(`base-client-js:checkAccount user login  ${account.publicKey}`);
                return this.syncAccount(account, message);
            });
    }

    /**
     * Allows user to unsubscribe from BASE. Delets all his data
     *
     * @returns {Promise<event>} void if client exist or http exception if fail.
     */
    public unsubscribe(): Promise<void> {
        return this.accountRepository.unsubscribe(this.authAccountBehavior.getValue());
    }

    @ExportMethod()
    public getNewMnemonic(): Promise<string> {
        return this.keyPairCreator.generateMnemonicPhrase();
    }

    @ExportMethod()
    public getAccount(): Account {
        return this.authAccountBehavior.getValue();
    }

    @ExportMethod()
    public getPublicKeyFromMnemonic(mnemonicPhrase: string): Promise<string> {
        // return this.keyPairCreator.createKeyPair(mnemonicPhrase)
        //     .then(res => res.publicKey);

        return new Promise<string>(resolve => {
            resolve(BitKeyPair.getPublicKeyFromMnemonic(mnemonicPhrase));
        });
    }

    private lazyRegistration(mnemonicPhrase: string, message: string): Promise<Account> {
        this.checkSigMessage(message);

        return this.keyPairCreator.createKeyPair(mnemonicPhrase)
            .then(this.generateAccount)
            .then((account) => this.accountRepository.lazyRegistration(account))
            .then(account => this.onGetAccount(account, message));
    }

    private checkSigMessage(message: string) {
        if (message == null || message === undefined || message.length < 10) {
            throw new Error('message for signature should be have min 10 symbols');
        }
    }

    private syncAccount(account: Account, message: string): Promise<Account> {
        this.logger.debug(`base-client-js:syncAccount - enter function`);
        return this.accountRepository
            .checkAccount(account)
            .then(checkedAccount => {
                this.logger.debug(`base-client-js:syncAccount - passed check account call`);
                return this.onGetAccount(checkedAccount, message);
            })
            .catch(err => {
                // tslint:disable-next-line:max-line-length
                this.logger.error(`base-client-js:syncAccount failure: ${account.publicKey} err: ${err}, ${JSON.stringify(
                    err)}`);
                throw err;
            });
    }

    private generateAccount(keyPair: KeyPair): Promise<Account> {
        return new Promise<Account>((resolve) => {
            resolve(new Account(keyPair.publicKey));
        });
    }

    private onGetAccount(account: Account, message: string): Promise<Account> {
        return this.messageSigner.signMessage(message)
            .then(sig => new Promise<Account>(resolve => {
                account.message = message;
                account.sig = sig;

                this.authAccountBehavior.next(account);

                resolve(account);
            }))
            .catch(err => {
                this.logger.error(`base-client-js:onGetAccount ${err}`);
                throw err;
            });
    }
}
