export interface Logger {
    error(message: string, ...args: Array<object | string | number>): void;
    info(message: string, ...args: Array<object | string | number>): void;
    debug(message: string, ...args: Array<object | string | number>): void;
}
export declare class BasicLogger implements Logger {
    error(message: string, ...args: Array<object | string | number>): void;
    info(message: string, ...args: Array<object | string | number>): void;
    debug(message: string, ...args: Array<object | string | number>): void;
}
