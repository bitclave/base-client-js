import { ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
export declare class IsEthAddressConstraint implements ValidatorConstraintInterface {
    defaultMessage(validationArguments?: ValidationArguments): string;
    validate(value: string, validationArguments?: ValidationArguments): Promise<boolean> | boolean;
}
export declare function IsEthAddress(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
