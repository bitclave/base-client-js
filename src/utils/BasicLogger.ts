export interface Logger {
    error(message: any, ...args: any[]): void;
    info(message: any, ...args: any[]): void;
    debug(message: any, ...args: any[]): void;
}

export class BasicLogger implements Logger {

    error(message: any, ...args: any[]) {
        console.error('[error]' + message, args);
    }
    info(message: any, ...args: any[]) {
        console.log('[info]' + message, args);
    }
    debug(message: any, ...args: any[]) {
        console.log('[debug]' + message, args);
    }
}