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
import { SearchRequestManager } from './manager/SearchRequestManager';
import { SearchRequestRepository } from './repository/search/SearchRequestRepository';
import SearchRequestRepositoryImpl from './repository/search/SearchRequestRepositoryImpl';
import SearchRequest from './repository/models/SearchRequest';
import Offer from './repository/models/Offer';
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

export { RepositoryStrategyType } from './repository/RepositoryStrategyType';
export { CompareAction } from './repository/models/CompareAction';
export { RpcTransport } from './repository/source/rpc/RpcTransport';
export { HttpTransport } from './repository/source/http/HttpTransport';
export { HttpInterceptor } from './repository/source/http/HttpInterceptor';
export { TransportFactory } from './repository/source/TransportFactory';
export { KeyPairFactory } from './utils/keypair/KeyPairFactory';
export { RemoteSigner } from './utils/keypair/RemoteSigner';
export { CryptoUtils } from './utils/CryptoUtils';
export { Permissions } from './utils/keypair/Permissions';
export { WalletUtils } from './utils/WalletUtils';
export { EthereumUtils } from './utils/EthereumUtils';

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
    SearchRequestManager,
    WalletManager,
    SearchRequest,
    Offer,
    Base as NodeAPI
};

export default class Base {

    private _walletManager: WalletManager;
    private _accountManager: AccountManager;
    private _profileManager: ProfileManager;
    private _dataRequestManager: DataRequestManager;
    private _offerManager: OfferManager;
    private _searchRequestManager: SearchRequestManager;
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
            messageSigner
        );

        this._offerManager = new OfferManager(offerRepository, this._authAccountBehavior.asObservable());

        this._searchRequestManager = new SearchRequestManager(
            searchRequestRepository,
            this._authAccountBehavior.asObservable()
        );

        this._walletManager = new WalletManager(
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

    get searchRequestManager(): SearchRequestManager {
        return this._searchRequestManager;
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
        return (signerHost.length == 0)
            ? KeyPairFactory.createDefaultKeyPair(permissionSource, siteDataSource, siteOrigin)
            : KeyPairFactory.createRpcKeyPair(TransportFactory.createJsonRpcHttpTransport(signerHost));
    }

}
