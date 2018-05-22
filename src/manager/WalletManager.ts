import { AddrRecord, WalletsRecords, AddrRecord, WalletsRecords, WealthPtr } from '../utils/types/BaseTypes';

export interface WalletManager {

    createEthWalletsRecords(wallets: AddrRecord[], baseID: string): Promise<WalletsRecords>;
    
    createBtcWalletsRecords(wallets: AddrRecord[], baseID: string): Promise<WalletsRecords>;

    addWealthValidator(validatorPbKey: string): Promise<void>;

    refreshWealthPtr(): Promise<WealthPtr>;

}
