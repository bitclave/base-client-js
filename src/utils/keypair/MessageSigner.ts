export interface MessageSigner {

    signMessage(data: any): string

    checkSig(data: any, sig: string): boolean

    getPublicKey(): string

}
