import { IsEmail, IsJSON, IsString, ValidateNested } from 'class-validator';
import { MessageData, SignedMessageData } from 'eth-sig-util';
import { JsonObject } from '../../repository/models/JsonObject';
import { JsonTransform } from '../../repository/models/JsonTransform';
import { IsBasePublicKey } from './validators/annotations/IsBasePublicKey';
import { IsBtcAddress } from './validators/annotations/IsBtcAddress';
import { IsEthAddress } from './validators/annotations/IsEthAddress';
import { IsTypedArray } from './validators/annotations/IsTypedArray';

export class StringMessage implements MessageData<string> {
    @IsString()
    @IsJSON()
    public readonly data: string;

    public static valueOf(message: MessageData): StringMessage {
        return new StringMessage(JSON.stringify(message.data));
    }

    constructor(data: string) {
        this.data = data;
    }
}

export class StringSignedMessage extends StringMessage implements SignedMessageData<string> {
    @IsString()
    public readonly sig: string;

    public static valueOf(message: SignedMessageData): StringSignedMessage {
        return new StringSignedMessage(StringSignedMessage.converter(message.data), message.sig);
    }

    private static converter<T>(data: T): string {
        if (Array.isArray(data)) {
            return JSON.stringify(data.map(item => this.converter(item)));

        } else if (typeof data === 'string') {
            return data;

        } else if (data instanceof SupportSignedMessageData) {
            return JSON.stringify(data.getMessage());

        } else if (typeof data === 'object') {
            return JSON.stringify(data);

        } else {
            throw new Error(`unsupported data ${data}`);
        }
    }

    constructor(data: string, sig: string) {
        super(data);
        this.sig = sig;
    }
}

export class SupportSignedMessageData<T> implements JsonTransform {
    @ValidateNested()
    public data: T;

    @IsString()
    public sig: string;

    constructor(data: T, sig?: string) {
        this.data = data;
        this.sig = sig || '';
    }

    public getSignedMessage(): StringSignedMessage {
        return StringSignedMessage.valueOf(this);
    }

    public getMessage(): MessageData<string> {
        return this.getSignedMessage();
    }

    public toJson(): object {
        return this;
    }
}

export class CryptoWallet {
    @IsBasePublicKey()
    public readonly baseId: string;

    @IsString()
    public readonly address: string;

    constructor(baseId: string, address: string) {
        this.baseId = baseId;
        this.address = address;
    }
}

export class EthCryptoWallet extends CryptoWallet {
    @IsEthAddress()
    public readonly address: string;

    constructor(baseId: string, address: string) {
        super(baseId, address);
        this.address = address;
    }
}

export class BtcCryptoWallet extends CryptoWallet {
    @IsBtcAddress()
    public readonly address: string;

    constructor(baseId: string, address: string) {
        super(baseId, address);
        this.address = address;
    }
}

export class AppCryptoWallet extends CryptoWallet {
    @IsBasePublicKey({message: 'must be valid Bitclave App address'})
    public readonly address: string;

    constructor(baseId: string, address: string) {
        super(baseId, address);
        this.address = address;
    }
}

export class UsdCryptoWallet extends CryptoWallet {
    @IsEmail()
    public readonly address: string;

    constructor(baseId: string, address: string) {
        super(baseId, address);
        this.address = address;
    }
}

export class CryptoWallets implements JsonTransform {
    @IsTypedArray(() => EthWalletData, true)
    public readonly eth: Array<EthWalletData>;

    @IsTypedArray(() => BtcWalletData, true)
    public readonly btc: Array<BtcWalletData>;

    @IsTypedArray(() => AppWalletData, true)
    public readonly app: Array<AppWalletData>;

    @IsTypedArray(() => UsdWalletData, true)
    public readonly usd: Array<UsdWalletData>;

    public static fromJson(json: JsonObject<CryptoWallets>): CryptoWallets {
        const eth = ((json.eth as Array<JsonObject<EthWalletData>>) || [])
            .map(item => EthWalletData.fromJson(item as JsonObject<EthWalletData>));

        const btc = ((json.btc as Array<JsonObject<BtcWalletData>>) || [])
            .map(item => BtcWalletData.fromJson(item as JsonObject<BtcWalletData>));

        const app = ((json.app as Array<JsonObject<AppWalletData>>) || [])
            .map(item => AppWalletData.fromJson(item as JsonObject<AppWalletData>));

        const usd = ((json.usd as Array<JsonObject<UsdWalletData>>) || [])
            .map(item => UsdWalletData.fromJson(item as JsonObject<UsdWalletData>));

        return new CryptoWallets(eth, btc, app, usd);
    }

    constructor(
        eth?: Array<EthWalletData>,
        btc?: Array<BtcWalletData>,
        app?: Array<AppWalletData>,
        usd?: Array<UsdWalletData>
    ) {
        this.eth = eth || [];
        this.btc = btc || [];
        this.app = app || [];
        this.usd = usd || [];
    }

    public toJson(): object {
        const eth = this.eth.map(item => item.toJson());
        const btc = this.btc.map(item => item.toJson());
        const app = this.app.map(item => item.toJson());
        const usd = this.usd.map(item => item.toJson());

        return {eth, btc, app, usd};
    }
}

export class EthWalletData extends SupportSignedMessageData<EthCryptoWallet> {
    public static fromJson(json: JsonObject<EthWalletData>): EthWalletData {
        return new EthWalletData(Object.assign(new EthCryptoWallet('', ''), json.data), json.sig as string);
    }
}

export class BtcWalletData extends SupportSignedMessageData<BtcCryptoWallet> {
    public static fromJson(json: JsonObject<BtcWalletData>): BtcWalletData {
        return new BtcWalletData(Object.assign(new BtcCryptoWallet('', ''), json.data), json.sig as string);
    }
}

export class AppWalletData extends SupportSignedMessageData<AppCryptoWallet> {
    public static fromJson(json: JsonObject<AppWalletData>): AppWalletData {
        return new AppWalletData(Object.assign(new AppCryptoWallet('', ''), json.data), json.sig as string);
    }
}

export class UsdWalletData extends SupportSignedMessageData<UsdCryptoWallet> {
    public static fromJson(json: JsonObject<UsdWalletData>): UsdWalletData {
        return new UsdWalletData(Object.assign(new UsdCryptoWallet('', ''), json.data), json.sig as string);
    }
}

export class CryptoWalletsData extends SupportSignedMessageData<CryptoWallets> {
    public static fromJson(json: JsonObject<CryptoWalletsData>): CryptoWalletsData {
        return new CryptoWalletsData(
            CryptoWallets.fromJson(json.data as JsonObject<CryptoWallets>),
            json.sig as string
        );
    }
}

export class ProfileUser {
    public readonly baseId: string;
    public readonly email: string;
    // tslint:disable-next-line:variable-name
    public readonly crypto_wallets: CryptoWalletsData; // snake_case because it's a key in data
}
