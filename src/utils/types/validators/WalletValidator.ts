import { CryptoWallet, StringSignedMessage, SupportSignedMessageData } from '../BaseTypes';
import { ValidationResult } from './ValidationResult';

export interface WalletValidator<V extends CryptoWallet, T extends SupportSignedMessageData<V>> {

    validateCryptoWallet(wallet: T): ValidationResult<StringSignedMessage>;

    validateSignature(wallet: T): boolean;
}
