import 'reflect-metadata';
import { BuilderManagersModule } from './BuilderManagersModule';
import { InternalManagerModule } from './InternalManagerModule';
import { AccountManager } from './manager/AccountManager';
import { DataRequestManager } from './manager/DataRequestManager';
import { ExternalServicesManager } from './manager/ExternalServicesManager';
import { NodeManager } from './manager/NodeManager';
import { OfferManager } from './manager/OfferManager';
import { OfferRankManager } from './manager/OfferRankManager';
import { OfferRankManagerImpl } from './manager/OfferRankManagerImpl';
import { ProfileManager } from './manager/ProfileManager';
import { SearchManager, SortOfferSearch } from './manager/SearchManager';
import { TimeMeasureManager } from './manager/TimeMeasureManager';
import { VerifyManager } from './manager/VerifyManager';
import { WalletManager } from './manager/WalletManager';
import { WalletManagerImpl } from './manager/WalletManagerImpl';
import { ManagersModule } from './ManagersModule';
import { ManagersModuleFactory } from './ManagersModuleFactory';
import { AssistantNodeFactory } from './repository/assistant/AssistantNodeFactory';
import { AssistantNodeRepository } from './repository/assistant/AssistantNodeRepository';
import { PermissionsSource } from './repository/assistant/PermissionsSource';
import { SiteDataSource } from './repository/assistant/SiteDataSource';
import { ClientDataRepository } from './repository/client/ClientDataRepository';
import Account from './repository/models/Account';
import { DataRequest } from './repository/models/DataRequest';
import { DeepCopy } from './repository/models/DeepCopy';
import { FieldData } from './repository/models/FieldData';
import { FileMeta } from './repository/models/FileMeta';
import { InputGraphData } from './repository/models/InputGraphData';
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
import { GraphLink, LinkType, OutputGraphData } from './repository/models/OutputGraphData';
import { Page, Pageable } from './repository/models/Page';
import { Pair } from './repository/models/Pair';
import Profile from './repository/models/Profile';
import SearchRequest from './repository/models/SearchRequest';
import { ExternalService } from './repository/models/services/ExternalService';
import { HttpServiceCall } from './repository/models/services/HttpServiceCall';
import { ServiceCall, ServiceCallType } from './repository/models/services/ServiceCall';
import { ServiceResponse } from './repository/models/services/ServiceResponse';
import { SharedData } from './repository/models/SharedData';
import SimpleAccount from './repository/models/SimpleAccount';
import { Site } from './repository/models/Site';
import { OfferRepository } from './repository/offer/OfferRepository';
import { OfferShareDataRepository } from './repository/offer/OfferShareDataRepository';
import OfferShareDataRepositoryImpl from './repository/offer/OfferShareDataRepositoryImpl';
import { OfferRankRepositoryImpl } from './repository/offerRank/OfferRankRepositoryImpl';
import { RepositoryStrategyType } from './repository/RepositoryStrategyType';
import { OfferSearchRepository, OfferSearchRequestInterestMode } from './repository/search/OfferSearchRepository';
import { OfferSearchRepositoryImpl } from './repository/search/OfferSearchRepositoryImpl';
import { SearchRequestRepository } from './repository/search/SearchRequestRepository';
import { ExternalServicesRepository } from './repository/services/ExternalServicesRepository';
import { HttpTransportImpl } from './repository/source/http/HttpTransportImpl';
import { RepositoryStrategyInterceptor } from './repository/source/http/RepositoryStrategyInterceptor';
import { AccessTokenInterceptor } from './repository/source/rpc/AccessTokenInterceptor';
import { JsonRpc } from './repository/source/rpc/JsonRpc';
import { JsonRpcHttpInterceptorAdapter } from './repository/source/rpc/JsonRpcHttpInterceptorAdapter';
import { RpcInterceptor } from './repository/source/rpc/RpcInterceptor';
import { TransportInterceptor } from './repository/source/TransportInterceptor';

import { VerifyRepository } from './repository/verify/VerifyRepository';
import { BasicLogger, Logger } from './utils/BasicLogger';
import { BitKeyPair } from './utils/keypair/BitKeyPair';
import { RpcAccessData } from './utils/keypair/rpc/RpcAccessData';
import { TokenType } from './utils/keypair/rpc/RpcToken';
import { TimeMeasureLogger } from './utils/TimeMeasureLogger';
import { Primitive } from './utils/types/Primitive';
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

export { RepositoryStrategyType } from './repository/RepositoryStrategyType';
export { CompareAction } from './repository/models/CompareAction';
export { RpcTransport } from './repository/source/rpc/RpcTransport';
export { HttpTransport } from './repository/source/http/HttpTransport';
export { HttpInterceptor } from './repository/source/http/HttpInterceptor';
export { TransportFactory } from './repository/source/TransportFactory';
export { KeyPairFactory } from './utils/keypair/KeyPairFactory';
export { AccessTokenAccepter } from './utils/keypair/AccessTokenAccepter';
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
export { RpcAccessToken } from './utils/keypair/rpc/RpcAccessToken';

export * from './utils/types/json-transform';
export { EXPORTED_METHOD, EXPORTED_METHOD_PROPS, ExportMethod } from './utils/ExportMethod';

export {
    CryptoWallets,
    EthWalletData,
    BtcWalletData,
    AppWalletData,
    UsdWalletData,
    CryptoWalletsData,
    AppCryptoWallet,
    BtcCryptoWallet,
    EthCryptoWallet,
    UsdCryptoWallet,
    CryptoWallet,
    SupportSignedMessageData,
    StringSignedMessage,
    StringMessage,
    ProfileUser,
} from './utils/types/BaseTypes';

export {
    AssistantNodeRepository,
    AssistantNodeFactory,
    AbstractWalletValidator,
    Account,
    AccountManager,
    AccessTokenInterceptor,
    AppWalletValidator,
    BitKeyPair,
    BtcWalletValidator,
    BuilderManagersModule,
    DataRequest,
    DataRequestManager,
    SharedData,
    FieldData,
    DeepCopy,
    EthWalletValidator,
    ExternalService,
    ExternalServicesManager,
    ExternalServicesRepository,
    FileMeta,
    GraphLink,
    HttpServiceCall,
    HttpTransportImpl,
    InputGraphData,
    IsBasePublicKey,
    IsBtcAddress,
    IsEthAddress,
    IsTypedArray,
    InternalManagerModule,
    JsonRpc,
    JsonRpcHttpInterceptorAdapter,
    JsonObject,
    JsonTransform,
    LinkType,
    ManagersModule,
    ManagersModuleFactory,
    OutputGraphData,
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
    Primitive,
    RepositoryStrategyInterceptor,
    RpcInterceptor,
    RpcAccessData,
    SearchManager,
    SearchRequest,
    ServiceCall,
    ServiceCallType,
    ServiceResponse,
    SimpleAccount,
    Site,
    SiteDataSource,
    SortOfferSearch,
    TokenType,
    TimeMeasureLogger,
    ValidationResult,
    VerifyManager,
    WalletManager,
    WalletManagerImpl,
    WalletsValidator,
    WalletValidator,
    WalletValidatorStrategy,
    ClientDataRepository,
    OfferRepository,
    SearchRequestRepository,
    VerifyRepository
};

const {version} = require('../package.json');

export default class Base {

    private readonly managersModule: ManagersModule;

    // fixme will be change to ManagersModule. and we will remove all another arguments
    constructor(
        nodeEndPointOrModule: string | ManagersModule,
        siteOrigin: string = '',
        strategy: RepositoryStrategyType = RepositoryStrategyType.Postgres,
        signerEndPoint: string = '',
        loggerService: Logger = new BasicLogger(),
    ) {
        if (nodeEndPointOrModule instanceof ManagersModule) {
            this.managersModule = nodeEndPointOrModule;

        } else {
            console.info('You are still using legacy library initialization! ' +
                'Please use new Base(ManagersModuleFactory.createSomeManagers())'
            );

            if (signerEndPoint && signerEndPoint.length > 0) {
                this.managersModule = ManagersModuleFactory.createInsideManagersWithRemoteSigner(
                    nodeEndPointOrModule,
                    signerEndPoint,
                    siteOrigin,
                    strategy,
                    loggerService
                );

            } else {
                this.managersModule = ManagersModuleFactory.createInsideManagers(
                    nodeEndPointOrModule,
                    siteOrigin,
                    strategy,
                    loggerService
                );
            }
        }
    }

    public get version(): string {
        return version;
    }

    public get defaultTransport(): TransportInterceptor<object> {
        return this.managersModule.getDefaultTransport();
    }

    public getNodeVersion(): Promise<string> {
        return this.managersModule.getNodeManager().getNodeVersion();
    }

    get walletManager(): WalletManager {
        return this.managersModule.getWalletManager();
    }

    get accountManager(): AccountManager {
        return this.managersModule.getAccountManager();
    }

    get profileManager(): ProfileManager {
        return this.managersModule.getProfileManager();
    }

    get dataRequestManager(): DataRequestManager {
        return this.managersModule.getDataRequestManager();
    }

    get offerManager(): OfferManager {
        return this.managersModule.getOfferManager();
    }

    get searchManager(): SearchManager {
        return this.managersModule.getSearchManager();
    }

    get verifyManager(): VerifyManager {
        return this.managersModule.getVerifyManager();
    }

    get externalServicesManager(): ExternalServicesManager {
        return this.managersModule.getExternalServicesManager();
    }

    get offerRankManager(): OfferRankManager {
        return this.managersModule.getOfferRankManager();
    }

    get nodeManager(): NodeManager {
        return this.managersModule.getNodeManager();
    }

    get timeMeasureManager(): TimeMeasureManager {
        return this.managersModule.getTimeMeasureManager();
    }
}
