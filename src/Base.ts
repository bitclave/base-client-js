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
import RepositoryStrategyInterceptor from './repository/source/http/RepositoryStrategyInterceptor';
import { RepositoryStrategyType } from './repository/RepositoryStrategyType';
import OfferManager from './manager/OfferManager';
import { OfferRepository } from './repository/offer/OfferRepository';
import OfferRepositoryImpl from './repository/offer/OfferRepositoryImpl';
import SearchRequestManager from './manager/SearchRequestManager';
import { SearchRequestRepository } from './repository/search/SearchRequestRepository';
import SearchRequestRepositoryImpl from './repository/search/SearchRequestRepositoryImpl';
import SearchRequest from './repository/models/SearchRequest';
import Offer from './repository/models/Offer';

export { DataRequestState } from './repository/models/DataRequestState';
export { RepositoryStrategyType } from './repository/RepositoryStrategyType';
export { CompareAction } from './repository/models/CompareAction';
export {
    EthBaseAddrPair,
    EthAddrRecord,
    EthWallets,
    EthWealthRecord,
    EthWealthPtr,
    ProfileUser,
    ProfileEthWealthValidator
} from './utils/BaseTypes';
export { SearchRequest };
export { Offer };
export { Base as NodeAPI };

export default class Base {

    private _wallet: Wallet;
    private _accountManager: AccountManager;
    private _profileManager: ProfileManager;
    private _dataRequestManager: DataRequestManager;
    private _offerManager: OfferManager;
    private _searchRequestManager: SearchRequestManager;
    private _authAccountBehavior: BehaviorSubject<Account> = new BehaviorSubject<Account>(new Account());
    private _repositoryStrategyInterceptor: RepositoryStrategyInterceptor;

    constructor(host: string) {
        const keyPairHelper: KeyPairHelper = KeyPairFactory.getDefaultKeyPairCreator();
        const messageSigner: MessageSigner = keyPairHelper;
        const encryptMessage: MessageEncrypt = keyPairHelper;
        const decryptMessage: MessageDecrypt = keyPairHelper;

        this._repositoryStrategyInterceptor = new RepositoryStrategyInterceptor(RepositoryStrategyType.Postgres);

        const transport: HttpTransport = new HttpTransportImpl(host)
            .addInterceptor(new SignInterceptor(messageSigner))
            .addInterceptor(this._repositoryStrategyInterceptor);

        const accountRepository: AccountRepository = new AccountRepositoryImpl(transport);
        const clientDataRepository: ClientDataRepository = new ClientDataRepositoryImpl(transport);
        const dataRequestRepository: DataRequestRepository = new DataRequestRepositoryImpl(transport);
        const offerRepository: OfferRepository = new OfferRepositoryImpl(transport);
        const searchRequestRepository: SearchRequestRepository = new SearchRequestRepositoryImpl(transport);

        this._wallet = new Wallet();

        this._accountManager = new AccountManager(
            accountRepository,
            keyPairHelper,
            messageSigner,
            this._authAccountBehavior
        );

        this._dataRequestManager = new DataRequestManager(
            dataRequestRepository,
            this._authAccountBehavior.asObservable(),
            encryptMessage,
            decryptMessage
        );

        this._profileManager = new ProfileManager(
            clientDataRepository,
            this._authAccountBehavior.asObservable(),
            encryptMessage,
            decryptMessage,
            messageSigner,
            this._dataRequestManager
        );

        this._offerManager = new OfferManager(offerRepository, this._authAccountBehavior.asObservable());

        this._searchRequestManager = new SearchRequestManager(
            searchRequestRepository,
            this._authAccountBehavior.asObservable()
        );
    }

    changeStrategy(strategy: RepositoryStrategyType) {
        this._repositoryStrategyInterceptor.changeStrategy(strategy);
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

    get offerManager(): OfferManager {
        return this._offerManager;
    }

    get searchRequestManager(): SearchRequestManager {
        return this._searchRequestManager;
    }

}
