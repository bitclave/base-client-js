import { validateSync } from 'class-validator';
import { CryptoWalletsData, StringSignedMessage } from '../BaseTypes';
import { ValidationResult, WalletVerificationCodes } from './ValidationResult';

const Message = require('bitcore-message');
const Bitcore = require('bitcore-lib');

export class WalletsValidator {

    private readonly address: string;

    constructor(baseId: string) {
        this.address = Bitcore.PublicKey(baseId).toAddress().toString(16);
    }

    public validateCryptoWallet(walletsData: CryptoWalletsData): ValidationResult<StringSignedMessage> {
        const result = new ValidationResult(walletsData.getSignedMessage(), [], []);

        try {
            try {
                const validationErrors = validateSync(walletsData);
                if (validationErrors.length > 0) {
                    validationErrors.forEach(value => {
                        result.message.push(`${JSON.stringify(value.constraints)}`);
                    });
                    result.state.push(WalletVerificationCodes.SCHEMA_MISSMATCH);
                }

            } catch (e) {
                result.message.push(e.message);
                result.state.push(WalletVerificationCodes.SCHEMA_MISSMATCH);
            }

            if (walletsData.sig.length > 0) {
                if (!this.validateSignature(walletsData)) {
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

    public validateSignature(wallet: CryptoWalletsData): boolean {
        try {
            return Message(wallet.getMessage().data).verify(this.address, wallet.sig);

        } catch (e) {
            return false;
        }
    }
}
