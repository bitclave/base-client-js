import { CryptoUtils } from './CryptoUtils';
import { EthereumUtils } from './EthereumUtils';
import {
    AppCryptoWallet,
    AppWalletData,
    BtcCryptoWallet,
    BtcWalletData,
    CryptoWallet,
    CryptoWalletsData,
    EthCryptoWallet,
    EthWalletData,
    StringSignedMessage,
    SupportSignedMessageData
} from './types/BaseTypes';
import { ValidationResult } from './types/validators/ValidationResult';
import { WalletsValidator } from './types/validators/WalletsValidator';
import { WalletValidatorStrategy } from './types/validators/WalletValidatorStrategy';

export class WalletUtils {

    public static readonly WALLET_VALIDATOR = new WalletValidatorStrategy();

    public static validateWalletsData(
        baseId: string,
        cryptoWallets: CryptoWalletsData
    ): Array<ValidationResult<StringSignedMessage>> {
        const allWallets = cryptoWallets.data.eth.concat(cryptoWallets.data.app, cryptoWallets.data.btc);
        let result: Array<ValidationResult<StringSignedMessage>> = [];

        allWallets.forEach(wallet => {
            const allErrors = WalletUtils.WALLET_VALIDATOR.validateCryptoWallet(wallet);
            if (allErrors.message.length > 0 || allErrors.state.length > 0) {
                result = result.concat(allErrors);
            }
        });

        const validator = new WalletsValidator(baseId);
        const errors = validator.validateCryptoWallet(cryptoWallets);

        if (errors.state.length > 0 || errors.message.length > 0) {
            result = result.concat(errors);
        }

        return result;
    }

    public static createEthereumWalletData(
        baseId: string,
        address: string,
        privateKey: string,
        validation?: boolean
    ): EthWalletData {
        const record = new EthWalletData(new EthCryptoWallet(baseId, address));
        const walletData = new EthWalletData(record.data, EthereumUtils.createSig(privateKey, record.getMessage()));

        if (validation === undefined || validation) {
            WalletUtils.validateWalletWithThrow(walletData);
        }

        return walletData;
    }

    public static createBtcWalletData(
        baseId: string,
        address: string,
        privateKey: string,
        validation?: boolean
    ): BtcWalletData {
        const record = new BtcWalletData(new BtcCryptoWallet(baseId, address));

        const bitcore = require('bitcore-lib');
        const Message = require('bitcore-message');

        const btcPrivateKey = bitcore.PrivateKey.fromWIF(privateKey);
        const signature = Message(record.getMessage().data).sign(btcPrivateKey);
        const walletData = new BtcWalletData(record.data, signature);

        if (validation === undefined || validation) {
            WalletUtils.validateWalletWithThrow(walletData);
        }

        return walletData;
    }

    public static createAppWalletData(baseId: string, validation?: boolean): AppWalletData {
        const record = new AppWalletData(new AppCryptoWallet(baseId, baseId));
        const walletData = new AppWalletData(record.data, CryptoUtils.keccak256(baseId));

        if (validation === undefined || validation) {
            WalletUtils.validateWalletWithThrow(walletData);
        }

        return walletData;
    }

    private static validateWalletWithThrow<T extends CryptoWallet>(walletData: SupportSignedMessageData<T>) {
        const validation = WalletUtils.WALLET_VALIDATOR.validateCryptoWallet(walletData);

        if (validation.state.length > 0 || validation.message.length > 0) {
            throw new Error(JSON.stringify(validation));
        }
    }
}
