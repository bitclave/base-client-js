export interface Logger {

    error(message: string, ...args: Array<object | string | number>): void;

    info(message: string, ...args: Array<object | string | number>): void;

    debug(message: string, ...args: Array<object | string | number>): void;
}

export class BasicLogger implements Logger {

    public error(message: string, ...args: Array<object | string | number>) {
        console.error('[error]' + message, args);
    }

    public info(message: string, ...args: Array<object | string | number>) {
        console.log('[info]' + message, args);
    }

    public debug(message: string, ...args: Array<object | string | number>) {
        console.log('[debug]' + message, args);
    }
}
