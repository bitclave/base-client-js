const sigUtil = require('eth-sig-util');

export class EthereumUtils {

    public static recoverPersonalSignature(data: any): string {
        return sigUtil.recoverPersonalSignature(data);
    }

    public static createSig(privateKey: string, data: any): string {
        return sigUtil.personalSign(Buffer.from(privateKey, 'hex'), data)
    }

}
