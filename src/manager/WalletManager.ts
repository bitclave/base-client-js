import { AddrRecord, WalletsRecords, WealthPtr } from '../utils/types/BaseTypes';

export interface WalletManager {

    createWalletsRecords(wallets: AddrRecord[], baseID: string): Promise<WalletsRecords>;

    addWealthValidator(validatorPbKey: string): Promise<void>;

    refreshWealthPtr(): Promise<WealthPtr>;

}
