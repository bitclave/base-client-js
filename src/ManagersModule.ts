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

export abstract class ManagersModule {

    public abstract getWalletManager(): WalletManager;

    public abstract getAccountManager(): AccountManager;

    public abstract getProfileManager(): ProfileManager;

    public abstract getDataRequestManager(): DataRequestManager;

    public abstract getOfferManager(): OfferManager;

    public abstract getSearchManager(): SearchManager;

    public abstract getVerifyManager(): VerifyManager;

    public abstract getExternalServicesManager(): ExternalServicesManager;

    public abstract getOfferRankManager(): OfferRankManager;

    public abstract getNodeManager(): NodeManager;

    public abstract getDefaultTransport(): TransportInterceptor<object>;
}
