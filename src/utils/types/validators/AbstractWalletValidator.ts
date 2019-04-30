import { validateSync } from 'class-validator';
import { CryptoWallet, StringSignedMessage, SupportSignedMessageData } from '../BaseTypes';
import { ValidationResult, WalletVerificationCodes } from './ValidationResult';
import { WalletValidator } from './WalletValidator';

export abstract class AbstractWalletValidator<V extends CryptoWallet, T extends SupportSignedMessageData<V>>
    implements WalletValidator<V, T> {

    public validateCryptoWallet(wallet: T): ValidationResult<StringSignedMessage> {
        const result = new ValidationResult(wallet.getSignedMessage(), [], []);

        try {
            try {
                const validationErrors = validateSync(wallet);
                if (validationErrors.length > 0) {
                    validationErrors.forEach(value => {
                        value.children.forEach(error => {
                            result.message.push(`${JSON.stringify(error.constraints)}`);
                        });
                    });
                    result.state.push(WalletVerificationCodes.SCHEMA_MISSMATCH);
                }

            } catch (e) {
                result.message.push(e.message);
                result.state.push(WalletVerificationCodes.SCHEMA_MISSMATCH);
            }

            if (wallet.sig.length > 0) {
                if (!this.validateSignature(wallet)) {
                    result.state.push(WalletVerificationCodes.WRONG_SIGNATURE);
                }
            } else {
                result.state.push(WalletVerificationCodes.ADDRESS_NOT_VERIFIED);
            }

        } catch (e) {
            result.message.push(e.message);
            result.state.push(WalletVerificationCodes.GENERAL_ERROR);
        }

        return result;
    }

    public abstract validateSignature(wallet: T): boolean;
}
