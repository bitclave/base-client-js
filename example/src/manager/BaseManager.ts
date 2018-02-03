import Config from '../Config';
import { injectable } from 'inversify';
import Base from 'base';
import 'reflect-metadata';
import Account from 'base/repository/models/Account';

@injectable()
export default class BaseManager {

    private base: Base;

    constructor() {
        this.base = new Base(Config.getBaseEndPoint());
        console.log('INIT BASE');
    }

    signUp(mnemonicPhrase: string): Promise<Account> {
        return this.base.accountManager.signUp(mnemonicPhrase);
    }

    signIn(mnemonicPhrase: string): Promise<Account> {
        return this.base.accountManager.signIn(mnemonicPhrase);
    }

    loadClientData(): Promise<Map<string, string>> {
        return new Promise<Map<string, string>>((resolve, reject) => {
            if (this.base.accountManager.hasActiveAccount()) {
                console.log(this.base.accountManager.getProfile().data);
                resolve(this.base.accountManager.getProfile().data);
            } else {
                reject('not have active accounts');
            }
        });
    }
}
