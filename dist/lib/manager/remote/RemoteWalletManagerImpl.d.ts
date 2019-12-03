import { RpcTransport } from '../../repository/source/rpc/RpcTransport';
import { CryptoWallet, CryptoWallets, CryptoWalletsData, SupportSignedMessageData } from '../../utils/types/BaseTypes';
import { WalletValidator } from '../../utils/types/validators/WalletValidator';
import { WalletManager } from '../WalletManager';
export declare class RemoteWalletManagerImpl implements WalletManager {
    private readonly transport;
    constructor(transport: RpcTransport);
    addWealthValidator(validatorPbKey: string): Promise<void>;
    createCryptoWalletsData(wallets: CryptoWallets): Promise<CryptoWalletsData>;
    getWalletValidator(): WalletValidator<CryptoWallet, SupportSignedMessageData<CryptoWallet>>;
}
