import { AccessRight } from './Permissions';

export class AcceptedField {

    pass: string;
    access: AccessRight;

    constructor(pass: string, access: AccessRight) {
        this.pass = pass;
        this.access = access;
    }

}
