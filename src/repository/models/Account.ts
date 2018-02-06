export default class Account {

    id: string = '';
    publicKey: string = '';
    hash: string = '';

    constructor(publicKey: string = '', hash: string = '') {
        this.id = '';
        this.publicKey = publicKey;
        this.hash = hash;
    }

    isValid(): boolean {
        return (this.id !== null && this.id.length == 64);
    }

}
