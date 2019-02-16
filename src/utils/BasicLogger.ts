export class BasicLogger {

    error(message: any, ...args: any[]) {
        console.error('[error]' + message, args);
    }
    info(message: any, ...args: any[]) {
        console.log('[info]' + message, args);
    }
    debug(message: any, ...args: any[]) {
        console.log('[debug]' + message, args);
    }
    errorClient(message: any, ...args: any[]) {
        console.error(message, args);
    }
    infoClient(message: any, ...args: any[]) {
        console.error(message, args);
    }
    debugClient(message: any, ...args: any[]) {
        console.error(message, args);
    }
}