import { JsonObject } from './JsonObject';
import { JsonTransform } from './JsonTransform';

export abstract class DeepCopy<T> extends JsonTransform {
    // tslint:disable-next-line:callable-types
    private readonly creator: { new(): T; };

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
        return Object.assign(new this.creator(), this.toJson());
    }
}
