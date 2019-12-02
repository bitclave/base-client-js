import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    Validator,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator';

const validator = new Validator();

export function IsEmailAddress(validationOptions?: ValidationOptions) {

    @ValidatorConstraint({async: false})
    class IsEmailAddressConstraint implements ValidatorConstraintInterface {

        public defaultMessage(validationArguments?: ValidationArguments): string {
            return validationOptions && validationOptions.message
                   ? validationOptions.message.toString()
                   : 'must be valid email address';
        }

        public validate(value: string, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
            // https://github.com/typestack/class-validator/issues/309

            if (!validator.isEmail(value)) {
                throw new Error(this.defaultMessage());
            }
            return true;
        }
    }

    return (object: object, propertyName: string) => {
        registerDecorator(
            {
                name: 'IsEmailAddress',
                target: object.constructor,
                propertyName: `${propertyName}`,
                constraints: [`${propertyName}`],
                options: validationOptions,
                validator: IsEmailAddressConstraint
            }
        );
    };
}
