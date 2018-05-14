import { AddrRecord, WalletsRecords, WealthPtr } from '../utils/types/BaseTypes';
import Account from '../repository/models/Account';
import { ProfileManager } from './ProfileManager';
import { DataRequestManager } from './DataRequestManager';
import { BaseSchema } from '../utils/types/BaseSchema';
import { MessageSigner } from '../utils/keypair/MessageSigner';
import DataRequest from '../repository/models/DataRequest';
import { Observable } from 'rxjs/Observable';
import { WalletUtils, WalletVerificationCodes } from '../utils/WalletUtils';
import { AccessRight } from '../utils/keypair/Permissions';
import { WalletManager } from './WalletManager';

export class WalletManagerImpl implements WalletManager {

    public static DATA_KEY_ETH_WALLETS: string = 'eth_wallets';
    public static DATA_KEY_ETH_WEALTH_VALIDATOR: string =  'ethwealthvalidator';
    public static DATA_KEY_WEALTH: string =  'wealth';

    private account: Account = new Account();
    private profileManager: ProfileManager;
    private dataRequestManager: DataRequestManager;
    private baseSchema: BaseSchema;
    private messageSigner: MessageSigner;

    constructor(profileManager: ProfileManager,
                dataRequestManager: DataRequestManager,
                baseSchema: BaseSchema,
                messageSigner: MessageSigner,
                authAccountBehavior: Observable<Account>) {

        this.profileManager = profileManager;
        this.dataRequestManager = dataRequestManager;

        this.baseSchema = baseSchema;
        this.messageSigner = messageSigner;

        authAccountBehavior
            .subscribe(this.onChangeAccount.bind(this));
    }

    public async createWalletsRecords(wallets: AddrRecord[], baseID: string): Promise<WalletsRecords> {
        for (let msg of wallets) {
            if ((WalletUtils.verifyAddressRecord(msg) != WalletVerificationCodes.RC_OK) &&
                (WalletUtils.verifyAddressRecord(msg) != WalletVerificationCodes.RC_ADDR_NOT_VERIFIED)) {
                throw 'invalid eth record: ' + msg;
            }

            if (baseID != JSON.parse(msg.data).baseID) {
                throw 'baseID missmatch';
            }
        }

        const msgWallets: WalletsRecords = new WalletsRecords(wallets, '');

        if (!this.baseSchema.validateWallets(msgWallets)) {
            throw 'invalid wallets structure';
        }

        // eth style signing
        // msgWallets.sig = sigUtil.personalSign(Buffer.from(prvKey, 'hex'), msgWallets);
        // var signerAddr = sigUtil.recoverPersonalSignature(msgWallets)

        // BASE Style signing
        msgWallets.sig = await this.messageSigner.signMessage(JSON.stringify(msgWallets.data));

        return msgWallets;
    }

    public async addWealthValidator(validatorPbKey: string): Promise<void> {
        // Alice adds wealth record pointing to Validator's
        const myData: Map<string, string> = await this.profileManager.getData();
        myData.set(WalletManagerImpl.DATA_KEY_ETH_WEALTH_VALIDATOR, validatorPbKey);

        await this.profileManager.updateData(myData);

        const acceptedFields: Map<string, AccessRight> = new Map();
        acceptedFields.set(WalletManagerImpl.DATA_KEY_ETH_WALLETS, AccessRight.RW);

        await this.dataRequestManager.grantAccessForClient(validatorPbKey, acceptedFields);
    }

    public async refreshWealthPtr(): Promise<WealthPtr> {
        const data: Map<string, string> = await this.profileManager.getData();
        let wealthPtr: WealthPtr;

        if (data.has(WalletManagerImpl.DATA_KEY_WEALTH)) {
            const wealth: string = data.get(WalletManagerImpl.DATA_KEY_WEALTH) || '';
            wealthPtr = Object.assign(new WealthPtr(), JSON.parse(wealth));

        } else if (data.has(WalletManagerImpl.DATA_KEY_ETH_WEALTH_VALIDATOR)) {
            const validatorPbKey: string = data.get(WalletManagerImpl.DATA_KEY_ETH_WEALTH_VALIDATOR) || '';

            // Alice reads the wealth record that Validator shared
            const recordsFromValidator: Array<DataRequest> = await this.dataRequestManager.getRequests(
                this.account.publicKey,
                validatorPbKey
            );

            // if validator already did one validation
            if (recordsFromValidator.length > 0) {
                // Alice gets the decryption keys for all records that Validator shared
                const decryptionKeys: Map<string, string> = await this.profileManager.getAuthorizedEncryptionKeys(
                    validatorPbKey,
                    recordsFromValidator[0].responseData
                );

                // get decryption key for "wealth" record
                const wealthDecKey: string = decryptionKeys.get(this.account.publicKey) || '';

                // Alice adds wealth record pointing to Validator's storage
                wealthPtr = new WealthPtr(validatorPbKey, wealthDecKey);
                data.set(WalletManagerImpl.DATA_KEY_WEALTH, JSON.stringify(wealthPtr));

                await this.profileManager.updateData(data);

            } else {
                throw 'validator did not verify anything yet';
            }

        } else {
            throw WalletManagerImpl.DATA_KEY_ETH_WEALTH_VALIDATOR + ' data not exist!';
        }

        return wealthPtr;
    }

    private onChangeAccount(account: Account) {
        this.account = account;
    }

}
