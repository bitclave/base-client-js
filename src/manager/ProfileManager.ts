import { Observable } from 'rxjs/Rx';
import Account from '../repository/models/Account';
import { ClientDataRepository } from '../repository/client/ClientDataRepository';
import CryptoUtils from '../utils/CryptoUtils';
import { MessageEncrypt } from '../utils/keypair/MessageEncrypt';
import JsonUtils from '../utils/JsonUtils';
import { MessageDecrypt } from '../utils/keypair/MessageDecrypt';
import { MessageSigner } from '../utils/keypair/MessageSigner';
import baseEthUitls, { EthWalletVerificationCodes, EthWalletVerificationStatus } from '../utils/BaseEthUtils';
import * as BaseType from '../../src/utils/BaseTypes';
import { DataRequestState } from '../repository/models/DataRequestState';
import DataRequestManager from './DataRequestManager';
import {EthAddrRecord} from "../utils/BaseTypes";

export default class ProfileManager {

    public static DATA_KEY_ETH_WALLETS: string = 'eth_wallets';
    public static DATA_KEY_ETH_WEALTH_VALIDATOR: string = 'ethwealthvalidator';
    public static DATA_KEY_WEALTH: string = 'wealth';

    private clientDataRepository: ClientDataRepository;
    private account: Account = new Account();
    private encrypt: MessageEncrypt;
    private decrypt: MessageDecrypt;
    private signer: MessageSigner;
    private dataRequestManager: DataRequestManager;

    constructor(clientRepository: ClientDataRepository, authAccountBehavior: Observable<Account>,
                encrypt: MessageEncrypt, decrypt: MessageDecrypt, signer: MessageSigner,
                dataRequestManager: DataRequestManager) {
        this.clientDataRepository = clientRepository;

        authAccountBehavior
            .subscribe(this.onChangeAccount.bind(this));

        this.encrypt = encrypt;
        this.decrypt = decrypt;
        this.signer = signer;
        this.dataRequestManager = dataRequestManager;
    }

    public validateEthWallets(key: string, val: string, baseID: string): EthWalletVerificationStatus {
        const result: EthWalletVerificationStatus = new EthWalletVerificationStatus();

        if (key != ProfileManager.DATA_KEY_ETH_WALLETS) {
            result.err = 'The \<key\> is expected to be "' + ProfileManager.DATA_KEY_ETH_WALLETS + '"';
            result.rc = EthWalletVerificationCodes.RC_GENERAL_ERROR;

            return result;
        }

        return baseEthUitls.verifyEthWalletsRecord(baseID, val);
    }

    public async createEthWallets(wallets: EthAddrRecord[], baseID: string): Promise<BaseType.EthWallets> {
        // const walletRecords: Array<BaseType.EthAddrRecord> = [];
        // for (let ethAddrRecordAsString of wallets) {
        //     let ethAddrRecordAsObj: BaseType.EthAddrRecord = JSON.parse(ethAddrRecordAsString);
        //     walletRecords.push(ethAddrRecordAsObj);
        //     // walletRecords.push(new BaseType.EthAddrRecord(address));
        // }
        return await baseEthUitls.createEthWalletsRecordWithSigner(baseID, wallets, this.signer);
    }

    public signMessage(data: any): string {
        return this.signer.signMessage(data);
    }

    public async addEthWealthValidator(validatorPbKey: string) {
        // Alice adds wealth record pointing to Validator's
        const myData: Map<string, string> = await this.getData();
        myData.set(ProfileManager.DATA_KEY_ETH_WEALTH_VALIDATOR, validatorPbKey);
        await this.updateData(myData);

        await this.dataRequestManager.grantAccessForClient(validatorPbKey, [ProfileManager.DATA_KEY_ETH_WALLETS]);
    }

    public async refreshWealthPtr(): Promise<BaseType.EthWealthPtr> {
        const data: Map<string, string> = await this.getData();
        let wealthPtr: BaseType.EthWealthPtr;

        if (data.has(ProfileManager.DATA_KEY_WEALTH)) {
            const wealth: string = data.get(ProfileManager.DATA_KEY_WEALTH) || '';
            wealthPtr = Object.assign(new BaseType.EthWealthPtr(), JSON.parse(wealth));

        } else if (data.has(ProfileManager.DATA_KEY_ETH_WEALTH_VALIDATOR)) {
            const validatorPbKey: string = data.get(ProfileManager.DATA_KEY_ETH_WEALTH_VALIDATOR) || '';

            // Alice reads the wealth record that Validator shared
            const recordsFromValidator = await this.dataRequestManager.getRequests(
                this.account.publicKey,
                validatorPbKey,
                DataRequestState.ACCEPT
            );

            // if validator already did one validation
            if (recordsFromValidator.length > 0) {
                // Alice gets the decryption keys for all records that Validator shared
                const decryptionKeys: Map<string, string> = await this.getAuthorizedEncryptionKeys(
                    validatorPbKey,
                    recordsFromValidator[0].responseData
                );

                // get decryption key for "wealth" record
                const wealthDecKey: string = decryptionKeys.get(this.account.publicKey) || '';

                // Alice adds wealth record pointing to Validator's storage
                wealthPtr = new BaseType.EthWealthPtr(validatorPbKey, wealthDecKey);
                data.set(ProfileManager.DATA_KEY_WEALTH, JSON.stringify(wealthPtr));

                await this.updateData(data);

            } else {
                throw 'validator did not verify anything yet';
            }

        } else {
            throw ProfileManager.DATA_KEY_ETH_WEALTH_VALIDATOR + ' data not exist!';
        }

        return wealthPtr;
    }

    /**
     * Returns decrypted data of the authorized user.
     *
     * @returns {Promise<Map<string, string>>} Map key => value.
     */
    public getData(): Promise<Map<string, string>> {
        return this.getRawData(this.account.publicKey)
            .then(data => this.prepareData(data, false));
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
     * Decrypts accepted personal data {@link DataRequest#responseData} when state is {@link DataRequestState#ACCEPT}.
     * @param {string} recipientPk  Public key of the user that shared the data
     * @param {string} encryptedData encrypted data {@link DataRequest#responseData}.
     *
     * @returns {Promise<Map<string, string>>} Map key => value.
     */
    public getAuthorizedData(recipientPk: string, encryptedData: string): Promise<Map<string, string>> {
        return new Promise<Map<string, string>>(resolve => {
            const strDecrypt = this.decrypt.decryptMessage(recipientPk, encryptedData);
            const jsonDecrypt = JSON.parse(strDecrypt);
            const arrayResponse: Map<string, string> = JsonUtils.jsonToMap(jsonDecrypt);
            const result: Map<string, string> = new Map<string, string>();

            this.getRawData(recipientPk).then((recipientData: Map<string, string>) => {
                arrayResponse.forEach((value: string, key: string) => {
                    if (recipientData.has(key)) {
                        try {
                            const data: string = recipientData.get(key) as string;
                            const decryptedValue: string = CryptoUtils.decryptAes256(data, value);
                            result.set(key, decryptedValue);
                        } catch (e) {
                            console.log('decryption error: ', key, ' => ', recipientData.get(key), e);
                        }
                    }
                });

                resolve(result);
            });
        });
    }

    /**
     * Returns decryption keys for approved personal data {@link DataRequest#responseData} when state is {@link DataRequestState#ACCEPT}.
     * @param {string} recipientPk  Public key of the user that shared the data
     * @param {string} encryptedData encrypted data {@link DataRequest#responseData}.
     *
     * @returns {Promise<Map<string, string>>} Map key => value.
     */
    public getAuthorizedEncryptionKeys(recipientPk: string, encryptedData: string): Promise<Map<string, string>> {
        return new Promise<Map<string, string>>(resolve => {
            const strDecrypt = this.decrypt.decryptMessage(recipientPk, encryptedData);
            const jsonDecrypt = JSON.parse(strDecrypt);
            const arrayResponse: Map<string, string> = JsonUtils.jsonToMap(jsonDecrypt);
            const result: Map<string, string> = new Map<string, string>();

            this.getRawData(recipientPk).then((recipientData: Map<string, string>) => {
                arrayResponse.forEach((value: string, key: string) => {
                    if (recipientData.has(key)) {
                        try {
                            result.set(key, value);
                        } catch (e) {
                            console.log('decryption error: ', key, ' => ', recipientData.get(key), e);
                        }
                    }
                });

                resolve(result);
            });
        });
    }

    /**
     * Encrypts and stores personal data in BASE.
     * @param {Map<string, string>} data not encrypted data e.g. Map {"name": "Adam"} etc.
     *
     * @returns {Promise<Map<string, string>>} Map with encrypted data.
     */
    public updateData(data: Map<string, string>): Promise<Map<string, string>> {
        return this.prepareData(data, true)
            .then(encrypted => this.clientDataRepository.updateData(this.account.publicKey, encrypted));
    }

    private onChangeAccount(account: Account) {
        this.account = account;
    }

    private prepareData(data: Map<string, string>, encrypt: boolean): Promise<Map<string, string>> {
        return new Promise<Map<string, string>>(resolve => {
            const result: Map<string, string> = new Map<string, string>();
            let pass;
            let changedValue;

            data.forEach((value, key) => {
                pass = this.encrypt.generatePasswordForField(key);
                changedValue = encrypt
                    ? CryptoUtils.encryptAes256(value, pass)
                    : CryptoUtils.decryptAes256(value, pass);

                result.set(key.toLowerCase(), changedValue);
            });

            resolve(result);
        });
    }

}
