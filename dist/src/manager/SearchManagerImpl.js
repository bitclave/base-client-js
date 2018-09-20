"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Account_1 = require("../repository/models/Account");
var SearchManagerImpl = /** @class */ (function () {
    function SearchManagerImpl(requestRepository, offerSearchRepository, authAccountBehavior) {
        this.account = new Account_1.default();
        this.requestRepository = requestRepository;
        this.offerSearchRepository = offerSearchRepository;
        authAccountBehavior
            .subscribe(this.onChangeAccount.bind(this));
    }
    SearchManagerImpl.prototype.createRequest = function (searchRequest) {
        return this.requestRepository.create(this.account.publicKey, searchRequest);
    };
    SearchManagerImpl.prototype.getMyRequests = function (id) {
        if (id === void 0) { id = 0; }
        if (id > 0) {
            return this.requestRepository.getSearchRequestByOwnerAndId(this.account.publicKey, id);
        }
        else {
            return this.requestRepository.getSearchRequestByOwner(this.account.publicKey);
        }
    };
    SearchManagerImpl.prototype.getAllRequests = function () {
        return this.requestRepository.getAllSearchRequests();
    };
    SearchManagerImpl.prototype.deleteRequest = function (id) {
        return this.requestRepository.deleteById(this.account.publicKey, id);
    };
    SearchManagerImpl.prototype.getSearchResult = function (searchRequestId) {
        return this.offerSearchRepository.getSearchResult(this.account.publicKey, searchRequestId);
    };
    SearchManagerImpl.prototype.complainToSearchItem = function (searchResultId) {
        return this.offerSearchRepository.complainToSearchItem(this.account.publicKey, searchResultId);
    };
    SearchManagerImpl.prototype.addResultItem = function (offerSearch) {
        return this.offerSearchRepository.addResultItem(this.account.publicKey, offerSearch);
    };
    SearchManagerImpl.prototype.onChangeAccount = function (account) {
        this.account = account;
    };
    return SearchManagerImpl;
}());
exports.SearchManagerImpl = SearchManagerImpl;
//# sourceMappingURL=SearchManagerImpl.js.map