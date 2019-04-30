import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator';
import * as Utils from 'web3-utils';

@ValidatorConstraint({async: false})
export class IsEthAddressConstraint implements ValidatorConstraintInterface {

    public defaultMessage(validationArguments?: ValidationArguments): string {
        return 'must be valid Ethereum address';
    }

    public validate(value: string, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        // https://github.com/typestack/class-validator/issues/309
        if (value.indexOf('0x') !== 0) {
            throw new Error('Ethereum address must be start with 0x');
        }

        if (!Utils.isAddress(value)) {
            throw new Error(this.defaultMessage());
        }
        return true;
    }
}

export function IsEthAddress(validationOptions?: ValidationOptions) {

    return (object: object, propertyName: string) => {
        registerDecorator(
            {
                name: 'IsEthAddress',
                target: object.constructor,
                propertyName: `${propertyName}`,
                constraints: [`${propertyName}`],
                options: validationOptions,
                validator: IsEthAddressConstraint
            }
        );
    };
}
