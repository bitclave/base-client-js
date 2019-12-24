import { CryptoWallet, StringSignedMessage, SupportSignedMessageData } from '../BaseTypes';
import { ValidationResult } from './ValidationResult';
import { WalletValidator } from './WalletValidator';
export declare class WalletValidatorStrategy implements WalletValidator<CryptoWallet, SupportSignedMessageData<CryptoWallet>> {
    static readonly VALIDATOR_TYPE_ETH: string;
    static readonly VALIDATOR_TYPE_BTC: string;
    static readonly VALIDATOR_TYPE_APP: string;
    static readonly VALIDATOR_TYPE_USD: string;
    private readonly validators;
    validateCryptoWallet(wallet: SupportSignedMessageData<CryptoWallet>): ValidationResult<StringSignedMessage>;
    validateSignature(wallet: SupportSignedMessageData<CryptoWallet>): boolean;
    setValidator(type: string, validator: WalletValidator<CryptoWallet, SupportSignedMessageData<CryptoWallet>>): boolean;
    getType(wallet: SupportSignedMessageData<CryptoWallet>): string;
}
