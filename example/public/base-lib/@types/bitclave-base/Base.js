"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AccountRepositoryImpl_1 = require("./repository/account/AccountRepositoryImpl");
var ClientDataRepositoryImpl_1 = require("./repository/client/ClientDataRepositoryImpl");
var Rx_1 = require("rxjs/Rx");
var Account_1 = require("./repository/models/Account");
var SignInterceptor_1 = require("./repository/source/http/SignInterceptor");
var DataRequestRepositoryImpl_1 = require("./repository/requests/DataRequestRepositoryImpl");
var RepositoryStrategyInterceptor_1 = require("./repository/source/http/RepositoryStrategyInterceptor");
var RepositoryStrategyType_1 = require("./repository/RepositoryStrategyType");
var OfferRepositoryImpl_1 = require("./repository/offer/OfferRepositoryImpl");
var SearchRequestRepositoryImpl_1 = require("./repository/search/SearchRequestRepositoryImpl");
var SearchRequest_1 = require("./repository/models/SearchRequest");
exports.SearchRequest = SearchRequest_1.default;
var Offer_1 = require("./repository/models/Offer");
exports.Offer = Offer_1.default;
var OfferPrice_1 = require("./repository/models/OfferPrice");
exports.OfferPrice = OfferPrice_1.OfferPrice;
var OfferPriceRules_1 = require("./repository/models/OfferPriceRules");
exports.OfferPriceRules = OfferPriceRules_1.OfferPriceRules;
var HttpTransportImpl_1 = require("./repository/source/http/HttpTransportImpl");
exports.HttpTransportImpl = HttpTransportImpl_1.HttpTransportImpl;
var NonceInterceptor_1 = require("./repository/source/http/NonceInterceptor");
var BaseSchema_1 = require("./utils/types/BaseSchema");
var AssistantNodeRepository_1 = require("./repository/assistant/AssistantNodeRepository");
var TransportFactory_1 = require("./repository/source/TransportFactory");
var KeyPairFactory_1 = require("./utils/keypair/KeyPairFactory");
var SiteRepositoryImpl_1 = require("./repository/site/SiteRepositoryImpl");
var AccountManagerImpl_1 = require("./manager/AccountManagerImpl");
var DataRequestManagerImpl_1 = require("./manager/DataRequestManagerImpl");
var ProfileManagerImpl_1 = require("./manager/ProfileManagerImpl");
var OfferManagerImpl_1 = require("./manager/OfferManagerImpl");
var SearchManagerImpl_1 = require("./manager/SearchManagerImpl");
var WalletManagerImpl_1 = require("./manager/WalletManagerImpl");
exports.WalletManagerImpl = WalletManagerImpl_1.WalletManagerImpl;
var OfferSearchRepositoryImpl_1 = require("./repository/search/OfferSearchRepositoryImpl");
exports.OfferSearchRepositoryImpl = OfferSearchRepositoryImpl_1.OfferSearchRepositoryImpl;
var OfferSearchResultItem_1 = require("./repository/models/OfferSearchResultItem");
exports.OfferSearchResultItem = OfferSearchResultItem_1.default;
var OfferSearch_1 = require("./repository/models/OfferSearch");
exports.OfferSearch = OfferSearch_1.default;
exports.OfferResultAction = OfferSearch_1.OfferResultAction;
var OfferShareData_1 = require("./repository/models/OfferShareData");
exports.OfferShareData = OfferShareData_1.default;
var OfferShareDataRepositoryImpl_1 = require("./repository/offer/OfferShareDataRepositoryImpl");
exports.OfferShareDataRepositoryImpl = OfferShareDataRepositoryImpl_1.default;
var RepositoryStrategyType_2 = require("./repository/RepositoryStrategyType");
exports.RepositoryStrategyType = RepositoryStrategyType_2.RepositoryStrategyType;
var CompareAction_1 = require("./repository/models/CompareAction");
exports.CompareAction = CompareAction_1.CompareAction;
var TransportFactory_2 = require("./repository/source/TransportFactory");
exports.TransportFactory = TransportFactory_2.TransportFactory;
var KeyPairFactory_2 = require("./utils/keypair/KeyPairFactory");
exports.KeyPairFactory = KeyPairFactory_2.KeyPairFactory;
var CryptoUtils_1 = require("./utils/CryptoUtils");
exports.CryptoUtils = CryptoUtils_1.CryptoUtils;
var WalletUtils_1 = require("./utils/WalletUtils");
exports.WalletUtils = WalletUtils_1.WalletUtils;
var JsonUtils_1 = require("./utils/JsonUtils");
exports.JsonUtils = JsonUtils_1.JsonUtils;
var EthereumUtils_1 = require("./utils/EthereumUtils");
exports.EthereumUtils = EthereumUtils_1.EthereumUtils;
var KeyPair_1 = require("./utils/keypair/KeyPair");
exports.KeyPair = KeyPair_1.KeyPair;
var Permissions_1 = require("./utils/keypair/Permissions");
exports.Permissions = Permissions_1.Permissions;
exports.AccessRight = Permissions_1.AccessRight;
var AcceptedField_1 = require("./utils/keypair/AcceptedField");
exports.AcceptedField = AcceptedField_1.AcceptedField;
var RpcToken_1 = require("./utils/keypair/rpc/RpcToken");
exports.RpcToken = RpcToken_1.RpcToken;
var RpcAuth_1 = require("./utils/keypair/rpc/RpcAuth");
exports.RpcAuth = RpcAuth_1.RpcAuth;
var BaseTypes_1 = require("./utils/types/BaseTypes");
exports.BaseAddrPair = BaseTypes_1.BaseAddrPair;
exports.AddrRecord = BaseTypes_1.AddrRecord;
exports.WalletsRecords = BaseTypes_1.WalletsRecords;
exports.WealthRecord = BaseTypes_1.WealthRecord;
exports.WealthPtr = BaseTypes_1.WealthPtr;
exports.ProfileUser = BaseTypes_1.ProfileUser;
exports.ProfileWealthValidator = BaseTypes_1.ProfileWealthValidator;
var Base = /** @class */ (function () {
    function Base(nodeHost, siteOrigin, strategy, signerHost) {
        if (strategy === void 0) { strategy = RepositoryStrategyType_1.RepositoryStrategyType.Postgres; }
        if (signerHost === void 0) { signerHost = ''; }
        this._authAccountBehavior = new Rx_1.BehaviorSubject(new Account_1.default());
        this._repositoryStrategyInterceptor = new RepositoryStrategyInterceptor_1.RepositoryStrategyInterceptor(strategy);
        var assistantHttpTransport = new HttpTransportImpl_1.HttpTransportImpl(nodeHost)
            .addInterceptor(this._repositoryStrategyInterceptor);
        var nodeAssistant = this.createNodeAssistant(assistantHttpTransport);
        var keyPairHelper = this.createKeyPairHelper(signerHost, nodeAssistant, nodeAssistant, siteOrigin);
        var messageSigner = keyPairHelper;
        var encryptMessage = keyPairHelper;
        var decryptMessage = keyPairHelper;
        var transport = TransportFactory_1.TransportFactory.createHttpTransport(nodeHost)
            .addInterceptor(new SignInterceptor_1.default(messageSigner))
            .addInterceptor(new NonceInterceptor_1.default(messageSigner, nodeAssistant))
            .addInterceptor(this._repositoryStrategyInterceptor);
        var accountRepository = new AccountRepositoryImpl_1.default(transport);
        var clientDataRepository = new ClientDataRepositoryImpl_1.default(transport);
        var dataRequestRepository = new DataRequestRepositoryImpl_1.default(transport);
        var offerRepository = new OfferRepositoryImpl_1.default(transport);
        var searchRequestRepository = new SearchRequestRepositoryImpl_1.default(transport);
        var offerSearchRepository = new OfferSearchRepositoryImpl_1.OfferSearchRepositoryImpl(transport);
        this._accountManager = new AccountManagerImpl_1.AccountManagerImpl(accountRepository, keyPairHelper, messageSigner, this._authAccountBehavior);
        this._dataRequestManager = new DataRequestManagerImpl_1.DataRequestManagerImpl(dataRequestRepository, this._authAccountBehavior.asObservable(), encryptMessage, decryptMessage);
        this._profileManager = new ProfileManagerImpl_1.ProfileManagerImpl(clientDataRepository, this._authAccountBehavior.asObservable(), encryptMessage, decryptMessage, messageSigner);
        this._offerManager = new OfferManagerImpl_1.OfferManagerImpl(offerRepository, this._authAccountBehavior.asObservable());
        this._searchManager = new SearchManagerImpl_1.SearchManagerImpl(searchRequestRepository, offerSearchRepository, this._authAccountBehavior.asObservable());
        this._walletManager = new WalletManagerImpl_1.WalletManagerImpl(this.profileManager, this.dataRequestManager, new BaseSchema_1.BaseSchema(), messageSigner, this._authAccountBehavior.asObservable());
    }
    Base.prototype.changeStrategy = function (strategy) {
        this._repositoryStrategyInterceptor.changeStrategy(strategy);
    };
    Object.defineProperty(Base.prototype, "walletManager", {
        get: function () {
            return this._walletManager;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Base.prototype, "accountManager", {
        get: function () {
            return this._accountManager;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Base.prototype, "profileManager", {
        get: function () {
            return this._profileManager;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Base.prototype, "dataRequestManager", {
        get: function () {
            return this._dataRequestManager;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Base.prototype, "offerManager", {
        get: function () {
            return this._offerManager;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Base.prototype, "searchManager", {
        get: function () {
            return this._searchManager;
        },
        enumerable: true,
        configurable: true
    });
    Base.prototype.createNodeAssistant = function (httpTransport) {
        var accountRepository = new AccountRepositoryImpl_1.default(httpTransport);
        var dataRequestRepository = new DataRequestRepositoryImpl_1.default(httpTransport);
        var siteRepository = new SiteRepositoryImpl_1.SiteRepositoryImpl(httpTransport);
        return new AssistantNodeRepository_1.AssistantNodeRepository(accountRepository, dataRequestRepository, siteRepository);
    };
    Base.prototype.createKeyPairHelper = function (signerHost, permissionSource, siteDataSource, siteOrigin) {
        return (signerHost.length === 0)
            ? KeyPairFactory_1.KeyPairFactory.createDefaultKeyPair(permissionSource, siteDataSource, siteOrigin)
            : KeyPairFactory_1.KeyPairFactory.createRpcKeyPair(TransportFactory_1.TransportFactory.createJsonRpcHttpTransport(signerHost));
    };
    return Base;
}());
exports.default = Base;
//# sourceMappingURL=Base.js.map