export interface MessageSigner {

    signMessage(data: any): string

    getPublicKey(): string

}
