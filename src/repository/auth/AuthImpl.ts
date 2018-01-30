export default class Auth {

    private transport: HttpTransport;

    constructor(transport: HttpTransport) {
        this.transport = transport;
    }

    signUp(address: string): Promise<any> {
        return this.transport.sendRequest("")
    }

    signIn(): Promise<any> {
        return new Promise((resolve, reject) => {

        });
    }

}
