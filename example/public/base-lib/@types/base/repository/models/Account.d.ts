export default class Account {
    publicKey: string;
    constructor(publicKey?: string);
    isValid(): boolean;
}
