declare class BaseAddrPair {
    baseID: string;
    addr: string;
    constructor(baseID: string, addr: string);
}
declare class AddrRecord {
    data: string;
    sig: string;
    constructor(data?: string, sig?: string);
}
declare class EthWallets {
    data: Array<AddrRecord>;
    sig: string;
    constructor(data: Array<AddrRecord>, sig: string);
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
export { BaseAddrPair, AddrRecord, EthWallets, EthWealthRecord, EthWealthPtr, ProfileUser, ProfileEthWealthValidator };
