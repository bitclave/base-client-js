import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { AccountRepository } from '../repository/account/AccountRepository';
import Account from '../repository/models/Account';
import { BasicLogger, Logger } from '../utils/BasicLogger';
import { BitKeyPair } from '../utils/keypair/BitKeyPair';
import { KeyPair } from '../utils/keypair/KeyPair';
import { KeyPairHelper } from '../utils/keypair/KeyPairHelper';
import { MessageSigner } from '../utils/keypair/MessageSigner';
import { RemoteSigner } from '../utils/keypair/RemoteSigner';
import { RpcKeyPair } from '../utils/keypair/rpc/RpcKeyPair';
import { AccountManager } from './AccountManager';

export class AccountManagerImpl implements AccountManager {

    private accountRepository: AccountRepository;
    private keyPairCreator: KeyPairHelper;
    private messageSigner: MessageSigner;
    private authAccountBehavior: BehaviorSubject<Account>;
    private logger: Logger;

    constructor(
        auth: AccountRepository,
        keyPairCreator: KeyPairHelper,
        messageSigner: MessageSigner,
        authAccountBehavior: BehaviorSubject<Account>,
        loggerService?: Logger
    ) {
        this.accountRepository = auth;
        this.keyPairCreator = keyPairCreator;
        this.messageSigner = messageSigner;
        this.authAccountBehavior = authAccountBehavior;

        if (!loggerService) {
            loggerService = new BasicLogger();
        }

        this.logger = loggerService;
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
     * @returns {Promise<Account>} {Account} if client exist or http exception if fail.
     */
    public async authenticationByPassPhrase(passPhrase: string, message: string): Promise<Account> {
        this.checkSigMessage(message);

        if (!(this.keyPairCreator instanceof RpcKeyPair)) {
            let acc: Account;
            try {
                acc = await this.checkAccount(passPhrase, message);
                this.logger.info(`Returning user logged via  base-client-js ${acc.publicKey}`);
            } catch (err) {
                acc = await this.registration(passPhrase, message);
                this.logger.info(`New user logged via  base-client-js ${acc.publicKey}`);
            }

            return acc;
        }
        this.logger.debug(`key pair helper does not support pass-phrase authentication`);
        throw new Error('key pair helper does not support pass-phrase authentication');
    }

    /**
     * Checks if user with provided access token is already registered in the system.
     * @param {string} accessToken token for authenticate on remote signer
     * (if {@link KeyPairHelper} support {@link RemoteSigner})
     *
     * @param {string} message on the basis of which a signature will be created to verify the public key
     *
     * @returns {Promise<Account>} {Account} if client exist or http exception if fail.
     */
    public authenticationByAccessToken(accessToken: string, message: string): Promise<Account> {
        this.checkSigMessage(message);

        if (this.keyPairCreator instanceof RpcKeyPair) {
            (this.keyPairCreator as RemoteSigner).setAccessToken(accessToken);

            return this.keyPairCreator.createKeyPair('')
                .then(this.generateAccount)
                .then(account => this.accountRepository.checkAccount(account))
                .then(account => this.onGetAccount(account, message));
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

    public getNewMnemonic(): Promise<string> {
        return this.keyPairCreator.generateMnemonicPhrase();
    }

    public getAccount(): Account {
        return this.authAccountBehavior.getValue();
    }

    public getPublicKeyFromMnemonic(mnemonicPhrase: string): Promise<string> {
        // return this.keyPairCreator.createKeyPair(mnemonicPhrase)
        //     .then(res => res.publicKey);

        return new Promise<string>(resolve => {
            resolve(BitKeyPair.getPublicKeyFromMnemonic(mnemonicPhrase));
        });
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
                this.logger.error(`base-client-js:syncAccount failure: ${account.publicKey} err: ${err}, ${JSON.stringify(err)}`);
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
