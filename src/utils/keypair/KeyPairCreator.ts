import KeyPair from './KeyPair';

export interface KeyPairCreator {

    createKeyPair(passPhrase: string): KeyPair

}
