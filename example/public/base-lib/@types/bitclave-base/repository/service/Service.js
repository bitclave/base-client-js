"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ServiceInfo = /** @class */ (function () {
    function ServiceInfo(type, id, description, requiredKeys) {
        this.type = type;
        this.id = id;
        this.description = description;
        this.requiredKeys = requiredKeys;
    }
    ServiceInfo.SUBSCRIPTION_PROCESSING = 'processing';
    ServiceInfo.SUBSCRIPTION_DENY = 'deny';
    return ServiceInfo;
}());
exports.ServiceInfo = ServiceInfo;
//# sourceMappingURL=Service.js.map