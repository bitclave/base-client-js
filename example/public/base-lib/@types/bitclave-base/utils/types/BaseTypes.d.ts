declare class EthBaseAddrPair {
    baseID: string;
    ethAddr: string;
    constructor(baseID: string, ethAddr: string);
}
declare class EthAddrRecord {
    data: string;
    sig: string;
    constructor(data?: string, sig?: string);
}
declare class EthWallets {
    data: Array<EthAddrRecord>;
    sig: string;
    constructor(data: Array<EthAddrRecord>, sig: string);
}
declare class EthWealthRecord {
    wealth: string;
    sig: string;
    constructor(wealth: string, sig: string);
}
declare class EthWealthPtr {
    validator: string;
    decryptKey: string;
    constructor(validator?: string, decryptKey?: string);
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
