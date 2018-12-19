"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RepositoryStrategyInterceptor = /** @class */ (function () {
    function RepositoryStrategyInterceptor(strategy) {
        this.strategy = strategy;
    }
    RepositoryStrategyInterceptor.prototype.changeStrategy = function (strategy) {
        this.strategy = strategy;
    };
    RepositoryStrategyInterceptor.prototype.onIntercept = function (cortege) {
        var _this = this;
        return new Promise(function (resolve) {
            cortege.headers.set('Strategy', _this.strategy);
            resolve(cortege);
        });
    };
    return RepositoryStrategyInterceptor;
}());
exports.RepositoryStrategyInterceptor = RepositoryStrategyInterceptor;
//# sourceMappingURL=RepositoryStrategyInterceptor.js.map