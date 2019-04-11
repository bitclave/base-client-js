import { JsonObject } from './JsonObject';

export abstract class DeepCopy<T> {
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
        return Object.assign(new this.creator(), JSON.parse(JSON.stringify(this)));
    }
}
