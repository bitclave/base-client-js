import { ValidationOptions } from 'class-validator';
export declare function IsTypedArray(getType: () => any, unique?: boolean, validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
