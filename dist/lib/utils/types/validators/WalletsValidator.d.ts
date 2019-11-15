import { CryptoWalletsData, StringSignedMessage } from '../BaseTypes';
import { ValidationResult } from './ValidationResult';
export declare class WalletsValidator {
    private readonly address;
    constructor(baseId: string);
    validateCryptoWallet(walletsData: CryptoWalletsData): ValidationResult<StringSignedMessage>;
    validateSignature(wallet: CryptoWalletsData): boolean;
}
