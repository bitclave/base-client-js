export interface MessageSigner {

    signMessage(data: string): Promise<string>

    getPublicKey(): string

}
