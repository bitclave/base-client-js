import { EthCryptoWallet, EthWalletData } from '../BaseTypes';
import { AbstractWalletValidator } from './AbstractWalletValidator';
export declare class EthWalletValidator extends AbstractWalletValidator<EthCryptoWallet, EthWalletData> {
    validateSignature(wallet: EthWalletData): boolean;
}
