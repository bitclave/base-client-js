import { AccessRight } from './Permissions';

export class AcceptedField {

    public readonly pass: string;
    public readonly access: AccessRight;

    constructor(pass: string, access: AccessRight) {
        this.pass = pass;
        this.access = access;
    }

}
