import * as SigUtil from 'eth-sig-util';
import { MessageData, SignedMessageData } from 'eth-sig-util';

export class EthereumUtils {

    public static recoverPersonalSignature<T>(data: SignedMessageData<T>): string {
        return SigUtil.recoverPersonalSignature(data);
    }

    public static createSig<T>(privateKey: string, data: MessageData<T>): string {
        return SigUtil.personalSign(Buffer.from(privateKey, 'hex'), data);
    }

}
