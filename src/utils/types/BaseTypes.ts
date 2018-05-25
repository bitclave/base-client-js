class BaseAddrPair {
    baseID: string;
    addr: string;

    constructor(baseID: string, addr: string) {
        this.baseID = baseID;
        this.addr = addr;
    }

    public isEthereumAddress(): boolean {
        return new RegExp("^(0x[0-9a-fA-F]{40})$").test(this.addr);
    }

    public isBitcoinAddress(): boolean {
        return new RegExp("^([13][123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{25,34})$").test(this.addr);
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

        if (this.data.length > 0 && !this.isEthereumAddress() && !this.isBitcoinAddress()) {
            throw 'invalid data argument neither Ethereum nor Bitcoin address';
        }
    }

    public isEthereumAddress(): boolean {
        return new RegExp("^(0x[0-9a-fA-F]{40})$").test(this.data);
    }

    public isBitcoinAddress(): boolean {
        return new RegExp("^([13][123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{25,34})$").test(this.data);
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
    wallets: WalletsRecords;
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
