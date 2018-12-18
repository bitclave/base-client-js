import { AddrRecord, WalletsRecords, WealthPtr } from '../utils/types/BaseTypes';
import Account from '../repository/models/Account';
import { ProfileManager } from './ProfileManager';
import { DataRequestManager } from './DataRequestManager';
import { BaseSchema } from '../utils/types/BaseSchema';
import { MessageSigner } from '../utils/keypair/MessageSigner';
import { Observable } from 'rxjs/Observable';
import { WalletManager } from './WalletManager';
export declare class WalletManagerImpl implements WalletManager {
    static DATA_KEY_ETH_WALLETS: string;
    static DATA_KEY_ETH_WEALTH_VALIDATOR: string;
    static DATA_KEY_WEALTH: string;
    private account;
    private profileManager;
    private dataRequestManager;
    private baseSchema;
    private messageSigner;
    constructor(profileManager: ProfileManager, dataRequestManager: DataRequestManager, baseSchema: BaseSchema, messageSigner: MessageSigner, authAccountBehavior: Observable<Account>);
    createWalletsRecords(wallets: AddrRecord[], baseID: string): Promise<WalletsRecords>;
    addWealthValidator(validatorPbKey: string): Promise<void>;
    refreshWealthPtr(): Promise<WealthPtr>;
    validateWallets(walletRecords: WalletsRecords): boolean;
    private onChangeAccount;
}
