import { AccountManager } from './manager/AccountManager';
import { DataRequestManager } from './manager/DataRequestManager';
import { ExternalServicesManager } from './manager/ExternalServicesManager';
import { NodeManager } from './manager/NodeManager';
import { OfferManager } from './manager/OfferManager';
import { OfferRankManager } from './manager/OfferRankManager';
import { ProfileManager } from './manager/ProfileManager';
import { SearchManager } from './manager/SearchManager';
import { TimeMeasureManager } from './manager/TimeMeasureManager';
import { VerifyManager } from './manager/VerifyManager';
import { WalletManager } from './manager/WalletManager';
import { ManagersModule } from './ManagersModule';
import { TransportInterceptor } from './repository/source/TransportInterceptor';
import { Logger } from './utils/BasicLogger';
export declare class RemoteManagerModule extends ManagersModule {
    private readonly _walletManager;
    private readonly _accountManager;
    private readonly _profileManager;
    private readonly _dataRequestManager;
    private readonly _offerManager;
    private readonly _searchManager;
    private readonly _verifyManager;
    private readonly _externalServicesManager;
    private readonly _authAccountBehavior;
    private readonly _offerRankManager;
    private readonly _nodeManager;
    private readonly _timeMeasureManager;
    private readonly transport;
    constructor(remoteManagersEndPoint: string, logger?: Logger);
    getAccountManager(): AccountManager;
    getDataRequestManager(): DataRequestManager;
    getDefaultTransport(): TransportInterceptor<object>;
    getExternalServicesManager(): ExternalServicesManager;
    getOfferManager(): OfferManager;
    getOfferRankManager(): OfferRankManager;
    getProfileManager(): ProfileManager;
    getSearchManager(): SearchManager;
    getVerifyManager(): VerifyManager;
    getWalletManager(): WalletManager;
    getNodeManager(): NodeManager;
    getTimeMeasureManager(): TimeMeasureManager;
}
