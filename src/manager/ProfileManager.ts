import { Observable } from 'rxjs/Rx';
import Account from '../repository/models/Account';
import { ClientDataRepository } from '../repository/client/ClientDataRepository';
import CryptoUtils from '../utils/CryptoUtils';
import { MessageEncrypt } from '../utils/keypair/MessageEncrypt';
import JsonUtils from '../utils/JsonUtils';
import { MessageDecrypt } from '../utils/keypair/MessageDecrypt';
import { MessageSigner } from '../utils/keypair/MessageSigner';
import baseEthUitls from '../utils/BaseEthUtils';
import {EthWalletVerificationStatus, EthWalletVerificationCodes} from "../utils/BaseEthUtils";
import * as BaseType from "../../src/utils/BaseTypes";
import {DataRequestState} from "../repository/models/DataRequestState";
import DataRequestManager from "./DataRequestManager";

export default class ProfileManager {

    private clientDataRepository: ClientDataRepository;
    private account: Account = new Account();
    private encrypt: MessageEncrypt;
    private decrypt: MessageDecrypt;
    private signer: MessageSigner;
    private dataRequestManager: DataRequestManager;

    constructor(clientRepository: ClientDataRepository, authAccountBehavior: Observable<Account>,
                encrypt: MessageEncrypt, decrypt: MessageDecrypt, signer: MessageSigner, dataRequestManager: DataRequestManager) {
        this.clientDataRepository = clientRepository;

        authAccountBehavior
            .subscribe(this.onChangeAccount.bind(this));

        this.encrypt = encrypt;
        this.decrypt = decrypt;
        this.signer = signer;
        this.dataRequestManager = dataRequestManager;
    }


    public validateEthWallets(key: string, val: string, baseID: string): EthWalletVerificationStatus {
        var res : EthWalletVerificationStatus = new EthWalletVerificationStatus();

        if (key!="eth_wallets")
        {
            res.err = "The \<key\> is expected to be \"eth_wallets\"";
            res.rc = EthWalletVerificationCodes.RC_GENERAL_ERROR;
            return res;
        }

        res = baseEthUitls.verifyEthWalletsRecord(baseID, val);

        return res;
    }

    public async createEthWallets(wallets: string[], baseID: string): Promise<BaseType.EthWallets> {
        var res : BaseType.EthWallets;

        res = await baseEthUitls.createEthWalletsRecordWithSigner(baseID, wallets, this.signer);

        return res;
    }

    public signMessage(data: any): string
    {
        return this.signer.signMessage(data);
    }

    public async addEthWealthValidator(validatorPbKey: string)
    {
        // Alice adds wealth record pointing to Validator's
        var myData : Map<string, string> = await this.getData();
        myData.set('ethwealthvalidator', validatorPbKey);
        // console.log(myData);
        await this.updateData(myData);

        await this.dataRequestManager.grantAccessForClient(validatorPbKey, ["eth_wallets"]);
    }

    public async refreshWealthPtr() : Promise<BaseType.EthWealthPtr>
    {
        const data : Map<string, string> = await this.getData();
        var wealthPtr: any;

        if (data.has('wealth'))
            wealthPtr = data.get('wealth');
        else if (data.has('ethwealthvalidator'))
        {
            const validatorPbKey : any = data.get('ethwealthvalidator');

            // Alice reads the wealth record that Validator shared
            const recordsFromValidator = await this.dataRequestManager.getRequests(
                this.account.publicKey, validatorPbKey, DataRequestState.ACCEPT
            );

            // if validator already did one validation
            if (recordsFromValidator.length>0) {
                // Alice gets the decryption keys for all records that Validator shared
                const decryptionKeys: Map<string, string> = await this.getAuthorizedEncryptionKeys(
                    validatorPbKey, recordsFromValidator[0].responseData);

                // get decryption key for "wealth" record
                const wealthDecKey: any = decryptionKeys.get(this.account.publicKey);
                // console.log("Alice's wealth decryption key:", wealthDecKey);

                // Alice adds wealth record pointing to Validator's storage
                wealthPtr = {
                    "validator": validatorPbKey,
                    "decryptKey" : wealthDecKey
                };
                data.set("wealth", JSON.stringify(wealthPtr));

                // console.log(myData);
                await this.updateData(data);
            }
            // validator did not verify anything yet
            else
            {
                wealthPtr = undefined;
            }
        }
        else
        {
            wealthPtr = undefined;
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
