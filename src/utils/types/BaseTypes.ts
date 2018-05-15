class EthBaseAddrPair {
    baseID: string;
    ethAddr: string;

    constructor(baseID: string, ethAddr: string) {
        this.baseID = baseID;
        this.ethAddr = ethAddr;
    }

}

class BtcBaseAddrPair {
    baseID: string;
    btcAddr: string;

    constructor(baseID: string, btcAddr: string) {
        this.baseID = baseID;
        this.btcAddr = btcAddr;
    }

}

class EthAddrRecord {
    // this must be serialization of EthBaseAddrPair
    // to make sure this string exactly can be shared with external wallets for signing
    data: string;
    sig: string;

    constructor(data?: string, sig?: string) {
        this.data = data || '';
        this.sig = sig || '';
    }

}

class BtcAddrRecord {
    // this must be serialization of EthBaseAddrPair
    // to make sure this string exactly can be shared with external wallets for signing
    data: string;
    sig: string;

    constructor(data?: string, sig?: string) {
        this.data = data || '';
        this.sig = sig || '';
    }

}

class EthWalletsRecords {
    data: Array<EthAddrRecord>;
    sig: string;

    constructor(data: Array<EthAddrRecord>, sig: string) {
        this.data = data;
        this.sig = sig;
    }

}

class BtcWalletsRecords {
    data: Array<BtcAddrRecord>;
    sig: string;

    constructor(data: Array<BtcAddrRecord>, sig: string) {
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
    eth_wallets: EthWalletsRecords;
    btc_wallets: BtcWalletsRecords;
}

class ProfileWealthValidator {
    baseID: string;
    wealth: Map<string, WealthRecord>;
}

export {
    EthBaseAddrPair,
    EthAddrRecord,
    EthWalletsRecords,
    BtcBaseAddrPair,
    BtcAddrRecord,
    BtcWalletsRecords,
    WealthRecord,
    WealthPtr,
    ProfileUser,
    ProfileWealthValidator
};
