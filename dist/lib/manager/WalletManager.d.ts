import { CryptoWallet, CryptoWallets, CryptoWalletsData, SupportSignedMessageData } from '../utils/types/BaseTypes';
import { WalletValidator } from '../utils/types/validators/WalletValidator';
export interface WalletManager {
    createCryptoWalletsData(wallets: CryptoWallets): Promise<CryptoWalletsData>;
    getWalletValidator(): WalletValidator<CryptoWallet, SupportSignedMessageData<CryptoWallet>>;
    addWealthValidator(validatorPbKey: string): Promise<void>;
}
