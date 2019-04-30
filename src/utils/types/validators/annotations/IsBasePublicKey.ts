import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

// tslint:disable-next-line:no-var-requires
const Bitcore = require('bitcore-lib');

export function IsBasePublicKey(validationOptions?: ValidationOptions) {

    return (object: object, propertyName: string) => {
        const defaultMessage = 'must be valid Bitclave Base Id';

        registerDecorator(
            {
                name: 'IsBasePublicKey',
                target: object.constructor,
                propertyName: `${propertyName}`,
                constraints: [`${propertyName}`],
                options: validationOptions,
                validator: {
                    validate(value: string, args: ValidationArguments) {
                        if (!Bitcore.PublicKey.isValid(value)) {
                            let message = defaultMessage;
                            if (validationOptions && validationOptions.message) {
                                message = validationOptions.message as string;
                            }

                            throw new Error(message);
                        }

                        return true;
                    }
                }
            }
        );
    };
}
