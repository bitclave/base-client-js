export default class Config {

    private static isDebug: boolean = true;

    public static getBaseEndPoint(): string {
        return this.isDebug ? 'https://base2-bitclva-com.herokuapp.com' : '';
        // return this.isDebug ? 'https://base-node-staging.herokuapp.com' : '';
        // return this.isDebug ? 'http://localhost:8080' : '';
    }

    public static getSignerEndPoint(): string {
        return this.isDebug ? 'http://localhost:3545' : '';
    }

}
