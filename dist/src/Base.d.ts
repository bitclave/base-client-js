import Wallet from './repository/wallet/Wallet';
import AccountManager from './manager/AccountManager';
import ProfileManager from './manager/ProfileManager';
import DataRequestManager from './manager/DataRequestManager';
import { RepositoryStrategyType } from './repository/RepositoryStrategyType';
import OfferManager from './manager/OfferManager';
import SearchRequestManager from './manager/SearchRequestManager';
export { DataRequestState } from './repository/models/DataRequestState';
export { RepositoryStrategyType } from './repository/RepositoryStrategyType';
export { CompareAction } from './repository/models/CompareAction';
export default class Base {
    private _wallet;
    private _accountManager;
    private _profileManager;
    private _dataRequestManager;
    private _offerManager;
    private _searchRequestManager;
    private _authAccountBehavior;
    private _repositoryStrategyInterceptor;
    constructor(host: string);
    changeStrategy(strategy: RepositoryStrategyType): void;
    readonly wallet: Wallet;
    readonly accountManager: AccountManager;
    readonly profileManager: ProfileManager;
    readonly dataRequestManager: DataRequestManager;
    readonly offerManager: OfferManager;
    readonly searchRequestManager: SearchRequestManager;
}
