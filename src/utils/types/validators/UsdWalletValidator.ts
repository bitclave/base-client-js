import { CryptoUtils } from '../../CryptoUtils';
import { UsdCryptoWallet, UsdWalletData } from '../BaseTypes';
import { AbstractWalletValidator } from './AbstractWalletValidator';

export class UsdWalletValidator extends AbstractWalletValidator<UsdCryptoWallet, UsdWalletData> {

    public validateSignature(wallet: UsdWalletData): boolean {
        try {
            const sig = CryptoUtils.keccak256(`${wallet.data.baseId}${wallet.data.address}`);

            return wallet.sig === sig;

        } catch (e) {
            return false;
        }
    }
}
