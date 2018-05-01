declare class BaseAddrPair {
    baseID: string;
    ethAddr: string;
    constructor(baseID: string, ethAddr: string);
}
declare class AddrRecord {
    data: string;
    sig: string;
    constructor(data?: string, sig?: string);
}
declare class WalletsRecords {
    data: Array<AddrRecord>;
    sig: string;
    constructor(data: Array<AddrRecord>, sig: string);
}
declare class WealthRecord {
    wealth: string;
    sig: string;
    constructor(wealth: string, sig: string);
}
declare class WealthPtr {
    validator: string;
    decryptKey: string;
    constructor(validator?: string, decryptKey?: string);
}
declare class ProfileUser {
    baseID: string;
    email: string;
    wealth: WealthPtr;
    eth_wallets: WalletsRecords;
}
declare class ProfileWealthValidator {
    baseID: string;
    wealth: Map<string, WealthRecord>;
}
export { BaseAddrPair, AddrRecord, WalletsRecords, WealthRecord, WealthPtr, ProfileUser, ProfileWealthValidator };
