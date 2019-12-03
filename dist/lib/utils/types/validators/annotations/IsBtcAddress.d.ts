import { ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
export declare class IsBtcConstraint implements ValidatorConstraintInterface {
    defaultMessage(validationArguments?: ValidationArguments): string;
    validate(value: string, validationArguments?: ValidationArguments): Promise<boolean> | boolean;
}
export declare function IsBtcAddress(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
