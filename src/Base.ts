import 'reflect-metadata';
import { BehaviorSubject } from 'rxjs/Rx';
import { AccountManager } from './manager/AccountManager';
import { AccountManagerImpl } from './manager/AccountManagerImpl';
import { DataRequestManager } from './manager/DataRequestManager';
import { DataRequestManagerImpl } from './manager/DataRequestManagerImpl';
import { ExternalServicesManager } from './manager/ExternalServicesManager';
import { ExternalServicesManagerImpl } from './manager/ExternalServicesManagerImpl';
import { OfferManager } from './manager/OfferManager';
import { OfferManagerImpl } from './manager/OfferManagerImpl';
import { OfferRankManager } from './manager/OfferRankManager';
import { OfferRankManagerImpl } from './manager/OfferRankManagerImpl';
import { ProfileManager } from './manager/ProfileManager';
import { ProfileManagerImpl } from './manager/ProfileManagerImpl';
import { SearchManager, SortOfferSearch } from './manager/SearchManager';
import { SearchManagerImpl } from './manager/SearchManagerImpl';
import { VerifyManager } from './manager/VerifyManager';
import { VerifyManagerImpl } from './manager/VerifyManagerImpl';
import { WalletManager } from './manager/WalletManager';
import { WalletManagerImpl } from './manager/WalletManagerImpl';
import { AccountRepository } from './repository/account/AccountRepository';
import AccountRepositoryImpl from './repository/account/AccountRepositoryImpl';
import { AssistantNodeRepository } from './repository/assistant/AssistantNodeRepository';
import { PermissionsSource } from './repository/assistant/PermissionsSource';
import { SiteDataSource } from './repository/assistant/SiteDataSource';
import { ClientDataRepository } from './repository/client/ClientDataRepository';
import ClientDataRepositoryImpl from './repository/client/ClientDataRepositoryImpl';
import Account from './repository/models/Account';
import DataRequest from './repository/models/DataRequest';
import { DeepCopy } from './repository/models/DeepCopy';
import { FileMeta } from './repository/models/FileMeta';
import { JsonObject } from './repository/models/JsonObject';
import { JsonTransform } from './repository/models/JsonTransform';
import Offer from './repository/models/Offer';
import { OfferInteraction, OfferResultAction } from './repository/models/OfferInteraction';
import { OfferPrice } from './repository/models/OfferPrice';
import { OfferPriceRules } from './repository/models/OfferPriceRules';
import { OfferRank } from './repository/models/OfferRank';
import { OfferSearch } from './repository/models/OfferSearch';
import OfferSearchResultItem from './repository/models/OfferSearchResultItem';
import OfferShareData from './repository/models/OfferShareData';
import { Page, Pageable } from './repository/models/Page';
import { Pair } from './repository/models/Pair';
import Profile from './repository/models/Profile';
import SearchRequest from './repository/models/SearchRequest';
import { ExternalService } from './repository/models/services/ExternalService';
import { HttpServiceCall } from './repository/models/services/HttpServiceCall';
import { ServiceCall, ServiceCallType } from './repository/models/services/ServiceCall';
import { ServiceResponse } from './repository/models/services/ServiceResponse';
import SimpleAccount from './repository/models/SimpleAccount';
import { Site } from './repository/models/Site';
import { OfferRepository } from './repository/offer/OfferRepository';
import OfferRepositoryImpl from './repository/offer/OfferRepositoryImpl';
import { OfferShareDataRepository } from './repository/offer/OfferShareDataRepository';
import OfferShareDataRepositoryImpl from './repository/offer/OfferShareDataRepositoryImpl';
import { OfferRankRepositoryImpl } from './repository/offerRank/OfferRankRepositoryImpl';
import { RepositoryStrategyType } from './repository/RepositoryStrategyType';
import { DataRequestRepository } from './repository/requests/DataRequestRepository';
import DataRequestRepositoryImpl from './repository/requests/DataRequestRepositoryImpl';
import { OfferSearchRepository, OfferSearchRequestInterestMode } from './repository/search/OfferSearchRepository';
import { OfferSearchRepositoryImpl } from './repository/search/OfferSearchRepositoryImpl';
import { SearchRequestRepository } from './repository/search/SearchRequestRepository';
import SearchRequestRepositoryImpl from './repository/search/SearchRequestRepositoryImpl';
import { ExternalServicesRepository } from './repository/services/ExternalServicesRepository';
import { ExternalServicesRepositoryImpl } from './repository/services/ExternalServicesRepositoryImpl';
import { SiteRepository } from './repository/site/SiteRepository';
import { SiteRepositoryImpl } from './repository/site/SiteRepositoryImpl';
import { HttpTransport } from './repository/source/http/HttpTransport';
import { HttpTransportImpl } from './repository/source/http/HttpTransportImpl';
import NonceInterceptor from './repository/source/http/NonceInterceptor';
import { RepositoryStrategyInterceptor } from './repository/source/http/RepositoryStrategyInterceptor';
import SignInterceptor from './repository/source/http/SignInterceptor';
import { TransportFactory } from './repository/source/TransportFactory';
import { VerifyRepository } from './repository/verify/VerifyRepository';
import { VerifyRepositoryImpl } from './repository/verify/VerifyRepositoryImpl';
import { BasicLogger, Logger } from './utils/BasicLogger';
import { BitKeyPair } from './utils/keypair/BitKeyPair';
import { KeyPairFactory } from './utils/keypair/KeyPairFactory';
import { KeyPairHelper } from './utils/keypair/KeyPairHelper';
import { MessageDecrypt } from './utils/keypair/MessageDecrypt';
import { MessageEncrypt } from './utils/keypair/MessageEncrypt';
import { MessageSigner } from './utils/keypair/MessageSigner';
import { AbstractWalletValidator } from './utils/types/validators/AbstractWalletValidator';
import { IsBasePublicKey } from './utils/types/validators/annotations/IsBasePublicKey';
import { IsBtcAddress } from './utils/types/validators/annotations/IsBtcAddress';
import { IsEthAddress } from './utils/types/validators/annotations/IsEthAddress';
import { IsTypedArray } from './utils/types/validators/annotations/IsTypedArray';
import { AppWalletValidator } from './utils/types/validators/AppWalletValidator';
import { BtcWalletValidator } from './utils/types/validators/BtcWalletValidator';
import { EthWalletValidator } from './utils/types/validators/EthWalletValidator';
import { ValidationResult } from './utils/types/validators/ValidationResult';
import { WalletsValidator } from './utils/types/validators/WalletsValidator';
import { WalletValidator } from './utils/types/validators/WalletValidator';
import { WalletValidatorStrategy } from './utils/types/validators/WalletValidatorStrategy';
import { WalletUtils } from './utils/WalletUtils';

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
export { BitcoinUtils } from './utils/BitcoinUtils';
export { JsonUtils } from './utils/JsonUtils';
export { EthereumUtils } from './utils/EthereumUtils';
export { KeyPair } from './utils/keypair/KeyPair';
export { KeyPairHelper } from './utils/keypair/KeyPairHelper';
export { Permissions, AccessRight } from './utils/keypair/Permissions';
export { AcceptedField } from './utils/keypair/AcceptedField';
export { RpcToken } from './utils/keypair/rpc/RpcToken';
export { RpcAuth } from './utils/keypair/rpc/RpcAuth';

export {
    CryptoWallets,
    EthWalletData,
    BtcWalletData,
    AppWalletData,
    CryptoWalletsData,
    AppCryptoWallet,
    BtcCryptoWallet,
    EthCryptoWallet,
    CryptoWallet,
    SupportSignedMessageData,
    StringSignedMessage,
    StringMessage,
    ProfileUser,
} from './utils/types/BaseTypes';

export {
    AbstractWalletValidator,
    Account,
    AccountManager,
    AppWalletValidator,
    BitKeyPair,
    BtcWalletValidator,
    DataRequest,
    DataRequestManager,
    DeepCopy,
    EthWalletValidator,
    ExternalService,
    ExternalServicesManager,
    ExternalServicesRepository,
    FileMeta,
    HttpServiceCall,
    HttpTransportImpl,
    IsBasePublicKey,
    IsBtcAddress,
    IsEthAddress,
    IsTypedArray,
    JsonObject,
    JsonTransform,
    Offer,
    OfferManager,
    OfferPrice,
    OfferPriceRules,
    OfferRank,
    OfferRankManager,
    OfferRankManagerImpl,
    OfferRankRepositoryImpl,
    OfferResultAction,
    OfferInteraction,
    OfferSearch,
    OfferSearchRepository,
    OfferSearchRepositoryImpl,
    OfferSearchRequestInterestMode,
    OfferSearchResultItem,
    OfferShareData,
    OfferShareDataRepository,
    OfferShareDataRepositoryImpl,
    Pair,
    Page,
    Pageable,
    PermissionsSource,
    Profile,
    ProfileManager,
    SearchManager,
    SearchRequest,
    ServiceCall,
    ServiceCallType,
    ServiceResponse,
    SimpleAccount,
    Site,
    SiteDataSource,
    SortOfferSearch,
    ValidationResult,
    VerifyManager,
    WalletManager,
    WalletManagerImpl,
    WalletsValidator,
    WalletValidator,
    WalletValidatorStrategy,
};

export default class Base {

    private readonly _walletManager: WalletManager;
    private readonly _accountManager: AccountManager;
    private readonly _profileManager: ProfileManager;
    private readonly _dataRequestManager: DataRequestManager;
    private readonly _offerManager: OfferManager;
    private readonly _searchManager: SearchManager;
    private readonly _verifyManager: VerifyManager;
    private readonly _externalServicesManager: ExternalServicesManager;
    private readonly _authAccountBehavior: BehaviorSubject<Account> = new BehaviorSubject<Account>(new Account());
    private readonly _repositoryStrategyInterceptor: RepositoryStrategyInterceptor;
    private readonly _offerRankManager: OfferRankManager;

    constructor(
        nodeHost: string,
        siteOrigin: string,
        strategy: RepositoryStrategyType = RepositoryStrategyType.Postgres,
        signerHost: string = '',
        loggerService?: Logger
    ) {

        if (!loggerService) {
            loggerService = new BasicLogger();
        }

        this._repositoryStrategyInterceptor = new RepositoryStrategyInterceptor(strategy);

        const assistantHttpTransport: HttpTransport = new HttpTransportImpl(nodeHost)
            .addInterceptor(this._repositoryStrategyInterceptor);

        const nodeAssistant: AssistantNodeRepository = this.createNodeAssistant(assistantHttpTransport);

        const keyPairHelper: KeyPairHelper =
            this.createKeyPairHelper(signerHost, nodeAssistant, nodeAssistant, siteOrigin);

        const messageSigner: MessageSigner = keyPairHelper;
        const encryptMessage: MessageEncrypt = keyPairHelper;
        const decryptMessage: MessageDecrypt = keyPairHelper;

        const transport: HttpTransport = TransportFactory.createHttpTransport(nodeHost, loggerService)
            .addInterceptor(new SignInterceptor(messageSigner))
            .addInterceptor(new NonceInterceptor(messageSigner, nodeAssistant))
            .addInterceptor(this._repositoryStrategyInterceptor);

        const accountRepository: AccountRepository = new AccountRepositoryImpl(transport);
        const clientDataRepository: ClientDataRepository = new ClientDataRepositoryImpl(transport);
        const dataRequestRepository: DataRequestRepository = new DataRequestRepositoryImpl(transport);
        const offerRepository: OfferRepository = new OfferRepositoryImpl(transport);
        const searchRequestRepository: SearchRequestRepository = new SearchRequestRepositoryImpl(transport);
        const offerSearchRepository: OfferSearchRepository = new OfferSearchRepositoryImpl(transport);
        const verifyRepository: VerifyRepository = new VerifyRepositoryImpl(transport);
        const externalServicesRepository: ExternalServicesRepository = new ExternalServicesRepositoryImpl(transport);
        const offerRankRepository = new OfferRankRepositoryImpl(transport);

        this._accountManager = new AccountManagerImpl(
            accountRepository,
            keyPairHelper,
            messageSigner,
            this._authAccountBehavior,
            loggerService
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
            WalletUtils.WALLET_VALIDATOR,
            messageSigner,
            this._authAccountBehavior.asObservable()
        );

        this._verifyManager = new VerifyManagerImpl(
            verifyRepository
        );

        this._externalServicesManager = new ExternalServicesManagerImpl(externalServicesRepository);
        this._offerRankManager = new OfferRankManagerImpl(offerRankRepository);
    }

    public changeStrategy(strategy: RepositoryStrategyType) {
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

    get verifyManager(): VerifyManager {
        return this._verifyManager;
    }

    get externalServicesManager(): ExternalServicesManager {
        return this._externalServicesManager;
    }

    get offerRankManager(): OfferRankManager {
        return this._offerRankManager;
    }

    private createNodeAssistant(httpTransport: HttpTransport): AssistantNodeRepository {
        const accountRepository: AccountRepository = new AccountRepositoryImpl(httpTransport);
        const dataRequestRepository: DataRequestRepository = new DataRequestRepositoryImpl(httpTransport);
        const siteRepository: SiteRepository = new SiteRepositoryImpl(httpTransport);

        return new AssistantNodeRepository(accountRepository, dataRequestRepository, siteRepository);
    }

    private createKeyPairHelper(
        signerHost: string,
        permissionSource: PermissionsSource,
        siteDataSource: SiteDataSource,
        siteOrigin: string
    ): KeyPairHelper {
        return (signerHost.length === 0)
               ? KeyPairFactory.createDefaultKeyPair(permissionSource, siteDataSource, siteOrigin)
               : KeyPairFactory.createRpcKeyPair(TransportFactory.createJsonRpcHttpTransport(signerHost));
    }
}
