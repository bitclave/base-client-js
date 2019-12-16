export type JsonObject<T> = {
    -readonly [P in keyof T]: T[P];
};
