const sigUtil = require('eth-sig-util');
const bitcore = require('bitcore-lib');

export class EthereumUtils {

    public static recoverSignerEthereumAddress(data: any): string {
        return sigUtil.recoverPersonalSignature(data);
    }

    public static recoverSignerBitcoinAddress(data: any): string {
        const publicKey = sigUtil.extractPublicKey(data);
        return bitcore.PublicKey.fromString(publicKey).toAddress().toString(16);
    }

    public static createSig(privateKey: string, data: any): string {
        return sigUtil.personalSign(Buffer.from(privateKey, 'hex'), data)
    }

}
