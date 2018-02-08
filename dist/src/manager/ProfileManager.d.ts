import { Observable } from 'rxjs/Rx';
import Account from '../repository/models/Account';
import { ClientDataRepository } from '../repository/client/ClientDataRepository';
import { MessageEncrypt } from '../utils/keypair/MessageEncrypt';
import { MessageDecrypt } from '../utils/keypair/MessageDecrypt';
export default class ProfileManager {
    private clientDataRepository;
    private account;
    private encrypt;
    private decrypt;
    constructor(clientRepository: ClientDataRepository, authAccountBehavior: Observable<Account>, encrypt: MessageEncrypt, decrypt: MessageDecrypt);
    private onChangeAccount(account);
    getData(): Promise<Map<string, string>>;
    getRawData(anyPublicKey: string): Promise<Map<string, string>>;
    getAuthorizedData(recipientPk: string, encryptedData: string): Promise<Map<string, string>>;
    updateData(data: Map<string, string>): Promise<Map<string, string>>;
    private prepareData(data, encrypt);
}
