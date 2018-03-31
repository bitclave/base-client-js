declare class EthBaseAddrPair {
    baseID: string;
    ethAddr: string;
}
declare class EthAddrRecord {
    data: string;
    sig: string;
}
declare class EthWallets {
    data: EthAddrRecord[];
    sig: string;
}
declare class EthWealthRecord {
    wealth: string;
    sig: string;
}
declare class EthWealthPtr {
    validator: string;
    decryptKey: string;
}
declare class ProfileUser {
    baseID: string;
    email: string;
    wealth: EthWealthPtr;
    eth_wallets: EthWallets;
}
declare class ProfileEthWealthValidator {
    baseID: string;
    wealth: Map<string, EthWealthRecord>;
}
export { EthBaseAddrPair, EthAddrRecord, EthWallets, EthWealthRecord, EthWealthPtr, ProfileUser, ProfileEthWealthValidator };
