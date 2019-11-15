import { MessageData, SignedMessageData } from 'eth-sig-util';
export declare class EthereumUtils {
    static recoverPersonalSignature<T>(data: SignedMessageData<T>): string;
    static createSig<T>(privateKey: string, data: MessageData<T>): string;
}
