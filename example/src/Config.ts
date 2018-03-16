export default class Config {

    private static isDebug: boolean = true;

    public static getBaseEndPoint(): string {
        return this.isDebug ? 'http://localhost:8080' : '';
    }

    public static getSignerEndPoint(): string {
        return this.isDebug ? 'ws://localhost:3545' : '';
    }

}
