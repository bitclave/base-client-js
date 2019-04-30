import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator';

// tslint:disable-next-line:no-var-requires
const Bitcore = require('bitcore-lib');

@ValidatorConstraint({async: false})
export class IsBtcConstraint implements ValidatorConstraintInterface {

    public defaultMessage(validationArguments?: ValidationArguments): string {
        return 'must be valid Bitcoin address';
    }

    public validate(value: string, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        // https://github.com/typestack/class-validator/issues/309
        if (!Bitcore.Address.isValid(value)) {
            throw new Error(this.defaultMessage());
        }
        return true;
    }
}

export function IsBtcAddress(validationOptions?: ValidationOptions) {

    return (object: object, propertyName: string) => {
        registerDecorator(
            {
                name: 'IsBtcAddress',
                target: object.constructor,
                propertyName: `${propertyName}`,
                constraints: [`${propertyName}`],
                options: validationOptions,
                validator: IsBtcConstraint
            }
        );
    };
}
