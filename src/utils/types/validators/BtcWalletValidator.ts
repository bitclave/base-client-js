import { BtcCryptoWallet, BtcWalletData } from '../BaseTypes';
import { AbstractWalletValidator } from './AbstractWalletValidator';

const Message = require('bitcore-message');

export class BtcWalletValidator extends AbstractWalletValidator<BtcCryptoWallet, BtcWalletData> {

    public validateSignature(wallet: BtcWalletData): boolean {
        try {
            return Message(wallet.getMessage().data).verify(wallet.data.address, wallet.sig);

        } catch (e) {
            return false;
        }
    }
}
