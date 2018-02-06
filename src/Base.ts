import HttpTransportImpl from './repository/source/http/HttpTransportImpl';
import { HttpTransport } from './repository/source/http/HttpTransport';
import AccountRepositoryImpl from './repository/account/AuthRepositoryImpl';
import { AccountRepository } from './repository/account/AccountRepository';
import ClientDataRepositoryImpl from './repository/client/ClientDataRepositoryImpl';
import { ClientDataRepository } from './repository/client/ClientDataRepository';
import Wallet from './repository/wallet/Wallet';
import AccountManager from './manager/AccountManager';
import LocalStorageImpl from './repository/source/storage/LocalStorageImpl';
import KeyPairFactory from './utils/keypair/KeyPairFactory';
import { BehaviorSubject } from 'rxjs/Rx';
import ProfileManager from './manager/ProfileManager';
import Account from './repository/models/Account';

export default class Base {

    private _wallet: Wallet;
    private _accountManager: AccountManager;
    private _profileManager: ProfileManager;
    private _authAccountBehavior: BehaviorSubject<Account> = new BehaviorSubject<Account>(new Account());

    constructor(host: string) {
        const transport: HttpTransport = new HttpTransportImpl(host);
        const accountRepository: AccountRepository = new AccountRepositoryImpl(transport, new LocalStorageImpl());
        const clientDataRepository: ClientDataRepository = new ClientDataRepositoryImpl(transport);

        this._wallet = new Wallet();

        this._accountManager = new AccountManager(
            accountRepository,
            KeyPairFactory.getDefaultKeyPairCreator(),
            this._authAccountBehavior
        );
        this._profileManager = new ProfileManager(clientDataRepository, this._authAccountBehavior.asObservable());
    }

    get wallet(): Wallet {
        return this._wallet;
    }

    get accountManager(): AccountManager {
        return this._accountManager;
    }

    get profileManager(): ProfileManager {
        return this._profileManager;
    }

}
