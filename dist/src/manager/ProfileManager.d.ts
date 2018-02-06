import { Observable } from 'rxjs/Rx';
import Account from '../repository/models/Account';
import { ClientDataRepository } from '../repository/client/ClientDataRepository';
export default class ProfileManager {
    private clientDataRepository;
    private account;
    constructor(clientRepository: ClientDataRepository, authAccountBehavior: Observable<Account>);
    private onChangeAccount(account);
    getData(passPhrase: string): Promise<Map<string, string>>;
    updateData(data: Map<string, string>, passPhrase: string): Promise<Map<string, string>>;
    private prepareData(data, passPhrase, encrypt);
}
