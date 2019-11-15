import { UsdCryptoWallet, UsdWalletData } from '../BaseTypes';
import { AbstractWalletValidator } from './AbstractWalletValidator';
export declare class UsdWalletValidator extends AbstractWalletValidator<UsdCryptoWallet, UsdWalletData> {
    validateSignature(wallet: UsdWalletData): boolean;
}
