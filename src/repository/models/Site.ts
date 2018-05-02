export class Site {

    id: number;
    origin: string;
    publicKey: string;
    confidential: boolean;

    constructor(id: number = 0, origin: string = '', publicKey: string = '', confidential: boolean = false) {
        this.id = id;
        this.origin = origin;
        this.publicKey = publicKey;
        this.confidential = confidential;
    }

}
