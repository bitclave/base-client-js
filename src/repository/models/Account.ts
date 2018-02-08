export default class Account {

    publicKey: string = '';

    constructor(publicKey: string = '') {
        this.publicKey = publicKey;
    }

    isValid(): boolean {
        return (this.publicKey !== null && this.publicKey.length == 66);
    }

}
