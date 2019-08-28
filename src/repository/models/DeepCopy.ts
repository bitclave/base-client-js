import { JsonObject } from './JsonObject';
import { JsonTransform } from './JsonTransform';

export interface ClassCreator<T> {
    // tslint:disable-next-line:callable-types
    new(): T;
}

export abstract class DeepCopy<T> extends JsonTransform {

    public copy(changeArgs?: JsonObject<T>): T {
        const copy = this.deepCopyFromJson();
        if (changeArgs) {
            Object.keys(copy)
                .filter((key: string) => changeArgs.hasOwnProperty(key))
                .forEach((key: string) => copy[key] = changeArgs[key]);
        }

        return copy;
    }

    protected deepCopyFromJson(): T {
        return Object.assign(Reflect.construct(this.getClass(), []), this.toJson());
    }

    protected abstract getClass(): ClassCreator<T>;
}
