import { CryptoUtils } from '../../CryptoUtils';
import { AppCryptoWallet, AppWalletData } from '../BaseTypes';
import { AbstractWalletValidator } from './AbstractWalletValidator';

export class AppWalletValidator extends AbstractWalletValidator<AppCryptoWallet, AppWalletData> {

    public validateSignature(wallet: AppWalletData): boolean {
        try {
            const sig = CryptoUtils.keccak256(wallet.data.address);

            return wallet.data.address === wallet.data.baseId && wallet.sig === sig;

        } catch (e) {
            return false;
        }
    }
}
