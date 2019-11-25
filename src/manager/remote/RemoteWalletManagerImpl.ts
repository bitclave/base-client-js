import { RpcTransport } from '../../repository/source/rpc/RpcTransport';
import { CryptoWallet, CryptoWallets, CryptoWalletsData, SupportSignedMessageData } from '../../utils/types/BaseTypes';
import { WalletValidator } from '../../utils/types/validators/WalletValidator';
import { WalletManager } from '../WalletManager';

export class RemoteWalletManagerImpl implements WalletManager {

    constructor(private readonly transport: RpcTransport) {
    }

    public addWealthValidator(validatorPbKey: string): Promise<void> {
        return this.transport.request('addWealthValidator', [validatorPbKey]);
    }

    public createCryptoWalletsData(wallets: CryptoWallets): Promise<CryptoWalletsData> {
        return this.transport.request('createCryptoWalletsData', [wallets.toJson()], CryptoWalletsData);
    }

    public getWalletValidator(): WalletValidator<CryptoWallet, SupportSignedMessageData<CryptoWallet>> {
        throw new Error('not supported method for remote wallet manager');
    }
}
