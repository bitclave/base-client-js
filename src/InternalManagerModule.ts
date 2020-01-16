import { BehaviorSubject } from 'rxjs';

import { BuilderManagersModule } from './BuilderManagersModule';
import { AccountManager } from './manager/AccountManager';
import { AccountManagerImpl } from './manager/AccountManagerImpl';
import { DataRequestManager } from './manager/DataRequestManager';
import { DataRequestManagerImpl } from './manager/DataRequestManagerImpl';
import { ExternalServicesManager } from './manager/ExternalServicesManager';
import { ExternalServicesManagerImpl } from './manager/ExternalServicesManagerImpl';
import { NodeManager } from './manager/NodeManager';
import { NodeManagerImpl } from './manager/NodeManagerImpl';
import { OfferManager } from './manager/OfferManager';
import { OfferManagerImpl } from './manager/OfferManagerImpl';
import { OfferRankManager } from './manager/OfferRankManager';
import { OfferRankManagerImpl } from './manager/OfferRankManagerImpl';
import { ProfileManager } from './manager/ProfileManager';
import { ProfileManagerImpl } from './manager/ProfileManagerImpl';
import { SearchManager } from './manager/SearchManager';
import { SearchManagerImpl } from './manager/SearchManagerImpl';
import { TimeMeasureManager } from './manager/TimeMeasureManager';
import { TimeMeasureManagerImpl } from './manager/TimeMeasureManagerImpl';
import { VerifyManager } from './manager/VerifyManager';
import { VerifyManagerImpl } from './manager/VerifyManagerImpl';
import { WalletManager } from './manager/WalletManager';
import { WalletManagerImpl } from './manager/WalletManagerImpl';
import { ManagersModule } from './ManagersModule';
import AccountRepositoryImpl from './repository/account/AccountRepositoryImpl';
import { AssistantNodeFactory } from './repository/assistant/AssistantNodeFactory';
import ClientDataRepositoryImpl from './repository/client/ClientDataRepositoryImpl';
import Account from './repository/models/Account';
import OfferRepositoryImpl from './repository/offer/OfferRepositoryImpl';
import { OfferRankRepositoryImpl } from './repository/offerRank/OfferRankRepositoryImpl';
import DataRequestRepositoryImpl from './repository/requests/DataRequestRepositoryImpl';
import { OfferSearchRepositoryImpl } from './repository/search/OfferSearchRepositoryImpl';
import SearchRequestRepositoryImpl from './repository/search/SearchRequestRepositoryImpl';
import { ExternalServicesRepositoryImpl } from './repository/services/ExternalServicesRepositoryImpl';
import { HttpTransport } from './repository/source/http/HttpTransport';
import { RepositoryStrategyInterceptor } from './repository/source/http/RepositoryStrategyInterceptor';
import SignInterceptor from './repository/source/http/SignInterceptor';
import { TransportFactory } from './repository/source/TransportFactory';
import { TransportInterceptor } from './repository/source/TransportInterceptor';
import { VerifyRepositoryImpl } from './repository/verify/VerifyRepositoryImpl';
import { WalletUtils } from './utils/WalletUtils';

export class InternalManagerModule extends ManagersModule {

    private readonly _walletManager: WalletManager;
    private readonly _accountManager: AccountManager;
    private readonly _profileManager: ProfileManager;
    private readonly _dataRequestManager: DataRequestManager;
    private readonly _offerManager: OfferManager;
    private readonly _searchManager: SearchManager;
    private readonly _verifyManager: VerifyManager;
    private readonly _externalServicesManager: ExternalServicesManager;
    private readonly _authAccountBehavior: BehaviorSubject<Account> = new BehaviorSubject<Account>(new Account());
    private readonly _offerRankManager: OfferRankManager;
    private readonly transport: HttpTransport;
    private readonly _nodeManager: NodeManager;
    private readonly _timeMeasureManager: TimeMeasureManager;

    public static Builder(nodeEndPoint: string, siteOrigin: string) {
        return new BuilderManagersModule(nodeEndPoint, siteOrigin);
    }

    public constructor(builder: BuilderManagersModule) {
        super();

        this.transport = TransportFactory.createHttpTransport(builder.nodeEndPoint, builder.logger)
            .addInterceptor(new SignInterceptor(builder.messageSigner))
            // disable nonce increment. and fetch nonce from base-node
            // .addInterceptor(new NonceInterceptor(builder.messageSigner, builder.nonceSource))
            .addInterceptor(new RepositoryStrategyInterceptor(builder.strategy));

        const accountRepository = new AccountRepositoryImpl(this.transport);
        const clientDataRepository = new ClientDataRepositoryImpl(this.transport);
        const dataRequestRepository = new DataRequestRepositoryImpl(this.transport);
        const offerRepository = new OfferRepositoryImpl(this.transport);
        const searchRequestRepository = new SearchRequestRepositoryImpl(this.transport);
        const offerSearchRepository = new OfferSearchRepositoryImpl(this.transport);
        const verifyRepository = new VerifyRepositoryImpl(this.transport);
        const externalServicesRepository = new ExternalServicesRepositoryImpl(this.transport);
        const offerRankRepository = new OfferRankRepositoryImpl(this.transport);
        const assistantRepository = AssistantNodeFactory.defaultNodeAssistant(this.transport);

        this._timeMeasureManager = new TimeMeasureManagerImpl();

        this._accountManager = new AccountManagerImpl(
            accountRepository,
            builder.keyPairHelper,
            builder.messageSigner,
            this._authAccountBehavior,
            builder.logger
        );

        this._dataRequestManager = new DataRequestManagerImpl(
            dataRequestRepository,
            this._authAccountBehavior.asObservable(),
            builder.encryptMessage,
            builder.decryptMessage
        );

        this._profileManager = new ProfileManagerImpl(
            clientDataRepository,
            this._authAccountBehavior.asObservable(),
            builder.encryptMessage,
            builder.decryptMessage,
            builder.messageSigner
        );

        this._offerManager = new OfferManagerImpl(offerRepository, this._authAccountBehavior.asObservable());

        this._searchManager = new SearchManagerImpl(
            searchRequestRepository,
            offerSearchRepository,
            this._authAccountBehavior.asObservable()
        );

        this._walletManager = new WalletManagerImpl(
            this._profileManager,
            this._dataRequestManager,
            WalletUtils.WALLET_VALIDATOR,
            builder.messageSigner,
            this._authAccountBehavior.asObservable()
        );

        this._verifyManager = new VerifyManagerImpl(
            verifyRepository
        );

        this._externalServicesManager = new ExternalServicesManagerImpl(externalServicesRepository);
        this._offerRankManager = new OfferRankManagerImpl(offerRankRepository);
        this._nodeManager = new NodeManagerImpl(assistantRepository);
    }

    public getAccountManager(): AccountManager {
        return this._accountManager;
    }

    public getDataRequestManager(): DataRequestManager {
        return this._dataRequestManager;
    }

    public getDefaultTransport(): TransportInterceptor<object> {
        return this.transport;
    }

    public getExternalServicesManager(): ExternalServicesManager {
        return this._externalServicesManager;
    }

    public getOfferManager(): OfferManager {
        return this._offerManager;
    }

    public getOfferRankManager(): OfferRankManager {
        return this._offerRankManager;
    }

    public getProfileManager(): ProfileManager {
        return this._profileManager;
    }

    public getSearchManager(): SearchManager {
        return this._searchManager;
    }

    public getVerifyManager(): VerifyManager {
        return this._verifyManager;
    }

    public getWalletManager(): WalletManager {
        return this._walletManager;
    }

    public getNodeManager(): NodeManager {
        return this._nodeManager;
    }

    public getTimeMeasureManager(): TimeMeasureManager {
        return this._timeMeasureManager;
    }
}
