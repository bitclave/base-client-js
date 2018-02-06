import { Observable } from 'rxjs/Rx';
import Account from '../repository/models/Account';
import { ClientDataRepository } from '../repository/client/ClientDataRepository';
import CryptoUtils from '../utils/CryptoUtils';

export default class ProfileManager {

    private clientDataRepository: ClientDataRepository;
    private account: Account = new Account();

    constructor(clientRepository: ClientDataRepository, authAccountBehavior: Observable<Account>) {
        this.clientDataRepository = clientRepository;

        authAccountBehavior
            .subscribe(e => this.onChangeAccount(e));
    }

    private onChangeAccount(account: Account) {
        this.account = account;
    }

    public getData(passPhrase: string): Promise<Map<string, string>> {
        return this.clientDataRepository.getData(this.account.id)
            .then(data => this.prepareData(data, passPhrase, false));
    }

    public updateData(data: Map<string, string>, passPhrase: string): Promise<Map<string, string>> {
        return this.prepareData(data, passPhrase, true)
            .then(encrypted => this.clientDataRepository.updateData(this.account.id, encrypted));
    }

    private prepareData(data: Map<string, string>,
                        passPhrase: string,
                        encrypt: boolean): Promise<Map<string, string>> {
        return new Promise<Map<string, string>>(resolve => {
            const result: Map<string, string> = new Map<string, string>();
            let pass;
            let changedValue;
            let changedKey;

            data.forEach((value, key) => {
                changedKey = key.toLowerCase();
                pass = CryptoUtils.PBKDF2(changedKey + passPhrase + changedKey, 256);

                changedValue = encrypt
                    ? CryptoUtils.encryptAes256(value, pass)
                    : CryptoUtils.decryptAes256(value, pass);

                result.set(changedKey, changedValue);
            });

            resolve(result);
        });
    }

}
