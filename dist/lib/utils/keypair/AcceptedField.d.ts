import { ClassCreator, DeepCopy } from '../../repository/models/DeepCopy';
import { AccessRight } from './Permissions';
export declare class AcceptedField extends DeepCopy<AcceptedField> {
    readonly pass: string;
    readonly access: AccessRight;
    constructor(pass?: string, access?: AccessRight);
    toJson(): object;
    protected getClass(): ClassCreator<AcceptedField>;
}
