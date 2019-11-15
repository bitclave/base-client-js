import { AppCryptoWallet, AppWalletData } from '../BaseTypes';
import { AbstractWalletValidator } from './AbstractWalletValidator';
export declare class AppWalletValidator extends AbstractWalletValidator<AppCryptoWallet, AppWalletData> {
    validateSignature(wallet: AppWalletData): boolean;
}
