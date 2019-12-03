import { AccountManager } from './manager/AccountManager';
import { DataRequestManager } from './manager/DataRequestManager';
import { ExternalServicesManager } from './manager/ExternalServicesManager';
import { NodeManager } from './manager/NodeManager';
import { OfferManager } from './manager/OfferManager';
import { OfferRankManager } from './manager/OfferRankManager';
import { ProfileManager } from './manager/ProfileManager';
import { SearchManager } from './manager/SearchManager';
import { VerifyManager } from './manager/VerifyManager';
import { WalletManager } from './manager/WalletManager';
import { TransportInterceptor } from './repository/source/TransportInterceptor';
export declare abstract class ManagersModule {
    abstract getWalletManager(): WalletManager;
    abstract getAccountManager(): AccountManager;
    abstract getProfileManager(): ProfileManager;
    abstract getDataRequestManager(): DataRequestManager;
    abstract getOfferManager(): OfferManager;
    abstract getSearchManager(): SearchManager;
    abstract getVerifyManager(): VerifyManager;
    abstract getExternalServicesManager(): ExternalServicesManager;
    abstract getOfferRankManager(): OfferRankManager;
    abstract getNodeManager(): NodeManager;
    abstract getDefaultTransport(): TransportInterceptor<object>;
}
