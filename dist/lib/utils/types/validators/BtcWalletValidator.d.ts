import { BtcCryptoWallet, BtcWalletData } from '../BaseTypes';
import { AbstractWalletValidator } from './AbstractWalletValidator';
export declare class BtcWalletValidator extends AbstractWalletValidator<BtcCryptoWallet, BtcWalletData> {
    validateSignature(wallet: BtcWalletData): boolean;
}
