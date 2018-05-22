class BaseAddrPair {
    baseID: string;
    addr: string;

    constructor(baseID: string, addr: string) {
        this.baseID = baseID;
        this.addr = addr;
    }

}

class AddrRecord {
    // this must be serialization of BaseAddrPair
    // to make sure this string exactly can be shared with external wallets for signing
    data: string;
    sig: string;

    constructor(data?: string, sig?: string) {
        this.data = data || '';
        this.sig = sig || '';
    }

}

class WalletsRecords {
    data: Array<AddrRecord>;
    sig: string;

    constructor(data: Array<AddrRecord>, sig: string) {
        this.data = data;
        this.sig = sig;
    }

}

class WealthRecord {
    wealth: string;
    sig: string;

    constructor(wealth: string, sig: string) {
        this.wealth = wealth;
        this.sig = sig;
    }

}

class WealthPtr {
    public validator: string;
    public decryptKey: string;

    constructor(validator?: string, decryptKey?: string){
        this.validator = validator || '';
        this.decryptKey = decryptKey || '';
    }

}

class ProfileUser {
    baseID: string;
    email: string;
    wealth: WealthPtr;
    eth_wallets: WalletsRecords;
    btc_wallets: WalletsRecords;
}

class ProfileWealthValidator {
    baseID: string;
    wealth: Map<string, WealthRecord>;
}

export {
    BaseAddrPair,
    AddrRecord,
    WalletsRecords,
    WealthRecord,
    WealthPtr,
    ProfileUser,
    ProfileWealthValidator
};
