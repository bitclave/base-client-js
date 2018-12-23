"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Object represents the pointer entry stored at clients side
 * after successfully subscribe to a service
 * {type: {spid, schema}}
 */
var SubscriptionPointer = /** @class */ (function () {
    function SubscriptionPointer(spid, serviceType) {
        this.spid = spid;
        this.schema = SubscriptionPointer.UID + SubscriptionPointer.SEP + SubscriptionPointer.BID + SubscriptionPointer.SEP + serviceType;
    }
    SubscriptionPointer.conform = function (value) {
        try {
            var obj = JSON.parse(value);
            // TODO: assume other value won't contain schema and spid fields
            if (obj.schema !== undefined && obj.spid !== undefined) {
                return true;
            }
        }
        catch (e) {
            return false;
        }
        return false;
    };
    SubscriptionPointer.SEP = '_';
    SubscriptionPointer.SPID = 'spid';
    SubscriptionPointer.UID = 'uid';
    SubscriptionPointer.BID = 'bid';
    return SubscriptionPointer;
}());
exports.default = SubscriptionPointer;
//# sourceMappingURL=SubscriptionPointer.js.map