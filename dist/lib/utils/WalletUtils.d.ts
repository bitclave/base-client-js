import { AppWalletData, BtcWalletData, CryptoWalletsData, EthWalletData, StringSignedMessage, UsdWalletData } from './types/BaseTypes';
import { ValidationResult } from './types/validators/ValidationResult';
import { WalletValidatorStrategy } from './types/validators/WalletValidatorStrategy';
export declare class WalletUtils {
    static readonly WALLET_VALIDATOR: WalletValidatorStrategy;
    static validateWalletsData(baseId: string, cryptoWallets: CryptoWalletsData): Array<ValidationResult<StringSignedMessage>>;
    static createEthereumWalletData(baseId: string, address: string, privateKey: string, validation?: boolean): EthWalletData;
    static createBtcWalletData(baseId: string, address: string, privateKey: string, validation?: boolean): BtcWalletData;
    static createAppWalletData(baseId: string, validation?: boolean): AppWalletData;
    static createUsdWalletData(baseId: string, address: string, validation?: boolean): UsdWalletData;
    private static validateWalletWithThrow;
}
