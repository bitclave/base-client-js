export declare type JsonObject<T> = {
    -readonly [P in keyof T]: T[P];
};
