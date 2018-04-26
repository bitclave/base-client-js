export interface NonceSource {

    getNonce(publicKey: string): Promise<number>

}
