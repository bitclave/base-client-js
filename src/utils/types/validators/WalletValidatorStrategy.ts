import {
    AppWalletData,
    BtcWalletData,
    CryptoWallet,
    EthWalletData,
    StringSignedMessage,
    SupportSignedMessageData,
    UsdWalletData
} from '../BaseTypes';
import { AppWalletValidator } from './AppWalletValidator';
import { BtcWalletValidator } from './BtcWalletValidator';
import { EthWalletValidator } from './EthWalletValidator';
import { UsdWalletValidator } from './UsdWalletValidator';
import { ValidationResult } from './ValidationResult';
import { WalletValidator } from './WalletValidator';

export class WalletValidatorStrategy implements WalletValidator<CryptoWallet, SupportSignedMessageData<CryptoWallet>> {

    public static readonly VALIDATOR_TYPE_ETH: string = 'ETH';
    public static readonly VALIDATOR_TYPE_BTC: string = 'BTC';
    public static readonly VALIDATOR_TYPE_APP: string = 'APP';
    public static readonly VALIDATOR_TYPE_USD: string = 'USD';

    private readonly validators: Map<string, WalletValidator<CryptoWallet, SupportSignedMessageData<CryptoWallet>>> =
        new Map(
            [
                [WalletValidatorStrategy.VALIDATOR_TYPE_ETH, new EthWalletValidator()],
                [WalletValidatorStrategy.VALIDATOR_TYPE_BTC, new BtcWalletValidator()],
                [WalletValidatorStrategy.VALIDATOR_TYPE_APP, new AppWalletValidator()],
                [WalletValidatorStrategy.VALIDATOR_TYPE_USD, new UsdWalletValidator()]
            ]
        );

    public validateCryptoWallet(
        wallet: SupportSignedMessageData<CryptoWallet>
    ): ValidationResult<StringSignedMessage> {

        const type = this.getType(wallet);
        const validator = this.validators.get(type);
        if (!validator) {
            throw new Error('unsupported type of data');
        }

        return validator.validateCryptoWallet(wallet);
    }

    public validateSignature(wallet: SupportSignedMessageData<CryptoWallet>): boolean {
        const type = this.getType(wallet);
        const validator = this.validators.get(type);
        if (!validator) {
            throw new Error('unsupported type of data');
        }

        return validator.validateSignature(wallet);
    }

    public setValidator(
        type: string,
        validator: WalletValidator<CryptoWallet, SupportSignedMessageData<CryptoWallet>>
    ): boolean {
        if (this.validators.has(type)) {
            return false;
        }

        this.validators.set(type, validator);
        return true;
    }

    public getType(wallet: SupportSignedMessageData<CryptoWallet>): string {
        if (wallet instanceof EthWalletData) {
            return WalletValidatorStrategy.VALIDATOR_TYPE_ETH;

        } else if (wallet instanceof BtcWalletData) {
            return WalletValidatorStrategy.VALIDATOR_TYPE_BTC;

        } else if (wallet instanceof AppWalletData) {
            return WalletValidatorStrategy.VALIDATOR_TYPE_APP;

        } else if (wallet instanceof UsdWalletData) {
            return WalletValidatorStrategy.VALIDATOR_TYPE_USD;

        } else {
            throw new Error('unsupported type of data');
        }
    }
}
