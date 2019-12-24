import { JsonObject } from './JsonObject';
import { JsonTransform } from './JsonTransform';
export interface ClassCreator<T> {
    new (): T;
}
export declare abstract class DeepCopy<T> extends JsonTransform {
    copy(changeArgs?: JsonObject<T>): T;
    protected deepCopyFromJson(): T;
    protected abstract getClass(): ClassCreator<T>;
}
