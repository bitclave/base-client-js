import { MessageData, SignedMessageData } from 'eth-sig-util';

class BaseAddrPair {
    public readonly baseID: string;
    public readonly ethAddr: string;

    constructor(baseID: string, ethAddr: string) {
        this.baseID = baseID;
        this.ethAddr = ethAddr;
    }
}

class StringMessage implements MessageData<string> {
    public readonly data: string;

    public static valueOf(message: MessageData): StringMessage {
        return new StringMessage(JSON.stringify(message.data));
    }

    constructor(data: string) {
        this.data = data;
    }
}

class StringSignedMessage extends StringMessage implements SignedMessageData<string> {
    public readonly sig: string;

    public static valueOf(message: SignedMessageData): StringSignedMessage {
        return new StringSignedMessage(JSON.stringify(message.data), message.sig);
    }

    constructor(data: string, sig: string) {
        super(data);
        this.sig = sig;
    }
}

class AddrRecord implements SignedMessageData<BaseAddrPair> {
    public readonly data: BaseAddrPair;
    public readonly sig: string;

    constructor(data?: BaseAddrPair | string, sig?: string) {
        if (typeof data === 'object') {
            this.data = Object.assign(new BaseAddrPair('', ''), data);

        } else if (typeof data === 'string') {
            this.data = Object.assign(new BaseAddrPair('', ''), JSON.parse(data));

        } else {
            this.data = new BaseAddrPair('', '');
        }

        this.sig = sig || '';
    }

    public getSignedMessage(): StringSignedMessage {
        return StringSignedMessage.valueOf(this);
    }

    public getMessage(): MessageData<string> {
        return this.getSignedMessage();
    }
}

class WalletsRecords {
    public readonly data: Array<AddrRecord>;
    public readonly sig: string;

    public static fromJson(json: string): WalletsRecords {
        const jsonObj: WalletsRecords = JSON.parse(json);
        const items: Array<AddrRecord> =
            jsonObj.hasOwnProperty('data')
            ? jsonObj.data.map((item: AddrRecord) => new AddrRecord(item.data, item.sig))
            : [];
        return new WalletsRecords(items, jsonObj.sig);
    }

    constructor(data: Array<AddrRecord>, sig: string) {
        this.data = data;
        this.sig = sig;
    }

}

class WealthRecord {
    public readonly wealth: string;
    public readonly sig: string;

    constructor(wealth: string, sig: string) {
        this.wealth = wealth;
        this.sig = sig;
    }

}

class WealthPtr {
    public readonly validator: string;
    public readonly decryptKey: string;

    constructor(validator?: string, decryptKey?: string) {
        this.validator = validator || '';
        this.decryptKey = decryptKey || '';
    }

}

class ProfileUser {
    public readonly baseID: string;
    public readonly email: string;
    public readonly wealth: WealthPtr;
    // tslint:disable-next-line:variable-name
    public readonly eth_wallets: WalletsRecords;
}

class ProfileWealthValidator {
    public readonly baseID: string;
    public readonly wealth: Map<string, WealthRecord>;

    constructor(baseID: string, wealth: Map<string, WealthRecord>) {
        this.baseID = baseID;
        this.wealth = wealth;
    }
}

export {
    StringMessage,
    StringSignedMessage,
    BaseAddrPair,
    AddrRecord,
    WalletsRecords,
    WealthRecord,
    WealthPtr,
    ProfileUser,
    ProfileWealthValidator
};
