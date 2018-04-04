class EthBaseAddrPair {
    baseID: string;
    ethAddr: string;

    constructor(baseID: string, ethAddr: string) {
        this.baseID = baseID;
        this.ethAddr = ethAddr;
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

class EthWallets {
    data: Array<EthAddrRecord>;
    sig: string;

    constructor(data: Array<EthAddrRecord>, sig: string) {
        this.data = data;
        this.sig = sig;
    }

}

class EthWealthRecord {
    wealth: string;
    sig: string;

    constructor(wealth: string, sig: string) {
        this.wealth = wealth;
        this.sig = sig;
    }

}

class EthWealthPtr {
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
    wealth: EthWealthPtr;
    eth_wallets: EthWallets;
}

class ProfileEthWealthValidator {
    baseID: string;
    wealth: Map<string, EthWealthRecord>;
}

export {
    EthBaseAddrPair,
    EthAddrRecord,
    EthWallets,
    EthWealthRecord,
    EthWealthPtr,
    ProfileUser,
    ProfileEthWealthValidator
};
