"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Account_1 = require("../repository/models/Account");
var RpcKeyPair_1 = require("../utils/keypair/rpc/RpcKeyPair");
var AccountManagerImpl = /** @class */ (function () {
    function AccountManagerImpl(auth, keyPairCreator, messageSigner, authAccountBehavior) {
        this.accountRepository = auth;
        this.keyPairCreator = keyPairCreator;
        this.messageSigner = messageSigner;
        this.authAccountBehavior = authAccountBehavior;
    }
    /**
     * Checks or Register user with provided mnemonic phrase is already registered in the system.
     * @param {string} passPhrase Mnemonic phrase for Public/Private key pair
     * generation for asymmetric encryption scheme.
     * @param {string} message on the basis of which a signature will be created to verify the public key
     *
     * @returns {Promise<Account>} {Account} if client exist or http exception if fail.
     */
    AccountManagerImpl.prototype.authenticationByPassPhrase = function (passPhrase, message) {
        var _this = this;
        this.checkSigMessage(message);
        if (!(this.keyPairCreator instanceof RpcKeyPair_1.RpcKeyPair)) {
            return this.checkAccount(passPhrase, message)
                .catch(function (reason) { return _this.registration(passPhrase, message); });
        }
        throw 'key pair helper does not support pass-phrase authentication';
    };
    /**
     * Checks if user with provided access token is already registered in the system.
     * @param {string} accessToken token for authenticate on remote signer
     * (if {@link KeyPairHelper} support {@link RemoteSigner})
     *
     * @param {string} message on the basis of which a signature will be created to verify the public key
     *
     * @returns {Promise<Account>} {Account} if client exist or http exception if fail.
     */
    AccountManagerImpl.prototype.authenticationByAccessToken = function (accessToken, message) {
        var _this = this;
        this.checkSigMessage(message);
        if (this.keyPairCreator instanceof RpcKeyPair_1.RpcKeyPair) {
            this.keyPairCreator.setAccessToken(accessToken);
            return this.keyPairCreator.createKeyPair('')
                .then(this.generateAccount)
                .then(function (account) { return _this.accountRepository.checkAccount(account); })
                .then(function (account) { return _this.onGetAccount(account, message); });
        }
        throw 'key pair helper does not support token authentication';
    };
    /**
     * Registers a new user in the system.
     * @param {string} mnemonicPhrase Mnemonic phrase for Public/Private key pair
     * generation for asymmetric encryption scheme.
     * @param {string} message on the basis of which a signature will be created to verify the public key
     *
     * @returns {Promise<Account>} {Account} after successful registration or http exception if fail.
     */
    AccountManagerImpl.prototype.registration = function (mnemonicPhrase, message) {
        var _this = this;
        this.checkSigMessage(message);
        return this.keyPairCreator.createKeyPair(mnemonicPhrase)
            .then(this.generateAccount)
            .then(function (account) { return _this.accountRepository.registration(account); })
            .then(function (account) { return _this.onGetAccount(account, message); });
    };
    /**
     * Checks if user with provided mnemonic phrase is already registered in the system.
     * @param {string} mnemonicPhrase Mnemonic phrase for Public/Private key pair
     * generation for asymmetric encryption scheme.
     * @param {string} message on the basis of which a signature will be created to verify the public key
     *
     * @returns {Promise<Account>} {Account} if client exist or http exception if fail.
     */
    AccountManagerImpl.prototype.checkAccount = function (mnemonicPhrase, message) {
        var _this = this;
        this.checkSigMessage(message);
        return this.keyPairCreator.createKeyPair(mnemonicPhrase)
            .then(this.generateAccount)
            .then(function (account) { return _this.syncAccount(account, message); });
    };
    /**
     * Allows user to unsubscribe from BASE. Delets all his data
     *
     * @returns {Promise<Account>} {Account} if client exist or http exception if fail.
     */
    AccountManagerImpl.prototype.unsubscribe = function () {
        return this.accountRepository.unsubscribe(this.authAccountBehavior.getValue());
    };
    AccountManagerImpl.prototype.getNewMnemonic = function () {
        return this.keyPairCreator.generateMnemonicPhrase();
    };
    AccountManagerImpl.prototype.getAccount = function () {
        return this.authAccountBehavior.getValue();
    };
    AccountManagerImpl.prototype.checkSigMessage = function (message) {
        if (message == null || message === undefined || message.length < 10) {
            throw 'message for signature should be have min 10 symbols';
        }
    };
    AccountManagerImpl.prototype.syncAccount = function (account, message) {
        var _this = this;
        return this.accountRepository
            .checkAccount(account)
            .then(function (checkedAccount) { return _this.onGetAccount(checkedAccount, message); });
    };
    AccountManagerImpl.prototype.generateAccount = function (keyPair) {
        return new Promise(function (resolve) {
            resolve(new Account_1.default(keyPair.publicKey));
        });
    };
    AccountManagerImpl.prototype.onGetAccount = function (account, message) {
        var _this = this;
        return this.messageSigner.signMessage(message)
            .then(function (sig) { return new Promise(function (resolve) {
            account.message = message;
            account.sig = sig;
            _this.authAccountBehavior.next(account);
            resolve(account);
        }); });
    };
    return AccountManagerImpl;
}());
exports.AccountManagerImpl = AccountManagerImpl;
//# sourceMappingURL=AccountManagerImpl.js.map