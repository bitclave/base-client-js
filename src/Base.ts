import HttpTransportImpl from './repository/source/http/HttpTransportImpl';
import { HttpTransport } from './repository/source/http/HttpTransport';
import AccountRepositoryImpl from './repository/account/AuthRepositoryImpl';
import { AccountRepository } from './repository/account/AccountRepository';
import ClientDataRepositoryImpl from './repository/client/ClientDataRepositoryImpl';
import { ClientDataRepository } from './repository/client/ClientDataRepository';
import Wallet from './repository/wallet/Wallet';
import AccountManager from './manager/AccountManager';
import KeyPairFactory from './utils/keypair/KeyPairFactory';
import { BehaviorSubject } from 'rxjs/Rx';
import ProfileManager from './manager/ProfileManager';
import Account from './repository/models/Account';
import { KeyPairHelper } from './utils/keypair/KeyPairHelper';
import SignInterceptor from './repository/source/http/SignInterceptor';
import DataRequestManager from './manager/DataRequestManager';
import DataRequestRepositoryImpl from './repository/requests/DataRequestRepositoryImpl';
import { DataRequestRepository } from './repository/requests/DataRequestRepository';
import { MessageEncrypt } from './utils/keypair/MessageEncrypt';
import { MessageDecrypt } from './utils/keypair/MessageDecrypt';
import { MessageSigner } from './utils/keypair/MessageSigner';

export { DataRequestState } from './repository/models/DataRequestState';

export default class Base {

    private _wallet: Wallet;
    private _accountManager: AccountManager;
    private _profileManager: ProfileManager;
    private _dataRequestManager: DataRequestManager;
    private _authAccountBehavior: BehaviorSubject<Account> = new BehaviorSubject<Account>(new Account());

    constructor(host: string) {
        const keyPairHelper: KeyPairHelper = KeyPairFactory.getDefaultKeyPairCreator();
        const messageSigner: MessageSigner = keyPairHelper;
        const encryptMessage: MessageEncrypt = keyPairHelper;
        const decryptMessage: MessageDecrypt = keyPairHelper;

        const transport: HttpTransport = new HttpTransportImpl(host)
            .addInterceptor(new SignInterceptor(messageSigner));

        const accountRepository: AccountRepository = new AccountRepositoryImpl(transport);
        const clientDataRepository: ClientDataRepository = new ClientDataRepositoryImpl(transport);
        const dataRequestRepository: DataRequestRepository = new DataRequestRepositoryImpl(transport);

        this._wallet = new Wallet();

        this._accountManager = new AccountManager(
            accountRepository,
            keyPairHelper,
            this._authAccountBehavior
        );

        this._profileManager = new ProfileManager(
            clientDataRepository,
            this._authAccountBehavior.asObservable(),
            encryptMessage,
            decryptMessage
        );

        this._dataRequestManager = new DataRequestManager(dataRequestRepository, encryptMessage, decryptMessage);
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

    get dataRequestManager(): DataRequestManager {
        return this._dataRequestManager;
    }

}
