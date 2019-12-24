import { CryptoWallet, StringSignedMessage, SupportSignedMessageData } from '../BaseTypes';
import { ValidationResult } from './ValidationResult';
import { WalletValidator } from './WalletValidator';
export declare abstract class AbstractWalletValidator<V extends CryptoWallet, T extends SupportSignedMessageData<V>> implements WalletValidator<V, T> {
    validateCryptoWallet(wallet: T): ValidationResult<StringSignedMessage>;
    abstract validateSignature(wallet: T): boolean;
}
