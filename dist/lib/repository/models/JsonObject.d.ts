export interface JsonObject<T> {
    [key: string]: object | string | number | boolean | T | undefined;
}
