export interface MessageSigner {

    signMessage(data: string): Promise<string>

    checkSig(data: string, sig: string): Promise<boolean>

    getPublicKey(): string

}
