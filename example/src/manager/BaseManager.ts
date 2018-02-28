import Config from '../Config';
import { injectable } from 'inversify';
import { DataRequestState, default as Base, RepositoryStrategyType } from 'base';
import 'reflect-metadata';
import Account from 'base/repository/models/Account';
import DataRequestManager from 'base/manager/DataRequestManager';
import DataRequest from 'base/repository/models/DataRequest';

export interface SyncDataListener {

    onSyncData(result: Array<DataRequest>): void;

}

@injectable()
export default class BaseManager {
    private readonly SYNC_DATA_INTERVAL_MS: number = 3000;

    private base: Base;
    private listeners: Set<SyncDataListener> = new Set<SyncDataListener>();
    private account: Account;
    private cacheRequests: Array<DataRequest> = [];

    constructor() {
        this.base = new Base(Config.getBaseEndPoint());
        this.changeStrategy(RepositoryStrategyType.Postgres);
    }

    changeStrategy(strategy: RepositoryStrategyType) {
        this.base.changeStrategy(strategy);
    }

    signUp(mnemonicPhrase: string): Promise<Account> {
        return this.base.accountManager.registration(mnemonicPhrase)
            .then(account => {
                this.account = account;
                this.prepareStartSyncState();
                return this.account;
            });
    }

    signIn(mnemonicPhrase: string): Promise<Account> {
        return this.base.accountManager.checkAccount(mnemonicPhrase)
            .then(account => {
                this.account = account;
                this.prepareStartSyncState();
                return this.account;
            });
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

    addSyncDataListener(listener: SyncDataListener) {
        if (!this.listeners.has(listener)) {
            this.listeners.add(listener);
            listener.onSyncData(this.cacheRequests);
        }
    }

    removeSyncDataListener(listener: SyncDataListener) {
        this.listeners.delete(listener);
    }

    decryptRequestFields(senderPk: string, encryptedData: string): Array<string> {
        return this.base.dataRequestManager.decryptMessage(senderPk, encryptedData);
    }

    getClientRawData(clientPk: string): Promise<Map<string, string>> {
        return this.base.profileManager.getRawData(clientPk);
    }

    getAuthorizedData(recipientPk: string, encryptedData: string): Promise<Map<string, string>> {
        return this.base.profileManager.getAuthorizedData(recipientPk, encryptedData);
    }

    createRequest(recipientPk: string, fields: Array<string>): Promise<string> {
        return this.base.dataRequestManager.createRequest(recipientPk, fields);
    }

    responseToRequest(requestId: number, senderPk: string, fields?: Array<string>): Promise<DataRequestState> {
        return this.base.dataRequestManager.responseToRequest(requestId, senderPk, fields)
            .then(state => {
                this.cacheRequests = this.cacheRequests.filter(item => item.id !== requestId);
                return state;
            });
    }

    private prepareStartSyncState() {
        this.cacheRequests = [];
        this.syncState();
    }

    private startLoopSyncState() {
        setTimeout(this.syncState.bind(this), this.SYNC_DATA_INTERVAL_MS);
    }

    private syncState() {
        let result: Array<DataRequest> = [];
        const data: DataRequestManager = this.base.dataRequestManager;

        if (this.account != null && this.account.publicKey != null) {

            data.getRequests(this.account.publicKey, '', DataRequestState.ACCEPT)
                .then(list => {
                    result = result.concat(list);
                    return data.getRequests(this.account.publicKey, '', DataRequestState.REJECT);
                })
                .then(list => {
                    result = result.concat(list);
                    return data.getRequests('', this.account.publicKey, DataRequestState.AWAIT);
                })
                .then(list => {
                    result = result.concat(list);
                    this.cacheRequests = result;
                    this.listeners.forEach(listener => listener.onSyncData(result));
                    this.startLoopSyncState();
                });

        } else {
            this.startLoopSyncState();
        }
    }

}
