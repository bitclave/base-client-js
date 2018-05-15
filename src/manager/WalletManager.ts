import { EthAddrRecord, EthWalletsRecords, BtcAddrRecord, BtcWalletsRecords, WealthPtr } from '../utils/types/BaseTypes';

export interface WalletManager {

    createEthWalletsRecords(wallets: EthAddrRecord[], baseID: string): Promise<EthWalletsRecords>;
    
    createBtcWalletsRecords(wallets: BtcAddrRecord[], baseID: string): Promise<BtcWalletsRecords>;

    addWealthValidator(validatorPbKey: string): Promise<void>;

    refreshWealthPtr(): Promise<WealthPtr>;

}
