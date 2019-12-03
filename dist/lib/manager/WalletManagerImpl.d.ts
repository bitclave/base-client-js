import { Observable } from 'rxjs';
import Account from '../repository/models/Account';
import { MessageSigner } from '../utils/keypair/MessageSigner';
import { CryptoWallet, CryptoWallets, CryptoWalletsData, SupportSignedMessageData } from '../utils/types/BaseTypes';
import { WalletValidator } from '../utils/types/validators/WalletValidator';
import { DataRequestManager } from './DataRequestManager';
import { ProfileManager } from './ProfileManager';
import { WalletManager } from './WalletManager';
export declare class WalletManagerImpl implements WalletManager {
    private readonly profileManager;
    private readonly dataRequestManager;
    private readonly walletValidator;
    private readonly messageSigner;
    static DATA_KEY_CRYPTO_WALLETS: string;
    static DATA_KEY_ETH_WEALTH_VALIDATOR: string;
    static DATA_KEY_WEALTH: string;
    private account;
    constructor(profileManager: ProfileManager, dataRequestManager: DataRequestManager, walletValidator: WalletValidator<CryptoWallet, SupportSignedMessageData<CryptoWallet>>, messageSigner: MessageSigner, authAccountBehavior: Observable<Account>);
    createCryptoWalletsData(cryptoWallets: CryptoWallets): Promise<CryptoWalletsData>;
    getWalletValidator(): WalletValidator<CryptoWallet, SupportSignedMessageData<CryptoWallet>>;
    addWealthValidator(validatorPbKey: string): Promise<void>;
    private onChangeAccount;
}
