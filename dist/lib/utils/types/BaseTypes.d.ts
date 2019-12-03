import { MessageData, SignedMessageData } from 'eth-sig-util';
import { JsonObject } from '../../repository/models/JsonObject';
import { JsonTransform } from '../../repository/models/JsonTransform';
export declare class StringMessage implements MessageData<string> {
    readonly data: string;
    static valueOf(message: MessageData): StringMessage;
    constructor(data: string);
}
export declare class StringSignedMessage extends StringMessage implements SignedMessageData<string> {
    readonly sig: string;
    static valueOf(message: SignedMessageData): StringSignedMessage;
    private static converter;
    constructor(data: string, sig: string);
}
export declare class SupportSignedMessageData<T> extends JsonTransform {
    data: T;
    sig: string;
    constructor(data: T, sig?: string);
    getSignedMessage(): StringSignedMessage;
    getMessage(): MessageData<string>;
    toJson(): object;
}
export declare class CryptoWallet {
    readonly baseId: string;
    readonly address: string;
    constructor(baseId: string, address: string);
}
export declare class EthCryptoWallet extends CryptoWallet {
    readonly address: string;
    constructor(baseId: string, address: string);
}
export declare class BtcCryptoWallet extends CryptoWallet {
    readonly address: string;
    constructor(baseId: string, address: string);
}
export declare class AppCryptoWallet extends CryptoWallet {
    readonly address: string;
    constructor(baseId: string, address: string);
}
export declare class UsdCryptoWallet extends CryptoWallet {
    readonly address: string;
    constructor(baseId: string, address: string);
}
export declare class CryptoWallets extends JsonTransform {
    readonly eth: Array<EthWalletData>;
    readonly btc: Array<BtcWalletData>;
    readonly app: Array<AppWalletData>;
    readonly usd: Array<UsdWalletData>;
    static fromJson(json: JsonObject<CryptoWallets>): CryptoWallets;
    constructor(eth?: Array<EthWalletData>, btc?: Array<BtcWalletData>, app?: Array<AppWalletData>, usd?: Array<UsdWalletData>);
    toJson(): object;
}
export declare class EthWalletData extends SupportSignedMessageData<EthCryptoWallet> {
    static fromJson(json: JsonObject<EthWalletData>): EthWalletData;
}
export declare class BtcWalletData extends SupportSignedMessageData<BtcCryptoWallet> {
    static fromJson(json: JsonObject<BtcWalletData>): BtcWalletData;
}
export declare class AppWalletData extends SupportSignedMessageData<AppCryptoWallet> {
    static fromJson(json: JsonObject<AppWalletData>): AppWalletData;
}
export declare class UsdWalletData extends SupportSignedMessageData<UsdCryptoWallet> {
    static fromJson(json: JsonObject<UsdWalletData>): UsdWalletData;
}
export declare class CryptoWalletsData extends SupportSignedMessageData<CryptoWallets> {
    static fromJson(json: JsonObject<CryptoWalletsData>): CryptoWalletsData;
}
export declare class ProfileUser {
    readonly baseId: string;
    readonly email: string;
    readonly crypto_wallets: CryptoWalletsData;
}
