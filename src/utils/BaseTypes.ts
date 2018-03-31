
class  EthBaseAddrPair {
    baseID: string;
    ethAddr: string;
}


class EthAddrRecord {
    // this must be serialization of EthBaseAddrPair
    // to make sure this string exactly can be shared with external wallets for signing
    data: string;
    sig: string;
}

class EthWallets {
    data: EthAddrRecord[];
    sig: string;
}

class EthWealthRecord {
    wealth: string;   // wealth
    sig: string;
}

class EthWealthPtr {
    validator: string;
    decryptKey: string;
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
}



