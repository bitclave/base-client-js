import Config from '../Config';
import { injectable } from 'inversify';
import 'reflect-metadata';
import Base, { AccessRight, RepositoryStrategyType, OfferSearch, DataRequestManager } from 'bitclave-base';
import Account from 'bitclave-base/repository/models/Account';
import OfferManager from 'bitclave-base/manager/OfferManager';
import ProfileManager from 'bitclave-base/manager/ProfileManager';
import SearchManager from 'bitclave-base/manager/SearchManager';
import WalletManager from 'bitclave-base/manager/WalletManager';

@injectable()
export default class BaseManager {

    private base: Base;
    public account: Account;

    constructor() {
        this.base = new Base(Config.getBaseEndPoint(), location.hostname);
        console.log('your host name:', location.hostname);
    }

    changeStrategy(strategy: RepositoryStrategyType) {
        this.base.changeStrategy(strategy);
    }

    signUp(mnemonicPhrase: string): Promise<Account> {
        return this.getUniqueMessageForSigFromServerSide()
            .then(uniqueMessage => this.base.accountManager.registration(mnemonicPhrase, uniqueMessage))
            .then(this.sendAccountToServerSide.bind(this))
            .then(account => this.account = account);
    }

    signIn(mnemonicPhrase: string): Promise<Account> {
        return this.getUniqueMessageForSigFromServerSide()
            .then(uniqueMessage => this.base.accountManager.checkAccount(mnemonicPhrase, uniqueMessage))
            .then(this.sendAccountToServerSide.bind(this))
            .then(account => this.account = account);
    }



    public sendAccountToServerSide(account: Account): Promise<Account> {
        return new Promise<Account>(resolve => {
            console.log('account for server side: ', account);
            resolve(account);
        });
    }

    getNewMnemonic(): Promise<string> {
        return this.base.accountManager.getNewMnemonic()
            .then(phrase => phrase);
    }

    unsubscribe(mnemonicPhrase: string): Promise<Account> {
        return this.base.accountManager.unsubscribe(mnemonicPhrase)
            .then(account => this.account = account);
    }

    getOfferManager(): OfferManager {
        return this.base.offerManager;
    }

    getProfileManager(): ProfileManager {
        return this.base.profileManager;
    }

    getWalletManager(): WalletManager {
        return this.base.walletManager;
    }

    getSearchManager(): SearchManager {
        return this.base.searchManager;
    }

    getDataReuqestManager(): DataRequestManager {
        return this.base.dataRequestManager;
    }

    getId() {
        return this.account ? this.account.publicKey : 'undefined';
    }

    loadClientData(): Promise<Map<string, string>> {
        return this.base.profileManager.getData();
    }

    saveData(data: Map<string, string>): Promise<Map<string, string>> {
        return this.base.profileManager.updateData(data);
    }

    decryptRequestFields(senderPk: string, encryptedData: string): Promise<any> {
        return this.base.dataRequestManager.decryptMessage(senderPk, encryptedData);
    }

    getClientRawData(clientPk: string): Promise<Map<string, string>> {
        return this.base.profileManager.getRawData(clientPk);
    }

    getAuthorizedData(recipientPk: string, encryptedData: string): Promise<Map<string, string>> {
        return this.base.profileManager.getAuthorizedData(recipientPk, encryptedData);
    }

    getAlreadyRequestedPermissions(recipientPk: string): Promise<Array<string>> {
        return this.base.dataRequestManager.getRequestedPermissions(recipientPk);
    }

    requestPermissions(recipientPk: string, fields: Array<string>): Promise<number> {
        return this.base.dataRequestManager.requestPermissions(recipientPk, fields);
    }

    public shareDataForOffer(offer: Offer): Promise<void> {
        const fields: Array<string> = [];
        offer.compare.forEach((value, key) => {
            fields.push(key.toString().toLowerCase());
        });

        return this.base.dataRequestManager.grantAccessForOffer(offer.id, offer.owner, fields);
    }

    async grandPermissions(from: string, fields: Array<string>): Promise<Array<string>> {
        const grantedFields = fields;
        // get old granted permissions
        // const grantedFields = await this.base.dataRequestManager.getGrantedPermissionsToMe(from);
        //
        // fields.forEach(value => {
        //     if (grantedFields.indexOf(value) === -1) {
        //         grantedFields.push(value);
        //     }
        // });

        console.log('new', grantedFields);
        const accessFields: Map<string, AccessRight> = new Map();

        grantedFields.forEach(value => {
            accessFields.set(value, AccessRight.R);
        });

        await this.base.dataRequestManager.grantAccessForClient(from, accessFields);

        return grantedFields;
    }

    getRequests(fromPk?: string, toPk?: string): Promise<Array<DataRequest>> {
        return this.base.dataRequestManager.getRequests(fromPk, toPk);
    }

    logout() {
        this.account = null;
    }

    private getUniqueMessageForSigFromServerSide(): Promise<string> {
      return new Promise<string>(resolve => {
          let text = '';
          const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

          for (let i = 0; i < 64; i++) {
              text += possible.charAt(Math.floor(Math.random() * possible.length));
          }

          console.log('unique message from server side:', text);
          resolve(text);
      });
  }

}
