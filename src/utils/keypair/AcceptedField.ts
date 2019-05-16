import { DeepCopy } from '../../repository/models/DeepCopy';
import { AccessRight } from './Permissions';

export class AcceptedField extends DeepCopy<AcceptedField> {

    public readonly pass: string;
    public readonly access: AccessRight;

    constructor(pass?: string, access?: AccessRight) {
        super(AcceptedField);
        this.pass = pass || '';
        this.access = access || AccessRight.R;
    }
}
