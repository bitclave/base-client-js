import { HttpTransport } from './repository/source/http/HttpTransport';
import Wallet from './repository/wallet/Wallet';
import AccountManager from './manager/AccountManager';
import ProfileManager from './manager/ProfileManager';
import { KeyPairHelper } from './utils/keypair/KeyPairHelper';
import DataRequestManager from './manager/DataRequestManager';
import { RepositoryStrategyType } from './repository/RepositoryStrategyType';
import OfferManager from './manager/OfferManager';
import SearchRequestManager from './manager/SearchRequestManager';
import SearchRequest from './repository/models/SearchRequest';
import Offer from './repository/models/Offer';
export { DataRequestState } from './repository/models/DataRequestState';
export { RepositoryStrategyType } from './repository/RepositoryStrategyType';
export { CompareAction } from './repository/models/CompareAction';
export { RpcTransport } from './repository/source/rpc/RpcTransport';
export { HttpTransport } from './repository/source/http/HttpTransport';
export { HttpInterceptor } from './repository/source/http/HttpInterceptor';
export { TransportFactory } from './repository/source/TransportFactory';
export { KeyPairFactory } from './utils/keypair/KeyPairFactory';
export { EthBaseAddrPair, EthAddrRecord, EthWallets, EthWealthRecord, EthWealthPtr, ProfileUser, ProfileEthWealthValidator } from './utils/types/BaseTypes';
export { SearchRequest, Offer, Base as NodeAPI };
export declare class Builder {
    httpTransport: HttpTransport;
    keyPairHelper: KeyPairHelper;
    repositoryStrategyType: RepositoryStrategyType;
    setHttpTransport(httpTransport: HttpTransport): Builder;
    setKeyParHelper(keyPairHelper: KeyPairHelper): Builder;
    setRepositoryStrategy(strategy: RepositoryStrategyType): Builder;
    build(): Base;
}
export default class Base {
    private _wallet;
    private _accountManager;
    private _profileManager;
    private _dataRequestManager;
    private _offerManager;
    private _searchRequestManager;
    private _authAccountBehavior;
    private _repositoryStrategyInterceptor;
    constructor(builder: Builder);
    static Builder(): Builder;
    changeStrategy(strategy: RepositoryStrategyType): void;
    readonly wallet: Wallet;
    readonly accountManager: AccountManager;
    readonly profileManager: ProfileManager;
    readonly dataRequestManager: DataRequestManager;
    readonly offerManager: OfferManager;
    readonly searchRequestManager: SearchRequestManager;
}
