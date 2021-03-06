import { validateSync } from 'class-validator';
import { Observable } from 'rxjs';
import Account from '../repository/models/Account';
import { ExportMethod } from '../utils/ExportMethod';
import { MessageSigner } from '../utils/keypair/MessageSigner';
import { AccessRight } from '../utils/keypair/Permissions';
import { CryptoWallet, CryptoWallets, CryptoWalletsData, SupportSignedMessageData } from '../utils/types/BaseTypes';
import { ParamDeserializer } from '../utils/types/json-transform';
import { WalletValidator } from '../utils/types/validators/WalletValidator';
import { DataRequestManager } from './DataRequestManager';
import { ProfileManager } from './ProfileManager';
import { WalletManager } from './WalletManager';

export class WalletManagerImpl implements WalletManager {

    public static DATA_KEY_CRYPTO_WALLETS: string = 'crypto_wallets';
    public static DATA_KEY_ETH_WEALTH_VALIDATOR: string = 'ethwealthvalidator';
    public static DATA_KEY_WEALTH: string = 'wealth';

    private account: Account = new Account();

    constructor(
        private readonly profileManager: ProfileManager,
        private readonly dataRequestManager: DataRequestManager,
        private readonly walletValidator: WalletValidator<CryptoWallet, SupportSignedMessageData<CryptoWallet>>,
        private readonly messageSigner: MessageSigner,
        authAccountBehavior: Observable<Account>
    ) {
        authAccountBehavior
            .subscribe(this.onChangeAccount.bind(this));
    }

    @ExportMethod()
    public async createCryptoWalletsData(
        @ParamDeserializer(CryptoWallets) cryptoWallets: CryptoWallets
    ): Promise<CryptoWalletsData> {
        const result = new CryptoWalletsData(cryptoWallets, '');
        validateSync(result);

        const allWallets = cryptoWallets.eth.concat(cryptoWallets.app, cryptoWallets.btc, cryptoWallets.usd);

        allWallets.forEach(wallet => {
            const errors = this.walletValidator.validateCryptoWallet(wallet);

            if (errors.state.length > 0 || errors.message.length > 0) {
                throw new Error(`invalid wallet record:  ${JSON.stringify(errors)}`);
            }
            if (wallet.data.baseId !== this.account.publicKey) {
                throw new Error('baseId missmatch');
            }
        });

        const sig: string = await this.messageSigner.signMessage(result.getMessage().data);

        return new CryptoWalletsData(cryptoWallets, sig);
    }

    public getWalletValidator(): WalletValidator<CryptoWallet, SupportSignedMessageData<CryptoWallet>> {
        return this.walletValidator;
    }

    @ExportMethod()
    public async addWealthValidator(validatorPbKey: string): Promise<void> {
        // Alice adds wealth record pointing to Validator's
        const myData: Map<string, string> = await this.profileManager.getData();
        myData.set(WalletManagerImpl.DATA_KEY_ETH_WEALTH_VALIDATOR, validatorPbKey);

        await this.profileManager.updateData(myData);

        const acceptedFields: Map<string, AccessRight> = new Map();
        acceptedFields.set(WalletManagerImpl.DATA_KEY_CRYPTO_WALLETS, AccessRight.RW);

        await this.dataRequestManager.grantAccessForClient(validatorPbKey, acceptedFields);
    }

    private onChangeAccount(account: Account) {
        this.account = account;
    }
}
