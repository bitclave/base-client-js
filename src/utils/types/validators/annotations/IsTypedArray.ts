import { registerDecorator, validateSync, ValidationArguments, ValidationOptions } from 'class-validator';

// tslint:disable-next-line:no-any
export function IsTypedArray(getType: () => any, unique?: boolean, validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator(
            {
                name: 'IsTypedArray',
                target: object.constructor,
                propertyName: `${propertyName}`,
                constraints: [`${propertyName}`],
                options: validationOptions,
                validator: {
                    validate(value: object, args: ValidationArguments) {
                        const unqiueJson = new Set<string>();

                        if (!Array.isArray(value)) {
                            throw new Error(`${propertyName} should be Array`);
                        }

                        for (const item of value) {
                            const json = JSON.stringify(item);

                            if (!(item instanceof getType())) {
                                const type = getType().name;
                                throw new Error(`${propertyName} should be type of ${type.toString()}`);
                            }

                            if (unique && unqiueJson.has(json)) {
                                throw new Error(`${propertyName} should be have only unique items`);
                            }
                            unqiueJson.add(json);

                            const errors = validateSync(item);

                            if (errors.length > 0) {
                                throw new Error(
                                    `${JSON.stringify(errors.map(error => `${JSON.stringify(error.constraints)}`))}`
                                );
                            }
                        }

                        return true;
                    }
                }
            }
        );
    };
}
