import { Observable } from 'rxjs/Rx';
import { ClientDataRepository } from '../repository/client/ClientDataRepository';
import Account from '../repository/models/Account';
import FileMeta from '../repository/models/FileMeta';
import { CryptoUtils } from '../utils/CryptoUtils';
import { JsonUtils } from '../utils/JsonUtils';
import { AcceptedField } from '../utils/keypair/AcceptedField';
import { MessageDecrypt } from '../utils/keypair/MessageDecrypt';
import { MessageEncrypt } from '../utils/keypair/MessageEncrypt';
import { MessageSigner } from '../utils/keypair/MessageSigner';
import { ProfileManager } from './ProfileManager';

export class ProfileManagerImpl implements ProfileManager {

    private clientDataRepository: ClientDataRepository;
    private account: Account = new Account();
    private encrypt: MessageEncrypt;
    private decrypt: MessageDecrypt;
    private signer: MessageSigner;

    constructor(
        clientRepository: ClientDataRepository,
        authAccountBehavior: Observable<Account>,
        encrypt: MessageEncrypt,
        decrypt: MessageDecrypt,
        signer: MessageSigner
    ) {
        this.clientDataRepository = clientRepository;

        authAccountBehavior
            .subscribe(this.onChangeAccount.bind(this));

        this.encrypt = encrypt;
        this.decrypt = decrypt;
        this.signer = signer;
    }

    public signMessage(data: any): Promise<string> {
        return this.signer.signMessage(data);
    }

    /**
     * Returns decrypted data of the authorized user.
     *
     * @returns {Promise<Map<string, string>>} Map key => value.
     */
    public getData(): Promise<Map<string, string>> {
        return this.getRawData(this.account.publicKey)
            .then((rawData: Map<string, string>) => this.decrypt.decryptFields(rawData))
            .catch(err => {
                throw err;
            });
    }

    /**
     * Returns raw (encrypted) data of user with provided ID (Public Key).
     * @param {string} anyPublicKey Public key of client.
     *
     * @returns {Promise<Map<string, string>>} Map key => value.
     */
    public getRawData(anyPublicKey: string): Promise<Map<string, string>> {
        return this.clientDataRepository.getData(anyPublicKey);
    }

    /**
     * Decrypts accepted personal data {@link DataRequest#responseData}.
     * @param {string} recipientPk  Public key of the user that shared the data
     * @param {string} encryptedData encrypted data {@link DataRequest#responseData}.
     *
     * @returns {Promise<Map<string, string>>} Map key => value.
     */
    public async getAuthorizedData(recipientPk: string, encryptedData: string): Promise<Map<string, string>> {
        const strDecrypt: string = await this.decrypt.decryptMessage(recipientPk, encryptedData);
        const jsonDecrypt = JSON.parse(strDecrypt);
        const arrayResponse: Map<string, AcceptedField> = JsonUtils.jsonToMap(jsonDecrypt);
        const result: Map<string, string> = new Map<string, string>();

        const recipientData: Map<string, string> = await this.getRawData(recipientPk) || new Map();

        arrayResponse.forEach((value: AcceptedField, key: string) => {
            if (recipientData.has(key)) {
                try {
                    const data: string = recipientData.get(key) as string;
                    const decryptedValue: string = CryptoUtils.decryptAes256(data, value.pass);
                    result.set(key, decryptedValue);

                } catch (e) {
                    console.log('decryption error: ', key, ' => ', recipientData.get(key), e);
                }
            }
        });

        return result;
    }

    /**
     * Returns decryption keys for approved personal data {@link DataRequest#responseData}.
     * @param {string} recipientPk  Public key of the user that shared the data
     * @param {string} encryptedData encrypted data {@link DataRequest#responseData}.
     *
     * @returns {Promise<Map<string, string>>} Map key => value.
     */
    public async getAuthorizedEncryptionKeys(recipientPk: string, encryptedData: string): Promise<Map<string, string>> {
        const strDecrypt = await this.decrypt.decryptMessage(recipientPk, encryptedData);
        const jsonDecrypt = JSON.parse(strDecrypt);
        const arrayResponse: Map<string, AcceptedField> = JsonUtils.jsonToMap(jsonDecrypt);
        const result: Map<string, string> = new Map<string, string>();

        const recipientData: Map<string, string> = await this.getRawData(recipientPk);

        arrayResponse.forEach((value: AcceptedField, key: string) => {
            if (recipientData.has(key)) {
                result.set(key, value.pass);
            }
        });

        return result;
    }

    /**
     * Encrypts and stores personal data in BASE.
     * @param {Map<string, string>} data not encrypted data e.g. Map {"name": "Adam"} etc.
     *
     * @returns {Promise<Map<string, string>>} Map with encrypted data.
     */
    public updateData(data: Map<string, string>): Promise<Map<string, string>> {
        return this.encrypt.encryptFields(data)
            .then(encrypted => this.clientDataRepository.updateData(this.account.publicKey, encrypted))
            .catch(err => {
                throw err;
            });
    }

    private onChangeAccount(account: Account) {
        this.account = account;
    }

    /**
     * Encrypts and stores file in BASE.
     * @param {string} file the actual file data encoded to Base64
     * @param {String} key the key of FileMeta value in profile data
     * If the fileId is undefined, creates a new file, added associated FileMeta to Profile data with the key and
     *     returns FileMeta.  If not then updates the existing file and its FileMeta in Profile data and returns
     *     updated FileMeta
     *
     * @returns {Promise<FileMeta>} Encrypted FileMeta.
     */
    public async uploadFile(file: FileMeta, key: string): Promise<FileMeta> {
        const encrypted: string = await this.encrypt.encryptFile(file.content || '');
        const existedMeta = await this.getFileMetaWithGivenKey(key);
        const fileId: number = existedMeta ? existedMeta.id : 0;
        const fileForUpload = file.copyWithContent(encrypted);
        const updatedMeta = await this.clientDataRepository
            .uploadFile(this.account.publicKey, fileForUpload, fileId);

        return await this.updateFileMetaWithGivenKey(key, updatedMeta);

    }

    /**
     * Returns decrypted file blob data of the authorized user based on provided file id.
     * @param {number} id not encrypted file id
     *
     * @returns {Promise<FileMeta>} decrypted file data.
     */
    public async downloadFile(id: number): Promise<FileMeta> {
        const encodedFile = await this.clientDataRepository.getFile(this.account.publicKey, id);
        const decrypted = await this.decrypt.decryptFile(encodedFile.content || '');

        return encodedFile.copyWithContent(decrypted);
    }

    public async getFileMetaWithGivenKey(key: string): Promise<FileMeta | undefined> {
        const myData: Map<string, string> = await this.getData();
        let fileMeta: FileMeta | undefined;
        if (myData.has(key)) {
            const meta: string = myData.get(key) || '';
            fileMeta = Object.assign(new FileMeta(), JSON.parse(meta));
        }

        return fileMeta;
    }

    private async updateFileMetaWithGivenKey(key: string, fileMeta: FileMeta): Promise<FileMeta> {
        const myData: Map<string, string> = await this.getData();
        myData.set(key, JSON.stringify(fileMeta));
        await this.updateData(myData);
        return fileMeta;
    }

}
