import { HttpTransport } from './repository/source/http/HttpTransport';
import AccountRepositoryImpl from './repository/account/AccountRepositoryImpl';
import { AccountRepository } from './repository/account/AccountRepository';
import ClientDataRepositoryImpl from './repository/client/ClientDataRepositoryImpl';
import { ClientDataRepository } from './repository/client/ClientDataRepository';
import { AccountManager } from './manager/AccountManager';
import { BehaviorSubject } from 'rxjs/Rx';
import { ProfileManager } from './manager/ProfileManager';
import Account from './repository/models/Account';
import { KeyPairHelper } from './utils/keypair/KeyPairHelper';
import SignInterceptor from './repository/source/http/SignInterceptor';
import { DataRequestManager } from './manager/DataRequestManager';
import DataRequestRepositoryImpl from './repository/requests/DataRequestRepositoryImpl';
import { DataRequestRepository } from './repository/requests/DataRequestRepository';
import { MessageEncrypt } from './utils/keypair/MessageEncrypt';
import { MessageDecrypt } from './utils/keypair/MessageDecrypt';
import { MessageSigner } from './utils/keypair/MessageSigner';
import { RepositoryStrategyInterceptor } from './repository/source/http/RepositoryStrategyInterceptor';
import { RepositoryStrategyType } from './repository/RepositoryStrategyType';
import { OfferManager } from './manager/OfferManager';
import { OfferRepository } from './repository/offer/OfferRepository';
import OfferRepositoryImpl from './repository/offer/OfferRepositoryImpl';
import { SearchManager } from './manager/SearchManager';
import { SearchRequestRepository } from './repository/search/SearchRequestRepository';
import SearchRequestRepositoryImpl from './repository/search/SearchRequestRepositoryImpl';
import SearchRequest from './repository/models/SearchRequest';
import Offer from './repository/models/Offer';
import { OfferPrice } from './repository/models/OfferPrice';
import { OfferPriceRules } from './repository/models/OfferPriceRules';
import { HttpTransportImpl } from './repository/source/http/HttpTransportImpl';
import NonceInterceptor from './repository/source/http/NonceInterceptor';
import { WalletManager } from './manager/WalletManager';
import { BaseSchema } from './utils/types/BaseSchema';
import { AssistantNodeRepository } from './repository/assistant/AssistantNodeRepository';
import { TransportFactory } from './repository/source/TransportFactory';
import { PermissionsSource } from './repository/assistant/PermissionsSource';
import { KeyPairFactory } from './utils/keypair/KeyPairFactory';
import { SiteRepository } from './repository/site/SiteRepository';
import { SiteRepositoryImpl } from './repository/site/SiteRepositoryImpl';
import { SiteDataSource } from './repository/assistant/SiteDataSource';
import { AccountManagerImpl } from './manager/AccountManagerImpl';
import { DataRequestManagerImpl } from './manager/DataRequestManagerImpl';
import { ProfileManagerImpl } from './manager/ProfileManagerImpl';
import { OfferManagerImpl } from './manager/OfferManagerImpl';
import { SearchManagerImpl } from './manager/SearchManagerImpl';
import { WalletManagerImpl } from './manager/WalletManagerImpl';
import { OfferSearchRepository } from './repository/search/OfferSearchRepository';
import { OfferSearchRepositoryImpl } from './repository/search/OfferSearchRepositoryImpl';
import  OfferSearchResultItem  from './repository/models/OfferSearchResultItem';
import OfferSearch, { OfferResultAction } from './repository/models/OfferSearch';
import  OfferShareData  from './repository/models/OfferShareData';
import { OfferShareDataRepository } from './repository/offer/OfferShareDataRepository';
import OfferShareDataRepositoryImpl from './repository/offer/OfferShareDataRepositoryImpl';

export { RepositoryStrategyType } from './repository/RepositoryStrategyType';
export { CompareAction } from './repository/models/CompareAction';
export { RpcTransport } from './repository/source/rpc/RpcTransport';
export { HttpTransport } from './repository/source/http/HttpTransport';
export { HttpInterceptor } from './repository/source/http/HttpInterceptor';
export { TransportFactory } from './repository/source/TransportFactory';
export { KeyPairFactory } from './utils/keypair/KeyPairFactory';
export { RemoteSigner } from './utils/keypair/RemoteSigner';
export { CryptoUtils } from './utils/CryptoUtils';
export { WalletUtils } from './utils/WalletUtils';
export { JsonUtils } from './utils/JsonUtils';
export { EthereumUtils } from './utils/EthereumUtils';
export { KeyPair } from './utils/keypair/KeyPair';
export { KeyPairHelper } from './utils/keypair/KeyPairHelper';
export { Permissions, AccessRight } from './utils/keypair/Permissions';
export { AcceptedField } from './utils/keypair/AcceptedField';
export { RpcToken } from './utils/keypair/rpc/RpcToken';
export { RpcAuth } from './utils/keypair/rpc/RpcAuth';

export {
    BaseAddrPair,
    AddrRecord,
    WalletsRecords,
    WealthRecord,
    WealthPtr,
    ProfileUser,
    ProfileWealthValidator
} from './utils/types/BaseTypes';
export {
    AccountManager,
    ProfileManager,
    DataRequestManager,
    OfferManager,
    SearchManager,
    WalletManager,
    WalletManagerImpl,
    Offer,
    OfferPrice,
    OfferPriceRules,
    SearchRequest,
    OfferSearch,
    OfferSearchResultItem,
    OfferResultAction,
    OfferShareData,
    OfferShareDataRepository,
    OfferShareDataRepositoryImpl,
    OfferSearchRepository,
    OfferSearchRepositoryImpl,
    HttpTransportImpl
};

export default class Base {

    private _walletManager: WalletManager;
    private _accountManager: AccountManager;
    private _profileManager: ProfileManager;
    private _dataRequestManager: DataRequestManager;
    private _offerManager: OfferManager;
    private _searchManager: SearchManager;
    private _authAccountBehavior: BehaviorSubject<Account> = new BehaviorSubject<Account>(new Account());
    private _repositoryStrategyInterceptor: RepositoryStrategyInterceptor;

    constructor(nodeHost: string,
                siteOrigin: string,
                strategy: RepositoryStrategyType = RepositoryStrategyType.Postgres,
                signerHost: string = '') {

        this._repositoryStrategyInterceptor = new RepositoryStrategyInterceptor(strategy);

        const assistantHttpTransport: HttpTransport = new HttpTransportImpl(nodeHost)
            .addInterceptor(this._repositoryStrategyInterceptor);

        const nodeAssistant: AssistantNodeRepository = this.createNodeAssistant(assistantHttpTransport);

        const keyPairHelper: KeyPairHelper =
            this.createKeyPairHelper(signerHost, nodeAssistant, nodeAssistant, siteOrigin);

        const messageSigner: MessageSigner = keyPairHelper;
        const encryptMessage: MessageEncrypt = keyPairHelper;
        const decryptMessage: MessageDecrypt = keyPairHelper;

        const transport: HttpTransport = TransportFactory.createHttpTransport(nodeHost)
            .addInterceptor(new SignInterceptor(messageSigner))
            .addInterceptor(new NonceInterceptor(messageSigner, nodeAssistant))
            .addInterceptor(this._repositoryStrategyInterceptor);

        const accountRepository: AccountRepository = new AccountRepositoryImpl(transport);
        const clientDataRepository: ClientDataRepository = new ClientDataRepositoryImpl(transport);
        const dataRequestRepository: DataRequestRepository = new DataRequestRepositoryImpl(transport);
        const offerRepository: OfferRepository = new OfferRepositoryImpl(transport);
        const searchRequestRepository: SearchRequestRepository = new SearchRequestRepositoryImpl(transport);
        const offerSearchRepository: OfferSearchRepository = new OfferSearchRepositoryImpl(transport);

        this._accountManager = new AccountManagerImpl(
            accountRepository,
            keyPairHelper,
            messageSigner,
            this._authAccountBehavior
        );

        this._dataRequestManager = new DataRequestManagerImpl(
            dataRequestRepository,
            this._authAccountBehavior.asObservable(),
            encryptMessage,
            decryptMessage
        );

        this._profileManager = new ProfileManagerImpl(
            clientDataRepository,
            this._authAccountBehavior.asObservable(),
            encryptMessage,
            decryptMessage,
            messageSigner
        );

        this._offerManager = new OfferManagerImpl(offerRepository, this._authAccountBehavior.asObservable());

        this._searchManager = new SearchManagerImpl(
            searchRequestRepository,
            offerSearchRepository,
            this._authAccountBehavior.asObservable()
        );

        this._walletManager = new WalletManagerImpl(
            this.profileManager,
            this.dataRequestManager,
            new BaseSchema(),
            messageSigner,
            this._authAccountBehavior.asObservable()
        );
    }

    changeStrategy(strategy: RepositoryStrategyType) {
        this._repositoryStrategyInterceptor.changeStrategy(strategy);
    }

    get walletManager(): WalletManager {
        return this._walletManager;
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

    get searchManager(): SearchManager {
        return this._searchManager;
    }

    private createNodeAssistant(httpTransport: HttpTransport): AssistantNodeRepository {
        const accountRepository: AccountRepository = new AccountRepositoryImpl(httpTransport);
        const dataRequestRepository: DataRequestRepository = new DataRequestRepositoryImpl(httpTransport);
        const siteRepository: SiteRepository = new SiteRepositoryImpl(httpTransport);

        return new AssistantNodeRepository(accountRepository, dataRequestRepository, siteRepository);
    }

    private createKeyPairHelper(signerHost: string,
                                permissionSource: PermissionsSource,
                                siteDataSource: SiteDataSource,
                                siteOrigin: string): KeyPairHelper {
        return (signerHost.length === 0)
            ? KeyPairFactory.createDefaultKeyPair(permissionSource, siteDataSource, siteOrigin)
            : KeyPairFactory.createRpcKeyPair(TransportFactory.createJsonRpcHttpTransport(signerHost));
    }

}
