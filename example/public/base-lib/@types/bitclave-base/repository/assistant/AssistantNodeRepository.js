"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Account_1 = require("../models/Account");
// this class assistant for only read data from Base-node. without any permissions
var AssistantNodeRepository = /** @class */ (function () {
    function AssistantNodeRepository(accountRepository, dataRequestRepository, siteRepository) {
        this.accountRepository = accountRepository;
        this.dataRequestRepository = dataRequestRepository;
        this.siteRepository = siteRepository;
    }
    AssistantNodeRepository.prototype.getGrandAccessRecords = function (publicKeyFrom, publicKeyTo) {
        return this.dataRequestRepository.getRequests(publicKeyFrom, publicKeyTo);
    };
    AssistantNodeRepository.prototype.getNonce = function (publicKey) {
        return this.accountRepository.getNonce(new Account_1.default(publicKey));
    };
    AssistantNodeRepository.prototype.getSiteData = function (origin) {
        return this.siteRepository.getSiteData(origin);
    };
    return AssistantNodeRepository;
}());
exports.AssistantNodeRepository = AssistantNodeRepository;
//# sourceMappingURL=AssistantNodeRepository.js.map